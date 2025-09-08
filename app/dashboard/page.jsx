// app/dashboard/page.jsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import DashboardClient from './dashboard-client';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Using service key for server-side
);

export default async function Dashboard() {
  // Get the authenticated user from Clerk
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Fetch user's phone numbers from the users table
  const { data: userData } = await supabase
    .from('users')
    .select('retell_phone_number')
    .eq('clerk_user_id', userId)
    .single();
  
  // Fetch calls from Supabase for this user
  const { data: calls, error } = await supabase
    .from('calls')
    .select('*')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching calls:', error);
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
  const userPhoneNumbers = userData ? [
    {
      id: '1',
      number: userData.retell_phone_number,
      label: 'Primary' // You can add labels to your users table if needed
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
    userEmail: user?.emailAddresses[0]?.emailAddress
  };
  
  return <DashboardClient initialData={dashboardData} />;
}

// Helper functions
function formatDuration(seconds) {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}