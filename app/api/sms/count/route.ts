// app/api/sms/count/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch total SMS count
    const { count: totalSMS, error: totalError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Error fetching total SMS:', totalError);
    }

    // Fetch sent messages today
    const { count: sentToday, error: sentError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'outbound')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (sentError) {
      console.error('Error fetching sent SMS:', sentError);
    }

    // Fetch received messages today
    const { count: receivedToday, error: receivedError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'inbound')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (receivedError) {
      console.error('Error fetching received SMS:', receivedError);
    }

    return NextResponse.json({
      totalSMS: totalSMS || 0,
      sentToday: sentToday || 0,
      receivedToday: receivedToday || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in SMS count API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch SMS metrics',
        totalSMS: 0,
        sentToday: 0,
        receivedToday: 0
      },
      { status: 500 }
    );
  }
}