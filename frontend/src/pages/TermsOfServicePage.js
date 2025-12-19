import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFileText, FiCheckCircle, FiAlertCircle, FiUsers, FiBook, FiMail, FiPhone } from 'react-icons/fi';
import useStaticPage from '../hooks/useStaticPage';
import StaticPageRenderer from '../components/StaticPageRenderer';

// Default sections for fallback
const defaultSections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FiCheckCircle,
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using Admissionbuddy, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.'
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian consent to use the platform.'
      },
      {
        subtitle: 'Account Registration',
        text: 'To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.'
      }
    ]
  },
  {
    id: 'services',
    title: 'Our Services',
    icon: FiBook,
    content: [
      {
        subtitle: 'Information Services',
        text: 'Admissionbuddy provides educational information including college details, course information, admission guidance, scholarship listings, and educational resources. We strive to keep information accurate but cannot guarantee completeness.'
      },
      {
        subtitle: 'No Guarantee of Admission',
        text: 'Our platform provides guidance and information only. We do not guarantee admission to any college, university, or program. Admission decisions are made solely by the respective institutions.'
      },
      {
        subtitle: 'Third-Party Links',
        text: 'Our platform may contain links to third-party websites. We are not responsible for the content, privacy practices, or services of these external sites.'
      }
    ]
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    icon: FiUsers,
    content: [
      {
        subtitle: 'Acceptable Use',
        text: "You agree to use the platform only for lawful purposes. You must not misuse our services, attempt unauthorized access, or interfere with the platform's operation."
      },
      {
        subtitle: 'User Content',
        text: 'If you submit reviews, comments, or other content, you grant us a non-exclusive license to use, display, and distribute such content. You are responsible for ensuring your content is accurate and does not violate any rights.'
      },
      {
        subtitle: 'Prohibited Activities',
        text: 'You must not: post false information, spam other users, attempt to scrape or copy our content, impersonate others, or use the platform for commercial purposes without permission.'
      }
    ]
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: FiFileText,
    content: [
      {
        subtitle: 'Our Content',
        text: 'All content on Admissionbuddy, including text, graphics, logos, and software, is our property or licensed to us. You may not copy, modify, or distribute our content without permission.'
      },
      {
        subtitle: 'Trademarks',
        text: 'Admissionbuddy and associated logos are trademarks. College names, logos, and other marks belong to their respective owners and are used for informational purposes only.'
      },
      {
        subtitle: 'User License',
        text: 'We grant you a limited, non-exclusive license to access and use our platform for personal, non-commercial purposes in accordance with these terms.'
      }
    ]
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers & Limitations',
    icon: FiAlertCircle,
    content: [
      {
        subtitle: 'Information Accuracy',
        text: 'While we strive to provide accurate information, we make no warranties about the completeness, reliability, or accuracy of the content. College information may change; always verify with official sources.'
      },
      {
        subtitle: 'Service Availability',
        text: 'We do not guarantee uninterrupted access to our platform. We may modify, suspend, or discontinue services at any time without notice.'
      },
      {
        subtitle: 'Limitation of Liability',
        text: 'To the maximum extent permitted by law, Admissionbuddy shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.'
      }
    ]
  }
];

// Fallback component with original design
const FallbackTermsPage = () => {
  const lastUpdated = 'December 19, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms of Service | Admissionbuddy</title>
        <meta name="description" content="Read the terms and conditions for using Admissionbuddy's educational platform and services." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FiFileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
              <p className="text-blue-200 mt-1">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 max-w-3xl">
            Welcome to Admissionbuddy. These terms govern your use of our platform and services. Please read them carefully before using our website.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-4 text-sm">
            {defaultSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap text-gray-600 hover:text-blue-600 font-medium transition"
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
                {defaultSections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition py-1"
                  >
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-medium">
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
            {defaultSections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="bg-white rounded-xl border p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="text-blue-600" size={24} />
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
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <FiMail className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:legal@admissionbuddy.co" className="text-blue-600 font-medium hover:underline">
                      legal@admissionbuddy.co
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <FiPhone className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href="tel:+911800123456" className="text-blue-600 font-medium hover:underline">
                      1800-123-456
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Links */}
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy →
              </Link>
              <Link to="/contact" className="text-blue-600 hover:underline font-medium">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TermsOfServicePage = () => {
  const { pageData, loading } = useStaticPage('terms');

  // Check if CMS has meaningful content
  const hasCMSContent = pageData && (
    pageData.widgets?.length > 0 || 
    (pageData.hero_title && pageData.is_published)
  );

  if (hasCMSContent) {
    return (
      <StaticPageRenderer 
        pageData={pageData}
        loading={loading}
        breadcrumbItems={[{ label: 'Terms of Service' }]}
        fallbackContent={<FallbackTermsPage />}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 h-48 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <FallbackTermsPage />;
};

export default TermsOfServicePage;
