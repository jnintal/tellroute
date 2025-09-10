import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const isCustomFunction = req.headers.get('x-retell-custom-function') === 'true';
    
    console.log('Webhook received:', {
      isCustomFunction,
      data: JSON.stringify(data, null, 2)
    });

    // Handle Custom Function calls (for sending SMS with your own Twilio)
    if (isCustomFunction && data.body) {
      console.log('Custom function SMS request detected');
      
      // Extract the actual values (not placeholders)
      const callId = data.call_id || 'unknown';
      const fromNumber = data.from_number || data.to; // Caller's number
      const toNumber = data.to_number; // Your Retell number
      const message = data.body;
      
      // Check if we got actual values or placeholders
      if (fromNumber && !fromNumber.includes('{{') && fromNumber !== 'your_phone_number') {
        const result = await sendSMS(callId, fromNumber, toNumber, message);
        return Response.json(result);
      } else {
        console.error('Received placeholders instead of actual values:', data);
        return Response.json({ 
          error: 'Invalid phone number data',
          received: data 
        }, { status: 400 });
      }
    }

    // Handle regular Retell webhook events
    if (data.event === 'call_started') {
      console.log('Call started:', data.call_id);
      // Store call info for reference
      await supabase.from('calls').insert({
        call_id: data.call_id,
        from_number: data.from_phone_number,
        to_number: data.to_phone_number,
        status: 'started',
        created_at: new Date().toISOString()
      });
    }

    if (data.event === 'call_ended') {
      console.log('Call ended:', data.call_id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

async function sendSMS(callId: string, toNumber: string, retellNumber: string, messageBody: string) {
  try {
    // Clean the phone number
    let cleanedNumber = toNumber.replace(/[^\d+]/g, '');
    if (!cleanedNumber.startsWith('+')) {
      cleanedNumber = '+1' + cleanedNumber.replace(/^1/, '');
    }

    const finalMessage = messageBody || 
      "Order Pallets from Pallet Company Pro at https://palletcompanypro.com/";

    console.log('Sending SMS via Twilio:', {
      to: cleanedNumber,
      from: process.env.TWILIO_FROM,
      message: finalMessage
    });

    // Record in database
    await supabase.from('sms_queue').insert({
      call_id: callId,
      to_number: cleanedNumber,
      message: finalMessage,
      consent_given: true,
      sent: false,
      created_at: new Date().toISOString()
    });

    // Send via YOUR Twilio number
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
    
    if (response.ok) {
      await supabase
        .from('sms_queue')
        .update({ sent: true })
        .eq('call_id', callId);
      
      return { success: true, message: "SMS sent successfully" };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('SMS error:', error);
    return { error: 'Failed to send SMS' };
  }
}