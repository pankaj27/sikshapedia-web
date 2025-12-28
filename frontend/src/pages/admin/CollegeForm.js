import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiEdit, FiUpload, FiLoader, FiChevronDown, FiChevronRight, FiChevronUp,
  FiBook, FiMonitor, FiActivity, FiSearch, FiUsers, FiCast, FiVideo, FiDatabase,
  FiMic, FiZap, FiTarget, FiDroplet, FiGrid, FiSquare, FiSun, FiHome, FiMapPin,
  FiHeart, FiMessageCircle, FiTruck, FiCoffee, FiShoppingBag, FiShoppingCart,
  FiCreditCard, FiMail, FiWifi, FiBattery, FiShield, FiBriefcase, FiTrendingUp,
  FiAward, FiMusic, FiBookOpen, FiPrinter, FiFilm, FiPackage, FiFeather, FiUnlock,
  FiInfo, FiFileText, FiBarChart2, FiDollarSign, FiMessageSquare, FiBookmark, FiImage, FiCalendar, FiHelpCircle, FiStar, FiLayers,
  FiSend, FiClock, FiCheck, FiAlertCircle, FiBold, FiItalic, FiUnderline as FiUnderlineIcon, FiLink, FiList, FiAlignLeft
} from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import useAutoSaveDraft from '../../hooks/useAutoSaveDraft';
import DraftRestoreBanner, { AutoSaveIndicator } from '../../components/admin/DraftRestoreBanner';

