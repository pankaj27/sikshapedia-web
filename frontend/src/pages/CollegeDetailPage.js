import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiUser, FiChevronDown, FiChevronUp, FiDownload, FiCheckCircle, FiPhone, FiMail, FiGlobe, FiExternalLink } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [likes, setLikes] = useState(245);
  const [dislikes, setDislikes] = useState(12);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges/${id}`);
      setCollege(response.data);
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'info', label: 'Info', icon: '📋' },
    { id: 'courses', label: 'Courses & Fees', icon: '📚' },
    { id: 'admission', label: 'Admissions', icon: '📝' },
    { id: 'cutoff', label: 'Cutoff', icon: '📊' },
    { id: 'placement', label: 'Placement', icon: '💼' },
    { id: 'ranking', label: 'Ranking', icon: '🏆' },
    { id: 'scholarship', label: 'Scholarship', icon: '💰' },
    { id: 'facilities', label: 'Facilities', icon: '🏫' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleLike = () => {
    if (userVote === 'like') {
      // Remove like
      setLikes(likes - 1);
      setUserVote(null);
    } else if (userVote === 'dislike') {
      // Change from dislike to like
      setLikes(likes + 1);
      setDislikes(dislikes - 1);
      setUserVote('like');
    } else {
      // Add like
      setLikes(likes + 1);
      setUserVote('like');
    }
  };

  const handleDislike = () => {
    if (userVote === 'dislike') {
      // Remove dislike
      setDislikes(dislikes - 1);
      setUserVote(null);
    } else if (userVote === 'like') {
      // Change from like to dislike
      setDislikes(dislikes + 1);
      setLikes(likes - 1);
      setUserVote('dislike');
    } else {
      // Add dislike
      setDislikes(dislikes + 1);
      setUserVote('dislike');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <Link to="/colleges" className="text-blue-600 hover:underline">Back to Colleges</Link>
        </div>
      </div>
    );
  }

  const tableOfContents = [
    { num: '01', title: `${college.name} Admission 2026 Dates`, id: 'admission-dates' },
    { num: '02', title: `${college.name} Fees 2026`, id: 'fees' },
    { num: '03', title: `${college.name} Ranking`, id: 'ranking' },
    { num: '04', title: `${college.name} Admission 2026`, id: 'admission' },
    { num: '05', title: `${college.name} Cutoff`, id: 'cutoff' },
    { num: '06', title: `${college.name} Placement`, id: 'placement' },
    { num: '07', title: `${college.name} vs Other Colleges`, id: 'comparison' },
    { num: '08', title: `${college.name} Campus & Facilities`, id: 'facilities' },
    { num: '09', title: `${college.name} FAQs`, id: 'faqs' },
  ];

  return (
    <div className="min-h-screen bg-white pt-2">
      {/* BREADCRUMB */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/colleges" className="hover:text-orange-600">Colleges</Link>
            <span>/</span>
            <span className="text-gray-900">{college.name}</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {college.images?.[0] ? (
                <img src={college.images[0]} alt={college.name} className="w-28 h-28 rounded border object-cover" />
              ) : (
                <div className="w-28 h-28 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{college.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-orange-600" size={14} />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <span>|</span>
                    <span className="font-medium">{college.type}</span>
                    <span>|</span>
                    <span>Estd. {college.established || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < Math.floor(college.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            size={18}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">{college.rating || '4.5'}</span>
                      <span className="text-gray-600 text-sm">({college.reviews || 344} Reviews)</span>
                    </div>
                    
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <FiCheckCircle className="mr-2" size={16} />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      <FiDownload className="mr-2" size={16} />
                      Download Brochure
                    </Button>
                  </div>
                </div>

                {/* LIKE/DISLIKE */}
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      userVote === 'like' 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{userVote === 'like' ? '👍' : '👍'}</span>
                    <span className={`text-sm font-semibold ${userVote === 'like' ? 'text-green-600' : 'text-gray-700'}`}>
                      {likes}
                    </span>
                  </button>
                  <button 
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      userVote === 'dislike' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{userVote === 'dislike' ? '👎' : '👎'}</span>
                    <span className={`text-sm font-semibold ${userVote === 'dislike' ? 'text-red-600' : 'text-gray-700'}`}>
                      {dislikes}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY NAVIGATION MENU */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-orange-600 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LATEST UPDATES */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{college.name} Latest Updates and News</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-200 px-2 py-0.5 rounded flex-shrink-0">12 Dec, 2025</span>
                <p className="text-xs text-gray-800">
                  <strong>Admission 2026</strong> applications are now open. Apply before the deadline.
                </p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded flex-shrink-0">06 Dec, 2025</span>
                <p className="text-xs text-gray-800">
                  <strong>Placement Results 2024</strong> announced with highest package of ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
              <FiUser size={18} />
            </div>
            <div>
              <Link to="#" className="text-sm font-semibold text-gray-900 hover:text-orange-600">Content Team</Link>
              <p className="text-xs text-gray-600">Content Writer | Updated 3+ months ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* SEO CONTENT SECTION (Collapsible) */}
            <div className="mb-8 pb-8 border-b">
              {/* INTRO PREVIEW - 3 LINES */}
              <div className="mb-4">
                <p className={`text-gray-800 leading-relaxed ${!showContent ? 'line-clamp-3' : ''}`}>
                  {college.name} is a <strong>{college.type}</strong> established in <strong>{college.established || 'N/A'}</strong>. 
                  As per the data, the college is one of the preferred institutions for students. 
                  {college.name} Ranking is <strong>#{Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies. 
                  {college.name} offers various programs with total fees ranging from <strong>₹{(college.average_fees / 100000).toFixed(2)} Lakhs</strong>. 
                  Admission is based on national-level entrance exams followed by counselling. 
                  As per {college.name} Placements, the average package was <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'} LPA</strong>. 
                  The top recruiters included leading companies from various sectors.
                </p>
              </div>

              {/* READ MORE BUTTON */}
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowContent(!showContent)}
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-full"
                >
                  <span>{showContent ? 'Read Less' : 'Read More'}</span>
                  {showContent ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              </div>

              {/* SEO EXPANDABLE CONTENT */}
              {showContent && (
                <div className="space-y-8">
                  {/* FULL INTRO PARAGRAPHS */}
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {college.name} is a <strong>{college.type}</strong> established in <strong>{college.established || 'N/A'}</strong>. 
                      As per the data, the college is one of the preferred institutions for students. 
                      {college.name} Ranking is <strong>#{Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {college.name} offers various programs with total fees ranging from <strong>₹{(college.average_fees / 100000).toFixed(2)} Lakhs</strong>. 
                      Admission is based on national-level entrance exams followed by counselling.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      As per {college.name} Placements, the average package was <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'} LPA</strong>. 
                      The top recruiters included leading companies from various sectors.
                    </p>
                  </div>

                  {/* VIDEO */}
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                      </div>
                      <p className="text-sm text-gray-600">Video: Complete Guide to {college.name}</p>
                    </div>
                  </div>

                  {/* TABLE OF CONTENTS */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className="text-left text-sm text-blue-600 hover:underline flex gap-2"
                        >
                          <span className="font-semibold flex-shrink-0">{item.num}.</span>
                          <span>{item.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLLEGE MENU INFORMATION (Always Visible) */}
            <div className="space-y-12">
              {/* INFO SECTION */}
              <section id="info">
                <h2 className="text-3xl font-bold mb-4">About {college.name}</h2>
                <p className="text-gray-800 leading-relaxed mb-4">
                  {college.name} is a premier {college.type} institution established in <strong>{college.established || 'N/A'}</strong> and located in {college.location?.city}, {college.location?.state}.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Key Highlights</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Type:</strong> {college.type}</li>
                    <li>• <strong>Established:</strong> {college.established || 'N/A'}</li>
                    <li>• <strong>Location:</strong> {college.location?.city}, {college.location?.state}</li>
                    <li>• <strong>Average Fees:</strong> ₹{(college.average_fees / 100000).toFixed(2)} Lakhs per year</li>
                    <li>• <strong>Rating:</strong> {college.rating || '4.5'}/5 ({college.reviews || 344} Reviews)</li>
                  </ul>
                </div>
              </section>

              {/* COURSES & FEES */}
                <section id="courses">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Courses & Fees 2026</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers various undergraduate and postgraduate programs. The fee structure for different courses is mentioned below:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Duration</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">B.Tech</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">4 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {(college.average_fees / 100000).toFixed(2)} Lakhs</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {((college.average_fees * 4) / 100000).toFixed(2)} Lakhs</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">M.Tech</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">2 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 72,000</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 1.44 Lakhs</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">MBA</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm">2 Years</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 7.68 Lakhs</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR 15.36 Lakhs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Q&A */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-sm font-bold mb-2">Ques. Is pursuing a degree at {college.name} worth the investment?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Yes, {college.name} offers quality education with excellent placement opportunities, experienced faculty, and state-of-the-art infrastructure. The ROI is quite competitive.
                    </p>
                  </div>
                </section>

                {/* ADMISSIONS */}
                <section id="admission">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Admission 2026</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers admission to various programs through national-level entrance exams followed by counselling rounds. The eligibility criteria and selection process are mentioned below:
                  </p>

                  <h3 className="text-xl font-bold mb-3">Admission Dates 2026</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Application Start Date</td>
                          <td className="border px-4 py-3 text-sm font-semibold">January 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Application Deadline</td>
                          <td className="border px-4 py-3 text-sm font-semibold">March 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Exam Date</td>
                          <td className="border px-4 py-3 text-sm font-semibold">April-May 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Result Announcement</td>
                          <td className="border px-4 py-3 text-sm font-semibold">June 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-bold mb-3">Eligibility & Selection Criteria</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Eligibility</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Selection Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">B.Tech</td>
                          <td className="border px-4 py-3 text-sm">10+2 with 75% in PCM</td>
                          <td className="border px-4 py-3 text-sm">JEE Advanced + JoSAA Counselling</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">M.Tech</td>
                          <td className="border px-4 py-3 text-sm">BE/B.Tech with 60% marks</td>
                          <td className="border px-4 py-3 text-sm">GATE + COAP Counselling</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">MBA</td>
                          <td className="border px-4 py-3 text-sm">Bachelor's degree with 60%</td>
                          <td className="border px-4 py-3 text-sm">CAT + GD/PI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Q&A */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <p className="text-sm font-bold mb-2">Ques. What is the admission process for {college.name}?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Admission is primarily through entrance exams. The process includes application submission, entrance exam, cutoff determination, counselling, and document verification.
                    </p>
                  </div>
                </section>

                {/* CUTOFF */}
                <section id="cutoff">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Cutoff 2025</h2>
                  <p className="text-gray-700 mb-6">
                    The cutoff varies for different programs and categories. Below are the cutoff ranks for General Category:
                  </p>

                  <h3 className="text-xl font-bold mb-3">JEE Advanced Cutoff 2025</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Opening Rank 2025</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Closing Rank 2025</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Closing Rank 2024</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Computer Science Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">1</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">66</td>
                          <td className="border px-4 py-3 text-sm">68</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Electrical Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">100</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">418</td>
                          <td className="border px-4 py-3 text-sm">464</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Mechanical Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-green-600">800</td>
                          <td className="border px-4 py-3 text-sm font-bold text-blue-600">1766</td>
                          <td className="border px-4 py-3 text-sm">1685</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* PLACEMENT */}
                <section id="placement">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Placement 2024</h2>
                  <p className="text-gray-700 mb-6">
                    As per the {college.name} Placement report, the average package stood at <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA</strong>. 
                    The institute secured offers from top recruiters across various sectors.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L</div>
                      <div className="text-sm text-gray-600">Highest Package</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'}L</div>
                      <div className="text-sm text-gray-600">Average Package</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                      <div className="text-sm text-gray-600">Placement Rate</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">Placement Statistics</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Particulars</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">2024</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Students Participated</td>
                          <td className="border px-4 py-3 text-sm font-semibold">1979</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Companies Participated</td>
                          <td className="border px-4 py-3 text-sm font-semibold">364</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">Total Offers</td>
                          <td className="border px-4 py-3 text-sm font-semibold">1650</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-bold mb-3">Top Recruiters</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'Goldman Sachs', 'Intel', 'Oracle', 'Adobe'].map((company) => (
                      <span key={company} className="px-4 py-2 bg-gray-100 border rounded-lg text-sm font-medium text-gray-700">
                        {company}
                      </span>
                    ))}
                  </div>
                </section>

                {/* RANKING */}
                <section id="ranking">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Ranking 2025</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} has been ranked by various agencies including NIRF, IIRF, India Today, and more. The ranking details are mentioned below:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">Collegedunia</td>
                          <td className="border px-4 py-3 text-sm">2025</td>
                          <td className="border px-4 py-3 text-sm">B.Tech</td>
                          <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 5) + 1}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">NIRF</td>
                          <td className="border px-4 py-3 text-sm">2025</td>
                          <td className="border px-4 py-3 text-sm">Engineering</td>
                          <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 10) + 1}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm font-semibold">India Today</td>
                          <td className="border px-4 py-3 text-sm">2025</td>
                          <td className="border px-4 py-3 text-sm">B.Tech</td>
                          <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 15) + 1}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* SCHOLARSHIP */}
                <section id="scholarship">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Scholarships 2026</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers various scholarships to support students financially. The details are mentioned below:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">Merit Cum Means Scholarship</h3>
                      <p className="text-sm text-gray-700">
                        Offered to students with annual family income less than INR 4.5 lakhs. Free tuition fee and monthly stipend of INR 1000.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">SC/ST/OBC Scholarships</h3>
                      <p className="text-sm text-gray-700">
                        Government scholarships available for SC/ST/OBC students based on merit and income criteria.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">Institute Scholarships</h3>
                      <p className="text-sm text-gray-700">
                        Various institute-specific scholarships including Aditya Birla Scholarship (INR 65,000 per annum) and INSPIRE Scholarship (INR 10,000 per year).
                      </p>
                    </div>
                  </div>

                  {/* Q&A */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                    <p className="text-sm font-bold mb-2">Ques. How to apply for scholarships at {college.name}?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Students can apply for scholarships through the institute's portal. Most scholarships are automatically considered based on JEE rank and family income.
                    </p>
                  </div>
                </section>

                {/* FACILITIES */}
                <section id="facilities">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Campus & Facilities</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} campus provides world-class facilities and infrastructure for students. Major facilities are highlighted below:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">📚 Library</h3>
                      <p className="text-sm text-gray-700">
                        The library has an extensive collection of over 4 lakh books, journals, and digital resources. Open from 9 AM to 11 PM on weekdays with Wi-Fi enabled reading areas.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">⚽ Sports Complex</h3>
                      <p className="text-sm text-gray-700">
                        Multiple sports facilities including badminton, table tennis, basketball, football, hockey, volleyball, cricket, swimming pool, and gymnasium.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">🏠 Hostels</h3>
                      <p className="text-sm text-gray-700">
                        17 hostels with independent mess facilities, recreational areas, and 24/7 security. Hostel fee is approximately INR 17,250 per semester.
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-2">🔬 Laboratories</h3>
                      <p className="text-sm text-gray-700">
                        State-of-the-art laboratories with modern equipment for engineering, science, and research activities.
                      </p>
                    </div>
                  </div>

                  {/* Campus Images */}
                  <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center border">
                        <span className="text-gray-500 text-sm">Campus Image {i}</span>
                      </div>
                    ))}
                  </div>

                  {/* CAMPUS VIDEO */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Campus Video Tour</h3>
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center border relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
                      <div className="relative text-center text-white z-10">
                        <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
                          <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2"></div>
                        </div>
                        <p className="text-lg font-semibold">Watch Campus Tour</p>
                        <p className="text-sm text-gray-300 mt-1">Get a virtual tour of {college.name} campus</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Q&A SECTION */}
                <section id="qna">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Questions & Answers</h2>
                  <p className="text-gray-700 mb-6">
                    Have questions about {college.name}? Ask here and get answers from students, alumni, and experts.
                  </p>

                  {/* Ask Question Form */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Ask Your Question</h3>
                    <textarea
                      placeholder="Type your question here..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                    ></textarea>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Submit Question
                    </Button>
                  </div>

                  {/* Recent Q&A */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Recent Questions</h3>
                    
                    <div className="bg-white border rounded-lg p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            S
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">What is the hostel fee structure?</p>
                          <p className="text-xs text-gray-500 mb-3">Asked by Student123 • 2 days ago</p>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Answer:</strong> The hostel fee is approximately INR 17,250 per semester which includes accommodation and basic facilities. Mess charges are separate and vary between INR 3,000-4,000 per month.
                            </p>
                            <p className="text-xs text-gray-500">Answered by Alumni • 1 day ago</p>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-sm text-blue-600 hover:underline">Reply</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">👍 12</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            R
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">How is the placement scenario for CSE branch?</p>
                          <p className="text-xs text-gray-500 mb-3">Asked by Rahul • 5 days ago</p>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Answer:</strong> CSE branch has excellent placements with average package of 25+ LPA. Top companies like Google, Microsoft, Amazon regularly visit for placements.
                            </p>
                            <p className="text-xs text-gray-500">Answered by Current Student • 4 days ago</p>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-sm text-blue-600 hover:underline">Reply</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">👍 28</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        View All Questions
                      </Button>
                    </div>
                  </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Frequently Asked Questions (FAQs)</h2>
                  <p className="text-gray-700 mb-6">
                    Find answers to commonly asked questions about {college.name}:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        question: 'What is the admission process for B.Tech?',
                        answer: 'Admission to B.Tech is through JEE Advanced followed by JoSAA counselling. Candidates must have 75% marks in 10+2 with PCM.'
                      },
                      {
                        question: 'What are the hostel facilities available?',
                        answer: 'The institute has 17 hostels with separate facilities for boys and girls. Each hostel has mess, recreation room, and 24/7 security. Hostel fee is approximately INR 17,250 per semester.'
                      },
                      {
                        question: 'What is the fee structure for different courses?',
                        answer: 'B.Tech: ₹2.00 Lakhs per year, M.Tech: ₹72,000 per year, MBA: ₹7.68 Lakhs per year. Additional charges for hostel and mess are separate.'
                      },
                      {
                        question: 'How are the placement opportunities?',
                        answer: 'The institute has excellent placement record with average package of INR 23.5 LPA and highest package going up to INR 50+ LPA. Top companies like Google, Microsoft, Amazon visit regularly.'
                      },
                      {
                        question: 'What scholarships are available?',
                        answer: 'Various scholarships including Merit Cum Means Scholarship, SC/ST/OBC scholarships, Aditya Birla Scholarship, and INSPIRE Scholarship are available for deserving students.'
                      },
                      {
                        question: 'Is there any entrance exam for MBA admission?',
                        answer: 'Yes, admission to MBA program is through CAT exam followed by Group Discussion and Personal Interview rounds.'
                      },
                      {
                        question: 'What is the student-faculty ratio?',
                        answer: 'The institute maintains an excellent student-faculty ratio of approximately 10:1 ensuring personalized attention and quality education.'
                      },
                      {
                        question: 'Are there research opportunities for students?',
                        answer: 'Yes, the institute provides extensive research opportunities with state-of-the-art labs and funding support for innovative projects.'
                      }
                    ].map((faq, index) => (
                      <details key={index} className="bg-white border rounded-lg">
                        <summary className="font-semibold text-gray-900 p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <span className="flex-1">Ques. {faq.question}</span>
                          <FiChevronDown className="text-orange-600 flex-shrink-0" />
                        </summary>
                        <div className="px-5 pb-5 text-sm text-gray-700 border-t pt-4">
                          <p><strong>Ans.</strong> {faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-3">Didn't find your answer?</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Ask a Question
                    </Button>
                  </div>
                </section>

                {/* REVIEWS */}
                <section id="reviews">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Student Reviews</h2>
                  <p className="text-gray-700 mb-6">
                    Read what students and alumni have to say about {college.name}:
                  </p>

                  <div className="bg-gray-50 border rounded-lg p-8 text-center mb-6">
                    <div className="text-6xl mb-4">⭐</div>
                    <p className="text-gray-600 mb-4">Share your experience and help others!</p>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Write a Review
                    </Button>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">Amit Kumar</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-sm text-gray-600 hover:text-gray-800">👍 24</button>
                              <button className="text-sm text-gray-600 hover:text-gray-800">👎 2</button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Excellent infrastructure and experienced faculty. The placement opportunities are outstanding with top companies visiting the campus. Campus life is vibrant with various clubs and activities.
                          </p>
                          <p className="text-xs text-gray-500">B.Tech CSE | Class of 2024 | Posted 2 weeks ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          P
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">Priya Sharma</span>
                              <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                  <FiStar key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                                ))}
                                <FiStar className="text-gray-300" size={14} />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-sm text-gray-600 hover:text-gray-800">👍 18</button>
                              <button className="text-sm text-gray-600 hover:text-gray-800">👎 1</button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Great academic environment with focus on research. Library facilities are excellent. The only downside is the hostel food could be better.
                          </p>
                          <p className="text-xs text-gray-500">M.Tech EE | Class of 2025 | Posted 1 month ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        Load More Reviews
                      </Button>
                    </div>
                  </div>
                </section>

                {/* LOCATION & MAP */}
                <section id="location">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Location & Address</h2>
                  <p className="text-gray-700 mb-6">
                    Find {college.name} on the map and get complete address details:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Address Details */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border rounded-lg p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-3 text-gray-900">Address</h3>
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <FiMapPin className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">{college.name}</p>
                                <p className="text-sm text-gray-600">
                                  {college.location?.address || `${college.location?.city}, ${college.location?.state}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {college.location?.city}, {college.location?.state}
                                </p>
                                <p className="text-sm text-gray-600">India - 400076</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiPhone className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Phone</p>
                                <p className="text-sm text-gray-600">+91 22-2576-7000</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiMail className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Email</p>
                                <p className="text-sm text-gray-600">
                                  info@{college.name.toLowerCase().replace(/\s+/g, '')}.edu
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <FiGlobe className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                              <div>
                                <p className="text-sm text-gray-700 font-medium">Website</p>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                  www.{college.name.toLowerCase().replace(/\s+/g, '')}.ac.in
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-bold text-sm mb-2 text-gray-900">How to Reach</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>• <strong>By Metro:</strong> Nearest metro station is 2 km away</p>
                            <p>• <strong>By Bus:</strong> Well connected by local buses</p>
                            <p>• <strong>By Train:</strong> {college.location?.city} Railway Station - 5 km</p>
                          </div>
                        </div>

                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                          <FiExternalLink className="mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>

                    {/* Google Map */}
                    <div className="lg:col-span-2">
                      <div className="bg-white border rounded-lg overflow-hidden h-full min-h-[500px]">
                        {/* Google Maps Embed - Replace with actual Google Maps API */}
                        <iframe
                          title="College Location Map"
                          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.9!3d19.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzAwLjAiTiA3MsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890`}
                          width="100%"
                          height="100%"
                          style={{ border: 0, minHeight: '500px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Places */}
                  <div className="mt-6 bg-gray-50 border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">Nearby Places</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏥</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Hospital</p>
                          <p className="text-xs text-gray-600">City Hospital - 1.5 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏦</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Bank</p>
                          <p className="text-xs text-gray-600">SBI Bank - 800 m</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🏪</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Market</p>
                          <p className="text-xs text-gray-600">Shopping Complex - 2 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🚉</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Metro Station</p>
                          <p className="text-xs text-gray-600">Central Metro - 2 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">✈️</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Airport</p>
                          <p className="text-xs text-gray-600">International Airport - 15 km</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Restaurants</p>
                          <p className="text-xs text-gray-600">Food Court - 500 m</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* APPLY NOW BUTTON */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Apply to {college.name}</h3>
                  <p className="text-sm text-orange-100 mb-4">Start your admission process now</p>
                  <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
                    <FiCheckCircle size={18} />
                    <span>Apply Now</span>
                  </button>
                  <p className="text-xs text-orange-100 mt-3">Application Deadline: March 2026</p>
                </div>
              </div>

              {/* ADVERTISEMENT 1 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="font-bold text-lg mb-2">Get Expert Guidance</h3>
                  <p className="text-sm text-orange-100 mb-4">Connect with our counselors for FREE admission guidance</p>
                  <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors">
                    Talk to Expert
                  </button>
                </div>
              </div>

              {/* POPULAR COURSES */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Popular Full Time Courses</h3>
                <div className="space-y-4">
                  {[
                    { name: 'B.Tech', views: '14.4K', fees: college.average_fees },
                    { name: 'M.Tech', views: '14.4K', fees: 144000 },
                    { name: 'MBA', views: '14.4K', fees: 768000 }
                  ].map((course, i) => (
                    <div key={course.name} className={`pb-4 ${i !== 2 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <Link to="#" className="text-sm font-bold text-blue-600 hover:underline">
                          {course.name}
                        </Link>
                        <span className="text-[11px] text-gray-500">({course.views} Views)</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-3 font-medium">
                        ₹{(course.fees / 100000).toFixed(2)} Lakhs
                      </p>
                      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded transition-colors">
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADVERTISEMENT 2 */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
                  <p className="text-sm text-blue-100 mb-4">Get complete course details and admission information</p>
                  <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors">
                    Download Now
                  </button>
                </div>
              </div>

              {/* SIMILAR COLLEGES */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Similar Colleges</h3>
                <div className="space-y-4">
                  {[
                    { name: 'IIT Delhi', location: 'New Delhi, Delhi', fees: '2.54' },
                    { name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fees: '2.25' },
                    { name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', fees: '2.18' }
                  ].map((item, i) => (
                    <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                      <Link to="#" className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-blue-700">{item.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-600 mb-1">{item.location}</p>
                            <p className="text-xs font-semibold text-orange-600">₹{item.fees}L Fees</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADVERTISEMENT 3 */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="font-bold text-lg mb-2">Career Counseling</h3>
                  <p className="text-sm text-green-100 mb-4">Get personalized career guidance from experts</p>
                  <button className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded transition-colors">
                    Book Session
                  </button>
                </div>
              </div>

              {/* LATEST NEWS */}
              <div className="bg-white border rounded-lg shadow-sm p-5">
                <h3 className="font-bold text-base mb-4 text-gray-900">Latest News</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Admission 2026 Opens', date: 'Dec 12, 2025' },
                    { title: 'Placement Results Announced', date: 'Dec 6, 2025' },
                    { title: 'New Course Launch', date: 'Nov 28, 2025' }
                  ].map((news, i) => (
                    <div key={i} className={`${i !== 2 ? 'pb-4 border-b border-gray-200' : ''}`}>
                      <Link to="#" className="block hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                        <p className="text-sm text-blue-600 hover:underline font-medium mb-1 line-clamp-2">
                          {college.name} {news.title}
                        </p>
                        <p className="text-[11px] text-gray-500">{news.date}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
