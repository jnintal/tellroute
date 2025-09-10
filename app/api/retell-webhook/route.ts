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
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    // Check if this is an SMS request - look for 'body' field in the data
    // This happens when custom function is called
    if (data.body && !data.event && !data.call) {
      console.log('SMS request detected - body field found');
      
      // Get the most recent call from the last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentCall, error } = await supabase
        .from('calls')
        .select('*')
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching recent call:', error);
        return Response.json({ error: 'Could not find recent call' }, { status: 400 });
      }
      
      if (recentCall && recentCall.from_number) {
        console.log('Found recent call:', {
          call_id: recentCall.call_id,
          from: recentCall.from_number,
          to: recentCall.to_number
        });
        
        // Clean the phone number
        let cleanedNumber = recentCall.from_number.replace(/[^\d+]/g, '');
        if (!cleanedNumber.startsWith('+')) {
          cleanedNumber = '+1' + cleanedNumber.replace(/^1/, '');
        }
        
        console.log('Preparing to send SMS to:', cleanedNumber);
        console.log('Message:', data.body);
        
        // Record in database FIRST
        const { error: insertError } = await supabase.from('sms_queue').insert({
          call_id: recentCall.call_id,
          to_number: cleanedNumber,
          message: data.body,
          consent_given: true,
          sent: false,
          created_at: new Date().toISOString()
        });
        
        if (insertError) {
          console.error('Error inserting to sms_queue:', insertError);
        }
        
        // Send SMS via Twilio
        console.log('Calling send-text API...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            body: data.body,
            to: cleanedNumber,
            key: process.env.SECRET_KEY
          })
        });
        
        const result = await response.json();
        console.log('Twilio API response:', result);
        
        if (response.ok && (result.ok || result.success)) {
          await supabase
            .from('sms_queue')
            .update({ sent: true })
            .eq('call_id', recentCall.call_id);
          
          console.log('SMS sent successfully!');
          return Response.json({ success: true });
        } else {
          console.error('Twilio API error:', result);
          return Response.json({ error: 'Failed to send SMS', details: result }, { status: 500 });
        }
      } else {
        console.error('No recent call found');
        return Response.json({ error: 'No active call found' }, { status: 400 });
      }
    }

    // Handle regular Retell events
    if (data.event === 'call_inbound' || data.event === 'call_started') {
      console.log('Call started - storing in database');
      const callData = data.call || data;
      
      await supabase.from('calls').upsert({
        call_id: callData.call_id,
        from_number: callData.from_number || data.from_phone_number,
        to_number: callData.to_number || data.to_phone_number,
        status: 'started',
        created_at: new Date().toISOString()
      });
    }

    if (data.event === 'call_ended' || data.event === 'call_analyzed') {
      console.log('Call ended');
      const callData = data.call || data;
      
      await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          duration: callData.duration_ms,
          ended_at: new Date().toISOString()
        })
        .eq('call_id', callData.call_id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error', details: error }, { status: 500 });
  }
}