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
    const clerkUserId = user?.id;
    
    if (!clerkUserId) {
      console.log('No authenticated user found');
      return NextResponse.json({
        totalCalls: 0,
        totalMinutes: 0,
        avgDuration: '0:00',
        missedCalls: 0,
        recentCalls: []
      });
    }
    
    console.log('Fetching calls for user:', clerkUserId);
    
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Fetch calls for this month for the current user
    const { data: monthCalls, error: monthError } = await supabase
      .from('calls')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString())
      .order('created_at', { ascending: false });
    
    if (monthError) {
      console.error('Supabase error fetching month calls:', monthError);
    }
    
    // Fetch recent calls (last 10) for the table
    const { data: recentCallsData, error: recentError } = await supabase
      .from('calls')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.error('Supabase error fetching recent calls:', recentError);
    }
    
    console.log(`Found ${monthCalls?.length || 0} calls this month for user`);
    
    // Format recent calls for display
    const recentCalls = recentCallsData?.map(call => ({
      id: call.call_id || call.id,
      timestamp: call.created_at,
      duration_seconds: call.duration_seconds || call.duration || 0,
      duration: formatDuration(call.duration_seconds || call.duration || 0),
      from: call.from_number,
      to: call.to_number,
      status: call.status || 'completed',
      recording: call.recording_url,
      summary: call.summary || 'No summary available'
    })) || [];
    
    // Calculate statistics for the month
    const totalCalls = monthCalls?.length || 0;
    const totalSeconds = monthCalls?.reduce((sum, call) => {
      const duration = call.duration_seconds || call.duration || 0;
      return sum + duration;
    }, 0) || 0;
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