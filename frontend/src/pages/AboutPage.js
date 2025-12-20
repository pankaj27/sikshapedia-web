import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiUsers, FiTarget, FiHeart, FiAward } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import useStaticPage from '../hooks/useStaticPage';
import StaticPageRenderer from '../components/StaticPageRenderer';

import { Link } from '../components/CustomLink';
// Fallback hardcoded content (used when CMS has no content)
const FallbackAboutPage = () => (
  <div className="min-h-screen bg-gray-50">
    <Helmet>
      <title>About Us | Admissionbuddy</title>
      <meta name="description" content="Learn about Admissionbuddy - your trusted partner in finding the perfect college and achieving your educational dreams." />
    </Helmet>

    <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Admissionbuddy</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">Your trusted partner in finding the perfect college and achieving your educational dreams</p>
      </div>
    </section>

    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Admissionbuddy was founded with a simple yet powerful vision: to make quality education accessible to every student in India and beyond. We understand that choosing the right college is one of the most important decisions in a student's life, and we're here to make that journey easier.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our platform brings together comprehensive information about colleges, entrance exams, courses, scholarships, and study abroad opportunities - all in one place. We believe that every student deserves access to accurate, up-to-date information to make informed decisions about their future.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With thousands of students using our platform every day, we've helped countless individuals find their dream colleges and embark on successful academic journeys.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiTarget className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-700">To empower students with comprehensive, accurate information and tools to make the best educational decisions for their future.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUsers className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Student First</h3>
              </div>
              <p className="text-gray-700">Every feature we build, every piece of content we create is designed with students' needs and success in mind.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiHeart className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Transparency</h3>
              </div>
              <p className="text-gray-700">We provide honest, unbiased information to help students make informed choices without any hidden agendas.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FiAward className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold">Excellence</h3>
              </div>
              <p className="text-gray-700">We strive for excellence in everything we do, from the accuracy of our data to the quality of user experience.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">For Students</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Comprehensive college database with 13+ colleges</li>
                  <li>• Detailed entrance exam information</li>
                  <li>• Course and career guidance</li>
                  <li>• Scholarship and loan information</li>
                  <li>• Study abroad opportunities</li>
                  <li>• College comparison tools</li>
                  <li>• Student reviews and Q&A</li>
                  <li>• Direct application submission</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Smart search across all content</li>
                  <li>• Eligibility checker</li>
                  <li>• Application tracking dashboard</li>
                  <li>• Expert blog articles</li>
                  <li>• Community-powered insights</li>
                  <li>• Mobile-friendly platform</li>
                  <li>• Free to use</li>
                  <li>• Regular updates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Students</h2>
          <p className="text-xl mb-6">Start your journey to your dream college today!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Get Started</Button>
            </Link>
            <Link to="/colleges">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">Explore Colleges</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  const { pageData, loading } = useStaticPage('about');

  // Check if CMS has meaningful content
  const hasCMSContent = pageData && (
    pageData.widgets?.length > 0 || 
    (pageData.hero_title && pageData.is_published)
  );

  // If CMS has content, use StaticPageRenderer
  if (hasCMSContent) {
    return (
      <StaticPageRenderer 
        pageData={pageData}
        loading={loading}
        breadcrumbItems={[{ label: 'About Us' }]}
        fallbackContent={<FallbackAboutPage />}
      />
    );
  }

  // Otherwise show fallback
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 h-48 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <FallbackAboutPage />;
};

export default AboutPage;
