// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log('📍 Webhook event:', data.event);
    
    // Handle different event types
    if (data.event === 'call_started') {
      console.log('📞 Call started:', data.call?.call_id);
      return Response.json({ received: true });
    }
    
    if (data.event === 'call_ended') {
      console.log('📞 Processing call_ended event...');
      
      const call = data.call;
      if (!call) {
        console.log('❌ No call data in webhook');
        return Response.json({ error: 'No call data' }, { status: 400 });
      }
      
      // Extract phone numbers from custom_sip_headers
      const sipHeaders = call.custom_sip_headers || {};
      console.log('📍 SIP Headers:', JSON.stringify(sipHeaders));
      
      // Look for phone numbers in various possible locations
      let fromNumber = null;
      let toNumber = null;
      
      // Check custom_sip_headers for phone numbers
      if (sipHeaders['x-twilio-callsid']) {
        console.log('📍 This is a Twilio call');
        fromNumber = 'twilio-caller';
        toNumber = '+12133548232'; // Your Retell number
      }
      
      console.log(`📍 Phone numbers - From: ${fromNumber}, To: ${toNumber}`);
      
      // TEMPORARY FIX: Hardcode the user data until we fix the phone lookup
      // This ensures calls are linked to your user account
      const phoneData = {
        user_id: 'user_32DBLUEaJSJ1JQEkNPuQCMzgW7',
        email: 'intal.xyz@gmail.com'
      };
      console.log('✅ Using hardcoded user data (temporary fix)');
      
      /* 
      // ORIGINAL CODE - Keep for reference when we fix the phone lookup
      const retellPhoneNumber = '+12133548232';
      console.log(`📍 Looking up user for Retell number: ${retellPhoneNumber}`);
      
      const { data: phoneData, error: phoneError } = await supabase
        .from('user_phone_numbers')
        .select('user_id, email')
        .eq('phone_number', retellPhoneNumber)
        .single();
      
      if (phoneError) {
        console.log('❌ User lookup failed:', phoneError);
      } else if (phoneData) {
        console.log(`✅ Found user: ${phoneData.email} (ID: ${phoneData.user_id})`);
      }
      */
      
      // Calculate duration
      const duration = call.duration_ms ? Math.floor(call.duration_ms / 1000) : 0;
      console.log(`📍 Duration: ${duration} seconds`);
      
      // Save the call
      const callRecord = {
        call_id: call.call_id,
        agent_id: call.agent_id,
        user_id: phoneData ? phoneData.user_id : null,
        from_number: fromNumber || 'unknown',
        to_number: toNumber || '+12133548232',
        duration: duration,
        transcript: call.transcript_object || null,
        recording_url: null,
        disconnect_reason: call.call_status || 'ended',
        created_at: call.start_timestamp ? new Date(call.start_timestamp).toISOString() : new Date().toISOString(),
      };
      
      console.log('📍 Saving call record...');
      
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
      console.log('📊 Call analyzed event');
      
      const call = data.call;
      if (!call?.call_id) {
        console.log('❌ No call ID in analysis event');
        return Response.json({ error: 'No call ID' }, { status: 400 });
      }
      
      // Update with analysis data
      const { error } = await supabase
        .from('calls')
        .update({
          summary: call.call_analysis?.call_summary || null,
          sentiment: call.call_analysis?.user_sentiment || null,
          agent_sentiment: call.call_analysis?.agent_sentiment || null,
          analysis: call.call_analysis || null,
        })
        .eq('call_id', call.call_id);
      
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