<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once( BASEPATH .'database/DB.php');
$db =& DB();
$db->select('system_settings.*')->from('system_settings')->where('settings_key', 'config_admin_base_route');
$query=$db->get();
$d=$query->first_row();
$base_url=$d->settings_value;

//echo '<pre>';print_r($base_url);die;


$route['default_controller'] = 'Home';
$route['404_override'] = 'Notfound';
$route['translate_uri_dashes'] = FALSE;

// $route['account']						=	'Home/index';
// $route['account/applied-colleges']		=	'Home/index';
// $route['account/my-reviews']				=	'Home/index';
// $route['account/(:any)']					=	'Home/index';

$route['account']							=	'front/User/indexStudentPage';
$route['account/applied-colleges']			=	'front/User/indexStudentPage';
$route['account/my-reviews']				=	'front/User/indexStudentPage';
$route['account/(:any)']					=	'front/User/indexBrandingPage';


//API Routes
$route['api/menues']		=	'api/v1/Menu/onGetMenues';
$route['api/search']		=	'api/v1/Filter/onGetSearchedData';



//Admmin Rouotes

$route[$base_url]							=	'admin/Accounts/index';
$route[$base_url.'/adminlogin']				=	'admin/Accounts/onAdminLogin';
$route[$base_url.'/logout']					=	'admin/Accounts/onAdminLogout';


$route[$base_url.'/settings/drive']							=	'admin/Drive/index';


$route[$base_url.'/drivebrowsefile']		=	'admin/Drive/onSearchDriveFiles';

$route[$base_url.'/drivebrowsefiles']		=	'admin/Drive/onSearchLoadDriveFiles';

$route[$base_url.'/dashboard']				=	'admin/Dashboard/index';
$route[$base_url.'/profile']				=	'admin/Accounts/indexProfile';

$route[$base_url.'/profile_update']			=	'admin/Accounts/onUpdateAccountData';

$route[$base_url.'/streams/get_streams']		=	'admin/Common/onGetStreams';
$route[$base_url.'/streams/get_inst_streams']		=	'admin/Common/onGetInstituteStreams';
$route[$base_url.'/streams/get_inst_courses']		=	'admin/Common/onGetInstituteStreamCourses';

$route[$base_url.'/users']			        =	'admin/Users/index';
$route[$base_url.'/users/add']		        =	'admin/Users/indexAdd';
$route[$base_url.'/users/add/(:any)']		=	'admin/Users/indexEdit/$1';
$route[$base_url.'/users/add_users']		=	'admin/Users/onAddUsers';
$route[$base_url.'/users/delete_users']		=	'admin/Users/onDeleteUser';
$route[$base_url.'/users/search_external']	=	'admin/Users/onSearchExternalUsersList';

$route[$base_url.'/users/students']	        =	'admin/Users/indexStudents';
$route[$base_url.'/users/students/search']	=	'admin/Users/onSearchStudentsList';


$route[$base_url.'/users/students/courses']	=	'admin/Users/indexStudentsCourses';
$route[$base_url.'/users/students/courses/search']	=	'admin/Users/onSearchStudentsCoursesList';


$route[$base_url.'/users/internal']			        =	'admin/Users/indexSystemUsers';
$route[$base_url.'/users/internal/stat/(:any)']		=	'admin/Users/indexSystemUsers/$1';
$route[$base_url.'/users/search_internal_users_stat']		=	'admin/Users/onSearchStatData';
$route[$base_url.'/users/add_internal_users']		=	'admin/Users/onAddInternalUsers';
$route[$base_url.'/users/delete_internal_users']	=	'admin/Users/onDeleteInternalUser';
$route[$base_url.'/users/search_internal']	        =	'admin/Users/onSearchInternalUsersList';
$route[$base_url.'/users/colleges']			        =	'admin/Users/indexCollegeUsers';


$route[$base_url.'/users/change_single_data']			        =	'admin/Users/onChangeSingleData';



$route[$base_url.'/applicants']			        =	'admin/Applicants/index';
$route[$base_url.'/applicants/search']	        =	'admin/Applicants/onSearchApplicantsList';

$route[$base_url.'/institutions/universities']					=	'admin/Institutions/indexUniversities';


$route[$base_url.'/institutions/universities/courses/(:any)']				=	'admin/Institutions/indexCollegesCourses/$1';
$route[$base_url.'/institutions/universities/courses/add/(:any)']			=	'admin/Institutions/indexCollegesCoursesAddEdit/$1';
$route[$base_url.'/institutions/universities/courses/add/(:any)/(:any)']	=	'admin/Institutions/indexCollegesCoursesAddEdit/$1/$2';


$route[$base_url.'/institutions/universities/admission/(:any)']			=	'admin/Institutions/indexCollegesAdmissions/$1';
$route[$base_url.'/institutions/universities/hostel/(:any)']			=	'admin/Institutions/indexCollegesHostels/$1';

$route[$base_url.'/institutions/universities/results/(:any)']			=	'admin/Institutions/indexCollegesResults/$1';


$route[$base_url.'/institutions/universities/faculty/(:any)']			=	'admin/Institutions/indexCollegeFaculties/$1';


$route[$base_url.'/institutions/universities/cutoff/(:any)']			=	'admin/Institutions/indexCollegesCutoffs/$1';



$route[$base_url.'/institutions/universities/scholarships/(:any)']			=	'admin/Institutions/indexCollegesScholarShipAddEdit/$1';


$route[$base_url.'/institutions/universities/placement/(:any)']			=	'admin/Institutions/indexCollegePlacement/$1';
$route[$base_url.'/institutions/universities/placement/(:any)/(:any)']	=	'admin/Institutions/indexCollegePlacement/$1/$2';
$route[$base_url.'/institutions/universities/placement_add']			=	'admin/Institutions/onAddPlacementData';
$route[$base_url.'/institutions/universities/placement_delete']			=	'admin/Institutions/onDeletePlacement';
$route[$base_url.'/institutions/universities/placement_search']			=	'admin/Institutions/onSearchCollegePlacement';



$route[$base_url.'/institutions/universities/gallery/(:any)']		=	'admin/Institutions/indexCollegesGallery/$1';
$route[$base_url.'/institutions/universities/gallery_add']			=	'admin/Institutions/onAddCollegeGalleryFiles';
$route[$base_url.'/institutions/universities/gallery_delete']		=	'admin/Institutions/onDeleteCollegeGalleryFiles';
$route[$base_url.'/institutions/universities/gallery_search']		=	'admin/Institutions/onSearchCollegeGalleryFiles';



$route[$base_url.'/institutions/universities/search']			=	'admin/Institutions/onSearchUniversities';
$route[$base_url.'/institutions/universities/save_university']	=	'admin/Institutions/onAddUniversity';
$route[$base_url.'/institutions/universities/save_university_quick']	=	'admin/Institutions/onQuickAddUniversity';
$route[$base_url.'/institutions/universities/delete_university']=	'admin/Institutions/onDeleteUniversity';
$route[$base_url.'/institutions/universities/add']				=	'admin/Institutions/indexUniversitiesAddEdit';
$route[$base_url.'/institutions/universities/add/(:any)']		=	'admin/Institutions/indexUniversitiesAddEdit/$1';

$route[$base_url.'/institutions/quick_data_load']	=	'admin/Institutions/onGetInstituteQuickData';


$route[$base_url.'/institutions/create_inner_menu']	=	'admin/Institutions/onCreateInstInnermenues';

$route[$base_url.'/institutions/colleges_list']=	'admin/Institutions/onGetColleges';

$route[$base_url.'/institutions/colleges']							=	'admin/Institutions/indexColleges';
$route[$base_url.'/institutions/collegesdata']						=	'admin/Institutions/indexCollegesData';

$route[$base_url.'/institutions/searches']							=	'admin/Institutions/indexCollegesSearchPageData';

