import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../ui/button';

const PlacementSection = ({ formData, setFormData, handleNestedChange }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Highest Package (INR)</label>
          <input
            type="number"
            value={formData.placement.highest}
            onChange={(e) => handleNestedChange('placement', 'highest', parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Average Package (INR)</label>
          <input
            type="number"
            value={formData.placement.average}
            onChange={(e) => handleNestedChange('placement', 'average', parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Placement Percentage</label>
          <input
            type="number"
            value={formData.placement.percentage}
            onChange={(e) => handleNestedChange('placement', 'percentage', parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Students Participated</label>
          <input
            type="number"
            value={formData.placement.students_participated}
            onChange={(e) => handleNestedChange('placement', 'students_participated', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Companies Participated</label>
          <input
            type="number"
            value={formData.placement.companies_participated}
            onChange={(e) => handleNestedChange('placement', 'companies_participated', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Offers</label>
          <input
            type="number"
            value={formData.placement.total_offers}
            onChange={(e) => handleNestedChange('placement', 'total_offers', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Top Recruiters</label>
        {formData.placement.top_recruiters.map((recruiter, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={recruiter}
              onChange={(e) => {
                const newRecruiters = [...formData.placement.top_recruiters];
                newRecruiters[index] = e.target.value;
                setFormData({
                  ...formData,
                  placement: { ...formData.placement, top_recruiters: newRecruiters }
                });
              }}
              className="flex-1 border rounded px-3 py-2"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newRecruiters = formData.placement.top_recruiters.filter((_, i) => i !== index);
                setFormData({
                  ...formData,
                  placement: { ...formData.placement, top_recruiters: newRecruiters }
                });
              }}
            >
              <FiTrash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => {
            setFormData({
              ...formData,
              placement: {
                ...formData.placement,
                top_recruiters: [...formData.placement.top_recruiters, '']
              }
            });
          }}
          size="sm"
        >
          <FiPlus className="mr-2" /> Add Recruiter
        </Button>
      </div>
    </div>
  );
};

export default PlacementSection;
