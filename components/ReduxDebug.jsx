'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatCacheAge } from '@/lib/cacheUtils';

export default function ReduxDebug() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get state from all slices
  const communities = useSelector(state => state.communities);
  const events = useSelector(state => state.events);
  const user = useSelector(state => state.user);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Redux Debug"
      >
        🔧
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Redux State Debug</h3>
          </div>
          
          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            {/* Communities State */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Communities</h4>
              <div className="text-xs space-y-1">
                <div>Status: <span className={`px-2 py-1 rounded text-xs ${
                  communities.status === 'idle' ? 'bg-gray-100 text-gray-700' :
                  communities.status === 'loading' ? 'bg-blue-100 text-blue-700' :
                  communities.status === 'success' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{communities.status}</span></div>
                <div>Data Count: {communities.data.length}</div>
                <div>Cache: {formatCacheAge(communities.cacheTimestamp)}</div>
                {communities.error && (
                  <div className="text-red-600">Error: {communities.error}</div>
                )}
              </div>
            </div>

            {/* Events State */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Events</h4>
              <div className="text-xs space-y-1">
                <div>Status: <span className={`px-2 py-1 rounded text-xs ${
                  events.status === 'idle' ? 'bg-gray-100 text-gray-700' :
                  events.status === 'loading' ? 'bg-blue-100 text-blue-700' :
                  events.status === 'success' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{events.status}</span></div>
                <div>Data Count: {events.data.length}</div>
                <div>Cache: {formatCacheAge(events.cacheTimestamp)}</div>
                {events.error && (
                  <div className="text-red-600">Error: {events.error}</div>
                )}
              </div>
            </div>

            {/* User State */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">User</h4>
              <div className="text-xs space-y-1">
                <div>Status: <span className={`px-2 py-1 rounded text-xs ${
                  user.status === 'idle' ? 'bg-gray-100 text-gray-700' :
                  user.status === 'loading' ? 'bg-blue-100 text-blue-700' :
                  user.status === 'success' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{user.status}</span></div>
                <div>Authenticated: {user.isAuthenticated ? 'Yes' : 'No'}</div>
                <div>Communities: {user.userCommunities.length}</div>
                <div>Events: {user.userEvents.length}</div>
                {user.error && (
                  <div className="text-red-600">Error: {user.error}</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
