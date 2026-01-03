import React from 'react';
import { FiGrid, FiMapPin, FiPhone, FiMail, FiGlobe, FiExternalLink, FiHome, FiActivity, FiHeart, FiCpu, FiTarget, FiServer, FiTv, FiVideo, FiMusic, FiImage, FiPrinter, FiShield, FiPackage, FiCloudRain, FiWind, FiDatabase } from 'react-icons/fi';
import { HiOutlineLibrary, HiOutlineSparkles, HiOutlineOfficeBuilding, HiOutlineBookOpen, HiOutlineBeaker } from 'react-icons/hi';
import { 
  MdOutlineSportsBasketball, MdOutlinePool, MdOutlineFitnessCenter, 
  MdOutlineLocalHospital, MdOutlineRestaurant, MdOutlineLocalParking, 
  MdOutlineAtm, MdOutlineTheaters, MdOutlinePark, MdOutlineAir, 
  MdOutlineBed, MdOutlineScience, MdOutlineComputer, MdOutlineWifi, 
  MdOutlineLocalLaundryService, MdOutlineSecurity, MdOutlineLocalCafe,
  MdOutlineSportsTennis, MdOutlineSportsVolleyball, MdOutlineSportsCricket,
  MdOutlineMeetingRoom, MdOutlineEmergency, MdOutlineHealthAndSafety,
  MdOutlineLocalDining, MdOutlineKitchen, MdOutlineFastfood,
  MdOutlineApartment, MdOutlineSingleBed, MdOutlineKingBed,
  MdOutlineSmartDisplay, MdOutlineRouter, MdOutlineCellTower, MdOutlineEventSeat,
  MdOutlinePiano, MdOutlineVolunteerActivism, MdOutlineCameraOutdoor, MdOutlineGppGood,
  MdOutlineDirectionsBus, MdOutlineLocalTaxi, MdOutlineSolarPower, MdOutlineForest,
  MdOutlineLocalFlorist, MdOutlineDry
} from 'react-icons/md';
import GuestGate from './GuestGate';
import { Button } from './ui/button';
import useYear from '../hooks/useYear';

