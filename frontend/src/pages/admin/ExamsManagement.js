import React from 'react';
import GenericManagement from './GenericManagement';

const ExamsManagement = () => {
  const fields = [
    { key: 'name', label: 'Exam Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
    { key: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g., Joint Entrance Examination' },
    { key: 'type', label: 'Type', type: 'select', required: true, options: [
      { value: 'Entrance', label: 'Entrance' },
      { value: 'Eligibility', label: 'Eligibility' },
      { value: 'Scholarship', label: 'Scholarship' },
    ]},
    { key: 'level', label: 'Level', type: 'select', required: true, options: [
      { value: 'National', label: 'National' },
      { value: 'State', label: 'State' },
      { value: 'University', label: 'University' },
      { value: 'International', label: 'International' },
    ]},
    { key: 'conducting_body', label: 'Conducting Body', type: 'text', required: true, placeholder: 'e.g., NTA, State Board' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
    { key: 'exam_pattern', label: 'Exam Pattern', type: 'textarea', rows: 3, placeholder: 'Duration, sections, marking scheme' },
    { key: 'eligibility', label: 'Eligibility Criteria', type: 'textarea', rows: 3 },
    { key: 'application_fee', label: 'Application Fee', type: 'number', placeholder: 'e.g., 1000' },
    { key: 'exam_date', label: 'Exam Date', type: 'text', placeholder: 'e.g., May 2026' },
    { key: 'application_start', label: 'Application Start Date', type: 'text', placeholder: 'e.g., January 2026' },
    { key: 'application_end', label: 'Application End Date', type: 'text', placeholder: 'e.g., March 2026' },
    { key: 'official_website', label: 'Official Website', type: 'url', placeholder: 'https://example.com' },
    { key: 'total_applicants', label: 'Total Applicants (Yearly)', type: 'number', placeholder: 'e.g., 1500000' },
    { key: 'popular', label: 'Mark as Popular', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Exam Name' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'type', label: 'Type' },
    { key: 'level', label: 'Level' },
    { key: 'conducting_body', label: 'Conducting Body' },
  ];

  return (
    <GenericManagement
      title="Exams"
      endpoint="exams"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default ExamsManagement;
