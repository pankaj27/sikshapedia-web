import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { Link } from './CustomLink';

/**
 * AuthorInfo Component - Displays content team/author information
 * 
 * Props:
 * - name: Author name (falls back to "Content Team")
 * - photo: Author photo URL (falls back to favicon if broken/missing)
 * - role: Author role (default: "Content Writer")
 * - updatedAt: Last updated date/time
 * - createdAt: Created date/time
 * - showLink: Whether to show link to author page (default: true)
 * - size: "sm" | "md" | "lg" (default: "md")
 * - variant: "light" | "dark" (for different backgrounds)
 */

const FALLBACK_IMAGE = '/favicon.png';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AuthorInfo = ({
  name,
  photo,
  role = 'Content Writer',
  updatedAt,
  createdAt,
  showLink = true,
  size = 'md',
  variant = 'light',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  
  const authorName = name || 'Content Team';
  const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Size configurations
  const sizes = {
    sm: { container: 'gap-2', image: 'w-8 h-8', icon: 14, name: 'text-xs', role: 'text-[10px]' },
    md: { container: 'gap-3', image: 'w-10 h-10', icon: 18, name: 'text-sm', role: 'text-xs' },
    lg: { container: 'gap-4', image: 'w-12 h-12', icon: 22, name: 'text-base', role: 'text-sm' }
  };
  
  const s = sizes[size] || sizes.md;
  
  // Variant configurations
  const variants = {
    light: {
      bg: 'bg-white',
      name: 'text-gray-900 hover:text-orange-600',
      role: 'text-gray-600',
      fallbackBg: 'bg-gradient-to-br from-orange-400 to-orange-600'
    },
    dark: {
      bg: 'bg-white/10 backdrop-blur-sm',
      name: 'text-white hover:text-orange-200',
      role: 'text-gray-300',
      fallbackBg: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  };
  
  const v = variants[variant] || variants.light;
  
  const timeText = updatedAt 
    ? `Updated ${formatTimeAgo(updatedAt)}` 
    : createdAt 
      ? `Added ${formatTimeAgo(createdAt)}`
      : 'Updated recently';

  const handleImageError = () => {
    setImageError(true);
  };

  const renderImage = () => {
    // If no photo provided or image failed to load, show fallback
    if (!photo || imageError) {
      return (
        <img 
          src={FALLBACK_IMAGE}
          alt="admissionbuddy"
          className="w-full h-full object-cover"
          onError={(e) => {
            // If even favicon fails, show icon
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    return (
      <img 
        src={photo}
        alt={authorName}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    );
  };

  const NameComponent = showLink ? (
    <Link 
      to={`/author/${authorSlug}`} 
      className={`${s.name} font-semibold ${v.name} transition-colors`}
    >
      {authorName}
    </Link>
  ) : (
    <span className={`${s.name} font-semibold ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {authorName}
    </span>
  );

  return (
    <div className={`flex items-center ${s.container} ${className}`}>
      <div className={`${s.image} rounded-full overflow-hidden flex-shrink-0 relative`}>
        {renderImage()}
        {/* Hidden fallback icon in case all images fail */}
        <div 
          className={`absolute inset-0 ${v.fallbackBg} items-center justify-center text-white hidden`}
          style={{ display: 'none' }}
        >
          <FiUser size={s.icon} />
        </div>
      </div>
      <div>
        {NameComponent}
        <p className={`${s.role} ${v.role}`}>
          {role} | {timeText}
        </p>
      </div>
    </div>
  );
};

// Compact version for cards
export const AuthorInfoCompact = ({ name, photo, updatedAt }) => {
  const [imageError, setImageError] = useState(false);
  const authorName = name || 'Content Team';
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        {!photo || imageError ? (
          <img 
            src={FALLBACK_IMAGE}
            alt="admissionbuddy"
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={photo}
            alt={authorName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <span className="text-xs text-gray-600 truncate max-w-[100px]">{authorName}</span>
    </div>
  );
};

// For hero sections with dark background
export const AuthorInfoHero = ({ 
  name, 
  photo, 
  updatedAt, 
  createdAt,
  label = 'Curated by' 
}) => {
  const [imageError, setImageError] = useState(false);
  const authorName = name || 'Content Team';
  
  const timeText = updatedAt 
    ? `Updated ${formatTimeAgo(updatedAt)}` 
    : createdAt 
      ? `Added ${formatTimeAgo(createdAt)}`
      : 'Updated recently';
  
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
        {!photo || imageError ? (
          <img 
            src={FALLBACK_IMAGE}
            alt="admissionbuddy"
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={photo}
            alt={authorName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div>
        <p className="text-xs text-blue-200">{label}</p>
        <p className="font-semibold text-sm text-white">{authorName}</p>
        <p className="text-xs text-blue-300">{timeText}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
