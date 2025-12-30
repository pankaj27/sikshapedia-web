import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSend, FiImage, FiVideo, FiList, FiGrid, FiSettings, FiSearch, FiPlus, FiTrash2, FiMove, FiEye, FiUpload, FiBold, FiItalic, FiUnderline, FiLink, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';
import { generateSlug } from '../../utils/slugify';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import useAutoSaveDraft from '../../hooks/useAutoSaveDraft';
import DraftRestoreBanner, { AutoSaveIndicator } from '../../components/admin/DraftRestoreBanner';

// Tiptap Rich Text Editor imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';

import { Link } from '../../components/CustomLink';

// Rich Text Toolbar Component
const RichTextToolbar = ({ editor, showTableOptions = false, showImageOption = false }) => {
  if (!editor) return null;

  const COLORS = ['#000000', '#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed'];

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
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
        <FiUnderline size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* Colors */}
      {COLORS.map(color => (
        <button key={color} type="button"
          onClick={() => editor.chain().focus().setColor(color).run()}
          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
          title={`Color: ${color}`}
        />
      ))}

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* Link */}
      <button type="button" onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Add Link">
        <FiLink size={16} />
      </button>

      {/* Image */}
      {showImageOption && (
        <button type="button" onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Add Image">
          <FiImage size={16} />
        </button>
      )}

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Heading 2">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Heading 3">
        H3
      </button>

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
        <span className="text-sm font-bold">1.</span>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* Text Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Align Left">
        <FiAlignLeft size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Align Center">
        <FiAlignCenter size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Align Right">
        <FiAlignRight size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}`}
        title="Justify">
        <FiAlignJustify size={16} />
      </button>

      {/* Table Options */}
      {showTableOptions && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
          
          <button type="button" onClick={insertTable}
            className="p-2 rounded hover:bg-gray-200 flex items-center gap-1 text-xs"
            title="Insert Table">
            <FiGrid size={16} /> Table
          </button>
          
          {editor.isActive('table') && (
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-gray-300">
              <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-1 text-xs rounded hover:bg-green-100 text-green-700 border border-green-300"
                title="Add Column">
                + Col
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-700 border border-red-300"
                title="Delete Column">
                - Col
              </button>
              <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-1 text-xs rounded hover:bg-green-100 text-green-700 border border-green-300"
                title="Add Row">
                + Row
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-700 border border-red-300"
                title="Delete Row">
                - Row
              </button>
              <button type="button" onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-700 border border-red-300"
                title="Delete Table">
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Rich Text Editor with Table & Image Support
const RichTextEditorWithTable = ({ value, onChange, placeholder, minHeight = '150px', showImage = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
      <RichTextToolbar editor={editor} showTableOptions={true} showImageOption={showImage} />
      <style>{`
        .rich-editor .ProseMirror table {
          border-collapse: collapse;
          margin: 1em 0;
          width: 100%;
        }
        .rich-editor .ProseMirror th,
        .rich-editor .ProseMirror td {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
          min-width: 80px;
        }
        .rich-editor .ProseMirror th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .rich-editor .ProseMirror tr:hover td {
          background-color: #f9fafb;
        }
        .rich-editor .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .rich-editor .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .rich-editor .ProseMirror li {
          margin: 0.25em 0;
        }
        .rich-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 8px;
        }
        .rich-editor .ProseMirror p {
          margin: 0.5em 0;
        }
        .rich-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      <div className="rich-editor">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-3 focus:outline-none"
          style={{ minHeight }}
        />
      </div>
      {placeholder && !value && (
        <div className="text-gray-400 text-sm px-3 pb-2 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: FiSettings },
  { id: 'media', label: 'Media', icon: FiImage },
  { id: 'content', label: 'Content', icon: FiList },
  { id: 'toc', label: 'TOC', icon: FiList },
  { id: 'tables', label: 'Tables', icon: FiGrid },
  { id: 'widgets', label: 'Widgets', icon: FiGrid },
  { id: 'seo', label: 'SEO', icon: FiSearch },
];

const CATEGORIES = ['Admission', 'Exams', 'Results', 'Events', 'Policy', 'College News', 'Latest Alerts'];

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Admission',
    summary: '',
    content: '',
    
    // Media
    featured_image: '',
    featured_image_alt: '',
    video_url: '',
    video_thumbnail: '',
    gallery_images: [],
    
    // Author (from team)
    author_id: '', // Team member ID
    author: '',
    author_image: '',
    author_designation: '',
    
    // TOC
    toc_enabled: false,
    toc_items: [],
    
    // Tables
    tables: [],
    
    // Widgets
    show_related_articles: true,
    show_related_exams: true,
    show_related_colleges: true,
    show_newsletter: true,
    show_cta_banner: false,
    cta_banner: { title: '', subtitle: '', button_text: '', button_link: '', gradient: 'from-orange-500 to-red-500' },
    
    // Tags & Related
    tags: [],
    related_colleges: [],
    related_exams: [],
    related_articles: [],
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    canonical_url: '',
    og_image: '',
    auto_generate_seo: true,
    schema_type: 'NewsArticle',
    
    // Status
    published: true,
    featured: false,
    display_priority: 0,
    status: 'draft'
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Auto-save draft hook - only enabled for new entries (not editing)
  const {
    saveDraft: saveNewsDraft,
    clearDraft: clearNewsDraft,
    restoreDraft: restoreNewsDraft,
    getDraftInfo: getNewsDraftInfo,
    lastSaved: newsDraftLastSaved,
    hasDraft: hasNewsDraft
  } = useAutoSaveDraft('news_draft_new', formData, setFormData, 10000, !isEdit);

  // Check for existing draft on mount
  useEffect(() => {
    if (!isEdit && hasNewsDraft) {
      setShowDraftBanner(true);
    }
  }, [isEdit, hasNewsDraft]);

  // Handle draft restore
  const handleRestoreNewsDraft = () => {
    restoreNewsDraft();
    setShowDraftBanner(false);
  };

  // Handle draft discard
  const handleDiscardNewsDraft = () => {
    clearNewsDraft();
    setShowDraftBanner(false);
  };

  // Auto-fill author from current logged-in user
  useEffect(() => {
    if (user && !isEdit) {
      setFormData(prev => ({
        ...prev,
        author_id: user.id,
        author: user.name || user.email,
        author_image: user.profile_photo || '',
        author_designation: user.job_title || user.role || 'Content Writer'
      }));
    }
  }, [user, isEdit]);

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  // Auto-generate slug from title
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  
  useEffect(() => {
    if (!isEdit && formData.title && !slugManuallyEdited) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, isEdit, slugManuallyEdited]);

  // Auto-generate SEO fields
  useEffect(() => {
    if (formData.auto_generate_seo && formData.title) {
      const autoSeo = {};
      // Always update meta_title when title changes (if auto-generate is on)
      const newMetaTitle = `${formData.title} | Education News | Admissionbuddy`;
      if (formData.meta_title !== newMetaTitle) {
        autoSeo.meta_title = newMetaTitle;
      }
      // Update meta_description from summary
      if (formData.summary) {
        const newMetaDesc = formData.summary.slice(0, 160);
        if (formData.meta_description !== newMetaDesc) {
          autoSeo.meta_description = newMetaDesc;
        }
      }
      // Update alt tag
      const newAlt = `${formData.title} | News | Admissionbuddy`;
      if (formData.featured_image_alt !== newAlt) {
        autoSeo.featured_image_alt = newAlt;
      }
      // Update OG image
      if (formData.featured_image && !formData.og_image) {
        autoSeo.og_image = formData.featured_image;
      }
      if (Object.keys(autoSeo).length > 0) {
        setFormData(prev => ({ ...prev, ...autoSeo }));
      }
    }
  }, [formData.title, formData.summary, formData.featured_image, formData.auto_generate_seo]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news/${id}`);
      setFormData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = { ...formData };
      if (isEdit) {
        await api.put(`/news/${id}`, dataToSave);
      } else {
        await api.post('/news', dataToSave);
        // Clear draft after successful creation
        clearNewsDraft();
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news');
    } finally {
      setSaving(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file, field) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const response = await api.post('/upload/image?type=content', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleChange(field, response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Please use a URL instead.');
    }
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    handleChange('tags', formData.tags.filter((_, i) => i !== index));
  };

  // Keyword management
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...formData.meta_keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    handleChange('meta_keywords', formData.meta_keywords.filter((_, i) => i !== index));
  };

  // TOC management
  const addTocItem = () => {
    handleChange('toc_items', [...formData.toc_items, { id: `section-${Date.now()}`, title: '', level: 1 }]);
  };

  const updateTocItem = (index, field, value, extraField = null, extraValue = null) => {
    const newItems = [...formData.toc_items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (extraField && extraValue !== null) {
      newItems[index][extraField] = extraValue;
    }
    handleChange('toc_items', newItems);
  };

  const removeTocItem = (index) => {
    handleChange('toc_items', formData.toc_items.filter((_, i) => i !== index));
  };

  // Table management
  const addTable = () => {
    handleChange('tables', [...formData.tables, {
      title: 'New Table',
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']],
      style: 'default'
    }]);
  };

  const updateTable = (tableIndex, field, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex] = { ...newTables[tableIndex], [field]: value };
    handleChange('tables', newTables);
  };

  const addTableColumn = (tableIndex) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].headers.push('New Column');
    newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => [...row, '']);
    handleChange('tables', newTables);
  };

  const addTableRow = (tableIndex) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
    handleChange('tables', newTables);
  };

  const updateTableCell = (tableIndex, rowIndex, colIndex, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].rows[rowIndex][colIndex] = value;
    handleChange('tables', newTables);
  };

  const updateTableHeader = (tableIndex, colIndex, value) => {
    const newTables = [...formData.tables];
    newTables[tableIndex].headers[colIndex] = value;
    handleChange('tables', newTables);
  };

  const removeTable = (tableIndex) => {
    handleChange('tables', formData.tables.filter((_, i) => i !== tableIndex));
  };

  // Gallery image management
  const addGalleryImage = () => {
    handleChange('gallery_images', [...formData.gallery_images, { url: '', alt: '', caption: '' }]);
  };

  const updateGalleryImage = (index, field, value) => {
    const newImages = [...formData.gallery_images];
    newImages[index] = { ...newImages[index], [field]: value };
    handleChange('gallery_images', newImages);
  };

  const removeGalleryImage = (index) => {
    handleChange('gallery_images', formData.gallery_images.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/news" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit News Article' : 'Create News Article'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {isEdit && formData.status && (
                <StatusBadge status={formData.status} />
              )}
              {/* Auto-save indicator */}
              {!isEdit && <AutoSaveIndicator lastSaved={newsDraftLastSaved} />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.open(`/news/${formData.slug}`, '_blank')} disabled={!formData.slug}>
            <FiEye className="mr-2" /> Preview
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save News'}
          </Button>
        </div>
      </div>

      {/* Draft Restore Banner - Only show for new entries */}
      {!isEdit && showDraftBanner && (
        <div className="mb-4">
          <DraftRestoreBanner
            onRestore={handleRestoreNewsDraft}
            onDiscard={handleDiscardNewsDraft}
            savedAt={getNewsDraftInfo()?.savedAt}
            isVisible={showDraftBanner}
          />
        </div>
      )}

      <div className="flex bg-gray-50 -mx-6 -mb-6 p-6">
        {/* Sidebar Tabs */}
        <aside className="w-56 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Form */}
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">📝 Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Enter news title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          handleChange('slug', e.target.value);
                          setSlugManuallyEdited(true);
                        }}
                        className="w-full border rounded-lg px-4 py-2.5 bg-gray-50"
                        placeholder="auto-generated-from-title"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL: /news/{formData.slug || 'slug'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          <option value="draft">Draft</option>
                          <option value="pending">Pending Review</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Summary * 
                        <span className="text-xs text-orange-500 ml-2">
                          Rich text editor with bullet, image, link, justify, table (add/delete column and row)
                        </span>
                      </label>
                      <RichTextEditorWithTable
                        value={formData.summary}
                        onChange={(value) => handleChange('summary', value)}
                        placeholder="Brief summary of the news article"
                        minHeight="120px"
                        showImage={true}
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 border rounded-lg px-4 py-2"
                          placeholder="Add a tag"
                        />
                        <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            #{tag}
                            <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => handleChange('featured', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Featured Article</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => handleChange('published', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                      <div className="flex items-center gap-2 ml-4">
                        <label className="text-sm text-gray-600">Display Priority:</label>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={formData.display_priority || 0}
                          onChange={(e) => handleChange('display_priority', parseInt(e.target.value) || 0)}
                          className="w-16 border rounded px-2 py-1 text-sm text-center"
                          title="Lower number = appears first. 0 = no priority"
                        />
                        <span className="text-xs text-gray-400">(0=none, lower=first)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🖼️ Featured Image</h2>
                  <div className="space-y-4">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, 'featured_image');
                            // Auto-generate alt from title if not set
                            if (!formData.featured_image_alt && formData.title) {
                              handleChange('featured_image_alt', formData.title);
                            }
                          }
                        }}
                        className="hidden"
                        id="featured-image-upload"
                      />
                      <label htmlFor="featured-image-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </label>
                    </div>

                    {/* Or use URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or enter URL</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={formData.featured_image || ''}
                        onChange={(e) => handleChange('featured_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.featured_image && (
                      <div className="relative group">
                        <img src={formData.featured_image} alt={formData.featured_image_alt || 'Preview'} className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('featured_image', '');
                            handleChange('featured_image_alt', '');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Alt Text with Auto-Generate */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Alt Text (SEO)</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.title) {
                              const autoAlt = `${formData.title} - ${formData.category} News | Admissionbuddy`;
                              handleChange('featured_image_alt', autoAlt.substring(0, 125));
                            } else {
                              alert('Please enter a title first to auto-generate alt text');
                            }
                          }}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          ⚡ Auto-Generate from Title
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.featured_image_alt || ''}
                        onChange={(e) => handleChange('featured_image_alt', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Descriptive alt text for accessibility & SEO"
                        maxLength={125}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Helps with SEO and accessibility</p>
                        <span className={`text-xs ${(formData.featured_image_alt?.length || 0) > 100 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {formData.featured_image_alt?.length || 0}/125
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🎬 Video</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                      <input
                        type="url"
                        value={formData.video_url || ''}
                        onChange={(e) => {
                          let url = e.target.value;
                          // Auto-convert YouTube URLs to embed format
                          if (url.includes('youtube.com/watch?v=')) {
                            const videoId = url.split('v=')[1]?.split('&')[0];
                            if (videoId) url = `https://www.youtube.com/embed/${videoId}`;
                          } else if (url.includes('youtu.be/')) {
                            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                            if (videoId) url = `https://www.youtube.com/embed/${videoId}`;
                          } else if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
                            const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                            if (videoId) url = `https://player.vimeo.com/video/${videoId}`;
                          }
                          handleChange('video_url', url);
                        }}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Paste any YouTube or Vimeo URL"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supports: youtube.com/watch, youtu.be, vimeo.com (auto-converts to embed)
                      </p>
                    </div>
                    {formData.video_url && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={formData.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail</label>
                      <input
                        type="url"
                        value={formData.video_thumbnail || ''}
                        onChange={(e) => handleChange('video_thumbnail', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Custom thumbnail URL (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">📸 Image Gallery</h2>
                    <Button type="button" variant="outline" onClick={addGalleryImage}>
                      <FiPlus className="mr-2" /> Add Image
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.gallery_images.map((img, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium">Image #{idx + 1}</span>
                          <button type="button" onClick={() => removeGalleryImage(idx)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 />
                          </button>
                        </div>
                        
                        {/* Upload or URL option */}
                        <div className="mb-3">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);
                                  try {
                                    const response = await api.post('/upload/image?type=content', formDataUpload, {
                                      headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    updateGalleryImage(idx, 'url', response.data.url);
                                  } catch (error) {
                                    console.error('Upload failed:', error);
                                    alert('Upload failed. Please use URL instead.');
                                  }
                                }
                              }}
                              id={`gallery-upload-${idx}`}
                              className="hidden"
                            />
                            <label 
                              htmlFor={`gallery-upload-${idx}`} 
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                            >
                              <FiUpload className="text-orange-500" />
                              <span className="text-sm text-orange-600 font-medium">Upload Image</span>
                            </label>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>or paste URL:</span>
                          </div>
                          <input
                            type="url"
                            value={img.url}
                            onChange={(e) => updateGalleryImage(idx, 'url', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm mt-1"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={img.alt}
                              onChange={(e) => updateGalleryImage(idx, 'alt', e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Alt text (SEO)"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={img.caption}
                              onChange={(e) => updateGalleryImage(idx, 'caption', e.target.value)}
                              className="w-full border rounded px-3 py-2 text-sm"
                              placeholder="Caption"
                            />
                          </div>
                        </div>
                        {img.url && (
                          <img src={img.url} alt={img.alt} className="mt-3 w-full h-32 object-cover rounded border" />
                        )}
                      </div>
                    ))}
                    {formData.gallery_images.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No gallery images added</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">📄 Article Content</h2>
                
                {/* TOC Headings Helper */}
                {formData.toc_enabled && formData.toc_items?.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-800">📑 TOC Sections Detected</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          // Generate headings from TOC items
                          const headings = formData.toc_items.map(item => {
                            const id = item.id || item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            return `<h2 id="${id}">${item.title}</h2>\n<p>Content for ${item.title} section...</p>`;
                          }).join('\n\n');
                          
                          // Append to existing content or set new
                          const newContent = formData.content ? formData.content + '\n\n' + headings : headings;
                          handleChange('content', newContent);
                        }}
                      >
                        Insert TOC Headings
                      </Button>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Click "Insert TOC Headings" to auto-generate section headings with correct IDs.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.toc_items.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {item.title} → id="{item.id || item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                      <span className="text-xs text-orange-500 ml-2">
                        Rich text editor with all formatting options
                      </span>
                    </label>
                    <RichTextEditorWithTable
                      value={formData.content}
                      onChange={(value) => handleChange('content', value)}
                      placeholder="Write your article content here..."
                      minHeight="400px"
                      showImage={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TOC Tab */}
            {activeTab === 'toc' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">📑 Table of Contents</h2>
                    <p className="text-sm text-gray-500">Add sections for easy navigation on frontend</p>
                  </div>
                  <label className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                    <input
                      type="checkbox"
                      checked={formData.toc_enabled}
                      onChange={(e) => handleChange('toc_enabled', e.target.checked)}
                      className="rounded text-orange-500"
                    />
                    <span className="text-sm font-medium text-orange-700">Enable TOC</span>
                  </label>
                </div>
                
                {formData.toc_enabled && (
                  <div className="space-y-3">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Simple:</strong> Just enter section names. IDs will be auto-generated!
                      </p>
                    </div>
                    
                    {formData.toc_items.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                        <p className="text-gray-500 mb-2">No sections added yet</p>
                        <p className="text-sm text-gray-400">Click the button below to add sections</p>
                      </div>
                    ) : (
                      formData.toc_items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                            {idx + 1}
                          </div>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              const newId = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `section-${idx + 1}`;
                              updateTocItem(idx, 'title', newTitle, 'id', newId);
                            }}
                            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-base focus:border-orange-400 focus:ring-0"
                            placeholder="Enter section name (e.g., Introduction, Features, FAQ)"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeTocItem(idx)} 
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addTocItem} 
                      className="w-full border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 py-3"
                    >
                      <FiPlus className="mr-2" /> Add New Section
                    </Button>
                    
                    {/* Preview */}
                    {formData.toc_items.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Preview:</h4>
                        <ul className="space-y-1">
                          {formData.toc_items.map((item, idx) => (
                            <li key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                              • {item.title || `Section ${idx + 1}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">📊 Data Tables</h2>
                  <Button type="button" variant="outline" onClick={addTable}>
                    <FiPlus className="mr-2" /> Add Table
                  </Button>
                </div>
                
                {formData.tables.map((table, tableIdx) => (
                  <div key={tableIdx} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={table.title}
                        onChange={(e) => updateTable(tableIdx, 'title', e.target.value)}
                        className="text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none"
                        placeholder="Table Title"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={table.style}
                          onChange={(e) => updateTable(tableIdx, 'style', e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="default">Default</option>
                          <option value="striped">Striped</option>
                          <option value="bordered">Bordered</option>
                        </select>
                        <button type="button" onClick={() => removeTable(tableIdx)} className="text-red-500">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            {table.headers.map((header, colIdx) => (
                              <th key={colIdx} className="border bg-gray-100 p-2">
                                <input
                                  type="text"
                                  value={header}
                                  onChange={(e) => updateTableHeader(tableIdx, colIdx, e.target.value)}
                                  className="w-full bg-transparent text-center font-semibold outline-none"
                                  placeholder="Header"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, colIdx) => (
                                <td key={colIdx} className="border p-2">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => updateTableCell(tableIdx, rowIdx, colIdx, e.target.value)}
                                    className="w-full bg-transparent outline-none"
                                    placeholder="Cell"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => addTableColumn(tableIdx)}>
                        + Column
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addTableRow(tableIdx)}>
                        + Row
                      </Button>
                    </div>
                  </div>
                ))}
                
                {formData.tables.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                    <FiGrid className="mx-auto mb-2" size={32} />
                    <p>No tables added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Widgets Tab */}
            {activeTab === 'widgets' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🧩 Sidebar Widgets</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_articles}
                        onChange={(e) => handleChange('show_related_articles', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Articles</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_exams}
                        onChange={(e) => handleChange('show_related_exams', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Exams</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_related_colleges}
                        onChange={(e) => handleChange('show_related_colleges', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Related Colleges</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.show_newsletter}
                        onChange={(e) => handleChange('show_newsletter', e.target.checked)}
                        className="rounded"
                      />
                      <span>Show Newsletter Signup</span>
                    </label>
                  </div>
                </div>

                {/* Related Content */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">🔗 Related Content</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Exams (comma separated)</label>
                      <input
                        type="text"
                        value={formData.related_exams.join(', ')}
                        onChange={(e) => handleChange('related_exams', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="JEE Main, NEET, CAT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Colleges (comma separated)</label>
                      <input
                        type="text"
                        value={formData.related_colleges.join(', ')}
                        onChange={(e) => handleChange('related_colleges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="IIT Delhi, IIT Bombay"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">📢 CTA Banner</h2>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.show_cta_banner}
                        onChange={(e) => handleChange('show_cta_banner', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  </div>
                  {formData.show_cta_banner && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.cta_banner?.title || ''}
                        onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, title: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="CTA Title"
                      />
                      <input
                        type="text"
                        value={formData.cta_banner?.subtitle || ''}
                        onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, subtitle: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="CTA Subtitle"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.cta_banner?.button_text || ''}
                          onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, button_text: e.target.value })}
                          className="border rounded-lg px-4 py-2.5"
                          placeholder="Button Text"
                        />
                        <input
                          type="text"
                          value={formData.cta_banner?.button_link || ''}
                          onChange={(e) => handleChange('cta_banner', { ...formData.cta_banner, button_link: e.target.value })}
                          className="border rounded-lg px-4 py-2.5"
                          placeholder="Button Link"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">🔍 SEO Settings</h2>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.auto_generate_seo}
                        onChange={(e) => handleChange('auto_generate_seo', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Auto-generate from content</span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title || ''}
                        onChange={(e) => handleChange('meta_title', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="SEO title (auto-generated if empty)"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={formData.meta_description || ''}
                        onChange={(e) => handleChange('meta_description', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        rows="3"
                        placeholder="SEO description (auto-generated from summary if empty)"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          className="flex-1 border rounded-lg px-4 py-2"
                          placeholder="Add keyword"
                        />
                        <Button type="button" variant="outline" onClick={addKeyword}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.meta_keywords || []).map((kw, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {kw}
                            <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={formData.og_image || ''}
                        onChange={(e) => handleChange('og_image', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Social sharing image (uses featured image if empty)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={formData.canonical_url || ''}
                        onChange={(e) => handleChange('canonical_url', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                        placeholder="Leave empty to use default URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
                      <select
                        value={formData.schema_type}
                        onChange={(e) => handleChange('schema_type', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5"
                      >
                        <option value="NewsArticle">News Article</option>
                        <option value="BlogPosting">Blog Post</option>
                        <option value="Article">Article</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">👁️ Search Preview</h2>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.meta_title || formData.title || 'Page Title'}
                    </p>
                    <p className="text-green-700 text-sm">
                      {window.location.origin}/news/{formData.slug || 'slug'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.meta_description || formData.summary || 'Meta description will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </form>
        </main>
      </div>
    </AdminLayout>
  );
};

export default NewsForm;
