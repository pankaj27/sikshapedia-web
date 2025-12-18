import React from 'react';
import GenericManagement from './GenericManagement';

const StudyMaterialsManagement = () => {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'exam_name', label: 'Exam Name', type: 'text', required: true },
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { 
      key: 'material_type', 
      label: 'Material Type', 
      type: 'select',
      required: true,
      options: [
        { value: 'Notes', label: 'Notes' },
        { value: 'Sample Paper', label: 'Sample Paper' },
        { value: 'Previous Year', label: 'Previous Year Paper' },
        { value: 'Mock Test', label: 'Mock Test' },
        { value: 'Video', label: 'Video Lecture' },
      ]
    },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'file_url', label: 'File URL', type: 'url' },
    { key: 'external_link', label: 'External Link', type: 'url' },
    { key: 'thumbnail', label: 'Thumbnail URL', type: 'url' },
    { key: 'author', label: 'Author/Source', type: 'text' },
    { key: 'pages', label: 'Number of Pages', type: 'number' },
    { key: 'duration', label: 'Duration (for videos)', type: 'text' },
    { key: 'is_premium', label: 'Premium Content', type: 'checkbox' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'title', label: 'Title' },
    { key: 'exam_name', label: 'Exam' },
    { key: 'subject', label: 'Subject' },
    { key: 'material_type', label: 'Type' },
    { 
      key: 'is_premium', 
      label: 'Premium',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? '⭐ Premium' : 'Free'}
        </span>
      )
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <GenericManagement
      title="Study Materials"
      endpoint="study-materials"
      fields={fields}
      displayFields={displayFields}
      searchField="title"
    />
  );
};

export default StudyMaterialsManagement;
