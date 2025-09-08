// app/api/calls/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

// Check if environment variables are set
console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Service Key exists:', !!process.env.SUPABASE_SERVICE_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function GET() {
  try {
    console.log('API /calls route called');
    
    // Get the current user from Clerk
    const { userId } = auth();
    console.log('Clerk userId:', userId);
    
    // Fetch ALL calls to test the connection
    console.log('Attempting to fetch from Supabase...');
    
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    console.log('Supabase response - Error:', error);
    console.log('Supabase response - Data count:', calls?.length || 0);
    
    if (error) {
      console.error('Supabase error details:', error);
      // Return empty data instead of mock
      return NextResponse.json({
        totalCalls: 0,
        avgDuration: '0:00',
        missedCalls: 0,
        recentCalls: [],
        debug: {
          error: error.message,
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
        }
      });
    }
    
    // If no data, return empty
    if (!calls || calls.length === 0) {
      console.log('No calls found in database');
      return NextResponse.json({
        totalCalls: 0,
        avgDuration: '0:00',
        missedCalls: 0,
        recentCalls: [],
        debug: 'No calls in database'
      });
    }
    
    console.log('Processing calls data...');
    
    // Format calls for the frontend
    const recentCalls = calls.map(call => ({
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
    }));
    
    // Calculate statistics
    const totalCalls = calls.length;
    const totalSeconds = calls.reduce((sum, call) => sum + (call.duration_seconds || 0), 0);
    const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
    
    const response = {
      totalCalls: totalCalls,
      avgDuration: formatDuration(avgSeconds),
      missedCalls: 0,
      recentCalls: recentCalls,
      debug: 'Success - found ' + totalCalls + ' calls'
    };
    
    console.log('Returning response with', recentCalls.length, 'calls');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in /api/calls:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error.message 
      },
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