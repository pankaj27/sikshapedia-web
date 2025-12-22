import React, { useState } from 'react';
import { FiMonitor, FiSmartphone, FiTablet, FiMaximize2, FiMinimize2, FiX } from 'react-icons/fi';

const LivePreview = ({ data, renderPreview }) => {
  const [device, setDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const deviceWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <span className="font-semibold text-gray-800">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-md transition ${device === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
              title="Mobile"
            >
              <FiSmartphone size={16} />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-md transition ${device === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
              title="Tablet"
            >
              <FiTablet size={16} />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-md transition ${device === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
              title="Desktop"
            >
              <FiMonitor size={16} />
            </button>
          </div>
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-200 rounded-lg"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Close"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className={`bg-gray-100 overflow-auto ${
        isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-[600px]'
      }`}>
        <div
          className="mx-auto bg-white min-h-full transition-all duration-300"
          style={{ 
            width: deviceWidths[device],
            maxWidth: '100%',
            boxShadow: device !== 'desktop' ? '0 0 20px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {renderPreview ? renderPreview(data) : (
            <DefaultPreview data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

// Default Preview Component
const DefaultPreview = ({ data }) => {
  if (!data) return (
    <div className="flex items-center justify-center h-full text-gray-400 p-8">
      <p>No preview data available</p>
    </div>
  );

  return (
    <div className="p-6">
      {/* Logo & Banner */}
      {data.logoBanner?.bannerUrl && (
        <div className="relative mb-6">
          <img 
            src={data.logoBanner.bannerUrl} 
            alt={data.logoBanner.bannerAlt || 'Banner'}
            className="w-full h-48 object-cover rounded-lg"
          />
          {data.logoBanner?.logoUrl && (
            <img 
              src={data.logoBanner.logoUrl} 
              alt="Logo"
              className="absolute bottom-4 left-4 h-16 bg-white p-2 rounded-lg shadow"
            />
          )}
        </div>
      )}

      {/* SEO Title */}
      {data.seo?.metaTitle && (
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.seo.metaTitle}</h1>
      )}

      {/* Badges */}
      {data.badges?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {data.badges.map((badge, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {badge.replace('_', ' ').toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Content Team */}
      {data.contentTeam?.author && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
          {data.contentTeam.authorImage && (
            <img 
              src={data.contentTeam.authorImage} 
              alt={data.contentTeam.author}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{data.contentTeam.author}</p>
            <p className="text-sm text-gray-500">Updated: {data.contentTeam.updatedDate}</p>
          </div>
        </div>
      )}

      {/* Menu */}
      {data.menu?.items?.length > 0 && (
        <div className="border-b mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {data.menu.items.filter(i => i.enabled).map((item, idx) => (
              <button
                key={idx}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  idx === 0 ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {data.toc?.items?.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Table of Contents</h3>
          <ul className="space-y-2">
            {data.toc.items.map((item, idx) => (
              <li key={idx}>
                <a href={`#${item.anchor}`} className="text-blue-600 hover:underline text-sm">
                  {idx + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content Blocks */}
      {data.contentBlocks?.map((block, idx) => {
        if (!block.visible) return null;
        
        switch (block.type) {
          case 'richtext':
            return (
              <div key={idx} id={block.data?.anchorId} className="mb-6">
                {block.data?.heading && (
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{block.data.heading}</h2>
                )}
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.data?.content || '' }}
                />
              </div>
            );
          case 'image':
            return block.data?.url && (
              <figure key={idx} className={`mb-6 ${block.data.alignment === 'center' ? 'text-center' : ''}`}>
                <img 
                  src={block.data.url} 
                  alt={block.data.alt}
                  className={`rounded-lg ${
                    block.data.alignment === 'full' ? 'w-full' : 'max-w-lg inline-block'
                  }`}
                />
                {block.data.caption && (
                  <figcaption className="text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>
                )}
              </figure>
            );
          case 'video':
            return block.data?.url && (
              <div key={idx} className="mb-6">
                {block.data.title && (
                  <h3 className="font-semibold text-gray-800 mb-2">{block.data.title}</h3>
                )}
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src={block.data.url.includes('embed') ? block.data.url : 
                      `https://www.youtube.com/embed/${block.data.url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || ''}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={block.data.title}
                  />
                </div>
              </div>
            );
          case 'table':
            return block.data?.rows?.length > 0 && (
              <div key={idx} className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {block.data.headers?.map((h, i) => (
                        <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.data.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-gray-50">
                        {row.map((cell, ci) => (
                          <td key={ci} className="border border-gray-300 px-4 py-2">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'gallery':
            return block.data?.images?.length > 0 && (
              <div key={idx} className="mb-6">
                <div className={`grid gap-4 ${
                  block.data.layout === 'grid' ? 'grid-cols-3' : 
                  block.data.layout === 'masonry' ? 'columns-3' : 'grid-cols-4'
                }`}>
                  {block.data.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img.url} 
                      alt={img.alt}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            );
          default:
            return null;
        }
      })}

      {/* Widget */}
      {data.widget?.type === 'cta' && data.widget.config?.title && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-4">{data.widget.config.title}</h3>
          <button className="px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100">
            {data.widget.config.buttonText || 'Learn More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
