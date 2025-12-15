import React from 'react';
import GenericManagement from './GenericManagement';

const RankCategoriesManagement = () => {
  const fields = [
    { 
      name: 'name', 
      label: 'Category Name', 
      type: 'text', 
      required: true,
      placeholder: 'e.g., Overall, Engineering, Medical, Management, Law, Pharmacy'
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea',
      placeholder: 'Brief description of this ranking category'
    }
  ];

  const displayFields = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <GenericManagement
      title="Rank Categories"
      endpoint="rank-categories"
      fields={fields}
      displayFields={displayFields}
      searchField="name"
    />
  );
};

export default RankCategoriesManagement;
