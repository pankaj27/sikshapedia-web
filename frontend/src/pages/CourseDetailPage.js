import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronRight, FiChevronDown, FiChevronUp, FiMail, FiCheckCircle } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [showFullUpdates, setShowFullUpdates] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <FiChevronRight size={12} className="mx-2" />
            <Link to="/courses" className="hover:text-orange-600">Courses</Link>
            <FiChevronRight size={12} className="mx-2" />
            <span className="text-gray-900">BTech CSE</span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-8">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">BTech CSE: Course Details, Admission, Fees, Eligibility, Syllabus, Jobs & Salary</h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content - 75% width */}
          <main className="w-9/12">
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded flex items-center gap-2">
                <FiMail size={16} />
                APPLY NOW
              </button>
              <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 text-sm font-semibold rounded flex items-center gap-2">
                <FiCheckCircle size={16} />
                CHECK ELIGIBILITY
              </button>
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded flex items-center gap-2">
                <FiMail size={16} />
                GET UPDATES
              </button>
            </div>

            {/* Latest Updates Box */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">B.Tech Computer Science and Engineering Latest Updates</h2>
              <div className={`text-sm text-gray-700 leading-relaxed ${!showFullContent ? 'line-clamp-3' : ''}`}>
                <p className="mb-2"><strong className="text-red-600">12 Dec, 2025</strong> BITSAT 2026 Session-1 will be held from 15th to 17th April 2026. Application window will remain open from 15 December 2025 to 16 March 2026.</p>
                <p className="mb-2"><strong className="text-red-600">10 Dec, 2025</strong> JEE Main 2026 Registration has started. Candidates can apply till January 10, 2026.</p>
              </div>
              <button 
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-blue-600 text-sm font-medium mt-2 hover:underline"
              >
                {showFullContent ? 'Read Less' : '...Read More'}
              </button>
            </div>

            {/* Main Content Article */}
            <div className="bg-white rounded-lg p-6">
              {/* Course Description */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                BTech CSE is a 4 year UG course that studies practical and theoretical knowledge of computer hardware and software. This course lays emphasis on the basics of computer programming and networking while also comprising a plethora of topics. The admission process for the B.tech CSE is to clear entrance exams such as JEE at a national or state level.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                BTech CSE Entrance Exams are JEE Mains, SRMJEEE, etc. The eligibility criteria for the course B.tech CSE is students have to qualify 10+2 with a minimum of 55% marks from the science stream. The average fee for the course B.tech CSE is INR 2 lakhs to INR 10 lakhs.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                The average CTC from IIT Delhi is INR 16 Lakhs while that of IIT Bombay is INR 17.5 Lakhs. The job profiles after the course B.tech CSE are Data Analyst, Software developer, Game developer, networking engineer, testing engineer, database administrator, etc. The top recruiting companies are TCS, Infosys, Hexaware, Syntel, Wipro, etc.
              </p>

              {/* Table of Contents */}
              <div className="border border-gray-300 p-4 mb-8">
                <strong className="text-gray-900 mb-3 block">Table of Contents</strong>
                <ol className="list-decimal ml-6 space-y-1">
                  <li><a href="#section-1" onClick={(e) => {e.preventDefault(); scrollToSection('section-1')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE: Course Details</a></li>
                  <div className="ml-4 text-sm">1.1 <a href="#why-study" onClick={(e) => {e.preventDefault(); scrollToSection('why-study')}} className="text-blue-600 hover:underline font-semibold">Why Study?</a></div>
                  <li><a href="#section-2" onClick={(e) => {e.preventDefault(); scrollToSection('section-2')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE: Admission Process</a></li>
                  <div className="ml-4 text-sm space-y-1">
                    <div>2.1 <a href="#eligibility" onClick={(e) => {e.preventDefault(); scrollToSection('eligibility')}} className="text-blue-600 hover:underline font-semibold">Eligibility</a></div>
                    <div>2.2 <a href="#admission-process" onClick={(e) => {e.preventDefault(); scrollToSection('admission-process')}} className="text-blue-600 hover:underline font-semibold">Admission Process</a></div>
                    <div className="ml-4 space-y-1">
                      <div>2.2.1 <a href="#merit-based" onClick={(e) => {e.preventDefault(); scrollToSection('merit-based')}} className="text-blue-600 hover:underline font-semibold">Merit Based</a></div>
                      <div>2.2.2 <a href="#entrance-based" onClick={(e) => {e.preventDefault(); scrollToSection('entrance-based')}} className="text-blue-600 hover:underline font-semibold">Entrance Based</a></div>
                    </div>
                    <div>2.3 <a href="#entrance-exams" onClick={(e) => {e.preventDefault(); scrollToSection('entrance-exams')}} className="text-blue-600 hover:underline font-semibold">Entrance Exams</a></div>
                    <div className="ml-4 space-y-1">
                      <div>2.3.1 <a href="#important-dates" onClick={(e) => {e.preventDefault(); scrollToSection('important-dates')}} className="text-blue-600 hover:underline font-semibold">Important Dates</a></div>
                      <div>2.3.2 <a href="#cutoffs" onClick={(e) => {e.preventDefault(); scrollToSection('cutoffs')}} className="text-blue-600 hover:underline font-semibold">JEE Mains Cutoffs</a></div>
                    </div>
                  </div>
                  <li><a href="#syllabus" onClick={(e) => {e.preventDefault(); scrollToSection('syllabus')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE Syllabus</a></li>
                  <li><a href="#comparison" onClick={(e) => {e.preventDefault(); scrollToSection('comparison')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE Course Comparison</a></li>
                  <li><a href="#colleges" onClick={(e) => {e.preventDefault(); scrollToSection('colleges')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE Colleges</a></li>
                  <li><a href="#jobs" onClick={(e) => {e.preventDefault(); scrollToSection('jobs')}} className="text-blue-600 hover:underline text-sm font-semibold">BTech CSE Jobs</a></li>
                  <li><a href="#faqs" onClick={(e) => {e.preventDefault(); scrollToSection('faqs')}} className="text-blue-600 hover:underline text-sm font-semibold">FAQs</a></li>
                </ol>
              </div>

              {/* Section 1: Course Details */}
              <h2 id="section-1" className="text-2xl font-bold text-gray-900 mb-4">BTech CSE: Course Details</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse table-auto">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Course Type</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">Undergraduate</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">BTech CSE Course Duration</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">4 years</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Examination Type</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">Semester-Wise</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Eligibility</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">10+2 with minimum 55% marks</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Admission Process</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">Merit based or Entrance exam</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">BTech CSE Course Fees</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">INR 2 lakhs - INR 10 lakhs</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Average Salary</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">INR 1.5 lakhs – INR 4.5 lakhs</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">Top Recruiting Companies</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">Syntel, TCS, Hexaware, Infosys, Wipro, etc.</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-3 px-4 bg-gray-100 font-semibold text-gray-800 text-sm">BTech CSE Job Profiles</td>
                      <td className="py-3 px-4 text-gray-900 text-sm">Game developer, Software developer, testing engineer, database administrator, Data Analyst, networking engineer, etc.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Why Study Section */}
              <h3 id="why-study" className="text-xl font-bold text-gray-900 mb-4">Why Study BTech CSE?</h3>
              <p className="text-gray-700 text-sm mb-4">There are various advantages of studying BTech CSE. Check them in the points below.</p>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-700 text-sm"><strong>Good Compensation</strong> - Candidates having a BTech CSE degree, earn a good amount of compensation. The average annual salary of a BTech CSE graduate is INR 3 lakhs.</li>
                <li className="text-gray-700 text-sm"><strong>Multiple Opportunities</strong> - There are a lot of opportunities for BTech CSE graduates. Candidates can work in renowned job positions such as Game developer, Database administrator, Software and Testing engineers, etc.</li>
                <li className="text-gray-700 text-sm"><strong>Learning of various necessary skills</strong> - the BTech CSE course trains candidates with multiple skills which are necessary to learn, including website and software development, programming languages, etc.</li>
                <li className="text-gray-700 text-sm"><strong>Candidates are trained to work in various centers</strong> - Candidates pursuing the BTech cse course get trained to work in various centers including software firms, banking sector, MNCs, etc.</li>
                <li className="text-gray-700 text-sm"><strong>Job Security</strong> - Candidates holding the BTech cse degree have great job security. In this digital world, the value of a computer expert who has a degree is extreme. Hence job security is assured here.</li>
              </ul>

              {/* Section 2: Admission Process */}
              <h2 id="section-2" className="text-2xl font-bold text-gray-900 mb-4">BTech CSE: Admission Process</h2>
              <p className="text-gray-700 text-sm mb-6">Admission to the BTech CSE program is done both via seeing the merit of the previous exams or entrance exams. Check out the eligibility, detailed admission process and entrance exams for BTech cse course in the sections below.</p>

              {/* Eligibility */}
              <h3 id="eligibility" className="text-xl font-bold text-gray-900 mb-4">Eligibility</h3>
              <ul className="space-y-2 mb-8">
                <li className="text-gray-700 text-sm">Candidates aspiring for the B Tech cse course, need to qualify through their 10+2 exams from a recognized educational institute.</li>
                <li className="text-gray-700 text-sm">Also, having a science stream in 12th standards is mandatory with Physics, Chemistry and Mathematics as compulsory subjects.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-900 mb-4">BTech CSE Admission 2025</h4>
              <p className="text-gray-700 text-sm mb-4">Check out the merit based and entrance based admission for the BTech cse course below.</p>

              {/* Merit Based */}
              <h4 id="merit-based" className="text-lg font-semibold text-gray-900 mb-3">Merit Based Admission</h4>
              <ul className="space-y-2 mb-6">
                <li className="text-gray-700 text-sm">Candidates have to apply at the official website of the college they want to pursue.</li>
                <li className="text-gray-700 text-sm">Next, they need to make an application ID and fill the application form with the subject they want to pursue.</li>
                <li className="text-gray-700 text-sm">Applicants must fill in the details mandatory in the application form, and insert the mark sheets of previous exams, i.e., the marks gained in 12th standards.</li>
                <li className="text-gray-700 text-sm">Candidates have to wait till the merit list of the college is issued on a particular date. If candidates find their names on the list, they need to report to the college campus either online or offline.</li>
                <li className="text-gray-700 text-sm">This will follow a short round called the counseling phase, and after that seat, allotment will be done accordingly.</li>
              </ul>

              {/* Entrance Based */}
              <h4 id="entrance-based" className="text-lg font-semibold text-gray-900 mb-3">Entrance Based Admission</h4>
              <ul className="space-y-2 mb-8">
                <li className="text-gray-700 text-sm">For entrance based admission, candidates need to go to the official website of the college they want to pursue and see what entrance exams are accepted by that college for the B Tech CSE course.</li>
                <li className="text-gray-700 text-sm">Based on that, candidates need to apply at the official website of the conducting authority of that exam and sit for it.</li>
                <li className="text-gray-700 text-sm">If candidates qualify for the exam, they will be eligible to apply at the official portal of the college.</li>
                <li className="text-gray-700 text-sm">Make an application ID, and fill out the application form by putting the necessary details along with inserting the valid entrance exam scores.</li>
                <li className="text-gray-700 text-sm">A merit list will be issued on a specific date, and if candidates get their names on the list, they might have to go for the interview round or group discussion, which will decide their final selection.</li>
              </ul>

              {/* Entrance Exams */}
              <h3 id="entrance-exams" className="text-xl font-bold text-gray-900 mb-4">Entrance Exams</h3>
              <p className="text-gray-700 text-sm mb-4">There are various entrance exams, which candidates can sit for and access the B Tech cse program. Check them in the sections below.</p>

              {/* Important Dates Table */}
              <h4 id="important-dates" className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h4>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 text-center font-bold text-gray-800 text-sm">Entrance Exam Name</th>
                      <th className="border border-gray-300 py-3 px-4 text-center font-bold text-gray-800 text-sm">Exam Dates (Tentative)</th>
                      <th className="border border-gray-300 py-3 px-4 text-center font-bold text-gray-800 text-sm">Result (Tentative)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm"><Link to="/exams/jee-main" className="text-blue-600 hover:underline font-semibold">JEE Main</Link></td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">Session 1 - January 22 – 30, 2026<br/>Session 2 - April 2026</td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">May 2026</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm"><Link to="/exams/jee-advanced" className="text-blue-600 hover:underline font-semibold">JEE Advanced</Link></td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">May 26, 2026</td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">June 9, 2026</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm"><Link to="/exams/bitsat" className="text-blue-600 hover:underline font-semibold">BITSAT</Link></td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">Session 1: May 26 to 30, 2026<br/>Session 2: June 2026</td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">July 04, 2026</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm"><Link to="/exams/viteee" className="text-blue-600 hover:underline font-semibold">VITEEE</Link></td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">April 19 - April 30, 2026</td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">May 3, 2026</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm"><Link to="/exams/srmjeee" className="text-blue-600 hover:underline font-semibold">SRMJEEE</Link></td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">Phase 1: April 19 - 21, 2026<br/>Phase 2: June 21 - 23, 2026</td>
                      <td className="border border-gray-300 py-2 px-4 text-center text-sm">June 29, 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* JEE Mains Cutoffs */}
              <h3 id="cutoffs" className="text-xl font-bold text-gray-900 mb-4">JEE Mains Cutoffs</h3>
              <p className="text-gray-700 text-sm mb-4">JEE Mains Cutoffs are released by NTA or National Testing Agency along with the results of the last session. JEE Mains cut-off is the minimum qualifying percentile required to appear for the JEE Advanced exam.</p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Category</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Cutoff Percentile 2025</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Cutoff Percentile 2024</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-sm">General (UR)</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">93.1023262</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">93.2362181</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-sm">EWS</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">80.3830119</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">79.6757881</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-sm">OBC-NCL</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">79.4313582</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">60.0923182</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-sm">SC</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">61.1526933</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">46.697584</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 py-2 px-4 text-sm">ST</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">47.9026465</td>
                      <td className="border border-gray-300 py-2 px-4 text-sm">~ 0.0018700</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Syllabus Section */}
              <h2 id="syllabus" className="text-2xl font-bold text-gray-900 mb-4">BTech CSE Syllabus</h2>
              <p className="text-gray-700 text-sm mb-4">Check out the semester-wise syllabus for the BTech cse course in the table below.</p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 1</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Computational mathematics -I</td><td className="border border-gray-300 py-2 px-4 text-sm">Computational mathematics -II</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Digital logic</td><td className="border border-gray-300 py-2 px-4 text-sm">Computer organization</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Communication skill</td><td className="border border-gray-300 py-2 px-4 text-sm">Operating systems</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Systems programming</td><td className="border border-gray-300 py-2 px-4 text-sm">Microprocessor & microcontroller</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 3</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Computer architecture</td><td className="border border-gray-300 py-2 px-4 text-sm">Software engineering -I</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Compiler design</td><td className="border border-gray-300 py-2 px-4 text-sm">Object oriented system</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Database management systems</td><td className="border border-gray-300 py-2 px-4 text-sm">Optimization techniques</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Design & analysis of algorithms</td><td className="border border-gray-300 py-2 px-4 text-sm">Computer networks</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 5</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">VLSI technology</td><td className="border border-gray-300 py-2 px-4 text-sm">Industrial management</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Business process logic</td><td className="border border-gray-300 py-2 px-4 text-sm">Digital signal processing</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Soft computing</td><td className="border border-gray-300 py-2 px-4 text-sm">-</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 7</th>
                      <th className="border border-gray-300 py-3 px-4 font-bold text-gray-800 text-sm">Semester 8</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Internet technology</td><td className="border border-gray-300 py-2 px-4 text-sm">Artificial intelligence</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Multimedia technology</td><td className="border border-gray-300 py-2 px-4 text-sm">Economics</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Practical's</td><td className="border border-gray-300 py-2 px-4 text-sm">Practical's</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Elective - I</td><td className="border border-gray-300 py-2 px-4 text-sm">Elective - II</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Course Comparison */}
              <h2 id="comparison" className="text-2xl font-bold text-gray-900 mb-4">BTech CSE Course Comparison</h2>
              <p className="text-gray-700 text-sm mb-4">Check out the course comparison of BTech cse with btech it and BCA.</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">BTech CSE vs BTech IT</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 py-3 px-4 text-left font-bold text-gray-800 text-sm">Parameters</th>
                      <th className="border border-gray-300 py-3 px-4 text-left font-bold text-gray-800 text-sm">BTech CSE</th>
                      <th className="border border-gray-300 py-3 px-4 text-left font-bold text-gray-800 text-sm">BTech IT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Full Form</td><td className="border border-gray-300 py-2 px-4 text-sm">Bachelor of Technology in Computer Science Engineering</td><td className="border border-gray-300 py-2 px-4 text-sm">Bachelor of Technology in Information Technology</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Duration</td><td className="border border-gray-300 py-2 px-4 text-sm">4 Years</td><td className="border border-gray-300 py-2 px-4 text-sm">4 Years</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Eligibility</td><td className="border border-gray-300 py-2 px-4 text-sm">10+2 with minimum 55% marks</td><td className="border border-gray-300 py-2 px-4 text-sm">Minimum 50% in 10+2 with science stream</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Course Fees</td><td className="border border-gray-300 py-2 px-4 text-sm">INR 2 lakhs- INR 10 lakhs</td><td className="border border-gray-300 py-2 px-4 text-sm">INR 30,000 to INR 8,00,000</td></tr>
                    <tr><td className="border border-gray-300 py-2 px-4 text-sm">Average Salary</td><td className="border border-gray-300 py-2 px-4 text-sm">INR 1.5 lakhs – INR 4.5 lakhs</td><td className="border border-gray-300 py-2 px-4 text-sm">INR 3,00,000 - INR 4,50,000</td></tr>
                  </tbody>
                </table>
              </div>

              {/* FAQs */}
              <h2 id="faqs" className="text-2xl font-bold text-gray-900 mb-6">BTech CSE: FAQs</h2>
              <div className="space-y-3">
                {[
                  { q: 'Is BTech CSE easy?', a: 'Students who have passion for programming languages and want to work in the related field, pursuing BTech in CSE will seemingly be easy for them.' },
                  { q: 'How can I get admission in BTech CSE?', a: 'To get admission in Btech CSE, the student needs to have passed class 12 or equivalent examination with at least 45% aggregate. Further eligibility requirements include studying Physics, Chemistry, Mathematics and Computer Science as compulsory subjects in 10+2.' },
                  { q: 'Can I do BTech CSE without JEE?', a: 'Yes, there are some colleges in India that do not require the students to submit the JEE marks to take admission in BTech CSE.' },
                  { q: 'Is BTech CSE good for the future?', a: 'With the world getting digital at every step, the IT sector has been blooming impressively. Hence pursuing BTech in CSE and qualifying with standard grades definitely has a brilliant future to give you.' }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-gray-300 rounded">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                      {expandedFaq === idx ? <FiChevronUp size={18} className="text-gray-600 flex-shrink-0" /> : <FiChevronDown size={18} className="text-gray-600 flex-shrink-0" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-3 text-gray-700 text-sm border-t border-gray-200 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar - 25% width */}
          <aside className="w-3/12">
            {/* College Cards */}
            <div className="space-y-4">
              {[
                { name: 'IIT Roorkee - [IITR]', location: 'Roorkee, Uttarakhand', course: 'BE/B.Tech', duration: '4 Yrs', fee: '2.24 L', rating: '10.0' },
                { name: 'IIT Guwahati - [IITG]', location: 'Guwahati, Assam', course: 'BE/B.Tech', duration: '4 Yrs', fee: '2.44 L', rating: '10.0' },
                { name: 'IIT Hyderabad - [IITH]', location: 'Hyderabad, Telangana', course: 'BE/B.Tech', duration: '4 Yrs', fee: '2.5 L', rating: '10.0' }
              ].map((college, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Top Image Section */}
                  <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                      <button className="text-xs bg-white/90 hover:bg-white px-2 py-1 rounded text-gray-700 font-semibold">+ FOLLOW</button>
                      <button className="text-white hover:text-red-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                      </button>
                    </div>
                    {/* College Logo and Info */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                        <div>
                          <Link to={`/colleges/${idx + 1}`} className="text-white text-xs font-semibold hover:underline block">{college.name}</Link>
                          <div className="text-xs text-white/90 flex items-center gap-1">
                            <span>{college.location}</span>
                            <span className="mx-1">|</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l-4-4h8l-4 4z"/></svg>
                              AICTE
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Bottom Info Section */}
                  <div className="p-3 bg-gradient-to-b from-orange-100 to-orange-50">
                    <div className="flex justify-between items-center mb-2">
                      <Link to={`/colleges/${idx + 1}/courses`} className="text-xs font-bold text-gray-900">{college.course} <span className="text-xs font-normal">({college.duration})</span></Link>
                      <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">{college.rating}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-2">
                      ₹ {college.fee} <span className="text-xs font-normal text-gray-600">first year fees</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/colleges/${idx + 1}/courses`} className="text-xs text-blue-600 hover:underline font-semibold">VIEW ALL COURSES & FEES</Link>
                      <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded">
                        Download Brochure
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
