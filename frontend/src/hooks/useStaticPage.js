import { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * Custom hook to fetch static page data from CMS
 * @param {string} slug - The page slug (e.g., 'about', 'contact', 'privacy')
 * @returns {{ pageData: object, loading: boolean, error: string|null, refetch: function }}
 */
const useStaticPage = (slug) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/static-pages/${slug}`);
      setPageData(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching static page '${slug}':`, err);
      setError(err.message || 'Failed to load page');
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [slug]);

  return { pageData, loading, error, refetch: fetchPage };
};

export default useStaticPage;
