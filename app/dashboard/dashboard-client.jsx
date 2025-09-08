// app/dashboard/dashboard-client.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

export default function DashboardClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  
  const router = useRouter();
  const { signOut } = useClerk();

  // Handle sign out with Clerk
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      // Force redirect after sign out
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
    }
  };

  const handleViewCall = (callId) => {
    // Navigate to the call detail page
    router.push(`/calls/${callId}`);
  };

  const handlePhoneChange = (phoneId) => {
    setData({ ...data, selectedPhoneId: phoneId });
    setShowPhoneDropdown(false);
    // In the future, this could trigger a data refresh for the selected phone
  };

  const getCurrentMonthYear = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const selectedPhone = data.userPhoneNumbers.find(phone => phone.id === data.selectedPhoneId);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh(); // This will re-fetch data from the server component
    }, 30000);
    
    return () => clearInterval(interval);
  }, [router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
        setShowPhoneDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          {/* Left Side - Phone Number Selector */}
          <div className="relative dropdown-container">
            <p className="text-sm text-gray-400 mb-2">Your Active Number</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPhoneDropdown(!showPhoneDropdown);
              }}
              className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-lg rounded-lg px-4 py-3 border border-gray-700/50 hover:bg-gray-700/50 transition-colors min-w-[280px]"
            >
              <div className="text-left flex-1">
                <p className="text-white font-medium">{selectedPhone?.number || 'No phone assigned'}</p>
                <p className="text-xs text-gray-400">{selectedPhone?.label}</p>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showPhoneDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showPhoneDropdown && data.userPhoneNumbers.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                {data.userPhoneNumbers.map((phone) => (
                  <button
                    key={phone.id}
                    onClick={() => handlePhoneChange(phone.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                      phone.id === data.selectedPhoneId ? 'bg-gray-700/50' : ''
                    }`}
                  >
                    <p className="text-white font-medium">{phone.number}</p>
                    <p className="text-xs text-gray-400">{phone.label}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Account Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-lg px-4 py-2 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-white font-medium">Account</span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{data.userEmail}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Call Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor and track your communication metrics for {getCurrentMonthYear()}</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Total Calls</h2>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalCalls}</p>
            <p className="text-xs text-blue-400 mt-2">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-green-400 uppercase tracking-wider">Total Minutes</h2>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalMinutes}</p>
            <p className="text-xs text-green-400 mt-2">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-purple-400 uppercase tracking-wider">Total Texts</h2>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalTexts}</p>
            <p className="text-xs text-purple-400 mt-2">This month</p>
          </div>
        </div>
        
        {/* Recent Calls Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Recent Calls</h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400">
                {data.recentCalls.length > 0 ? `Last ${data.recentCalls.length} calls` : 'No calls yet'}
              </p>
              {data.recentCalls.length > 0 && (
                <a href="/calls" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All Calls →
                </a>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            {data.recentCalls.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Summary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {data.recentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-300">{call.phoneNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300 line-clamp-2 max-w-lg">{call.summary}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{call.duration}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <div>{call.date}</div>
                          <div className="text-xs text-gray-500">{call.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewCall(call.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-400 mb-2">No calls recorded yet</p>
                <p className="text-sm text-gray-500">Calls to your Retell number will appear here automatically</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}