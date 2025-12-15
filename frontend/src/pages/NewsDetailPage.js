import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiUser, FiShare2, FiDownload, FiThumbsUp } from 'react-icons/fi';
import { Button } from '../components/ui/button';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Mock news data
  const newsArticle = {
    id: 1,
    title: 'JEE Main 2025 Session 1 Exam Analysis - Live Updates',
    category: 'Exam Analysis',
    publishDate: 'Jan 24, 2025',
    author: {
      name: 'Shivam Yadav',
      designation: 'Content Writer | Engineering Expert',
      image: 'https://via.placeholder.com/50'
    },
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    summary: 'The JEE Main 2025 Session 1 exam was conducted on January 24, 2025 in CBT mode. Get complete exam analysis with section-wise difficulty, good attempts, and expected cutoff.',
    content: `
The JEE Main 2025 Session 1 is scheduled on 24th January 2025 in **CBT Mode in two slots: 9:00 AM to 12:00 PM and 3:00 PM to 6:00 PM.** The **JEE Main 2025 Session 1 Exam Analysis Live Updates** will be provided here, based on student feedback and expert insights.

Through this analysis, candidates can get insights into the **overall difficulty level, section-wise weightage, number of questions, and high-scoring topics** in the exam.

The **JEE Main 2025 Session 1 will have 90 questions divided into 3 sections**: Physics, Chemistry, and Mathematics in 3 hours, **with overall difficulty ranging from Moderate to Difficult.**
    `,
    
    tables: {
      overallAnalysis: {
        title: 'JEE Main 2025 Session 1 Overall Exam Analysis',
        data: [
          { particular: 'Number of Questions', value: '90' },
          { particular: 'Total Marks', value: '300' },
          { particular: 'Overall Difficulty', value: 'Moderate to Difficult' },
          { particular: 'Difficulty Level of Physics', value: 'Moderate' },
          { particular: 'Difficulty Level of Chemistry', value: 'Easy to Moderate' },
          { particular: 'Difficulty Level of Mathematics', value: 'Difficult' },
          { particular: 'Good Attempt (Overall)', value: '65-75 questions' }
        ]
      },
      sectionWise: {
        title: 'JEE Main 2025 Section-wise Exam Analysis',
        columns: ['Section', 'Difficulty', 'Good Attempts', 'Highlights'],
        data: [
          {
            section: 'Physics (30 Q)',
            difficulty: 'Moderate',
            goodAttempts: '20-24',
            highlights: 'Numerical value questions were calculation-heavy; Theory-based questions were manageable'
          },
          {
            section: 'Chemistry (30 Q)',
            difficulty: 'Easy-Moderate',
            goodAttempts: '23-27',
            highlights: 'Organic chemistry had more weightage; Inorganic was NCERT-based'
          },
          {
            section: 'Mathematics (30 Q)',
            difficulty: 'Difficult',
            goodAttempts: '18-22',
            highlights: 'Calculus and coordinate geometry were tricky; Algebra was lengthy'
          }
        ]
      }
    },
    
    memoryBasedQuestions: [
      { section: 'Physics', questions: ['Photoelectric Effect numerical', 'Circular Motion problems', 'Thermodynamics - Heat Engine efficiency', 'Electromagnetic Induction - Faraday\'s Law'] },
      { section: 'Chemistry', questions: ['Aldol Condensation mechanism', 'Periodic table trends', 'Chemical Bonding - Hybridization', 'Electrochemistry - Nernst Equation'] },
      { section: 'Mathematics', questions: ['Definite Integration', 'Vector 3D Geometry', 'Probability - Conditional', 'Complex Numbers'] }
    ],
    
    relatedArticles: [
      { title: 'JEE Main 2025 Answer Key', link: '/news/jee-main-answer-key' },
      { title: 'JEE Main 2025 Result Date', link: '/news/jee-main-result' },
      { title: 'JEE Main 2025 Cutoff', link: '/news/jee-main-cutoff' }
    ],
    
    faqs: [
      {
        question: 'What was the overall difficulty of JEE Main 2025 Session 1?',
        answer: 'The overall difficulty of JEE Main 2025 Session 1 was Moderate to Difficult, with Mathematics being the toughest section.'
      },
      {
        question: 'How many questions should I have attempted to get a good percentile?',
        answer: 'Attempting 65-75 questions with good accuracy can help you secure above 95 percentile.'
      },
      {
        question: 'Which section was the easiest in JEE Main 2025?',
        answer: 'Chemistry was relatively easier compared to Physics and Mathematics, with most questions being NCERT-based.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-orange-600">News</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{newsArticle.category}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-3">
              {newsArticle.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{newsArticle.title}</h1>
            
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={newsArticle.author.image} alt={newsArticle.author.name} className="w-12 h-12 rounded-full" />
                <div>
                  <Link to="#" className="font-semibold text-gray-900 hover:text-orange-600">{newsArticle.author.name}</Link>
                  <p className="text-sm text-gray-600">{newsArticle.author.designation}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCalendar size={16} />
                  <span>Updated on - {newsArticle.publishDate}</span>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <FiShare2 className="mr-2" size={16} />
                    Share
                  </Button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border p-2 z-50">
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Facebook</button>
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Twitter</button>
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">LinkedIn</button>
                      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">WhatsApp</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <img
              src={newsArticle.featuredImage}
              alt={newsArticle.title}
              className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
            />

            {/* Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-gray-800 leading-relaxed">{newsArticle.summary}</p>
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: newsArticle.content.replace(/\n/g, '<br/>') }} />
            </div>

            {/* Download Button */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-center text-white mb-6">
              <h3 className="text-xl font-bold mb-2">Download Question Paper PDF</h3>
              <p className="mb-4 opacity-90">Get complete question paper with solutions</p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100">
                <FiDownload className="mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Overall Analysis Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
                <h2 className="text-xl font-bold text-white">{newsArticle.tables.overallAnalysis.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {newsArticle.tables.overallAnalysis.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-semibold text-gray-800">{row.particular}</td>
                        <td className="px-6 py-3 text-gray-700">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section-wise Analysis Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3">
                <h2 className="text-xl font-bold text-white">{newsArticle.tables.sectionWise.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {newsArticle.tables.sectionWise.columns.map((col, idx) => (
                        <th key={idx} className="px-6 py-3 text-left text-sm font-bold text-gray-700">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {newsArticle.tables.sectionWise.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-semibold text-gray-800">{row.section}</td>
                        <td className="px-6 py-3 text-gray-700">{row.difficulty}</td>
                        <td className="px-6 py-3 text-gray-700">{row.goodAttempts}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{row.highlights}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Memory-Based Questions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Memory-Based Questions</h2>
              <div className="space-y-4">
                {newsArticle.memoryBasedQuestions.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-bold text-lg mb-2">{item.section}</h3>
                    <ul className="space-y-1 text-gray-700">
                      {item.questions.map((q, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {newsArticle.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{idx + 1}. {faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Comments (2)</h2>
              
              {/* Add Comment Form */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Leave a Comment</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <textarea
                    placeholder="Write your comment here..."
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Rajesh Kumar</h4>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-gray-700 text-sm">Very helpful analysis! Mathematics was really tough this time.</p>
                    <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-orange-600 mt-2">
                      <FiThumbsUp size={14} />
                      Helpful (15)
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Priya Singh</h4>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-700 text-sm">Thanks for the detailed section-wise analysis!</p>
                    <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-orange-600 mt-2">
                      <FiThumbsUp size={14} />
                      Helpful (8)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Table of Contents</h3>
              <nav className="space-y-2 text-sm">
                <a href="#overview" className="block text-blue-600 hover:text-orange-600">Overall Analysis</a>
                <a href="#section" className="block text-blue-600 hover:text-orange-600">Section-wise Analysis</a>
                <a href="#memory" className="block text-blue-600 hover:text-orange-600">Memory-Based Questions</a>
                <a href="#faq" className="block text-blue-600 hover:text-orange-600">FAQs</a>
              </nav>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3">Related Articles</h3>
              <div className="space-y-3">
                {newsArticle.relatedArticles.map((article, idx) => (
                  <Link
                    key={idx}
                    to={article.link}
                    className="block p-3 border rounded hover:bg-orange-50 hover:border-orange-500 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">{article.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Advertisement */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white text-center">
              <h3 className="font-bold mb-2">Predict Your College</h3>
              <p className="text-sm mb-3 opacity-90">Based on your JEE rank</p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                Predict Now
              </Button>
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm text-gray-600 mb-3">Get latest exam updates</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm">
                Subscribe
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
