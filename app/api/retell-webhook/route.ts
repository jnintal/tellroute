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

    // Handle SMS requests (when only 'body' is present)
    if (data.body && !data.event) {
      console.log('SMS request detected - looking up recent call');
      
      // Get the most recent call (within last 10 minutes)
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
        
        console.log('Sending SMS to:', cleanedNumber);
        
        // Record in database
        await supabase.from('sms_queue').insert({
          call_id: recentCall.call_id,
          to_number: cleanedNumber,
          message: data.body,
          consent_given: true,
          sent: false,
          created_at: new Date().toISOString()
        });
        
        // Send SMS via Twilio
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
        console.log('Twilio response:', result);
        
        if (response.ok) {
          await supabase
            .from('sms_queue')
            .update({ sent: true })
            .eq('call_id', recentCall.call_id);
          
          return Response.json({ success: true });
        } else {
          console.error('Twilio error:', result);
          return Response.json({ error: 'Failed to send SMS' }, { status: 500 });
        }
      } else {
        console.error('No recent call found with phone numbers');
        return Response.json({ error: 'No active call found' }, { status: 400 });
      }
    }

    // Handle regular Retell events
    if (data.event === 'call_started') {
      console.log('Call started - storing in database');
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
      await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          duration: data.duration,
          ended_at: new Date().toISOString()
        })
        .eq('call_id', data.call_id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}