import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title = 'AdmissionBuddy - Top Colleges, Universities & Institutes in India',
  description = 'Find detailed information about top colleges, universities, courses, exams, admissions, rankings, fees, and cutoffs. Compare colleges, read reviews, and make informed decisions.',
  keywords = 'colleges in india, top universities, engineering colleges, medical colleges, MBA colleges, admissions 2024, college rankings, course finder, exam preparation',
  canonical,
  ogImage = '/admissionbuddy-logo.png',
  type = 'website'
}) => {
  const siteUrl = 'https://adminsys-2.preview.emergentagent.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="AdmissionBuddy" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="AdmissionBuddy" />
    </Helmet>
  );
};

export default MetaTags;