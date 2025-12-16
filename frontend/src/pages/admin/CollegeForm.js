import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiEdit, FiUpload, FiLoader, FiChevronDown, FiChevronRight,
  FiBook, FiMonitor, FiActivity, FiSearch, FiUsers, FiCast, FiVideo, FiDatabase,
  FiMic, FiZap, FiTarget, FiDroplet, FiGrid, FiSquare, FiSun, FiHome, FiMapPin,
  FiHeart, FiMessageCircle, FiTruck, FiCoffee, FiShoppingBag, FiShoppingCart,
  FiCreditCard, FiMail, FiWifi, FiBattery, FiShield, FiBriefcase, FiTrendingUp,
  FiAward, FiMusic, FiBookOpen, FiPrinter, FiFilm, FiPackage, FiFeather, FiUnlock,
  FiInfo, FiFileText, FiBarChart2, FiDollarSign, FiMessageSquare, FiBookmark, FiImage, FiCalendar, FiHelpCircle, FiStar, FiLayers
} from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../../api/axios';

import { Button } from '../../components/ui/button';

// Menu icon options with professional icons
const menuIconOptions = [
  { id: 'info', label: 'Info', icon: <FiInfo size={16} /> },
  { id: 'overview', label: 'Overview', icon: <FiHome size={16} /> },
  { id: 'courses', label: 'Courses', icon: <FiBook size={16} /> },
  { id: 'programs', label: 'Programs', icon: <HiOutlineAcademicCap size={16} /> },
  { id: 'admission', label: 'Admission', icon: <FiFileText size={16} /> },
  { id: 'cutoff', label: 'Cutoff', icon: <FiBarChart2 size={16} /> },
  { id: 'placement', label: 'Placement', icon: <FiBriefcase size={16} /> },
  { id: 'ranking', label: 'Ranking', icon: <FiAward size={16} /> },
  { id: 'scholarship', label: 'Scholarship', icon: <HiOutlineCurrencyRupee size={16} /> },
  { id: 'fees', label: 'Fees', icon: <FiDollarSign size={16} /> },
  { id: 'facilities', label: 'Facilities', icon: <HiOutlineOfficeBuilding size={16} /> },
  { id: 'campus', label: 'Campus', icon: <HiOutlineLibrary size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <FiMessageSquare size={16} /> },
  { id: 'gallery', label: 'Gallery', icon: <FiImage size={16} /> },
  { id: 'faculty', label: 'Faculty', icon: <FiUsers size={16} /> },
  { id: 'events', label: 'Events', icon: <FiCalendar size={16} /> },
  { id: 'location', label: 'Location', icon: <FiMapPin size={16} /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle size={16} /> },
  { id: 'contact', label: 'Contact', icon: <FiMail size={16} /> },
  { id: 'default', label: 'Default', icon: <FiBookmark size={16} /> },
];

// Emoji to icon ID mapping for backward compatibility
const emojiToIconId = {
  '📋': 'info', '📚': 'courses', '📝': 'admission', '📊': 'cutoff',
  '💼': 'placement', '🏆': 'ranking', '💰': 'scholarship', '🏫': 'facilities',
  '⭐': 'reviews', '🎓': 'programs', '📍': 'location', '📞': 'contact',
  '🖼️': 'gallery', '❓': 'faq', '📌': 'default', '🏠': 'overview',
  '💵': 'fees', '🏢': 'campus', '$': 'fees', '💲': 'fees'
};

// Helper to normalize icon value (convert emoji to ID if needed)
const normalizeIconValue = (iconValue) => {
  if (!iconValue) return 'default';
  if (emojiToIconId[iconValue]) return emojiToIconId[iconValue];
  if (menuIconOptions.find(opt => opt.id === iconValue)) return iconValue;
  return 'default';
};

// Helper to get icon by ID
const getMenuIconById = (iconId) => {
  const normalizedId = normalizeIconValue(iconId);
  const found = menuIconOptions.find(opt => opt.id === normalizedId);
  return found ? found.icon : <FiBookmark size={16} />;
};
import { generateSlug } from '../../utils/slugify';