$route[$base_url.'/institutions/colleges/add']						=	'admin/Institutions/indexCollegesAddEdit';
$route[$base_url.'/institutions/colleges/add/(:any)']				=	'admin/Institutions/indexCollegesAddEdit/$1';
$route[$base_url.'/institutions/colleges/add/(:any)/(:any)']		=	'admin/Institutions/indexCollegesAddEdit/$1/$2';
$route[$base_url.'/institutions/colleges/add/(:any)/(:any)/(:any)']	=	'admin/Institutions/indexCollegesAddEdit/$1/$2/$3';


$route[$base_url.'/institutions/colleges/reviews/(:any)']			=	'admin/Institutions/indexCollegeReviews/$1';
$route[$base_url.'/institutions/colleges/reviews/add/(:any)']		=	'admin/Reviews/indexCollegeReviewsAdd/$1';
$route[$base_url.'/institutions/colleges/reviews/add/(:any)/(:any)']		=	'admin/Reviews/indexCollegeReviewsAdd/$1/$2';

$route[$base_url.'/institutions/colleges/courses/(:any)']			=	'admin/Institutions/indexCollegesCourses/$1';
$route[$base_url.'/institutions/colleges/courses/add/(:any)']			=	'admin/Institutions/indexCollegesCoursesAddEdit/$1';
$route[$base_url.'/institutions/colleges/courses/add/(:any)/(:any)']	=	'admin/Institutions/indexCollegesCoursesAddEdit/$1/$2';

$route[$base_url.'/institutions/colleges/scholarships/(:any)']	=	'admin/Institutions/indexCollegesScholarShipAddEdit/$1/$2';
$route[$base_url.'/institutions/colleges/scholarships_add']		=	'admin/Institutions/onAddCollegeScholarshipData';



//$route[$base_url.'/institutions/departments']							=	'admin/Institutions/indexCollegesDepartments';

$route[$base_url.'/facultydepartments']							=	'admin/Departments/indexCollegesFacultyDepartments';
$route[$base_url.'/facultydepartments/search_faculty_departments']	=	'admin/Departments/onSearchCollegesFacultyDepartments';
$route[$base_url.'/facultydepartments/add_faculty_departments']	=	'admin/Departments/onAddEditCollegesFacultyDepartments';


$route[$base_url.'/affiliations']						=	'admin/Affiliations/indexCollegeAffiliations';
$route[$base_url.'/affiliations/search_affiliations']	=	'admin/Affiliations/onSearchCollegeAffiliations';
$route[$base_url.'/affiliations/add_affiliations']	=	'admin/Affiliations/onAddEditCollegesAffiliations';


$route[$base_url.'/get_slugs']			=	'admin/Institutions/onGetSlugs';



$route[$base_url.'/institutions/colleges/admission/(:any)']			=	'admin/Institutions/indexCollegesAdmissions/$1';

$route[$base_url.'/institutions/colleges/hostel/(:any)']			=	'admin/Institutions/indexCollegesHostels/$1';

$route[$base_url.'/institutions/colleges/results/(:any)']			=	'admin/Institutions/indexCollegesResults/$1';


$route[$base_url.'/institutions/colleges/cutoff/(:any)']			=	'admin/Institutions/indexCollegesCutoffs/$1';

$route[$base_url.'/institutions/colleges/search']					=	'admin/Institutions/onSearchColleges';
$route[$base_url.'/institutions/colleges/searchdata']				=	'admin/Institutions/onSearchCollegesData';

$route[$base_url.'/institutions/colleges/searchinnermenues']		=	'admin/Institutions/onSearchCollegesMenuWidgets';
$route[$base_url.'/institutions/colleges/quickupdateinnermenues']	=	'admin/Institutions/onUpdateMenudata';


$route[$base_url.'/institutions/colleges/save_college']				=	'admin/Institutions/onAddColleges';
$route[$base_url.'/institutions/colleges/check_college']			=	'admin/Institutions/onCheckDuplicatedata';
$route[$base_url.'/institutions/colleges/delete_college']			=	'admin/Institutions/onDeleteCollege';
$route[$base_url.'/institutions/colleges/delete_college_data']		=	'admin/Institutions/onDeleteCollegeData';

$route[$base_url.'/institutions/colleges/save_college_quick']		=	'admin/Institutions/onQuickUpdateCollege';
$route[$base_url.'/institutions/colleges/save_college_files']		=	'admin/Institutions/onUploadCollegeFiles';
$route[$base_url.'/institutions/colleges/delete_college_files']		=	'admin/Institutions/onDeleteCollegeFiles';
$route[$base_url.'/institutions/colleges/search_college_files']		=	'admin/Institutions/onSearchCollegeFiles';
$route[$base_url.'/institutions/colleges/search_college_broucher_files']		=	'admin/Institutions/onSearchCollegeBroucherFiles';
$route[$base_url.'/institutions/colleges/update_single']			=	'admin/Institutions/onChangeSingleCollegData';
//$route[$base_url.'/institutions/colleges/export_to_search']			=	'admin/Institutions/onExportCollegesToSearch';
$route[$base_url.'/institutions/colleges/send_to_search']			=	'admin/Institutions/onSendToSearch';
$route[$base_url.'/institutions/colleges/import_college']			=	'admin/Institutions/onImportColleges';
$route[$base_url.'/institutions/colleges/import_college_2']			=	'admin/Institutions/onImportCollegeExternal';
$route[$base_url.'/institutions/colleges/import_college_data_preview']			=	'admin/Institutions/onPreviewExcel';
$route[$base_url.'/institutions/colleges/get_courses']				=	'admin/Institutions/onGetCollegeAssignedCourses';
$route[$base_url.'/institutions/colleges/get_categories']			=	'admin/Institutions/onGetCollegeAssignedCategories';
$route[$base_url.'/institutions/colleges/assign_courses']			=	'admin/Institutions/onAssignCollegeCourses';
$route[$base_url.'/institutions/colleges/assign_categories']		=	'admin/Institutions/onAssignCollegeCategories';



$route[$base_url.'/institutions/add_college_exams_list']			=	'admin/Institutions/onAssignCollegeExamsList';


$route[$base_url.'/institutions/save_slug']							=	'admin/Institutions/onCreateSlugs';


$route[$base_url.'/institutions/load_inner_menu_form_data']			=	'admin/Institutions/onLoadInnerMenuFormData';

$route[$base_url.'/institutions/colleges/inner_menu_serach']		=	'admin/Institutions/onSearchCollegeInnerMenues';
$route[$base_url.'/institutions/colleges/inner_menu_add']			=	'admin/Institutions/onAddCollegeInnerMenues';
$route[$base_url.'/institutions/colleges/inner_menu_update']		=	'admin/Institutions/onUpdateInnerMenues';
$route[$base_url.'/institutions/colleges/inner_menu_delete']		=	'admin/Institutions/onDeleteCollegeInnerMenues';

$route[$base_url.'/institutions/colleges/gallery/(:any)']		=	'admin/Institutions/indexCollegesGallery/$1';

$route[$base_url.'/institutions/colleges/gallery_add']			=	'admin/Institutions/onAddCollegeGalleryFiles';
$route[$base_url.'/institutions/colleges/gallery_delete']		=	'admin/Institutions/onDeleteCollegeGalleryFiles';
$route[$base_url.'/institutions/colleges/gallery_search']		=	'admin/Institutions/onSearchCollegeGalleryFiles';

$route[$base_url.'/institutions/colleges/faculty/(:any)']		=	'admin/Institutions/indexCollegeFaculties/$1';
$route[$base_url.'/institutions/colleges/faculty/(:any)/(:any)']		=	'admin/Institutions/indexCollegeFaculties/$1/$2';
$route[$base_url.'/institutions/colleges/faculty_add']			=	'admin/Institutions/onAddCollegesFaculties';
$route[$base_url.'/institutions/colleges/faculty_delete']		=	'admin/Institutions/onDeletefaculties';
$route[$base_url.'/institutions/colleges/faculty_search']		=	'admin/Institutions/onSearchCollegeFaculties';


