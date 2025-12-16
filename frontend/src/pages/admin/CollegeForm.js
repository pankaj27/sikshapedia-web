import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiEdit, FiUpload, FiLoader,
  FiBook, FiMonitor, FiActivity, FiSearch, FiUsers, FiCast, FiVideo, FiDatabase,
  FiMic, FiZap, FiTarget, FiDroplet, FiGrid, FiSquare, FiSun, FiHome, FiMapPin,
  FiHeart, FiMessageCircle, FiTruck, FiCoffee, FiShoppingBag, FiShoppingCart,
  FiCreditCard, FiMail, FiWifi, FiBattery, FiShield, FiBriefcase, FiTrendingUp,
  FiAward, FiMusic, FiBookOpen, FiPrinter, FiFilm, FiPackage, FiFeather, FiUnlock
} from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { generateSlug } from '../../utils/slugify';

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
    description: '',
    highlights: [],
    admission_process: '',
    admission_dates: [],
    seo_intro: '',
    seo_full_content: '',
    seo_video_url: '',
    seo_faqs: [],
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

      setUploading(false);
    }
  };


  const updateUpdateSimple = (index, field, value) => {
    const newUpdates = [...formData.updates];
    newUpdates[index][field] = value;
    setFormData({ ...formData, updates: newUpdates });
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
                💡 This determines what type of institution you're adding to the database
              </p>
            </div>
          </div>
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

        {/* SEO Content Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">SEO Content (Detail Page Content)</h2>
          <p className="text-sm text-gray-600 mb-4">
            This content appears in the expandable "Read More" section on the college detail page for better SEO.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Intro (Short Preview)</label>
              <p className="text-xs text-gray-500 mb-2">
                This is the short introduction (3-4 lines) that appears before the "Read More" button
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
            
            <div>
              <label className="block text-sm font-medium mb-1">SEO Full Content</label>
              <p className="text-xs text-gray-500 mb-2">
                Detailed content that appears after clicking "Read More" (multiple paragraphs with HTML formatting)
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

            <div>
              <label className="block text-sm font-medium mb-1">SEO Video URL</label>
              <p className="text-xs text-gray-500 mb-2">
                YouTube or video embed URL for the college overview video
              </p>
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
        </div>

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Courses & Fees</h2>
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
        </div>

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Placement Details</h2>
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
        </div>

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Updates & News</h2>
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
        </div>

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Media & Resources</h2>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Logo</label>
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
                  <img 
                    src={formData.logo_url} 
                    alt={formData.logo_alt || "Logo Preview"} 
                    className="h-20 object-contain border border-gray-300 p-2 bg-white"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div style={{display: 'none'}} className="text-xs text-red-600 p-2">
                    Failed to load image. Please check the URL.
                  </div>
                </div>
              )}
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Institution Banner</label>
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
                  <img 
                    src={formData.banner_url} 
                    alt={formData.banner_alt || "Banner Preview"} 
                    className="w-full max-h-40 object-cover rounded border border-gray-300 bg-white"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div style={{display: 'none'}} className="text-xs text-red-600 p-2">
                    Failed to load image. Please check the URL.
                  </div>
                </div>
              )}
            </div>
            {/* Campus Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Campus Gallery Images</label>
              
              {/* Bulk Upload Option */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Upload Multiple Images</p>
                    <p className="text-xs text-blue-700">Select multiple files to upload at once</p>
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
              <label className="block text-sm font-medium mb-1">Campus Video URL</label>
              <input
                type="url"
                name="campus_video_url"
                value={formData.campus_video_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brochure URL</label>
              <input
                type="url"
                name="brochure_url"
                value={formData.brochure_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Virtual Tour URL</label>
              <input
                type="url"
                name="virtual_tour_url"
                value={formData.virtual_tour_url}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

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
