import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiUser, FiEye, FiHeart, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import AuthorInfo from '../components/AuthorInfo';

import { Link } from '../components/CustomLink';
const BlogDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      // Try blogs endpoint first (admin-managed blogs)
      let articleData = null;
      try {
        const blogResponse = await api.get(`/blogs/${id}`);
        if (blogResponse.data) {
          articleData = {
            ...blogResponse.data,
            author_name: blogResponse.data.author,
            published_date: blogResponse.data.published_at,
            read_time: blogResponse.data.read_time || Math.ceil((blogResponse.data.content?.length || 500) / 1000),
            image: blogResponse.data.featured_image
          };
        }
      } catch (blogError) {
        console.log('Blog not found, trying articles endpoint...');
      }
      
      // Fallback to articles endpoint
      if (!articleData) {
        const response = await api.get(`/articles/${id}`);
        articleData = response.data;
      }
      
      setArticle(articleData);
      
      // Fetch related articles from blogs
      if (articleData?.category) {
        try {
          const relatedRes = await api.get(`/blogs?category=${articleData.category}&limit=4`);
          const related = (relatedRes.data || [])
            .filter(a => a.id !== id)
            .slice(0, 3)
            .map(blog => ({
              ...blog,
              author_name: blog.author,
              published_date: blog.published_at,
              image: blog.featured_image
            }));
          setRelatedArticles(related);
        } catch (relatedError) {
          console.log('Could not fetch related articles');
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Article not found</p>
          <Link to="/blog">
            <Button className="bg-orange-600 hover:bg-orange-700">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <FiArrowLeft /> Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              
              <div className="flex items-center justify-between gap-6 text-sm text-gray-600 mb-6 pb-6 border-b">
                <AuthorInfo
                  name={article.author_name}
                  photo={article.author_photo}
                  role="Author"
                  createdAt={article.created_at}
                  showLink={true}
                  size="md"
                  variant="light"
                />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiEye />
                    <span>{article.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiHeart />
                    <span>{article.likes} likes</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                {article.content.split('\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                  } else if (paragraph.startsWith('- ')) {
                    return <li key={idx} className="ml-6 mb-1">{paragraph.replace('- ', '')}</li>;
                  } else if (paragraph.trim()) {
                    return <p key={idx} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div>
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.id}`}
                      className="block p-3 hover:bg-gray-50 rounded transition"
                    >
                      <h4 className="font-semibold mb-1 line-clamp-2">{related.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <FiEye />
                        <span>{related.views}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;