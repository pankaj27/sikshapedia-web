import React from 'react';
import { FiCalendar, FiInfo, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { SidebarSponsoredAd } from './SponsoredAds';

// Shared Sidebar Component for College Detail and Sub-pages
const CollegeSidebar = ({ 
  college, 
  onApplyClick, 
  onBookingClick,
  AdmissionPartnerBadge,
  sectionWidgets // Widget visibility settings from menu_config
}) => {
  if (!college) return null;

  // Helper to check if a widget should be shown
  // If sectionWidgets is not provided (main page), show all widgets
  // If sectionWidgets is provided, check if the widget is enabled (default true)
  const showWidget = (widgetName) => {
    if (!sectionWidgets) return true; // Main page shows all
    return sectionWidgets[widgetName] !== false; // Sub-page respects settings
  };

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-4">
        {/* Sponsor Ad - Sidebar */}
        <SidebarSponsoredAd placementId="college-detail-sidebar" />
        
        {/* ADMISSION PARTNER - BOOK YOUR SEAT */}
        {showWidget('apply_now') && college.is_admission_partner && AdmissionPartnerBadge && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-center">
              <AdmissionPartnerBadge size="lg" className="mb-3 justify-center" />
              <h3 className="font-bold text-xl mb-2">Admission Open!</h3>
              <p className="text-sm text-green-100 mb-4">Book your seat at {college.name}</p>
              <button 
                onClick={onBookingClick}
                className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={18} />
                <span>🎓 Book Your Seat</span>
              </button>
              <p className="text-xs text-green-100 mt-3">Limited seats available. Apply now!</p>
            </div>
          </div>
        )}
        
        {/* APPLY NOW BUTTON */}
        {showWidget('apply_now') && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">Apply to {college.name}</h3>
            <p className="text-sm text-orange-100 mb-4">Start your admission process now</p>
            <button 
              onClick={onApplyClick}
              className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <FiCheckCircle size={18} />
              <span>Apply Now</span>
            </button>
            {college?.admission_deadline && (
              <p className="text-xs text-orange-100 mt-3">Application Deadline: {college.admission_deadline}</p>
            )}
          </div>
        </div>
        )}

        {/* IMPORTANT DATES WIDGET */}
        {showWidget('important_dates') && college?.sidebar_widgets?.important_dates?.enabled && college?.sidebar_widgets?.important_dates?.dates?.length > 0 && (
          <div className="bg-white border rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-base mb-4 text-gray-900 flex items-center gap-2">
              <FiCalendar className="text-orange-500" />
              Important Dates
            </h3>
            <div className="space-y-3">
              {college.sidebar_widgets.important_dates.dates.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="bg-orange-100 text-orange-600 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-xs font-bold">{new Date(item.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                    <div className="text-lg font-bold">{new Date(item.date).getDate()}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                    {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK FACTS WIDGET */}
        {showWidget('quick_facts') && college?.sidebar_widgets?.quick_facts?.enabled && (
          <div className="bg-white border rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-base mb-4 text-gray-900 flex items-center gap-2">
              <FiInfo className="text-blue-500" />
              Quick Facts
            </h3>
            <div className="space-y-2">
              {college.sidebar_widgets.quick_facts.show_established && college.established_year && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Established</span>
                  <span className="font-semibold">{college.established_year}</span>
                </div>
              )}
              {college.sidebar_widgets.quick_facts.show_type && college.type && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold">{college.type}</span>
                </div>
              )}
              {college.sidebar_widgets.quick_facts.show_approval && college.approved_by && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approved By</span>
                  <span className="font-semibold">{college.approved_by}</span>
                </div>
              )}
              {college.sidebar_widgets.quick_facts.show_student_count && college.total_students > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold">{college.total_students.toLocaleString()}</span>
                </div>
              )}
              {college.sidebar_widgets.quick_facts.show_faculty_count && college.faculty_count > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Faculty</span>
                  <span className="font-semibold">{college.faculty_count}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOCIAL LINKS WIDGET */}
        {showWidget('social_links') && college?.social_links && (college.social_links.facebook || college.social_links.twitter || college.social_links.instagram || college.social_links.linkedin || college.social_links.youtube) && (
          <div className="bg-white border rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-base mb-4 text-gray-900">Follow {college.name}</h3>
            <div className="flex flex-wrap gap-2">
              {college.social_links.facebook && (
                <a href={college.social_links.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Facebook
                </a>
              )}
              {college.social_links.twitter && (
                <a href={college.social_links.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">
                  Twitter
                </a>
              )}
              {college.social_links.instagram && (
                <a href={college.social_links.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Instagram
                </a>
              )}
              {college.social_links.linkedin && (
                <a href={college.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">
                  LinkedIn
                </a>
              )}
              {college.social_links.youtube && (
                <a href={college.social_links.youtube} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                  YouTube
                </a>
              )}
            </div>
          </div>
        )}

        {/* AD BANNER WIDGET */}
        {showWidget('ad_banner') && college?.sidebar_widgets?.ad_banner?.enabled && college?.sidebar_widgets?.ad_banner?.image_url && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            {college.sidebar_widgets.ad_banner.cta_url ? (
              <a 
                href={college.sidebar_widgets.ad_banner.cta_url.startsWith('http') 
                  ? college.sidebar_widgets.ad_banner.cta_url 
                  : `https://${college.sidebar_widgets.ad_banner.cta_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src={college.sidebar_widgets.ad_banner.image_url.startsWith('/') 
                    ? `${process.env.REACT_APP_BACKEND_URL}${college.sidebar_widgets.ad_banner.image_url}` 
                    : college.sidebar_widgets.ad_banner.image_url} 
                  alt={college.sidebar_widgets.ad_banner.title || 'Advertisement'} 
                  className="w-full h-auto"
                />
              </a>
            ) : (
              <img 
                src={college.sidebar_widgets.ad_banner.image_url.startsWith('/') 
                  ? `${process.env.REACT_APP_BACKEND_URL}${college.sidebar_widgets.ad_banner.image_url}` 
                  : college.sidebar_widgets.ad_banner.image_url} 
                alt={college.sidebar_widgets.ad_banner.title || 'Advertisement'} 
                className="w-full h-auto"
              />
            )}
            
            {(college.sidebar_widgets.ad_banner.title || college.sidebar_widgets.ad_banner.description || (college.sidebar_widgets.ad_banner.show_cta_button !== false && college.sidebar_widgets.ad_banner.cta_url)) && (
              <div className="p-4">
                {college.sidebar_widgets.ad_banner.title && (
                  <h4 className="font-bold text-gray-900 mb-1">{college.sidebar_widgets.ad_banner.title}</h4>
                )}
                {college.sidebar_widgets.ad_banner.description && (
                  <p className="text-sm text-gray-600 mb-3">{college.sidebar_widgets.ad_banner.description}</p>
                )}
                {college.sidebar_widgets.ad_banner.show_cta_button !== false && college.sidebar_widgets.ad_banner.cta_url && (
                  <a 
                    href={college.sidebar_widgets.ad_banner.cta_url.startsWith('http') 
                      ? college.sidebar_widgets.ad_banner.cta_url 
                      : `https://${college.sidebar_widgets.ad_banner.cta_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded transition-colors"
                  >
                    {college.sidebar_widgets.ad_banner.cta_text || 'Learn More'}
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* COUNSELOR CTA */}
        {showWidget('counselor_cta') && college?.sidebar_widgets?.counselor_cta?.enabled && (
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2">{college.sidebar_widgets.counselor_cta.title || 'Need Help?'}</h3>
              <p className="text-sm text-orange-100 mb-4">{college.sidebar_widgets.counselor_cta.subtitle || 'Talk to our expert counselor'}</p>
              {college.sidebar_widgets.counselor_cta.phone ? (
                <a 
                  href={`tel:${college.sidebar_widgets.counselor_cta.phone}`}
                  className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
                >
                  📞 Talk to Expert
                </a>
              ) : (
                <a 
                  href={`https://wa.me/919830122122?text=Hi, I need help with admission for ${college.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
                >
                  Talk to Expert
                </a>
              )}
            </div>
          </div>
        )}

        {/* DEFAULT COUNSELOR CTA - Show only if counselor_cta is disabled or showWidget allows */}
        {showWidget('counselor_cta') && !college?.sidebar_widgets?.counselor_cta?.enabled && (
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2">Get Expert Guidance</h3>
              <p className="text-sm text-orange-100 mb-4">Connect with our counselors for FREE admission guidance</p>
              <a 
                href="https://wa.me/919830122122?text=Hi, I need help with college admission"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 rounded transition-colors text-center"
              >
                Talk to Expert
              </a>
            </div>
          </div>
        )}

        {/* POPULAR COURSES */}
        {showWidget('popular_courses') && (
        <div className="bg-white border rounded-lg shadow-sm p-5">
          <h3 className="font-bold text-base mb-4 text-gray-900">Popular Full Time Courses</h3>
          <div className="space-y-4">
            {college?.courses && college.courses.length > 0 ? (
              college.courses.slice(0, 5).map((course, i) => {
                const courseName = typeof course === 'string' ? course : course.name || 'Course';
                const courseFees = typeof course === 'object' ? (course.first_year_fee || course.total_fee || college.average_fees) : college.average_fees;
                return (
                  <div key={i} className={`pb-4 ${i !== Math.min(college.courses.length, 5) - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-bold text-blue-600">{courseName}</span>
                    </div>
                    {courseFees > 0 && (
                      <p className="text-xs text-gray-700 mb-3 font-medium">
                        ₹{(courseFees / 100000).toFixed(2)} Lakhs
                      </p>
                    )}
                    <button 
                      onClick={onApplyClick}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No courses available</p>
            )}
          </div>
        </div>

        {/* DOWNLOAD BROCHURE */}
        {college.brochure_url && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="text-center">
              <FiDownload size={32} className="mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Download Brochure</h3>
              <p className="text-sm text-blue-100 mb-4">Get detailed information about {college.name}</p>
              <a 
                href={college.brochure_url.startsWith('/') 
                  ? `${process.env.REACT_APP_BACKEND_URL}${college.brochure_url}` 
                  : college.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-2.5 rounded transition-colors text-center"
              >
                Download Now
              </a>
            </div>
          </div>
        )}

        {/* SIMILAR COLLEGES */}
        {college.similar_colleges && college.similar_colleges.length > 0 && (
          <div className="bg-white border rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-base mb-4 text-gray-900">Similar Colleges</h3>
            <div className="space-y-3">
              {college.similar_colleges.slice(0, 4).map((similar, idx) => (
                <a 
                  key={idx}
                  href={`/colleges/${similar.serial_number}-${similar.slug}`}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {similar.logo_url && (
                    <img 
                      src={similar.logo_url.startsWith('/') ? `${process.env.REACT_APP_BACKEND_URL}${similar.logo_url}` : similar.logo_url}
                      alt={similar.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{similar.name}</p>
                    <p className="text-xs text-gray-500">{similar.city}, {similar.state}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CollegeSidebar;