$route[$base_url.'/institutions/colleges/placement/(:any)']		=	'admin/Institutions/indexCollegePlacement/$1';
$route[$base_url.'/institutions/colleges/placement/(:any)/(:any)']		=	'admin/Institutions/indexCollegePlacement/$1/$2';
$route[$base_url.'/institutions/colleges/placement_add']			=	'admin/Institutions/onAddPlacementData';
$route[$base_url.'/institutions/colleges/placement_delete']		=	'admin/Institutions/onDeletePlacement';
$route[$base_url.'/institutions/colleges/placement_search']		=	'admin/Institutions/onSearchCollegePlacement';


$route[$base_url.'/institutions/colleges/hostel_add']			=	'admin/Institutions/onAddCollegeHostelData';


$route[$base_url.'/institutions/colleges/info_add']				=	'admin/Institutions/onAddCollegeInfoData';
$route[$base_url.'/institutions/colleges/other_info_add']				=	'admin/Institutions/onAddCollegeOtherInfoData';


$route[$base_url.'/institutions/colleges/placement_info_delete']	=	'admin/Institutions/onDeleteCollegeCompanyPlacement';

$route[$base_url.'/institutions/colleges/courses_search']		=	'admin/Institutions/onSearchCollegeCourses';
$route[$base_url.'/institutions/colleges/courses_add']			=	'admin/Institutions/onAddCollegeCourseData';
$route[$base_url.'/institutions/colleges/courses_delete']		=	'admin/Institutions/onDeleteCollegeCourseData';

$route[$base_url.'/institutions/colleges/update_course_data_single']			=	'admin/Institutions/onUpdateCollegeCourseSingleData';


$route[$base_url.'/institutions/colleges/cutoff_add']			=	'admin/Institutions/onAddCollegeCutoffData';


$route[$base_url.'/institutions/save_review']							=	'admin/Institutions/onAddInstReview';
$route[$base_url.'/institutions/load_review']							=	'admin/Institutions/onLoadReviewdata';


$route[$base_url.'/streams/degrees/search']			=	'admin/Streams/onSearchDegrees';
$route[$base_url.'/streams/degrees/search']			=	'admin/Streams/onSearchDegrees';
$route[$base_url.'/streams/degrees/add']			=	'admin/Streams/onAddDegree';
$route[$base_url.'/streams/degrees/delete']			=	'admin/Streams/onDeleteDegree';


$route[$base_url.'/streams/degrees/exams/search']	=	'admin/Streams/onDegreeSearchExams';
$route[$base_url.'/streams/degrees/exams/add']		=	'admin/Streams/onDegreeAddExam';
$route[$base_url.'/streams/degrees/exams/delete']	=	'admin/Streams/onDegreeDeleteExam';


$route[$base_url.'/streams/degrees/exams']			=	'admin/Streams/indexDegreeExams';
$route[$base_url.'/streams/degrees/exams/(:any)']	=	'admin/Streams/indexDegreeExams';


$route[$base_url.'/streams/degrees']				=	'admin/Streams/indexDegrees';
$route[$base_url.'/streams/degrees/(:any)']			=	'admin/Streams/indexDegrees';

$route[$base_url.'/streams/exams']					=	'admin/Streams/indexExams';
$route[$base_url.'/streams/exams/import']			=	'admin/Streams/onImportExamExcel';
$route[$base_url.'/streams/exams/search']			=	'admin/Streams/onSearchExams';
$route[$base_url.'/streams/exams/datesearch']		=	'admin/Streams/onSearchExamDates';
$route[$base_url.'/streams/exams/dateadd']			=	'admin/Streams/onAddExamDates';
$route[$base_url.'/streams/exams/datedelete']		=	'admin/Streams/onDeleteExamDates';
$route[$base_url.'/streams/exams/add']				=	'admin/Streams/onAddExam';
$route[$base_url.'/streams/exams/delete']			=	'admin/Streams/onDeleteExam';
$route[$base_url.'/streams/exams/update_slugs']		=	'admin/Streams/onUpdateExamSlugUrls';
$route[$base_url.'/streams/exams/update_single']	=	'admin/Streams/onChangeSingleExamData';
$route[$base_url.'/streams/exams/add_inner_menu']	=	'admin/Streams/onAddExamInnerMenues';
$route[$base_url.'/streams/exams/delete_inner_menu']	=	'admin/Streams/onDeleteExamInnerMenues';
$route[$base_url.'/streams/exams/add_exam_details']		=	'admin/Streams/onAddExamDetails';

$route[$base_url.'/streams/courses/add_inner_menu']	=	'admin/Streams/onAddCourseInnerMenues';

$route[$base_url.'/streams/exams/preparation_guide_search']				=	'admin/Streams/onSearchExamPreparationGuides';
$route[$base_url.'/streams/exams/preparation_guide_data_add']			=	'admin/Streams/onAddEditExamPrepGuide';
$route[$base_url.'/streams/exams/preparation_guide_data_details_add']	=	'admin/Streams/onAddExamPrepGuideData';

$route[$base_url.'/streams/exams/preparationguide/(:any)/(:any)']		=	'admin/Streams/indexPreparationGuideDetailsData/$1/$2';

$route[$base_url.'/streams/exams/(:any)']					=	'admin/Streams/indexExamsDetails/$1';
$route[$base_url.'/streams/exams/(:any)/(:any)/edit']		=	'admin/Streams/indexExamsDetails/$1/$2';
$route[$base_url.'/streams/exams/(:any)/(:any)']			=	'admin/Streams/indexExamMenuesAddEditDetails/$1/$2';


$route[$base_url.'/streams/courses']				=	'admin/Streams/indexCourse';
$route[$base_url.'/streams/courses/(:any)']			=	'admin/Streams/indexCourse/$1';

$route[$base_url.'/streams/course/search']			=	'admin/Streams/onSearchCourses';
$route[$base_url.'/streams/course/add']				=	'admin/Streams/onAddCourse';
$route[$base_url.'/streams/course/delete']			=	'admin/Streams/onDeleteCourse';
$route[$base_url.'/streams/course/add_details_data']				=	'admin/Streams/onAddCourseDetailsData';
$route[$base_url.'/streams/course/update_stream_single_field']		=	'admin/Streams/onUpdateStreamField';

$route[$base_url.'/streams/courses/menues/search']			=	'admin/Streams/onSearchCourseMenues';
$route[$base_url.'/streams/courses/menues/add']				=	'admin/Streams/onCreateCourseMenu';
$route[$base_url.'/streams/courses/menues/delete']				=	'admin/Streams/onDeleteCourseMenue';
$route[$base_url.'/streams/courses/menuesdata/(:any)']		=	'admin/Streams/indexCourseMenuesDataEdit/$1';
$route[$base_url.'/streams/courses/menues/(:any)']			=	'admin/Streams/indexCourseMenues/$1';
$route[$base_url.'/streams/courses/menues/(:any)/(:any)']	=	'admin/Streams/indexCourseMenues/$1/$2';


$route[$base_url.'/streams/courses/details']				=	'admin/Streams/indexCourseDetails';
$route[$base_url.'/streams/courses/details/(:any)']			=	'admin/Streams/indexCourseDetailsData/$1';
$route[$base_url.'/streams/courses_details_search']			=	'admin/Streams/onSearchCoursesDetails';

$route[$base_url.'/streams/courses/category']				=	'admin/Streams/indexCourseCategories';
$route[$base_url.'/streams/course/category/search']			=	'admin/Streams/onSearchCoursecategories';
$route[$base_url.'/streams/course/category/stream_search']	=	'admin/Streams/onGetCourseCategoryStreams';
$route[$base_url.'/streams/course/category/slug_create']	=	'admin/Streams/onUpdateStreamSlugs';

$route[$base_url.'/streams/upload_practice_papers']			=	'admin/Streams/onUploadPracticePapers';

$route[$base_url.'/streams/search_practice_papers']			=	'admin/Streams/onSearchPracticepapers';
$route[$base_url.'/streams/delete_practice_papers']			=	'admin/Streams/onDeletePracticePaper';


