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

    // Check if this is an SMS request (has 'body' field from custom function)
    if (data.body && !data.event && !data.call) {
      console.log('SMS request detected - body field found');
      console.log('Message to send:', data.body);
      
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
        console.error('Database error:', error);
        return Response.json({ error: 'Could not find recent call' }, { status: 400 });
      }
      
      console.log('Recent call found:', {
        call_id: recentCall?.call_id,
        from: recentCall?.from_number,
        to: recentCall?.to_number
      });
      
      if (recentCall && recentCall.from_number) {
        // Clean the phone number
        let cleanedNumber = recentCall.from_number.replace(/[^\d+]/g, '');
        if (!cleanedNumber.startsWith('+')) {
          cleanedNumber = '+1' + cleanedNumber.replace(/^1/, '');
        }
        
        console.log('Cleaned phone number:', cleanedNumber);
        
        // Call the send-text endpoint DIRECTLY using fetch
        const smsPayload = {
          body: data.body,
          to: cleanedNumber,
          key: process.env.SECRET_KEY || 'your_secret_key' // Use actual key or fallback
        };
        
        console.log('Calling /api/send-text with:', smsPayload);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.tellroute.com'}/api/send-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(smsPayload)
        });
        
        const result = await response.text();
        console.log('SMS API Response Status:', response.status);
        console.log('SMS API Response Body:', result);
        
        if (response.ok) {
          console.log('SMS sent successfully!');
          return Response.json({ success: true });
        } else {
          console.error('SMS API failed:', result);
          return Response.json({ error: 'Failed to send SMS', details: result }, { status: 500 });
        }
      } else {
        console.error('No phone number in recent call');
        return Response.json({ error: 'No phone number found' }, { status: 400 });
      }
    }

    // Handle regular Retell events
    if (data.event === 'call_inbound' || data.event === 'call_started') {
      console.log('Call started - storing in database');
      const callData = data.call || data.call_inbound || data;
      
      await supabase.from('calls').upsert({
        call_id: callData.call_id || `temp_${Date.now()}`,
        from_number: callData.from_number,
        to_number: callData.to_number,
        status: 'started',
        created_at: new Date().toISOString()
      });
    }

    if (data.event === 'call_ended') {
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