// Image/Video Insert Modal Component
const MediaInsertModal = ({ type, isOpen, onClose, onInsert, collegeName }) => {
  const [url, setUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState(''); // Image Title or Video Title
  const [altText, setAltText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [position, setPosition] = useState('center'); // left, center, right
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Auto-generate SEO fields when media title changes
  const handleMediaTitleChange = (newTitle) => {
    setMediaTitle(newTitle);
    if (newTitle) {
      const college = collegeName || 'Institution';
      setAltText(`${newTitle} - ${college} | AdmissionBuddy`);
      setSeoTitle(`${newTitle} - ${college} | AdmissionBuddy.co`);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=content', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs (not for cloudinary or other absolute URLs)
        let imageUrl = response.data.url;
        if (imageUrl && !imageUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          imageUrl = backendUrl + imageUrl;
        }
        setUploadedUrl(imageUrl);
        setUrl(imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInsert = () => {
    if (!url) {
      alert(`Please provide ${type === 'image' ? 'an image' : 'a video'} URL`);
      return;
    }
    onInsert({ url, alt: altText, title: seoTitle, position });
    // Reset form
    setUrl('');
    setMediaTitle('');
    setAltText('');
    setSeoTitle('');
    setPosition('center');
    setUploadedUrl('');
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setUrl('');
    setMediaTitle('');
    setAltText('');
    setSeoTitle('');
    setPosition('center');
    setUploadedUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`px-5 py-3 ${type === 'image' ? 'bg-purple-600' : 'bg-red-600'} text-white`}>
          <h3 className="text-base font-bold flex items-center gap-2">
            {type === 'image' ? '🖼️ Insert Image with SEO' : '🎬 Insert YouTube Video with SEO'}
          </h3>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Image Upload Option */}
          {type === 'image' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm ${
                  uploading 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}>
                  {uploading ? (
                    <><FiLoader className="animate-spin" size={16} /> Uploading...</>
                  ) : (
                    <><FiUpload size={16} /> Upload Image</>
                  )}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {uploadedUrl && <span className="text-xs text-green-600 flex items-center gap-1"><FiCheck /> Uploaded!</span>}
              </div>
            </div>
          )}
          
          {/* URL Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {type === 'image' ? '🔗 Image URL' : '🔗 YouTube URL'} *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://www.youtube.com/watch?v=...'}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          {/* Image/Video Title - Primary Input for Auto SEO */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
            <label className="block text-sm font-bold text-yellow-800 mb-1">
              ✏️ {type === 'image' ? 'Image' : 'Video'} Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={mediaTitle}
              onChange={(e) => handleMediaTitleChange(e.target.value)}
              placeholder={type === 'image' ? 'e.g., Campus Building, Library, Hostel' : 'e.g., Campus Tour, Student Life, Placement'}
              className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2 text-sm font-medium"
            />
            <p className="text-xs text-yellow-700 mt-1">💡 SEO Alt & Title auto-generated with AdmissionBuddy branding</p>
          </div>
          
          {/* Position Option - For both Image and Video */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <label className="block text-xs font-bold text-blue-800 mb-2">📍 {type === 'image' ? 'Image' : 'Video'} Position</label>
            <div className="grid grid-cols-4 gap-2">
              <button type="button" onClick={() => setPosition('left')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  position === 'left' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}>
                ⬅️ Left
              </button>
              <button type="button" onClick={() => setPosition('center')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  position === 'center' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}>
                ⬆️ Center
              </button>
              <button type="button" onClick={() => setPosition('right')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  position === 'right' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}>
                ➡️ Right
              </button>
              <button type="button" onClick={() => setPosition('full')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  position === 'full' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}>
                ↔️ Full
              </button>
            </div>
          </div>
          
          {/* SEO Fields (Auto-generated) */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-bold text-green-800 mb-2">🔍 SEO Tags <span className="text-green-600">(Auto-generated)</span></p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Alt Text</label>
                <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)}
                  className="w-full border border-green-300 bg-white rounded px-2 py-1.5 text-xs" 
                  placeholder="Auto-generated from title" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title Attribute</label>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full border border-green-300 bg-white rounded px-2 py-1.5 text-xs"
                  placeholder="Auto-generated from title" />
              </div>
            </div>
          </div>
          
          {/* Preview - Smaller size with position indicator */}
          {url && type === 'image' && (
            <div className="border border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Preview ({position}):</p>
              <div className={`flex ${position === 'left' ? 'justify-start' : position === 'right' ? 'justify-end' : 'justify-center'}`}>
                <img src={url} alt={altText || 'Preview'} className="max-h-20 max-w-full rounded object-contain" 
                  onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t">
          <button type="button" onClick={handleClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium">
            Cancel
          </button>
          <button type="button" onClick={handleInsert} disabled={!url}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white ${
              url ? (type === 'image' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700')
                : 'bg-gray-300 cursor-not-allowed'
            }`}>
            Insert {type === 'image' ? 'Image' : 'Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Rich Text Editor Toolbar Component
const RichTextToolbar = ({ editor, collegeName, onOpenImageModal, onOpenVideoModal }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
      {/* Text Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Bold">
        <FiBold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Italic">
        <FiItalic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Underline">
        <FiUnderlineIcon size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Colors */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 px-1">Color:</span>
        {['#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'].map(color => (
          <button key={color} type="button" onClick={() => setColor(color)}
            className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }} title={color} />
        ))}
      </div>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Bullet List">
        <FiList size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Numbered List">
        <span className="text-xs font-bold">1.</span>
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Link, Image, Video */}
      <button type="button" onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Add Link">
        <FiLink size={16} />
      </button>
      <button type="button" onClick={onOpenImageModal}
        className="p-2 rounded hover:bg-gray-200 bg-purple-50 hover:bg-purple-100" title="Add Image with SEO">
        <FiImage size={16} className="text-purple-600" />
      </button>
      <button type="button" onClick={onOpenVideoModal}
        className="p-2 rounded hover:bg-gray-200 bg-red-50 hover:bg-red-100" title="Add YouTube Video with SEO">
        <FiVideo size={16} className="text-red-600" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Heading">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Subheading">
        H3
      </button>
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder, collegeName }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Youtube.configure({ width: 480, height: 320 }),
      TextStyle,
      Color,
      Underline,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const handleImageInsert = ({ url, alt, title, position }) => {
    if (editor) {
      // Determine alignment style based on position
      let alignStyle = '';
      if (position === 'left') {
        alignStyle = 'float: left; margin-right: 1rem; max-width: 50%;';
      } else if (position === 'right') {
        alignStyle = 'float: right; margin-left: 1rem; max-width: 50%;';
      } else if (position === 'full') {
        alignStyle = 'display: block; width: 100%;';
      } else {
        alignStyle = 'display: block; margin: 0 auto; max-width: 80%;';
      }
      
      // Insert image with SEO attributes and position
      const imgHtml = `<img src="${url}" alt="${alt || ''}" title="${title || ''}" style="${alignStyle} border-radius: 8px;" />`;
      editor.chain().focus().insertContent(imgHtml).run();
    }
  };

  const handleVideoInsert = ({ url, alt, title, position }) => {
    if (editor) {
      // Determine wrapper style based on position
      let wrapperStyle = '';
      let videoWidth = '560';
      let videoHeight = '315';
      
      if (position === 'left') {
        wrapperStyle = 'float: left; margin-right: 1rem; max-width: 50%;';
        videoWidth = '100%';
      } else if (position === 'right') {
        wrapperStyle = 'float: right; margin-left: 1rem; max-width: 50%;';
        videoWidth = '100%';
      } else if (position === 'full') {
        wrapperStyle = 'width: 100%;';
        videoWidth = '100%';
        videoHeight = '450';
      } else {
        wrapperStyle = 'margin: 0 auto; max-width: 80%;';
        videoWidth = '100%';
      }
      
      // Extract video ID from YouTube URL
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      
      if (videoId) {
        const videoHtml = `<div style="${wrapperStyle}"><iframe width="${videoWidth}" height="${videoHeight}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 8px; aspect-ratio: 16/9;"></iframe></div>`;
        editor.chain().focus().insertContent(videoHtml).run();
        
        // Add a caption paragraph after video for SEO
        if (alt || title) {
          editor.chain().focus().insertContent(`<p style="text-align: center;"><em>${alt || title}</em></p>`).run();
        }
      } else {
        alert('Invalid YouTube URL. Please use a valid YouTube video URL.');
      }
    }
  };

  return (
    <>
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <RichTextToolbar 
          editor={editor} 
          collegeName={collegeName}
          onOpenImageModal={() => setImageModalOpen(true)}
          onOpenVideoModal={() => setVideoModalOpen(true)}
        />
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-3 min-h-[120px] focus:outline-none"
        />
      </div>
      
      {/* Image Insert Modal */}
      <MediaInsertModal
        type="image"
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={handleImageInsert}
        collegeName={collegeName}
      />
      
      {/* Video Insert Modal */}
      <MediaInsertModal
        type="video"
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onInsert={handleVideoInsert}
        collegeName={collegeName}
      />
    </>
  );
};

import { Button } from '../../components/ui/button';
import SearchableSelect from '../../components/ui/SearchableSelect';
import ContentApprovalActions from '../../components/admin/ContentApprovalActions';
import StatusBadge from '../../components/admin/StatusBadge';
import { PlacementSection, ScholarshipsSection, FacilitiesSection, UpdatesSection, FAQsSection, CoursesSection, AdmissionSection, CutoffSection, SidebarWidgetsSection, SeoMetaSection, MenuConfigSection } from '../../components/admin/college-form';

// Menu icon options with professional icons
const menuIconOptions = [
  { id: 'info', label: 'Info', icon: <FiInfo size={16} /> },
  { id: 'overview', label: 'Overview', icon: <FiHome size={16} /> },
  { id: 'courses', label: 'Courses', icon: <FiBook size={16} /> },
  { id: 'programs', label: 'Programs', icon: <HiOutlineAcademicCap size={16} /> },
  { id: 'admission', label: 'Admission', icon: <FiFileText size={16} /> },
  { id: 'cutoff', label: 'Cutoff', icon: <FiBarChart2 size={16} /> },
  { id: 'placement', label: 'Placement', icon: <FiBriefcase size={16} /> },
  { id: 'ranking', label: 'Ranking', icon: <FiAward size={16} /> },
  { id: 'scholarship', label: 'Scholarship', icon: <HiOutlineCurrencyRupee size={16} /> },
  { id: 'fees', label: 'Fees', icon: <FiDollarSign size={16} /> },
  { id: 'facilities', label: 'Facilities', icon: <HiOutlineOfficeBuilding size={16} /> },
  { id: 'campus', label: 'Campus', icon: <HiOutlineLibrary size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <FiMessageSquare size={16} /> },
  { id: 'gallery', label: 'Gallery', icon: <FiImage size={16} /> },
  { id: 'faculty', label: 'Faculty', icon: <FiUsers size={16} /> },
  { id: 'events', label: 'Events', icon: <FiCalendar size={16} /> },
  { id: 'location', label: 'Location', icon: <FiMapPin size={16} /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle size={16} /> },
  { id: 'contact', label: 'Contact', icon: <FiMail size={16} /> },
  { id: 'default', label: 'Default', icon: <FiBookmark size={16} /> },
];

// Emoji to icon ID mapping for backward compatibility
const emojiToIconId = {
  '📋': 'info', '📚': 'courses', '📝': 'admission', '📊': 'cutoff',
  '💼': 'placement', '🏆': 'ranking', '💰': 'scholarship', '🏫': 'facilities',
  '⭐': 'reviews', '🎓': 'programs', '📍': 'location', '📞': 'contact',
  '🖼️': 'gallery', '❓': 'faq', '📌': 'default', '🏠': 'overview',
  '💵': 'fees', '🏢': 'campus', '$': 'fees', '💲': 'fees'
};

// Helper to normalize icon value (convert emoji to ID if needed)
const normalizeIconValue = (iconValue) => {
  if (!iconValue) return 'default';
  if (emojiToIconId[iconValue]) return emojiToIconId[iconValue];
  if (menuIconOptions.find(opt => opt.id === iconValue)) return iconValue;
  return 'default';
};

// Helper to get icon by ID
const getMenuIconById = (iconId) => {
  const normalizedId = normalizeIconValue(iconId);
  const found = menuIconOptions.find(opt => opt.id === normalizedId);
  return found ? found.icon : <FiBookmark size={16} />;
};
import { generateSlug } from '../../utils/slugify';

// Compact Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {badge && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{badge}</span>}
        </div>
        {isOpen ? <FiChevronDown className="w-4 h-4 text-gray-500" /> : <FiChevronRight className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Section Save Button Component
const SectionSaveButton = ({ section, onSave, isSaving, isSaved, disabled }) => {
  return (
    <button
      type="button"
      onClick={() => onSave(section)}
      disabled={disabled || isSaving}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isSaved 
          ? 'bg-green-100 text-green-700 border border-green-300' 
          : isSaving 
            ? 'bg-gray-100 text-gray-500 cursor-wait'
            : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isSaving ? (
        <>
          <span className="animate-spin">⏳</span> Saving...
        </>
      ) : isSaved ? (
        <>
          <FiCheck className="w-4 h-4" /> Saved ✓
        </>
      ) : (
        <>
          <FiSave className="w-4 h-4" /> Save Section
        </>
      )}
    </button>
  );
};

const CollegeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const { user } = useAuth();
  
  // Check if user can directly publish (super_admin or content_manager)
  const canDirectPublish = useMemo(() => {
    const role = user?.role || '';
    return ['super_admin', 'admin', 'content_manager'].includes(role);
  }, [user?.role]);
  
  // Auto-detect institution type from URL
  const getInstitutionTypeFromURL = () => {
    if (location.includes('/admin/schools')) return 'School';
    if (location.includes('/admin/universities')) return 'University';
    return 'College';
  };
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recognitions, setRecognitions] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [accreditationsList, setAccreditationsList] = useState([]);
  const [accreditationLevelsList, setAccreditationLevelsList] = useState([]);
  const [rankingsList, setRankingsList] = useState([]);
  const [rankCategoriesList, setRankCategoriesList] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableScholarships, setAvailableScholarships] = useState([]);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [availableNews, setAvailableNews] = useState([]);
  
  // Section-wise save states
  const [sectionSaving, setSectionSaving] = useState({});
  const [sectionSaved, setSectionSaved] = useState({});
  
  // Collapsible section states for form UI
  const [isAdmissionFeesCollapsed, setIsAdmissionFeesCollapsed] = useState(true);
  const [isLocationPriorityCollapsed, setIsLocationPriorityCollapsed] = useState(true);
  const [isContentStatusCollapsed, setIsContentStatusCollapsed] = useState(true);

  // Icon mapping for facilities
  const iconComponents = {
    FiBook, FiMonitor, FiActivity, FiSearch, FiUsers, FiCast, FiVideo, FiDatabase,
    FiMic, FiZap, FiTarget, FiDroplet, FiGrid, FiSquare, FiSun, FiHome, FiMapPin,
    FiHeart, FiMessageCircle, FiTruck, FiCoffee, FiShoppingBag, FiShoppingCart,
    FiCreditCard, FiMail, FiWifi, FiBattery, FiShield, FiBriefcase, FiTrendingUp,
    FiAward, FiMusic, FiBookOpen, FiPrinter, FiFilm, FiPackage, FiFeather, FiUnlock
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent className="inline" /> : null;
  };
  
  // States and Cities from Master Data
  const [indianStates, setIndianStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, citiesRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities')
        ]);
        setIndianStates(statesRes.data.map(s => s.name));
        setAllCities(citiesRes.data);
      } catch (error) {
        console.error('Error fetching master data:', error);
        // Fallback to empty arrays
        setIndianStates([]);
        setAllCities([]);
      }
    };
    fetchMasterData();
  }, []);

  const getDefaultFormData = () => ({
    name: '',
    slug: '',
    institution_type: getInstitutionTypeFromURL(), // College, School, University - auto-detected from URL
    // Badges & Status
    is_verified: false,
    is_preferred: false,
    is_featured: false,
    display_priority: 0,
    state_priority: {},
    city_priority: {},
    featured_at: null,
    featured_priority_months: 2,
    is_trending: false,
    is_top_rated: false,
    is_sponsored: false,
    is_admission_partner: false,
    is_no_cost_emi: false,
    is_admission_open: false,
    admission_open_at: null,
    admission_open_priority_months: 2,
    admission_deadline: '',
    badge_text: '',
    admission_fees: {
      form_fee: '',
      platform_fee: '',
      gst_percentage: 18
    },
    location: { 
      city: '', 
      state: '', 
      address: '', 
      pincode: '',
      google_maps_url: '',
      latitude: '',
      longitude: '',
      nearby_places: []
    },
    how_to_reach: {
      by_air: '',
      by_train: '',
      by_road: '',
      public_transport: ''
    },
    established: '',
    established_year: new Date().getFullYear(),
    type: 'Government',
    affiliation: '',
    recognized_by: [],
    affiliated_to: '',
    affiliated_to_list: [], // Multiple affiliations support
    board: '', // For schools - CBSE, ICSE, State Board, etc.
    medium: '', // For schools - English, Hindi, Regional
    classes_offered: [], // For schools - Nursery, KG, 1-12
    streams_offered: [], // For schools - Science, Commerce, Humanities
    memberships: [],
    nirf_ranking: null,
    india_today_ranking: null,
    outlook_ranking: null,
    rankings: [],
    average_fees: 0,
    total_courses: 0,
    streams: [], // Engineering, Medical, Management, Law, Arts, Science, Commerce, etc.
    courses: [],
    facilities: [],
    hostel_info: { available: false, fee_per_semester: 0, description: '' },
    campus_size: '',
    campus_images: [],
    campus_video_url: '',
    campus_video_title: '',
    campus_video_description: '',
    contact_info: { phone: '', mobile: '', whatsapp: '', email: '', website: '' },
    social_links: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
    logo_url: '',
    logo_title: '',
    logo_alt: '',
    banner_url: '',
    banner_title: '',
    banner_alt: '',
    images: [],
    videos: [],
    brochure_url: '',
    virtual_tour_url: '',
    virtual_tour_title: '',
    virtual_tour_description: '',
    description: '',
    description_tables: [], // Tables for description section
    highlights: [],
    admission_process: '',
    admission_dates: [],
    // SEO Meta Tags
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    schema_type: 'EducationalOrganization',
    // SEO Content
    seo_intro: '',
    seo_full_content: '',
    seo_images: [],
    seo_toc: [], // Table of Contents for SEO Content [{title, anchor, content}]
    seo_tables: [], // [{title, headers: [], rows: [[]]}] Tables for content
    seo_video_url: '',
    // Detail Page TOC - Used for Auto Menu from TOC
    detail_page_toc: [], // [{title, anchor, content, icon}]
    // Menu Configuration
    menu_config: {
      use_custom_menu: false,
      auto_from_toc: true,
      // Note: "Info" menu is FIXED and auto-generated from Common Information (Step 1)
      // The items below are additional menu items that can be customized
      items: [
        { id: 'courses', label: 'Courses & Fees', icon: 'courses', enabled: true, order: 1, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'admission', label: 'Admissions', icon: 'admission', enabled: true, order: 2, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'cutoff', label: 'Cutoff', icon: 'cutoff', enabled: true, order: 3, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'placement', label: 'Placement', icon: 'placement', enabled: true, order: 4, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'ranking', label: 'Ranking', icon: 'ranking', enabled: true, order: 5, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'scholarship', label: 'Scholarship', icon: 'scholarship', enabled: true, order: 6, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'facilities', label: 'Facilities', icon: 'facilities', enabled: true, order: 7, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'reviews', label: 'Reviews', icon: 'reviews', enabled: true, order: 8, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
      ]
    },
    seo_video_title: '',
    seo_video_description: '',
    seo_faqs: [],
    // Sidebar Widgets Configuration
    sidebar_widgets: {
      quick_actions: {
        enabled: true,
        apply_now_btn: true,
        apply_now_url: '',
        download_brochure_btn: true,
        compare_btn: true,
        enquiry_btn: true
      },
      quick_facts: {
        enabled: true,
        show_established: true,
        show_type: true,
        show_approval: true,
        show_student_count: true,
        show_faculty_count: true,
        custom_facts: []
      },
      important_dates: {
        enabled: true,
        dates: []
      },
      fee_summary: {
        enabled: true,
        show_range: true,
        custom_text: ''
      },
      contact_card: {
        enabled: true,
        show_phone: true,
        show_email: true,
        show_address: true,
        show_map_link: true
      },
      counselor_cta: {
        enabled: true,
        title: 'Need Help?',
        subtitle: 'Talk to our expert counselor',
        phone: '',
        show_callback_form: true
      },
      career_counseling: {
        enabled: true,
        title: 'Career Counseling',
        subtitle: 'Get personalized career guidance from experts',
        booking_type: 'link', // 'link', 'phone', 'whatsapp', 'form'
        booking_url: '',
        booking_phone: '',
        booking_whatsapp: '',
        button_text: 'Book Session'
      },
      ad_banner: {
        enabled: false,
        position: 'top',
        ad_code: ''
      },
      social_share: {
        enabled: true,
        platforms: ['facebook', 'twitter', 'whatsapp', 'linkedin']
      },
      rating_widget: {
        enabled: true,
        show_stars: true,
        show_review_count: true
      },
      related_colleges: {
        enabled: true,
        show_count: 3,
        criteria: 'same_city'
      }
    },
    accreditations: [],
    approvals: [],
    placement: {
      highest: 0,
      average: 0,
      percentage: 0,
      students_participated: 0,
      companies_participated: 0,
      total_offers: 0,
      top_recruiters: []
    },
    cutoff_data: [],
    scholarships: [],
    updates: [],
    announcements: [], // Latest news/announcements [{title, date, link, content}]
    total_students: 0,
    rating: 0,
    total_reviews: 0
  });

  const [formData, setFormData] = useState(getDefaultFormData());
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingCampus, setUploadingCampus] = useState({});
  const [uploadingCampusBulk, setUploadingCampusBulk] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingCourseBrochure, setUploadingCourseBrochure] = useState({});
  const [uploadingContentImage, setUploadingContentImage] = useState({});
  const [boards, setBoards] = useState([]);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Auto-save draft hook - use fixed key for all institution types
  const draftKey = 'institution_draft_new';  // Fixed key for all types
  const {
    saveDraft,
    clearDraft,
    restoreDraft,
    getDraftInfo,
    lastSaved: draftLastSaved,
    hasDraft
  } = useAutoSaveDraft(draftKey, formData, setFormData, 10000, !id); // Save every 10 seconds (was 30)

  // Check for existing draft on mount
  useEffect(() => {
    if (!id && hasDraft) {
      setShowDraftBanner(true);
    }
  }, [id, hasDraft]);

  // Handle draft restore
  const handleRestoreDraft = () => {
    // Get draft data from localStorage
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) {
          // Merge draft data with default form data to ensure all arrays exist
          const defaultData = getDefaultFormData();
          const mergedData = {
            ...defaultData,
            ...parsed.formData,
            // Ensure arrays are properly merged
            location: { ...defaultData.location, ...parsed.formData.location },
            courses: parsed.formData.courses || defaultData.courses,
            facilities: parsed.formData.facilities || defaultData.facilities,
            accreditations: parsed.formData.accreditations || defaultData.accreditations,
            recognitions: parsed.formData.recognitions || defaultData.recognitions,
            campus_images: parsed.formData.campus_images || defaultData.campus_images,
            faqs: parsed.formData.faqs || defaultData.faqs,
            key_highlights: parsed.formData.key_highlights || defaultData.key_highlights,
            scholarships: parsed.formData.scholarships || defaultData.scholarships,
            placement_stats: parsed.formData.placement_stats || defaultData.placement_stats,
            notable_alumni: parsed.formData.notable_alumni || defaultData.notable_alumni,
            admission_info: { ...defaultData.admission_info, ...parsed.formData.admission_info },
            contact_info: { ...defaultData.contact_info, ...parsed.formData.contact_info },
            social_links: { ...defaultData.social_links, ...parsed.formData.social_links },
            seo: { ...defaultData.seo, ...parsed.formData.seo },
            meta_keywords: parsed.formData.meta_keywords || defaultData.meta_keywords,
            table_of_contents: parsed.formData.table_of_contents || defaultData.table_of_contents,
            page_widgets: parsed.formData.page_widgets || defaultData.page_widgets,
            menu_config: parsed.formData.menu_config || defaultData.menu_config,
          };
          setFormData(mergedData);
        }
      }
    } catch (error) {
      console.error('Error restoring draft:', error);
    }
    setShowDraftBanner(false);
  };

  // Handle draft discard
  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  // Update available cities when state changes (must be after formData declaration)
  useEffect(() => {
    if (formData.location?.state && allCities.length > 0) {
      const stateCities = allCities
        .filter(c => c.state === formData.location.state)
        .map(c => c.name);
      setAvailableCities(stateCities);
    }
  }, [formData.location?.state, allCities]);

  // Check if institution type is School
  const isSchool = formData.institution_type === 'School';

  useEffect(() => {
    fetchRecognitions();
    fetchAffiliations();
    fetchAccreditations();
    fetchAccreditationLevels();
    fetchRankings();
    fetchRankCategories();
    fetchAvailableCourses();
    fetchAvailableScholarships();
    fetchAvailableFacilities();
    fetchAvailableNews();
    fetchBoards();
    if (id) {
      fetchCollege();
    }
  }, [id]);

  const fetchBoards = async () => {
    try {
      const response = await api.get('/boards?limit=100');
      setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  // School-specific default menu items
  const schoolMenuItems = [
    { id: 'info', label: 'Info', icon: 'info', enabled: true, order: 0, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
    { id: 'admission', label: 'Admission', icon: 'admission', enabled: true, order: 1, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
    { id: 'fees', label: 'Fees', icon: 'fees', enabled: true, order: 2, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
    { id: 'facilities', label: 'Facilities', icon: 'facilities', enabled: true, order: 3, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
    { id: 'hostel', label: 'Hostel', icon: 'hostel', enabled: true, order: 4, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
  ];

  // Update menu config when institution type changes to School
  useEffect(() => {
    if (formData.institution_type === 'School' && !id) {
      // Only update for new entries, not when editing
      setFormData(prev => ({
        ...prev,
        menu_config: {
          ...prev.menu_config,
          items: schoolMenuItems
        }
      }));
    }
  }, [formData.institution_type]);

  // Auto-update streams based on selected courses
  useEffect(() => {
    if (formData.courses && formData.courses.length > 0) {
      const courseStreams = new Set();
      formData.courses.forEach(course => {
        if (course.stream) courseStreams.add(course.stream);
      });
      const uniqueStreams = Array.from(courseStreams);
      
      // Only update if streams actually changed
      const currentStreams = formData.streams || [];
      const streamsChanged = uniqueStreams.length !== currentStreams.length || 
        !uniqueStreams.every(s => currentStreams.includes(s));
      
      if (streamsChanged) {
        setFormData(prev => ({ ...prev, streams: uniqueStreams }));
      }
    }
  }, [formData.courses]);

  const fetchRecognitions = async () => {
    try {
      const response = await api.get('/recognitions');
      setRecognitions(response.data);
    } catch (error) {
      console.error('Error fetching recognitions:', error);
    }
  };

  const fetchAffiliations = async () => {
    try {
      const response = await api.get('/affiliations?limit=500');
      setAffiliations(response.data);
    } catch (error) {
      console.error('Error fetching affiliations:', error);
    }
  };

  const fetchAccreditations = async () => {
    try {
      const response = await api.get('/accreditations?limit=500');
      setAccreditationsList(response.data);
    } catch (error) {
      console.error('Error fetching accreditations:', error);
    }
  };

  const fetchAccreditationLevels = async () => {
    try {
      const response = await api.get('/accreditation-levels?limit=100');
      setAccreditationLevelsList(response.data);
    } catch (error) {
      console.error('Error fetching accreditation levels:', error);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await api.get('/rankings?limit=100');
      setRankingsList(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const fetchRankCategories = async () => {
    try {
      const response = await api.get('/rank-categories?limit=100');
      setRankCategoriesList(response.data);
    } catch (error) {
      console.error('Error fetching rank categories:', error);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get('/courses?limit=500');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAvailableScholarships = async () => {
    try {
      const response = await api.get('/scholarships?limit=500');
      setAvailableScholarships(response.data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    }
  };

  const fetchAvailableFacilities = async () => {
    try {
      const response = await api.get('/facilities?limit=500');
      setAvailableFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchAvailableNews = async () => {
    try {
      const response = await api.get('/news?limit=50');
      setAvailableNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges/${id}`);
      const collegeData = response.data;
      
      // Ensure all arrays are properly initialized
      const normalizedData = {
        ...getDefaultFormData(),
        ...collegeData,
        recognized_by: Array.isArray(collegeData.recognized_by) ? collegeData.recognized_by : [],
        memberships: Array.isArray(collegeData.memberships) ? collegeData.memberships : [],
        rankings: Array.isArray(collegeData.rankings) ? collegeData.rankings : [],
        streams: Array.isArray(collegeData.streams) ? collegeData.streams : [],
        courses: Array.isArray(collegeData.courses) ? collegeData.courses : [],
        // School-specific fields
        classes_offered: Array.isArray(collegeData.classes_offered) ? collegeData.classes_offered : [],
        streams_offered: Array.isArray(collegeData.streams_offered) ? collegeData.streams_offered : [],
        medium: collegeData.medium || '',
        board: collegeData.board || '',
        facilities: Array.isArray(collegeData.facilities) 
          ? collegeData.facilities.map(f => typeof f === 'string' 
              ? { name: f, icon: '', description: '' } 
              : { name: f.name || '', icon: f.icon || '', description: f.description || '' })
          : [],
        campus_images: Array.isArray(collegeData.campus_images) ? collegeData.campus_images : [],
        images: Array.isArray(collegeData.images) ? collegeData.images : [],
        videos: Array.isArray(collegeData.videos) ? collegeData.videos : [],
        highlights: Array.isArray(collegeData.highlights) ? collegeData.highlights : [],
        admission_dates: Array.isArray(collegeData.admission_dates) ? collegeData.admission_dates : [],
        // Convert string accreditations from backend to object format for form
        // Backend sends: ["NAAC A++", "NBA"] -> Form needs: [{name: "NAAC", level: "A++", description: ""}]
        accreditations: Array.isArray(collegeData.accreditations) 
          ? collegeData.accreditations.map(accr => {
              if (typeof accr === 'object' && accr !== null) return accr;
              // Parse string format "NAAC A++" -> {name: "NAAC", level: "A++"}
              const parts = String(accr).split(' ');
              return {
                name: parts[0] || '',
                level: parts.slice(1).join(' ') || '',
                description: ''
              };
            })
          : [],
        approvals: Array.isArray(collegeData.approvals) ? collegeData.approvals : [],
        cutoff_data: Array.isArray(collegeData.cutoff_data) ? collegeData.cutoff_data : [],
        scholarships: Array.isArray(collegeData.scholarships) ? collegeData.scholarships : [],
        updates: Array.isArray(collegeData.updates) ? collegeData.updates : [],
        announcements: Array.isArray(collegeData.announcements) ? collegeData.announcements : [],
        seo_faqs: Array.isArray(collegeData.seo_faqs) ? collegeData.seo_faqs : [],
        seo_intro: collegeData.seo_intro || '',
        seo_full_content: collegeData.seo_full_content || '',
        seo_video_url: collegeData.seo_video_url || '',
        seo_video_title: collegeData.seo_video_title || '',
        seo_video_description: collegeData.seo_video_description || '',
        location: collegeData.location || { 
          city: '', 
          state: '', 
          address: '', 
          pincode: '',
          google_maps_url: '',
          latitude: '',
          longitude: '',
          nearby_places: []
        },
        how_to_reach: collegeData.how_to_reach || {
          by_air: '',
          by_train: '',
          by_road: '',
          public_transport: ''
        },
        contact_info: collegeData.contact_info || { phone: '', email: '', website: '' },
        social_links: collegeData.social_links || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
        placement: {
          highest: collegeData.placement?.highest || 0,
          average: collegeData.placement?.average || 0,
          percentage: collegeData.placement?.percentage || 0,
          students_participated: collegeData.placement?.students_participated || 0,
          companies_participated: collegeData.placement?.companies_participated || 0,
          total_offers: collegeData.placement?.total_offers || 0,
          top_recruiters: Array.isArray(collegeData.placement?.top_recruiters) ? collegeData.placement.top_recruiters : []
        }
      };
      
      setFormData(normalizedData);
      
      // Cities will be set automatically by the useEffect when formData.location.state changes
    } catch (error) {
      console.error('Error fetching college:', error);
      alert('Failed to fetch college details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when name changes
    if (name === 'name') {
      setFormData({ 
        ...formData, 
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    // Special handling for state change to reset city (cities will be updated by useEffect)
    if (parent === 'location' && field === 'state') {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [field]: value, city: '' } // Reset city when state changes
      });
    } else {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [field]: value }
      });
    }
  };

  // Auto-generate alt text with Admissionbuddy branding
  const generateAltText = (title, collegeName = '') => {
    if (!title) return '';
    const parts = [title];
    if (collegeName) parts.push(collegeName);
    parts.push('Admissionbuddy');
    return parts.join(' - ');
  };

  const handleTitleChange = (field, value) => {
    const altField = field.replace('_title', '_alt');
    const collegeName = formData.name || '';
    const autoAlt = generateAltText(value, collegeName);
    
    setFormData({
      ...formData,
      [field]: value,
      [altField]: autoAlt
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Helper functions for campus images with title and alt text
  const updateCampusImage = (index, field, value) => {
    const newImages = [...formData.campus_images];
    // Convert to object format if it's a string
    if (typeof newImages[index] === 'string') {
      newImages[index] = { url: newImages[index], title: '', alt: '' };
    }
    
    // If updating title, auto-generate alt text
    if (field === 'title') {
      const collegeName = formData.name || '';
      newImages[index].title = value;
      newImages[index].alt = generateAltText(value, collegeName);
    } else {
      newImages[index][field] = value;
    }
    
    setFormData({ ...formData, campus_images: newImages });
  };

  const addCampusImage = () => {
    setFormData({ ...formData, campus_images: [...formData.campus_images, { url: '', title: '', alt: '' }] });
  };

  const removeCampusImage = (index) => {
    const newImages = formData.campus_images.filter((_, i) => i !== index);
    setFormData({ ...formData, campus_images: newImages });
  };


  // Helper functions for nested array (nearby_places)
  const addNearbyPlace = () => {
    const updatedLocation = {
      ...formData.location,
      nearby_places: [...(formData.location.nearby_places || []), '']
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  const updateNearbyPlace = (index, value) => {
    const newNearbyPlaces = [...(formData.location.nearby_places || [])];
    newNearbyPlaces[index] = value;
    const updatedLocation = {
      ...formData.location,
      nearby_places: newNearbyPlaces
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  const removeNearbyPlace = (index) => {
    const newNearbyPlaces = (formData.location.nearby_places || []).filter((_, i) => i !== index);
    const updatedLocation = {
      ...formData.location,
      nearby_places: newNearbyPlaces
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  // Helper functions for accreditations
  const addAccreditation = () => {
    setFormData({
      ...formData,
      accreditations: [...formData.accreditations, { name: '', level: '', description: '' }]
    });
  };

  const updateAccreditation = (index, field, value) => {
    const newAccreditations = [...formData.accreditations];
    newAccreditations[index] = { ...newAccreditations[index], [field]: value };
    setFormData({ ...formData, accreditations: newAccreditations });
  };

  const removeAccreditation = (index) => {
    setFormData({
      ...formData,
      accreditations: formData.accreditations.filter((_, i) => i !== index)
    });
  };

  // Helper functions for rankings
  const addRanking = () => {
    setFormData({
      ...formData,
      rankings: [...(formData.rankings || []), { agency: '', category: '', rank: '', year: new Date().getFullYear() }]
    });
  };

  const updateRanking = (index, field, value) => {
    const newRankings = [...(formData.rankings || [])];
    newRankings[index] = { ...newRankings[index], [field]: value };
    setFormData({ ...formData, rankings: newRankings });
  };

  const removeRanking = (index) => {
    setFormData({
      ...formData,
      rankings: (formData.rankings || []).filter((_, i) => i !== index)
    });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        { name: '', duration: '', first_year_fee: 0, total_fee: 0, eligibility: '', selection_criteria: '' }
      ]
    });
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...formData.courses];
    
    // If course name is being changed, auto-fill other fields
    if (field === 'name') {
      const selectedCourse = availableCourses.find(c => c.name === value);
      if (selectedCourse) {
        newCourses[index] = {
          ...newCourses[index],
          name: value,
          duration: selectedCourse.duration || '',
          eligibility: selectedCourse.eligibility || '',
          selection_criteria: selectedCourse.exams_accepted?.join(', ') || ''
        };
      } else {
        newCourses[index][field] = value;
      }
    } else {
      newCourses[index][field] = value;
    }
    
    setFormData({ ...formData, courses: newCourses });
  };

  const removeCourse = (index) => {
    setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, { name: '', description: '', icon: '' }]
    });
  };

  const updateFacility = (index, field, value) => {
    const newFacilities = [...formData.facilities];
    
    // Ensure the facility at index is an object, not a string
    if (typeof newFacilities[index] === 'string') {
      newFacilities[index] = { name: newFacilities[index], icon: '', description: '' };
    }
    
    // If facility name is being changed, auto-fill icon and description
    if (field === 'name') {
      const selectedFacility = availableFacilities.find(f => f.name === value);
      if (selectedFacility) {
        newFacilities[index] = {
          name: value,
          icon: selectedFacility.icon || '',
          description: selectedFacility.description || ''
        };
      } else {
        newFacilities[index] = {
          ...newFacilities[index],
          [field]: value
        };
      }
    } else {
      newFacilities[index] = {
        ...newFacilities[index],
        [field]: value
      };
    }
    
    setFormData({ ...formData, facilities: newFacilities });
  };

  const removeFacility = (index) => {
    setFormData({ ...formData, facilities: formData.facilities.filter((_, i) => i !== index) });
  };


  // Updates & News management
  const addUpdate = () => {
    setFormData({
      ...formData,
      updates: [...formData.updates, { title: '', content: '', date: '', type: 'custom', newsId: '' }]
    });
  };

  const updateUpdate = (index, field, value) => {
    const newUpdates = [...formData.updates];
    
    // If type is being changed to 'tagged' and a news is selected
    if (field === 'newsId' && value) {
      const selectedNews = availableNews.find(n => n.id === value);
      if (selectedNews) {
        newUpdates[index] = {
          ...newUpdates[index],
          newsId: value,
          title: selectedNews.title,
          content: selectedNews.summary || selectedNews.content,
          date: selectedNews.published_date || new Date().toISOString().split('T')[0],
          type: 'tagged'
        };
      }
    } else {
      newUpdates[index][field] = value;
    }
    
    setFormData({ ...formData, updates: newUpdates });
  };

  const removeUpdate = (index) => {
    setFormData({ ...formData, updates: formData.updates.filter((_, i) => i !== index) });
  };

  // Announcements management (Latest News for sidebar)
  const addAnnouncement = () => {
    setFormData({
      ...formData,
      announcements: [...(formData.announcements || []), { 
        title: '', 
        date: new Date().toISOString().split('T')[0], 
        link: '', 
        content: '' 
      }]
    });
  };

  const updateAnnouncement = (index, field, value) => {
    const newAnnouncements = [...(formData.announcements || [])];
    newAnnouncements[index] = { ...newAnnouncements[index], [field]: value };
    setFormData({ ...formData, announcements: newAnnouncements });
  };

  const removeAnnouncement = (index) => {
    setFormData({ 
      ...formData, 
      announcements: (formData.announcements || []).filter((_, i) => i !== index) 
    });
  };

  const addScholarship = () => {
    setFormData({
      ...formData,
      scholarships: [...formData.scholarships, { name: '', description: '', amount: '' }]
    });
  };

  const updateScholarship = (index, field, value) => {
    const newScholarships = [...formData.scholarships];
    
    // If scholarship name is being changed, auto-fill other fields
    if (field === 'name') {
      const selectedScholarship = availableScholarships.find(s => s.name === value);
      if (selectedScholarship) {
        newScholarships[index] = {
          ...newScholarships[index],
          name: value,
          amount: selectedScholarship.amount || '',
          description: selectedScholarship.description || ''
        };
      } else {
        newScholarships[index][field] = value;
      }
    } else {
      newScholarships[index][field] = value;
    }
    
    setFormData({ ...formData, scholarships: newScholarships });
  };

  const removeScholarship = (index) => {
    setFormData({ ...formData, scholarships: formData.scholarships.filter((_, i) => i !== index) });
  };

  const addAdmissionDate = () => {
    setFormData({
      ...formData,
      admission_dates: [...formData.admission_dates, { event: '', date: '' }]
    });
  };

  const updateAdmissionDate = (index, field, value) => {
    const newDates = [...formData.admission_dates];
    newDates[index][field] = value;
    setFormData({ ...formData, admission_dates: newDates });
  };

  const removeAdmissionDate = (index) => {
    setFormData({ ...formData, admission_dates: formData.admission_dates.filter((_, i) => i !== index) });
  };

  const addCutoff = () => {
    setFormData({
      ...formData,
      cutoff_data: [
        ...formData.cutoff_data,
        { course: '', opening_rank: null, closing_rank_current: null, closing_rank_previous: null, year: new Date().getFullYear() }
      ]
    });
  };

  const updateCutoff = (index, field, value) => {
    const newCutoffs = [...formData.cutoff_data];
    newCutoffs[index][field] = value;
    setFormData({ ...formData, cutoff_data: newCutoffs });
  };

  const removeCutoff = (index) => {
    setFormData({ ...formData, cutoff_data: formData.cutoff_data.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (file, type) => {
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
    const fieldName = type === 'logo' ? 'logo_url' : 'banner_url';
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post(`/upload/image?type=${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs
        let fullUrl = response.data.url;
        if (fullUrl && !fullUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          fullUrl = backendUrl + fullUrl;
        }
        
        setFormData(prev => ({
          ...prev,
          [fieldName]: fullUrl
        }));
        
        alert(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleCampusImageUpload = async (file, index) => {
    setUploadingCampus(prev => ({ ...prev, [index]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=campus', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs
        let fullUrl = response.data.url;
        if (fullUrl && !fullUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          fullUrl = backendUrl + fullUrl;
        }
        
        // Update with object format including existing alt text
        updateCampusImage(index, 'url', fullUrl);
        
        alert('Campus image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload campus image. Please try again.');
    } finally {
      setUploadingCampus(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleBulkCampusUpload = async (files) => {
    setUploadingCampusBulk(true);
    
    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach(file => {
        uploadFormData.append('files', file);
      });
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/images/bulk?type=campus', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const uploadedImages = response.data.files.map(f => {
          // Only prepend backendUrl for relative URLs
          let fullUrl = f.url;
          if (fullUrl && !fullUrl.startsWith('http')) {
            fullUrl = backendUrl + fullUrl;
          }
          return {
            url: fullUrl,
            title: '',
            alt: ''
          };
        });
        
        setFormData(prev => ({
          ...prev,
          campus_images: [...prev.campus_images, ...uploadedImages]
        }));
        
        alert(`Successfully uploaded ${response.data.uploaded} image(s)!`);
        if (response.data.failed > 0) {
          alert(`${response.data.failed} file(s) failed to upload.`);
        }
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingCampusBulk(false);
    }
  };

  // Handler for uploading images in content blocks
  const handleContentImageUpload = async (file, tocIndex, blockIndex) => {
    const uploadKey = `${tocIndex}-${blockIndex}`;
    setUploadingContentImage(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=content', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs
        let imageUrl = response.data.url;
        if (imageUrl && !imageUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          imageUrl = backendUrl + imageUrl;
        }
        
        // Update the block's URL
        const newToc = [...(formData.seo_toc || [])];
        newToc[tocIndex].blocks[blockIndex].url = imageUrl;
        setFormData({...formData, seo_toc: newToc});
        
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Content image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingContentImage(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const updateUpdateSimple = (index, field, value) => {
    const newUpdates = [...formData.updates];
    newUpdates[index][field] = value;
    setFormData({ ...formData, updates: newUpdates });
  };

  const handleBrochureUpload = async (file) => {
    setUploadingBrochure(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/brochure', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs
        let fullUrl = response.data.url;
        if (fullUrl && !fullUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          fullUrl = backendUrl + fullUrl;
        }
        
        setFormData(prev => ({
          ...prev,
          brochure_url: fullUrl
        }));
        
        alert('Brochure uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload brochure. Please try again.');
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleCourseBrochureUpload = async (file, courseIndex) => {
    setUploadingCourseBrochure(prev => ({ ...prev, [courseIndex]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/brochure', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Only prepend backendUrl for relative URLs
        let fullUrl = response.data.url;
        if (fullUrl && !fullUrl.startsWith('http')) {
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          fullUrl = backendUrl + fullUrl;
        }
        
        const newCourses = [...formData.courses];
        if (!newCourses[courseIndex].brochure_url) {
          newCourses[courseIndex] = { ...newCourses[courseIndex], brochure_url: fullUrl };
        } else {
          newCourses[courseIndex].brochure_url = fullUrl;
        }
        
        setFormData(prev => ({
          ...prev,
          courses: newCourses
        }));
        
        alert('Course brochure uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload course brochure. Please try again.');
    } finally {
      setUploadingCourseBrochure(prev => ({ ...prev, [courseIndex]: false }));
    }
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      seo_faqs: [...formData.seo_faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...formData.seo_faqs];
    newFAQs[index][field] = value;
    setFormData({ ...formData, seo_faqs: newFAQs });
  };

  const removeFAQ = (index) => {
    setFormData({ ...formData, seo_faqs: formData.seo_faqs.filter((_, i) => i !== index) });
  };

  const { toast } = useToast();
  
  // Section-wise save handler for optimized saving (smaller payloads = faster saves)
  const handleSectionSave = async (section) => {
    if (!id) {
      toast({
        title: "⚠️ Save Required",
        description: "Please save the form first (Save Draft) before saving individual sections.",
        variant: "destructive"
      });
      return;
    }
    
    setSectionSaving(prev => ({ ...prev, [section]: true }));
    setSectionSaved(prev => ({ ...prev, [section]: false }));
    
    try {
      let sectionData = {};
      
      switch (section) {
        case 'basic':
          sectionData = {
            name: formData.name,
            slug: formData.slug,
            type: formData.type,
            institution_type: formData.institution_type,
            established_year: formData.established_year,
            campus_size: formData.campus_size,
            total_students: formData.total_students,
            state: formData.state,
            city: formData.city,
            address: formData.address,
            pincode: formData.pincode,
            latitude: formData.latitude,
            longitude: formData.longitude,
            how_to_reach: formData.how_to_reach,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            affiliated_to: formData.affiliated_to,
            recognized_by: formData.recognized_by,
            board: formData.board
          };
          break;
        case 'media':
          sectionData = {
            logo_url: formData.logo_url,
            logo_title: formData.logo_title,
            logo_alt: formData.logo_alt,
            banner_url: formData.banner_url,
            banner_title: formData.banner_title,
            banner_alt: formData.banner_alt,
            images: formData.images,
            videos: formData.videos,
            description: formData.description,
            highlights: formData.highlights,
            brochure_url: formData.brochure_url
          };
          break;
        case 'courses':
          sectionData = {
            courses: formData.courses,
            streams_offered: formData.streams_offered,
            average_fees: formData.average_fees
          };
          break;
        case 'details':
          sectionData = {
            facilities: formData.facilities,
            accreditations: formData.accreditations?.map(accr => {
              if (typeof accr === 'string') return accr;
              const parts = [accr.name];
              if (accr.level) parts.push(accr.level);
              return parts.join(' ');
            }).filter(Boolean),
            rankings: formData.rankings,
            nirf_ranking: formData.nirf_ranking,
            placement_stats: formData.placement_stats,
            placements: formData.placements,
            cutoff_data: formData.cutoff_data,
            scholarships: formData.scholarships,
            hostel_info: formData.hostel_info
          };
          break;
        case 'admission':
          sectionData = {
            admission_process: formData.admission_process,
            admission_dates: formData.admission_dates,
            admission_deadline: formData.admission_deadline,
            admission_fees: formData.admission_fees,
            is_admission_open: formData.is_admission_open,
            is_admission_partner: formData.is_admission_partner,
            menu_config: formData.menu_config,
            sidebar_widgets: formData.sidebar_widgets,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: formData.meta_keywords
          };
          break;
        case 'seo-content':
          sectionData = {
            seo_intro: formData.seo_intro,
            seo_full_content: formData.seo_full_content,
            seo_toc: formData.seo_toc,
            seo_faqs: formData.seo_faqs,
            custom_tables: formData.custom_tables
          };
          break;
        default:
          return;
      }
      
      // Remove null/undefined values
      Object.keys(sectionData).forEach(key => {
        if (sectionData[key] === null || sectionData[key] === undefined) {
          delete sectionData[key];
        }
      });
      
      console.log(`[CollegeForm] Saving ${section} section:`, JSON.stringify(sectionData).length, 'bytes');
      
      await api.patch(`/colleges/${id}/section/${section}`, sectionData);
      
      setSectionSaved(prev => ({ ...prev, [section]: true }));
      toast({
        title: "✅ Section Saved!",
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully.`,
      });
      
      // Reset saved state after 3 seconds
      setTimeout(() => {
        setSectionSaved(prev => ({ ...prev, [section]: false }));
      }, 3000);
      
    } catch (error) {
      console.error(`[CollegeForm] Error saving ${section}:`, error);
      toast({
        title: "❌ Save Failed",
        description: error.response?.data?.detail || `Failed to save ${section} section.`,
        variant: "destructive"
      });
    } finally {
      setSectionSaving(prev => ({ ...prev, [section]: false }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Transform accreditations from objects to strings for backend compatibility
      // Backend expects: List[str] e.g. ["NAAC A++", "NBA"]
      // Frontend stores: [{name, level, description}]
      const transformedFormData = {
        ...formData,
        accreditations: formData.accreditations.map(accr => {
          if (typeof accr === 'string') return accr;
          // Combine name and level if both exist
          const parts = [accr.name];
          if (accr.level) parts.push(accr.level);
          return parts.join(' ');
        }).filter(Boolean) // Remove empty strings
      };

      // Clean up empty/null fields to reduce payload size
      Object.keys(transformedFormData).forEach(key => {
        const value = transformedFormData[key];
        if (value === null || value === undefined || value === '') {
          delete transformedFormData[key];
        }
        // Remove empty arrays (except required ones)
        if (Array.isArray(value) && value.length === 0 && !['courses', 'facilities'].includes(key)) {
          delete transformedFormData[key];
        }
      });

      // Remove very large fields if empty to reduce payload
      const fieldsToCleanup = ['description', 'short_description', 'admission_info', 'seo'];
      fieldsToCleanup.forEach(field => {
        if (transformedFormData[field]) {
          if (typeof transformedFormData[field] === 'object') {
            // Remove empty nested objects
            const hasValue = Object.values(transformedFormData[field]).some(v => v && v !== '');
            if (!hasValue) {
              delete transformedFormData[field];
            }
          }
        }
      });

      console.log('[CollegeForm] Submitting data size:', JSON.stringify(transformedFormData).length, 'bytes');

      if (id) {
        // EXISTING COLLEGE: Use section-wise save for large forms
        // If form is very large, suggest using section save buttons
        const payloadSize = JSON.stringify(transformedFormData).length;
        if (payloadSize > 50000) {
          toast({
            title: "⚠️ Large Form",
            description: "Form is large. Consider using 'Save Section' buttons for each section to avoid timeout.",
            variant: "warning"
          });
        }
        await api.put(`/colleges/${id}`, transformedFormData);
        toast({
          title: "✅ Success!",
          description: "College updated successfully!",
        });
        navigate('/admin/colleges');
      } else {
        // NEW COLLEGE: Create minimal draft first, then redirect to edit for section-wise saves
        // This prevents timeout by only sending basic info initially
        const basicData = {
          name: formData.name,
          slug: formData.slug,
          institution_type: formData.institution_type || 'College',
          type: formData.type || 'Private',
          state: formData.location?.state || formData.state,
          city: formData.location?.city || formData.city,
          status: 'draft'
        };
        
        console.log('[CollegeForm] Creating new college with basic data:', JSON.stringify(basicData).length, 'bytes');
        
        const response = await api.post('/colleges', basicData);
        const newCollegeId = response.data.id;
        
        // Clear draft after successful creation
        clearDraft();
        
        toast({
          title: "✅ Draft Created!",
          description: "Basic info saved. Now use 'Save Section' buttons to save remaining data.",
        });
        
        // Redirect to edit page where section-wise save buttons are available
        navigate(`/admin/colleges/edit/${newCollegeId}`);
      }
    } catch (error) {
      console.error('Error saving college:', error);
      
      // Check for duplicate entry error (HTTP 409 or 400 with "already exists")
      const detail = error.response?.data?.detail || '';
      const isDuplicateError = error.response?.status === 409 || 
        (error.response?.status === 400 && detail.toLowerCase().includes('already exists'));
      
      if (isDuplicateError) {
        toast({
          variant: "destructive",
          title: "⚠️ Duplicate Entry!",
          description: detail || "An institution with this name or slug already exists. Please use a different name.",
        });
        return;
      }
      
      // Handle other validation errors
      let errorMessage = 'Unknown error';
      if (error.response?.data?.detail) {
        const detailData = error.response.data.detail;
        if (Array.isArray(detailData)) {
          // Pydantic validation errors come as array
          errorMessage = detailData.map(err => {
            const field = err.loc ? err.loc.join('.') : 'field';
            return `${field}: ${err.msg}`;
          }).join('\n');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else {
          errorMessage = JSON.stringify(detail);
        }
      } else if (error.message) {
        errorMessage = error.message;
        // Add more context for network errors
        if (error.message === 'Network Error') {
          errorMessage = 'Network Error - The server is taking too long to respond. Your data has been auto-saved as draft. Please try again in a few minutes.';
          // Auto-save to draft on network error
          saveDraft();
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out - The server is busy. Your data has been auto-saved as draft. Please try again later.';
          saveDraft();
        }
      }
      
      toast({
        variant: "destructive",
        title: "❌ Error!",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header without Sidebar */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Institution' : 'Add New Institution'}
              </h1>
              <select
                name="institution_type"
                value={formData.institution_type}
                onChange={handleChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white font-medium"
              >
                <option value="College">🎓 College</option>
                <option value="School">🏫 School</option>
                <option value="University">🏛️ University</option>
              </select>
              {formData.name && (
                <span className="text-sm text-gray-500 hidden md:inline">— {formData.name}</span>
              )}
              {id && <StatusBadge status={formData.status || 'draft'} />}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => window.location.href = '/admin/colleges'}
                className="text-gray-600"
              >
                <FiX className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button 
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => {
                  setFormData(prev => ({...prev, status: 'draft'}));
                  setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
                }}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                {saving && formData.status === 'draft' ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiFileText className="w-4 h-4 mr-2" />}
                Save Draft
              </Button>
              {canDirectPublish ? (
                <Button 
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setFormData(prev => ({...prev, status: 'published'}));
                    setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving && formData.status === 'published' ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiSave className="w-4 h-4 mr-2" />}
                  Save & Publish
                </Button>
              ) : (
                <Button 
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setFormData(prev => ({...prev, status: 'pending'}));
                    setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving && formData.status === 'pending' ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiSend className="w-4 h-4 mr-2" />}
                  Submit for Review
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Badges */}
        <div className="max-w-7xl mx-auto px-6 py-2 bg-gray-50 border-t flex items-center gap-4 flex-wrap text-xs">
          {/* Auto-save indicator */}
          {!id && <AutoSaveIndicator lastSaved={draftLastSaved} />}
          
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_verified} onChange={(e) => setFormData({...formData, is_verified: e.target.checked})} className="rounded text-blue-600" />
            <span>✅ Verified</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_featured} 
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData({
                  ...formData, 
                  is_featured: isChecked,
                  // Set featured_at timestamp when enabling (for priority sorting)
                  featured_at: isChecked ? new Date().toISOString() : formData.featured_at
                });
              }} 
              className="rounded text-orange-600" 
            />
            <span>⭐ Featured</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_trending} onChange={(e) => setFormData({...formData, is_trending: e.target.checked})} className="rounded text-red-600" />
            <span>🔥 Trending</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_top_rated} onChange={(e) => setFormData({...formData, is_top_rated: e.target.checked})} className="rounded text-yellow-600" />
            <span>🏆 Top Rated</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_sponsored} onChange={(e) => setFormData({...formData, is_sponsored: e.target.checked})} className="rounded text-purple-600" />
            <span>💎 Sponsored</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_admission_partner} onChange={(e) => setFormData({...formData, is_admission_partner: e.target.checked})} className="rounded text-green-600" />
            <span>🤝 Admission Partner</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={formData.is_no_cost_emi} onChange={(e) => setFormData({...formData, is_no_cost_emi: e.target.checked})} className="rounded text-blue-600" />
            <span>💳 No Cost EMI</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_admission_open} 
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData({
                  ...formData, 
                  is_admission_open: isChecked,
                  admission_open_at: isChecked ? new Date().toISOString() : formData.admission_open_at
                });
              }} 
              className="rounded text-green-600" 
            />
            <span>🎓 Admissions Open</span>
          </label>
          
          {/* Display Priority for Listing Page Order */}
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg">
            <span className="text-sm font-medium text-indigo-700">📌 India Priority:</span>
            <input 
              type="number" 
              min="0"
              max="999"
              value={formData.display_priority || 0}
              onChange={(e) => setFormData({...formData, display_priority: parseInt(e.target.value) || 0})}
              className="w-16 border rounded px-2 py-1 text-center text-sm"
              placeholder="0"
            />
            <span className="text-xs text-indigo-600">(1=Top)</span>
          </div>
        </div>
        
        {/* Institution-Specific Admission Fees (only if Admission Partner) - Collapsible */}
        {formData.is_admission_partner && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 mt-4 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAdmissionFeesCollapsed(!isAdmissionFeesCollapsed)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-green-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h4 className="font-semibold text-green-700">Institution-Specific Admission Fees</h4>
                <span className="text-xs font-normal text-green-600">(Leave empty to use default fees)</span>
              </div>
              {isAdmissionFeesCollapsed ? <FiChevronRight className="w-5 h-5 text-green-600" /> : <FiChevronDown className="w-5 h-5 text-green-600" />}
            </button>
            {!isAdmissionFeesCollapsed && (
              <div className="px-4 pb-4 border-t border-green-200">
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Form Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.admission_fees?.form_fee || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        admission_fees: { ...formData.admission_fees, form_fee: e.target.value ? parseFloat(e.target.value) : '' }
                      })}
                      placeholder="Default: 1000"
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Platform Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.admission_fees?.platform_fee || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        admission_fees: { ...formData.admission_fees, platform_fee: e.target.value ? parseFloat(e.target.value) : '' }
                      })}
                      placeholder="Default: 250"
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">GST (%)</label>
                    <input
                      type="number"
                      value={formData.admission_fees?.gst_percentage ?? 18}
                      onChange={(e) => setFormData({
                        ...formData, 
                        admission_fees: { ...formData.admission_fees, gst_percentage: e.target.value ? parseFloat(e.target.value) : 18 }
                      })}
                      placeholder="18"
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                </div>
                {formData.admission_fees?.form_fee && formData.admission_fees?.platform_fee && (
                  <p className="text-sm text-green-600 mt-2">
                    Total: ₹{((parseFloat(formData.admission_fees.form_fee) + parseFloat(formData.admission_fees.platform_fee)) * (1 + (formData.admission_fees.gst_percentage || 18) / 100)).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Location-Specific Priorities - Collapsible */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 mt-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsLocationPriorityCollapsed(!isLocationPriorityCollapsed)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-100/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <h4 className="font-semibold text-gray-800">Location-Specific Display Priority</h4>
              <span className="text-xs font-normal text-gray-500">(Set different priority for State/City pages)</span>
            </div>
            {isLocationPriorityCollapsed ? <FiChevronRight className="w-5 h-5 text-purple-600" /> : <FiChevronDown className="w-5 h-5 text-purple-600" />}
          </button>
          {!isLocationPriorityCollapsed && (
            <div className="px-4 pb-4 border-t border-purple-200">
              <div className="grid grid-cols-2 gap-4 mt-3">
                {/* State Priority */}
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">State Priority</label>
                  <div className="flex gap-2">
                    <select
                      id="state-select"
                      className="flex-1 border rounded px-2 py-1.5 text-sm"
                      defaultValue=""
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                    </select>
                    <input type="number" id="state-priority-value" min="1" max="99" placeholder="Priority" className="w-20 border rounded px-2 py-1.5 text-sm text-center" />
                    <button
                      type="button"
                      onClick={() => {
                        const state = document.getElementById('state-select').value;
                        const priority = parseInt(document.getElementById('state-priority-value').value);
                        if (state && priority > 0) {
                          setFormData({...formData, state_priority: {...(formData.state_priority || {}), [state]: priority}});
                          document.getElementById('state-select').value = '';
                          document.getElementById('state-priority-value').value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  {/* Display added state priorities */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(formData.state_priority || {}).map(([state, priority]) => (
                      <span key={state} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {state}: #{priority}
                        <button type="button" onClick={() => {
                          const newPriority = {...formData.state_priority};
                          delete newPriority[state];
                          setFormData({...formData, state_priority: newPriority});
                        }} className="ml-1 text-purple-500 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* City Priority */}
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">City Priority</label>
                  <div className="flex gap-2">
                    <input type="text" id="city-input" placeholder="City name" className="flex-1 border rounded px-2 py-1.5 text-sm" />
                    <input type="number" id="city-priority-value" min="1" max="99" placeholder="Priority" className="w-20 border rounded px-2 py-1.5 text-sm text-center" />
                    <button
                      type="button"
                      onClick={() => {
                        const city = document.getElementById('city-input').value.trim();
                        const priority = parseInt(document.getElementById('city-priority-value').value);
                        if (city && priority > 0) {
                          setFormData({...formData, city_priority: {...(formData.city_priority || {}), [city]: priority}});
                          document.getElementById('city-input').value = '';
                          document.getElementById('city-priority-value').value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {/* Display added city priorities */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(formData.city_priority || {}).map(([city, priority]) => (
                      <span key={city} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {city}: #{priority}
                        <button type="button" onClick={() => {
                          const newPriority = {...formData.city_priority};
                          delete newPriority[city];
                          setFormData({...formData, city_priority: newPriority});
                        }} className="ml-1 text-blue-500 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Approval Actions - Collapsible, Only show for existing content */}
        {id && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 mt-4 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsContentStatusCollapsed(!isContentStatusCollapsed)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h4 className="font-semibold text-blue-700">Content Status & Approval</h4>
                <span className="text-xs font-normal text-blue-600">(Submit for review or publish)</span>
              </div>
              {isContentStatusCollapsed ? <FiChevronRight className="w-5 h-5 text-blue-600" /> : <FiChevronDown className="w-5 h-5 text-blue-600" />}
            </button>
            {!isContentStatusCollapsed && (
              <div className="px-4 pb-4 border-t border-blue-200">
                <ContentApprovalActions
                  contentType="college"
                  contentId={id}
                  currentStatus={formData.status || 'draft'}
                  rejectionReason={formData.rejection_reason}
                  onStatusChange={(newStatus) => setFormData(prev => ({...prev, status: newStatus}))}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Content with max-width container */}
      <form id="institution-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        
        {/* Draft Restore Banner - Only show for new entries */}
        {!id && showDraftBanner && (
          <DraftRestoreBanner
            onRestore={handleRestoreDraft}
            onDiscard={handleDiscardDraft}
            savedAt={getDraftInfo()?.savedAt}
            isVisible={showDraftBanner}
          />
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* STEP 1: COMMON INFORMATION (Always Required)                                    */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h2 className="text-lg font-bold">Step 1: Common Information</h2>
              <p className="text-blue-100 text-sm">Basic details, contact, media - required for all menu types</p>
            </div>
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Basic Information</h2>
            {id && (
              <SectionSaveButton 
                section="basic"
                onSave={handleSectionSave}
                isSaving={sectionSaving.basic}
                isSaved={sectionSaved.basic}
              />
            )}
          </div>
          
          {/* Guidance message for new entries */}
          {!id && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-blue-800 mb-1">Quick Save Workflow</p>
                  <p className="text-sm text-blue-700">
                    Fill in <strong>Name, State & City</strong> below, then click <strong>"Save Draft"</strong> to create the entry. 
                    After saving, you'll be redirected to the Edit page where you can complete all sections using 
                    <strong> "Save Section"</strong> buttons - this prevents timeout errors for large forms.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.institution_type === 'School' ? 'School Name' : formData.institution_type === 'University' ? 'University Name' : 'College Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (Auto-generated) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                required
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                placeholder="Auto-generated from name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Established Year *</label>
              <select
                name="established_year"
                value={formData.established_year}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 201 }, (_, i) => 2100 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              {isSchool ? (
                <>
                  <label className="block text-sm font-medium mb-1">Board *</label>
                  <select
                    name="board"
                    value={formData.board}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Board</option>
                    {boards.map((board) => (
                      <option key={board.id} value={board.name}>
                        {board.name} {board.full_name ? `- ${board.full_name}` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select the education board (CBSE, ICSE, State Board, etc.)</p>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium mb-1">
                    Affiliated To <span className="text-xs text-gray-500">(Select multiple if applicable)</span>
                  </label>
                  <div className="border rounded p-3 max-h-48 overflow-y-auto bg-white">
                    {affiliations.length === 0 ? (
                      <p className="text-sm text-gray-400">Loading affiliations...</p>
                    ) : (
                      <div className="space-y-2">
                        {affiliations.map((affiliation) => {
                          const isSelected = (formData.affiliated_to_list || []).includes(affiliation.name) ||
                                           formData.affiliated_to === affiliation.name;
                          return (
                            <label 
                              key={affiliation.id} 
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                isSelected ? 'bg-orange-50 border border-orange-200' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentList = formData.affiliated_to_list || 
                                    (formData.affiliated_to ? [formData.affiliated_to] : []);
                                  
                                  if (e.target.checked) {
                                    setFormData({ 
                                      ...formData, 
                                      affiliated_to_list: [...currentList, affiliation.name],
                                      affiliated_to: [...currentList, affiliation.name].join(', ')
                                    });
                                  } else {
                                    const newList = currentList.filter(a => a !== affiliation.name);
                                    setFormData({ 
                                      ...formData, 
                                      affiliated_to_list: newList,
                                      affiliated_to: newList.join(', ')
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                              />
                              <span className={`text-sm ${isSelected ? 'font-medium text-orange-700' : 'text-gray-700'}`}>
                                {affiliation.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {(formData.affiliated_to_list?.length > 0 || formData.affiliated_to) && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Selected: {(formData.affiliated_to_list || [formData.affiliated_to].filter(Boolean)).join(', ')}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* School-Specific Fields: Medium, Classes, Streams */}
            {isSchool && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Medium of Instruction *</label>
                  <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Medium</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English & Hindi">English & Hindi</option>
                    <option value="Regional">Regional Language</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Classes Offered *</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded max-h-32 overflow-y-auto">
                    {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                      <label key={cls} className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.classes_offered?.includes(cls)}
                          onChange={(e) => {
                            const newClasses = e.target.checked
                              ? [...(formData.classes_offered || []), cls]
                              : (formData.classes_offered || []).filter(c => c !== cls);
                            setFormData({ ...formData, classes_offered: newClasses });
                          }}
                          className="rounded"
                        />
                        {cls}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Streams Offered (11th-12th)</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded">
                    {['Science', 'Commerce', 'Humanities', 'Arts', 'Vocational'].map((stream) => (
                      <label key={stream} className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.streams_offered?.includes(stream)}
                          onChange={(e) => {
                            const newStreams = e.target.checked
                              ? [...(formData.streams_offered || []), stream]
                              : (formData.streams_offered || []).filter(s => s !== stream);
                            setFormData({ ...formData, streams_offered: newStreams });
                          }}
                          className="rounded"
                        />
                        {stream}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Campus Size</label>
              <input
                type="text"
                name="campus_size"
                value={formData.campus_size}
                onChange={handleChange}
                placeholder="e.g., 550 acres"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {/* Recognized By - Hidden for Schools */}
            {!isSchool && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Recognized By <span className="text-xs text-gray-500">(Select multiple if applicable)</span>
                </label>
                <div className="border rounded p-3 max-h-48 overflow-y-auto bg-white">
                  {recognitions.length === 0 ? (
                    <p className="text-sm text-gray-400">Loading recognitions...</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {recognitions.map((recognition) => {
                        const isSelected = (formData.recognized_by || []).includes(recognition.name);
                        return (
                          <label 
                            key={recognition.id} 
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              isSelected ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentList = formData.recognized_by || [];
                                if (e.target.checked) {
                                  setFormData({ 
                                    ...formData, 
                                    recognized_by: [...currentList, recognition.name]
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    recognized_by: currentList.filter(r => r !== recognition.name)
                                  });
                                }
                              }}
                              className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                              {recognition.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                {(formData.recognized_by?.length > 0) && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Selected: {formData.recognized_by.join(', ')}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Total Students</label>
              <input
                type="number"
                name="total_students"
                value={formData.total_students}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            {/* Streams Selection - Auto-calculated from selected courses */}
            {!isSchool && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Streams Offered <span className="text-xs text-green-600">(Auto-calculated from selected courses)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Get unique streams from selected courses */}
                  {(() => {
                    const courseStreams = new Set();
                    (formData.courses || []).forEach(course => {
                      if (course.stream) courseStreams.add(course.stream);
                    });
                    const uniqueStreams = Array.from(courseStreams);
                    
                    if (uniqueStreams.length === 0) {
                      return (
                        <p className="text-sm text-gray-400 italic">
                          No streams yet - add courses in the "Courses & Fees" section below
                        </p>
                      );
                    }
                    
                    return uniqueStreams.map(stream => (
                      <span
                        key={stream}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white"
                      >
                        {stream} ✓
                      </span>
                    ));
                  })()}
                </div>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const courseStreams = new Set();
                    (formData.courses || []).forEach(course => {
                      if (course.stream) courseStreams.add(course.stream);
                    });
                    const count = courseStreams.size;
                    return count > 0 
                      ? `${count} stream(s) from ${(formData.courses || []).length} course(s)` 
                      : 'Add courses to see streams here';
                  })()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <SearchableSelect
                options={indianStates}
                value={formData.location.state}
                onChange={(value) => handleNestedChange('location', 'state', value)}
                placeholder="Select State"
                label="state"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <SearchableSelect
                options={availableCities}
                value={formData.location.city}
                onChange={(value) => handleNestedChange('location', 'city', value)}
                placeholder="Select City"
                label="city"
                disabled={!formData.location.state}
                required
                allowCustom
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <textarea
                value={formData.location.address || ''}
                onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                rows="2"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN Code *</label>
              <input
                type="text"
                value={formData.location.pincode || ''}
                onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)}
                placeholder="e.g., 400001"
                maxLength="6"
                pattern="[0-9]{6}"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Google Maps URL</label>
              <input
                type="url"
                value={formData.location.google_maps_url || ''}
                onChange={(e) => handleNestedChange('location', 'google_maps_url', e.target.value)}
                placeholder="e.g., https://maps.google.com/?q=..."
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Paste the Google Maps share link for the institution</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="text"
                value={formData.location.latitude || ''}
                onChange={(e) => handleNestedChange('location', 'latitude', e.target.value)}
                placeholder="e.g., 19.0760"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="text"
                value={formData.location.longitude || ''}
                onChange={(e) => handleNestedChange('location', 'longitude', e.target.value)}
                placeholder="e.g., 72.8777"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Nearby Places / Landmarks</label>
              {(formData.location.nearby_places || []).map((place, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => updateNearbyPlace(index, e.target.value)}
                    placeholder="e.g., Andheri Metro Station (2 km), Mumbai Airport (5 km)"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeNearbyPlace(index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addNearbyPlace} size="sm" variant="outline">
                <FiPlus className="mr-2" /> Add Nearby Place
              </Button>
            </div>
          </div>
        </div>

        {/* How to Reach */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚗 How to Reach?</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">✈️ By Air</label>
              <textarea
                value={formData.how_to_reach.by_air}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_air', e.target.value)}
                placeholder="e.g., The nearest airport is Mumbai International Airport (Chhatrapati Shivaji Maharaj International Airport), located approximately 10 km from the institution. Regular taxi and app cab services are available from the airport."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚂 By Train</label>
              <textarea
                value={formData.how_to_reach.by_train}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_train', e.target.value)}
                placeholder="e.g., The nearest railway station is Andheri Railway Station (Western Line), approximately 3 km away. Local trains connect to all parts of Mumbai. Auto-rickshaws and cabs are readily available from the station."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚌 By Road</label>
              <textarea
                value={formData.how_to_reach.by_road}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_road', e.target.value)}
                placeholder="e.g., The institution is well-connected by road. State transport buses (BEST) operate regularly from major areas. Private vehicles can reach via the Western Express Highway. Parking facilities are available on campus."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚇 Public Transport</label>
              <textarea
                value={formData.how_to_reach.public_transport}
                onChange={(e) => handleNestedChange('how_to_reach', 'public_transport', e.target.value)}
                placeholder="e.g., Metro: Andheri Metro Station (Line 1) is 2 km away. Buses: BEST buses 249, 251, 258 stop directly in front of the institution. Auto-rickshaws and app-based cabs are easily available."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Description & Highlights</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <p className="text-xs text-gray-500 mb-2">
                Use the toolbar to format text: Bold, Italic, Colors, Links, Images, Videos, Lists
              </p>
              
              {/* Rich Text Editor for Description */}
              <RichTextEditor
                value={formData.description || ''}
                onChange={(content) => setFormData(prev => ({...prev, description: content}))}
                placeholder="Write detailed description about the institution..."
                collegeName={formData.name}
              />
              
              {/* Emoji Quick Insert for Description */}
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <p className="text-xs font-medium text-yellow-800 mb-1">😀 Quick Emojis (click to copy):</p>
                <div className="flex flex-wrap gap-1">
                  {['🎓', '📚', '🏫', '✅', '⭐', '🏆', '💼', '📍', '📞', '📧', '🌐', '👨‍🎓', '👩‍🎓', '📈', '💰', '🎯', '✨', '🔥', '💡', '👍'].map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(emoji);
                        alert(`${emoji} copied! Paste in editor with Ctrl+V.`);
                      }}
                      className="text-lg hover:bg-yellow-200 rounded p-1 transition-colors"
                      title={`Click to copy ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Builder for Description */}
            <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-sm font-medium text-orange-800">📊 Add Table to Description</label>
                  <p className="text-xs text-orange-600">Create tables and insert them into description above</p>
                </div>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                  {formData.description_tables?.length || 0} tables
                </span>
              </div>

              {/* Tables List */}
              {(formData.description_tables || []).map((table, tableIndex) => (
                <div key={tableIndex} className="bg-white rounded-lg border border-orange-200 p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">Table {tableIndex + 1}</span>
                      <input
                        type="text"
                        value={table.title || ''}
                        onChange={(e) => {
                          const newTables = [...(formData.description_tables || [])];
                          newTables[tableIndex].title = e.target.value;
                          setFormData({...formData, description_tables: newTables});
                        }}
                        placeholder="Table Title"
                        className="border rounded px-2 py-1 text-sm w-48"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => {
                        const newTables = [...(formData.description_tables || [])];
                        newTables[tableIndex].headers.push('Column');
                        newTables[tableIndex].rows.forEach(row => row.push(''));
                        setFormData({...formData, description_tables: newTables});
                      }} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">+ Col</button>
                      <button type="button" onClick={() => {
                        const newTables = [...(formData.description_tables || [])];
                        newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                        setFormData({...formData, description_tables: newTables});
                      }} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">+ Row</button>
                      <button type="button" onClick={() => {
                        setFormData({...formData, description_tables: (formData.description_tables || []).filter((_, i) => i !== tableIndex)});
                      }} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
                    </div>
                  </div>
                  
                  {/* Table Editor */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {(table.headers || []).map((header, colIndex) => (
                            <th key={colIndex} className="border border-orange-200 bg-orange-100 p-1">
                              <div className="flex items-center gap-1">
                                <input type="text" value={header}
                                  onChange={(e) => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].headers[colIndex] = e.target.value;
                                    setFormData({...formData, description_tables: newTables});
                                  }}
                                  className="w-full border-0 bg-transparent font-semibold text-center text-orange-800 focus:outline-none px-1"
                                  placeholder="Header"
                                />
                                {table.headers.length > 1 && (
                                  <button type="button" onClick={() => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].headers.splice(colIndex, 1);
                                    newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                    setFormData({...formData, description_tables: newTables});
                                  }} className="text-red-500 text-xs">×</button>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(table.rows || []).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="border border-orange-200 p-1">
                                <input type="text" value={cell}
                                  onChange={(e) => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                    setFormData({...formData, description_tables: newTables});
                                  }}
                                  className="w-full border-0 bg-transparent focus:outline-none px-1"
                                  placeholder=""
                                />
                              </td>
                            ))}
                            {table.rows.length > 1 && (
                              <td className="w-6">
                                <button type="button" onClick={() => {
                                  const newTables = [...(formData.description_tables || [])];
                                  newTables[tableIndex].rows.splice(rowIndex, 1);
                                  setFormData({...formData, description_tables: newTables});
                                }} className="text-red-500 text-xs">×</button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Insert Button */}
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => {
                      const tableHtml = `\n\n<table class="info-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>\n`;
                      setFormData({...formData, description: (formData.description || '') + tableHtml});
                      alert('Table inserted into Description!');
                    }} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">
                      ⚡ Insert into Description
                    </button>
                    <button type="button" onClick={() => {
                      const tableHtml = `<table class="info-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                      navigator.clipboard.writeText(tableHtml);
                      alert('Table HTML copied!');
                    }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200">
                      📋 Copy HTML
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Table Buttons */}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: '', headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']]
                  }]});
                }} className="text-sm text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded border border-orange-300 flex items-center gap-1">
                  <FiPlus /> Add Table
                </button>
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: 'Quick Facts', headers: ['Parameter', 'Details'], rows: [['Established', ''], ['Type', ''], ['Approved By', ''], ['Location', '']]
                  }]});
                }} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded hover:bg-orange-100">
                  + Quick Facts
                </button>
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: 'Key Statistics', headers: ['Metric', 'Value'], rows: [['Total Students', ''], ['Faculty', ''], ['Courses', ''], ['Campus Size', '']]
                  }]});
                }} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded hover:bg-orange-100">
                  + Key Statistics
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Highlights</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('highlights', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('highlights', '')} size="sm">
                <FiPlus className="mr-2" /> Add Highlight
              </Button>
            </div>
          </div>
        </div>

        {/* SEO Meta Tags Section - Using Reusable Component */}
        <CollapsibleSection title="SEO & Meta Tags (Main Page)" icon="🏷️" defaultOpen={false}>
          <SeoMetaSection 
            formData={formData} 
            setFormData={setFormData} 
            handleChange={handleChange}
            entityType="college"
          />
          {/* Admission & SEO Section Save Button */}
          {id && (
            <div className="mt-4 pt-4 border-t flex justify-end">
              <SectionSaveButton 
                section="admission"
                onSave={handleSectionSave}
                isSaving={sectionSaving.admission}
                isSaved={sectionSaved.admission}
              />
            </div>
          )}
        </CollapsibleSection>

        {/* SEO Content Section */}
        <CollapsibleSection title="SEO Content (Detail Page Content)" icon="🔍" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            This content appears in the expandable &quot;Read More&quot; section on the college detail page for better SEO.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Intro (Short Preview)</label>
              <p className="text-xs text-gray-500 mb-2">
                This is the short introduction (3-4 lines) that appears before the &quot;Read More&quot; button
              </p>
              
              {/* Rich Text Editor Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-bold text-blue-800 mb-2">✨ Rich Text Editor - Use toolbar to format:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white px-2 py-1 rounded border border-blue-200"><strong>B</strong> Bold</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200"><em>I</em> Italic</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">🔗 Links</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">🎨 Colors</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">🖼️ Images</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">🎬 YouTube</span>
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">📋 Lists</span>
                </div>
              </div>
              
              {/* Rich Text Editor */}
              <RichTextEditor
                value={formData.seo_intro || ''}
                onChange={(content) => setFormData(prev => ({...prev, seo_intro: content}))}
                placeholder="Write your SEO intro here..."
                collegeName={formData.name}
              />
              
              {/* Emoji Quick Insert */}
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <p className="text-xs font-medium text-yellow-800 mb-1">😀 Quick Emojis (click to copy, then paste in editor):</p>
                <div className="flex flex-wrap gap-1">
                  {['🎓', '📚', '🏫', '✅', '⭐', '🏆', '💼', '📍', '📞', '📧', '🌐', '👨‍🎓', '👩‍🎓', '📈', '💰', '🎯', '✨', '🔥', '💡', '👍'].map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(emoji);
                        alert(`${emoji} copied! Paste it in the editor with Ctrl+V.`);
                      }}
                      className="text-lg hover:bg-yellow-200 rounded p-1 transition-colors"
                      title={`Click to copy ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table of Contents Builder */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800">📑 Table of Contents + Content Sections</label>
                  <p className="text-xs text-purple-600">Each section you add here appears in TOC AND has its content below</p>
                </div>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                  {formData.seo_toc?.length || 0} sections
                </span>
              </div>

              {/* HOW IT WORKS - Explanation Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-bold text-blue-800 mb-2">📌 How TOC Connection Works:</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">1. Table of Contents (Clickable Menu)</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                      • About<br/>
                      • Admission Process<br/>
                      • Fee Structure
                    </div>
                    <p className="text-gray-500 mt-1">User sees this menu and clicks on a topic</p>
                  </div>
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">2. Content Sections (Linked by Anchor ID)</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                      <span className="text-green-600">&lt;section id=&quot;about&quot;&gt;</span><br/>
                      &nbsp;&nbsp;Content here...<br/>
                      <span className="text-green-600">&lt;/section&gt;</span>
                    </div>
                    <p className="text-gray-500 mt-1">Page scrolls to this section when clicked</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  🔗 The <strong>Anchor ID</strong> (e.g., &quot;about&quot;, &quot;admission-process&quot;) is the KEY that connects TOC link to content section!
                </p>
              </div>

              {/* TOC Items */}
              <div className="space-y-4 mb-4">
                {(formData.seo_toc || []).map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-purple-300 overflow-hidden shadow-sm">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-bold">{item.title || 'New Section'}</span>
                        {item.anchor && (
                          <span className="bg-purple-400 text-white text-xs px-2 py-0.5 rounded font-mono">
                            #{item.anchor}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            seo_toc: (formData.seo_toc || []).filter((_, i) => i !== index)
                          });
                        }}
                        className="text-white hover:bg-purple-700 p-1.5 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Section Fields */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            📝 Section Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].title = e.target.value;
                              newToc[index].anchor = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9\s]/g, '')
                                .replace(/\s+/g, '-')
                                .substring(0, 50);
                              setFormData({...formData, seo_toc: newToc});
                            }}
                            placeholder="e.g., About College, Admission Process"
                            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500"
                          />
                          <p className="text-xs text-gray-400 mt-1">This appears in Table of Contents</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            🔗 Anchor ID <span className="text-gray-400">(auto-generated)</span>
                          </label>
                          <input
                            type="text"
                            value={item.anchor || ''}
                            onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                              setFormData({...formData, seo_toc: newToc});
                            }}
                            placeholder="about-college"
                            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-mono bg-green-50 focus:border-green-500"
                          />
                          <p className="text-xs text-green-600 mt-1">🔑 This ID links TOC → Content</p>
                        </div>
                      </div>
                      
                      {/* Content Blocks - Visual Editor */}
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-white">
                          <label className="block text-sm font-bold">
                            📄 Section Content Blocks
                          </label>
                          <p className="text-xs text-orange-100">
                            Add text, images, tables, videos - each as a separate editable block
                          </p>
                        </div>
                        
                        {/* Add Block Toolbar */}
                        <div className="bg-white px-4 py-3 border-b border-orange-200 flex flex-wrap gap-2">
                          <span className="text-xs text-gray-600 py-1.5 font-medium">Add Block:</span>
                          
                          {/* Add Text Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'text', heading: '', content: ''
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                            📝 Text
                          </button>
                          
                          {/* Add Image Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'image', url: '', 
                              imageTitle: '', // User enters this
                              alt: '', // Auto-generated from imageTitle
                              title: '', // Auto-generated from imageTitle
                              caption: '', width: '100%'
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                            🖼️ Image
                          </button>
                          
                          {/* Add Table Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const collegeName = formData.name || 'College';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'table', 
                              title: `${collegeName} ${sectionTitle} Details - AdmissionBuddy`, 
                              headers: ['Parameter', 'Details', 'Remarks'],
                              rows: [['', '', ''], ['', '', '']]
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200">
                            📊 Table
                          </button>
                          
                          {/* Add Video Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'video', url: '', 
                              videoTitle: '', // User enters this
                              title: '', // Auto-generated from videoTitle
                              description: '' // Auto-generated from videoTitle
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                            🎬 Video
                          </button>
                          
                          {/* Add Quick Facts Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const collegeName = formData.name || 'College';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'facts', title: `${collegeName} Quick Facts - AdmissionBuddy`,
                              items: [
                                { label: 'Established', value: '' },
                                { label: 'Institute Type', value: '' },
                                { label: 'Approved By', value: '' },
                                { label: 'Accreditation', value: '' }
                              ]
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-200">
                            📋 Quick Facts
                          </button>
                          
                          {/* Add Key Stats Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const collegeName = formData.name || 'College';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'stats',
                              title: `${collegeName} Key Statistics - AdmissionBuddy`,
                              items: [
                                { label: 'Students', value: '', color: 'yellow' },
                                { label: 'Placement Rate', value: '', color: 'green' },
                                { label: 'Faculty', value: '', color: 'blue' },
                                { label: 'Avg. Package', value: '', color: 'pink' }
                              ]
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200">
                            📈 Key Stats
                          </button>
                          
                          {/* Add List Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const collegeName = formData.name || 'College';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'list', 
                              title: `${collegeName} ${sectionTitle} - AdmissionBuddy`, 
                              listType: 'bullet',
                              items: ['', '', '']
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                            📝 List
                          </button>
                        </div>
                        
                        {/* Content Blocks List */}
                        <div className="p-4 space-y-4">
                          {(!item.blocks || item.blocks.length === 0) ? (
                            <div className="text-center py-8 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50/50">
                              <p className="text-orange-400 text-lg mb-2">No content blocks yet</p>
                              <p className="text-orange-300 text-sm">Click the buttons above to add Text, Image, Table, Video, etc.</p>
                            </div>
                          ) : (
                            (item.blocks || []).map((block, blockIndex) => (
                              <div key={block.id} className={`border-2 rounded-xl overflow-hidden ${
                                block.type === 'text' ? 'border-blue-200' :
                                block.type === 'image' ? 'border-purple-200' :
                                block.type === 'table' ? 'border-teal-200' :
                                block.type === 'video' ? 'border-red-200' :
                                block.type === 'facts' ? 'border-cyan-200' :
                                block.type === 'stats' ? 'border-yellow-200' :
                                'border-gray-200'
                              }`}>
                                {/* Block Header */}
                                <div className={`px-4 py-2 flex items-center justify-between ${
                                  block.type === 'text' ? 'bg-blue-100' :
                                  block.type === 'image' ? 'bg-purple-100' :
                                  block.type === 'table' ? 'bg-teal-100' :
                                  block.type === 'video' ? 'bg-red-100' :
                                  block.type === 'facts' ? 'bg-cyan-100' :
                                  block.type === 'stats' ? 'bg-yellow-100' :
                                  'bg-gray-100'
                                }`}>
                                  <span className="font-bold text-sm flex items-center gap-2">
                                    {block.type === 'text' && '📝 Text Block'}
                                    {block.type === 'image' && '🖼️ Image Block'}
                                    {block.type === 'table' && '📊 Table Block'}
                                    {block.type === 'video' && '🎬 Video Block'}
                                    {block.type === 'facts' && '📋 Quick Facts'}
                                    {block.type === 'stats' && '📈 Key Statistics'}
                                    {block.type === 'list' && '📝 List Block'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {/* Move Up */}
                                    <button type="button" onClick={() => {
                                      if (blockIndex > 0) {
                                        const newToc = [...(formData.seo_toc || [])];
                                        const blocks = [...newToc[index].blocks];
                                        [blocks[blockIndex], blocks[blockIndex - 1]] = [blocks[blockIndex - 1], blocks[blockIndex]];
                                        newToc[index].blocks = blocks;
                                        setFormData({...formData, seo_toc: newToc});
                                      }
                                    }} className="p-1 hover:bg-white/50 rounded" disabled={blockIndex === 0}>
                                      <FiChevronUp size={16} className={blockIndex === 0 ? 'text-gray-300' : ''} />
                                    </button>
                                    {/* Move Down */}
                                    <button type="button" onClick={() => {
                                      if (blockIndex < item.blocks.length - 1) {
                                        const newToc = [...(formData.seo_toc || [])];
                                        const blocks = [...newToc[index].blocks];
                                        [blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
                                        newToc[index].blocks = blocks;
                                        setFormData({...formData, seo_toc: newToc});
                                      }
                                    }} className="p-1 hover:bg-white/50 rounded" disabled={blockIndex === item.blocks.length - 1}>
                                      <FiChevronDown size={16} className={blockIndex === item.blocks.length - 1 ? 'text-gray-300' : ''} />
                                    </button>
                                    {/* Delete */}
                                    <button type="button" onClick={() => {
                                      const newToc = [...(formData.seo_toc || [])];
                                      newToc[index].blocks = newToc[index].blocks.filter((_, i) => i !== blockIndex);
                                      setFormData({...formData, seo_toc: newToc});
                                    }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                      <FiTrash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Block Content Editor */}
                                <div className="p-4 bg-white">
                                  {/* TEXT BLOCK */}
                                  {block.type === 'text' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Sub-heading (optional)</label>
                                        <input type="text" value={block.heading || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].heading = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="e.g., Overview, Key Points" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                                        <textarea value={block.content || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].content = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} rows={5} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Write your content here..." />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* IMAGE BLOCK */}
                                  {block.type === 'image' && (
                                    <div className="space-y-3">
                                      {/* Image Upload Section */}
                                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                                        <p className="text-sm font-bold text-purple-800 mb-3">📤 Upload Image</p>
                                        <div className="flex flex-wrap gap-3 items-center">
                                          {/* File Upload Button */}
                                          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                                            uploadingContentImage[`${index}-${blockIndex}`] 
                                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                                          }`}>
                                            {uploadingContentImage[`${index}-${blockIndex}`] ? (
                                              <>
                                                <FiLoader className="animate-spin" size={18} />
                                                Uploading...
                                              </>
                                            ) : (
                                              <>
                                                <FiUpload size={18} />
                                                Choose File
                                              </>
                                            )}
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden" 
                                              disabled={uploadingContentImage[`${index}-${blockIndex}`]}
                                              onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                  handleContentImageUpload(e.target.files[0], index, blockIndex);
                                                }
                                              }}
                                            />
                                          </label>
                                          <span className="text-xs text-gray-500">or</span>
                                          {/* URL Input */}
                                          <div className="flex-1 min-w-[200px]">
                                            <input type="text" value={block.url || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].url = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Paste image URL here..." />
                                          </div>
                                        </div>
                                        {block.url && (
                                          <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                                            <FiCheck /> Image loaded successfully
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* SEO Fields */}
                                      <div className="space-y-3">
                                        {/* Image Title - Primary Input for Auto SEO */}
                                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                          <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Image Title <span className="text-red-500">*</span></label>
                                          <input type="text" value={block.imageTitle || ''} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            const imageTitle = e.target.value;
                                            const collegeName = formData.name || 'College';
                                            newToc[index].blocks[blockIndex].imageTitle = imageTitle;
                                            // Auto-generate SEO fields based on title
                                            if (imageTitle) {
                                              newToc[index].blocks[blockIndex].alt = `${imageTitle} - ${collegeName} | AdmissionBuddy`;
                                              newToc[index].blocks[blockIndex].title = `${imageTitle} - ${collegeName} | AdmissionBuddy.co`;
                                            }
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Campus Building, Library, Hostel Room, Lab Equipment" />
                                          <p className="text-xs text-yellow-700 mt-2">💡 Enter image title - SEO Alt & Title will be auto-generated with AdmissionBuddy branding</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">🔍 Alt Text (SEO) <span className="text-green-600 text-xs">(Auto-generated)</span></label>
                                            <input type="text" value={block.alt || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].alt = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 border-green-200 bg-green-50 rounded-lg px-3 py-2 text-sm" placeholder="Auto-generated from Image Title" />
                                            <p className="text-xs text-green-600 mt-1">Important for Google Image Search</p>
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">🏷️ Title Attribute (SEO) <span className="text-green-600 text-xs">(Auto-generated)</span></label>
                                            <input type="text" value={block.title || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].title = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 border-green-200 bg-green-50 rounded-lg px-3 py-2 text-sm" placeholder="Auto-generated from Image Title" />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Caption (below image)</label>
                                            <input type="text" value={block.caption || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].caption = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Image caption text" />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                                            <select value={block.width || '100%'} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].width = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm">
                                              <option value="100%">Full Width (100%)</option>
                                              <option value="75%">Large (75%)</option>
                                              <option value="50%">Medium (50%)</option>
                                              <option value="33%">Small (33%)</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Image Preview */}
                                      {block.url && (
                                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 bg-purple-50">
                                          <p className="text-xs text-purple-600 mb-2 font-medium">Preview:</p>
                                          <img src={block.url} alt={block.alt || 'Preview'} title={block.title || ''} 
                                            style={{maxWidth: block.width || '100%'}} 
                                            className="rounded-lg mx-auto" 
                                            onError={(e) => { e.target.style.display = 'none'; }} />
                                          {block.caption && <p className="text-center text-sm text-gray-600 mt-2">{block.caption}</p>}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* VIDEO BLOCK */}
                                  {block.type === 'video' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">YouTube Video URL <span className="text-red-500">*</span></label>
                                        <input type="text" value={block.url || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].url = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="https://www.youtube.com/watch?v=..." />
                                      </div>
                                      
                                      {/* Video Title - Primary Input for Auto SEO */}
                                      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                        <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Video Title <span className="text-red-500">*</span></label>
                                        <input type="text" value={block.videoTitle || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          const videoTitle = e.target.value;
                                          const collegeName = formData.name || 'College';
                                          newToc[index].blocks[blockIndex].videoTitle = videoTitle;
                                          // Auto-generate SEO fields based on title
                                          if (videoTitle) {
                                            newToc[index].blocks[blockIndex].title = `${videoTitle} - ${collegeName} | AdmissionBuddy`;
                                            newToc[index].blocks[blockIndex].description = `Watch ${videoTitle.toLowerCase()} of ${collegeName}. Get complete information about admissions, courses, fees, placements & more at AdmissionBuddy.co`;
                                          }
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Campus Tour, Student Life, Placement Drive, Virtual Classroom" />
                                        <p className="text-xs text-yellow-700 mt-2">💡 Enter video title - SEO Title & Description will be auto-generated with AdmissionBuddy branding</p>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">🏷️ Video Title (SEO) <span className="text-green-600 text-xs">(Auto-generated)</span></label>
                                          <input type="text" value={block.title || ''} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].title = e.target.value;
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="w-full border-2 border-green-200 bg-green-50 rounded-lg px-3 py-2 text-sm" placeholder="Auto-generated from Video Title" />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">📝 Description (SEO) <span className="text-green-600 text-xs">(Auto-generated)</span></label>
                                          <input type="text" value={block.description || ''} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].description = e.target.value;
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="w-full border-2 border-green-200 bg-green-50 rounded-lg px-3 py-2 text-sm" placeholder="Auto-generated from Video Title" />
                                        </div>
                                      </div>
                                      {/* Video Preview */}
                                      {block.url && (() => {
                                        const match = block.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
                                        if (match) {
                                          return (
                                            <div className="border-2 border-dashed border-red-300 rounded-lg p-3 bg-red-50">
                                              <p className="text-xs text-red-600 mb-2 font-medium">Preview:</p>
                                              <div className="relative" style={{paddingBottom: '56.25%'}}>
                                                <iframe src={`https://www.youtube.com/embed/${match[1]}`} 
                                                  className="absolute top-0 left-0 w-full h-full rounded-lg" 
                                                  title={block.title || 'Video'} allowFullScreen />
                                              </div>
                                            </div>
                                          );
                                        }
                                        return <p className="text-red-500 text-sm">Invalid YouTube URL</p>;
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* TABLE BLOCK */}
                                  {block.type === 'table' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Table Title</label>
                                        <input type="text" value={block.title || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].title = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="e.g., Fee Structure, Course List" />
                                      </div>
                                      <div className="flex gap-2">
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].rows = [...(block.rows || []), new Array(block.headers?.length || 3).fill('')];
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">+ Add Row</button>
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].headers = [...(block.headers || []), `Col ${(block.headers?.length || 0) + 1}`];
                                          newToc[index].blocks[blockIndex].rows = (block.rows || []).map(r => [...r, '']);
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">+ Add Column</button>
                                      </div>
                                      <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full text-sm">
                                          <thead className="bg-teal-50">
                                            <tr>
                                              {(block.headers || []).map((h, hi) => (
                                                <th key={hi} className="border p-2">
                                                  <input type="text" value={h} onChange={(e) => {
                                                    const newToc = [...(formData.seo_toc || [])];
                                                    newToc[index].blocks[blockIndex].headers[hi] = e.target.value;
                                                    setFormData({...formData, seo_toc: newToc});
                                                  }} className="w-full px-2 py-1 border rounded text-center font-semibold text-sm" />
                                                </th>
                                              ))}
                                              <th className="w-10 bg-teal-100"></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(block.rows || []).map((row, ri) => (
                                              <tr key={ri}>
                                                {(row || []).map((cell, ci) => (
                                                  <td key={ci} className="border p-2">
                                                    <input type="text" value={cell || ''} onChange={(e) => {
                                                      const newToc = [...(formData.seo_toc || [])];
                                                      newToc[index].blocks[blockIndex].rows[ri][ci] = e.target.value;
                                                      setFormData({...formData, seo_toc: newToc});
                                                    }} className="w-full px-2 py-1 border rounded text-sm" />
                                                  </td>
                                                ))}
                                                <td className="border p-1 text-center">
                                                  <button type="button" onClick={() => {
                                                    const newToc = [...(formData.seo_toc || [])];
                                                    newToc[index].blocks[blockIndex].rows = block.rows.filter((_, i) => i !== ri);
                                                    setFormData({...formData, seo_toc: newToc});
                                                  }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                    <FiTrash2 size={14} />
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* QUICK FACTS BLOCK */}
                                  {block.type === 'facts' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
                                        <input type="text" value={block.title || 'Quick Facts'} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].title = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" />
                                      </div>
                                      <div className="space-y-2">
                                        {(block.items || []).map((fact, fi) => (
                                          <div key={fi} className="flex gap-2 items-center">
                                            <input type="text" value={fact.label || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[fi].label = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="flex-1 border-2 rounded-lg px-3 py-2 text-sm" placeholder="Label (e.g., Established)" />
                                            <input type="text" value={fact.value || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[fi].value = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="flex-1 border-2 rounded-lg px-3 py-2 text-sm font-bold" placeholder="Value (e.g., 1990)" />
                                            <button type="button" onClick={() => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items = block.items.filter((_, i) => i !== fi);
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                              <FiTrash2 size={14} />
                                            </button>
                                          </div>
                                        ))}
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].items = [...(block.items || []), { label: '', value: '' }];
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">+ Add Fact</button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* KEY STATS BLOCK */}
                                  {block.type === 'stats' && (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        {(block.items || []).map((stat, si) => (
                                          <div key={si} className="border-2 rounded-lg p-3 bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                              <select value={stat.color || 'yellow'} onChange={(e) => {
                                                const newToc = [...(formData.seo_toc || [])];
                                                newToc[index].blocks[blockIndex].items[si].color = e.target.value;
                                                setFormData({...formData, seo_toc: newToc});
                                              }} className="text-xs border rounded px-2 py-1">
                                                <option value="yellow">🟡 Yellow</option>
                                                <option value="green">🟢 Green</option>
                                                <option value="blue">🔵 Blue</option>
                                                <option value="pink">🔴 Pink</option>
                                                <option value="purple">🟣 Purple</option>
                                              </select>
                                              <button type="button" onClick={() => {
                                                const newToc = [...(formData.seo_toc || [])];
                                                newToc[index].blocks[blockIndex].items = block.items.filter((_, i) => i !== si);
                                                setFormData({...formData, seo_toc: newToc});
                                              }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <FiTrash2 size={12} />
                                              </button>
                                            </div>
                                            <input type="text" value={stat.value || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[si].value = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 rounded px-2 py-1 text-lg font-bold text-center mb-1" placeholder="5000+" />
                                            <input type="text" value={stat.label || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[si].label = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border rounded px-2 py-1 text-sm text-center" placeholder="Students" />
                                          </div>
                                        ))}
                                      </div>
                                      <button type="button" onClick={() => {
                                        const newToc = [...(formData.seo_toc || [])];
                                        newToc[index].blocks[blockIndex].items = [...(block.items || []), { label: '', value: '', color: 'yellow' }];
                                        setFormData({...formData, seo_toc: newToc});
                                      }} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">+ Add Stat</button>
                                    </div>
                                  )}
                                  
                                  {/* LIST BLOCK */}
                                  {block.type === 'list' && (
                                    <div className="space-y-3">
                                      <div className="flex gap-3">
                                        <div className="flex-1">
                                          <label className="block text-xs font-medium text-gray-700 mb-1">List Title (optional)</label>
                                          <input type="text" value={block.title || ''} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].title = e.target.value;
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="e.g., Key Features" />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                          <select value={block.listType || 'bullet'} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].listType = e.target.value;
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="border-2 rounded-lg px-3 py-2 text-sm">
                                            <option value="bullet">• Bullet</option>
                                            <option value="number">1. Numbered</option>
                                            <option value="check">✓ Checklist</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        {(block.items || []).map((listItem, li) => (
                                          <div key={li} className="flex gap-2 items-center">
                                            <span className="text-gray-400 w-6">
                                              {block.listType === 'number' ? `${li + 1}.` : block.listType === 'check' ? '✓' : '•'}
                                            </span>
                                            <input type="text" value={listItem || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[li] = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="flex-1 border-2 rounded-lg px-3 py-2 text-sm" placeholder="List item" />
                                            <button type="button" onClick={() => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items = block.items.filter((_, i) => i !== li);
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                              <FiTrash2 size={14} />
                                            </button>
                                          </div>
                                        ))}
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].items = [...(block.items || []), ''];
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">+ Add Item</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Section Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_toc: [...(formData.seo_toc || []), { title: '', anchor: '', blocks: [] }]
                  });
                }}
                className="text-sm text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg border-2 border-purple-300 flex items-center gap-2 font-medium"
              >
                <FiPlus /> Add New TOC Section
              </button>

              {/* Quick Add Templates */}
              <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                <p className="text-xs font-medium text-purple-800 mb-2">💡 Quick Add Common Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { title: 'About', anchor: 'about' },
                    { title: 'Admission Process', anchor: 'admission-process' },
                    { title: 'Courses Offered', anchor: 'courses-offered' },
                    { title: 'Fee Structure', anchor: 'fee-structure' },
                    { title: 'Placement', anchor: 'placement' },
                    { title: 'Facilities', anchor: 'facilities' },
                    { title: 'Scholarship', anchor: 'scholarship' },
                    { title: 'Hostel', anchor: 'hostel' },
                    { title: 'Ranking', anchor: 'ranking' },
                    { title: 'Contact', anchor: 'contact' },
                  ].map((template, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const exists = (formData.seo_toc || []).some(t => t.anchor === template.anchor);
                        if (!exists) {
                          setFormData({
                            ...formData,
                            seo_toc: [...(formData.seo_toc || []), { ...template, content: '' }]
                          });
                        }
                      }}
                      className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded hover:bg-purple-100"
                    >
                      + {template.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOC Preview & Copy */}
              {formData.seo_toc?.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">👁️ TOC Preview</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Generate TOC HTML
                          const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>`;
                          navigator.clipboard.writeText(tocHtml);
                          alert('TOC HTML copied! Paste at the beginning of SEO Full Content.');
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        📋 Copy TOC HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Generate full content with TOC and all sections
                          const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>\n\n`;
                          const sectionsHtml = formData.seo_toc.map(item => 
                            `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div class="section-content">\n    ${item.content || '[Content here]'}\n  </div>\n</section>`
                          ).join('\n\n');
                          const fullHtml = tocHtml + sectionsHtml;
                          navigator.clipboard.writeText(fullHtml);
                          alert('Full content with TOC copied!');
                        }}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        📋 Copy Full Content
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual TOC Preview */}
                  <div className="bg-white border rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Table of Contents</p>
                    <ul className="space-y-1">
                      {formData.seo_toc.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center justify-center">{index + 1}</span>
                          <a href={`#${item.anchor}`} className="text-sm text-blue-600 hover:underline">
                            {item.title || 'Untitled Section'}
                          </a>
                          <span className="text-xs text-gray-400">#{item.anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Auto-fill SEO Full Content */}
                  <button
                    type="button"
                    onClick={() => {
                      // Generate full content with TOC and all sections
                      const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>\n\n`;
                      const sectionsHtml = formData.seo_toc.map(item => 
                        `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div class="section-content">\n    ${item.content || ''}\n  </div>\n</section>`
                      ).join('\n\n');
                      const fullHtml = tocHtml + sectionsHtml;
                      setFormData({...formData, seo_full_content: fullHtml});
                      alert('SEO Full Content has been auto-filled with TOC and sections!');
                    }}
                    className="mt-3 w-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2"
                  >
                    ⚡ Auto-Fill SEO Content with TOC & Sections
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">SEO Full Content</label>
              <p className="text-xs text-gray-500 mb-2">
                Detailed content that appears after clicking &quot;Read More&quot; (multiple paragraphs with rich formatting)
              </p>
              
              {/* Rich Text Editor for SEO Full Content */}
              <RichTextEditor
                value={formData.seo_full_content || ''}
                onChange={(content) => setFormData(prev => ({...prev, seo_full_content: content}))}
                placeholder="Add multiple paragraphs with detailed information about the college..."
                collegeName={formData.name}
              />
              
              {/* Emoji Quick Insert */}
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <p className="text-xs font-medium text-yellow-800 mb-1">😀 Quick Emojis (click to copy):</p>
                <div className="flex flex-wrap gap-1">
                  {['🎓', '📚', '🏫', '✅', '⭐', '🏆', '💼', '📍', '📞', '📧', '🌐', '👨‍🎓', '👩‍🎓', '📈', '💰', '🎯', '✨', '🔥', '💡', '👍'].map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(emoji);
                        alert(`${emoji} copied! Paste in editor with Ctrl+V.`);
                      }}
                      className="text-lg hover:bg-yellow-200 rounded p-1 transition-colors"
                      title={`Click to copy ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Builder */}
            <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800">📊 Table Builder</label>
                  <p className="text-xs text-teal-600">Create tables for fee structure, placement data, course comparison, etc.</p>
                </div>
                <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">
                  {formData.seo_tables?.length || 0} tables
                </span>
              </div>

              {/* Existing Tables */}
              <div className="space-y-4 mb-4">
                {(formData.seo_tables || []).map((table, tableIndex) => (
                  <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">Table {tableIndex + 1}</span>
                        <input
                          type="text"
                          value={table.title || ''}
                          onChange={(e) => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].title = e.target.value;
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          placeholder="Table Title (e.g., Fee Structure)"
                          className="border rounded px-2 py-1 text-sm w-64"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].headers.push('New Column');
                            newTables[tableIndex].rows.forEach(row => row.push(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Row
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_tables: (formData.seo_tables || []).filter((_, i) => i !== tableIndex)
                            });
                          }}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete Table
                        </button>
                      </div>
                    </div>

                    {/* Table Editor */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            {(table.headers || []).map((header, colIndex) => (
                              <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].headers[colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 focus:outline-none focus:bg-white focus:border rounded px-1"
                                    placeholder="Header"
                                  />
                                  {table.headers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTables = [...(formData.seo_tables || [])];
                                        newTables[tableIndex].headers.splice(colIndex, 1);
                                        newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                        setFormData({...formData, seo_tables: newTables});
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="Remove column"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(table.rows || []).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border border-teal-200 p-1">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 bg-transparent focus:outline-none focus:bg-gray-50 px-1"
                                    placeholder="Cell data"
                                  />
                                </td>
                              ))}
                              <td className="w-8">
                                {table.rows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].rows.splice(rowIndex, 1);
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs p-1"
                                    title="Remove row"
                                  >
                                    ×
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Copy Table HTML */}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                          navigator.clipboard.writeText(tableHtml);
                          alert('Table HTML copied! Paste it in SEO Full Content above.');
                        }}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200"
                      >
                        📋 Copy Table HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                          setFormData({
                            ...formData,
                            seo_full_content: (formData.seo_full_content || '') + '\n\n' + tableHtml
                          });
                          alert('Table added to SEO Full Content!');
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200"
                      >
                        ⚡ Insert into Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Table Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_tables: [
                      ...(formData.seo_tables || []),
                      {
                        title: '',
                        headers: ['Column 1', 'Column 2', 'Column 3'],
                        rows: [['', '', ''], ['', '', '']]
                      }
                    ]
                  });
                }}
                className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1"
              >
                <FiPlus /> Add New Table
              </button>

              {/* Quick Table Templates */}
              <div className="mt-4 p-3 bg-white border border-teal-200 rounded-lg">
                <p className="text-xs font-medium text-teal-800 mb-2">💡 Quick Add Table Templates:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Fee Structure',
                          headers: ['Course', 'Duration', 'Annual Fee', 'Total Fee'],
                          rows: [['B.Tech', '4 Years', '₹1,50,000', '₹6,00,000'], ['M.Tech', '2 Years', '₹1,00,000', '₹2,00,000']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Fee Structure
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Placement Statistics',
                          headers: ['Year', 'Students Placed', 'Highest Package', 'Average Package'],
                          rows: [['2024', '450', '₹45 LPA', '₹8.5 LPA'], ['2023', '420', '₹42 LPA', '₹7.8 LPA']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Placement Stats
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Admission Cutoff',
                          headers: ['Category', 'Opening Rank', 'Closing Rank'],
                          rows: [['General', '1000', '5000'], ['OBC', '5001', '10000'], ['SC/ST', '10001', '15000']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Admission Cutoff
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Course Comparison',
                          headers: ['Feature', 'Course A', 'Course B'],
                          rows: [['Duration', '', ''], ['Eligibility', '', ''], ['Fees', '', ''], ['Career Options', '', '']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Course Comparison
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Hostel Fee Structure',
                          headers: ['Room Type', 'Monthly Fee', 'Annual Fee', 'Facilities'],
                          rows: [['Single Room', '₹8,000', '₹96,000', 'AC, Attached Bath'], ['Double Sharing', '₹5,000', '₹60,000', 'Non-AC'], ['Triple Sharing', '₹3,500', '₹42,000', 'Non-AC']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Hostel Fees
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Content Images */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800">🖼️ SEO Content Images</label>
                  <p className="text-xs text-blue-600">Add images to enhance your SEO content. Include alt tags for accessibility.</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {formData.seo_images?.length || 0} images
                </span>
              </div>

              {/* Image Upload Area */}
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    <FiUpload className="w-6 h-6 text-blue-500 mb-1" />
                    <p className="text-sm text-blue-600">Click to upload SEO image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP (Recommended: 800x600px)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const uploadFormData = new FormData();
                      uploadFormData.append('file', file);
                      
                      try {
                        // type is a query param, not form data
                        // Use headers config to let browser set Content-Type for FormData
                        const response = await api.post('/upload/image?type=campus', uploadFormData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        });
                        const newImage = {
                          url: response.data.url,
                          title: '',
                          alt: `${formData.name || 'College'} - Admissionbuddy`,
                          caption: ''
                        };
                        setFormData({
                          ...formData,
                          seo_images: [...(formData.seo_images || []), newImage]
                        });
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('Failed to upload image. Please try again.');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {formData.seo_images?.length > 0 && (
                <div className="space-y-3">
                  {formData.seo_images.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg border p-3">
                      <div className="flex gap-4">
                        {/* Image Preview */}
                        <div className="w-32 h-24 flex-shrink-0">
                          <img
                            src={image.url?.startsWith('/api') ? image.url : `/api${image.url}`}
                            alt={image.alt || 'SEO Image'}
                            className="w-full h-full object-cover rounded border"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/128x96?text=Image'; }}
                          />
                        </div>
                        
                        {/* Image Details */}
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Image Title</label>
                              <input
                                type="text"
                                value={image.title || ''}
                                onChange={(e) => {
                                  const newImages = [...formData.seo_images];
                                  newImages[index].title = e.target.value;
                                  // Auto-generate alt if empty
                                  if (!newImages[index].alt && e.target.value) {
                                    newImages[index].alt = `${e.target.value} - ${formData.name || 'College'} - Admissionbuddy`;
                                  }
                                  setFormData({...formData, seo_images: newImages});
                                }}
                                placeholder="e.g., Campus Library"
                                className="w-full border rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Alt Tag (SEO) *</label>
                              <input
                                type="text"
                                value={image.alt || ''}
                                onChange={(e) => {
                                  const newImages = [...formData.seo_images];
                                  newImages[index].alt = e.target.value;
                                  setFormData({...formData, seo_images: newImages});
                                }}
                                placeholder="Descriptive alt text"
                                className="w-full border-2 border-blue-200 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Caption (Optional)</label>
                            <input
                              type="text"
                              value={image.caption || ''}
                              onChange={(e) => {
                                const newImages = [...formData.seo_images];
                                newImages[index].caption = e.target.value;
                                setFormData({...formData, seo_images: newImages});
                              }}
                              placeholder="Caption displayed below the image"
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                          
                          {/* Copy HTML Code */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const imgUrl = image.url?.startsWith('/api') ? image.url : `/api${image.url}`;
                                const htmlCode = `<figure><img src="${imgUrl}" alt="${image.alt || ''}" title="${image.title || ''}" />${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`;
                                navigator.clipboard.writeText(htmlCode);
                                alert('HTML code copied! Paste it in SEO Full Content above.');
                              }}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                              📋 Copy HTML Code
                            </button>
                            <span className="text-xs text-gray-500">Insert into content above</span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_images: formData.seo_images.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded self-start"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Insert All */}
              {formData.seo_images?.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">💡 Quick Insert All Images</p>
                      <p className="text-xs text-yellow-600">Copy HTML for all images to paste in content</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const allHtml = formData.seo_images.map(img => {
                          const imgUrl = img.url?.startsWith('/api') ? img.url : `/api${img.url}`;
                          return `<figure><img src="${imgUrl}" alt="${img.alt || ''}" title="${img.title || ''}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}</figure>`;
                        }).join('\n\n');
                        navigator.clipboard.writeText(allHtml);
                        alert('All image HTML copied!');
                      }}
                      className="text-sm bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-300"
                    >
                      📋 Copy All HTML
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🎥 SEO Video</label>
              <p className="text-xs text-gray-500 mb-2">
                📹 YouTube or video embed URL • Add title & description for accessibility
              </p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    name="seo_video_url"
                    value={formData.seo_video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/embed/..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="seo_video_title"
                    value={formData.seo_video_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., 'College Overview - Admissionbuddy'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and video player title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Description (Optional)</label>
                  <textarea
                    name="seo_video_description"
                    value={formData.seo_video_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of the SEO video content..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO FAQs</label>
              <p className="text-xs text-gray-500 mb-2">
                Frequently asked questions that appear in the SEO content section
              </p>
              {formData.seo_faqs.map((faq, index) => (
                <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Question {index + 1}</label>
                      <input
                        type="text"
                        placeholder="e.g., What are the scholarships offered?"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Answer</label>
                      <textarea
                        placeholder="e.g., Various merit and need-based scholarships are available..."
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows="3"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeFAQ(index)}
                    className="mt-2"
                  >
                    <FiTrash2 className="mr-2" /> Remove FAQ
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addFAQ} size="sm">
                <FiPlus className="mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
          
          {/* SEO Content Section Save Button */}
          {id && (
            <div className="mt-6 pt-4 border-t flex justify-end">
              <SectionSaveButton 
                section="seo-content"
                onSave={handleSectionSave}
                isSaving={sectionSaving['seo-content']}
                isSaved={sectionSaved['seo-content']}
              />
            </div>
          )}
        </CollapsibleSection>

        {/* Accreditation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Accreditation (Optional)</h2>
          <div className="space-y-4">
            {formData.accreditations.map((accr, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Accreditation Name</label>
                    <select
                      value={typeof accr === 'string' ? '' : (accr.name || '')}
                      onChange={(e) => updateAccreditation(index, 'name', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Accreditation</option>
                      {accreditationsList.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Accreditation Level</label>
                    <select
                      value={typeof accr === 'string' ? '' : (accr.level || '')}
                      onChange={(e) => updateAccreditation(index, 'level', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Level</option>
                      {accreditationLevelsList.map((level) => (
                        <option key={level.id} value={level.name}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAccreditation(index)}
                      className="w-full"
                    >
                      <FiTrash2 className="mr-2" /> Remove
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={typeof accr === 'string' ? '' : (accr.description || '')}
                    onChange={(e) => updateAccreditation(index, 'description', e.target.value)}
                    placeholder="Additional details about this accreditation (optional)"
                    rows="2"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addAccreditation} size="sm" variant="outline">
              <FiPlus className="mr-2" /> Add Accreditation
            </Button>
          </div>
        </div>

        {/* Rankings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Rankings</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">NIRF Ranking</label>
              <input
                type="number"
                name="nirf_ranking"
                value={formData.nirf_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">India Today Ranking</label>
              <input
                type="number"
                name="india_today_ranking"
                value={formData.india_today_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Outlook Ranking</label>
              <input
                type="number"
                name="outlook_ranking"
                value={formData.outlook_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Detailed Rankings</label>
            {(formData.rankings || []).map((ranking, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agency *</label>
                    <select
                      value={ranking.agency || ''}
                      onChange={(e) => updateRanking(index, 'agency', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Agency</option>
                      {rankingsList.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={ranking.category || ''}
                      onChange={(e) => updateRanking(index, 'category', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {rankCategoriesList.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rank *</label>
                    <input
                      type="number"
                      value={ranking.rank || ''}
                      onChange={(e) => updateRanking(index, 'rank', parseInt(e.target.value))}
                      placeholder="e.g., 15"
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year *</label>
                    <input
                      type="number"
                      value={ranking.year || new Date().getFullYear()}
                      onChange={(e) => updateRanking(index, 'year', parseInt(e.target.value))}
                      placeholder="2025"
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => removeRanking(index)}>
                    <FiTrash2 className="mr-2" /> Remove Ranking
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addRanking} size="sm" variant="outline">
              <FiPlus className="mr-2" /> Add Ranking
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* DEFAULT MENU CONTENT SECTIONS                                                   */}
        {/* These sections are used when Default Menu mode is selected                      */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        
        {/* Show indicator for Default Menu mode */}
        {!formData.menu_config?.use_custom_menu && !formData.menu_config?.auto_from_toc && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="font-semibold text-blue-800">Default Menu Content Sections</p>
              <p className="text-sm text-blue-600">Fill these sections to populate your default menu items</p>
            </div>
          </div>
        )}
        
        {/* For Schools: Simple Fee Section */}
        {isSchool ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📚 School Fees</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Average Annual Fee (₹) *</label>
                <input
                  type="number"
                  name="average_fees"
                  value={formData.average_fees}
                  onChange={handleChange}
                  required
                  placeholder="Enter annual fee"
                  className="w-full border rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Annual tuition fee for the school</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fee Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Fee"
                    value={formData.fee_range?.min || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fee_range: { ...formData.fee_range, min: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max Fee"
                    value={formData.fee_range?.max || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fee_range: { ...formData.fee_range, max: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* For Colleges/Universities: Full Courses & Fees Section */
          <div>
            <CoursesSection 
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              availableCourses={availableCourses}
              updateCourse={updateCourse}
              addCourse={addCourse}
              removeCourse={removeCourse}
              uploadingCourseBrochure={uploadingCourseBrochure}
              handleCourseBrochureUpload={handleCourseBrochureUpload}
            />
            {/* Courses Section Save Button */}
            {id && (
              <div className="bg-white rounded-lg shadow p-4 mt-2 flex justify-end">
                <SectionSaveButton 
                  section="courses"
                  onSave={handleSectionSave}
                  isSaving={sectionSaving.courses}
                  isSaved={sectionSaved.courses}
                />
              </div>
            )}
          </div>
        )}

        {/* Admission Details - Shown for all */}
        <AdmissionSection 
          formData={formData}
          handleChange={handleChange}
          updateAdmissionDate={updateAdmissionDate}
          addAdmissionDate={addAdmissionDate}
          removeAdmissionDate={removeAdmissionDate}
        />

        {/* Cutoff Data - Hidden for Schools */}
        {!isSchool && (
          <CutoffSection 
            formData={formData}
            updateCutoff={updateCutoff}
            addCutoff={addCutoff}
            removeCutoff={removeCutoff}
          />
        )}

        {/* Placement Details - Hidden for Schools */}
        {!isSchool && (
          <PlacementSection 
            formData={formData} 
            setFormData={setFormData} 
            handleNestedChange={handleNestedChange} 
          />
        )}

        {/* Scholarships - Extracted Component */}
        <ScholarshipsSection 
          formData={formData} 
          setFormData={setFormData} 
          availableScholarships={availableScholarships}
          updateScholarship={updateScholarship}
          addScholarship={addScholarship}
          removeScholarship={removeScholarship}
        />

        {/* Facilities - Extracted Component */}
        <FacilitiesSection 
          formData={formData} 
          availableFacilities={availableFacilities}
          updateFacility={updateFacility}
          addFacility={addFacility}
          removeFacility={removeFacility}
          renderIcon={renderIcon}
        />
        
        {/* Details Section Save Button (Facilities, Rankings, Placements) */}
        {id && (
          <div className="bg-white rounded-lg shadow p-4 flex justify-end">
            <SectionSaveButton 
              section="details"
              onSave={handleSectionSave}
              isSaving={sectionSaving.details}
              isSaved={sectionSaved.details}
            />
          </div>
        )}

        {/* Updates & News - Extracted Component */}
        <UpdatesSection 
          formData={formData} 
          availableNews={availableNews}
          updateUpdate={updateUpdate}
          addUpdate={addUpdate}
          removeUpdate={removeUpdate}
        />

        {/* Announcements / Latest News Section */}
        <CollapsibleSection title="Announcements / Latest News (Sidebar)" icon="📢" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            📢 These announcements appear in the <strong>&quot;Latest News&quot;</strong> sidebar section on the college detail page.
          </p>
          
          <div className="space-y-4">
            {(formData.announcements || []).map((announcement, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-semibold text-gray-700">Announcement #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAnnouncement(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕ Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={announcement.title || ''}
                      onChange={(e) => updateAnnouncement(index, 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      placeholder="e.g., Admission 2025 Opens"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={announcement.date || ''}
                      onChange={(e) => updateAnnouncement(index, 'date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                  <input
                    type="url"
                    value={announcement.link || ''}
                    onChange={(e) => updateAnnouncement(index, 'link', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    placeholder="https://example.com/news-article"
                  />
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Content (Optional)</label>
                  <textarea
                    value={announcement.content || ''}
                    onChange={(e) => updateAnnouncement(index, 'content', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="2"
                    placeholder="Brief description of the announcement..."
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addAnnouncement}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <span className="text-lg">+</span> Add Announcement
            </button>
          </div>
        </CollapsibleSection>

        {/* FAQs Section - Extracted Component */}
        <FAQsSection 
          formData={formData} 
          setFormData={setFormData}
          addFAQ={addFAQ}
          updateFAQ={updateFAQ}
          removeFAQ={removeFAQ}
        />


        {/* Sidebar Widgets Configuration - Extracted Component */}
        <SidebarWidgetsSection formData={formData} setFormData={setFormData} />

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* STEP 2: MENU CONFIGURATION (SIMPLIFIED)                                         */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg shadow-md mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h2 className="text-lg font-bold">Step 2: Menu Configuration</h2>
              <p className="text-purple-100 text-sm">Configure which pages to show and their SEO settings</p>
            </div>
          </div>
        </div>

        {/* Simplified Menu Configuration Component */}
        <MenuConfigSection formData={formData} setFormData={setFormData} />

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* STEP 3: CONTENT BASED ON MENU MODE                                              */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* STEP 3: ADD CONTENT                                                             */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-lg shadow-md mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h2 className="text-lg font-bold">Step 3: Add Content</h2>
              <p className="text-sm opacity-90">Fill content for each enabled menu section</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.contact_info.phone}
                onChange={(e) => handleNestedChange('contact_info', 'phone', e.target.value)}
                placeholder="e.g., +91-11-12345678"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                value={formData.contact_info.mobile}
                onChange={(e) => handleNestedChange('contact_info', 'mobile', e.target.value)}
                placeholder="e.g., +91-9876543210"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={formData.contact_info.whatsapp}
                onChange={(e) => handleNestedChange('contact_info', 'whatsapp', e.target.value)}
                placeholder="e.g., +91-9876543210"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleNestedChange('contact_info', 'email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.contact_info.website}
                onChange={(e) => handleNestedChange('contact_info', 'website', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm mb-3">Social Media Links</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-blue-600">Facebook</label>
                <input
                  type="url"
                  value={formData.social_links?.facebook || ''}
                  onChange={(e) => handleNestedChange('social_links', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-black">Twitter / X</label>
                <input
                  type="url"
                  value={formData.social_links?.twitter || ''}
                  onChange={(e) => handleNestedChange('social_links', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-pink-600">Instagram</label>
                <input
                  type="url"
                  value={formData.social_links?.instagram || ''}
                  onChange={(e) => handleNestedChange('social_links', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-blue-700">LinkedIn</label>
                <input
                  type="url"
                  value={formData.social_links?.linkedin || ''}
                  onChange={(e) => handleNestedChange('social_links', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-red-600">YouTube</label>
                <input
                  type="url"
                  value={formData.social_links?.youtube || ''}
                  onChange={(e) => handleNestedChange('social_links', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Resources */}
        <CollapsibleSection title="Media & Resources" icon="📸" defaultOpen={true}>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Logo</label>
              <p className="text-xs text-gray-600 mb-2">📐 Recommended: 400x400 px (Square) • Max: Any size • Auto-optimized to 400x400 px</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingLogo ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {uploadingLogo ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={formData.logo_title}
                    onChange={(e) => handleTitleChange('logo_title', e.target.value)}
                    placeholder="e.g., 'Official Logo'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                  />
                  <p className="text-xs text-blue-600 mt-1">⚡ Alt text auto-generated with Admissionbuddy branding</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                  <input
                    type="text"
                    name="logo_alt"
                    value={formData.logo_alt}
                    onChange={handleChange}
                    placeholder="Auto-generated from title"
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Editable if needed</p>
                </div>
              </div>
              {formData.logo_url && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative">
                    <img 
                      key={formData.logo_url}
                      src={formData.logo_url} 
                      alt={formData.logo_alt || "Logo Preview"} 
                      className="h-20 object-contain border border-gray-300 p-2 bg-white rounded"
                      onLoad={(e) => console.log('Logo loaded:', formData.logo_url)}
                      onError={(e) => {
                        console.error('Logo failed to load:', formData.logo_url);
                        e.target.style.border = '2px solid red';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 break-all">URL: {formData.logo_url}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Banner</label>
              <p className="text-xs text-gray-600 mb-2">📐 Recommended: 1600x400 px (Wide) • Max: Any size • Auto-optimized to 1600x400 px</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="banner_url"
                  value={formData.banner_url}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, 'banner');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingBanner ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {uploadingBanner ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={formData.banner_title}
                    onChange={(e) => handleTitleChange('banner_title', e.target.value)}
                    placeholder="e.g., 'Main Campus Building'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                  />
                  <p className="text-xs text-blue-600 mt-1">⚡ Alt text auto-generated with Admissionbuddy branding</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                  <input
                    type="text"
                    name="banner_alt"
                    value={formData.banner_alt}
                    onChange={handleChange}
                    placeholder="Auto-generated from title"
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Editable if needed</p>
                </div>
              </div>
              {formData.banner_url && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative">
                    <img 
                      key={formData.banner_url}
                      src={formData.banner_url} 
                      alt={formData.banner_alt || "Banner Preview"} 
                      className="w-full max-h-40 object-cover rounded border border-gray-300 bg-white"
                      onLoad={(e) => console.log('Banner loaded:', formData.banner_url)}
                      onError={(e) => {
                        console.error('Banner failed to load:', formData.banner_url);
                        e.target.style.border = '2px solid red';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 break-all">URL: {formData.banner_url}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Campus Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Campus Gallery Images</label>
              <p className="text-xs text-gray-600 mb-3">📐 Recommended: 1200x900 px (4:3) • Max: Any size • Auto-optimized to 1200x900 px</p>
              
              {/* Bulk Upload Option */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Upload Multiple Images</p>
                    <p className="text-xs text-blue-700">Select multiple files • All images auto-optimized</p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="campus-bulk-upload"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleBulkCampusUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="campus-bulk-upload"
                      className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                        uploadingCampusBulk ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {uploadingCampusBulk ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" />
                          Upload Multiple
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Individual Image Rows */}
              {formData.campus_images.map((img, index) => {
                const imgData = typeof img === 'string' ? { url: img, title: '', alt: '' } : img;
                return (
                  <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-white">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={imgData.url}
                        onChange={(e) => updateCampusImage(index, 'url', e.target.value)}
                        placeholder="https://example.com/image.jpg or upload file"
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id={`campus-upload-${index}`}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleCampusImageUpload(file, index);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`campus-upload-${index}`}
                          className={`inline-flex items-center px-3 py-2 border rounded cursor-pointer ${
                            uploadingCampus[index] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {uploadingCampus[index] ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <FiUpload />
                          )}
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeCampusImage(index)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                        <input
                          type="text"
                          value={imgData.title || ''}
                          onChange={(e) => updateCampusImage(index, 'title', e.target.value)}
                          placeholder="e.g., 'Library Building' (Alt auto-generated)"
                          className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                        />
                        <p className="text-xs text-blue-600 mt-1">⚡ Enter title to auto-generate alt text with Admissionbuddy branding</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                        <input
                          type="text"
                          value={imgData.alt || ''}
                          onChange={(e) => updateCampusImage(index, 'alt', e.target.value)}
                          placeholder="Auto-generated from title"
                          className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Preview Grid */}
              {formData.campus_images.length > 0 && formData.campus_images.some(img => typeof img === 'string' ? img : img.url) && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Gallery Preview with Admissionbuddy Branding:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {formData.campus_images.filter(img => typeof img === 'string' ? img : img.url).map((img, index) => {
                      const imgData = typeof img === 'string' ? { url: img, title: '', alt: '' } : img;
                      return (
                        <div key={index} className="relative group bg-white border-2 border-gray-300 rounded overflow-hidden">
                          <img 
                            src={imgData.url} 
                            alt={imgData.alt || `Campus ${index + 1}`} 
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {imgData.title && (
                            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 font-semibold truncate">
                              {imgData.title}
                            </div>
                          )}
                          {imgData.alt && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                              {imgData.alt}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <Button type="button" onClick={addCampusImage} size="sm" className="mt-2">
                <FiPlus className="mr-2" /> Add Image Row
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🎥 Campus Video</label>
              <p className="text-xs text-gray-600 mb-2">📹 YouTube/Vimeo URL • Add title & description for accessibility</p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    name="campus_video_url"
                    value={formData.campus_video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="campus_video_title"
                    value={formData.campus_video_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., 'Campus Tour - IIT Mumbai'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and video player title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Description (Optional)</label>
                  <textarea
                    name="campus_video_description"
                    value={formData.campus_video_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of video content..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Institute Brochure */}
            <div>
              <label className="block text-sm font-medium mb-2">📄 Institute Brochure</label>
              <p className="text-xs text-gray-600 mb-2">📋 Accepted: PDF, DOC, DOCX • Max: 10MB • One brochure for entire institution</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="brochure_url"
                  value={formData.brochure_url}
                  onChange={handleChange}
                  placeholder="https://example.com/brochure.pdf or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="brochure-upload"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleBrochureUpload(file);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="brochure-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingBrochure ? 'bg-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {uploadingBrochure ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              {formData.brochure_url && (
                <div className="mt-2">
                  <a href={formData.brochure_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                    📄 View Brochure: {formData.brochure_url}
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌐 Virtual Tour</label>
              <p className="text-xs text-gray-600 mb-2">📹 360° tour URL • Add title & description for accessibility</p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Virtual Tour URL</label>
                  <input
                    type="url"
                    name="virtual_tour_url"
                    value={formData.virtual_tour_url}
                    onChange={handleChange}
                    placeholder="https://example.com/virtual-tour"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Tour Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="virtual_tour_title"
                    value={formData.virtual_tour_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., '360° Campus Virtual Tour - Admissionbuddy'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and tour embed title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Tour Description (Optional)</label>
                  <textarea
                    name="virtual_tour_description"
                    value={formData.virtual_tour_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of the virtual tour experience..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Media Section Save Button */}
          {id && (
            <div className="mt-4 pt-4 border-t flex justify-end">
              <SectionSaveButton 
                section="media"
                onSave={handleSectionSave}
                isSaving={sectionSaving.media}
                isSaved={sectionSaved.media}
              />
            </div>
          )}
        </CollapsibleSection>

        {/* Bottom Save Button (Duplicate for convenience) */}
        <div className="sticky bottom-0 bg-white border-t py-4 px-6 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${formData.status === 'published' ? 'bg-green-100 text-green-700' : formData.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {formData.status === 'published' ? '📢 Published' : formData.status === 'pending' ? '⏳ Pending Review' : '📝 Draft'}
            </span>
            {formData.name && <span className="text-gray-500">— {formData.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => window.location.href = '/admin/colleges'}>
              <FiX className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              disabled={saving}
              onClick={() => {
                setFormData(prev => ({...prev, status: 'draft'}));
                setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
              }}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <FiFileText className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            {canDirectPublish ? (
              <Button 
                type="button" 
                disabled={saving} 
                onClick={() => {
                  setFormData(prev => ({...prev, status: 'published'}));
                  setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiSave className="w-4 h-4 mr-2" />}
                {saving ? 'Publishing...' : 'Save & Publish'}
              </Button>
            ) : (
              <Button 
                type="button" 
                disabled={saving} 
                onClick={() => {
                  setFormData(prev => ({...prev, status: 'pending'}));
                  setTimeout(() => document.getElementById('institution-form').requestSubmit(), 100);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiSend className="w-4 h-4 mr-2" />}
                {saving ? 'Submitting...' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
