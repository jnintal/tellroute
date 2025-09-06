// app/calls/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CallDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching call details
    const fetchCallDetails = async () => {
      try {
        // In production, this would be an API call
        // const response = await fetch(`/api/calls/${params.id}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockCall = {
          id: params.id,
          direction: 'Inbound',
          phoneNumber: '+13107406556',
          date: '09/05/2025',
          time: '9:08:03 PM',
          duration: '00:35',
          status: 'completed',
          summary: 'The user inquired about a dinner reservation for five people at Little Fatty, but the AI agent informed them that reservations cannot be made over the phone and offered to send a link for online reservations, which the user declined.',
          sentiment: 'Neutral',
          transcript: [
            { speaker: 'AI', text: 'Thank you for calling Little Fatty. How can I help you today?', timestamp: '00:00' },
            { speaker: 'Customer', text: 'Hi, I would like to make a dinner reservation for tonight.', timestamp: '00:03' },
            { speaker: 'AI', text: 'I understand you would like to make a reservation. Unfortunately, I cannot make reservations over the phone, but I can send you a link to our online reservation system. Would you like me to send that to you?', timestamp: '00:08' },
            { speaker: 'Customer', text: 'How many people will be in your party?', timestamp: '00:18' },
            { speaker: 'AI', text: 'I understand you are asking about your party size. To make a reservation, you will need to use our online system. Would you like me to send you the link?', timestamp: '00:22' },
            { speaker: 'Customer', text: 'There will be five of us.', timestamp: '00:28' },
            { speaker: 'AI', text: 'Perfect, a party of five. I can send you the link to make your reservation online. Would you like me to text it to you?', timestamp: '00:31' },
            { speaker: 'Customer', text: 'No, that\'s okay. Thank you.', timestamp: '00:34' },
            { speaker: 'AI', text: 'You\'re welcome! Have a great day!', timestamp: '00:35' }
          ],
          actionItems: [
            'Customer declined online reservation link',
            'Party size: 5 people',
            'Requested same-day reservation'
          ],
          recording_url: null
        };
        
        setCall(mockCall);
      } catch (error) {
        console.error('Error fetching call details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading call details...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Call not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Call Details</h1>
          </div>
        </div>

        {/* Call Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Phone Number</p>
            <p className="text-white font-mono">{call.phoneNumber}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Direction</p>
            <p className="text-white">{call.direction}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Duration</p>
            <p className="text-white">{call.duration}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Date & Time</p>
            <p className="text-white">{call.date} {call.time}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Call Summary
          </h2>
          <p className="text-gray-300 leading-relaxed">{call.summary}</p>
          
          {call.sentiment && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-400 mr-2">Sentiment:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                call.sentiment === 'Positive' ? 'bg-green-900/50 text-green-400 border border-green-500/50' :
                call.sentiment === 'Negative' ? 'bg-red-900/50 text-red-400 border border-red-500/50' :
                'bg-gray-700/50 text-gray-400 border border-gray-600/50'
              }`}>
                {call.sentiment}
              </span>
            </div>
          )}
        </div>

        {/* Action Items */}
        {call.actionItems && call.actionItems.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Key Points
            </h2>
            <ul className="space-y-2">
              {call.actionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Transcript
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {call.transcript.map((entry, index) => (
              <div key={index} className={`flex ${entry.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-lg ${entry.speaker === 'AI' ? 'order-1' : 'order-2'}`}>
                  <div className={`rounded-lg p-3 ${
                    entry.speaker === 'AI' 
                      ? 'bg-blue-900/30 border border-blue-700/50' 
                      : 'bg-gray-700/50 border border-gray-600/50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        entry.speaker === 'AI' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {entry.speaker}
                      </span>
                      <span className="text-xs text-gray-500">{entry.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{entry.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recording Player (if available) */}
        {call.recording_url && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Call Recording
            </h2>
            <audio controls className="w-full">
              <source src={call.recording_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}