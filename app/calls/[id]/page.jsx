// app/calls/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function AllCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const callsPerPage = 20;

  useEffect(() => {
    const fetchAllCalls = async () => {
      try {
        setLoading(true);
        // TODO: Fetch from API
        // const response = await fetch('/api/calls/all');
        // const data = await response.json();
        
        // Mock data for now - more extensive list
        const mockCalls = [
          {
            id: '1',
            phoneNumber: '+18086512711',
            duration: '00:03',
            date: '01-15-2024',
            time: '10:05:38 PM',
            status: 'completed',
            summary: 'The call was brief and appears to have ended abruptly.'
          },
          {
            id: '2',
            phoneNumber: '+13107406556',
            duration: '00:35',
            date: '01-15-2024',
            time: '9:08:03 PM',
            status: 'completed',
            summary: 'Inquiry about dinner reservation for five people.'
          },
          {
            id: '3',
            phoneNumber: '+16619930444',
            duration: '00:27',
            date: '01-15-2024',
            time: '8:48:29 PM',
            status: 'completed',
            summary: 'Request to speak with a representative.'
          },
          {
            id: '4',
            phoneNumber: '+15126572638',
            duration: '00:57',
            date: '01-15-2024',
            time: '8:24:41 PM',
            status: 'completed',
            summary: 'Inquiry about MSG in food items.'
          },
          {
            id: '5',
            phoneNumber: '+13105695944',
            duration: '00:53',
            date: '01-15-2024',
            time: '8:16:47 PM',
            status: 'missed',
            summary: 'Wait time inquiry for three people.'
          },
          {
            id: '6',
            phoneNumber: '+14245551234',
            duration: '01:15',
            date: '01-14-2024',
            time: '7:45:22 PM',
            status: 'completed',
            summary: 'Business hours information request.'
          },
          {
            id: '7',
            phoneNumber: '+18185554567',
            duration: '02:30',
            date: '01-14-2024',
            time: '6:30:15 PM',
            status: 'completed',
            summary: 'Catering services inquiry.'
          },
          {
            id: '8',
            phoneNumber: '+13235558901',
            duration: '00:45',
            date: '01-14-2024',
            time: '5:15:45 PM',
            status: 'missed',
            summary: 'Order status check.'
          },
          {
            id: '9',
            phoneNumber: '+16265552345',
            duration: '00:28',
            date: '01-14-2024',
            time: '4:45:30 PM',
            status: 'completed',
            summary: 'Directions to restaurant.'
          },
          {
            id: '10',
            phoneNumber: '+17145556789',
            duration: '03:12',
            date: '01-14-2024',
            time: '3:20:10 PM',
            status: 'completed',
            summary: 'Customer complaint resolution.'
          },
          // Add more mock data as needed
        ];
        
        setCalls(mockCalls);
      } catch (error) {
        console.error('Error fetching calls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCalls();
  }, []);

  // Filter and sort calls
  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          call.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort calls
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
    }
    if (sortBy === 'duration') {
      return b.duration.localeCompare(a.duration);
    }
    return 0;
  });

  // Pagination
  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = sortedCalls.slice(indexOfFirstCall, indexOfLastCall);
  const totalPages = Math.ceil(sortedCalls.length / callsPerPage);

  const handleViewCall = (callId) => {
    window.location.href = `/calls/${callId}`;
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading all calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">All Calls</h1>
          <p className="text-gray-400">Complete call history and management</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Search</label>
              <input
                type="text"
                placeholder="Search by number or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Calls</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="date">Date (Newest First)</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <p className="text-sm text-gray-400">
              Showing {indexOfFirstCall + 1}-{Math.min(indexOfLastCall, sortedCalls.length)} of {sortedCalls.length} calls
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {currentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300">{call.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-2 max-w-md">{call.summary}</p>
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        call.status === 'completed' 
                          ? 'bg-green-900/50 text-green-400 border border-green-500/50' 
                          : 'bg-red-900/50 text-red-400 border border-red-500/50'
                      }`}>
                        {call.status}
                      </span>
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
            {currentCalls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No calls found matching your criteria</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                }`}
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}