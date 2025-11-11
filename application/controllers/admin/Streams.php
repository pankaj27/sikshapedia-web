<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH."third_party/PHPExcel.php";
require_once APPPATH."third_party/PHPExcel/IOFactory.php";

/**
 * 
 */
class Streams  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}


	function index(){
		if(session_userdata('isAdminLoggedin')){

			$userdata=$this->data['userdata'];
			if($userdata->user_role=='5' && $userdata->user_bank_account_added=='2'){
				redirect($this->data['admin_base_url'].'/profile');
			}else{
				$permissions=$this->data['permissions'];
				if(in_array('can_access_streams_data', $permissions)){

					$this->data['streams']=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);

					$this->data['page_title']='Streams';

					$this->theme->title($this->data['page_title'])->load('streams/vw_streams', $this->data);
				}else{
					redirect($this->data['admin_base_url'].'/dashboard');
				}					
			}				
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexDetailsUpload(){
		if(session_userdata('isAdminLoggedin')){

			$segment_3=$this->uri->segment(3,0);

			$stream_id=decode_data($segment_3);

			//echo $stream_id;die;

			$this->data['stream_id']=$stream_id;//$segment_3;

			$userdata=$this->data['userdata'];
			if($userdata->user_role=='5' && $userdata->user_bank_account_added=='2'){
				redirect($this->data['admin_base_url'].'/profile');
			}else{
				$permissions=$this->data['permissions'];
				if(in_array('can_access_streams_data', $permissions)){
					$this->data['page_title']='Streams';

					$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

					$_menues=array();
					$_cmenues=array();
					$menues=$this->sm->get_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id,'menu_parent_id'=>'0'),FALSE);

					if(!empty($menues)){
						foreach ($menues as $key => $value) {
							$_menues[]=array(
								'menu_id'=>$value->menu_id,
								'menu_name'=>$value->menu_name,
								'menu_url'=>$value->menu_link,
								'menu_add_details_link'=>$this->data['admin_base_url'].'/streams/'.encode_data($stream_id).'/'.encode_data($value->menu_id)
							);
						}
					}

					//print_obj($_menues);die;


					$stream_data=array(
						'stream_id'=>$stream_data->stream_id,
						'stream_name'=>$stream_data->stream_name,
						'stream_menus'=>$_menues
					);

					$this->data['stream_data']=$stream_data;

					$this->theme->title($this->data['page_title'])->add_partial('partial_stream_inner_menues_edit_modal')->load('streams/vw_streams_details', $this->data);
				}else{
					redirect($this->data['admin_base_url'].'/dashboard');
				}					
			}
				
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexDetailsUploadData(){
		if(session_userdata('isAdminLoggedin')){

			$segment_3=$this->uri->segment(3,0);
			$segment_4=$this->uri->segment(4,0);

			$stream_id=decode_data($segment_3);

			$menu_id=decode_data($segment_4);

			$_college_data_links=array();
			$_exam_links=array();
			$_exam_menues=array();

			$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

			$this->data['stream_id']=$segment_3;
			$this->data['stream_menu_id']=$segment_4;

			$this->data['page_title']='Streams';

			$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));



			$this->data['college_data_links']='';//(!empty($_college_data_links))?json_encode($_college_data_links):'';


			$this->data['exam_links']='';//(!empty($_exam_links))?json_encode($_exam_links):'';


			// $exam_menues=$this->sm->get_menues_specific('menu_link_type,menu_link_id,menu_name,menu_is_inner,menu_link',array('menu_link_type'=>'12','menu_is_inner'=>'1'),FALSE);

			// //print_obj($exam_menues);die;


			// if(!empty($exam_menues)){
			// 	foreach ($exam_menues as $key => $value) {

			// 		$exam_data=$this->strm->get_exam(array('exam_id'=>$value->menu_link_id));
			// 		$_exam_menues[]=array(
			// 			'title'=>$exam_data->exam_short_name.'['.$value->menu_name.']',
			// 			'value'=>$value->menu_link
			// 		);
			// 	}
			// }




			$this->data['exam_menu_links']='';//(!empty($_exam_menues))?json_encode($_exam_menues):'';

			//print_obj($this->data['exam_menu_links']);die;

			$this->data['stream_details']=$this->strm->get_stream_details_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_id),FALSE);

			$this->data['stream_faq_details']=$this->strm->get_stream_details_faq_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_id),FALSE);

			//print_obj($this->data['stream_details']);die;

			$menu_data=$this->sm->get_menues(array('menu_link_type'=>'13','menu_link_id'=>$stream_id,'menu_id'=>$menu_id));

			$this->data['stream_menu']=$menu_data;

			//print_obj($this->data['stream_menu']);die;

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'courses'));

			$this->data['stream_link']=base_url('courses/'.$stream_slug->slug_value);

			$this->data['stream_data']=$stream_data;

			$param['column_order'] = array(
				null,
				'listing_name'
			);

			$param['column_search'] = array('listing_name');
			$param['listing_category']='CUSTOM_HTML_ADS';
			$param['order'] = array('listing_id' => 'DESC');
			//$posts=$this->input->post();			

			//$data = array();
			//$no = isset($posts['start'])?$posts['start']:0;

			$ads=array();

			$this->data['ads'] = $this->um->_get_listing_ads_package_users(null,$param,'LEFT',FALSE,FALSE);

			if($menu_data->menu_slug=='all-courses'){

				$courses=$this->strm->get_course(array('course_stream'=>$stream_id),FALSE);

				$course_details=$this->strm->get_stream_details_courses_data(array('courses_data_type_stream_id'=>$stream_id,'courses_data_type_menu_id'=>$menu_id),FALSE,'courses_data_type_serial','ASC',FALSE);

				//print_obj($course_details);die;

				if(!empty($course_details)){
					$this->data['courses']=$course_details;
				}else{
					$this->data['courses']=$courses;
				}

				//print_obj($this->data['courses']);die;

				$view='streams/vw_streams_details_all_courses_add_edit';
			}else{
				$view='streams/vw_streams_details_add_edit';
			}

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_file_upload_big_modal')->add_partial('partial_ads_modal')->load($view, $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexDegrees(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Degrees';

			$_stream=$this->uri->segment(4);

			if(!empty($_stream)){

				$stream_id=decode_data($_stream);

				if(is_numeric($stream_id)){
					$this->data['stream_data']=$this->strm->get_stream(array('stream_id'=>$stream_id));
				}else{

				}
			}else{
				$this->data['system_streams']=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');
			}

			$this->theme->title($this->data['page_title'])->load('streams/vw_streams_degrees', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexExams(){
		if(session_userdata('isAdminLoggedin')){

			$userdata=$this->data['userdata'];
			if($userdata->user_role=='5' && $userdata->user_bank_account_added=='2'){
				redirect($this->data['admin_base_url'].'/profile');
			}else{
				$permissions=$this->data['permissions'];
				if(in_array('can_access_exams_data', $permissions)){
					$this->data['page_title']='Exams';

					$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

					if(!empty($streams)){
						foreach ($streams as $key => $value) {
							$_streams[]=array(
								'stream_id'=>encode_data($value->stream_id),
								'stream_name'=>$value->stream_name
							);
						}
					}else{
						$_streams=array();
					}


					$countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

					foreach ($countries as $key => $value) {
						$_countries[]=array(
							'country_id'=>encode_data($value->country_id),
							'country_name'=>$value->country_name
						);
					}


					$_exam_logo=$this->sm->get_user_files(array('user_storage_type'=>'exam_logo','user_file_type'=>'6'));

	    			if(!empty($_exam_logo)){

	    				foreach ($_exam_logo as $key => $value) {
	    					if(!empty($value->media_disk_path_relative)){
	    						$logos[]=$value->media_disk_path_relative;
	    					}	    					
	    				}
	                }else{
	                    $logos=array();
	                }

	                $total_logo_found=count($logos);
	                $total_exams=$this->strm->_get_total_exams();

	                $this->data['total_logos_missing']=$total_exams-$total_logo_found;

					$this->data['countrues']=$_countries;

					$this->data['streams']=$_streams;

					$this->theme->title($this->data['page_title'])->load('streams/vw_streams_exams', $this->data);
				}else{
					redirect($this->data['admin_base_url'].'/dashboard');
				}
					
			}

				
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexExamsDetails(){
		if(session_userdata('isAdminLoggedin')){

			$_exam_id=$this->uri->segment(4);

			$segment_5=$this->uri->segment(5,0);

			$segment_6=$this->uri->segment(6,0);

			$exam_id=decode_data($_exam_id);

			$exam=$this->strm->_get_exam(array('exam_id'=>$exam_id));

			$exam_menu=post_data('_exam_menu');

			//echo $segment_6;

			$_menues=array();
			$_cmenues=array();
			$inner_meues=array();
			$menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>'0'),FALSE,'menu_serial','ASC');

			$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam->exam_id));


			if($segment_6==='edit' && $segment_5!=''){
				$segment_menu_id=decode_data($segment_5);

				$this->data['menu_data']=$this->sm->get_menues(array('menu_id'=>$segment_menu_id));

				$this->data['slug_data']=$this->sm->get_slug_urls(array('url_type'=>'exam','url_glob_type'=>'exam_inner_menu','url_type_id'=>$exam->exam_id,'url_sub_type_id'=>$segment_menu_id));

				$this->data['exam_menu_id']=$segment_menu_id;

				//print_obj($this->data['slug_data']);die;

			}else{
				$this->data['exam_menu_id']='';
			}

			//print_obj($menues);die;

			if(!empty($menues)){
				foreach ($menues as $key => $value) {
					$cmenues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>$value->menu_id),FALSE,'menu_serial','ASC');

					if(!empty($cmenues)){
						foreach ($cmenues as $k => $v) {
							$_cmenues[$value->menu_id][]=array(
								'menu_id'=>$v->menu_id,
								'menu_serial'=>$v->menu_serial,
								'menu_name'=>$v->menu_name,
								'menu_show_in_exam_list'=>($v->menu_show_in_exam_list=='1')?'Yes':'No',
								'menu_is_active'=>$v->menu_is_active,
								'menu_add_details_link'=>$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam_id).'/'.encode_data($v->menu_id),
								'menu_edit'=>$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam_id).'/'.encode_data($v->menu_id).'/edit',
								'menu_link'=>$v->menu_link
							);
						}
					}

					$_menues[]=array(
						'menu_id'=>$value->menu_id,
						'menu_serial'=>$value->menu_serial,
						'menu_name'=>$value->menu_name,
						'menu_is_active'=>$value->menu_is_active,
						'menu_show_in_exam_list'=>($value->menu_show_in_exam_list=='1')?'Yes':'No',
						'menu_add_details_link'=>$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam_id).'/'.encode_data($value->menu_id),
						'menu_edit'=>$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam_id).'/'.encode_data($value->menu_id).'/edit',
						'menu_link'=>$value->menu_link,
						'child_menu'=>$_cmenues[$value->menu_id]
					);
				}
			}


			$exam_data=array(
				'exam_id'=>$exam->exam_id,
				'exam_name'=>$exam->exam_full_name.'-['.$exam->exam_short_name.']',
				'exam_short_name'=>$exam->exam_short_name,
				'exam_link'=>(!empty($exam_slug))?base_url('exams/'.$exam_slug->slug_value):'',
				'exam_inner_menus'=>$inner_meues,
				'exam_menus'=>$_menues
			);


			$param['user_file_type_id']=$exam->exam_id;
			$param['_user_storage_type']='practice_paper';
			$this->data['practice_papers'] = $this->sm->_get_guser_files(null,$param,FALSE,FALSE);

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'examdetails'));


			$this->data['exam_id']=encode_data($exam->exam_id);

			$this->data['exam_data']=$exam_data;

			//print_obj($this->data['exam_data']);

			$this->data['page_title']='Exam Details';



			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->load('streams/vw_streams_exams_details', $this->data);
				
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	

	function indexExamMenuesAddEditDetails(){
		if(session_userdata('isAdminLoggedin')){
			$_exam_id=$this->uri->segment(4);
			$_menu_id=$this->uri->segment(5);

			$exam_id=decode_data($_exam_id);
			$menu_id=decode_data($_menu_id);

			$_question_paper_links=array();
			$_answer_paper_links=array();
			$_speaking_papers_links=array();
			$_writing_papers_links=array();
			$_listening_papers_links=array();
			$_sample_papers_links=array();
			$_cutoff_files_links=array();

			$exam=$this->strm->_get_exam(array('exam_id'=>$exam_id));

			$this->data['exam_details']=$this->strm->get_exam_details_data(array('exam_id'=>$exam_id,'exam_menu_id'=>$menu_id,'exam_data_type!='=>'faq'),FALSE);

			$this->data['exam_faq_menu_details']=$this->strm->get_exam_details_data(array('exam_id'=>$exam_id,'exam_menu_id'=>$menu_id,'exam_data_type'=>'faq'),FALSE);

			$this->data['menu_data']=$this->sm->get_menues(array('menu_id'=>$menu_id));


			//print_obj($this->data['exam_details']);die;

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'examdetails'));


			$this->data['exam_id']=$_exam_id;
			$this->data['menu_id']=$_menu_id;

			$this->data['exam_data']=$exam_data;

			//print_obj($this->data['exam_data']);

			$this->data['page_title']='Exam Details';

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'examdetails'));

			$_menues=array();
			$_cmenues=array();
			$menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id),FALSE);

			$news=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$exam_id,'url_type'=>'news_article'),FALSE);

			$question_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'9','user_file_type_id'=>$exam_id),FALSE);

			$answer_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'10','user_file_type_id'=>$exam_id),FALSE);

			$speaking_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'11','user_file_type_id'=>$exam_id),FALSE);

			$writing_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'12','user_file_type_id'=>$exam_id),FALSE);

			$listening_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'13','user_file_type_id'=>$exam_id),FALSE);

			$sample_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'14','user_file_type_id'=>$exam_id),FALSE);

			$syllabus_files=$this->sm->get_user_files(array('user_storage_type'=>'syllabus_files','user_file_type'=>'15','user_file_type_id'=>$exam_id),FALSE);


			$cutoff_files=$this->sm->get_user_files(array('user_storage_type'=>'cutoff_files','user_file_type'=>'16','user_file_type_id'=>$exam_id),FALSE);


			if(!empty($syllabus_files)){
				foreach ($syllabus_files as $key => $value) {
					$_syllabus_files_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>$value->media_disk_path_relative
					);
				}
			}


			if(!empty($cutoff_files)){
				foreach ($cutoff_files as $key => $value) {
					$_cutoff_files_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>$value->media_disk_path_relative
					);
				}
			}

			//print_obj($_syllabus_files_links);die;


			if(!empty($question_papers)){
				foreach ($question_papers as $key => $value) {
					$_question_paper_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}

			if(!empty($answer_papers)){
				foreach ($answer_papers as $key => $value) {
					$_answer_paper_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}


			if(!empty($speaking_papers)){
				foreach ($speaking_papers as $key => $value) {
					$_speaking_papers_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}

			if(!empty($writing_papers)){
				foreach ($writing_papers as $key => $value) {
					$_writing_papers_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}

			if(!empty($listening_papers)){
				foreach ($listening_papers as $key => $value) {
					$_listening_papers_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}

			if(!empty($sample_papers)){
				foreach ($sample_papers as $key => $value) {
					$_sample_papers_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
					);
				}
			}

			//print_obj($_question_paper_links);die;

			if(!empty($menues)){
				foreach ($menues as $key => $value) {
					$_menues[]=array(
						'title'=>$value->menu_name,
						'value'=>$value->menu_link
					);
				}
			}


			if(!empty($news)){
				foreach ($news as $key => $value) {
					$_news[]=array(
						'title'=>$value->url_meta_title,
						'value'=>$value->url_value
					);
				}
			}



			$this->data['exam_page_menues']=(!empty($_menues))?json_encode($_menues):'';
			$this->data['exam_page_news']=(!empty($_news))?json_encode($_news):'';
			$this->data['exam_page_question_paper']=(!empty($_question_paper_links))?json_encode($_question_paper_links):'';
			$this->data['exam_page_answer_paper']=(!empty($_answer_paper_links))?json_encode($_answer_paper_links):"";

			$this->data['exam_page_speaking_test_paper']=(!empty($_speaking_papers_links))?json_encode($_speaking_papers_links):"";

			$this->data['exam_page_writing_practice_paper']=(!empty($_writing_papers_links))?json_encode($_writing_papers_links):"";

			$this->data['exam_page_listening_practice_paper']=(!empty($_listening_papers_links))?json_encode($_listening_papers_links):"";

			$this->data['exam_page_sample_practice_paper']=(!empty($_sample_papers_links))?json_encode($_sample_papers_links):"";

			$this->data['exam_page_syllabus_pdfs']=(!empty($_syllabus_files_links))?json_encode($_syllabus_files_links):"";

			$this->data['exam_page_cutoff_pdfs']=(!empty($_cutoff_files_links))?json_encode($_cutoff_files_links):"";

			//print_obj($this->data['exam_page_syllabus_pdfs']);die;

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_ads_modal')->load('streams/vw_streams_exams_details_add_edit', $this->data);

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexCourse($course_id=NULL){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Courses';

			//echo $course_id;die;

			$this->data['course_stream_categories']=$this->strm->_get_stream_category(array('stream_category_status'=>'1'),FALSE);

			$this->data['parent_courses']=$this->strm->get_course(array('course_parent_id'=>NULL),FALSE);

			if(!empty($course_id)){
				$this->data['course_id']=$course_id;
				$_course_id=decode_data($course_id);
				$this->data['course_data']=$this->strm->get_course(array('course_id'=>$_course_id));
				$this->theme->title($this->data['page_title'])->load('streams/vw_courses_child', $this->data);
			}else{
				$this->data['streams']=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');



				$this->theme->title($this->data['page_title'])->load('streams/vw_courses', $this->data);
			}

			
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexCourseCategories($category_id=NULL){
		if(session_userdata('isAdminLoggedin')){
			$this->data['page_title']='Course Categories';

			$this->theme->title($this->data['page_title'])->load('streams/vw_courses_category', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexCourseDetails(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['parent_courses']=$this->strm->get_course(array('course_parent_id'=>NULL),FALSE);

			$this->data['page_title']='Courses Details Data';

			$this->theme->title($this->data['page_title'])->load('streams/vw_courses_details_data', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexCourseDetailsData($course_id){
		if(session_userdata('isAdminLoggedin')){

			$cid=decode_data($course_id);

			$course_data=array();

			$this->data['pre_menu']=array('overview','syllabus','jobs','qa','cutoff');


			$this->data['course_inner_menues']=$this->sm->get_menues(array('menu_link_type'=>'13','menu_link_id'=>$cid),FALSE);

			$this->data['course_id']=$course_id;


			$this->data['page_title']='Courses Details Data';

			$this->theme->title($this->data['page_title'])->load('streams/vw_courses_details_data_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAddCourse_v1(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token 	= 	$this->data['security_token'];

				$decrypted 			= 	CryptoJsAes::decrypt($ctext, $security_token);

				$_course 			= 	clean_data($decrypted['_course']);

				$_parent_course 	= 	clean_data($decrypted['_parent_course']);

				$course_stream 		= 	decode_data(clean_data($decrypted['course_streams']));
				$course_name 		= 	clean_data($decrypted['course_name']);
				$course_short_name 	= 	clean_data($decrypted['course_short_name']);
				$course_serial 		= 	clean_data($decrypted['course_serial']);
				$course_status 		= 	clean_data($decrypted['course_status']);

				$course_sub_streams =	clean_data($decrypted['course_sub_streams']);

				$course_type 		=	clean_data($decrypted['course_type']);

				$course_streams_category=decode_data(clean_data($decrypted['course_streams_category']));

				$course_duration 		= 	clean_data($decrypted['course_duration']);

				$course_duration_month 		= 	clean_data($decrypted['course_duration_month']);
				$course_duration_type 		= 	clean_data($decrypted['course_duration_type']);

				$course_type_2=clean_data($decrypted['course_type_2']);

				$course_degree_type=clean_data($decrypted['course_degree_type']);

				$course_pass_type=clean_data($decrypted['course_pass_type']);

				if($_parent_course!=NULL || $_parent_course!=''){
					$__parent_course=decode_data($_parent_course);
					if($__parent_course>0){
						$parent_course=$__parent_course;
						$parent_course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$parent_course));
					}else{
						$parent_course=NULL;
						$parent_course_slug='';
					}
				}else{
					$parent_course=NULL;
					$parent_course_slug='';
				}

				//print_obj($parent_course_slug);die;

				if(empty($_course)){

					if($course_type=='normal'){
						$course_name=$course_name;
					}else if($course_type=='honours'){
						$course_name=$course_name.' {Hons.}';
					}else if($course_type=='lateral'){
						$course_name=$course_name.' {Lateral}';
					}

					if($parent_course>0){
						$course_found=$this->strm->get_course(array('course_name'=>$course_name,'course_parent_id'=>$parent_course));
					}else{
						$course_found=$this->strm->get_course(array('course_name'=>$course_name));
					}

					

					$_course_short_name_2=generateKeywordsFromText($course_name);

					//print_obj($_course_short_name_2);die;

					$course_short_name_2=strtolower($course_short_name).','.$_course_short_name_2;

					if(empty($course_found)){

						if(!empty($course_sub_streams) && is_string($course_sub_streams)){
							$sub_stream_id=decode_data($course_sub_streams);
						}else{
							$sub_stream_id=null;
						}

						if($course_type=='normal'){
							$course_data=array(
								'course_parent_id'=>$parent_course,
								'course_category'=>$course_streams_category,
								'course_stream'=>$course_stream,
								'course_sub_stream'=>$sub_stream_id,
								'course_name'=>$course_name,
								'course_short_name'=>$course_short_name,
								'course_short_name_2'=>$course_short_name_2,
								'course_duration'=>'0',
								'course_duration_year'=>$course_duration,
								'course_duration_month'=>$course_duration_month,
								'course_duration_type'=>$course_duration_type,
								'course_type'=>$course_type_2,
								'course_type_2'=>$course_type_2,
								'course_passed_type'=>$course_pass_type,
								'course_status'=>$course_status,
								'course_is_lateral'=>'2',
								'course_is_honors'=>'2'
							);
						}else if($course_type=='honours'){
							$course_data=array(
								'course_parent_id'=>$parent_course,
								'course_category'=>$course_streams_category,
								'course_stream'=>$course_stream,
								'course_sub_stream'=>$sub_stream_id,
								'course_name'=>$course_name,
								'course_short_name'=>$course_short_name,
								'course_short_name_2'=>$course_short_name_2,
								'course_duration'=>'0',
								'course_duration_year'=>$course_duration,
								'course_duration_month'=>$course_duration_month,
								'course_duration_type'=>$course_duration_type,
								'course_type'=>$course_type_2,
								'course_type_2'=>$course_type_2,
								'course_passed_type'=>$course_pass_type,
								'course_status'=>$course_status,
								'course_is_lateral'=>'2',
								'course_is_honors'=>'1'
							);
						}else if($course_type=='lateral'){
							$course_data=array(
								'course_parent_id'=>$parent_course,
								'course_category'=>$course_streams_category,
								'course_stream'=>$course_stream,
								'course_sub_stream'=>$sub_stream_id,
								'course_name'=>$course_name,
								'course_short_name'=>$course_short_name,
								'course_short_name_2'=>$course_short_name_2,
								'course_duration'=>$course_duration,
								'course_duration_type'=>$course_duration_type,
								'course_type'=>$course_type_2,
								'course_type_2'=>$course_type_2,
								'course_passed_type'=>$course_pass_type,
								'course_status'=>$course_status,
								'course_is_lateral'=>'1',
								'course_is_honors'=>'2'
							);
						}

						//print_obj($course_data);die;


						$added=$this->strm->store_course_data($course_data);

						if($added){
							$current_year=date('Y');
							$prev_year=$current_year-1;

							if(!empty($sub_stream_id)){
								$sub_stream_data=$this->strm->get_course_sub_stream(array('sub_stream_id'=>$sub_stream_id));
							}

							$stream_slug=$this->sm->get_slug(array('slug_type_id'=>$course_stream,'slug_type'=>'3'));

							$course_slug=url_slug($course_name);

							if($parent_course>0){
								$parent_course_data=$this->strm->get_course(array('course_id'=>$parent_course));
								$course_page_heading=ucwords($parent_course_data->course_name).' ['.$parent_course_data->course_short_name.'] '.ucwords($course_name).' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;
							}else{
								$course_page_heading=ucwords($course_name).' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;
							}

							$page_key_words=$course_short_name_2.','.generateKeywordsFromText($course_page_heading);

							$country_data=$this->com->get_country(array('country_id'=>'99'));

							// if($parent_course_slug!=''){
							// 	$course_url=base_url().strtolower($country_data->country_iso_code_2).'/courses/'.$stream_slug->slug_value.'/'.$parent_course_slug->slug_value.'-'.$course_slug;
							// }else{
							// 	$course_url=base_url().strtolower($country_data->country_iso_code_2).'/courses/'.$stream_slug->slug_value.'/'.$course_slug;
							// }


							if($parent_course_slug!=''){
								$course_url=base_url('courses/'.$stream_slug->slug_value.'/'.$parent_course_slug->slug_value.'-'.$course_slug);
							}else{
								$course_url=base_url('courses/'.$stream_slug->slug_value.'/'.$course_slug);
							}
							


							$course_url_slug_data=array(
								'url_type'=>'course_static_url',
								'url_type_id'=>$added,
								'url_country'=>'99',
								'url_meta_heading'=>$course_page_heading,
								'url_meta_title'=>$course_page_heading,
								'url_meta_key_words'=>$page_key_words,
								'url_meta_desc'=>$course_page_heading,
								'url_og_title'=>$course_page_heading,
								'url_og_desc'=>$course_page_heading,
								'url_page_heading'=>$course_page_heading,
								'url_value'=>$course_url
							);

							$this->sm->store_slug_urls($course_url_slug_data);

							$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$added,'slug_value'=>$course_slug));


							$return['success']='Course added';
						}else{
							$return['error']='Course not added';
						}
					}else{
						$return['error']='Course already found in the system';
					}
				}else{
					$course_id=decode_data($_course);
					$course_found=$this->strm->get_course(array('course_id'=>$course_id));
					if($course_found){
						$course_data=array(
							'course_parent_id'=>$parent_course,
							'course_stream'=>$course_stream,
							'course_name'=>$course_name,
							'course_short_name'=>$course_short_name,
							'course_status'=>$course_status
						);

						$added=$this->strm->update_course_data($course_data,array('course_id'=>$course_id));

						if($added){
							$return['success']='Course updated';
						}else{
							$return['error']='Course not updated';
						}
					}else{
						$return['error']='Course not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
		
	public function onDeleteCourse(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course=post_data('_course');

				$course_id=decode_data($_course);

				$course_data=$this->strm->_get_course(array('course_id'=>$course_id));

				if($course_data){

					$deleted=$this->strm->delete_course_data(array('course_id'=>$course_id));

					if($deleted){

						$return['success']='Course deleted successfully';

					}else{
						$return['error']='Course can not be deleted at this momment';
					}

				}else{
					$return['error']='Course data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onUpdateCourseSingleData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('course_id');
				$_course_field=post_data('course_field');
				$field_value=post_data('field_value');

				

				$data=array($_course_field=>$field_value);

				$updated=$this->strm->update_course_data($data,array('course_id'=>$course_id));

				if($updated){
					$return['success']='Course field updated';
				}else{
					$return['error']='Course field not updated';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onAddCourseDetailsData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course_id=post_data('course_id');
				$_menu_id=post_data('menu_id');

				$course_id=decode_data($_course_id);
				$menu_id=decode_data($_menu_id);
				$couse_is_being_updated=FALSE;

				//echo $menu_id;die;


				$menu_data=$this->sm->get_menues(array('menu_id'=>$menu_id));


				$course_overview_general_heading_details=$this->input->post('course_overview_general_heading_details');

				// print_obj($course_overview_general_heading_details);die;


				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$course_details=$this->strm->get_course_details_data(array('course_id'=>$course_id));


				if(!empty($course_details)){
					$couse_is_being_updated=TRUE;
					$this->strm->delete_course_details_data(array('course_id'=>$course_id,'course_inner_menu_id'=>$menu_id));
				}


				$user_id=decode_data(session_userdata('admin_id'));


				if(!empty($course_overview_general_heading_details)){
					$serial=0;
					

					//print_obj($course_overview_general_heading_details);die;

					foreach ($course_overview_general_heading_details as $key => $value) {
						$data_type=$value['data_type'];

						//$overview_detail=$value['overview_detail'];
						$heading=(isset($value['heading']))?$value['heading']:null;
						$heading_detail=(isset($value['heading_detail']))?$value['heading_detail']:null;
						//$table_heading=$value['table_heading'];

						//$image_detail=$value['image_detail'];

						if($couse_is_being_updated==TRUE){

							if($data_type=='image'){
								$image_id=decode_data($value['data_type_value']);
								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>$image_id,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial,
									'course_data_updated_by'=>$user_id,
									'course_data_updated_at'=>date('Y-m-d')
								);
							}else if($data_type=='youtube'){
								$yt_video_data=array(
									'youtube_link'=>$value['heading_detail'],
									'youtube_video_name'=>$course_data->course_short_name.' '.$menu_data->menu_name,
									'youtube_video_parent_id'=>$course_data->course_id
								);

								$yt_video_id=$this->onUploadFiles($yt_video_data,'youtube');
								$data_type_value=$yt_video_id;

								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>NULL,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial,
									'course_data_updated_by'=>$user_id,
									'course_data_updated_at'=>date('Y-m-d')
								);
							}
							else{
								$image_id=(isset($value['data_type_value']) && !empty($value['data_type_value']))?decode_data($value['data_type_value']):null;
								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>NULL,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial,
									'course_data_updated_by'=>$user_id,
									'course_data_updated_at'=>date('Y-m-d')
								);
							}								
						}else{
							if($data_type=='image'){
								$image_id=(isset($value['data_type_value']) && !empty($value['data_type_value']))?decode_data($value['data_type_value']):null;
								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>$image_id,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial
								);
							}else if($data_type=='youtube'){
								$yt_video_data=array(
									'youtube_link'=>$value['heading_detail'],
									'youtube_video_name'=>$course_data->course_short_name.' '.$menu_data->menu_name,
									'youtube_video_parent_id'=>$course_data->course_id
								);

								$yt_video_id=$this->onUploadFiles($yt_video_data,'youtube');
								$data_type_value=$yt_video_id;

								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>NULL,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial
								);
							}else{
								$data_to_store[]=array(
									'course_id'=>$course_id,
									'course_data_image_id'=>NULL,
									'course_data_heading'=>$heading,
									'course_data_type'=>$data_type,
									'course_data_value'=>$heading_detail,
									'course_data_created_by'=>$user_id,
									'course_inner_menu_id'=>$menu_id,
									'course_data_serial'=>$serial
								);
							}
								
						}

						$serial++;
					}

					//print_obj($data_to_store);die;

					$added=$this->strm->store_course_details_data($data_to_store,TRUE);

					//print_obj($data_to_store);die;



					if($added){
						$faqs=$this->input->post('course_faqs');

						if(!empty($faqs)){
							if(!empty($faqs[0]['ques']) && !empty($faqs[0]['ans'])){
								$faq_serial=0;
								foreach ($faqs as $key => $value) {
									$faq_ques=$value['ques'];
									$faq_ans=$value['ans'];
									$faq_data_to_store[]=array(
										'course_id'=>$course_id,
										'course_data_image_id'=>NULL,
										'course_data_heading'=>$faq_ques,
										'course_data_type'=>'faqs',
										'course_data_value'=>$faq_ans,
										'course_data_created_by'=>$user_id,
										'course_inner_menu_id'=>$menu_id,
										'course_data_serial'=>$faq_serial,
										'course_data_updated_by'=>$user_id,
										'course_data_updated_at'=>date('Y-m-d')
									);

									$faq_serial++;
								}

								$this->strm->store_course_details_data($faq_data_to_store,TRUE);
							}
								
						}

						$return['success']='Details added successfully';
					}else{
						$return['error']='Details not added';
					}

				}else{
					$return['error']='No data given to add';
				}


				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchCourses(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'course_name'
				);

				$param['column_search'] = array('course_name','course_short_name');
				$param['order'] = array('course_id' => 'ASC');
				$posts=$this->input->post();

				if(isset($posts['course_parent']) && ($posts['course_parent']!=NULL || $posts['course_parent']!='')){
					$param['course_parent_id']=decode_data($posts['course_parent']);
				}

				$list = $this->strm->_get_courses($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $course){
					$no++;

					$row = array();

					/*if(session_userdata('admin_role')=='1'){
						if(isset($posts['course_parent']) && ($posts['course_parent']!=NULL || $posts['course_parent']!='')){
							$action='<div class="btn-group btn-group-sm" role="group">
							<a href="'.$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course->course_id).'" class="btn btn-success" data-course="'.encode_data($course->course_id).'">Add Menues</a>
							<button type="button" data-course="'.encode_data($course->course_id).'" data-stream="'.$course->stream_name.'" data-course_name="'.$course->course_name.'" data-status="'.$course->course_status.'" class="btn btn-xs btn-primary btn_edit_course">Edit</button>
							<a href="javascript::void()" class="btn btn-xs btn-dark btn_del_course" data-course="'.encode_data($course->course_id).'">Delete</a>
							</div>';
						}else{
							$action='<div class="btn-group btn-group-sm" role="group">
							<a href="'.$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course->course_id).'" class="btn btn-success" data-course="'.encode_data($course->course_id).'">Add Menues</a>
							<a href="'.$this->data['admin_base_url'].'/streams/courses/'.encode_data($course->course_id).'" class="btn btn-warning" data-course="'.encode_data($course->course_id).'">Add Courses</a>
							<button type="button" data-course="'.encode_data($course->course_id).'" data-stream="'.$course->stream_name.'" data-course_name="'.$course->course_name.'" data-status="'.$course->course_status.'" class="btn btn-xs btn-primary btn_edit_course">Edit</button>
							<a href="javascript::void()" class="btn btn-xs btn-dark btn_del_course" data-course="'.encode_data($course->course_id).'">Delete</a>
							</div>';
						}
					}else{
						$action='<div class="btn-group btn-group-sm" role="group">
							<a href="'.$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course->course_id).'" class="btn btn-success" data-course="'.encode_data($course->course_id).'">Add Menues</a>
							</div>';
					}*/

					$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);

					$stream_html='<select class="form-control">';

					if(!empty($streams)){
						foreach ($streams as $key => $value) {
							if($value->stream_id==$course->course_stream){
								$selected="selected";
							}else{
								$selected="";
							}

							$stream_html.='<option value="'.$value->stream_id.'" '.$selected.'>'.$value->stream_name.'</option>';
						}
					}

					$stream_html.='</select>';

					$action='<div class="btn-group btn-group-sm" role="group">
							<a href="'.$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course->course_id).'" class="btn btn-success" data-course="'.encode_data($course->course_id).'">Add Menues</a>
							<button type="button" class="btn btn-xs btn-primary btn_edit_course_straem" data-target="#editCourseStreamModal" data-toggle="modal" data-course_id="'.$course->course_id.'">Edit</button>
							<a href="javascript::void()" class="btn btn-xs btn-dark btn_del_course" data-course="'.encode_data($course->course_id).'">Delete</a>
							</div>';

					if($course->course_is_top=='1'){
						$course_is_top_button='<button type="button" class="btn btn-xs btn-success">Marked As Top Course</button>';
					}else if($course->course_is_top=='2'){
						$course_is_top_button='<button type="button" class="btn btn-xs btn-warning">Mark Top Course</button>';
					}

					if($course->course_show_in_widget=='1'){
						$course_show_in_widget_button='<button type="button" class="btn btn-xs btn-success btn_set_field" data-field="course_show_in_widget" data-course="'.$course->course_id.'" data-value="2">Visible in Top Course Widget</button>';
					}else if($course->course_show_in_widget=='2'){
						$course_show_in_widget_button='<button type="button" class="btn btn-xs btn-dark btn_set_field" data-field="course_show_in_widget" data-course="'.$course->course_id.'" data-value="1">Show in Top Course Widget</button>';
					}

					

					$_course_name=($course->course_short_name!=null)?$course->course_name.' [ '.$course->course_short_name.' ]':$course->course_name;

					if($course->course_is_lateral=='1'){
						if($course->course_is_honors=='1'){
							$course_name=$_course_name.'{ Lateral (Hons.) }';
						}else{							
							$course_name=$_course_name.'{ Lateral }';
						}
					}else{
						if($course->course_is_honors=='1'){
							$course_name=$_course_name.'{ Hons. }';
						}else{							
							$course_name=$_course_name;
						}
					}

						
					$sub_stream_data=$this->strm->get_course_sub_stream(array('sub_stream_id'=>$course->course_sub_stream,'sub_stream_parent_id'=>$course->course_stream));				
					
					$row[]	=	$no;
					$row[]	=	$course_name.'<br><br>'.$course_show_in_widget_button;
					$row[]	=	$course->stream_name;

					$row[]	=	(!empty($sub_stream_data))?$sub_stream_data->sub_stream_name:'';

					if($course->course_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($course->course_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_courses($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_courses($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCoursesDetails(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'course_name'
				);

				$param['column_search'] = array('course_name','course_short_name');
				$param['order'] = array('course_id' => 'ASC');
				$posts=$this->input->post();

				//print_obj($posts);

				if(isset($posts['course_parent']) && ($posts['course_parent']!=NULL || $posts['course_parent']!='')){
					$param['course_parent_id']=decode_data($posts['course_parent']);
				}

				//print_obj($param);

				$list = $this->strm->_get_courses($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $course){
					$no++;

					$row = array();					

					$_course_name=($course->course_short_name!=null)?$course->course_name.' [ '.$course->course_short_name.' ]':$course->course_name;

					if($course->course_is_lateral=='1'){
						if($course->course_is_honors=='1'){
							$course_name=$_course_name.'{ Lateral (Hons.) }';
						}else{							
							$course_name=$_course_name.'{ Lateral }';
						}
					}else{
						if($course->course_is_honors=='1'){
							$course_name=$_course_name.'{ Hons. }';
						}else{							
							$course_name=$_course_name;
						}
					}

					$action='<button type="button" class="btn btn-xs btn-primary">Create Menu</button>';		
					
					$row[]	=	$no;
					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course->course_id).'" target="_blank">'.$course_name.'</a>';

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_courses($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_courses($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCoursecategories(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'stream_category'
				);

				$param['column_search'] = array('stream_category','stream_category_show_name');
				$param['order'] = array('stream_category_id' => 'ASC');
				$posts=$this->input->post();

				$list = $this->strm->_get_course_categories($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $category){
					$no++;

					$row = array();

					$action='<div class="btn-group btn-group-sm" role="group">
						<button type="button" data-course_category="'.encode_data($category->stream_category_id).'" class="btn btn-xs btn-primary btn_edit_course">Edit</button>
						<a href="javascript::void()" class="btn btn-xs btn-dark btn_del_course" data-course="'.encode_data($category->stream_category_id).'">Delete</a>
						</div>';
										
					
					$row[]	=	$no;
					$row[]	=	$category->stream_category;

					$row[]	=	'<button type="button" data-course_category="'.encode_data($category->stream_category_id).'" class="btn btn-xs btn-warning btn_course_category_stream" data-target="#coursecategoryStreamModal" data-toggle="modal">View</button>';

					if($category->stream_category_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($category->stream_category_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_course_categories($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_course_categories($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGetCourseCategoryStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_category=post_data('_course_category');

				$category=decode_data($course_category);

				$_streams=$this->strm->get_inset_stream('stream_category',$category);

				if(!empty($_streams)){
                	foreach ($_streams as $k => $v) {

                		$slugs_url=$this->sm->get_slug_urls(array('url_type'=>'course_stream','url_type_id'=>$value->stream_id));

                		$streams[]=array(
                			'stream_name'=>$v->stream_name,
                			'stream_access_url'=>'',
                			'action'=>'<button class="btn btn-xs btn-warning btn_course_stream_edit" data-course_category="'.$course_category.'" data-streams="'.encode_data($v->stream_id).'" data-meta_heading="'.$slugs_url->url_meta_heading.'" data-meta_title="'.$slugs_url->url_meta_title.'" data-meta_key_words="'.$slugs_url->url_meta_key_words.'" data-meta_desc="'.$slugs_url->url_meta_desc.'" data-meta_heading="'.$slugs_url->url_meta_heading.'" data-og_title="'.$slugs_url->url_og_title.'" data-og_desc="'.$slugs_url->url_og_desc.'" data-page_heading="'.$slugs_url->url_page_heading.'" data-page_sub_heading="'.$slugs_url->url_page_sub_heading.'" data-url_value="'.$slugs_url->url_value.'" data-target="#courseStreamSlugsModal" data-toggle="modal">Edit</button>'
                		);
                	}
                }

                $this->data['streams']=$streams;

                $return['html']=$this->theme->view('_pages/streams/vw_category_streams',$this->data,true);

                header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateStreamSlugs(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_stream_category=post_data('course_stream_category');
				$course_category_stream=post_data('course_category_stream');

				$category_id=decode_data($course_stream_category);
				$stream_id=decode_data($course_category_stream);

				//echo $stream_id;die;

				$course_stream_url_meta_heading=post_data('course_stream_url_meta_heading');
				$course_stream_url_meta_title=post_data('course_stream_url_meta_title');
				$course_stream_url_meta_keywords=post_data('course_stream_url_meta_keywords');
				$course_stream_url_meta_desc=post_data('course_stream_url_meta_desc');
				$course_stream_url_og_title=post_data('course_stream_url_og_title');
				$course_stream_url_og_desc=post_data('course_stream_url_og_desc');
				$course_stream_url_page_heading=post_data('course_stream_url_page_heading');
				$course_stream_url_page_sub_heading=post_data('course_stream_url_page_sub_heading');


				$course_category=$this->strm->_get_stream_category(array('stream_category_id'=>$category_id));

				$category_stream=$this->strm->get_stream(array('stream_id'=>$stream_id));

				//echo $course_category->stream_category;

				$course_category_slug=url_slug($course_category->stream_category);
				$category_stream_slug=url_slug($category_stream->stream_name);

				//echo $course_category_slug;die;

				$url=base_url().'in/courses/'.$course_category_slug.'/'.$category_stream_slug;

				$slug_url=$this->sm->get_slug_urls(array('url_value'=>$url));


				$data_to_update=array(
					'url_type'=>'course_stream',
					'url_type_id'=>$stream_id,
					'url_country'=>'99',
					'url_meta_heading'=>$course_stream_url_meta_heading,
					'url_meta_title'=>$course_stream_url_meta_title,
					'url_meta_key_words'=>$course_stream_url_meta_keywords,
					'url_meta_desc'=>$course_stream_url_meta_desc,
					'url_og_title'=>$course_stream_url_og_title,
					'url_og_desc'=>$course_stream_url_og_desc,
					'url_page_heading'=>$course_stream_url_page_heading,
					'url_page_sub_heading'=>$course_stream_url_page_sub_heading,
					'url_value'=>$url
				);

				//print_obj($data_to_update);die;

				if(empty($slug_url)){
					$added=$this->sm->store_slug_urls($data_to_update);
					if($added){
						$return['success']='URL added successfully';
					}else{
						$return['error']='URL not added successfully';
					}
				}else{
					$added=$this->sm->update_slug_urls($data_to_update,array('url_value'=>$url));
					if($added){
						$return['success']='URL updated successfully';
					}else{
						$return['error']='URL not updated successfully';
					}
				}


				header('Content-Type: application/json');

				echo json_encode($return);


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUploadPracticePapers(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');
				//$exam_name=post_data('exam_name');
				$file_type=post_data('file_types');

				$file_type_name=post_data('file_title');
				$file_year=post_data('file_year');

				$exam_id=decode_data($_exam_id);

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				$linked_file_id=post_data('file_question_file');

				if($file_type=='10' && $linked_file_id>0){
					$upload_file=true;
				}else{
					$paper_linked=false;
				}

				if($paper_linked==true){
					$upload_file=true;
				}else{

				}

				if(isset($_FILES['practice_paper']) && $_FILES['practice_paper']['name']!=''){

				 	if($file_type=='10' && $linked_file_id>0){
				 		$upload_file=true;
				 	}else if($file_type=='10' && $linked_file_id==0){
				 		$upload_file=false;
				 		$error='Select Question paper';
				 	}else{
				 		$upload_file=true;
				 	}

				 	if($upload_file===true){
						$practice_paper_data=array(
							'file_size'=>'10',
							'file_name'=>'practice_paper',
							'file_types'=>'pdf',
							'file_folder'=>'examdetails',
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						$file_id=$this->onUploadFiles($practice_paper_data);

						if(!empty($file_id) && $file_id>0){

							//$this->sm->delete_user_file(array('user_file_type_id'=>$user_pk_id,'user_storage_type'=>'practice_paper'));

							//$practice_papers=$this->sm->get_user_files(array('user_file_type_id'=>$exam_id,'user_file_type'=>$file_type));

							//$total_files=count($practice_papers);

							// if($file_type=='9'){
							// 	$file_type_name=strtoupper($exam_data->exam_short_name).' Question Paper '.($total_files+1);
							// }else if($file_type=='10'){
							// 	$file_type_name=strtoupper($exam_data->exam_short_name).' Answer Paper '.($total_files+1);
							// }else if($file_type=='11'){
							// 	$file_type_name=strtoupper($exam_data->exam_short_name).' Speaking Paper '.($total_files+1);
							// }else if($file_type=='12'){
							// 	$file_type_name=strtoupper($exam_data->exam_short_name).' Writing Paper '.($total_files+1);
							// }else if($file_type=='13'){
							// 	$file_type_name=strtoupper($exam_data->exam_short_name).' Listening Paper '.($total_files+1);
							// }

							if($file_type=='10'){
								
								$practice_paper_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>$exam_id,
					            	'user_file_type'=>$file_type,
					            	'user_storage_type_2'=>$file_type_name,
					            	'user_storage_type_3'=>$file_year,
					            	'user_file_type_linked'=>$linked_file_id,
					            	'user_storage_type'=>'answer_paper'
					            );
							}else{
								$practice_paper_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>$exam_id,
					            	'user_file_type'=>$file_type,
					            	'user_storage_type_2'=>$file_type_name,
					            	'user_storage_type_3'=>$file_year,
					            	'user_storage_type'=>'practice_paper'
					            );
							}

					            

				            $this->sm->store_user_file($practice_paper_storage_data);

				            $param['user_file_type_id']=$exam_id;
							$param['_user_storage_type']='practice_paper';
							$return['practice_papers'] = $this->sm->_get_guser_files(null,$param,FALSE,FALSE);

				            $return['success']='File added successfully';
				        }else{
				        	$return['error']=$file_id.'.File not uploaded';
				        }
				 	}else{
				 		$return['error']=$error;
				 	}	

						
				}else{
					$return['error']='Select a file to upload';
				}


				header('Content-Type: application/json');

				echo json_encode($return);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onDeletePracticePaper(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');
				$exam_id=decode_data($_exam_id);
				$file_id=post_data('file_id');

				//echo $file_id;die;

				$user_file=$this->sm->get_user_file(array('user_storage_id'=>$file_id,'user_file_type_id'=>$exam_id,'user_storage_type'=>'practice_paper'));

				//print_obj($user_file);die;

				if($user_file){

					$deleted=$this->sm->delete_user_file(array('user_storage_id'=>$file_id,'user_file_type_id'=>$exam_id,'user_storage_type'=>'practice_paper'));

					if($deleted){

						if(file_exists($user_file->media_disk_path)){
							@unlink($user_file->media_disk_path);
							$this->sm->delete_file(array('storage_id'=>$user_file->storage_id));
						}

						$return['success']='File deleted successfully';

					}else{
						$return['error']='File can not be deleted at this momment';
					}

				}else{
					$return['error']='File data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}



	public function onSearchPracticepapers(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');
				$exam_id=decode_data($_exam_id);

				$param['column_order'] = array(
					null,
					'stream_name'
				);

				$param['column_search'] = array('user_storage_type_2');
				$param['order'] = array('user_storage_id' => 'ASC');
				$posts=$this->input->post();

				$param['user_file_type_id']=$exam_id;

				//$param['_user_storage_type']='practice_paper';

				$param['in_file_type']='9,10,11,12,13,14';

				$list = $this->sm->_get_guser_files($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $file){
					$no++;

					$row = array();

					if($file->user_file_type=='9'){

					}else{

					}
					
					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" class="btn btn-xs btn-danger btn_del_practice_paper" data-file_id="'.$file->user_storage_id.'">Delete</button>
					</div>';

					if($file->user_file_type=='9'){
						$file_type='Question Paper';
					}else if($file->user_file_type=='10'){
						$file_type='Answer File';
					}else if($file->user_file_type=='11'){
						$file_type='Speaking Practice Paper';
					}else if($file->user_file_type=='12'){
						$file_type='Writing Practice Paper';
					}else if($file->user_file_type=='13'){
						$file_type='Listening Practice Paper';
					}else if($file->user_file_type=='14'){
						$file_type='Sample Practice Paper';
					}

					$row[]	=	$no;
					$row[]	=	$file_type;
					$row[]	=	$file->user_storage_type_2;
					$row[]	=	$file->user_storage_type_3;
					$row[]	=	$file->media_org_name;
					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_guser_files($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_guser_files($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	//Streamss

	public function onAddStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$_stream 			= 	clean_data($decrypted['_stream']);

				$stream_name 		= 	clean_data($decrypted['stream_name']);
				$stream_serial 		= 	clean_data($decrypted['stream_serial']);
				$stream_status 		= 	clean_data($decrypted['stream_status']);

				if(empty($_stream)){

					$stream_found=$this->strm->get_stream(array('stream_name'=>$stream_name));

					if(empty($stream_found)){
						$course_data=array(
							'stream_name'=>$stream_name,
							'stream_serial'=>$stream_serial,
							'stream_status'=>$stream_status,
							'stream_created_by'=>$user_id
						);

						$added=$this->strm->store_stream_data($course_data);

						if($added){
							$return['success']='Stream addedd';
						}else{
							$return['error']='Stream not added';
						}
					}else{
						$return['error']='Stream already found';
					}

						

				}else{
					$stream_id=decode_data($_stream);
					$stream_found=$this->strm->get_stream(array('stream_id'=>$stream_id));
					if($stream_found){

					}else{
						$return['error']='Course Stream not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onDeleteStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_stream=post_data('_stream');

				$stream_id=decode_data($_stream);

				$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

				if($stream_data){

					$deleted=$this->strm->delete_stream_data(array('stream_id'=>$stream_id));

					if($deleted){

						$return['success']='Stream deleted successfully';

					}else{
						$return['error']='Stream can not be deleted at this momment';
					}

				}else{
					$return['error']='Stream data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onSearchStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'stream_name'
				);

				$param['column_search'] = array('stream_name');
				$param['order'] = array('stream_serial' => 'ASC');
				$posts=$this->input->post();

				$list = $this->strm->_get_streams($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $stream){
					$no++;

					$row = array();

					$total_colleges=$this->um->get_colleges_by_stream($stream->stream_id,TRUE);//$this->strm->get_total_course_stream(array('stream_parent_id'=>$stream->stream_id),'user_id');

					$total_degrees=0;//$this->strm->get_total_courses(array('course_stream'=>$stream->stream_id));

					$total_sub_streams=$this->strm->get_total_sub_stream(array('sub_stream_parent_id'=>$stream->stream_id));

					$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream->stream_id));


					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" data-stream="'.encode_data($stream->stream_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button type="button" class="btn btn-xs btn-warning btn_move_to_sub_stream" data-straem_name="'.$stream->stream_name.'" data-stream="'.$stream->stream_id.'">Move to Sub Stream</a>
					<button type="button" class="btn btn-xs btn-dark btn_del_stream" data-stream="'.encode_data($stream->stream_id).'">Delete</a>
					</div>';

					if($stream->stream_show_in_home_widget=='no'){
						$show_in_home_widget='<button type="button" class="btn btn-xs btn-dark btn_data_change" data-stream="'.$stream->stream_id.'" data-value="yes" data-field="stream_show_in_home_widget">Show in Home Widget</button>';
					}else if($stream->stream_show_in_home_widget=='yes'){
						$show_in_home_widget='<button type="button" class="btn btn-xs btn-success btn_data_change" data-stream="'.$stream->stream_id.'" data-value="no" data-field="stream_show_in_home_widget">Show in Home Widget</button>';
					}

					$details_upload='<a class="btn btn-xs btn-warning" href="'.$this->data['admin_base_url'].'/streams/'.encode_data($stream->stream_id).'">Details Upload</a>';		
					
					$row[]	=	$no;
					if(!empty($stream_slug)){
						$row[]	=	'<a href="'.base_url('courses').'/'.$stream_slug->slug_value.'" target="_blank">'.$stream->stream_name.'</a><br><br>'.$show_in_home_widget.$details_upload;
					}else{
						$row[]	=	$stream->stream_name.'<br><br>'.$show_in_home_widget.$details_upload;
					}
					
					$row[]	=	$stream->stream_serial;

					$row[]	=	'<button type="button" class="btn btn-xs btn-warning btn_stream_colleges" data-stream_id="'.$stream->stream_id.'" data-toggle="modal" data-target="#editStreamCollegeModal">'.$total_colleges.'</button>';

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/substreams/'.encode_data($stream->stream_id).'" class="btn btn-xs btn-warning">'.$total_sub_streams.'</a>';

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/streams/degrees/'.encode_data($stream->stream_id).'" class="btn btn-xs btn-warning">'.$total_degrees.'</a>';

					if($stream->stream_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($stream->stream_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_streams($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_streams($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onMoveToSubStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('move_to_stream_id');
				$move_to_stream_name=post_data('move_to_stream_name');
				$parent_stream_id=post_data('move_to_parent_stream_id');

				$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));


				if(!empty($stream_data)){

					$sub_stream_name=(!empty($move_to_stream_name))?strtoupper($move_to_stream_name):strtoupper($stream_data->stream_name);

					$found_in_user_streams=$this->strm->get_user_course_stream(array('stream_id'=>$stream_id,'stream_parent_id'=>null),FALSE);

					$sub_stream_data=array(
						'sub_stream_parent_id'=>$parent_stream_id,
						'sub_stream_name'=>$sub_stream_name,
						'sub_stream_serial'=>'1',
						'sub_stream_status'=>'1'
					);

					$sub_stream=$this->strm->get_course_sub_stream(array('sub_stream_name'=>$sub_stream_name));

					if(empty($sub_stream)){
						$new_stream_id=$this->strm->store_course_sub_stream_data($sub_stream_data);

						if(!empty($new_stream_id)){
							if(!empty($found_in_user_streams)){
								foreach ($found_in_user_streams as $key => $value) {
									$_dt=array(
										'stream_id'=>$new_stream_id,
										'stream_parent_id'=>$parent_stream_id,
										'stream_name'=>$sub_stream_name
									);

									$this->strm->update_user_course_stream_data($_dt,array('user_id'=>$found_in_user_streams->user_id,'user_course_stream_id'=>$found_in_user_streams->user_course_stream_id));
									$new_uc_streams=$this->strm->get_group_concat_user_course_stream_data(array('user_id'=>$found_in_user_streams->user_id,'stream_parent_id'=>null));

									if(!empty($new_uc_streams)){
										$this->im->update_college_data(array('college_streams_ids'=>$new_uc_streams->concated_value),array('college_user_id'=>$found_in_user_streams->user_id));
									}

									$new_uc_streams2=$this->strm->get_group_concat_user_course_stream_data(array('user_id'=>$found_in_user_streams->user_id,'stream_parent_id'=>null,'course_id'=>$found_in_user_streams->course_id));

									if(!empty($new_uc_streams2)){
										$this->im->update_course_data(array('user_course_stream'=>$new_uc_streams2->concated_value),array('user_id'=>$found_in_user_streams->user_id,'user_course'=>$found_in_user_streams->course_id));
									}
								}
							}

							$this->strm->delete_stream_details_data(array('stream_id'=>$stream_id));

							$return['success']='Stream has been moved to sub-stream';
						}else{
							$return['success']='Stream has not been moved to sub-stream';
						}	
					}else{
						if(empty($found_in_user_streams)){
							$this->strm->delete_stream_details_data(array('stream_id'=>$stream_id));
						}

						$return['success']='Sub-stream already exists.Stream has been removed.';
					}
				}else{
					$return['error']='Stream not found in the system';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	
	public function onUpdateStreamField(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream=post_data('stream');
				$field=post_data('field');
				$value=post_data('field_value');

				$data=array($field=>$value);

				//print_obj($data);die;

				$updated=$this->strm->update_stream_data($data,array('stream_id'=>$stream));

				if($updated){
					$return['success']='Updated';
				}else{
					$return['error']='Not Updated';
				}

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddSubStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$_stream 			= 	clean_data($decrypted['_stream']);

				$stream_name 		= 	clean_data($decrypted['stream_name']);
				$stream_serial 		= 	clean_data($decrypted['stream_serial']);
				$stream_status 		= 	clean_data($decrypted['stream_status']);

				if(!empty($_stream)){

					$stream_found=$this->strm->get_course_sub_stream(array('sub_stream_name'=>$stream_name));

					if(empty($stream_found)){
						$sub_stream_data=array(
							'sub_stream_parent_id'=>$_stream,
							'sub_stream_name'=>$stream_name,
							'sub_stream_serial'=>$stream_serial,
							'sub_stream_status'=>$stream_status
						);

						$added=$this->strm->store_course_sub_stream_data($sub_stream_data);

						if($added){
							$return['success']='Sub Stream addedd';
						}else{
							$return['error']='Sub Stream not added';
						}
					}else{
						$stream_parent_id=$stream_found->sub_stream_parent_id;
						$new_stream_parent_id=$stream_parent_id.','.$_stream;
						$_stream_parent_id=char_separated_to_array($new_stream_parent_id);
						$_new_stream_parent_ids=array_unique($_stream_parent_id);

						asort($_new_stream_parent_ids);

						$added=$this->strm->update_course_stream_data(array('sub_stream_parent_id'=>char_separated($_new_stream_parent_ids)),array('sub_stream_name'=>$stream_name));

						if($added){
							$return['success']='Sub Stream addedd';
						}else{
							$return['error']='Sub Stream not added';
						}
					}

						

				}else{
					$stream_id=decode_data($_stream);
					$stream_found=$this->strm->get_stream(array('stream_id'=>$stream_id));
					if($stream_found){

					}else{
						$return['error']='Course Stream not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	//Streams

	//Substreams
	public function indexSubStreams($parent_stream_id=NULL,$stream_id=NULL){
		if(session_userdata('isAdminLoggedin')){
			if($parent_stream_id!=NULL){
				$this->data['parent_stream']=$parent_stream_id;

				$stream_id=decode_data($parent_stream_id);
				$this->data['stream_data']=$this->strm->get_stream(array('stream_id'=>$stream_id));
				$this->theme->title($this->data['page_title'])->load('streams/vw_sub_streams', $this->data);
			}else{
				redirect($this->data['admin_base_url']);
			}			
		}else{	
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchSubStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'stream_name'
				);

				$param['column_search'] = array('sub_stream_name');
				$param['order'] = array('sub_stream_serial' => 'ASC');
				$posts=$this->input->post();

				$param['parent_stream']=decode_data(post_data('_parent_stream'));

				$list = $this->strm->_get_sub_streams($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $stream){
					$no++;

					$row = array();

					$total_colleges=$this->strm->get_total_course_stream(array('stream_id'=>$stream->sub_stream_id));

					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" data-stream="'.encode_data($stream->sub_stream_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button type="button" class="btn btn-xs btn-dark btn_del_sub_stream" data-stream="'.encode_data($stream->sub_stream_id).'">Delete</a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$stream->sub_stream_name;
					$row[]	=	$stream->sub_stream_serial;

					$row[]	=	'<button type="button" class="btn btn-xs btn-warning">'.$total_colleges.'</button>';

					if($stream->sub_stream_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($stream->sub_stream_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_sub_streams($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_sub_streams($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	//Substreams

	//Degrees

	public function onAddDegree(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$ctext=post_data('ctext');

				$security_token 	= 	$this->data['security_token'];

				$decrypted 			= 	CryptoJsAes::decrypt($ctext, $security_token);

				$_degree 			= 	clean_data($decrypted['_degree']);
				$_stream 			= 	clean_data($decrypted['_stream']);
				$stream_id 			=	decode_data($_stream );

				$degree_name 		= 	clean_data($decrypted['degree_name']);
				$degree_status 		= 	clean_data($decrypted['degree_status']);

				if(empty($_degree)){

					$stream_found=$this->strm->get_degree(array('degree_name'=>$degree_name));

					if(empty($stream_found)){
						$course_data=array(
							'degree_stream_id'=>$stream_id,
							'degree_name'=>$degree_name,
							'degree_status'=>$degree_status,
							'degree_created_by'=>$user_id
						);

						$added=$this->strm->store_degree_data($course_data);

						if($added){
							$return['success']='Degree addedd';
						}else{
							$return['error']='Degree not added';
						}
					}else{
						$return['error']='Degree already found';
					}	

				}else{
					$degree_id=decode_data($_degree);
					$stream_found=$this->strm->get_degree(array('degree_id'=>$degree_id));
					if($stream_found){

					}else{
						$return['error']='Degree not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onDeleteDegree(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_degree=post_data('_degree');

				$degree_id=decode_data($_degree);

				$degree_data=$this->strm->get_degree(array('degree_id'=>$degree_id));

				if($degree_data){

					$deleted=$this->strm->delete_degree_data(array('degree_id'=>$degree_id));

					if($deleted){

						$return['success']='Degree deleted successfully';

					}else{
						$return['error']='Degree can not be deleted at this momment';
					}

				}else{
					$return['error']='Degree data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onSearchDegrees(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'stream_name',
					'degree_name'
				);

				$param['column_search'] = array('degree_name','stream_name');
				$param['order'] = array('degree_id' => 'ASC');
				$posts=$this->input->post();

				if(!empty($posts['stream'])){
					$param['stream_id']=decode_data($posts['stream']);
				}

				

				$list = $this->strm->_get_degrees($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $degree){
					$no++;

					$row = array();

					$total_exams=$this->strm->get_total_exams(array('exam_degree_id'=>$degree->degree_id));

					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" data-stream="'.encode_data($degree->degree_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button type="button" class="btn btn-xs btn-dark btn_del_degree" data-degree="'.encode_data($degree->degree_id).'">Delete</a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$degree->stream_name;
					$row[]	=	$degree->degree_name;
					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/streams/degrees/exams/'.encode_data($degree->degree_id).'" class="btn btn-xs btn-warning">'.$total_exams.'</a>';

					if($degree->degree_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($degree->degree_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_degrees($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_degrees($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	//Course Exams

	public function onSearchExams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=$this->data['userdata']->user_id;
				$user_role=$this->data['userdata']->user_role;

				//echo $user_id;die;

				//print_obj($this->data['userdata']);die;


				$param['column_order'] = array(
					null,
					'exam_full_name',
					'exam_short_name'
				);

				$param['column_search'] = array('exam_full_name','exam_short_name');
				$param['order'] = array('exam_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->strm->_get_exams($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $exam){
					$no++;

					$row = array();

					$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$exam->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

	    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
	                    $exam_logo=$_exam_logo->media_disk_path_relative;
	                }else{
	                    $exam_logo=base_url().'uploads/app/default/no.jpg';
	                }

	                $logo='<img src="'.$exam_logo.'" class="table-user-thumb" alt="" loading="lazy">';

	                // $added_to_search=$this->nm->get_news_types(array('news_types'=>'3','news_types_id'=>$exam->exam_id));

	                if($this->data['userdata']->user_role=='1'){
	                	$action='<div class="btn-group btn-group-sm" role="group">
						<button class="btn btn-xs btn-warning btn_update_slug_url" data-exam_id="'.$exam->exam_id.'">Generate Slug</button>
						<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.'" data-exam_short_name="'.$exam->exam_short_name.'" data-exam_short_desc="'.$exam->exam_description.'" class="btn btn-xs btn-primary btn_exam">Edit</button>
						<button class="btn btn-xs btn-success btn_update_exam_dates" data-exam="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.'" data-exam_short_name="'.$exam->exam_short_name.'" data-exam_short_desc="'.$exam->exam_description.'" >Update Dates</button>
						<button type="button" class="btn btn-xs btn-dark btn_del_exam" data-exam="'.encode_data($exam->exam_id).'">Delete</button>
						</div>';
	                }else{
	                	if($this->data['userdata']->user_id=$exam->exam_created_by){
	                		$action='<div class="btn-group btn-group-sm" role="group">
							<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.'" data-exam_short_name="'.$exam->exam_short_name.'" data-exam_short_desc="'.$exam->exam_description.'" class="btn btn-xs btn-primary btn_exam">Edit</button>
							<button class="btn btn-xs btn-success btn_update_exam_dates" data-exam="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.'" data-exam_short_name="'.$exam->exam_short_name.'" data-exam_short_desc="'.$exam->exam_description.'" >Update Dates</button>
							</div>';
	                	}else{
	                		$action='';
	                	}
		                	
	                }

					

					$streams=$this->strm->get_group_concat('stream_name','stream_id',$exam->exam_stream_id);				
					
					$row[]	=	$no.'-'.$exam->exam_id;

					$exam_details=$this->strm->get_exam_details_data(array('exam_id'=>$exam->exam_id));

					if(!empty($exam_details)){
						$details_updated_by=$this->um->_get_internal_user(array('user_id'=>$exam_details->created_by));

						$_details_updated_by=(!empty($details_updated_by))?'Details Upload:'.$details_updated_by->user_fullname:'Details Upload:Not Uploaded Yet';
					}else{
						$_details_updated_by='Details Upload:Not Uploaded Yet';
					}

						

					$news_details=$this->nm->get_news_types(array('news_types'=>'3','news_types_id'=>$exam->exam_id),TRUE);

					$news_updated_by=(!empty($news_details))?$this->um->_get_internal_user(array('user_id'=>$news_details->created_by)):'';

					$_news_updated_by=(!empty($news_updated_by))?'News Upload:'.$news_updated_by->user_fullname:'News Upload:Not Uploaded Yet';

					if($user_role=='1'){
						if($exam->exam_is_top=='yes'){
							$list_top  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="no" data-field="'.encode_data('exam_is_top').'" class="btn btn-xs btn-success btn_change_single_data">Unlist as Top Exam</button>';
						}else if($exam->exam_is_top=='no'){
							$list_top  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="yes" data-field="'.encode_data('exam_is_top').'" class="btn btn-xs btn-warning btn_change_single_data">List as Top Exam</button>';
						}
					}else{
						$list_top='';
					}
					
					if($user_role=='1'){
						if($exam->exam_show_in_widget=='yes'){
							$list_top_widget  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="no" data-field="'.encode_data('exam_show_in_widget').'" class="btn btn-xs btn-success btn_change_single_data">Unlist from Top Exam Widget</button>';
						}else if($exam->exam_show_in_widget=='no'){
							$list_top_widget  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="yes" data-field="'.encode_data('exam_show_in_widget').'" class="btn btn-xs btn-warning btn_change_single_data">List in Top Exam Widget</button>';
						}
					}else{
						$list_top_widget='';
					}

						

					if(in_array('can_upload_exams_news', $this->data['permissions'])){
						$news_article='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/exam_news/'.encode_data($exam->exam_id).'" target="_blank">New & Article</a>';
					}else{
						$news_article='';
					}

					

					// if(in_array('can_upload_exams_details', $this->data['permissions'])){
					// 	if($this->data['userdata']->user_role=='1'){
					// 		$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
					// 	}else{
					// 		if(!empty($exam_details)){
					// 			if($exam_details->created_by==$this->data['userdata']->user_id){
					// 				$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
					// 			}else{
					// 				$_exam_details='';
					// 			}
					// 		}else{
					// 			if($exam->exam_created_by==$this->data['userdata']->user_id){
					// 				$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
					// 			}else{
					// 				$_exam_details='';
					// 			}							
					// 		}
					// 	}												
					// }else{
					// 	if($this->data['userdata']->user_role=='1'){
					// 		$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
					// 	}else{
					// 		$_exam_details='';
					// 	}						
					// }

					if(in_array('can_upload_exams_details', $this->data['permissions'])){
						$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
					}else{
						if($this->data['userdata']->user_role=='1'){
							$_exam_details='<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam->exam_id).'">Details Upload</a>';
						}else{
							$_exam_details='';
						}
					}

					
					$preperation_guide='<button class="btn btn-xs btn-dark btn_prep_guide" data-exam_id="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_short_name.'" data-toggle="modal" data-target="#examPreparatioGuideModal">Preparation Guide Upload</button>';
					
				

					if($this->data['userdata']->user_role=='1'){
						$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam->exam_id));

						// $exam_streams=char_separated_to_array($value->exam_stream_id);

						// if(!empty($exam_streams)){
						// 	foreach ($exam_streams as $key => $value) {
								
						// 	}
						// }

						$inner_menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam->exam_id),FALSE);

						$exam_to_search='<button class="btn btn-xs btn-success btn_add_to_search" data-exam_id="'.$exam->exam_id.'">Add to Search</button>';

						if(!empty($inner_menues)){
							$exam_inner_menu_slug='<button class="btn btn-xs btn-info btn_update_slug_url" data-exam_id="'.$exam->exam_id.'">Update Inner Menu URL</button>';
						}else{
							$exam_inner_menu_slug='';
						}

						

						$exam_slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam->exam_id),TRUE);
						$slug_url='';

						if(!empty($exam_slug_url)){
							// foreach ($exam_slug_url as $key => $value) {
							// 	$slug_url	.=	'<br><span class="btn btn-xs btn-dark">'.$value->slug_value.'</span>';
							// }

							$slug_url	=	'<br><span class="btn btn-xs btn-dark">'.$exam_slug_url->url_value.'</span>';
							$row[]	=	$logo.'<span> <a href="'.$exam_slug_url->url_value.'" target="_blank">'.$exam->exam_short_name.' ('.$exam->country_name.')</a><br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span><br><button type="button" class="btn btn-xs btn-dark">'.$exam_slug->slug_value.'</button>'.$slug_url.'<br><br>'.$list_top.' '.$list_top_widget.' '.$news_article.' '.$_exam_details.' '.$preperation_guide.' '.$exam_inner_menu_slug.' '.$exam_to_search.'<br><br>'.$action;
						}else{
							if(!empty($exam_slug)){
								$row[]	=	$logo.'<span> <a href="'.$exam_slug_url->url_value.'" target="_blank">'.$exam->exam_short_name.' ('.$exam->country_name.')</a><br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span><br><button type="button" class="btn btn-xs btn-dark">'.$exam_slug->slug_value.'</button>'.'<br><br>'.$list_top.' '.$list_top_widget.' '.$news_article.' '.$_exam_details.' '.$preperation_guide.' '.$exam_inner_menu_slug.' '.$exam_to_search.'<br><br>'.$action;
							}else{
								$row[]	=	$logo.'<span> <a href="'.$exam_slug_url->url_value.'" target="_blank">'.$exam->exam_short_name.' ('.$exam->country_name.')</a><br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span><br><br>'.$list_top.' '.$list_top_widget.' '.$news_article.' '.$_exam_details.' '.$preperation_guide.' '.$exam_inner_menu_slug.' '.$exam_to_search.'<br><br>'.$action;
							}
							
						}
						
					}else{
						$exam_inner_menu_slug='';
						if(!empty($exam_slug_url)){
							$row[]	=	$logo.'<span>  <a href="'.$exam_slug_url->url_value.'" target="_blank">'.$exam->exam_short_name.' ('.$exam->country_name.')</a><br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span>'.'<br><br>'.$list_top.' '.$list_top_widget.' '.$news_article.' '.$_exam_details.' '.$preperation_guide.' '.$exam_inner_menu_slug.'<br><br>'.$action;
						}else{
							$row[]	=	$logo.'<span> '.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span>'.'<br><br>'.$list_top.' '.$list_top_widget.' '.$news_article.' '.$_exam_details.' '.$preperation_guide.' '.$exam_inner_menu_slug.'<br><br>'.$action;
						}
						
					}


					// if($exam->exam_is_top=='yes'){
					// 	$row[]  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="2" data-field="'.encode_data('exam_is_popular').'" class="btn btn-xs btn-success btn_change_single_data">Yes</button>';
					// }else if($exam->exam_is_top=='no'){
					// 	$row[]  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="1" data-field="'.encode_data('exam_is_popular').'" class="btn btn-xs btn-warning btn_change_single_data">No</button>';
					// }
										

					// if($exam->exam_is_popular==1){
					// 	$row[]  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="2" data-field="'.encode_data('exam_is_popular').'" class="btn btn-xs btn-success btn_change_single_data">Yes</button>';
					// }else if($exam->exam_is_popular==2){
					// 	$row[]  =	'<button type="button" data-exam="'.encode_data($exam->exam_id).'" data-field_value="1" data-field="'.encode_data('exam_is_popular').'" class="btn btn-xs btn-warning btn_change_single_data">No</button>';
					// }

					


					$row[]=$_details_updated_by.'<br>'.$_news_updated_by.'<br>';

					if($exam->exam_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($exam->exam_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					//$row[]  =	$action;	

					$data[] = 	$row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_exams($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_exams($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchExamDates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');

				$exam_id=decode_data($_exam_id);

				$param['column_order'] = array(
					null,
					'exam_year_short_name'
				);

				$param['column_search'] = array('exam_year_short_name');
				$param['order'] = array('exam_data_id' => 'DESC');
				$posts=$this->input->post();

				$posts['exam_id']=$exam_id;

				$list = $this->strm->_get_exams_dates($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $exam_dates){
					$no++;

					$row = array();

					$row[]	=	$exam_dates->exam_year.'<br><button class="btn btn-xs btn-danger btn_del_exam_dates" data-dates_data_id="'.$exam_dates->exam_data_id.'" data-exam_id="'.encode_data($exam_dates->exam_pk_id).'">Delete</button>';
					$row[]	=	(!empty($exam_dates->exam_application_start_date) && ($exam_dates->exam_application_start_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_application_start_date)):'';

					$row[]	=	(!empty($exam_dates->exam_application_end_date) && ($exam_dates->exam_application_end_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_application_end_date)):'';

					$row[]	=	(!empty($exam_dates->exam_start_date) && ($exam_dates->exam_start_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_start_date)):'';

					$row[]	=	(!empty($exam_dates->exam_end_date) && ($exam_dates->exam_end_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_end_date)):'';

					$row[]	=	(!empty($exam_dates->exam_result_start_date) && ($exam_dates->exam_result_start_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_result_start_date)):'';

					$row[]	=	(!empty($exam_dates->exam_result_end_date) && ($exam_dates->exam_result_end_date!='0000-00-00'))?date('d-m-Y',strtotime($exam_dates->exam_result_end_date)):'';


					if($exam_dates->exam_data_status=='active'){
						$status='<span class="btn btn-xs btn-success">Active</span>';
					}else{
						$status='<span class="btn btn-xs btn-danger">Inactive</span>';
					}

					if($exam_dates->exam_data_upcomming=='yes'){
						$upcomming='<span class="btn btn-xs btn-success">Yes</span>';
					}else{
						$upcomming='<span class="btn btn-xs btn-danger">No</span>';
					}

					$row[]	=	$status;
					$row[]	=	$upcomming;
	

					$data[] = 	$row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_exams_dates($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_exams_dates($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAddExamDates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$_exam_id=post_data('_exam');

				$exam_id=decode_data($_exam_id);

				$current_date=date('Y-m-d');

				$exam_year=post_data('exam_year');
				$application_start_date=post_data('exam_application_start_date');
				$application_end_date=post_data('exam_application_end_date');
				$exam_start_date=post_data('exam_start_date');
				$exam_end_date=post_data('exam_end_date');
				$exam_result_start_date=post_data('exam_result_start_date');
				$exam_result_end_date=post_data('exam_result_end_date');
				$exam_date_status=post_data('exam_date_status');
				$exam_short_desc=post_data('exam_short_desc');

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				$dates_data=$this->strm->get_exam_detailed_data(array('exam_year'=>$exam_year,'exam_pk_id'=>$exam_id));

				if($current_datea>date('Y-m-d',strtotime($exam_start_date))){
					$upcomming='no';
				}else{
					$upcomming='yes';
				}

				if($exam_start_date!=null){
					$exam_dates_data=array(
						'exam_pk_id'=>$exam_id,
						'exam_year'=>$exam_year,
						'exam_year_short_name'=>$exam_data->exam_short_name.' '.$exam_year,
						'exam_year_description'=>(!empty($exam_short_desc))?$exam_short_desc:null,
						'exam_application_start_date'=>(!empty($application_start_date))?date('Y-m-d',strtotime($application_start_date)):null,
						'exam_application_end_date'=>(!empty($application_end_date))?date('Y-m-d',strtotime($application_end_date)):null,
						'exam_start_date'=>(!empty($exam_start_date))?date('Y-m-d',strtotime($exam_start_date)):null,
						'exam_end_date'=>(!empty($exam_end_date))?date('Y-m-d',strtotime($exam_end_date)):null,
						'exam_result_start_date'=>(!empty($exam_result_start_date))?date('Y-m-d',strtotime($exam_result_start_date)):null,
						'exam_result_end_date'=>(!empty($exam_result_end_date))?date('Y-m-d',strtotime($exam_result_end_date)):null,
						'exam_data_status'=>$exam_date_status,
						'exam_data_upcomming'=>$upcomming
					);

					//print_obj($exam_dates_data);die;

					if(!empty($dates_data)){
						$added=$this->strm->update_exam_dates_data($exam_dates_data,array('exam_pk_id'=>$exam_id,'exam_year'=>$exam_year));
						$data_id=$dates_data->exam_data_id;
					}else{
						$added=$this->strm->store_exam_dates_data($exam_dates_data);
						$data_id=$added;
					}

					if($added){
						$this->strm->update_exam_dates_data(array('exam_data_status'=>'inactive',
						'exam_data_upcomming'=>'no'),array('exam_pk_id'=>$exam_id,'exam_data_id!='=>$data_id));
						$return['success']='Exams date added';
					}else{	
						$return['error']='Exams date not added';
					}
				}else{
					$return['error']='At least exam start date needs to be given.';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onDeleteExamDates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');
				$exam_id=decode_data($_exam_id);

				$dates_data_id=post_data('date_data_id');

				//echo $exam_id;die;

				$deleted=$this->strm->delete_exam_dates_data(array('exam_data_id'=>$dates_data_id,'exam_pk_id'=>$exam_id));

				if($deleted){
					$return['success']='Exam dates not deleted';
				}else{
					$return['error']='Exam dates deleted';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateExamSlugUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$exam_id=post_data('_exam_id');

				$current_year=date('Y');
				$prev_year=$current_year-1;

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//print_obj($exam_data);die;


				$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));


				if(!empty($exam_slug)){
					$exam_slug_url=base_url().'exams/'.$exam_slug->slug_value;

					$exam_meta_title=ucwords($exam_data->exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
					$exam_meta_desc=ucwords($exam_data->exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';

					$exam_keywords=generateKeywordsFromText($exam_meta_title);

					$slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam_id));

					$slug_url_data=array(											
						'url_type'=>'exam',
						'url_type_id'=>$exam_id,
						'url_sub_type'=>'exam_inner_default_menu_url',
						'url_sub_type_id'=>null,
						'url_value'=>$exam_slug_url,
						'url_country'=>$exam_data->exam_country,
						'url_meta_heading'=>$exam_meta_title,
						'url_meta_title'=>$exam_meta_title,
						'url_meta_key_words'=>$exam_keywords,
						'url_meta_desc'=>$exam_meta_desc,
						'url_page_heading'=>$exam_meta_title,
						'url_og_title'=>$exam_meta_title,
						'url_og_desc'=>$exam_meta_desc,
					);

					//print_obj($slug_url_data);die;

					if(empty($slug_url)){			
						$added=$this->sm->store_slug_urls($slug_url_data);
					}else{
						$added=$this->sm->update_slug_urls($slug_url_data,array('url_value'=>$exam_slug_url,'url_type'=>'exam','url_type_id'=>$exam_id));
					}

					if($added){
						$menu_found=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id),FALSE);

						//print_obj($menu_found);die;

						if(!empty($menu_found)){
							foreach ($menu_found as $key => $value) {
								if($value->menu_slug=='overview' && $value->menu_name_alias=='Overview'){
									$menu_slug=$exam_slug_url;
								}else{
									$menu_slug=$exam_slug_url.'/'.$value->menu_slug;
								}

								$get_slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam_id,'url_value'=>$menu_slug));

								$inner_slug_url_data=array(											
									'url_type'=>'exam',
									'url_type_id'=>$exam_id,
									'url_sub_type'=>'exam_inner_menu_url',
									'url_sub_type_id'=>$value->menu_id,
									'url_value'=>$menu_slug,
									'url_country'=>$exam_data->exam_country,
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'daily'
								);

								if(empty($get_slug_url)){			
									$this->sm->store_slug_urls($inner_slug_url_data);
								}else{
									$this->sm->update_slug_urls($inner_slug_url_data,array('url_type'=>'exam','url_type_id'=>$exam_id,'url_sub_type'=>'exam_inner_menu_url','url_sub_type_id'=>$value->menu_id));
								}

								$this->sm->update_menu(array('menu_link'=>$menu_slug),array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_id'=>$value->menu_id));
							}
							
						}else{

						}
					}

					$return['success']='Exam slug updated';


					header('Content-Type: application/json');

					echo json_encode($return);
				}else{

				}

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateExamSlugUrls_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$exam_id=post_data('_exam_id');

				$current_year=date('Y');
				$prev_year=$current_year-1;

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//print_obj($exam_data);die;


				$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));
				$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));

				$exam_stream_ids=char_separated_to_array($exam_data->exam_stream_id);

				if(!empty($exam_stream_ids) && is_array($exam_stream_ids)){
					foreach ($exam_stream_ids as $key => $value) {
						$stream_data=$this->strm->get_stream(array('stream_id'=>$value));
						$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value));
						// $exam_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$stream_slug->slug_value.'/'.$exam_slug->slug_value;	

						$exam_slug_url=base_url().'exams/'.$stream_slug->slug_value.'/'.$exam_slug->slug_value;				


						// $exam_stream_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$stream_slug->slug_value;

						$exam_stream_slug_url=base_url().'exams/'.$stream_slug->slug_value;
						$exam_meta_title=ucwords($exam_data->exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
						$exam_meta_desc=ucwords($exam_data->exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
						$exam_stream_meta_title=ucwords($stream_data->stream_name).' Entrance exams in '.ucwords($country_data->country_name);
						$exam_stream_meta_desc='Get latest news about '.ucwords($stream_data->stream_name).' exams to be held in '.$current_year.'-'.$prev_year.'. Apply online, Download Practice Papers and Get result details here.';

						$exam_keywords=generateKeywordsFromText($exam_meta_title);

						$slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam_id,'url_sub_type'=>'exam_stream','url_sub_type_id'=>$value));

						// print_obj($slug_url);die;

						$slug_url_data=array(											
							'url_type'=>'exam',
							'url_type_id'=>$exam_id,
							'url_sub_type'=>'exam_stream',
							'url_sub_type_id'=>$value,
							'url_value'=>$exam_slug_url,
							'url_country'=>$country_data->country_id,
							'url_meta_heading'=>$exam_meta_title,
							'url_meta_title'=>$exam_meta_title,
							'url_meta_key_words'=>$exam_keywords,
							'url_meta_desc'=>$exam_meta_desc,
							'url_page_heading'=>$exam_meta_title,
							'url_og_title'=>$exam_meta_title,
							'url_og_desc'=>$exam_meta_desc,
						);

						//print_obj($slug_url_data);die;

						if(empty($slug_url)){						

							$this->sm->store_slug_urls($slug_url_data);
						}else{

							$this->sm->update_slug_urls($slug_url_data,array('url_value'=>$exam_slug_url,'url_type'=>'exam','url_type_id'=>$exam_id));
						}
					}
				}

				
				$return['success']='Exam slug updated';


				header('Content-Type: application/json');

				echo json_encode($return);


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAddExam(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
			
				$_exam 				= 	post_data('_exam');

				$exam_stream 		= 	$this->input->post('exam_stream');
				$exam_name 			= 	post_data('exam_name');
				$exam_short_name 	= 	post_data('exam_short_name');

				$country 			=	post_data('exam_country');
				$country_id 		=	decode_data($country);

				$exam_type=post_data('exam_type');

				$country_data=$this->com->get_country(array('country_id'=>$country_id));

				$folder_name=date('Y');

				$current_year=date('Y');

				if(!empty($exam_stream) && is_array($exam_stream)){

					foreach ($exam_stream as $key => $value) {
						$es[]=decode_data($value);
					}
					$exam_streams=char_separated(array_filter($es));

					if($exam_type=='2'){
						$exam_state=post_data('exam_state');
						$state_id=decode_data($exam_state);
					}else{
						$state_id=null;
					}

					if(empty($_exam)){
						$exam_data=array(
							'exam_country'=>$country_id,
							'exam_type'=>$exam_type,
							'exam_state'=>$state_id,
							'exam_stream_id'=>$exam_streams,
							'exam_full_name'=>$exam_name,
							'exam_short_name'=>$exam_short_name,
							'exam_created_by'=>$user_id
						);
					}else{
						if($this->data['userdata']->user_role=='1'){
							$exam_data=array(
								'exam_country'=>$country_id,
								'exam_type'=>$exam_type,
								'exam_state'=>$state_id,
								'exam_stream_id'=>$exam_streams,
								'exam_full_name'=>$exam_name,
								'exam_short_name'=>$exam_short_name
							);
						}else{
							$exam_data=array(
								'exam_country'=>$country_id,
								'exam_type'=>$exam_type,
								'exam_state'=>$state_id,
								'exam_stream_id'=>$exam_streams,
								'exam_full_name'=>$exam_name,
								'exam_short_name'=>$exam_short_name,
								'exam_updated_by'=>$user_id
							);
						}
					}
						
				}else{
					// $exam_data=array(
					// 	'exam_country'=>$country_id,
					// 	'exam_type'=>$exam_type,
					// 	'exam_state'=>$state_id,
					// 	'exam_full_name'=>$exam_name,
					// 	'exam_short_name'=>$exam_short_name,
					// 	'exam_created_by'=>$user_id
					// );

					if(empty($_exam)){
						$exam_data=array(
							'exam_country'=>$country_id,
							'exam_type'=>$exam_type,
							'exam_state'=>$state_id,
							'exam_stream_id'=>$exam_streams,
							'exam_full_name'=>$exam_name,
							'exam_short_name'=>$exam_short_name,
							'exam_created_by'=>$user_id
						);
					}else{
						if($this->data['userdata']->user_role=='1'){
							$exam_data=array(
								'exam_country'=>$country_id,
								'exam_type'=>$exam_type,
								'exam_state'=>$state_id,
								'exam_stream_id'=>$exam_streams,
								'exam_full_name'=>$exam_name,
								'exam_short_name'=>$exam_short_name
							);
						}else{
							$exam_data=array(
								'exam_country'=>$country_id,
								'exam_type'=>$exam_type,
								'exam_state'=>$state_id,
								'exam_stream_id'=>$exam_streams,
								'exam_full_name'=>$exam_name,
								'exam_short_name'=>$exam_short_name,
								'exam_updated_by'=>$user_id
							);
						}
					}
				}
				$exam_slug_value=url_slug($exam_short_name);

				if(empty($_exam)){

					$exam_found=$this->strm->_get_exam(null,array('exam_full_name'=>$exam_name,'exam_short_name'=>$exam_short_name));

					//print_obj($exam_found);die;

					if(empty($exam_found)){					

						$added=$this->strm->store_exam_data($exam_data);

						if($added){

							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$added,'slug_value'=>$exam_slug_value));
							$_exam_meta_title=$exam_name.' '.$current_year.'  Registration (Open), Result (Out), Final Answer Key, Admit Card, Syllabus and Cut off';
							$_exam_meta_desc=$exam_name.' Registration '.$current_year;
							$_exam_og_title=$exam_name.' '.$current_year;
							$_exam_og_desc='Follow this link to get information about '.$exam_name;

							if(empty($exam_slug)){
								$exam_slug_id=$this->sm->store_slug(array('slug_type'=>'10','slug_type_id'=>$added,'slug_value'=>$exam_slug_value));
								
							}else{
								$exam_slug_id=$exam_slug->slug_id;
							}

							// $exam_slugs_url=base_url().strtolower($country_data->country_iso_code_2).'/exam/'.$exam_slug_value;

							$exam_slugs_url=base_url().'exams/'.$exam_slug_value;

							$exam_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_slugs_url,'url_type'=>'exam','url_type_id'=>$added));



							if(empty($exam_slug_url)){
								$exam_slug_url_data=array(											
									'url_type'=>'exam',
									'url_sub_type'=>'exam_inner_default_menu_url',
									'url_type_id'=>$added,
									'url_value'=>$exam_slugs_url,
									'url_country'=>$country_id,
									'url_meta_title'=>ucwords($exam_stream_meta_title),
									'url_meta_key_words'=>'',
									'url_meta_desc'=>$exam_stream_meta_desc,
									'url_og_title'=>$_exam_og_title,
									'url_og_desc'=>$_exam_og_desc
								);

								$this->sm->store_slug_urls($exam_slug_url_data);
							}else{
								$exam_slug_url_data=array(											
									'url_type'=>'exam',
									'url_sub_type'=>'exam_inner_default_menu_url',
									'url_type_id'=>$added,
									'url_value'=>$exam_slugs_url,
									'url_country'=>$country_id,
									'url_meta_title'=>ucwords($exam_stream_meta_title),
									'url_meta_key_words'=>'',
									'url_meta_desc'=>$exam_stream_meta_desc,
									'url_og_title'=>$_exam_og_title,
									'url_og_desc'=>$_exam_og_desc
								);

								$this->sm->update_slug_urls($exam_slug_url_data,array('url_value'=>$exam_slugs_url,'url_type'=>'exam','url_type_id'=>$added));
							}

							if(isset($_FILES['exam_logo']) && $_FILES['exam_logo']['name']!=''){

								$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'exam_logo','user_file_type_id'=>$added));

								//print_obj($file_logo_found);die;

								if(!empty($file_logo_found)){
									if(is_file($file_logo_found->media_disk_path)){
										@unlink($file_logo_found->media_disk_path);
										$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
									}
								}

								$logo_data=array(
									'file_size'=>'1',
									'file_name'=>'exam_logo',
									'file_types'=>'png,jpg,jpeg',
									'file_folder'=>'exams',
									'file_child_folder'=>$folder_name,
									'file_compress'=>true,
									'file_compress_protocol'=>'webp',
									'file_uploaded_by'=>$this->data['userdata']->user_id
								);

								$file_id=$this->onUploadFiles($logo_data);

								if(!empty($file_id) && $file_id>0){

									$this->sm->delete_user_file(array('user_file_type_id'=>$added,'user_storage_type'=>'exam_logo'));

						            $exam_logo_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>$added,
						            	'user_file_type'=>'6',
						            	'user_storage_type'=>'exam_logo'
						            );

						            $this->sm->store_user_file($exam_logo_storage_data);
						        } 
							}

							/*if(!empty($es)){
								$prev_year=$current_year-1;
								$ex_streams=array_filter($es);
								foreach ($ex_streams as $key => $value) {
									$ex_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value));
									$stream_data=$this->strm->get_stream(array('stream_id'=>$value));

									if(!empty($ex_stream_slug)){
										$exam_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$ex_stream_slug->slug_value.'/'.url_slug($exam_short_name);
										$exam_stream_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$ex_stream_slug->slug_value;
										$exam_meta_title=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
										$exam_meta_desc=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
										$exam_stream_meta_title=ucwords($stream_data->stream_name).' Entrance exams in '.ucwords($country_data->country_name);
										$exam_stream_meta_desc='Get latest news about '.ucwords($stream_data->stream_name).' exams to be held in '.$current_year.'-'.$prev_year.'. Apply online, Download Practice Papers and Get result details here.';

									}else{										
										$slug_value=url_slug($stream_data->stream_name);
										$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$value,'slug_value'=>$slug_value));
										$exam_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$slug_value.'/'.url_slug($exam_short_name);
										$exam_stream_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$slug_value;
										$exam_meta_title=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
										$exam_meta_desc=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
										$exam_stream_meta_title=ucwords($stream_data->stream_name).' Entrance exams in '.ucwords($country_data->country_name);
										$exam_stream_meta_desc='Get latest news about '.ucwords($stream_data->stream_name).' exams to be held in '.$current_year.'-'.$prev_year.'. Apply online, Download Practice Papers and Get result details here.';
									}

									$stream_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_stream_slug_url,'url_type'=>'exam_stream','url_type_id'=>$value));

									if(empty($stream_slug_url)){
										$stream_slug_url_data=array(											
											'url_type'=>'exam_stream',
											'url_type_id'=>$value,
											'url_value'=>$exam_stream_slug_url,
											'url_country'=>$country_id,
											'url_meta_title'=>ucwords($exam_stream_meta_title),
											'url_meta_key_words'=>'',
											'url_meta_desc'=>$exam_stream_meta_desc
										);

										$this->sm->store_slug_urls($stream_slug_url_data);
									}else{
										$stream_slug_url_data=array(											
											'url_type'=>'exam_stream',
											'url_type_id'=>$value,
											'url_value'=>$exam_stream_slug_url,
											'url_country'=>$country_id,
											'url_meta_title'=>ucwords($exam_stream_meta_title),
											'url_meta_key_words'=>'',
											'url_meta_desc'=>$exam_stream_meta_desc
										);

										$this->sm->update_slug_urls($stream_slug_url_data,array('url_value'=>$exam_stream_slug_url,'url_type'=>'exam_stream','url_type_id'=>$value));
									}
									

									$slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_slug_url,'url_type'=>'exam','url_type_id'=>$added));

									if(empty($slug_url)){
										$slug_url_data=array(											
											'url_type'=>'exam',
											'url_type_id'=>$added,
											'url_value'=>$exam_slug_url,
											'url_country'=>$country_id,
											'url_meta_title'=>$exam_meta_title,
											'url_meta_key_words'=>'',
											'url_meta_desc'=>$exam_meta_desc
										);

										$this->sm->store_slug_urls($slug_url_data);
									}else{
										if($exam_slug_url!=$slug_url->url_value){
											$slug_url_data=array(											
												'url_type'=>'exam',
												'url_type_id'=>$added,
												'url_value'=>$exam_slug_url,
												'url_country'=>$country_id,
												'url_meta_title'=>$exam_meta_title,
												'url_meta_key_words'=>'',
												'url_meta_desc'=>$exam_meta_desc
											);
										}else{
											$slug_url_data=array(											
												'url_type'=>'exam',
												'url_type_id'=>$added,
												'url_country'=>$country_id,
												'url_meta_title'=>$exam_meta_title,
												'url_meta_key_words'=>'',
												'url_meta_desc'=>$exam_meta_desc
											);
										}
											

										$this->sm->update_slug_urls($slug_url_data,array('url_value'=>$exam_slug_url,'url_type'=>'exam','url_type_id'=>$added));
									}
								}
							}

							$system_data_search=$this->sm->get_system_search_data(array('search_data_type'=>'EXAM_NAME','search_data_name'=>$exam_name,'search_data_type_id'=>$added));

							if(empty($system_data_search)){

								$system_data_search_inserted=array('search_data_type'=>'EXAM_NAME','search_data_name'=>$exam_name,'search_data_type_id'=>$added);
								$this->sm->store_system_search_data($system_data_search_inserted);
							}*/
							
							$return['success']='Exam data addedd';
						}else{
							$return['error']='Exam data not added';
						}
					}else{
						$return['error']='Data already exists';
					}
				}else{
					$exam_id=decode_data($_exam);

					//echo $exam_id;
					$exam_found=$this->strm->get_exam(array('exam_id'=>$exam_id));
					if($exam_found){

						//$exam_found2=$this->strm->get_exam(array('exam_id!='=>$exam_id,'exam_short_name'=>$exam_short_name));

						$exam_found2=$this->strm->_get_exam(array('exam_id!='=>$exam_id,'exam_short_name'=>$exam_short_name),array('exam_full_name'=>$exam_name,'exam_short_name'=>$exam_short_name));

						if(empty($exam_found2)){

							$updated=$this->strm->update_exam_data($exam_data,array('exam_id'=>$exam_id));
							if($updated){

								$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id,'slug_value'=>$exam_slug_value));
								$_exam_meta_title=$exam_name.' '.$current_year.'  Registration (Open), Result (Out), Final Answer Key, Admit Card, Syllabus and Cut off';
								$_exam_meta_desc=$exam_name.' Registration '.$current_year;
								$_exam_og_title=$exam_name.' '.$current_year;
								$_exam_og_desc='Follow this link to get information about '.$exam_name;

								if(empty($exam_slug)){
									$exam_slug_id=$this->sm->update_slug(array('slug_value'=>$exam_slug_value),array('slug_type'=>'10','slug_type_id'=>$exam_id));
									
								}else{
									$exam_slug_id=$exam_slug->slug_id;
								}

								//$exam_slugs_url=base_url().strtolower($country_data->country_iso_code_2).'/exam/'.$exam_slug_value;

								$exam_slugs_url=base_url().'exams/'.$exam_slug_value;

								//echo $exam_slugs_url;



								// $exam_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_slugs_url,'url_type'=>'exam','url_type_id'=>$exam_id));

								$exam_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_slugs_url,'url_type'=>'exam'));

								//print_obj($exam_slug_url);die;


								if(empty($exam_slug_url)){
									$exam_slug_url_data=array(											
										'url_type'=>'exam',
										'url_sub_type'=>'exam_inner_default_menu_url',
										'url_type_id'=>$exam_id,
										'url_value'=>$exam_slugs_url,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_meta_title'=>ucwords($_exam_meta_title),
										'url_meta_key_words'=>'',
										'url_meta_desc'=>$_exam_meta_desc,
										'url_og_title'=>$_exam_og_title,
										'url_og_desc'=>$_exam_og_desc
									);

									$this->sm->store_slug_urls($exam_slug_url_data);
								}else{

									//echo 'hi';die;
									$exam_slug_url_data=array(											
										'url_type'=>'exam',
										'url_sub_type'=>'exam_inner_default_menu_url',
										'url_type_id'=>$exam_id,
										'url_value'=>$exam_slugs_url,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_meta_title'=>ucwords($_exam_meta_title),
										'url_meta_key_words'=>'',
										'url_meta_desc'=>$_exam_meta_desc,
										'url_og_title'=>$_exam_og_title,
										'url_og_desc'=>$_exam_og_desc
									);

									$this->sm->update_slug_urls($exam_slug_url_data,array('url_value'=>$exam_slugs_url,'url_type'=>'exam','url_type_id'=>$exam_id));
								}

								if(isset($_FILES['exam_logo']) && $_FILES['exam_logo']['name']!=''){

									$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'exam_logo','user_file_type_id'=>$exam_id));

									//print_obj($file_logo_found);die;

									if(!empty($file_logo_found)){
										if(is_file($file_logo_found->media_disk_path)){
											@unlink($file_logo_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
										}
									}

									$logo_data=array(
										'file_size'=>'1',
										'file_name'=>'exam_logo',
										'file_types'=>'png,jpg,jpeg',
										'file_folder'=>'exams',
										'file_child_folder'=>$folder_name,
										'file_compress'=>true,
										'file_compress_protocol'=>'webp',
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);

									$file_id=$this->onUploadFiles($logo_data);

									if(!empty($file_id) && $file_id>0){

										$this->sm->delete_user_file(array('user_file_type_id'=>$exam_id,'user_storage_type'=>'exam_logo'));

							            $exam_logo_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$exam_id,
							            	'user_file_type'=>'6',
							            	'user_storage_type'=>'exam_logo'
							            );

							            $user_file_id=$this->sm->store_user_file($exam_logo_storage_data);

							            $user_file_link_data=$this->sm->get_user_file(array('user_storage_id'=>$user_file_id,'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$exam_id,
							            	'user_file_type'=>'6',
							            	'user_storage_type'=>'exam_logo'));

							            $searched_data_found=$this->sm->__get_system_search_data(array('search_data_access_url'=>$exam_slugs_url,'search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id));

							            if(!empty($searched_data_found)){

							            	$this->sm->update_system_search_data(array('search_storage_access_url'=>$user_file_link_data->media_disk_path_relative),array('search_data_access_url'=>$exam_slugs_url,'search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id));
							            }
							        } 
								}else{
									$user_file_link_data=$this->sm->get_user_file(array('user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$exam_id,
							            	'user_file_type'=>'6',
							            	'user_storage_type'=>'exam_logo'));

						            $searched_data_found=$this->sm->__get_system_search_data(array('search_data_access_url'=>$exam_slugs_url,'search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id));

						            if(!empty($searched_data_found)){

						            	$this->sm->update_system_search_data(array('search_storage_access_url'=>$user_file_link_data->media_disk_path_relative),array('search_data_access_url'=>$exam_slugs_url,'search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id));
						            }
								}


								$short_detail_data=$this->strm->get_exam_detailed_data(array('exam_year'=>$current_year,'exam_pk_id'=>$exam_id));

								if(empty($short_detail_data)){

									$exam_description=post_data('exam_description');

									$short_details_to_store=array(
										'exam_year'=>$current_year,
										'exam_pk_id'=>$exam_id,
										'exam_year_short_name'=>$exam_short_name.' '.$current_year,
										'exam_year_description'=>$exam_description,
										'exam_data_status'=>'active'
									);

									$this->strm->store_exam_dates_data($short_details_to_store);
								}

								/*if(!empty($es)){									
									$prev_year=$current_year-1;
									$ex_streams=array_filter($es);
									foreach ($ex_streams as $key => $value) {
										$ex_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value));
										$stream_data=$this->strm->get_stream(array('stream_id'=>$value));

										if(!empty($ex_stream_slug)){
											$exam_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$ex_stream_slug->slug_value.'/'.url_slug($exam_short_name);
											$exam_stream_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$ex_stream_slug->slug_value;
											$exam_meta_title=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
											$exam_meta_desc=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
											$exam_stream_meta_title=ucwords($stream_data->stream_name).' Entrance exams in '.ucwords($country_data->country_name);
											$exam_stream_meta_desc='Get latest news about '.ucwords($stream_data->stream_name).' exams to be held in '.$current_year.'-'.$prev_year.'. Apply online, Download Practice Papers and Get result details here.';

										}else{										
											$slug_value=url_slug($stream_data->stream_name);
											$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$value,'slug_value'=>$slug_value));
											$exam_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$slug_value.'/'.url_slug($exam_short_name);
											$exam_stream_slug_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$slug_value;
											$exam_meta_title=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
											$exam_meta_desc=ucwords($exam_short_name).' '.$current_year.' Registration (Open), Result (Out), Final Answer Key, Question Paper, Syllabus and Cut off';
											$exam_stream_meta_title=ucwords($stream_data->stream_name).' Entrance exams in '.ucwords($country_data->country_name);
											$exam_stream_meta_desc='Get latest news about '.ucwords($stream_data->stream_name).' exams to be held in '.$current_year.'-'.$prev_year.'. Apply online, Download Practice Papers and Get result details here.';
										}

										$stream_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_stream_slug_url,'url_type'=>'exam_stream','url_type_id'=>$value));

										if(empty($stream_slug_url)){
											$stream_slug_url_data=array(											
												'url_type'=>'exam_stream',
												'url_type_id'=>$value,
												'url_value'=>$exam_stream_slug_url,
												'url_country'=>$country_id,
												'url_state'=>$state_id,
												'url_meta_title'=>ucwords($exam_stream_meta_title),
												'url_meta_key_words'=>'',
												'url_meta_desc'=>$exam_stream_meta_desc
											);

											$this->sm->store_slug_urls($stream_slug_url_data);
										}else{
											$stream_slug_url_data=array(											
												'url_type'=>'exam_stream',
												'url_type_id'=>$value,
												'url_value'=>$exam_stream_slug_url,
												'url_country'=>$country_id,
												'url_state'=>$state_id,
												'url_meta_title'=>ucwords($exam_stream_meta_title),
												'url_meta_key_words'=>'',
												'url_meta_desc'=>$exam_stream_meta_desc
											);

											$this->sm->update_slug_urls($stream_slug_url_data,array('url_value'=>$exam_stream_slug_url,'url_type'=>'exam_stream','url_type_id'=>$value));
										}
										

										$slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam_id));

										//print_obj($slug_url);die;

										if(empty($slug_url)){
											$slug_url_data=array(											
												'url_type'=>'exam',
												'url_type_id'=>$exam_id,
												'url_value'=>$exam_slug_url,
												'url_country'=>$country_id,
												'url_state'=>$state_id,
												'url_meta_title'=>$exam_meta_title,
												'url_meta_key_words'=>'',
												'url_meta_desc'=>$exam_meta_desc
											);

											$this->sm->store_slug_urls($slug_url_data);
										}else{

											if($exam_slug_url!=$slug_url->url_value){
												$slug_url_data=array(											
													'url_type'=>'exam',
													'url_type_id'=>$exam_id,
													'url_value'=>$exam_slug_url,
													'url_country'=>$country_id,
													'url_state'=>$state_id,
													'url_meta_title'=>$exam_meta_title,
													'url_meta_key_words'=>'',
													'url_meta_desc'=>$exam_meta_desc
												);
											}else{
												$slug_url_data=array(											
													'url_type'=>'exam',
													'url_type_id'=>$exam_id,
													'url_country'=>$country_id,
													'url_state'=>$state_id,
													'url_meta_title'=>$exam_meta_title,
													'url_meta_key_words'=>'',
													'url_meta_desc'=>$exam_meta_desc
												);

												$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'exam','url_type_id'=>$exam_id));
											}
										}
									}
								}*/

								$return['success']='Exam data updated';
							}else{
								$return['error']='Exam data not updated';
							}
						}else{
							$return['error']='Data already exists';
						}

							
					}else{
						$return['error']='Exam not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onDeleteExam(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam=post_data('_exam');

				$exam_id=decode_data($_exam);

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				if($exam_data){

					$deleted=$this->strm->delete_exam_data(array('exam_id'=>$exam_id));

					if($deleted){
						$this->strm->delete_exam_dates_data(array('exam_pk_id'=>$exam_id));
						$this->sm->delete_system_search_data(array('search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id));

						$return['success']='Exam deleted successfully';

					}else{
						$return['error']='Exam can not be deleted at this momment';
					}

				}else{
					$return['error']='Exam data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onChangeSingleExamData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam=post_data('_exam');
				$exam_id=decode_data($_exam);

				$_field=post_data('_field');
				$field=decode_data($_field);

				$field_data=post_data('_field_data');

				$data=array($field=>$field_data);

				$updated=$this->strm->update_exam_data($data,array('exam_id'=>$exam_id));

				if($updated){
					$return['success']='Data updated';
				}else{
					$return['error']='Data not updated';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onAddStreamInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$_stream_id=post_data('_stream');
				$menu_name=post_data('stream_menu_name');
				$menu_status=post_data('stream_menu_status');

				$url_title=post_data('stream_menu_title');

				$stream_menu_fixed_type=post_data('stream_menu_fixed_type');

				$stream_id=decode_data($_stream_id);

				$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

				$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

				//print_obj($stream_slug);die;				

				$slug=url_slug($menu_name);

				$menu_data=$this->sm->get_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id,'menu_slug'=>$slug));

				$total_menues=$this->sm->get_total_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id));

				$serial=$total_menues+1;

				if($stream_menu_fixed_type!='none'){
					if($stream_menu_fixed_type=='overview'){
						$stream_inner_slug=base_url('courses/'.$stream_slug->slug_value);
						$url_sub_type='stream_inner_default_menu_url';
					}else{
						$stream_inner_slug=base_url('courses/'.$stream_slug->slug_value.'/'.$stream_menu_fixed_type);
						$url_sub_type='stream_inner_menu_url';
					}

					$bread_crumb=array(
						'Home'=>base_url(),
						'Courses'=>base_url('courses'),
						ucwords($stream_data->stream_name)=>$stream_inner_slug,
						ucwords($menu_name)=>null
					);
					
					
				}else{
					$stream_inner_slug=base_url('courses/'.$stream_slug->slug_value.'/'.$slug);

					$bread_crumb=array(
						'Home'=>base_url(),
						'Courses'=>base_url('courses'),
						ucwords($stream_data->stream_name)=>$stream_inner_slug,
						ucwords($menu_name)=>null
					);
					$url_sub_type='stream_inner_menu_url';
				}

				$stream_slug_url=$this->sm->get_slug_urls(array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$stream_inner_slug),FALSE);

				$inner_menu_data=array(
					'menu_parent_id'=>'0',
					'menu_link_type'=>'13',
					'menu_is_inner'=>'1',
					'menu_link_id'=>$stream_id,
					'menu_link'=>$stream_inner_slug,
					'menu_name'=>$menu_name,
					'menu_name_alias'=>$menu_name,
					'menu_slug'=>$slug,
					'menu_is_active'=>$menu_status,
					'menu_serial'=>$serial
				);

				//print_obj($inner_menu_data);die;

				$added=$this->sm->store_menu($inner_menu_data);

				if($added){

					$url_meta_key_words=generateKeywordsFromText($url_title);

					$slug_data_to_insert=array(
						'url_type'=>'stream',
						'url_sub_type'=>$url_sub_type,
						'url_type_id'=>$stream_id,
						'url_value'=>$stream_inner_slug,
						'url_sub_type_id'=>$added,
						'url_meta_heading'=>$url_title,
						'url_meta_title'=>$url_title,
						'url_meta_key_words'=>$url_meta_key_words,
						'url_meta_desc'=>$url_title,
						'url_og_title'=>$url_title,
						'url_og_desc'=>$url_title,
						'url_page_heading'=>$url_title,
						'url_page_sub_heading'=>null,
						'url_breadcrumb'=>json_encode($bread_crumb),
						'url_priority'=>'0.8',
						'url_data_change_freq'=>'daily',
						'url_last_update'=>date('Y-m-d H:i:s')
					);

					if(empty($stream_slug_url)){
						$this->sm->store_slug_urls($slug_data_to_insert);
					}else{
						$this->sm->update_slug_urls($slug_data_to_insert,array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$stream_inner_slug));
					}
					

					$return['success']='Menu added';	

				}else{
					$return['error']='Menu not created';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onAddEditStreamInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('_stream_id');

				$menu_id=post_data('menu_id');

				$stream_menu_fixed_type=post_data('stream_menu_fixed_type');

				$menu_name =post_data('stream_menu_name');
				$menu_serial=post_data('stream_inner_menu_serial');
				$menu_status=post_data('stream_menu_status');
				$menu_page_heading=post_data('stream_menu_page_heading');
				$menu_title=post_data('stream_menu_title');
				$menu_desc=post_data('stream_menu_meta_description');
				$menu_keywords=post_data('stream_menu_meta_keywords');
				$menu_og_title=post_data('stream_menu_og_title');
				$menu_og_desc=post_data('stream_menu_og_description');
				$data_search_title=post_data('stream_data_search_title');

				$keywords_value=array();


				//print_obj(json_decode($menu_keywords));

				if(!empty($menu_keywords)){
					$menu_keywords=json_decode($menu_keywords);

					foreach ($menu_keywords as $key => $value) {
						$keywords_value[]=$value->value;
					}

				}

				//$stream_id=decode_data($stream_id);

				//echo $stream_id;

				$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

				//print_obj($stream_data);die;

				$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

				//print_obj($stream_slug);die;

				if(empty($stream_slug)){
					$url_slug=url_slug($stream_data->stream_name);

					$_stream_slug=array(
						'slug_type'=>'3',
						'slug_type_id'=>$stream_id,
						'slug_value'=>$url_slug
					);

					$this->sm->store_slug($_stream_slug);

				}else{
					$url_slug=$stream_slug->slug_value;
				}

				//echo $url_slug;die;

				$menu_keywords=(!empty($keywords_value))?char_separated($keywords_value):null;

				if($menu_id!='' && is_numeric($menu_id) && $menu_id>0){
					$slug=url_slug($menu_name);

					//echo $slug;die;

					if(!empty($stream_data)){

						$menu_data=$this->sm->get_menues(array('menu_id'=>$menu_id));

						if(!empty($menu_data)){

							$date_modified=date('Y-m-d H:i:s');

							if($stream_menu_fixed_type!='none'){
								if($stream_menu_fixed_type=='overview'){
									$stream_inner_slug=base_url('courses/'.$url_slug);
									$url_sub_type='stream_inner_default_menu_url';
								}else{
									$stream_inner_slug=base_url('courses/'.$url_slug.'/'.$stream_menu_fixed_type);
									$url_sub_type='stream_inner_menu_url';
								}

								//echo $stream_inner_slug;die;

								$bread_crumb=array(
									'Home'=>base_url(),
									'Courses'=>base_url('courses'),
									ucwords($stream_data->stream_name)=>$stream_inner_slug,
									ucwords($menu_name)=>null
								);
								
								
							}else{
								$stream_inner_slug=base_url('courses/'.$url_slug.'/'.$slug);

								$bread_crumb=array(
									'Home'=>base_url(),
									'Courses'=>base_url('courses'),
									ucwords($stream_data->stream_name)=>$stream_inner_slug,
									ucwords($menu_name)=>null
								);
								$url_sub_type='stream_inner_menu_url';
							}

							

							$stream_slug_url=$this->sm->get_slug_urls(array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$stream_inner_slug),FALSE);

							$inner_menu_data=array(
								'menu_parent_id'=>'0',
								'menu_link_type'=>'13',
								'menu_is_inner'=>'1',
								'menu_link_id'=>$stream_id,
								'menu_link'=>$stream_inner_slug,
								'menu_name'=>$menu_name,
								'menu_name_alias'=>$menu_name,
								'menu_slug'=>$slug,
								'menu_is_active'=>$menu_status,
								'menu_serial'=>$menu_serial
							);

							$updated=$this->sm->update_menu($inner_menu_data,array('menu_id'=>$menu_id));

							if($updated){

								//<meta property="article:modified_time" content="2022-11-25T10:34:48+05:30">

								$slug_data_to_insert=array(
									'url_type'=>'stream',
									'url_sub_type'=>$url_sub_type,
									'url_glob_type'=>'stream_inner_menu',
									'url_type_id'=>$stream_id,
									'url_value'=>$stream_inner_slug,
									'url_canonical_value'=>$stream_inner_slug,
									'url_sub_type_id'=>$menu_id,
									'url_meta_heading'=>$menu_title,
									'url_meta_title'=>$menu_title,
									'url_meta_key_words'=>$menu_keywords,
									'url_meta_desc'=>$menu_desc,
									'url_og_type'=>'article',
									'url_og_title'=>$menu_og_title,
									'url_og_desc'=>$menu_og_desc,
									'url_twitter_title'=>$menu_og_title,
									'url_twitter_desc'=>$menu_og_desc,
									'url_page_heading'=>$menu_page_heading,
									'url_page_sub_heading'=>null,
									'url_breadcrumb'=>json_encode($bread_crumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'daily',
									'url_last_update'=>$date_modified,
									'updated_by'=>$this->data['userdata']->user_id,
									'updated_at'=>$date_modified
								);

								if(empty($stream_slug_url)){
									$this->sm->store_slug_urls($slug_data_to_insert);
								}else{
									$this->sm->update_slug_urls($slug_data_to_insert,array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$stream_inner_slug));
								}


								if(!empty($data_search_title)){
									
									$search_data=$this->sm->__get_system_search_data(array('search_data_type'=>'STREAM_MENU_NAME','search_data_type_id'=>$stream_id,'search_data_type_menu_id'=>$menu_id));

									$search_data_to_insert=array(
										'search_data_type_id'=>$stream_id,
										'search_data_type_menu_id'=>$menu_id,
										'search_data_type'=>'STREAM_MENU_NAME',
										'search_data_name'=>$data_search_title,
										'search_data_short_name'=>$stream_data->stream_name,
										'search_data_stream_name'=>$stream_data->stream_name,
										'search_data_meta_title'=>$menu_title,
										'search_data_meta_desc'=>$menu_desc,
										'search_data_meta_keywords'=>$menu_keywords,
										'search_data_og_title'=>$menu_og_title,
										'search_data_og_desc'=>$menu_og_desc,
										'search_data_access_url'=>$stream_inner_slug,
										'search_storage_access_url'=>null
									);

									if(!empty($search_data)){
										$this->sm->update_system_search_data($search_data_to_insert,array('search_data_type'=>'STREAM_MENU_NAME','search_data_type_id'=>$stream_id,'search_data_type_menu_id'=>$menu_id));
									}else{
										$this->sm->store_system_search_data($search_data_to_insert);
									}
								}


								$return['success']='menu data has been updated successfully.';


							}else{
								$return['error']='Menu not updated';
							}


						}else{
							$return['error']='Menu data not found.';
						}


					}else{
						$return['error']='Stream data not found.';
					}

				}else{
					$slug=url_slug($menu_name);
					$menu_data=$this->sm->get_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id,'menu_slug'=>$slug));

					//print_obj($menu_data);die;

					if(empty($menu_data)){
						$total_menu_count=$this->sm->get_menues_count(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id));

						$menu_serial=$total_menu_count+1;

						$date_modified=date('Y-m-d H:i:s');

						if($stream_menu_fixed_type!='none'){
							if($stream_menu_fixed_type=='overview'){
								$stream_inner_slug=base_url('courses/'.$url_slug);
								$url_sub_type='stream_inner_default_menu_url';
							}else{
								$stream_inner_slug=base_url('courses/'.$url_slug.'/'.$stream_menu_fixed_type);
								$url_sub_type='stream_inner_menu_url';
							}



							$bread_crumb=array(
								'Home'=>base_url(),
								'Courses'=>base_url('courses'),
								ucwords($stream_data->stream_name)=>$stream_inner_slug,
								ucwords($menu_name)=>null
							);
							
							
						}else{
							$stream_inner_slug=base_url('courses/'.$url_slug.'/'.$slug);

							//echo $stream_menu_fixed_type;

							$bread_crumb=array(
								'Home'=>base_url(),
								'Courses'=>base_url('courses'),
								ucwords($stream_data->stream_name)=>$stream_inner_slug,
								ucwords($menu_name)=>null
							);
							$url_sub_type='stream_inner_menu_url';
						}

						//echo $stream_inner_slug;die;


						$inner_menu_data=array(
							'menu_parent_id'=>'0',
							'menu_link_type'=>'13',
							'menu_is_inner'=>'1',
							'menu_link_id'=>$stream_id,
							'menu_link'=>$stream_inner_slug,
							'menu_name'=>$menu_name,
							'menu_name_alias'=>$menu_name,
							'menu_slug'=>$slug,
							'menu_is_active'=>$menu_status,
							'menu_serial'=>$menu_serial
						);

						//print_obj($inner_menu_data);die;

						$updated=$this->sm->store_menu($inner_menu_data);

						if($updated){

							$return['success']='Menu data has been updated successfully.';

						}else{
							$return['error']='Menu not added';
						}


					}else{
						$return['error']='Menu data already found.';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}
	}

	public function onDeleteStreamInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('stream_id');
				$stream_menu_id=post_data('stream_menu_id');

				$menu_data=$this->sm->get_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id,'menu_id'=>$stream_menu_id));

				if(!empty($menu_data)){

					$deleted=$this->sm->delete_menu(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_id,'menu_id'=>$stream_menu_id));

					if($deleted){

						$stream_slug_url=$this->sm->get_slug_urls(array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$menu_data->menu_link),FALSE);

						if(!empty($stream_slug_url)){
							$this->sm->delete_slug_urls(array('url_type'=>'stream','url_type_id'=>$stream_id,'url_value'=>$menu_data->menu_link));
						}

						$return['success']='Menu has been deleted successfully.';

					}else{
						$return['error']='Menu not deleted.';
					}


				}else{
					$return['error']='Menu data not found in the system.';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onLoadStreamInnerMenuFormData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('stream_id');
				$stream_menu_id=post_data('stream_menu_id');

				//echo $college_id;die;

				$stream_menu_data=$this->sm->get_menues(array('menu_id'=>$stream_menu_id));

				//print_obj($college_menu_data);die;

				if(!empty($stream_menu_data)){

					$this->data['search_data']=$this->sm->__get_system_search_data(array('search_data_type'=>'STREAM_MENU_NAME','search_data_type_id'=>$stream_id,'search_data_type_menu_id'=>$stream_menu_id));


					$this->data['menu_slug_data']=$this->sm->get_slug_urls(array('url_type_id'=>$stream_id,'url_value'=>$stream_menu_data->menu_link));

					//print_obj($this->data['menu_slug_data']);die;


					$this->data['stream_menu_data']=$stream_menu_data;
					$this->data['stream_id']=$stream_id;


					//print_obj($this->data['college_menu_data']);die;


					$return['html']=$this->theme->view('_pages/streams/vw_streams_inner_menues',$this->data,true);


				}else{
					$return['error']='Menu data not available.';
				}

				json_headers($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddExamInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				//print_obj($_POST);die;

				$_exam_id=post_data('_exam');
				$menu_name=post_data('exam_menu_name');
				$menu_status=post_data('exam_menu_status');

				$exam_parent_menu=post_data('exam_parent_menu');

				$url_title=post_data('exam_menu_title');
				$exam_menu_sub_title=post_data('exam_menu_sub_title');
				$exam_menu_description=post_data('exam_menu_description');
				$exam_menu_keywords=post_data('exam_menu_keywords');


				$exam_menu_fixed_type=$this->input->post('exam_menu_type');

				$exam_menu_order=post_data('exam_menu_order');

				$exam_id=decode_data($_exam_id);

				//echo $exam_id;die;

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//print_obj($exam_data);die;				

				//$exam_slug=$this->sm->get_slug_urls(array('url_type'=>'exam','url_sub_type'=>'exam_inner_default_menu_url','url_type_id'=>$exam_id),FALSE);

				$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));

				//print_obj($exam_slug);die;

				$slug=url_slug($menu_name);

				//echo $exam_menu_fixed_type;die;

				if($exam_menu_fixed_type!=='overview'){
					$exam_inner_slug=base_url('exams/'.$exam_slug->slug_value.'/'.$slug);
				}else{
					$exam_inner_slug=base_url('exams/'.$exam_slug->slug_value);
				}

				//print_obj($exam_inner_slug);die;

				$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));				

				$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_slug'=>$slug));

				$total_menues=$this->sm->get_total_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id));

				$serial=$total_menues+1;


				$inner_menu_data=array(
					'menu_parent_id'=>$exam_parent_menu,
					'menu_link_type'=>'12',
					'menu_is_inner'=>'1',
					'menu_fixed_type'=>$exam_menu_fixed_type,
					'menu_link_id'=>$exam_id,
					'menu_link'=>$exam_inner_slug,
					'menu_name'=>$menu_name,
					'menu_name_alias'=>$menu_name,
					'menu_slug'=>$slug,
					'menu_is_active'=>$menu_status,
					'menu_serial'=>$exam_menu_order
				);

				//print_obj($inner_menu_data);die;


				if(!empty($menu_data)){
					$added=$this->sm->update_menu($inner_menu_data,array('menu_id'=>$menu_data->menu_id,'menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id));
					$menu_id=$menu_data->menu_id;
				}else{
					$added=$this->sm->store_menu($inner_menu_data);
					$menu_id=$added;
				}


				if($added){

					$get_new_slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_glob_type'=>'exam_inner_menu','url_type_id'=>$exam_id,'url_sub_type_id'=>$menu_id));

					//$get_new_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_inner_slug));

					//print_obj($exam_menu_keywords);

					if(!empty($exam_menu_keywords)){
						$jd=json_decode($exam_menu_keywords);
						foreach ($jd as $key => $value) {
							$url_meta_key_words[]=$value->value;
						}

						$meta_keywords=implode(',',$url_meta_key_words);
					}else{
						$meta_keywords='';
					}
					


					//print_obj($meta_keywords);die;

					if($slug=='overview'){
						$bread_crumb=array(
							'Home'=>base_url(),
							'Exams ( '.$country_data->country_name.' )'=>base_url().'exams',
							ucwords($exam_data->exam_short_name).'( '.$exam_data->exam_full_name.' )'=>null
						);
						$url_sub_type='exam_inner_default_menu_url';
					}else{
						$bread_crumb=array(
							'Home'=>base_url(),
							'Exams ( '.$country_data->country_name.' )'=>base_url().'exams',
							ucwords($exam_data->exam_short_name).'( '.$exam_data->exam_full_name.' )'=>$exam_slug->url_value,
							ucwords($menu_name)=>null
						);
						$url_sub_type='exam_inner_menu_url';
					}

					if(empty($get_new_slug_url)){
						$slug_data=array(
							'url_type'=>'exam',
							'url_sub_type'=>$url_sub_type,
							'url_sub_type_id'=>$menu_id,
							'url_glob_type'=>'exam_inner_menu',
							'url_type_id'=>$exam_id,
							'url_value'=>$exam_inner_slug,
							'url_meta_heading'=>$url_title,
							'url_meta_title'=>$url_title,
							'url_meta_key_words'=>$meta_keywords,
							'url_meta_desc'=>$exam_menu_description,
							'url_og_title'=>$url_title,
							'url_og_desc'=>$exam_menu_description,
							'url_page_heading'=>$url_title,
							'url_page_sub_heading'=>$exam_menu_sub_title,
							'url_breadcrumb'=>json_encode($bread_crumb),
							'url_priority'=>'0.7',
							'url_data_change_freq'=>'daily',
							'url_last_update'=>date('Y-m-d H:i:s')
						);								

						$this->sm->store_slug_urls($slug_data);
					}else{
						$slug_data=array(
							'url_type'=>'exam',
							'url_sub_type'=>$url_sub_type,
							'url_glob_type'=>'exam_inner_menu',
							'url_type_id'=>$exam_id,
							'url_sub_type_id'=>$menu_id,
							'url_value'=>$exam_inner_slug,
							'url_meta_heading'=>$url_title,
							'url_meta_title'=>$url_title,
							'url_meta_key_words'=>$meta_keywords,
							'url_meta_desc'=>$exam_menu_description,
							'url_og_title'=>$url_title,
							'url_og_desc'=>$exam_menu_description,
							'url_page_heading'=>$url_title,
							'url_page_sub_heading'=>$exam_menu_sub_title,
							'url_breadcrumb'=>json_encode($bread_crumb),
							'url_priority'=>'0.7',
							'url_data_change_freq'=>'daily',
							'url_last_update'=>date('Y-m-d H:i:s')
						);

						//print_obj($slug_data);die;


						$this->sm->update_slug_urls($slug_data,array('url_id'=>$get_new_slug_url->url_id));
					}

					if(!empty($menu_data)){
						$msg='Menu updated';
					}else{
						$msg='Menu added';
					}

					$back_link=$this->data['admin_base_url'].'/streams/exams/'.encode_data($exam_id);

					$return['redirect']=$back_link;
					$return['success']=$msg;
				}else{
					$return['error']='Menu not created';
				}
				
			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onDeleteExamInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('exam_id');
				$exam_menu_id=post_data('exam_menu_id');
				$exam_id=decode_data($_exam_id);

				//echo $exam_id;

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//print_obj($exam_data);die;

				if(!empty($exam_data)){
					$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_id'=>$exam_menu_id));

					if(!empty($menu_data)){
						
						$menu_details_data=$this->strm->get_exam_details_data(array('exam_menu_id'=>$exam_menu_id,'exam_id'=>$exam_id));

						$deleted=$this->sm->delete_menu(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_id'=>$exam_menu_id));

						if($deleted){
							$this->strm->delete_exams_details_data(array('exam_menu_id'=>$exam_menu_id,'exam_id'=>$exam_id));
							$this->sm->delete_system_search_data(array('search_data_type'=>'EXAM_NAME','search_data_type_id'=>$exam_id,'search_data_access_url'=>$menu_details_data->menu_link));
							$this->sm->delete_slug_urls(array('url_type'=>'exam','url_glob_type'=>'exam_inner_menu','url_type_id'=>$exam_id,'url_sub_type_id'=>$exam_menu_id));
						}

						$return['success']='Menu deleted successfully.';
					}else{
						$return['error']='Menu not found.';
					}
				}else{
					$return['error']='Exam not found in the system.';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onAddStreamDetails(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_stream=post_data('_stream');
				$_stream_menu=post_data('_stream_menu');
				//$_stream_menu_data_id=post_data('_stream_menu_data_id');

				$stream_details=$this->input->post('stream_details');

				$stream_faqus=$this->input->post('stream_faqus');

				$user_id=decode_data(session_userdata('admin_id'));

				$stream_id=decode_data($_stream);
				$stream_menu=decode_data($_stream_menu);
				//$exam_menu_data_id=decode_data($_exam_menu_data_id);

				//echo $exam_menu;die;

				$details_data=$this->strm->get_stream_details_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$stream_menu));

				$menu_data=$this->sm->get_menues(array('menu_id'=>$stream_menu,'menu_link_type'=>'13'));

				//$this->add_strcut_data($stream_id,$stream_menu,$this->data['userdata']->user_id);die;

				if($menu_data->menu_slug=='all-courses'){

					$course_list_group=$this->input->post('course_list_group');

					foreach ($course_list_group as $key => $value) {

						$exp=explode('#', $value);
						$data_value_id=$exp[0];
						$data_value_type=$exp[1];

						if($data_value_type=='course'){
							$datas=$this->strm->get_course(array('course_id'=>$data_value_id));
							$data_type_value=$datas->course_name;
							$data_type_value_code=null;
						}else if($data_value_type=='ads'){
							$datas=$this->um->get_listing_package_users(array('listing_id'=>$data_value_id));
							$data_type_value=$datas->listing_name;
							$data_type_value_code=$data->courses_data_type_value_code;
						}

						$data_to_store[]=array(
							'courses_data_type_id'=>$data_value_id,
							'courses_data_type'=>$data_value_type,
							'courses_data_type_menu_id'=>$stream_menu,
							'courses_data_type_stream_id'=>$stream_id,
							'courses_data_type_serial'=>$key,
							'courses_data_type_value'=>$data_type_value,
							'courses_data_type_value_code'=>$data_type_value_code
						);
					}

					if(!empty($data_to_store)){
						$this->strm->delete_stream_details_courses_data(array('courses_data_type_menu_id'=>$stream_menu,'courses_data_type_stream_id'=>$stream_id));
						$added=$this->strm->store_stream_details_courses_data($data_to_store,TRUE);
						if($added){
							$return['success']='Stream details added successfully';
						}else{
							$return['error']='Stream details not added';
						}
					}else{
						$return['error']='No data selected to add';
					}

				}else{
					if(!empty($stream_details)){
						if(!empty($details_data)){
							$this->strm->delete_stream_details_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$stream_menu));
						}
						$i=1;
						foreach ($stream_details as $key => $value) {

							if($value['data_type']=='general'){
								$data_type_value=null;
							}else if($value['data_type']=='image'){
								$data_type_value=decode_data($value['data_type_value']);
							}else if($value['data_type']=='ads'){
								$data_type_value=decode_data($value['data_type_value']);
							}


							$data_to_store[]=array(
								'stream_id'=>$stream_id,
								'stream_menu_id'=>$stream_menu,
								'stream_data_type'=>$value['data_type'],
								'stream_data_type_id'=>$data_type_value,
								'stream_content'=>$value['stream_content'],
								'stream_serial'=>$i,
								'created_by'=>$user_id,
								'created_at'=>date('Y-m-d')
							);

							$i++;
						}

						$added=$this->strm->store_stream_details_data($data_to_store,TRUE);

						if($added){
							if(!empty($stream_faqus)){
								$this->strm->delete_stream_details_faq_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$stream_menu));

								$j=1;
								foreach ($stream_faqus as $key => $value) {
									$faq_data[]=array(
										'stream_id'=>$stream_id,
										'stream_menu_id'=>$stream_menu,
										'stream_data_faq_ques'=>$value['ques'],
										'stream_data_faq_ans'=>$value['ans'],
										'stream_data_faq_serial'=>$j,
										'created_by'=>$user_id
									);

									$j++;
								}

								$this->strm->store_stream_details_faq_data($faq_data,TRUE);
							}
								
							//$this->add_strcut_data($stream_id,$stream_menu,$this->data['userdata']->user_id);
							$return['success']='Stream details added successfully';
						}else{
							$return['error']='Data not saved';
						}
					}else{
						$return['error']='No data added.';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);	

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		
	}


	public function onAddCourseInnerMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				//print_obj($_POST);die;

				$course_id=post_data('_course');
				$menu_id=post_data('_course_menu');
				$menu_status=post_data('course_menu_status');

				$menu_name=post_data('course_menu_name');

				$exam_parent_menu=post_data('course_parent_menu');

				$url_title=post_data('course_menu_title');
				$course_menu_page_heading=post_data('course_menu_page_heading');
				$exam_menu_sub_title=post_data('course_menu_sub_title');
				$exam_menu_description=post_data('course_menu_description');
				$exam_menu_keywords=post_data('course_menu_keywords');


				$exam_menu_fixed_type=$this->input->post('course_menu_type');

				$course_strcut_data_headline=post_data('course_strcut_data_headline');
				$course_strcut_data_desc=post_data('course_strcut_data_desc');
				$course_strcut_data_body=post_data('course_strcut_data_body');

				

				//$course_id=decode_data($_exam_id);

				//echo $exam_id;die;

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				//print_obj($exam_data);die;				

				//$exam_slug=$this->sm->get_slug_urls(array('url_type'=>'exam','url_sub_type'=>'exam_inner_default_menu_url','url_type_id'=>$exam_id),FALSE);

				$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

				//print_obj($course_slug);die;

				

				//echo $slug;die;

				//echo $exam_menu_fixed_type;die;

				if($menu_name=='overview' || $menu_name=='Overview'){
					$course_inner_slug=base_url('courses/'.$course_slug->slug_value);
					$menu_name='Overview';
					$slug='overview';
				}else{
					$slug=url_slug($menu_name);
					$course_inner_slug=base_url('courses/'.$course_slug->slug_value.'/'.$slug);
				}

				//print_obj($course_inner_slug);die;

				$country_data=$this->com->get_country(array('country_id'=>'99'));				

				$menu_data=$this->sm->get_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id,'menu_id'=>$menu_id));

				$total_menues=$this->sm->get_total_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id));

				$serial=$total_menues+1;


				$inner_menu_data=array(
					'menu_parent_id'=>$exam_parent_menu,
					'menu_link_type'=>'20',
					'menu_is_inner'=>'1',
					'menu_fixed_type'=>$exam_menu_fixed_type,
					'menu_link_id'=>$course_id,
					'menu_link'=>$course_inner_slug,
					'menu_name'=>$menu_name,
					'menu_name_alias'=>strtolower($menu_name),
					'menu_slug'=>$slug,
					'menu_is_active'=>$menu_status,
					'menu_serial'=>$serial
				);

				//print_obj($inner_menu_data);die;


				if(!empty($menu_data)){
					$added=$this->sm->update_menu($inner_menu_data,array('menu_id'=>$menu_id,'menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id));
					$menu_id=$menu_data->menu_id;
				}else{
					$added=$this->sm->store_menu($inner_menu_data);
					$menu_id=$added;
				}


				if($added){

					$get_new_slug_url=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_glob_type'=>'course_inner_menu_url','url_type_id'=>$course_id,'url_sub_type_id'=>$menu_id));

					if(empty($get_new_slug_url)){
						$get_new_slug_url=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_glob_type'=>'course_inner_menu_url','url_type_id'=>$course_id,'url_value'=>$course_inner_slug));
						
					}else if(!empty($get_new_slug_url)){
						//$get_new_slug_url=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_glob_type'=>'course_inner_menu_url','url_type_id'=>$course_id,'url_value'=>$course_inner_slug));

						if(empty($get_new_slug_url->url_value)){
							$this->sm->delete_slug_urls(array('url_id'=>$get_new_slug_url->url_id));
						}
					}

					//$get_new_slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_inner_slug));

					//print_obj($get_new_slug_url);die;

					if(!empty($exam_menu_keywords)){
						$jd=json_decode($exam_menu_keywords);
						foreach ($jd as $key => $value) {
							$url_meta_key_words[]=$value->value;
						}

						$meta_keywords=implode(',',$url_meta_key_words);
					}else{
						$meta_keywords='';
					}

					//print_obj($meta_keywords);die;

					if($menu_name=='overview' || $menu_name=='Overview'){
						$bread_crumb=array(
							'Home'=>base_url(),
							'Courses ( '.$country_data->country_name.' )'=>base_url().'courses',
							ucwords($course_data->course_short_name).'( '.$course_data->course_name.' )'=>null
						);
					}else{
						$bread_crumb=array(
							'Home'=>base_url(),
							'Courses ( '.$country_data->country_name.' )'=>base_url().'courses',
							ucwords($course_data->course_short_name).'( '.$course_data->course_name.' )'=>$course_slug->url_value,
							ucwords($menu_name)=>null
						);						
					}

					$url_sub_type='course_inner_menu';

					if(empty($get_new_slug_url)){
						$slug_data=array(
							'url_type'=>'course_static_url',
							'url_sub_type'=>$url_sub_type,
							'url_sub_type_id'=>$menu_id,
							'url_glob_type'=>'course_inner_menu_url',
							'url_type_id'=>$course_id,
							'url_value'=>$course_inner_slug,
							'url_canonical_value'=>$course_inner_slug,
							'url_permalink_value'=>$course_inner_slug,
							'url_meta_heading'=>$url_title,
							'url_meta_title'=>$url_title,
							'url_meta_key_words'=>$meta_keywords,
							'url_meta_desc'=>$exam_menu_description,
							'url_og_title'=>$url_title,
							'url_og_desc'=>$exam_menu_description,
							'url_page_heading'=>$course_menu_page_heading,
							'url_page_sub_heading'=>$exam_menu_sub_title,
							'url_breadcrumb'=>json_encode($bread_crumb),
							'url_priority'=>'0.7',
							'url_data_change_freq'=>'daily',
							'url_last_update'=>date('Y-m-d H:i:s')
						);								

						$slug_url_id=$this->sm->store_slug_urls($slug_data);
					}else{
						$slug_data=array(
							'url_type'=>'course_static_url',
							'url_sub_type'=>$url_sub_type,
							'url_sub_type_id'=>$menu_id,
							'url_glob_type'=>'course_inner_menu_url',
							'url_type_id'=>$course_id,
							'url_value'=>$course_inner_slug,
							'url_canonical_value'=>$course_inner_slug,
							'url_permalink_value'=>$course_inner_slug,
							'url_meta_heading'=>$url_title,
							'url_meta_title'=>$url_title,
							'url_meta_key_words'=>$meta_keywords,
							'url_meta_desc'=>$exam_menu_description,
							'url_og_title'=>$url_title,
							'url_og_desc'=>$exam_menu_description,
							'url_page_heading'=>$course_menu_page_heading,
							'url_page_sub_heading'=>$exam_menu_sub_title,
							'url_breadcrumb'=>json_encode($bread_crumb),
							'url_priority'=>'0.7',
							'url_data_change_freq'=>'daily',
							'url_last_update'=>date('Y-m-d H:i:s')
						);

						//print_obj($slug_data);die;


						$this->sm->update_slug_urls($slug_data,array('url_id'=>$get_new_slug_url->url_id));

						$slug_url_id=$get_new_slug_url->url_id;
					}

					if(!empty($menu_data)){

						if(!empty($course_strcut_data_headline) && !empty($course_strcut_data_desc) && !empty($course_strcut_data_body) && !empty($exam_menu_keywords)){

							$datePublished=date('c');

							$schema='{"@context": "https://schema.org","@type": "NewsArticle","inLanguage":"en","mainEntityOfPage": {"@type": "WebPage","@id": "'.base_url().'","name":"'.$course_strcut_data_headline.'"},"headline": "'.$course_strcut_data_headline.'","datePublished": "'.$datePublished.'","dateModified": "'.$datePublished.'","author": {"@type": "Organization","name": "Sikshapedia"},"publisher": {"@type": "Organization","name": "Sikshapedia","logo": {"@type": "ImageObject","url": "https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp","height":280,"width":1476}},"description": "'.strip_tags($course_strcut_data_desc).'","articleBody": "'.$course_strcut_data_body.'","keywords": "'.$meta_keywords.'","url": "'.$course_inner_slug.'"}';

							$slug_type_json_meta_data='{"headline": "'.$course_strcut_data_headline.'","description": "'.$course_strcut_data_desc.'","articleBody": "'.$course_strcut_data_body.'"}';

							$sruct_data=array(
								'strcut_slug_url_id'=>$slug_url_id,
								'slug_type_json_ld'=>'NewsArticle',
								'slug_type_json_ld_data'=>$schema,
								'slug_url'=>$course_inner_slug,
								'slug_type_json_meta_data'=>$slug_type_json_meta_data,
								'date_modified'=>date('Y-m-d H:i:s'),
								'date_published'=>date('Y-m-d H:i:s')
							);

							$get_slug_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'NewsArticle'));

							if(!empty($get_slug_struct_data)){
								$this->sm->update_slug_struct_data($sruct_data,array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'NewsArticle'));
							}else{
								$this->sm->store_slug_struct_data($sruct_data);
							}
						}

						// $context_schema='{"@context": "http://schema.org","@type": "Organization","url": "'.base_url().'","logo": {"@type": "ImageObject","url": "https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp","height":280,"width":1476},"name": "Sikshapedia","sameAs": ["https://www.instagram.com/sikshapedia/","https://www.facebook.com/sikshapedia/","https://twitter.com/sikshapedia","https://www.youtube.com/channel/UCQH2ccZchgrrOhBvS5npC-g"]}';


						// $csruct_data=array(
						// 	'strcut_slug_url_id'=>$slug_url_id,
						// 	'slug_type_json_ld'=>'Organization',
						// 	'slug_type_json_ld_data'=>$context_schema,
						// 	'slug_url'=>$course_inner_slug,
						// 	'slug_type_json_meta_data'=>null,
						// 	'date_modified'=>date('Y-m-d H:i:s'),
						// 	'date_published'=>date('Y-m-d H:i:s')
						// );

						// $_get_slug_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'Organization'));

						// if(!empty($_get_slug_struct_data)){
						// 	$this->sm->update_slug_struct_data($csruct_data,array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'Organization'));
						// }else{
						// 	$this->sm->store_slug_struct_data($csruct_data);
						// }


						$cc_schema='{"@context": "https://schema.org","@type": "WebPage","breadcrumb": {"@type": "BreadcrumbList","itemListElement": [{"@type": "ListItem","position": 1,"name": "Home","item": "'.base_url().'"},{"@type": "ListItem","position": 2,"name": "Courses","item": "'.base_url().'/courses"},{"@type": "ListItem","position": 3,"name": "'.ucwords($course_data->course_short_name).'( '.$course_data->course_name.' )'.'","item": "'.$course_inner_slug.'"}]}}';

						$ccsruct_data=array(
							'strcut_slug_url_id'=>$slug_url_id,
							'slug_type_json_ld'=>'BreadcrumbList',
							'slug_type_json_ld_data'=>$cc_schema,
							'slug_url'=>$course_inner_slug,
							'slug_type_json_meta_data'=>null,
							'date_modified'=>date('Y-m-d H:i:s'),
							'date_published'=>date('Y-m-d H:i:s')
						);


						$ccget_slug_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'BreadcrumbList'));

						if(!empty($ccget_slug_struct_data)){
							$this->sm->update_slug_struct_data($ccsruct_data,array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'BreadcrumbList'));
						}else{
							$this->sm->store_slug_struct_data($ccsruct_data);
						}


						$msg='Menu updated';
					}else{
						$msg='Menu added';
					}

					$this->output->delete_cache($course_inner_slug);

					$back_link=$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course_id);

					$return['redirect']='';
					$return['success']=$msg;
				}else{
					$return['error']='Menu not created';
				}
				
			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}



	public function add_strcut_data($stream_id,$menu_id,$user_id){

		$stream_slug_url=$this->sm->get_slug_urls(array('url_type'=>'stream','url_type_id'=>$stream_id,'url_sub_type_id'=>$menu_id),TRUE);

		$stream_details_data=$this->strm->get_stream_details_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_id),FALSE);

		$date_modified=$stream_slug_url->url_last_update;
		$date_published=(!empty($stream_details_data))?$stream_details_data[0]->created_at:date('Y-m-d H:i:s');

		$_datem=date_create($date_modified);
		$datem=date_format($_datem,"c");

		$_datep=date_create($date_published);
		$datep=date_format($_datep,"c");

		$internal_user=$this->um->get_internal_users(array('user_id'=>$user_id));

		
		//print_obj($stream_slug_url);die;

		if(!empty($stream_slug_url)){
			$bredcrumb=$stream_slug_url->url_breadcrumb;

			$itemListElement=array();
			$stream_details_data_arr='';
			$_faq_data_json='';

			if(!empty($bredcrumb)){
				$_breadcrumb=json_decode($bredcrumb);

				//print_obj($_breadcrumb);die;

				//print_obj($_breadcrumb);die;
				$position=1;
				foreach ($_breadcrumb as $key => $value) {
					$itemListElement[]=array(
						'@type'=>'ListItem',
						'position'=>$position,
						'name'=>$key,
						'item'=>$value
					);					

					$position++;
				}

				if(!empty($itemListElement)){
					$BreadcrumbList='{
						   "@context":"http://schema.org/",
						   "@type":"WebPage",
						   "breadcrumb":{
						      "@type":"BreadcrumbList",
						      "itemListElement":'.json_encode($itemListElement).'
						   }
						}';

					$breadcrumb_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$stream_slug_url->url_value,'slug_type_json_ld'=>'BreadcrumbList'));

					$breadcrumb_data_to_store=array(
						'strcut_slug_url_id'=>$stream_slug_url->url_id,
						'slug_type_json_ld'=>'BreadcrumbList',
						'slug_type_json_ld_data'=>$BreadcrumbList,
						'slug_url'=>$stream_slug_url->url_value,
						'date_modified'=>$datem,
						'date_published'=>$datep
					);

					if(empty($breadcrumb_struct_data)){
						$this->sm->store_slug_struct_data($breadcrumb_data_to_store);
					}else{
						$this->sm->update_slug_struct_data($breadcrumb_data_to_store,array('slug_url'=>$stream_slug_url->url_value,'slug_type_json_ld'=>'BreadcrumbList'));
					}
				}
			}

			

			if(!empty($stream_details_data)){
				foreach ($stream_details_data as $key => $value) {
					$stream_details_data_arr.=$value->stream_content;
				}
			}			

			$faq_data=$this->strm->get_stream_details_faq_data(array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_id),FALSE);

			if(!empty($faq_data)){
				foreach ($faq_data as $key => $value) {
					$_faq_data[]=array(
						'@type'=>'Question',
						'name'=>$value->stream_data_faq_ques,
						'acceptedAnswer'=>array('@type'=>'Answer','text'=>$value->stream_data_faq_ans),
					);
				}

				$_faq_data_json=json_encode($_faq_data);
			}

			$NewsArticle='{
				"@context":"http://schema.org/",
				"@type":"NewsArticle",
				"inLanguage":"",
				"url":'.$stream_slug_url->url_value.',
				"description":"'.$stream_slug_url->url_meta_desc.'",
				"mainEntityOfPage":{"@type":"WebPage","@id":"'.$stream_slug_url->url_value.'"},
				"headline":"'.$stream_slug_url->url_meta_title.'",
				"articleBody":"'.$stream_details_data_arr.',{
					"@context":"http://schema.org",
					"@type":"FAQPage",
					"mainEntity":"'.$_faq_data_json.'"
				}",
				"dateModified":'.$datem.',
				"datePublished":'.$datep.',
				"author":{
					"@type":"Person",
					"name":"'.$internal_user[0]->user_fullname.'"
				},
				"publisher":{
					"@type":"Organization",
					"name":"Waytoadmissions",
					"logo":{
							"@type":"ImageObject",
							"name":"Waytoadmissions",
							"url":"https://www.waytoadmissions.com/public/data/app/2021/waytoadmissions.webp",
							"height":88,
							"width":600
						}
					},
					"image":{
						"@type":"ImageObject",
						"name":"Waytoadmissions",
						"url":"https://www.waytoadmissions.com/public/data/app/2021/waytoadmissions.webp",
						"height":88,
						"width":600
					}
				}
			}';

			$article_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$stream_slug_url->url_value,'slug_type_json_ld'=>'NewsArticle'));

			$article_data_to_store=array(
				'strcut_slug_url_id'=>$stream_slug_url->url_id,
				'slug_type_json_ld'=>'NewsArticle',
				'slug_type_json_ld_data'=>$NewsArticle,
				'slug_url'=>$stream_slug_url->url_value,
				'date_modified'=>$datem,
				'date_published'=>$datep
			);

			if(empty($article_struct_data)){
				$this->sm->store_slug_struct_data($article_data_to_store);
			}else{
				$this->sm->update_slug_struct_data($article_data_to_store,array('slug_url'=>$stream_slug_url->url_value,'slug_type_json_ld'=>'NewsArticle'));
			}
		}
	}



	public function onAddExamDetails(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam=post_data('_exam');
				$_exam_menu=post_data('_exam_menu');
				$_exam_menu_data_id=post_data('_exam_menu_data_id');

				$exam_details=$this->input->post('exam_details');

				$exam_menu_faqus=$this->input->post('exam_menu_faqus');

				$user_id=decode_data(session_userdata('admin_id'));

				$exam_id=decode_data($_exam);
				$exam_menu=decode_data($_exam_menu);
				//$exam_menu_data_id=decode_data($_exam_menu_data_id);

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				$menu_data=$this->sm->get_menues(array('menu_id'=>$exam_menu));

				//echo $exam_menu;die;

				$details_data=$this->strm->get_exam_details_data(array('exam_id'=>$exam_id,'exam_menu_id'=>$exam_menu));


				if(!empty($exam_details)){
					if(!empty($details_data)){
						$created_by=$details_data->crteated_by;
						$created_at=$details_data->created_at;
						$this->strm->delete_exams_details_data(array('exam_id'=>$exam_id,'exam_menu_id'=>$exam_menu));
					}


					$i=1;
					foreach ($exam_details as $key => $value) {
						// if(isset($value['data_serial'])){
						// 	$serial=$value['data_serial'];
						// }else{
						// 	$serial=$i;
						// }

						$serial=$i;
						$serial=$value['data_serial'];
						if($value['data_type']=='general'){
							$data_type_value=null;
						}else if($value['data_type']=='image'){
							$data_type_value=decode_data($value['data_type_value']);
						}else if($value['data_type']=='ads'){
							$data_type_value=decode_data($value['data_type_value']);
						}else if($value['data_type']=='youtube_video'){

							$yt_video_data=array(
								'youtube_link'=>$value['exam_content'],
								'youtube_video_name'=>$exam_data->exam_short_name.' '.$menu_data->menu_name,
								'youtube_video_parent_id'=>$exam_data->exam_id
							);

							$yt_video_id=$this->onUploadFiles($yt_video_data,'youtube');
							$data_type_value=$yt_video_id;
						}


						$data_to_store[]=array(
							'exam_id'=>$exam_id,
							'exam_menu_id'=>$exam_menu,
							'exam_data_type'=>$value['data_type'],
							'exam_data_type_id'=>$data_type_value,
							'exam_content'=>$value['exam_content'],
							'exam_serial'=>$i,
							'created_by'=>(isset($created_by))?$created_by:$user_id,
							'updated_by'=>(!empty($details_data))?$user_id:null,
							'created_at'=>(isset($created_at))?$created_at:date('Y-m-d'),
							'updated_at'=>(!empty($details_data))?date('Y-m-d'):null
						);

						$i++;
					}

					if(!empty($exam_menu_faqus) && !empty($exam_menu_faqus[0]['ques']) && !empty($exam_menu_faqus[0]['ques'])){
						$j=1;
						foreach ($exam_menu_faqus as $key => $value) {
							
							$data_faq_to_store[]=array(
								'exam_id'=>$exam_id,
								'exam_menu_id'=>$exam_menu,
								'exam_data_type'=>'faq',
								'exam_data_type_id'=>$data_type_value,
								'exam_content_faq'=>$value['ques'],
								'exam_content'=>$value['ans'],
								'exam_serial'=>$j,
								'created_by'=>(isset($created_by))?$created_by:$user_id,
								'updated_by'=>(!empty($details_data))?$user_id:null,
								'created_at'=>(isset($created_at))?$created_at:date('Y-m-d'),
								'updated_at'=>(!empty($details_data))?date('Y-m-d'):null
							);

							$j++;
						}
					}

					if(!empty($data_to_store) && !empty($data_faq_to_store)){
						$added=$this->strm->store_exam_details_data($data_to_store,TRUE);
						$this->strm->store_exam_details_data($data_faq_to_store,TRUE);
						if($added){

							$return['success']='Exam details added successfully';
						}else{
							$return['error']='Exam details not added';
						}
					}else if(empty($data_to_store) && !empty($data_faq_to_store)){
						$added=$this->strm->store_exam_details_data($data_faq_to_store,TRUE);
						if($added){

							$return['success']='Exam details added successfully';
						}else{
							$return['error']='Exam details not added';
						}
					}else if(!empty($data_to_store) && empty($data_faq_to_store)){
						$added=$this->strm->store_exam_details_data($data_to_store,TRUE);
						if($added){

							$return['success']='Exam details added successfully';
						}else{
							$return['error']='Exam details not added';
						}
					}
					else{

						$return['error']='Exam details not found to add';
					}	
				}else{
					$return['error']='No data is there to add';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}






	//Degree Exams

	public function onDegreeAddExam(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$ctext=post_data('ctext');

				$security_token 	= 	$this->data['security_token'];

				$decrypted 			= 	CryptoJsAes::decrypt($ctext, $security_token);

				$_exam 				= 	clean_data($decrypted['_exam']);

				$exam_name 			= 	clean_data($decrypted['exam_name']);
				$exam_status 		= 	clean_data($decrypted['exam_status']);

				$degree_id 			=	decode_data($decrypted['_degree']);

				if(empty($_exam)){

					$exam_found=$this->strm->get_exam(array('exam_degree_id'=>$degree_id,'exam_name'=>$exam_name));

					$exam_data=array(
						'exam_degree_id'=>$degree_id,
						'exam_name'=>$exam_name,
						'exam_status'=>$exam_status,
						'exam_created_by'=>$user_id
					);

					$added=$this->strm->store_exam_data($exam_data);

					if($added){
						$return['success']='Exam addedd';
					}else{
						$return['error']='Exam not added';
					}

				}else{
					$degree_id=decode_data($_degree);
					$exam_found=$this->strm->get_exam(array('exam_degree_id'=>$degree_id));
					if($stream_found){

					}else{
						$return['error']='Exam not found in the system';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onImportExamExcel(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$stream=post_data('exam_stream');
				$stream_id=decode_data($stream);
				$data_imported=FALSE;

				$table_rows='';

				if(isset($_FILES['exam_excel']) && $_FILES['exam_excel']['name']!=''){
					$excel_data=array(
						'file_size'=>'10',
						'file_name'=>'exam_excel',
						'file_types'=>'xls,xlsx',
					);

					$file_path=$this->onUploadFiles($excel_data,'excel_import');

					if(is_file($file_path)){
						$validated=$this->onValidateExamExcel($file_path);

						if($validated['validated']==200){
							$exceldata=$validated['exceldata'];

							foreach ($exceldata as $_key => $_value) {
					    		$_exceldata[]=array_filter($_value[0]);
					    	}

					    	foreach ($_exceldata as $key => $value){
					    		$short_name		=	isset($value[1])?strip_javascript(xss_clean(trim($value[1]))):'';
					    		$full_name		=	isset($value[2])?strip_javascript(xss_clean(trim($value[2]))):'';
					    		$description	=	isset($value[3])?strip_javascript(xss_clean(trim($value[3]))):'';


					    		$exam_data_found=$this->strm->get_exam(array('exam_full_name'=>$full_name));

					    		if(empty($exam_data_found)){
					    			$exam_data[]=array(
					    				'exam_stream_id'=>$stream_id,
					    				'exam_full_name'=>$full_name,
					    				'exam_short_name'=>$short_name,
					    				'exam_description'=>$description,
					    				'exam_status'=>'1'
					    			);
					    		}

					    		if(!empty($exam_data)){
					    			$inserted=$this->strm->store_exam_data($exam_data,TRUE);
					    			if($inserted){
					    				$return['success']='Exam data imported';
					    			}else{
					    				$return['error']='Exam data not imported';
					    			}
					    		}else{
					    			$return['error']='Exam data not imported';
					    		}
					    	}
						}else{
							$return['error']=$validated['error'];
						}
					}else{
						$return['error']=$file_path;
					}
				}else{
					$return['error']='Excel file is missing';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onValidateExamExcel($uploaded_file){
		if($uploaded_file!=''){
			$row_arrays=array(
				'S.No',
				'Short Name',
				'Full Name',
				'Description'
			);

			$heading=$this->excel->getRangedColumnData($uploaded_file,'A','D',true,false);

			$diff = array_diff($heading[0][0], $row_arrays);

			if(empty($diff) && (count($heading[0][0])===4)){
				$count=1;
				$exceldata=$this->excel->getRangedColumnData($uploaded_file,'A','L',true,false);

				$table_rows='';

			    if($exceldata!='' || !empty($exceldata)){
			    	unset($exceldata[0]);
			    	return ['validated'=>200,'exceldata'=>$exceldata];
			    }else{
			    	//return 'Excel data format is wrong.Please download the sample excel for your reference 1';
			    	$table_rows='';
			    	return ['validated'=>400,'table_rows'=>$table_rows,'error'=>'Excel data format headings are wrong.Please download the sample excel for your reference'];
			    }

			}else{
				$table_rows='';
				//return 'Excel data format is wrong.Please download the sample excel for your reference 2';
				return ['validated'=>400,'table_rows'=>$table_rows,'error'=>'Excel data format headings are wrong.Please download the sample excel for your reference'];
			}

		}else{
			return ['error'=>'Excel file not selected'];
		}
	}

	public function onDegreeDeleteExam(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam=post_data('_exam');

				$exam_id=decode_data($_exam);

				$degree_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				if($degree_data){

					$deleted=$this->strm->delete_exam_data(array('exam_id'=>$exam_id));

					if($deleted){

						$return['success']='Exam deleted successfully';

					}else{
						$return['error']='Exam can not be deleted at this momment';
					}

				}else{
					$return['error']='Exam data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onDegreeSearchExams(){

		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'degree_name',
					'exam_name'
				);

				$param['column_search'] = array('exam_name','degree_name');
				$param['order'] = array('exam_id' => 'ASC');
				$posts=$this->input->post();

				if(!empty($posts['degree'])){
					$param['degree_id']=decode_data($posts['degree']);
				}

				

				$list = $this->strm->_get_exams($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $exam){
					$no++;

					$row = array();


					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" data-exam="'.encode_data($exam->exam_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button type="button" class="btn btn-xs btn-dark btn_del_exam" data-exam="'.encode_data($exam->exam_id).'">Delete</a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$exam->stream_name;
					$row[]	=	$exam->exam_short_name;
					$row[]	=	$exam->exam_full_name;

					if($exam->exam_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($exam->exam_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = 	$row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_exams($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_exams($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function indexCourseMenues(){
		if(session_userdata('isAdminLoggedin')){
			$this->data['page_title']='Degrees';
			$_course=$this->uri->segment(5);

			$_menu=$this->uri->segment(6,0);

			//echo $_course;die;

			//print_obj($exp);die;

			$course_id=decode_data($_course);

			$_course_parent_menues=array();

			$course_data=$this->strm->get_course(array('course_id'=>$course_id));
	
			$course_menues=$this->sm->get_menues(array('menu_link_id'=>$course_id,'menu_link_type'=>'20','menu_is_inner'=>'1','menu_category_id'=>'5'),FALSE);

			$_course_with_child_menues=array();

			$_child_menues=array();

			//echo $course_id;die;

			// $course_parent_menues=$this->sm->get_menues(array('menu_parent_id'=>'0','menu_type'=>'20',
			// 		'menu_link_type'=>'20',
			// 		'menu_category_id'=>'5',
			// 		'menu_link_id'=>$course_id),FALSE);

			$course_parent_menues=$this->sm->get_menues(array('menu_parent_id'=>'0','menu_is_inner'=>'1',
					'menu_link_type'=>'20',
					'menu_category_id'=>'5',
					'menu_link_id'=>$course_id),FALSE);

			//print_obj($course_parent_menues);die;

			if(!empty($course_parent_menues)){

				foreach ($course_parent_menues as $key => $value) {
					$_course_parent_menues[]=array(
						'menu_id'=>$value->menu_id,
						'menu_name'=>$value->menu_name
					);
				}
			}

			if(!empty($course_parent_menues)){
				foreach ($course_parent_menues as $key => $value) {
					//$cmenues=$this->sm->get_menues(array('menu_type'=>'20','menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id,'menu_parent_id'=>$value->menu_id),FALSE,'menu_serial','ASC');

					$cmenues=$this->sm->get_menues(array('menu_type'=>'20','menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id,'menu_parent_id'=>$value->menu_id),FALSE,'menu_serial','ASC');

					if(!empty($cmenues)){
						foreach ($cmenues as $k => $v) {
							$_child_menues[$value->menu_id][]=array(
								'menu_id'=>$v->menu_id,
								'menu_serial'=>$v->menu_serial,
								'menu_name'=>$v->menu_name,
								'menu_link'=>$v->menu_link,
								'menu_is_active'=>$v->menu_is_active,
								'menu_edit_link'=>$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course_id).'/'.encode_data($v->menu_id),
								'menu_add_details_link'=>$this->data['admin_base_url'].'/streams/courses/menuesdata/'.encode_data($v->menu_id),
								'menu_edit'=>$this->data['admin_base_url'].'/streams/courses/menuesdata/'.encode_data($v->menu_id)
							);
						}
					}

					$_course_with_child_menues[]=array(
						'menu_id'=>$value->menu_id,
						'menu_serial'=>$value->menu_serial,
						'menu_name'=>$value->menu_name,
						'menu_link'=>$value->menu_link,
						'menu_is_active'=>$value->menu_is_active,
						'menu_edit_link'=>$this->data['admin_base_url'].'/streams/courses/menues/'.encode_data($course_id).'/'.encode_data($value->menu_id),
						'menu_add_details_link'=>$this->data['admin_base_url'].'/streams/courses/menuesdata/'.encode_data($value->menu_id),
						'menu_edit'=>$this->data['admin_base_url'].'/streams/courses/menuesdata/'.encode_data($value->menu_id),
						'child_menu'=>(isset($_child_menues[$value->menu_id]))?$_child_menues[$value->menu_id]:null
					);
				}
			}


			if(!empty($_menu) && $_menu!='0'){
				$menu_id=decode_data($_menu);
				$menu_data=$this->sm->get_menues(array('menu_id'=>$menu_id));

				$slug_data=$this->sm->get_slug_urls(array('url_glob_type'=>'course_inner_menu_url','url_type'=>'course_static_url','url_type_id'=>$course_id,'url_sub_type'=>'course_inner_menu','url_sub_type_id'=>$menu_id));

				$struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$slug_data->url_value,'strcut_slug_url_id'=>$slug_data->url_id,'slug_type_json_ld'=>'NewsArticle'));

				//print_obj($struct_data);die;

				if(!empty($struct_data)){
					$this->data['slug_type_json_meta_data']=json_decode($struct_data->slug_type_json_meta_data);
				}

				$this->data['slug_data']=$slug_data;

				$this->data['menu_data']=$menu_data;

				$this->data['course_id']=$course_id;
				$this->data['course_menu_id']=$menu_id;
			}


			//print_obj($_course_with_child_menues);die;


			$this->data['course_data']=$course_data;
			$this->data['course_menues']=$_course_with_child_menues;

			$this->data['course_parent_menues']=$_course_parent_menues;			

			$this->theme->title($this->data['page_title'])->load('streams/vw_streams_courses_menues', $this->data);
	
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexCourseMenuesDataEdit(){

		if(session_userdata('isAdminLoggedin')){
				$this->data['page_title']='Degrees';
				$_menu_id=$this->uri->segment(5);

				$_question_paper_links=array();
				$_answer_paper_links=array();
				$_speaking_papers_links=array();
				$_writing_papers_links=array();
				$_listening_papers_links=array();
				$_sample_papers_links=array();
				$_cutoff_files_links=array();

			
				$menu_id=decode_data($_menu_id);

				//echo $menu_id;die;

				$course_menue=$this->sm->get_menues(array('menu_id'=>$menu_id));

				//print_obj($course_menue);die;


				$course_data=$this->strm->get_course(array('course_id'=>$course_menue->menu_link_id));

				//print_obj($course_data);die;

				//$this->data['course_general_details_data']=$this->strm->get_course_details_data(array('course_id'=>$course_menue->menu_link_id,'course_data_type'=>'general'));

				// $this->data['course_table_details_data']=$this->strm->get_course_details_data(array('course_id'=>$course_menue->menu_link_id,'course_data_type'=>'table'),FALSE);

				$this->data['course_general_details_data']=$this->strm->get_course_details_data(array('course_id'=>$course_menue->menu_link_id,'course_inner_menu_id'=>$menu_id,'course_data_type!='=>'faqs'),FALSE);

				//print_obj($this->data['course_general_details_data']);die;

				$this->data['course_faq_details_data']=$this->strm->get_course_details_data(array('course_id'=>$course_menue->menu_link_id,'course_inner_menu_id'=>$menu_id,'course_data_type'=>'faqs'),FALSE);

				$this->data['parent_folder_data']=$this->sm->get_files(array('storage_type'=>'1','media_org_name'=>'courses'));

				//print_obj($this->data['parent_folder_data']);die;

				$course_slug_url=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_type_id'=>$course_menue->menu_link_id));

				$this->data['course_link']=$course_slug_url->url_value;

				$_course_menues=array(
					'menu_id'=>encode_data($course_menue->menu_id),
					'menu_name'=>$course_menue->menu_name
				);

				//print_obj($_course_menues);die;
				$this->data['course_data']=$course_data;

				$this->data['course_menues']=$_course_menues;

				$_exams=array();
				$_course=array();

				$exams=$this->strm->get_exam(array('exam_status'=>1),FALSE);

				if(!empty($exams)){
					foreach ($exams as $key => $value) {
						$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));

						if(isset($course_slug->slug_value)){
							$_exams[]=array(
								'title'=>$value->exam_short_name,
								'value'=>base_url('exams/'.$exam_slug->slug_value)
							);
						}
					}
				}

				$this->data['exams_links']=(!empty($_exams))?json_encode($_exams):'';

				$courses=$this->strm->__get_course('course_name,course_short_name,course_id',array('course_id!='=>$course_data->course_id),FALSE);			

				if(!empty($courses)){
					foreach ($courses as $key => $value) {
						$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));

						if(isset($course_slug->slug_value)){
							$_course[]=array(
								'title'=>$value->course_name,
								'value'=>base_url('courses/'.$course_slug->slug_value)
							);
						}							
					}
				}
				

				$this->data['courses_links']=(!empty($_course))?json_encode($_course):'';	


				$colleges=$this->im->get_college_specific_data('college_short_name,access_url,is_verified_by_admin',array('is_verified_by_admin'=>'1'));

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {
						$_college_links[]=array(
							'title'=>$value->college_short_name,
							'value'=>$value->access_url
						);
					}
				}

				$question_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'9','user_file_type_id'=>$course_data->course_id),FALSE);

				$answer_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'10','user_file_type_id'=>$course_data->course_id),FALSE);

				$speaking_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'11','user_file_type_id'=>$course_data->course_id),FALSE);

				$writing_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'12','user_file_type_id'=>$course_data->course_id),FALSE);

				$listening_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'13','user_file_type_id'=>$course_data->course_id),FALSE);

				$sample_papers=$this->sm->get_user_files(array('user_storage_type'=>'practice_paper','user_file_type'=>'14','user_file_type_id'=>$course_data->course_id),FALSE);

				$syllabus_files=$this->sm->get_user_files(array('user_storage_type'=>'syllabus_files','user_file_type'=>'15','user_file_type_id'=>$course_data->course_id),FALSE);


				$cutoff_files=$this->sm->get_user_files(array('user_storage_type'=>'cutoff_files','user_file_type'=>'16','user_file_type_id'=>$course_data->course_id),FALSE);

				if(!empty($syllabus_files)){
					foreach ($syllabus_files as $key => $value) {
						$_syllabus_files_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>$value->media_disk_path_relative
						);
					}
				}


			if(!empty($cutoff_files)){
				foreach ($cutoff_files as $key => $value) {
					$_cutoff_files_links[]=array(
						'title'=>$value->user_storage_type_2,
						'value'=>$value->media_disk_path_relative
					);
				}
			}

			//print_obj($_syllabus_files_links);die;


			if(!empty($question_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($question_papers as $key => $value) {
						$_question_paper_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}

			if(!empty($answer_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($answer_papers as $key => $value) {
						$_answer_paper_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}


			if(!empty($speaking_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($speaking_papers as $key => $value) {
						$_speaking_papers_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}

			if(!empty($writing_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($writing_papers as $key => $value) {
						$_writing_papers_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}

			if(!empty($listening_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($listening_papers as $key => $value) {
						$_listening_papers_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}

			if(!empty($sample_papers)){
				if(isset($exam->exam_short_name)){
					foreach ($sample_papers as $key => $value) {
						$_sample_papers_links[]=array(
							'title'=>$value->user_storage_type_2,
							'value'=>base_url('/exams/'.strtolower($exam->exam_short_name).'?utm_source='.encode_data($value->user_file_storage_id))
						);
					}
				}					
			}

			//print_obj($_college_links);die;

			$this->data['college_links']="";


			//print_obj($this->data['college_links']);die;

			$this->data['course_id']=$course_data->course_id;

			$this->data['course_page_question_paper']=(!empty($_question_paper_links))?json_encode($_question_paper_links):'';
			$this->data['course_page_answer_paper']=(!empty($_answer_paper_links))?json_encode($_answer_paper_links):"";

			$this->data['course_page_speaking_test_paper']=(!empty($_speaking_papers_links))?json_encode($_speaking_papers_links):"";

			$this->data['course_page_writing_practice_paper']=(!empty($_writing_papers_links))?json_encode($_writing_papers_links):"";

			$this->data['course_page_listening_practice_paper']=(!empty($_listening_papers_links))?json_encode($_listening_papers_links):"";

			$this->data['course_page_sample_practice_paper']=(!empty($_sample_papers_links))?json_encode($_sample_papers_links):"";

			$this->data['course_page_syllabus_pdfs']=(!empty($_syllabus_files_links))?json_encode($_syllabus_files_links):"";

			$this->data['course_page_cutoff_pdfs']=(!empty($_cutoff_files_links))?json_encode($_cutoff_files_links):"";

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_ads_modal')->load('streams/vw_streams_courses_menues_data', $this->data);
	
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCourseMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'menu_name'
				);

				$param['column_search'] = array('menu_name');
				$param['order'] = array('menu_id' => 'ASC');
				$posts=$this->input->post();

				$course_id=$posts['course_parent'];

				//print_obj($course_id);die;

				$param['menu_link_id']=$course_id;
				$param['menu_link_type']='10';
				$param['menu_is_inner']='1';
				$param['menu_category_id']='5';

				

				$list = $this->sm->_get_menues($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));
				$course_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$course_data->course_stream));

				foreach ($list as $menu){
					$no++;

					$row = array();



					$menu_slug_data=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_type_id'=>$course_id,'url_sub_type'=>'course_static_url_menu','url_sub_type_id'=>$menu->menu_id),TRUE,NULL,NULL,FALSE);


					$action='<div class="btn-group btn-group-sm" role="group">
					<a href="'.$this->data['admin_base_url'].'/streams/courses/menuesdata/'.encode_data($menu->menu_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button type="button" class="btn btn-xs btn-dark btn_edit_meta" data-target="#editCourseMenuMetaModal" data-toggle="modal" data-ccourse="'.encode_data($course_id).'" data-cmenu="'.encode_data($menu->menu_id).'" data-slug_url="'.$menu_slug_data->url_value.'" data-page_heading="'.$menu_slug_data->url_page_heading.'" data-meta_heading="'.$menu_slug_data->url_meta_heading.'" data-meta_title="'.$menu_slug_data->url_meta_title.'" data-meta_key_words="'.$menu_slug_data->url_meta_key_words.'" data-meta_desc="'.$menu_slug_data->url_meta_desc.'" data-og_title="'.$menu_slug_data->url_og_title.'" data-og_desc="'.$menu_slug_data->url_og_desc.'">Edit Meta</button>
					<button type="button" class="btn btn-xs btn-danger btn_delete_course_menues" data-cmenu="'.encode_data($menu->menu_id).'" data-course="'.encode_data($course_id).'">Delete</button>
					<a href="'.base_url('courses/'.$course_stream_slug->slug_value.'/'.$course_slug->slug_value).'" target="_blank" class="btn btn-success">View</a>
					</div>';				
					
					//$row[]	=	$no;
					$row[]	=	$menu->menu_name;

					$row[]  =	$action;	

					$data[] = 	$row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_menues($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_menues($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onCreateCourseMenu(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course_id=post_data('course_id');

				$course_menu_id=post_data('course_menu_id');

				$_course_parent_menues=array();

				if(!empty($_course_id)){
					$course_id=decode_data($_course_id);

					$menu_name=post_data('course_menu_name');
					$course_parent_menu=post_data('course_parent_menu');
					$course_menu_fixed_type=post_data('course_menu_fixed_type');
					$exam_menu_open_new_tab=post_data('course_menu_open_new_tab');
					$course_menu_status=post_data('course_menu_status');

					$course_menu_page_title=post_data('course_menu_page_title');

					$course_data=$this->strm->get_course(array('course_id'=>$course_id));

					$current_year=date('Y');
					$prev_year=$current_year-1;

					$course_menues_data=$this->sm->get_menues(array('menu_parent_id'=>'0','menu_type'=>'20',
						'menu_link_type'=>'20',
						'menu_category_id'=>'5',
						'menu_link_id'=>$course_id));

					$menu_counted=(!empty($course_menues_data) && is_array($course_menues_data))?count($course_menues_data):'0';

					$menu_serial=$menu_counted+1;

					if($course_data->course_parent_id!=NULL){
						$course_parent_course_data=$this->strm->get_course(array('course_id'=>$course_data->course_parent_id));

						$course_slug=url_slug($course_parent_course_data->course_name).'-'.url_slug($course_data->course_name);

						$url_meta_heading=ucwords(strtolower($course_parent_course_data->course_name)).' ['.$course_parent_course_data->course_short_name.'] '.ucwords(strtolower($course_data->course_name)).' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;

						// $_keys1=generateKeywordsFromText(strtolower($course_parent_course_data->course_name));
						// $_keys2=generateKeywordsFromText(strtolower($course_data->course_name));
						// $_keys3=generateKeywordsFromText(strtolower($course_data->course_short_name));

						//$keywords=$_keys1.','.$_keys2.','.$_keys3;

					}else{
						$course_slug=url_slug(strtolower($course_data->course_name));

						$url_meta_heading=ucwords(strtolower($course_data->course_name)).' ['.$course_data->course_short_name.'] Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;

						// $_keys1=generateKeywordsFromText(strtolower($course_data->course_name));
						// $_keys2=generateKeywordsFromText(strtolower($course_data->course_name));
						// $_keys3=generateKeywordsFromText(strtolower($course_data->course_short_name));

						//$keywords=$_keys1.','.$_keys2.','.$_keys3;
					}

					$course_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$course_data->course_stream));

					$menu_slug=url_slug($menu_name);


					if($menu_name==='Overview' || $menu_name==='overview' || $course_menu_fixed_type==='overview'){
						$menu_url=base_url('courses/'.$course_slug);
					}else{
						$menu_url=base_url('courses/'.$course_slug.'/'.$menu_slug);
					}

					//echo $menu_url;die;

					if(!empty($course_menu_id)){
						$menu_found=$this->sm->get_menues(array('menu_id'=>$course_menu_id));
					}else{
						$menu_found=$this->sm->get_menues(array('menu_country_id'=>'99',
							'menu_country_code'=>'IN',
							'menu_country'=>'India',
							'menu_type'=>'20',
							'menu_link_type'=>'20',
							'menu_category_id'=>'5',
							'menu_link_id'=>$course_id,
							'menu_link'=>$menu_url,
							'menu_name'=>$menu_name,
							'menu_slug'=>$menu_slug));
					}	

					

					$menu_data=array(
						'menu_parent_id'=>'0',
						'menu_country_id'=>'99',
						'menu_country_code'=>'IN',
						'menu_country'=>'India',
						'menu_category_id'=>'5',
						'menu_type'=>'20',
						'menu_link_type'=>'20',
						'menu_link_id'=>$course_id,
						'menu_link'=>$menu_url,
						'menu_name'=>$menu_name,
						'menu_slug'=>$menu_slug,
						'menu_serial'=>$menu_serial,
						'menu_is_active'=>$course_menu_status,
						'menu_is_inner'=>'1'
					);

					if(empty($menu_found)){
						$inserted=$this->sm->store_menu($menu_data);
						$menu_id=$inserted;
					}else{
						$inserted=$this->sm->update_menu($menu_data,array('menu_id'=>$course_menu_id));

						$menu_id=$menu_found->menu_id;
					}					

					if($inserted){

						/*
						$bread_crumb=array(
							'Home'=>base_url(),
							ucwords($course_data->course_name).' ('.ucwords($course_data->course_short_name).')'=>base_url('courses/'.$menu_slug),
							ucwords($menu_name)=>null
						);

						$slug_url_data=array(
							'url_type'=>'course_static_url',
							'url_glob_type'=>'course_inner_menu_url',
							'url_type_id'=>$course_id,
							'url_sub_type'=>'course_static_url_menu',
							'url_sub_type_id'=>$menu_id,
							'url_country'=>'99',
							'url_breadcrumb'=>json_encode($bread_crumb),
							'url_meta_heading'=>$url_meta_heading,
							'url_meta_title'=>$url_meta_heading,
							'url_meta_key_words'=>$keywords,
							'url_meta_desc'=>$url_meta_heading,
							'url_og_title'=>$url_meta_heading,
							'url_og_desc'=>$url_meta_heading,
							'url_page_heading'=>$url_meta_heading,
							'url_value'=>$menu_url,
							'url_priority'=>'0.5',
							'url_data_change_freq'=>'yearly',
							'url_last_update'=>date('Y-m-d H:i:s'),
							'url_active'=>'1'
						);

						// $slug_url_found=$this->sm->get_slug_urls(array(
						// 	'url_type'=>'course_static_url',
						// 	'url_glob_type'=>'course_inner_menu_url',
						// 	'url_type_id'=>$course_id,
						// 	'url_country'=>'99',
						// 	'url_value'=>$menu_url
						// ));

						$slug_url_found=$this->sm->get_slug_urls(array('url_value'=>$menu_url));

						if(empty($slug_url_found)){
							$this->sm->store_slug_urls($slug_url_data);
						}else{
							$this->sm->update_slug_urls($slug_url_data,array(
								'url_type'=>'course_static_url',
								'url_glob_type'=>'course_inner_menu_url',
								'url_type_id'=>$course_id,
								'url_id'=>$slug_url_found->url_id
							));
						}

						$slug_data=array(
							'slug_type'=>'5',
							'slug_type_id'=>$course_id,
							'slug_value'=>$course_slug
						);

						$slug_data_found=$this->sm->get_slug($slug_data);

						if(!empty($slug_data_found)){
							$this->sm->update_slug($slug_data,array('slug_id'=>$slug_data_found->slug_id));
						}else{
							$this->sm->store_slug($slug_data);
						}


						$course_parent_menues=$this->sm->get_menues(array('menu_parent_id'=>'0','menu_type'=>'20',
						'menu_link_type'=>'20',
						'menu_category_id'=>'5',
						'menu_link_id'=>$course_id),FALSE);

						if(!empty($course_parent_menues)){

							foreach ($course_parent_menues as $key => $value) {
								$_course_parent_menues[]=array(
									'menu_id'=>$value->menu_id,
									'menu_name'=>$value->menu_name
								);
							}
						}

						*/

						$return['parent_menues']=$_course_parent_menues;

						if(!empty($course_menu_id)){
							$msg='Menu updated';
						}else{
							$msg='Menu created';
						}

					}else{
						if(!empty($course_menu_id)){
							$msg='Menu not updated';
						}else{
							$msg='Menu not created';
						}
					}

					$return['success']=$msg;

				}else{
					$return['error']='Course not found';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}	
	}


	public function onCreateCourseMenu_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course_id=post_data('course_id');

				if(!empty($_course_id)){
					$course_id=decode_data($_course_id);

					$menu_name=post_data('course_menu_name');

					$course_parent_menu=post_data('course_parent_menu');

					$course_menu_page_heading=post_data('course_menu_page_heading');

					$course_menu_fixed_type=post_data('course_menu_fixed_type');

					$exam_menu_open_new_tab=post_data('course_menu_open_new_tab');

					$course_menu_status=post_data('course_menu_status');

					$course_data=$this->strm->get_course(array('course_id'=>$course_id));

					$current_year=date('Y');
					$prev_year=$current_year-1;

					if($course_data->course_parent_id!=NULL){
						$course_parent_course_data=$this->strm->get_course(array('course_id'=>$course_data->course_parent_id));

						$course_slug=url_slug($course_parent_course_data->course_name).'-'.url_slug($course_data->course_name);

						$url_meta_heading=ucwords(strtolower($course_parent_course_data->course_name)).' ['.$course_parent_course_data->course_short_name.'] '.ucwords(strtolower($course_data->course_name)).' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;

						$_keys1=generateKeywordsFromText(strtolower($course_parent_course_data->course_name));
						$_keys2=generateKeywordsFromText(strtolower($course_data->course_name));
						$_keys3=generateKeywordsFromText(strtolower($course_data->course_short_name));

						$keywords=$_keys1.','.$_keys2.','.$_keys3;

					}else{
						$course_slug=url_slug(strtolower($course_data->course_name));

						$url_meta_heading=ucwords(strtolower($course_data->course_name)).' ['.$course_data->course_short_name.'] Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;

						$_keys1=generateKeywordsFromText(strtolower($course_data->course_name));
						$_keys2=generateKeywordsFromText(strtolower($course_data->course_name));
						$_keys3=generateKeywordsFromText(strtolower($course_data->course_short_name));

						$keywords=$_keys1.','.$_keys2.','.$_keys3;
					}

					$course_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$course_data->course_stream));

					$menu_slug=url_slug($menu_name);


					if($menu_name==='Overview' || $menu_name==='overview'){
						$menu_url=base_url('courses/'.$course_slug);
					}else{
						$menu_url=base_url('courses/'.$course_slug.'/'.$menu_slug);
					}

					//echo $menu_url;die;		

					$menu_found=$this->sm->get_menues(array('menu_country_id'=>'99',
						'menu_country_code'=>'IN',
						'menu_country'=>'India',
						'menu_type'=>'10',
						'menu_link_type'=>'10',
						'menu_category_id'=>'5',
						'menu_link_id'=>$course_id,
						'menu_link'=>$menu_url,
						'menu_name'=>$menu_name,
						'menu_slug'=>$menu_slug));

					$menu_data=array(
						'menu_parent_id'=>'0',
						'menu_country_id'=>'99',
						'menu_country_code'=>'IN',
						'menu_country'=>'India',
						'menu_category_id'=>'5',
						'menu_type'=>'10',
						'menu_link_type'=>'10',
						'menu_link_id'=>$course_id,
						'menu_link'=>$menu_url,
						'menu_name'=>$menu_name,
						'menu_slug'=>$menu_slug,
						'menu_serial'=>'1',
						'menu_is_inner'=>'1'
					);

					if(empty($menu_found)){
						$inserted=$this->sm->store_menu($menu_data);
						$menu_id=$inserted;
					}else{
						$inserted=$this->sm->update_menu($menu_data,array('menu_country_id'=>'99',
						'menu_country_code'=>'IN',
						'menu_country'=>'India',
						'menu_type'=>'10',
						'menu_link_type'=>'10',
						'menu_link_id'=>$course_id,
						'menu_link'=>$menu_url,
						'menu_name'=>$menu_name,
						'menu_slug'=>$menu_slug));
						$menu_id=$menu_found->menu_id;
					}

					

					if($inserted){
						$slug_url_data=array(
							'url_type'=>'course_static_url',
							'url_glob_type'=>'course_inner_menu_url',
							'url_type_id'=>$course_id,
							'url_sub_type'=>'course_static_url_menu',
							'url_sub_type_id'=>$menu_id,
							'url_country'=>'99',
							'url_meta_heading'=>$url_meta_heading,
							'url_meta_title'=>$url_meta_heading,
							'url_meta_key_words'=>$keywords,
							'url_meta_desc'=>$url_meta_heading,
							'url_og_title'=>$url_meta_heading,
							'url_og_desc'=>$url_meta_heading,
							'url_page_heading'=>$url_meta_heading,
							'url_value'=>$menu_url,
							'url_priority'=>'0.5',
							'url_data_change_freq'=>'monthly',
							'url_last_update'=>date('Y-m-d H:i:s'),
							'url_active'=>'1'
						);

						$slug_url_found=$this->sm->get_slug_urls(array(
							'url_type'=>'course_static_url',
							'url_glob_type'=>'course_inner_menu_url',
							'url_type_id'=>$course_id,
							'url_country'=>'99',
							'url_value'=>$menu_url
						));

						if(empty($slug_url_found)){
							$this->sm->store_slug_urls($slug_url_data);
						}else{
							$this->sm->update_slug_urls($slug_url_data,array(
								'url_type'=>'course_static_url',
								'url_glob_type'=>'course_inner_menu_url',
								'url_type_id'=>$course_id,
								'url_id'=>$slug_url_found->url_id
							));
						}

						$slug_data=array(
							'slug_type'=>'5',
							'slug_type_id'=>$course_id,
							'slug_value'=>$course_slug
						);

						$slug_data_found=$this->sm->get_slug($slug_data);

						if(!empty($slug_data_found)){
							$this->sm->update_slug($slug_data,array('slug_id'=>$slug_data_found->slug_id));
						}else{
							$this->sm->store_slug($slug_data);
						}

						$return['success']='Menu created';
					}else{
						$return['error']='Menu not created';
					}

				}else{
					$return['error']='Course not found';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
		
	}


	public function onDeleteCourseMenue(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_menu_id=post_data('_menu_id');
				

				$course_id=post_data('course_id');


				if(!empty($_menu_id) && !empty($course_id)){
					$menu_id=(is_numeric($_menu_id))?$_menu_id:decode_data($_menu_id);
					$course_id=(is_numeric($course_id))?$course_id:decode_data($course_id);

					//echo $menu_id;die;
					$deleted=$this->sm->delete_menu(array('menu_id'=>$menu_id));


					if($deleted){
						$this->strm->delete_course_details_data(array('course_id'=>$course_id,'course_inner_menu_id'=>$menu_id));
						// $this->sm->delete_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));
						$this->sm->delete_slug_urls(array('url_type'=>'course_static_url','url_glob_type'=>'course_inner_menu_url','url_type_id'=>$course_id,'url_sub_type_id'=>$menu_id,'url_sub_type'=>'course_static_url_menu'));

						$return['success']='Menu deleted successfully';
					}else{
						$return['error']='Menu not deleted';
					}
				}else{
					$return['error']='Menu data not found in the system';
				}

					

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchSubStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_stream_id=post_data('_stream_id');
				$stream_id=decode_data($_stream_id);

				$stream=$this->strm->get_course_sub_stream(array('sub_stream_parent_id'=>$stream_id,'sub_stream_status'=>'1'),FALSE);

				//print_obj($stream);die;

				if(!empty($stream)){
					foreach ($stream as $key => $value) {
						$_substream[]=array(
							'sub_stream_id'=>encode_data($value->sub_stream_id),
							'sub_stream_name'=>$value->sub_stream_name
						);
					}
				}else{
					$_substream=array();
				}

				$return['sub_stream']=$_substream;


				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onIncludeExamsInSearch(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$exam_id=post_data('exam_id');

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//print_obj($exam_data);die;

				$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));

				$access_url=base_url('exams/'.$exam_slug->slug_value);

				$exam_image=$this->sm->get_user_file(array('user_storage_type'=>'exam_logo','user_file_type'=>'6','user_file_type_id'=>$exam_id));

				$data_to_store=array(
					'search_data_type_id'=>$exam_id,
					'search_data_type'=>'EXAM_NAME',
					'search_data_name'=>$exam_data->exam_full_name,
					'search_data_short_name'=>$exam_data->exam_short_name,
					'search_data_country_id'=>'99',
					'search_data_country'=>'india',
					'search_data_state_id'=>'1',
					'search_data_state_name'=>null,
					'search_data_city_id'=>null,
					'search_data_city_name'=>null,
					'search_data_address'=>null,
					'search_data_course_ids'=>null,
					'search_data_course_name'=>null,
					'search_data_course_short_name'=>null,
					'search_data_stream_ids'=>$exam_data->exam_stream_id,
					'search_data_stream_name'=>null,
					'search_data_exam_ids'=>$exam_id,
					'search_data_exam_name'=>$exam_data->exam_full_name,
					'search_data_meta_title'=>$exam_data->exam_description,
					'search_data_meta_desc'=>'',
					'search_data_meta_keywords'=>'',
					'search_data_og_title'=>'',
					'search_data_og_desc'=>'',
					'search_data_access_url'=>$access_url,
					'search_storage_access_url'=>$exam_image->media_disk_path_relative
				);

				//print_obj($data_to_store);die;

				//echo $exam_id;die;

				$found=$this->sm->___get_system_search_data(array('search_data_type_id'=>$exam_id,'search_data_type'=>'EXAM_NAME'));
				$get_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));

				$slug_url=base_url('exams/'.$get_slug->slug_value);

				$get_slug_urls=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$exam_id,'url_value'=>$slug_url));

				//print_obj($get_slug_urls);die;

				if(empty($found)){
					$added=$this->sm->store_system_search_data($data_to_store);

					if($added){

						if(empty($get_slug_urls)){

							$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));
							$bredcrumb=array('Home'=>base_url(),'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),strtoupper($exam_data->exam_name).'('.strtoupper($exam_data->exam_short_name).')'=>null);
							$url_meta_heading=strtoupper($exam_data->exam_short_name).' Exam '.date('Y').': Exam Dates,Registration, Eligibility, Preparation, Exam Pattern, Syllabus, Result and Counselling';
							$url_meta_key_words=generateKeywordsFromText($url_meta_heading);
							$url_meta_desc=$url_meta_heading;
							$slug_data=array(
								'url_type'=>'exam',
								'url_type_id'=>$exam_id,
								'url_country'=>$exam_data->exam_country,
								'url_sub_type'=>'exam_inner_default_menu_url',
								'url_meta_heading'=>$url_meta_heading,
								'url_meta_title'=>$url_meta_heading,
								'url_meta_key_words'=>$url_meta_key_words,
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_heading,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_meta_heading,
								'url_breadcrumb'=>json_encode($bredcrumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'daily',
								'url_value'=>$slug_url,
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							$slug_added=$this->sm->store_slug_urls($slug_data);

							if($slug_added){
								$get_menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_slug'=>'overview','menu_is_inner'=>'1'));

								if(!empty($get_menu_data)){
									$menu_data_to_add=array(
										'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1',
										'menu_is_active'=>'1',
										'menu_name'=>'Overview',
										'menu_name_alias'=>'Overview',
										'menu_link'=>$slug_url,
										'menu_serial'=>'1',
										'menu_is_upper_top'=>'2',
										'menu_is_top'=>'2',
										'menu_is_footer'=>'2',
										'menu_open_new_tab'=>'2'
									);

									$menu_id=$this->sm->store_menu($menu_data_to_add);
									if($menu_id){
										$this->sm->update_slug_urls(array('url_sub_type_id'=>$menu_id),array('url_value'=>$slug_url,'url_id'=>$slug_added));
									}
								}else{
									$this->sm->update_menu($menu_data_to_add,array('menu_id'=>$get_menu_data->menu_id,'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1'));
								}
							}
						}else{
							$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));
							$bredcrumb=array('Home'=>base_url(),'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),strtoupper($exam_data->exam_name).'('.strtoupper($exam_data->exam_short_name).')'=>null);
							$url_meta_heading=strtoupper($exam_data->exam_short_name).' Exam '.date('Y').': Exam Dates,Registration, Eligibility, Preparation, Exam Pattern, Syllabus, Result and Counselling';
							$url_meta_key_words=generateKeywordsFromText($url_meta_heading);
							$url_meta_desc=$url_meta_heading;

							$slug_data=array(
								'url_type'=>'exam',
								'url_type_id'=>$exam_id,
								'url_country'=>$exam_data->exam_country,
								'url_sub_type'=>'exam_inner_default_menu_url',
								'url_meta_heading'=>$url_meta_heading,
								'url_meta_title'=>$url_meta_heading,
								'url_meta_key_words'=>$url_meta_key_words,
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_heading,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_meta_heading,
								'url_breadcrumb'=>json_encode($bredcrumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'daily',
								'url_value'=>$slug_url,
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							$slug_added=$this->sm->update_slug_urls($slug_data,array('url_type'=>'exam',
								'url_type_id'=>$exam_id,'url_value'=>$slug_url,'url_id'=>$get_slug_urls->url_id));

							if($slug_added){
								$get_menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_slug'=>'overview','menu_is_inner'=>'1'));

								if(!empty($get_menu_data)){
									$menu_data_to_add=array(
										'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1',
										'menu_is_active'=>'1',
										'menu_name'=>'Overview',
										'menu_name_alias'=>'Overview',
										'menu_link'=>$slug_url,
										'menu_serial'=>'1',
										'menu_is_upper_top'=>'2',
										'menu_is_top'=>'2',
										'menu_is_footer'=>'2',
										'menu_open_new_tab'=>'2'
									);

									$menu_id=$this->sm->store_menu($menu_data_to_add);
									if($menu_id){
										$this->sm->update_slug_urls(array('url_sub_type_id'=>$menu_id),array('url_value'=>$slug_url,'url_id'=>$slug_added));
									}
								}else{
									$this->sm->update_menu($menu_data_to_add,array('menu_id'=>$get_menu_data->menu_id,'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1'));
								}
							}
						}

						$return['success']='Data Updated';
					}else{
						$return['error']='Data not added';
					}
				}else{
					$added=$this->sm->update_system_search_data($data_to_store,array('search_data_type_id'=>$exam_id,'search_data_type'=>'EXAM_NAME'));

					if($added){
						if(empty($get_slug_urls)){

							$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));
							$bredcrumb=array('Home'=>base_url(),'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),strtoupper($exam_data->exam_name).'('.strtoupper($exam_data->exam_short_name).')'=>null);
							$url_meta_heading=strtoupper($exam_data->exam_short_name).' Exam '.date('Y').': Exam Dates,Registration, Eligibility, Preparation, Exam Pattern, Syllabus, Result and Counselling';
							$url_meta_key_words=generateKeywordsFromText($url_meta_heading);
							$url_meta_desc=$url_meta_heading;
							$slug_data=array(
								'url_type'=>'exam',
								'url_type_id'=>$exam_id,
								'url_country'=>$exam_data->exam_country,
								'url_sub_type'=>'exam_inner_default_menu_url',
								'url_meta_heading'=>$url_meta_heading,
								'url_meta_title'=>$url_meta_heading,
								'url_meta_key_words'=>$url_meta_key_words,
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_heading,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_meta_heading,
								'url_breadcrumb'=>json_encode($bredcrumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'daily',
								'url_value'=>$slug_url,
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							$slug_added=$this->sm->store_slug_urls($slug_data);

							if($slug_added){
								$get_menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_slug'=>'overview','menu_is_inner'=>'1'));

								if(!empty($get_menu_data)){
									$menu_data_to_add=array(
										'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1',
										'menu_is_active'=>'1',
										'menu_name'=>'Overview',
										'menu_name_alias'=>'Overview',
										'menu_link'=>$slug_url,
										'menu_serial'=>'1',
										'menu_is_upper_top'=>'2',
										'menu_is_top'=>'2',
										'menu_is_footer'=>'2',
										'menu_open_new_tab'=>'2'
									);

									$menu_id=$this->sm->store_menu($menu_data_to_add);
									if($menu_id){
										$this->sm->update_slug_urls(array('url_sub_type_id'=>$menu_id),array('url_value'=>$slug_url,'url_id'=>$slug_added));
									}
								}else{
									$this->sm->update_menu($menu_data_to_add,array('menu_id'=>$get_menu_data->menu_id,'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1'));
								}
							}
						}else{
							$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));
							$bredcrumb=array('Home'=>base_url(),'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),strtoupper($exam_data->exam_name).'('.strtoupper($exam_data->exam_short_name).')'=>null);
							$url_meta_heading=strtoupper($exam_data->exam_short_name).' Exam '.date('Y').': Exam Dates,Registration, Eligibility, Preparation, Exam Pattern, Syllabus, Result and Counselling';
							$url_meta_key_words=generateKeywordsFromText($url_meta_heading);
							$url_meta_desc=$url_meta_heading;
							$slug_data=array(
								'url_type'=>'exam',
								'url_type_id'=>$exam_id,
								'url_country'=>$exam_data->exam_country,
								'url_sub_type'=>'exam_inner_default_menu_url',
								'url_meta_heading'=>$url_meta_heading,
								'url_meta_title'=>$url_meta_heading,
								'url_meta_key_words'=>$url_meta_key_words,
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_heading,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_meta_heading,
								'url_breadcrumb'=>json_encode($bredcrumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'daily',
								'url_value'=>$slug_url,
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							$slug_added=$this->sm->update_slug_urls($slug_data,array('url_type'=>'exam',
								'url_type_id'=>$exam_id,'url_value'=>$slug_url,'url_id'=>$get_slug_urls->url_id));

							if($slug_added){
								$get_menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_link_id'=>$exam_id,'menu_slug'=>'overview','menu_is_inner'=>'1'));

								if(!empty($get_menu_data)){
									$menu_data_to_add=array(
										'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1',
										'menu_is_active'=>'1',
										'menu_name'=>'Overview',
										'menu_name_alias'=>'Overview',
										'menu_link'=>$slug_url,
										'menu_serial'=>'1',
										'menu_is_upper_top'=>'2',
										'menu_is_top'=>'2',
										'menu_is_footer'=>'2',
										'menu_open_new_tab'=>'2'
									);

									$menu_id=$this->sm->store_menu($menu_data_to_add);
									if($menu_id){
										$this->sm->update_slug_urls(array('url_sub_type_id'=>$menu_id),array('url_value'=>$slug_url,'url_id'=>$slug_added));
									}
								}else{
									$this->sm->update_menu($menu_data_to_add,array('menu_id'=>$get_menu_data->menu_id,'menu_link_type'=>'12',
										'menu_link_id'=>$exam_id,
										'menu_slug'=>'overview',
										'menu_is_inner'=>'1'));
								}
							}
						}

						$return['success']='Data Updated';
					}else{
						$return['error']='Data not updated';
					}


						
				}

					
				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	//Exam Preparation data
	public function onSearchExamPreparationGuides(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'exam_prep_data_title'
				);

				$param['column_search'] = array('exam_prep_data_title');
				$param['order'] = array('exam_prep_data_id ' => 'ASC');
				$posts=$this->input->post();

				$exam_id=$posts['exam_id'];			

				$list = $this->strm->_get_exam_prepperation_data($posts,$param,FALSE,FALSE);
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));
				$course_stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$course_data->course_stream));

				foreach ($list as $prep){
					$no++;

					$row = array();	

					$get_slug_data=$this->sm->get_slug_urls(array('url_type'=>'exam','url_glob_type'=>'exam_inner_data','url_sub_type'=>'exam_prep_guide','url_type_id'=>$prep->exam_id,'url_sub_type_id'=>$prep->exam_prep_data_id));	

					$action='<div class="btn-group btn-group-sm" role="group">
					<a href="exams/preparationguide/'.encode_data($prep->exam_id).'/'.encode_data($prep->exam_prep_data_id).'" class="btn btn-xs btn-success" target="_blank">Add Details</a>
					<button type="button" data-exam_id="'.encode_data($prep->exam_id).'" data-data_id="'.encode_data($prep->exam_prep_data_id).'" data-title="'.$get_slug_data->url_meta_title.'" data-page_heading="'.$get_slug_data->url_page_heading.'" data-short_desc="'.$get_slug_data->url_meta_desc.'" class="btn btn-xs btn-primary btn_edit_prep_guide_data">Edit</button>
					<button type="button" class="btn btn-xs btn-dark btn_del_prep_guide_data" data-exam_id="'.encode_data($prep->exam_id).'">Delete</a>
					</div>';
					
					$row[]	=	$no;

					$row[]	=	$prep->exam_prep_data_title;

					$row[]  =	$action;	

					$data[] = 	$row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->strm->_get_exam_prepperation_data($posts,$param,TRUE),
					"recordsFiltered" => $this->strm->_get_exam_prepperation_data($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddEditExamPrepGuide(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam_id=post_data('_prep_exam_id');
				$prep_data_id=post_data('_prep_id');
				$prep_guide_title=post_data('prep_guide_title');
				$prep_guide_short_desc=post_data('prep_guide_short_desc');
				$prep_guide_page_heading=post_data('prep_guide_page_heading');

				if(!empty($_exam_id)){
					$exam_id=decode_data($_exam_id);


					if(is_numeric($exam_id)){
						$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

						if(!empty($exam_data)){

							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_data->exam_id));

							if(empty($prep_data_id)){

								$prep_data_found=$this->strm->get_exam_preperation_data(array('exam_prep_data_title'=>$prep_guide_page_heading));

								$url_slug=url_slug($prep_guide_page_heading);
								$slug_url=base_url('exams/'.$url_slug);
								$get_slug_data=$this->sm->_get_slug_urls('url_value',array('url_value'=>$slug_url));

								if(empty($get_slug_data)){
									if(empty($prep_data_found)){
										$prep_data_to_add=array(
											'exam_id'=>$exam_id,
											'exam_prep_data_title'=>$prep_guide_page_heading,
											'exam_data_status'=>'active'
										);

										$added=$this->strm->store_exam_preperation_data($prep_data_to_add);

										if($added){

											$bread_crumb=array(
												'Home'=>base_url(),
												'Exams'=>base_url('exams'),
												$eaxm_data->exam_short_name.'('.$exam_data->exam_full_name.')'=>base_url('exams/'.$exam_slug->slug_value),
												$prep_guide_title=>null
											);

											$bredcrumb=json_encode($bread_crumb);

											$slug_data=array(
												'url_type'=>'exam',
												'url_glob_type'=>'exam_inner_data',
												'url_sub_type'=>'exam_prep_guide',
												'url_type_id'=>$exam_id,
												'url_sub_type_id'=>$added,												
												'url_country'=>'0',
												'url_city'=>'0',
												'url_meta_heading'=>str_replace('&amp;','&',$prep_guide_title),
												'url_meta_title'=>str_replace('&amp;','&',$prep_guide_title),
												'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $prep_guide_title)),
												'url_meta_desc'=>str_replace('&amp;','&',$prep_guide_short_desc),
												'url_og_title'=>str_replace('&amp;','&',$prep_guide_title),
												'url_og_desc'=>str_replace('&amp;','&',$prep_guide_short_desc),
												'url_page_heading'=>str_replace('&amp;','&',$prep_guide_page_heading),
												'url_breadcrumb'=>$bredcrumb,
												'url_value'=>str_replace('-amp-','-and-',$slug_url),
												'url_priority'=>'0.6',
												'url_data_change_freq'=>'yearly',
												'url_last_update'=>date('Y-m-d H:i:s'),
												'updated_by'=>$this->data['userdata']->user_id,
												'updated_at'=>date('Y-m-d H:i:s')
											);
											

											$this->sm->store_slug_urls($slug_data);

											$return['susccess']='Data has been uploaded';


										}else{
											$return['error']='Data not added in the system.';
										}
									}else{
										$return['error']='Given title already taken3.';
									}
								}else{
									$return['error']='Given title already taken 2.';
								}

										

							}else{
								$prep_dataid=decode_data($prep_data_id);

								$prep_data_found=$this->strm->get_exam_preperation_data(array('exam_prep_data_id'=>$prep_dataid));

								

								if(!empty($prep_data_found)){

									$prep_data_found2=$this->strm->get_exam_preperation_data(array('exam_prep_data_title'=>$prep_guide_page_heading));

									$url_slug=url_slug($prep_guide_page_heading);
									$slug_url=base_url('exams/'.$url_slug);

									//echo $slug_url;
									$get_slug_data=$this->sm->get_slug_urls(array('url_value'=>$slug_url),$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE);

									//print_obj($get_slug_data);die;

									if(!empty($get_slug_data)){
										if(!empty($prep_data_found2)){
											$prep_data_to_add=array(
												'exam_id'=>$exam_id,
												'exam_prep_data_title'=>$prep_guide_page_heading,
												'exam_data_status'=>'active'
											);

											$added=$this->strm->update_exam_preperation_data($prep_data_to_add,array('exam_prep_data_id'=>$prep_dataid));

											if(!$aaded){
												$bread_crumb=array(
													'Home'=>base_url(),
													'Exams'=>base_url('exams'),
													$eaxm_data->exam_short_name.'('.$exam_data->exam_full_name.')'=>base_url('exams/'.$exam_slug->slug_value),
													$prep_guide_title=>null
												);

												$bredcrumb=json_encode($bread_crumb);

												$slug_data=array(
													'url_type'=>'exam',
													'url_glob_type'=>'exam_inner_data',
													'url_sub_type'=>'exam_prep_guide',
													'url_type_id'=>$exam_id,
													'url_sub_type_id'=>$added,												
													'url_country'=>'0',
													'url_city'=>'0',
													'url_meta_heading'=>str_replace('&amp;','&',$prep_guide_title),
													'url_meta_title'=>str_replace('&amp;','&',$prep_guide_title),
													'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $prep_guide_title)),
													'url_meta_desc'=>str_replace('&amp;','&',$prep_guide_short_desc),
													'url_og_title'=>str_replace('&amp;','&',$prep_guide_title),
													'url_og_desc'=>str_replace('&amp;','&',$prep_guide_short_desc),
													'url_page_heading'=>str_replace('&amp;','&',$prep_guide_page_heading),
													'url_breadcrumb'=>$bredcrumb,
													'url_priority'=>'0.6',
													'url_data_change_freq'=>'yearly',
													'url_last_update'=>date('Y-m-d H:i:s'),
													'updated_by'=>$this->data['userdata']->user_id,
													'updated_at'=>date('Y-m-d H:i:s')
												);
												

												$this->sm->update_slug_urls($slug_data,array('url_value'=>$slug_url));

												$return['success']='Data updated successfully';
											}else{
												$return['error']='Data not updated.';
											}
										}else{
											$return['error']='No data found to update.';
										}
									}else{
										$return['error']='Given title already taken 1.';
									}

								}else{
									$rerturn['error']='Preparation data not foud to update';
								}
							}


						}else{
							$return['error']='Exam data not found in the system.';
						}
					}else{
						$return['error']='Exam id is not valid';
					}
				}else{
					$return['error']='Exam data not found in the system.';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexPreparationGuideDetailsData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){

			$_exam_id=$this->uri->segment(5,0);
			$_prep_id=$this->uri->segment(6,0);

			$exam_id=decode_data($_exam_id);
			$prep_id=decode_data($_prep_id);


			$exam=$this->strm->_get_exam(array('exam_id'=>$exam_id));

			$_menues=array();
			$_cmenues=array();

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'examdetails'));


			$this->data['exam_id']=$_exam_id;

			$this->data['exam_data']=$exam;

			$this->data['prep_id']=$_prep_id;

			//print_obj($this->data['exam_data']);

			$this->data['page_title']='Exam Preperation Details';

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->load('streams/vw_streams_exams_prep_guide_details', $this->data);


		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddExamPrepGuideData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_exam=post_data('_exam');
				$_prep_id=post_data('_prep_id');
				
				$prep_details=$this->input->post('prep_details');

				$exam_prep_faqus=$this->input->post('exam_prep_faqus');

				$user_id=decode_data(session_userdata('admin_id'));

				$exam_id=decode_data($_exam);
				$prep_id=decode_data($_prep_id);
				//$exam_menu_data_id=decode_data($_exam_menu_data_id);

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				//echo $exam_menu;die;

				$details_data=$this->strm->get_exam_preperation_details_data(array('exam_id'=>$exam_id,'exam_prep_data_pk_id'=>$prep_id));

				if(!empty($prep_details)){
					if(!empty($details_data)){
						$created_by=$details_data->crteated_by;
						$created_at=$details_data->created_at;
						$this->strm->delete_exam_preperation_details_data(array('exam_id'=>$exam_id,'exam_prep_data_pk_id'=>$prep_id));
					}

					$i=1;
					foreach ($prep_details as $key => $value) {
						// if(isset($value['data_serial'])){
						// 	$serial=$value['data_serial'];
						// }else{
						// 	$serial=$i;
						// }

						$serial=$i;
						$serial=$value['data_serial'];
						if($value['data_type']=='general'){
							$data_type_value=null;
						}else if($value['data_type']=='image'){
							$data_type_value=decode_data($value['data_type_value']);
						}else if($value['data_type']=='ads'){
							$data_type_value=decode_data($value['data_type_value']);
						}else if($value['data_type']=='youtube_video'){

							$yt_video_data=array(
								'youtube_link'=>$value['exam_content'],
								'youtube_video_name'=>$exam_data->exam_short_name.' Exam Preparation',
								'youtube_video_parent_id'=>$exam_data->exam_id
							);

							$yt_video_id=$this->onUploadFiles($yt_video_data,'youtube');
							$data_type_value=$yt_video_id;
						}


						$data_to_store[]=array(
							'exam_id'=>$exam_id,
							'exam_prep_data_pk_id'=>$prep_id,
							'exam_prep_data_type'=>$value['data_type'],
							'exam_prep_data_type_id'=>$data_type_value,
							'exam_prep_content '=>$value['prep_content'],
							'exam_prep_serial'=>$i,
							'created_by'=>(isset($created_by))?$created_by:$user_id,
							'updated_by'=>(!empty($details_data))?$user_id:null,
							'created_at'=>(isset($created_at))?$created_at:date('Y-m-d'),
							'updated_at'=>(!empty($details_data))?date('Y-m-d'):null
						);

						$i++;
					}

					if(!empty($exam_prep_faqus) && !empty($exam_prep_faqus[0]['ques']) && !empty($exam_prep_faqus[0]['ques'])){
						$j=1;
						foreach ($exam_prep_faqus as $key => $value) {
							
							$data_faq_to_store[]=array(
								'exam_id'=>$exam_id,
								'exam_prep_data_pk_id'=>$prep_id,
								'exam_prep_data_type'=>'faq',
								'exam_prep_data_type_id'=>$data_type_value,
								'exam_content_faq'=>$value['ques'],
								'exam_prep_content'=>$value['ans'],
								'exam_prep_serial'=>$j,
								'created_by'=>(isset($created_by))?$created_by:$user_id,
								'updated_by'=>(!empty($details_data))?$user_id:null,
								'created_at'=>(isset($created_at))?$created_at:date('Y-m-d'),
								'updated_at'=>(!empty($details_data))?date('Y-m-d'):null
							);

							$j++;
						}
					}

					if(!empty($data_to_store) && !empty($data_faq_to_store)){
						$added=$this->strm->store_exam_preperation_details_data($data_to_store,TRUE);
						$this->strm->store_exam_preperation_details_data($data_faq_to_store,TRUE);
						if($added){

							$return['success']='Exam Preparation details added successfully';
						}else{
							$return['error']='Exam Preparation details not added';
						}
					}else if(empty($data_to_store) && !empty($data_faq_to_store)){
						$added=$this->strm->store_exam_preperation_details_data($data_faq_to_store,TRUE);
						if($added){

							$return['success']='Exam Preparation details added successfully';
						}else{
							$return['error']='Exam Preparation details not added';
						}
					}else if(!empty($data_to_store) && empty($data_faq_to_store)){
						$added=$this->strm->store_exam_preperation_details_data($data_to_store,TRUE);
						if($added){

							$return['success']='Exam Preparation details added successfully';
						}else{
							$return['error']='Exam Preparation details not added';
						}
					}
					else{
						$return['error']='Exam Preparation details not found to add';
					}	
				}else{
					$return['error']='No data is there to add';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);redirect($this->data['admin_base_url']);
	}


	//Course Add edit new functions

	public function onLoadStreamCollegesEditForm(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('stream_id');

				$colleges=$this->um->get_colleges_by_stream($stream_id);

				$return['success']='Colleges data found';
				$return['html']=$this->theme->view('_pages/streams/vw_stream_colleges_edit_form',compact('colleges','stream_id'),true);

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onLoadCourseEditForm(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('course_id');

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);

				$colleges=$this->um->get_colleges_by_stream_and_course($course_data->course_stream,$course_id);

				$course_stream_categories=$this->strm->_get_stream_category(array('stream_category_status'=>'1'),FALSE);

				//print_obj($colleges);die;

				$parent_courses=$this->strm->get_course(array('course_parent_id'=>NULL),FALSE);

				if(!empty($course_data)){

					$return['success']='Course data found';
					$return['html']=$this->theme->view('_pages/streams/vw_course_edit_form',compact('streams','course_data','colleges','parent_courses','course_stream_categories'),true);

				}else{
					$return['error']='Course data not found';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}




	public function onAddCourse(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course 			= 	post_data('_course_id');

				$_parent_course 	= 	post_data('_parent_course');

				$old_stream_id		= 	post_data('_course_stream_id');
				$old_substream_id	=	post_data('_course_sub_stream_id');

				$course_stream 		= 	decode_data('course_streams');
				$course_name 		= 	post_data('course_name');
				$course_short_name 	= 	post_data('course_short_name');
				$course_serial 		= 	post_data('course_serial');
				$course_status 		= 	post_data('course_status');

				$course_sub_streams =	post_data('course_sub_streams');

				$course_type 		=	post_data('course_type');

				$course_streams_category=decode_data('course_streams_category');

				$course_duration 		= 	post_data('course_duration');

				$course_duration_month 		= 	post_data('course_duration_month');
				$course_duration_type 		= 	post_data('course_duration_type');

				$course_type_2=post_data('course_type_2');

				$course_degree_type=post_data('course_degree_type');

				$course_pass_type=post_data('course_pass_type');

				if($_parent_course!=NULL || $_parent_course!=''){
					$__parent_course=decode_data($_parent_course);
					if($__parent_course>0){
						$parent_course=$__parent_course;
						$parent_course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$parent_course));
					}else{
						$parent_course=NULL;
						$parent_course_slug='';
					}
				}else{
					$parent_course=NULL;
					$parent_course_slug='';
				}

				if(!empty($course_sub_streams) && is_string($course_sub_streams)){
					$sub_stream_id=decode_data($course_sub_streams);
				}else{
					$sub_stream_id=null;
				}

				$course_short_name_2=strtolower($course_short_name).','.$_course_short_name_2;

				$course_data_to_adda=array(
					'course_parent_id'=>$parent_course,
					'course_category'=>$course_streams_category,
					'course_stream'=>$course_stream,
					'course_sub_stream'=>$sub_stream_id,
					'course_name'=>$course_name,
					'course_short_name'=>$course_short_name,
					'course_short_name_2'=>$course_short_name_2,
					'course_duration'=>'0',
					'course_duration_year'=>$course_duration,
					'course_duration_month'=>$course_duration_month,
					'course_duration_type'=>$course_duration_type,
					'course_type'=>$course_type_2,
					'course_type_2'=>$course_type_2,
					'course_passed_type'=>$course_pass_type,
					'course_status'=>$course_status
				);

				if($course_type=='normal'){
					$course_name=$course_name;
					$course_data_to_adda['course_is_lateral']='2';
					$course_data_to_adda['course_is_honors']='2';
				}else if($course_type=='honours'){
					$course_name=$course_name.' {Hons.}';
					$course_data_to_adda['course_is_lateral']='2';
					$course_data_to_adda['course_is_honors']='1';
				}else if($course_type=='lateral'){
					$course_name=$course_name.' {Lateral}';
					$course_data_to_adda['course_is_lateral']='1';
					$course_data_to_adda['course_is_honors']='2';
				}

				if($parent_course>0){
					$course_found=$this->strm->get_course(array('course_name'=>$course_name,'course_parent_id'=>$parent_course));
				}else{
					$course_found=$this->strm->get_course(array('course_name'=>$course_name));
				}

				if(!empty($_course)){
					$added=$this->strm->update_course_data($course_data_to_adda,array('course_id'=>$_course));
					$course_id=$_course;
					$msg='Course updated successfully';
				}else{					
					$course_id=$this->strm->store_course_data($course_data_to_adda);
					$msg='Course added successfully';
				}

				if($course_id){
					$_colleges=$this->um->get_colleges_by_stream_and_course($course_id,$course_stream);
					if(!empty($_colleges)){
						foreach ($_colleges as $key => $value) {
							$college_course_ids=$value->college_course_ids;
							$college_streams_ids=$value->college_streams_ids;
							$college_sub_streams_ids=$value->college_sub_streams_ids;

							$new_college_streams_ids=removeFromString($college_streams_ids,$old_stream_id);
							if(!empty($college_sub_streams_ids)){
								$new_college_sub_streams_ids=removeFromString($college_sub_streams_ids,$old_substream_id);
							}else{
								$new_college_sub_streams_ids=$old_substream_id;
							}
							
							$this->im->update_college_data(array('college_streams_ids'=>$new_college_streams_ids,'college_sub_streams_ids'=>$new_college_sub_streams_ids),array('college_id'=>$value->college_id));
						}
					}
					
					$colleges=$this->um->get_colleges_by_stream_and_course($course_id,$course_stream);
					$return['html']=$this->theme->view('_pages/streams/vw_colleges_list',compact('colleges'),true);
					$return['success']=$msg;
				}else{
					$return['error']='There was an error occurred.Please try after some time.';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCourseData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('_course_edit_id');
				$stream_id=post_data('course_stream_id');
				$prev_stream_id=post_data('_course_edit_stream_id');

				$get_course=$this->strm->get_course(array('course_id'=>$course_id));

				if(!empty($get_course)){					

					$data_to_update=array('course_stream'=>$stream_id);

					$updated=$this->strm->update_course_data($data_to_update,array('course_id'=>$course_id));

					if($updated){
						$_colleges=$this->um->get_colleges_by_stream_and_course($course_id,$course_data->course_stream);

						/*if(!empty($_colleges)){
							foreach ($_colleges as $key => $value) {
								$stream_ids=char_separated_to_array($value->college_streams_ids);
								$course_ids=char_separated_to_array($value->college_course_ids);

								$stream_ids = array_diff($array, [$prev_stream_id]);

								$this->im->update_college_data(array('college_streams_ids'=>char_separated($stream_ids)),array('college_id'=>$value->college_id));
							}
						}*/

						$colleges=$this->um->get_colleges_by_stream_and_course($course_id,$stream_id);

						$return['success']='Course data has been updated';
						$return['html']=$this->theme->view('_pages/streams/vw_course_colleges',compact('colleges'),true);
					}else{
						$return['error']='Course data not updated';
					}

				}else{
					$retirn['error']='Course not found';
				}


			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onUpdateStreamTaggedColleges(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$stream_id=post_data('course_stream_id');
				$college_ids=$this->input->post('stream_colleges')?$this->input->post('stream_colleges'):'';

				if(!empty($college_ids)){
					foreach($college_ids as $key=>$value){
						$college_data=$this->im->get_college_data(array('college_id'=>$value));

						$college_stream_ids=$college_data->college_stream_ids;

						$stream_ids=removeFromString($college_stream_ids,$stream_id);

						$this->im->update_college_data(array('college_streams_ids'=>$stream_ids),array('college_id'=>$value));

					}

					$colleges=$this->um->get_colleges_by_stream($stream_id);
					$return['success']='Course data has been updated';
					$return['html']=$this->theme->view('_pages/streams/vw_course_colleges',compact('colleges'),true);

				}else{
					$retirn['error']='Select college';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
}