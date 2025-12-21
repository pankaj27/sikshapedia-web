import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMessageSquare, FiUser, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const QuestionsModeration = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/questions/pending?limit=100');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question and all its answers?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteAnswer = async (questionId, answerIndex) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    try {
      await api.delete(`/questions/${questionId}/answers/${answerIndex}`);
      // Refresh questions
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Questions & Answers Management</h1>
          <p className="text-sm text-gray-600 mt-1">View and moderate user questions and answers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Answered</p>
            <p className="text-2xl font-bold text-green-600">
              {questions.filter(q => q.answers?.length > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Unanswered</p>
            <p className="text-2xl font-bold text-orange-600">
              {questions.filter(q => !q.answers?.length).length}
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No questions found</p>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Question Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FiMessageSquare className="text-blue-600" size={20} />
                        <h3 className="font-bold text-gray-900">{question.question}</h3>
                      </div>
                      {/* Entity Name */}
                      <div className="mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {question.entity_type_label || 'Institution'}
                        </span>
                        <span className="ml-2 text-sm font-medium text-blue-600">
                          {question.entity_name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUser size={14} /> {question.user_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} /> {formatDate(question.created_at)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          question.answers?.length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {question.answers?.length || 0} answers
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {question.answers?.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedQuestion(
                            expandedQuestion === question.id ? null : question.id
                          )}
                        >
                          {expandedQuestion === question.id ? (
                            <FiChevronUp size={18} />
                          ) : (
                            <FiChevronDown size={18} />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Answers (Expandable) */}
                {expandedQuestion === question.id && question.answers?.length > 0 && (
                  <div className="bg-gray-50 border-t px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Answers:</h4>
                    <div className="space-y-3">
                      {question.answers.map((answer, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-700 mb-2">{answer.answer}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FiUser size={12} /> {answer.user_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiCalendar size={12} /> {formatDate(answer.created_at)}
                                </span>
                                {answer.is_institute_answer && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Institute Response
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnswer(question.id, idx)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuestionsModeration;
