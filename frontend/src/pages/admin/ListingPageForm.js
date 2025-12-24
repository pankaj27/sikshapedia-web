import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiImage, FiVideo, FiGrid, FiList, FiMessageSquare, FiHelpCircle, FiMove, FiUpload, FiLink, FiBold, FiItalic, FiUnderline as FiUnderlineIcon, FiLoader, FiCheck, FiSend } from 'react-icons/fi';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentApprovalActions from '../../components/admin/ContentApprovalActions';
import StatusBadge from '../../components/admin/StatusBadge';

// Media Insert Modal (Image/Video with SEO)
const MediaInsertModal = ({ type, isOpen, onClose, onInsert, pageName }) => {
  const [url, setUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [position, setPosition] = useState('center');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleMediaTitleChange = (newTitle) => {
    setMediaTitle(newTitle);
    if (newTitle) {
      const page = pageName || 'Listing Page';
      setAltText(`${newTitle} - ${page} | AdmissionBuddy`);
      setSeoTitle(`${newTitle} - ${page} | AdmissionBuddy.co`);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=content', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const imageUrl = backendUrl + response.data.url;
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
    setUrl(''); setMediaTitle(''); setAltText(''); setSeoTitle(''); setPosition('center'); setUploadedUrl('');
    onClose();
  };

  const handleClose = () => {
    setUrl(''); setMediaTitle(''); setAltText(''); setSeoTitle(''); setPosition('center'); setUploadedUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className={`px-5 py-3 ${type === 'image' ? 'bg-purple-600' : 'bg-red-600'} text-white`}>
          <h3 className="text-base font-bold flex items-center gap-2">
            {type === 'image' ? '🖼️ Insert Image with SEO' : '🎬 Insert YouTube Video with SEO'}
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {type === 'image' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm ${
                  uploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}>
                  {uploading ? <><FiLoader className="animate-spin" size={16} /> Uploading...</> : <><FiUpload size={16} /> Upload Image</>}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]); }} />
                </label>
                {uploadedUrl && <span className="text-xs text-green-600 flex items-center gap-1"><FiCheck /> Uploaded!</span>}
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{type === 'image' ? '🔗 Image URL' : '🔗 YouTube URL'} *</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://www.youtube.com/watch?v=...'}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
            <label className="block text-sm font-bold text-yellow-800 mb-1">✏️ {type === 'image' ? 'Image' : 'Video'} Title <span className="text-red-500">*</span></label>
            <input type="text" value={mediaTitle} onChange={(e) => handleMediaTitleChange(e.target.value)}
              placeholder={type === 'image' ? 'e.g., Campus Building, Library' : 'e.g., Campus Tour, Student Life'}
              className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2 text-sm font-medium" />
            <p className="text-xs text-yellow-700 mt-1">💡 SEO Alt & Title auto-generated with AdmissionBuddy branding</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <label className="block text-xs font-bold text-blue-800 mb-2">📍 {type === 'image' ? 'Image' : 'Video'} Position</label>
            <div className="grid grid-cols-4 gap-2">
              {['left', 'center', 'right', 'full'].map(pos => (
                <button key={pos} type="button" onClick={() => setPosition(pos)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                    position === pos ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}>
                  {pos === 'left' ? '⬅️ Left' : pos === 'right' ? '➡️ Right' : pos === 'full' ? '↔️ Full' : '⬆️ Center'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-bold text-green-800 mb-2">🔍 SEO Tags <span className="text-green-600">(Auto-generated)</span></p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Alt Text</label>
                <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)}
                  className="w-full border border-green-300 bg-white rounded px-2 py-1.5 text-xs" placeholder="Auto-generated" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title Attribute</label>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full border border-green-300 bg-white rounded px-2 py-1.5 text-xs" placeholder="Auto-generated" />
              </div>
            </div>
          </div>
          {url && type === 'image' && (
            <div className="border border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Preview ({position}):</p>
              <div className={`flex ${position === 'left' ? 'justify-start' : position === 'right' ? 'justify-end' : 'justify-center'}`}>
                <img src={url} alt={altText || 'Preview'} className="max-h-20 max-w-full rounded object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t">
          <button type="button" onClick={handleClose} className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium">Cancel</button>
          <button type="button" onClick={handleInsert} disabled={!url}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white ${
              url ? (type === 'image' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700') : 'bg-gray-300 cursor-not-allowed'
            }`}>
            Insert {type === 'image' ? 'Image' : 'Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Rich Text Toolbar with all features
const RichTextToolbar = ({ editor, pageName, onOpenImageModal, onOpenVideoModal }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
      {/* Text Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`} title="Bold">
        <FiBold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`} title="Italic">
        <FiItalic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}`} title="Underline">
        <FiUnderlineIcon size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Colors */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 px-1">Color:</span>
        {['#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'].map(color => (
          <button key={color} type="button" onClick={() => editor.chain().focus().setColor(color).run()}
            className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }} title={color} />
        ))}
      </div>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`} title="Bullet List">
        <FiList size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`} title="Numbered List">
        <span className="text-xs font-bold">1.</span>
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Link, Image, Video */}
      <button type="button" onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`} title="Add Link">
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
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`} title="Heading">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`} title="Subheading">
        H3
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : ''}`} title="Paragraph">
        P
      </button>
    </div>
  );
};

