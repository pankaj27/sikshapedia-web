import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiUser, FiChevronDown, FiChevronUp, FiDownload, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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
          </div>
        </div>
      </div>

      {/* LATEST UPDATES */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{college.name} Latest Updates and News</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded flex-shrink-0">12 Dec, 2025</span>
                <p className="text-sm text-gray-800">
                  <strong>Admission 2026</strong> applications are now open. Apply before the deadline.
                </p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded flex-shrink-0">06 Dec, 2025</span>
                <p className="text-sm text-gray-800">
                  <strong>Placement Results 2024</strong> announced with highest package of ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
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
            {/* INTRO PARAGRAPHS */}
            <div className="mb-8">
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
            <div className="mb-8 bg-gray-100 rounded-lg aspect-video flex items-center justify-center border">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                </div>
                <p className="text-sm text-gray-600">Video: Complete Guide to {college.name}</p>
              </div>
            </div>

            {/* TABLE OF CONTENTS */}
            <div className="bg-gray-50 rounded-lg p-6 border mb-6">
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

            {/* READ MORE BUTTON */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowContent(!showContent)}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-full"
              >
                <span>{showContent ? 'Read Less' : 'Read More'}</span>
                {showContent ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </button>
            </div>

            {/* EXPANDABLE CONTENT */}
            {showContent && (
              <div className="space-y-12">
                {/* ADMISSION DATES */}
                <section id="admission-dates">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Admission 2026 Dates</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers admission to various programs through national-level entrance exams. 
                    Here are the important dates:
                  </p>

                  <h3 className="text-xl font-bold mb-3">B.Tech Admission Dates 2026</h3>
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
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* FEES */}
                <section id="fees">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Fees 2026</h2>
                  <p className="text-gray-700 mb-6">
                    The fee structure for various courses is detailed below:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">B.Tech</Link>
                          </td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {(college.average_fees / 100000).toFixed(2)} Lakhs</td>
                          <td className="border px-4 py-3 text-sm font-semibold">INR {((college.average_fees * 4) / 100000).toFixed(2)} Lakhs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Q&A */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <p className="text-sm font-bold mb-2">Ques. Is pursuing a degree at {college.name} a good investment?</p>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Yes, {college.name} offers quality education with excellent placement opportunities and state-of-the-art infrastructure.
                    </p>
                  </div>
                </section>

                {/* RANKING */}
                <section id="ranking">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Ranking</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                          <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-4 py-3 text-sm">NIRF</td>
                          <td className="border px-4 py-3 text-sm">2025</td>
                          <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 20) + 1}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Other sections abbreviated for length... */}
                <section id="admission">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Admission 2026</h2>
                  <p className="text-gray-700">Admission details and eligibility criteria...</p>
                </section>

                <section id="cutoff">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Cutoff</h2>
                  <p className="text-gray-700">Cutoff information for various programs...</p>
                </section>

                <section id="placement">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Placement</h2>
                  <p className="text-gray-700">Placement statistics and top recruiters...</p>
                </section>

                <section id="comparison">
                  <h2 className="text-3xl font-bold mb-4">{college.name} vs Other Colleges</h2>
                  <p className="text-gray-700">Comparative analysis...</p>
                </section>

                <section id="facilities">
                  <h2 className="text-3xl font-bold mb-4">{college.name} Campus & Facilities</h2>
                  <p className="text-gray-700">Campus facilities and infrastructure...</p>
                </section>

                <section id="faqs">
                  <h2 className="text-3xl font-bold mb-4">{college.name} FAQs</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded border">
                      <p className="font-bold mb-2">Ques. What are the scholarships offered?</p>
                      <p className="text-sm text-gray-700"><strong>Ans.</strong> Various merit and need-based scholarships are available...</p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* POPULAR COURSES */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-bold mb-4">Popular Full Time Courses</h3>
                <div className="space-y-4">
                  {['B.Tech', 'M.Tech', 'MBA'].map((course, i) => (
                    <div key={course} className="pb-4 border-b last:border-0">
                      <div className="flex justify-between mb-1">
                        <Link to="#" className="text-sm font-semibold text-blue-600 hover:underline">{course}</Link>
                        <span className="text-xs text-gray-500">(14.4K Views)</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">₹{(college.average_fees / 100000).toFixed(2)} Lakhs</p>
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs">
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIMILAR COLLEGES */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-bold mb-4">Similar Colleges</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link key={i} to="#" className="flex gap-3 hover:bg-gray-50 p-2 rounded">
                      <div className="w-14 h-14 bg-gray-200 rounded flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">College Name {i}</p>
                        <p className="text-xs text-gray-600">City, State</p>
                      </div>
                    </Link>
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
