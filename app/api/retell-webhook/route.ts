// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // CRITICAL: Log the raw payload to understand structure
    console.log('🔴 RAW WEBHOOK DATA:', JSON.stringify(data));
    
    // Log specific fields we're looking for
    console.log('🔍 Event type:', data.event || 'NO EVENT');
    console.log('🔍 Call object exists?:', !!data.call);
    console.log('🔍 Top-level fields:', Object.keys(data));
    
    // Handle different event types
    if (data.event === 'call_started') {
      console.log('📞 Call started - call_id:', data.call_id || 'NO ID');
      return Response.json({ received: true });
    }
    
    if (data.event === 'call_ended') {
      console.log('📞 Processing call_ended event...');
      console.log('🔍 Call data structure:', JSON.stringify(data.call || {}, null, 2));
      
      // Get phone numbers - they might be nested in data.call
      const callData = data.call || data;
      const toNumber = callData.to_phone_number || callData.to || data.to_phone_number || data.to;
      const fromNumber = callData.from_phone_number || callData.from || data.from_phone_number || data.from;
      
      console.log(`📍 Extracted numbers - From: ${fromNumber}, To: ${toNumber}`);
      
      if (!toNumber && !fromNumber) {
        console.log('❌ No phone numbers found in webhook data');
        return Response.json({ error: 'No phone numbers in payload' }, { status: 400 });
      }
      
      // For inbound calls, the Retell number is the "to" number
      const retellPhoneNumber = toNumber; // Your Retell number that received the call
      
      console.log(`📍 Looking up user for Retell number: ${retellPhoneNumber}`);
      
      // Find user - make sure phone format matches
      const { data: phoneData, error: phoneError } = await supabase
        .from('user_phone_numbers')
        .select('user_id, email')
        .eq('phone_number', retellPhoneNumber)
        .single();
      
      if (phoneError) {
        console.log('❌ User lookup failed:', phoneError);
        // Try without country code if it failed
        if (retellPhoneNumber?.startsWith('+1')) {
          const withoutCode = retellPhoneNumber.substring(2);
          console.log('🔄 Trying without country code:', withoutCode);
          const { data: retryData } = await supabase
            .from('user_phone_numbers')
            .select('user_id, email')
            .eq('phone_number', withoutCode)
            .single();
          if (retryData) {
            console.log('✅ Found user with modified number');
          }
        }
      } else {
        console.log(`✅ Found user: ${phoneData.email}`);
      }
      
      // Get timestamps - handle both seconds and milliseconds
      let startTime = callData.start_timestamp || data.start_timestamp;
      let endTime = callData.end_timestamp || data.end_timestamp;
      
      // If timestamps are in seconds (less than 10 billion), convert to milliseconds
      if (startTime && startTime < 10000000000) {
        startTime = startTime * 1000;
      }
      if (endTime && endTime < 10000000000) {
        endTime = endTime * 1000;
      }
      
      const duration = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;
      
      console.log(`📍 Timestamps - Start: ${startTime}, End: ${endTime}, Duration: ${duration}s`);
      
      // Save the call
      const callRecord = {
        call_id: data.call_id || callData.call_id || `call_${Date.now()}`,
        agent_id: data.agent_id || callData.agent_id || null,
        user_id: phoneData?.user_id || null,
        from_number: fromNumber || 'unknown',
        to_number: toNumber || 'unknown',
        duration: duration,
        transcript: callData.transcript || data.transcript || null,
        recording_url: callData.recording_url || data.recording_url || null,
        disconnect_reason: callData.disconnection_reason || data.disconnection_reason || null,
        created_at: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
      };
      
      console.log('📍 Saving call record:', JSON.stringify(callRecord, null, 2));
      
      const { error: insertError } = await supabase
        .from('calls')
        .insert(callRecord);
      
      if (insertError) {
        console.error('❌ Database error:', insertError);
        return Response.json({ error: 'Failed to save call' }, { status: 500 });
      }
      
      console.log('✅ Call saved successfully!');
      return Response.json({ received: true, saved: true });
    }
    
    if (data.event === 'call_analyzed') {
      console.log('📊 Call analyzed event - updating analysis...');
      // Update existing call with analysis
      const { error } = await supabase
        .from('calls')
        .update({
          summary: data.call_analysis?.call_summary,
          sentiment: data.call_analysis?.user_sentiment,
          analysis: data.call_analysis,
        })
        .eq('call_id', data.call_id);
      
      if (error) {
        console.error('❌ Failed to update analysis:', error);
      } else {
        console.log('✅ Analysis updated successfully');
      }
      return Response.json({ received: true });
    }
    
    console.log('❓ Unknown event type:', data.event);
    return Response.json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}