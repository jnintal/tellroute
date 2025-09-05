// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log(`📞 Received ${data.event} event for call ${data.call_id}`);

    // Handle different event types
    switch (data.event) {
      case 'call_started':
        console.log('Call started:', data.call_id);
        break;
        
      case 'call_ended':
        // This is the main event with all the call data
        console.log('Processing call_ended event...');
        
        // Determine which phone number to look up
        // For inbound calls: to_number is your Retell number
        // For outbound calls: from_number is your Retell number
        const retellPhoneNumber = data.direction === 'inbound' 
          ? data.to_number 
          : data.from_number;
        
        console.log(`Looking up user for phone: ${retellPhoneNumber}`);
        
        // Find which user owns this phone number
        const { data: phoneData, error: phoneError } = await supabase
          .from('user_phone_numbers')
          .select('user_id, email')
          .eq('phone_number', retellPhoneNumber)
          .eq('is_active', true)
          .single();
        
        if (phoneError) {
          console.log('No user found for this phone number:', phoneError);
        } else {
          console.log(`Found user: ${phoneData.email}`);
        }
        
        // Calculate duration in seconds
        const duration = data.end_timestamp 
          ? Math.floor((data.end_timestamp - data.start_timestamp) / 1000)
          : 0;
        
        // Save the call with the user_id
        const { error: insertError } = await supabase
          .from('calls')
          .insert({
            call_id: data.call_id,
            agent_id: data.agent_id,
            user_id: phoneData?.user_id || null, // Link to the user!
            from_number: data.from_number,
            to_number: data.to_number,
            duration: duration,
            transcript: data.transcript || [],
            recording_url: data.recording_url,
            disconnect_reason: data.disconnection_reason,
            created_at: new Date(data.start_timestamp * 1000).toISOString(),
          });
          
        if (insertError) {
          console.error('❌ Failed to save call:', insertError);
        } else {
          console.log('✅ Call saved successfully with user assignment');
        }
        break;
        
      case 'call_analyzed':
        // Update the call with analysis data
        console.log('Processing call_analyzed event...');
        
        const { error: updateError } = await supabase
          .from('calls')
          .update({
            summary: data.call_analysis?.call_summary,
            sentiment: data.call_analysis?.user_sentiment,
            agent_sentiment: data.call_analysis?.agent_sentiment,
            analysis: data.call_analysis,
          })
          .eq('call_id', data.call_id);
          
        if (updateError) {
          console.error('❌ Failed to update analysis:', updateError);
        } else {
          console.log('✅ Analysis updated successfully');
        }
        break;
        
      default:
        console.log('Unknown event type:', data.event);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}