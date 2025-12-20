import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../api/axios';

const PendingAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchAnswers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/rewards/pending-answers?limit=${limit}&offset=${page * limit}`);
      setAnswers(response.data.answers);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [page]);

  const handleAction = async (answerId, action) => {
    setProcessing(answerId);
    try {
      await api.post(`/admin/rewards/answers/${answerId}/action`, { action });
      setAnswers(answers.filter(a => a.id !== answerId));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error processing answer:', error);
      alert('Error processing answer');
    } finally {
      setProcessing(null);
    }
  };

  if (loading && answers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pending Answers</h1>
            <p className="text-gray-500">{total} answers waiting for approval (10 points each)</p>
          </div>
        </div>

        {answers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">All caught up!</h2>
            <p className="text-gray-500">No pending answers to approve.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {answer.user_name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{answer.user_name}</p>
                        <p className="text-sm text-gray-500">{new Date(answer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-500 mb-1">Question:</p>
                      <p className="text-gray-700">{answer.question_text}</p>
                      {answer.college_name && (
                        <p className="text-sm text-blue-600 mt-1">📍 {answer.college_name}</p>
                      )}
                    </div>

                    {/* Answer */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Answer:</p>
                      <p className="text-gray-700">{answer.answer_text}</p>
                    </div>

                    {/* Points Info */}
                    <div className="mt-3">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        🎯 10 points will be awarded
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleAction(answer.id, 'approve')}
                      disabled={processing === answer.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {processing === answer.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FiCheck className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(answer.id, 'reject')}
                      disabled={processing === answer.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-gray-600">
              Page {page + 1} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * limit >= total}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PendingAnswers;
