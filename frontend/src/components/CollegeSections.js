import React from 'react';
import { FiGrid, FiMapPin, FiPhone, FiMail, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { HiOutlineLibrary, HiOutlineSparkles } from 'react-icons/hi';
import { 
  MdOutlineSportsBasketball, MdOutlinePool, MdOutlineFitnessCenter, 
  MdOutlineLocalHospital, MdOutlineRestaurant, MdOutlineLocalParking, 
  MdOutlineAtm, MdOutlineTheaters, MdOutlinePark, MdOutlineAir, 
  MdOutlineBed, MdOutlineScience, MdOutlineComputer, MdOutlineWifi, 
  MdOutlineLocalLaundryService, MdOutlineSecurity, MdOutlineLocalCafe 
} from 'react-icons/md';
import { FiCpu, FiMonitor, FiTruck, FiSun, FiShield, FiPackage, FiHeart } from 'react-icons/fi';
import GuestGate from './GuestGate';
import { Button } from './ui/button';

// Current year for dynamic display
const year = new Date().getFullYear();

// Facility icon mapping - EXACT SAME as CollegeDetailPage.js
const facilityIconMap = {
  // Library & Academic
  'library': { icon: HiOutlineLibrary, color: 'bg-blue-500', label: 'Library' },
  'digital library': { icon: MdOutlineComputer, color: 'bg-blue-600', label: 'Digital Library' },
  'research labs': { icon: MdOutlineScience, color: 'bg-purple-500', label: 'Research Labs' },
  'computer lab': { icon: MdOutlineComputer, color: 'bg-indigo-500', label: 'Computer Lab' },
  'incubation center': { icon: FiCpu, color: 'bg-violet-500', label: 'Incubation Center' },
  
  // Sports & Fitness
  'sports': { icon: MdOutlineSportsBasketball, color: 'bg-orange-500', label: 'Sports' },
  'sports complex': { icon: MdOutlineSportsBasketball, color: 'bg-orange-500', label: 'Sports Complex' },
  'swimming pool': { icon: MdOutlinePool, color: 'bg-cyan-500', label: 'Swimming Pool' },
  'gymnasium': { icon: MdOutlineFitnessCenter, color: 'bg-red-500', label: 'Gymnasium' },
  'gym': { icon: MdOutlineFitnessCenter, color: 'bg-red-500', label: 'Gym' },
  'playground': { icon: MdOutlinePark, color: 'bg-green-500', label: 'Playground' },
  
  // Accommodation
  'hostel': { icon: MdOutlineBed, color: 'bg-teal-500', label: 'Hostel' },
  'hostels': { icon: MdOutlineBed, color: 'bg-teal-500', label: 'Hostels' },
  'boys hostel': { icon: MdOutlineBed, color: 'bg-blue-500', label: 'Boys Hostel' },
  'girls hostel': { icon: MdOutlineBed, color: 'bg-pink-500', label: 'Girls Hostel' },
  
  // Food & Dining
  'cafeteria': { icon: MdOutlineLocalCafe, color: 'bg-amber-500', label: 'Cafeteria' },
  'canteen': { icon: MdOutlineRestaurant, color: 'bg-amber-600', label: 'Canteen' },
  'mess': { icon: MdOutlineRestaurant, color: 'bg-yellow-600', label: 'Mess' },
  'food court': { icon: MdOutlineRestaurant, color: 'bg-orange-400', label: 'Food Court' },
  
  // Healthcare
  'hospital': { icon: MdOutlineLocalHospital, color: 'bg-red-600', label: 'Hospital' },
  'medical': { icon: MdOutlineLocalHospital, color: 'bg-red-500', label: 'Medical Facility' },
  'health center': { icon: FiHeart, color: 'bg-rose-500', label: 'Health Center' },
  
  // Technology & IT
  'wifi': { icon: MdOutlineWifi, color: 'bg-blue-400', label: 'WiFi Campus' },
  'wi-fi': { icon: MdOutlineWifi, color: 'bg-blue-400', label: 'WiFi Campus' },
  'it infrastructure': { icon: FiMonitor, color: 'bg-slate-600', label: 'IT Infrastructure' },
  'smart classrooms': { icon: FiMonitor, color: 'bg-indigo-600', label: 'Smart Classrooms' },
  
  // Services
  'laundry': { icon: MdOutlineLocalLaundryService, color: 'bg-cyan-600', label: 'Laundry' },
  'parking': { icon: MdOutlineLocalParking, color: 'bg-gray-600', label: 'Parking' },
  'atm': { icon: MdOutlineAtm, color: 'bg-green-600', label: 'ATM' },
  'bank': { icon: MdOutlineAtm, color: 'bg-emerald-600', label: 'Bank' },
  'transport': { icon: FiTruck, color: 'bg-slate-500', label: 'Transport' },
  'bus service': { icon: FiTruck, color: 'bg-slate-500', label: 'Bus Service' },
  
  // Recreation & Culture
  'auditorium': { icon: MdOutlineTheaters, color: 'bg-purple-600', label: 'Auditorium' },
  'theater': { icon: MdOutlineTheaters, color: 'bg-purple-500', label: 'Theater' },
  'cultural center': { icon: HiOutlineSparkles, color: 'bg-pink-600', label: 'Cultural Center' },
  
  // Safety & Security
  'security': { icon: MdOutlineSecurity, color: 'bg-gray-700', label: '24/7 Security' },
  '24x7 security': { icon: MdOutlineSecurity, color: 'bg-gray-700', label: '24/7 Security' },
  'cctv': { icon: FiShield, color: 'bg-slate-700', label: 'CCTV Surveillance' },
  
  // Environment
  'air conditioning': { icon: MdOutlineAir, color: 'bg-sky-500', label: 'Air Conditioning' },
  'ac': { icon: MdOutlineAir, color: 'bg-sky-500', label: 'Air Conditioning' },
  'solar power': { icon: FiSun, color: 'bg-yellow-500', label: 'Solar Power' },
  'green campus': { icon: MdOutlinePark, color: 'bg-green-600', label: 'Green Campus' },
  
  // Default
  'default': { icon: FiPackage, color: 'bg-gray-500', label: 'Facility' }
};

// Helper function to get facility icon and color - EXACT SAME as CollegeDetailPage.js
const getFacilityIcon = (facilityName) => {
  const name = facilityName?.toLowerCase().trim() || '';
  
  // Check for exact match first
  if (facilityIconMap[name]) {
    return facilityIconMap[name];
  }
  
  // Check for partial matches
  for (const key of Object.keys(facilityIconMap)) {
    if (name.includes(key) || key.includes(name)) {
      return facilityIconMap[key];
    }
  }
  
  return { ...facilityIconMap['default'], label: facilityName };
};

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = null;
  
  const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortUrlMatch) videoId = shortUrlMatch[1];
  
  const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchUrlMatch) videoId = watchUrlMatch[1];
  
  const vUrlMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]+)/);
  if (vUrlMatch) videoId = vUrlMatch[1];
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

