import React, { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiLoader, FiSearch, FiX, FiCheck, FiChevronDown, FiFilter } from 'react-icons/fi';
import { Button } from '../../ui/button';
import CollapsibleSection from '../CollapsibleSection';

const CoursesSection = ({ 
  formData, 
  setFormData, 
  handleChange,
  availableCourses = [], 
  updateCourse, 
  addCourse, 
  removeCourse,
  uploadingCourseBrochure,
  handleCourseBrochureUpload 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Get unique streams from available courses
  const availableStreams = useMemo(() => {
    const streams = new Set();
    availableCourses.forEach(c => {
      if (c.stream_name) streams.add(c.stream_name);
      else if (c.stream) streams.add(c.stream);
    });
    return Array.from(streams).sort();
  }, [availableCourses]);

  // Filter courses based on search and stream
  const filteredCourses = useMemo(() => {
    return availableCourses.filter(course => {
      const matchesSearch = !searchTerm || 
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.degree_type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const courseStream = course.stream_name || course.stream || '';
      const matchesStream = !selectedStream || courseStream === selectedStream;
      
      return matchesSearch && matchesStream;
    });
  }, [availableCourses, searchTerm, selectedStream]);

  // Group filtered courses by stream for better display
  const groupedCourses = useMemo(() => {
    const groups = {};
    filteredCourses.forEach(course => {
      const stream = course.stream_name || course.stream || 'Other';
      if (!groups[stream]) groups[stream] = [];
      groups[stream].push(course);
    });
    return groups;
  }, [filteredCourses]);

  // Check if a course is already selected
  const isCourseSelected = (courseId) => {
    return formData.courses?.some(c => c.course_id === courseId || c.name === courseId);
  };

  // Handle course selection/deselection
  const toggleCourseSelection = (course) => {
    const courseId = course.id || course.name;
    
    if (isCourseSelected(courseId)) {
      // Remove course
      const newCourses = formData.courses.filter(c => c.course_id !== courseId && c.name !== course.name);
      setFormData({ ...formData, courses: newCourses });
    } else {
      // Add course - fees will be entered manually, not auto-filled
      const newCourse = {
        course_id: course.id,
        name: course.name,
        full_name: course.full_name || course.name,
        degree_type: course.degree_type || '',
        duration: course.duration || '',
        stream: course.stream_name || course.stream || '',
        stream_id: course.stream_id || '',
        sub_stream: course.sub_stream_name || '',
        sub_stream_id: course.sub_stream_id || '',
        eligibility: course.eligibility || '',
        selection_criteria: (course.exams_accepted || []).join(', '),
        first_year_fee: '', // Manual input - not auto-filled
        total_fee: '', // Manual input - not auto-filled
        brochure_url: ''
      };
      setFormData({ ...formData, courses: [...(formData.courses || []), newCourse] });
    }
  };

  // Quick add multiple courses at once
  const addMultipleCourses = (coursesToAdd) => {
    const newCourses = coursesToAdd
      .filter(course => !isCourseSelected(course.id || course.name))
      .map(course => ({
        course_id: course.id,
        name: course.name,
        full_name: course.full_name || course.name,
        degree_type: course.degree_type || '',
        duration: course.duration || '',
        stream: course.stream_name || course.stream || '',
        stream_id: course.stream_id || '',
        sub_stream: course.sub_stream_name || '',
        sub_stream_id: course.sub_stream_id || '',
        eligibility: course.eligibility || '',
        selection_criteria: (course.exams_accepted || []).join(', '),
        first_year_fee: '', // Manual input
        total_fee: '', // Manual input
        brochure_url: ''
      }));
    
    setFormData({ ...formData, courses: [...(formData.courses || []), ...newCourses] });
  };

  // Calculate total fees
  const totalFirstYearFee = useMemo(() => {
    return (formData.courses || []).reduce((sum, c) => sum + (parseFloat(c.first_year_fee) || 0), 0);
  }, [formData.courses]);

  // Selected courses count
  const selectedCount = (formData.courses || []).length;

  return (
    <CollapsibleSection title={`Courses & Fees (${selectedCount} selected)`} icon="📚" defaultOpen={true}>
      {/* Average Fees */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">Average Annual Fees</label>
            <p className="text-xs text-blue-600">This will be shown on the college listing page</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-800 font-medium">₹</span>
            <input
              type="number"
              name="average_fees"
              value={formData.average_fees || ''}
              onChange={handleChange}
              placeholder="Enter average fees"
              className="w-40 border border-blue-300 rounded px-3 py-2 text-right font-medium"
            />
          </div>
        </div>
      </div>

      {/* Course Selector Button */}
      <div className="mb-4">
        <Button 
          type="button" 
          onClick={() => setShowCourseSelector(!showCourseSelector)}
          className="w-full justify-between"
          variant={showCourseSelector ? "default" : "outline"}
        >
          <span className="flex items-center gap-2">
            <FiPlus /> Add Courses from Master List
          </span>
          <FiChevronDown className={`transition-transform ${showCourseSelector ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Course Selection Panel */}
      {showCourseSelector && (
        <div className="mb-6 border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name, degree type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Streams</option>
                {availableStreams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Course List */}
          <div className="max-h-80 overflow-y-auto border rounded-lg bg-white">
            {Object.entries(groupedCourses).map(([stream, courses]) => (
              <div key={stream} className="border-b last:border-b-0">
                <div className="px-4 py-2 bg-gray-100 font-medium text-sm text-gray-700 sticky top-0">
                  {stream} ({courses.length} courses)
                </div>
                {courses.map(course => {
                  const isSelected = isCourseSelected(course.id || course.name);
                  return (
                    <div
                      key={course.id || course.name}
                      onClick={() => toggleCourseSelection(course)}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                        isSelected ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{course.name}</div>
                        <div className="text-xs text-gray-500">
                          {course.degree_type} • {course.duration} • ₹{(course.average_fees || 0).toLocaleString('en-IN')}/year
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                      }`}>
                        {isSelected && <FiCheck size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No courses found. Try adjusting your search or filter.
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {selectedCount} course(s) selected
            </span>
            <Button 
              type="button" 
              size="sm" 
              variant="outline"
              onClick={() => setShowCourseSelector(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Selected Courses Fee Table */}
      {(formData.courses || []).length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b">
            <h4 className="font-medium text-gray-800">Selected Courses & Fee Details</h4>
            <p className="text-xs text-gray-500">Click on a course to expand and edit details</p>
          </div>
          
          <div className="divide-y">
            {(formData.courses || []).map((course, index) => (
              <div key={index} className="bg-white">
                {/* Course Header Row */}
                <div 
                  className="px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedCourse(expandedCourse === index ? null : index)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{course.name || course.full_name}</div>
                    <div className="text-xs text-gray-500">
                      {course.degree_type} • {course.duration} • {course.stream}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">First Year Fee</div>
                      <div className="font-medium">₹{(course.first_year_fee || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total Fee</div>
                      <div className="font-medium">₹{(course.total_fee || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCourse(index);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Expanded Course Details */}
                {expandedCourse === index && (
                  <div className="px-4 py-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">First Year Fee (₹)</label>
                        <input
                          type="number"
                          value={course.first_year_fee || ''}
                          onChange={(e) => updateCourse(index, 'first_year_fee', parseFloat(e.target.value) || 0)}
                          className="w-full border rounded px-3 py-2 text-sm"
                          placeholder="Annual fee"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Total Course Fee (₹)</label>
                        <input
                          type="number"
                          value={course.total_fee || ''}
                          onChange={(e) => updateCourse(index, 'total_fee', parseFloat(e.target.value) || 0)}
                          className="w-full border rounded px-3 py-2 text-sm"
                          placeholder="Total fee"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                        <input
                          type="text"
                          value={course.duration || ''}
                          onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm"
                          placeholder="e.g., 4 Years"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Stream</label>
                        <input
                          type="text"
                          value={course.stream || ''}
                          readOnly
                          className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Eligibility</label>
                        <input
                          type="text"
                          value={course.eligibility || ''}
                          onChange={(e) => updateCourse(index, 'eligibility', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm bg-yellow-50"
                          placeholder="Auto-filled from course"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Selection Criteria / Exams</label>
                        <input
                          type="text"
                          value={course.selection_criteria || ''}
                          onChange={(e) => updateCourse(index, 'selection_criteria', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm bg-yellow-50"
                          placeholder="Auto-filled exams accepted"
                        />
                      </div>
                      
                      {/* Brochure Upload */}
                      <div className="col-span-2 md:col-span-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">📄 Course Brochure (Optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Brochure URL or upload PDF"
                            value={course.brochure_url || ''}
                            onChange={(e) => updateCourse(index, 'brochure_url', e.target.value)}
                            className="flex-1 border rounded px-3 py-2 text-sm"
                          />
                          {handleCourseBrochureUpload && (
                            <label className="flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-100 text-sm">
                              {uploadingCourseBrochure?.[index] ? (
                                <FiLoader className="animate-spin" />
                              ) : (
                                <FiUpload />
                              )}
                              Upload
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
                          <a href={course.brochure_url} target="_blank" rel="noopener noreferrer" 
                             className="text-xs text-green-600 hover:underline mt-1 inline-block">
                            📄 View Course Brochure
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="bg-gray-100 px-4 py-3 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Total: {selectedCount} course(s)
            </span>
            <div className="text-right">
              <div className="text-xs text-gray-500">Combined First Year Fee</div>
              <div className="font-bold text-lg text-gray-800">
                ₹{totalFirstYearFee.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(formData.courses || []).length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-2">📚</div>
          <p className="text-gray-500">No courses added yet</p>
          <p className="text-sm text-gray-400 mb-4">Click "Add Courses from Master List" to select courses</p>
          <Button type="button" onClick={() => setShowCourseSelector(true)} size="sm">
            <FiPlus className="mr-2" /> Add Courses
          </Button>
        </div>
      )}

      {/* Manual Add Course Option */}
      {(formData.courses || []).length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <Button type="button" onClick={addCourse} size="sm" variant="outline">
            <FiPlus className="mr-2" /> Add Custom Course Manually
          </Button>
          <p className="text-xs text-gray-500 mt-1">Use this if the course is not in the master list</p>
        </div>
      )}
    </CollapsibleSection>
  );
};

export default CoursesSection;
