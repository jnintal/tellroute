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

    // Handle Retell webhook events
    if (data.event === 'tool_calls' && data.tool_calls) {
      console.log('Tool calls event detected');
      
      // Find the send_text function call
      const sendTextCall = data.tool_calls.find((call: any) => 
        call.function_name === 'send_text'
      );
      
      if (sendTextCall) {
        // Extract the actual phone numbers from the call data
        const callerNumber = data.from_phone_number; // Who called (recipient of SMS)
        const retellNumber = data.to_phone_number;   // Which Retell number was called
        const callId = data.call_id;
        
        console.log('SMS Request:', {
          callId,
          callerNumber,
          retellNumber,
          message: sendTextCall.arguments.body
        });
        
        // Send the SMS
        const result = await handleSendText(
          callId,
          callerNumber,
          retellNumber,
          sendTextCall.arguments.body
        );
        
        return Response.json(result);
      }
    }

    // Handle other events (call_started, call_ended, etc.)
    if (data.event === 'call_ended') {
      console.log('Call ended:', data.call_id);
      // You can store call data here if needed
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

async function handleSendText(
  callId: string, 
  toNumber: string, 
  retellNumber: string,
  messageBody: string
) {
  try {
    console.log('Sending SMS:', { callId, toNumber, retellNumber, messageBody });

    // Clean phone number
    let cleanedNumber = toNumber.replace(/[^\d+]/g, '');
    if (!cleanedNumber.startsWith('+')) {
      cleanedNumber = '+1' + cleanedNumber;
    }

    const finalMessage = messageBody || 
      "Order Pallets from Pallet Company Pro at https://palletcompanypro.com/";

    // Find which customer owns this Retell number
    const { data: customer } = await supabase
      .from('users')
      .select('clerk_user_id')
      .eq('retell_phone_number', retellNumber)
      .single();

    // Record in database
    await supabase
      .from('sms_queue')
      .insert({
        call_id: callId,
        clerk_user_id: customer?.clerk_user_id || null,
        to_number: cleanedNumber,
        message: finalMessage,
        consent_given: true,
        sent: false,
        created_at: new Date().toISOString()
      });

    // Send SMS via your Twilio endpoint
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
    
    if (response.ok && (result.ok || result.success)) {
      // Update database to mark as sent
      await supabase
        .from('sms_queue')
        .update({ sent: true })
        .eq('call_id', callId);
      
      console.log('SMS sent successfully');
      return { success: true, message: "SMS sent successfully" };
    } else {
      console.error('Failed to send SMS:', result);
      return { success: false, error: 'Failed to send SMS' };
    }
  } catch (error) {
    console.error('Error in handleSendText:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}