// Full Rich Text Editor with Image/Video modals
const FullRichTextEditor = ({ value, onChange, placeholder, pageName }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full' } }),
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

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const handleImageInsert = ({ url, alt, title, position }) => {
    if (editor) {
      let alignStyle = position === 'left' ? 'float: left; margin-right: 1rem; max-width: 50%;' :
                       position === 'right' ? 'float: right; margin-left: 1rem; max-width: 50%;' :
                       position === 'full' ? 'display: block; width: 100%;' :
                       'display: block; margin: 0 auto; max-width: 80%;';
      const imgHtml = `<img src="${url}" alt="${alt || ''}" title="${title || ''}" style="${alignStyle} border-radius: 8px;" />`;
      editor.chain().focus().insertContent(imgHtml).run();
    }
  };

  const handleVideoInsert = ({ url, alt, title, position }) => {
    if (editor) {
      let wrapperStyle = position === 'left' ? 'float: left; margin-right: 1rem; max-width: 50%;' :
                         position === 'right' ? 'float: right; margin-left: 1rem; max-width: 50%;' :
                         position === 'full' ? 'width: 100%;' :
                         'margin: 0 auto; max-width: 80%;';
      let videoWidth = '100%';
      let videoHeight = position === 'full' ? '450' : '315';
      
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      
      if (videoId) {
        const videoHtml = `<div style="${wrapperStyle}"><iframe width="${videoWidth}" height="${videoHeight}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 8px; aspect-ratio: 16/9;"></iframe></div>`;
        editor.chain().focus().insertContent(videoHtml).run();
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
          pageName={pageName}
          onOpenImageModal={() => setImageModalOpen(true)}
          onOpenVideoModal={() => setVideoModalOpen(true)}
        />
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-3 min-h-[150px] focus:outline-none"
        />
      </div>
      
      <MediaInsertModal type="image" isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} onInsert={handleImageInsert} pageName={pageName} />
      <MediaInsertModal type="video" isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} onInsert={handleVideoInsert} pageName={pageName} />
    </>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-semibold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

const ListingPageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const fileInputRefs = useRef({});

  // Master location data
  const [masterStates, setMasterStates] = useState([]);
  const [masterCities, setMasterCities] = useState([]);
  
  // Master streams data
  const [masterStreams, setMasterStreams] = useState([]);

  const [formData, setFormData] = useState({
    url_slug: '',
    page_type: 'india',
    institution_type: 'colleges',
    state: '',
    city: '',
    stream: '',
    course: '',
    college_type: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    canonical_url: '',
    page_title: '',
    page_subtitle: '',
    introduction: '',
    content_sections: [], // [{title, content, type, media_url, media_alt, order}]
    tables: [], // [{title, headers, rows}]
    table_of_contents: [], // [{title, anchor}]
    seo_toc: [], // Advanced TOC with blocks [{title, anchor, blocks: [{type, content, ...}]}]
    faqs: [], // [{question, answer}]
    related_pages: [], // [{title, url}]
    widgets: {
      ask_question: { enabled: false, title: 'Have a Question?' },
      comments: { enabled: false, title: 'Comments' }
    },
    is_published: true,
    // Content Team Info
    created_by: '',
    created_by_name: '',
    created_by_email: '',
    updated_by: '',
    updated_by_name: '',
    created_at: '',
    updated_at: ''
  });

  // State for content image uploading
  const [uploadingContentImage, setUploadingContentImage] = useState({});
  
  // User role state for RBAC
  const [userRole, setUserRole] = useState(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const adminData = localStorage.getItem('adminUser');
      if (adminData) {
        return JSON.parse(adminData);
      }
      // Fallback to token-based info
      const token = localStorage.getItem('adminToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { id: payload.sub, name: payload.name || 'Admin', email: payload.email || '', role: payload.role || 'data_entry' };
      }
    } catch (e) {
      console.log('Could not get user info');
    }
    return { id: 'admin', name: 'Admin User', email: 'admin@admissionbuddy.co', role: 'data_entry' };
  };
  
  // Check if user can publish directly (super_admin or content_manager)
  const canPublish = userRole === 'super_admin' || userRole === 'content_manager';
  
  // Fetch user role on mount
  useEffect(() => {
    const user = getCurrentUser();
    setUserRole(user.role || 'data_entry');
  }, []);

  const pageTypes = [
    { value: 'india', label: 'India Page', example: 'colleges' },
    { value: 'state', label: 'State Page', example: 'colleges/maharashtra' },
    { value: 'city', label: 'City Page', example: 'colleges/mumbai' },
    { value: 'stream', label: 'Stream Page', example: 'colleges/engineering' },
    { value: 'course', label: 'Course Page', example: 'colleges/btech' },
    { value: 'state_stream', label: 'State + Stream', example: 'colleges/maharashtra/engineering' },
    { value: 'state_city', label: 'State + City', example: 'schools/maharashtra/mumbai' },
    { value: 'city_stream', label: 'City + Stream', example: 'colleges/mumbai/engineering' },
    { value: 'stream_course', label: 'Stream + Course', example: 'colleges/engineering/btech' },
    { value: 'state_stream_course', label: 'State + Stream + Course', example: 'colleges/maharashtra/engineering/btech' },
    { value: 'city_stream_course', label: 'City + Stream + Course', example: 'colleges/mumbai/engineering/btech' },
    { value: 'type', label: 'College Type Page', example: 'government-colleges' },
    { value: 'accreditation', label: 'Accreditation Page', example: 'naac-a-plus-colleges' }
  ];

  const indianStates = masterStates.length > 0 ? masterStates : [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  // Get cities for a specific state
  const getCitiesForState = (stateName) => {
    if (!stateName || masterCities.length === 0) return [];
    return masterCities
      .filter(c => c.state === stateName)
      .map(c => c.name)
      .sort();
  };

  const streams = masterStreams.length > 0 ? masterStreams : [
    'Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 
    'Commerce', 'Education', 'Pharmacy', 'Architecture', 'Design',
    'Agriculture', 'Nursing', 'Dental', 'Hotel Management'
  ];

  const collegeTypes = ['Government', 'Private', 'Deemed', 'Autonomous', 'Aided'];

  const contentTypes = [
    { value: 'text', label: 'Text Only', icon: <FiList /> },
    { value: 'text_image', label: 'Text + Image', icon: <FiImage /> },
    { value: 'text_video', label: 'Text + Video', icon: <FiVideo /> },
    { value: 'text_table', label: 'Text + Table', icon: <FiGrid /> }
  ];

  // Fetch master location data and streams
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, citiesRes, streamsRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities'),
          api.get('/streams')
        ]);
        const activeStates = (statesRes.data || [])
          .filter(s => s.status === 'active')
          .map(s => s.name)
          .sort();
        setMasterStates(activeStates);
        setMasterCities((citiesRes.data || []).filter(c => c.status === 'active'));
        
        // Set streams from API
        const activeStreams = (streamsRes.data || [])
          .filter(s => s.is_active !== false)
          .map(s => s.name)
          .sort();
        setMasterStreams(activeStreams);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listing-pages/${id}`);
      setFormData({ ...formData, ...response.data });
    } catch (error) {
      console.error('Error fetching page:', error);
      alert('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWidgetChange = (widget, field, value) => {
    setFormData(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widget]: { ...prev.widgets[widget], [field]: value }
      }
    }));
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const autoGenerateSlug = () => {
    let slug = '';
    const inst = formData.institution_type || 'colleges';
    
    switch (formData.page_type) {
      case 'india':
        slug = inst;
        break;
      case 'state':
        slug = formData.state ? `${inst}/${generateSlug(formData.state)}` : '';
        break;
      case 'city':
        slug = formData.city ? `${inst}/${generateSlug(formData.city)}` : '';
        break;
      case 'stream':
        slug = formData.stream ? `${inst}/${generateSlug(formData.stream)}` : '';
        break;
      case 'course':
        slug = formData.course ? `${inst}/${generateSlug(formData.course)}` : '';
        break;
      case 'state_stream':
        if (formData.state && formData.stream) {
          slug = `${inst}/${generateSlug(formData.state)}/${generateSlug(formData.stream)}`;
        }
        break;
      case 'state_city':
        if (formData.state && formData.city) {
          slug = `${inst}/${generateSlug(formData.state)}/${generateSlug(formData.city)}`;
        }
        break;
      case 'city_stream':
        if (formData.city && formData.stream) {
          slug = `${inst}/${generateSlug(formData.city)}/${generateSlug(formData.stream)}`;
        }
        break;
      case 'stream_course':
        if (formData.stream && formData.course) {
          slug = `${inst}/${generateSlug(formData.stream)}/${generateSlug(formData.course)}`;
        }
        break;
      case 'state_stream_course':
        if (formData.state && formData.stream && formData.course) {
          slug = `${inst}/${generateSlug(formData.state)}/${generateSlug(formData.stream)}/${generateSlug(formData.course)}`;
        }
        break;
      case 'city_stream_course':
        if (formData.city && formData.stream && formData.course) {
          slug = `${inst}/${generateSlug(formData.city)}/${generateSlug(formData.stream)}/${generateSlug(formData.course)}`;
        }
        break;
      case 'type':
        slug = formData.college_type ? `${generateSlug(formData.college_type)}-${inst}` : '';
        break;
      case 'accreditation':
        slug = formData.meta_title ? generateSlug(formData.meta_title.split(' ')[0]) + `-${inst}` : '';
        break;
      default:
        slug = '';
    }
    handleChange('url_slug', slug);
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    if (!formData.url_slug) {
      alert('URL Slug is required');
      return;
    }

    try {
      setSaving(true);
      const currentUser = getCurrentUser();
      
      const dataToSave = {
        ...formData,
        is_published: saveAsDraft ? false : formData.is_published,
        updated_by: currentUser.id,
        updated_by_name: currentUser.name
      };
      
      // Add created_by info for new pages
      if (!isEditing) {
        dataToSave.created_by = currentUser.id;
        dataToSave.created_by_name = currentUser.name;
        dataToSave.created_by_email = currentUser.email;
      }
      
      if (isEditing) {
        await api.put(`/listing-pages/${id}`, dataToSave);
      } else {
        await api.post('/listing-pages', dataToSave);
      }
      navigate('/admin/listing-pages');
    } catch (error) {
      console.error('Error saving page:', error);
      alert(error.response?.data?.detail || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    handleSubmit(e, true);
  };

  // Submit for review (for data_entry users who can't publish directly)
  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    if (!formData.url_slug) {
      alert('URL Slug is required');
      return;
    }

    try {
      setSaving(true);
      const currentUser = getCurrentUser();
      
      const dataToSave = {
        ...formData,
        is_published: false,
        status: 'pending', // Set status to pending for review
        updated_by: currentUser.id,
        updated_by_name: currentUser.name
      };
      
      // Add created_by info for new pages
      if (!isEditing) {
        dataToSave.created_by = currentUser.id;
        dataToSave.created_by_name = currentUser.name;
        dataToSave.created_by_email = currentUser.email;
      }
      
      if (isEditing) {
        await api.put(`/listing-pages/${id}`, dataToSave);
      } else {
        await api.post('/listing-pages', dataToSave);
      }
      alert('Content submitted for review successfully!');
      navigate('/admin/listing-pages');
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert(error.response?.data?.detail || 'Failed to submit for review');
    } finally {
      setSaving(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (sectionIndex, file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [sectionIndex]: true }));
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'content');
      
      const response = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data?.url) {
        updateContentSection(sectionIndex, 'media_url', response.data.url);
        // Auto-generate alt text if empty
        const section = formData.content_sections[sectionIndex];
        if (!section.media_alt) {
          const altText = `${section.title || 'Image'} - ${formData.page_title || formData.url_slug || 'Page'}`;
          updateContentSection(sectionIndex, 'media_alt', altText);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [sectionIndex]: false }));
    }
  };

  // Content Sections handlers
  const addContentSection = (type = 'text') => {
    setFormData(prev => ({
      ...prev,
      content_sections: [...prev.content_sections, { 
        title: '', 
        content: '', 
        type: type,
        media_url: '',
        media_alt: '',
        table_data: { headers: ['Column 1', 'Column 2'], rows: [['', '']] },
        order: prev.content_sections.length 
      }]
    }));
  };

  const updateContentSection = (index, field, value) => {
    const updated = [...formData.content_sections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const removeContentSection = (index) => {
    setFormData(prev => ({
      ...prev,
      content_sections: prev.content_sections.filter((_, i) => i !== index)
    }));
  };

  const moveContentSection = (index, direction) => {
    const updated = [...formData.content_sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  // Table handlers for content sections
  const addTableRow = (sectionIndex) => {
    const updated = [...formData.content_sections];
    const section = updated[sectionIndex];
    const colCount = section.table_data?.headers?.length || 2;
    section.table_data.rows.push(Array(colCount).fill(''));
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const addTableColumn = (sectionIndex) => {
    const updated = [...formData.content_sections];
    const section = updated[sectionIndex];
    section.table_data.headers.push(`Column ${section.table_data.headers.length + 1}`);
    section.table_data.rows = section.table_data.rows.map(row => [...row, '']);
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const updateTableHeader = (sectionIndex, colIndex, value) => {
    const updated = [...formData.content_sections];
    updated[sectionIndex].table_data.headers[colIndex] = value;
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const updateTableCell = (sectionIndex, rowIndex, colIndex, value) => {
    const updated = [...formData.content_sections];
    updated[sectionIndex].table_data.rows[rowIndex][colIndex] = value;
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  const removeTableRow = (sectionIndex, rowIndex) => {
    const updated = [...formData.content_sections];
    updated[sectionIndex].table_data.rows = updated[sectionIndex].table_data.rows.filter((_, i) => i !== rowIndex);
    setFormData(prev => ({ ...prev, content_sections: updated }));
  };

  // Table of Contents handlers (legacy simple TOC)
  const addTocItem = () => {
    setFormData(prev => ({
      ...prev,
      table_of_contents: [...prev.table_of_contents, { title: '', anchor: '' }]
    }));
  };

  const updateTocItem = (index, field, value) => {
    const updated = [...formData.table_of_contents];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'title') {
      updated[index].anchor = generateSlug(value);
    }
    setFormData(prev => ({ ...prev, table_of_contents: updated }));
  };

  const removeTocItem = (index) => {
    setFormData(prev => ({
      ...prev,
      table_of_contents: prev.table_of_contents.filter((_, i) => i !== index)
    }));
  };

  // Advanced TOC with Visual Block Editor - Image Upload Handler
  const handleContentImageUpload = async (file, tocIndex, blockIndex) => {
    const uploadKey = `${tocIndex}-${blockIndex}`;
    setUploadingContentImage(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=content', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const imageUrl = backendUrl + response.data.url;
        const newToc = [...(formData.seo_toc || [])];
        newToc[tocIndex].blocks[blockIndex].url = imageUrl;
        setFormData({...formData, seo_toc: newToc});
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingContentImage(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // FAQ handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Standalone Tables handlers
  const addTable = () => {
    setFormData(prev => ({
      ...prev,
      tables: [...prev.tables, { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]
    }));
  };

  const updateTable = (index, field, value) => {
    const updated = [...formData.tables];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, tables: updated }));
  };

  const removeTable = (index) => {
    setFormData(prev => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== index)
    }));
  };

  // Related Pages handlers
  const addRelatedPage = () => {
    setFormData(prev => ({
      ...prev,
      related_pages: [...prev.related_pages, { title: '', url: '' }]
    }));
  };

  const updateRelatedPage = (index, field, value) => {
    const updated = [...formData.related_pages];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, related_pages: updated }));
  };

  const removeRelatedPage = (index) => {
    setFormData(prev => ({
      ...prev,
      related_pages: prev.related_pages.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/listing-pages')}>
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit' : 'Add'} Listing Page Content</h1>
            <p className="text-gray-600 text-sm">Add SEO content, FAQs, tables, and widgets for listing pages</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Page Configuration */}
          {/* Content Team Info - Show only when editing */}
          {isEditing && (formData.created_by_name || formData.updated_by_name) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                👤 Content Team Info
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.created_by_name && (
                  <div>
                    <span className="text-gray-500">Created by:</span>
                    <p className="font-medium text-gray-800">{formData.created_by_name}</p>
                    {formData.created_by_email && <p className="text-xs text-gray-500">{formData.created_by_email}</p>}
                    {formData.created_at && <p className="text-xs text-gray-400">on {new Date(formData.created_at).toLocaleString()}</p>}
                  </div>
                )}
                {formData.updated_by_name && (
                  <div>
                    <span className="text-gray-500">Last updated by:</span>
                    <p className="font-medium text-gray-800">{formData.updated_by_name}</p>
                    {formData.updated_at && <p className="text-xs text-gray-400">on {new Date(formData.updated_at).toLocaleString()}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Status & Actions - Show only when editing */}
          {isEditing && (
            <div className="mb-4">
              <ContentApprovalActions
                contentType="listing_page"
                contentId={id}
                currentStatus={formData.status || 'draft'}
                rejectionReason={formData.rejection_reason}
                onStatusChange={(newStatus) => setFormData(prev => ({...prev, status: newStatus}))}
              />
            </div>
          )}

          <CollapsibleSection title="Page Configuration" icon="⚙️" defaultOpen={true}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Type *</label>
                <select
                  value={formData.page_type}
                  onChange={(e) => handleChange('page_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {pageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} (e.g., /{type.example})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution Type *</label>
                <select
                  value={formData.institution_type}
                  onChange={(e) => handleChange('institution_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="colleges">Colleges</option>
                  <option value="schools">Schools</option>
                  <option value="universities">Universities</option>
                </select>
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.page_type === 'state' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.page_type === 'city' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select State (Optional)</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City Name *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter city name (e.g., Mumbai)"
                  />
                </div>
              </div>
            )}

            {formData.page_type === 'stream' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Stream *</label>
                <select
                  value={formData.stream}
                  onChange={(e) => handleChange('stream', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.page_type === 'course' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Course Name *</label>
                <Input
                  value={formData.course}
                  onChange={(e) => handleChange('course', e.target.value)}
                  placeholder="Enter course name (e.g., B.Tech, MBA)"
                />
              </div>
            )}

            {formData.page_type === 'type' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">College Type *</label>
                <select
                  value={formData.college_type}
                  onChange={(e) => handleChange('college_type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  {collegeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {/* State + Stream */}
            {formData.page_type === 'state_stream' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleChange('stream', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* State + City */}
            {formData.page_type === 'state_city' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City Name *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter city name"
                  />
                </div>
              </div>
            )}

            {/* City + Stream */}
            {formData.page_type === 'city_stream' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City Name *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter city name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleChange('stream', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Stream + Course */}
            {formData.page_type === 'stream_course' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleChange('stream', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name *</label>
                  <Input
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    placeholder="Enter course name (e.g., B.Tech)"
                  />
                </div>
              </div>
            )}

            {/* State + Stream + Course */}
            {formData.page_type === 'state_stream_course' && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleChange('stream', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name *</label>
                  <Input
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    placeholder="e.g., B.Tech"
                  />
                </div>
              </div>
            )}

            {/* City + Stream + Course */}
            {formData.page_type === 'city_stream_course' && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City Name *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter city name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleChange('stream', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name *</label>
                  <Input
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    placeholder="e.g., B.Tech"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">URL Slug *</label>
              <div className="flex gap-2">
                <Input
                  value={formData.url_slug}
                  onChange={(e) => handleChange('url_slug', e.target.value)}
                  placeholder="e.g., maharashtra-colleges or maharashtra/mumbai-colleges"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={autoGenerateSlug}>
                  Auto Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">URL will be: /{formData.url_slug || 'your-slug'}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => handleChange('is_published', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="is_published" className="text-sm">Publish this page</label>
            </div>
          </CollapsibleSection>

          {/* SEO Meta Tags */}
          <CollapsibleSection title="SEO Meta Tags" icon="🏷️" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="SEO title for this page"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_title?.length || 0}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  placeholder="SEO description for this page"
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_description?.length || 0}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Canonical URL</label>
                <Input
                  value={formData.canonical_url}
                  onChange={(e) => handleChange('canonical_url', e.target.value)}
                  placeholder="https://yoursite.com/page-url"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Page Content */}
          <CollapsibleSection title="Page Content (Title & Introduction)" icon="📝" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Title (H1)</label>
                <Input
                  value={formData.page_title}
                  onChange={(e) => handleChange('page_title', e.target.value)}
                  placeholder="e.g., Top Colleges in Maharashtra 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Page Subtitle</label>
                <Input
                  value={formData.page_subtitle}
                  onChange={(e) => handleChange('page_subtitle', e.target.value)}
                  placeholder="e.g., Find the best colleges with placements, rankings & more"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Introduction</label>
                <FullRichTextEditor
                  value={formData.introduction}
                  onChange={(value) => handleChange('introduction', value)}
                  placeholder="Write an introduction paragraph with formatting..."
                  pageName={formData.page_title || 'Listing Page'}
                />
                <p className="text-xs text-gray-500 mt-1">Use the toolbar for formatting: Bold, Italic, Lists, Links, Images, Videos, Headings</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Table of Contents */}
          <CollapsibleSection title="Table of Contents + Content Sections" icon="📑" defaultOpen={false}>
            {/* Advanced Visual Block Editor TOC - Copied from CollegeForm */}
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
                            placeholder="e.g., About, Admission Process"
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
                            placeholder="about-section"
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
                              imageTitle: '',
                              alt: '',
                              title: '',
                              caption: '', width: '100%'
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                            🖼️ Image
                          </button>
                          
                          {/* Add Table Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const pageName = formData.page_title || 'Listing Page';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'table', 
                              title: `${pageName} ${sectionTitle} Details - AdmissionBuddy`, 
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
                              videoTitle: '',
                              title: '',
                              description: ''
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                            🎬 Video
                          </button>
                          
                          {/* Add List Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const pageName = formData.page_title || 'Listing Page';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'list', 
                              title: `${pageName} ${sectionTitle} - AdmissionBuddy`, 
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
                                'border-gray-200'
                              }`}>
                                {/* Block Header */}
                                <div className={`px-4 py-2 flex items-center justify-between ${
                                  block.type === 'text' ? 'bg-blue-100' :
                                  block.type === 'image' ? 'bg-purple-100' :
                                  block.type === 'table' ? 'bg-teal-100' :
                                  block.type === 'video' ? 'bg-red-100' :
                                  'bg-gray-100'
                                }`}>
                                  <span className="font-bold text-sm flex items-center gap-2">
                                    {block.type === 'text' && '📝 Text Block'}
                                    {block.type === 'image' && '🖼️ Image Block'}
                                    {block.type === 'table' && '📊 Table Block'}
                                    {block.type === 'video' && '🎬 Video Block'}
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
                                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                                        <p className="text-sm font-bold text-purple-800 mb-3">📤 Upload Image</p>
                                        <div className="flex flex-wrap gap-3 items-center">
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
                                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                          <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Image Title <span className="text-red-500">*</span></label>
                                          <input type="text" value={block.imageTitle || ''} onChange={(e) => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            const imageTitle = e.target.value;
                                            const pageName = formData.page_title || 'Listing Page';
                                            newToc[index].blocks[blockIndex].imageTitle = imageTitle;
                                            if (imageTitle) {
                                              newToc[index].blocks[blockIndex].alt = `${imageTitle} - ${pageName} | AdmissionBuddy`;
                                              newToc[index].blocks[blockIndex].title = `${imageTitle} - ${pageName} | AdmissionBuddy.co`;
                                            }
                                            setFormData({...formData, seo_toc: newToc});
                                          }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Campus Building, Library" />
                                          <p className="text-xs text-yellow-700 mt-2">💡 Enter image title - SEO Alt & Title will be auto-generated</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">🔍 Alt Text (SEO)</label>
                                            <input type="text" value={block.alt || ''} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].alt = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="w-full border-2 border-green-200 bg-green-50 rounded-lg px-3 py-2 text-sm" placeholder="Auto-generated" />
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
                                      
                                      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                        <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Video Title <span className="text-red-500">*</span></label>
                                        <input type="text" value={block.videoTitle || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          const videoTitle = e.target.value;
                                          const pageName = formData.page_title || 'Listing Page';
                                          newToc[index].blocks[blockIndex].videoTitle = videoTitle;
                                          if (videoTitle) {
                                            newToc[index].blocks[blockIndex].title = `${videoTitle} - ${pageName} | AdmissionBuddy`;
                                            newToc[index].blocks[blockIndex].description = `Watch ${videoTitle.toLowerCase()}. Get complete information at AdmissionBuddy.co`;
                                          }
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Campus Tour, Student Life" />
                                        <p className="text-xs text-yellow-700 mt-2">💡 Enter video title - SEO fields will be auto-generated</p>
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
                                            }} className="flex-1 border-2 rounded-lg px-3 py-2 text-sm" placeholder="List item..." />
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

              {/* Add New Section Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_toc: [...(formData.seo_toc || []), { 
                      title: '', 
                      anchor: '',
                      blocks: []
                    }]
                  });
                }}
                className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 font-medium hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
              >
                <FiPlus size={18} />
                Add New TOC Section
              </button>
            </div>
          </CollapsibleSection>

          {/* Content Sections with Media */}
          <CollapsibleSection title="Content Sections (Text, Image, Video, Table)" icon="📄" defaultOpen={false}>
            <p className="text-sm text-gray-600 mb-4">Add rich content sections with text, images, videos, or tables</p>
            
            {formData.content_sections.map((section, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Section {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => moveContentSection(index, 'up')} disabled={index === 0}>
                      ↑
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => moveContentSection(index, 'down')} disabled={index === formData.content_sections.length - 1}>
                      ↓
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeContentSection(index)} className="text-red-600">
                      <FiTrash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Section Title</label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                      placeholder="Section heading"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Content Type</label>
                    <select
                      value={section.type}
                      onChange={(e) => updateContentSection(index, 'type', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      {contentTypes.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Content (HTML supported)</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                    placeholder="Section content..."
                    className="w-full border rounded px-3 py-2 font-mono text-sm"
                    rows={4}
                  />
                </div>

                {/* Image/Video URL */}
                {(section.type === 'text_image' || section.type === 'text_video') && (
                  <div className="bg-white border rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left: Media URL / Upload */}
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          {section.type === 'text_image' ? 'Image' : 'Video URL (YouTube/Embed)'}
                        </label>
                        
                        {section.type === 'text_image' ? (
                          <>
                            {/* Upload or URL toggle */}
                            <div className="flex gap-2 mb-2">
                              <input
                                type="file"
                                accept="image/*"
                                ref={el => fileInputRefs.current[index] = el}
                                className="hidden"
                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={uploading[index]}
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="flex-1"
                              >
                                <FiUpload className="mr-1" />
                                {uploading[index] ? 'Uploading...' : 'Upload Image'}
                              </Button>
                              <span className="text-xs text-gray-400 flex items-center">or</span>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={section.media_url}
                                onChange={(e) => updateContentSection(index, 'media_url', e.target.value)}
                                placeholder="Paste image URL"
                                className="flex-1"
                              />
                              <Button type="button" variant="outline" size="sm" title="Paste URL">
                                <FiLink size={14} />
                              </Button>
                            </div>
                            {/* Image Preview */}
                            {section.media_url && (
                              <div className="mt-2 relative">
                                <img 
                                  src={section.media_url.startsWith('/') ? `${process.env.REACT_APP_BACKEND_URL}${section.media_url}` : section.media_url} 
                                  alt={section.media_alt || 'Preview'} 
                                  className="w-full h-32 object-cover rounded border"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                                <button
                                  type="button"
                                  onClick={() => updateContentSection(index, 'media_url', '')}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <Input
                            value={section.media_url}
                            onChange={(e) => updateContentSection(index, 'media_url', e.target.value)}
                            placeholder="https://youtube.com/embed/VIDEO_ID or embed URL"
                          />
                        )}
                      </div>

                      {/* Right: Alt Text */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Alt Text / Caption</label>
                        <div className="flex gap-2">
                          <Input
                            value={section.media_alt}
                            onChange={(e) => updateContentSection(index, 'media_alt', e.target.value)}
                            placeholder="Description for SEO"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const mediaType = section.type === 'text_image' ? 'Image' : 'Video';
                              const sectionTitle = section.title || 'Content';
                              const pageTitle = formData.page_title || formData.url_slug || 'Page';
                              const altText = `${sectionTitle} - ${pageTitle} | ${mediaType}`;
                              updateContentSection(index, 'media_alt', altText);
                            }}
                            title="Auto-generate alt text"
                          >
                            Auto
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {section.type === 'text_image' ? 'SEO: Describe the image content' : 'Caption shown below video'}
                        </p>
                        
                        {/* Video Preview */}
                        {section.type === 'text_video' && section.media_url && (
                          <div className="mt-2">
                            <iframe
                              src={section.media_url}
                              title={section.media_alt || 'Video preview'}
                              className="w-full h-32 rounded border"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table Editor */}
                {section.type === 'text_table' && (
                  <div className="mt-3 bg-white p-3 rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Table Data</span>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => addTableColumn(index)}>
                          + Column
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => addTableRow(index)}>
                          + Row
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            {section.table_data?.headers?.map((header, colIndex) => (
                              <th key={colIndex} className="border p-1">
                                <Input
                                  value={header}
                                  onChange={(e) => updateTableHeader(index, colIndex, e.target.value)}
                                  className="text-xs"
                                  placeholder="Header"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table_data?.rows?.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border p-1">
                                  <Input
                                    value={cell}
                                    onChange={(e) => updateTableCell(index, rowIndex, colIndex, e.target.value)}
                                    className="text-xs"
                                    placeholder="Cell"
                                  />
                                </td>
                              ))}
                              <td className="border p-1 w-10">
                                <Button type="button" size="sm" variant="outline" onClick={() => removeTableRow(index, rowIndex)} className="text-red-600">
                                  ×
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <Button type="button" onClick={() => addContentSection('text')} size="sm" variant="outline">
                <FiPlus className="mr-1" /> Text Section
              </Button>
              <Button type="button" onClick={() => addContentSection('text_image')} size="sm" variant="outline">
                <FiImage className="mr-1" /> With Image
              </Button>
              <Button type="button" onClick={() => addContentSection('text_video')} size="sm" variant="outline">
                <FiVideo className="mr-1" /> With Video
              </Button>
              <Button type="button" onClick={() => addContentSection('text_table')} size="sm" variant="outline">
                <FiGrid className="mr-1" /> With Table
              </Button>
            </div>
          </CollapsibleSection>

          {/* FAQs */}
          <CollapsibleSection title="FAQs" icon="❓" defaultOpen={false}>
            {formData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">FAQ {index + 1}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeFaq(index)}>
                    <FiTrash2 size={14} />
                  </Button>
                </div>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  placeholder="Question"
                  className="mb-2"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  placeholder="Answer (HTML supported)"
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            ))}
            <Button type="button" onClick={addFaq} size="sm">
              <FiPlus className="mr-2" /> Add FAQ
            </Button>
          </CollapsibleSection>

          {/* Widgets */}
          <CollapsibleSection title="Widgets" icon="🧩" defaultOpen={false}>
            <div className="space-y-4">
              {/* Ask a Question Widget */}
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="ask_question_enabled"
                    checked={formData.widgets?.ask_question?.enabled || false}
                    onChange={(e) => handleWidgetChange('ask_question', 'enabled', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="ask_question_enabled" className="font-medium flex items-center gap-2">
                    <FiHelpCircle /> Ask a Question Widget
                  </label>
                </div>
                {formData.widgets?.ask_question?.enabled && (
                  <Input
                    value={formData.widgets?.ask_question?.title || ''}
                    onChange={(e) => handleWidgetChange('ask_question', 'title', e.target.value)}
                    placeholder="Widget title (e.g., Have a Question?)"
                  />
                )}
              </div>

              {/* Comments Widget */}
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="comments_enabled"
                    checked={formData.widgets?.comments?.enabled || false}
                    onChange={(e) => handleWidgetChange('comments', 'enabled', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="comments_enabled" className="font-medium flex items-center gap-2">
                    <FiMessageSquare /> Comments Widget
                  </label>
                </div>
                {formData.widgets?.comments?.enabled && (
                  <Input
                    value={formData.widgets?.comments?.title || ''}
                    onChange={(e) => handleWidgetChange('comments', 'title', e.target.value)}
                    placeholder="Widget title (e.g., Comments)"
                  />
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Related Pages */}
          <CollapsibleSection title="Related Pages (Internal Links)" icon="🔗" defaultOpen={false}>
            {formData.related_pages.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={link.title}
                  onChange={(e) => updateRelatedPage(index, 'title', e.target.value)}
                  placeholder="Link Title"
                  className="flex-1"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateRelatedPage(index, 'url', e.target.value)}
                  placeholder="/url-slug"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => removeRelatedPage(index)}>
                  <FiTrash2 size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addRelatedPage} size="sm">
              <FiPlus className="mr-2" /> Add Related Page
            </Button>
          </CollapsibleSection>

          {/* Submit - Role-based buttons */}
          <div className="flex justify-between items-center mt-6 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {canPublish ? (
                formData.is_published ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Will be Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Draft
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1 text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Submit for Review (requires approval)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/listing-pages')}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                disabled={saving}
                onClick={handleSaveDraft}
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                <FiSave className="mr-2" />
                Save as Draft
              </Button>
              {/* Show different buttons based on user role */}
              {canPublish ? (
                <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                  <FiSave className="mr-2" />
                  {saving ? 'Saving...' : (isEditing ? 'Update & Publish' : 'Create & Publish')}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  disabled={saving}
                  onClick={handleSubmitForReview}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FiSend className="mr-2" />
                  {saving ? 'Submitting...' : 'Submit for Review'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ListingPageForm;