// Facility icon mapping - EXACT SAME as CollegeDetailPage.js
const facilityIconMap = {
  // Library & Academic
  'library': { icon: HiOutlineLibrary, color: 'bg-blue-500', label: 'Library' },
  'digital library': { icon: HiOutlineBookOpen, color: 'bg-blue-600', label: 'Digital Library' },
  'e-library': { icon: FiDatabase, color: 'bg-blue-700', label: 'E-Library' },
  'research labs': { icon: HiOutlineBeaker, color: 'bg-purple-500', label: 'Research Labs' },
  'research center': { icon: FiTarget, color: 'bg-purple-600', label: 'Research Center' },
  'research': { icon: FiTarget, color: 'bg-purple-600', label: 'Research' },
  'computer lab': { icon: MdOutlineComputer, color: 'bg-indigo-500', label: 'Computer Lab' },
  'science lab': { icon: MdOutlineScience, color: 'bg-violet-500', label: 'Science Lab' },
  'science labs': { icon: MdOutlineScience, color: 'bg-violet-500', label: 'Science Labs' },
  'science laboratory': { icon: MdOutlineScience, color: 'bg-violet-500', label: 'Science Laboratory' },
  'laboratory': { icon: HiOutlineBeaker, color: 'bg-violet-600', label: 'Laboratory' },
  'incubation center': { icon: FiCpu, color: 'bg-violet-600', label: 'Incubation Center' },
  'seminar hall': { icon: MdOutlineMeetingRoom, color: 'bg-indigo-600', label: 'Seminar Hall' },
  'conference room': { icon: MdOutlineEventSeat, color: 'bg-slate-600', label: 'Conference Room' },
  
  // Sports & Fitness
  'sports': { icon: MdOutlineSportsBasketball, color: 'bg-orange-500', label: 'Sports' },
  'sports complex': { icon: MdOutlineSportsTennis, color: 'bg-orange-600', label: 'Sports Complex' },
  'swimming pool': { icon: MdOutlinePool, color: 'bg-cyan-500', label: 'Swimming Pool' },
  'gymnasium': { icon: MdOutlineFitnessCenter, color: 'bg-red-500', label: 'Gymnasium' },
  'gym': { icon: FiActivity, color: 'bg-red-600', label: 'Gym' },
  'playground': { icon: MdOutlinePark, color: 'bg-green-500', label: 'Playground' },
  'sports ground': { icon: MdOutlineSportsCricket, color: 'bg-green-600', label: 'Sports Ground' },
  'cricket ground': { icon: MdOutlineSportsCricket, color: 'bg-green-600', label: 'Cricket Ground' },
  'basketball court': { icon: MdOutlineSportsBasketball, color: 'bg-amber-600', label: 'Basketball Court' },
  'volleyball court': { icon: MdOutlineSportsVolleyball, color: 'bg-yellow-600', label: 'Volleyball Court' },
  'tennis court': { icon: MdOutlineSportsTennis, color: 'bg-lime-600', label: 'Tennis Court' },
  'indoor games': { icon: FiTarget, color: 'bg-teal-600', label: 'Indoor Games' },
  'yoga center': { icon: FiHeart, color: 'bg-pink-400', label: 'Yoga Center' },
  
  // Accommodation
  'hostel': { icon: MdOutlineApartment, color: 'bg-teal-500', label: 'Hostel' },
  'hostels': { icon: MdOutlineApartment, color: 'bg-teal-500', label: 'Hostels' },
  'boys hostel': { icon: MdOutlineSingleBed, color: 'bg-blue-500', label: 'Boys Hostel' },
  'girls hostel': { icon: MdOutlineKingBed, color: 'bg-pink-500', label: 'Girls Hostel' },
  'pg accommodation': { icon: FiHome, color: 'bg-emerald-500', label: 'PG Accommodation' },
  
  // Food & Dining
  'cafeteria': { icon: MdOutlineLocalCafe, color: 'bg-amber-500', label: 'Cafeteria' },
  'canteen': { icon: MdOutlineLocalDining, color: 'bg-amber-600', label: 'Canteen' },
  'mess': { icon: MdOutlineKitchen, color: 'bg-yellow-600', label: 'Mess' },
  'food court': { icon: MdOutlineFastfood, color: 'bg-orange-400', label: 'Food Court' },
  
  // Healthcare
  'hospital': { icon: MdOutlineLocalHospital, color: 'bg-red-600', label: 'Hospital' },
  'medical': { icon: MdOutlineHealthAndSafety, color: 'bg-red-500', label: 'Medical Facility' },
  'medical facility': { icon: MdOutlineEmergency, color: 'bg-rose-500', label: 'Medical Facility' },
  'health center': { icon: FiHeart, color: 'bg-rose-600', label: 'Health Center' },
  'first aid': { icon: MdOutlineEmergency, color: 'bg-red-400', label: 'First Aid' },
  
  // Technology & IT
  'wifi': { icon: MdOutlineWifi, color: 'bg-blue-400', label: 'WiFi Campus' },
  'wi-fi': { icon: MdOutlineRouter, color: 'bg-blue-400', label: 'WiFi Campus' },
  'wifi campus': { icon: MdOutlineCellTower, color: 'bg-blue-500', label: 'WiFi Campus' },
  'it infrastructure': { icon: FiServer, color: 'bg-slate-600', label: 'IT Infrastructure' },
  'smart classrooms': { icon: MdOutlineSmartDisplay, color: 'bg-indigo-600', label: 'Smart Classrooms' },
  'projector': { icon: FiTv, color: 'bg-gray-600', label: 'Projector' },
  'av room': { icon: FiVideo, color: 'bg-purple-600', label: 'AV Room' },
  
  // Services
  'laundry': { icon: MdOutlineDry, color: 'bg-cyan-600', label: 'Laundry' },
  'parking': { icon: MdOutlineLocalParking, color: 'bg-gray-600', label: 'Parking' },
  'atm': { icon: MdOutlineAtm, color: 'bg-green-600', label: 'ATM' },
  'bank': { icon: HiOutlineOfficeBuilding, color: 'bg-emerald-600', label: 'Bank' },
  'transport': { icon: MdOutlineDirectionsBus, color: 'bg-slate-500', label: 'Transport' },
  'bus service': { icon: MdOutlineDirectionsBus, color: 'bg-slate-500', label: 'Bus Service' },
  'shuttle service': { icon: MdOutlineLocalTaxi, color: 'bg-yellow-500', label: 'Shuttle Service' },
  'stationery': { icon: FiPrinter, color: 'bg-gray-500', label: 'Stationery Shop' },
  
  // Recreation & Culture
  'auditorium': { icon: MdOutlineTheaters, color: 'bg-purple-600', label: 'Auditorium' },
  'theater': { icon: MdOutlineEventSeat, color: 'bg-purple-500', label: 'Theater' },
  'cultural center': { icon: HiOutlineSparkles, color: 'bg-pink-600', label: 'Cultural Center' },
  'music room': { icon: MdOutlinePiano, color: 'bg-rose-500', label: 'Music Room' },
  'dance studio': { icon: FiMusic, color: 'bg-fuchsia-500', label: 'Dance Studio' },
  'art gallery': { icon: FiImage, color: 'bg-violet-500', label: 'Art Gallery' },
  'club activities': { icon: MdOutlineVolunteerActivism, color: 'bg-pink-500', label: 'Club Activities' },
  
  // Safety & Security
  'security': { icon: MdOutlineSecurity, color: 'bg-gray-700', label: '24/7 Security' },
  '24x7 security': { icon: MdOutlineGppGood, color: 'bg-gray-700', label: '24/7 Security' },
  'cctv': { icon: MdOutlineCameraOutdoor, color: 'bg-slate-700', label: 'CCTV Surveillance' },
  'fire safety': { icon: FiShield, color: 'bg-red-700', label: 'Fire Safety' },
  
  // Environment
  'air conditioning': { icon: MdOutlineAir, color: 'bg-sky-500', label: 'Air Conditioning' },
  'ac': { icon: FiWind, color: 'bg-sky-500', label: 'Air Conditioning' },
  'solar power': { icon: MdOutlineSolarPower, color: 'bg-yellow-500', label: 'Solar Power' },
  'green campus': { icon: MdOutlineForest, color: 'bg-green-600', label: 'Green Campus' },
  'garden': { icon: MdOutlineLocalFlorist, color: 'bg-green-500', label: 'Garden' },
  'rainwater harvesting': { icon: FiCloudRain, color: 'bg-blue-600', label: 'Rainwater Harvesting' },
  
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
  const { year } = useYear();
  if (!college?.courses || college.courses.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Courses & Fees {year}</h2>
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
                const duration = typeof course === 'object' ? (course.duration || course.course_duration || '4 Years') : '4 Years';
                // Support both 'fee', 'first_year_fee' and legacy formats
                const firstYearFee = typeof course === 'object' 
                  ? (course.fee || course.first_year_fee || college.average_fees || 0) 
                  : (college.average_fees || 0);
                const totalFee = typeof course === 'object' 
                  ? (course.total_fee || firstYearFee * 4) 
                  : ((college.average_fees || 0) * 4);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">
                      <span className="text-blue-600 font-medium">{courseName}</span>
                    </td>
                    <td className="border px-4 py-3 text-sm">{duration}</td>
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

// ADMISSION SECTION - EXACT same as main page (only Admission Dates)
export const AdmissionSection = ({ college }) => {
  const { year } = useYear();
  const hasAdmissionDates = college?.admission_dates?.length > 0;
  const hasAdmissionProcess = college?.admission_process;
  
  if (!hasAdmissionDates && !hasAdmissionProcess) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Admission {year}</h2>
      <p className="text-gray-700 text-sm mb-4">
        Admission details for {college.name}:
      </p>

      {/* Important Dates - Show first */}
      {hasAdmissionDates && (
        <>
          <h3 className="text-lg font-bold mb-3">Important Dates</h3>
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

      {/* Admission Process */}
      {hasAdmissionProcess && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Admission Process</h3>
          <div 
            className="prose max-w-none text-gray-700 bg-orange-50 border border-orange-200 rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: college.admission_process }}
          />
        </div>
      )}
    </div>
  );
};

// CUTOFF SECTION - EXACT same as main page
export const CutoffSection = ({ college }) => {
  const { year } = useYear();
  if (!college?.cutoff_data || college.cutoff_data.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Cutoff {college.cutoff_data[0]?.year || (year - 1)}</h2>
      <p className="text-gray-700 text-sm mb-4">Latest cutoff ranks for various programs:</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-orange-50">
              <th className="border px-4 py-3 text-left text-sm font-bold">Course</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Category</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Opening Rank</th>
              <th className="border px-4 py-3 text-left text-sm font-bold">Closing Rank</th>
            </tr>
          </thead>
          <tbody>
            {college.cutoff_data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-3 text-sm">{item.course || item.program}</td>
                <td className="border px-4 py-3 text-sm">{item.category || 'General'}</td>
                <td className="border px-4 py-3 text-sm font-bold text-blue-600">{item.opening_rank || item.cutoff || '-'}</td>
                <td className="border px-4 py-3 text-sm font-bold text-orange-600">{item.closing_rank_current || item.rank || '-'}</td>
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
  const { year } = useYear();
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
  const { year } = useYear();
  if (!college?.scholarships || college.scholarships.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Scholarships {year}</h2>
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

      {/* Campus Images from Media Section */}
      {(college.campus_images?.length > 0 || college.images?.length > 1) && (
        <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
          {(college.campus_images || college.images.slice(1)).slice(0, 6).map((img, i) => {
            const imageUrl = typeof img === 'string' ? img : img.url;
            const imageAlt = typeof img === 'object' 
              ? (img.alt || img.title || `Campus ${i + 1}`) 
              : `Campus ${i + 1}`;
            if (!imageUrl) return null;
            return (
              <div key={i} className="rounded-lg aspect-video overflow-hidden border">
                <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
              </div>
            );
          })}
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

// GALLERY SECTION - Connected to Media Section (campus_images) with Lightbox
export const GallerySection = ({ college }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);
  
  // Priority: campus_images (media section) > gallery > images
  const galleryImages = college?.campus_images?.length > 0 
    ? college.campus_images 
    : (college?.gallery?.length > 0 ? college.gallery : college?.images || []);
  
  if (galleryImages.length === 0) return null;
  
  // Get image data helper
  const getImageData = (image, idx) => {
    const imageUrl = typeof image === 'string' ? image : image.url;
    const imageAlt = typeof image === 'object' 
      ? (image.alt || image.title || image.caption || `${college.name} - Image ${idx + 1}`)
      : `${college.name} - Image ${idx + 1}`;
    const imageTitle = typeof image === 'object' ? (image.title || `Image ${idx + 1}`) : `Image ${idx + 1}`;
    return { imageUrl, imageAlt, imageTitle };
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Gallery</h2>
      <p className="text-gray-700 text-sm mb-4">
        Take a virtual tour of {college.name} campus. Click on any image to enlarge:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((image, idx) => {
          const { imageUrl, imageAlt, imageTitle } = getImageData(image, idx);
          
          if (!imageUrl) return null;
          
          return (
            <div key={idx} className="group">
              {/* Clickable Image Card */}
              <div 
                className="aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border cursor-pointer relative"
                onClick={() => setSelectedImage({ url: imageUrl, alt: imageAlt, title: imageTitle, index: idx })}
              >
                <img 
                  src={imageUrl} 
                  alt={imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Zoom icon overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Always visible image title */}
              <p className="mt-2 text-sm font-medium text-gray-700 truncate">{imageTitle}</p>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {selectedImage.index > 0 && (
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 z-50"
              onClick={(e) => {
                e.stopPropagation();
                const prevIdx = selectedImage.index - 1;
                const prevImage = galleryImages[prevIdx];
                const { imageUrl, imageAlt, imageTitle } = getImageData(prevImage, prevIdx);
                setSelectedImage({ url: imageUrl, alt: imageAlt, title: imageTitle, index: prevIdx });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {selectedImage.index < galleryImages.length - 1 && (
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 z-50"
              onClick={(e) => {
                e.stopPropagation();
                const nextIdx = selectedImage.index + 1;
                const nextImage = galleryImages[nextIdx];
                const { imageUrl, imageAlt, imageTitle } = getImageData(nextImage, nextIdx);
                setSelectedImage({ url: imageUrl, alt: imageAlt, title: imageTitle, index: nextIdx });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image container */}
          <div 
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Image title below enlarged image */}
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">{selectedImage.title}</p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedImage.index + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// INFO SECTION - EXACT same as main page (with School-specific info)
export const InfoSection = ({ college }) => {
  const isSchool = college?.institution_type === 'School';
  const hasSchoolInfo = isSchool && (college.board || college.medium || college.classes_offered?.length > 0 || college.streams_offered?.length > 0);
  
  return (
    <div>
      {/* School-Specific Info - Board, Medium, Classes, Streams */}
      {hasSchoolInfo && (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          {college.board && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Board:</span>
              <span className="px-3 py-1 bg-white text-blue-700 text-sm font-medium rounded border border-blue-200">{college.board}</span>
            </div>
          )}
          {college.medium && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Medium:</span>
              <span className="px-3 py-1 bg-white text-green-700 text-sm font-medium rounded border border-green-200">{college.medium}</span>
            </div>
          )}
          {college.classes_offered?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Classes:</span>
              <span className="px-3 py-1 bg-white text-purple-700 text-sm font-medium rounded border border-purple-200">
                {college.classes_offered[0]} to {college.classes_offered[college.classes_offered.length - 1]}
              </span>
            </div>
          )}
          {college.streams_offered?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Streams:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {college.streams_offered.map((stream, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white text-orange-700 text-sm font-medium rounded border border-orange-200">{stream}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

// LOCATION SECTION - EXACT same as main page (with GuestGate for ALL address & contact details)
export const LocationSection = ({ college }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{college.name} Location & Address</h2>
      <p className="text-gray-700 text-sm mb-4">
        Find {college.name} on the map and get complete address details:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address Details - ALL BLURRED for guest users */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Address</h3>
              
              {/* ENTIRE Address & Contact Details - Blurred for non-registered users */}
              <GuestGate title="Address & Contact Details">
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex gap-3">
                    <FiMapPin className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">{college.name}</p>
                      <p className="text-sm text-gray-600">
                        {college.location?.address || `${college.location?.city}, ${college.location?.state}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {college.location?.city}, {college.location?.state}
                      </p>
                      {college.location?.pincode && (
                        <p className="text-sm text-gray-600">India - {college.location.pincode}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone - Only show if data exists */}
                  {college.contact_info?.phone && (
                  <div className="flex gap-3">
                    <FiPhone className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{college.contact_info.phone}</p>
                    </div>
                  </div>
                  )}

                  {/* Email - Only show if data exists */}
                  {college.contact_info?.email && (
                  <div className="flex gap-3">
                    <FiMail className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Email</p>
                      <p className="text-sm text-gray-600">{college.contact_info.email}</p>
                    </div>
                  </div>
                  )}

                  {/* Website - Only show if data exists */}
                  {college.contact_info?.website && (
                  <div className="flex gap-3">
                    <FiGlobe className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Website</p>
                      <a href={college.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {college.contact_info.website}
                      </a>
                    </div>
                  </div>
                  )}
                </div>
              </GuestGate>
            </div>

            {/* How to Reach - Only show if data exists */}
            {college?.how_to_reach && (college.how_to_reach.by_metro || college.how_to_reach.by_bus || college.how_to_reach.by_train || college.how_to_reach.by_road || college.how_to_reach.by_air) && (
              <div className="pt-4 border-t">
                <h4 className="font-bold text-sm mb-2 text-gray-900">How to Reach</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {college.how_to_reach.by_metro && <p>• <strong>By Metro:</strong> {college.how_to_reach.by_metro}</p>}
                  {college.how_to_reach.by_bus && <p>• <strong>By Bus:</strong> {college.how_to_reach.by_bus}</p>}
                  {college.how_to_reach.by_train && <p>• <strong>By Train:</strong> {college.how_to_reach.by_train}</p>}
                  {college.how_to_reach.by_road && <p>• <strong>By Road:</strong> {college.how_to_reach.by_road}</p>}
                  {college.how_to_reach.by_air && <p>• <strong>By Air:</strong> {college.how_to_reach.by_air}</p>}
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                const address = college.location?.address || college.name;
                const city = college.location?.city || '';
                const searchQuery = encodeURIComponent(`${address}, ${city}`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
              }}
            >
              <FiExternalLink className="mr-2" />
              Get Directions
            </Button>
          </div>
        </div>

        {/* Google Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg overflow-hidden h-full min-h-[400px]">
            <iframe
              title="College Location Map"
              src={college.location?.map_embed_url || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.9!3d19.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzAwLjAiTiA3MsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Nearby Places / Landmarks */}
      {((college?.nearby_places && college.nearby_places.length > 0) || (college?.location?.nearby_places && college.location.nearby_places.length > 0)) && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">Nearby Places / Landmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(college.nearby_places || college.location?.nearby_places || []).map((place, idx) => {
              // Handle both string format ("METRO - 2 KM") and object format ({type, name, distance})
              const isString = typeof place === 'string';
              let placeName, placeDistance, placeType;
              
              if (isString) {
                // Parse string format: "METRO - 2 KM" or "AIRPORT-10 KM"
                const parts = place.split(/[-–]/);
                placeName = parts[0]?.trim() || place;
                placeDistance = parts.slice(1).join('-').trim() || '';
                placeType = placeName.toLowerCase();
              } else {
                placeName = place.name || '';
                placeDistance = place.distance || '';
                placeType = (place.type || placeName || '').toLowerCase();
              }
              
              // Icon and color mapping
              const iconMap = { 
                hospital: '🏥', bank: '🏦', market: '🏪', metro: '🚉', airport: '✈️', 
                restaurant: '🍽️', bus: '🚌', train: '🚂', station: '🚂', atm: '🏧', 
                pharmacy: '💊', mall: '🏬', school: '🏫', college: '🎓', temple: '🛕',
                church: '⛪', mosque: '🕌', park: '🌳', cinema: '🎬', hotel: '🏨'
              };
              const colorMap = { 
                hospital: 'bg-red-100', bank: 'bg-green-100', market: 'bg-purple-100', 
                metro: 'bg-orange-100', airport: 'bg-blue-100', restaurant: 'bg-yellow-100', 
                bus: 'bg-teal-100', train: 'bg-indigo-100', station: 'bg-indigo-100',
                atm: 'bg-pink-100', pharmacy: 'bg-cyan-100', mall: 'bg-violet-100',
                school: 'bg-amber-100', college: 'bg-emerald-100', temple: 'bg-orange-100',
                church: 'bg-gray-100', mosque: 'bg-green-100', park: 'bg-lime-100',
                cinema: 'bg-fuchsia-100', hotel: 'bg-sky-100'
              };
              
              // Find matching icon/color by checking if placeType contains any key
              let icon = '📍';
              let color = 'bg-gray-100';
              for (const key of Object.keys(iconMap)) {
                if (placeType.includes(key)) {
                  icon = iconMap[key];
                  color = colorMap[key];
                  break;
                }
              }
              
              return (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                  <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl">{icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{placeName}</p>
                    {placeDistance && <p className="text-xs text-gray-600">{placeDistance}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
