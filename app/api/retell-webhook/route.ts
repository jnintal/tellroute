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

    // Handle different Retell events
    if (data.event === 'call_started' || data.event === 'call_inbound') {
      console.log('Call started event received');
      const call = data.call || data;
      
      // Look up the user by the Retell phone number (to_number)
      const { data: user } = await supabase
        .from('users')
        .select('clerk_user_id')
        .eq('retell_phone_number', call.to_number || call.to_phone_number)
        .single();
      
      console.log('Found user:', user);
      
      // Store initial call data
      const { error } = await supabase
        .from('calls')
        .upsert({
          call_id: call.call_id,
          clerk_user_id: user?.clerk_user_id || null,
          from_number: call.from_number || call.from_phone_number,
          to_number: call.to_number || call.to_phone_number,
          direction: call.direction || 'inbound',
          status: 'started',
          start_timestamp: call.start_timestamp || Date.now(),
          created_at: new Date(call.start_timestamp || Date.now()).toISOString(),
          metadata: call // Store entire call object for reference
        });
      
      if (error) {
        console.error('Error storing call:', error);
      } else {
        console.log('Call started - stored in database');
      }
      
      return Response.json({ success: true });
    }
    
    if (data.event === 'call_ended') {
      console.log('Call ended event received');
      const call = data.call || data;
      
      // Calculate duration in seconds
      const durationMs = call.duration_ms || (call.end_timestamp - call.start_timestamp) || 0;
      const durationSeconds = Math.floor(durationMs / 1000);
      
      // Update call with end data
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'ended',
          duration: durationSeconds,
          duration_seconds: durationSeconds,
          end_timestamp: call.end_timestamp || Date.now(),
          ended_at: new Date(call.end_timestamp || Date.now()).toISOString(),
          metadata: call // Update with latest call data
        })
        .eq('call_id', call.call_id);
      
      if (error) {
        console.error('Error updating call:', error);
      } else {
        console.log('Call ended - updated duration:', durationSeconds, 'seconds');
      }
      
      return Response.json({ success: true });
    }
    
    if (data.event === 'call_analyzed') {
      console.log('Call analyzed event received');
      const call = data.call || data;
      
      // This event has all the important data
      const durationMs = call.duration_ms || 0;
      const durationSeconds = Math.floor(durationMs / 1000);
      
      // Update call with complete analysis data
      // Extract call_summary from either location based on Retell's format
      const callSummary = call.call_analysis?.call_summary || 
                         call.call_summary || 
                         call.summary || 
                         '';
      
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'completed',
          duration: durationSeconds,
          duration_seconds: durationSeconds,
          summary: callSummary,
          transcript: call.transcript || call.call_analysis?.transcript || {},
          recording_url: call.recording_url || call.recording || '',
          end_timestamp: call.end_timestamp || Date.now(),
          ended_at: new Date(call.end_timestamp || Date.now()).toISOString(),
          metadata: call // Store complete call object with analysis
        })
        .eq('call_id', call.call_id);
      
      if (error) {
        console.error('Error updating call with analysis:', error);
      } else {
        console.log('Call analyzed - stored summary, transcript, and recording');
      }
      
      return Response.json({ success: true });
    }

    // Handle SMS request (send_text function)
    if (data.name === 'send_text' && data.args) {
      console.log('SMS request detected - send_text function called');
      console.log('Message to send:', data.args.body);
      
      // Get the call ID from the request if available
      const callId = data.call?.call_id || data.call_id;
      
      // Get the most recent call or specific call
      let recentCall;
      if (callId) {
        const { data: specificCall } = await supabase
          .from('calls')
          .select('*')
          .eq('call_id', callId)
          .single();
        recentCall = specificCall;
      } else {
        // Fallback to most recent call
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: latestCall } = await supabase
          .from('calls')
          .select('*')
          .gte('created_at', tenMinutesAgo)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        recentCall = latestCall;
      }
      
      if (recentCall && recentCall.from_number) {
        // Clean the phone number
        let cleanedNumber = recentCall.from_number.replace(/[^\d+]/g, '');
        if (!cleanedNumber.startsWith('+')) {
          cleanedNumber = '+1' + cleanedNumber.replace(/^1/, '');
        }
        
        console.log('Sending SMS to:', cleanedNumber);
        
        // Store SMS in queue with clerk_user_id
        await supabase.from('sms_queue').insert({
          call_id: recentCall.call_id,
          clerk_user_id: recentCall.clerk_user_id,
          to_number: cleanedNumber,
          message: data.args.body,
          consent_given: true,
          sent: false,
          created_at: new Date().toISOString()
        });
        
        // Send SMS via your endpoint
        if (!process.env.SECRET_KEY) {
          console.error('SECRET_KEY not configured');
          return Response.json({ success: false, error: 'Server configuration error' });
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.tellroute.com'}/api/send-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            body: data.args.body,
            to: cleanedNumber,
            key: process.env.SECRET_KEY
          })
        });
        
        if (response.ok) {
          // Mark as sent
          await supabase
            .from('sms_queue')
            .update({ sent: true })
            .eq('call_id', recentCall.call_id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          console.log('SMS sent successfully');
          return Response.json({ success: true });
        } else {
          console.error('Failed to send SMS');
          return Response.json({ success: false, error: 'Failed to send SMS' });
        }
      } else {
        console.error('No phone number found');
        return Response.json({ success: false, error: 'No phone number found' });
      }
    }

    // Default response for unhandled events
    console.log('Unhandled event type:', data.event || data.name);
    return Response.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error', details: error }, { status: 500 });
  }
}