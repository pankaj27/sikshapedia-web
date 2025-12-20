import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiChevronRight, FiPlus, FiMinus } from 'react-icons/fi';
import { Button } from './ui/button';

import { Link } from './CustomLink';
// Widget Renderer Component
const WidgetRenderer = ({ widget }) => {
  if (!widget.enabled) return null;

  switch (widget.type) {
    case 'rich_text':
      return (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            {widget.title && widget.title !== 'Rich Text Block' && (
              <h2 className="text-2xl font-bold mb-6">{widget.title}</h2>
            )}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: widget.content?.content || '' }}
            />
          </div>
        </section>
      );

    case 'faq':
      return <FAQWidget widget={widget} />;

    case 'cta_cards':
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {widget.title && widget.title !== 'CTA Cards' && (
              <h2 className="text-2xl font-bold mb-8 text-center">{widget.title}</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(widget.content?.cards || []).map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl border p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  {card.button_text && card.button_link && (
                    <Link to={card.button_link}>
                      <Button variant="outline" size="sm">{card.button_text}</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'stats':
      return (
        <section className="py-12 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
          <div className="max-w-6xl mx-auto px-4">
            {widget.title && widget.title !== 'Stats Counter' && (
              <h2 className="text-2xl font-bold mb-8 text-center">{widget.title}</h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {(widget.content?.items || []).map((item, idx) => (
                <div key={idx}>
                  <div className="text-4xl font-bold mb-2">{item.value}</div>
                  <div className="text-purple-200">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'image_text':
      const isImageLeft = widget.content?.layout === 'image-left';
      return (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
              {widget.content?.image && (
                <div className="md:w-1/2">
                  <img 
                    src={widget.content.image} 
                    alt={widget.content?.title || 'Image'}
                    className="rounded-xl shadow-lg w-full"
                  />
                </div>
              )}
              <div className="md:w-1/2">
                {widget.content?.title && (
                  <h2 className="text-2xl font-bold mb-4">{widget.content.title}</h2>
                )}
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: widget.content?.content || '' }}
                />
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};

// FAQ Widget with accordion functionality
const FAQWidget = ({ widget }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {widget.title && (
          <h2 className="text-2xl font-bold mb-8 text-center">{widget.title}</h2>
        )}
        <div className="space-y-3">
          {(widget.content?.items || []).map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition"
              >
                <span>{item.question}</span>
                {openIndex === idx ? <FiMinus /> : <FiPlus />}
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Hero Section Component
const HeroSection = ({ pageData, defaultGradient = 'from-purple-600 to-indigo-700' }) => {
  if (!pageData.hero_enabled) return null;

  const bgClass = pageData.hero_background_type === 'gradient' 
    ? `bg-gradient-to-r ${pageData.hero_background_value || defaultGradient}`
    : pageData.hero_background_type === 'color'
    ? pageData.hero_background_value
    : '';

  const bgStyle = pageData.hero_background_type === 'image' && pageData.hero_image
    ? { backgroundImage: `url(${pageData.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className={`${bgClass} text-white`} style={bgStyle}>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{pageData.hero_title}</h1>
        {pageData.hero_subtitle && (
          <p className="text-lg text-white/90 max-w-3xl">{pageData.hero_subtitle}</p>
        )}
        {pageData.hero_cta_text && pageData.hero_cta_link && (
          <div className="mt-6">
            <Link to={pageData.hero_cta_link}>
              <Button className="bg-white text-purple-700 hover:bg-gray-100">
                {pageData.hero_cta_text}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Breadcrumb Component
const Breadcrumb = ({ items }) => (
  <div className="bg-white border-b">
    <div className="max-w-5xl mx-auto px-4 py-3">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-500 hover:text-purple-600">Home</Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <FiChevronRight className="text-gray-400" />
            {item.link ? (
              <Link to={item.link} className="text-gray-500 hover:text-purple-600">{item.label}</Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  </div>
);

// Main Static Page Renderer
const StaticPageRenderer = ({ pageData, loading, fallbackContent, breadcrumbItems }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 h-48 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // If no CMS data, render fallback
  if (!pageData || (!pageData.widgets?.length && !pageData.hero_title)) {
    return fallbackContent || null;
  }

  // Sort widgets by order
  const sortedWidgets = [...(pageData.widgets || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Head */}
      <Helmet>
        <title>{pageData.meta_title || pageData.page_title || 'Admissionbuddy'}</title>
        {pageData.meta_description && <meta name="description" content={pageData.meta_description} />}
        {pageData.meta_keywords?.length > 0 && <meta name="keywords" content={pageData.meta_keywords.join(', ')} />}
        {pageData.og_image && <meta property="og:image" content={pageData.og_image} />}
        {pageData.canonical_url && <link rel="canonical" href={pageData.canonical_url} />}
      </Helmet>

      {/* Hero Section */}
      <HeroSection pageData={pageData} />

      {/* Breadcrumb */}
      {pageData.show_breadcrumb && breadcrumbItems && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      {/* Widgets */}
      {sortedWidgets.map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} />
      ))}
    </div>
  );
};

export default StaticPageRenderer;
export { HeroSection, Breadcrumb, WidgetRenderer, FAQWidget };
