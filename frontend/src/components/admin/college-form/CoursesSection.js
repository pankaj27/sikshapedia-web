import React from 'react';
import { FiPlus, FiTrash2, FiUpload, FiLoader } from 'react-icons/fi';
import { Button } from '../../ui/button';
import CollapsibleSection from '../CollapsibleSection';

const CoursesSection = ({ 
  formData, 
  setFormData, 
  handleChange,
  availableCourses, 
  updateCourse, 
  addCourse, 
  removeCourse,
  uploadingCourseBrochure,
  handleCourseBrochureUpload 
}) => {
  return (
    <CollapsibleSection title="Courses & Fees" icon="📚" defaultOpen={true}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Average Fees (Annual) *</label>
        <input
          type="number"
          name="average_fees"
          value={formData.average_fees}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Courses</label>
        {formData.courses.map((course, index) => (
          <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Course Name *</label>
                <select
                  value={course.name}
                  onChange={(e) => updateCourse(index, 'name', e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} - {c.degree_type} ({c.stream})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select a course to auto-fill duration, eligibility, and selection criteria</p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 4 Years"
                  value={course.duration}
                  onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">First Year Fee</label>
                <input
                  type="number"
                  placeholder="Amount in INR"
                  value={course.first_year_fee}
                  onChange={(e) => updateCourse(index, 'first_year_fee', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Total Fee</label>
                <input
                  type="number"
                  placeholder="Total course fee"
                  value={course.total_fee}
                  onChange={(e) => updateCourse(index, 'total_fee', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Eligibility</label>
                <input
                  type="text"
                  placeholder="Auto-filled from course"
                  value={course.eligibility}
                  onChange={(e) => updateCourse(index, 'eligibility', e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-yellow-50"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Selection Criteria</label>
                <input
                  type="text"
                  placeholder="Auto-filled from course (exams accepted)"
                  value={course.selection_criteria}
                  onChange={(e) => updateCourse(index, 'selection_criteria', e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-yellow-50"
                />
              </div>
              
              {/* Course Brochure Upload */}
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">📄 Course Brochure (Optional)</label>
                <p className="text-xs text-gray-500 mb-2">Upload specific brochure for this course</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Brochure URL or upload PDF"
                    value={course.brochure_url || ''}
                    onChange={(e) => updateCourse(index, 'brochure_url', e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm"
                  />
                  {handleCourseBrochureUpload && (
                    <label className="flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-50">
                      {uploadingCourseBrochure?.[index] ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiUpload />
                      )}
                      <span className="text-sm">Upload</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleCourseBrochureUpload(e, index)}
                        className="hidden"
                        disabled={uploadingCourseBrochure?.[index]}
                      />
                    </label>
                  )}
                </div>
                {course.brochure_url && (
                  <a href={course.brochure_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-1 inline-block">
                    📄 View Course Brochure
                  </a>
                )}
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => removeCourse(index)} className="mt-2">
              <FiTrash2 className="mr-2" /> Remove Course
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addCourse} size="sm">
          <FiPlus className="mr-2" /> Add Course
        </Button>
      </div>
    </CollapsibleSection>
  );
};

export default CoursesSection;
