import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUser, FiEye, FiHeart, FiClock, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredArticles, setFeaturedArticles] = useState([]);

  const categories = ['All', 'Admissions', 'Exams', 'Career', 'Study Abroad', 'Financial Aid', 'College Life'];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      const response = await api.get(`/articles?${params.toString()}`);
      setArticles(response.data);
      
      // Set featured articles (top 3)
      setFeaturedArticles(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to mock data
      const mockArticles = generateMockArticles();
      setArticles(mockArticles);
      setFeaturedArticles(mockArticles.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const generateMockArticles = () => {
    return [
      {
        id: 1,
        title: 'Complete Guide to JEE Main 2026 Preparation',
        excerpt: 'Everything you need to know about JEE Main preparation including study plan, best books, and expert tips for success.',
        category: 'Exams',
        author_name: 'Dr. Rajesh Kumar',
        views: 15420,
        likes: 892,
        published_date: '2024-12-10',
        read_time: 8,
        image: 'jee'
      },
      {
        id: 2,
        title: 'Top 10 Engineering Colleges in India 2026',
        excerpt: 'Discover the best engineering colleges in India based on NIRF rankings, placements, and campus facilities.',
        category: 'Admissions',
        author_name: 'Priya Sharma',
        views: 23500,
        likes: 1245,
        published_date: '2024-12-09',
        read_time: 10,
        image: 'colleges'
      },
      {
        id: 3,
        title: 'How to Study Abroad with Scholarships',
        excerpt: 'Step-by-step guide to securing scholarships for studying abroad in USA, UK, Canada, and Australia.',
        category: 'Study Abroad',
        author_name: 'Amit Verma',
        views: 18900,
        likes: 1087,
        published_date: '2024-12-08',
        read_time: 12,
        image: 'abroad'
      },
      {
        id: 4,
        title: 'NEET 2025: Important Updates and Changes',
        excerpt: 'Latest updates about NEET 2025 exam pattern, syllabus changes, and preparation strategy.',
        category: 'Exams',
        author_name: 'Dr. Anjali Patel',
        views: 20150,
        likes: 956,
        published_date: '2024-12-07',
        read_time: 6,
        image: 'neet'
      },
      {
        id: 5,
        title: 'Career Options After B.Tech: A Complete Guide',
        excerpt: 'Explore various career paths available after completing B.Tech including higher studies and job opportunities.',
        category: 'Career',
        author_name: 'Rahul Mehta',
        views: 16780,
        likes: 734,
        published_date: '2024-12-06',
        read_time: 9,
        image: 'career'
      },
      {
        id: 6,
        title: 'Education Loan Guide: Everything You Need to Know',
        excerpt: 'Complete guide to education loans in India covering banks, interest rates, eligibility, and application process.',
        category: 'Financial Aid',
        author_name: 'Sneha Reddy',
        views: 14230,
        likes: 678,
        published_date: '2024-12-05',
        read_time: 11,
        image: 'loan'
      },
      {
        id: 7,
        title: 'CAT 2025 Preparation Strategy for Working Professionals',
        excerpt: 'How to balance work and CAT preparation with effective time management and study techniques.',
        category: 'Exams',
        author_name: 'Vikram Singh',
        views: 12890,
        likes: 567,
        published_date: '2024-12-04',
        read_time: 7,
        image: 'cat'
      },
      {
        id: 8,
        title: 'Life at IIT: What to Expect in Your First Year',
        excerpt: 'An insider look at campus life, academics, extracurriculars, and hostel experience at IITs.',
        category: 'College Life',
        author_name: 'Arjun Kapoor',
        views: 19560,
        likes: 1123,
        published_date: '2024-12-03',
        read_time: 8,
        image: 'iit'
      },
      {
        id: 9,
        title: 'Scholarship Opportunities for Class 12 Students',
        excerpt: 'List of merit and need-based scholarships available for students appearing in Class 12 boards.',
        category: 'Financial Aid',
        author_name: 'Kavita Nair',
        views: 11450,
        likes: 445,
        published_date: '2024-12-02',
        read_time: 5,
        image: 'scholarship'
      }
    ];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchArticles();
      return;
    }
    try {
      const response = await api.get(`/articles?search=${encodeURIComponent(searchQuery)}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      // Filter mock articles by search
      const filtered = generateMockArticles().filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setArticles(filtered);
    }
  };

  const getImageGradient = (imageType) => {
    const gradients = {
      jee: 'from-teal-400 to-cyan-500',
      colleges: 'from-emerald-400 to-teal-500',
      abroad: 'from-cyan-400 to-blue-500',
      neet: 'from-sky-400 to-cyan-500',
      career: 'from-teal-500 to-emerald-600',
      loan: 'from-cyan-500 to-sky-600',
      cat: 'from-blue-400 to-cyan-500',
      iit: 'from-emerald-500 to-teal-600',
      scholarship: 'from-teal-400 to-sky-500'
    };
    return gradients[imageType] || 'from-teal-400 to-cyan-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="Education Blog & Articles | AdmissionBuddy"
        description="Expert advice, tips, and guides for students on admissions, exams, career, and study abroad."
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Blog</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Education Blog & Articles
          </h1>
          <p className="text-sm md:text-base text-center text-teal-50 mb-4">
            Expert advice, tips, and guides for students
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm bg-white text-gray-900"
              />
              <Button type="submit" className="bg-white text-teal-600 hover:bg-teal-50 h-9 px-4 text-sm">
                <FiSearch className="mr-1.5" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                  (selectedCategory === category || (category === 'All' && !selectedCategory))
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {!loading && !selectedCategory && featuredArticles.length > 0 && (
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-teal-600" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 hover:shadow-md transition border border-teal-100"
                >
                  <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-xs font-semibold inline-block mb-2">
                    Featured
                  </span>
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiEye className="text-xs" />
                      <span>{(article.views / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      <span>{article.read_time} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FiBookOpen className="text-teal-600" />
              {selectedCategory ? `${selectedCategory} Articles` : 'Latest Articles'}
            </h2>
            {!loading && (
              <span className="text-xs text-gray-600">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-sm text-gray-500">No articles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                >
                  <div className={`h-32 bg-gradient-to-br ${getImageGradient(article.image)} relative`}>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                      {article.read_time} min read
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-teal-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <FiEye className="text-xs" />
                          <span>{(article.views / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart className="text-xs" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUser className="text-xs" />
                        <span className="truncate max-w-[100px]">{article.author_name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!loading && articles.length > 0 && (
        <section className="py-6 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-lg font-bold mb-2">Want to contribute?</h3>
            <p className="text-sm text-gray-600 mb-4">Share your knowledge and help students make better decisions</p>
            <Link to="/contact">
              <Button className="bg-teal-600 hover:bg-teal-700 h-8 text-xs">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPage;
