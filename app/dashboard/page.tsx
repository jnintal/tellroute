"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

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
    answeredCalls: 152,
    missedCalls: 4,
    avgDuration: '2:45',
    smsCount: 43,
    transferredCalls: 12
  };

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
              <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="h-8 w-px bg-gray-700"></div>
              
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
              <span className="text-gray-400 text-sm">Answered</span>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.answeredCalls}</div>
            <div className="text-xs text-gray-400 mt-1">{((stats.answeredCalls / stats.totalCalls) * 100).toFixed(1)}% answer rate</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Missed</span>
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.missedCalls}</div>
            <div className="text-xs text-red-400 mt-1">Needs attention</div>
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

          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Transferred</span>
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{stats.transferredCalls}</div>
            <div className="text-xs text-gray-400 mt-1">To human agents</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'calls', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Calls */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Calls</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        i % 2 === 0 ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}>
                        <svg className={`w-5 h-5 ${i % 2 === 0 ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i % 2 === 0 ? "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" : "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"} />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">+1 (555) {100 + i}-{1000 + i}</div>
                        <div className="text-sm text-gray-400">{i % 2 === 0 ? 'Reservation inquiry' : 'Hours question'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{i * 5} mins ago</div>
                      <div className="text-sm font-medium">{i % 2 === 0 ? '2:15' : '1:45'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Performance */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">AI Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Understanding Rate</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-green-400">98.5%</div>
                    <div className="text-sm text-green-400 mb-1">↑ 0.5%</div>
                  </div>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '98.5%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-2">Resolution Rate</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-blue-400">92.3%</div>
                    <div className="text-sm text-blue-400 mb-1">↑ 2.1%</div>
                  </div>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '92.3%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-2">Customer Satisfaction</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-purple-400">4.8/5</div>
                    <div className="text-sm text-purple-400 mb-1">★★★★★</div>
                  </div>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}