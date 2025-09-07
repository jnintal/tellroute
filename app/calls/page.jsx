// app/calls/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function AllCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const callsPerPage = 20;

  useEffect(() => {
    // Mock data - in production this would fetch from your API
    const mockCalls = [
      {
        id: '1',
        phoneNumber: '+18086512711',
        duration: '00:03',
        date: '01-15-2024',
        time: '10:05:38 PM',
        summary: 'The call was brief and appears to have ended abruptly.'
      },
      {
        id: '2',
        phoneNumber: '+13107406556',
        duration: '00:35',
        date: '01-15-2024',
        time: '9:08:03 PM',
        summary: 'Inquiry about dinner reservation for five people.'
      },
      {
        id: '3',
        phoneNumber: '+16619930444',
        duration: '00:27',
        date: '01-15-2024',
        time: '8:48:29 PM',
        summary: 'Request to speak with a representative.'
      },
      {
        id: '4',
        phoneNumber: '+15126572638',
        duration: '00:57',
        date: '01-15-2024',
        time: '8:24:41 PM',
        summary: 'Inquiry about MSG in food items.'
      },
      {
        id: '5',
        phoneNumber: '+13105695944',
        duration: '00:53',
        date: '01-15-2024',
        time: '8:16:47 PM',
        summary: 'Wait time inquiry for three people.'
      },
      {
        id: '6',
        phoneNumber: '+14245551234',
        duration: '01:15',
        date: '01-14-2024',
        time: '7:45:22 PM',
        summary: 'Business hours information request.'
      },
      {
        id: '7',
        phoneNumber: '+18185554567',
        duration: '02:30',
        date: '01-14-2024',
        time: '6:30:15 PM',
        summary: 'Catering services inquiry.'
      },
      {
        id: '8',
        phoneNumber: '+13235558901',
        duration: '00:45',
        date: '01-14-2024',
        time: '5:15:45 PM',
        summary: 'Order status check.'
      },
      {
        id: '9',
        phoneNumber: '+16265552345',
        duration: '00:28',
        date: '01-14-2024',
        time: '4:45:30 PM',
        summary: 'Directions to restaurant.'
      },
      {
        id: '10',
        phoneNumber: '+17145556789',
        duration: '03:12',
        date: '01-14-2024',
        time: '3:20:10 PM',
        summary: 'Customer complaint resolution.'
      },
      {
        id: '11',
        phoneNumber: '+13105551234',
        duration: '01:45',
        date: '01-13-2024',
        time: '2:15:30 PM',
        summary: 'Inquiry about party reservations.'
      },
      {
        id: '12',
        phoneNumber: '+18185559876',
        duration: '00:22',
        date: '01-13-2024',
        time: '1:30:15 PM',
        summary: 'Menu pricing questions.'
      },
      {
        id: '13',
        phoneNumber: '+14245553333',
        duration: '04:15',
        date: '01-13-2024',
        time: '12:45:00 PM',
        summary: 'Large catering order discussion.'
      },
      {
        id: '14',
        phoneNumber: '+16265554444',
        duration: '00:55',
        date: '01-12-2024',
        time: '11:20:30 AM',
        summary: 'Dietary restrictions inquiry.'
      },
      {
        id: '15',
        phoneNumber: '+17145552222',
        duration: '01:30',
        date: '01-12-2024',
        time: '10:15:45 AM',
        summary: 'Feedback about recent visit.'
      },
      // Add more mock data for testing pagination
      {
        id: '16',
        phoneNumber: '+13235551111',
        duration: '02:10',
        date: '01-12-2024',
        time: '9:30:00 AM',
        summary: 'Takeout order placement.'
      },
      {
        id: '17',
        phoneNumber: '+18185552222',
        duration: '00:45',
        date: '01-11-2024',
        time: '8:45:00 PM',
        summary: 'Delivery status inquiry.'
      },
      {
        id: '18',
        phoneNumber: '+14245553333',
        duration: '01:20',
        date: '01-11-2024',
        time: '7:30:00 PM',
        summary: 'Special dietary menu questions.'
      },
      {
        id: '19',
        phoneNumber: '+16265554444',
        duration: '00:35',
        date: '01-11-2024',
        time: '6:15:00 PM',
        summary: 'Parking information request.'
      },
      {
        id: '20',
        phoneNumber: '+17145555555',
        duration: '03:45',
        date: '01-11-2024',
        time: '5:00:00 PM',
        summary: 'Event planning discussion.'
      },
      {
        id: '21',
        phoneNumber: '+13105556666',
        duration: '00:50',
        date: '01-11-2024',
        time: '4:30:00 PM',
        summary: 'Gift card inquiry.'
      },
      {
        id: '22',
        phoneNumber: '+18086517777',
        duration: '01:15',
        date: '01-11-2024',
        time: '3:45:00 PM',
        summary: 'Loyalty program questions.'
      },
      {
        id: '23',
        phoneNumber: '+13107408888',
        duration: '02:20',
        date: '01-10-2024',
        time: '2:30:00 PM',
        summary: 'Birthday party reservation.'
      },
      {
        id: '24',
        phoneNumber: '+16619939999',
        duration: '00:40',
        date: '01-10-2024',
        time: '1:15:00 PM',
        summary: 'Weekend hours inquiry.'
      },
      {
        id: '25',
        phoneNumber: '+15126570000',
        duration: '01:55',
        date: '01-10-2024',
        time: '12:00:00 PM',
        summary: 'Lunch special questions.'
      }
    ];
    
    setCalls(mockCalls);
    setLoading(false);
  }, []);

  // Pagination logic
  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = calls.slice(indexOfFirstCall, indexOfLastCall);
  const totalPages = Math.ceil(calls.length / callsPerPage);

  const handleViewCall = (callId) => {
    window.location.href = `/calls/${callId}`;
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
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
          <p className="text-gray-400">Complete call history</p>
        </div>

        {/* Calls Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <p className="text-sm text-gray-400">
              Showing {indexOfFirstCall + 1}-{Math.min(indexOfLastCall, calls.length)} of {calls.length} calls
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
          </div>
          
          {/* Pagination */}
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