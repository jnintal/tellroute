// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    totalMinutes: 0,
    totalTexts: 0
  });
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;
    
    // If no user, redirect to sign-in
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [isLoaded, userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch calls from the API endpoint
      const response = await fetch('/api/calls');
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data:', data);
        
        // Use the data from API
        setMetrics({
          totalCalls: data.totalCalls || 0,
          totalMinutes: data.totalMinutes || 0,
          totalTexts: 0 // SMS not implemented yet
        });

        // Format recent calls with proper UTC to local timezone conversion
        const formattedCalls = data.recentCalls?.slice(0, 5).map(call => {
          // Check if timestamp already has timezone info, if not add Z for UTC
          let timestamp = call.timestamp;
          if (!timestamp.endsWith('Z') && !timestamp.includes('+') && !timestamp.includes('T')) {
            timestamp = timestamp + 'Z';
          } else if (timestamp.includes('T') && !timestamp.endsWith('Z') && !timestamp.includes('+')) {
            timestamp = timestamp + 'Z';
          }
          
          const callDate = new Date(timestamp);
          
          return {
            id: call.id,
            phoneNumber: call.from,
            duration: call.duration,
            time: callDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            date: callDate.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }),
            summary: call.summary
          };
        }) || [];

        setRecentCalls(formattedCalls);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleViewAllCalls = () => {
    router.push('/calls');
  };

  const handleViewCall = (callId) => {
    router.push(`/calls/${callId}`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your activity overview.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">This month</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metrics.totalCalls.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Calls</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">This month</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metrics.totalMinutes.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Minutes</div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">This month</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metrics.totalTexts.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Texts</div>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Recent Calls</h2>
            <button
              onClick={handleViewAllCalls}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View all calls →
            </button>
          </div>
          <div className="overflow-x-auto">
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
                {recentCalls.length > 0 ? recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300">{call.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-1 max-w-md">{call.summary}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{call.duration}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <div className="text-xs text-gray-500">{call.date}</div>
                        <div>{call.time}</div>
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
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No calls yet. Calls will appear here once you receive them.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}