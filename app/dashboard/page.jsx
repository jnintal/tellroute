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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Call Dashboard</h1>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          <p>Note: Using sample data. API error: {error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Total Calls</h2>
          <p className="text-3xl font-bold">{data.totalCalls}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Average Duration</h2>
          <p className="text-3xl font-bold">{data.avgDuration}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Missed Calls</h2>
          <p className="text-3xl font-bold text-red-600">{data.missedCalls}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Calls</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium text-gray-700">Date</th>
                  <th className="text-left p-2 font-medium text-gray-700">Time</th>
                  <th className="text-left p-2 font-medium text-gray-700">Duration</th>
                  <th className="text-left p-2 font-medium text-gray-700">From</th>
                  <th className="text-left p-2 font-medium text-gray-700">To</th>
                  <th className="text-left p-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentCalls.map((call) => (
                  <tr key={call.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{call.date}</td>
                    <td className="p-2">{call.time}</td>
                    <td className="p-2">{call.duration}</td>
                    <td className="p-2 font-mono text-sm">{call.from}</td>
                    <td className="p-2 font-mono text-sm">{call.to}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm inline-block ${
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.status === 'missed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentCalls.length === 0 && (
              <p className="text-center py-8 text-gray-500">No calls recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}