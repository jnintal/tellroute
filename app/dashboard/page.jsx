// app/dashboard/page.jsx
import { currentUser } from '@clerk/nextjs/server';
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
    // Use currentUser to get the authenticated user
    const user = await currentUser();
    
    if (!user) {
      console.log('No user found, redirecting to sign-in');
      redirect('/sign-in');
    }
    
    // Get user details
    const userId = user.id;
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    // Debug logging
    console.log('Dashboard - Clerk User ID:', userId);
    console.log('Dashboard - User Email:', userEmail);
    
    // Fetch user's phone numbers from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('retell_phone_number')
      .eq('clerk_user_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      console.log('Attempting with email fallback...');
      
      // Fallback: try to find user by email if clerk_user_id doesn't match
      const { data: userByEmail } = await supabase
        .from('users')
        .select('retell_phone_number, clerk_user_id')
        .eq('email', userEmail)
        .single();
      
      if (userByEmail) {
        console.log('Found user by email, updating clerk_user_id...');
        // Update the clerk_user_id to match current user
        await supabase
          .from('users')
          .update({ clerk_user_id: userId })
          .eq('email', userEmail);
        
        // Use this data
        userData = userByEmail;
      }
    }
    
    // Fetch calls from Supabase for this user
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (callsError) {
      console.error('Error fetching calls:', callsError);
      
      // If no calls found with current userId, try updating them if we have the phone number
      if (userData?.retell_phone_number) {
        console.log('Attempting to link orphaned calls...');
        const { data: orphanedCalls } = await supabase
          .from('calls')
          .select('*')
          .eq('to_number', userData.retell_phone_number)
          .is('clerk_user_id', null);
        
        if (orphanedCalls && orphanedCalls.length > 0) {
          console.log(`Found ${orphanedCalls.length} orphaned calls, linking to user...`);
          await supabase
            .from('calls')
            .update({ clerk_user_id: userId })
            .eq('to_number', userData.retell_phone_number);
          
          // Re-fetch calls after linking
          const { data: updatedCalls } = await supabase
            .from('calls')
            .select('*')
            .eq('clerk_user_id', userId)
            .order('created_at', { ascending: false });
          
          calls = updatedCalls;
        }
      }
    }
    
    // Calculate statistics
    const totalCalls = calls?.length || 0;
    const totalMinutes = Math.round(
      (calls?.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) || 0) / 60
    );
    
    // For SMS - fetch from sms_queue when ready
    const { data: smsData } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('clerk_user_id', userId)
      .eq('sent', true);
    
    const totalTexts = smsData?.length || 0;
    
    // Format calls for the dashboard
    const recentCalls = calls?.slice(0, 10).map(call => ({
      id: call.call_id,
      summary: call.summary || 'Call in progress...',
      phoneNumber: call.from_number,
      duration: formatDuration(call.duration_seconds),
      date: formatDate(call.created_at),
      time: formatTime(call.created_at)
    })) || [];
    
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
      userEmail: userEmail || 'User'
    };
    
    return <DashboardClient initialData={dashboardData} />;
    
  } catch (error) {
    console.error('Dashboard error:', error);
    // Return a basic error state instead of crashing
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Error loading dashboard</p>
          <p className="text-gray-400 mb-4">Please try signing in again</p>
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