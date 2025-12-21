import React from 'react';
import GenericManagement from './GenericManagement';

const ContactInquiriesManagement = () => {
  const fields = [
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select',
      required: true,
      options: [
        { value: 'new', label: 'New' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
      ]
    },
    { 
      key: 'admin_comment', 
      label: 'Admin Comment / Response', 
      type: 'textarea',
      required: false,
      placeholder: 'Enter your response or notes about this inquiry...'
    },
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'message', 
      label: 'Question',
      render: (value) => value?.substring(0, 50) + (value?.length > 50 ? '...' : '')
    },
    { 
      key: 'admin_comment', 
      label: 'Response',
      render: (value) => value ? (
        <span className="text-green-700">{value.substring(0, 40)}{value.length > 40 ? '...' : ''}</span>
      ) : (
        <span className="text-gray-400 italic">No response yet</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'resolved' ? 'bg-green-100 text-green-800' :
          value === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'created_at', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
  ];

  return (
    <GenericManagement
      title="Contact Inquiries"
      endpoint="contact-inquiries"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default ContactInquiriesManagement;