$route[$base_url.'/streams']			    		=	'admin/Streams/index';
// $route[$base_url.'/streams/add_inner_menu']			=	'admin/Streams/onAddStreamInnerMenues';
$route[$base_url.'/streams/add_inner_menu']			=	'admin/Streams/onAddEditStreamInnerMenues';
$route[$base_url.'/streams/delete_inner_menu']		=	'admin/Streams/onDeleteStreamInnerMenues';
$route[$base_url.'/streams/load_inner_menu']		=	'admin/Streams/onLoadStreamInnerMenuFormData';
$route[$base_url.'/streams/search']					=	'admin/Streams/onSearchStreams';
$route[$base_url.'/streams/search_sub_streams']		=	'admin/Streams/onSearchSubStream';
$route[$base_url.'/streams/add']					=	'admin/Streams/onAddStream';
$route[$base_url.'/streams/delete']					=	'admin/Streams/onDeleteStream';
$route[$base_url.'/streams/update_single_data']		=	'admin/Streams/onUpdateStreamField';

$route[$base_url.'/streams/add_stream_details']		=	'admin/Streams/onAddStreamDetails';
$route[$base_url.'/streams/(:any)']			    	=	'admin/Streams/indexDetailsUpload';
$route[$base_url.'/streams/(:any)/(:any)']			=	'admin/Streams/indexDetailsUploadData';

$route[$base_url.'/substreams/add']					=	'admin/Streams/onAddSubStream';

$route[$base_url.'/substreams/(:any)']				=	'admin/Streams/indexSubStreams/$1';
$route[$base_url.'/substreams/(:any)/search']=	'admin/Streams/onSearchSubStreams';






$route[$base_url.'/services']			    =	'admin/Services/index';
$route[$base_url.'/services/add']			=	'admin/Services/indexAdd';
$route[$base_url.'/services/add/(:any)']	=	'admin/Services/indexEdit';
$route[$base_url.'/services/search']		=	'admin/Services/onSearchServices';
$route[$base_url.'/services/add_services']	=	'admin/Services/onAddService';
$route[$base_url.'/services/delete']		=	'admin/Services/onDeleteService';

$route[$base_url.'/services/desc/add']		=	'admin/Services/onAddServiceDescriptions';
$route[$base_url.'/services/desc/search']	=	'admin/Services/onSearchServicesDescriptions';
$route[$base_url.'/services/desc/delete']	=	'admin/Services/onDeleteServiceDescriptions';
$route[$base_url.'/services/desc/(:any)']	=	'admin/Services/indexDesc';
$route[$base_url.'/services/desc/(:any)/(:any)']	=	'admin/Services/indexDescEdit';


$route[$base_url.'/services/portfolio/add']		=	'admin/Services/onAddPortfolio';
$route[$base_url.'/services/portfolio/search']	=	'admin/Services/onSearchPortfolio';
$route[$base_url.'/services/portfolio/delete']	=	'admin/Services/onDeletePortfolio';
$route[$base_url.'/services/portfolio/(:any)']	=	'admin/Services/indexPortFolios';


$route[$base_url.'/ads']						=	'admin/Ads/index';
$route[$base_url.'/ads/packages']				=	'admin/Ads/indexAdsPackages';
$route[$base_url.'/ads/packages/search']		=	'admin/Ads/onSearchAdsPackeages';

$route[$base_url.'/ads/add']					=	'admin/Ads/indexAdsAdd';
$route[$base_url.'/ads/add/(:any)']				=	'admin/Ads/indexAdsAdd/$1';
$route[$base_url.'/ads/add_ads']				=	'admin/Ads/onAddAds';
$route[$base_url.'/ads/add_image_ads']				=	'admin/Ads/onAddImageAds';
$route[$base_url.'/ads/delete']					=	'admin/Ads/onDeleteAds';
$route[$base_url.'/ads/search']					=	'admin/Ads/onSearchAds';
$route[$base_url.'/ads/search_import']			=	'admin/Ads/onSearchAdsToImport';
$route[$base_url.'/ads/search_insert']			=	'admin/Ads/onSearchAdsToInsert';

$route[$base_url.'/adsgroup/add']				=	'admin/Ads/indexAdsGroupAdd';


$route[$base_url.'/ads/freeimage']				=	'admin/Ads/indexAdsFree';
$route[$base_url.'/ads/freeinnerlinks']				=	'admin/Ads/indexAdsFree';
$route[$base_url.'/ads/freeimage/add']				=	'admin/Ads/indexAdsFreeAdd';
$route[$base_url.'/ads/premiumimage']				=	'admin/Ads/indexAdsPreminum';
$route[$base_url.'/ads/premiumhtml']				=	'admin/Ads/indexAdsPreminum';
$route[$base_url.'/ads/premiumhtml/add']			=	'admin/Ads/indexAdsPreminumAddEdit';
$route[$base_url.'/ads/premiumhtml/add/(:any)']		=	'admin/Ads/indexAdsPreminumAddEdit/$1';
$route[$base_url.'/ads/premiumimage/add']			=	'admin/Ads/indexAdsPreminumAdd';


$route[$base_url.'/ads/searchinnerlinkads']		=	'admin/Ads/onSearchInnerLinksAds';
$route[$base_url.'/ads/searchfreeimageads']			=	'admin/Ads/onSearchFreeImageAds';

$route[$base_url.'/get_context']				=	'admin/Institutions/onGetContexts';

$route[$base_url.'/settings']								=	'admin/Settings/index';
$route[$base_url.'/settings/social']						=	'admin/Settings/indexSocial';
$route[$base_url.'/settings/server']						=	'admin/Settings/indexServer';
$route[$base_url.'/settings/browser']						=	'admin/Browser/index';
$route[$base_url.'/settings/countries']						=	'admin/Country/index';
$route[$base_url.'/settings/countries/states/(:any)']		=	'admin/Country/indexStates';
$route[$base_url.'/settings/countries/cities/(:any)/(:any)']=	'admin/Country/indexCities';
$route[$base_url.'/settings/search_countries']				=	'admin/Country/onSearchCountriesList';
$route[$base_url.'/settings/search_countries_states']		=	'admin/Country/onSearchCountyStatesList';
$route[$base_url.'/settings/search_countries_cities']		=	'admin/Country/onSearchCountyCitiesList';
$route[$base_url.'/settings/save_countries_states']			=	'admin/Country/onAddCountryStates';
$route[$base_url.'/settings/save_countries_cities']			=	'admin/Country/onAddCountryCities';
$route[$base_url.'/settings/delete_countries_cities']			=	'admin/Country/onDeleteCountryCities';
$route[$base_url.'/settings/save_countries_states_single_data']		=	'admin/Country/onUpdateSingleCountryStateData';


$route[$base_url.'/settings/countries/districts/(:any)']=	'admin/Country/indexDistricts';
$route[$base_url.'/settings/countries/districts/(:any)/(:any)']=	'admin/Country/indexDistricts';
$route[$base_url.'/settings/search_countries_districts']		=	'admin/Country/onSearchCountyDistrictsList';
$route[$base_url.'/settings/save_countries_districts']			=	'admin/Country/onAddCountryDistricts';
$route[$base_url.'/settings/delete_countries_districts']			=	'admin/Country/onDeleteCountryDistricts';


$route[$base_url.'/settings/browser/create_folder']			=	'admin/Browser/onCreateFolder';
$route[$base_url.'/settings/browser/get_folders']			=	'admin/Browser/onLoadBrowserFolderData';
$route[$base_url.'/settings/browser/get_folders_inner']		=	'admin/Browser/onLoadBrowserFolderInnerData';
$route[$base_url.'/settings/browser/delete_folders']		=	'admin/Browser/onDeleteFolderFiles';
$route[$base_url.'/settings/browser/upload_file']			=	'admin/Browser/onCreateFiles';
$route[$base_url.'/settings/browser/_upload_other_file']		=	'admin/Browser/onCreateSelectedBrowseFiles';
$route[$base_url.'/settings/browser/_upload_browse_file']		=	'admin/Browser/onCreateSpecBrowseFiles';
$route[$base_url.'/settings/browser/_load_browse_file']		=	'admin/Browser/onLoadFiles';

