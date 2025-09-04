"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCall, setSelectedCall] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  // Mock data - replace with real data from your backend
  const stats = {
    totalCalls: 156,
    avgDuration: '2:45',
    smsCount: 43,
  };

  // Mock call data
  const calls = [
    { id: 1, phone: '+1 (555) 101-1001', time: '5 mins ago', duration: '2:15', type: 'Reservation inquiry', recording: '/audio/call1.mp3' },
    { id: 2, phone: '+1 (555) 102-1002', time: '15 mins ago', duration: '1:45', type: 'Hours question', recording: '/audio/call2.mp3' },
    { id: 3, phone: '+1 (555) 103-1003', time: '30 mins ago', duration: '3:20', type: 'Menu inquiry', recording: '/audio/call3.mp3' },
    { id: 4, phone: '+1 (555) 104-1004', time: '1 hour ago', duration: '2:55', type: 'Takeout order', recording: '/audio/call4.mp3' },
    { id: 5, phone: '+1 (555) 105-1005', time: '2 hours ago', duration: '4:10', type: 'Catering inquiry', recording: '/audio/call5.mp3' },
  ];

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
              <button className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition">
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
          <p className="text-gray-400">Here's what's happening with your calls today.</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2 mb-6">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Calls</span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <div className="text-xs text-green-400 mt-1">↑ 12% from yesterday</div>
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
          
          <div className="divide-y divide-gray-700">
            {calls.map((call) => (
              <div 
                key={call.id} 
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
                      <div className="font-medium">{call.phone}</div>
                      <div className="text-sm text-gray-400">{call.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{call.time}</div>
                    <div className="text-sm font-medium">{call.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700 text-center">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Load more calls
            </button>
          </div>
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
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="font-medium">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Call Duration</p>
                  <p className="font-medium">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-medium">{selectedCall.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="font-medium">{selectedCall.type}</p>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Recording</p>
                <audio controls className="w-full">
                  <source src={selectedCall.recording} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Transcript */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Transcript</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-blue-400">AI Assistant</p>
                    <p className="text-sm">Hello, thank you for calling. How can I help you today?</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-400">Customer</p>
                    <p className="text-sm">Hi, I'd like to make a reservation for tonight.</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-400">AI Assistant</p>
                    <p className="text-sm">Of course! I'd be happy to help you with a reservation. Let me send you our booking link.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                  Download Recording
                </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                  Download Transcript
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}