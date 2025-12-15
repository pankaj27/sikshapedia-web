import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import GenericManagement from './GenericManagement';

const CommentsManagement = () => {
  const fields = [
    { key: 'user_id', label: 'User ID', type: 'text', required: true },
    { 
      key: 'entity_type', 
      label: 'Entity Type', 
      type: 'select',
      required: true,
      options: [
        { value: 'college', label: 'College' },
        { value: 'course', label: 'Course' },
        { value: 'exam', label: 'Exam' },
        { value: 'news', label: 'News' },
      ]
    },
    { key: 'entity_id', label: 'Entity ID', type: 'text', required: true },
    { key: 'comment', label: 'Comment', type: 'textarea', required: true, rows: 4 },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ]
    },
  ];

  const displayFields = [
    { key: 'entity_type', label: 'Type' },
    { 
      key: 'comment', 
      label: 'Comment',
      render: (value) => value?.substring(0, 100) + (value?.length > 100 ? '...' : '')
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'created_at', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
  ];

  return (
    <GenericManagement
      title="Comments"
      endpoint="comments"
      fields={fields}
      displayFields={displayFields}
      searchField="comment"
    />
  );
};

export default CommentsManagement;