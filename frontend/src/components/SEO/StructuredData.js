import React from 'react';
import { Helmet } from 'react-helmet-async';

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "AdmissionBuddy",
    "url": "https://collegeportal-11.preview.emergentagent.com",
    "logo": "https://collegeportal-11.preview.emergentagent.com/admissionbuddy-logo.png",
    "description": "Find detailed information about top colleges, universities, courses, exams in India. Compare colleges, check rankings, fees, cutoffs, and admission details.",
    "sameAs": [
      "https://www.facebook.com/admissionbuddy",
      "https://twitter.com/admissionbuddy",
      "https://www.linkedin.com/company/admissionbuddy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-1234567890",
      "contactType": "Customer Service",
      "email": "support@admissionbuddy.com"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const CollegeSchema = ({ college }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "url": `https://collegeportal-11.preview.emergentagent.com/colleges/${college.id}`,
    "description": college.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": college.location?.city,
      "addressRegion": college.location?.state,
      "addressCountry": "IN"
    },
    "aggregateRating": college.rating ? {
      "@type": "AggregateRating",
      "ratingValue": college.rating,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://collegeportal-11.preview.emergentagent.com${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const FAQSchema = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AdmissionBuddy",
    "url": "https://collegeportal-11.preview.emergentagent.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://collegeportal-11.preview.emergentagent.com/colleges?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
