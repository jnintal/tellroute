// app/calls/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function CallDetail({ params }) {
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);

  useEffect(() => {
    // Mock data for the specific call based on ID
    const mockCallData = {
      '1': {
        id: '1',
        date: 'Friday, September 5, 2025',
        time: '10:05:38 PM (Los Angeles)',
        duration: '0 minutes 03 seconds',
        direction: 'Inbound',
        from: '+18086512711',
        to: '+13103619496',
        summary: 'The call was brief and appears to have ended abruptly with the user indicating that it concludes. There was no significant interaction or resolution of issues during the call.',
        recording: '/recordings/sample.mp3',
        transcript: [
          { speaker: 'Agent', text: 'This call may be recorded for quality purposes.' },
          { speaker: 'User', text: 'This concludes' },
          { speaker: 'Agent', text: 'recorded for quality purposes,' }
        ]
      },
      '2': {
        id: '2',
        date: 'Friday, September 5, 2025',
        time: '9:08:03 PM (Los Angeles)',
        duration: '0 minutes 35 seconds',
        direction: 'Inbound',
        from: '+13107406556',
        to: '+13103619496',
        summary: 'The user inquired about a dinner reservation for five people at Little Fatty, but the AI agent informed them that reservations cannot be made over the phone and offered to send a link for online reservations, which the user declined.',
        recording: '/recordings/sample.mp3',
        transcript: [
          { speaker: 'Agent', text: 'Thank you for calling Little Fatty, how may I help you?' },
          { speaker: 'User', text: 'I would like to make a reservation for five people' },
          { speaker: 'Agent', text: 'I apologize, but we cannot make reservations over the phone. I can send you a link for online reservations.' },
          { speaker: 'User', text: 'No thank you' }
        ]
      }
    };
    
    // Get the call data for this ID, or use default
    const callData = mockCallData[params.id] || mockCallData['1'];
    setCall(callData);
    setLoading(false);
  }, [params.id]);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleSummarize = () => {
    alert('ChatGPT summarization feature coming soon');
  };

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
          <button onClick={handleBack} className="mt-4 text-blue-400 hover:text-blue-300">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
          <h1 className="text-3xl font-bold text-white">Call from {call.from}</h1>
        </div>

        {/* Call Details Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Date:</p>
              <p className="text-white">{call.date}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Time:</p>
              <p className="text-white">{call.time}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Duration:</p>
              <p className="text-white">{call.duration}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Direction:</p>
              <p className="text-white">{call.direction}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">From:</p>
              <p className="text-white font-mono">{call.from}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">To:</p>
              <p className="text-white font-mono">{call.to}</p>
            </div>
          </div>
        </div>

        {/* Recording Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recording:</h2>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <audio controls className="w-full">
              <source src={call.recording} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
            Download audio
          </button>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          <p className="text-gray-300 leading-relaxed">{call.summary}</p>
        </div>

        {/* Transcript Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Transcript</h2>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </button>
          </div>
          
          {showTranscript && (
            <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
              {call.transcript.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-400 font-medium min-w-[80px]">
                    {entry.speaker}:
                  </span>
                  <span className="text-gray-300">{entry.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}