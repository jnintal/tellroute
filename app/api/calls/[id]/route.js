// app/api/calls/[id]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Fetch the specific call from Supabase
    const { data: call, error } = await supabase
      .from('calls')
      .select('*')
      .eq('call_id', id)
      .single();
    
    if (error || !call) {
      console.error('Call not found:', error);
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }
    
    // Return the call data
    return NextResponse.json(call);
    
  } catch (error) {
    console.error('Error fetching call:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}