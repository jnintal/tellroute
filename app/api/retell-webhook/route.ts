// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log('Webhook received:', JSON.stringify(data, null, 2));

    // Handle different event types from Retell
    if (data.event === 'tool_calls' && data.tool_calls) {
      for (const toolCall of data.tool_calls) {
        if (toolCall.function_name === 'send_text') {
          const result = await handleSendText(
            data.call_id,
            data.from_number || data.customer_number,
            toolCall.arguments?.body
          );
          return Response.json(result);
        }
      }
    }

    // Handle the tool invocation directly (this is what Retell sends)
    if (data.tool_call_id && data.tool_call) {
      const toolCall = data.tool_call;
      if (toolCall.function_name === 'send_text') {
        const phoneNumber = data.from_number || data.customer_number || data.phone_number;
        const messageBody = toolCall.arguments?.body || 
          "Order Pallets from Pallet Company Pro at https://palletcompanypro.com/";
        
        const result = await handleSendText(
          data.tool_call_id,
          phoneNumber,
          messageBody
        );
        return Response.json(result);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

async function handleSendText(callId: string, toNumber: string, messageBody: string) {
  try {
    console.log('Sending SMS:', { callId, toNumber, messageBody });
    
    if (!toNumber || toNumber === 'your_phone_number') {
      console.error('No valid phone number provided');
      return { error: 'No phone number provided' };
    }

    let cleanedNumber = toNumber.replace(/[^\d+]/g, '');
    if (!cleanedNumber.startsWith('+')) {
      cleanedNumber = '+1' + cleanedNumber;
    }

    const finalMessage = messageBody || 
      "Order Pallets from Pallet Company Pro at https://palletcompanypro.com/";

    // Record in database
    await supabase
      .from('sms_queue')
      .insert({
        call_id: callId,
        to_number: cleanedNumber,
        message: finalMessage,
        consent_given: true,
        sent: false,
        created_at: new Date().toISOString()
      });

    // Send SMS via your endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: finalMessage,
        to: cleanedNumber,
        key: process.env.SECRET_KEY
      })
    });

    const result = await response.json();
    
    // FIX: Check for both 'ok' and 'success' in response
    if (response.ok && (result.ok || result.success)) {
      // Mark as sent in database
      await supabase
        .from('sms_queue')
        .update({ sent: true })
        .eq('call_id', callId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      console.log('SMS sent successfully:', result.sid || result);
      return { success: true, sid: result.sid };
    } else {
      console.error('Failed to send SMS:', result);
      return { error: result.error || 'Failed to send SMS' };
    }
  } catch (error) {
    console.error('Error in handleSendText:', error);
    return { 
      error: 'Failed to send SMS', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
