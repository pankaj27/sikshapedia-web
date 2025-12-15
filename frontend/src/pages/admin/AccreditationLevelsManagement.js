import React from 'react';
import GenericManagement from './GenericManagement';

const AccreditationLevelsManagement = () => {
  const fields = [
    { 
      name: 'name', 
      label: 'Accreditation Level Name', 
      type: 'text', 
      required: true,
      placeholder: 'e.g., A++, A+, A, B++, B+, B, C'
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea',
      placeholder: 'Brief description of this accreditation level'
    }
  ];

  const displayFields = [
    { key: 'name', label: 'Level Name' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <GenericManagement
      title="Accreditation Levels"
      endpoint="accreditation-levels"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default AccreditationLevelsManagement;
