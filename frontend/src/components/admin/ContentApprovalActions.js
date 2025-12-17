import React, { useState, useEffect } from 'react';
import { FiSend, FiCheck, FiX, FiAlertCircle, FiClock, FiEdit2 } from 'react-icons/fi';
import api from '../../api/axios';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: FiEdit2,
    description: 'This content is in draft mode and not visible to users.'
  },
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: FiClock,
    description: 'This content is awaiting approval from a Content Manager or Admin.'
  },
  published: {
    label: 'Published',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: FiCheck,
    description: 'This content is live and visible to users.'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: FiX,
    description: 'This content was rejected and needs revision.'
  }
};

const ContentApprovalActions = ({ 
  contentType, // 'college', 'listing_page', 'news', 'course', 'exam'
  contentId,
  currentStatus = 'draft',
  rejectionReason = null,
  onStatusChange,
  className = ''
}) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/admin/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const canApprove = permissions?.permissions?.manage_reviews === true;
  const canDirectPublish = permissions?.role === 'super_admin';

  const handleSubmitForReview = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(`/admin/submit-for-review/${contentType}/${contentId}`);
      setMessage({ type: 'success', text: 'Content submitted for review!' });
      onStatusChange?.('pending');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to submit' });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPublish = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(`/admin/direct-publish/${contentType}/${contentId}`);
      setMessage({ type: 'success', text: 'Content published!' });
      onStatusChange?.('published');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to publish' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(`/admin/approve/${contentType}/${contentId}`, { action: 'approve' });
      setMessage({ type: 'success', text: 'Content approved and published!' });
      onStatusChange?.('published');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to approve' });
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Content Status</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 border ${statusConfig.color}`}>
          <StatusIcon size={14} />
          {statusConfig.label}
        </span>
      </div>

      {/* Status Description */}
      <p className="text-sm text-gray-500 mb-4">{statusConfig.description}</p>

      {/* Rejection Reason */}
      {currentStatus === 'rejected' && rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-red-600 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-red-800">Rejection Feedback:</p>
              <p className="text-sm text-red-700 mt-1">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Draft or Rejected → Submit for Review */}
        {(currentStatus === 'draft' || currentStatus === 'rejected') && (
          <button
            onClick={handleSubmitForReview}
            disabled={loading || !contentId}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSend size={16} />
            Submit for Review
          </button>
        )}

        {/* Super Admin → Direct Publish (from any non-published status) */}
        {canDirectPublish && currentStatus !== 'published' && (
          <button
            onClick={handleDirectPublish}
            disabled={loading || !contentId}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiCheck size={16} />
            Publish Now
          </button>
        )}

        {/* Content Manager/Super Admin → Approve (from pending) */}
        {canApprove && currentStatus === 'pending' && (
          <button
            onClick={handleApprove}
            disabled={loading || !contentId}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiCheck size={16} />
            Approve & Publish
          </button>
        )}

        {/* Published indicator */}
        {currentStatus === 'published' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
            <FiCheck size={16} />
            Content is Live
          </div>
        )}
      </div>

      {/* Help Text */}
      {!contentId && (
        <p className="text-xs text-gray-400 mt-3">
          Save the content first to enable approval actions.
        </p>
      )}
    </div>
  );
};

export default ContentApprovalActions;
