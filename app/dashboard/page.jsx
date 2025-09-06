// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({
    totalCalls: 0,
    avgDuration: '0:00',
    missedCalls: 0,
    recentCalls: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/calls');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const callsData = await response.json();
        setData(callsData);
      } catch (err) {
        console.error('Error fetching calls:', err);
        setError(err.message || 'Failed to fetch calls');
        
        // Set some default data for testing
        setData({
          totalCalls: 156,
          avgDuration: '3:45',
          missedCalls: 12,
          recentCalls: [
            {
              id: '1',
              date: '2024-01-15',
              time: '10:30 AM',
              duration: '5:23',
              from: '+1234567890',
              to: '+0987654321',
              status: 'completed'
            },
            {
              id: '2',
              date: '2024-01-15',
              time: '11:45 AM',
              duration: '2:15',
              from: '+1234567891',
              to: '+0987654322',
              status: 'missed'
            },
            {
              id: '3',
              date: '2024-01-15',
              time: '2:30 PM',
              duration: '8:45',
              from: '+1234567892',
              to: '+0987654323',
              status: 'completed'
            },
            {
              id: '4',
              date: '2024-01-14',
              time: '4:15 PM',
              duration: '1:30',
              from: '+1234567893',
              to: '+0987654324',
              status: 'completed'
            },
            {
              id: '5',
              date: '2024-01-14',
              time: '5:00 PM',
              duration: '0:45',
              from: '+1234567894',
              to: '+0987654325',
              status: 'missed'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Call Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor and track your call center performance</p>
        </div>
        
        {error && (
          <div className="bg-yellow-900/20 border border-yellow-600/50 text-yellow-400 px-6 py-4 rounded-lg mb-6 backdrop-blur-sm">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Note: Using sample data. API error: {error}
            </p>
          </div>
        )}
        
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
            <p className="text-xs text-blue-400 mt-2">+12% from last week</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-green-400 uppercase tracking-wider">Avg Duration</h2>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.avgDuration}</p>
            <p className="text-xs text-green-400 mt-2">Optimal range</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-red-400 uppercase tracking-wider">Missed Calls</h2>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.missedCalls}</p>
            <p className="text-xs text-red-400 mt-2">-5% from yesterday</p>
          </div>
        </div>
        
        {/* Recent Calls Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Calls
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {data.recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{call.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{call.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{call.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{call.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{call.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        call.status === 'completed' 
                          ? 'bg-green-900/50 text-green-400 border border-green-500/50' 
                          : call.status === 'missed' 
                          ? 'bg-red-900/50 text-red-400 border border-red-500/50'
                          : 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50'
                      }`}>
                        {call.status === 'completed' && (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {call.status === 'missed' && (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentCalls.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-2 text-gray-500">No calls recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}