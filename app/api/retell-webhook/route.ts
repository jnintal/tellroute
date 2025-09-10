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

    // HANDLE DIRECT CUSTOM FUNCTION CALLS
    // If the request has 'body' directly, it's from the custom function
    if (data.body && !data.event) {
      console.log('Direct custom function call detected');
      
      // Get caller info from headers or use a default
      const callerId = req.headers.get('x-call-id') || 'direct-' + Date.now();
      const fromNumber = req.headers.get('x-from-number') || '+19299690588'; // Your test number
      
      const result = await handleSendText(
        callerId,
        fromNumber,
        data.body
      );
      
      return Response.json(result);
    }

    // Handle normal Retell webhook events
    if (data.event === 'call_ended') {
      console.log('Call ended:', data.call_id);
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
    
    if (response.ok && (result.ok || result.success)) {
      await supabase
        .from('sms_queue')
        .update({ sent: true })
        .eq('call_id', callId);
      
      console.log('SMS sent successfully');
      return { success: true };
    } else {
      console.error('Failed to send SMS:', result);
      return { error: 'Failed to send SMS' };
    }
  } catch (error) {
    console.error('Error in handleSendText:', error);
    return { error: 'Failed to send SMS' };
  }
}
