// app/api/calls/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET() {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    const userId = user?.id;
    
    console.log('Fetching calls from Supabase...');
    
    // Fetch ALL calls from Supabase
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        totalCalls: 0,
        avgDuration: '0:00',
        missedCalls: 0,
        recentCalls: []
      });
    }
    
    console.log(`Found ${calls?.length || 0} calls in database`);
    
    // Send raw timestamps - let frontend handle timezone conversion
    const recentCalls = calls?.map(call => ({
      id: call.call_id || call.id,
      timestamp: call.created_at, // Raw timestamp from database
      duration_seconds: call.duration_seconds,
      duration: formatDuration(call.duration_seconds),
      from: call.from_number,
      to: call.to_number,
      status: call.call_status || 'completed',
      recording: call.recording_url,
      summary: call.summary || call.call_summary || 'No summary available'
    })) || [];
    
    // Calculate statistics
    const totalCalls = calls?.length || 0;
    const totalSeconds = calls?.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) || 0;
    const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
    const totalMinutes = Math.round(totalSeconds / 60);
    
    return NextResponse.json({
      totalCalls: totalCalls,
      totalMinutes: totalMinutes,
      avgDuration: formatDuration(avgSeconds),
      missedCalls: 0,
      recentCalls: recentCalls
    });
    
  } catch (error) {
    console.error('Error in /api/calls:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to format seconds to "MM:SS"
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}