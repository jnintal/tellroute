"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    avgDuration: '0:00',
    smsCount: 0,
  });

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  // Fetch real data from API
  useEffect(() => {
    if (userId) {
      fetchCalls();
    }
  }, [userId, selectedPeriod]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/calls?period=${selectedPeriod}`);
      const data = await response.json();
      
      if (response.ok) {
        setCalls(data.calls || []);
        
        // Calculate stats from real data
        const totalCalls = data.calls?.length || 0;
        const totalDuration = data.calls?.reduce((sum: number, call: any) => sum + (call.duration || 0), 0) || 0;
        const avgDurationSeconds = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0;
        const avgDurationFormatted = `${Math.floor(avgDurationSeconds / 60)}:${(avgDurationSeconds % 60).toString().padStart(2, '0')}`;
        
        setStats({
          totalCalls,
          avgDuration: avgDurationFormatted,
          smsCount: 0, // You can add SMS tracking later
        });
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLoaded || !userId) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Route Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/account')}
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                <span className="text-sm">Account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-400">Here&apos;s what&apos;s happening with your calls today.</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2 mb-6">
          {['today', 'week', 'month', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Calls</span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <div className="text-xs text-gray-400 mt-1">
              {selectedPeriod === 'today' ? 'Today' : 
               selectedPeriod === 'week' ? 'This week' : 
               selectedPeriod === 'month' ? 'This month' : 'All time'}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg Duration</span>
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.avgDuration}</div>
            <div className="text-xs text-gray-400 mt-1">Per call</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">SMS Sent</span>
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.smsCount}</div>
            <div className="text-xs text-gray-400 mt-1">Follow-ups sent</div>
          </div>
        </div>

        {/* Call List */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Call History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading calls...</div>
          ) : calls.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No calls found for {selectedPeriod === 'all' ? 'all time' : `${selectedPeriod}`}
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {calls.map((call) => (
                <div 
                  key={call.call_id} 
                  onClick={() => setSelectedCall(call)}
                  className="p-4 hover:bg-gray-700/50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">{call.from_number || 'Unknown'}</div>
                        <div className="text-sm text-gray-400">
                          {call.summary || call.disconnect_reason || 'Call completed'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{formatTimeAgo(call.created_at)}</div>
                      <div className="text-sm font-medium">{formatDuration(call.duration || 0)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Call Details</h3>
              <button 
                onClick={() => setSelectedCall(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Call ID</p>
                  <p className="font-medium text-xs">{selectedCall.call_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">From</p>
                  <p className="font-medium">{selectedCall.from_number || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">To</p>
                  <p className="font-medium">{selectedCall.to_number}</p>
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Transcript</p>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCall.transcript.map((item: any, index: number) => (
                      <div key={index}>
                        <p className="text-xs text-blue-400">{item.role === 'agent' ? 'AI Assistant' : 'Customer'}</p>
                        <p className="text-sm">{item.content || item.words?.map((w: any) => w.word).join(' ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedCall.summary && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Summary</p>
                  <p className="text-sm">{selectedCall.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}