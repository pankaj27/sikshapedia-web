import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';

const ScholarshipsSection = ({ formData, setFormData, availableScholarships, updateScholarship, addScholarship, removeScholarship }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Scholarships</h2>
      {formData.scholarships.map((scholarship, index) => (
        <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Scholarship Name *</label>
              <select
                value={scholarship.name}
                onChange={(e) => updateScholarship(index, 'name', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Select Scholarship</option>
                {availableScholarships.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} - {s.type} ({s.provider})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Select a scholarship to auto-fill amount and description</p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Amount</label>
              <input
                type="text"
                placeholder="e.g., ₹50,000 per year"
                value={scholarship.amount}
                onChange={(e) => updateScholarship(index, 'amount', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-yellow-50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Description</label>
              <textarea
                placeholder="Auto-filled from scholarship database"
                value={scholarship.description}
                onChange={(e) => updateScholarship(index, 'description', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-yellow-50"
                rows="3"
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => removeScholarship(index)} className="mt-2">
            <FiTrash2 className="mr-2" /> Remove Scholarship
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addScholarship} size="sm">
        <FiPlus className="mr-2" /> Add Scholarship
      </Button>
    </div>
  );
};

export default ScholarshipsSection;
