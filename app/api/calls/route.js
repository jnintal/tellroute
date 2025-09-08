// app/api/calls/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for server-side
);

export async function GET() {
  try {
    // Get the current user from Clerk
    const { userId } = auth();
    
    if (!userId) {
      // If no user is logged in, return mock data or error
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch real calls from Supabase for this user
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50); // Get last 50 calls

    if (error) {
      console.error('Supabase error:', error);
      // Fall back to mock data if there's an error
      return NextResponse.json(mockData);
    }

    // Calculate real statistics from the database
    const totalCalls = calls?.length || 0;
    const totalMinutes = calls?.reduce((sum, call) => 
      sum + Math.ceil((call.duration_seconds || 0) / 60), 0
    ) || 0;
    
    // Format the calls for your frontend
    const formattedCalls = calls?.map(call => ({
      id: call.call_id,
      date: new Date(call.created_at).toLocaleDateString(),
      time: new Date(call.created_at).toLocaleTimeString(),
      duration: formatDuration(call.duration_seconds),
      from: call.from_number,
      to: call.to_number,
      status: call.call_status || 'completed',
      recording: call.recording_url,
      summary: call.summary,
      transcript: call.transcript
    })) || [];

    // Return real data in the same format as your mock data
    return NextResponse.json({
      totalCalls: totalCalls,
      avgDuration: calculateAvgDuration(calls),
      missedCalls: calls?.filter(c => c.call_status === 'missed').length || 0,
      recentCalls: formattedCalls
    });

  } catch (error) {
    console.error('Error in /api/calls:', error);
    
    // Return your existing mock data as fallback
    const mockData = {
      totalCalls: 156,
      avgDuration: '3:45',
      missedCalls: 12,
      recentCalls: [
        // ... your existing mock data
      ]
    };
    
    return NextResponse.json(mockData);
  }
}

// Helper function to format seconds to "MM:SS"
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to calculate average duration
function calculateAvgDuration(calls) {
  if (!calls || calls.length === 0) return '0:00';
  const totalSeconds = calls.reduce((sum, call) => 
    sum + (call.duration_seconds || 0), 0
  );
  const avgSeconds = Math.round(totalSeconds / calls.length);
  return formatDuration(avgSeconds);
}