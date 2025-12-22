/**
 * Comprehensive India Education Data Constants
 * Contains all courses, exams, cities, and states in India
 */

// All India Cities
export const INDIA_CITIES = [
  "Agra", "Ahmedabad", "Ajmer", "Aligarh", "Allahabad", "Amritsar", "Aurangabad",
  "Bangalore", "Bareilly", "Bhopal", "Bhubaneswar", "Bikaner", "Chandigarh", "Chennai",
  "Coimbatore", "Cuttack", "Dehradun", "Delhi", "Dhanbad", "Durgapur", "Faridabad",
  "Ghaziabad", "Gorakhpur", "Gurgaon", "Guwahati", "Gwalior", "Hubli", "Hyderabad",
  "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jodhpur",
  "Kanpur", "Kochi", "Kolkata", "Kota", "Lucknow", "Ludhiana", "Madurai", "Mangalore",
  "Meerut", "Mumbai", "Mysore", "Nagpur", "Nashik", "Navi Mumbai", "Noida", "Patna",
  "Pondicherry", "Pune", "Raipur", "Rajkot", "Ranchi", "Salem", "Siliguri", "Srinagar",
  "Surat", "Thane", "Thiruvananthapuram", "Tiruchirappalli", "Tiruppur", "Udaipur",
  "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam", "Warangal"
];

// All India States
export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

// All Courses in India - Comprehensive List
export const ALL_INDIA_COURSES = [
  // Engineering & Technology
  "B.Tech", "B.E.", "M.Tech", "M.E.", "B.Tech in Computer Science", "B.Tech in IT", 
  "B.Tech in Electronics", "B.Tech in Electrical", "B.Tech in Mechanical", "B.Tech in Civil",
  "B.Tech in Chemical", "B.Tech in Aerospace", "B.Tech in Biotechnology", "B.Tech in AI/ML",
  "B.Tech in Data Science", "B.Tech in Robotics", "Diploma in Engineering", "Polytechnic",
  
  // Medical & Healthcare
  "MBBS", "BDS", "BAMS", "BHMS", "B.Pharm", "D.Pharm", "M.Pharm", "Pharm.D",
  "B.Sc Nursing", "M.Sc Nursing", "GNM", "ANM", "BPT", "MPT", "BUMS", "BNYS",
  "B.Sc MLT", "B.Sc Radiology", "MD", "MS", "DM", "MCh",
  
  // Management & Business
  "MBA", "BBA", "BMS", "BBM", "PGDM", "Executive MBA", "MBA in Finance", "MBA in Marketing",
  "MBA in HR", "MBA in Operations", "MBA in IT", "MBA in Healthcare", "BCA", "MCA",
  "B.Com", "M.Com", "B.Com (Hons)", "CA", "CS", "CMA", "CFA",
  
  // Law
  "LLB", "BA LLB", "BBA LLB", "B.Com LLB", "B.Sc LLB", "LLM", "Integrated LLB",
  
  // Arts & Humanities
  "BA", "MA", "BA (Hons)", "BA English", "BA Hindi", "BA History", "BA Political Science",
  "BA Economics", "BA Psychology", "BA Sociology", "BA Philosophy", "BA Journalism",
  "BA Mass Communication", "BJMC", "MJMC",
  
  // Science
  "B.Sc", "M.Sc", "B.Sc (Hons)", "B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics",
  "B.Sc Biology", "B.Sc Biotechnology", "B.Sc Microbiology", "B.Sc Zoology", "B.Sc Botany",
  "B.Sc Computer Science", "B.Sc IT", "B.Sc Agriculture", "B.Sc Forestry", "B.Sc Statistics",
  
  // Design & Architecture
  "B.Arch", "M.Arch", "B.Des", "M.Des", "B.Des Fashion", "B.Des Interior", "B.Des Product",
  "B.Des Graphic", "B.Des Animation", "B.Plan", "M.Plan",
  
  // Hotel Management & Hospitality
  "BHM", "BHMCT", "Diploma in Hotel Management", "B.Sc Hospitality", "MBA in Hospitality",
  
  // Education & Teaching
  "B.Ed", "M.Ed", "D.El.Ed", "B.P.Ed", "M.P.Ed", "BA B.Ed", "B.Sc B.Ed",
  
  // Fine Arts & Performing Arts
  "BFA", "MFA", "B.Mus", "M.Mus", "BPA", "MPA", "B.Sc Film Making",
  
  // Agriculture & Veterinary
  "B.Sc Agriculture", "M.Sc Agriculture", "BVSc", "MVSc", "B.Sc Horticulture", "B.Sc Fisheries",
  
  // Aviation & Maritime
  "B.Sc Aviation", "Commercial Pilot License", "Diploma in Aviation", "Marine Engineering",
  "Nautical Science", "B.Sc Nautical Science",
  
  // Paramedical
  "DMLT", "BMLT", "B.Sc OT Technology", "B.Sc Dialysis Technology", "B.Sc Cardiac Care",
  
  // Vocational & Skill-based
  "ITI", "Diploma Courses", "Certificate Courses", "Vocational Training",
  
  // Other Professional Courses
  "B.Sc Defense Studies", "BA Defense Studies", "B.Sc Forensic Science", "B.Sc Criminology",
  "B.Sc Event Management", "B.Sc Sports Management", "B.Voc", "Integrated Courses",
  
  // After 10th Courses
  "10th Pass Courses", "Diploma after 10th", "ITI after 10th", "Polytechnic after 10th",
  
  // After 12th Courses
  "12th Pass Courses", "UG Courses", "Graduation Courses",
  
  // Short-term & Certificate
  "Short-term Courses", "Certificate Programs", "Online Courses", "Distance Learning"
];

