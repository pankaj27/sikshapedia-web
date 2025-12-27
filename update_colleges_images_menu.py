#!/usr/bin/env python3
"""
Update West Bengal Colleges with Logo, Banner, Gallery and Menu Config
"""

import requests
import json
import time

BASE_URL = "https://admissionbuddy.co/api"
EMAIL = "admin@admissionbuddy.co"
PASSWORD = "admin123"

# College data with images and menu config
COLLEGE_UPDATES = {
    "jadavpur-university-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Jadavpur_University_Logo.svg/200px-Jadavpur_University_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533293347phpA79lZk.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533293347phpA79lZk.jpeg", "alt": "Jadavpur University Main Building"},
            {"url": "https://images.shiksha.com/mediadata/images/1567068037phpvWLdnK.jpeg", "alt": "JU Campus View"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True,
            "show_reviews": True
        }
    },
    "iit-kharagpur-wb": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/200px-IIT_Kharagpur_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1534755511phpNLqT2d.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1534755511phpNLqT2d.jpeg", "alt": "IIT Kharagpur Campus"},
            {"url": "https://images.shiksha.com/mediadata/images/1534755668phpaCYsZp.jpeg", "alt": "IIT KGP Main Gate"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True,
            "show_reviews": True
        }
    },
    "nit-durgapur-wb": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/NIT_Durgapur_Logo.svg/200px-NIT_Durgapur_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533536461phpmFthbz.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533536461phpmFthbz.jpeg", "alt": "NIT Durgapur Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True,
            "show_reviews": True
        }
    },
    "iiest-shibpur-wb": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/IIEST_Shibpur_Logo.svg/200px-IIEST_Shibpur_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "IIEST Shibpur Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "medical-college-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Medical_College_and_Hospital%2C_Kolkata_Logo.png/200px-Medical_College_and_Hospital%2C_Kolkata_Logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510655857phpfhT7mI.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510655857phpfhT7mI.jpeg", "alt": "Medical College Kolkata"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": False,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "ipgmer-sskm-kolkata": {
        "logo_url": "https://www.ipgmer.gov.in/images/ipgmer_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg", "alt": "IPGMER SSKM Hospital"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "rg-kar-medical-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/RG_Kar_Medical_College_Logo.png/200px-RG_Kar_Medical_College_Logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg", "alt": "RG Kar Medical College"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "iim-calcutta": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/IIM_Calcutta_Logo.svg/200px-IIM_Calcutta_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1535022619phpQFjhIQ.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1535022619phpQFjhIQ.jpeg", "alt": "IIM Calcutta Campus"},
            {"url": "https://images.shiksha.com/mediadata/images/1535022847php5lKgkL.jpeg", "alt": "IIM Calcutta Building"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True,
            "show_reviews": True
        }
    },
    "nujs-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/West_Bengal_National_University_of_Juridical_Sciences_logo.png/200px-West_Bengal_National_University_of_Juridical_Sciences_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg", "alt": "NUJS Kolkata Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "presidency-university-wb": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Presidency_University%2C_Kolkata_logo.svg/200px-Presidency_University%2C_Kolkata_logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891589phpB8xvxI.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533891589phpB8xvxI.jpeg", "alt": "Presidency University Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "isi-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Indian_Statistical_Institute_Logo.svg/200px-Indian_Statistical_Institute_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510821652phpIz8kgf.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510821652phpIz8kgf.jpeg", "alt": "ISI Kolkata Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "nift-kolkata": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/National_Institute_of_Fashion_Technology_logo.png/200px-National_Institute_of_Fashion_Technology_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1571386949phpMbOqby.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1571386949phpMbOqby.jpeg", "alt": "NIFT Kolkata Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "st-xaviers-college-wb": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/St._Xavier%27s_College%2C_Kolkata_logo.png/200px-St._Xavier%27s_College%2C_Kolkata_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533280506phpJSHj5J.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533280506phpJSHj5J.jpeg", "alt": "St. Xavier's College Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Facilities", "anchor": "facilities", "icon": "building"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "hit-kolkata-wb": {
        "logo_url": "https://iem.edu.in/wp-content/uploads/2023/05/hit-logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Heritage IT Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "iem-kolkata-wb": {
        "logo_url": "https://iem.edu.in/wp-content/uploads/2023/05/iem-logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "IEM Kolkata Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "techno-main-salt-lake-wb": {
        "logo_url": "https://technoindiauniversity.ac.in/assets/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Techno Main Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "kgec-kalyani-wb": {
        "logo_url": "https://kgec.edu.in/wp-content/uploads/2021/03/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "KGEC Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "hit-haldia-wb": {
        "logo_url": "https://hithaldia.ac.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "HIT Haldia Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "calcutta-university-law-wb": {
        "logo_url": "https://www.caluniv.ac.in/images/cu-logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Calcutta University"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "govt-art-craft-kolkata": {
        "logo_url": "https://governmentcollegeofartandcraft.ac.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Govt Art College"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "rabindra-bharati-university-wb": {
        "logo_url": "https://www.rbu.ac.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "RBU Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_gallery": True,
            "show_faqs": True
        }
    },
    "scottish-church-college-wb": {
        "logo_url": "https://scottishchurch.ac.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Scottish Church College"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "bose-institute-kolkata-wb": {
        "logo_url": "https://www.jcbose.ac.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "Bose Institute"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_facilities": True,
            "show_faqs": True
        }
    },
    "aim-kolkata-wb": {
        "logo_url": "https://aimkolkata.edu.in/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "AIM Kolkata"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_faqs": True
        }
    },
    "calcutta-business-school-wb": {
        "logo_url": "https://calcuttabusinessschool.org/images/logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg", "alt": "CBS Campus"}
        ],
        "detail_page_toc": [
            {"title": "Overview", "anchor": "overview", "icon": "info"},
            {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
            {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
            {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
            {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
        ],
        "menu_config": {
            "show_overview": True,
            "show_courses": True,
            "show_admission": True,
            "show_placements": True,
            "show_faqs": True
        }
    }
}

# Default menu config for any college
DEFAULT_TOC = [
    {"title": "Overview", "anchor": "overview", "icon": "info"},
    {"title": "Courses & Fees", "anchor": "courses", "icon": "book"},
    {"title": "Admission", "anchor": "admission", "icon": "clipboard"},
    {"title": "Placements", "anchor": "placements", "icon": "briefcase"},
    {"title": "Facilities", "anchor": "facilities", "icon": "building"},
    {"title": "FAQs", "anchor": "faqs", "icon": "help-circle"}
]

DEFAULT_MENU_CONFIG = {
    "show_overview": True,
    "show_courses": True,
    "show_admission": True,
    "show_placements": True,
    "show_facilities": True,
    "show_gallery": True,
    "show_faqs": True,
    "show_reviews": True
}

DEFAULT_BANNER = "https://images.shiksha.com/mediadata/images/1510820908phpXPzZoP.jpeg"


def login():
    """Login and get access token"""
    print("🔑 Logging in...")
    response = requests.post(
        f"{BASE_URL}/auth/admin-login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    if response.status_code == 200:
        token = response.json().get("access_token")
        print("✅ Login successful!")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None


def get_all_colleges(token):
    """Get all colleges"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/colleges?limit=100", headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data.get('colleges', data) if isinstance(data, dict) else data
    return []


def update_college(token, college_id, update_data):
    """Update a college"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.put(
        f"{BASE_URL}/colleges/{college_id}",
        headers=headers,
        json=update_data
    )
    return response


def main():
    token = login()
    if not token:
        return
    
    colleges = get_all_colleges(token)
    print(f"\n📚 Found {len(colleges)} colleges to update\n")
    
    success = 0
    failed = 0
    
    for college in colleges:
        college_id = college.get('id')
        slug = college.get('slug', '')
        name = college.get('name', '')
        
        # Skip if not West Bengal
        if college.get('location', {}).get('state') != 'West Bengal':
            continue
        
        print(f"Updating: {name}...")
        
        # Get specific updates or use defaults
        updates = COLLEGE_UPDATES.get(slug, {})
        
        # Build update data
        update_data = {
            "logo_url": updates.get('logo_url') or college.get('logo_url'),
            "banner_url": updates.get('banner_url') or DEFAULT_BANNER,
            "campus_images": updates.get('campus_images') or [{"url": DEFAULT_BANNER, "alt": f"{name} Campus"}],
            "detail_page_toc": updates.get('detail_page_toc') or DEFAULT_TOC,
            "menu_config": updates.get('menu_config') or DEFAULT_MENU_CONFIG,
            "status": "published"
        }
        
        try:
            response = update_college(token, college_id, update_data)
            if response.status_code == 200:
                print(f"  ✅ Updated successfully")
                success += 1
            else:
                print(f"  ❌ Failed: {response.text[:100]}")
                failed += 1
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            failed += 1
        
        time.sleep(0.3)
    
    print("\n" + "="*50)
    print(f"✅ Successfully updated: {success}")
    print(f"❌ Failed: {failed}")
    print("="*50)


if __name__ == "__main__":
    main()
