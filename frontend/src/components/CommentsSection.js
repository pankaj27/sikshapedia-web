import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiUser, FiCalendar, FiSend, FiMoreVertical, FiTrash2, FiFlag } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from './ui/button';

const CommentCard = ({ comment, onReply, onDelete, currentUserId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? 'Just now' : `${mins} minutes ago`;
      }
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyForm(false);
    } catch (err) {
      alert('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiUser className="text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{comment.user_name}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded">
                <FiMoreVertical size={16} className="text-gray-500" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  {currentUserId === comment.user_id && (
                    <button
                      onClick={() => { onDelete(comment.id); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
                  <button
                    onClick={() => { alert('Comment reported'); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiFlag size={14} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700 mt-1">{comment.text}</p>
          
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Reply
            </button>
            {comment.replies?.length > 0 && (
              <span className="text-sm text-gray-500">{comment.replies.length} replies</span>
            )}
          </div>
          
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                placeholder="Write a reply..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <Button size="sm" onClick={handleSubmitReply} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
                <FiSend size={14} />
              </Button>
            </div>
          )}
          
          {comment.replies?.length > 0 && (
            <div className="mt-3 ml-4 space-y-3 border-l-2 border-purple-100 pl-4">
              {comment.replies.map((reply, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{reply.user_name}</span>
                    <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({ entityId, entityType = 'college', entityName }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${entityType}/${entityId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUserId(res.data.id);
    } catch (err) {
      // Not logged in
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchComments();
      fetchCurrentUser();
    }
  }, [entityId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/comments', {
        entity_id: entityId,
        entity_type: entityType,
        text: newComment.trim()
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to post comment. Please login first.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId, replyText) => {
    await api.post(`/comments/${commentId}/reply`, { text: replyText });
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Comments & Discussion</h2>
        <p className="text-gray-600">Join the conversation about {entityName}</p>
      </div>
      
      {/* Comment Input */}
      <div className="mb-6 bg-gray-50 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser className="text-purple-600" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-lg p-3 min-h-[80px] resize-none"
              placeholder="Share your thoughts, experiences, or ask the community..."
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()} className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                <FiSend size={16} />
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiMessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600">No comments yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">{comments.length} comments</p>
          <div className="divide-y">
            {comments.slice(0, visibleCount).map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                currentUserId={currentUserId}
              />
            ))}
          </div>
          
          {comments.length > visibleCount && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 10)}>
                Load More Comments ({comments.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
