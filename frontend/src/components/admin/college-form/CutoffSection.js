import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';

const CutoffSection = ({ 
  formData, 
  updateCutoff, 
  addCutoff, 
  removeCutoff 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cutoff Data</h2>
      {formData.cutoff_data.map((cutoff, index) => (
        <div key={index} className="grid grid-cols-6 gap-2 mb-2">
          <input
            type="text"
            placeholder="Course"
            value={cutoff.course}
            onChange={(e) => updateCutoff(index, 'course', e.target.value)}
            className="border rounded px-3 py-2 col-span-2"
          />
          <input
            type="number"
            placeholder="Opening Rank"
            value={cutoff.opening_rank}
            onChange={(e) => updateCutoff(index, 'opening_rank', parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Closing Current"
            value={cutoff.closing_rank_current}
            onChange={(e) => updateCutoff(index, 'closing_rank_current', parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Closing Previous"
            value={cutoff.closing_rank_previous}
            onChange={(e) => updateCutoff(index, 'closing_rank_previous', parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          />
          <Button type="button" variant="outline" onClick={() => removeCutoff(index)}>
            <FiTrash2 />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addCutoff} size="sm">
        <FiPlus className="mr-2" /> Add Cutoff
      </Button>
    </div>
  );
};

export default CutoffSection;
