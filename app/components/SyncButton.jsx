// app/components/SyncButton.jsx
'use client';

import { useState } from 'react';

export default function SyncButton({ onSync }) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    
    try {
      const response = await fetch('/api/sync-retell');
      const data = await response.json();
      
      if (response.ok) {
        setSyncStatus({
          type: 'success',
          message: `Synced ${data.synced} calls successfully`
        });
        
        // Refresh the page data
        if (onSync) onSync();
      } else {
        setSyncStatus({
          type: 'error',
          message: 'Sync failed. Please try again.'
        });
      }
    } catch (error) {
      setSyncStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          syncing 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {syncing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Syncing...
          </span>
        ) : (
          'Sync with Retell'
        )}
      </button>
      
      {syncStatus && (
        <span className={`text-sm ${
          syncStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {syncStatus.message}
        </span>
      )}
    </div>
  );
}