// app/api/retell-webhook/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // LOG THE ENTIRE PAYLOAD TO SEE STRUCTURE
    console.log('📍 FULL WEBHOOK PAYLOAD:', JSON.stringify(data, null, 2));
    console.log('📍 Event type:', data.event);
    console.log('📍 Call ID:', data.call?.id || data.call_id || 'NO CALL ID FOUND');
    
    // Handle different event types
    switch (data.event) {
      case 'call_started':
        console.log('📞 Call started event received');
        // Just log for now, don't save
        break;
        
      case 'call_ended':
        console.log('📞 Processing call_ended event...');
        
        // Try different possible field names for the phone numbers
        const toNumber = data.to_number || data.to || data.call?.to_number || data.call?.to;
        const fromNumber = data.from_number || data.from || data.call?.from_number || data.call?.from;
        const callId = data.call?.id || data.call_id || data.id;
        
        console.log(`📍 Phone numbers - From: ${fromNumber}, To: ${toNumber}`);
        
        // Determine which is the Retell number based on direction
        const retellPhoneNumber = data.direction === 'inbound' ? toNumber : fromNumber;
        
        console.log(`📍 Looking up user for Retell phone: ${retellPhoneNumber}`);
        
        // Find which user owns this phone number
        const { data: phoneData, error: phoneError } = await supabase
          .from('user_phone_numbers')
          .select('user_id, email')
          .eq('phone_number', retellPhoneNumber)
          .eq('is_active', true)
          .single();
        
        if (phoneError) {
          console.log('❌ No user found for this phone number:', phoneError);
          console.log('📍 Checking user_phone_numbers table for any entries...');
          
          const { data: allPhones } = await supabase
            .from('user_phone_numbers')
            .select('*');
          console.log('📍 All phone numbers in database:', allPhones);
        } else {
          console.log(`✅ Found user: ${phoneData.email} (${phoneData.user_id})`);
        }
        
        // Calculate duration
        const startTime = data.start_timestamp || data.call?.start_timestamp;
        const endTime = data.end_timestamp || data.call?.end_timestamp;
        const duration = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;
        
        console.log(`📍 Duration calculation: ${duration} seconds`);
        
        // Prepare the call record
        const callRecord = {
          call_id: callId,
          agent_id: data.agent_id || data.call?.agent_id || null,
          user_id: phoneData?.user_id || null,
          from_number: fromNumber,
          to_number: toNumber,
          duration: duration,
          transcript: data.transcript || data.call?.transcript || [],
          recording_url: data.recording_url || data.call?.recording_url || null,
          disconnect_reason: data.disconnection_reason || data.call?.disconnection_reason || null,
          created_at: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
        };
        
        console.log('📍 Call record to save:', callRecord);
        
        // Save the call
        const { error: insertError } = await supabase
          .from('calls')
          .insert(callRecord);
          
        if (insertError) {
          console.error('❌ Failed to save call:', insertError);
        } else {
          console.log('✅ Call saved successfully!');
        }
        break;
        
      case 'call_analyzed':
        console.log('📞 Call analyzed event received');
        // We'll handle this later
        break;
        
      default:
        console.log('❓ Unknown event type:', data.event);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}