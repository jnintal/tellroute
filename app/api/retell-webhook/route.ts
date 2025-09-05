import { NextRequest } from 'next/server';

// Define the Retell webhook types
interface RetellCallData {
  call_id: string;
  agent_id: string;
  from_number: string;
  to_number: string;
  direction: 'inbound' | 'outbound';
  call_status: 'ongoing' | 'ended' | 'error';
  start_timestamp: number;
  end_timestamp?: number;
  duration_seconds?: number;
  recording_url?: string;
  transcript?: Array<{
    speaker: 'agent' | 'user';
    text: string;
    timestamp: number;
  }>;
  call_analysis?: {
    summary: string;
    sentiment: string;
    action_items: string[];
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook is from Retell (you'll need to add a secret)
    const retellSignature = req.headers.get('x-retell-signature');
    if (retellSignature !== process.env.RETELL_WEBHOOK_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: RetellCallData = await req.json();
    
    // Store in your database (example with Supabase)
    // const { error } = await supabase
    //   .from('calls')
    //   .insert({
    //     call_id: data.call_id,
    //     agent_id: data.agent_id,
    //     from_number: data.from_number,
    //     duration: data.duration_seconds,
    //     recording_url: data.recording_url,
    //     transcript: data.transcript,
    //     summary: data.call_analysis?.summary,
    //     created_at: new Date(data.start_timestamp * 1000),
    //   });

    // For now, just log it
    console.log('Received call data:', data);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}