// ================== SHARED SECTION COMPONENTS ==================
// These are EXACT copies of the rendering logic from CollegeDetailPage.js
// to ensure content consistency between main page and sub-pages

// COURSES SECTION - EXACT same as main page (with GuestGate for fee data)
export const CoursesSection = ({ college }) => {
  if (!college?.courses || college.courses.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Courses & Fees {year + 1}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} offers various programs. The fee structure is mentioned below:
      </p>

      <GuestGate title="Fee Details">
        <div className="overflow-x-auto mb-6">
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
      </GuestGate>
    </div>
  );
};

// ADMISSION SECTION - EXACT same as main page (with GuestGate for admission dates)
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
          <GuestGate title="Admission Dates">
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
          </GuestGate>
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

// CUTOFF SECTION - EXACT same as main page
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
            <tr className="bg-gray-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Course/Program</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Cutoff</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
            </tr>
          </thead>
          <tbody>
            {college.cutoff_data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 text-sm">{item.course || item.program}</td>
                <td className="border px-4 py-3 text-sm">{item.category || 'General'}</td>
                <td className="border px-4 py-3 text-sm font-bold text-blue-600">{item.cutoff || item.rank}</td>
                <td className="border px-4 py-3 text-sm">{item.year || year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PLACEMENT SECTION - EXACT same as main page (with GuestGate for placement data)
export const PlacementSection = ({ college }) => {
  const placement = college?.placement || college?.placements;
  if (!placement) return null;
  
  const highestPackage = placement.highest || placement.highest_package;
  const averagePackage = placement.average || placement.average_package;
  const placementRate = placement.percentage || placement.placement_rate;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Placement</h2>
      
      <p className="text-gray-700 text-sm mb-4">
        As per the {college.name} Placement report, the average package stood at <strong>₹{averagePackage ? (averagePackage / 100000).toFixed(1) : '-'} LPA</strong>.
      </p>

      <GuestGate title="Placement Data">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {highestPackage > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹{(highestPackage / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600">Highest Package</div>
            </div>
          )}
          {averagePackage > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{(averagePackage / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600">Average Package</div>
            </div>
          )}
          {placementRate > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {placementRate}%
              </div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </div>
          )}
        </div>

        {placement.top_recruiters && placement.top_recruiters.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-sm mb-2">Top Recruiters:</h4>
            <div className="flex flex-wrap gap-2">
              {(typeof placement.top_recruiters === 'string' 
                ? placement.top_recruiters.split(',') 
                : placement.top_recruiters
              ).map((r, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-full">{typeof r === 'string' ? r.trim() : r}</span>
              ))}
            </div>
          </div>
        )}
      </GuestGate>
    </div>
  );
};

// RANKING SECTION - EXACT same as main page
export const RankingSection = ({ college }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Ranking {year}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} has been ranked by various agencies including NIRF, IIRF, India Today, and more. The ranking details are mentioned below:
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Agency</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Year</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {college.rankings && college.rankings.length > 0 ? (
              college.rankings.map((rank, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 text-sm font-semibold">{rank.agency || rank.source}</td>
                  <td className="border px-4 py-3 text-sm">{rank.year}</td>
                  <td className="border px-4 py-3 text-sm">{rank.category || 'Overall'}</td>
                  <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{rank.rank}</td>
                </tr>
              ))
            ) : (
              <>
                {college.nirf_ranking && (
                  <tr className="hover:bg-gray-50">
                    <td className="border px-4 py-3 text-sm font-semibold">NIRF</td>
                    <td className="border px-4 py-3 text-sm">{year}</td>
                    <td className="border px-4 py-3 text-sm">Overall</td>
                    <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{college.nirf_ranking}</td>
                  </tr>
                )}
                {college.india_today_ranking && (
                  <tr className="hover:bg-gray-50">
                    <td className="border px-4 py-3 text-sm font-semibold">India Today</td>
                    <td className="border px-4 py-3 text-sm">{year}</td>
                    <td className="border px-4 py-3 text-sm">Overall</td>
                    <td className="border px-4 py-3 text-sm font-bold text-orange-600">#{college.india_today_ranking}</td>
                  </tr>
                )}
                {!college.nirf_ranking && !college.india_today_ranking && (
                  <tr>
                    <td colSpan="4" className="border px-4 py-3 text-sm text-center text-gray-500">
                      No ranking data available
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SCHOLARSHIP SECTION - EXACT same as main page
export const ScholarshipSection = ({ college }) => {
  if (!college?.scholarships || college.scholarships.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Scholarships {year + 1}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} offers various scholarships to support students financially. The details are mentioned below:
      </p>
      <div className="space-y-4">
        {college.scholarships.map((scholarship, idx) => (
          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">{scholarship.name || scholarship.title}</h3>
            <p className="text-sm text-gray-700">
              {scholarship.description || scholarship.details}
            </p>
            {scholarship.amount && (
              <p className="text-sm font-semibold text-blue-600 mt-2">
                Amount: ₹{scholarship.amount.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// FACILITIES SECTION - EXACT same as main page (with icons)
export const FacilitiesSection = ({ college }) => {
  if (!college?.facilities || college.facilities.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Campus & Facilities</h2>
      <p className="text-gray-700 text-sm mb-4">
        {college.name} campus provides world-class facilities and infrastructure for students. Major facilities are highlighted below:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {college.facilities.map((facility, idx) => {
          const isObject = typeof facility === 'object';
          const facilityName = isObject ? facility.name : facility;
          const facilityData = getFacilityIcon(facilityName);
          const IconComponent = facilityData.icon;
          
          return (
            <div 
              key={idx} 
              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 ${facilityData.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <IconComponent className="text-white" size={26} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                {facilityData.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Campus Images */}
      {(college.campus_images?.length > 0 || college.images?.length > 1) && (
        <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
          {(college.campus_images || college.images.slice(1)).slice(0, 6).map((img, i) => (
            <div key={i} className="rounded-lg aspect-video overflow-hidden border">
              <img src={img} alt={`Campus ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* CAMPUS VIDEO */}
      {(college.campus_video_url || college.seo_video_url || college.videos?.[0]) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">{college.video_title || 'Campus Video Tour'}</h3>
          <div className="rounded-lg aspect-video overflow-hidden border">
            <iframe
              src={getYouTubeEmbedUrl(college.campus_video_url || college.seo_video_url || college.videos?.[0])}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={college.video_title || 'Campus Video Tour'}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

// GALLERY SECTION - EXACT same as main page
export const GallerySection = ({ college }) => {
  const galleryImages = college?.gallery || college?.images || [];
  if (galleryImages.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Gallery</h2>
      <p className="text-gray-700 text-sm mb-4">
        Take a virtual tour of {college.name} campus:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((image, idx) => (
          <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border">
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

// INFO SECTION - EXACT same as main page
export const InfoSection = ({ college }) => {
  return (
    <div>
      {college.seo_full_content && (
        <div className="text-gray-700 leading-relaxed prose max-w-none mb-4">
          <div dangerouslySetInnerHTML={{ __html: college.seo_full_content }} />
        </div>
      )}

      {/* Recognized by & Affiliated to - Detailed Section */}
      {(college?.recognized_by?.length > 0 || college?.affiliation) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {college?.recognized_by?.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
              <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Recognized by
              </h3>
              <div className="space-y-3">
                {college.recognized_by.map((org, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {college?.affiliation && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
              <h3 className="font-bold text-lg mb-3 text-orange-900 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Affiliated to
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🏛️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{college.affiliation}</p>
                    <p className="text-xs text-gray-600">Primary Affiliation</p>
                  </div>
                </div>
              </div>

              {college?.memberships && college.memberships.length > 0 && (
                <div className="mt-4 pt-4 border-t border-orange-300">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Memberships</h4>
                  <div className="flex flex-wrap gap-2">
                    {college.memberships.map((m, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white border border-orange-300 text-xs rounded">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">Key Highlights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Type:</strong> {college.type || '-'}</li>
          <li>• <strong>Established:</strong> {college.established_year || college.established || '-'}</li>
          <li>• <strong>Location:</strong> {college.location?.city || college.city}, {college.location?.state || college.state}</li>
          <li>• <strong>Average Fees:</strong> ₹{college.average_fees ? (college.average_fees / 100000).toFixed(2) : '-'} Lakhs per year</li>
          {college.rating && <li>• <strong>Rating:</strong> {college.rating}/5</li>}
          {college.total_students && <li>• <strong>Students:</strong> {college.total_students.toLocaleString()}</li>}
        </ul>
      </div>
    </div>
  );
};
