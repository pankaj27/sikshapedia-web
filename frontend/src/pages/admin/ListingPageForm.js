import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiImage, FiVideo, FiGrid, FiList, FiMessageSquare, FiHelpCircle, FiMove, FiUpload, FiLink, FiBold, FiItalic, FiUnderline as FiUnderlineIcon } from 'react-icons/fi';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentApprovalActions from '../../components/admin/ContentApprovalActions';
import StatusBadge from '../../components/admin/StatusBadge';

// Simple Rich Text Toolbar
const SimpleRichTextToolbar = ({ editor }) => {
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
          <button key={color} type="button" onClick={() => editor.chain().focus().setColor(color).run()}
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
      
      {/* Link */}
      <button type="button" onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Add Link">
        <FiLink size={16} />
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
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-xs ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Paragraph">
        P
      </button>
    </div>
  );
};

// Simple Rich Text Editor Component
const SimpleRichTextEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <SimpleRichTextToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-3 min-h-[150px] focus:outline-none"
      />
    </div>
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
        return { id: payload.sub, name: payload.name || 'Admin', email: payload.email || '' };
      }
    } catch (e) {
      console.log('Could not get user info');
    }
    return { id: 'admin', name: 'Admin User', email: 'admin@admissionbuddy.co' };
  };

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

  // Table of Contents handlers
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
                <label className="block text-sm font-medium mb-1">Introduction (HTML supported)</label>
                <textarea
                  value={formData.introduction}
                  onChange={(e) => handleChange('introduction', e.target.value)}
                  placeholder="Write an introduction paragraph... Use <strong>, <a href>, <ul>, <li> for formatting"
                  className="w-full border rounded px-3 py-2 font-mono text-sm"
                  rows={6}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Table of Contents */}
          <CollapsibleSection title="Table of Contents" icon="📑" defaultOpen={false}>
            <p className="text-sm text-gray-600 mb-4">Add navigation links that will appear as a sticky table of contents</p>
            {formData.table_of_contents.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={item.title}
                  onChange={(e) => updateTocItem(index, 'title', e.target.value)}
                  placeholder="Section Title"
                  className="flex-1"
                />
                <Input
                  value={item.anchor}
                  onChange={(e) => updateTocItem(index, 'anchor', e.target.value)}
                  placeholder="anchor-link"
                  className="w-40"
                />
                <Button type="button" variant="outline" onClick={() => removeTocItem(index)}>
                  <FiTrash2 size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addTocItem} size="sm">
              <FiPlus className="mr-2" /> Add TOC Item
            </Button>
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

          {/* Submit */}
          <div className="flex justify-between items-center mt-6 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {formData.is_published ? (
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Will be Published
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Draft
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
              <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                <FiSave className="mr-2" />
                {saving ? 'Saving...' : (isEditing ? 'Update & Publish' : 'Create & Publish')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ListingPageForm;
