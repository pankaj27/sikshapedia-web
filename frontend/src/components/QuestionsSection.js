import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiMessageSquare, FiUser, FiCalendar, FiChevronDown, FiChevronUp, FiSend } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from './ui/button';
import LoginPromptModal from './LoginPromptModal';

const QuestionCard = ({ question, onAnswer, isLoggedIn, onLoginRequired }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleAnswerClick = () => {
    if (isLoggedIn) {
      setShowAnswerForm(true);
    } else {
      onLoginRequired && onLoginRequired();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/questions/answer', {
        question_id: question.id,
        answer: answer.trim()
      });
      setAnswer('');
      setShowAnswerForm(false);
      onAnswer && onAnswer();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit answer. Please login first.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiHelpCircle className="text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 mb-1">{question.question}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiUser size={12} /> {question.user_name}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={12} /> {formatDate(question.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare size={12} /> {question.answers?.length || 0} answers
            </span>
          </div>
        </div>
        {question.answers?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-700 p-2"
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>
      
      {expanded && question.answers?.length > 0 && (
        <div className="mt-4 ml-12 space-y-3 border-l-2 border-blue-100 pl-4">
          {question.answers.map((ans, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700">{ans.answer}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiUser size={12} /> {ans.user_name}
                </span>
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} /> {formatDate(ans.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 ml-12">
        {showAnswerForm ? (
          <div className="space-y-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded-lg p-3 min-h-[80px]"
              placeholder="Write your answer..."
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowAnswerForm(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSubmitAnswer} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAnswerClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add an Answer
          </button>
        )}
      </div>
    </div>
  );
};

const AskQuestionModal = ({ isOpen, onClose, entityId, entityType, entityName, onSuccess }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter your question');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/questions', {
        college_id: entityId,
        entity_type: entityType,
        question: question.trim()
      });
      onSuccess && onSuccess();
      onClose();
      setQuestion('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit question. Please login first.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ask a Question</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          
          <p className="text-gray-600 mb-4">Get answers from students, alumni, and experts about {entityName}</p>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Your Question *</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border rounded-lg p-3 min-h-[120px]"
                placeholder="What would you like to know about this institution?"
              />
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {loading ? 'Submitting...' : 'Submit Question'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const QuestionsSection = ({ entityId, entityType = 'college', entityName }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.get('/auth/me');
        setIsLoggedIn(true);
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  const handleAskQuestionClick = () => {
    if (isLoggedIn) {
      setShowModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/college/${entityId}?limit=50`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) fetchQuestions();
    checkLoginStatus();
  }, [entityId]);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Questions & Answers</h2>
          <p className="text-gray-600">Get answers from students and experts</p>
        </div>
        <Button onClick={handleAskQuestionClick} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiHelpCircle size={16} />
          Ask Question
        </Button>
      </div>
      
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiHelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-4">No questions yet. Be the first to ask!</p>
          <Button onClick={handleAskQuestionClick} className="bg-blue-600 hover:bg-blue-700">
            Ask the First Question
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {questions.slice(0, visibleCount).map((q) => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                onAnswer={fetchQuestions}
                isLoggedIn={isLoggedIn}
                onLoginRequired={() => setShowLoginPrompt(true)}
              />
            ))}
          </div>
          
          {questions.length > visibleCount && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 5)}>
                Show More Questions ({questions.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
      
      <AskQuestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        entityId={entityId}
        entityType={entityType}
        entityName={entityName}
        onSuccess={fetchQuestions}
      />
    </div>
  );
};

export default QuestionsSection;
export { AskQuestionModal };
