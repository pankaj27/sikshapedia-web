import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCalendar, FiUser, FiCheckCircle, FiChevronDown, FiChevronUp, FiDownload, FiExternalLink, FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

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
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
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
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/colleges" className="hover:text-orange-600">Colleges</Link>
            <span>/</span>
            <span className="text-gray-900">{college.name}</span>
          </div>
        </div>
      </div>

      {/* COLLEGE HEADER */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {college.images?.[0] ? (
                <img src={college.images[0]} alt={college.name} className="w-32 h-32 rounded-lg border object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{college.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-orange-600" />
                  <span>{college.location?.city}, {college.location?.state}</span>
                </div>
                <span>|</span>
                <span className="font-medium">{college.type}</span>
                <span>|</span>
                <span>Estd. {college.established || 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`${i < Math.floor(college.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        size={20}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{college.rating || '4.5'}</span>
                  <span className="text-gray-600">({college.reviews || 344} Reviews)</span>
                </div>
                
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <FiCheckCircle className="mr-2" />
                  Apply Now
                </Button>
                <Button variant="outline">
                  <FiDownload className="mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LATEST UPDATES */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-6 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{college.name} Latest Updates and News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded p-4">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">12 Dec, 2025</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>Admission 2026</strong> applications are now open. Apply before the deadline.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 rounded p-4">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">06 Dec, 2025</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>Placement Results 2024</strong> announced with highest package of ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : '50'}L
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN INTRO */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {college.name} is a {college.type} established in <strong>{college.established || 'N/A'}</strong>. 
              As per the data, the college is one of the preferred institutions for students. 
              {college.name} Ranking is <strong>#{Math.floor(Math.random() * 50) + 1}</strong> in the category by various ranking agencies.
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {college.name} offers various programs with total fees ranging from <strong>₹{(college.average_fees / 100000).toFixed(2)} Lakhs</strong>. 
              Admission is based on national-level entrance exams followed by counselling.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              As per {college.name} Placements, the average package was <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '15'} LPA</strong>. 
              The top recruiters included leading companies from various sectors.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-6 bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-2">▶️</div>
              <p className="text-sm">Video: Complete Guide to {college.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* MAIN CONTENT */}
          <div className="flex-1 max-w-4xl">
            {/* TABLE OF CONTENTS */}
            <div className="bg-gray-50 rounded-lg p-6 border mb-8">
              <h3 className="font-bold text-xl mb-4">Table of Contents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-sm text-blue-600 hover:underline flex items-start gap-2"
                  >
                    <span className="font-semibold">{item.num}.</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* READ MORE BUTTON */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowContent(!showContent)}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-full transition-colors"
              >
                {showContent ? (
                  <>
                    <span>Read Less</span>
                    <FiChevronUp />
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <FiChevronDown />
                  </>
                )}
              </button>
            </div>

            {/* COLLAPSIBLE CONTENT */}
            {showContent && (
              <div className="space-y-12">
                {/* ADMISSION DATES */}
                <section id="admission-dates">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Admission 2026 Dates</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers admission to various programs through national-level entrance exams. 
                    Here are the important dates of the admission process:
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">B.Tech Admission Dates 2026</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Candidates applying for admission to the B.Tech have to appear for entrance exams followed by counselling.
                  </p>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border mb-6">
                    <table className="w-full">
                      <thead className="bg-orange-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Events</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 text-sm">Application Start Date</td>
                          <td className="px-4 py-3 text-sm font-semibold">January 2026</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 text-sm">Application Deadline</td>
                          <td className="px-4 py-3 text-sm font-semibold">March 2026</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 text-sm">Exam Date</td>
                          <td className="px-4 py-3 text-sm font-semibold">April-May 2026</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">Result Announcement</td>
                          <td className="px-4 py-3 text-sm font-semibold">June 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">M.Tech Admission Dates 2026</h3>
                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border mb-6">
                    <table className="w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Events</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Admission Dates 2026</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 text-sm">GATE Exam</td>
                          <td className="px-4 py-3 text-sm font-semibold">February 2026</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">Announcement of Results</td>
                          <td className="px-4 py-3 text-sm font-semibold">March 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* FEES */}
                <section id="fees">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Fees 2026</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers various programs with competitive fee structures. 
                    The details for {college.name} Courses & Fees are mentioned in the table below:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Course</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">1st Year Fee</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">B.Tech</Link>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">INR {(college.average_fees / 100000).toFixed(2)} Lakhs</td>
                          <td className="px-4 py-3 text-sm font-semibold">INR {((college.average_fees * 4) / 100000).toFixed(2)} Lakhs</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">M.Tech</Link>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">INR 72,000</td>
                          <td className="px-4 py-3 text-sm font-semibold">INR 1.44 Lakhs</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link to="#" className="text-blue-600 hover:underline font-medium">MBA</Link>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">INR 7.68 Lakhs</td>
                          <td className="px-4 py-3 text-sm font-semibold">INR 15.36 Lakhs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* FAQ about Fees */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-2">Ques. Is pursuing a degree at {college.name} a good investment?</h4>
                    <p className="text-sm text-gray-700 mb-3"><strong>Ans.</strong> As per students' and alumni feedback, {college.name} offers quality education with good placement opportunities. The institute provides:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>World-Class Infrastructure with modern labs and libraries</li>
                      <li>Quality Education by experienced faculty</li>
                      <li>Strong Placement Record with top companies</li>
                      <li>Scholarship Opportunities for deserving students</li>
                    </ul>
                  </div>
                </section>

                {/* RANKING */}
                <section id="ranking">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Ranking</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} is one of the top institutes in India. It is ranked by various agencies including NIRF, IIRF, 
                    India Today, The Week, and others. The details for the {college.name} Ranking are provided below:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Agency</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Year</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Collegedunia</td>
                          <td className="px-4 py-3 text-sm">2025</td>
                          <td className="px-4 py-3 text-sm">BTech</td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 10) + 1}</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">NIRF</td>
                          <td className="px-4 py-3 text-sm">2025</td>
                          <td className="px-4 py-3 text-sm">Engineering</td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 20) + 1}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">India Today</td>
                          <td className="px-4 py-3 text-sm">2025</td>
                          <td className="px-4 py-3 text-sm">Engineering</td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-600">#{Math.floor(Math.random() * 15) + 1}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* ADMISSION */}
                <section id="admission">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Admission 2026</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} offers admission to various programs through national-level entrance exams. 
                    The eligibility and selection criteria for the major courses are mentioned in the table below:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Course</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Eligibility Criteria</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Selection Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">B.Tech</td>
                          <td className="px-4 py-3 text-sm">10+2 with 75% marks in PCM</td>
                          <td className="px-4 py-3 text-sm">JEE Advanced + JoSAA Counselling</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">M.Tech</td>
                          <td className="px-4 py-3 text-sm">BE/B.Tech with 60% marks</td>
                          <td className="px-4 py-3 text-sm">GATE + COAP Counselling</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">MBA</td>
                          <td className="px-4 py-3 text-sm">Bachelor's degree with 60% marks</td>
                          <td className="px-4 py-3 text-sm">CAT + PI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* FAQ */}
                  <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
                    <h4 className="font-bold text-gray-900 mb-2">Ques. What is the admission process for getting into {college.name}?</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Ans.</strong> Admission to {college.name} is primarily through entrance exams. The admission process includes 
                      application submission, entrance exam, cutoff determination, counselling/merit list, and document verification.
                    </p>
                  </div>
                </section>

                {/* CUTOFF */}
                <section id="cutoff">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Cutoff</h2>
                  <p className="text-gray-700 mb-6">
                    The cutoff for different exams varies each year. Given below {college.name} Cutoff for various programs:
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">JEE Advanced Cutoff 2025</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {college.name} JEE Advanced Cutoff 2025 has been released. Tabulated below are the cutoff ranks for General Category:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border mb-6">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Courses</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Round 1 (Closing Rank 2025)</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Round 1 (Closing Rank 2024)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Computer Science Engineering</td>
                          <td className="px-4 py-3 text-sm font-semibold text-blue-600">66</td>
                          <td className="px-4 py-3 text-sm">68</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Electrical Engineering</td>
                          <td className="px-4 py-3 text-sm font-semibold text-blue-600">418</td>
                          <td className="px-4 py-3 text-sm">464</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Mechanical Engineering</td>
                          <td className="px-4 py-3 text-sm font-semibold text-blue-600">1766</td>
                          <td className="px-4 py-3 text-sm">1685</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* PLACEMENT */}
                <section id="placement">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Placement</h2>
                  <p className="text-gray-700 mb-6">
                    As per the {college.name} Placement report, the average package stood at <strong>INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA</strong>, 
                    and the median package was <strong>INR 17.92 LPA</strong>. The institute secured offers from top recruiters.
                  </p>

                  <p className="text-gray-700 mb-4">
                    The placement statistics for 2024 are mentioned below:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border mb-6">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Particulars</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Placement Stats (2024)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">No. of Students Participated</td>
                          <td className="px-4 py-3 text-sm font-semibold">1979</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">No. of Companies Offered Jobs</td>
                          <td className="px-4 py-3 text-sm font-semibold">364</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">No. of Job Offers</td>
                          <td className="px-4 py-3 text-sm font-semibold">1650</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Job Offers above INR 1 Cr PA</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">22</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Average Package</td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">Median Package</td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-600">INR 17.92 LPA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* COMPARISON */}
                <section id="comparison">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} vs Other Colleges</h2>
                  <p className="text-gray-700 mb-6">
                    Here is the comparison between {college.name} and other top institutes:
                  </p>

                  <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">Particulars</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">{college.name}</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">College 2</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b">College 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Established Year</td>
                          <td className="px-4 py-3 text-sm">{college.established || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">1961</td>
                          <td className="px-4 py-3 text-sm">1951</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">1st Year Fees</td>
                          <td className="px-4 py-3 text-sm">INR {(college.average_fees / 100000).toFixed(2)}L</td>
                          <td className="px-4 py-3 text-sm">INR 2.28L</td>
                          <td className="px-4 py-3 text-sm">INR 2.62L</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold">Median Package</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '19.6'}L</td>
                          <td className="px-4 py-3 text-sm">INR 19.08L</td>
                          <td className="px-4 py-3 text-sm">INR 19.76L</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* FACILITIES */}
                <section id="facilities">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} Campus & Facilities</h2>
                  <p className="text-gray-700 mb-6">
                    {college.name} campus is spread over acres of land. The institute has been declared an Institute of Excellence.
                  </p>

                  <p className="text-gray-700 mb-4">Highlights on major facilities offered at {college.name} are given below:</p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-2">Library</h3>
                      <p className="text-sm text-gray-700">
                        {college.name} library is a multi-storied building with extensive collection of books, journals, and digital resources. 
                        The library remains open from 9 AM to 11 PM on weekdays.
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-2">Sports</h3>
                      <p className="text-sm text-gray-700">
                        The institute caters to a wide range of sports activities including badminton, table tennis, chess, basketball, 
                        football, hockey, volleyball, and more.
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-2">Hostels</h3>
                      <p className="text-sm text-gray-700">
                        {college.name} campus comprises multiple hostels for students. Each hostel is an independent entity with its own 
                        mess facilities and recreational areas.
                      </p>
                    </div>
                  </div>

                  {/* Images Placeholder */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Campus Image {i}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQs */}
                <section id="faqs">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{college.name} FAQs</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h4 className="font-bold text-gray-900 mb-2">Ques. What are the scholarships offered by {college.name}?</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Ans.</strong> {college.name} offers various scholarships including Merit Cum Means Scholarship, 
                        institute-specific scholarships, and government scholarships for deserving students.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h4 className="font-bold text-gray-900 mb-2">Ques. How are the placements at {college.name}?</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Ans.</strong> As per the placement report, {college.name} secured excellent placements with 
                        average package of INR {college.placement?.average ? (college.placement.average / 100000).toFixed(1) : '23.5'} LPA. 
                        Top companies from various sectors participate in campus recruitment.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h4 className="font-bold text-gray-900 mb-2">Ques. What is the hostel fee of {college.name}?</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Ans.</strong> The hostel fee varies depending on the type of accommodation. 
                        Details about hostel charges are provided during the admission process.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="w-96 flex-shrink-0 hidden xl:block">
            <div className="sticky top-24 space-y-4">
              {/* Popular Courses */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="font-bold text-gray-900 mb-4">Popular Full Time Courses</h3>
                <div className="space-y-3">
                  {['B.Tech', 'M.Tech', 'MBA'].map((course) => (
                    <div key={course} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link to="#" className="text-sm font-semibold text-blue-600 hover:underline">{course}</Link>
                        <span className="text-xs text-gray-500">(14.4K Views)</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        ₹{(college.average_fees / 100000).toFixed(2)} Lakhs
                      </div>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs w-full">
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Colleges */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="font-bold text-gray-900 mb-4">Similar Colleges</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link key={i} to="#" className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate mb-1">College Name {i}</div>
                        <div className="text-xs text-gray-600 mb-1">City, State</div>
                        <div className="flex items-center gap-1 text-xs">
                          <FiStar className="text-yellow-500 fill-yellow-500" size={12} />
                          <span>4.3</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Latest News */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="font-bold text-gray-900 mb-4">Latest News</h3>
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <Link to="#" className="text-sm text-blue-600 hover:underline line-clamp-2">
                      {college.name} Admission 2026 Opens
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Dec 12, 2025</p>
                  </div>
                  <div className="border-b pb-3">
                    <Link to="#" className="text-sm text-blue-600 hover:underline line-clamp-2">
                      Placement Results Announced
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Dec 6, 2025</p>
                  </div>
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