// All Entrance Exams in India - Comprehensive List
export const ALL_INDIA_EXAMS = [
  // Engineering Entrance Exams
  "JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE", "MET (Manipal)", 
  "COMEDK UGET", "KCET", "MHT CET", "WBJEE", "AP EAMCET", "TS EAMCET",
  "UPSEE/AKTU", "BCECE", "OJEE", "KEAM", "GUJCET", "CUET", "KIITEE",
  "AMUEEE", "IPU CET", "CUSAT CAT", "PESSAT", "SET (Symbiosis)",
  
  // Medical Entrance Exams
  "NEET UG", "NEET PG", "AIIMS PG", "JIPMER", "PGIMER", "AIAPGET", "NEET MDS",
  "NEET SS", "INI CET", "FMGE", "DNB PDCET", "GPAT", "NIPER JEE",
  
  // Management Entrance Exams
  "CAT", "XAT", "MAT", "CMAT", "GMAT", "NMAT", "SNAP", "IIFT", "MICAT",
  "ATMA", "IBSAT", "TISS NET", "IRMA", "TISSMAT", "KMAT", "PGCET",
  "MAH CET MBA", "OJEE MBA", "TANCET", "AP ICET", "TS ICET",
  
  // Law Entrance Exams
  "CLAT", "AILET", "LSAT India", "MH CET Law", "KLEE", "AP LAWCET",
  "TS LAWCET", "DU LLB", "BHU LLB", "CUET PG Law", "SLAT",
  
  // Design & Architecture Exams
  "NATA", "JEE Main Paper 2 (B.Arch)", "CEED", "UCEED", "NID DAT",
  "NIFT Entrance", "AIEED", "SEED", "FDDI AIST", "Pearl Academy Entrance",
  
  // Science & Research Exams
  "GATE", "IIT JAM", "JEST", "CSIR NET", "UGC NET", "NBHM", "TIFR GS",
  "BARC OCES/DGFS", "IISER Aptitude Test", "NEST", "ISI Admission Test",
  
  // University/Central Exams
  "CUET UG", "CUET PG", "BHU UET", "AMU Entrance", "JMI Entrance",
  "DU JAT", "DUET", "CUCET", "AIMA UGAT", "Ashoka University Entrance",
  
  // Hotel Management Exams
  "NCHMCT JEE", "IIHM eCHAT", "AIMA UGAT", "PUTHAT", "WBJECA",
  
  // Agriculture Exams
  "ICAR AIEEA", "ICAR AICE JRF/SRF", "OUAT", "UPCATET", "MP PAT",
  "RAUBAT", "BCECE Agriculture",
  
  // Pharmacy Exams
  "GPAT", "NIPER JEE", "MHT CET Pharmacy", "TS EAMCET Pharmacy",
  "OJEE Pharmacy", "UPSEE Pharmacy",
  
  // Defence & Government Exams
  "NDA", "CDS", "AFCAT", "Indian Navy SSR/AA", "Indian Army TES",
  "UPSC CSE", "SSC CGL", "SSC CHSL", "IBPS PO", "IBPS Clerk", "SBI PO",
  "RBI Grade B", "SEBI Grade A", "NABARD Grade A",
  
  // Teaching Exams
  "CTET", "TET", "UGC NET Education", "KVS", "NVS", "DSSSB TGT/PGT",
  "SUPER TET", "REET", "UPTET", "MPTET", "HTET",
  
  // Journalism & Mass Communication
  "IIMC Entrance", "ACJ Entrance", "MASCOM", "XIC OET", "JMI Mass Com",
  
  // Arts & Humanities
  "DUET Arts", "BHU UET Arts", "JNU Entrance", "EFLU Entrance",
  
  // Aviation Exams
  "DGCA CPL", "IGRUA Entrance", "NIAE Entrance",
  
  // Nursing Exams
  "AIIMS Nursing", "BHU Nursing", "JIPMER Nursing", "PGIMER Nursing",
  
  // State Level Exams
  "TNEA", "COMEDK", "OJEE", "WBJEE", "UPCET", "BCECE", "JCECE",
  "Goa CET", "HP CET", "J&K CET", "GCET (Goa)", "PUCET",
  
  // International Exams (conducted in India)
  "SAT", "GRE", "TOEFL", "IELTS", "PTE", "ACT",
  
  // Other Important Exams
  "KVPY", "NTSE", "Olympiads", "Science Olympiad", "Math Olympiad",
  "PRMO", "RMO", "INMO", "INPhO", "INChO", "INBO", "INAO"
];

// Exam Categories for filtering
export const EXAM_CATEGORIES = {
  "Engineering": ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE", "MET (Manipal)", "COMEDK UGET", "KCET", "MHT CET", "WBJEE"],
  "Medical": ["NEET UG", "NEET PG", "AIIMS PG", "JIPMER", "PGIMER"],
  "Management": ["CAT", "XAT", "MAT", "CMAT", "GMAT", "NMAT", "SNAP", "IIFT"],
  "Law": ["CLAT", "AILET", "LSAT India", "MH CET Law"],
  "Design": ["NATA", "NID DAT", "NIFT Entrance", "CEED", "UCEED"],
  "Government": ["UPSC CSE", "SSC CGL", "IBPS PO", "SBI PO", "NDA", "CDS"],
  "University": ["CUET UG", "CUET PG", "BHU UET", "DU JAT", "AMU Entrance"]
};

export default {
  INDIA_CITIES,
  INDIA_STATES,
  ALL_INDIA_COURSES,
  ALL_INDIA_EXAMS,
  EXAM_CATEGORIES
};
