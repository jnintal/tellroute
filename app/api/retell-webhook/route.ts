// app/api/retell-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for server-side
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log(`📍 Received webhook event: ${data.event}`);
    console.log('Full webhook data:', JSON.stringify(data, null, 2));

    // Handle call_started event (optional - just for logging)
    if (data.event === 'call_started') {
      console.log(`📞 Call started: ${data.call_id}`);
      return NextResponse.json({ received: true });
    }

    // Handle call_ended event - main data storage
    if (data.event === 'call_ended') {
      const call = data.call;
      
      // Extract the Retell phone number (the number that received the call)
      const retellPhoneNumber = call.to_number;
      console.log(`📞 Call ended on number: ${retellPhoneNumber}`);
      
      // Find which user owns this Retell phone number
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('clerk_user_id')
        .eq('retell_phone_number', retellPhoneNumber)
        .single();
      
      if (userError || !user) {
        console.error('❌ No user found for phone:', retellPhoneNumber);
        // Still save the call but without user association (orphaned call)
        // You can review these later
      }
      
      // Calculate duration in seconds
      const durationSeconds = call.duration_ms ? Math.round(call.duration_ms / 1000) : 0;
      
      // Prepare call data
      const callData = {
        clerk_user_id: user?.clerk_user_id || null,
        call_id: call.call_id,
        from_number: call.from_number,
        to_number: call.to_number,
        direction: call.direction || 'inbound',
        duration_seconds: durationSeconds,
        transcript: call.transcript || [],
        recording_url: call.recording_url || null,
        summary: null, // Will be updated by call_analyzed event
        start_timestamp: call.start_timestamp,
        end_timestamp: call.end_timestamp,
        created_at: new Date(call.start_timestamp || Date.now()).toISOString()
      };
      
      console.log('💾 Saving call data:', callData);
      
      // Save call to database
      const { error: insertError } = await supabase
        .from('calls')
        .insert(callData);
      
      if (insertError) {
        console.error('❌ Failed to save call:', insertError);
        return NextResponse.json({ error: 'Failed to save call' }, { status: 500 });
      }
      
      console.log('✅ Call saved successfully');
    }

    // Handle call_analyzed event - update with AI summary
    if (data.event === 'call_analyzed') {
      console.log(`🤖 Updating call with AI analysis: ${data.call_id}`);
      
      const { error: updateError } = await supabase
        .from('calls')
        .update({
          summary: data.call_analysis?.call_summary || data.call_analysis?.summary || null,
          // You can add more analysis fields here if needed:
          // user_sentiment: data.call_analysis?.user_sentiment,
          // agent_sentiment: data.call_analysis?.agent_sentiment,
        })
        .eq('call_id', data.call_id);
      
      if (updateError) {
        console.error('❌ Failed to update call analysis:', updateError);
      } else {
        console.log('✅ Call analysis updated');
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}