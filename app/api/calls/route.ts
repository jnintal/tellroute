// app/api/calls/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching calls for user:', userId);

    // Get query params for filtering
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all';
    
    // Build the query
    let query = supabase
      .from('calls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Add date filtering if needed
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
    }

    const { data: calls, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
    }

    console.log(`Found ${calls?.length || 0} calls for user ${userId}`);

    // Calculate statistics
    const stats = {
      totalCalls: calls?.length || 0,
      totalDuration: calls?.reduce((sum, call) => sum + (call.duration || 0), 0) || 0,
      avgDuration: calls?.length ? 
        Math.floor((calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length)) 
        : 0,
    };

    return NextResponse.json({ 
      calls: calls || [], 
      stats,
      userId // Include for debugging
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}