$route[$base_url.'/settings/browser/_get_folders']			=	'admin/Browser/onBrowseFolder';
$route[$base_url.'/settings/browser/_get_files']			=	'admin/Browser/onBrowseFiles';
$route[$base_url.'/settings/browser/_create_folder']		=	'admin/Browser/onCreateSubFolder';
$route[$base_url.'/settings/browser/_upload_file']			=	'admin/Browser/onCreateBrowseFiles';

$route[$base_url.'/settings/browser/compress']				=	'admin/Browser/indexFileCompressWindow';
$route[$base_url.'/settings/browser/search_storage_data']	=	'admin/Browser/onSearchStoragedata';
$route[$base_url.'/settings/browser/convert_storage_data']	=	'admin/Browser/onConvertFile';

$route[$base_url.'/settings/save']							=	'admin/Settings/onSaveSystemSettings';


$route[$base_url.'/settings/menues']						=	'admin/Appearance/indexMenues';
$route[$base_url.'/settings/menues/$1']						=	'admin/Appearance/indexMenues/(:any)';
// $route[$base_url.'/settings/menues/search']				=	'admin/Appearance/onSearchMenues';
// $route[$base_url.'/settings/menues/load']				=	'admin/Appearance/onLoadMenu';





$route[$base_url.'/update_menu_serial']						=	'admin/Appearance/onUpdateMenuSerial';
$route[$base_url.'/update_menu_parent']						=	'admin/Appearance/onUpdateParentChildMenu';
$route[$base_url.'/update_menu_widget']						=	'admin/Appearance/onUpdateMenuWidgets';
$route[$base_url.'/load_menu_widget']						=	'admin/Appearance/onLoadMenuWidgets';
$route[$base_url.'/update_menu_widget_specific_data']						=	'admin/Appearance/onUpdateMenuWidgetsSpecificData';
$route[$base_url.'/delete_menu_widget']						=	'admin/Appearance/onDeleteMenuWidgets';


$route[$base_url.'/settings/banners']						=	'admin/Appearance/indexBanners';
$route[$base_url.'/settings/banners/search']				=	'admin/Appearance/onSearchBanners';
$route[$base_url.'/settings/banners/add']					=	'admin/Appearance/onAddBanners';
$route[$base_url.'/settings/banners/delete']				=	'admin/Appearance/onDeleteBanners';
$route[$base_url.'/settings/banners/compress']				=	'admin/Appearance/onCompressBanner';

$route[$base_url.'/seo/colleges']				=	'admin/SEO/indexColleges';
$route[$base_url.'/seo/colleges/search']		=	'admin/SEO/onSearchColleges';
$route[$base_url.'/seo/colleges/add_meta']		=	'admin/SEO/onUpdateMeta';

$route[$base_url.'/seo/colleges/metadata']		=	'admin/SEO/onLoadCollegeMetadata';
$route[$base_url.'/seo/colleges/generate_meta']	=	'admin/SEO/onGenerateCollegeMetaData';


$route[$base_url.'/seo/courses']				=	'admin/SEO/indexCourses';
$route[$base_url.'/seo/courses/search']			=	'admin/SEO/onSearchCourses';
$route[$base_url.'/seo/courses/search_coursemenu_data']			=	'admin/SEO/onSearchCoursesMenudata';
$route[$base_url.'/seo/courses/search_coursemenu_struct_data']			=	'admin/SEO/onSearchCourseInnerMenuStructuredData';
$route[$base_url.'/seo/courses/update_coursemenu_struct_data']			=	'admin/SEO/onUpdateCourseInnerMenuStructuredData';
$route[$base_url.'/seo/courses/generate_coursemenu_struct_data']			=	'admin/SEO/onGenerateCourseInnerMenuStructuredData';
$route[$base_url.'/seo/courses/add_meta']		=	'admin/SEO/onUpdateCourseMeta';
$route[$base_url.'/seo/courses/menues/add_meta']		=	'admin/SEO/onUpdateCourseMenuMeta';

$route[$base_url.'/seo/courses/catgeories']				=	'admin/SEO/indexCoursesCategory';
$route[$base_url.'/seo/courses/catgeories/(:any)']		=	'admin/SEO/indexCoursesCategoryEdit/$1';
$route[$base_url.'/seo/courses/catgeories/(:any)/(:any)']		=	'admin/SEO/indexCoursesCategoryCourseEdit/$1/$2';
$route[$base_url.'/seo/update_course_category_stream_page']		=	'admin/SEO/onUpdateSeoCoursesCategoryStream';


$route[$base_url.'/seo/exams/add_meta']				=	'admin/SEO/onUpdateExamMeta';
$route[$base_url.'/seo/generate_meta']				=	'admin/SEO/onGenerateUrls';
$route[$base_url.'/seo/generate_bulk_url']			=	'admin/SEO/onGenerateBulkURL';
$route[$base_url.'/seo/get_urls']					=	'admin/SEO/onGetUrls';
$route[$base_url.'/seo/search_urls']				=	'admin/SEO/onSearchSlugUrls';
$route[$base_url.'/seo/search_inst_urls']			=	'admin/SEO/onSearchInstSearchSlugUrls';
$route[$base_url.'/seo/get_page_meta']				=	'admin/SEO/onGetCollegeSearchMeta';
$route[$base_url.'/seo/generate_search_inst_urls']	=	'admin/SEO/onGenerateCollegeSearchSlugs';
$route[$base_url.'/seo/generate_type_urls']			=	'admin/SEO/onGenerateTypeUrls';
$route[$base_url.'/seo/update_search_urls_meta']	=	'admin/SEO/onUpdateCollegeSearchpageMeta';

$route[$base_url.'/seo/generate_other_type_urls']	=	'admin/SEO/onGenerateOtherTypeUrls';

$route[$base_url.'/seo/update_college_struct_data']	=	'admin/SEO/onGenerateCollegeMenuStructureData';

$route[$base_url.'/seo/exams']					=	'admin/SEO/indexExams';
$route[$base_url.'/seo/exams/search']			=	'admin/SEO/onSearchExams';
$route[$base_url.'/seo/exams/searchurls']		=	'admin/SEO/onSearchExamsURLS';
$route[$base_url.'/seo/exams/searchurlsmeta']	=	'admin/SEO/onSearchExamMetaData';


$route[$base_url.'/seo/exams/streams']			=	'admin/SEO/indexExamsStreams';
$route[$base_url.'/seo/exams/streams/(:any)']	=	'admin/SEO/indexExamsStreamsEdit/$1';
$route[$base_url.'/seo/exams/streamsmetaupdate']	=	'admin/SEO/onUpdateExamStaticPageMeta';

$route[$base_url.'/seo/searchesdata']			=	'admin/SEO/indexUpdateCollegeSearchdata';

$route[$base_url.'/seo/searches']				=	'admin/SEO/indexSearches';

$route[$base_url.'/seo/college_searchesdata_update']=	'admin/SEO/onCreateInstSearchData';

$route[$base_url.'/seo/searches/colleges']			=	'admin/SEO/indexSearchesColleges';
$route[$base_url.'/seo/searches/colleges/add/(:any)']=	'admin/SEO/indexSearchesCollegesListDetail/$1';
$route[$base_url.'/seo/searches/colleges/(:any)']	=	'admin/SEO/indexSearchInstSearchSlugUrlsDetails/$1';
$route[$base_url.'/seo/searches_colleges_details_add']			=	'admin/SEO/onAddSearchInstSearchSlugUrlsDetails';

$route[$base_url.'/seo/images']			=	'admin/SEO/indexSearchesSeoImages';

$route[$base_url.'/seo/sitemaps']				=	'admin/SEO/indexSitemaps';

