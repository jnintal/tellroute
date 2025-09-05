// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log(`Received ${data.event} event for call ${data.call_id}`);

    // Handle different event types
    switch (data.event) {
      case 'call_started':
        // Log that a call started (optional)
        console.log('Call started:', data.call_id);
        break;
        
      case 'call_ended':
        // This is the main event with all the data
        const { error } = await supabase
          .from('calls')
          .insert({
            call_id: data.call_id,
            agent_id: data.agent_id,
            from_number: data.from_number,
            to_number: data.to_number,
            duration: data.call.end_timestamp - data.call.start_timestamp,
            transcript: data.call.transcript,
            recording_url: data.call.recording_url,
            disconnect_reason: data.call.disconnection_reason,
            created_at: new Date(data.call.start_timestamp),
          });
          
        if (error) {
          console.error('Failed to save call:', error);
        } else {
          console.log('Call saved successfully');
        }
        break;
        
      case 'call_analyzed':
        // Update the call with analysis data
        const { error: updateError } = await supabase
          .from('calls')
          .update({
            summary: data.call_analysis.call_summary,
            sentiment: data.call_analysis.user_sentiment,
            agent_sentiment: data.call_analysis.agent_sentiment,
            analysis: data.call_analysis,
          })
          .eq('call_id', data.call_id);
          
        if (updateError) {
          console.error('Failed to update analysis:', updateError);
        }
        break;
        
      default:
        console.log('Unknown event type:', data.event);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}