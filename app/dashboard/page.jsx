// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({
    totalCalls: 0,
    totalMinutes: 0,
    totalTexts: 0,
    userPhoneNumbers: [
      { id: '1', number: '+1 (310) 361-9496', label: 'Main Business Line' },
      { id: '2', number: '+1 (424) 555-0123', label: 'Support Line' },
      { id: '3', number: '+1 (818) 555-0456', label: 'Sales Line' }
    ],
    selectedPhoneId: '1',
    recentCalls: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

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
        
        // Set some default data for testing - showing only 10 recent calls
        setData({
          totalCalls: 156,
          totalMinutes: 587,
          totalTexts: 342,
          userPhoneNumbers: [
            { id: '1', number: '+1 (310) 361-9496', label: 'Main Business Line' },
            { id: '2', number: '+1 (424) 555-0123', label: 'Support Line' }
          ],
          selectedPhoneId: '1',
          recentCalls: [
            {
              id: '1',
              summary: 'The call was brief and appears to have ended abruptly with the user indicating that it concludes. There was no significant interaction or resolution of issues during the call.',
              phoneNumber: '+18086512711',
              duration: '00:03',
              date: '09-05-2025',
              time: '10:05:38 PM'
            },
            {
              id: '2',
              summary: 'The user inquired about a dinner reservation for five people at Little Fatty, but the AI agent informed them that reservations cannot be made over the phone and offered to send a link for online reservations, which the user declined.',
              phoneNumber: '+13107406556',
              duration: '00:35',
              date: '09-05-2025',
              time: '9:08:03 PM'
            },
            {
              id: '3',
              summary: 'The user requested to speak with a representative, and the AI agent successfully transferred the call to a representative after confirming the request.',
              phoneNumber: '+16619930444',
              duration: '00:27',
              date: '09-05-2025',
              time: '8:48:29 PM'
            },
            {
              id: '4',
              summary: 'The user inquired about whether any food at Little Fatty contains MSG. The AI agent was unable to provide that information and successfully transferred the user to a restaurant representative for further assistance.',
              phoneNumber: '+15126572638',
              duration: '00:57',
              date: '09-05-2025',
              time: '8:24:41 PM'
            },
            {
              id: '5',
              summary: 'The user called to inquire about the wait time for three people but was frustrated with the AI\'s inability to provide specific information. The call was transferred to a representative, but the transfer was unsuccessful.',
              phoneNumber: '+13105695944',
              duration: '00:53',
              date: '09-05-2025',
              time: '8:16:47 PM'
            },
            {
              id: '6',
              summary: 'Customer requested information about business hours and holiday schedule. The AI agent provided complete information and the call ended successfully.',
              phoneNumber: '+14245551234',
              duration: '01:15',
              date: '09-05-2025',
              time: '7:45:22 PM'
            },
            {
              id: '7',
              summary: 'Inquiry about catering services for a corporate event. The AI agent collected initial information and transferred to the catering department.',
              phoneNumber: '+18185554567',
              duration: '02:30',
              date: '09-05-2025',
              time: '6:30:15 PM'
            },
            {
              id: '8',
              summary: 'Customer called to check on a previous order status. The AI agent was unable to access order information and attempted transfer to support.',
              phoneNumber: '+13235558901',
              duration: '00:45',
              date: '09-05-2025',
              time: '5:15:45 PM'
            },
            {
              id: '9',
              summary: 'Request for directions to the restaurant location. The AI agent provided the address and offered to send a text message with directions.',
              phoneNumber: '+16265552345',
              duration: '00:28',
              date: '09-05-2025',
              time: '4:45:30 PM'
            },
            {
              id: '10',
              summary: 'Customer complaint about a recent experience. The AI agent listened to the concern and successfully transferred to a manager for resolution.',
              phoneNumber: '+17145556789',
              duration: '03:12',
              date: '09-05-2025',
              time: '3:20:10 PM'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const handleSignOut = () => {
    // Add sign out logic here
    window.location.href = '/sign-in';
  };

  const handleViewCall = (callId) => {
    // Navigate to call details page
    window.location.href = `/calls/${callId}`;
  };

  const handlePhoneChange = (phoneId) => {
    setData({ ...data, selectedPhoneId: phoneId });
    setShowPhoneDropdown(false);
    // TODO: Fetch data for the selected phone number
  };

  const getCurrentMonthYear = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const selectedPhone = data.userPhoneNumbers.find(phone => phone.id === data.selectedPhoneId);

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
        {/* Header with Phone Selector and Account */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            {/* Phone Number Selector */}
            {data.userPhoneNumbers && data.userPhoneNumbers.length > 0 && (
            <div className="relative">
              <p className="text-sm text-gray-400 mb-2">Active Route Number</p>
              <button
                onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-lg rounded-lg px-4 py-3 border border-gray-700/50 hover:bg-gray-700/50 transition-colors min-w-[280px]"
              >
                <div className="text-left flex-1">
                  <p className="text-white font-medium">{selectedPhone?.number || 'No phone selected'}</p>
                  <p className="text-xs text-gray-400">{selectedPhone?.label || ''}</p>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showPhoneDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Phone Dropdown */}
              {showPhoneDropdown && (
                <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                  {data.userPhoneNumbers.map((phone) => (
                    <button
                      key={phone.id}
                      onClick={() => handlePhoneChange(phone.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                        phone.id === data.selectedPhoneId ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      <p className="text-white font-medium">{phone.number}</p>
                      <p className="text-xs text-gray-400">{phone.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Account Section */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-lg px-4 py-2 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-white font-medium">Account</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Account Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Call Analytics Dashboard</h1>
            <p className="text-gray-400">Monitor and track your communication metrics for {getCurrentMonthYear()}</p>
          </div>
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
        
        {/* Stats Cards - Monthly Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Total Calls</h2>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalCalls}</p>
            <p className="text-xs text-blue-400 mt-2">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-green-400 uppercase tracking-wider">Total Minutes</h2>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalMinutes}</p>
            <p className="text-xs text-green-400 mt-2">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-purple-400 uppercase tracking-wider">Total Texts</h2>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalTexts}</p>
            <p className="text-xs text-purple-400 mt-2">This month</p>
          </div>
        </div>
        
        {/* Recent Calls Table - Last 10 calls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Recent Calls</h2>
            <p className="text-sm text-gray-400">Last 10 calls</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {data.recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-2 max-w-lg">{call.summary}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300">{call.phoneNumber}</span>
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