$route[$base_url.'/seo/generate_sitemap']		=	'admin/SEO/onGenSiteMaps';
$route[$base_url.'/seo/generate_sitemap_index']		=	'admin/SEO/onGenSiteMapsIndex';


$route[$base_url.'/seo/college_structured_data']				=	'admin/SEO/indexCollegeStructredData';
$route[$base_url.'/seo/college_structured_data_search']			=	'admin/SEO/onSearchCollegeStructData';

$route[$base_url.'/seo_college_structured_data_generate']		=	'admin/SEO/onGenerateSturectureData';


$route[$base_url.'/seo/course_structured_data']					=	'admin/SEO/indexCourseStructredData';
$route[$base_url.'/seo/course_structured_data_search']			=	'admin/SEO/onSearchCoursesStructuredData';


$route[$base_url.'/seo/college_course_meta_load']				=	'admin/SEO/onGetCollgeCourseMeta';
$route[$base_url.'/seo/college_course_meta_update']				=	'admin/SEO/onUpdateCollegeCourseMeta';


$route[$base_url.'/seo/get_slug_urls']				=	'admin/SEO/change_course_url';
$route[$base_url.'/seo/get_exam_slug_urls']				=	'admin/SEO/onUpdateExamSlugs';


$route[$base_url.'/seo/pages']									=	'admin/SEO/indexPages';
$route[$base_url.'/seo/load_pages_meta']						=	'admin/SEO/ongetPageMeta';
$route[$base_url.'/seo/update_pages_meta']						=	'admin/SEO/onUpdatePageMeta';

$route[$base_url.'/reports/scholarshipReports']					=	'admin/REPORTS/scholarshipReports';
$route[$base_url.'/reports/scholarshipReports/search']			=	'admin/REPORTS/onSearchScholarshipReports';

$route[$base_url.'/docs']					=	'admin/Documents/index';
$route[$base_url.'/docs/search']			=	'admin/Documents/onSearchDocuments';
$route[$base_url.'/docs/save']				=	'admin/Documents/onSaveDocuments';

$route[$base_url.'/docs/delete']			=	'admin/Documents/onDeleteDocument';


$route[$base_url.'/country/get_states']		=	'admin/Common/onGetStates';
$route[$base_url.'/country/get_inst_states']	=	'admin/Common/onGetInstituteStates';
$route[$base_url.'/country/get_districts']	=	'admin/Common/onGetDistricts';	
$route[$base_url.'/country/get_cities']		=	'admin/Common/onGetCities';
$route[$base_url.'/country/get_inst_cities']		=	'admin/Common/onGetInstituteCities';
$route[$base_url.'/country/get_universities']		=	'admin/Common/onGetUniversities';
$route[$base_url.'/country/get_colleges']		=	'admin/Common/onGetColleges';
$route[$base_url.'/country/get_statuetorybodies']		=	'admin/Common/onGetStatuetoryBodies';

$route[$base_url.'/country/get_courses']		=	'admin/Common/onGetStreamCourses';

$route[$base_url.'/get_broucher_tyeps']		=	'admin/Common/onGetBroucherTypes';


$route[$base_url.'/settings/ranking-agencies']			=	'admin/Rankingagencies/index';
$route[$base_url.'/settings/ranking-agencies/search']	=	'admin/Rankingagencies/onSearchRankingAgency';
$route[$base_url.'/settings/ranking-agencies/add']	=	'admin/Rankingagencies/onAddRankingAgency';



$route[$base_url.'/settings/companies']			=	'admin/Companies/index';
$route[$base_url.'/settings/companies/search']	=	'admin/Companies/onSearchCompany';
$route[$base_url.'/settings/companies/add']		=	'admin/Companies/onAddCompany';
$route[$base_url.'/settings/companies/delete']		=	'admin/Companies/onDeleteCompany';

$route[$base_url.'/widgets']			    =	'admin/Widgets/index';
$route[$base_url.'/widgets/search']			=	'admin/Widgets/onSearchWidgets';


$route[$base_url.'/news']					=	'admin/News/index';
$route[$base_url.'/news/search']			=	'admin/News/onSearchNews';
$route[$base_url.'/news/add']				=	'admin/News/indexAdd';
$route[$base_url.'/news/add/(:any)']		=	'admin/News/indexEdit/$1';
$route[$base_url.'/news/add_news']			=	'admin/News/onAddNews';
$route[$base_url.'/news/delete_news']		=	'admin/News/onDeleteNews';
$route[$base_url.'/news/load_news']			=	'admin/News/onLoadNews';
$route[$base_url.'/news/tag_news']			=	'admin/News/onTagNews';


$route[$base_url.'/exam_news/(:any)']		=	'admin/News/indexExamNews/$1';
$route[$base_url.'/exam_news/(:any)/add']	=	'admin/News/indexExamNewsAddEdit/$1';
$route[$base_url.'/exam_news/(:any)/add/(:any)']	=	'admin/News/indexExamNewsAddEdit/$1/$2';

$route[$base_url.'/exams/get_exams']		=	'admin/Common/onGetExams';
$route[$base_url.'/exams/get_college_exams']		=	'admin/Common/onGetCollegeExams';

$route[$base_url.'/get_placement_companies']=	'admin/Common/onGetPlacementCompanies';


/**Link LIsts**/
$route[$base_url.'/link_list_exmas']		=	'admin/Common/onGetExamsLinkList';

$route[$base_url.'/link_list']		=	'admin/Common/onGetLinkList';


$route[$base_url.'/webmail']			=	'admin/Mail/index';
$route[$base_url.'/webmail_send']		=	'admin/Mail/onSendEmail';


$route[$base_url.'/reviews/colleges']	=	'admin/Reviews/index';
$route[$base_url.'/reviews/colleges/search']	=	'admin/Reviews/onSearchReviews';
$route[$base_url.'/reviews/colleges/update_status']	=	'admin/Reviews/onCheckReviews';

/**Anonymus Reviews**/
$route[$base_url.'/reviews_anonymus']	=	'admin/Reviews/onAddAnonymusInstReview';
$route[$base_url.'/reviews_anonymus_search']	=	'admin/Reviews/onSearchAnonymousReviews';
$route[$base_url.'/reviews_delete']	=	'admin/Reviews/onDeleteReviews';

$route[$base_url.'/reviews/colleges/(:any)']	=	'admin/Reviews/index/$1';
$route[$base_url.'/reviews/colleges/(:any)/(:any)']	=	'admin/Reviews/indexDetails/$1/$2';


$route[$base_url.'/comments/colleges']			=	'admin/Comments/index';
$route[$base_url.'/comments/colleges/search']	=	'admin/Comments/onSearchComments';
$route[$base_url.'/comments/colleges/(:any)']	=	'admin/Comments/index/$1';

$route[$base_url.'/stream/add_exam_to_search']	=	'admin/Streams/onIncludeExamsInSearch';


//Coupons
$route[$base_url.'/coupons']	=	'admin/Coupon/index';
$route[$base_url.'/coupons/search']	=	'admin/Coupon/onSearchCoupons';
$route[$base_url.'/coupons/import']	=	'admin/Coupon/onImportCoupons';


//Blogs
$route[$base_url.'/blogs']			=	'admin/Blogs/index';
$route[$base_url.'/blogs/add']		=	'admin/Blogs/indexAddEditBlog';
$route[$base_url.'/blogs/add/(:any)']		=	'admin/Blogs/indexAddEditBlog/$1';
$route[$base_url.'/blogs_add']		=	'admin/Blogs/onAddEditBlog';
$route[$base_url.'/blogs/add/(:any)']		=	'admin/Blogs/indexAddEditBlog/$1';
$route[$base_url.'/blogs_search']	=	'admin/Blogs/onSearchBlogsPosts';

$route[$base_url.'/blogs_delete']		=	'admin/Blogs/onDeleteBlogPost';



$route[$base_url.'/waytoblogs/add']		=	'admin/Blogs/indexAddEditBlogNew';

$route[$base_url.'/waytoblogs/add/(:any)']		=	'admin/Blogs/indexAddEditBlogNew/$1';
$route[$base_url.'/blogs_add_new']		=	'admin/Blogs/onAddEditBlogNew';


