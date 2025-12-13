import React, { useState, useEffect } from 'react';
import { FiCheck, FiStar, FiZap, FiAward, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        api.get('/subscription-plans'),
        api.get('/my-subscription').catch(() => ({ data: null }))
      ]);
      setPlans(plansRes.data);
      setCurrentSubscription(subRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to upgrade');
      navigate('/login');
      return;
    }

    setProcessingPayment(true);
    setSelectedPlan(plan);

    try {
      // Get origin URL from window
      const originUrl = window.location.origin;
      
      // Create Stripe checkout session
      const response = await api.post('/create-checkout-session', null, {
        params: {
          plan_id: plan.id,
          origin_url: originUrl
        }
      });

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create checkout session. Please try again.');
      setProcessingPayment(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags title="Go Premium - Unlock All Features | AdmissionBuddy" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiStar className="text-yellow-300 text-3xl" />
            <h1 className="text-5xl md:text-6xl font-bold">Go Premium</h1>
            <FiStar className="text-yellow-300 text-3xl" />
          </div>
          <p className="text-2xl text-orange-100 mb-6">Unlock unlimited access to premium features</p>
          <p className="text-lg text-orange-50 max-w-2xl mx-auto">Join 10,000+ students who upgraded to Premium and achieved their dreams</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Current Subscription Status */}
        {currentSubscription && currentSubscription.status !== 'none' && (
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🎉 You're on {currentSubscription.plan_type}!</h3>
                <p className="text-green-100">Active until {new Date(currentSubscription.end_date).toLocaleDateString()}</p>
              </div>
              <FiAward className="text-6xl text-green-200" />
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Downloads</h3>
              <p className="text-gray-600">Access all premium study materials, sample papers, and mock tests</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-gray-600">Get priority counseling sessions and dedicated support</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Content</h3>
              <p className="text-gray-600">Access to exclusive webinars, workshops, and expert guidance</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-orange-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-2 font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold text-orange-600">₹{plan.price}</span>
                    <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                  </div>
                  
                  {plan.id === 'premium-yearly' && (
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold mb-4">
                      Save ₹589 compared to monthly!
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan)}
                    disabled={processingPayment || (currentSubscription && currentSubscription.plan_type === plan.name)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    } ${processingPayment ? 'opacity-50' : ''}`}
                  >
                    {processingPayment && selectedPlan?.id === plan.id ? (
                      'Processing...'
                    ) : currentSubscription && currentSubscription.plan_type === plan.name ? (
                      'Current Plan'
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            <div className="p-6">
              <h3 className="font-bold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit/debit cards, UPI, net banking, and digital wallets through Stripe.</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">We offer limited free access to study materials. You can upgrade anytime to access all premium features.</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold mb-2">Can I upgrade from monthly to yearly?</h3>
              <p className="text-gray-600">Yes, contact support and we'll help you switch to the yearly plan with prorated pricing.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg shadow-xl p-12 text-center mt-16">
          <h2 className="text-4xl font-bold mb-4">Ready to achieve your dreams?</h2>
          <p className="text-xl text-orange-100 mb-6">Join thousands of successful students today</p>
          <Button
            onClick={() => document.querySelector('.grid').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
