import React from 'react';
import { FiClock, FiRefreshCw, FiX, FiSave } from 'react-icons/fi';

/**
 * Banner component to show when a draft is available
 */
const DraftRestoreBanner = ({ 
  onRestore, 
  onDiscard, 
  savedAt,
  lastSaved,
  isVisible = true 
}) => {
  if (!isVisible) return null;

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <FiSave className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800">Draft Found!</h4>
            <p className="text-sm text-blue-600 mt-1">
              You have an unsaved draft from {formatTime(savedAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRestore}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw size={14} />
            Restore Draft
          </button>
          <button
            onClick={onDiscard}
            className="flex items-center gap-1 px-3 py-1.5 border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-100 transition-colors"
          >
            <FiX size={14} />
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Small status indicator showing auto-save status
 */
export const AutoSaveIndicator = ({ lastSaved, saving = false }) => {
  if (saving) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin h-3 w-3 border-2 border-orange-500 border-t-transparent rounded-full"></div>
        <span>Saving...</span>
      </div>
    );
  }

  if (!lastSaved) return null;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <FiClock size={14} />
      <span>Draft saved {formatTimeAgo(lastSaved)}</span>
    </div>
  );
};

export default DraftRestoreBanner;