$route[$base_url.'/upload_driveuploadbrowsefile']	=	'admin/Drive/onUploadDriveFiles';


//Front

$route['checkval_available']			=	'front/User/onCheckDuplicatedata';


$route['signup/college']					=	'front/User/indexCollegeRegisterPage';
$route['signup/university']					=	'front/User/indexUniversityRegisterPage';
$route['signup/student']					=	'front/User/indexStudentRegisterPage';

$route['signup/college_signup']				=	'front/User/onRegisterCollege';
$route['signup/university_signup']			=	'front/User/onRegisterUniversity';
$route['signup/student_signup']				=	'front/User/onRegisterStudent';
$route['signin']							=	'front/User/indexSignin';
//$route['getcredentials']					=	'front/User/indexResetCredentials';

$route['accountreset']						=	'front/User/indexResetCredentials';

$route['getresetdata']						=	'front/User/onGetResetData';

$route['resetcredentials']					=	'front/User/onResetAccount';

// $route['resetcredentials']					=	'front/User/onResetCredentials';
$route['resend_otp']						=	'front/User/onSendOTPData';
$route['verify_otp']						=	'front/User/onVerifyUserAccount';

$route['signinwithotp']						=	'front/User/onSigninwithOTP';
$route['login']								=	'front/User/onLoginUser';
$route['logout']							=	'front/User/onLogoutUser';
$route['register']							=	'front/User/onRegisterUser';
$route['otpverify']							=	'front/User/onVerifyUser';
$route['send_otp']							=	'front/User/onSendOTP';
$route['updateaccount']						=	'front/User/onUpdateUserData';

$route['slogin']							=	'front/User/onGAuthURL';
$route['authsocial']						=	'front/User/onGAuthSocial';

$route['shortlist']							=	'front/User/onShortlistInstitutes';

$route['registerapplication']				=	'front/User/onRegisterApplicant';
$route['verify_application_otp']			=	'front/User/onVerifyApplicantAccount';
$route['registerjobapplication']			=	'front/User/onRegisterJobApplicant';
$route['registerquery']						=	'front/User/onRegisterUserQuery';

$route['registerapplicationquery']			=	'front/User/onAddApllicationQuestion';
$route['getappliedcolleges']				=	'front/User/onGetAppliedColleges';


$route['courses/enroll']					=	'front/Courses/indexCourseEnroll';
$route['courses/enroll_course']				=	'front/Courses/onEnrollCourse';
$route['courses/(:any)']					=	'front/Courses/index';




$route['services/(:any)']					=	'front/Services/index';








$route['claiminstitute']					=	'front/User/onClaimInstitutes';

// $route['account']							=	'front/User/index';
//$route['account']							=	'front/User/indexBrandingPage';

// $route['account/applied-colleges']			=	'front/User/indexAppliedColleges';
// $route['account/my-reviews']				=	'front/User/indexMyReviews';
//$route['account/info']						=	'front/User/indexAccountInfoSettings';


//$route['account/info']						=	'front/Universities/indexAccountInfoSettings';


$route['account/course']					=	'front/Universities/indexAccountCoursesFeesSettings';
$route['account/course/add']				=	'front/Universities/indexAccountCoursesFeesSettingsAdd';
$route['account/course/add/(:any)']			=	'front/Universities/indexAccountCoursesFeesSettingsAdd/$1';
$route['account/gallery']					=	'front/Universities/indexAccountGallerySettingsAdd';
$route['account/gallery/search']			=	'front/Universities/onSearchGallery';
$route['account/gallery/delete']			=	'front/Universities/onDeleteGalleryFile';

$route['account/colleges']					=	'front/Universities/indexAccountCollegeSettings';


$route['account/faculties']					=	'front/Universities/indexAccountFacultiesSettings';
$route['account/faculties/add']				=	'front/Universities/indexAccountFacultiesSettingsAdd';
$route['account/faculties/add/(:any)']		=	'front/Universities/indexAccountFacultiesSettingsAdd/$1';
$route['account/faculties/search']			=	'front/Universities/onSearchfaculties';
$route['account/faculties/delete']			=	'front/Universities/onDeletefaculties';


$route['account/hostels']					=	'front/Universities/indexAccountHostelSettings';

$route['account/scholarships']				=	'front/Universities/indexAccountScholarshipsSettings';

// $route['account']							=	'front/User/indexStudentPage';
// $route['account/applied-colleges']			=	'front/User/indexStudentPage';
// $route['account/my-reviews']				=	'front/User/indexStudentPage';
// $route['account/(:any)']					=	'front/User/indexBrandingPage';


$route['load_filter']						=	'front/Common/onGetFilterList';




//$route['account/(:any)']					=	'front/User/indexEdit/$1';
//$route['account/(:any)/(:any)']					=	'front/User/indexEdit/$1/$2';
$route['get_user_courses']					=	'front/Universities/onSearchUserCourses';

$route['updateuniversityaccount']			=	'front/Universities/onUpdateUserData';

$route['verify/(:any)']						=	'front/User/indexVerifyAccount/$1';


$route['get_account_pages']					=	'front/Common/onLoadAccountPages';
$route['get_countries']						=	'front/Common/onGetCountries';
$route['get_states/(:any)']					=	'front/Common/onGetStates/$1';
$route['get_districts']						=	'front/Common/onGetDistricts';	
$route['get_cities']						=	'front/Common/onGetCities';
$route['_get_cities']						=	'front/Common/_onGetCities';
$route['get_states_cities']					=	'front/Common/onGetCitiesStatewise';
$route['get_courses']						=	'front/Common/onGetCourses';
$route['get_college_courses']				=	'front/Common/onGetCollegeCourses';
$route['get_companies']						=	'front/Common/onGetCompanies';
$route['get_courses_list']					=	'front/Common/onGetCourseslist';


$route['update_single']						=	'front/User/onUpdateSingleData';



$route['reviews']							=	'front/Reviews/index';
$route['reviews/write']						=	'front/Reviews/indexWrite';
$route['reviews/write_review']				=	'front/Reviews/onAddEditReview';
$route['reviews/review_docs_up']			=	'front/Reviews/onUploadInstIdentityDocs';
$route['reviews/load_steps_review']			=	'front/Reviews/onLoadReviewStepdata';

$route['load_reviews']						=	'front/Reviews/onLoadReviews';

$route['reviews/load_colleges']				=	'front/Reviews/onLoadReviewColleges';

$route['reviews/advertisement']				=	'front/Reviews/advertisement';
$route['reviews/write/guidelines']			=	'front/Reviews/indexWriteGuidelines';
$route['reviews/write/(:any)']				=	'front/Reviews/indexAddReview/$1';
$route['reviews/write/(:any)/(:any)']		=	'front/Reviews/indexAddReview/$1/$2';
//$route['reviews/write/(:any)/(:any)']		=	'front/Reviews/indexWriteReview/$1/$2';



$route['admission']									=	'front/Admissions/index';
// $route['(:any)/news']								=	'front/News/index';

$route['news']								=	'front/News/index';

$route['news/(:any)']								=	'front/News/indexNewsPage';

$route['(:any)/consultancy']						=	'front/Consultancy/index';
$route['register_consultancy']						=	'front/Consultancy/onRegisterConsultacny';





$route['(:any)/scholarship']						=	'front/Scholarship/index';


// $route['(:any)/exams']							=	'front/Exams/index';
// $route['(:any)/exams/(:any)']					=	'front/Exams/indexStreamAndExamDetails/$1';
// $route['(:any)/exams/(:any)/(:any)']			=	'front/Exams/indexExamDetails/$1/$2';
// $route['(:any)/exams/(:any)/(:any)/(:any)']		=	'front/Exams/indexExamDetails/$1/$2/$3';

$route['exams']							=	'front/Exams/index';
//$route['exams/(:any)']					=	'front/Exams/indexStreamAndExamDetails/$1';

