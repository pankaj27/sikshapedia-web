import React from 'react';
import GenericManagement from './GenericManagement';

const TestimonialsManagement = () => {
  const fields = [
    { key: 'student_name', label: 'Student Name', type: 'text', required: true },
    { key: 'college_name', label: 'College Name', type: 'text', required: true },
    { key: 'course', label: 'Course', type: 'text', required: true },
    { key: 'image_url', label: 'Student Image URL', type: 'url' },
    { key: 'testimonial', label: 'Testimonial', type: 'textarea', required: true, rows: 5 },
    { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true, step: '0.1', min: '1', max: '5' },
    { key: 'is_featured', label: 'Featured', type: 'checkbox' },
    { key: 'display_order', label: 'Display Order', type: 'number', required: true },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'student_name', label: 'Student' },
    { key: 'college_name', label: 'College' },
    { key: 'course', label: 'Course' },
    { key: 'rating', label: 'Rating', render: (value) => `${value}/5` },
    { 
      key: 'is_featured', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value ? 'Featured' : 'Regular'}
        </span>
      )
    },
  ];

  return (
    <GenericManagement
      title="Testimonials"
      endpoint="testimonials"
      fields={fields}
      displayFields={displayFields}
      searchField="student_name"
    />
  );
};

export default TestimonialsManagement;