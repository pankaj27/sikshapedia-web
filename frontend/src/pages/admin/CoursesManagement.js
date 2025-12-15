import React from 'react';
import GenericManagement from './GenericManagement';

const CoursesManagement = () => {
  const fields = [
    { key: 'name', label: 'Course Name', type: 'text', required: true },
    { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
    { key: 'degree_type', label: 'Degree Type', type: 'select', required: true, options: [
      { value: 'UG', label: 'Undergraduate (UG)' },
      { value: 'PG', label: 'Postgraduate (PG)' },
      { value: 'Diploma', label: 'Diploma' },
      { value: 'Certificate', label: 'Certificate' },
      { value: 'PhD', label: 'PhD/Doctorate' },
    ]},
    { key: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'e.g., 4 Years, 2 Years' },
    { key: 'stream', label: 'Stream', type: 'text', required: true, placeholder: 'e.g., Engineering, Medicine, Arts' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
    { key: 'eligibility', label: 'Eligibility Criteria', type: 'textarea', rows: 3 },
    { key: 'career_prospects', label: 'Career Prospects', type: 'textarea', rows: 3 },
    { key: 'average_fees', label: 'Average Fees (Annual)', type: 'number', placeholder: 'e.g., 200000' },
    { key: 'total_colleges', label: 'Total Colleges Offering', type: 'number', placeholder: 'e.g., 500' },
    { key: 'popular', label: 'Mark as Popular', type: 'checkbox' },
  ];

  const displayFields = [
    { key: 'name', label: 'Course Name' },
    { key: 'degree_type', label: 'Degree Type' },
    { key: 'duration', label: 'Duration' },
    { key: 'stream', label: 'Stream' },
    { key: 'total_colleges', label: 'Colleges' },
  ];

  return (
    <GenericManagement
      title="Courses"
      endpoint="courses"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default CoursesManagement;
