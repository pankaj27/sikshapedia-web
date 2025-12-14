import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiBriefcase, FiActivity, FiTrendingUp, FiAward, FiCpu, FiShield, FiBook, FiFileText, FiChevronRight } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Popular courses for hero section
  const popularCourses = [
    { name: 'BE/B.TECH COURSES', link: '/courses/btech-cse' },
    { name: 'MBBS COURSES', link: '/courses/mbbs' },
    { name: 'B.SC COURSES', link: '/courses/bsc' },
    { name: 'B.COM COURSES', link: '/courses/bcom' },
    { name: 'BA COURSES', link: '/courses/ba' },
    { name: 'MBA/PGDM COURSES', link: '/courses/mba' }
  ];

  // Level-based courses
  const levelCourses = [
    {
      title: 'After 10th Courses',
      subtitle: 'Applicable for Diploma courses & Certification courses',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop',
      link: '/courses/after-10th',
      categories: [
        { name: 'ITI', count: 16 },
        { name: 'Arts', count: 4 },
        { name: 'Dental', count: 2 },
        { name: 'Animation', count: 1 },
        { name: 'Hotel Management', count: 1 },
        { name: 'Vocational Courses', count: 1 }
      ]
    },
    {
      title: 'After 10+2 Courses',
      subtitle: 'Applicable for Degree courses & Diploma courses & Certification courses',
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&h=400&fit=crop',
      link: '/courses/after-12th',
      categories: [
        { name: 'Engineering', count: 207 },
        { name: 'Arts', count: 145 },
        { name: 'Science', count: 135 },
        { name: 'Management', count: 89 },
        { name: 'Commerce', count: 53 },
        { name: 'Education', count: 38 },
        { name: 'Medical', count: 34 },
        { name: 'Paramedical', count: 32 },
        { name: 'Design', count: 30 }
      ]
    },
    {
      title: 'Diploma Courses',
      subtitle: 'Applicable for Diploma courses',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      link: '/courses/diploma',
      categories: [
        { name: 'Management', count: 79 },
        { name: 'Arts', count: 31 },
        { name: 'Medical', count: 26 },
        { name: 'Engineering', count: 23 },
        { name: 'Law', count: 14 },
        { name: 'Paramedical', count: 14 },
        { name: 'Science', count: 13 },
        { name: 'Hotel Management', count: 10 },
        { name: 'Design', count: 9 }
      ]
    },
    {
      title: 'Certification Courses',
      subtitle: 'Applicable for Certification courses',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
      link: '/courses/certification',
      categories: [
        { name: 'Arts', count: 12 },
        { name: 'Commerce', count: 9 },
        { name: 'Management', count: 8 },
        { name: 'Science', count: 6 },
        { name: 'Design', count: 4 },
        { name: 'Computer Applications', count: 4 },
        { name: 'Education', count: 2 },
        { name: 'Law', count: 2 },
        { name: 'Agriculture', count: 2 }
      ]
    },
    {
      title: 'Masters Degree/Post Graduation Courses',
      subtitle: 'Applicable for Degree courses & Diploma courses',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop',
      link: '/courses/masters',
      categories: [
        { name: 'Management', count: 217 },
        { name: 'Engineering', count: 170 },
        { name: 'Medical', count: 126 },
        { name: 'Science', count: 113 },
        { name: 'Arts', count: 104 },
        { name: 'Law', count: 25 },
        { name: 'Commerce', count: 23 },
        { name: 'Dental', count: 20 },
        { name: 'Pharmacy', count: 15 }
      ]
    },
    {
      title: 'Ph.D Research Courses',
      subtitle: 'Applicable for Degree courses',
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&h=400&fit=crop',
      link: '/courses/phd',
      categories: [
        { name: 'Science', count: 67 },
        { name: 'Arts', count: 64 },
        { name: 'Medical', count: 35 },
        { name: 'Engineering', count: 25 },
        { name: 'Management', count: 22 },
        { name: 'Pharmacy', count: 8 },
        { name: 'Commerce', count: 7 },
        { name: 'Agriculture', count: 6 },
        { name: 'Law', count: 4 }
      ]
    }
  ];

  // Stream-based courses
  const streamCourses = [
    {
      title: 'Engineering',
      icon: <FiCpu />,
      courses: [
        { name: 'BE/B.Tech', link: '/courses/btech-cse' },
        { name: 'ME/M.Tech', link: '/courses/engineering-courses-after-12th' },
        { name: 'Polytechnic', link: '/courses/engineering-courses-after-12th' }
      ],
      link: '/courses/engineering-courses-after-12th'
    },
    {
      title: 'Medical',
      icon: <FiActivity />,
      courses: ['BAMS', 'B.Sc (Medicine)', 'BHMS', 'Bachelor of Physiotherapy(BPT)'],
      link: '/courses/medical'
    },
    {
      title: 'Science',
      icon: <FiBook />,
      courses: ['M.Sc', 'B.Sc', 'B.F.Sc', 'M.F.Sc'],
      link: '/courses/science'
    },
    {
      title: 'Commerce',
      icon: <FiBriefcase />,
      courses: ['M.Com', 'B.Com'],
      link: '/courses/commerce'
    },
    {
      title: 'Management',
      icon: <FiTrendingUp />,
      courses: ['BBA/BMS', 'MBA/PGDM', 'BHM (Hospital)', 'Executive MBA'],
      link: '/courses/management'
    },
    {
      title: 'Arts',
      icon: <FiFileText />,
      courses: ['BA', 'BFA', 'BSW', 'MA'],
      link: '/courses/arts'
    },
    {
      title: 'Computer Applications',
      icon: <FiCpu />,
      courses: ['BCA', 'MCA'],
      link: '/courses/computer-applications'
    },
    {
      title: 'Education',
      icon: <FiBookOpen />,
      courses: ['B.Ed', 'B.P.Ed', 'M.Ed', 'M.P.Ed'],
      link: '/courses/education'
    },
    {
      title: 'Law',
      icon: <FiShield />,
      courses: ['LLB', 'LLM', 'BA/BBA LLB'],
      link: '/courses/law'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=400&fit=crop)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">SEARCH FROM OVER 10000 COURSES IN INDIA</h1>
          
          {/* Popular Course Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {popularCourses.map((course, idx) => (
              <Link 
                key={idx}
                to={course.link}
                className="px-4 py-2 bg-white/90 hover:bg-white rounded-full text-sm font-medium text-gray-800 hover:text-orange-600 transition-all shadow-md"
              >
                {course.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xl"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full">
                <FiSearch size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Level-based Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">DON'T KNOW WHAT TO CHOOSE?</h2>
            <h3 className="text-2xl font-semibold text-orange-600 mb-2">CHOOSE BY YOUR LEVEL</h3>
            <p className="text-gray-600">Collegedunia.com is an extensive search engine for the students, parents, and education industry players who are seeking information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelCourses.map((level, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Link to={level.link}>
                  <img src={level.image} alt={level.title} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-5">
                  <Link to={level.link} className="text-xl font-bold text-blue-600 hover:underline mb-2 block">
                    {level.title}
                  </Link>
                  <p className="text-sm text-gray-600 mb-4">{level.subtitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {level.categories.slice(0, 6).map((cat, catIdx) => (
                      <Link 
                        key={catIdx}
                        to={`${level.link}/${cat.name.toLowerCase()}`}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded-full transition-colors"
                      >
                        <span className="font-semibold">{cat.count}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stream-based Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">CHOOSE BY INTEREST</h2>
            <p className="text-gray-600">Collegedunia.com is an extensive search engine for the students, parents, and education industry players who are seeking information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamCourses.map((stream, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Link to={stream.link} className="flex items-center gap-3 mb-4">
                  <div className="text-orange-600 text-3xl">
                    {stream.icon}
                  </div>
                  <h3 className="text-xl font-bold text-blue-600 hover:underline">{stream.title}</h3>
                </Link>
                <hr className="my-4 border-gray-200" />
                <ul className="space-y-2 mb-4">
                  {stream.courses.map((course, courseIdx) => (
                    <li key={courseIdx}>
                      <Link to={`${stream.link}/${course.toLowerCase().replace(/[\/\s()]/g, '-')}`} className="text-sm text-gray-700 hover:text-orange-600 hover:underline">
                        {course}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={stream.link} className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Explore all courses
                  <FiChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Courses Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">#TRENDING COURSE SEARCH</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCourses.map((course, idx) => (
              <Link 
                key={idx}
                to={course.link}
                className="px-5 py-2 bg-white hover:bg-orange-600 text-gray-800 hover:text-white rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                {course.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
