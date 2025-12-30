import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiUser, FiShare2, FiEye, FiLoader, FiArrowLeft, FiList } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import api from '../api/axios';
import AuthorInfo from '../components/AuthorInfo';

import { Link } from '../components/CustomLink';
const NewsDetailPage = () => {
  const { id } = useParams();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/news/${id}`);
      setArticle(response.data);
      
      // Fetch related news
      if (response.data?.category) {
        const relatedResponse = await api.get(`/news?category=${response.data.category}&limit=5`);
        const filtered = (relatedResponse.data || []).filter(n => n.id !== response.data.id && n.slug !== id);
        setRelatedNews(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const scrollToSection = (sectionId) => {
    // First try to find by exact ID
    let element = document.getElementById(sectionId);
    
    // If not found, try to find heading by text content
    if (!element) {
      const headings = document.querySelectorAll('h2, h3');
      for (const heading of headings) {
        const headingText = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (headingText === sectionId || heading.textContent?.toLowerCase().includes(sectionId.replace(/-/g, ' '))) {
          element = heading;
          break;
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowToc(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article does not exist.'}</p>
          <Link to="/news">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <FiArrowLeft className="mr-2" /> Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || article.summary} />
        {article.meta_keywords?.length > 0 && (
          <meta name="keywords" content={article.meta_keywords.join(', ')} />
        )}
        <meta property="og:title" content={article.meta_title || article.title} />
        <meta property="og:description" content={article.meta_description || article.summary} />
        <meta property="og:image" content={article.og_image || article.featured_image} />
        <meta property="og:type" content="article" />
        {article.canonical_url && <link rel="canonical" href={article.canonical_url} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b py-2">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-orange-600">Home</Link>
              <span>/</span>
              <Link to="/news" className="hover:text-orange-600">News</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{article.category}</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-6">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
              
              {/* Author Info */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <AuthorInfo
                  name={article.author}
                  photo={article.author_image}
                  role={article.author_designation || 'Content Writer'}
                  updatedAt={article.updated_at || article.published_at}
                  showLink={true}
                  size="md"
                  variant="light"
                />
                
                <div className="flex items-center gap-4">
                  {article.views > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiEye size={16} />
                      <span>{article.views} views</span>
                    </div>
                  )}
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
                        <button onClick={() => handleShare('facebook')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Facebook</button>
                        <button onClick={() => handleShare('twitter')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Twitter</button>
                        <button onClick={() => handleShare('linkedin')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">LinkedIn</button>
                        <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">WhatsApp</button>
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
              {article.featured_image && (
                <img
                  src={article.featured_image}
                  alt={article.featured_image_alt || article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-6"
                />
              )}

              {/* Video */}
              {article.video_url && (
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src={article.video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={article.title}
                    />
                  </div>
                </div>
              )}

              {/* Summary */}
              {article.summary && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div 
                    className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  />
                </div>
              )}

              {/* Table of Contents (Mobile Toggle) */}
              {article.toc_enabled && article.toc_items?.length > 0 && (
                <div className="lg:hidden bg-white rounded-lg shadow-md p-4 mb-6">
                  <button
                    onClick={() => setShowToc(!showToc)}
                    className="flex items-center justify-between w-full font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <FiList /> Table of Contents
                    </span>
                    <span>{showToc ? '−' : '+'}</span>
                  </button>
                  {showToc && (
                    <nav className="mt-3 space-y-2">
                      {article.toc_items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToSection(item.id)}
                          className={`block text-left text-blue-600 hover:text-orange-600 ${
                            item.level === 2 ? 'pl-4' : item.level === 3 ? 'pl-8' : ''
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  )}
                </div>
              )}

              {/* Article Content */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div 
                  className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-orange-600 prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: article.content || '' }} 
                />
              </div>

              {/* Custom Tables */}
              {article.tables?.length > 0 && article.tables.map((table, tableIdx) => (
                <div key={tableIdx} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
                    <h2 className="text-xl font-bold text-white">{table.title}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={`w-full ${table.style === 'striped' ? 'divide-y divide-gray-200' : ''}`}>
                      <thead className="bg-gray-100">
                        <tr>
                          {table.headers?.map((header, idx) => (
                            <th key={idx} className="px-6 py-3 text-left text-sm font-bold text-gray-700">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={table.style === 'striped' ? 'divide-y divide-gray-200' : ''}>
                        {table.rows?.map((row, rowIdx) => (
                          <tr key={rowIdx} className={`hover:bg-gray-50 ${table.style === 'striped' && rowIdx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-6 py-3 text-gray-700">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Image Gallery */}
              {article.gallery_images?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Image Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {article.gallery_images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url}
                          alt={img.alt || `Gallery image ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {img.caption && (
                          <p className="text-xs text-gray-600 mt-1">{img.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Banner */}
              {article.show_cta_banner && article.cta_banner?.title && (
                <div className={`bg-gradient-to-r ${article.cta_banner.gradient || 'from-orange-500 to-red-500'} rounded-lg p-6 text-center text-white mb-6`}>
                  <h3 className="text-xl font-bold mb-2">{article.cta_banner.title}</h3>
                  {article.cta_banner.subtitle && (
                    <p className="mb-4 opacity-90">{article.cta_banner.subtitle}</p>
                  )}
                  {article.cta_banner.button_text && (
                    <Link to={article.cta_banner.button_link || '#'}>
                      <Button className="bg-white text-orange-600 hover:bg-gray-100">
                        {article.cta_banner.button_text}
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/news?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-full text-sm transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to News */}
              <div className="flex justify-center">
                <Link to="/news">
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                    <FiArrowLeft className="mr-2" /> Back to All News
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Table of Contents (Desktop) */}
              {article.toc_enabled && article.toc_items?.length > 0 && (
                <div className="hidden lg:block bg-white rounded-lg shadow-md p-4 sticky top-20">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Table of Contents</h3>
                  <nav className="space-y-2 text-sm">
                    {article.toc_items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-left text-blue-600 hover:text-orange-600 ${
                          item.level === 2 ? 'pl-3' : item.level === 3 ? 'pl-6' : ''
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Articles */}
              {article.show_related_articles !== false && relatedNews.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Related Articles</h3>
                  <div className="space-y-3">
                    {relatedNews.map((news, idx) => (
                      <Link
                        key={idx}
                        to={`/news/${news.slug || news.id}`}
                        className="block p-3 border rounded hover:bg-orange-50 hover:border-orange-500 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{news.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(news.published_at)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Exams */}
              {article.show_related_exams !== false && article.related_exams?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Related Exams</h3>
                  <div className="space-y-2">
                    {article.related_exams.map((exam, idx) => (
                      <Link
                        key={idx}
                        to={`/exams/${exam.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-2 bg-gray-50 hover:bg-orange-50 rounded text-sm text-gray-700 hover:text-orange-600 transition-colors"
                      >
                        {exam}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Colleges */}
              {article.show_related_colleges !== false && article.related_colleges?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Related Colleges</h3>
                  <div className="space-y-2">
                    {article.related_colleges.map((college, idx) => {
                      const collegeName = typeof college === 'object' ? college.name : college;
                      return (
                        <Link
                          key={idx}
                          to={`/colleges/${collegeName.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-3 py-2 bg-gray-50 hover:bg-orange-50 rounded text-sm text-gray-700 hover:text-orange-600 transition-colors"
                        >
                          {collegeName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              {article.show_newsletter !== false && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md p-6 text-white">
                  <h3 className="font-bold mb-2">Subscribe to Newsletter</h3>
                  <p className="text-sm mb-3 opacity-90">Get latest news and updates</p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-lg text-sm text-gray-900 mb-2 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 text-sm">
                    Subscribe
                  </Button>
                </div>
              )}

              {/* Explore Colleges */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white text-center">
                <h3 className="font-bold mb-2">Explore Colleges</h3>
                <p className="text-sm mb-3 opacity-90">Find the best college for you</p>
                <Link to="/colleges">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                    Browse Colleges
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetailPage;
