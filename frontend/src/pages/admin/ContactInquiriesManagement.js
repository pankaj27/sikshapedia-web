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
  ];

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'message', 
      label: 'Message',
      render: (value) => value?.substring(0, 50) + (value?.length > 50 ? '...' : '')
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