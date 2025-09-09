// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for server-side
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log(`Received ${data.event} event from Retell`);

    // Handle different event types
    switch (data.event) {
      case 'call_started':
        console.log('Call started:', data.call_id);
        // Optional: Create a call record
        break;
        
      case 'call_ended':
        console.log('Call ended:', data.call_id);
        // Process any pending SMS for this call
        await processPendingSMS(data.call_id);
        break;
        
      case 'tool_calls':
        console.log('Tool calls received:', data.tool_calls);
        
        // Handle the send_text function call
        if (data.tool_calls && Array.isArray(data.tool_calls)) {
          for (const toolCall of data.tool_calls) {
            if (toolCall.function_name === 'send_text') {
              await handleSendTextRequest(
                data.call_id,
                data.from_number,
                toolCall.arguments
              );
            }
          }
        }
        break;
        
      default:
        console.log('Unknown event type:', data.event);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

async function handleSendTextRequest(callId: string, toNumber: string, args: any) {
  try {
    console.log('Handling send_text request:', { callId, toNumber, args });
    
    // Extract the message body
    const messageBody = args.body || 'Order Pallets from Pallet Company Pro at this link: https://palletcompanypro.com/';
    
    // Clean the phone number
    const cleanedNumber = toNumber.replace(/[^\d+]/g, '');
    
    // Add to SMS queue with consent_given = true
    const { data, error } = await supabase
      .from('sms_queue')
      .insert({
        call_id: callId,
        to_number: cleanedNumber,
        message: messageBody,
        consent_given: true,
        sent: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to queue SMS:', error);
      return { success: false, error: error.message };
    }
    
    console.log('SMS queued successfully:', data.id);
    
    // Immediately try to send the SMS
    await sendQueuedSMS(data.id);
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Failed to handle send_text:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendQueuedSMS(smsId: string) {
  try {
    // Get the SMS from queue
    const { data: sms, error: fetchError } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('id', smsId)
      .single();
    
    if (fetchError || !sms) {
      console.error('SMS not found:', fetchError);
      return;
    }
    
    // Only send if consent was given and not already sent
    if (!sms.consent_given || sms.sent) {
      console.log('SMS not eligible for sending:', { consent_given: sms.consent_given, sent: sms.sent });
      return;
    }
    
    // Call your existing send-text endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: sms.message,
        to: sms.to_number.startsWith('+') ? sms.to_number : `+1${sms.to_number}`,
        key: process.env.SECRET_KEY
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.ok) {
      // Mark as sent
      await supabase
        .from('sms_queue')
        .update({ sent: true })
        .eq('id', smsId);
      
      console.log('SMS sent successfully:', result.sid);
    } else {
      console.error('Failed to send SMS:', result.error);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

async function processPendingSMS(callId: string) {
  try {
    // Get all unsent SMS for this call
    const { data: pendingSMS, error } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('call_id', callId)
      .eq('sent', false)
      .eq('consent_given', true);
    
    if (error) {
      console.error('Error fetching pending SMS:', error);
      return;
    }
    
    // Send each pending SMS
    for (const sms of pendingSMS || []) {
      await sendQueuedSMS(sms.id);
    }
  } catch (error) {
    console.error('Error processing pending SMS:', error);
  }
}