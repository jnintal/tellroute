// app/api/sms/count/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    const clerkUserId = user?.id;
    
    if (!clerkUserId) {
      console.log('No authenticated user found');
      return NextResponse.json({
        totalSMS: 0,
        sentToday: 0,
        receivedToday: 0,
        monthlyTexts: 0,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('Fetching SMS count for user:', clerkUserId);
    
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch total SMS count for the user (all time)
    const { count: totalSMS, error: totalError } = await supabase
      .from('sms_queue')
      .select('*', { count: 'exact', head: true })
      .eq('clerk_user_id', clerkUserId)
      .eq('sent', true);

    if (totalError) {
      console.error('Error fetching total SMS:', totalError);
    }

    // Fetch SMS sent this month
    const { count: monthlyTexts, error: monthlyError } = await supabase
      .from('sms_queue')
      .select('*', { count: 'exact', head: true })
      .eq('clerk_user_id', clerkUserId)
      .eq('sent', true)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    if (monthlyError) {
      console.error('Error fetching monthly SMS:', monthlyError);
    }

    // Fetch SMS sent today
    const { count: sentToday, error: sentError } = await supabase
      .from('sms_queue')
      .select('*', { count: 'exact', head: true })
      .eq('clerk_user_id', clerkUserId)
      .eq('sent', true)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (sentError) {
      console.error('Error fetching sent SMS today:', sentError);
    }

    console.log('SMS Stats:', {
      total: totalSMS,
      monthly: monthlyTexts,
      today: sentToday
    });

    return NextResponse.json({
      totalSMS: totalSMS || 0,
      monthlyTexts: monthlyTexts || 0,
      sentToday: sentToday || 0,
      receivedToday: 0, // We're not tracking received SMS in sms_queue
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in SMS count API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch SMS metrics',
        totalSMS: 0,
        monthlyTexts: 0,
        sentToday: 0,
        receivedToday: 0
      },
      { status: 500 }
    );
  }
}