// Collapsible Section Component for better UX
const CollapsibleSection = ({ title, children, defaultOpen = true, icon = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {isOpen ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

const CollegeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recognitions, setRecognitions] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [accreditationsList, setAccreditationsList] = useState([]);
  const [accreditationLevelsList, setAccreditationLevelsList] = useState([]);
  const [rankingsList, setRankingsList] = useState([]);
  const [rankCategoriesList, setRankCategoriesList] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableScholarships, setAvailableScholarships] = useState([]);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [availableNews, setAvailableNews] = useState([]);

  // Icon mapping for facilities
  const iconComponents = {
    FiBook, FiMonitor, FiActivity, FiSearch, FiUsers, FiCast, FiVideo, FiDatabase,
    FiMic, FiZap, FiTarget, FiDroplet, FiGrid, FiSquare, FiSun, FiHome, FiMapPin,
    FiHeart, FiMessageCircle, FiTruck, FiCoffee, FiShoppingBag, FiShoppingCart,
    FiCreditCard, FiMail, FiWifi, FiBattery, FiShield, FiBriefcase, FiTrendingUp,
    FiAward, FiMusic, FiBookOpen, FiPrinter, FiFilm, FiPackage, FiFeather, FiUnlock
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent className="inline" /> : null;
  };
  
  // Indian States and Cities
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const citiesByState = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 'Proddatur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Srikakulam', 'Narasaraopet', 'Rajampet', 'Tadpatri', 'Tadepalligudem', 'Chilakaluripet', 'Yemmiganur', 'Kavali', 'Palacole', 'Sullurpeta', 'Tanuku', 'Rayachoti', 'Mandapeta', 'Nagari', 'Vinukonda', 'Narasapuram'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Seppa', 'Changlang', 'Along', 'Daporijo', 'Anini', 'Roing', 'Khonsa', 'Namsai', 'Aalo', 'Yupia', 'Jairampur'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta', 'Lanka', 'Lumding', 'Mangaldoi', 'Hailakandi', 'Haflong', 'Golaghat', 'Morigaon', 'Nalbari', 'Rangia', 'Sibsagar', 'Hojai', 'Kokrajhar', 'Mariani', 'Nazira', 'Digboi', 'Lakhipur', 'Dhekiajuli', 'Dhing', 'Diphu', 'Gauripur', 'Marigaon', 'Numaligarh', 'Sarupathar'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad', 'Madhubani', 'Bettiah', 'Gopalganj', 'Samastipur', 'Bhabua', 'Lakhisarai', 'Madhepura', 'Supaul', 'Araria', 'Sheohar', 'Vaishali', 'Sheikhpura', 'Jamui'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri', 'Bhatapara', 'Dalli-Rajhara', 'Naila Janjgir', 'Tilda Newra', 'Mungeli', 'Manendragarh', 'Sakti', 'Kawardha', 'Dongargaon', 'Champa', 'Kanker', 'Bemetra', 'Narayanpur', 'Kondagaon', 'Sukma', 'Bijapur', 'Khairagarh', 'Dongargaon', 'Akaltara', 'Balod', 'Baloda Bazar'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem', 'Canacona', 'Pernem', 'Valpoi', 'Sanguem', 'Shiroda', 'Aldona', 'Calangute', 'Candolim', 'Colva', 'Anjuna', 'Benaulim', 'Morjim', 'Arambol'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Nadiad', 'Morbi', 'Surendranagar', 'Bharuch', 'Mehsana', 'Gandhidham', 'Navsari', 'Vapi', 'Veraval', 'Porbandar', 'Godhra', 'Palanpur', 'Valsad', 'Patan', 'Deesa', 'Amreli', 'Ankleshwar', 'Botad', 'Dahod', 'Kalol', 'Jetpur', 'Gondal', 'Modasa', 'Vyara', 'Bhuj', 'Mahuva', 'Himmatnagar', 'Khambhat', 'Petlad', 'Dhoraji', 'Upleta', 'Rajpipla', 'Mandvi', 'Sidhpur', 'Visnagar', 'Wadhwan', 'Wankaner'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Rohtak', 'Hisar', 'Panipat', 'Karnal', 'Ambala', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Pundri', 'Kosli', 'Narnaul', 'Fatehabad', 'Gohana', 'Tohana', 'Narwana', 'Mandi Dabwali', 'Charkhi Dadri', 'Shahabad', 'Pehowa', 'Samalkha', 'Pinjore', 'Ladwa', 'Sohna', 'Safidon', 'Taraori', 'Mahendragarh', 'Ratia', 'Rania', 'Sarsod'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur', 'Bilaspur', 'Una', 'Palampur', 'Nahan', 'Chamba', 'Baddi', 'Sundernagar', 'Kangra', 'Nalagarh', 'Nurpur', 'Rampur', 'Arki', 'Jubbal', 'Rohru', 'Paonta Sahib', 'Parwanoo', 'Manali', 'Jogindernagar', 'Dalhousie', 'Kasauli', 'Nadaun', 'Dagshai', 'Kala Amb', 'Gagret'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Phusro', 'Chas', 'Chaibasa', 'Sahibganj', 'Dumka', 'Godda', 'Chatra', 'Gumla', 'Khunti', 'Lohardaga', 'Simdega', 'Jamtara', 'Koderma', 'Pakur', 'Latehar', 'Garhwa', 'Palamu', 'Sahebganj', 'Rajmahal', 'Mihijam', 'Madhupur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Shimoga', 'Davangere', 'Tumkur', 'Bellary', 'Bijapur', 'Hospet', 'Hassan', 'Raichur', 'Bidar', 'Udupi', 'Chitradurga', 'Kolar', 'Mandya', 'Chikmagalur', 'Gangavati', 'Bagalkot', 'Robertson Pet', 'Bhadravati', 'Karwar', 'Ranibennur', 'Dharwad', 'Gadag', 'Robertsonpet', 'Haveri', 'Yadgir', 'Koppal', 'Chamrajnagar', 'Chikkaballapur', 'Ramanagara', 'Madhugiri', 'Tiptur', 'Harihar', 'Sirsi', 'Bhatkal', 'Arsikere', 'Puttur', 'Sagar', 'Sullia', 'Kushalnagar'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Malappuram', 'Alappuzha', 'Kottayam', 'Pathanamthitta', 'Kasaragod', 'Idukki', 'Wayanad', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad', 'Payyanur', 'Koyilandy', 'Parappanangadi', 'Kalamassery', 'Neyyattinkara', 'Kayamkulam', 'Nedumangad', 'Kannur Cantonment', 'Mattannur', 'Punalur', 'Nilambur', 'Cherthala', 'Sultan Bathery', 'Maradu', 'Kottakkal', 'Thodupuzha', 'Perinthalmanna', 'Chalakudy', 'Paravoor', 'Pathanapuram', 'Peringathur', 'Attingal', 'Kodungallur', 'Pattambi', 'Tirur', 'Kalpetta', 'Muvattupuzha', 'Taliparamba'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Ratlam', 'Dewas', 'Satna', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi', 'Sehore', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Dhar', 'Sendhwa', 'Mhow', 'Mandla', 'Tikamgarh', 'Shahdol', 'Balaghat', 'Barwani', 'Narsinghpur', 'Raisen', 'Shajapur', 'Rajgarh'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Ichalkaranji', 'Parbhani', 'Panvel', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Nanded', 'Satara', 'Wardha', 'Udgir', 'Bid', 'Jalna', 'Gondia', 'Barshi', 'Palghar', 'Beed', 'Chandrapur', 'Pimpri-Chinchwad', 'Bhusawal', 'Nandurbar', 'Washim', 'Amalner', 'Buldana', 'Hinganghat', 'Kamptee', 'Gondiya', 'Malkapur', 'Shegaon', 'Yawal', 'Vaijapur', 'Lonavala', 'Karjat', 'Alibag', 'Ratnagiri', 'Sawantwadi', 'Sindhudurg', 'Kudal', 'Vengurla'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong', 'Jiribam', 'Moreh', 'Chandel', 'Pherzawl', 'Noney', 'Kangpokpi', 'Tengnoupal'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Nongpoh', 'Mairang', 'Mawkyrwat', 'Resubelpara', 'Cherrapunji', 'Dawki', 'Nongpoh'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha', 'Lawngtlai', 'Mamit', 'Hnahthial', 'Khawzawl', 'Saitual'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Longleng', 'Kiphire', 'Peren', 'Noklak'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Berhampur', 'Sambalpur', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Balangir', 'Rayagada', 'Bhawanipatna', 'Dhenkanal', 'Barbil', 'Kendujhar', 'Sunabeda', 'Jatani', 'Biramitrapur', 'Byasanagar', 'Paradip', 'Angul', 'Talcher', 'Kendrapara', 'Jagatsinghpur', 'Paradeep', 'Jajpur', 'Phulabani', 'Koraput', 'Nabarangpur', 'Boudh', 'Nayagarh', 'Nuapada'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Malerkotla', 'Khanna', 'Barnala', 'Firozpur', 'Phagwara', 'Kapurthala', 'Abohar', 'Zirakpur', 'Kot Kapura', 'Muktsar', 'Rajpura', 'Faridkot', 'Nabha', 'Fazilka', 'Mansa', 'Sangrur', 'Fatehgarh Sahib', 'Sunam', 'Gurdaspur', 'Kharar', 'Morinda', 'Jagraon', 'Doraha', 'Zira', 'Samana', 'Rampura Phul', 'Dhuri', 'Malout', 'Qadian', 'Talwandi Sabo'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur', 'Pali', 'Tonk', 'Kishangarh', 'Beawar', 'Churu', 'Ganganagar', 'Hanumangarh', 'Sawai Madhopur', 'Chittorgarh', 'Jhunjhunu', 'Nagaur', 'Bundi', 'Barmer', 'Jaisalmer', 'Banswara', 'Dungarpur', 'Pratapgarh', 'Rajsamand', 'Jhalawar', 'Dausa', 'Karauli', 'Dholpur', 'Sirohi', 'Mount Abu', 'Nathdwara', 'Makrana', 'Sujangarh', 'Lachhmangarh', 'Nimbahera', 'Kekri', 'Sojat', 'Sardarshahr'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Jorethang', 'Singtam', 'Ravangla', 'Pelling', 'Chungthang', 'Lachung', 'Lachen'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kancheepuram', 'Kumarapalayam', 'Karaikkudi', 'Neyveli', 'Cuddalore', 'Kumbakonam', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Gudiyatham', 'Pudukkottai', 'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Arakkonam', 'Kanyakumari', 'Chengalpattu', 'Mayiladuthurai', 'Krishnagiri', 'Namakkal', 'Dharmapuri', 'Perambalur', 'Virudhunagar', 'Ariyalur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Miryalaguda', 'Jagtial', 'Mancherial', 'Nirmal', 'Kothagudem', 'Bodhan', 'Palwancha', 'Kyathampalle', 'Mandamarri', 'Tandur', 'Sircilla', 'Bellampalle', 'Kamareddy', 'Gadwal', 'Sangareddy', 'Secunderabad', 'Jangaon', 'Vikarabad', 'Wanaparthy', 'Bhongir', 'Nagarkurnool'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia', 'Khowai', 'Ambassa', 'Teliamura', 'Kamalpur', 'Sabroom', 'Sonamura', 'Amarpur', 'Kumarghat', 'Santirbazar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Noida', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Faizabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Khurja', 'Gonda', 'Mainpuri', 'Lalitpur', 'Etah', 'Deoria', 'Azamgarh', 'Ghazipur', 'Sultanpur', 'Basti', 'Budaun', 'Greater Noida'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Kashipur', 'Ramnagar', 'Pithoragarh', 'Kotdwar', 'Almora', 'Nainital', 'Tehri', 'Pauri', 'Mussoorie', 'Jaspur', 'Srinagar', 'Tanakpur', 'Sitarganj', 'Ranikhet', 'Manglaur', 'Bageshwar', 'Vikasnagar', 'Rudraprayag', 'Chamoli', 'Uttarkashi'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling', 'Alipurduar', 'Purulia', 'Jangipur', 'Bangaon', 'Cooch Behar', 'Berhampore', 'Gangarampur', 'Jamuria', 'Sainthia', 'Egra', 'Tamluk', 'Jhargram', 'Barjora', 'Kalimpong', 'Kurseong', 'Contai'],
    'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar', 'Diglipur', 'Mayabunder', 'Rangat', 'Hut Bay', 'Bambooflat', 'Garacharma', 'Campbell Bay'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa', 'Naroli', 'Khanvel'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara', 'Dwarka', 'Rohini', 'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Vasant Vihar', 'Defence Colony', 'Greater Kailash', 'Hauz Khas', 'Nehru Place', 'Rajouri Garden', 'Pitampura', 'Janakpuri', 'Preet Vihar', 'Mayur Vihar'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Sopore', 'Kathua', 'Punch', 'Rajauri', 'Kupwara', 'Bandipore', 'Pulwama', 'Ganderbal', 'Kulgam', 'Shopian', 'Budgam', 'Doda', 'Kishtwar', 'Ramban', 'Reasi', 'Samba'],
    'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Zanskar', 'Drass', 'Diskit', 'Padum'],
    'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kiltan', 'Kadmat', 'Chetlat', 'Bitra', 'Kalpeni'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai', 'Ariankuppam', 'Villianur']
  };

  const [availableCities, setAvailableCities] = useState([]);

  const getDefaultFormData = () => ({
    name: '',
    slug: '',
    institution_type: 'College', // College, School, University
    // Badges & Status
    is_verified: false,
    is_preferred: false,
    is_admission_open: false,
    admission_deadline: '',
    badge_text: '',
    location: { 
      city: '', 
      state: '', 
      address: '', 
      pincode: '',
      google_maps_url: '',
      latitude: '',
      longitude: '',
      nearby_places: []
    },
    how_to_reach: {
      by_air: '',
      by_train: '',
      by_road: '',
      public_transport: ''
    },
    established: '',
    established_year: new Date().getFullYear(),
    type: 'Government',
    affiliation: '',
    recognized_by: [],
    affiliated_to: '',
    memberships: [],
    nirf_ranking: null,
    india_today_ranking: null,
    outlook_ranking: null,
    rankings: [],
    average_fees: 0,
    total_courses: 0,
    courses: [],
    facilities: [],
    hostel_info: { available: false, fee_per_semester: 0, description: '' },
    campus_size: '',
    campus_images: [],
    campus_video_url: '',
    campus_video_title: '',
    campus_video_description: '',
    contact_info: { phone: '', mobile: '', whatsapp: '', email: '', website: '' },
    logo_url: '',
    logo_title: '',
    logo_alt: '',
    banner_url: '',
    banner_title: '',
    banner_alt: '',
    images: [],
    videos: [],
    brochure_url: '',
    virtual_tour_url: '',
    virtual_tour_title: '',
    virtual_tour_description: '',
    description: '',
    description_tables: [], // Tables for description section
    highlights: [],
    admission_process: '',
    admission_dates: [],
    // SEO Meta Tags
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    schema_type: 'EducationalOrganization',
    // SEO Content
    seo_intro: '',
    seo_full_content: '',
    seo_images: [],
    seo_toc: [], // Table of Contents for SEO Content [{title, anchor, content}]
    seo_tables: [], // [{title, headers: [], rows: [[]]}] Tables for content
    seo_video_url: '',
    // Detail Page TOC - Used for Auto Menu from TOC
    detail_page_toc: [], // [{title, anchor, content, icon}]
    // Menu Configuration
    menu_config: {
      use_custom_menu: false,
      auto_from_toc: true,
      items: [
        { id: 'info', label: 'Info', icon: 'info', enabled: true, order: 1, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get free counseling' } } },
        { id: 'courses', label: 'Courses & Fees', icon: 'courses', enabled: true, order: 2, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'admission', label: 'Admissions', icon: 'admission', enabled: true, order: 3, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'cutoff', label: 'Cutoff', icon: 'cutoff', enabled: true, order: 4, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'placement', label: 'Placement', icon: 'placement', enabled: true, order: 5, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'ranking', label: 'Ranking', icon: 'ranking', enabled: true, order: 6, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'scholarship', label: 'Scholarship', icon: 'scholarship', enabled: true, order: 7, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'facilities', label: 'Facilities', icon: 'facilities', enabled: true, order: 8, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
        { id: 'reviews', label: 'Reviews', icon: 'reviews', enabled: true, order: 9, content: '', page_heading: '', search_heading: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', toc: [], tables: [], images: [], videos: [], faqs: [], widgets: { quick_facts: { enabled: true }, quick_nav: { enabled: true }, contact_cta: { enabled: true } } },
      ]
    },
    seo_video_title: '',
    seo_video_description: '',
    seo_faqs: [],
    // Sidebar Widgets Configuration
    sidebar_widgets: {
      quick_actions: {
        enabled: true,
        apply_now_btn: true,
        apply_now_url: '',
        download_brochure_btn: true,
        compare_btn: true,
        enquiry_btn: true
      },
      quick_facts: {
        enabled: true,
        show_established: true,
        show_type: true,
        show_approval: true,
        show_student_count: true,
        show_faculty_count: true,
        custom_facts: []
      },
      important_dates: {
        enabled: true,
        dates: []
      },
      fee_summary: {
        enabled: true,
        show_range: true,
        custom_text: ''
      },
      contact_card: {
        enabled: true,
        show_phone: true,
        show_email: true,
        show_address: true,
        show_map_link: true
      },
      counselor_cta: {
        enabled: true,
        title: 'Need Help?',
        subtitle: 'Talk to our expert counselor',
        phone: '',
        show_callback_form: true
      },
      ad_banner: {
        enabled: false,
        position: 'top',
        ad_code: ''
      },
      social_share: {
        enabled: true,
        platforms: ['facebook', 'twitter', 'whatsapp', 'linkedin']
      },
      rating_widget: {
        enabled: true,
        show_stars: true,
        show_review_count: true
      },
      related_colleges: {
        enabled: true,
        show_count: 3,
        criteria: 'same_city'
      }
    },
    accreditations: [],
    approvals: [],
    placement: {
      highest: 0,
      average: 0,
      percentage: 0,
      students_participated: 0,
      companies_participated: 0,
      total_offers: 0,
      top_recruiters: []
    },
    cutoff_data: [],
    scholarships: [],
    updates: [],
    total_students: 0,
    rating: 0,
    total_reviews: 0
  });

  const [formData, setFormData] = useState(getDefaultFormData());
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingCampus, setUploadingCampus] = useState({});
  const [uploadingCampusBulk, setUploadingCampusBulk] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingCourseBrochure, setUploadingCourseBrochure] = useState({});

  useEffect(() => {
    fetchRecognitions();
    fetchAffiliations();
    fetchAccreditations();
    fetchAccreditationLevels();
    fetchRankings();
    fetchRankCategories();
    fetchAvailableCourses();
    fetchAvailableScholarships();
    fetchAvailableFacilities();
    fetchAvailableNews();
    if (id) {
      fetchCollege();
    }
  }, [id]);

  const fetchRecognitions = async () => {
    try {
      const response = await api.get('/recognitions');
      setRecognitions(response.data);
    } catch (error) {
      console.error('Error fetching recognitions:', error);
    }
  };

  const fetchAffiliations = async () => {
    try {
      const response = await api.get('/affiliations?limit=500');
      setAffiliations(response.data);
    } catch (error) {
      console.error('Error fetching affiliations:', error);
    }
  };

  const fetchAccreditations = async () => {
    try {
      const response = await api.get('/accreditations?limit=500');
      setAccreditationsList(response.data);
    } catch (error) {
      console.error('Error fetching accreditations:', error);
    }
  };

  const fetchAccreditationLevels = async () => {
    try {
      const response = await api.get('/accreditation-levels?limit=100');
      setAccreditationLevelsList(response.data);
    } catch (error) {
      console.error('Error fetching accreditation levels:', error);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await api.get('/rankings?limit=100');
      setRankingsList(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const fetchRankCategories = async () => {
    try {
      const response = await api.get('/rank-categories?limit=100');
      setRankCategoriesList(response.data);
    } catch (error) {
      console.error('Error fetching rank categories:', error);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get('/courses?limit=500');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAvailableScholarships = async () => {
    try {
      const response = await api.get('/scholarships?limit=500');
      setAvailableScholarships(response.data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    }
  };

  const fetchAvailableFacilities = async () => {
    try {
      const response = await api.get('/facilities?limit=500');
      setAvailableFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchAvailableNews = async () => {
    try {
      const response = await api.get('/news?limit=50');
      setAvailableNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges/${id}`);
      const collegeData = response.data;
      
      // Ensure all arrays are properly initialized
      const normalizedData = {
        ...getDefaultFormData(),
        ...collegeData,
        recognized_by: Array.isArray(collegeData.recognized_by) ? collegeData.recognized_by : [],
        memberships: Array.isArray(collegeData.memberships) ? collegeData.memberships : [],
        rankings: Array.isArray(collegeData.rankings) ? collegeData.rankings : [],
        courses: Array.isArray(collegeData.courses) ? collegeData.courses : [],
        facilities: Array.isArray(collegeData.facilities) ? collegeData.facilities : [],
        campus_images: Array.isArray(collegeData.campus_images) ? collegeData.campus_images : [],
        images: Array.isArray(collegeData.images) ? collegeData.images : [],
        videos: Array.isArray(collegeData.videos) ? collegeData.videos : [],
        highlights: Array.isArray(collegeData.highlights) ? collegeData.highlights : [],
        admission_dates: Array.isArray(collegeData.admission_dates) ? collegeData.admission_dates : [],
        accreditations: Array.isArray(collegeData.accreditations) ? collegeData.accreditations : [],
        approvals: Array.isArray(collegeData.approvals) ? collegeData.approvals : [],
        cutoff_data: Array.isArray(collegeData.cutoff_data) ? collegeData.cutoff_data : [],
        scholarships: Array.isArray(collegeData.scholarships) ? collegeData.scholarships : [],
        updates: Array.isArray(collegeData.updates) ? collegeData.updates : [],
        seo_faqs: Array.isArray(collegeData.seo_faqs) ? collegeData.seo_faqs : [],
        seo_intro: collegeData.seo_intro || '',
        seo_full_content: collegeData.seo_full_content || '',
        seo_video_url: collegeData.seo_video_url || '',
        seo_video_title: collegeData.seo_video_title || '',
        seo_video_description: collegeData.seo_video_description || '',
        location: collegeData.location || { 
          city: '', 
          state: '', 
          address: '', 
          pincode: '',
          google_maps_url: '',
          latitude: '',
          longitude: '',
          nearby_places: []
        },
        how_to_reach: collegeData.how_to_reach || {
          by_air: '',
          by_train: '',
          by_road: '',
          public_transport: ''
        },
        contact_info: collegeData.contact_info || { phone: '', email: '', website: '' },
        placement: {
          highest: collegeData.placement?.highest || 0,
          average: collegeData.placement?.average || 0,
          percentage: collegeData.placement?.percentage || 0,
          students_participated: collegeData.placement?.students_participated || 0,
          companies_participated: collegeData.placement?.companies_participated || 0,
          total_offers: collegeData.placement?.total_offers || 0,
          top_recruiters: Array.isArray(collegeData.placement?.top_recruiters) ? collegeData.placement.top_recruiters : []
        }
      };
      
      setFormData(normalizedData);
      
      // Set available cities based on the state
      if (normalizedData.location?.state) {
        setAvailableCities(citiesByState[normalizedData.location.state] || []);
      }
    } catch (error) {
      console.error('Error fetching college:', error);
      alert('Failed to fetch college details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when name changes
    if (name === 'name') {
      setFormData({ 
        ...formData, 
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    // Special handling for state change to update available cities
    if (parent === 'location' && field === 'state') {
      setAvailableCities(citiesByState[value] || []);
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [field]: value, city: '' } // Reset city when state changes
      });
    } else {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [field]: value }
      });
    }
  };

  // Auto-generate alt text with Admissionbuddy branding
  const generateAltText = (title, collegeName = '') => {
    if (!title) return '';
    const parts = [title];
    if (collegeName) parts.push(collegeName);
    parts.push('Admissionbuddy');
    return parts.join(' - ');
  };

  const handleTitleChange = (field, value) => {
    const altField = field.replace('_title', '_alt');
    const collegeName = formData.name || '';
    const autoAlt = generateAltText(value, collegeName);
    
    setFormData({
      ...formData,
      [field]: value,
      [altField]: autoAlt
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Helper functions for campus images with title and alt text
  const updateCampusImage = (index, field, value) => {
    const newImages = [...formData.campus_images];
    // Convert to object format if it's a string
    if (typeof newImages[index] === 'string') {
      newImages[index] = { url: newImages[index], title: '', alt: '' };
    }
    
    // If updating title, auto-generate alt text
    if (field === 'title') {
      const collegeName = formData.name || '';
      newImages[index].title = value;
      newImages[index].alt = generateAltText(value, collegeName);
    } else {
      newImages[index][field] = value;
    }
    
    setFormData({ ...formData, campus_images: newImages });
  };

  const addCampusImage = () => {
    setFormData({ ...formData, campus_images: [...formData.campus_images, { url: '', title: '', alt: '' }] });
  };

  const removeCampusImage = (index) => {
    const newImages = formData.campus_images.filter((_, i) => i !== index);
    setFormData({ ...formData, campus_images: newImages });
  };


  // Helper functions for nested array (nearby_places)
  const addNearbyPlace = () => {
    const updatedLocation = {
      ...formData.location,
      nearby_places: [...(formData.location.nearby_places || []), '']
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  const updateNearbyPlace = (index, value) => {
    const newNearbyPlaces = [...(formData.location.nearby_places || [])];
    newNearbyPlaces[index] = value;
    const updatedLocation = {
      ...formData.location,
      nearby_places: newNearbyPlaces
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  const removeNearbyPlace = (index) => {
    const newNearbyPlaces = (formData.location.nearby_places || []).filter((_, i) => i !== index);
    const updatedLocation = {
      ...formData.location,
      nearby_places: newNearbyPlaces
    };
    setFormData({ ...formData, location: updatedLocation });
  };

  // Helper functions for accreditations
  const addAccreditation = () => {
    setFormData({
      ...formData,
      accreditations: [...formData.accreditations, { name: '', level: '', description: '' }]
    });
  };

  const updateAccreditation = (index, field, value) => {
    const newAccreditations = [...formData.accreditations];
    newAccreditations[index] = { ...newAccreditations[index], [field]: value };
    setFormData({ ...formData, accreditations: newAccreditations });
  };

  const removeAccreditation = (index) => {
    setFormData({
      ...formData,
      accreditations: formData.accreditations.filter((_, i) => i !== index)
    });
  };

  // Helper functions for rankings
  const addRanking = () => {
    setFormData({
      ...formData,
      rankings: [...(formData.rankings || []), { agency: '', category: '', rank: '', year: new Date().getFullYear() }]
    });
  };

  const updateRanking = (index, field, value) => {
    const newRankings = [...(formData.rankings || [])];
    newRankings[index] = { ...newRankings[index], [field]: value };
    setFormData({ ...formData, rankings: newRankings });
  };

  const removeRanking = (index) => {
    setFormData({
      ...formData,
      rankings: (formData.rankings || []).filter((_, i) => i !== index)
    });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        { name: '', duration: '', first_year_fee: 0, total_fee: 0, eligibility: '', selection_criteria: '' }
      ]
    });
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...formData.courses];
    
    // If course name is being changed, auto-fill other fields
    if (field === 'name') {
      const selectedCourse = availableCourses.find(c => c.name === value);
      if (selectedCourse) {
        newCourses[index] = {
          ...newCourses[index],
          name: value,
          duration: selectedCourse.duration || '',
          eligibility: selectedCourse.eligibility || '',
          selection_criteria: selectedCourse.exams_accepted?.join(', ') || ''
        };
      } else {
        newCourses[index][field] = value;
      }
    } else {
      newCourses[index][field] = value;
    }
    
    setFormData({ ...formData, courses: newCourses });
  };

  const removeCourse = (index) => {
    setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, { name: '', description: '', icon: '' }]
    });
  };

  const updateFacility = (index, field, value) => {
    const newFacilities = [...formData.facilities];
    
    // If facility name is being changed, auto-fill icon and description
    if (field === 'name') {
      const selectedFacility = availableFacilities.find(f => f.name === value);
      if (selectedFacility) {
        newFacilities[index] = {
          ...newFacilities[index],
          name: value,
          icon: selectedFacility.icon || '',
          description: selectedFacility.description || ''
        };
      } else {
        newFacilities[index][field] = value;
      }
    } else {
      newFacilities[index][field] = value;
    }
    
    setFormData({ ...formData, facilities: newFacilities });
  };

  const removeFacility = (index) => {
    setFormData({ ...formData, facilities: formData.facilities.filter((_, i) => i !== index) });
  };


  // Updates & News management
  const addUpdate = () => {
    setFormData({
      ...formData,
      updates: [...formData.updates, { title: '', content: '', date: '', type: 'custom', newsId: '' }]
    });
  };

  const updateUpdate = (index, field, value) => {
    const newUpdates = [...formData.updates];
    
    // If type is being changed to 'tagged' and a news is selected
    if (field === 'newsId' && value) {
      const selectedNews = availableNews.find(n => n.id === value);
      if (selectedNews) {
        newUpdates[index] = {
          ...newUpdates[index],
          newsId: value,
          title: selectedNews.title,
          content: selectedNews.summary || selectedNews.content,
          date: selectedNews.published_date || new Date().toISOString().split('T')[0],
          type: 'tagged'
        };
      }
    } else {
      newUpdates[index][field] = value;
    }
    
    setFormData({ ...formData, updates: newUpdates });
  };

  const removeUpdate = (index) => {
    setFormData({ ...formData, updates: formData.updates.filter((_, i) => i !== index) });
  };

  const addScholarship = () => {
    setFormData({
      ...formData,
      scholarships: [...formData.scholarships, { name: '', description: '', amount: '' }]
    });
  };

  const updateScholarship = (index, field, value) => {
    const newScholarships = [...formData.scholarships];
    
    // If scholarship name is being changed, auto-fill other fields
    if (field === 'name') {
      const selectedScholarship = availableScholarships.find(s => s.name === value);
      if (selectedScholarship) {
        newScholarships[index] = {
          ...newScholarships[index],
          name: value,
          amount: selectedScholarship.amount || '',
          description: selectedScholarship.description || ''
        };
      } else {
        newScholarships[index][field] = value;
      }
    } else {
      newScholarships[index][field] = value;
    }
    
    setFormData({ ...formData, scholarships: newScholarships });
  };

  const removeScholarship = (index) => {
    setFormData({ ...formData, scholarships: formData.scholarships.filter((_, i) => i !== index) });
  };

  const addAdmissionDate = () => {
    setFormData({
      ...formData,
      admission_dates: [...formData.admission_dates, { event: '', date: '' }]
    });
  };

  const updateAdmissionDate = (index, field, value) => {
    const newDates = [...formData.admission_dates];
    newDates[index][field] = value;
    setFormData({ ...formData, admission_dates: newDates });
  };

  const removeAdmissionDate = (index) => {
    setFormData({ ...formData, admission_dates: formData.admission_dates.filter((_, i) => i !== index) });
  };

  const addCutoff = () => {
    setFormData({
      ...formData,
      cutoff_data: [
        ...formData.cutoff_data,
        { course: '', opening_rank: null, closing_rank_current: null, closing_rank_previous: null, year: new Date().getFullYear() }
      ]
    });
  };

  const updateCutoff = (index, field, value) => {
    const newCutoffs = [...formData.cutoff_data];
    newCutoffs[index][field] = value;
    setFormData({ ...formData, cutoff_data: newCutoffs });
  };

  const removeCutoff = (index) => {
    setFormData({ ...formData, cutoff_data: formData.cutoff_data.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (file, type) => {
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
    const fieldName = type === 'logo' ? 'logo_url' : 'banner_url';
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post(`/upload/image?type=${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const fullUrl = backendUrl + response.data.url;
        
        setFormData(prev => ({
          ...prev,
          [fieldName]: fullUrl
        }));
        
        alert(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleCampusImageUpload = async (file, index) => {
    setUploadingCampus(prev => ({ ...prev, [index]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/image?type=campus', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const fullUrl = backendUrl + response.data.url;
        
        // Update with object format including existing alt text
        updateCampusImage(index, 'url', fullUrl);
        
        alert('Campus image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload campus image. Please try again.');
    } finally {
      setUploadingCampus(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleBulkCampusUpload = async (files) => {
    setUploadingCampusBulk(true);
    
    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach(file => {
        uploadFormData.append('files', file);
      });
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/images/bulk?type=campus', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const uploadedImages = response.data.files.map(f => ({
          url: backendUrl + f.url,
          title: '',
          alt: ''
        }));
        
        setFormData(prev => ({
          ...prev,
          campus_images: [...prev.campus_images, ...uploadedImages]
        }));
        
        alert(`Successfully uploaded ${response.data.uploaded} image(s)!`);
        if (response.data.failed > 0) {
          alert(`${response.data.failed} file(s) failed to upload.`);
        }
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingCampusBulk(false);
    }
  };

  const updateUpdateSimple = (index, field, value) => {
    const newUpdates = [...formData.updates];
    newUpdates[index][field] = value;
    setFormData({ ...formData, updates: newUpdates });
  };

  const handleBrochureUpload = async (file) => {
    setUploadingBrochure(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/brochure', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const fullUrl = backendUrl + response.data.url;
        
        setFormData(prev => ({
          ...prev,
          brochure_url: fullUrl
        }));
        
        alert('Brochure uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload brochure. Please try again.');
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleCourseBrochureUpload = async (file, courseIndex) => {
    setUploadingCourseBrochure(prev => ({ ...prev, [courseIndex]: true }));
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const response = await api.post('/upload/brochure', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const fullUrl = backendUrl + response.data.url;
        
        const newCourses = [...formData.courses];
        if (!newCourses[courseIndex].brochure_url) {
          newCourses[courseIndex] = { ...newCourses[courseIndex], brochure_url: fullUrl };
        } else {
          newCourses[courseIndex].brochure_url = fullUrl;
        }
        
        setFormData(prev => ({
          ...prev,
          courses: newCourses
        }));
        
        alert('Course brochure uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload course brochure. Please try again.');
    } finally {
      setUploadingCourseBrochure(prev => ({ ...prev, [courseIndex]: false }));
    }
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      seo_faqs: [...formData.seo_faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...formData.seo_faqs];
    newFAQs[index][field] = value;
    setFormData({ ...formData, seo_faqs: newFAQs });
  };

  const removeFAQ = (index) => {
    setFormData({ ...formData, seo_faqs: formData.seo_faqs.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await api.put(`/colleges/${id}`, formData);
        alert('College updated successfully!');
      } else {
        await api.post('/colleges', formData);
        alert('College created successfully!');
      }
      navigate('/admin/colleges');
    } catch (error) {
      console.error('Error saving college:', error);
      alert(`Failed to save college: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{id ? 'Edit Institution' : 'Add New Institution'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/colleges')}>
          <FiX className="mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Institution Type Selector - FIRST SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-300">
          <h2 className="text-xl font-bold mb-4 text-blue-900">🏛️ Institution Type</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Institution Type <span className="text-red-500">*</span>
              </label>
              <select
                name="institution_type"
                value={formData.institution_type}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="College">🎓 College</option>
                <option value="School">🏫 School (K-12)</option>
                <option value="University">🏛️ University</option>
              </select>
              <p className="mt-2 text-sm text-gray-600 italic">
                💡 This determines what type of institution you&apos;re adding to the database
              </p>
            </div>
          </div>
        </div>

        {/* Badges & Status Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border-2 border-yellow-300">
          <h2 className="text-xl font-bold mb-4 text-yellow-900">🏅 Badges & Status</h2>
          <p className="text-sm text-gray-600 mb-4">Toggle badges to highlight this institution on listing pages and search results.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verified Badge */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Verified</h3>
                    <p className="text-xs text-gray-500">Official verified institution</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.is_verified && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  ✅ This institution will display a verified badge
                </div>
              )}
            </div>

            {/* Preferred Badge */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-yellow-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Preferred</h3>
                    <p className="text-xs text-gray-500">Featured institution</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_preferred"
                    checked={formData.is_preferred}
                    onChange={(e) => setFormData({...formData, is_preferred: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              {formData.is_preferred && (
                <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                  ⭐ Will appear in featured/preferred sections
                </div>
              )}
            </div>

            {/* Admission Open Badge */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📢</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Admission Open</h3>
                    <p className="text-xs text-gray-500">Currently accepting applications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_admission_open"
                    checked={formData.is_admission_open}
                    onChange={(e) => setFormData({...formData, is_admission_open: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {formData.is_admission_open && (
                <div className="mt-3 space-y-2">
                  <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                    📢 Admission Open badge will be displayed
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Deadline (Optional)</label>
                    <input
                      type="date"
                      name="admission_deadline"
                      value={formData.admission_deadline}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Badge */}
          <div className="mt-6 bg-white rounded-lg p-4 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎖️</span>
              <div>
                <h3 className="font-semibold text-gray-800">Custom Badge Text</h3>
                <p className="text-xs text-gray-500">Add a custom label (e.g., &quot;Top Ranked&quot;, &quot;New&quot;, &quot;Popular&quot;)</p>
              </div>
            </div>
            <input
              type="text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleChange}
              placeholder="e.g., Top Ranked, New, Popular, Best Value"
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-orange-400"
              maxLength={20}
            />
            {formData.badge_text && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Preview:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {formData.badge_text}
                </span>
              </div>
            )}
          </div>

          {/* Badge Preview */}
          {(formData.is_verified || formData.is_preferred || formData.is_admission_open || formData.badge_text) && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">👁️ Badge Preview (as shown on listing)</h4>
              <div className="flex flex-wrap gap-2">
                {formData.is_verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ✅ Verified
                  </span>
                )}
                {formData.is_preferred && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Preferred
                  </span>
                )}
                {formData.is_admission_open && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    📢 Admission Open {formData.admission_deadline && `(Till ${formData.admission_deadline})`}
                  </span>
                )}
                {formData.badge_text && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    🎖️ {formData.badge_text}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.institution_type === 'School' ? 'School Name' : formData.institution_type === 'University' ? 'University Name' : 'College Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (Auto-generated) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                required
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                placeholder="Auto-generated from name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Established Year *</label>
              <select
                name="established_year"
                value={formData.established_year}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 201 }, (_, i) => 2100 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Affiliated To</label>
              <select
                name="affiliated_to"
                value={formData.affiliated_to}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Affiliation</option>
                {affiliations.map((affiliation) => (
                  <option key={affiliation.id} value={affiliation.name}>
                    {affiliation.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Campus Size</label>
              <input
                type="text"
                name="campus_size"
                value={formData.campus_size}
                onChange={handleChange}
                placeholder="e.g., 550 acres"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Recognized By</label>
              {formData.recognized_by.map((org, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={org}
                    onChange={(e) => handleArrayChange('recognized_by', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  >
                    <option value="">Select Recognition</option>
                    {recognitions.map((recognition) => (
                      <option key={recognition.id} value={recognition.name}>
                        {recognition.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('recognized_by', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('recognized_by', '')} size="sm" variant="outline">
                <FiPlus className="mr-2" /> Add Recognition
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Students</label>
              <input
                type="number"
                name="total_students"
                value={formData.total_students}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.contact_info.phone}
                onChange={(e) => handleNestedChange('contact_info', 'phone', e.target.value)}
                placeholder="e.g., 022-12345678"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="tel"
                value={formData.contact_info.mobile}
                onChange={(e) => handleNestedChange('contact_info', 'mobile', e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.contact_info.whatsapp}
                onChange={(e) => handleNestedChange('contact_info', 'whatsapp', e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <select
                value={formData.location.state}
                onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <select
                value={formData.location.city}
                onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                required
                disabled={!formData.location.state}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <textarea
                value={formData.location.address || ''}
                onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                rows="2"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN Code *</label>
              <input
                type="text"
                value={formData.location.pincode || ''}
                onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)}
                placeholder="e.g., 400001"
                maxLength="6"
                pattern="[0-9]{6}"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Google Maps URL</label>
              <input
                type="url"
                value={formData.location.google_maps_url || ''}
                onChange={(e) => handleNestedChange('location', 'google_maps_url', e.target.value)}
                placeholder="e.g., https://maps.google.com/?q=..."
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Paste the Google Maps share link for the institution</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="text"
                value={formData.location.latitude || ''}
                onChange={(e) => handleNestedChange('location', 'latitude', e.target.value)}
                placeholder="e.g., 19.0760"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="text"
                value={formData.location.longitude || ''}
                onChange={(e) => handleNestedChange('location', 'longitude', e.target.value)}
                placeholder="e.g., 72.8777"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Nearby Places / Landmarks</label>
              {(formData.location.nearby_places || []).map((place, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => updateNearbyPlace(index, e.target.value)}
                    placeholder="e.g., Andheri Metro Station (2 km), Mumbai Airport (5 km)"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeNearbyPlace(index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addNearbyPlace} size="sm" variant="outline">
                <FiPlus className="mr-2" /> Add Nearby Place
              </Button>
            </div>
          </div>
        </div>

        {/* How to Reach */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚗 How to Reach?</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">✈️ By Air</label>
              <textarea
                value={formData.how_to_reach.by_air}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_air', e.target.value)}
                placeholder="e.g., The nearest airport is Mumbai International Airport (Chhatrapati Shivaji Maharaj International Airport), located approximately 10 km from the institution. Regular taxi and app cab services are available from the airport."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚂 By Train</label>
              <textarea
                value={formData.how_to_reach.by_train}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_train', e.target.value)}
                placeholder="e.g., The nearest railway station is Andheri Railway Station (Western Line), approximately 3 km away. Local trains connect to all parts of Mumbai. Auto-rickshaws and cabs are readily available from the station."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚌 By Road</label>
              <textarea
                value={formData.how_to_reach.by_road}
                onChange={(e) => handleNestedChange('how_to_reach', 'by_road', e.target.value)}
                placeholder="e.g., The institution is well-connected by road. State transport buses (BEST) operate regularly from major areas. Private vehicles can reach via the Western Express Highway. Parking facilities are available on campus."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">🚇 Public Transport</label>
              <textarea
                value={formData.how_to_reach.public_transport}
                onChange={(e) => handleNestedChange('how_to_reach', 'public_transport', e.target.value)}
                placeholder="e.g., Metro: Andheri Metro Station (Line 1) is 2 km away. Buses: BEST buses 249, 251, 258 stop directly in front of the institution. Auto-rickshaws and app-based cabs are easily available."
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Description & Highlights</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Table Builder for Description */}
            <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-sm font-medium text-orange-800">📊 Add Table to Description</label>
                  <p className="text-xs text-orange-600">Create tables and insert them into description above</p>
                </div>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                  {formData.description_tables?.length || 0} tables
                </span>
              </div>

              {/* Tables List */}
              {(formData.description_tables || []).map((table, tableIndex) => (
                <div key={tableIndex} className="bg-white rounded-lg border border-orange-200 p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">Table {tableIndex + 1}</span>
                      <input
                        type="text"
                        value={table.title || ''}
                        onChange={(e) => {
                          const newTables = [...(formData.description_tables || [])];
                          newTables[tableIndex].title = e.target.value;
                          setFormData({...formData, description_tables: newTables});
                        }}
                        placeholder="Table Title"
                        className="border rounded px-2 py-1 text-sm w-48"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => {
                        const newTables = [...(formData.description_tables || [])];
                        newTables[tableIndex].headers.push('Column');
                        newTables[tableIndex].rows.forEach(row => row.push(''));
                        setFormData({...formData, description_tables: newTables});
                      }} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">+ Col</button>
                      <button type="button" onClick={() => {
                        const newTables = [...(formData.description_tables || [])];
                        newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                        setFormData({...formData, description_tables: newTables});
                      }} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">+ Row</button>
                      <button type="button" onClick={() => {
                        setFormData({...formData, description_tables: (formData.description_tables || []).filter((_, i) => i !== tableIndex)});
                      }} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
                    </div>
                  </div>
                  
                  {/* Table Editor */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {(table.headers || []).map((header, colIndex) => (
                            <th key={colIndex} className="border border-orange-200 bg-orange-100 p-1">
                              <div className="flex items-center gap-1">
                                <input type="text" value={header}
                                  onChange={(e) => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].headers[colIndex] = e.target.value;
                                    setFormData({...formData, description_tables: newTables});
                                  }}
                                  className="w-full border-0 bg-transparent font-semibold text-center text-orange-800 focus:outline-none px-1"
                                  placeholder="Header"
                                />
                                {table.headers.length > 1 && (
                                  <button type="button" onClick={() => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].headers.splice(colIndex, 1);
                                    newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                    setFormData({...formData, description_tables: newTables});
                                  }} className="text-red-500 text-xs">×</button>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(table.rows || []).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="border border-orange-200 p-1">
                                <input type="text" value={cell}
                                  onChange={(e) => {
                                    const newTables = [...(formData.description_tables || [])];
                                    newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                    setFormData({...formData, description_tables: newTables});
                                  }}
                                  className="w-full border-0 bg-transparent focus:outline-none px-1"
                                  placeholder=""
                                />
                              </td>
                            ))}
                            {table.rows.length > 1 && (
                              <td className="w-6">
                                <button type="button" onClick={() => {
                                  const newTables = [...(formData.description_tables || [])];
                                  newTables[tableIndex].rows.splice(rowIndex, 1);
                                  setFormData({...formData, description_tables: newTables});
                                }} className="text-red-500 text-xs">×</button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Insert Button */}
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => {
                      const tableHtml = `\n\n<table class="info-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>\n`;
                      setFormData({...formData, description: (formData.description || '') + tableHtml});
                      alert('Table inserted into Description!');
                    }} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">
                      ⚡ Insert into Description
                    </button>
                    <button type="button" onClick={() => {
                      const tableHtml = `<table class="info-table">\n  <caption>${table.title || ''}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                      navigator.clipboard.writeText(tableHtml);
                      alert('Table HTML copied!');
                    }} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200">
                      📋 Copy HTML
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Table Buttons */}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: '', headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']]
                  }]});
                }} className="text-sm text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded border border-orange-300 flex items-center gap-1">
                  <FiPlus /> Add Table
                </button>
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: 'Quick Facts', headers: ['Parameter', 'Details'], rows: [['Established', ''], ['Type', ''], ['Approved By', ''], ['Location', '']]
                  }]});
                }} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded hover:bg-orange-100">
                  + Quick Facts
                </button>
                <button type="button" onClick={() => {
                  setFormData({...formData, description_tables: [...(formData.description_tables || []), {
                    title: 'Key Statistics', headers: ['Metric', 'Value'], rows: [['Total Students', ''], ['Faculty', ''], ['Courses', ''], ['Campus Size', '']]
                  }]});
                }} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded hover:bg-orange-100">
                  + Key Statistics
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Highlights</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeArrayItem('highlights', index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('highlights', '')} size="sm">
                <FiPlus className="mr-2" /> Add Highlight
              </Button>
            </div>
          </div>
        </div>

        {/* SEO Meta Tags Section */}
        <CollapsibleSection title="SEO & Meta Tags" icon="🏷️" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            Configure meta tags for search engines and social media sharing. These improve search visibility and click-through rates.
          </p>
          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Meta Title</label>
                <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.meta_title?.length || 0}/60 characters
                </span>
              </div>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                placeholder="e.g., IIT Bombay - Admission 2025, Fees, Ranking | Admissionbuddy"
                className={`w-full border-2 rounded px-3 py-2 ${(formData.meta_title?.length || 0) > 60 ? 'border-red-300' : 'border-gray-200'}`}
                maxLength={70}
              />
              <p className="text-xs text-gray-500 mt-1">Appears in browser tab and search results. Keep under 60 characters for best display.</p>
              <button
                type="button"
                onClick={() => {
                  const autoTitle = `${formData.name}${formData.location?.city ? ` - ${formData.location.city}` : ''} | Admission, Fees, Ranking - Admissionbuddy`;
                  setFormData({...formData, meta_title: autoTitle.substring(0, 60)});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate from college name
              </button>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Meta Description</label>
                <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : (formData.meta_description?.length || 0) > 150 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {formData.meta_description?.length || 0}/160 characters
                </span>
              </div>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                placeholder="e.g., Get complete details on IIT Bombay admission 2025, fee structure, courses, placements, ranking, and cutoff. Apply now through Admissionbuddy."
                rows="3"
                className={`w-full border-2 rounded px-3 py-2 ${(formData.meta_description?.length || 0) > 160 ? 'border-red-300' : 'border-gray-200'}`}
                maxLength={170}
              />
              <p className="text-xs text-gray-500 mt-1">Search result snippet. Keep between 150-160 characters for optimal display.</p>
              <button
                type="button"
                onClick={() => {
                  const autoDesc = `Get complete details on ${formData.name} admission ${new Date().getFullYear()}, fee structure, courses offered, placements, ranking & cutoff. Apply now through Admissionbuddy.`;
                  setFormData({...formData, meta_description: autoDesc.substring(0, 160)});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate description
              </button>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                placeholder="e.g., IIT Bombay, engineering college, admission 2025, fees, ranking, placement"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated keywords relevant to this institution.</p>
              <button
                type="button"
                onClick={() => {
                  const keywords = [
                    formData.name,
                    formData.location?.city,
                    formData.type,
                    'admission ' + new Date().getFullYear(),
                    'fees',
                    'ranking',
                    'courses',
                    'placement'
                  ].filter(Boolean).join(', ');
                  setFormData({...formData, meta_keywords: keywords});
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Auto-generate keywords
              </button>
            </div>

            {/* Divider */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">📱 Open Graph (Social Media)</h3>
            </div>

            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Title (Social Share Title)</label>
              <input
                type="text"
                name="og_title"
                value={formData.og_title}
                onChange={handleChange}
                placeholder="Leave empty to use Meta Title"
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, og_title: formData.meta_title})}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Copy from Meta Title
              </button>
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Description (Social Share Description)</label>
              <textarea
                name="og_description"
                value={formData.og_description}
                onChange={handleChange}
                placeholder="Leave empty to use Meta Description"
                rows="2"
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, og_description: formData.meta_description})}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Copy from Meta Description
              </button>
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-medium mb-1">OG Image URL (Social Share Thumbnail)</label>
              <input
                type="url"
                name="og_image_url"
                value={formData.og_image_url}
                onChange={handleChange}
                placeholder="https://example.com/og-image.jpg (1200x630 px recommended)"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630 pixels for optimal display on social media.</p>
              <button
                type="button"
                onClick={() => setFormData({...formData, og_image_url: formData.banner_url || formData.logo_url})}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                ⚡ Use Banner/Logo URL
              </button>
            </div>

            {/* Divider */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Advanced SEO Settings</h3>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium mb-1">Canonical URL</label>
              <input
                type="url"
                name="canonical_url"
                value={formData.canonical_url}
                onChange={handleChange}
                placeholder="Leave empty to auto-generate from slug"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Prevents duplicate content issues. Auto-generated if left empty.</p>
            </div>

            {/* Robots Meta */}
            <div>
              <label className="block text-sm font-medium mb-1">Robots Meta</label>
              <select
                name="robots_meta"
                value={formData.robots_meta}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="index, follow">index, follow (Recommended)</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Controls how search engines index this page.</p>
            </div>

            {/* Schema Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Schema Type (Rich Snippets)</label>
              <select
                name="schema_type"
                value={formData.schema_type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="EducationalOrganization">EducationalOrganization (Default)</option>
                <option value="CollegeOrUniversity">CollegeOrUniversity</option>
                <option value="School">School</option>
                <option value="HighSchool">HighSchool</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Helps search engines understand the type of institution for rich results.</p>
            </div>

            {/* SEO Preview */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">👁️ Search Result Preview</h3>
              <div className="bg-white border rounded-lg p-4 max-w-2xl">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {formData.meta_title || formData.name || 'Page Title'}
                </div>
                <div className="text-green-700 text-sm truncate">
                  admissionbuddy.co › colleges › {formData.slug || 'college-slug'}
                </div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {formData.meta_description || 'Meta description will appear here. Add a compelling description to improve click-through rates.'}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SEO Content Section */}
        <CollapsibleSection title="SEO Content (Detail Page Content)" icon="🔍" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            This content appears in the expandable &quot;Read More&quot; section on the college detail page for better SEO.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Intro (Short Preview)</label>
              <p className="text-xs text-gray-500 mb-2">
                This is the short introduction (3-4 lines) that appears before the &quot;Read More&quot; button
              </p>
              <textarea
                name="seo_intro"
                value={formData.seo_intro}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., [College Name] is a premier engineering institution established in [Year]. As per the data, the college is one of the preferred institutions for students..."
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Table of Contents Builder */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800">📑 Table of Contents</label>
                  <p className="text-xs text-purple-600">Build a clickable TOC that links to content sections below</p>
                </div>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                  {formData.seo_toc?.length || 0} sections
                </span>
              </div>

              {/* TOC Items */}
              <div className="space-y-3 mb-4">
                {(formData.seo_toc || []).map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-purple-200 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Section Title *</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const newToc = [...(formData.seo_toc || [])];
                                newToc[index].title = e.target.value;
                                // Auto-generate anchor from title
                                newToc[index].anchor = e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9\s]/g, '')
                                  .replace(/\s+/g, '-')
                                  .substring(0, 50);
                                setFormData({...formData, seo_toc: newToc});
                              }}
                              placeholder="e.g., Admission Process"
                              className="w-full border-2 border-purple-200 rounded px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Anchor ID (auto)</label>
                            <input
                              type="text"
                              value={item.anchor || ''}
                              onChange={(e) => {
                                const newToc = [...(formData.seo_toc || [])];
                                newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                setFormData({...formData, seo_toc: newToc});
                              }}
                              placeholder="admission-process"
                              className="w-full border rounded px-2 py-1.5 text-sm font-mono bg-gray-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Section Content *</label>
                          <textarea
                            value={item.content || ''}
                            onChange={(e) => {
                              const newToc = [...(formData.seo_toc || [])];
                              newToc[index].content = e.target.value;
                              setFormData({...formData, seo_toc: newToc});
                            }}
                            placeholder="Write the content for this section... You can use HTML tags."
                            rows="4"
                            className="w-full border rounded px-2 py-1.5 text-sm"
                          />
                        </div>
                        {/* Copy HTML for this section */}
                        <button
                          type="button"
                          onClick={() => {
                            const html = `<h2 id="${item.anchor}">${item.title}</h2>\n<div class="toc-section">\n${item.content}\n</div>`;
                            navigator.clipboard.writeText(html);
                            alert('Section HTML copied!');
                          }}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                        >
                          📋 Copy Section HTML
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            seo_toc: (formData.seo_toc || []).filter((_, i) => i !== index)
                          });
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Section Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_toc: [...(formData.seo_toc || []), { title: '', anchor: '', content: '' }]
                  });
                }}
                className="text-sm text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded border border-purple-300 flex items-center gap-1"
              >
                <FiPlus /> Add TOC Section
              </button>

              {/* Quick Add Templates */}
              <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                <p className="text-xs font-medium text-purple-800 mb-2">💡 Quick Add Common Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { title: 'About', anchor: 'about' },
                    { title: 'Admission Process', anchor: 'admission-process' },
                    { title: 'Courses Offered', anchor: 'courses-offered' },
                    { title: 'Fee Structure', anchor: 'fee-structure' },
                    { title: 'Placement', anchor: 'placement' },
                    { title: 'Facilities', anchor: 'facilities' },
                    { title: 'Scholarship', anchor: 'scholarship' },
                    { title: 'Hostel', anchor: 'hostel' },
                    { title: 'Ranking', anchor: 'ranking' },
                    { title: 'Contact', anchor: 'contact' },
                  ].map((template, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const exists = (formData.seo_toc || []).some(t => t.anchor === template.anchor);
                        if (!exists) {
                          setFormData({
                            ...formData,
                            seo_toc: [...(formData.seo_toc || []), { ...template, content: '' }]
                          });
                        }
                      }}
                      className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded hover:bg-purple-100"
                    >
                      + {template.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOC Preview & Copy */}
              {formData.seo_toc?.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">👁️ TOC Preview</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Generate TOC HTML
                          const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>`;
                          navigator.clipboard.writeText(tocHtml);
                          alert('TOC HTML copied! Paste at the beginning of SEO Full Content.');
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        📋 Copy TOC HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Generate full content with TOC and all sections
                          const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>\n\n`;
                          const sectionsHtml = formData.seo_toc.map(item => 
                            `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div class="section-content">\n    ${item.content || '[Content here]'}\n  </div>\n</section>`
                          ).join('\n\n');
                          const fullHtml = tocHtml + sectionsHtml;
                          navigator.clipboard.writeText(fullHtml);
                          alert('Full content with TOC copied!');
                        }}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        📋 Copy Full Content
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual TOC Preview */}
                  <div className="bg-white border rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Table of Contents</p>
                    <ul className="space-y-1">
                      {formData.seo_toc.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center justify-center">{index + 1}</span>
                          <a href={`#${item.anchor}`} className="text-sm text-blue-600 hover:underline">
                            {item.title || 'Untitled Section'}
                          </a>
                          <span className="text-xs text-gray-400">#{item.anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Auto-fill SEO Full Content */}
                  <button
                    type="button"
                    onClick={() => {
                      // Generate full content with TOC and all sections
                      const tocHtml = `<nav class="table-of-contents">\n  <h3>Table of Contents</h3>\n  <ul>\n${formData.seo_toc.map(item => `    <li><a href="#${item.anchor}">${item.title}</a></li>`).join('\n')}\n  </ul>\n</nav>\n\n`;
                      const sectionsHtml = formData.seo_toc.map(item => 
                        `<section id="${item.anchor}">\n  <h2>${item.title}</h2>\n  <div class="section-content">\n    ${item.content || ''}\n  </div>\n</section>`
                      ).join('\n\n');
                      const fullHtml = tocHtml + sectionsHtml;
                      setFormData({...formData, seo_full_content: fullHtml});
                      alert('SEO Full Content has been auto-filled with TOC and sections!');
                    }}
                    className="mt-3 w-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2"
                  >
                    ⚡ Auto-Fill SEO Content with TOC & Sections
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">SEO Full Content</label>
              <p className="text-xs text-gray-500 mb-2">
                Detailed content that appears after clicking &quot;Read More&quot; (multiple paragraphs with HTML formatting)
              </p>
              <textarea
                name="seo_full_content"
                value={formData.seo_full_content}
                onChange={handleChange}
                rows="10"
                placeholder="Add multiple paragraphs with detailed information about the college. You can include HTML tags like <strong>, <p>, <ul>, <li>, etc."
                className="w-full border rounded px-3 py-2 font-mono text-sm"
              />
            </div>

            {/* Table Builder */}
            <div className="border-2 border-teal-300 rounded-lg p-4 bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-teal-800">📊 Table Builder</label>
                  <p className="text-xs text-teal-600">Create tables for fee structure, placement data, course comparison, etc.</p>
                </div>
                <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded">
                  {formData.seo_tables?.length || 0} tables
                </span>
              </div>

              {/* Existing Tables */}
              <div className="space-y-4 mb-4">
                {(formData.seo_tables || []).map((table, tableIndex) => (
                  <div key={tableIndex} className="bg-white rounded-lg border-2 border-teal-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">Table {tableIndex + 1}</span>
                        <input
                          type="text"
                          value={table.title || ''}
                          onChange={(e) => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].title = e.target.value;
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          placeholder="Table Title (e.g., Fee Structure)"
                          className="border rounded px-2 py-1 text-sm w-64"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].headers.push('New Column');
                            newTables[tableIndex].rows.forEach(row => row.push(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...(formData.seo_tables || [])];
                            newTables[tableIndex].rows.push(new Array(newTables[tableIndex].headers.length).fill(''));
                            setFormData({...formData, seo_tables: newTables});
                          }}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                        >
                          + Row
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_tables: (formData.seo_tables || []).filter((_, i) => i !== tableIndex)
                            });
                          }}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete Table
                        </button>
                      </div>
                    </div>

                    {/* Table Editor */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            {(table.headers || []).map((header, colIndex) => (
                              <th key={colIndex} className="border border-teal-200 bg-teal-100 p-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].headers[colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 focus:outline-none focus:bg-white focus:border rounded px-1"
                                    placeholder="Header"
                                  />
                                  {table.headers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newTables = [...(formData.seo_tables || [])];
                                        newTables[tableIndex].headers.splice(colIndex, 1);
                                        newTables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                        setFormData({...formData, seo_tables: newTables});
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="Remove column"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(table.rows || []).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border border-teal-200 p-1">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].rows[rowIndex][colIndex] = e.target.value;
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="w-full border-0 bg-transparent focus:outline-none focus:bg-gray-50 px-1"
                                    placeholder="Cell data"
                                  />
                                </td>
                              ))}
                              <td className="w-8">
                                {table.rows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTables = [...(formData.seo_tables || [])];
                                      newTables[tableIndex].rows.splice(rowIndex, 1);
                                      setFormData({...formData, seo_tables: newTables});
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs p-1"
                                    title="Remove row"
                                  >
                                    ×
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Copy Table HTML */}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                          navigator.clipboard.writeText(tableHtml);
                          alert('Table HTML copied! Paste it in SEO Full Content above.');
                        }}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200"
                      >
                        📋 Copy Table HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                          setFormData({
                            ...formData,
                            seo_full_content: (formData.seo_full_content || '') + '\n\n' + tableHtml
                          });
                          alert('Table added to SEO Full Content!');
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200"
                      >
                        ⚡ Insert into Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Table Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    seo_tables: [
                      ...(formData.seo_tables || []),
                      {
                        title: '',
                        headers: ['Column 1', 'Column 2', 'Column 3'],
                        rows: [['', '', ''], ['', '', '']]
                      }
                    ]
                  });
                }}
                className="text-sm text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded border border-teal-300 flex items-center gap-1"
              >
                <FiPlus /> Add New Table
              </button>

              {/* Quick Table Templates */}
              <div className="mt-4 p-3 bg-white border border-teal-200 rounded-lg">
                <p className="text-xs font-medium text-teal-800 mb-2">💡 Quick Add Table Templates:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Fee Structure',
                          headers: ['Course', 'Duration', 'Annual Fee', 'Total Fee'],
                          rows: [['B.Tech', '4 Years', '₹1,50,000', '₹6,00,000'], ['M.Tech', '2 Years', '₹1,00,000', '₹2,00,000']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Fee Structure
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Placement Statistics',
                          headers: ['Year', 'Students Placed', 'Highest Package', 'Average Package'],
                          rows: [['2024', '450', '₹45 LPA', '₹8.5 LPA'], ['2023', '420', '₹42 LPA', '₹7.8 LPA']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Placement Stats
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Admission Cutoff',
                          headers: ['Category', 'Opening Rank', 'Closing Rank'],
                          rows: [['General', '1000', '5000'], ['OBC', '5001', '10000'], ['SC/ST', '10001', '15000']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Admission Cutoff
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Course Comparison',
                          headers: ['Feature', 'Course A', 'Course B'],
                          rows: [['Duration', '', ''], ['Eligibility', '', ''], ['Fees', '', ''], ['Career Options', '', '']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Course Comparison
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seo_tables: [...(formData.seo_tables || []), {
                          title: 'Hostel Fee Structure',
                          headers: ['Room Type', 'Monthly Fee', 'Annual Fee', 'Facilities'],
                          rows: [['Single Room', '₹8,000', '₹96,000', 'AC, Attached Bath'], ['Double Sharing', '₹5,000', '₹60,000', 'Non-AC'], ['Triple Sharing', '₹3,500', '₹42,000', 'Non-AC']]
                        }]
                      });
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded hover:bg-teal-100"
                  >
                    + Hostel Fees
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Content Images */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800">🖼️ SEO Content Images</label>
                  <p className="text-xs text-blue-600">Add images to enhance your SEO content. Include alt tags for accessibility.</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {formData.seo_images?.length || 0} images
                </span>
              </div>

              {/* Image Upload Area */}
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    <FiUpload className="w-6 h-6 text-blue-500 mb-1" />
                    <p className="text-sm text-blue-600">Click to upload SEO image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP (Recommended: 800x600px)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const uploadFormData = new FormData();
                      uploadFormData.append('file', file);
                      
                      try {
                        // type is a query param, not form data
                        // Use headers config to let browser set Content-Type for FormData
                        const response = await api.post('/upload/image?type=campus', uploadFormData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        });
                        const newImage = {
                          url: response.data.url,
                          title: '',
                          alt: `${formData.name || 'College'} - Admissionbuddy`,
                          caption: ''
                        };
                        setFormData({
                          ...formData,
                          seo_images: [...(formData.seo_images || []), newImage]
                        });
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('Failed to upload image. Please try again.');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {formData.seo_images?.length > 0 && (
                <div className="space-y-3">
                  {formData.seo_images.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg border p-3">
                      <div className="flex gap-4">
                        {/* Image Preview */}
                        <div className="w-32 h-24 flex-shrink-0">
                          <img
                            src={image.url?.startsWith('/api') ? image.url : `/api${image.url}`}
                            alt={image.alt || 'SEO Image'}
                            className="w-full h-full object-cover rounded border"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/128x96?text=Image'; }}
                          />
                        </div>
                        
                        {/* Image Details */}
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Image Title</label>
                              <input
                                type="text"
                                value={image.title || ''}
                                onChange={(e) => {
                                  const newImages = [...formData.seo_images];
                                  newImages[index].title = e.target.value;
                                  // Auto-generate alt if empty
                                  if (!newImages[index].alt && e.target.value) {
                                    newImages[index].alt = `${e.target.value} - ${formData.name || 'College'} - Admissionbuddy`;
                                  }
                                  setFormData({...formData, seo_images: newImages});
                                }}
                                placeholder="e.g., Campus Library"
                                className="w-full border rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Alt Tag (SEO) *</label>
                              <input
                                type="text"
                                value={image.alt || ''}
                                onChange={(e) => {
                                  const newImages = [...formData.seo_images];
                                  newImages[index].alt = e.target.value;
                                  setFormData({...formData, seo_images: newImages});
                                }}
                                placeholder="Descriptive alt text"
                                className="w-full border-2 border-blue-200 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Caption (Optional)</label>
                            <input
                              type="text"
                              value={image.caption || ''}
                              onChange={(e) => {
                                const newImages = [...formData.seo_images];
                                newImages[index].caption = e.target.value;
                                setFormData({...formData, seo_images: newImages});
                              }}
                              placeholder="Caption displayed below the image"
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                          
                          {/* Copy HTML Code */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const imgUrl = image.url?.startsWith('/api') ? image.url : `/api${image.url}`;
                                const htmlCode = `<figure><img src="${imgUrl}" alt="${image.alt || ''}" title="${image.title || ''}" />${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`;
                                navigator.clipboard.writeText(htmlCode);
                                alert('HTML code copied! Paste it in SEO Full Content above.');
                              }}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                              📋 Copy HTML Code
                            </button>
                            <span className="text-xs text-gray-500">Insert into content above</span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              seo_images: formData.seo_images.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded self-start"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Insert All */}
              {formData.seo_images?.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">💡 Quick Insert All Images</p>
                      <p className="text-xs text-yellow-600">Copy HTML for all images to paste in content</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const allHtml = formData.seo_images.map(img => {
                          const imgUrl = img.url?.startsWith('/api') ? img.url : `/api${img.url}`;
                          return `<figure><img src="${imgUrl}" alt="${img.alt || ''}" title="${img.title || ''}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}</figure>`;
                        }).join('\n\n');
                        navigator.clipboard.writeText(allHtml);
                        alert('All image HTML copied!');
                      }}
                      className="text-sm bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-300"
                    >
                      📋 Copy All HTML
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🎥 SEO Video</label>
              <p className="text-xs text-gray-500 mb-2">
                📹 YouTube or video embed URL • Add title & description for accessibility
              </p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    name="seo_video_url"
                    value={formData.seo_video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/embed/..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="seo_video_title"
                    value={formData.seo_video_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., 'College Overview - Admissionbuddy'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and video player title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Description (Optional)</label>
                  <textarea
                    name="seo_video_description"
                    value={formData.seo_video_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of the SEO video content..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO FAQs</label>
              <p className="text-xs text-gray-500 mb-2">
                Frequently asked questions that appear in the SEO content section
              </p>
              {formData.seo_faqs.map((faq, index) => (
                <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Question {index + 1}</label>
                      <input
                        type="text"
                        placeholder="e.g., What are the scholarships offered?"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Answer</label>
                      <textarea
                        placeholder="e.g., Various merit and need-based scholarships are available..."
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows="3"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeFAQ(index)}
                    className="mt-2"
                  >
                    <FiTrash2 className="mr-2" /> Remove FAQ
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addFAQ} size="sm">
                <FiPlus className="mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Accreditation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Accreditation</h2>
          <div className="space-y-4">
            {formData.accreditations.map((accr, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Accreditation Name *</label>
                    <select
                      value={typeof accr === 'string' ? '' : (accr.name || '')}
                      onChange={(e) => updateAccreditation(index, 'name', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Accreditation</option>
                      {accreditationsList.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Accreditation Level *</label>
                    <select
                      value={typeof accr === 'string' ? '' : (accr.level || '')}
                      onChange={(e) => updateAccreditation(index, 'level', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Level</option>
                      {accreditationLevelsList.map((level) => (
                        <option key={level.id} value={level.name}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAccreditation(index)}
                      className="w-full"
                    >
                      <FiTrash2 className="mr-2" /> Remove
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={typeof accr === 'string' ? '' : (accr.description || '')}
                    onChange={(e) => updateAccreditation(index, 'description', e.target.value)}
                    placeholder="Additional details about this accreditation (optional)"
                    rows="2"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addAccreditation} size="sm" variant="outline">
              <FiPlus className="mr-2" /> Add Accreditation
            </Button>
          </div>
        </div>

        {/* Rankings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Rankings</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">NIRF Ranking</label>
              <input
                type="number"
                name="nirf_ranking"
                value={formData.nirf_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">India Today Ranking</label>
              <input
                type="number"
                name="india_today_ranking"
                value={formData.india_today_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Outlook Ranking</label>
              <input
                type="number"
                name="outlook_ranking"
                value={formData.outlook_ranking || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Detailed Rankings</label>
            {(formData.rankings || []).map((ranking, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agency *</label>
                    <select
                      value={ranking.agency || ''}
                      onChange={(e) => updateRanking(index, 'agency', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Agency</option>
                      {rankingsList.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={ranking.category || ''}
                      onChange={(e) => updateRanking(index, 'category', e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {rankCategoriesList.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rank *</label>
                    <input
                      type="number"
                      value={ranking.rank || ''}
                      onChange={(e) => updateRanking(index, 'rank', parseInt(e.target.value))}
                      placeholder="e.g., 15"
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year *</label>
                    <input
                      type="number"
                      value={ranking.year || new Date().getFullYear()}
                      onChange={(e) => updateRanking(index, 'year', parseInt(e.target.value))}
                      placeholder="2025"
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => removeRanking(index)}>
                    <FiTrash2 className="mr-2" /> Remove Ranking
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addRanking} size="sm" variant="outline">
              <FiPlus className="mr-2" /> Add Ranking
            </Button>
          </div>
        </div>

        {/* Courses & Fees */}
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
                      <div className="relative">
                        <input
                          type="file"
                          id={`course-brochure-${index}`}
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleCourseBrochureUpload(file, index);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`course-brochure-${index}`}
                          className={`inline-flex items-center px-3 py-2 border rounded cursor-pointer text-sm ${
                            uploadingCourseBrochure[index] ? 'bg-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {uploadingCourseBrochure[index] ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <FiUpload />
                          )}
                        </label>
                      </div>
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

        {/* Admission Details */}
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

        {/* Cutoff Data */}
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

        {/* Placement Details */}
        <CollapsibleSection title="Placement Details" icon="💼" defaultOpen={false}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Highest Package (INR)</label>
              <input
                type="number"
                value={formData.placement.highest}
                onChange={(e) => handleNestedChange('placement', 'highest', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Average Package (INR)</label>
              <input
                type="number"
                value={formData.placement.average}
                onChange={(e) => handleNestedChange('placement', 'average', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Placement Percentage</label>
              <input
                type="number"
                value={formData.placement.percentage}
                onChange={(e) => handleNestedChange('placement', 'percentage', parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Students Participated</label>
              <input
                type="number"
                value={formData.placement.students_participated}
                onChange={(e) => handleNestedChange('placement', 'students_participated', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Companies Participated</label>
              <input
                type="number"
                value={formData.placement.companies_participated}
                onChange={(e) => handleNestedChange('placement', 'companies_participated', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Offers</label>
              <input
                type="number"
                value={formData.placement.total_offers}
                onChange={(e) => handleNestedChange('placement', 'total_offers', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Top Recruiters</label>
            {formData.placement.top_recruiters.map((recruiter, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={recruiter}
                  onChange={(e) => {
                    const newRecruiters = [...formData.placement.top_recruiters];
                    newRecruiters[index] = e.target.value;
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, top_recruiters: newRecruiters }
                    });
                  }}
                  className="flex-1 border rounded px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newRecruiters = formData.placement.top_recruiters.filter((_, i) => i !== index);
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, top_recruiters: newRecruiters }
                    });
                  }}
                >
                  <FiTrash2 />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  placement: {
                    ...formData.placement,
                    top_recruiters: [...formData.placement.top_recruiters, '']
                  }
                });
              }}
              size="sm"
            >
              <FiPlus className="mr-2" /> Add Recruiter
            </Button>
          </div>
        </CollapsibleSection>

        {/* Scholarships */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Scholarships</h2>
          {formData.scholarships.map((scholarship, index) => (
            <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Scholarship Name *</label>
                  <select
                    value={scholarship.name}
                    onChange={(e) => updateScholarship(index, 'name', e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    <option value="">Select Scholarship</option>
                    {availableScholarships.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} - {s.type} ({s.provider})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select a scholarship to auto-fill amount and description</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Amount</label>
                  <input
                    type="text"
                    placeholder="e.g., ₹50,000 per year"
                    value={scholarship.amount}
                    onChange={(e) => updateScholarship(index, 'amount', e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-yellow-50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Description</label>
                  <textarea
                    placeholder="Auto-filled from scholarship database"
                    value={scholarship.description}
                    onChange={(e) => updateScholarship(index, 'description', e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-yellow-50"
                    rows="3"
                  />
                </div>
              </div>
              <Button type="button" variant="outline" onClick={() => removeScholarship(index)} className="mt-2">
                <FiTrash2 className="mr-2" /> Remove Scholarship
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addScholarship} size="sm">
            <FiPlus className="mr-2" /> Add Scholarship
          </Button>
        </div>

        {/* Facilities */}
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

        {/* Updates & News */}
        <CollapsibleSection title="Updates & News" icon="📰" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">Add custom news/updates or tag existing news articles from the News page</p>
          
          {formData.updates.map((update, index) => (
            <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-3">
                {/* Type Selection */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`update-type-${index}`}
                        value="custom"
                        checked={update.type === 'custom' || !update.type}
                        onChange={(e) => updateUpdate(index, 'type', e.target.value)}
                        className="mr-2"
                      />
                      Custom News/Update
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`update-type-${index}`}
                        value="tagged"
                        checked={update.type === 'tagged'}
                        onChange={(e) => updateUpdate(index, 'type', e.target.value)}
                        className="mr-2"
                      />
                      Tag from News Page
                    </label>
                  </div>
                </div>

                {/* If Tagged - Show News Dropdown */}
                {update.type === 'tagged' && (
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Select News Article *</label>
                    <select
                      value={update.newsId || ''}
                      onChange={(e) => updateUpdate(index, 'newsId', e.target.value)}
                      className="w-full border rounded px-3 py-2 bg-white"
                    >
                      <option value="">Select News Article</option>
                      {availableNews.map((news) => (
                        <option key={news.id} value={news.id}>
                          {news.title} ({news.category})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Auto-fills title, content, and date from selected news</p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date *</label>
                  <input
                    type="date"
                    value={update.date}
                    onChange={(e) => updateUpdate(index, 'date', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    readOnly={update.type === 'tagged'}
                    style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="News/Update Title"
                    value={update.title}
                    onChange={(e) => updateUpdate(index, 'title', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    readOnly={update.type === 'tagged'}
                    style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
                  />
                </div>

                {/* Content */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Content *</label>
                  <textarea
                    placeholder="News/Update content or summary"
                    value={update.content}
                    onChange={(e) => updateUpdate(index, 'content', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    readOnly={update.type === 'tagged'}
                    style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
                  />
                </div>
              </div>
              
              <Button type="button" variant="outline" onClick={() => removeUpdate(index)} className="mt-2">
                <FiTrash2 className="mr-2" /> Remove Update
              </Button>
            </div>
          ))}
          
          <Button type="button" onClick={addUpdate} size="sm">
            <FiPlus className="mr-2" /> Add Update/News
          </Button>
        </CollapsibleSection>

        {/* FAQs Section */}
        <CollapsibleSection title="FAQs (Frequently Asked Questions)" icon="❓" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            Add common questions and answers about this institution. These appear on the detail page and help with SEO.
          </p>
          
          {formData.seo_faqs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <span className="text-4xl mb-2 block">❓</span>
              <p className="text-gray-500 mb-3">No FAQs added yet</p>
              <Button type="button" onClick={addFAQ} size="sm">
                <FiPlus className="mr-2" /> Add First FAQ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.seo_faqs.map((faq, index) => (
                <div key={index} className="border-2 rounded-lg p-4 bg-white hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Q{index + 1}</span>
                          <label className="text-sm font-medium text-gray-700">Question</label>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g., What are the admission requirements?"
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">A{index + 1}</span>
                          <label className="text-sm font-medium text-gray-700">Answer</label>
                        </div>
                        <textarea
                          placeholder="Provide a detailed answer..."
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-green-400"
                          rows="3"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove FAQ"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <Button type="button" onClick={addFAQ} size="sm" className="mt-2">
                <FiPlus className="mr-2" /> Add Another FAQ
              </Button>
            </div>
          )}

          {/* FAQ Preview */}
          {formData.seo_faqs.length > 0 && formData.seo_faqs.some(f => f.question && f.answer) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ FAQ Preview (as shown on page)</h4>
              <div className="space-y-3">
                {formData.seo_faqs.filter(f => f.question && f.answer).map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">Q:</span>
                      <p className="font-medium text-gray-800">{faq.question}</p>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <span className="text-green-600 font-bold">A:</span>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common FAQ Templates */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">💡 Quick Add Common FAQs</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { q: 'What are the admission requirements?', a: '' },
                { q: 'What is the fee structure?', a: '' },
                { q: 'What scholarships are available?', a: '' },
                { q: 'What are the placement statistics?', a: '' },
                { q: 'What courses are offered?', a: '' },
                { q: 'Is hostel facility available?', a: '' },
              ].map((template, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      seo_faqs: [...formData.seo_faqs, template]
                    });
                  }}
                  className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  + {template.q}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Sidebar Widgets Configuration */}
        <CollapsibleSection title="Sidebar Widgets Configuration" icon="📱" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            Configure which widgets appear on the college detail page sidebar. Toggle widgets on/off and customize their settings.
          </p>

          <div className="space-y-6">
            {/* Quick Actions Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Quick Actions</h3>
                    <p className="text-xs text-gray-500">Apply Now, Download Brochure, Compare buttons</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.quick_actions?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        quick_actions: { ...formData.sidebar_widgets?.quick_actions, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.quick_actions?.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8 border-t pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.sidebar_widgets?.quick_actions?.apply_now_btn ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        sidebar_widgets: {
                          ...formData.sidebar_widgets,
                          quick_actions: { ...formData.sidebar_widgets?.quick_actions, apply_now_btn: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    Apply Now Button
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.sidebar_widgets?.quick_actions?.download_brochure_btn ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        sidebar_widgets: {
                          ...formData.sidebar_widgets,
                          quick_actions: { ...formData.sidebar_widgets?.quick_actions, download_brochure_btn: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    Download Brochure
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.sidebar_widgets?.quick_actions?.compare_btn ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        sidebar_widgets: {
                          ...formData.sidebar_widgets,
                          quick_actions: { ...formData.sidebar_widgets?.quick_actions, compare_btn: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    Compare Button
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.sidebar_widgets?.quick_actions?.enquiry_btn ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        sidebar_widgets: {
                          ...formData.sidebar_widgets,
                          quick_actions: { ...formData.sidebar_widgets?.quick_actions, enquiry_btn: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    Send Enquiry
                  </label>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Custom Apply Now URL (optional)</label>
                    <input
                      type="url"
                      value={formData.sidebar_widgets?.quick_actions?.apply_now_url || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sidebar_widgets: {
                          ...formData.sidebar_widgets,
                          quick_actions: { ...formData.sidebar_widgets?.quick_actions, apply_now_url: e.target.value }
                        }
                      })}
                      placeholder="Leave empty for default"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Facts Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Quick Facts</h3>
                    <p className="text-xs text-gray-500">Established year, Type, Student count, etc.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.quick_facts?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        quick_facts: { ...formData.sidebar_widgets?.quick_facts, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.quick_facts?.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8 border-t pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_established ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, quick_facts: {...formData.sidebar_widgets?.quick_facts, show_established: e.target.checked}}})}
                      className="rounded" />
                    Established Year
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_type ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, quick_facts: {...formData.sidebar_widgets?.quick_facts, show_type: e.target.checked}}})}
                      className="rounded" />
                    Institution Type
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_approval ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, quick_facts: {...formData.sidebar_widgets?.quick_facts, show_approval: e.target.checked}}})}
                      className="rounded" />
                    Approvals
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_student_count ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, quick_facts: {...formData.sidebar_widgets?.quick_facts, show_student_count: e.target.checked}}})}
                      className="rounded" />
                    Student Count
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_faculty_count ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, quick_facts: {...formData.sidebar_widgets?.quick_facts, show_faculty_count: e.target.checked}}})}
                      className="rounded" />
                    Faculty Count
                  </label>
                </div>
              )}
            </div>

            {/* Important Dates Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Important Dates</h3>
                    <p className="text-xs text-gray-500">Application deadlines, Exam dates, Results</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.important_dates?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        important_dates: { ...formData.sidebar_widgets?.important_dates, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.important_dates?.enabled && (
                <div className="pl-8 border-t pt-4 space-y-3">
                  {(formData.sidebar_widgets?.important_dates?.dates || []).map((date, index) => (
                    <div key={index} className="flex gap-2 items-start bg-gray-50 p-2 rounded">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={date.title}
                          onChange={(e) => {
                            const newDates = [...(formData.sidebar_widgets?.important_dates?.dates || [])];
                            newDates[index].title = e.target.value;
                            setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, important_dates: {...formData.sidebar_widgets?.important_dates, dates: newDates}}});
                          }}
                          placeholder="Event title"
                          className="border rounded px-2 py-1 text-sm"
                        />
                        <input
                          type="date"
                          value={date.date}
                          onChange={(e) => {
                            const newDates = [...(formData.sidebar_widgets?.important_dates?.dates || [])];
                            newDates[index].date = e.target.value;
                            setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, important_dates: {...formData.sidebar_widgets?.important_dates, dates: newDates}}});
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        />
                        <input
                          type="text"
                          value={date.description || ''}
                          onChange={(e) => {
                            const newDates = [...(formData.sidebar_widgets?.important_dates?.dates || [])];
                            newDates[index].description = e.target.value;
                            setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, important_dates: {...formData.sidebar_widgets?.important_dates, dates: newDates}}});
                          }}
                          placeholder="Description (optional)"
                          className="border rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newDates = (formData.sidebar_widgets?.important_dates?.dates || []).filter((_, i) => i !== index);
                          setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, important_dates: {...formData.sidebar_widgets?.important_dates, dates: newDates}}});
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newDates = [...(formData.sidebar_widgets?.important_dates?.dates || []), { title: '', date: '', description: '' }];
                      setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, important_dates: {...formData.sidebar_widgets?.important_dates, dates: newDates}}});
                    }}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FiPlus /> Add Important Date
                  </button>
                </div>
              )}
            </div>

            {/* Fee Summary Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Fee Summary</h3>
                    <p className="text-xs text-gray-500">Quick fee overview in sidebar</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.fee_summary?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        fee_summary: { ...formData.sidebar_widgets?.fee_summary, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.fee_summary?.enabled && (
                <div className="pl-8 border-t pt-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.fee_summary?.show_range ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, fee_summary: {...formData.sidebar_widgets?.fee_summary, show_range: e.target.checked}}})}
                      className="rounded" />
                    Show Fee Range (auto from courses)
                  </label>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Custom Fee Text (optional)</label>
                    <input
                      type="text"
                      value={formData.sidebar_widgets?.fee_summary?.custom_text || ''}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, fee_summary: {...formData.sidebar_widgets?.fee_summary, custom_text: e.target.value}}})}
                      placeholder="e.g., Starting from ₹50,000/year"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact Card Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Contact Card</h3>
                    <p className="text-xs text-gray-500">Phone, Email, Address quick access</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.contact_card?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        contact_card: { ...formData.sidebar_widgets?.contact_card, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.contact_card?.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8 border-t pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_phone ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, contact_card: {...formData.sidebar_widgets?.contact_card, show_phone: e.target.checked}}})}
                      className="rounded" />
                    Show Phone
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_email ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, contact_card: {...formData.sidebar_widgets?.contact_card, show_email: e.target.checked}}})}
                      className="rounded" />
                    Show Email
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_address ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, contact_card: {...formData.sidebar_widgets?.contact_card, show_address: e.target.checked}}})}
                      className="rounded" />
                    Show Address
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_map_link ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, contact_card: {...formData.sidebar_widgets?.contact_card, show_map_link: e.target.checked}}})}
                      className="rounded" />
                    Show Map Link
                  </label>
                </div>
              )}
            </div>

            {/* Counselor CTA Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍💼</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Counselor CTA</h3>
                    <p className="text-xs text-gray-500">&quot;Talk to Expert&quot; call-to-action</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.counselor_cta?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        counselor_cta: { ...formData.sidebar_widgets?.counselor_cta, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.counselor_cta?.enabled && (
                <div className="pl-8 border-t pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.sidebar_widgets?.counselor_cta?.title || 'Need Help?'}
                        onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, counselor_cta: {...formData.sidebar_widgets?.counselor_cta, title: e.target.value}}})}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.sidebar_widgets?.counselor_cta?.subtitle || 'Talk to our expert counselor'}
                        onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, counselor_cta: {...formData.sidebar_widgets?.counselor_cta, subtitle: e.target.value}}})}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Counselor Phone</label>
                    <input
                      type="tel"
                      value={formData.sidebar_widgets?.counselor_cta?.phone || ''}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, counselor_cta: {...formData.sidebar_widgets?.counselor_cta, phone: e.target.value}}})}
                      placeholder="+91 9999999999"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.counselor_cta?.show_callback_form ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, counselor_cta: {...formData.sidebar_widgets?.counselor_cta, show_callback_form: e.target.checked}}})}
                      className="rounded" />
                    Show Request Callback Form
                  </label>
                </div>
              )}
            </div>

            {/* Ad Banner Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📣</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ad Banner</h3>
                    <p className="text-xs text-gray-500">Advertisement placement in sidebar</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.ad_banner?.enabled ?? false}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        ad_banner: { ...formData.sidebar_widgets?.ad_banner, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.ad_banner?.enabled && (
                <div className="pl-8 border-t pt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Position</label>
                    <select
                      value={formData.sidebar_widgets?.ad_banner?.position || 'top'}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, ad_banner: {...formData.sidebar_widgets?.ad_banner, position: e.target.value}}})}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="top">Top of Sidebar</option>
                      <option value="middle">Middle of Sidebar</option>
                      <option value="bottom">Bottom of Sidebar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Ad Code / HTML</label>
                    <textarea
                      value={formData.sidebar_widgets?.ad_banner?.ad_code || ''}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, ad_banner: {...formData.sidebar_widgets?.ad_banner, ad_code: e.target.value}}})}
                      placeholder="Paste your ad code here..."
                      rows="3"
                      className="w-full border rounded px-2 py-1 text-sm font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Share Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Social Share</h3>
                    <p className="text-xs text-gray-500">Share buttons for social media</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.social_share?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        social_share: { ...formData.sidebar_widgets?.social_share, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.social_share?.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8 border-t pt-4">
                  {['facebook', 'twitter', 'whatsapp', 'linkedin', 'telegram', 'email'].map(platform => (
                    <label key={platform} className="flex items-center gap-2 text-sm capitalize">
                      <input
                        type="checkbox"
                        checked={(formData.sidebar_widgets?.social_share?.platforms || []).includes(platform)}
                        onChange={(e) => {
                          const platforms = formData.sidebar_widgets?.social_share?.platforms || [];
                          const newPlatforms = e.target.checked 
                            ? [...platforms, platform]
                            : platforms.filter(p => p !== platform);
                          setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, social_share: {...formData.sidebar_widgets?.social_share, platforms: newPlatforms}}});
                        }}
                        className="rounded"
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Rating Widget</h3>
                    <p className="text-xs text-gray-500">Star rating with review count</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.rating_widget?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        rating_widget: { ...formData.sidebar_widgets?.rating_widget, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.rating_widget?.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8 border-t pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.rating_widget?.show_stars ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, rating_widget: {...formData.sidebar_widgets?.rating_widget, show_stars: e.target.checked}}})}
                      className="rounded" />
                    Show Star Rating
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.sidebar_widgets?.rating_widget?.show_review_count ?? true}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, rating_widget: {...formData.sidebar_widgets?.rating_widget, show_review_count: e.target.checked}}})}
                      className="rounded" />
                    Show Review Count
                  </label>
                </div>
              )}
            </div>

            {/* Related Colleges Widget */}
            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Related Colleges</h3>
                    <p className="text-xs text-gray-500">Similar institutions suggestions</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sidebar_widgets?.related_colleges?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      sidebar_widgets: {
                        ...formData.sidebar_widgets,
                        related_colleges: { ...formData.sidebar_widgets?.related_colleges, enabled: e.target.checked }
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.sidebar_widgets?.related_colleges?.enabled && (
                <div className="pl-8 border-t pt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Number to Show</label>
                    <select
                      value={formData.sidebar_widgets?.related_colleges?.show_count || 3}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, related_colleges: {...formData.sidebar_widgets?.related_colleges, show_count: parseInt(e.target.value)}}})}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value={2}>2 colleges</option>
                      <option value={3}>3 colleges</option>
                      <option value={4}>4 colleges</option>
                      <option value={5}>5 colleges</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Match Criteria</label>
                    <select
                      value={formData.sidebar_widgets?.related_colleges?.criteria || 'same_city'}
                      onChange={(e) => setFormData({...formData, sidebar_widgets: {...formData.sidebar_widgets, related_colleges: {...formData.sidebar_widgets?.related_colleges, criteria: e.target.value}}})}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="same_city">Same City</option>
                      <option value="same_course">Same Courses</option>
                      <option value="same_type">Same Institution Type</option>
                      <option value="same_state">Same State</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Widget Preview */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ Active Widgets Preview</h4>
            <div className="flex flex-wrap gap-2">
              {formData.sidebar_widgets?.quick_actions?.enabled && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">🚀 Quick Actions</span>}
              {formData.sidebar_widgets?.quick_facts?.enabled && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">📊 Quick Facts</span>}
              {formData.sidebar_widgets?.important_dates?.enabled && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">📅 Important Dates</span>}
              {formData.sidebar_widgets?.fee_summary?.enabled && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">💰 Fee Summary</span>}
              {formData.sidebar_widgets?.contact_card?.enabled && <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">📞 Contact Card</span>}
              {formData.sidebar_widgets?.counselor_cta?.enabled && <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">👨‍💼 Counselor CTA</span>}
              {formData.sidebar_widgets?.ad_banner?.enabled && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">📣 Ad Banner</span>}
              {formData.sidebar_widgets?.social_share?.enabled && <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">🔗 Social Share</span>}
              {formData.sidebar_widgets?.rating_widget?.enabled && <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">⭐ Rating</span>}
              {formData.sidebar_widgets?.related_colleges?.enabled && <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">🏫 Related</span>}
            </div>
          </div>
        </CollapsibleSection>

        {/* Menu Configuration */}
        <CollapsibleSection title="Detail Page Menu Configuration" icon="🧭" defaultOpen={false}>
          <p className="text-sm text-gray-600 mb-4">
            Configure the navigation menu that appears on the college detail page. You can enable/disable items, reorder them, or auto-generate from your TOC sections.
          </p>

          <div className="space-y-4">
            {/* Menu Mode Selection */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-3">📌 Menu Mode</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 bg-white rounded border cursor-pointer hover:bg-indigo-50">
                  <input
                    type="radio"
                    name="menu_mode"
                    checked={!formData.menu_config?.use_custom_menu && !formData.menu_config?.auto_from_toc}
                    onChange={() => setFormData({
                      ...formData,
                      menu_config: { ...formData.menu_config, use_custom_menu: false, auto_from_toc: false }
                    })}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">🔧 Default Menu</p>
                    <p className="text-xs text-gray-500">Use standard menu items (Info, Courses, Admissions, etc.)</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-2 bg-white rounded border cursor-pointer hover:bg-indigo-50">
                  <input
                    type="radio"
                    name="menu_mode"
                    checked={formData.menu_config?.auto_from_toc}
                    onChange={() => setFormData({
                      ...formData,
                      menu_config: { ...formData.menu_config, use_custom_menu: false, auto_from_toc: true }
                    })}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">🔗 Auto from TOC</p>
                    <p className="text-xs text-gray-500">Generate menu from Detail Page TOC sections (defined below)</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-2 bg-white rounded border cursor-pointer hover:bg-indigo-50">
                  <input
                    type="radio"
                    name="menu_mode"
                    checked={formData.menu_config?.use_custom_menu}
                    onChange={() => setFormData({
                      ...formData,
                      menu_config: { ...formData.menu_config, use_custom_menu: true, auto_from_toc: false }
                    })}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">✏️ Custom Menu (Separate Pages)</p>
                    <p className="text-xs text-gray-500">Each menu item opens its own page with custom content</p>
                    <p className="text-xs text-blue-600 mt-1">📄 URLs: /colleges/slug/section-id</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Auto from TOC - Detail Page TOC Builder */}
            {formData.menu_config?.auto_from_toc && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2">
                    <FiLayers className="text-green-600" /> Detail Page TOC Sections
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        detail_page_toc: [...(formData.detail_page_toc || []), {
                          title: 'New Section',
                          anchor: `section-${Date.now()}`,
                          content: '',
                          icon: 'default'
                        }]
                      });
                    }}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Add Section
                  </button>
                </div>
                
                {formData.detail_page_toc?.length > 0 ? (
                  <div className="space-y-3">
                    {formData.detail_page_toc.map((item, index) => (
                      <div key={index} className="bg-white border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {/* Order */}
                          <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
                          
                          {/* Icon Selector */}
                          <div className="flex items-center gap-1 border rounded px-2 py-1 bg-white min-w-[120px]">
                            <span className="text-green-600">{getMenuIconById(item.icon)}</span>
                            <select
                              value={normalizeIconValue(item.icon)}
                              onChange={(e) => {
                                const newToc = [...(formData.detail_page_toc || [])];
                                newToc[index].icon = e.target.value;
                                setFormData({...formData, detail_page_toc: newToc});
                              }}
                              className="text-xs bg-transparent border-0 focus:ring-0 cursor-pointer flex-1"
                            >
                              {menuIconOptions.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Title */}
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newToc = [...(formData.detail_page_toc || [])];
                              newToc[index].title = e.target.value;
                              // Auto-generate anchor from title
                              newToc[index].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              setFormData({...formData, detail_page_toc: newToc});
                            }}
                            className="flex-1 border rounded px-2 py-1 text-sm"
                            placeholder="Section Title"
                          />
                          
                          {/* Anchor (read-only) */}
                          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                            #{item.anchor}
                          </span>
                          
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                detail_page_toc: formData.detail_page_toc.filter((_, i) => i !== index)
                              });
                            }}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        
                        {/* Content */}
                        <textarea
                          value={item.content || ''}
                          onChange={(e) => {
                            const newToc = [...(formData.detail_page_toc || [])];
                            newToc[index].content = e.target.value;
                            setFormData({...formData, detail_page_toc: newToc});
                          }}
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={3}
                          placeholder="Section content (HTML supported)..."
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-700">
                    ⚠️ No TOC sections added yet. Click <strong>+ Add Section</strong> above to create menu items.
                  </p>
                )}
                
                {/* Preview */}
                {formData.detail_page_toc?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700 mb-2">Preview - Menu will show:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.detail_page_toc.map((item, index) => (
                        <span key={index} className="px-3 py-1.5 bg-white border border-green-300 rounded-full text-sm text-green-800 flex items-center gap-1">
                          <span className="text-green-600">{getMenuIconById(item.icon)}</span>
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Menu Configuration */}
            {(formData.menu_config?.use_custom_menu || (!formData.menu_config?.auto_from_toc && !formData.menu_config?.use_custom_menu)) && (
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiLayers className="text-gray-600" /> Menu Items
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(formData.menu_config?.items || []), {
                        id: `custom-${Date.now()}`,
                        label: 'New Item',
                        icon: 'default',
                        enabled: true,
                        order: (formData.menu_config?.items?.length || 0) + 1,
                        content: '',
                        page_heading: '',
                        search_heading: '',
                        meta_title: '',
                        meta_description: '',
                        meta_keywords: '',
                        og_title: '',
                        og_description: '',
                        toc: [],
                        tables: [],
                        images: [],
                        videos: [],
                        widgets: {
                          quick_facts: { enabled: true },
                          quick_nav: { enabled: true },
                          contact_cta: { enabled: true, title: 'Need Help?', subtitle: 'Get free counseling' }
                        }
                      }];
                      setFormData({
                        ...formData,
                        menu_config: { ...formData.menu_config, items: newItems }
                      });
                    }}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.menu_config?.items || [])
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                    <div key={item.id} className={`rounded-lg border-2 ${item.enabled ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                      <div className="flex items-center gap-3 p-2">
                        {/* Enable/Disable */}
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => {
                            const newItems = [...(formData.menu_config?.items || [])];
                            const idx = newItems.findIndex(i => i.id === item.id);
                            newItems[idx].enabled = e.target.checked;
                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                          }}
                          className="rounded"
                        />
                        
                        {/* Order */}
                        <input
                          type="number"
                          value={item.order}
                          onChange={(e) => {
                            const newItems = [...(formData.menu_config?.items || [])];
                            const idx = newItems.findIndex(i => i.id === item.id);
                            newItems[idx].order = parseInt(e.target.value) || 1;
                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                          }}
                          className="w-12 border rounded px-2 py-1 text-center text-sm"
                          min="1"
                        />
                        
                        {/* Icon Selector */}
                        <div className="relative">
                          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-white min-w-[140px]">
                            <span className="text-orange-500">{getMenuIconById(item.icon)}</span>
                            <select
                              value={normalizeIconValue(item.icon)}
                              onChange={(e) => {
                                const newItems = [...(formData.menu_config?.items || [])];
                                const idx = newItems.findIndex(i => i.id === item.id);
                                newItems[idx].icon = e.target.value;
                                setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                              }}
                              className="text-sm bg-transparent border-0 focus:ring-0 cursor-pointer flex-1"
                            >
                              {menuIconOptions.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Label */}
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const newItems = [...(formData.menu_config?.items || [])];
                            const idx = newItems.findIndex(i => i.id === item.id);
                            newItems[idx].label = e.target.value;
                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                          }}
                          className="flex-1 border rounded px-2 py-1 text-sm"
                          placeholder="Menu Label"
                        />
                        
                        {/* Section ID */}
                        <input
                          type="text"
                          value={item.id}
                          onChange={(e) => {
                            const newItems = [...(formData.menu_config?.items || [])];
                            const idx = newItems.findIndex(i => i.id === item.id);
                            newItems[idx].id = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                          }}
                          className="w-32 border rounded px-2 py-1 text-sm font-mono bg-gray-50"
                          placeholder="section-id"
                        />
                        
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = (formData.menu_config?.items || []).filter(i => i.id !== item.id);
                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                          }}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Content & SEO Area for Custom Menu Item */}
                      {formData.menu_config?.use_custom_menu && (
                        <div className="px-3 pb-3 border-t bg-gray-50">
                          {/* Page Content */}
                          <label className="block text-xs text-gray-600 mt-2 mb-1 font-semibold">
                            📝 Page Content
                          </label>
                          <textarea
                            value={item.content || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.menu_config?.items || [])];
                              const idx = newItems.findIndex(i => i.id === item.id);
                              newItems[idx].content = e.target.value;
                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                            }}
                            placeholder="Enter content for this section... (supports HTML)"
                            rows="3"
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                          
                          {/* SEO & Meta Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <FiSearch size={12} /> SEO & Meta Tags for this Page
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Page Heading */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Page Heading (H1)</label>
                                <input
                                  type="text"
                                  value={item.page_heading || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].page_heading = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder={item.label || 'Page Heading'}
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                              </div>
                              
                              {/* Search Heading */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Search Heading</label>
                                <input
                                  type="text"
                                  value={item.search_heading || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].search_heading = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="Search result heading"
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                              </div>
                              
                              {/* Meta Title */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Meta Title <span className="text-gray-400">(50-60 chars)</span></label>
                                <input
                                  type="text"
                                  value={item.meta_title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].meta_title = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder={`${item.label} - ${formData.name || 'College Name'}`}
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                                <p className="text-xs text-gray-400 mt-0.5">{(item.meta_title || '').length}/60</p>
                              </div>
                              
                              {/* Meta Description */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Meta Description <span className="text-gray-400">(150-160 chars)</span></label>
                                <textarea
                                  value={item.meta_description || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].meta_description = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="Brief description of this page for search engines..."
                                  rows="2"
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                                <p className="text-xs text-gray-400 mt-0.5">{(item.meta_description || '').length}/160</p>
                              </div>
                              
                              {/* Meta Keywords */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Meta Keywords <span className="text-gray-400">(comma separated)</span></label>
                                <input
                                  type="text"
                                  value={item.meta_keywords || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].meta_keywords = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="keyword1, keyword2, keyword3"
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                              </div>
                              
                              {/* OG Title */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">OG Title</label>
                                <input
                                  type="text"
                                  value={item.og_title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].og_title = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="Social media title"
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                              </div>
                              
                              {/* OG Description */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">OG Description</label>
                                <input
                                  type="text"
                                  value={item.og_description || ''}
                                  onChange={(e) => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    newItems[idx].og_description = e.target.value;
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  placeholder="Social media description"
                                  className="w-full border rounded px-2 py-1 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Table of Contents Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiLayers size={12} /> Table of Contents for this Page
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...(formData.menu_config?.items || [])];
                                  const idx = newItems.findIndex(i => i.id === item.id);
                                  if (!newItems[idx].toc) newItems[idx].toc = [];
                                  newItems[idx].toc.push({
                                    title: 'New Section',
                                    anchor: `section-${Date.now()}`,
                                    content: ''
                                  });
                                  setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                }}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                              >
                                <FiPlus size={10} /> Add TOC Section
                              </button>
                            </div>
                            
                            {item.toc && item.toc.length > 0 ? (
                              <div className="space-y-2">
                                {item.toc.map((tocItem, tocIndex) => (
                                  <div key={tocIndex} className="bg-white border rounded p-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs text-gray-400 w-4">{tocIndex + 1}.</span>
                                      <input
                                        type="text"
                                        value={tocItem.title}
                                        onChange={(e) => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].toc[tocIndex].title = e.target.value;
                                          newItems[idx].toc[tocIndex].anchor = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        placeholder="Section Title"
                                        className="flex-1 border rounded px-2 py-1 text-xs"
                                      />
                                      <span className="text-xs text-gray-400 font-mono">#{tocItem.anchor}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].toc = newItems[idx].toc.filter((_, i) => i !== tocIndex);
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="text-red-400 hover:text-red-600 p-1"
                                      >
                                        <FiTrash2 size={12} />
                                      </button>
                                    </div>
                                    <textarea
                                      value={tocItem.content || ''}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        newItems[idx].toc[tocIndex].content = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="Section content (HTML supported)..."
                                      rows="2"
                                      className="w-full border rounded px-2 py-1 text-xs mt-1"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No TOC sections. Click &quot;+ Add TOC Section&quot; to add.</p>
                            )}
                            
                            {/* TOC Preview */}
                            {item.toc && item.toc.length > 0 && (
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-blue-700 mb-1">TOC Preview:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.toc.map((t, ti) => (
                                    <span key={ti} className="text-xs bg-white px-2 py-0.5 rounded border text-blue-800">
                                      {t.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Table Builder Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiGrid size={12} /> Tables for this Page
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...(formData.menu_config?.items || [])];
                                  const idx = newItems.findIndex(i => i.id === item.id);
                                  if (!newItems[idx].tables) newItems[idx].tables = [];
                                  newItems[idx].tables.push({
                                    title: 'New Table',
                                    headers: ['Column 1', 'Column 2', 'Column 3'],
                                    rows: [['', '', ''], ['', '', '']]
                                  });
                                  setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                }}
                                className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200 flex items-center gap-1"
                              >
                                <FiPlus size={10} /> Add Table
                              </button>
                            </div>
                            
                            {item.tables && item.tables.length > 0 ? (
                              <div className="space-y-3">
                                {item.tables.map((table, tableIndex) => (
                                  <div key={tableIndex} className="bg-white border border-teal-200 rounded p-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-1.5 py-0.5 rounded">T{tableIndex + 1}</span>
                                        <input
                                          type="text"
                                          value={table.title || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].tables[tableIndex].title = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Table Title"
                                          className="border rounded px-2 py-0.5 text-xs w-40"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].tables[tableIndex].headers.push('New Col');
                                            newItems[idx].tables[tableIndex].rows.forEach(row => row.push(''));
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-100"
                                        >
                                          +Col
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].tables[tableIndex].rows.push(new Array(newItems[idx].tables[tableIndex].headers.length).fill(''));
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-100"
                                        >
                                          +Row
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].tables = newItems[idx].tables.filter((_, ti) => ti !== tableIndex);
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="text-xs text-red-500 hover:text-red-700 px-1"
                                        >
                                          <FiTrash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Table Editor */}
                                    <div className="overflow-x-auto max-h-48">
                                      <table className="w-full border-collapse text-xs">
                                        <thead>
                                          <tr>
                                            {(table.headers || []).map((header, colIndex) => (
                                              <th key={colIndex} className="border border-teal-200 bg-teal-50 p-0.5">
                                                <div className="flex items-center">
                                                  <input
                                                    type="text"
                                                    value={header}
                                                    onChange={(e) => {
                                                      const newItems = [...(formData.menu_config?.items || [])];
                                                      const idx = newItems.findIndex(i => i.id === item.id);
                                                      newItems[idx].tables[tableIndex].headers[colIndex] = e.target.value;
                                                      setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                                    }}
                                                    className="w-full border-0 bg-transparent font-semibold text-center text-teal-800 text-xs px-1"
                                                    placeholder="Header"
                                                  />
                                                  {table.headers.length > 1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const newItems = [...(formData.menu_config?.items || [])];
                                                        const idx = newItems.findIndex(i => i.id === item.id);
                                                        newItems[idx].tables[tableIndex].headers.splice(colIndex, 1);
                                                        newItems[idx].tables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
                                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                                      }}
                                                      className="text-red-400 hover:text-red-600 text-xs"
                                                    >
                                                      ×
                                                    </button>
                                                  )}
                                                </div>
                                              </th>
                                            ))}
                                            <th className="w-6"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {(table.rows || []).map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                              {row.map((cell, cellIndex) => (
                                                <td key={cellIndex} className="border border-teal-200 p-0.5">
                                                  <input
                                                    type="text"
                                                    value={cell}
                                                    onChange={(e) => {
                                                      const newItems = [...(formData.menu_config?.items || [])];
                                                      const idx = newItems.findIndex(i => i.id === item.id);
                                                      newItems[idx].tables[tableIndex].rows[rowIndex][cellIndex] = e.target.value;
                                                      setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                                    }}
                                                    className="w-full border-0 text-center text-xs px-1"
                                                    placeholder="-"
                                                  />
                                                </td>
                                              ))}
                                              <td className="border border-teal-200 p-0.5 text-center">
                                                {table.rows.length > 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newItems = [...(formData.menu_config?.items || [])];
                                                      const idx = newItems.findIndex(i => i.id === item.id);
                                                      newItems[idx].tables[tableIndex].rows = newItems[idx].tables[tableIndex].rows.filter((_, ri) => ri !== rowIndex);
                                                      setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                                    }}
                                                    className="text-red-400 hover:text-red-600 text-xs"
                                                  >
                                                    ×
                                                  </button>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    
                                    {/* Insert to Content Button */}
                                    <div className="mt-2 flex gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].content = (newItems[idx].content || '') + '\n\n' + tableHtml;
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          alert('Table inserted into Page Content!');
                                        }}
                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                                      >
                                        <FiEdit size={10} /> Insert to Content
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const tableHtml = `<table class="data-table">\n  <caption>${table.title || 'Table'}</caption>\n  <thead>\n    <tr>\n${table.headers.map(h => `      <th>${h}</th>`).join('\n')}\n    </tr>\n  </thead>\n  <tbody>\n${table.rows.map(row => `    <tr>\n${row.map(cell => `      <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n')}\n  </tbody>\n</table>`;
                                          navigator.clipboard.writeText(tableHtml);
                                          alert('Table HTML copied!');
                                        }}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
                                      >
                                        📋 Copy HTML
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No tables. Click &quot;+ Add Table&quot; to create.</p>
                            )}
                            
                            {/* Quick Table Templates */}
                            {(!item.tables || item.tables.length === 0) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500">Quick add:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    if (!newItems[idx].tables) newItems[idx].tables = [];
                                    newItems[idx].tables.push({
                                      title: 'Fee Structure',
                                      headers: ['Course', 'Duration', 'Annual Fee', 'Total Fee'],
                                      rows: [['B.Tech', '4 Years', '₹1,50,000', '₹6,00,000'], ['M.Tech', '2 Years', '₹1,00,000', '₹2,00,000']]
                                    });
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-xs text-teal-600 hover:underline"
                                >
                                  Fee Structure
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    if (!newItems[idx].tables) newItems[idx].tables = [];
                                    newItems[idx].tables.push({
                                      title: 'Placement Statistics',
                                      headers: ['Year', 'Students Placed', 'Highest Package', 'Average Package'],
                                      rows: [['2024', '95%', '₹45 LPA', '₹12 LPA'], ['2023', '92%', '₹40 LPA', '₹10 LPA']]
                                    });
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-xs text-teal-600 hover:underline"
                                >
                                  Placements
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    if (!newItems[idx].tables) newItems[idx].tables = [];
                                    newItems[idx].tables.push({
                                      title: 'Eligibility Criteria',
                                      headers: ['Course', 'Qualification', 'Minimum %', 'Entrance Exam'],
                                      rows: [['B.Tech', '12th PCM', '75%', 'JEE Main'], ['MBA', 'Graduation', '60%', 'CAT/MAT']]
                                    });
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-xs text-teal-600 hover:underline"
                                >
                                  Eligibility
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Images Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiImage size={12} /> Images for this Page
                              </p>
                              <label className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 cursor-pointer flex items-center gap-1">
                                <FiUpload size={10} /> Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    
                                    try {
                                      const uploadFormData = new FormData();
                                      uploadFormData.append('file', file);
                                      
                                      const token = localStorage.getItem('adminToken');
                                      const response = await api.post('/upload/image?type=content', uploadFormData, {
                                        headers: {
                                          'Authorization': `Bearer ${token}`
                                        }
                                      });
                                      
                                      if (response.data.success) {
                                        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
                                        const fullUrl = backendUrl + response.data.url;
                                        
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].images) newItems[idx].images = [];
                                        newItems[idx].images.push({
                                          url: fullUrl,
                                          alt: '',
                                          title: '',
                                          width: 'auto',
                                          height: 'auto',
                                          align: 'center'
                                        });
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        alert('Image uploaded successfully!');
                                      }
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      alert('Failed to upload image. Please try again.');
                                    }
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">📐 Recommended: 800×600px, Max 2MB. Auto-compressed to ~150KB</p>
                            
                            {item.images && item.images.length > 0 ? (
                              <div className="space-y-2">
                                {item.images.map((img, imgIndex) => (
                                  <div key={imgIndex} className="bg-white border border-purple-200 rounded p-2">
                                    <div className="flex gap-2">
                                      {/* Image Preview */}
                                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                      </div>
                                      
                                      {/* Image Settings */}
                                      <div className="flex-1 space-y-1">
                                        <div className="flex gap-1">
                                          <input
                                            type="text"
                                            value={img.alt || ''}
                                            onChange={(e) => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images[imgIndex].alt = e.target.value;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            placeholder="Alt text (SEO)"
                                            className="flex-1 border rounded px-2 py-0.5 text-xs"
                                          />
                                          <input
                                            type="text"
                                            value={img.title || ''}
                                            onChange={(e) => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images[imgIndex].title = e.target.value;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            placeholder="Title/Caption"
                                            className="flex-1 border rounded px-2 py-0.5 text-xs"
                                          />
                                        </div>
                                        
                                        {/* Resize Options */}
                                        <div className="flex gap-1 items-center">
                                          <span className="text-xs text-gray-500">Size:</span>
                                          <input
                                            type="text"
                                            value={img.width || 'auto'}
                                            onChange={(e) => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images[imgIndex].width = e.target.value;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            placeholder="Width"
                                            className="w-16 border rounded px-1 py-0.5 text-xs text-center"
                                          />
                                          <span className="text-xs text-gray-400">×</span>
                                          <input
                                            type="text"
                                            value={img.height || 'auto'}
                                            onChange={(e) => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images[imgIndex].height = e.target.value;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            placeholder="Height"
                                            className="w-16 border rounded px-1 py-0.5 text-xs text-center"
                                          />
                                          <select
                                            value={img.align || 'center'}
                                            onChange={(e) => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images[imgIndex].align = e.target.value;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            className="border rounded px-1 py-0.5 text-xs"
                                          >
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const imgHtml = `<figure style="text-align: ${img.align || 'center'};">\n  <img src="${img.url}" alt="${img.alt || ''}" title="${img.title || ''}" style="width: ${img.width || 'auto'}; height: ${img.height || 'auto'}; max-width: 100%;" />\n  ${img.title ? `<figcaption>${img.title}</figcaption>` : ''}\n</figure>`;
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].content = (newItems[idx].content || '') + '\n\n' + imgHtml;
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                              alert('Image inserted into content!');
                                            }}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200"
                                          >
                                            Insert to Content
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const imgHtml = `<img src="${img.url}" alt="${img.alt || ''}" title="${img.title || ''}" style="width: ${img.width || 'auto'}; height: ${img.height || 'auto'};" />`;
                                              navigator.clipboard.writeText(imgHtml);
                                              alert('Image HTML copied!');
                                            }}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-200"
                                          >
                                            Copy HTML
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newItems = [...(formData.menu_config?.items || [])];
                                              const idx = newItems.findIndex(i => i.id === item.id);
                                              newItems[idx].images = newItems[idx].images.filter((_, ii) => ii !== imgIndex);
                                              setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 px-1"
                                          >
                                            <FiTrash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No images. Click &quot;Upload Image&quot; to add.</p>
                            )}
                          </div>
                          
                          {/* Videos Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiVideo size={12} /> Videos for this Page
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...(formData.menu_config?.items || [])];
                                  const idx = newItems.findIndex(i => i.id === item.id);
                                  if (!newItems[idx].videos) newItems[idx].videos = [];
                                  newItems[idx].videos.push({
                                    url: '',
                                    title: '',
                                    description: '',
                                    thumbnail: '',
                                    type: 'youtube'
                                  });
                                  setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                }}
                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 flex items-center gap-1"
                              >
                                <FiPlus size={10} /> Add Video
                              </button>
                            </div>
                            
                            {item.videos && item.videos.length > 0 ? (
                              <div className="space-y-2">
                                {item.videos.map((video, vidIndex) => (
                                  <div key={vidIndex} className="bg-white border border-red-200 rounded p-2">
                                    <div className="space-y-1">
                                      <div className="flex gap-1">
                                        <select
                                          value={video.type || 'youtube'}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].videos[vidIndex].type = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="border rounded px-1 py-0.5 text-xs w-24"
                                        >
                                          <option value="youtube">YouTube</option>
                                          <option value="vimeo">Vimeo</option>
                                          <option value="embed">Embed</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={video.url || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].videos[vidIndex].url = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Video URL or Embed Code"
                                          className="flex-1 border rounded px-2 py-0.5 text-xs"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].videos = newItems[idx].videos.filter((_, vi) => vi !== vidIndex);
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="text-red-500 hover:text-red-700 px-1"
                                        >
                                          <FiTrash2 size={12} />
                                        </button>
                                      </div>
                                      
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          value={video.title || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].videos[vidIndex].title = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Video Title (Alt)"
                                          className="flex-1 border rounded px-2 py-0.5 text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={video.description || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].videos[vidIndex].description = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Description"
                                          className="flex-1 border rounded px-2 py-0.5 text-xs"
                                        />
                                      </div>
                                      
                                      {/* Action Buttons */}
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            let videoHtml = '';
                                            if (video.type === 'youtube') {
                                              const videoId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1] || video.url;
                                              videoHtml = `<div class="video-container" style="text-align: center;">\n  <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${video.title || 'Video'}" frameborder="0" allowfullscreen></iframe>\n  ${video.title ? `<p class="video-title">${video.title}</p>` : ''}\n  ${video.description ? `<p class="video-desc">${video.description}</p>` : ''}\n</div>`;
                                            } else if (video.type === 'vimeo') {
                                              const videoId = video.url.match(/vimeo\.com\/(\d+)/)?.[1] || video.url;
                                              videoHtml = `<div class="video-container" style="text-align: center;">\n  <iframe width="560" height="315" src="https://player.vimeo.com/video/${videoId}" title="${video.title || 'Video'}" frameborder="0" allowfullscreen></iframe>\n  ${video.title ? `<p class="video-title">${video.title}</p>` : ''}\n</div>`;
                                            } else {
                                              videoHtml = `<div class="video-container" style="text-align: center;">\n  ${video.url}\n  ${video.title ? `<p class="video-title">${video.title}</p>` : ''}\n</div>`;
                                            }
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].content = (newItems[idx].content || '') + '\n\n' + videoHtml;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                            alert('Video inserted into content!');
                                          }}
                                          className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200"
                                        >
                                          Insert to Content
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            let videoHtml = '';
                                            if (video.type === 'youtube') {
                                              const videoId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1] || video.url;
                                              videoHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${video.title || 'Video'}" frameborder="0" allowfullscreen></iframe>`;
                                            } else if (video.type === 'vimeo') {
                                              const videoId = video.url.match(/vimeo\.com\/(\d+)/)?.[1] || video.url;
                                              videoHtml = `<iframe width="560" height="315" src="https://player.vimeo.com/video/${videoId}" title="${video.title || 'Video'}" frameborder="0" allowfullscreen></iframe>`;
                                            } else {
                                              videoHtml = video.url;
                                            }
                                            navigator.clipboard.writeText(videoHtml);
                                            alert('Video HTML copied!');
                                          }}
                                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-200"
                                        >
                                          Copy HTML
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No videos. Click &quot;+ Add Video&quot; to add.</p>
                            )}
                          </div>
                          
                          {/* Sidebar Widgets Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiGrid size={12} /> Sidebar Widgets for this Page
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">Configure which widgets appear in the sidebar of this page</p>
                            
                            <div className="space-y-2">
                              {/* Quick Facts Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.quick_facts?.enabled ?? true}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.quick_facts) newItems[idx].widgets.quick_facts = {};
                                        newItems[idx].widgets.quick_facts.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">📊 Quick Facts</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Shows institution stats</span>
                                </div>
                              </div>
                              
                              {/* Quick Navigation Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.quick_nav?.enabled ?? true}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.quick_nav) newItems[idx].widgets.quick_nav = {};
                                        newItems[idx].widgets.quick_nav.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">📑 Quick Navigation</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Menu links sidebar</span>
                                </div>
                              </div>
                              
                              {/* Contact CTA Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.contact_cta?.enabled ?? true}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.contact_cta) newItems[idx].widgets.contact_cta = {};
                                        newItems[idx].widgets.contact_cta.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">📞 Contact CTA</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Need Help? box</span>
                                </div>
                                {item.widgets?.contact_cta?.enabled && (
                                  <div className="ml-5 mt-1 space-y-1">
                                    <input
                                      type="text"
                                      value={item.widgets?.contact_cta?.title || 'Need Help?'}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.contact_cta) newItems[idx].widgets.contact_cta = { enabled: true };
                                        newItems[idx].widgets.contact_cta.title = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="CTA Title"
                                      className="w-full border rounded px-2 py-0.5 text-xs"
                                    />
                                    <input
                                      type="text"
                                      value={item.widgets?.contact_cta?.subtitle || 'Get free counseling'}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets.contact_cta) newItems[idx].widgets.contact_cta = { enabled: true };
                                        newItems[idx].widgets.contact_cta.subtitle = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="CTA Subtitle"
                                      className="w-full border rounded px-2 py-0.5 text-xs"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Related Links Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.related_links?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.related_links) newItems[idx].widgets.related_links = { enabled: false, links: [] };
                                        newItems[idx].widgets.related_links.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">🔗 Related Links</span>
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItems = [...(formData.menu_config?.items || [])];
                                      const idx = newItems.findIndex(i => i.id === item.id);
                                      if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                      if (!newItems[idx].widgets.related_links) newItems[idx].widgets.related_links = { enabled: true, links: [] };
                                      newItems[idx].widgets.related_links.links.push({ title: '', url: '' });
                                      setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                    }}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    + Add Link
                                  </button>
                                </div>
                                {item.widgets?.related_links?.enabled && item.widgets?.related_links?.links?.length > 0 && (
                                  <div className="ml-5 mt-1 space-y-1">
                                    {item.widgets.related_links.links.map((link, linkIndex) => (
                                      <div key={linkIndex} className="flex gap-1">
                                        <input
                                          type="text"
                                          value={link.title || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].widgets.related_links.links[linkIndex].title = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Link Title"
                                          className="flex-1 border rounded px-2 py-0.5 text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={link.url || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].widgets.related_links.links[linkIndex].url = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="URL"
                                          className="flex-1 border rounded px-2 py-0.5 text-xs"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].widgets.related_links.links = newItems[idx].widgets.related_links.links.filter((_, li) => li !== linkIndex);
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <FiTrash2 size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Custom HTML Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.custom_html?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.custom_html) newItems[idx].widgets.custom_html = { enabled: false, content: '' };
                                        newItems[idx].widgets.custom_html.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">🧩 Custom Widget</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Custom HTML/Embed</span>
                                </div>
                                {item.widgets?.custom_html?.enabled && (
                                  <div className="ml-5 mt-1">
                                    <textarea
                                      value={item.widgets?.custom_html?.content || ''}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets.custom_html) newItems[idx].widgets.custom_html = { enabled: true };
                                        newItems[idx].widgets.custom_html.content = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="Custom HTML/embed code..."
                                      rows="2"
                                      className="w-full border rounded px-2 py-1 text-xs font-mono"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Ad Banner Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.ad_banner?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.ad_banner) newItems[idx].widgets.ad_banner = { enabled: false, code: '' };
                                        newItems[idx].widgets.ad_banner.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">📢 Ad Banner</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Advertisement slot</span>
                                </div>
                                {item.widgets?.ad_banner?.enabled && (
                                  <div className="ml-5 mt-1">
                                    <textarea
                                      value={item.widgets?.ad_banner?.code || ''}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets.ad_banner) newItems[idx].widgets.ad_banner = { enabled: true };
                                        newItems[idx].widgets.ad_banner.code = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="Ad code (Google Ads, etc.)..."
                                      rows="2"
                                      className="w-full border rounded px-2 py-1 text-xs font-mono"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Reviews Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.reviews?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.reviews) newItems[idx].widgets.reviews = { enabled: false, show_count: 3 };
                                        newItems[idx].widgets.reviews.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">⭐ Reviews Widget</span>
                                  </label>
                                  <span className="text-xs text-gray-400">User reviews & ratings</span>
                                </div>
                                {item.widgets?.reviews?.enabled && (
                                  <div className="ml-5 mt-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <label className="text-xs text-gray-500">Show reviews:</label>
                                      <input
                                        type="number"
                                        value={item.widgets?.reviews?.show_count || 3}
                                        onChange={(e) => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].widgets.reviews.show_count = parseInt(e.target.value) || 3;
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="w-16 border rounded px-2 py-0.5 text-xs"
                                        min="1"
                                        max="10"
                                      />
                                    </div>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={item.widgets?.reviews?.show_form ?? true}
                                        onChange={(e) => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].widgets.reviews.show_form = e.target.checked;
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="rounded"
                                      />
                                      <span>Show "Write Review" button</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              
                              {/* Ask a Question Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.ask_question?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.ask_question) newItems[idx].widgets.ask_question = { enabled: false };
                                        newItems[idx].widgets.ask_question.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">❓ Ask a Question</span>
                                  </label>
                                  <span className="text-xs text-gray-400">Q&A submission form</span>
                                </div>
                                {item.widgets?.ask_question?.enabled && (
                                  <div className="ml-5 mt-1 space-y-1">
                                    <input
                                      type="text"
                                      value={item.widgets?.ask_question?.title || 'Have a Question?'}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        newItems[idx].widgets.ask_question.title = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="Widget Title"
                                      className="w-full border rounded px-2 py-0.5 text-xs"
                                    />
                                    <input
                                      type="text"
                                      value={item.widgets?.ask_question?.placeholder || 'Type your question here...'}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        newItems[idx].widgets.ask_question.placeholder = e.target.value;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      placeholder="Input Placeholder"
                                      className="w-full border rounded px-2 py-0.5 text-xs"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Comments Widget */}
                              <div className="bg-white border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="flex items-center gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={item.widgets?.comments?.enabled ?? false}
                                      onChange={(e) => {
                                        const newItems = [...(formData.menu_config?.items || [])];
                                        const idx = newItems.findIndex(i => i.id === item.id);
                                        if (!newItems[idx].widgets) newItems[idx].widgets = {};
                                        if (!newItems[idx].widgets.comments) newItems[idx].widgets.comments = { enabled: false };
                                        newItems[idx].widgets.comments.enabled = e.target.checked;
                                        setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                      }}
                                      className="rounded text-orange-500"
                                    />
                                    <span className="font-medium">💬 Comments Section</span>
                                  </label>
                                  <span className="text-xs text-gray-400">User comments</span>
                                </div>
                                {item.widgets?.comments?.enabled && (
                                  <div className="ml-5 mt-1 space-y-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={item.widgets?.comments?.require_approval ?? true}
                                        onChange={(e) => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].widgets.comments.require_approval = e.target.checked;
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="rounded"
                                      />
                                      <span>Require approval before showing</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={item.widgets?.comments?.allow_replies ?? true}
                                        onChange={(e) => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].widgets.comments.allow_replies = e.target.checked;
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="rounded"
                                      />
                                      <span>Allow replies to comments</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* FAQ Section */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <FiHelpCircle size={12} /> FAQs for this Page
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...(formData.menu_config?.items || [])];
                                  const idx = newItems.findIndex(i => i.id === item.id);
                                  if (!newItems[idx].faqs) newItems[idx].faqs = [];
                                  newItems[idx].faqs.push({ question: '', answer: '' });
                                  setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                }}
                                className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 flex items-center gap-1"
                              >
                                <FiPlus size={10} /> Add FAQ
                              </button>
                            </div>
                            
                            {item.faqs && item.faqs.length > 0 ? (
                              <div className="space-y-2">
                                {item.faqs.map((faq, faqIndex) => (
                                  <div key={faqIndex} className="bg-white border border-amber-200 rounded p-2">
                                    <div className="flex items-start gap-2">
                                      <span className="text-xs text-amber-600 font-bold mt-1">Q{faqIndex + 1}</span>
                                      <div className="flex-1 space-y-1">
                                        <input
                                          type="text"
                                          value={faq.question || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].faqs[faqIndex].question = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Question"
                                          className="w-full border rounded px-2 py-1 text-xs font-medium"
                                        />
                                        <textarea
                                          value={faq.answer || ''}
                                          onChange={(e) => {
                                            const newItems = [...(formData.menu_config?.items || [])];
                                            const idx = newItems.findIndex(i => i.id === item.id);
                                            newItems[idx].faqs[faqIndex].answer = e.target.value;
                                            setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                          }}
                                          placeholder="Answer (HTML supported)"
                                          rows="2"
                                          className="w-full border rounded px-2 py-1 text-xs"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newItems = [...(formData.menu_config?.items || [])];
                                          const idx = newItems.findIndex(i => i.id === item.id);
                                          newItems[idx].faqs = newItems[idx].faqs.filter((_, fi) => fi !== faqIndex);
                                          setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                        }}
                                        className="text-red-400 hover:text-red-600 mt-1"
                                      >
                                        <FiTrash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No FAQs. Click &quot;+ Add FAQ&quot; to add.</p>
                            )}
                            
                            {/* Quick FAQ Templates */}
                            {(!item.faqs || item.faqs.length === 0) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500">Quick add:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    if (!newItems[idx].faqs) newItems[idx].faqs = [];
                                    newItems[idx].faqs.push(
                                      { question: 'What are the admission requirements?', answer: '' },
                                      { question: 'What is the fee structure?', answer: '' },
                                      { question: 'What are the placement statistics?', answer: '' }
                                    );
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-xs text-amber-600 hover:underline"
                                >
                                  Common FAQs
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(formData.menu_config?.items || [])];
                                    const idx = newItems.findIndex(i => i.id === item.id);
                                    if (!newItems[idx].faqs) newItems[idx].faqs = [];
                                    newItems[idx].faqs.push(
                                      { question: 'How to apply for admission?', answer: '' },
                                      { question: 'What documents are required?', answer: '' },
                                      { question: 'What is the application deadline?', answer: '' }
                                    );
                                    setFormData({...formData, menu_config: {...formData.menu_config, items: newItems}});
                                  }}
                                  className="text-xs text-amber-600 hover:underline"
                                >
                                  Admission FAQs
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-3">👁️ Menu Preview</h4>
              <div className="bg-white rounded-lg border p-3">
                <div className="flex gap-2 overflow-x-auto">
                  {formData.menu_config?.auto_from_toc ? (
                    // Show TOC items
                    formData.seo_toc?.length > 0 ? (
                      formData.seo_toc.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm whitespace-nowrap flex items-center gap-1"
                        >
                          📌 {item.title}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No TOC sections</span>
                    )
                  ) : (
                    // Show menu items
                    (formData.menu_config?.items || [])
                      .filter(item => item.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.contact_info.phone}
                onChange={(e) => handleNestedChange('contact_info', 'phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleNestedChange('contact_info', 'email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.contact_info.website}
                onChange={(e) => handleNestedChange('contact_info', 'website', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Media & Resources */}
        <CollapsibleSection title="Media & Resources" icon="📸" defaultOpen={true}>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Logo</label>
              <p className="text-xs text-gray-600 mb-2">📐 Recommended: 400x400 px (Square) • Max: Any size • Auto-optimized to 400x400 px</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingLogo ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {uploadingLogo ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={formData.logo_title}
                    onChange={(e) => handleTitleChange('logo_title', e.target.value)}
                    placeholder="e.g., 'Official Logo'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                  />
                  <p className="text-xs text-blue-600 mt-1">⚡ Alt text auto-generated with Admissionbuddy branding</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                  <input
                    type="text"
                    name="logo_alt"
                    value={formData.logo_alt}
                    onChange={handleChange}
                    placeholder="Auto-generated from title"
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Editable if needed</p>
                </div>
              </div>
              {formData.logo_url && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative">
                    <img 
                      key={formData.logo_url}
                      src={formData.logo_url} 
                      alt={formData.logo_alt || "Logo Preview"} 
                      className="h-20 object-contain border border-gray-300 p-2 bg-white rounded"
                      onLoad={(e) => console.log('Logo loaded:', formData.logo_url)}
                      onError={(e) => {
                        console.error('Logo failed to load:', formData.logo_url);
                        e.target.style.border = '2px solid red';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 break-all">URL: {formData.logo_url}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Banner</label>
              <p className="text-xs text-gray-600 mb-2">📐 Recommended: 1600x400 px (Wide) • Max: Any size • Auto-optimized to 1600x400 px</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="banner_url"
                  value={formData.banner_url}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, 'banner');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingBanner ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {uploadingBanner ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={formData.banner_title}
                    onChange={(e) => handleTitleChange('banner_title', e.target.value)}
                    placeholder="e.g., 'Main Campus Building'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                  />
                  <p className="text-xs text-blue-600 mt-1">⚡ Alt text auto-generated with Admissionbuddy branding</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                  <input
                    type="text"
                    name="banner_alt"
                    value={formData.banner_alt}
                    onChange={handleChange}
                    placeholder="Auto-generated from title"
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Editable if needed</p>
                </div>
              </div>
              {formData.banner_url && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative">
                    <img 
                      key={formData.banner_url}
                      src={formData.banner_url} 
                      alt={formData.banner_alt || "Banner Preview"} 
                      className="w-full max-h-40 object-cover rounded border border-gray-300 bg-white"
                      onLoad={(e) => console.log('Banner loaded:', formData.banner_url)}
                      onError={(e) => {
                        console.error('Banner failed to load:', formData.banner_url);
                        e.target.style.border = '2px solid red';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 break-all">URL: {formData.banner_url}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Campus Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Campus Gallery Images</label>
              <p className="text-xs text-gray-600 mb-3">📐 Recommended: 1200x900 px (4:3) • Max: Any size • Auto-optimized to 1200x900 px</p>
              
              {/* Bulk Upload Option */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Upload Multiple Images</p>
                    <p className="text-xs text-blue-700">Select multiple files • All images auto-optimized</p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="campus-bulk-upload"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleBulkCampusUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="campus-bulk-upload"
                      className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                        uploadingCampusBulk ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {uploadingCampusBulk ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" />
                          Upload Multiple
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Individual Image Rows */}
              {formData.campus_images.map((img, index) => {
                const imgData = typeof img === 'string' ? { url: img, title: '', alt: '' } : img;
                return (
                  <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-white">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={imgData.url}
                        onChange={(e) => updateCampusImage(index, 'url', e.target.value)}
                        placeholder="https://example.com/image.jpg or upload file"
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id={`campus-upload-${index}`}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleCampusImageUpload(file, index);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor={`campus-upload-${index}`}
                          className={`inline-flex items-center px-3 py-2 border rounded cursor-pointer ${
                            uploadingCampus[index] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {uploadingCampus[index] ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <FiUpload />
                          )}
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeCampusImage(index)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">Image Title</label>
                        <input
                          type="text"
                          value={imgData.title || ''}
                          onChange={(e) => updateCampusImage(index, 'title', e.target.value)}
                          placeholder="e.g., 'Library Building' (Alt auto-generated)"
                          className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm focus:border-blue-400"
                        />
                        <p className="text-xs text-blue-600 mt-1">⚡ Enter title to auto-generate alt text with Admissionbuddy branding</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">Alt Text (Auto-generated)</label>
                        <input
                          type="text"
                          value={imgData.alt || ''}
                          onChange={(e) => updateCampusImage(index, 'alt', e.target.value)}
                          placeholder="Auto-generated from title"
                          className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Preview Grid */}
              {formData.campus_images.length > 0 && formData.campus_images.some(img => typeof img === 'string' ? img : img.url) && (
                <div className="mt-3 p-3 bg-gray-50 border rounded">
                  <p className="text-xs text-gray-600 mb-2">Gallery Preview with Admissionbuddy Branding:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {formData.campus_images.filter(img => typeof img === 'string' ? img : img.url).map((img, index) => {
                      const imgData = typeof img === 'string' ? { url: img, title: '', alt: '' } : img;
                      return (
                        <div key={index} className="relative group bg-white border-2 border-gray-300 rounded overflow-hidden">
                          <img 
                            src={imgData.url} 
                            alt={imgData.alt || `Campus ${index + 1}`} 
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {imgData.title && (
                            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 font-semibold truncate">
                              {imgData.title}
                            </div>
                          )}
                          {imgData.alt && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                              {imgData.alt}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <Button type="button" onClick={addCampusImage} size="sm" className="mt-2">
                <FiPlus className="mr-2" /> Add Image Row
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🎥 Campus Video</label>
              <p className="text-xs text-gray-600 mb-2">📹 YouTube/Vimeo URL • Add title & description for accessibility</p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    name="campus_video_url"
                    value={formData.campus_video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="campus_video_title"
                    value={formData.campus_video_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., 'Campus Tour - IIT Mumbai'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and video player title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Video Description (Optional)</label>
                  <textarea
                    name="campus_video_description"
                    value={formData.campus_video_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of video content..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Institute Brochure */}
            <div>
              <label className="block text-sm font-medium mb-2">📄 Institute Brochure</label>
              <p className="text-xs text-gray-600 mb-2">📋 Accepted: PDF, DOC, DOCX • Max: 10MB • One brochure for entire institution</p>
              <div className="flex gap-2 items-start">
                <input
                  type="url"
                  name="brochure_url"
                  value={formData.brochure_url}
                  onChange={handleChange}
                  placeholder="https://example.com/brochure.pdf or upload file"
                  className="flex-1 border rounded px-3 py-2"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="brochure-upload"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleBrochureUpload(file);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="brochure-upload"
                    className={`inline-flex items-center px-4 py-2 border rounded cursor-pointer ${
                      uploadingBrochure ? 'bg-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {uploadingBrochure ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
              {formData.brochure_url && (
                <div className="mt-2">
                  <a href={formData.brochure_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                    📄 View Brochure: {formData.brochure_url}
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">🌐 Virtual Tour</label>
              <p className="text-xs text-gray-600 mb-2">📹 360° tour URL • Add title & description for accessibility</p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Virtual Tour URL</label>
                  <input
                    type="url"
                    name="virtual_tour_url"
                    value={formData.virtual_tour_url}
                    onChange={handleChange}
                    placeholder="https://example.com/virtual-tour"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Tour Title (For Accessibility)</label>
                  <input
                    type="text"
                    name="virtual_tour_title"
                    value={formData.virtual_tour_title || ''}
                    onChange={handleChange}
                    placeholder="e.g., '360° Campus Virtual Tour - Admissionbuddy'"
                    className="w-full border-2 border-blue-200 rounded px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-blue-600 mt-1">Used for screen readers and tour embed title</p>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Tour Description (Optional)</label>
                  <textarea
                    name="virtual_tour_description"
                    value={formData.virtual_tour_description || ''}
                    onChange={handleChange}
                    placeholder="Brief description of the virtual tour experience..."
                    rows="2"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/colleges')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : id ? 'Update College' : 'Create College'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
