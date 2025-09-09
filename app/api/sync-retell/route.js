// app/api/sync-retell/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Single call sync function
async function syncSingleCall(callId) {
  try {
    // Fetch call details from Retell API
    const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch call ${callId} from Retell`);
      return { success: false, callId, error: 'Retell API error' };
    }
    
    const callData = await response.json();
    
    // Prepare update data
    const updateData = {};
    
    // Update summary if available
    if (callData.call_analysis?.call_summary) {
      updateData.summary = callData.call_analysis.call_summary;
    }
    
    // Update transcript if available and not already saved
    if (callData.transcript || callData.transcript_object) {
      updateData.transcript = callData.transcript || callData.transcript_object;
    }
    
    // Update duration if needed
    if (callData.call?.duration_ms) {
      updateData.duration_seconds = Math.round(callData.call.duration_ms / 1000);
    }
    
    // Only update if there's data to update
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('calls')
        .update(updateData)
        .eq('call_id', callId);
      
      if (error) {
        console.error(`Failed to update call ${callId}:`, error);
        return { success: false, callId, error: error.message };
      }
      
      return { success: true, callId, updated: true };
    }
    
    return { success: true, callId, updated: false };
    
  } catch (error) {
    console.error(`Error syncing call ${callId}:`, error);
    return { success: false, callId, error: error.message };
  }
}

// GET request - sync all calls missing summaries
export async function GET(req) {
  try {
    console.log('Starting batch sync with Retell...');
    
    // Get all calls without summaries (or with NULL summaries)
    const { data: calls, error: fetchError } = await supabase
      .from('calls')
      .select('call_id, created_at')
      .is('summary', null)
      .order('created_at', { ascending: false })
      .limit(50); // Process max 50 at a time to avoid timeouts
    
    if (fetchError) {
      console.error('Failed to fetch calls:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
    }
    
    if (!calls || calls.length === 0) {
      return NextResponse.json({ 
        message: 'No calls need syncing',
        synced: 0 
      });
    }
    
    console.log(`Found ${calls.length} calls to sync`);
    
    // Process calls in batches of 5 to avoid rate limiting
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < calls.length; i += batchSize) {
      const batch = calls.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(call => syncSingleCall(call.call_id));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < calls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Count successful updates
    const successCount = results.filter(r => r.success && r.updated).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`Sync complete: ${successCount} updated, ${failureCount} failed`);
    
    return NextResponse.json({
      message: 'Batch sync completed',
      total: calls.length,
      synced: successCount,
      failed: failureCount,
      results: results
    });
    
  } catch (error) {
    console.error('Batch sync error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during batch sync' 
    }, { status: 500 });
  }
}

// POST request - sync specific call
export async function POST(req) {
  try {
    const { callId } = await req.json();
    
    if (!callId) {
      return NextResponse.json({ error: 'Call ID required' }, { status: 400 });
    }
    
    console.log(`Syncing single call: ${callId}`);
    const result = await syncSingleCall(callId);
    
    if (result.success) {
      // Fetch the updated call data to return
      const { data: updatedCall } = await supabase
        .from('calls')
        .select('*')
        .eq('call_id', callId)
        .single();
      
      return NextResponse.json({ 
        success: true,
        call: updatedCall
      });
    } else {
      return NextResponse.json({ 
        error: result.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Single sync error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}