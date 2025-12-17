import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';

const FacilitiesSection = ({ formData, availableFacilities, updateFacility, addFacility, removeFacility, renderIcon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Facilities</h2>
      {formData.facilities.map((facility, index) => (
        <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Facility Name *</label>
              <select
                value={facility.name}
                onChange={(e) => updateFacility(index, 'name', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Select Facility</option>
                {availableFacilities.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} - {f.category}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Select a facility to auto-fill icon and description</p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Icon Preview</label>
              <div className="flex items-center gap-3 p-3 border rounded bg-white">
                <div className="text-blue-600 text-2xl">
                  {facility.icon && renderIcon(facility.icon)}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Auto-filled icon name"
                    value={facility.icon}
                    onChange={(e) => updateFacility(index, 'icon', e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-yellow-50 text-sm"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Description</label>
              <textarea
                placeholder="Auto-filled from facility database"
                value={facility.description}
                onChange={(e) => updateFacility(index, 'description', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-yellow-50"
                rows="3"
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => removeFacility(index)} className="mt-2">
            <FiTrash2 className="mr-2" /> Remove Facility
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addFacility} size="sm">
        <FiPlus className="mr-2" /> Add Facility
      </Button>
    </div>
  );
};

export default FacilitiesSection;
