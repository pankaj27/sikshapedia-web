import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const PremiumSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('checking'); // checking, success, error
  const [message, setMessage] = useState('Verifying your payment...');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 10;

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid session. Please try again.');
      return;
    }

    pollPaymentStatus();
  }, [sessionId]);

  const pollPaymentStatus = async () => {
    if (attempts >= maxAttempts) {
      setStatus('error');
      setMessage('Payment verification timed out. Please check your email for confirmation or contact support.');
      return;
    }

    try {
      const response = await api.get(`/checkout-status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
        setMessage('Payment successful! Your premium subscription is now active.');
        return;
      } else if (response.data.status === 'expired') {
        setStatus('error');
        setMessage('Payment session expired. Please try again.');
        return;
      }

      // Payment still processing, poll again
      setAttempts(prev => prev + 1);
      setTimeout(pollPaymentStatus, 2000); // Poll every 2 seconds
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Error verifying payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {status === 'checking' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <FiLoader className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Please wait, this may take a few moments...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button
                onClick={() => { window.location.href = '/dashboard'; }}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => { window.location.href = '/premium'; }}
                variant="outline"
                className="w-full"
              >
                View Subscription
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button
                onClick={() => { window.location.href = '/premium'; }}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => { window.location.href = '/dashboard'; }}
                variant="outline"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumSuccess;
