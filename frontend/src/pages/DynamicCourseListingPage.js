import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiChevronRight, FiSearch, FiClock, FiBookOpen, FiArrowRight, 
  FiLoader, FiBriefcase, FiFileText, FiExternalLink, FiGrid,
  FiChevronDown, FiChevronUp, FiAward, FiDollarSign, FiUsers,
  FiCheckCircle, FiTrendingUp
} from 'react-icons/fi';
import api from '../api/axios';

// Default/Fallback page configurations (used when API fails)
const defaultPageConfigs = {
  'pg': {
    title: 'PG Courses in India',
    subtitle: 'Explore postgraduate courses including MBA, M.Tech, MA, M.Sc, M.Com and more',
    metaTitle: 'PG Courses in India 2025 - Masters & Postgraduate Programs',
    metaDescription: 'Find 500+ postgraduate courses in India. Explore MBA, M.Tech, MA, M.Sc programs with eligibility, fees, and top colleges.',
    filterKey: 'degree_type',
    filterValue: 'PG',
    theme: 'from-violet-600 via-purple-600 to-indigo-600',
    themeLight: 'violet',
    icon: '🎓',
    badge: 'Masters & Postgraduate',
    duration: '1-2 Years',
    benefits: ['Higher Salary Potential', 'Specialization', 'Research Opportunities', 'Leadership Roles', 'Global Recognition'],
    faqs: [
      { q: 'What are the best PG courses in India?', a: 'Popular PG courses include MBA, M.Tech, M.Sc, MA, M.Com, MCA, and specialized masters programs in various fields.' },
      { q: 'What is the eligibility for PG courses?', a: 'Generally, you need a bachelor\'s degree with minimum 50% marks. Some courses require entrance exams like CAT, GATE, or university-specific tests.' },
    ],
    popularCourses: ['MBA', 'M.Tech', 'M.Sc', 'MA', 'M.Com', 'MCA', 'LLM', 'M.Pharm'],
    relatedPages: ['/courses/after-12th', '/courses/phd', '/courses/diploma']
  },
  'phd': {
    title: 'PhD Programs in India',
    subtitle: 'Discover doctoral research programs across various disciplines',
    metaTitle: 'PhD Programs in India 2025 - Doctoral Research Courses',
    metaDescription: 'Explore PhD programs in India. Find research opportunities in Science, Engineering, Arts, Management with top universities.',
    filterKey: 'degree_type',
    filterValue: 'PhD',
    theme: 'from-slate-700 via-slate-800 to-gray-900',
    themeLight: 'slate',
    icon: '🔬',
    badge: 'Doctoral Research',
    duration: '3-5 Years',
    benefits: ['Research Excellence', 'Academic Career', 'Industry Research', 'Expert Recognition', 'Innovation Leadership'],
    faqs: [
      { q: 'How to apply for PhD in India?', a: 'Clear entrance exams like NET/GATE, apply to universities, submit research proposal, and appear for interviews.' },
      { q: 'What is the duration of PhD?', a: 'PhD typically takes 3-5 years including coursework, research, and thesis submission.' },
    ],
    popularCourses: ['PhD in Science', 'PhD in Engineering', 'PhD in Management', 'PhD in Arts', 'PhD in Commerce'],
    relatedPages: ['/courses/pg', '/courses/after-12th']
  },
  'certificate': {
    title: 'Certificate Courses in India',
    subtitle: 'Short-term skill-based courses for quick career advancement',
    metaTitle: 'Certificate Courses in India 2025 - Short Term Programs',
    metaDescription: 'Explore certificate courses in IT, Design, Marketing, Finance. Short-term programs for skill development and career growth.',
    filterKey: 'degree_type',
    filterValue: 'Certificate',
    theme: 'from-amber-500 via-orange-500 to-red-500',
    themeLight: 'amber',
    icon: '📜',
    badge: 'Short-Term Certification',
    duration: '3-12 Months',
    benefits: ['Quick Completion', 'Skill Focused', 'Affordable', 'Industry Recognized', 'Flexible Learning'],
    faqs: [
      { q: 'Are certificate courses valuable?', a: 'Yes, certificate courses from reputed institutions are valued by employers for specific skill sets.' },
      { q: 'What is the duration of certificate courses?', a: 'Certificate courses typically range from 3 months to 1 year depending on the program.' },
    ],
    popularCourses: ['Digital Marketing', 'Data Analytics', 'Web Development', 'Graphic Design', 'Financial Modeling'],
    relatedPages: ['/courses/diploma', '/courses/after-10th']
  },
  'engineering': {
    title: 'Engineering Courses in India',
    subtitle: 'B.Tech, B.E, M.Tech and other engineering programs',
    metaTitle: 'Engineering Courses in India 2025 - B.Tech, BE, M.Tech',
    metaDescription: 'Explore engineering courses in India. Find B.Tech, BE, M.Tech programs in CSE, ECE, Mechanical, Civil with top colleges.',
    filterKey: 'stream',
    filterValue: 'Engineering',
    theme: 'from-blue-600 via-blue-700 to-indigo-700',
    themeLight: 'blue',
    icon: '⚙️',
    badge: 'Technical Education',
    duration: '4 Years (B.Tech)',
    benefits: ['High Demand', 'Innovation Driven', 'Global Opportunities', 'Diverse Specializations', 'High Salary'],
    faqs: [
      { q: 'Which engineering branch is best?', a: 'CSE, ECE, and Mechanical are popular. Choose based on interest, job market, and future growth.' },
      { q: 'What is the eligibility for B.Tech?', a: '10+2 with PCM, minimum 50% marks, and clearing JEE Main/State entrance exams.' },
    ],
    popularCourses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Tech EEE', 'M.Tech'],
    relatedPages: ['/courses/after-12th', '/courses/diploma', '/courses/pg']
  },
  'medical': {
    title: 'Medical Courses in India',
    subtitle: 'MBBS, BDS, Nursing, Pharmacy and healthcare programs',
    metaTitle: 'Medical Courses in India 2025 - MBBS, BDS, Nursing',
    metaDescription: 'Explore medical courses in India. Find MBBS, BDS, BAMS, Nursing, Pharmacy programs with eligibility, fees, and top medical colleges.',
    filterKey: 'stream',
    filterValue: 'Medical',
    theme: 'from-red-600 via-rose-600 to-pink-600',
    themeLight: 'red',
    icon: '🏥',
    badge: 'Healthcare & Medicine',
    duration: '4-5.5 Years',
    benefits: ['Noble Profession', 'Job Security', 'High Respect', 'Global Opportunities', 'Life-Saving Impact'],
    faqs: [
      { q: 'How to become a doctor in India?', a: 'Complete 10+2 with PCB, clear NEET, get admission in MBBS, complete internship, and register with MCI.' },
      { q: 'What are alternative medical courses?', a: 'BAMS (Ayurveda), BHMS (Homeopathy), BDS (Dental), B.Pharm, Nursing are good alternatives.' },
    ],
    popularCourses: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Sc Nursing', 'B.Pharm', 'BUMS'],
    relatedPages: ['/courses/after-12th', '/courses/pg']
  },
  'management': {
    title: 'Management Courses in India',
    subtitle: 'BBA, MBA, PGDM and business management programs',
    metaTitle: 'Management Courses in India 2025 - BBA, MBA, PGDM',
    metaDescription: 'Explore management courses in India. Find BBA, MBA, PGDM programs with specializations in Finance, Marketing, HR, and Operations.',
    filterKey: 'stream',
    filterValue: 'Management',
    theme: 'from-purple-600 via-violet-600 to-indigo-600',
    themeLight: 'purple',
    icon: '📊',
    badge: 'Business & Management',
    duration: '2-3 Years',
    benefits: ['Leadership Skills', 'High Salary', 'Entrepreneurship', 'Global Network', 'Diverse Careers'],
    faqs: [
      { q: 'Which is better BBA or B.Com?', a: 'BBA focuses on management and business skills, while B.Com is more accounting/finance focused. Choose based on career goals.' },
      { q: 'How to get into top MBA colleges?', a: 'Score well in CAT/XAT/GMAT, have good academic record, work experience, and prepare for GD-PI rounds.' },
    ],
    popularCourses: ['MBA', 'BBA', 'PGDM', 'BMS', 'BBM', 'Executive MBA'],
    relatedPages: ['/courses/commerce', '/courses/after-12th', '/courses/pg']
  },
  'science': {
    title: 'Science Courses in India',
    subtitle: 'B.Sc, M.Sc and research-oriented science programs',
    metaTitle: 'Science Courses in India 2025 - BSc, MSc Programs',
    metaDescription: 'Explore science courses in India. Find B.Sc, M.Sc programs in Physics, Chemistry, Biology, Mathematics with top universities.',
    filterKey: 'stream',
    filterValue: 'Science',
    theme: 'from-cyan-600 via-teal-600 to-emerald-600',
    themeLight: 'cyan',
    icon: '🔬',
    badge: 'Pure & Applied Sciences',
    duration: '3 Years (B.Sc)',
    benefits: ['Research Foundation', 'Analytical Skills', 'Diverse Fields', 'Higher Studies', 'Innovation'],
    faqs: [
      { q: 'What can I do after B.Sc?', a: 'Pursue M.Sc, MBA, B.Ed, or enter jobs in research, teaching, pharma, IT, and more.' },
      { q: 'Which science stream has best scope?', a: 'Computer Science, Biotechnology, Data Science, and Environmental Science have excellent career prospects.' },
    ],
    popularCourses: ['B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Mathematics', 'B.Sc Biology', 'B.Sc Computer Science'],
    relatedPages: ['/courses/after-12th', '/courses/engineering', '/courses/pg']
  },
  'commerce': {
    title: 'Commerce Courses in India',
    subtitle: 'B.Com, CA, CS, CMA and finance-related programs',
    metaTitle: 'Commerce Courses in India 2025 - BCom, CA, CS',
    metaDescription: 'Explore commerce courses in India. Find B.Com, CA, CS, CMA programs with career options in accounting, finance, and banking.',
    filterKey: 'stream',
    filterValue: 'Commerce',
    theme: 'from-emerald-600 via-green-600 to-teal-600',
    themeLight: 'emerald',
    icon: '💰',
    badge: 'Finance & Accounting',
    duration: '3 Years (B.Com)',
    benefits: ['Financial Expertise', 'Stable Careers', 'Professional Certifications', 'Business Acumen', 'High Demand'],
    faqs: [
      { q: 'What is better CA or MBA?', a: 'CA is specialized in accounting/audit while MBA is broader management education. CA has higher entry barrier but assured career.' },
      { q: 'What are the best commerce courses?', a: 'B.Com, CA, CS, CMA, BBA, and specialized certifications like CFA, FRM are highly valued.' },
    ],
    popularCourses: ['B.Com', 'B.Com (Hons)', 'CA', 'CS', 'CMA', 'BBA', 'M.Com'],
    relatedPages: ['/courses/management', '/courses/after-12th', '/courses/pg']
  },
  'arts': {
    title: 'Arts & Humanities Courses',
    subtitle: 'BA, MA and liberal arts programs across disciplines',
    metaTitle: 'Arts Courses in India 2025 - BA, MA Programs',
    metaDescription: 'Explore arts and humanities courses in India. Find BA, MA programs in English, History, Psychology, Sociology with career options.',
    filterKey: 'stream',
    filterValue: 'Arts',
    theme: 'from-pink-600 via-rose-600 to-red-600',
    themeLight: 'pink',
    icon: '🎨',
    badge: 'Liberal Arts & Humanities',
    duration: '3 Years (BA)',
    benefits: ['Critical Thinking', 'Communication Skills', 'Creativity', 'Diverse Careers', 'Cultural Understanding'],
    faqs: [
      { q: 'What jobs can I get with BA degree?', a: 'Content writing, journalism, teaching, HR, civil services, social work, and many more.' },
      { q: 'Is arts a good stream?', a: 'Yes! Arts graduates excel in media, law, civil services, teaching, and creative industries.' },
    ],
    popularCourses: ['BA English', 'BA Psychology', 'BA Economics', 'BA History', 'BA Political Science', 'BA Journalism'],
    relatedPages: ['/courses/after-12th', '/courses/law', '/courses/education']
  },
  'computer': {
    title: 'Computer & IT Courses',
    subtitle: 'BCA, MCA, B.Tech CS and information technology programs',
    metaTitle: 'Computer Courses in India 2025 - BCA, MCA, IT Programs',
    metaDescription: 'Explore computer and IT courses in India. Find BCA, MCA, B.Tech CSE, Data Science programs with top colleges and career options.',
    filterKey: 'stream',
    filterValue: 'Computer Applications',
    theme: 'from-indigo-600 via-blue-600 to-violet-600',
    themeLight: 'indigo',
    icon: '💻',
    badge: 'Information Technology',
    duration: '3-4 Years',
    benefits: ['High Demand', 'Remote Work', 'Innovation', 'Global Opportunities', 'Excellent Salary'],
    faqs: [
      { q: 'Which is better BCA or B.Tech CSE?', a: 'B.Tech CSE is more comprehensive (4 years) while BCA (3 years) is focused on applications. B.Tech has better placement scope.' },
      { q: 'What programming languages should I learn?', a: 'Python, JavaScript, Java, SQL are essential. Also learn frameworks relevant to your career path.' },
    ],
    popularCourses: ['B.Tech CSE', 'BCA', 'MCA', 'B.Sc IT', 'Data Science', 'AI/ML'],
    relatedPages: ['/courses/engineering', '/courses/after-12th', '/courses/certificate']
  },
  'law': {
    title: 'Law Courses in India',
    subtitle: 'LLB, BA LLB, LLM and legal education programs',
    metaTitle: 'Law Courses in India 2025 - LLB, BALLB, LLM',
    metaDescription: 'Explore law courses in India. Find LLB, BA LLB, LLM programs with eligibility, fees, and top law colleges.',
    filterKey: 'stream',
    filterValue: 'Law',
    theme: 'from-amber-600 via-yellow-600 to-orange-600',
    themeLight: 'amber',
    icon: '⚖️',
    badge: 'Legal Education',
    duration: '3-5 Years',
    benefits: ['Prestigious Career', 'Advocacy', 'Corporate Law', 'Judiciary', 'Social Impact'],
    faqs: [
      { q: 'How to become a lawyer in India?', a: 'Complete 12th, clear CLAT/LSAT, get LLB degree (3 or 5 years), enroll with Bar Council, and practice.' },
      { q: 'Which is better 3 year or 5 year LLB?', a: '5-year integrated BA LLB after 12th is comprehensive. 3-year LLB is for graduates.' },
    ],
    popularCourses: ['BA LLB', 'BBA LLB', 'LLB', 'LLM', 'B.Com LLB'],
    relatedPages: ['/courses/arts', '/courses/after-12th', '/courses/pg']
  },
  'education': {
    title: 'Education & Teaching Courses',
    subtitle: 'B.Ed, D.El.Ed, M.Ed and teacher training programs',
    metaTitle: 'Education Courses in India 2025 - BEd, DEd, MEd',
    metaDescription: 'Explore education and teaching courses in India. Find B.Ed, D.El.Ed, M.Ed programs with eligibility and career in teaching.',
    filterKey: 'stream',
    filterValue: 'Education',
    theme: 'from-sky-600 via-cyan-600 to-blue-600',
    themeLight: 'sky',
    icon: '📚',
    badge: 'Teacher Training',
    duration: '1-2 Years',
    benefits: ['Noble Profession', 'Job Security', 'Work-Life Balance', 'Government Jobs', 'Shape Future'],
    faqs: [
      { q: 'How to become a school teacher?', a: 'Complete graduation, clear entrance exam, complete B.Ed/D.El.Ed, clear TET/CTET, apply for teaching positions.' },
      { q: 'What is the difference between B.Ed and D.El.Ed?', a: 'B.Ed is for teaching classes 6-12 (after graduation). D.El.Ed is for teaching classes 1-5 (after 12th).' },
    ],
    popularCourses: ['B.Ed', 'D.El.Ed', 'M.Ed', 'B.P.Ed', 'NTT'],
    relatedPages: ['/courses/arts', '/courses/pg', '/courses/after-12th']
  }
};

