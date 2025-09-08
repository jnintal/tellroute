// app/api/calls/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server'; // Correct import for Clerk

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
    
    console.log('User ID from Clerk:', userId);
    console.log('Fetching calls from Supabase...');
    
    // For now, fetch ALL calls to test
    // Later you can filter by userId when users are properly linked
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
    
    console.log(`Found ${calls?.length || 0} calls`);
    
    // Format calls for the frontend
    const recentCalls = calls?.map(call => ({
      id: call.call_id || call.id,
      date: new Date(call.created_at).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      time: new Date(call.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      duration: formatDuration(call.duration_seconds),
      from: call.from_number,
      to: call.to_number,
      status: call.call_status || 'completed',
      recording: call.recording_url,
      summary: call.summary || 'No summary available'
    })) || [];
    
    // Calculate statistics
    const totalCalls = calls?.length || 0;
    const totalSeconds = calls?.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) || 0;
    const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
    
    return NextResponse.json({
      totalCalls: totalCalls,
      avgDuration: formatDuration(avgSeconds),
      missedCalls: 0,
      recentCalls: recentCalls,
      userId: userId // Include for debugging
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