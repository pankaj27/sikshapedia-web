import React from 'react';
import GenericManagement from './GenericManagement';

const FAQsManagement = () => {
  const fields = [
    { key: 'question', label: 'Question', type: 'textarea', required: true, rows: 2 },
    { key: 'answer', label: 'Answer', type: 'textarea', required: true, rows: 5 },
    { 
      key: 'category', 
      label: 'Category', 
      type: 'select',
      required: true,
      options: [
        { value: 'Admission', label: 'Admission' },
        { value: 'Fees', label: 'Fees' },
        { value: 'Courses', label: 'Courses' },
        { value: 'Exams', label: 'Exams' },
        { value: 'Placement', label: 'Placement' },
        { value: 'General', label: 'General' },
      ]
    },
    { 
      key: 'page', 
      label: 'Page', 
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General' },
        { value: 'college', label: 'College' },
        { value: 'course', label: 'Course' },
        { value: 'exam', label: 'Exam' },
      ]
    },
    { key: 'display_order', label: 'Display Order', type: 'number', required: true },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'question', label: 'Question', render: (value) => value?.substring(0, 80) + '...' },
    { key: 'category', label: 'Category' },
    { key: 'page', label: 'Page' },
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
      title="FAQs"
      endpoint="faqs"
      fields={fields}
      displayFields={displayFields}
      searchField="question"
    />
  );
};

export default FAQsManagement;