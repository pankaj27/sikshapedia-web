<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * This class is here to demonstrate the use of 
 * Events library with Theme library.
 */
class Theme_class
{
	
	public function __construct()
	{
		/**
		 * With this event registered, theme can independently enqueue
		 * all needed StyleSheets without adding them in controllers.
		 */
		Events::register('enqueue_styles', array($this, 'styles'));

		/**
		 * With this event registered, theme can independently enqueue
		 * all needed JS files without adding them in controllers.
		 */
		Events::register('enqueue_scripts', array($this, 'scripts'));

		Events::register('enqueue_scripts', array($this, 'scripts'));

		/**
		 * With this event registered, theme can independently enqueue
		 * all needed meta tags without adding them in controllers.
		 */
		Events::register('enqueue_metadata', array($this, 'metadata'));

		// Manipulating <html> class.
		Events::register('html_class', array($this, 'html_class'));

		// Manipulating <body> class.
		Events::register('body_class', array($this, 'body_class'));

		Events::register('active_class', array($this, 'active_class'));
	}

	public function styles(){
		$style_arr=array(
			'assets/vendors/core/core',
			get_common_url('assets/plugins/fontawesome-free/css/all.min'),
			'assets/fonts/feather-font/css/iconfont',
			'assets/vendors/flag-icon-css/css/flag-icon.min',			
			'assets/vendors/sweetalert2/sweetalert2.min',
			'assets/vendors/select2/select2.min',
			'assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min',
			get_common_url('assets/plugins/chosen/chosen'),
			get_common_url('assets/plugins/lightboxed/lightboxed'),
			'assets/vendors/fileup-master/src/fileup.min',
			'assets/vendors/fileup-master/src/fileup.theme2.min',
			'assets/vendors/tagify/tagify',
			'assets/vendors/jodit/es2021/jodit.min'
		);

		if (is_controller('Departments') && is_method('indexCollegesFacultyDepartments'))
		{
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if (is_controller('Affiliations') && is_method('indexCollegeAffiliations'))
		{
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}


		if(is_controller('Users')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/sdataTables.bootstrap4'));
		}

		if(is_controller('Settings') || is_controller('Services')){
			array_push($style_arr,get_common_url('assets/plugins/summernote/dist/summernote-bs4'));
		}

		if(is_controller('Streams') && (is_method('index') || is_method('indexCourse') || is_method('indexCourseCategories') || is_method('indexCourseMenues') || is_method('indexDegrees') || is_method('indexExams'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}


		if(is_controller('Country') && (is_method('index') || is_method('indexStates') || is_method('indexCities'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}


		if(is_controller('Institutions') && is_method('indexUniversities')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if(is_controller('Institutions') && is_method('indexColleges')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min');
		}

		if(is_controller('Institutions') && is_method('indexCollegesData')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min');
		}

		if(is_controller('SEO') && (is_method('indexColleges') || is_method('indexExams') || is_method('indexCourses') || is_method('indexURLChecker'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min');
		}

		if(is_controller('Blogs')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min');
		}

		if(is_controller('Rankingagencies') && (is_method('index'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if(is_controller('Companies') && (is_method('index'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if(is_controller('Appearance') && is_method('indexBanners')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/js/jquery-sortable');
		}

		if(is_controller('SEO') && is_method('indexSearchesSeoImages')){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if(is_controller('Browser') && (is_method('index') || is_method('indexFileCompressWindow'))){
			array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),get_common_url('assets/plugins/jquery-ui/jquery-ui.min'),get_common_url('assets/plugins/plupload/js/jquery.ui.plupload/css/jquery.ui.plupload'),get_common_url('assets/plugins/fileup/jquery.fileuploader.min'),get_common_url('assets/plugins/fileup/css/jquery.fileuploader-theme-dragdrop'),get_common_url('assets/plugins/fileup/font/font-fileuploader'),get_common_url('assets/plugins/fileup/css/script'),get_common_url('assets/plugins/jfiller/css/jquery.filer'));
		}




		array_push($style_arr,'assets/css/demo_1/style');

		add_style($style_arr);
	}

	public function scripts(){
		$script_arr=array(
			'assets/vendors/feather-icons/feather.min',
			'assets/js/template',
			'assets/vendors/sweetalert2/sweetalert2.min',
			'assets/vendors/select2/select2.min',
			'assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min',
			'assets/js/jquery.sortable.min',
			'assets/js/jquery.ui.sortable-animation',
			'assets/vendors/sortablejs/Sortable.min',
			get_common_url('assets/plugins/chosen/chosen.jquery.min'),
			get_common_url('assets/plugins/lightboxed/lightboxed'),
			'assets/vendors/fileup-master/src/fileup.min',
			get_common_url('assets/plugins/notify/notify.min'),
			'assets/vendors/tagify/tagify',
			'assets/vendors/jquery/jquery.json-editor.min'
		);

		if(session_userdata('isAdminLoggedin')){
			array_push($script_arr,'assets/scripts/admin_common');
		}


		if(is_controller('SEO') && is_method('indexFileeditor')){
			array_push($script_arr,'assets/vendors/ace-builds/src/ace','assets/scripts/admin_seo_tools');
		}

		if(is_controller('Institutions') && (is_method('indexColleges') || is_method('indexCollegesAddEdit') || is_method('indexCollegesCourses') || is_method('indexCollegesHostels') || is_method('indexCollegesCoursesAddEdit') || is_method('indexCollegesAdmissions') || is_method('indexCollegesResults') || is_method('indexCollegesCutoffs') || is_method('indexCollegeFaculties') || is_method('indexCollegePlacement'))){
			array_push($script_arr, 'https://cdn.tiny.cloud/1/qhy6fy9tqerwjejspcgj6rtbor8imo2fz8byeed0r3avwry7/tinymce/7/tinymce.min.js','assets/vendors/jodit/es2021/jodit.min');
		}



		if (is_controller('Departments') && is_method('indexCollegesFacultyDepartments'))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_faculty_departments');
		}


		if (is_controller('Affiliations') && is_method('indexCollegeAffiliations'))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_affiliations');
		}



		if (is_controller('Accounts') && is_method('index'))
		{
			array_push($script_arr,'assets/scripts/admin_login');
		}

		if (is_controller('Accounts') && is_method('indexProfile'))
		{
			array_push($script_arr,'assets/scripts/admin_profile_edit');
		}

		if(is_controller('Settings')){
			array_push($script_arr,'assets/scripts/admin_settings');
		}

		if(is_controller('Coupon')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_coupons');
		}

		if (is_controller('Reviews') && (is_method('index') || is_method('indexDetails')))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_reviewd_colleges');
		}

		if (is_controller('Comments') && is_method('index'))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_comments');
		}

		if(is_controller('Streams') && (is_method('index') || is_method('indexSubStreams') || is_method('indexCourse') || is_method('indexCourseCategories') || is_method('indexCourseMenues') || is_method('indexDegrees') || is_method('indexExams') )){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_courses');
		}

		if(is_controller('Streams') && is_method('indexCourseMenuesDataEdit')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_course_details');
		}

		if(is_controller('Streams') && is_method('indexCourseDetails')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_course_details');
		}

		if(is_controller('Streams') && (is_method('indexDetailsUpload') || is_method('indexDetailsUploadData'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_stream_details');
		}

		if(is_controller('Streams') && (is_method('indexExamsDetails') || is_method('indexExamMenuesAddEditDetails'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_exam_details');
		}

		
		if(is_controller('Streams') && is_method('indexPreparationGuideDetailsData')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_exam_prep_details');
		}

		if(is_controller('Country') && (is_method('index') || is_method('indexStates') || is_method('indexCities') || is_method('indexDistricts'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_countries');
		}

		if(is_controller('Institutions') && (is_method('indexUniversities') || is_method('indexUniversitiesAddEdit'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_universities');
		}

		if(is_controller('Institutions') && (is_method('indexColleges') || is_method('indexCollegesAddEdit') || is_method('indexCollegesCoursesAddEdit') || is_method('indexCollegesCourses') || is_method('indexCollegesHostels') || is_method('indexCollegesAdmissions') || is_method('indexCollegesResults') || is_method('indexCollegesCutoffs') || is_method('indexCollegeFaculties') || is_method('indexCollegesGallery') || is_method('indexCollegePlacement'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_blogs');
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_gallery','assets/scripts/admin_colleges');
		}

		if(is_controller('Institutions') && is_method('indexCollegesData')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
		}

		if(is_controller('Institutions') && is_method('indexCollegesAdmissions')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_college_admissions');
		}

		if(is_controller('Institutions') && is_method('indexCollegesResults')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'));
			//,'assets/scripts/admin_college_results'
		}

		if(is_controller('SEO') && (is_method('indexColleges') || is_method('indexExams') || is_method('indexCourses') || is_method('indexSearches') || is_method('indexSitemaps'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo');
		}

		if(is_controller('SEO') && (is_method('indexURLChecker'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_url_checker');
		}


		if(is_controller('SEO') && (is_method('indexCoursesCategoryEdit') || is_method('indexCoursesCategoryCourseEdit'))){
			array_push($script_arr,'assets/scripts/admin_seo_course_streams');
		}

		if(is_controller('SEO') && is_method('indexSearchesColleges')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_inst');
		}

		if(is_controller('SEO') && is_method('indexSearchesSeoImages')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_images');
		}

		if(is_controller('SEO') && is_method('indexCourses')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_course');
		}

		if(is_controller('SEO') && is_method('indexSearchInstSearchSlugUrlsDetails')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_inst_search_detail');
		}

		if(is_controller('SEO') && is_method('indexCollegeStructredData')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_seo_inst_struct_data');
		}

		if(is_controller('Rankingagencies') && (is_method('index'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_ranking_agencies');
		}

		if(is_controller('Companies') && (is_method('index'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_companies');
		}

		if(is_controller('Appearance') && is_method('indexMenues')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_menues');
		}

		if(is_controller('Appearance') && is_method('indexBanners')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_banners');
		}

		if(is_controller('Browser') && (is_method('index') || is_method('indexFileCompressWindow'))){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),get_common_url('assets/plugins/jquery-ui/jquery-ui.min'),get_common_url('assets/plugins/plupload/js/plupload.full.min'),get_common_url('assets/plugins/plupload/js/jquery.ui.plupload/jquery.ui.plupload'),'assets/scripts/admin_browser');
		}


		if(is_controller('Ads') && !is_method('indexAdsFree')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/scripts/admin_ads');
		}

		if(is_controller('Ads') && is_method('indexAdsFree')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/scripts/admin_inner_link_ads');
		}

		if(is_controller('REPORTS')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/scripts/admin_reports');
		}


		if(is_controller('News')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/scripts/admin_news');
		}

		if(is_controller('Institutions') && is_method('indexCollegesScholarShipAddEdit')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_scholarship');
		}

		if(is_controller('Applicants')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/inputmask/jquery.inputmask.min','assets/scripts/admin_applicatnts');
		}


		if(is_controller('Blogs')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/vendors/jodit/es2021/jodit.min','assets/scripts/admin_blogs');
		}

		//,'assets/scripts/admin_blogs'


		if(is_controller('Widgets')){
			array_push($script_arr,'assets/scripts/admin_widgets');
		}

		
		if (is_controller('Reviews') && (is_method('indexCollegeReviewsAdd')))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_review_anonymus');
		}

		if (is_controller('Institutions') && (is_method('indexCollegeReviews')))
		{
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/scripts/admin_review_anonymus');
		}

		if(session_userdata('isAdminLoggedin') && is_controller('Users')){
			array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'), 'assets/scripts/admin_system_users');
		}

		if(is_controller('SEO') && (is_method('indexExamsStreamsEdit') || is_method('indexExamsStreams'))){
			array_push($script_arr, 'assets/scripts/admin_seo_exams_streams');
		}




		add_script($script_arr);
	}

	public function body_class($class)
	{
		if (is_controller('Accounts') && is_method('index'))
		{
			return 'page-wrapper full-page';
		}
		else
		{
			return 'page-wrapper';
		}
	}
}

// Always instantiate the class so trigger get registered.
$theme_class = new Theme_class;