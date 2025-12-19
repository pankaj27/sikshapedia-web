import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiEye, FiDatabase, FiMail, FiPhone } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicyPage = () => {
  const lastUpdated = 'December 19, 2025';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FiDatabase,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you register on our platform, we collect information such as your name, email address, phone number, educational background, and preferences. This helps us personalize your experience and provide relevant college recommendations.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our website, including pages visited, search queries, time spent on pages, and device information. This helps us improve our services and user experience.'
        },
        {
          subtitle: 'Cookies and Tracking',
          text: 'We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: FiEye,
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'To provide personalized college recommendations, admission guidance, scholarship information, and educational resources tailored to your interests and goals.'
        },
        {
          subtitle: 'Communication',
          text: 'To send you important updates about admissions, deadlines, new features, and educational opportunities. You can opt out of promotional communications at any time.'
        },
        {
          subtitle: 'Platform Improvement',
          text: 'To analyze usage patterns, fix technical issues, and continuously improve our platform to better serve students and parents in their educational journey.'
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: FiLock,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal data only as long as necessary to provide our services or as required by law. You can request deletion of your data at any time by contacting us.'
        },
        {
          subtitle: 'Third-Party Sharing',
          text: 'We do not sell your personal information. We may share data with trusted partners (colleges, educational institutions) only with your consent or to provide requested services.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: FiShield,
      content: [
        {
          subtitle: 'Access & Correction',
          text: 'You have the right to access, correct, or update your personal information at any time through your account settings or by contacting our support team.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You can request a copy of your personal data in a commonly used format. We will provide this within 30 days of your request.'
        },
        {
          subtitle: 'Deletion',
          text: 'You can request deletion of your account and associated data. Some information may be retained for legal compliance or legitimate business purposes.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FiShield size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-purple-200 mt-1">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-lg text-purple-100 max-w-3xl">
            At Admissionbuddy, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-4 text-sm">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap text-gray-600 hover:text-purple-600 font-medium transition"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-24 bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
              <nav className="space-y-2">
                {sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition py-1"
                  >
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded text-xs flex items-center justify-center font-medium">
                      {idx + 1}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-10">
            {sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="bg-white rounded-xl border p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IconComponent className="text-purple-600" size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {idx + 1}. {section.title}
                      </h2>
                    </div>
                    <div className="space-y-6">
                      {section.content.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <h3 className="font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <FiMail className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:privacy@admissionbuddy.co" className="text-purple-600 font-medium hover:underline">
                      privacy@admissionbuddy.co
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <FiPhone className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href="tel:+911800123456" className="text-purple-600 font-medium hover:underline">
                      1800-123-456
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Links */}
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              <Link to="/terms" className="text-purple-600 hover:underline font-medium">
                Terms of Service →
              </Link>
              <Link to="/contact" className="text-purple-600 hover:underline font-medium">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
