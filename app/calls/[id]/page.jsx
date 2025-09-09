// app/calls/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallDetail({ params }) {
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCallDetails();
  }, [params.id]);

  const fetchCallDetails = async () => {
    try {
      const response = await fetch(`/api/calls/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCall(data);
      } else {
        console.error('Failed to fetch call');
      }
    } catch (error) {
      console.error('Error fetching call details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 minutes 0 seconds';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs.toString().padStart(2, '0')} second${secs !== 1 ? 's' : ''}`;
  };

  const formatTranscript = (transcript) => {
    if (!transcript) return [];
    
    // If transcript is a string, try to parse it
    if (typeof transcript === 'string') {
      try {
        // Try to parse as JSON first
        transcript = JSON.parse(transcript);
      } catch {
        // If it's a plain text transcript, parse it by looking for Agent: and User: patterns
        const lines = transcript.split(/(?=Agent:|User:|System:)/);
        return lines.map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('Agent:')) {
            return { speaker: 'Agent', text: trimmed.replace('Agent:', '').trim() };
          } else if (trimmed.startsWith('User:')) {
            return { speaker: 'Caller', text: trimmed.replace('User:', '').trim() };
          } else if (trimmed.startsWith('System:')) {
            return { speaker: 'System', text: trimmed.replace('System:', '').trim() };
          } else {
            return { speaker: 'System', text: trimmed };
          }
        }).filter(item => item.text);
      }
    }
    
    // If it's an array, format it properly
    if (Array.isArray(transcript)) {
      return transcript.map(item => ({
        speaker: item.role === 'agent' || item.role === 'assistant' ? 'Agent' : 
                 item.role === 'user' ? 'Caller' : 'System',
        text: item.content || item.message || item.text || ''
      }));
    }
    
    return [];
  };

  const handleBack = () => {
    router.push('/calls');
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
          <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Back to Calls
          </button>
        </div>
      </div>
    );
  }

  const transcriptData = formatTranscript(call.transcript);

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
            Back to Calls
          </button>
          <h1 className="text-3xl font-bold text-white">Call from {call.from_number}</h1>
        </div>

        {/* Call Details Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Date:</p>
              <p className="text-white">
                {new Date(call.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Time:</p>
              <p className="text-white">
                {new Date(call.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Duration:</p>
              <p className="text-white">{formatDuration(call.duration_seconds)}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Direction:</p>
              <p className="text-white">{call.direction || 'Inbound'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">From:</p>
              <p className="text-white font-mono">{call.from_number}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">To:</p>
              <p className="text-white font-mono">{call.to_number}</p>
            </div>
          </div>
        </div>

        {/* Recording Section */}
        {call.recording_url && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recording:</h2>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <audio controls className="w-full">
                <source src={call.recording_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <a 
              href={call.recording_url}
              download
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              Download audio
            </a>
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          <p className="text-gray-300 leading-relaxed">
            {call.summary || 'The call was brief and appears to have ended abruptly with the user indicating that it concludes. There was no significant interaction or resolution of issues during the call.'}
          </p>
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
            <div className="space-y-4 bg-gray-900/50 rounded-lg p-6 max-h-96 overflow-y-auto">
              {transcriptData.length > 0 ? (
                transcriptData.map((entry, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <div className={`font-semibold text-sm ${
                      entry.speaker === 'Agent' ? 'text-blue-400' : 
                      entry.speaker === 'Caller' ? 'text-green-400' : 
                      'text-gray-400'
                    }`}>
                      {entry.speaker}:
                    </div>
                    <div className="text-gray-300 pl-4">
                      {entry.text}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No transcript available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}