$route['exams/searchlist']					=	'front/Exams/onSearchExamsList';

$route['exams/(:any)']					=	'front/Exams/indexExamDetails/$1';
$route['exams/(:any)/(:any)']			=	'front/Exams/indexExamDetailsData/$1/$2';
$route['exams/(:any)/(:any)/(:any)']	=	'front/Exams/indexExamDetailsData/$1/$2/$3';

$route['clientclaim']					=	'front/Colleges/indexClientClaim';

// $route['universities']						=	'front/Universities/index';
// $route['colleges']							=	'front/Colleges/index';

$route['(:any)/universities']						=	'front/Universities/index';
$route['(:any)/universities/(:any)']				=	'front/Universities/index/$1';
$route['(:any)/universities/(:any)/(:any)']			=	'front/Universities/index/$1/$2';
// $route['(:any)/universities/(:any)']				=	'front/Universities/indexUniversityProfile/$1';
// $route['(:any)/universities/(:any)/(:any)']			=	'front/Universities/index/$1/$2';
// $route['(:any)/universities/(:any)/(:any)/(:any)']	=	'front/Universities/index/$1/$2/$3';
// $route['(:any)/colleges']							=	'front/Colleges/index';

// $route['(:any)/colleges']						=	'front/Universities/index';
// $route['(:any)/colleges/(:any)']				=	'front/Universities/index/$1';
// $route['(:any)/colleges/(:any)/(:any)']			=	'front/Universities/index/$1/$2';

/**Current Search Page**/
$route['colleges']								=	'front/Colleges/index';
$route['(:any)/colleges']						=	'front/Colleges/index';
$route['(:any)/colleges/(:any)']				=	'front/Colleges/index/$1';
$route['(:any)/colleges/(:any)/(:any)']			=	'front/Colleges/index/$1/$2';
$route['(:any)/colleges/(:any)/(:any)/(:any)']	=	'front/Colleges/index/$1/$2/$3';
$route['(:any)/colleges/(:any)/(:any)/(:any)/(:any)']	=	'front/Colleges/index/$1/$2/$3/$4';

/**Current Search Page**/



/**Wrong**/
$route['(:any)/collegesdemo']						=	'front/Colleges/indexCollegesSearchpage';
$route['(:any)/collegesdemo/(:any)']				=	'front/Colleges/indexCollegesSearchpage/$1';
$route['(:any)/collegesdemo/(:any)/(:any)']			=	'front/Colleges/indexCollegesSearchpage/$1/$2';
$route['(:any)/collegesdemo/(:any)/(:any)/(:any)']	=	'front/Colleges/indexCollegesSearchpage/$1/$2/$3';
$route['(:any)/collegesdemo/(:any)/(:any)/(:any)/(:any)']	=	'front/Colleges/indexCollegesSearchpage/$1/$2/$3/$4';
/**Wrong**/




$route['search_data']							=	'front/Universities/onSearchUniversities';
$route['search_collegedata']					=	'front/Colleges/onSearchColleges';


$route['searchdata']							=	'front/Datasearch/onSearch';
$route['filterdata']							=	'front/Datasearch/onFilter';
$route['searchinstdata']						=	'front/Datasearch/onSearchInstitutes';
$route['searchinstcoursedata']					=	'front/Datasearch/onSearchInstituteCourse';
$route['searchcoursedata']						=	'front/Datasearch/onSearchCourseList';


$route['subscribe']								=	'front/Services/onSubscribeNewsletter';

$route['comment']								=	'front/Common/onAddComments';

$route['ratesite']								=	'front/Common/onAddWaytoRating';

$route['recordvisits']							=	'front/Common/onAddVisistsData';

$route['review_colleges_list']					=	'front/Common/onSearchReviewColleges';

$route['about-us']								=	'front/Common/indexAboutus';
$route['contact-us']							=	'front/Common/indexContactus';
$route['advertise-with-us']						=	'front/Common/indexAdvertiseWithus';
$route['terms-conditions']						=	'front/Common/indexTermsConditions';


$route['coupons-and-deals']								=	'front/Coupon/index';


/**
$route['(:any)/courses']						=	'front/Courses/index';
$route['(:any)/courses/(:any)']					=	'front/Courses/indexCoursecategoryDetails';
$route['(:any)/courses/(:any)/(:any)']			=	'front/Courses/indexCourseStreamDetails';
$route['(:any)/courses/(:any)/(:any)/(:any)']	=	'front/Courses/indexCourseStreamDetails';

**/


$route['show_campaign/(:any)']						=	'front/Ads/indexShowCampaign/$1';


$route['courses']						=	'front/Courses/index';

$route['courses/(:any)']				=	'front/Courses/indexCourseDetailsData/$1';
$route['courses/(:any)/(:any)']			=	'front/Courses/indexCourseDetailsData/$2/$3';
$route['courses/(:any)/(:any)/(:any)']	=	'front/Courses/indexCourseDetailsData/$2/$3/$4';




// $route['courses/(:any)']				=	'front/Courses/indexCourseStreamDetails/$1';
// $route['courses/(:any)/(:any)']			=	'front/Courses/indexCourseStreamDetails/$2/$3';
// $route['courses/(:any)/(:any)/(:any)']	=	'front/Courses/indexCourseStreamDetails/$2/$3/$4';
//$route['courses/(:any)/(:any)/(:any)']	=	'front/Courses/indexCourseStreamDetails';




//BLOGS
$route['blog']									=	'front/Blog/index';
$route['blog/(:any)']									=	'front/Blog/indexBlogdetails/$1';
$route['blog-details']									=	'front/Blog/blogDetails';


/*****College/University Mini Web Page******/

$route['university/(:any)/(:any)']							=	'front/Colleges/indexPublicPages';
$route['university/(:any)/(:any)/(:any)']					=	'front/Colleges/indexPublicPages/$1/$2/$3';
$route['university/(:any)/(:any)/(:any)/(:any)']			=	'front/Colleges/indexPublicPages/$1/$2/$3/$4';
$route['university/(:any)/(:any)/(:any)/(:any)/(:any)']		=	'front/Colleges/indexPublicPages/$1/$2/$3/$4/$5';

/*******************************************/


//$route['(:any)/(:any)/news/(:any)']				=	'front/News/indexNewsPage/$1/$2/$3/$4';

// $route['(:any)/(:any)']							=	'front/Universities/indexPublicPages';
// $route['(:any)/(:any)/(:any)']					=	'front/Universities/indexPublicPages/$1/$2/$3';
// $route['(:any)/(:any)/(:any)/(:any)']			=	'front/Universities/indexPublicPages/$1/$2/$3/$4';
// $route['(:any)/(:any)/(:any)/(:any)/(:any)']	=	'front/Universities/indexPublicPages/$1/$2/$3/$4/$5';

// $route['account']							=	'front/User/indexStudentPage';
// $route['account/applied-colleges']			=	'front/User/indexStudentPage';
// $route['account/my-reviews']				=	'front/User/indexStudentPage';
// $route['account/(:any)']					=	'front/User/indexBrandingPage';


$route['(:any)/(:any)']							=	'front/Colleges/indexPublicPages';
$route['(:any)/(:any)/(:any)']					=	'front/Colleges/indexPublicPages/$1/$2/$3';
$route['(:any)/(:any)/(:any)/(:any)']			=	'front/Colleges/indexPublicPages/$1/$2/$3/$4';
$route['(:any)/(:any)/(:any)/(:any)/(:any)']	=	'front/Colleges/indexPublicPages/$1/$2/$3/$4/$5';





// $route['load_widgets']							=	'front/Institutemain/onLoadWidgets';


// $route['(:any)/(:any)']							=	'front/Institutemain/indexPublicPages';
// $route['(:any)/(:any)/(:any)']					=	'front/Institutemain/indexPublicPages/$1/$2';

	

$route['(:any)']								=	'Home';

$route['authsocial']							=	'front/User/onGAuthSocial';



// $route['(:any)/(:any)/(:any)']				=	'front/Universities/index/$1';








