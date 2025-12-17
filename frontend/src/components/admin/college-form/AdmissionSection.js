import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';

const AdmissionSection = ({ 
  formData, 
  handleChange,
  updateAdmissionDate, 
  addAdmissionDate, 
  removeAdmissionDate 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Admission Details</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Admission Process</label>
        <textarea
          name="admission_process"
          value={formData.admission_process}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Admission Dates</label>
        {formData.admission_dates.map((date, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Event"
              value={date.event}
              onChange={(e) => updateAdmissionDate(index, 'event', e.target.value)}
              className="border rounded px-3 py-2 col-span-2"
            />
            <input
              type="text"
              placeholder="Date"
              value={date.date}
              onChange={(e) => updateAdmissionDate(index, 'date', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeAdmissionDate(index)}
              className="col-span-3"
            >
              <FiTrash2 className="mr-2" /> Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addAdmissionDate} size="sm">
          <FiPlus className="mr-2" /> Add Admission Date
        </Button>
      </div>
    </div>
  );
};

export default AdmissionSection;
