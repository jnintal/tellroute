// app/components/SMSMetrics.tsx
'use client';

import { useSMSCount } from '../hooks/useSMSCount';

export default function SMSMetrics() {
  const { totalSMS, sentToday, receivedToday, loading, error, refresh } = useSMSCount();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-500/20 p-3 rounded-lg">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <button 
            onClick={refresh}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-sm text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total SMS */}
      <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-500/20 p-3 rounded-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">All time</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{totalSMS.toLocaleString()}</div>
        <div className="text-sm text-gray-400">Total Messages</div>
      </div>

      {/* Sent Today */}
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Today</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{sentToday.toLocaleString()}</div>
        <div className="text-sm text-gray-400">Sent Messages</div>
      </div>

      {/* Received Today */}
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Today</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{receivedToday.toLocaleString()}</div>
        <div className="text-sm text-gray-400">Received Messages</div>
      </div>
    </div>
  );
}