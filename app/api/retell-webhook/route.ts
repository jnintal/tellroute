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
        // This is a Twilio-connected call
        // Phone numbers might be in the headers or we need to parse them differently
        console.log('📍 This is a Twilio call');
        
        // Try to extract from the call transcript or other fields
        // For now, we'll use placeholder numbers
        fromNumber = 'twilio-caller';
        toNumber = '+12133548232'; // Your Retell number from the user_phone_numbers table
      }
      
      // If this is a direct Retell call, numbers might be elsewhere
      if (!fromNumber && call.retell_llm_dynamic_variables) {
        const twilioData = call.retell_llm_dynamic_variables;
        console.log('📍 Twilio dynamic variables:', twilioData);
      }
      
      console.log(`📍 Phone numbers - From: ${fromNumber}, To: ${toNumber}`);
      
      // Try multiple formats to match database
      const retellPhoneNumber = '+12133548232';
      const retellPhoneNumberNoPlus = '12133548232';
      
      console.log(`📍 Looking up user for Retell number: ${retellPhoneNumber}`);
      
      // Find user - try with + first
      let { data: phoneData, error: phoneError } = await supabase
        .from('user_phone_numbers')
        .select('user_id, email')
        .eq('phone_number', retellPhoneNumber)
        .single();
      
      // If failed, try without +
      if (phoneError) {
        console.log('📍 Trying without + sign:', retellPhoneNumberNoPlus);
        const result = await supabase
          .from('user_phone_numbers')
          .select('user_id, email')
          .eq('phone_number', retellPhoneNumberNoPlus)
          .single();
        phoneData = result.data;
        phoneError = result.error;
      }
      
      if (phoneError) {
        console.log('❌ User lookup failed:', phoneError);
      } else {
        console.log(`✅ Found user: ${phoneData.email} (ID: ${phoneData.user_id})`);
      }
      
      // Calculate duration
      const duration = call.duration_ms ? Math.floor(call.duration_ms / 1000) : 0;
      console.log(`📍 Duration: ${duration} seconds`);
      
      // Save the call
      const callRecord = {
        call_id: call.call_id,
        agent_id: call.agent_id,
        user_id: phoneData ? phoneData.user_id : null, // Add null check
        from_number: fromNumber || 'unknown',
        to_number: toNumber || retellPhoneNumber,
        duration: duration,
        transcript: call.transcript_object || null,
        recording_url: null, // Will be updated when available
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