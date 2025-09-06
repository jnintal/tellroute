// app/calls/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CallsPage() {
  const router = useRouter();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchCalls();
  }, [filter]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      // In production, this would be an API call with filters
      // const response = await fetch(`/api/calls?filter=${filter}`);
      // const data = await response.json();
      
      // Mock data for now - expanded list
      const mockCalls = [
        {
          id: '1',
          phoneNumber: '+18086512711',
          direction: 'Inbound',
          duration: '00:03',
          date: '2024-01-15',
          time: '10:05:38 PM',
          status: 'completed',
          summary: 'Brief call that ended abruptly',
          sentiment: 'Neutral'
        },
        {
          id: '2',
          phoneNumber: '+13107406556',
          direction: 'Inbound',
          duration: '00:35',
          date: '2024-01-15',
          time: '9:08:03 PM',
          status: 'completed',
          summary: 'Dinner reservation inquiry for five people',
          sentiment: 'Positive'
        },
        {
          id: '3',
          phoneNumber: '+16619930444',
          direction: 'Inbound',
          duration: '00:27',
          date: '2024-01-15',
          time: '8:48:29 PM',
          status: 'transferred',
          summary: 'Customer requested representative',
          sentiment: 'Neutral'
        },
        {
          id: '4',
          phoneNumber: '+15126572638',
          direction: 'Inbound',
          duration: '00:57',
          date: '2024-01-15',
          time: '8:24:41 PM',
          status: 'transferred',
          summary: 'MSG inquiry - transferred to staff',
          sentiment: 'Neutral'
        },
        {
          id: '5',
          phoneNumber: '+13105695944',
          direction: 'Inbound',
          duration: '00:53',
          date: '2024-01-15',
          time: '8:16:47 PM',
          status: 'failed',
          summary: 'Wait time inquiry - transfer failed',
          sentiment: 'Negative'
        },
        {
          id: '6',
          phoneNumber: '+14245551234',
          direction: 'Inbound',
          duration: '01:15',
          date: '2024-01-15',
          time: '7:45:22 PM',
          status: 'completed',
          summary: 'Business hours inquiry',
          sentiment: 'Positive'
        },
        {
          id: '7',
          phoneNumber: '+18185554567',
          direction: 'Inbound',
          duration: '02:30',
          date: '2024-01-15',
          time: '6:30:15 PM',
          status: 'transferred',
          summary: 'Catering services inquiry',
          sentiment: 'Positive'
        },
        {
          id: '8',
          phoneNumber: '+13235558901',
          direction: 'Inbound',
          duration: '00:45',
          date: '2024-01-15',
          time: '5:15:45 PM',
          status: 'completed',
          summary: 'Order status check',
          sentiment: 'Neutral'
        },
        {
          id: '9',
          phoneNumber: '+16265552345',
          direction: 'Outbound',
          duration: '00:28',
          date: '2024-01-14',
          time: '4:45:30 PM',
          status: 'completed',
          summary: 'Directions provided',
          sentiment: 'Positive'
        },
        {
          id: '10',
          phoneNumber: '+17145556789',
          direction: 'Inbound',
          duration: '03:12',
          date: '2024-01-14',
          time: '3:20:10 PM',
          status: 'transferred',
          summary: 'Customer complaint escalated',
          sentiment: 'Negative'
        },
        {
          id: '11',
          phoneNumber: '+19095551234',
          direction: 'Inbound',
          duration: '01:45',
          date: '2024-01-14',
          time: '2:15:30 PM',
          status: 'completed',
          summary: 'Menu inquiry',
          sentiment: 'Positive'
        },
        {
          id: '12',
          phoneNumber: '+17605559876',
          direction: 'Outbound',
          duration: '00:52',
          date: '2024-01-14',
          time: '1:30:45 PM',
          status: 'completed',
          summary: 'Reservation confirmation',
          sentiment: 'Positive'
        },
        {
          id: '13',
          phoneNumber: '+18055554321',
          direction: 'Inbound',
          duration: '02:18',
          date: '2024-01-14',
          time: '12:45:00 PM',
          status: 'completed',
          summary: 'Special dietary requirements discussion',
          sentiment: 'Neutral'
        },
        {
          id: '14',
          phoneNumber: '+16615558765',
          direction: 'Inbound',
          duration: '00:38',
          date: '2024-01-14',
          time: '11:30:15 AM',
          status: 'missed',
          summary: 'Call disconnected early',
          sentiment: 'Negative'
        },
        {
          id: '15',
          phoneNumber: '+13105551111',
          direction: 'Inbound',
          duration: '01:22',
          date: '2024-01-14',
          time: '10:15:30 AM',
          status: 'completed',
          summary: 'Parking information request',
          sentiment: 'Positive'
        }
      ];
      
      // Apply filters
      let filteredCalls = [...mockCalls];
      
      if (filter !== 'all') {
        filteredCalls = filteredCalls.filter(call => {
          if (filter === 'completed') return call.status === 'completed';
          if (filter === 'transferred') return call.status === 'transferred';
          if (filter === 'failed') return call.status === 'failed' || call.status === 'missed';
          if (filter === 'inbound') return call.direction === 'Inbound';
          if (filter === 'outbound') return call.direction === 'Outbound';
          return true;
        });
      }
      
      // Apply search
      if (searchTerm) {
        filteredCalls = filteredCalls.filter(call =>
          call.phoneNumber.includes(searchTerm) ||
          call.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      filteredCalls.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
        } else if (sortBy === 'duration') {
          const aDuration = a.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          const bDuration = b.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          comparison = bDuration - aDuration;
        }
        return sortOrder === 'desc' ? comparison : -comparison;
      });
      
      setCalls(filteredCalls);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCall = (callId) => {
    router.push(`/calls/${callId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/50 text-green-400 border-green-500/50';
      case 'transferred':
        return 'bg-blue-900/50 text-blue-400 border-blue-500/50';
      case 'failed':
      case 'missed':
        return 'bg-red-900/50 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-700/50 text-gray-400 border-gray-600/50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return '😊';
      case 'Negative':
        return '😔';
      default:
        return '😐';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">All Calls</h1>
          <p className="text-gray-400">View and manage your complete call history</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'completed', 'transferred', 'failed', 'inbound', 'outbound'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === filterOption
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search by phone or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Total Calls</p>
            <p className="text-2xl font-bold text-white">{calls.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {calls.filter(c => c.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Transferred</p>
            <p className="text-2xl font-bold text-blue-400">
              {calls.filter(c => c.status === 'transferred').length}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Failed/Missed</p>
            <p className="text-2xl font-bold text-red-400">
              {calls.filter(c => c.status === 'failed' || c.status === 'missed').length}
            </p>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {calls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300">{call.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${call.direction === 'Inbound' ? 'text-green-400' : 'text-blue-400'}`}>
                        {call.direction === 'Inbound' ? '↓' : '↑'} {call.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-1 max-w-xs">{call.summary}</p>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg" title={call.sentiment}>
                        {getSentimentIcon(call.sentiment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewCall(call.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {calls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No calls found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}