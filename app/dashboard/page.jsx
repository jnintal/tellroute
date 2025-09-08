// app/dashboard/page.jsx
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import DashboardClient from './dashboard-client';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function Dashboard() {
  try {
    // Get auth session
    const { userId, sessionClaims } = await auth();
    
    // If no userId, user is not authenticated
    if (!userId) {
      console.log('No userId found, redirecting to sign-in');
      redirect('/sign-in');
    }
    
    // Get email from session claims
    const userEmail = sessionClaims?.email || 'User';
    
    // Debug logging
    console.log('Dashboard - Clerk User ID:', userId);
    console.log('Dashboard - User Email:', userEmail);
    console.log('Dashboard - Session Claims:', sessionClaims);
    
    // First, try to get user data by Clerk ID
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();
    
    // If not found by Clerk ID, try by email and update the Clerk ID
    if (userError || !userData) {
      console.log('User not found by Clerk ID, trying email...');
      
      const { data: userByEmail } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (userByEmail) {
        console.log('Found user by email, updating Clerk ID...');
        // Update the clerk_user_id to match current user
        await supabase
          .from('users')
          .update({ clerk_user_id: userId })
          .eq('email', userEmail);
        
        userData = userByEmail;
        
        // Also update any existing calls to have the correct clerk_user_id
        await supabase
          .from('calls')
          .update({ clerk_user_id: userId })
          .eq('to_number', userByEmail.retell_phone_number);
        
        console.log('Updated user and calls with new Clerk ID');
      } else {
        console.log('No user found in database for email:', userEmail);
      }
    }
    
    // Fetch calls from Supabase for this user
    let calls = [];
    if (userId) {
      const { data: callData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (callsError) {
        console.error('Error fetching calls:', callsError);
      } else {
        calls = callData || [];
        console.log(`Found ${calls.length} calls for user`);
      }
    }
    
    // Calculate statistics
    const totalCalls = calls.length;
    const totalMinutes = Math.round(
      calls.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) / 60
    );
    
    // For SMS - fetch from sms_queue when ready
    const { data: smsData } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('clerk_user_id', userId)
      .eq('sent', true);
    
    const totalTexts = smsData?.length || 0;
    
    // Format calls for the dashboard
    const recentCalls = calls.slice(0, 10).map(call => ({
      id: call.call_id,
      summary: call.summary || 'Call in progress...',
      phoneNumber: call.from_number,
      duration: formatDuration(call.duration_seconds),
      date: formatDate(call.created_at),
      time: formatTime(call.created_at)
    }));
    
    // Format phone numbers for dropdown
    const userPhoneNumbers = userData?.retell_phone_number ? [
      {
        id: '1',
        number: userData.retell_phone_number,
        label: 'Primary'
      }
    ] : [];
    
    // Prepare data for client component
    const dashboardData = {
      totalCalls,
      totalMinutes,
      totalTexts,
      userPhoneNumbers,
      selectedPhoneId: '1',
      recentCalls,
      userEmail
    };
    
    console.log('Dashboard data prepared:', {
      totalCalls,
      totalMinutes,
      phoneNumber: userData?.retell_phone_number
    });
    
    return <DashboardClient initialData={dashboardData} />;
    
  } catch (error) {
    console.error('Dashboard error:', error);
    // Return a basic error state instead of crashing
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Error loading dashboard</p>
          <p className="text-gray-400 mb-4 text-sm">{error?.message || 'Unknown error'}</p>
          <a href="/sign-in" className="text-blue-400 hover:text-blue-300">Go to Sign In</a>
        </div>
      </div>
    );
  }
}

// Helper functions
function formatDuration(seconds) {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');
}

function formatTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}