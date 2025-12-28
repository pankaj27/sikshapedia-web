import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { FiSave, FiX, FiPlus, FiTrash2, FiSend, FiCheck, FiChevronDown, FiChevronRight, FiChevronUp, FiBook, FiInfo, FiFileText, FiDollarSign, FiBriefcase, FiAward, FiUsers, FiMapPin, FiMail, FiHelpCircle, FiBookmark, FiHome, FiBarChart2, FiImage, FiCalendar, FiMessageSquare, FiVideo, FiUpload, FiLoader, FiBold, FiItalic, FiUnderline as FiUnderlineIcon, FiLink, FiList } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { SeoMetaSection } from '../../components/admin/college-form';
import { CourseMenuConfigSection } from '../../components/admin/course-form';
import useAutoSaveDraft from '../../hooks/useAutoSaveDraft';
import DraftRestoreBanner, { AutoSaveIndicator } from '../../components/admin/DraftRestoreBanner';

// Simple Rich Text Toolbar for Short Description
const SimpleRichTextToolbar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
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
        {['#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
          <button key={color} type="button" onClick={() => setColor(color)}
            className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }} title={color} />
        ))}
      </div>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Link */}
      <button type="button" onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Add Link">
        <FiLink size={16} />
      </button>
      {editor.isActive('link') && (
        <button type="button" onClick={removeLink}
          className="p-2 rounded hover:bg-gray-200 bg-red-50 text-red-600"
          title="Remove Link">
          <FiX size={16} />
        </button>
      )}
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Bullet List">
        <FiList size={16} />
      </button>
    </div>
  );
};

// Simple Rich Text Editor Component for Short Description
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
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
      <SimpleRichTextToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-3 min-h-[100px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[80px]"
      />
    </div>
  );
};

// Menu icon options
const menuIconOptions = [
  { id: 'info', label: 'Info', icon: <FiInfo size={16} /> },
  { id: 'overview', label: 'Overview', icon: <FiHome size={16} /> },
  { id: 'syllabus', label: 'Syllabus', icon: <FiBook size={16} /> },
  { id: 'eligibility', label: 'Eligibility', icon: <FiFileText size={16} /> },
  { id: 'admission', label: 'Admission', icon: <HiOutlineAcademicCap size={16} /> },
  { id: 'fees', label: 'Fees', icon: <FiDollarSign size={16} /> },
  { id: 'career', label: 'Career', icon: <FiBriefcase size={16} /> },
  { id: 'colleges', label: 'Colleges', icon: <HiOutlineLibrary size={16} /> },
  { id: 'salary', label: 'Salary', icon: <HiOutlineCurrencyRupee size={16} /> },
  { id: 'comparison', label: 'Comparison', icon: <FiBarChart2 size={16} /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <FiMessageSquare size={16} /> },
  { id: 'default', label: 'Default', icon: <FiBookmark size={16} /> },
];

const getMenuIconById = (iconId) => {
  const found = menuIconOptions.find(opt => opt.id === iconId);
  return found ? found.icon : <FiBookmark size={16} />;
};

// Brand name constant
const BRAND_NAME = 'admissionbuddy';

// Auto-generate alt tag based on context with admissionbuddy branding
const generateAltTag = (courseName, context, index) => {
  const name = courseName || 'Course';
  const ctx = context || 'content';
  return `${name} - ${ctx} ${index + 1} | ${BRAND_NAME}`.trim();
};

// Auto-generate video alt tag with admissionbuddy branding
const generateVideoAlt = (courseName, context, index) => {
  const name = courseName || 'Course';
  const ctx = context || 'video';
  return `${name} - ${ctx} video ${index + 1} | ${BRAND_NAME}`.trim();
};

// Auto-generate alt tag from caption/title with admissionbuddy branding
const generateAltFromCaption = (courseName, caption) => {
  const name = courseName || 'Course';
  return caption ? `${name} - ${caption} | ${BRAND_NAME}` : '';
};

// Auto-generate SEO Meta Tags with admissionbuddy branding
const generateSeoMetaTags = (courseData) => {
  const name = courseData.name || 'Course';
  const fullName = courseData.full_name || name;
  const degreeType = courseData.degree_type || '';
  const duration = courseData.duration || '';
  const eligibility = courseData.eligibility || '';
  const stream = courseData.stream || '';
  
  // Generate Meta Title with branding (max 60 chars)
  const metaTitle = `${name} Course ${new Date().getFullYear()} - Fees, Eligibility | ${BRAND_NAME}`.substring(0, 60);
  
  // Generate Meta Description with branding (max 160 chars)
  const metaDesc = `${fullName} (${name}) is a ${degreeType} course${duration ? ` of ${duration}` : ''}. Check eligibility, fees, syllabus, admission process & top colleges on ${BRAND_NAME}.`.substring(0, 160);
  
  // Generate Meta Keywords with branding
  const keywords = [
    name.toLowerCase(),
    fullName.toLowerCase(),
    `${name.toLowerCase()} course`,
    `${name.toLowerCase()} eligibility`,
    `${name.toLowerCase()} fees`,
    `${name.toLowerCase()} syllabus`,
    `${name.toLowerCase()} admission`,
    `${name.toLowerCase()} colleges`,
    `${name.toLowerCase()} career`,
    stream ? stream.toLowerCase() : '',
    degreeType ? `${degreeType.toLowerCase()} courses` : '',
    `${name.toLowerCase()} ${new Date().getFullYear()}`,
    'admissionbuddy',
    `${name.toLowerCase()} admissionbuddy`
  ].filter(Boolean).join(', ');
  
  return { metaTitle, metaDesc, keywords };
};

// Collapsible Section Component
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
          {badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{badge}</span>}
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

const CourseDetailForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [subStreams, setSubStreams] = useState([]);
  const [exams, setExams] = useState([]);
  const [coursesList, setCoursesList] = useState([]); // List of courses from Quick Entry
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // 'saving', 'saved', 'error', ''
  const [lastAutoSave, setLastAutoSave] = useState(null);
  const autoSaveTimerRef = useRef(null);
  const [collegeCount, setCollegeCount] = useState(0);
  const [loadingCollegeCount, setLoadingCollegeCount] = useState(false);

  // Get admin user from localStorage (admin login stores in adminUser)
  const adminUserStr = localStorage.getItem('adminUser');
  const adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;
  const user = adminUser || authUser;

  // Role checks
  const isDataEntry = user?.role === 'data_entry';
  const canApprove = user?.role === 'super_admin' || user?.role === 'content_manager' || user?.role === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    full_name: '',
    degree_type: 'UG',
    duration: '',
    eligibility_level: 'after-12th', // after-10th, after-12th, after-graduation, professional
    course_mode: 'Full Time', // Full Time, Part Time, Distance, Online
    stream_id: '',
    sub_stream_ids: [],
    exam_ids: [],
    description: '',
    description_toc: [], // [{title, anchor, content, image, video}]
    description_tables: [], // [{title, headers: [], rows: [[]]}]
    description_images: [], // [{url, caption, alt}]
    description_videos: [], // [{url, title, alt}]
    overview: '',
    eligibility: '',
    admission_process: '',
    selection_criteria: '',
    career_prospects: '',
    average_fees: 0,
    salary_range: { min: 0, max: 0 },
    course_syllabus: [],
    syllabus: [], // [{semester, subjects: []}]
    highlights: [], // Course badges/highlights
    related_courses: [], // Related course names
    top_colleges: [], // [{name, location, rating, fees, rank}]
    age_limit: '', // Age limit text
    subjects: [],
    skills_acquired: [],
    job_opportunities: [],
    popular_specializations: [],
    is_popular: false,
    total_colleges_offering: 0,
    status: 'draft',
    base_course_id: '', // Reference to the course from Quick Entry
    // SEO Fields
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    seo_intro: '',
    seo_full_content: '',
    seo_toc: [], // Table of Contents [{title, anchor, content, image, video}]
    seo_tables: [], // [{title, headers: [], rows: [[]]}]
    seo_images: [], // [{url, caption, alt}]
    seo_videos: [], // [{url, title, alt}]
    // Menu Configuration
    menu_config: {
      use_custom_menu: false,
      auto_from_toc: false,
      items: []
    },
    // Page Widgets Configuration
    widgets_config: {
      apply_now: {
        enabled: true,
        title: 'Apply Now',
        subtitle: 'Start your admission journey',
        button_text: 'Submit Application',
        position: 'sidebar' // sidebar, floating, inline
      },
      ask_question: {
        enabled: true,
        title: 'Have Questions?',
        subtitle: 'Our experts are here to help',
        button_text: 'Ask Now',
        position: 'sidebar'
      },
      counselling: {
        enabled: true,
        title: 'Need Counselling?',
        subtitle: 'Get free career guidance',
        button_text: 'Request Callback',
        position: 'sidebar'
      },
      sponsor_ad: {
        enabled: false,
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        sponsor_name: '',
        position: 'sidebar'
      }
    }
  });

  const [uploadingImage, setUploadingImage] = useState(null); // Track which TOC index is uploading image
  const [uploadingVideo, setUploadingVideo] = useState(null); // Track which TOC index is uploading video
  const [uploadingSeoImage, setUploadingSeoImage] = useState(false);
  const [uploadingSeoVideo, setUploadingSeoVideo] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState({}); // Track content block image uploads

  useEffect(() => {
    fetchDropdownData();
    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Auto-save to draft every 30 seconds when there are changes
  useEffect(() => {
    // Only auto-save if we have a course selected and form has content
    if (!formData.name || !formData.base_course_id) return;
    
    // Clear previous timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer for auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving');
        const dataToSave = {
          ...formData,
          status: 'draft'
        };
        
        if (id) {
          await api.put(`/courses/${id}`, dataToSave);
        } else {
          // For new courses, create as draft
          const response = await api.post('/courses', dataToSave);
          // Update URL to include the new ID (optional - can navigate)
        }
        
        setAutoSaveStatus('saved');
        setLastAutoSave(new Date());
        
        // Clear status after 3 seconds
        setTimeout(() => setAutoSaveStatus(''), 3000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(''), 5000);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, id]);

  // Handle image upload for TOC section
  const handleTocImageUpload = async (file, tocIndex) => {
    if (!file) return;
    setUploadingImage(tocIndex);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newToc = [...(formData.seo_toc || [])];
      newToc[tocIndex].image = response.data.url;
      setFormData({ ...formData, seo_toc: newToc });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  // Handle video upload for TOC section
  const handleTocVideoUpload = async (file, tocIndex) => {
    if (!file) return;
    setUploadingVideo(tocIndex);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newToc = [...(formData.seo_toc || [])];
      newToc[tocIndex].video = response.data.url;
      setFormData({ ...formData, seo_toc: newToc });
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingVideo(null);
    }
  };

  // Handle content block image upload
  const handleContentImageUpload = async (file, tocIndex, blockIndex) => {
    if (!file) return;
    const uploadKey = `${tocIndex}-${blockIndex}`;
    setUploadingContentImage(prev => ({ ...prev, [uploadKey]: true }));
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newToc = [...(formData.description_toc || [])];
      newToc[tocIndex].blocks[blockIndex].url = response.data.url;
      // Auto-generate SEO fields
      const courseName = formData.name || 'Course';
      const imageTitle = newToc[tocIndex].blocks[blockIndex].imageTitle || 'Image';
      newToc[tocIndex].blocks[blockIndex].alt = `${imageTitle} - ${courseName} | AdmissionBuddy`;
      newToc[tocIndex].blocks[blockIndex].title = `${imageTitle} - ${courseName} | AdmissionBuddy.co`;
      setFormData({ ...formData, description_toc: newToc });
    } catch (error) {
      console.error('Error uploading content image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingContentImage(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle SEO content image upload
  const handleSeoImageUpload = async (file) => {
    if (!file) return;
    setUploadingSeoImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ 
        ...formData, 
        seo_images: [...(formData.seo_images || []), { url: response.data.url, caption: '' }]
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingSeoImage(false);
    }
  };

  // Handle SEO content video upload
  const handleSeoVideoUpload = async (file) => {
    if (!file) return;
    setUploadingSeoVideo(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ 
        ...formData, 
        seo_videos: [...(formData.seo_videos || []), { url: response.data.url, title: '' }]
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingSeoVideo(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [streamsRes, subStreamsRes, examsRes, coursesRes] = await Promise.all([
        api.get('/streams'),
        api.get('/sub-streams'),
        api.get('/exams'),
        api.get('/courses?limit=500') // Fetch all courses from Quick Entry
      ]);
      setStreams(streamsRes.data);
      setSubStreams(subStreamsRes.data);
      setExams(examsRes.data);
      setCoursesList(coursesRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Handle course selection from dropdown
  const handleCourseSelect = (e) => {
    const selectedCourseId = e.target.value;
    if (!selectedCourseId) {
      // Reset to empty if no course selected
      setFormData({
        ...formData,
        name: '',
        slug: '',
        full_name: '',
        degree_type: 'UG',
        duration: '',
        eligibility: '',
        base_course_id: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
      });
      return;
    }
    
    const selectedCourse = coursesList.find(c => c.id === selectedCourseId);
    if (selectedCourse) {
      setFormData({
        ...formData,
        name: selectedCourse.name,
        slug: selectedCourse.slug || generateSlug(selectedCourse.name),
        full_name: selectedCourse.full_name || '',
        degree_type: selectedCourse.degree_type || 'UG',
        duration: selectedCourse.duration || '',
        eligibility: selectedCourse.eligibility || '',
        base_course_id: selectedCourse.id
      });
      
      // Fetch college count for this course
      fetchCollegeCount(selectedCourse.name);
    }
  };

  // Fetch college count when course name changes
  const fetchCollegeCount = async (courseName) => {
    if (!courseName) {
      setCollegeCount(0);
      return;
    }
    setLoadingCollegeCount(true);
    try {
      const response = await api.get(`/courses-detail/college-count/${encodeURIComponent(courseName)}`);
      setCollegeCount(response.data.total_colleges || 0);
    } catch (error) {
      console.error('Error fetching college count:', error);
      setCollegeCount(0);
    } finally {
      setLoadingCollegeCount(false);
    }
  };

  // Fetch college count when editing existing course
  useEffect(() => {
    if (formData.name && id) {
      fetchCollegeCount(formData.name);
    }
  }, [formData.name, id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name' && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      setFormData({ 
        ...formData, 
        [name]: value,
        slug: generateSlug(value)
      });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        status: formData.status || 'draft'
      };
      
      if (id) {
        await api.put(`/courses-detail/${id}`, dataToSave);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses-detail', dataToSave);
        alert('Course created successfully!');
      }
      navigate('/admin/courses-detail');
    } catch (error) {
      console.error('Error saving course:', error);
      alert(`Failed to save course: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save as Draft handler
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      const dataToSave = {
        ...formData,
        status: 'draft'
      };
      
      if (id) {
        await api.put(`/courses-detail/${id}`, dataToSave);
        alert('Draft saved successfully!');
      } else {
        const response = await api.post('/courses-detail', dataToSave);
        alert('Draft saved successfully!');
        // Navigate to edit the newly created draft
        navigate(`/admin/courses-detail/edit/${response.data.id}`);
        return;
      }
      setLastAutoSave(new Date());
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(`Failed to save draft: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/submit-for-review/course/${id}`);
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course submitted for review!');
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Error submitting for review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/course/${id}`, { action: 'approve', comment: 'Approved' });
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course approved and published!');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error approving course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.post(`/admin/approve/course/${id}`, { action: 'reject', comment: reason });
      const response = await api.get(`/courses-detail/${id}`);
      setFormData({ ...formData, ...response.data });
      alert('Course rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Error rejecting course');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{id ? 'Edit Course Details' : 'Add New Course (Detailed)'}</h1>
          {id && formData.status && <StatusBadge status={formData.status} />}
        </div>
        <div className="flex items-center gap-2">
          {/* Approval Actions */}
          {id && formData.status === 'draft' && (
            <Button 
              type="button" 
              onClick={handleSubmitForReview}
              disabled={actionLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FiSend className="mr-2" /> Submit for Review
            </Button>
          )}
          {id && formData.status === 'pending' && canApprove && (
            <>
              <Button 
                type="button" 
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FiCheck className="mr-2" /> Approve
              </Button>
              <Button 
                type="button" 
                onClick={handleReject}
                disabled={actionLoading}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <FiX className="mr-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => navigate('/admin/courses-detail')}>
            <FiX className="mr-2" /> Cancel
          </Button>
        </div>
      </div>

      {/* Content Team Info - Show only when editing */}
      {id && (formData.created_at || formData.updated_at) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            👤 Content Team Info
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {formData.created_at && (
              <div>
                <span className="text-gray-500">Created:</span>
                <p className="text-xs text-gray-400">on {new Date(formData.created_at).toLocaleString()}</p>
              </div>
            )}
            {formData.updated_at && (
              <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="text-xs text-gray-400">on {new Date(formData.updated_at).toLocaleString()}</p>
              </div>
            )}
            {formData.reviewed_by_name && (
              <div>
                <span className="text-gray-500">Reviewed by:</span>
                <p className="font-medium text-gray-800">{formData.reviewed_by_name}</p>
                {formData.reviewed_at && <p className="text-xs text-gray-400">on {new Date(formData.reviewed_at).toLocaleString()}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason Alert */}
      {formData.status === 'rejected' && formData.rejection_reason && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <strong>Rejection Reason:</strong> {formData.rejection_reason}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Name *</label>
              <select
                value={formData.base_course_id || ''}
                onChange={handleCourseSelect}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a Course --</option>
                {coursesList.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} {course.full_name ? `(${course.full_name})` : ''} - {course.degree_type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select from courses created in Quick Entry. {coursesList.length} courses available.
              </p>
            </div>

            {formData.name && (
              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.name} 
                  {formData.full_name && ` • ${formData.full_name}`}
                  {formData.degree_type && ` • ${formData.degree_type}`}
                  {formData.duration && ` • ${formData.duration}`}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Technology in Computer Science"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Degree Type *</label>
              <select
                name="degree_type"
                value={formData.degree_type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="PhD">PhD/Doctorate</option>
                <option value="PG Diploma">PG Diploma</option>
                <option value="Professional">Professional</option>
                <option value="Integrated">Integrated</option>
                <option value="Super Specialty">Super Specialty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 4 Years"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Eligibility Level *</label>
              <select
                name="eligibility_level"
                value={formData.eligibility_level}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="after-10th">After 10th</option>
                <option value="after-12th">After 12th</option>
                <option value="after-graduation">After Graduation</option>
                <option value="professional">Professional</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">This determines which listing page the course appears on</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Course Mode</label>
              <select
                name="course_mode"
                value={formData.course_mode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Distance">Distance Learning</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Average Fees (Annual)</label>
              <input
                type="number"
                name="average_fees"
                value={formData.average_fees}
                onChange={handleChange}
                placeholder="e.g., 200000"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Colleges Offering
                <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="total_colleges_offering"
                  value={collegeCount}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                />
                {loadingCollegeCount && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated from database - counts how many colleges offer this course
              </p>
            </div>
          </div>
        </div>

        {/* Stream & Exam Tagging */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Category & Tagging</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stream *</label>
              <select
                name="stream_id"
                value={formData.stream_id}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Stream</option>
                {streams.map(stream => (
                  <option key={stream.id} value={stream.id}>{stream.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sub-Streams (Select Multiple)</label>
              <div className="border rounded p-3 max-h-48 overflow-y-auto">
                {subStreams
                  .filter(ss => ss.stream_id === formData.stream_id)
                  .map(subStream => (
                    <label key={subStream.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sub_stream_ids?.includes(subStream.id)}
                        onChange={() => handleMultiSelect('sub_stream_ids', subStream.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{subStream.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Related Exams (Select Multiple)</label>
              <div className="border rounded p-3 max-h-48 overflow-y-auto">
                {exams.map(exam => (
                  <label key={exam.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.exam_ids?.includes(exam.id)}
                      onChange={() => handleMultiSelect('exam_ids', exam.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{exam.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Course Details</h2>
          <div className="space-y-4">
            {/* Description with Rich Content */}
            <CollapsibleSection title="Description *" icon="📝" defaultOpen={true} badge={`${formData.description_toc?.length || 0} sections`}>
              <div className="space-y-4">
                {/* Main Description Text - Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <SimpleRichTextEditor
                    value={formData.description}
                    onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                    placeholder="Brief description of the course..."
                  />
                  <p className="text-xs text-gray-500 mt-1">You can change text color and add links</p>
                </div>

                {/* Description TOC Builder - Advanced Block Editor */}
                <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-800">📑 Table of Contents + Content Sections</label>
                      <p className="text-xs text-purple-600">Each section you add here appears in TOC AND has its content below</p>
                    </div>
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                      {formData.description_toc?.length || 0} sections
                    </span>
                  </div>

                  {/* HOW IT WORKS - Explanation Box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-bold text-blue-800 mb-2">📌 How TOC Connection Works:</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-white rounded p-2 border border-blue-200">
                        <p className="font-bold text-blue-700 mb-1">1. Table of Contents (Clickable Menu)</p>
                        <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                          • What is this course?<br/>
                          • Eligibility Criteria<br/>
                          • Career Options
                        </div>
                        <p className="text-gray-500 mt-1">User sees this menu and clicks on a topic</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-blue-200">
                        <p className="font-bold text-blue-700 mb-1">2. Content Sections (Linked by Anchor ID)</p>
                        <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                          <span className="text-green-600">&lt;section id=&quot;what-is-this-course&quot;&gt;</span><br/>
                          &nbsp;&nbsp;Content here...<br/>
                          <span className="text-green-600">&lt;/section&gt;</span>
                        </div>
                        <p className="text-gray-500 mt-1">Page scrolls to this section when clicked</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      🔗 The <strong>Anchor ID</strong> (e.g., &quot;eligibility&quot;, &quot;career-options&quot;) is the KEY that connects TOC link to content section!
                    </p>
                  </div>

                  {/* TOC Items */}
                  <div className="space-y-4 mb-4">
                    {(formData.description_toc || []).map((item, index) => (
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
                                description_toc: (formData.description_toc || []).filter((_, i) => i !== index)
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
                                  const newToc = [...(formData.description_toc || [])];
                                  newToc[index].title = e.target.value;
                                  newToc[index].anchor = e.target.value
                                    .toLowerCase()
                                    .replace(/[^a-z0-9\s]/g, '')
                                    .replace(/\s+/g, '-')
                                    .substring(0, 50);
                                  setFormData({...formData, description_toc: newToc});
                                }}
                                placeholder="e.g., What is this course?, Eligibility"
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
                                  const newToc = [...(formData.description_toc || [])];
                                  newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                  setFormData({...formData, description_toc: newToc});
                                }}
                                placeholder="what-is-this-course"
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
                                const newToc = [...(formData.description_toc || [])];
                                newToc[index].blocks = [...(newToc[index].blocks || []), {
                                  id: `block-${Date.now()}`, type: 'text', heading: '', content: ''
                                }];
                                setFormData({...formData, description_toc: newToc});
                              }} className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                                📝 Text
                              </button>
                              
                              {/* Add Image Block */}
                              <button type="button" onClick={() => {
                                const newToc = [...(formData.description_toc || [])];
                                newToc[index].blocks = [...(newToc[index].blocks || []), {
                                  id: `block-${Date.now()}`, type: 'image', url: '', 
                                  imageTitle: '', alt: '', title: '', caption: '', width: '100%'
                                }];
                                setFormData({...formData, description_toc: newToc});
                              }} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                                🖼️ Image
                              </button>
                              
                              {/* Add Table Block */}
                              <button type="button" onClick={() => {
                                const newToc = [...(formData.description_toc || [])];
                                const courseName = formData.name || 'Course';
                                const sectionTitle = item.title || 'Information';
                                newToc[index].blocks = [...(newToc[index].blocks || []), {
                                  id: `block-${Date.now()}`, type: 'table', 
                                  title: `${courseName} ${sectionTitle} Details - AdmissionBuddy`, 
                                  headers: ['Parameter', 'Details', 'Remarks'],
                                  rows: [['', '', ''], ['', '', '']]
                                }];
                                setFormData({...formData, description_toc: newToc});
                              }} className="flex items-center gap-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200">
                                📊 Table
                              </button>
                              
                              {/* Add Video Block */}
                              <button type="button" onClick={() => {
                                const newToc = [...(formData.description_toc || [])];
                                newToc[index].blocks = [...(newToc[index].blocks || []), {
                                  id: `block-${Date.now()}`, type: 'video', url: '', 
                                  videoTitle: '', title: '', description: ''
                                }];
                                setFormData({...formData, description_toc: newToc});
                              }} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                                🎬 Video
                              </button>
                              
                              {/* Add List Block */}
                              <button type="button" onClick={() => {
                                const newToc = [...(formData.description_toc || [])];
                                const courseName = formData.name || 'Course';
                                const sectionTitle = item.title || 'Information';
                                newToc[index].blocks = [...(newToc[index].blocks || []), {
                                  id: `block-${Date.now()}`, type: 'list', 
                                  title: `${courseName} ${sectionTitle} - AdmissionBuddy`, 
                                  listType: 'bullet',
                                  items: ['', '', '']
                                }];
                                setFormData({...formData, description_toc: newToc});
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
                                            const newToc = [...(formData.description_toc || [])];
                                            const blocks = [...newToc[index].blocks];
                                            [blocks[blockIndex], blocks[blockIndex - 1]] = [blocks[blockIndex - 1], blocks[blockIndex]];
                                            newToc[index].blocks = blocks;
                                            setFormData({...formData, description_toc: newToc});
                                          }
                                        }} className="p-1 hover:bg-white/50 rounded" disabled={blockIndex === 0}>
                                          <FiChevronUp size={16} className={blockIndex === 0 ? 'text-gray-300' : ''} />
                                        </button>
                                        {/* Move Down */}
                                        <button type="button" onClick={() => {
                                          if (blockIndex < item.blocks.length - 1) {
                                            const newToc = [...(formData.description_toc || [])];
                                            const blocks = [...newToc[index].blocks];
                                            [blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
                                            newToc[index].blocks = blocks;
                                            setFormData({...formData, description_toc: newToc});
                                          }
                                        }} className="p-1 hover:bg-white/50 rounded" disabled={blockIndex === item.blocks.length - 1}>
                                          <FiChevronDown size={16} className={blockIndex === item.blocks.length - 1 ? 'text-gray-300' : ''} />
                                        </button>
                                        {/* Delete */}
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.description_toc || [])];
                                          newToc[index].blocks = newToc[index].blocks.filter((_, i) => i !== blockIndex);
                                          setFormData({...formData, description_toc: newToc});
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
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].heading = e.target.value;
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="e.g., Overview, Key Points" />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                                            <textarea value={block.content || ''} onChange={(e) => {
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].content = e.target.value;
                                              setFormData({...formData, description_toc: newToc});
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
                                                  <><FiLoader className="animate-spin" size={18} /> Uploading...</>
                                                ) : (
                                                  <><FiUpload size={18} /> Choose File</>
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
                                                  const newToc = [...(formData.description_toc || [])];
                                                  newToc[index].blocks[blockIndex].url = e.target.value;
                                                  setFormData({...formData, description_toc: newToc});
                                                }} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Paste image URL here..." />
                                              </div>
                                            </div>
                                            {block.url && (
                                              <div className="mt-3">
                                                <img src={block.url} alt={block.alt || ''} className="max-h-32 rounded-lg border" />
                                              </div>
                                            )}
                                          </div>
                                          
                                          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                            <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Image Title</label>
                                            <input type="text" value={block.imageTitle || ''} onChange={(e) => {
                                              const newToc = [...(formData.description_toc || [])];
                                              const imageTitle = e.target.value;
                                              const courseName = formData.name || 'Course';
                                              newToc[index].blocks[blockIndex].imageTitle = imageTitle;
                                              if (imageTitle) {
                                                newToc[index].blocks[blockIndex].alt = `${imageTitle} - ${courseName} | AdmissionBuddy`;
                                                newToc[index].blocks[blockIndex].title = `${imageTitle} - ${courseName} | AdmissionBuddy.co`;
                                              }
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Course Structure, Lab Equipment" />
                                            <p className="text-xs text-yellow-700 mt-2">💡 Enter image title - SEO Alt & Title will be auto-generated</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* TABLE BLOCK */}
                                      {block.type === 'table' && (
                                        <div className="space-y-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Table Title</label>
                                            <input type="text" value={block.title || ''} onChange={(e) => {
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].title = e.target.value;
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Table title for SEO" />
                                          </div>
                                          <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                              <thead>
                                                <tr>
                                                  {(block.headers || []).map((header, hIndex) => (
                                                    <th key={hIndex} className="border-2 border-teal-200 bg-teal-50 p-2">
                                                      <input type="text" value={header} onChange={(e) => {
                                                        const newToc = [...(formData.description_toc || [])];
                                                        newToc[index].blocks[blockIndex].headers[hIndex] = e.target.value;
                                                        setFormData({...formData, description_toc: newToc});
                                                      }} className="w-full border-0 bg-transparent text-center font-bold text-sm" placeholder={`Header ${hIndex + 1}`} />
                                                    </th>
                                                  ))}
                                                  <th className="border-2 border-teal-200 bg-teal-50 p-2 w-20">
                                                    <button type="button" onClick={() => {
                                                      const newToc = [...(formData.description_toc || [])];
                                                      newToc[index].blocks[blockIndex].headers.push('');
                                                      newToc[index].blocks[blockIndex].rows = newToc[index].blocks[blockIndex].rows.map(row => [...row, '']);
                                                      setFormData({...formData, description_toc: newToc});
                                                    }} className="text-teal-600 hover:bg-teal-100 p-1 rounded">
                                                      <FiPlus size={14} />
                                                    </button>
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {(block.rows || []).map((row, rIndex) => (
                                                  <tr key={rIndex}>
                                                    {row.map((cell, cIndex) => (
                                                      <td key={cIndex} className="border-2 border-gray-200 p-2">
                                                        <input type="text" value={cell} onChange={(e) => {
                                                          const newToc = [...(formData.description_toc || [])];
                                                          newToc[index].blocks[blockIndex].rows[rIndex][cIndex] = e.target.value;
                                                          setFormData({...formData, description_toc: newToc});
                                                        }} className="w-full border-0 text-sm" placeholder="..." />
                                                      </td>
                                                    ))}
                                                    <td className="border-2 border-gray-200 p-2">
                                                      <button type="button" onClick={() => {
                                                        const newToc = [...(formData.description_toc || [])];
                                                        newToc[index].blocks[blockIndex].rows = newToc[index].blocks[blockIndex].rows.filter((_, i) => i !== rIndex);
                                                        setFormData({...formData, description_toc: newToc});
                                                      }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                        <FiTrash2 size={12} />
                                                      </button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                            <button type="button" onClick={() => {
                                              const newToc = [...(formData.description_toc || [])];
                                              const colCount = newToc[index].blocks[blockIndex].headers.length;
                                              newToc[index].blocks[blockIndex].rows.push(Array(colCount).fill(''));
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="mt-2 text-xs text-teal-600 hover:bg-teal-50 px-2 py-1 rounded flex items-center gap-1">
                                              <FiPlus size={12} /> Add Row
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* VIDEO BLOCK */}
                                      {block.type === 'video' && (
                                        <div className="space-y-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">YouTube Video URL</label>
                                            <input type="text" value={block.url || ''} onChange={(e) => {
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].url = e.target.value;
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="https://youtube.com/watch?v=..." />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Video Title (for SEO)</label>
                                            <input type="text" value={block.videoTitle || ''} onChange={(e) => {
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].videoTitle = e.target.value;
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Video title for SEO" />
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* LIST BLOCK */}
                                      {block.type === 'list' && (
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-4 mb-2">
                                            <label className="text-xs font-medium text-gray-700">List Type:</label>
                                            <label className="flex items-center gap-1">
                                              <input type="radio" name={`list-type-${index}-${blockIndex}`} checked={block.listType === 'bullet'} onChange={() => {
                                                const newToc = [...(formData.description_toc || [])];
                                                newToc[index].blocks[blockIndex].listType = 'bullet';
                                                setFormData({...formData, description_toc: newToc});
                                              }} /> Bullet
                                            </label>
                                            <label className="flex items-center gap-1">
                                              <input type="radio" name={`list-type-${index}-${blockIndex}`} checked={block.listType === 'number'} onChange={() => {
                                                const newToc = [...(formData.description_toc || [])];
                                                newToc[index].blocks[blockIndex].listType = 'number';
                                                setFormData({...formData, description_toc: newToc});
                                              }} /> Numbered
                                            </label>
                                          </div>
                                          <div className="space-y-2">
                                            {(block.items || []).map((listItem, liIndex) => (
                                              <div key={liIndex} className="flex items-center gap-2">
                                                <span className="text-gray-400 w-6">{block.listType === 'number' ? `${liIndex + 1}.` : '•'}</span>
                                                <input type="text" value={listItem} onChange={(e) => {
                                                  const newToc = [...(formData.description_toc || [])];
                                                  newToc[index].blocks[blockIndex].items[liIndex] = e.target.value;
                                                  setFormData({...formData, description_toc: newToc});
                                                }} className="flex-1 border-2 rounded px-2 py-1 text-sm" placeholder="List item..." />
                                                <button type="button" onClick={() => {
                                                  const newToc = [...(formData.description_toc || [])];
                                                  newToc[index].blocks[blockIndex].items = newToc[index].blocks[blockIndex].items.filter((_, i) => i !== liIndex);
                                                  setFormData({...formData, description_toc: newToc});
                                                }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                  <FiTrash2 size={12} />
                                                </button>
                                              </div>
                                            ))}
                                            <button type="button" onClick={() => {
                                              const newToc = [...(formData.description_toc || [])];
                                              newToc[index].blocks[blockIndex].items.push('');
                                              setFormData({...formData, description_toc: newToc});
                                            }} className="text-xs text-gray-600 hover:bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                                              <FiPlus size={12} /> Add Item
                                            </button>
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
                        description_toc: [...(formData.description_toc || []), { title: '', anchor: '', blocks: [] }]
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
                        { title: 'What is this course?', anchor: 'what-is-this-course' },
                        { title: 'Eligibility Criteria', anchor: 'eligibility-criteria' },
                        { title: 'Admission Process', anchor: 'admission-process' },
                        { title: 'Syllabus', anchor: 'syllabus' },
                        { title: 'Fee Structure', anchor: 'fee-structure' },
                        { title: 'Career Options', anchor: 'career-options' },
                        { title: 'Top Colleges', anchor: 'top-colleges' },
                        { title: 'Salary & Scope', anchor: 'salary-scope' },
                      ].map(template => (
                        <button
                          key={template.anchor}
                          type="button"
                          onClick={() => {
                            const exists = (formData.description_toc || []).some(t => t.anchor === template.anchor);
                            if (!exists) {
                              setFormData({
                                ...formData,
                                description_toc: [...(formData.description_toc || []), { ...template, blocks: [] }]
                              });
                            }
                          }}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          + {template.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description Table Builder */}
                <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-teal-800">📊 Tables</label>
                      <p className="text-xs text-teal-600">Add data tables</p>
                    </div>
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">
                      {formData.description_tables?.length || 0} tables
                    </span>
                  </div>
                  <div className="space-y-4 mb-4">
                    {(formData.description_tables || []).map((table, tableIndex) => (
                      <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <input type="text" value={table.title || ''} onChange={(e) => {
                            const newTables = [...(formData.description_tables || [])];
                            newTables[tableIndex].title = e.target.value;
                            setFormData({...formData, description_tables: newTables});
                          }} placeholder="Table Title" className="border rounded px-2 py-1 text-sm w-48" />
                          <div className="flex gap-1">
                            <button type="button" onClick={() => {
                              const newTables = [...(formData.description_tables || [])];
                              newTables[tableIndex].headers.push('Column');
                              newTables[tableIndex].rows.forEach(row => row.push(''));
                              setFormData({...formData, description_tables: newTables});
                            }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">+ Col</button>
                            <button type="button" onClick={() => {
                              const newTables = [...(formData.description_tables || [])];
                              newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                              setFormData({...formData, description_tables: newTables});
                            }} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">+ Row</button>
                            <button type="button" onClick={() => {
                              setFormData({...formData, description_tables: (formData.description_tables || []).filter((_, i) => i !== tableIndex)});
                            }} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr>
                                {(table.headers || []).map((header, colIndex) => (
                                  <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                    <input type="text" value={header} onChange={(e) => {
                                      const newTables = [...(formData.description_tables || [])];
                                      newTables[tableIndex].headers[colIndex] = e.target.value;
                                      setFormData({...formData, description_tables: newTables});
                                    }} className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 text-xs" placeholder="Header" />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(table.rows || []).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="border border-teal-200 p-1">
                                      <input type="text" value={cell} onChange={(e) => {
                                        const newTables = [...(formData.description_tables || [])];
                                        newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                        setFormData({...formData, description_tables: newTables});
                                      }} className="w-full border-0 text-xs" />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button type="button" onClick={() => {
                      setFormData({...formData, description_tables: [...(formData.description_tables || []), { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]});
                    }} className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1">
                      <FiPlus /> Add Table
                    </button>
                    {(formData.description_tables || []).length > 0 && (
                      <button type="button" onClick={() => {
                        const tablesHtml = formData.description_tables.map(table => {
                          const headerRow = table.headers.map(h => `<th>${h}</th>`).join('');
                          const bodyRows = table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n');
                          return `<table class="data-table">\n  ${table.title ? `<caption>${table.title}</caption>\n  ` : ''}<thead><tr>${headerRow}</tr></thead>\n  <tbody>\n${bodyRows}\n  </tbody>\n</table>`;
                        }).join('\n\n');
                        setFormData({...formData, description: (formData.description || '') + '\n\n' + tablesHtml});
                        alert('Tables inserted to Description content!');
                      }} className="text-sm text-green-700 hover:bg-green-100 px-3 py-1.5 rounded border border-green-300 flex items-center gap-1">
                        📥 Insert to Content
                      </button>
                    )}
                  </div>
                </div>

                {/* Description Images */}
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800">🖼️ Images</label>
                      <p className="text-xs text-blue-600">Add images for description (alt tags auto-generated)</p>
                    </div>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {formData.description_images?.length || 0} images
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    {(formData.description_images || []).map((img, index) => (
                      <div key={index} className="bg-white rounded-lg border-2 border-blue-200 p-3">
                        <div className="flex items-start gap-3">
                          <img src={img.url} alt={img.alt || ''} className="w-24 h-20 object-cover rounded border flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Title / Caption</label>
                              <input type="text" value={img.caption || ''} onChange={(e) => {
                                const newImages = [...(formData.description_images || [])];
                                newImages[index].caption = e.target.value;
                                // Auto-generate alt tag from title with admissionbuddy branding
                                newImages[index].alt = generateAltFromCaption(formData.name, e.target.value);
                                setFormData({...formData, description_images: newImages});
                              }} placeholder="Enter image title (alt tag auto-generates)" className="w-full border rounded px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Alt Tag <span className="text-green-600">(auto from title)</span></label>
                              <input type="text" value={img.alt || ''} readOnly className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-600" />
                            </div>
                          </div>
                          <button type="button" onClick={() => {
                            setFormData({...formData, description_images: (formData.description_images || []).filter((_, i) => i !== index)});
                          }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                    <FiUpload className="text-blue-400" size={18} />
                    <span className="text-sm text-blue-600">Add Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await api.post('/upload/image?type=content', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                        const autoAlt = generateAltTag(formData.name, 'description image', formData.description_images?.length || 0);
                        setFormData({...formData, description_images: [...(formData.description_images || []), { url: res.data.url, caption: '', alt: autoAlt }]});
                      }
                    }} />
                  </label>
                </div>

                {/* Description Videos (URL only) */}
                <div className="border-2 border-rose-300 rounded-lg p-4 bg-rose-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-rose-800">🎬 Videos</label>
                      <p className="text-xs text-rose-600">Add video URLs (alt tags auto-generated)</p>
                    </div>
                    <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded">
                      {formData.description_videos?.length || 0} videos
                    </span>
                  </div>
                  {(formData.description_videos || []).length > 0 && (
                    <div className="space-y-3 mb-4">
                      {(formData.description_videos || []).map((vid, index) => (
                        <div key={index} className="bg-white rounded-lg border-2 border-rose-200 p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-12 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                              <FiVideo className="text-white" size={20} />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Video Title</label>
                                  <input type="text" value={vid.title || ''} onChange={(e) => {
                                    const newVideos = [...(formData.description_videos || [])];
                                    newVideos[index].title = e.target.value;
                                    // Auto-generate alt tag from title with admissionbuddy branding
                                    newVideos[index].alt = generateAltFromCaption(formData.name, e.target.value);
                                    setFormData({...formData, description_videos: newVideos});
                                  }} placeholder="Enter title (alt auto-generates)" className="w-full border rounded px-2 py-1.5 text-sm" />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Alt Tag <span className="text-green-600">(auto from title)</span></label>
                                  <input type="text" value={vid.alt || ''} readOnly className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-600" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Video URL</label>
                                <input type="text" value={vid.url || ''} onChange={(e) => {
                                  const newVideos = [...(formData.description_videos || [])];
                                  newVideos[index].url = e.target.value;
                                  setFormData({...formData, description_videos: newVideos});
                                }} placeholder="YouTube/Video URL" className="w-full border rounded px-2 py-1.5 text-sm font-mono" />
                              </div>
                            </div>
                            <button type="button" onClick={() => {
                              setFormData({...formData, description_videos: (formData.description_videos || []).filter((_, i) => i !== index)});
                            }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Paste YouTube/Video URL" className="flex-1 border-2 border-rose-200 rounded px-3 py-2 text-sm" id="desc-video-url-input" />
                    <button type="button" onClick={() => {
                      const input = document.getElementById('desc-video-url-input');
                      if (input.value) {
                        const autoAlt = generateVideoAlt(formData.name, 'description', formData.description_videos?.length || 0);
                        setFormData({...formData, description_videos: [...(formData.description_videos || []), { url: input.value, title: '', alt: autoAlt }]});
                        input.value = '';
                      }
                    }} className="px-3 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 flex items-center gap-1">
                      <FiPlus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <div>
              <label className="block text-sm font-medium mb-1">Overview</label>
              <SimpleRichTextEditor
                value={formData.overview}
                onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))}
                placeholder="Detailed course overview..."
              />
              <p className="text-xs text-gray-500 mt-1">You can change text color and add links</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
              <textarea
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., 10+2 with 60% marks in PCM"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Admission Process</label>
              <textarea
                name="admission_process"
                value={formData.admission_process}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Selection Criteria</label>
              <textarea
                name="selection_criteria"
                value={formData.selection_criteria}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Career Prospects</label>
              <textarea
                name="career_prospects"
                value={formData.career_prospects}
                onChange={handleChange}
                rows="4"
                placeholder="Career opportunities and growth prospects..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Salary Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Salary (Annual)</label>
              <input
                type="number"
                value={formData.salary_range?.min || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  salary_range: { ...formData.salary_range, min: parseInt(e.target.value) }
                })}
                placeholder="e.g., 300000"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Salary (Annual)</label>
              <input
                type="number"
                value={formData.salary_range?.max || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  salary_range: { ...formData.salary_range, max: parseInt(e.target.value) }
                })}
                placeholder="e.g., 1500000"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Syllabus - Semester-wise */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📚 Syllabus (Semester-wise)</h2>
          <p className="text-sm text-gray-500 mb-4">Add semester-wise syllabus with subjects. This will appear on the course detail page.</p>
          
          <div className="space-y-4">
            {(formData.syllabus || []).map((sem, semIndex) => (
              <div key={semIndex} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <input
                    type="text"
                    value={sem.semester || `Semester ${semIndex + 1}`}
                    onChange={(e) => {
                      const newSyllabus = [...(formData.syllabus || [])];
                      newSyllabus[semIndex].semester = e.target.value;
                      setFormData({...formData, syllabus: newSyllabus});
                    }}
                    className="font-semibold bg-white border rounded px-3 py-1"
                    placeholder="Semester 1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({...formData, syllabus: (formData.syllabus || []).filter((_, i) => i !== semIndex)});
                    }}
                    className="text-red-500"
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(sem.subjects || []).map((subject, subIndex) => (
                    <div key={subIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          const newSyllabus = [...(formData.syllabus || [])];
                          newSyllabus[semIndex].subjects[subIndex] = e.target.value;
                          setFormData({...formData, syllabus: newSyllabus});
                        }}
                        className="flex-1 border rounded px-3 py-1.5 text-sm"
                        placeholder="Subject name"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSyllabus = [...(formData.syllabus || [])];
                          newSyllabus[semIndex].subjects = newSyllabus[semIndex].subjects.filter((_, i) => i !== subIndex);
                          setFormData({...formData, syllabus: newSyllabus});
                        }}
                        className="text-red-400"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSyllabus = [...(formData.syllabus || [])];
                      if (!newSyllabus[semIndex].subjects) newSyllabus[semIndex].subjects = [];
                      newSyllabus[semIndex].subjects.push('');
                      setFormData({...formData, syllabus: newSyllabus});
                    }}
                    className="text-blue-600"
                  >
                    + Add Subject
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newSyllabus = [...(formData.syllabus || [])];
                newSyllabus.push({ semester: `Semester ${newSyllabus.length + 1}`, subjects: [''] });
                setFormData({...formData, syllabus: newSyllabus});
              }}
              className="w-full border-dashed"
            >
              + Add Semester
            </Button>
          </div>
        </div>

        {/* Highlights/Badges */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">✨ Highlights / Badges</h2>
          <p className="text-sm text-gray-500 mb-4">Add course highlights that appear as badges (e.g., AICTE Approved, 100% Placement)</p>
          
          <div className="space-y-2">
            {(formData.highlights || []).map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...(formData.highlights || [])];
                    newHighlights[index] = e.target.value;
                    setFormData({...formData, highlights: newHighlights});
                  }}
                  placeholder="e.g., AICTE Approved, 100% Placement"
                  className="flex-1 border rounded px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({...formData, highlights: (formData.highlights || []).filter((_, i) => i !== index)});
                  }}
                  className="text-red-500"
                >
                  <FiTrash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({...formData, highlights: [...(formData.highlights || []), '']});
              }}
              className="w-full border-dashed"
            >
              + Add Highlight
            </Button>
          </div>
        </div>

        {/* Related Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔗 Related Courses</h2>
          <p className="text-sm text-gray-500 mb-4">Add related course names that will appear in sidebar</p>
          
          <div className="space-y-2">
            {(formData.related_courses || []).map((course, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={course}
                  onChange={(e) => {
                    const newCourses = [...(formData.related_courses || [])];
                    newCourses[index] = e.target.value;
                    setFormData({...formData, related_courses: newCourses});
                  }}
                  placeholder="e.g., M.Tech, MBA, MCA"
                  className="flex-1 border rounded px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({...formData, related_courses: (formData.related_courses || []).filter((_, i) => i !== index)});
                  }}
                  className="text-red-500"
                >
                  <FiTrash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({...formData, related_courses: [...(formData.related_courses || []), '']});
              }}
              className="w-full border-dashed"
            >
              + Add Related Course
            </Button>
          </div>
        </div>

        {/* Age Limit */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">⏰ Age Limit</h2>
          <p className="text-sm text-gray-500 mb-4">Specify age eligibility criteria for this course (displayed in Eligibility section)</p>
          
          <input
            type="text"
            name="age_limit"
            value={formData.age_limit || ''}
            onChange={handleChange}
            placeholder="e.g., No upper age limit for most institutions, 17-25 years for government colleges"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Top Colleges */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🏛️ Top Colleges</h2>
          <p className="text-sm text-gray-500 mb-4">Add top colleges offering this course. These will appear in the Top Colleges section on the course detail page.</p>
          
          <div className="space-y-4">
            {(formData.top_colleges || []).map((college, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-700">College #{index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({...formData, top_colleges: (formData.top_colleges || []).filter((_, i) => i !== index)});
                    }}
                    className="text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">College Name *</label>
                    <input
                      type="text"
                      value={college.name || ''}
                      onChange={(e) => {
                        const newColleges = [...(formData.top_colleges || [])];
                        newColleges[index] = {...newColleges[index], name: e.target.value};
                        setFormData({...formData, top_colleges: newColleges});
                      }}
                      placeholder="e.g., Indian Institute of Technology, Delhi"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={college.location || ''}
                      onChange={(e) => {
                        const newColleges = [...(formData.top_colleges || [])];
                        newColleges[index] = {...newColleges[index], location: e.target.value};
                        setFormData({...formData, top_colleges: newColleges});
                      }}
                      placeholder="e.g., New Delhi"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Rating (out of 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={college.rating || ''}
                      onChange={(e) => {
                        const newColleges = [...(formData.top_colleges || [])];
                        newColleges[index] = {...newColleges[index], rating: parseFloat(e.target.value) || 0};
                        setFormData({...formData, top_colleges: newColleges});
                      }}
                      placeholder="e.g., 4.8"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fees (per year)</label>
                    <input
                      type="text"
                      value={college.fees || ''}
                      onChange={(e) => {
                        const newColleges = [...(formData.top_colleges || [])];
                        newColleges[index] = {...newColleges[index], fees: e.target.value};
                        setFormData({...formData, top_colleges: newColleges});
                      }}
                      placeholder="e.g., ₹2.5L/year"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Rank</label>
                    <input
                      type="text"
                      value={college.rank || ''}
                      onChange={(e) => {
                        const newColleges = [...(formData.top_colleges || [])];
                        newColleges[index] = {...newColleges[index], rank: e.target.value};
                        setFormData({...formData, top_colleges: newColleges});
                      }}
                      placeholder="e.g., #1"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData, 
                  top_colleges: [...(formData.top_colleges || []), { name: '', location: '', rating: 0, fees: '', rank: '' }]
                });
              }}
              className="w-full border-dashed"
            >
              + Add College
            </Button>
          </div>
        </div>

        {/* Arrays - Subjects, Skills, Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Course Components</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subjects</label>
              {formData.subjects?.map((subject, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleArrayChange('subjects', index, e.target.value)}
                    placeholder="e.g., Data Structures, Algorithms"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('subjects', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('subjects', '')} size="sm">
                <FiPlus className="mr-2" /> Add Subject
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skills Acquired</label>
              {formData.skills_acquired?.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills_acquired', index, e.target.value)}
                    placeholder="e.g., Problem Solving, Programming"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('skills_acquired', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('skills_acquired', '')} size="sm">
                <FiPlus className="mr-2" /> Add Skill
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Opportunities</label>
              {formData.job_opportunities?.map((job, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => handleArrayChange('job_opportunities', index, e.target.value)}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('job_opportunities', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('job_opportunities', '')} size="sm">
                <FiPlus className="mr-2" /> Add Job Role
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Popular Specializations</label>
              {formData.popular_specializations?.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleArrayChange('popular_specializations', index, e.target.value)}
                    placeholder="e.g., Machine Learning, Web Development"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('popular_specializations', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('popular_specializations', '')} size="sm">
                <FiPlus className="mr-2" /> Add Specialization
              </Button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_popular"
              checked={formData.is_popular}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium">Mark as Popular Course</span>
          </label>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* MENU CONFIGURATION SECTION                                                      */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="Menu Configuration" icon="🧭" defaultOpen={false}>
          <CourseMenuConfigSection formData={formData} setFormData={setFormData} />
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* PAGE WIDGETS CONFIGURATION                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="Page Widgets" icon="🧩" defaultOpen={false} badge={`${[formData.widgets_config?.apply_now?.enabled, formData.widgets_config?.ask_question?.enabled, formData.widgets_config?.counselling?.enabled, formData.widgets_config?.sponsor_ad?.enabled].filter(Boolean).length} active`}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 Configure widgets that will appear on this course detail page. Enable/disable and customize each widget.
            </p>

            {/* Apply Now Widget */}
            <div className={`border-2 rounded-xl p-4 transition-all ${formData.widgets_config?.apply_now?.enabled ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.widgets_config?.apply_now?.enabled ? 'bg-orange-500' : 'bg-gray-400'}`}>
                    <FiSend className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Apply Now Widget</h4>
                    <p className="text-xs text-gray-500">Quick admission form for students</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.widgets_config?.apply_now?.enabled || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      widgets_config: {
                        ...formData.widgets_config,
                        apply_now: { ...formData.widgets_config?.apply_now, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              {formData.widgets_config?.apply_now?.enabled && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-orange-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Widget Title</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.apply_now?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          apply_now: { ...formData.widgets_config?.apply_now, title: e.target.value }
                        }
                      })}
                      placeholder="Apply Now"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.apply_now?.button_text || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          apply_now: { ...formData.widgets_config?.apply_now, button_text: e.target.value }
                        }
                      })}
                      placeholder="Submit Application"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.apply_now?.subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          apply_now: { ...formData.widgets_config?.apply_now, subtitle: e.target.value }
                        }
                      })}
                      placeholder="Start your admission journey"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.widgets_config?.apply_now?.position || 'sidebar'}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          apply_now: { ...formData.widgets_config?.apply_now, position: e.target.value }
                        }
                      })}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="floating">Floating Button</option>
                      <option value="inline">Inline (in content)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Ask Question Widget */}
            <div className={`border-2 rounded-xl p-4 transition-all ${formData.widgets_config?.ask_question?.enabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.widgets_config?.ask_question?.enabled ? 'bg-blue-500' : 'bg-gray-400'}`}>
                    <FiMessageSquare className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ask Question Widget</h4>
                    <p className="text-xs text-gray-500">Q&A support for students</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.widgets_config?.ask_question?.enabled || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      widgets_config: {
                        ...formData.widgets_config,
                        ask_question: { ...formData.widgets_config?.ask_question, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              {formData.widgets_config?.ask_question?.enabled && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Widget Title</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.ask_question?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          ask_question: { ...formData.widgets_config?.ask_question, title: e.target.value }
                        }
                      })}
                      placeholder="Have Questions?"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.ask_question?.button_text || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          ask_question: { ...formData.widgets_config?.ask_question, button_text: e.target.value }
                        }
                      })}
                      placeholder="Ask Now"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.ask_question?.subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          ask_question: { ...formData.widgets_config?.ask_question, subtitle: e.target.value }
                        }
                      })}
                      placeholder="Our experts are here to help"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.widgets_config?.ask_question?.position || 'sidebar'}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          ask_question: { ...formData.widgets_config?.ask_question, position: e.target.value }
                        }
                      })}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="floating">Floating Button</option>
                      <option value="inline">Inline (in content)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Counselling Widget */}
            <div className={`border-2 rounded-xl p-4 transition-all ${formData.widgets_config?.counselling?.enabled ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.widgets_config?.counselling?.enabled ? 'bg-purple-500' : 'bg-gray-400'}`}>
                    <FiUsers className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Counselling Widget</h4>
                    <p className="text-xs text-gray-500">Free career guidance callback</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.widgets_config?.counselling?.enabled || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      widgets_config: {
                        ...formData.widgets_config,
                        counselling: { ...formData.widgets_config?.counselling, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              {formData.widgets_config?.counselling?.enabled && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Widget Title</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.counselling?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          counselling: { ...formData.widgets_config?.counselling, title: e.target.value }
                        }
                      })}
                      placeholder="Need Counselling?"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.counselling?.button_text || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          counselling: { ...formData.widgets_config?.counselling, button_text: e.target.value }
                        }
                      })}
                      placeholder="Request Callback"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.counselling?.subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          counselling: { ...formData.widgets_config?.counselling, subtitle: e.target.value }
                        }
                      })}
                      placeholder="Get free career guidance"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.widgets_config?.counselling?.position || 'sidebar'}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          counselling: { ...formData.widgets_config?.counselling, position: e.target.value }
                        }
                      })}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="floating">Floating Button</option>
                      <option value="inline">Inline (in content)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Sponsor Ad Widget */}
            <div className={`border-2 rounded-xl p-4 transition-all ${formData.widgets_config?.sponsor_ad?.enabled ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.widgets_config?.sponsor_ad?.enabled ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                    <FiDollarSign className="text-white" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sponsor Ad Widget</h4>
                    <p className="text-xs text-gray-500">Display sponsored advertisement</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.widgets_config?.sponsor_ad?.enabled || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      widgets_config: {
                        ...formData.widgets_config,
                        sponsor_ad: { ...formData.widgets_config?.sponsor_ad, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              {formData.widgets_config?.sponsor_ad?.enabled && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-yellow-300">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ad Title</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.sponsor_ad?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, title: e.target.value }
                        }
                      })}
                      placeholder="Featured Program"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sponsor Name</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.sponsor_ad?.sponsor_name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, sponsor_name: e.target.value }
                        }
                      })}
                      placeholder="IIM Bangalore"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.sponsor_ad?.description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, description: e.target.value }
                        }
                      })}
                      placeholder="Get 50% scholarship on early applications"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.sponsor_ad?.image_url || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, image_url: e.target.value }
                        }
                      })}
                      placeholder="https://example.com/ad-image.jpg"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
                    <input
                      type="text"
                      value={formData.widgets_config?.sponsor_ad?.link_url || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, link_url: e.target.value }
                        }
                      })}
                      placeholder="https://sponsor-website.com"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.widgets_config?.sponsor_ad?.position || 'sidebar'}
                      onChange={(e) => setFormData({
                        ...formData,
                        widgets_config: {
                          ...formData.widgets_config,
                          sponsor_ad: { ...formData.widgets_config?.sponsor_ad, position: e.target.value }
                        }
                      })}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="banner">Banner (Top of page)</option>
                      <option value="inline">Inline (in content)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Enable All */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Quick actions:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    widgets_config: {
                      ...formData.widgets_config,
                      apply_now: { ...formData.widgets_config?.apply_now, enabled: true },
                      ask_question: { ...formData.widgets_config?.ask_question, enabled: true },
                      counselling: { ...formData.widgets_config?.counselling, enabled: true }
                    }
                  })}
                  className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Enable All
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    widgets_config: {
                      ...formData.widgets_config,
                      apply_now: { ...formData.widgets_config?.apply_now, enabled: false },
                      ask_question: { ...formData.widgets_config?.ask_question, enabled: false },
                      counselling: { ...formData.widgets_config?.counselling, enabled: false },
                      sponsor_ad: { ...formData.widgets_config?.sponsor_ad, enabled: false }
                    }
                  })}
                  className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Disable All
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* SEO & META TAGS SECTION - Using Reusable Component                              */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="SEO & Meta Tags" icon="🏷️" defaultOpen={false} badge="Auto Generate">
          <SeoMetaSection 
            formData={formData} 
            setFormData={setFormData} 
            handleChange={handleChange}
            entityType="course"
          />
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* SEO CONTENT SECTION WITH TOC & TABLES                                           */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <CollapsibleSection title="SEO Content (Detail Page)" icon="🔍" defaultOpen={false} badge={`${formData.seo_toc?.length || 0} sections`}>
          <p className="text-sm text-gray-600 mb-4">
            This content appears on the course detail page for better SEO and user engagement.
          </p>
          
          <div className="space-y-6">
            {/* SEO Intro */}
            <div>
              <label className="block text-sm font-medium mb-1">SEO Intro (Short Preview)</label>
              <SimpleRichTextEditor
                value={formData.seo_intro || ''}
                onChange={(html) => setFormData(prev => ({ ...prev, seo_intro: html }))}
                placeholder="Brief introduction about this course (3-4 lines visible before 'Read More')"
              />
              <p className="text-xs text-gray-500 mt-1">You can change text color and add links</p>
            </div>

            {/* Table of Contents Builder - Advanced Block Editor */}
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
                      • Course Overview<br/>
                      • Eligibility Criteria<br/>
                      • Career Options
                    </div>
                    <p className="text-gray-500 mt-1">User sees this menu and clicks on a topic</p>
                  </div>
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">2. Content Sections (Linked by Anchor ID)</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                      <span className="text-green-600">&lt;section id=&quot;course-overview&quot;&gt;</span><br/>
                      &nbsp;&nbsp;Content here...<br/>
                      <span className="text-green-600">&lt;/section&gt;</span>
                    </div>
                    <p className="text-gray-500 mt-1">Page scrolls to this section when clicked</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  🔗 The <strong>Anchor ID</strong> (e.g., &quot;eligibility&quot;, &quot;career-options&quot;) is the KEY that connects TOC link to content section!
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
                            placeholder="e.g., Course Overview, Eligibility"
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
                            placeholder="course-overview"
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
                              imageTitle: '', alt: '', title: '', caption: '', width: '100%'
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                            🖼️ Image
                          </button>
                          
                          {/* Add Table Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const courseName = formData.name || 'Course';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'table', 
                              title: `${courseName} ${sectionTitle} Details - AdmissionBuddy`, 
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
                              videoTitle: '', title: '', description: ''
                            }];
                            setFormData({...formData, seo_toc: newToc});
                          }} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                            🎬 Video
                          </button>
                          
                          {/* Add List Block */}
                          <button type="button" onClick={() => {
                            const newToc = [...(formData.seo_toc || [])];
                            const courseName = formData.name || 'Course';
                            const sectionTitle = item.title || 'Information';
                            newToc[index].blocks = [...(newToc[index].blocks || []), {
                              id: `block-${Date.now()}`, type: 'list', 
                              title: `${courseName} ${sectionTitle} - AdmissionBuddy`, 
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
                                            uploadingContentImage[`seo-${index}-${blockIndex}`] 
                                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                                          }`}>
                                            {uploadingContentImage[`seo-${index}-${blockIndex}`] ? (
                                              <><FiLoader className="animate-spin" size={18} /> Uploading...</>
                                            ) : (
                                              <><FiUpload size={18} /> Choose File</>
                                            )}
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden" 
                                              disabled={uploadingContentImage[`seo-${index}-${blockIndex}`]}
                                              onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                  const file = e.target.files[0];
                                                  const uploadKey = `seo-${index}-${blockIndex}`;
                                                  setUploadingContentImage(prev => ({ ...prev, [uploadKey]: true }));
                                                  try {
                                                    const fd = new FormData();
                                                    fd.append('file', file);
                                                    const res = await api.post('/upload/image?type=content', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                                                    const newToc = [...(formData.seo_toc || [])];
                                                    newToc[index].blocks[blockIndex].url = res.data.url;
                                                    const courseName = formData.name || 'Course';
                                                    const imageTitle = newToc[index].blocks[blockIndex].imageTitle || 'Image';
                                                    newToc[index].blocks[blockIndex].alt = `${imageTitle} - ${courseName} | AdmissionBuddy`;
                                                    newToc[index].blocks[blockIndex].title = `${imageTitle} - ${courseName} | AdmissionBuddy.co`;
                                                    setFormData({...formData, seo_toc: newToc});
                                                  } finally {
                                                    setUploadingContentImage(prev => ({ ...prev, [uploadKey]: false }));
                                                  }
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
                                          <div className="mt-3">
                                            <img src={block.url} alt={block.alt || ''} className="max-h-32 rounded-lg border" />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                                        <label className="block text-sm font-bold text-yellow-800 mb-2">✏️ Image Title</label>
                                        <input type="text" value={block.imageTitle || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          const imageTitle = e.target.value;
                                          const courseName = formData.name || 'Course';
                                          newToc[index].blocks[blockIndex].imageTitle = imageTitle;
                                          if (imageTitle) {
                                            newToc[index].blocks[blockIndex].alt = `${imageTitle} - ${courseName} | AdmissionBuddy`;
                                            newToc[index].blocks[blockIndex].title = `${imageTitle} - ${courseName} | AdmissionBuddy.co`;
                                          }
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 border-yellow-400 rounded-lg px-3 py-2.5 text-sm font-medium" placeholder="e.g., Course Structure, Lab Equipment" />
                                        <p className="text-xs text-yellow-700 mt-2">💡 Enter image title - SEO Alt & Title will be auto-generated</p>
                                      </div>
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
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Table title for SEO" />
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                          <thead>
                                            <tr>
                                              {(block.headers || []).map((header, hIndex) => (
                                                <th key={hIndex} className="border-2 border-teal-200 bg-teal-50 p-2">
                                                  <input type="text" value={header} onChange={(e) => {
                                                    const newToc = [...(formData.seo_toc || [])];
                                                    newToc[index].blocks[blockIndex].headers[hIndex] = e.target.value;
                                                    setFormData({...formData, seo_toc: newToc});
                                                  }} className="w-full border-0 bg-transparent text-center font-bold text-sm" placeholder={`Header ${hIndex + 1}`} />
                                                </th>
                                              ))}
                                              <th className="border-2 border-teal-200 bg-teal-50 p-2 w-20">
                                                <button type="button" onClick={() => {
                                                  const newToc = [...(formData.seo_toc || [])];
                                                  newToc[index].blocks[blockIndex].headers.push('');
                                                  newToc[index].blocks[blockIndex].rows = newToc[index].blocks[blockIndex].rows.map(row => [...row, '']);
                                                  setFormData({...formData, seo_toc: newToc});
                                                }} className="text-teal-600 hover:bg-teal-100 p-1 rounded">
                                                  <FiPlus size={14} />
                                                </button>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(block.rows || []).map((row, rIndex) => (
                                              <tr key={rIndex}>
                                                {row.map((cell, cIndex) => (
                                                  <td key={cIndex} className="border-2 border-gray-200 p-2">
                                                    <input type="text" value={cell} onChange={(e) => {
                                                      const newToc = [...(formData.seo_toc || [])];
                                                      newToc[index].blocks[blockIndex].rows[rIndex][cIndex] = e.target.value;
                                                      setFormData({...formData, seo_toc: newToc});
                                                    }} className="w-full border-0 text-sm" placeholder="..." />
                                                  </td>
                                                ))}
                                                <td className="border-2 border-gray-200 p-2">
                                                  <button type="button" onClick={() => {
                                                    const newToc = [...(formData.seo_toc || [])];
                                                    newToc[index].blocks[blockIndex].rows = newToc[index].blocks[blockIndex].rows.filter((_, i) => i !== rIndex);
                                                    setFormData({...formData, seo_toc: newToc});
                                                  }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                    <FiTrash2 size={12} />
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          const colCount = newToc[index].blocks[blockIndex].headers.length;
                                          newToc[index].blocks[blockIndex].rows.push(Array(colCount).fill(''));
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="mt-2 text-xs text-teal-600 hover:bg-teal-50 px-2 py-1 rounded flex items-center gap-1">
                                          <FiPlus size={12} /> Add Row
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* VIDEO BLOCK */}
                                  {block.type === 'video' && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">YouTube Video URL</label>
                                        <input type="text" value={block.url || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].url = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="https://youtube.com/watch?v=..." />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Video Title (for SEO)</label>
                                        <input type="text" value={block.videoTitle || ''} onChange={(e) => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].videoTitle = e.target.value;
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="Video title for SEO" />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* LIST BLOCK */}
                                  {block.type === 'list' && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-4 mb-2">
                                        <label className="text-xs font-medium text-gray-700">List Type:</label>
                                        <label className="flex items-center gap-1">
                                          <input type="radio" name={`seo-list-type-${index}-${blockIndex}`} checked={block.listType === 'bullet'} onChange={() => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].listType = 'bullet';
                                            setFormData({...formData, seo_toc: newToc});
                                          }} /> Bullet
                                        </label>
                                        <label className="flex items-center gap-1">
                                          <input type="radio" name={`seo-list-type-${index}-${blockIndex}`} checked={block.listType === 'number'} onChange={() => {
                                            const newToc = [...(formData.seo_toc || [])];
                                            newToc[index].blocks[blockIndex].listType = 'number';
                                            setFormData({...formData, seo_toc: newToc});
                                          }} /> Numbered
                                        </label>
                                      </div>
                                      <div className="space-y-2">
                                        {(block.items || []).map((listItem, liIndex) => (
                                          <div key={liIndex} className="flex items-center gap-2">
                                            <span className="text-gray-400 w-6">{block.listType === 'number' ? `${liIndex + 1}.` : '•'}</span>
                                            <input type="text" value={listItem} onChange={(e) => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items[liIndex] = e.target.value;
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="flex-1 border-2 rounded px-2 py-1 text-sm" placeholder="List item..." />
                                            <button type="button" onClick={() => {
                                              const newToc = [...(formData.seo_toc || [])];
                                              newToc[index].blocks[blockIndex].items = newToc[index].blocks[blockIndex].items.filter((_, i) => i !== liIndex);
                                              setFormData({...formData, seo_toc: newToc});
                                            }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                              <FiTrash2 size={12} />
                                            </button>
                                          </div>
                                        ))}
                                        <button type="button" onClick={() => {
                                          const newToc = [...(formData.seo_toc || [])];
                                          newToc[index].blocks[blockIndex].items.push('');
                                          setFormData({...formData, seo_toc: newToc});
                                        }} className="text-xs text-gray-600 hover:bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                                          <FiPlus size={12} /> Add Item
                                        </button>
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
                    { title: 'Course Overview', anchor: 'course-overview' },
                    { title: 'Eligibility Criteria', anchor: 'eligibility-criteria' },
                    { title: 'Admission Process', anchor: 'admission-process' },
                    { title: 'Fee Structure', anchor: 'fee-structure' },
                    { title: 'Syllabus', anchor: 'syllabus' },
                    { title: 'Career Prospects', anchor: 'career-prospects' },
                    { title: 'Top Colleges', anchor: 'top-colleges' },
                    { title: 'Salary Trends', anchor: 'salary-trends' },
                  ].map(template => (
                    <button
                      key={template.anchor}
                      type="button"
                      onClick={() => {
                        const exists = (formData.seo_toc || []).some(t => t.anchor === template.anchor);
                        if (!exists) {
                          setFormData({
                            ...formData,
                            seo_toc: [...(formData.seo_toc || []), { ...template, blocks: [] }]
                          });
                        }
                      }}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      + {template.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Full Content */}
            <div>
              <label className="block text-sm font-medium mb-1">SEO Full Content</label>
              <SimpleRichTextEditor
                value={formData.seo_full_content || ''}
                onChange={(html) => setFormData(prev => ({ ...prev, seo_full_content: html }))}
                placeholder="Detailed SEO content with formatting..."
              />
              <p className="text-xs text-gray-500 mt-1">You can change text color, add links, and format content</p>
            </div>

            {/* Table Builder */}
            <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800">📊 Table Builder</label>
                  <p className="text-xs text-teal-600">Create tables for fees, comparison, syllabus, etc.</p>
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
                          placeholder="Table Title"
                          className="border rounded px-2 py-1 text-sm w-48"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].headers.push('Column');
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
                          Delete
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
                                    className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 focus:outline-none"
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
                                      className="text-red-500 text-xs"
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
                                    className="w-full border-0 text-sm focus:outline-none px-1"
                                    placeholder="-"
                                  />
                                </td>
                              ))}
                              <td className="border border-teal-200 p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTables = [...(formData.seo_tables || [])];
                                    newTables[tableIndex].rows.splice(rowIndex, 1);
                                    setFormData({...formData, seo_tables: newTables});
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Copy Table HTML */}
                    <button
                      type="button"
                      onClick={() => {
                        const html = `<table class="data-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`;
                        navigator.clipboard.writeText(html);
                        alert('Table HTML copied!');
                      }}
                      className="mt-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                    >
                      📋 Copy Table HTML
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Table Button */}
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      seo_tables: [...(formData.seo_tables || []), { title: '', headers: ['Column 1', 'Column 2'], rows: [['', '']] }]
                    });
                  }}
                  className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1"
                >
                  <FiPlus /> Add Table
                </button>
                {(formData.seo_tables || []).length > 0 && (
                  <button type="button" onClick={() => {
                    const tablesHtml = formData.seo_tables.map(table => {
                      const headerRow = table.headers.map(h => `<th>${h}</th>`).join('');
                      const bodyRows = table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n');
                      return `<table class="data-table">\n  ${table.title ? `<caption>${table.title}</caption>\n  ` : ''}<thead><tr>${headerRow}</tr></thead>\n  <tbody>\n${bodyRows}\n  </tbody>\n</table>`;
                    }).join('\n\n');
                    setFormData({...formData, seo_full_content: (formData.seo_full_content || '') + '\n\n' + tablesHtml});
                    alert('Tables inserted to SEO Full Content!');
                  }} className="text-sm text-green-700 hover:bg-green-100 px-3 py-1.5 rounded border border-green-300 flex items-center gap-1">
                    📥 Insert to Content
                  </button>
                )}
              </div>
            </div>

            {/* SEO Images Gallery */}
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800">🖼️ Image Gallery</label>
                  <p className="text-xs text-blue-600">Add images (alt tags auto-generated)</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {formData.seo_images?.length || 0} images
                </span>
              </div>

              {/* Existing Images */}
              <div className="space-y-3 mb-4">
                {(formData.seo_images || []).map((img, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-blue-200 p-3">
                    <div className="flex items-start gap-3">
                      <img src={img.url} alt={img.alt || ''} className="w-24 h-20 object-cover rounded border flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Title / Caption</label>
                          <input type="text" value={img.caption || ''} onChange={(e) => {
                            const newImages = [...(formData.seo_images || [])];
                            newImages[index].caption = e.target.value;
                            // Auto-generate alt tag from caption with admissionbuddy branding
                            newImages[index].alt = generateAltFromCaption(formData.name, e.target.value);
                            setFormData({...formData, seo_images: newImages});
                          }} placeholder="Enter caption (alt tag auto-generates)" className="w-full border rounded px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Alt Tag <span className="text-green-600">(auto from caption)</span></label>
                          <input type="text" value={img.alt || ''} readOnly className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-600" />
                        </div>
                      </div>
                      <button type="button" onClick={() => {
                        setFormData({...formData, seo_images: (formData.seo_images || []).filter((_, i) => i !== index)});
                      }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload New Image */}
              <label className={`flex items-center justify-center gap-2 h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors mb-3 ${uploadingSeoImage ? 'opacity-50' : ''}`}>
                {uploadingSeoImage ? (
                  <FiLoader className="animate-spin text-blue-500" size={20} />
                ) : (
                  <>
                    <FiUpload className="text-blue-400" size={18} />
                    <span className="text-sm text-blue-600">Upload Image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadingSeoImage(true);
                    try {
                      const fd = new FormData();
                      fd.append('file', file);
                      const res = await api.post('/upload/image?type=content', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                      const autoAlt = generateAltTag(formData.name, 'SEO image', formData.seo_images?.length || 0);
                      setFormData({...formData, seo_images: [...(formData.seo_images || []), { url: res.data.url, caption: '', alt: autoAlt }]});
                    } finally {
                      setUploadingSeoImage(false);
                    }
                  }
                }} disabled={uploadingSeoImage} />
              </label>

              {/* URL Input for Image */}
              <div className="flex gap-2">
                <input type="text" placeholder="Or paste image URL" className="flex-1 border rounded px-3 py-2 text-sm" id="seo-image-url-input" />
                <button type="button" onClick={() => {
                  const input = document.getElementById('seo-image-url-input');
                  if (input.value) {
                    const autoAlt = generateAltTag(formData.name, 'SEO image', formData.seo_images?.length || 0);
                    setFormData({...formData, seo_images: [...(formData.seo_images || []), { url: input.value, caption: '', alt: autoAlt }]});
                    input.value = '';
                  }
                }} className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Add</button>
              </div>
            </div>

            {/* SEO Videos Gallery */}
            <div className="border-2 border-rose-300 rounded-lg p-4 bg-rose-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-rose-800">🎬 Video Gallery</label>
                  <p className="text-xs text-rose-600">Add video URLs (alt tags auto-generated)</p>
                </div>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded">
                  {formData.seo_videos?.length || 0} videos
                </span>
              </div>

              {/* Existing Videos */}
              {(formData.seo_videos || []).length > 0 && (
                <div className="space-y-3 mb-4">
                  {(formData.seo_videos || []).map((vid, index) => (
                    <div key={index} className="bg-white rounded-lg border-2 border-rose-200 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-16 h-14 bg-gray-900 rounded-lg flex-shrink-0">
                          <FiVideo className="text-white" size={22} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Video Title</label>
                              <input type="text" value={vid.title || ''} onChange={(e) => {
                                const newVideos = [...(formData.seo_videos || [])];
                                newVideos[index].title = e.target.value;
                                // Auto-generate alt tag from title with admissionbuddy branding
                                newVideos[index].alt = generateAltFromCaption(formData.name, e.target.value);
                                setFormData({...formData, seo_videos: newVideos});
                              }} placeholder="Enter title (alt auto-generates)" className="w-full border rounded px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Alt Tag <span className="text-green-600">(auto from title)</span></label>
                              <input type="text" value={vid.alt || ''} readOnly className="w-full border rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Video URL</label>
                            <input type="text" value={vid.url || ''} onChange={(e) => {
                              const newVideos = [...(formData.seo_videos || [])];
                              newVideos[index].url = e.target.value;
                              setFormData({...formData, seo_videos: newVideos});
                            }} placeholder="YouTube/Video URL" className="w-full border rounded px-2 py-1.5 text-sm font-mono" />
                          </div>
                        </div>
                        <button type="button" onClick={() => {
                          setFormData({...formData, seo_videos: (formData.seo_videos || []).filter((_, i) => i !== index)});
                        }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Video URL */}
              <div className="flex gap-2">
                <input type="text" placeholder="Paste YouTube or video URL" className="flex-1 border-2 border-rose-200 rounded-lg px-3 py-2 text-sm" id="seo-video-url-input" />
                <button type="button" onClick={() => {
                  const input = document.getElementById('seo-video-url-input');
                  if (input.value) {
                    const autoAlt = generateVideoAlt(formData.name, 'SEO', formData.seo_videos?.length || 0);
                    setFormData({...formData, seo_videos: [...(formData.seo_videos || []), { url: input.value, title: '', alt: autoAlt }]});
                    input.value = '';
                  }
                }} className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 flex items-center gap-2">
                  <FiPlus size={16} /> Add Video
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Submit Buttons with Auto-save Status */}
        <div className="bg-white rounded-lg shadow p-4 sticky bottom-4 border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-blue-600">
                  <FiLoader className="animate-spin" size={14} />
                  Auto-saving...
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-green-600">
                  <FiCheck size={14} />
                  Auto-saved
                </span>
              )}
              {autoSaveStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-600">
                  <FiX size={14} />
                  Auto-save failed
                </span>
              )}
              {lastAutoSave && !autoSaveStatus && (
                <span className="text-gray-500 text-xs">
                  Last saved: {lastAutoSave.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/courses-detail')}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSaveDraft}
                disabled={savingDraft || saving}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <FiSave className="mr-2" />
                {savingDraft ? 'Saving Draft...' : 'Save as Draft'}
              </Button>
              <Button type="submit" disabled={saving || savingDraft} className="bg-orange-600 hover:bg-orange-700">
                <FiSave className="mr-2" />
                {saving ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseDetailForm;
