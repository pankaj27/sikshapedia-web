import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { Button } from '../ui/button';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const topExams = [
    { name: 'JEE Main', link: '/exams' },
    { name: 'NEET', link: '/exams' },
    { name: 'CAT', link: '/exams' },
    { name: 'CUET', link: '/exams' },
    { name: 'GATE', link: '/exams' },
    { name: 'JEE Advanced', link: '/exams' }
  ];

  const topColleges = [
    { name: 'Engineering Colleges', link: '/colleges?type=Engineering' },
    { name: 'Medical Colleges', link: '/colleges?type=Medical' },
    { name: 'MBA Colleges', link: '/colleges?type=Management' },
    { name: 'Law Colleges', link: '/colleges?type=Law' }
  ];

  const topCourses = [
    { name: 'B.Tech', link: '/courses' },
    { name: 'MBA/PGDM', link: '/courses' },
    { name: 'MBBS', link: '/courses' },
    { name: 'B.Com', link: '/courses' },
    { name: 'BA', link: '/courses' },
    { name: 'B.Sc', link: '/courses' }
  ];

  const studyAbroad = [
    { name: 'Study in USA', link: '/study-abroad' },
    { name: 'Study in UK', link: '/study-abroad' },
    { name: 'Study in Canada', link: '/study-abroad' },
    { name: 'Study in Australia', link: '/study-abroad' }
  ];

  const resources = [
    { name: 'Scholarships', link: '/scholarships' },
    { name: 'Education Loans', link: '/loans' },
    { name: 'Compare Colleges', link: '/compare' },
    { name: 'College Predictor', link: '/eligibility-checker' },
    { name: 'Blog', link: '/blog' }
  ];

  const quickLinks = [
    { name: 'About Us', link: '/about' },
    { name: 'Contact Us', link: '/contact' },
    { name: 'Privacy Policy', link: '/privacy' },
    { name: 'Terms & Conditions', link: '/terms' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">
                Subscribe to our Newsletter
              </h3>
              <p className="text-orange-100 text-sm">
                Get College Notifications, Exam Notifications and News Updates
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button type="submit" className="bg-white text-orange-600 hover:bg-gray-100 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Top Exams */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP EXAMS</h4>
            <ul className="space-y-2">
              {topExams.map((exam, idx) => (
                <li key={idx}>
                  <Link to={exam.link} className="text-sm hover:text-orange-500 transition-colors">
                    {exam.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Colleges */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP COLLEGES</h4>
            <ul className="space-y-2">
              {topColleges.map((college, idx) => (
                <li key={idx}>
                  <Link to={college.link} className="text-sm hover:text-orange-500 transition-colors">
                    {college.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Courses */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">TOP COURSES</h4>
            <ul className="space-y-2">
              {topCourses.map((course, idx) => (
                <li key={idx}>
                  <Link to={course.link} className="text-sm hover:text-orange-500 transition-colors">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Abroad */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">STUDY ABROAD</h4>
            <ul className="space-y-2">
              {studyAbroad.map((country, idx) => (
                <li key={idx}>
                  <Link to={country.link} className="text-sm hover:text-orange-500 transition-colors">
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">RESOURCES</h4>
            <ul className="space-y-2">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <Link to={resource.link} className="text-sm hover:text-orange-500 transition-colors">
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">QUICK LINKS</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.link} className="text-sm hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-8" />
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} AdmissionBuddy. All rights reserved.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
