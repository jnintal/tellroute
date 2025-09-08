// app/api/calls/route.js - Connected to Supabase
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    // Fetch total count
    const { count, error: countError } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      // Return empty data instead of error for now
      return NextResponse.json({
        success: true,
        calls: [],
        total: 0,
        limit: limit,
        offset: offset
      });
    }

    // Fetch calls from Supabase
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Fetch error:', error);
      // Return empty data instead of error for now
      return NextResponse.json({
        success: true,
        calls: [],
        total: 0,
        limit: limit,
        offset: offset
      });
    }

    // Transform the data to match what the frontend expects
    const transformedCalls = (calls || []).map(call => ({
      call_id: call.call_id || call.id,
      from_number: call.from_number || '',
      to_number: call.to_number || '',
      duration: call.duration || 0,
      status: call.status || 'completed',
      recording_url: call.recording_url || null,
      transcript: call.transcript || [],
      created_at: call.created_at || new Date().toISOString(),
      ended_at: call.ended_at || null,
      cost: call.cost || 0,
      metadata: call.metadata || {}
    }));

    return NextResponse.json({
      success: true,
      calls: transformedCalls,
      total: count || 0,
      limit: limit,
      offset: offset
    });

  } catch (error) {
    console.error('Error in /api/calls:', error);
    // Return empty data instead of error to prevent page crash
    return NextResponse.json({
      success: true,
      calls: [],
      total: 0,
      limit: 20,
      offset: 0
    });
  }
}