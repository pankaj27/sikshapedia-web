import React from 'react';

// Current year for dates
const year = new Date().getFullYear();

// COURSES SECTION - Exact same as main page
export const CoursesSection = ({ college }) => {
  if (!college?.courses || college.courses.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Courses and Fees {year}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} offers various undergraduate and postgraduate programs. Here are the courses with their fee structure:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-orange-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Duration</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">1st Year Fee</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Total Fee</th>
            </tr>
          </thead>
          <tbody>
            {college.courses.map((course, idx) => {
              const courseName = typeof course === 'string' ? course : course.name;
              const duration = typeof course === 'object' ? course.duration : '';
              const firstYearFee = typeof course === 'object' ? (course.first_year_fee || college.average_fees) : college.average_fees;
              const totalFee = typeof course === 'object' ? (course.total_fee || firstYearFee * 4) : college.average_fees * 4;
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">
                    <span className="text-blue-600 font-medium">{courseName}</span>
                  </td>
                  <td className="border px-4 py-3 text-sm">{duration || '-'}</td>
                  <td className="border px-4 py-3 text-sm font-semibold">₹{(firstYearFee / 100000).toFixed(2)} Lakhs</td>
                  <td className="border px-4 py-3 text-sm font-semibold">₹{(totalFee / 100000).toFixed(2)} Lakhs</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ADMISSION SECTION - Exact same as main page
export const AdmissionSection = ({ college }) => {
  const hasAdmissionDates = college?.admission_dates?.length > 0;
  const hasEligibility = college?.courses?.filter(c => typeof c === 'object' && (c.eligibility || c.selection_criteria)).length > 0;
  
  if (!hasAdmissionDates && !hasEligibility) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Admission {year + 1}</h2>
      <p className="text-gray-700 text-sm mb-4">
        Admission details and eligibility criteria for {college.name}:
      </p>

      {hasAdmissionDates && (
        <>
          <h3 className="text-xl font-bold mb-3">Admission Dates {year + 1}</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-orange-50">
                  <th className="border px-4 py-3 text-left text-sm font-bold">Events</th>
                  <th className="border px-4 py-3 text-left text-sm font-bold">Dates</th>
                </tr>
              </thead>
              <tbody>
                {college.admission_dates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-3 text-sm">{item.event || item.title}</td>
                    <td className="border px-4 py-3 text-sm font-semibold">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {hasEligibility && (
        <>
          <h3 className="text-xl font-bold mb-3">Eligibility & Selection Criteria</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
                  <th className="border px-4 py-3 text-left text-sm font-bold">Eligibility</th>
                  <th className="border px-4 py-3 text-left text-sm font-bold">Selection Criteria</th>
                </tr>
              </thead>
              <tbody>
                {college.courses.filter(c => typeof c === 'object').map((course, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-3 text-sm font-semibold">{course.name}</td>
                    <td className="border px-4 py-3 text-sm">{course.eligibility || '-'}</td>
                    <td className="border px-4 py-3 text-sm">{course.selection_criteria || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// CUTOFF SECTION - Exact same as main page
export const CutoffSection = ({ college }) => {
  if (!college?.cutoff_data || college.cutoff_data.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Cutoff {year}</h2>
      <p className="text-gray-700 text-sm mb-4">
        The cutoff varies for different programs and categories:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-orange-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Cutoff</th>
            </tr>
          </thead>
          <tbody>
            {college.cutoff_data.map((cutoff, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 text-sm font-semibold">{cutoff.course || cutoff.program}</td>
                <td className="border px-4 py-3 text-sm">{cutoff.category}</td>
                <td className="border px-4 py-3 text-sm">{cutoff.year}</td>
                <td className="border px-4 py-3 text-sm font-bold text-orange-600">{cutoff.cutoff || cutoff.rank || cutoff.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PLACEMENT SECTION - Exact same as main page
export const PlacementSection = ({ college }) => {
  const placement = college?.placement || college?.placements;
  if (!placement) return null;
  
  const highestPackage = placement.highest || placement.highest_package;
  const averagePackage = placement.average || placement.average_package;
  const medianPackage = placement.median || placement.median_package;
  const placementRate = placement.placement_rate || placement.percentage;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Placement {year}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} has excellent placement records with top companies recruiting from campus:
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {highestPackage > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 text-center">
            <p className="text-2xl font-bold text-green-700">₹{(highestPackage / 100000).toFixed(1)} LPA</p>
            <p className="text-sm text-green-600">Highest Package</p>
          </div>
        )}
        {averagePackage > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 text-center">
            <p className="text-2xl font-bold text-blue-700">₹{(averagePackage / 100000).toFixed(1)} LPA</p>
            <p className="text-sm text-blue-600">Average Package</p>
          </div>
        )}
        {medianPackage > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 text-center">
            <p className="text-2xl font-bold text-purple-700">₹{(medianPackage / 100000).toFixed(1)} LPA</p>
            <p className="text-sm text-purple-600">Median Package</p>
          </div>
        )}
        {placementRate > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 text-center">
            <p className="text-2xl font-bold text-orange-700">{placementRate}%</p>
            <p className="text-sm text-orange-600">Placement Rate</p>
          </div>
        )}
      </div>
      
      {/* Top Recruiters */}
      {placement.top_recruiters && placement.top_recruiters.length > 0 && (
        <>
          <h3 className="text-xl font-bold mb-3">Top Recruiters</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {placement.top_recruiters.map((recruiter, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {recruiter}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// RANKING SECTION - Exact same as main page
export const RankingSection = ({ college }) => {
  // Combine rankings from different sources
  const allRankings = [];
  
  if (college?.rankings && college.rankings.length > 0) {
    college.rankings.forEach(r => allRankings.push(r));
  }
  if (college?.nirf_ranking) {
    allRankings.push({ agency: 'NIRF', rank: college.nirf_ranking, year: year, category: 'Overall' });
  }
  if (college?.naac_grade) {
    allRankings.push({ agency: 'NAAC', rank: college.naac_grade, year: year, category: 'Grade' });
  }
  
  // Remove duplicates
  const uniqueRankings = allRankings.filter((r, idx, self) => 
    idx === self.findIndex(t => t.agency === r.agency && t.year === r.year)
  );
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Rankings & Accreditations</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} is recognized by various ranking agencies:
      </p>
      
      {uniqueRankings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-orange-50">
                <th className="border px-4 py-3 text-left text-sm font-bold">Agency/Body</th>
                <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
                <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
                <th className="border px-4 py-3 text-left text-sm font-bold">Rank/Grade</th>
              </tr>
            </thead>
            <tbody>
              {uniqueRankings.map((ranking, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 text-sm font-semibold">{ranking.agency}</td>
                  <td className="border px-4 py-3 text-sm">{ranking.category || '-'}</td>
                  <td className="border px-4 py-3 text-sm">{ranking.year}</td>
                  <td className="border px-4 py-3 text-sm font-bold text-orange-600">
                    {typeof ranking.rank === 'number' ? `#${ranking.rank}` : ranking.rank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No ranking data available</p>
      )}
    </div>
  );
};

// SCHOLARSHIP SECTION - Exact same as main page
export const ScholarshipSection = ({ college }) => {
  if (!college?.scholarships || college.scholarships.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Scholarships</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} offers various scholarships to deserving students:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-green-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Scholarship Name</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Amount</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {college.scholarships.map((scholarship, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 text-sm font-semibold text-green-700">{scholarship.name}</td>
                <td className="border px-4 py-3 text-sm font-semibold">
                  {scholarship.amount ? `₹${scholarship.amount.toLocaleString()}` : scholarship.percentage ? `${scholarship.percentage}%` : '-'}
                </td>
                <td className="border px-4 py-3 text-sm">{scholarship.eligibility || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// FACILITIES SECTION - Exact same as main page
export const FacilitiesSection = ({ college }) => {
  if (!college?.facilities || college.facilities.length === 0) return null;
  
  const facilityIcons = {
    'Library': '📚', 'Hostel': '🏠', 'Sports': '⚽', 'Gym': '🏋️', 'Cafeteria': '🍽️',
    'WiFi': '📶', 'Labs': '🔬', 'Auditorium': '🎭', 'Medical': '🏥', 'Transport': '🚌',
    'Parking': '🅿️', 'ATM': '🏧', 'Bank': '🏦', 'default': '🏢'
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Campus & Facilities</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} provides world-class facilities for students:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {college.facilities.map((facility, idx) => {
          const facilityName = typeof facility === 'string' ? facility : facility.name;
          const icon = facilityIcons[facilityName] || facilityIcons['default'];
          return (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <span className="text-3xl">{icon}</span>
              <p className="mt-2 text-sm font-medium text-gray-700">{facilityName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// GALLERY SECTION
export const GallerySection = ({ college }) => {
  if (!college?.gallery || college.gallery.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Gallery</h2>
      <p className="text-gray-700 text-sm mb-4">
        Take a virtual tour of {college.name} campus:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {college.gallery.map((image, idx) => (
          <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src={typeof image === 'string' ? image : image.url} 
              alt={typeof image === 'object' && image.caption ? image.caption : `${college.name} - Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// INFO SECTION
export const InfoSection = ({ college }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">About {college.name}</h2>
      
      {/* Description */}
      {college.description && (
        <div 
          className="prose prose-lg max-w-none text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: college.description }}
        />
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {college.established_year && (
          <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
            <p className="text-2xl font-bold text-orange-600">{college.established_year}</p>
            <p className="text-sm text-gray-600">Established</p>
          </div>
        )}
        {college.total_students > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{college.total_students?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        )}
        {college.type && (
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <p className="text-2xl font-bold text-green-600">{college.type}</p>
            <p className="text-sm text-gray-600">Type</p>
          </div>
        )}
        {college.average_fees > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">₹{(college.average_fees / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-600">Avg. Fees</p>
          </div>
        )}
      </div>
      
      {/* Key Highlights */}
      <h3 className="text-xl font-bold mb-3">Key Highlights</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {college.approved_by && <li><strong>Approved By:</strong> {college.approved_by}</li>}
        {college.affiliated_to && <li><strong>Affiliated To:</strong> {college.affiliated_to}</li>}
        {college.campus_size && <li><strong>Campus Size:</strong> {college.campus_size}</li>}
        {college.faculty_count > 0 && <li><strong>Faculty:</strong> {college.faculty_count} members</li>}
        {college.rating > 0 && <li><strong>Rating:</strong> {college.rating}/5</li>}
      </ul>
    </div>
  );
};
