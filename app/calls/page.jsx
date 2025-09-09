// app/calls/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function AllCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const callsPerPage = 20;

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch('/api/calls');
        const data = await response.json();
        
        // Format calls with local timezone
        const formattedCalls = data.recentCalls?.map((call) => {
          const callDate = new Date(call.timestamp);
          
          return {
            id: call.id,
            phoneNumber: call.from,
            duration: call.duration,
            date: callDate.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }),
            time: callDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            summary: call.summary
          };
        }) || [];
        
        setCalls(formattedCalls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calls:', error);
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = calls.slice(indexOfFirstCall, indexOfLastCall);
  const totalPages = Math.ceil(calls.length / callsPerPage);

  const handleViewCall = (callId) => {
    window.location.href = `/calls/${encodeURIComponent(callId)}`;
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <p className="text-gray-400">Complete call history</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <p className="text-sm text-gray-400">
              Showing {calls.length > 0 ? indexOfFirstCall + 1 : 0}-{Math.min(indexOfLastCall, calls.length)} of {calls.length} calls
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {currentCalls.length > 0 ? (
                  currentCalls.map((call, index) => (
                    <tr key={`${call.id}_${index}`} className="hover:bg-gray-700/30 transition-colors">
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
                        <button
                          onClick={() => handleViewCall(call.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No calls found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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