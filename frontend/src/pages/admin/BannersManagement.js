import React from 'react';
import GenericManagement from './GenericManagement';

const BannersManagement = () => {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'image_url', label: 'Image URL', type: 'url', required: true },
    { key: 'link_url', label: 'Link URL', type: 'url' },
    { key: 'button_text', label: 'Button Text', type: 'text' },
    { 
      key: 'position', 
      label: 'Position', 
      type: 'select',
      required: true,
      options: [
        { value: 'home', label: 'Homepage' },
        { value: 'colleges', label: 'Colleges Page' },
        { value: 'courses', label: 'Courses Page' },
        { value: 'exams', label: 'Exams Page' },
      ]
    },
    { key: 'display_order', label: 'Display Order', type: 'number', required: true },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'title', label: 'Title' },
    { key: 'position', label: 'Position' },
    { key: 'display_order', label: 'Order' },
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
      title="Banners & Sliders"
      endpoint="banners"
      fields={fields}
      displayFields={displayFields}
      searchField="title"
    />
  );
};

export default BannersManagement;