const DynamicCourseListingPage = () => {
  // Get category from URL path (e.g., /courses/engineering -> engineering)
  const path = window.location.pathname;
  const category = path.split('/').pop() || 'engineering';
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [config, setConfig] = useState(defaultPageConfigs[category] || defaultPageConfigs['engineering']);

  // Theme colors based on config
  const themeColors = {
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', btn: 'from-violet-500 to-purple-600' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', btn: 'from-slate-600 to-gray-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', btn: 'from-amber-500 to-orange-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', btn: 'from-orange-500 to-amber-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', btn: 'from-blue-500 to-indigo-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', btn: 'from-red-500 to-rose-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', btn: 'from-purple-500 to-violet-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', btn: 'from-cyan-500 to-teal-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', btn: 'from-emerald-500 to-green-600' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', btn: 'from-pink-500 to-rose-600' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', btn: 'from-indigo-500 to-blue-600' },
    sky: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', btn: 'from-sky-500 to-cyan-600' },
  };
  
  const colors = themeColors[config.themeLight || config.theme_light] || themeColors.blue;

  // Fetch page settings from API
  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const response = await api.get(`/course-pages/${category}`);
        if (response.data) {
          // Map API response to expected config format
          const apiConfig = response.data;
          setConfig({
            title: apiConfig.title,
            subtitle: apiConfig.subtitle,
            metaTitle: apiConfig.meta_title,
            metaDescription: apiConfig.meta_description,
            filterKey: apiConfig.filter_key,
            filterValue: apiConfig.filter_value,
            theme: apiConfig.theme,
            themeLight: apiConfig.theme_light,
            icon: apiConfig.icon,
            badge: apiConfig.badge,
            duration: apiConfig.duration,
            benefits: apiConfig.benefits || [],
            faqs: (apiConfig.faqs || []).map(f => ({ q: f.question, a: f.answer })),
            popularCourses: apiConfig.popular_courses || [],
            relatedPages: apiConfig.related_pages || [],
            sidebarCtaTitle: apiConfig.sidebar_cta_title,
            sidebarCtaText: apiConfig.sidebar_cta_text,
            sidebarCtaButton: apiConfig.sidebar_cta_button,
            introContent: apiConfig.intro_content || '',
            bottomContent: apiConfig.bottom_content || '',
          });
        }
      } catch (error) {
        console.error('Error fetching page settings:', error);
        // Keep default config on error
      }
    };
    
    fetchPageSettings();
  }, [category]);

  // Fetch courses based on config
  useEffect(() => {
    const fetchCourses = async () => {
      if (!config.filterKey || !config.filterValue) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/courses-detail?${config.filterKey}=${config.filterValue}&status=published&limit=500`);
        const coursesData = response.data || [];
        
        setAllCourses(coursesData);
        
        if (coursesData.length > 0) {
          const grouped = {};
          coursesData.forEach(course => {
            const cat = config.filterKey === 'stream' ? (course.degree_type || 'Other') : (course.stream || 'Other');
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: course.id,
              name: course.name,
              full_name: course.full_name,
              duration: course.duration,
              course_mode: course.course_mode || 'Full Time',
              slug: course.slug,
              degree_type: course.degree_type,
              average_fees: course.average_fees,
              stream: course.stream
            });
          });
          
          const sortedGrouped = Object.keys(grouped).sort().reduce((obj, key) => {
            obj[key] = grouped[key];
            return obj;
          }, {});
          
          setCoursesByCategory(sortedGrouped);
        } else {
          setCoursesByCategory({});
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesByCategory({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [category, config.filterKey, config.filterValue]);
  
  useEffect(() => {
    const expanded = {};
    Object.keys(coursesByCategory).forEach(cat => expanded[cat] = true);
    setExpandedCategories(expanded);
  }, [coursesByCategory]);

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredCategories = Object.entries(coursesByCategory).filter(([cat, courses]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return cat.toLowerCase().includes(query) || courses.some(c => c.name.toLowerCase().includes(query));
  });

  const totalCourses = allCourses.length;
  const totalCategories = Object.keys(coursesByCategory).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className={`bg-gradient-to-br ${config.theme} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="relative container mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-white font-medium capitalize">{category}</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <span className="text-xl">{config.icon}</span>
                  <span className="text-sm font-medium">{config.badge}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{config.title}</h1>
                <p className="text-lg text-white/80 mb-6 max-w-2xl">{config.subtitle}</p>

                {/* Search Box */}
                <div className="relative max-w-xl mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiSearch className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${category} courses...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                  />
                </div>
              </div>

              {/* Stats */}
              {totalCourses > 0 && (
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <FiBookOpen className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{totalCourses}+</div>
                    <div className="text-white/70 text-sm">Courses</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <FiGrid className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{totalCategories}</div>
                    <div className="text-white/70 text-sm">Categories</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <FiClock className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{config.duration}</div>
                    <div className="text-white/70 text-sm">Duration</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
                    <FiTrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">High</div>
                    <div className="text-white/70 text-sm">Demand</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {config.benefits.slice(0, 5).map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  <FiCheckCircle className={`w-5 h-5 ${colors.text}`} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        {totalCourses > 0 && (
          <section className="bg-white border-b shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                <span className="text-gray-500 text-sm whitespace-nowrap font-medium">Browse:</span>
                {Object.keys(coursesByCategory).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => document.getElementById(cat.replace(/\s+/g, '-').toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className={`px-4 py-2 text-sm ${colors.bg} ${colors.text} hover:opacity-80 rounded-full whitespace-nowrap transition-all font-medium border ${colors.border}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course List */}
            <div className="flex-1">
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
                  <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-4xl">{config.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No {config.title.split(' ')[0]} Courses Available Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery ? "No courses match your search." : "Courses will be displayed here once added by admin."}
                  </p>
                  {!searchQuery && (
                    <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 max-w-md mx-auto`}>
                      <p className={`text-sm ${colors.text}`}>
                        <strong>Admin:</strong> Add courses with <code className="bg-white px-1 rounded">{config.filterKey} = "{config.filterValue}"</code>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map(([cat, courses]) => {
                    const isExpanded = expandedCategories[cat];
                    const filtered = searchQuery ? courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) : courses;
                    if (filtered.length === 0) return null;

                    return (
                      <div key={cat} id={cat.replace(/\s+/g, '-').toLowerCase()} className="bg-white rounded-2xl shadow-sm border overflow-hidden scroll-mt-20">
                        <button
                          onClick={() => toggleCategory(cat)}
                          className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${colors.btn} text-white hover:opacity-95 transition-opacity`}
                        >
                          <div className="text-left">
                            <h2 className="text-xl font-bold">{cat}</h2>
                            <p className="text-sm text-white/80">{courses.length} courses</p>
                          </div>
                          {isExpanded ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                        </button>

                        {isExpanded && (
                          <div className="divide-y">
                            {filtered.map((course, idx) => (
                              <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <Link to={`/courses/${course.slug}`} className={`text-lg font-semibold text-gray-800 hover:${colors.text} transition-colors`}>
                                      {course.name}
                                    </Link>
                                    {course.full_name && course.full_name !== course.name && (
                                      <p className="text-sm text-gray-500">{course.full_name}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                      <span className={`inline-flex items-center gap-1 px-3 py-1 ${colors.bg} ${colors.border} border rounded-lg text-xs font-medium ${colors.text}`}>
                                        <FiClock className="w-3 h-3" /> {course.duration}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-medium text-green-700">
                                        <FiBookOpen className="w-3 h-3" /> {course.course_mode}
                                      </span>
                                      {course.average_fees > 0 && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                                          <FiDollarSign className="w-3 h-3" /> ₹{(course.average_fees/1000).toFixed(0)}K/yr
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                      <Link to={`/courses/${course.slug}`} className={`text-sm ${colors.text} hover:underline flex items-center gap-1`}>
                                        <FiFileText className="w-3 h-3" /> Overview
                                      </Link>
                                      <Link to={`/courses/${course.slug}#career`} className={`text-sm ${colors.text} hover:underline flex items-center gap-1`}>
                                        <FiBriefcase className="w-3 h-3" /> Careers
                                      </Link>
                                      <Link to={`/courses/${course.slug}#colleges`} className={`text-sm ${colors.text} hover:underline flex items-center gap-1`}>
                                        <FiGrid className="w-3 h-3" /> Colleges
                                      </Link>
                                    </div>
                                  </div>
                                  <Link to={`/courses/${course.slug}`} className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.btn} text-white font-medium rounded-xl transition-all shadow-sm whitespace-nowrap`}>
                                    View Details <FiArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Popular Courses */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiTrendingUp className={colors.text} /> Popular Courses
                </h3>
                <div className="space-y-2">
                  {config.popularCourses.map((course, idx) => (
                    <Link key={idx} to={`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center gap-3 p-2 hover:${colors.bg} rounded-lg text-gray-700 hover:${colors.text} transition-colors text-sm`}>
                      <span className={`w-6 h-6 ${colors.bg} rounded ${colors.text} flex items-center justify-center text-xs font-bold`}>{idx + 1}</span>
                      <span>{course}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Pages</h3>
                <div className="space-y-2">
                  {config.relatedPages.map((page, idx) => (
                    <Link key={idx} to={page} className={`block p-3 bg-gray-50 hover:${colors.bg} rounded-xl text-gray-700 hover:${colors.text} transition-colors text-sm capitalize`}>
                      📚 {page.split('/').pop().replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Why Choose */}
              <div className={`bg-gradient-to-br ${config.theme} rounded-2xl shadow-sm p-5 text-white`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FiAward /> Why Choose?
                </h3>
                <ul className="space-y-3 text-sm">
                  {config.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FiCheckCircle className="w-4 h-4 mt-0.5 text-white/70 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gray-900 rounded-2xl shadow-sm p-5 text-white text-center">
                <h3 className="font-bold mb-2">{config.sidebarCtaTitle || 'Need Guidance?'}</h3>
                <p className="text-sm text-gray-400 mb-4">{config.sidebarCtaText || 'Get expert counselling'}</p>
                <button className={`w-full py-3 bg-gradient-to-r ${colors.btn} text-white font-medium rounded-xl transition-colors`}>
                  {config.sidebarCtaButton || 'Get Free Counselling'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {(config.faqs || []).length > 0 && (
          <section className="bg-white border-t py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto space-y-4">
                {(config.faqs || []).map((faq, idx) => (
                  <div key={idx} className={`${colors.bg} rounded-xl p-5 border ${colors.border}`}>
                    <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.q || faq.question}</h3>
                    <p className="text-gray-600 text-sm">A: {faq.a || faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default DynamicCourseListingPage;
