import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import useStaticPage from '../hooks/useStaticPage';
import api from '../api/axios';

import { Link } from '../components/CustomLink';
const ContactPage = () => {
  const { pageData, loading } = useStaticPage('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact-inquiries', formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Use CMS data if available, otherwise defaults
  const heroTitle = pageData?.hero_title || 'Get in Touch';
  const heroSubtitle = pageData?.hero_subtitle || "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.";
  const heroGradient = pageData?.hero_background_value || 'from-blue-600 to-indigo-700';
  const metaTitle = pageData?.meta_title || 'Contact Us | Admissionbuddy';
  const metaDescription = pageData?.meta_description || 'Contact Admissionbuddy for any questions about colleges, admissions, scholarships, or study abroad programs.';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageData?.meta_keywords?.length > 0 && <meta name="keywords" content={pageData.meta_keywords.join(', ')} />}
      </Helmet>

      <section className={`bg-gradient-to-r ${heroGradient} text-white py-20`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center">
                    <p className="text-lg font-semibold">Thank you for contacting us!</p>
                    <p className="mt-2">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg min-h-32"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                      <FiSend className="mr-2" /> {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-gray-600">support@admissionbuddy.co</p>
                      <p className="text-sm text-gray-600">info@admissionbuddy.co</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-sm text-gray-600">+91-1800-123-4567</p>
                      <p className="text-sm text-gray-600">Mon-Sat: 9 AM - 6 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-gray-600">123 Education Street</p>
                      <p className="text-sm text-gray-600">New Delhi, India 110001</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/india-colleges" className="block hover:underline">Browse Colleges</Link>
                  <Link to="/exams" className="block hover:underline">Entrance Exams</Link>
                  <Link to="/scholarships" className="block hover:underline">Scholarships</Link>
                  <Link to="/blog" className="block hover:underline">Blog & Articles</Link>
                  <Link to="/about" className="block hover:underline">About Us</Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold">9 AM - 6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold">10 AM - 4 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render CMS Widgets if available */}
      {pageData?.widgets?.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          {pageData.widgets
            .filter(w => w.enabled)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(widget => {
              if (widget.type === 'faq') {
                return (
                  <div key={widget.id} className="max-w-4xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">{widget.title || 'FAQ'}</h2>
                    <div className="space-y-3">
                      {widget.content?.items?.map((item, idx) => (
                        <details key={idx} className="bg-white rounded-lg border p-4">
                          <summary className="font-medium cursor-pointer">{item.question}</summary>
                          <p className="mt-3 text-gray-600">{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
