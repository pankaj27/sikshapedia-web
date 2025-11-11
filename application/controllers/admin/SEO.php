<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class SEO  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	public function indexColleges(){

		//$files=$this->sm->___get_user_file('storage_id,media_disk_path_relative,user_storage_type,user_file_type_id,user_file_type',array('user_storage_type'=>'user_intro_video','user_file_type'=>'4','user_file_type_id'=>'9894'),FALSE);

           // print_obj($files);die;


		$arr=array(
			'front_faculties_section',
			'front_placement_section',
			'front_news_brief_section',
			'front_google_ads_section',
			'front_college_comment_section',
			'front_nearby_colleges_universities_section'
		);

		$d=serialize($arr);

		//echo $d;die;


		if(session_userdata('isAdminLoggedin')){

			//$cities=$this->slug_gen();

			// $currentUrl = "https://www.sikshapedia.com"; // Replace with your current URL
			// $url = "https://www.sikshapedia.com/in/colleges/west-bengal/durgapur?agn=nirf"; // Replace with your target URL

			// // Parse the URL to get the query parameters
			// //$queryParams = parse_url($url, PHP_URL_QUERY);

			// $paramToAdd = "aff=nirf";

			// // If there are query parameters in the target URL, you can append them to the current URL
			// if (strpos($url, '?') === false) {
			//     // Case 1: If the parameter is not available, add it with a question mark
			//     $url .= '?' . $paramToAdd;
			// } else {
			//     // Case 2: If the parameter is available, add it with an ampersand
			//     $url .= '&' . $paramToAdd;
			// }

			// echo $currentUrl;die;


			$this->theme->title($this->data['page_title'])->load('seo/vw_colleges', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexExams(){

		if(session_userdata('isAdminLoggedin')){


			$this->theme->title($this->data['page_title'])->load('seo/vw_exams', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexURLChecker(){

		if(session_userdata('isAdminLoggedin')){


			$this->theme->title($this->data['page_title'])->load('seo/vw_urlcheker', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexExamsStreams(){

		if(session_userdata('isAdminLoggedin')){

			$_streams=array();

			$streams=$this->strm->get_streams_with_exam_url(array('stream_status'=>'1','url_type'=>'exam_stream'));

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>$value->stream_id,
						'stream_edit_url'=>$this->data['admin_base_url'].'/seo/exams/streams/'.encode_data($value->stream_id),
						'stream_name'=>strtoupper($value->stream_name),
						'stream_url'=>base_url('exams/'.strtolower($value->stream_name))				
					);	
				}				
			}

			$this->data['streams']=$_streams;


			$this->theme->title($this->data['page_title'])->load('seo/vw_exams_streams', $this->data);			

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexExamsStreamsEdit($id){
		if(session_userdata('isAdminLoggedin')){

			$stream_id=decode_data($id);

			$this->data['stream_id']=$id;

			$this->data['back_link']=$this->data['admin_base_url'].'/seo/exams/streams';

			$this->data['stream_data']=$this->strm->get_streams_with_exam_url(array('stream_id'=>$stream_id),TRUE);

			$this->theme->title($this->data['page_title'])->load('seo/vw_exams_streams_page_edit', $this->data);

		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function indexCourses(){

		if(session_userdata('isAdminLoggedin')){


			$this->theme->title($this->data['page_title'])->load('seo/vw_courses', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexCoursesCategory(){

		if(session_userdata('isAdminLoggedin')){
			
			$straem_categories=$this->strm->_get_stream_category(array('stream_category_status'=>'1'),FALSE);

			//print_obj($straem_categories);die;


			$_stream_categories=array();

			if(!empty($straem_categories)){
				foreach ($straem_categories as $key => $value) {
					$slug_value=url_slug($value->stream_category);
					$slug_url=base_url('courses/'.$slug_value);
					$slug_data=$this->sm->get_slug_urls(array('url_value'=>$slug_url));

					$_stream_categories[]=array(
						'category_name'=>$value->stream_category,
						'category_display_name'=>$value->stream_category_show_name,
						'category_display_description'=>$value->stream_category_description,
						'category_url'=>$slug_url,
						'category_slug_data'=>$slug_data,
						'category_edit_url'=>$this->data['admin_base_url'].'/seo/courses/catgeories/'.encode_data($value->stream_category_id)
					);
				}
			}


			$this->data['stream_categories']=$_stream_categories;

			$this->theme->title($this->data['page_title'])->load('seo/vw_courses_category', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexCoursesCategoryEdit($stream_category_id){

		if(session_userdata('isAdminLoggedin')){

			$streams=array();

			$stream_category_id=decode_data($stream_category_id);

			
			$straem_categories=$this->strm->_get_stream_category(array('stream_category_id'=>'1'));

			//print_obj($straem_categories);

			$_streams=$this->strm->get_inset_stream('stream_category',$stream_category_id);

			//print_obj($_streams);die;

			if(!empty($_streams)){
				foreach ($_streams as $key => $value) {
					$streams[]=array(
						'stream_id'=>$value->stream_id,
						'stream_name'=>$value->stream_name,
						'stream_url'=>'',
						'stream_edit_url'=>$this->data['admin_base_url'].'/seo/courses/catgeories/'.encode_data($stream_category_id).'/'.encode_data($value->stream_id)
					);
				}
			}


			$this->data['streams']=$streams;


			$this->theme->title($this->data['page_title'])->load('seo/vw_courses_category_edit', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexCoursesCategoryCourseEdit($stream_category_id,$course_id){

		if(session_userdata('isAdminLoggedin')){

			$streams=array();

			$stream_category_id=decode_data($stream_category_id);
			$stream_id=decode_data($course_id);

			//echo $stream_id;


			//echo $stream_category_id.'<br>'.$course_id;die;

			$this->data['stream_category']=$this->strm->_get_stream_category(array('stream_category_id'=>$stream_category_id));

			$this->data['stream_data']=$this->strm->get_stream(array('stream_id'=>$stream_id));

			//print_obj($course_data);die;
			
			$straem_categories=$this->strm->_get_stream_category(array('stream_category_id'=>'1'));

			// echo $stream_category_id;'<br>';
			// echo $stream_id;die;

			$slug_url_data=$this->sm->get_slug_urls(array('url_type_id'=>$stream_category_id,'url_sub_type_id'=>$stream_id,'url_type'=>'course_stream','url_glob_type'=>'course_stream_colleges_search'));

			//print_obj($slug_url_data->url_id);die;

			$this->data['slug_url_data']=$slug_url_data;

			if(!empty($slug_url_data)){
				$get_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_data->url_id,'slug_type_json_ld'=>'ItemList'));
			}else{
				$get_struct_data=array();
			}
			
			//print_obj($get_struct_data);die;

			$this->data['struct_data']=$get_struct_data;

			$this->data['stream_category_id']=$stream_category_id;
			$this->data['course_id']=$stream_id;

			$this->data['stream_category_link']=$slug_url_data->url_value;

			$this->data['back_link']=$this->data['admin_base_url'].'/seo/courses/catgeories/'.encode_data($stream_category_id);

			$this->theme->title($this->data['page_title'])->load('seo/vw_courses_category_course_edit', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateSeoCoursesCategoryStream(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

					$stream_id=post_data('stream_id');
					$stream_category_type=post_data('stream_category_type');
					$page_heading=post_data('page_heading');
					$page_sub_heading=post_data('page_sub_heading');
					$page_meta_heading=post_data('page_meta_heading');
					$page_meta_title=post_data('page_meta_title');
					$page_meta_keywords=post_data('page_meta_keywords');
					$page_meta_desc=post_data('page_meta_desc');
					$page_og_title=post_data('page_og_title');
					$page_og_desc=post_data('page_og_desc');
					$page_twitter_title=post_data('page_twitter_title');
					$page_twitter_desc=post_data('page_twitter_desc');
					$page_search_heading=post_data('page_search_heading');
					$page_content=post_data('page_content');
					$page_struct_data=$this->input->post('page_struct_data');

					$course_category_type=$this->strm->get_stream_category(array('stream_category_id'=>$stream_category_type));

					$category_url_data=$this->sm->get_slug_urls(array('url_type_id'=>$stream_category_type,'url_sub_type_id'=>$stream_id,'url_type'=>'course_stream','url_glob_type'=>'course_stream_colleges_search'));

					//print_obj($category_url_data);die;

					$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

					$breadcrumb=array(
						'Home'=>base_url(),
						ucwords($course_category_type->stream_category)=>$category_url_data->url_value,
						ucwords($stream_data->stream_name)=>''
					);

					if(!empty($category_url_data) && !empty($category_url_data->url_value)){
						$url_value=$category_url_data->url_value;
					}else{
						$url_value=$category_url_data->url_value.'/'.strtolower($stream_data->stream_name);
					}

					$url_page_description=(!empty($page_content))?$page_content:'';

					$slug_data=array(
						 'url_type'=>'course_stream',
						 'url_glob_type'=>'course_stream_colleges_search',
						 'url_type_id'=>$stream_category_type,
						 'url_sub_type_id'=>$stream_id,
						 'url_country'=>'99',
						 'url_stream'=>$stream_id,
						 'url_meta_heading'=>$page_meta_heading,
						 'url_meta_title'=>$page_meta_title,
						 //'url_meta_key_words'=>$page_meta_keywords,
						 'url_meta_desc'=>$page_meta_desc,
						 'url_og_title'=>$page_og_title,
						 'url_og_desc'=>$page_og_desc,
						 'url_og_type'=>$page_sub_heading,
						 'url_og_locale'=>'en-US',
						 'url_twitter_title'=>$page_twitter_title,
						 'url_twitter_desc'=>$page_twitter_desc,
						 'url_page_heading'=>$page_heading,
						 'url_page_sub_heading'=>$page_sub_heading,
						 'url_page_description'=>$url_page_description,
						 'url_breadcrumb'=>json_encode($breadcrumb),
						 'url_value'=>$url_value,
						 'url_canonical_value'=>$url_value,
						 'url_permalink_value'=>$url_value,
						 'url_priority'=>'0.8',
						 'url_data_change_freq'=>'monthly',
						 'url_last_update'=>date('Y-m-d H:i:s'),
						 'updated_by'=>$this->data['userdata']->user_id,
						 'updated_at'=>date('Y-m-d')
					);

					$url_data=$this->sm->get_slug_urls(array('url_value'=>$url_value));

					if(empty($url_data)){
						$url_id=$this->sm->store_slug_urls($slug_data);
					}else{
						$this->sm->update_slug_urls($slug_data,array('url_value'=>$url_value));

						$url_id=$url_data->url_id;
					}

					//echo $url_id;die;

					if($url_id){

						if(!empty($page_struct_data)){
							$get_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$url_id));

							$dt=date('Y-m-d H:i:s');
							$date_modified=date('c',strtotime($dt));
							$struct_data=array(
								'strcut_slug_url_id'=>$url_id,
								'slug_type_json_ld'=>'ItemList',
								'slug_type_json_ld_data'=>$page_struct_data,
								'slug_url'=>$url_value,
								'date_modified'=>$date_modified,
								'date_published'=>$date_modified
							);

							if(empty($get_struct_data)){
								$this->sm->store_slug_struct_data($struct_data);
							}else{
								$this->sm->update_slug_struct_data($struct_data,array('strcut_slug_url_id'=>$url_id,'slug_url'=>$url_value,'slug_type_json_ld'=>'ItemList'));
							}
						}	

						$return['success']='URL data has been updated.';
					}else{
						$return['error']='Data not updated';
					}

					header('Content-Type: application/json');

					echo json_encode($return);
					session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexSearches(){

		 $country_states=encode_data('99#1');

    	//echo $country_states;die;

		if(session_userdata('isAdminLoggedin')){

			$states=$this->com->get_states(array('state_country_id'=>'99','state_status'=>'1'));

			if(!empty($states)){
				foreach ($states as $key => $value) {
					$_states[]=array(
						'state_id'=>encode_data($value->state_id),
						'state_name'=>$value->state_name
					);
				}
			}

			$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>encode_data($value->stream_id),
						'stream_name'=>$value->stream_name
					);
				}
			}

			$institute_categories=$this->im->get_institute_categories(array('inst_category_country_id'=>'99'),FALSE);

			if(!empty($institute_categories)){
				foreach ($institute_categories as $key => $value) {
					$_institute_categories[]=array(
						'inst_category_id'=>$value->inst_category_id,
						'inst_category_short_name'=>$value->inst_category_short_name,
						'url_slug'=>'c_cate='.$value->inst_category_name_slug
					);
				}

			}else{
				$_institute_categories=array();
			}


			$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4'),FALSE);

			if(!empty($institute_types)){
				foreach ($institute_types as $key => $value) {
					if(!empty($value->inst_type_short_name)){
						$_institute_types[]=array(
							'inst_type'=>$value->inst_type,
							'inst_type_short_name'=>$value->inst_type_short_name,
							'url_slug'=>'ctype='.$value->inst_type_name_slug
						);
					}
					
				}

			}else{
				$_institute_types=array();
			}

			$agencies=$this->im->get_agencies(array('agency_country_id'=>'99'));

			if(!empty($agencies)){
				foreach ($agencies as $key => $value) {
					$_agencies[]=array(
						'agency_id'=>$value->agency_id,
						'agency_short_name'=>$value->agency_short_name,
						'url_slug'=>'agn='.$value->agency_name_slug
					);
				}

			}else{
				$_agencies=array();
			}

			$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>'99'),FALSE);
			if(!empty($affiliation_types)){
				foreach ($affiliation_types as $key => $value) {
					$_affiliation_types[]=array(
						'statutory_body_id'=>$value->statutory_body_id,
						'statutory_body_abbr'=>$value->statutory_body_abbr,
						'statutory_body_name'=>$value->statutory_body_name,
						'url_slug'=>'aff='.$value->statutory_body_abbr_slug
					);
				}
			}else{
				$_affiliation_types=array();
			}

			$this->data['streams']=$_streams;

			$this->data['states']=$_states;

			$this->data['institute_categories']=$_institute_categories;

			$this->data['institute_types']=$_institute_types;

			$this->data['agencies']=$_agencies;

			$this->data['affiliation_types']=$_affiliation_types;


			$this->theme->title($this->data['page_title'])->load('seo/vw_searches', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	/**College Search***/


	/***Images Seo***/
	public function indexSearchesSeoImages(){
		if(session_userdata('isAdminLoggedin')){

			$m=$this->generate_college_menu_slug();die;

			//$this->generate_college_course_clug('226');die;

			$this->theme->title($this->data['page_title'])->load('seo/vw_images', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexSearchesColleges(){
		if(session_userdata('isAdminLoggedin')){

			$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');



			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>$value->stream_id,
						'stream_name'=>$value->stream_name
					);
				}
			}

			//print_obj($_streams);die;

			$institute_categories=$this->im->get_institute_categories(array('inst_category_country_id'=>'99'),FALSE);

			if(!empty($institute_categories)){
				foreach ($institute_categories as $key => $value) {
					$_institute_categories[]=array(
						'inst_category_id'=>$value->inst_category_id,
						'inst_category_short_name'=>$value->inst_category_short_name,
						'url_slug'=>'c_cate='.$value->inst_category_name_slug
					);
				}

			}else{
				$_institute_categories=array();
			}


			$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4'),FALSE);

			if(!empty($institute_types)){
				foreach ($institute_types as $key => $value) {
					if(!empty($value->inst_type_short_name)){
						$_institute_types[]=array(
							'inst_type'=>$value->inst_type,
							'inst_type_short_name'=>$value->inst_type_short_name,
							'url_slug'=>'ctype='.$value->inst_type_name_slug
						);
					}
					
				}

			}else{
				$_institute_types=array();
			}

			$agencies=$this->im->get_agencies(array('agency_country_id'=>'99'));

			if(!empty($agencies)){
				foreach ($agencies as $key => $value) {
					$_agencies[]=array(
						'agency_id'=>$value->agency_id,
						'agency_short_name'=>$value->agency_short_name,
						'url_slug'=>'agn='.$value->agency_name_slug
					);
				}

			}else{
				$_agencies=array();
			}

			$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>'99'),FALSE);
			if(!empty($affiliation_types)){
				foreach ($affiliation_types as $key => $value) {
					$_affiliation_types[]=array(
						'statutory_body_id'=>$value->statutory_body_id,
						'statutory_body_abbr'=>$value->statutory_body_abbr,
						'statutory_body_name'=>$value->statutory_body_name,
						'url_slug'=>'aff='.$value->statutory_body_abbr_slug
					);
				}
			}else{
				$_affiliation_types=array();
			}

			$this->data['streams']=$_streams;

			$this->data['institute_categories']=$_institute_categories;

			$this->data['institute_types']=$_institute_types;

			$this->data['agencies']=$_agencies;

			$this->data['affiliation_types']=$_affiliation_types;

			$this->data['page_title']='College Search Page SEO';

			$this->theme->title($this->data['page_title'])->load('seo/vw_searches_colleges', $this->data);

		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexSearchesCollegesListDetail(){
		if(session_userdata('isAdminLoggedin')){

			$_url_id=$this->uri->segment(6,0);

			if(!empty($_url_id) && $_url_id!='0'){
				$url_id=decode_data($_url_id);
				$_colleges=array();

				$url_data=$this->sm->get_slug_urls(array('url_id'=>$url_id));

				//print_obj($url_data);die;

				$this->data['slug_data']=$url_data;

				if(!empty($url_data)){
					$url_state=$url_data->url_state;
					$url_city=$url_data->url_city;
					$url_country=$url_data->url_country;
					//$url_colleges=$url_data->url_colleges;
					$url_stream=$url_data->url_stream;

					if(!empty($url_country) && $url_country>0){
						$param['country_id']=$url_country;
					}

					if(!empty($url_state) && $url_state>0){
						$param['state_id']=$url_state;
					}

					if(!empty($url_city) && $url_city>0){
						$param['city_id']=$url_city;
					}

					if(!empty($url_stream) && $url_stream>0){
						$param['stream_id']=$url_stream;
					}

					$param['short_by_order']='yes';

					//echo $url_stream;die;

					$colleges=$this->im->_____get_colleges($param);

					//print_obj($colleges);die;

					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {
							$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

							if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
				                $college_logo=$_college_logo->media_disk_path_relative;
				            }else{
				                $college_logo=base_url().'uploads/app/default/no.jpg';
				            }

							$_colleges[]=array(
								'college_id'=>$value->college_user_id,
								'college_name'=>$value->college_formatted_name,
								'college_logo'=>$college_logo
							);
						}
					}

					$this->data['colleges']=$_colleges;

				}else{

				}
				
			}else{

			}

			$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>encode_data($value->stream_id),
						'stream_name'=>$value->stream_name
					);
				}
			}

			$institute_categories=$this->im->get_institute_categories(array('inst_category_country_id'=>'99'),FALSE);

			if(!empty($institute_categories)){
				foreach ($institute_categories as $key => $value) {
					$_institute_categories[]=array(
						'inst_category_id'=>$value->inst_category_id,
						'inst_category_short_name'=>$value->inst_category_short_name,
						'url_slug'=>'c_cate='.$value->inst_category_name_slug
					);
				}

			}else{
				$_institute_categories=array();
			}


			$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4'),FALSE);

			if(!empty($institute_types)){
				foreach ($institute_types as $key => $value) {
					if(!empty($value->inst_type_short_name)){
						$_institute_types[]=array(
							'inst_type'=>$value->inst_type,
							'inst_type_short_name'=>$value->inst_type_short_name,
							'url_slug'=>'ctype='.$value->inst_type_name_slug
						);
					}
					
				}

			}else{
				$_institute_types=array();
			}

			$agencies=$this->im->get_agencies(array('agency_country_id'=>'99'));

			if(!empty($agencies)){
				foreach ($agencies as $key => $value) {
					$_agencies[]=array(
						'agency_id'=>$value->agency_id,
						'agency_short_name'=>$value->agency_short_name,
						'url_slug'=>'agn='.$value->agency_name_slug
					);
				}

			}else{
				$_agencies=array();
			}

			$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>'99'),FALSE);
			if(!empty($affiliation_types)){
				foreach ($affiliation_types as $key => $value) {
					$_affiliation_types[]=array(
						'statutory_body_id'=>$value->statutory_body_id,
						'statutory_body_abbr'=>$value->statutory_body_abbr,
						'statutory_body_name'=>$value->statutory_body_name,
						'url_slug'=>'aff='.$value->statutory_body_abbr_slug
					);
				}
			}else{
				$_affiliation_types=array();
			}

			$this->data['streams']=$_streams;

			$this->data['institute_categories']=$_institute_categories;

			$this->data['institute_types']=$_institute_types;

			$this->data['agencies']=$_agencies;

			$this->data['affiliation_types']=$_affiliation_types;

			$this->theme->title($this->data['page_title'])->load('seo/vw_searches_colleges_add_edit', $this->data);

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSaveURLSearchData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$url_ids=$this->input->post('url_id');

				if(!empty($url_ids)){

					foreach ($url_ids as $key => $value) {
						$college=$this->im->get_college_specific_data('college_user_id,college_country_id,college_state_id,college_city_id,college_name,college_short_name',array('college_user_id'=>$value),true);

						$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value,'user_storage_type'=>'user_logo'));

						if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
			                $college_logo=$_college_logo->media_disk_path_relative;
			            }else{
			                $college_logo=base_url().'uploads/app/default/no.jpg';
			            }

			            $state_data=$this->sm->get_states(array('state_id'=>$college->college_state_id));
			            $city_data=$this->sm->get_city(array('city_id'=>$college->college_city_id));

						$college_data[]=array(
							'college_id'=>$value,
							'college_name'=>$college->college_name,
							'college_state'=>$state_data->state_name,
							'college_city'=>$city_data->city_name,
							'college_logo'=>$college_logo,
							'college_review'=>'',
							'college_total_review'=>'43'
						);
					}


				}else{
					$return['error']='URL\'s not selected';
				}

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchColleges(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('admin_id'));

				//echo $user_id;die;
				$param['column_order'] = array(
					null,
					'college_name',
					'country_name',
					'state_name',
					'college_estd_year'
				);

				$param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no','access_url');
				$param['order'] = array('college_id' => 'ASC');
				$posts=$this->input->post();

				$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);

				//print_obj($list);die;
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$meta_title='';
            	$meta_desc='';
            	$meta_key='';
            	$meta_og_title='';
            	$meta_og_desc='';

				foreach ($list as $user){
					$no++;

					$row = array();

					$slug=$this->sm->get_slug(array('slug_type_id'=>$user->user_id,'slug_type'=>'7'));


					$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user->user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

	    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
	                    $college_logo=$_college_logo->media_disk_path_relative;
	                }else{
	                    $college_logo=base_url().'uploads/app/default/no.jpg';
	                }


	                $logo='<img src="'.$college_logo.'" class="table-user-thumb" alt="">';

	                if($user->college_course_ids!=NULL){
						$courses=$this->im->get_group_concat_user_course_data('CONCAT(course_short_name,IF(course_is_lateral=1,"{Lateral}",""))','course_id',$user->college_course_ids);
						$college_courses=$courses->concated_value;
	                }else{
	                	$college_courses='Not Added';
	                }


	                $slug_data=$this->sm->get_slug_urls(array('url_value'=>$user->access_url,'url_type'=>'college_static_url'));

	                if(!empty($slug_data)){
	                	$meta_title=$slug_data->url_meta_title;
	                	$meta_desc=$slug_data->url_meta_desc;
	                	$meta_key=$slug_data->url_meta_key_words;
	                	$meta_og_title=$slug_data->url_og_title;
	                	$meta_og_desc=$slug_data->url_og_desc;
	                	$meta_url='';
	                }else{
	                	$meta_title='';
		            	$meta_desc='';
		            	$meta_key='';
		            	$meta_og_title='';
		            	$meta_og_desc='';
		            	$meta_url='';
	                }



	                $college_name=ucwords($user->college_name);
	                
					if($this->data['userdata']->user_role=='1'){

						$search_data_found=$this->sm->__get_system_search_data(array('search_data_type_id'=>$user->user_id,'search_data_type'=>'COLLEGE_NAME'));
						

						$slug_url_data=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_type_id'=>$user->user_id));

						//,TRUE,null,'DESC',TRUE

						$url_value=(!empty($slug_url_data->url_value))?$slug_url_data->url_value:'<button class="btn btn-xs btn-primary btn_generate_slug" data-college_id="'.encode_data($user->user_id).'">Generate Slug</button>';

						if(!empty($slug_url_data) && !empty($search_data_found)){
							$checkrow	=	$no.'<input type="checkbox" name="slug_type_ids[]" class="checkbox slug_type_ids" value="'.encode_data($user->user_id).'">';
						}else if(empty($slug_url_data) && !empty($search_data_found)){

							$checkrow	=	$no.'<input type="checkbox" name="slug_type_ids[]" class="checkbox slug_type_ids" value="'.encode_data($user->user_id).'">';
						}else if(!empty($slug_url_data) && empty($search_data_found)){

							$checkrow	=	$no.'<input type="checkbox" name="search_type_ids[]" class="checkbox search_type_ids" value="'.$user->user_id.'">';
						}

						//$row[]	=	$no;


						$college_data_row=$checkrow.$logo.'<span> <a href="'.$user->access_url.'" target="_blank">'.$college_name.'</a></span><br>Courses Offered:'.$college_courses.'<br><br>Access URL:'.$user->access_url.'<br>'.$url_value;
					}else{
						//$row[]	=	$no;
						$college_data_row=$logo.'<span> <a href="'.$user->access_url.'" target="_blank">'.$college_name.'</a></span><br>Courses Offered:'.$college_courses;
					}	


					//<button type="button" class="btn btn-xs btn-dark btn_edit_meta" data-college_user="'.encode_data($user->user_id).'" data-college_name="'.$college_name.'" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editCollegeMetaModal">Edit Meta</button>

					

					$row[]	=	$no;
					$row[]	= 	$college_data_row;
					$row[]	=	$user->country_name;
					$row[]	=	$user->state_name;
					$row[]	=	$user->city_name;	

					$row[]	=	'<button type="button" class="btn btn-xs btn-dark btn_edit_meta" data-college_user="'.encode_data($user->user_id).'" data-college_name="'.$college_name.'" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editCollegeMetaModal">Edit Meta</button>';		

					//$row[]  =	'<button type="button" class="btn btn-xs btn-dark btn_edit_meta" data-college_user="'.encode_data($user->user_id).'" data-college_name="'.$college_name.'" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editCollegeMetaModal">Edit Meta</button>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_colleges($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_colleges($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onLoadCollegeMetadata(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_college=post_data('_college');

				$menu_link_id=decode_data($_college);

				$college_data=$this->im->get_college_specific_data('college_user_id,college_name,college_logo,college_banner,colllege_logo_alt_text,colllege_banner_alt_text',array('college_user_id'=>$menu_link_id),TRUE);

				//print_obj($college_data);die;


				if($this->input->post('data_edit_type')){
					$data_type=$this->input->post('data_edit_type');
				}else{
					$data_type='menu_meta';
				}
				

				//echo $menu_link_id;

				$param['menu_link_id']=$menu_link_id;
				$college_inner_menues=$this->sm->_get_inner_menues(null,$param);

				//print_obj($college_inner_menues);die;

				if(!empty($college_inner_menues)){
					foreach ($college_inner_menues as $key => $value) {
						$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$menu_link_id,'url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type_id'=>$value->menu_id));

						$menu_search_data=$this->sm->__get_system_search_data(array('search_data_access_url'=>$value->menu_link));
						$inner_meues[$value->menu_id][]=array(
							'menu_id'=>$value->menu_id,
							'menu_name'=>$value->menu_name,
							'menu_alias'=>$value->menu_slug,
							'menu_slug'=>$slug_data,
							'menu_search_page_title'=>$menu_search_data->search_data_name
						);
					}
				}else{
					$inner_meues=array();
				}

				if(isset($menu_link_id)){
					$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$menu_link_id,'user_storage_type'=>'user_banner'));
					$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$menu_link_id,'user_storage_type'=>'user_logo'));
				}else{
					$_college_banner='';
					$_college_logo='';
				}				

				if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
	                $college_logo=$_college_logo->media_disk_path_relative;
	                $college_logo_file_name=$_college_logo->media_disk_name;
	                $path_info = pathinfo($college_logo);

					$logo_extension = $path_info['extension'];
					$logo_name = str_replace('sikshapedia-logo','',$path_info['filename']);
	            }else{
	                $college_logo=base_url().'uploads/app/default/no.jpg';
	                $college_logo_file_name='';
	                $logo_extension = '';
					$logo_name = '';
	            }

	            if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
	                $college_banner=$_college_banner->media_disk_path_relative;
	                $college_banner_file_name=$_college_banner->media_disk_name;
	                // Using pathinfo to separate extension and name
					$path_info = pathinfo($college_banner);

					$banner_extension = $path_info['extension'];
					$banner_name = str_replace('sikshapedia-banner','',$path_info['filename']);
	            }else{
	                $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
	                $college_banner_file_name='';
	                $banner_extension = '';
					$banner_name = '';
	            }

	            if(!empty($college_data->colllege_logo_alt_text)){
	            	$college_logo_alt_name=str_replace('sikshapedia logo','',strtolower($college_data->colllege_logo_alt_text));
	            }else{
	            	$college_logo_alt_name='';
	            }


	            if(!empty($college_data->colllege_banner_alt_text)){
	            	$college_banner_alt_name=str_replace('sikshapedia banner','',strtolower($college_data->colllege_banner_alt_text));
	            }else{
	            	$college_banner_alt_name='';
	            }

				//print_obj($inner_meues);die;

				$this->data['inner_menues']=$inner_meues;

				$this->data['college_id']=$_college;

				$this->data['college_logo']=$college_logo;
				$this->data['college_banner']=$college_banner;
				$this->data['college_logo_alt_name']=ucwords($college_logo_alt_name);
				$this->data['college_banner_alt_name']=ucwords($college_banner_alt_name);
				$this->data['banner_extension']=$banner_extension;
				$this->data['banner_name']=str_replace('-',' ',$banner_name);
				$this->data['logo_extension']=$logo_extension;
				$this->data['logo_name']=str_replace('-',' ',$logo_name);


				if($data_type=='menu_meta'){
					$return['html']=$this->theme->view('_pages/seo/vw_seo_meta_data',$this->data,true);
				}else if($data_type=='page_struct_data'){

					//$college_da

					if(!empty($college_inner_menues)){
						foreach ($college_inner_menues as $key => $value) {
							$system_structure_data=$this->sm->get_slug_struct_data(array('system_slugs_urls_struct_data'=>$value->menu_id));

							//if(!empty(var))
						}
					}

					$CollegeOrUniversity_json_ld='{
					  "@context": "http://schema.org/",
					  "@type": "CollegeOrUniversity",
					  "name": "Mother Teresa Institute of Nursing - [MTIN], Kolkata",
					  "url": "http://www.mtin.co.in/",
					  "email": "mtin.nursing@gmail.com",
					  "telephone": null,
					  "logo": "https://images.collegedunia.com/public/college_data/images/logos/1642409793416E2C4F3426418F9C5C2EC3F16C5576.png.jpg",
					  "address": {
					    "@type": "PostalAddress",
					    "streetAddress": "Nadibhag, Kazipara, Madhyamgram   India"
					  }
					}';

					$Article_json_ld='{
					  "@context": "http://schema.org/",
					  "@type": "Article",
					  "mainEntityOfPage": {
					    "@type": "WebPage",
					    "@id": "'.base_url().'"
					  },
					  "headline": "About College",
					  "dateModified": "2022-06-06T14:59:26+05:30",
					  "datePublished": "2014-05-11T00:26:28+05:30",
					  "author": {
					    "@type": "Person",
					    "name": "Sikshapedia Team"
					  },
					  "publisher": {
					    "@type": "Organization",
					    "name": "Sikshapedia",
					    "logo": {
					      "@type": "ImageObject",
					      "name": "Sikshapedia",
					      "url": "https://www.sikshapedia.com/public/data/app/2021/RToXI5Hjmg.webp",
					      "height": "600",
					      "width": "88"
					    }
					  },
					  "image": {
					    "@type": "ImageObject",
					    "url": "https://www.sikshapedia.com/public/data/app/2021/RToXI5Hjmg.webp",
					    "height": "600",
					    "width": "88"
					  }
					}';


					$BreadcrumbList_jsopn_ld='{
					  "@context": "https://schema.org",
					  "@type": "WebPage",
					  "breadcrumb": {
					    "@type": "BreadcrumbList",
					    "itemListElement": [
					      {
					        "@type": "ListItem",
					        "position": 1,
					        "name": "Home",
					        "item": "https://collegedunia.com/"
					      },
					      {
					        "@type": "ListItem",
					        "position": 2,
					        "name": "Home",
					        "item": "https://collegedunia.com/"
					      },
					      {
					        "@type": "ListItem",
					        "position": 3,
					        "name": "Kolkata",
					        "item": "https://collegedunia.com/kolkata-colleges"
					      },
					      {
					        "@type": "ListItem",
					        "position": 4,
					        "name": "MTIN",
					        "item": "https://collegedunia.com/college/63117-mother-teresa-institute-of-nursing-mtin-kolkata"
					      }
					    ]
					  }
					}';

					$this->data['BreadcrumbList_jsopn_ld']=$BreadcrumbList_jsopn_ld;
					$this->data['Article_json_ld']=$Article_json_ld;
					$this->data['CollegeOrUniversity_json_ld']=$CollegeOrUniversity_json_ld;

					$return['html']=$this->theme->view('_pages/seo/vw_seo_struct_meta_data',$this->data,true);
				}

				

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGenerateCollegeMetaData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_college=post_data('_college');
				$college_id=decode_data($_college);

				$menu_type=post_data('menu_type');

				//echo $menu_type;die;

				$inner_menu_data=$this->sm->_get_inner_menu(array('menu_slug'=>$menu_type,'menu_link_id'=>$college_id,'menu_link_type'=>'10'));				

				$college_data=$this->im->_get_college(array('user_id'=>$college_id));

				//print_obj($college_data);

				$college_name=ucwords(strtolower($college_data->college_name));
				$college_short_name=(!empty($college_data->college_short_name))?strtoupper(strtolower($college_data->college_short_name)):'';

				$date=date('Y').'-'.(date('Y')+1);

				$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
				$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));


				$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));
				$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));

				// print_obj($state_data);die;

				$college_slug=$this->sm->get_slug(array('slug_type'=>'7','slug_type_id'=>$college_id));

				// print_obj($college_slug);die;

				$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));

				if(!empty($college_short_name)){
					$page_heading=$college_name.' - ['.$college_short_name.'],'.ucwords(strtolower($city_data->city_name));
				}else{
					$page_heading=$college_name.','.ucwords(strtolower($city_data->city_name));
				}

				// print_obj($country_data);

				$type_base_url=base_url(strtolower($country_data->country_iso_code_2));

				$type_base_search_url=$type_base_url.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value;

				if($menu_type!='info'){
					$url_value=$type_base_url.'/'.$college_slug->slug_value.'/'.$menu_type;
				}else if($menu_type=='courses_fees' || $menu_type=='course-fees' || $menu_type=='courses-fees' || $menu_type=='course-and-fees'){
					$url_value=$type_base_url.'/'.$college_slug->slug_value.'/course-and-fees';
				}
				else{
					$url_value=$type_base_url.'/'.$college_slug->slug_value;
				}

				//echo $url_value;die;

				//echo $menu_type;die;

				$total_user_courses=$this->im->get_total_user_courses(array('user_id'=>$college_id));
				$total_avg_cost=$this->im->get_user_course_avg(array('user_id'=>$college_id,'user_course_year'=>'1'));
				$c_courses=$this->im->_get_group_concat_user_course_data(array('user_id'=>$college_id));
				$college_courses=$c_courses->concated_value;

				//print_obj($total_avg_cost);die;

				$city_name=ucwords(strtolower($city_data->city_name));
				$state_name=ucwords(strtolower($state_data->state_name));

				$college_formatted_name=(!empty($college_short_name))?$college_name.' - ['.$college_short_name.'],'.$city_name:$college_name.','.$city_name;

				if($menu_type=='info'){
					$param['menu_link_id']=$college_id;
					$college_inner_menues=$this->sm->_get_inner_menues(null,$param);

					if(!empty($college_inner_menues)){
						foreach ($college_inner_menues as $key => $value) {
							if($value->menu_slug!='info'){
								$menu_name[]=ucwords(strtolower($value->menu_name));
							}
						}
					}
						

					if(isset($menu_name) && !empty($menu_name)){
						$concated_name=char_separated($menu_name).', Contact, Website, Facilities '.$date.', Faculties, Hostels';
					}else{
						$concated_name=' Contact, Website, Facilities '.$date.', Faculties, Hostels';
					}

					if($total_avg_cost[0]->total_cost!=null){
						$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name.', Application Form, Admissions, '.ucwords(strtolower($college_courses)).' . '.$total_user_courses.' Courses.  Average Fees is '.round(number_format($total_avg_cost[0]->total_cost)).' per year';
					}else{
						if($college_courses!=NULL){
							$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name.', Application Form, Admissions, '.$college_courses.' . '.$total_user_courses.' Courses.';
						}else{
							$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name;
						}
					}
					

					$url_meta_title=$college_formatted_name.','.$state_name.' '.$concated_name;

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

				
					$url_page_heading=$page_heading;

					

					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>''
					);

				}else if($menu_type=='courses_fees' || $menu_type=='course-fees' || $menu_type=='courses-fees' || $menu_type=='course-and-fees'){
					$concated_name=ucwords(strtolower($inner_menu_data->menu_name)).' '.$date;
					if($total_avg_cost[0]->total_cost!=null){
						$url_meta_title=$college_formatted_name.','.$state_name.' '.$concated_name;
						if($college_courses!=null){
							$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name.' has '.$total_user_courses.' Courses with Average Fees '.round(number_format($total_avg_cost[0]->total_cost)).' per year. Top Courses at '.$college_name.' - '.$city_name.','.$state_name.'  are '.ucwords(strtolower($college_courses));
						}else{
							$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name;
						}						
					}else{
						$url_meta_title=$college_formatted_name.','.$state_name.' '.$concated_name;

						if($college_courses!=null){
							$url_meta_desc=$college_formatted_name.','.$state_name.' '.$concated_name.' has '.$total_user_courses.'. Top Courses at '.ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).'  are '.strtoupper(strtolower($college_courses));
						}else{
							$url_meta_desc=$college_formatted_name.','.ucwords(strtolower($state_data->state_name)).' '.$concated_name;
						}
					}

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

					$url_page_heading=$page_heading.' : Course & Fees Details';

					$bredcrumb=array(
						'Home'=>base_url(),
						$city_name=>$type_base_search_url,
						$college_name=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);
					
				}else if($menu_type=='admission'){
					$url_meta_title=$college_formatted_name.','.$state_name.' Admission News for '.date('Y');
					$url_meta_desc=$college_formatted_name.','.$state_name.' Admission '.date('Y').': '.ucwords(strtolower($college_courses)).' Fees Structure, Cutoff, Registration, Eligibility, Form';

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						$city_name=>$type_base_search_url,
						$college_name=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.': Fees Structure, Cutoff, Ranking, Entrance Exam';
				}else if($menu_type=='results'){
					$url_meta_title=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' Results'.date('Y');
					$url_meta_desc=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' Admission '.date('Y').': Check '.ucwords(strtolower($college_courses)).' Results';

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=ucwords(strtolower($college_name)).','.ucwords(strtolower($city_data->city_name));
				}else if($menu_type=='reviews'){
					$url_meta_title=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' - Reviews '.$date;
					$url_meta_desc=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' - Reviews '.$date;
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($menu_name))=>''
					);

					//'BMS College of Engineering - [BMSCE], Bangalore, Karnataka. 163 Review . Gooch Review: RV College - Too far, BIT - the campus is very bad..'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

					$url_page_heading=ucwords(strtolower($college_name)).','.ucwords(strtolower($city_data->city_name)).' - '.ucwords(strtolower($inner_menu_data->menu_name));
				}else if($menu_type=='cutoff'){
					$url_meta_title=$college_formatted_name.','.$state_name.' - Cutoff for the Year '.$date;
					$url_meta_desc=$college_formatted_name.','.$state_name.' - Cutoff for the Year '.$date.'. Check Course Wise Cutoff for all categories.';
					$bredcrumb=array(
						'Home'=>base_url(),
						$city_name=>$type_base_search_url,
						$college_name=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					//'BMS College of Engineering - [BMSCE] Cutoff for the Year 2021 for . Check Course Wise Cutoff for all categories.'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

					$url_page_heading=$page_heading.' - '.ucwords(strtolower($inner_menu_data->menu_name)).' Details';
				}else if($menu_type=='gallery'){
					$url_meta_title=$college_formatted_name.','.$state_name.' - Images, Photos, Videos, Gallery '.$date;
					$url_meta_desc=$college_formatted_name.','.$state_name.' -  Images And Videos.';

					//'BMS College of Engineering - [BMSCE], Bangalore - Images, Photos, Videos, Gallery 2021-2022'

					//BMS College of Engineering - [BMSCE],Bangalore, Karnataka. Images And Videos  total images found 46 under Facilities

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

					$bredcrumb=array(
						'Home'=>base_url(),
						$city_data->city_name=>$type_base_search_url,
						$college_name=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' : photos & videos';
				}else if($menu_type=='scholarships' || $menu_type=='scholarship'){
					$url_meta_title=$college_formatted_name.','.$state_name.' - Scholarships Opportunities '.$date;
					$url_meta_desc=$college_formatted_name.','.$state_name.' - Scholarships Opportunity Details '.$date;

					//'BMS College of Engineering - [BMSCE], Bangalore, Karnataka Scholarships Opportunities. Fees is according to CET which is 50,000 + college..'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						$city_data->city_name=>$type_base_search_url,
						$college_name=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' - '.ucwords(strtolower($inner_menu_data->menu_name)).' details';
				}else if($menu_type=='faculty'){
					$url_meta_title=$college_formatted_name.','.$state_name.' Faculty Details';
					$url_meta_desc=$college_formatted_name.','.$state_name.' - Faculty Details '.$date;

					//'BBMS College of Engineering - [BMSCE], Bangalore - Faculty Details 2021-2022'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' : list of professors & faculty';
				}else if($menu_type=='news' || $menu_type=='news-and-articles'){
					$url_meta_title=$college_formatted_name.','.$state_name.'. 0 News Articles found. ';
					$url_meta_desc=$college_formatted_name.','.$state_name.' '.date('Y').': Latest News, Announcements, Notifications, Exams, Notices';

					//'BBMS College of Engineering - [BMSCE], Bangalore - Faculty Details 2021-2022'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' - '.ucwords(strtolower($inner_menu_data->menu_name)).' details';
				}else if($menu_type=='hostel'){
					$url_meta_title=$college_formatted_name.','.ucwords(strtolower($state_data->state_name)).' Hostel & Fees details '.$date;
					$url_meta_desc=$college_formatted_name.','.ucwords(strtolower($state_data->state_name)).' Hostel & Fees details '.$date;
					// $url_meta_desc=ucwords($college_name.' - '.$city_data->city_name.','.$state_data->state_name).'. Girls and Boys Hostel with average fees 65,000 per year. Hostel Review by Kalpan Punamiya: The hostel is highly expensive and most cannot aff..';

					//'BBMS College of Engineering - [BMSCE], Bangalore - Faculty Details 2021-2022'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' - '.ucwords(strtolower($inner_menu_data->menu_name)).' details';
				}else if($menu_type=='placement'){
					$url_meta_title=$college_formatted_name.','.$state_name.' - Placement '.$date;
					$url_meta_desc=$college_formatted_name.','.$state_name.' - Placement '.$date;
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					//'BMS College of Engineering - [BMSCE], Bangalore, Karnataka. 163 Review . Gooch Review: RV College - Too far, BIT - the campus is very bad..'

					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);

					$url_page_heading=$page_heading.' - placemment details & companies visiting';
				}
				else{
					$concated_name=$inner_menu_data->menu_name;
					$url_meta_title=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' '.$concated_name;
					$url_meta_desc=ucwords(strtolower($college_name)).' - '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).' '.$concated_name;
					$url_meta_keywords=generateKeywordsFromText($url_meta_desc);
					$bredcrumb=array(
						'Home'=>base_url(),
						ucwords(strtolower($city_data->city_name))=>$type_base_search_url,
						ucwords(strtolower($college_name))=>$type_base_url.'/'.$college_slug->slug_value,
						ucwords(strtolower($inner_menu_data->menu_name))=>''
					);

					$url_page_heading=$page_heading.' - '.ucwords(strtolower($inner_menu_data->menu_name)).' details';
				}

				$url_meta_heading=$url_meta_title;				
				$url_og_title=$url_meta_title;
				$url_og_desc=$url_meta_desc;
				$url_page_heading=$url_page_heading;

				$slug_data=array(
					'url_type'=>'college_static_url',
					'url_glob_type'=>'college_inner_menu',
					'url_type_id'=>$college_id,
					'url_sub_type'=>$menu_type,
					'url_country'=>$college_data->college_country_id,
					'url_state'=>$college_data->college_state_id,
					'url_city'=>$college_data->college_city_id,
					'url_meta_heading'=>str_replace('&amp;','&',$url_meta_heading),
					'url_meta_title'=>str_replace('&amp;','&',$url_meta_title),
					'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_keywords)),
					'url_meta_desc'=>str_replace('&amp;','&',$url_meta_desc),
					'url_og_title'=>str_replace('&amp;','&',$url_og_title),
					'url_og_desc'=>str_replace('&amp;','&',$url_og_desc),
					'url_page_heading'=>str_replace('&amp;','&',$url_page_heading),
					'url_breadcrumb'=>json_encode($bredcrumb),
					'url_value'=>str_replace('-amp-','-and-',$url_value),
					'url_priority'=>'0.6',
					'url_data_change_freq'=>'monthly',
					'url_last_update'=>date('Y-m-d H:i:s'),
					'updated_by'=>$this->data['userdata']->user_id,
					'updated_at'=>date('Y-m-d H:i:s')
				);

				//print_obj($slug_data);die;

				//echo $college_id;

				//echo $url_value;die;


				//'url_type_id'=>$college_id,

				$data_found=$this->sm->get_slug_urls(array('url_value'=>$url_value));

				//print_obj($data_found);die;



				if(empty($data_found)){

					$added=$this->sm->store_slug_urls($slug_data);
				}else{

					$college_data=$this->im->get_college_data(array('college_user_id'=>$data_found->url_type_id));

					if(empty($college_data)){
						$this->sm->delete_slug_urls(array('url_value'=>$url_value));
						$added=$this->sm->store_slug_urls($slug_data);
					}else{
						$added=$this->sm->update_slug_urls($slug_data,array('url_value'=>$url_value));
					}

					
				}

				if($added){

					$menu_data=array(
						'menu_link'=>$url_value,
					);

					$this->sm->update_menu($menu_data,array('menu_id'=>$inner_menu_data->menu_id));

					$return['slug_data']=$this->sm->get_slug_urls(array('url_type_id'=>$college_id,'url_value'=>$url_value));
					$return['success']='Meta data updated 1';
				}else{
					$return['error']='Meta data not updated';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchExams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
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

					$country_data=$this->com->get_country(array('country_id'=>$exam->exam_country));

					$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$exam->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

	    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
	                    $exam_logo=$_exam_logo->media_disk_path_relative;
	                }else{
	                    $exam_logo=base_url().'uploads/app/default/no.jpg';
	                }

	                $logo='<img src="'.$exam_logo.'" class="table-user-thumb" alt="">';


					$streams=$this->strm->get_group_concat('stream_name','stream_id',$exam->exam_stream_id);

					$exam_streams=char_separated_to_array($exam->exam_stream_id);


					$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$exam->exam_id,'url_type'=>'exam'));

					//print_obj($slug_data);die;

	                if(!empty($slug_data)){
	                	$meta_title=$slug_data->url_meta_title;
	                	$page_heading=$slug_data->url_page_heading;
	                	$meta_desc=$slug_data->url_meta_desc;
	                	$meta_key=$slug_data->url_meta_key_words;
	                	$meta_og_title=$slug_data->url_og_title;
	                	$meta_og_desc=$slug_data->url_og_desc;
	                	$meta_url=$slug_data->url_value;
	                }else{
	                	$meta_title='';
	                	$page_heading='';
		            	$meta_desc='';
		            	$meta_key='';
		            	$meta_og_title='';
		            	$meta_og_desc='';
		            	$meta_url='';
	                }


					
					$row[]	=	$no;

					$row[]	=	$logo.'<span> '.$exam->exam_short_name.' ('.$exam->country_name.'-'.$exam->exam_id.')<br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span><br><button class="btn btn-primary btn_edit_exam_slug" data-target="#examUrls" data-toggle="modal" data-exam_id="'.$exam->exam_id.'">URL</button>';	

					$action='';				

					foreach ($exam_streams as $k => $v) {

						$stream_data=$this->strm->get_stream(array('stream_id'=>$v));

						$stream_name=$stream_data->stream_name;

						//if($meta_url==''){
							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam->exam_id));

							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$v));
							$meta_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$stream_slug->slug_value.'/'.strtolower($exam->exam_short_name);
						//}

						$action  .=	'<button type="button" class="btn btn-xs btn-dark btn_edit_exam_meta" data-url="'.$meta_url.'" data-page_heading="'.$page_heading.'" data-exam_stream_id="'.encode_data($v).'" data-exam_id="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.' [ '.$exam->exam_short_name.' ]" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editExamMetaModal">Edit General Meta ('.$stream_name.')</button><br>';
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
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchExamsURLS(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$exam_id=post_data('exam_id');

				$param['menu_link_id']=$exam_id;
				$param['menu_link_type']='12';
				$param['menu_is_inner']='1';

				$param['column_order'] = array(
					'menu_serial',
					'menu_name'
				);

				$param['column_search'] = array('menu_name','menu_name_alias');
				$param['order'] = array('menu_serial' => 'ASC');
				$posts=$this->input->post();

				$list = $this->sm->_get_menues($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $slug){
					$no++;

					$row = array();

					$slug_data=$this->sm->get_slug_urls(array('url_type'=>'exam','url_value'=>$slug->menu_link));

					if(!empty($slug_data)){
						$edit_button_class='success';
					}else{
						$edit_button_class='primary';
					}

				
					$row[]	=	$slug->menu_serial;
					$row[]	=	'<b>'.$slug->menu_name.'</b><br>'.$slug->menu_link;

					$action='<button type="button" class="btn btn-xs btn-'.$edit_button_class.' btn_update_exam_url_meta" data-exam_id="'.$exam_id.'" data-exam_menu="'.$slug->menu_name.'"  data-exam_menu_id="'.$slug->menu_id.'" data-url="'.$slug->menu_link.'">Edit</button><button type="button" class="btn btn-xs btn-danger">Delete</button>';


					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_menues($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_menues($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchExamsStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
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

					$country_data=$this->com->get_country(array('country_id'=>$exam->exam_country));

					$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$exam->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

	    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
	                    $exam_logo=$_exam_logo->media_disk_path_relative;
	                }else{
	                    $exam_logo=base_url().'uploads/app/default/no.jpg';
	                }

	                $logo='<img src="'.$exam_logo.'" class="table-user-thumb" alt="">';


					$streams=$this->strm->get_group_concat('stream_name','stream_id',$exam->exam_stream_id);

					$exam_streams=char_separated_to_array($exam->exam_stream_id);


					$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$exam->exam_id,'url_type'=>'exam'));

					//print_obj($slug_data);die;

	                if(!empty($slug_data)){
	                	$meta_title=$slug_data->url_meta_title;
	                	$page_heading=$slug_data->url_page_heading;
	                	$meta_desc=$slug_data->url_meta_desc;
	                	$meta_key=$slug_data->url_meta_key_words;
	                	$meta_og_title=$slug_data->url_og_title;
	                	$meta_og_desc=$slug_data->url_og_desc;
	                	$meta_url=$slug_data->url_value;
	                }else{
	                	$meta_title='';
	                	$page_heading='';
		            	$meta_desc='';
		            	$meta_key='';
		            	$meta_og_title='';
		            	$meta_og_desc='';
		            	$meta_url='';
	                }


					
					$row[]	=	$no;

					$row[]	=	$logo.'<span> '.$exam->exam_short_name.' ('.$exam->country_name.'-'.$exam->exam_id.')<br>'.$exam->exam_full_name.'<br><b>Streams:</b>'.$streams->concated_value.'</span><br><button class="btn btn-primary btn_edit_exam_slug" data-target="#examUrls" data-toggle="modal" data-exam_id="'.$exam->exam_id.'">URL</button>';	

					$action='';				

					foreach ($exam_streams as $k => $v) {

						$stream_data=$this->strm->get_stream(array('stream_id'=>$v));

						$stream_name=$stream_data->stream_name;

						//if($meta_url==''){
							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam->exam_id));

							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$v));
							$meta_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$stream_slug->slug_value.'/'.strtolower($exam->exam_short_name);
						//}

						$action  .=	'<button type="button" class="btn btn-xs btn-dark btn_edit_exam_meta" data-url="'.$meta_url.'" data-page_heading="'.$page_heading.'" data-exam_stream_id="'.encode_data($v).'" data-exam_id="'.encode_data($exam->exam_id).'" data-exam_name="'.$exam->exam_full_name.' [ '.$exam->exam_short_name.' ]" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editExamMetaModal">Edit General Meta ('.$stream_name.')</button><br>';
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
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	//Courses Meta
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

				$list = $this->strm->_get_courses($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $course){
					$no++;

					$row = array();

					$course_name=($course->course_short_name!=null)?$course->course_name.' [ '.$course->course_short_name.' ]':$course->course_name;

					$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$course->course_id,'url_type'=>'course_static_url'));

					if(!empty($slug_data)){
						$meta_heading=$slug_data->url_meta_heading;
						$meta_title=$slug_data->url_meta_title;
						$meta_desc=$slug_data->url_meta_desc;
						$meta_key=$slug_data->url_meta_key_words;
						$meta_og_title=$slug_data->url_og_title;
						$meta_og_desc=$slug_data->url_og_desc;
						$meta_page_heading=$slug_data->url_page_heading;
						$meta_url=$slug_data->url_value;

						$action='<button type="button" class="btn btn-xs btn-dark btn_edit_course__meta" data-course_id="'.encode_data($course->course_id).'" data-course_name="'.$course_name.'" data-url="'.$meta_url.'" data-meta_heading="'.$meta_page_heading.'" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editCourseMenuMetaModal">Edit Meta</button>';
					}else{
						$meta_title='';
						$meta_desc='';
						$meta_key='';
						$meta_og_title='';
						$meta_og_desc='';
						$meta_page_heading='';
						$meta_url='';

						$action='<button type="button" class="btn btn-xs btn-success btn_generate_course_meta" data-course_id="'.encode_data($course->course_id).'" data-slug_type="'.encode_data('course_static_url').'">Generate Meta</button>';
					}	
										
					
					$row[]	=	$no;
					$row[]	=	$course_name;

					// $row[]	=	$course->stream_name;


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
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchCoursesMenudata(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('course_id');

				if(!empty($course_id)){
					$course_id=decode_data($course_id);
					$course_data=$this->strm->get_course(array('course_id'=>$course_id));
					$_course_menues=array();

					if(!empty($course_data)){

						$course_menues=$this->sm->get_menues(array('menu_link_type'=>'20','menu_link_id'=>$course_id),FALSE);

						if(!empty($course_menues)){
							foreach ($course_menues as $key => $value) {
								$slug_data=$this->sm->get_slug_urls(array('url_value'=>$value->menu_link));

								$_course_menues[]=array(
									'menu_course_id'=>$course_id,
									'menu_id'=>$value->menu_id,
									'menu_name'=>$value->menu_name,
									'menu_slug'=>$value->menu_slug,
									'menu_url'=>$value->menu_link,
									'menu_meta_data'=>$slug_data
								);
							}
						}


						//print_obj($_course_menues);exit;

						$this->data['course_menu_data']=$_course_menues;


						$return['html']=$this->theme->view('_pages/seo/vw_course_inner_menues_data',$this->data,true);


					}else{
						$return['error']='No course data found in the system';
					}
				}else{
					$return['error']='Data manipulation is not permitted';
				}

				json_headers($return);
				session_write_close();		

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCourseMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('course_id');
				$menu_id=post_data('menu_id');

				$page_heading=post_data('page_heading');
				$page_meta_title=post_data('page_meta_title');
				$page_meta_keywords=post_data('page_meta_keywords');
				$page_meta_desc=post_data('page_meta_desc');
				$page_og_title=post_data('page_og_title');
				$page_og_desc=post_data('page_og_desc');

				$url_value=post_data('menu_url');

				$dt=date('Y-m-d H:i:s');

				$date_modified=date('c',strtotime($dt));

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$slug_data=$this->sm->get_slug_urls(array('url_value'=>$url_value));

				$menu_data=$this->sm->get_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id),TRUE,null,'DESC',FALSE);		        

		        $course_details_data=$this->strm->get_course_details_data(array('course_id'=>$course_id,'course_inner_menu_id'=>$menu_id),FALSE,'course_data_id','ASC');

		        $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$course_details_data[0]->course_data_created_by));

		        $uploaded_by_name=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:'Sikshapedia Team';

		        $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$course_details_data[0]->course_data_created_by),NULL,FALSE);


		        $course_details_data=$this->strm->get_course_details_data(array('course_data_type!='=>'ads','course_inner_menu_id'=>$menu_id),FALSE);

		        $course_details_faq_data=$this->strm->get_course_details_data(array('course_data_type'=>'faqs','course_inner_menu_id'=>$menu_id),FALSE);

		        if($course_data->course_parent_id!=null){
					$parent_course_data=$this->strm->get_course(array('course_id'=>$course_data->course_parent_id));

					$course_name=strtoupper($parent_course_data->course_name).' IN '.strtoupper($course_data->course_name);
				}else{
					$course_name=strtoupper($course_data->course_name);
				}

		        $article_data='';

				if(!empty($slug_data)){

					$date_published=$slug_data->url_last_update;

					if($menu_data->menu_slug==='overview'){
						$breadcumb=array(
							'HOME'=>base_url(),
							'COURSES'=>base_url('courses'),
							$course_name=>null
						);

						$breadcumb_st='{
						            "@type":"ListItem",
						            "position":3,
						            "name":"'.$course_data->course_name.'('.$course_data->course_short_name.')",
						            "item":"'.$url_value.'"
						         }';
					}else{
						$breadcumb=array(
							'HOME'=>base_url(),
							'COURSES'=>base_url('courses'),
							$course_name=>$menu_data->menu_link,
							strtoupper($menu_data->menu_name)=>null
						);

						$breadcumb_st='{
						            "@type":"ListItem",
						            "position":3,
						            "name":"'.$course_data->course_name.'('.$course_data->course_short_name.')",
						            "item":"'.$menu_data->menu_link.'"
						         },
						         {
						            "@type":"ListItem",
						            "position":4,
						            "name":"'.$menu_data->menu_name.'('.$course_data->course_short_name.')",
						            "item":"'.$menu_data->menu_link.'"
						         }';
					}						

					$slug_data_to_update=array(
						'url_glob_type'=>'course_inner_menu_url',
						'url_sub_type'=>'course_inner_menu',
						'url_type_id'=>$course_id,
						'url_sub_type_id'=>$menu_id,
						'url_course'=>$course_data->course_id,
						'url_meta_heading'=>$page_meta_title,
						'url_meta_title'=>$page_meta_title,
						'url_meta_key_words'=>$page_meta_keywords,
						'url_meta_desc'=>$page_meta_desc,
						'url_og_title'=>$page_meta_title,
						'url_og_desc'=>$page_meta_desc,
						'url_page_heading'=>$page_heading,
						'url_breadcrumb'=>json_encode($breadcumb),
						'url_priority'=>'0.5',
						'url_data_change_freq'=>'yearly',
						'url_last_update'=>$dt,
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$dt
					);

					$updated=$this->sm->update_slug_urls($slug_data_to_update,array('url_value'=>$url_value));

					if($updated){

						//Main Search data

						/*

						$get_search_data=$this->sm->__get_system_search_data(array('search_data_type'=>'COURSE_NAME','search_data_access_url'=>$url_value));

						$country_data=$this->com->get_country(array('country_id'=>$menu_data->menu_country_id));

						$search_data=array(
							'search_data_type_id'=>$course_data->course_id,
							'search_data_type'=>'COURSE_NAME',
							'search_data_name'=>$course_name,
							'search_data_short_name'=>strtoupper($course_data->course_short_name),
							'search_data_country_id'=>$menu_data->menu_country_id,
							'search_data_country'=>strtoupper($country_data->country_name),
							'search_data_course_ids'=>$course_data->course_id,
							'search_data_course_name'=>strtoupper($course_data->course_name),
							'search_data_course_short_name'=>strtoupper($course_data->course_short_name),
							'search_data_meta_title'=>$page_meta_title,
							'search_data_meta_desc'=>$page_meta_desc,
							'search_data_meta_keywords'=>$page_meta_keywords,
							'search_data_og_title'=>$page_meta_title,
							'search_data_og_desc'=>$page_meta_desc,
							'search_data_access_url'=>$url_value,
							'search_storage_access_url'=>base_url('public/data/users/2022/pVFvqPQhkM.webp'),
							'search_data_tags'=>$page_meta_keywords
						);


						//print_obj($search_data);die;


						if(!empty($get_search_data)){
							$this->sm->update_system_search_data($search_data,array('search_data_type'=>'COURSE_NAME','search_data_access_url'=>$url_value));
						}else{
							$this->sm->store_system_search_data($search_data);
						}



						//Sub Search data

						$get_search_data2=$this->sm->__get_system_search_data(array('search_data_type'=>'COURSE_CUSTOM_NAME','search_data_access_url'=>$url_value,'search_data_name'=>strtoupper($page_heading)));

						$search_data2=array(
							'search_data_type_id'=>$course_data->course_id,
							'search_data_type'=>'COURSE_CUSTOM_NAME',
							'search_data_name'=>strtoupper($page_heading),
							'search_data_short_name'=>strtoupper($course_data->course_short_name),
							'search_data_country_id'=>$menu_data->menu_country_id,
							'search_data_country'=>strtoupper($country_data->country_name),
							'search_data_course_ids'=>$course_data->course_id,
							'search_data_course_name'=>strtoupper($course_data->course_name),
							'search_data_course_short_name'=>strtoupper($course_data->course_short_name),
							'search_data_meta_title'=>$page_meta_title,
							'search_data_meta_desc'=>$page_meta_desc,
							'search_data_meta_keywords'=>$page_meta_keywords,
							'search_data_og_title'=>$page_meta_title,
							'search_data_og_desc'=>$page_meta_desc,
							'search_data_access_url'=>$url_value,
							'search_storage_access_url'=>base_url('public/data/users/2022/pVFvqPQhkM.webp'),
							'search_data_tags'=>$page_meta_keywords
						);

						
						if(!empty($get_search_data2)){
							$this->sm->update_system_search_data($search_data2,array('search_data_type'=>'COURSE_CUSTOM_NAME','search_data_access_url'=>$url_value,'search_data_name'=>strtoupper($page_heading)));
						}else{
							$this->sm->store_system_search_data($search_data2);
						}

						$system_logo='https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp';

						if(!empty($course_details_data)){
							foreach ($course_details_data as $key => $value) {
								$article_data.=remove_hyper_link($value->course_data_value);
							}
						}

						if(!empty($course_details_faq_data)){
							foreach ($course_details_faq_data as $key => $value) {
								$faq_data[]=array(
									'@type'=>'Question',
									'name'=>$value->course_data_heading,
									'acceptedAnswer'=>array(
										'@type'=>'Answer',
										'text'=>remove_hyper_link($value->course_data_value)
									)
								);
							}

							$faq_qa_json=json_encode($faq_data);

							$faq_json=array(
								'@context'=>'http://schema.org',
								'@type'=>'FAQPage',
								'mainEntity'=>$faq_qa_json
							);


							//print_obj($faq_json);exit;

							$article_data.=$faq_json;
						}

						//print_obj($article_data);die;

						$NewsArticle='{
						  "@context": "http://schema.org/",
						  "@type": "NewsArticle",
						  "inLanguage": "en_US",
						  "url": "'.base_url().'",
						  "description": "'.$page_meta_desc.'",
						  "mainEntityOfPage": {
						    "@type": "WebPage",
						    "@id": "'.base_url().'"
						  },
						  "headline": "'.$page_heading.'",
						  "articleBody": "'.json_encode($article_data).'",
						  "dateModified": "'.date('c',strtotime($date_modified)).'",
						  "datePublished": "'.date('c',strtotime($date_published)).'",
						  "author": {
						    "@type": "Person",
						    "name": "'.$uploaded_by_name.'"
						  },
						  "publisher": {
						    "@type": "Organization",
						    "name": "Waytoadmission",
						    "logo": {
						      "@type": "ImageObject",
						      "name": "Sikshapedia",
						      "url": "'.$system_logo.'",
						      "height": 600,
						      "width": 88
						    }
						  },
						  "image": {
						    "@type": "ImageObject",
						    "name": "Waytoadmission",
						    "url": "'.$system_logo.'",
						    "height": 600,
						    "width": 88
						  }
						}';


						//print_obj($NewsArticle);exit;


						$article_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$url_value,'slug_type_json_ld'=>'NewsArticle'));

						$article_data_to_store=array(
							'strcut_slug_url_id'=>$slug_data->url_id,
							'slug_type_json_ld'=>'NewsArticle',
							'slug_type_json_ld_data'=>$NewsArticle,
							'slug_url'=>$url_value,
							'date_modified'=>$date_modified,
							'date_published'=>$date_published
						);

						if(empty($article_struct_data)){
							$this->sm->store_slug_struct_data($article_data_to_store);
						}else{
							$this->sm->update_slug_struct_data($article_data_to_store,array('slug_url'=>$url_value,'slug_type_json_ld'=>'NewsArticle'));
						}


						$BreadcrumbList_array=array(
							"@context"=>"http://schema.org/",
							"@type"=>"WebPage",
							"breadcrumb"=>array(
								"@type"=>"BreadcrumbList",
								"itemListElement"=>array(
									array(
										"@type"=>"ListItem",
							            "position"=>1,
							            "name"=>"Home",
							            "item"=>'"'.base_url().'"'
									),
									array(
										"@type"=>"ListItem",
							            "position"=>2,
							            "name"=>"Courses",
							            "item"=>'"'.base_url().'courses"'
									)
								)
							)
						);

						$BreadcrumbList='{
						   "@context":"http://schema.org/",
						   "@type":"WebPage",
						   "breadcrumb":{
						      "@type":"BreadcrumbList",
						      "itemListElement":[
						         {
						            "@type":"ListItem",
						            "position":1,
						            "name":"Home",
						            "item":"'.base_url().'"
						         },
						         {
						            "@type":"ListItem",
						            "position":2,
						            "name":"Courses",
						            "item":"'.base_url().'courses"
						         },
						         '.$breadcumb_st.'
						      ]
						   }
						}';

						// print_obj($BreadcrumbList);die;
					

  						$breadcrumb_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$url_value,'slug_type_json_ld'=>'BreadcrumbList'));

  						$breadcrumb_data_to_store=array(
							'strcut_slug_url_id'=>$slug_data->url_id,
							'slug_type_json_ld'=>'BreadcrumbList',
							'slug_type_json_ld_data'=>$BreadcrumbList,
							'slug_url'=>$url_value,
							'date_modified'=>$date_modified,
							'date_published'=>$date_published
						);

						if(empty($breadcrumb_struct_data)){
							$this->sm->store_slug_struct_data($breadcrumb_data_to_store);
						}else{
							$this->sm->update_slug_struct_data($breadcrumb_data_to_store,array('slug_url'=>$college_data->access_url,'slug_type_json_ld'=>'BreadcrumbList'));
						}


						$return['success']='Course meta & search data has been updated.';

						*/

						$return['success']='Course meta data updated';
						

					}else{
						$return['error']='URL not updated';
					}


				}else{
					$slug_data_to_update=array(
						'url_glob_type'=>'course_inner_menu_url',
						'url_sub_type'=>'course_inner_menu',
						'url_type_id'=>$course_id,
						'url_sub_type_id'=>$menu_id,
						'url_course'=>$course_data->course_id,
						'url_meta_heading'=>$page_meta_title,
						'url_meta_title'=>$page_meta_title,
						'url_meta_key_words'=>$page_meta_keywords,
						'url_meta_desc'=>$page_meta_desc,
						'url_og_title'=>$page_meta_title,
						'url_og_desc'=>$page_meta_desc,
						'url_page_heading'=>$page_heading,
						'url_breadcrumb'=>json_encode($breadcumb),
						'url_priority'=>'0.5',
						'url_data_change_freq'=>'yearly',
						'url_last_update'=>$dt,
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$dt
					);

					$updated=$this->sm->store_slug_urls($slug_data_to_update);

					if($updated){
						$return['success']='Course meta data added';
					}else{
						$return['error']='Course meta not added';
					}
				}


				json_headers($return);

				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	//Courses Meta


	public function onUpdateMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college=post_data('_college');
				$college_id=decode_data($college);


				$meta_title=post_data('college_meta_title');
				$meta_keywords=post_data('college_meta_keywords');
				$meta_desc=post_data('college_meta_desc');
				$meta_og_title=post_data('college_og_title');
				$meta_og_desc=post_data('college_og_desc');

				$url_page_heading=post_data('college_page_heading');

				$college_search_title=post_data('college_search_title');

				$url_menu_id=post_data('menu_id');

				$url_keywords='';

				$menu_data=$this->sm->get_menues_specific('menu_id,menu_name,menu_name_alias,menu_link',array('menu_id'=>$url_menu_id));

				//print_obj($menu_data);die;

				if(!empty($meta_keywords)){
					$meta_keywords_json=json_decode($meta_keywords);

					foreach ($meta_keywords_json as $key => $value) {
						$_keywords[]=$value->value;
					}

					$url_keywords=char_separated($_keywords);
				}


				$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

				if(!empty($college_data->college_short_name)){
					$college_short_name=strtoupper($college_data->college_short_name);
				}else{
					$college_short_name=abbreviate2($college_data->college_name);

					$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$college_data->college_user_id));
				}


				$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
				$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
				$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

				$_slug_value=$college_data->college_name.' '.$city_data->city_name.' '.$state_data->state_name;


				$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));
				$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));
				$slug_value=url_slug($_slug_value);

				$listitem_2_slug=base_url($country_data->country_iso_code_4.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value);

				$slug_url=$this->sm->get_slug_urls(array('url_value'=>$menu_data->menu_link,'url_type'=>'college_static_url','url_type_id'=>$college_id));

				$search_data_type=($college_data->college_utype=='4')?'COLLEGE_NAME':'UNIVERSITY_NAME';

				//print_obj($slug_url);die;

				$date_modified=date('Y-m-d H:i:s');
				$date_published=date('Y-m-d H:i:s');


				$url_sub_type='college_inner_menu_'.strtolower(str_replace('-', '_', $menu_data->menu_name_alias)).'_url';
				$url_sub_type=str_replace(' ', '', $url_sub_type);
				$url_sub_type=str_replace('__', '_', $url_sub_type);
				$url_sub_type=str_replace('&amp;', '_', $url_sub_type);

				$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_logo'));

				if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
				    $college_logo=$_college_logo->media_disk_path_relative;
				}else{
				    $college_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
				}

				$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_banner'));

				if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
				    $college_banner=$_college_banner->media_disk_path_relative;
				    $college_banner_type=$_college_banner->media_mime;
				    list($img_width, $img_height) = getimagesize($_college_banner->media_disk_path);
				}else{
				    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
				    $college_banner_type='image/jpg';
				    $img_width='700';
				    $img_height='600';
				}

				$breadcrumb=array(
					'HOME'=>base_url(),
					strtoupper($city_data->city_name)=>$listitem_2_slug,
					strtoupper($college_short_name)=>$college_data->access_url,
					strtoupper($menu_data->menu_name)=>null
				);

				//print_obj($slug_url);die;

				if(empty($slug_url)){
					$slug_url_data=array(											
						'url_type'=>'college_static_url',
						'url_glob_type'=>'college_inner_menu',
						'url_type_id'=>$college_id,
						'url_sub_type'=>$url_sub_type,
						'url_sub_type_id'=>$url_menu_id,
						'url_value'=>$menu_data->menu_link,
						'url_country'=>$college_data->college_country_id,
						'url_state'=>$college_data->college_state_id,
						'url_city'=>$college_data->college_city_id,
						'url_meta_title'=>$meta_title,
						'url_meta_heading'=>$url_page_heading,
						'url_meta_key_words'=>$url_keywords,
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>$meta_og_title,
						'url_og_desc'=>$meta_og_desc,
						'url_og_image'=>$college_banner,
						'url_og_image_width'=>$img_width,
						'url_og_image_height'=>$img_height,
						'url_og_image_type'=>$college_banner_type,
						'url_breadcrumb'=>json_encode($breadcrumb),
						'url_page_heading'=>$url_page_heading,
						'url_priority'=>'0.6',
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>$date_published,
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$date_published
					);


					$added=$this->sm->store_slug_urls($slug_url_data);

					$slug_url_id=$added;
				}else{

					$slug_url_data=array(											
						'url_type'=>'college_static_url',
						'url_glob_type'=>'college_inner_menu',
						'url_type_id'=>$college_id,
						'url_sub_type'=>$url_sub_type,
						'url_sub_type_id'=>$url_menu_id,
						'url_value'=>$menu_data->menu_link,
						'url_country'=>$college_data->college_country_id,
						'url_state'=>$college_data->college_state_id,
						'url_city'=>$college_data->college_city_id,
						'url_meta_title'=>$meta_title,
						'url_meta_heading'=>$url_page_heading,
						'url_meta_key_words'=>$url_keywords,
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>$meta_og_title,
						'url_og_desc'=>$meta_og_desc,
						'url_og_image'=>$college_banner,
						'url_og_image_width'=>$img_width,
						'url_og_image_height'=>$img_height,
						'url_og_image_type'=>$college_banner_type,
						'url_breadcrumb'=>json_encode($breadcrumb),
						'url_page_heading'=>$url_page_heading,
						'url_priority'=>'0.6',
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>$date_published,
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$date_published
					);

					$slug_url_id=$slug_url->url_id;

					//print_obj($slug_url_data);die;

					$param=array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_type_id'=>$college_id,'url_value'=>$menu_data->menu_link);

					//print_obj($param);die;

					$added=$this->sm->update_slug_urls($slug_url_data,$param);
				}

				if($added){

					$college_address=$college_data->college_address.','.ucwords($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).','.$college_data->college_pincode;

					$college_formatted_name=$page_heading;

					//SEARCH DATA

					/*

					$system_data_search=$this->sm->get_system_search_data(array('search_data_type'=>$search_data_type,'search_data_type_id'=>$college_data->college_user_id,'search_data_access_url'=>$menu_data->menu_link));

					if(!empty($college_search_title)){
						$system_data_search_inserted=array(
							'search_data_type'=>$search_data_type,
							'search_data_name'=>strtoupper($college_search_title),
							'search_data_short_name'=>$college_short_name,
							'search_data_type_id'=>$college_data->college_user_id,
							'search_data_country_id'=>$country_data->country_id,
							'search_data_country'=>$country_data->country_name,
							'search_data_state_id'=>$college_data->college_state_id,
							'search_data_state_name'=>$state_data->state_name,
							'search_data_city_name'=>$city_data->city_name,
							'search_data_city_id'=>$college_data->college_city_id,
							'search_data_address'=>$college_address,
							'search_data_meta_title'=>$url_page_heading,
							'search_data_meta_desc'=>$meta_desc,
							'search_data_meta_keywords'=>$url_keywords,
							'search_data_og_title'=>$meta_og_title,
							'search_data_og_desc'=>$meta_og_desc,
							'search_storage_access_url'=>$college_logo,
							'search_data_access_url'=>$menu_data->menu_link,
							'search_data_tags'=>''
						);

						
						if(empty($system_data_search)){									
							$this->sm->store_system_search_data($system_data_search_inserted);
						}else{
							$this->sm->update_system_search_data($system_data_search_inserted,array('search_data_type'=>$search_data_type,'search_data_type_id'=>$college_data->college_user_id,'search_data_access_url'=>$menu_data->menu_link));
						}
					}

					*/


					$data_param=array(
						'menu_url'=>$menu_data->menu_link,
						'access_url'=>$college_data->access_url,
						'slug_url_id'=>$slug_url_id,
						'college_short_name'=>$college_short_name,
						'college_formatted_name'=>$college_formatted_name,
						'college_web_address'=>$college_data->college_web_address,
						'college_email'=>$college_data->college_email,
						'college_phone_no'=>$college_data->college_phone_no,
						'college_logo'=>$college_logo,
						'college_address'=>$college_address,
						'city_name'=>$city_data->city_name,
						'listitem_2_slug'=>$listitem_2_slug,
						'inner_menu_name'=>$menu_data->menu_name,
						'date_modified'=>$date_modified,
						'date_published'=>$date_published			
					);

					$this->update_inner_menu_structred_data($data_param);

					$return['success']='College meta data addedd';
				}else{
					$return['error']='College meta data not addedd';
				}

				
				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	private function update_inner_menu_structred_data($data){

		//Info Page || Course Page || Admission page || Reviews Page || Cutoff Page || Placement Page || Gallery Page || Scholarship Page || Faculty Page || Hostel Page || 

		/*{"@context":"http://schema.org/","@type":"CollegeOrUniversity","name":"The National Institute of Engineering - [NIE], Mysore","url":"http://www.nie.ac.in","email":"principal@nie.ac.in","telephone":"0821-2481220","logo":"https://images.collegedunia.com/public/college_data/images/logos/col27917.jpg","aggregateRating":{"@type":"AggregateRating","ratingValue":8.2,"reviewCount":"170","worstRating":1,"bestRating":10},"address":{"@type":"PostalAddress","streetAddress":"Mananthavady Road   India"}}*/


		//News & Article Page (for all articles)

		/*{"@context":"https://schema.org","@type":"Article","mainEntityOfPage":{"@type":"WebPage","@id":"https://collegedunia.com/news/karnataka-kcet-2020-final-round-seat-allotment-result-released-read-details-here-alertid-32370"},"headline":"Karnataka KCET 2020: Final Round Seat Allotment Result Released; Read Details Here","dateModified":"2021-01-14 19:35:33","datePublished":"2021-01-14 19:35:33","author":{"@type":"Person","name":"Collegedunia Team"},"image":["https://images.collegedunia.com/public/asset/img/exam/news/news2.jpg"],"publisher":{"@type":"Organization","name":"Collegedunia","logo":{"@type":"ImageObject","name":"Collegedunia","url":"https://images.collegedunia.com/public/asset/img/cd_logo.png","height":600,"width":60}}}*/



		//Breacdcrumb

		$breadcrumb_data='
		{
		  "@context": "https://schema.org",
		  "@type": "WebPage",
		  "breadcrumb": {
		    "@type": "BreadcrumbList",
		    "itemListElement": [
		      {
		        "@type": "ListItem",
		        "position": 1,
		        "name": "Home",
		        "item": "'.base_url().'"
		      },
		      {
		        "@type": "ListItem",
		        "position": 2,
		        "name": "'.ucwords($data['city_name']).'",
		        "item": "'.$data['listitem_2_slug'].'"
		      },
		      {
		        "@type": "ListItem",
		        "position": 3,
		        "name": "'.strtoupper($data['college_short_name']).'",
		        "item": "'.$data['access_url'].'"
		      },
		      {
		        "@type": "ListItem",
		        "position": 4,
		        "name": "'.strtoupper($data['inner_menu_name']).'",
		        "item": "'.$data['menu_url'].'"
		      }
		    ]
		  }
		}';


		$breadcrumb_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$data['menu_url'],'slug_type_json_ld'=>'BreadcrumbList'));

		if(empty($breadcrumb_struct_data)){

			$breadcrumb_data_to_store=array(
				'strcut_slug_url_id'=>$data['slug_url_id'],
				'slug_type_json_ld'=>'BreadcrumbList',
				'slug_type_json_ld_data'=>$breadcrumb_data,
				'slug_url'=>$data['menu_url'],
				'date_modified'=>$data['date_modified'],
				'date_published'=>$data['date_published']
			);

			$this->sm->store_slug_struct_data($breadcrumb_data_to_store);
		}else{
			$this->sm->update_slug_struct_data($breadcrumb_data_to_store,array('slug_url'=>$data['menu_url'],'slug_type_json_ld'=>'BreadcrumbList'));
		}

		//CollegeOrUniversity

		$college_or_university='{
		  "@context": "http://schema.org/",
		  "@type": "CollegeOrUniversity",
		  "name": "'.$data['college_formatted_name'].'",
		  "url": "'.$data['college_web_address'].'",
		  "email": "'.$data['college_email'].'",
		  "telephone": "'.$data['college_phone_no'].'",
		  "logo": "'.$data['college_logo'].'",
		  "address": {
		    "@type": "PostalAddress",
		    "streetAddress": "'.$data['college_address'].'"
		  }
		}';

		$CollegeOrUniversity_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$data['menu_url'],'slug_type_json_ld'=>'CollegeOrUniversity'));

		if(empty($CollegeOrUniversity_struct_data)){

			$CollegeOrUniversity_data_to_store=array(
				'strcut_slug_url_id'=>$data['slug_url_id'],
				'slug_type_json_ld'=>'CollegeOrUniversity',
				'slug_type_json_ld_data'=>$college_or_university,
				'slug_url'=>$data['access_url'],
				'date_modified'=>$data['date_modified'],
				'date_published'=>$data['date_published']
			);

			$this->sm->store_slug_struct_data($CollegeOrUniversity_data_to_store);
		}else{
			$this->sm->update_slug_struct_data($CollegeOrUniversity_data_to_store,array('slug_url'=>$data['menu_url'],'slug_type_json_ld'=>'CollegeOrUniversity'));
		}

		session_write_close();
	}


	public function onUpdateFileMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=post_data('_college');

				if(!empty($college_id)){

					$college_id=decode_data($college_id);

					$seo_logo_file_name=post_data('seo_logo_file_name');
					$seo_logo_alt_text=post_data('seo_logo_alt_text');

					$seo_banner_file_name=post_data('seo_banner_file_name');
					$seo_banner_alt_text=post_data('seo_banner_alt_name');

					$msg_success='';
					$msg_err='';

					$college_data=$this->im->get_college_specific_data('college_user_id,college_name,college_logo,colllege_logo_alt_text,college_banner,colllege_banner_alt_text',array('college_user_id'=>$college_id));

					if(!empty($college_data)){

						$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_banner'));
						$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_logo'));		

						//print_obj($_college_logo);die;		

						if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
			                $college_logo_path=$_college_logo->media_disk_path;
			                $college_logo_relative_path=$_college_logo->media_disk_path_relative;

			                //echo $college_logo_path;die;
			                if(file_exists($college_logo_path)){
			                	// Parse the URL to get the path
								$parsedUrl = parse_url($college_logo_relative_path, PHP_URL_PATH);

								// Get the base name of the path
								$baseName = basename($parsedUrl);

								// Remove the base name from the parsed URL
								$directoryPath = str_replace("/".$baseName, "", $parsedUrl);


			                	// Using basename to get the file name
								$logo_file_name = basename($college_logo_path);
								// Use dirname to get the directory part of the path (excluding the file name)
								$directory_path = pathinfo($college_logo_path,PATHINFO_DIRNAME);
								

								$path_info = pathinfo($logo_file_name);
								
								$extension = $path_info['extension'];
								//$name = $path_info['filename'];

								$logo_alternate_name=$seo_logo_alt_text.' Sikshapedia Logo';

								$new_file_name=url_slug($seo_logo_file_name.' Sikshapedia Logo').'.'.$extension;

								// Combine the path to the directory with the new file name
								$new_file_path = $directory_path. '/' .$new_file_name;
								$newfileRelativepath=base_url($directoryPath.'/'.$new_file_name);

								chmod($college_logo_path, 0755);

								// Use the rename function to rename the file
								if (rename($college_logo_path, $new_file_path)) {
								    

								    // Restore original file permissions
									chmod($new_file_path, 0644);

									$this->sm->update_files(array('media_disk_path'=>$new_file_path,'media_disk_path_relative'=>$newfileRelativepath,'media_disk_name'=>$new_file_name),array('storage_id'=>$_college_logo->storage_id));

								    $college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_logo'));

								    if($extension!='webp'){
								    	$this->onCompressConvertFiles($college_logo->storage_id,$college_id);
								    }

								    
								   $this->im->update_college_data(array('college_logo'=>$college_logo->media_disk_path_relative,'colllege_logo_alt_text'=>$logo_alternate_name),array('college_user_id'=>$college_id));

								    $msg_success=' Logo File updated. ';
								} else {
								   $msg_err='File not updated yet';
								}

								
			                }else{
			                	$msg_err='File not exists physically.';
			                }			                
			            }else{
			            	$msg_err='College logo data not found';
			            }

			            if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
			                $college_banner_path=$_college_banner->media_disk_path;
			                $college_banner_relative_path=$_college_banner->media_disk_path_relative;
			                if(file_exists($college_banner_path)){

				                //echo $college_logo_path;die;
				                // Parse the URL to get the path
								$parsedUrl = parse_url($college_banner_relative_path, PHP_URL_PATH);

								// Get the base name of the path
								$baseName = basename($parsedUrl);

								// Remove the base name from the parsed URL
								$directoryPath = str_replace("/".$baseName, "", $parsedUrl);


			                	// Using basename to get the file name
								$logo_file_name = basename($college_banner_path);
								// Use dirname to get the directory part of the path (excluding the file name)
								$directory_path = pathinfo($college_banner_path,PATHINFO_DIRNAME);
								

								$path_info = pathinfo($logo_file_name);

								//$name = $path_info['filename'];

								$banner_alternate_name=$seo_banner_alt_text.' Sikshapedia Banner';

								$new_file_name=url_slug($seo_banner_file_name.' Sikshapedia Banner').'.'.$extension;

								// Combine the path to the directory with the new file name
								$new_file_path = $directory_path. '/' .$new_file_name;
								$newfileRelativepath=base_url($directoryPath.'/'.$new_file_name);

								chmod($college_logo_path, 0755);

								// Use the rename function to rename the file
								if (rename($college_banner_path, $new_file_path)) {
								    //$updated=$this->onCompressConvertFiles($_college_logo->storage_id,$college_id);

								    // Restore original file permissions
									chmod($new_file_path, 0644);

									$this->sm->update_files(array('media_disk_path'=>$new_file_path,'media_disk_path_relative'=>$newfileRelativepath,'media_disk_name'=>$new_file_name),array('storage_id'=>$_college_banner->storage_id));

								    $college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_banner'));

								    if($extension!='webp'){
								    	$this->onCompressConvertFiles($college_banner->storage_id,$college_id);
								    }

								   $this->im->update_college_data(array('college_banner'=>$college_banner->media_disk_path_relative,'colllege_banner_alt_text'=>$banner_alternate_name),array('college_user_id'=>$college_id));

								    $msg_success.='Banner File updated';
								} else {
								   $msg_err.='File not updated yet';
								}
			                }else{
			            		$msg_err.='College banner data not found';
			            	}
			            }else{
			            	$msg_err.='College banner data not found';
			            }

			            if(isset($msg_success)){
			            	$return['success']=$msg_success;
			            }else if(isset($msg_err)){
			            	$return['error']=$msg_err;
			            }

					}else{
						$return['error']='College data not found';
					}
				}else{
					$return['error']='College data not found';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCourseMeta_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course=post_data('_course');
				$course_id=decode_data($course);


				$page_url=post_data('course_page_url');
				$page_heading=post_data('course_page_heading');
				$meta_title=post_data('course_meta_title');
				$meta_keywords=post_data('course_meta_keywords');
				$meta_desc=post_data('course_meta_desc');
				$meta_og_title=post_data('course_og_title');
				$meta_og_desc=post_data('course_og_desc');

				$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$course_id,'url_type'=>'course_static_url'));

				if(!empty($slug_data)){
					$slug_url_data=array(											
						'url_type'=>'course_static_url',
						'url_type_id'=>$course_id,
						'url_meta_title'=>ucwords($meta_title),
						'url_meta_heading'=>ucwords($meta_title),
						'url_meta_key_words'=>$meta_keywords,
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>$meta_og_title,
						'url_og_desc'=>$meta_og_desc,
						'url_page_heading'=>$page_heading,
						'url_value'=>$page_url
					);

					$added=$this->sm->update_slug_urls($slug_url_data,array('url_value'=>$slug_data->url_value,'url_type'=>'course_static_url','url_type_id'=>$course_id));

					if($added){
						$return['success']='Course meta data updated';
					}else{
						$return['error']='Course meta data not updated';
					}

					
					header('Content-Type: application/json');

					echo json_encode($return);
				}else{
					$return['error']='Meta details not found';
				}

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCourseMenuMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$course=post_data('_course');
				$course_id=decode_data($course);

				$course_menu=post_data('_course_menu');
				$course_menu_id=decode_data($course_menu);


				$page_heading=post_data('course_menu_page_heading');
				$meta_title=post_data('course_menu_meta_title');
				$meta_keywords=post_data('course_menu_meta_keywords');
				$meta_desc=post_data('course_menu_meta_desc');
				$meta_og_title=post_data('course_menu_og_title');
				$meta_og_desc=post_data('course_menu_og_desc');

				$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$course_id,'url_type'=>'course_static_url','url_sub_type_id'=>$course_menu_id,'url_sub_type'=>'course_static_url_menu'));

				if(!empty($slug_data)){

					$course_data=$this->strm->get_course(array('course_id'=>$course_id));

					$slug_data=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

					$menu_data=$this->sm->get_menues(array('menu_id'=>$course_menu_id));
					//print_obj($course_data);die;

					if($menu_data->menu_name=='Overview'){
						$slug_value=base_url('courses/'.$slug_data->slug_value);
						$url_breadcrumb=array(
							'Home'=>base_url(),
							'Courses'=>base_url('courses'),
							$course_data->course_short_name.' '.$course_data->course_name=>null
						);
					}else{
						$slug_value=base_url('courses/'.$slug_data->slug_value.'/'.strtolower(str_replace('&', 'and', $menu_data->menu_name_alias)));
						$url_breadcrumb=array(
							'Home'=>base_url(),
							'Courses'=>base_url('courses'),
							$course_data->course_short_name.' '.$course_data->course_name=>$slug_value,
							$menu_data->menu_name=>null
						);
					}
						

					$slug_url_data=array(											
						'url_type'=>'course_static_url',
						'url_glob_type'=>'course_inner_menu_url',
						'url_type_id'=>$course_id,
						'url_sub_type_id'=>$course_menu_id,
						'url_sub_type'=>'course_static_url_menu',
						'url_meta_title'=>ucwords(strtolower($meta_title)),
						'url_meta_heading'=>ucwords(strtolower($meta_title)),
						'url_meta_key_words'=>strtolower($meta_keywords),
						'url_meta_desc'=>ucwords(strtolower($meta_desc)),
						'url_og_title'=>ucwords(strtolower($meta_og_title)),
						'url_og_desc'=>ucwords(strtolower($meta_og_desc)),
						'url_page_heading'=>ucwords(strtolower($page_heading)),
						'url_breadcrumb'=>json_encode($url_breadcrumb),
						'url_value'=>$slug_value,
						'url_priority'=>'0.5',
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>date('Y-m-d H:i:s'),
						'url_active'=>'1',
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>date('Y-m-d H:i:s')
					);

					$added=$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'course_static_url','url_type_id'=>$course_id,'url_sub_type_id'=>$course_menu_id,'url_sub_type'=>'course_static_url_menu'));

					if($added){
						$this->sm->update_menu(array('menu_link'=>$slug_value),array('menu_id'=>$course_menu_id));
						$return['success']='Course menu meta data updated';
					}else{
						$return['error']='Course menu meta data not updated';
					}

					
					header('Content-Type: application/json');

					echo json_encode($return);
				}else{
					$return['error']='Meta details not found';
				}

				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateExamMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$exam=post_data('_exam');
				$exam_id=$exam;

				$exam_url=post_data('_exam_url');

				$exam_menu_id=post_data('_exam_menu_id');

				$meta_title=post_data('exam_meta_title');
				$meta_keywords=post_data('exam_meta_keywords');
				$meta_desc=post_data('exam_meta_desc');
				$meta_og_title=post_data('exam_og_title');
				$meta_og_desc=post_data('exam_og_desc');

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				$menu_data=$this->sm->get_menues(array('menu_id'=>$exam_menu_id));


				// $slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$exam_id,'url_type'=>'exam','url_sub_type'=>'exam_inner_menu_url','url_value'=>$exam_url));

				$slug_data=$this->sm->get_slug_urls(array('url_value'=>$exam_url));

				$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));

				//print_obj($country_data);die;


				if($menu_data->menu_slug==='overview'){
					$url_breadcrumb=array(
						'Home'=>base_url(),
						'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),
						$exam_data->exam_short_name.' ('.$exam_data->exam_full_name.')'=>null
					);
				}else{
					$url_breadcrumb=array(
						'Home'=>base_url(),
						'Exams ('.ucwords($country_data->country_name).')'=>base_url('exams'),
						$exam_data->exam_short_name.' ('.$exam_data->exam_full_name.')'=>null,
						$menu_data->menu_name=>null
					);
				}

				$slug_url_data=array(											
					'url_type'=>'exam',
					'url_sub_type'=>'exam_inner_menu_url',
					'url_type_id'=>$exam_id,
					'url_sub_type_id'=>$exam_menu_id,
					'url_exam'=>$exam_data->exam_full_name,
					'url_country'=>$exam_data->exam_country,
					'url_meta_title'=>ucwords(strtolower($meta_title)),
					'url_meta_heading'=>ucwords(strtolower($meta_title)),
					'url_meta_key_words'=>strtolower($meta_keywords),
					'url_meta_desc'=>ucwords(strtolower($meta_desc)),
					'url_og_title'=>ucwords(strtolower($meta_og_title)),
					'url_og_desc'=>ucwords(strtolower($meta_og_desc)),
					'url_page_heading'=>ucwords(strtolower($meta_title)),
					'url_breadcrumb'=>json_encode($url_breadcrumb),
					'url_value'=>$exam_url,
					'url_priority'=>'0.7',
					'url_data_change_freq'=>'yearly',
					'url_last_update'=>date('Y-m-d H:i:s'),
					'url_active'=>'1',
					'updated_by'=>$this->data['userdata']->user_id,
					'updated_at'=>date('Y-m-d H:i:s')
				);

				//print_obj($slug_url_data);die;

				if(!empty($slug_data)){
					$added=$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'exam','url_type_id'=>$exam_id,'url_sub_type_id'=>$exam_menu_id,'url_sub_type'=>'exam_inner_menu_url'));

					if($added){
						$return['success']='Exam menu meta data updated';
					}else{
						$return['error']='Exam menu meta data not updated';
					}
				}else{
					$added=$this->sm->store_slug_urls($slug_url_data);

					if($added){
						$return['success']='Exam menu meta data added';
					}else{
						$return['error']='Exam menu meta data not added';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);
			}else{
				redirect($this->data['admin_base_url']);
			}

			session_write_close();
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	//Exam Static Page meta
	public function onUpdateExamStaticPageMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('stream_id');
				$page_heading=post_data('page_heading');
				$page_sub_heading=post_data('page_sub_heading');
				$page_meta_title=post_data('page_meta_title');
				$page_meta_keywords=post_data('page_meta_keywords');
				$page_meta_desc=post_data('page_meta_desc');
				$page_og_title=post_data('page_og_title');
				$page_og_desc=post_data('page_og_desc');
				$page_twitter_title=post_data('page_twitter_title');
				$page_twitter_desc=post_data('page_twitter_desc');
				$page_content=post_data('page_content');
				

				$_stream_id=decode_data($stream_id);

				$stream_data=$this->strm->get_streams_with_exam_url(array('stream_id'=>$_stream_id),TRUE);

				//print_obj($stream_data);die;

				if(!empty($stream_data)){

					$url_breadcrumb=array(
						'Home'=>base_url(),
						'Exams'=>base_url('exams'),
						$stream_data->stream_name=>null
					);

					if(!empty($page_meta_keywords)){
						$pmk=json_decode($page_meta_keywords);
						foreach ($pmk as $key => $value) {
							$pmkv[]=$value->value;
						}
					}else{
						$pmkv=array();
					}

					$slug_url_data=array(											
						'url_type'=>'exam_stream',
						'url_sub_type'=>'exam_stream_static_url',
						'url_og_locale'=>'en-US',
						'url_type_id'=>$_stream_id,
						'url_stream'=>$stream_data->stream_name,
						'url_country'=>'0',
						'url_meta_title'=>$page_meta_title,
						'url_meta_heading'=>$page_meta_title,
						'url_meta_key_words'=>(!empty($pmkv))?implode(',', $pmkv):'',
						'url_meta_desc'=>$page_meta_desc,
						'url_og_title'=>$page_og_title,
						'url_og_desc'=>$page_og_desc,
						'url_twitter_title'=>$page_twitter_title,
						'url_twitter_desc'=>$page_twitter_desc,
						'url_page_heading'=>$page_meta_title,
						'url_page_sub_heading'=>$page_sub_heading,
						'url_page_description'=>$page_content,
						'url_breadcrumb'=>json_encode($url_breadcrumb),
						'url_value'=>$stream_data->url_value,
						'url_canonical_value'=>$stream_data->url_value,
						'url_permalink_value'=>$stream_data->url_value,
						'url_priority'=>'0.8',
						'url_data_change_freq'=>'yearly',
						'url_last_update'=>date('Y-m-d H:i:s'),
						'url_active'=>'1',
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>date('Y-m-d H:i:s')
					);

					//print_obj($slug_url_data);die;

					// $added=$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'exam_stream','url_sub_type'=>'exam_stream_static_url','url_type_id'=>$_stream_id));

					$added=$this->sm->update_slug_urls($slug_url_data,array('url_id'=>$stream_data->url_id));

					if($added){
						$return['success']='Exam Stream meta data updated';
					}else{
						$return['error']='Exam Stream meta data not updated';
					}

				}else{
					$return['error']='Exam stream data not found';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUpdateExamMeta_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$exam=post_data('_exam');
				$exam_id=decode_data($exam);

				$stream=post_data('_exam_stream');
				$stream_id=decode_data($stream);

				$meta_title=post_data('exam_meta_title');
				$meta_keywords=post_data('exam_meta_keywords');
				$meta_desc=post_data('exam_meta_desc');
				$meta_og_title=post_data('exam_og_title');
				$meta_og_desc=post_data('exam_og_desc');

				$exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

				$country_data=$this->com->get_country(array('country_id'=>$exam_data->exam_country));

				$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$exam_id));

				$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

				// $exam_access_url=base_url().strtolower($country_data->country_iso_code_2).'/exams/'.$stream_slug->slug_value.'/'.strtolower($exam_data->exam_short_name);

				$exam_access_url=base_url().'exams/'.$stream_slug->slug_value.'/'.strtolower($exam_data->exam_short_name);


				$slug_url=$this->sm->get_slug_urls(array('url_value'=>$exam_access_url,'url_type'=>'exam','url_type_id'=>$exam_id));

				//print_obj($slug_url);die;

				if(empty($slug_url)){
					$slug_url_data=array(											
						'url_type'=>'exam',
						'url_type_id'=>$exam_id,
						'url_value'=>$exam_access_url,
						'url_country'=>$country_data->country_id,
						'url_state'=>NULL,
						'url_meta_title'=>ucwords($meta_title),
						'url_meta_key_words'=>$meta_keywords,
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>$meta_og_title,
						'url_og_desc'=>$meta_og_desc
					);

					$added=$this->sm->store_slug_urls($slug_url_data);
				}else{
					$slug_url_data=array(											
						'url_type'=>'exam',
						'url_type_id'=>$exam_id,
						'url_value'=>$exam_access_url,
						'url_country'=>$country_data->country_id,
						'url_state'=>NULL,
						'url_meta_title'=>ucwords($meta_title),
						'url_meta_key_words'=>$meta_keywords,
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>$meta_og_title,
						'url_og_desc'=>$meta_og_desc
					);

					$added=$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'exam','url_type_id'=>$exam_id));
				}

				if($added){

					$this->sm->update_menu(array('menu_link'=>$exam_access_url),array('menu_link_type'=>'11','menu_link_id'=>$exam_id));
					$return['success']='Exam meta data addedd';
				}else{
					$return['error']='Exam meta data not addedd';
				}

				
				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateNewsMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_news=post_data('_news');
				$news_id=decode_data($_news);

				$news_title=decode_data($news_title);

				$_url_sub_type_id=post_data('_url_sub_type_id');
				$url_sub_type_id=decode_data($_url_sub_type_id);

				$url_sub_type=post_data('_url_sub_type');

				if($url_sub_type=='college_news_url'){

					$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$url_sub_type_id));

					$college_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$url_sub_type_id,'url_type'=>'college_url'));

					//print_obj($college_slug_url);

					if(!empty($college_slug_url)){
						$college_slug=$college_slug_url->url_value;
					}else{

						$country_data=$this->sm->get_country(array('country_id'=>$college_data->college_country_id));

						$college_slug=base_url().strtolower($country_data->country_iso_code_2).'/'.url_slug($college_data->college_name);

						$college_slug_data=array(
							'url_type'=>'college_url',
							'url_type_id'=>$url_sub_type_id,
							'url_country'=>$college_data->college_country_id,
							'url_state'=>$college_data->college_state_id,
							'url_meta_heading'=>'',
							'url_meta_title'=>'',
							'url_meta_key_words'=>'',
							'url_meta_desc'=>'',
							'url_og_title'=>'',
							'url_og_desc'=>'',
							'url_page_heading'=>'',
							'url_page_heading'=>'',
							'url_page_sub_heading'=>'',
							'url_value'=>$college_slug
						);

						$this->sm->store_slug_urls($college_slug_data);
					}


					$slug_url=$this->sm->get_slug_urls(array('url_sub_type_id'=>$url_sub_type_id,'url_type'=>'news_article','url_type_id'=>$news_id));

					$news_url=$college_slug.'/news/'.url_slug($news_title);
					$news_slug_data=array(
						'url_type'=>'news_article',
						'url_sub_type'=>$url_sub_type,
						'url_sub_type_id'=>$url_sub_type_id,
						'url_country'=>$college_data->college_country_id,
						'url_state'=>$college_data->college_state_id,
						'url_meta_heading'=>'',
						'url_meta_title'=>'',
						'url_meta_key_words'=>'',
						'url_meta_desc'=>'',
						'url_og_title'=>'',
						'url_og_desc'=>'',
						'url_page_heading'=>'',
						'url_page_heading'=>'',
						'url_page_sub_heading'=>'',
						'url_value'=>$news_url
					);

					if(!empty($slug_url)){
						$added=$this->sm->store_slug_urls($news_slug_data);
						if($added){
							$return['success']='News slug generated successfully';
						}else{
							$return['error']='News slug not generated';
						}
					}else{
						$added=$this->sm->update_slug_urls($news_slug_data,array('url_sub_type_id'=>$url_sub_type_id,'url_sub_type'=>$url_sub_type,'url_sub_type_id'=>$url_sub_type_id,'url_type'=>'news_article','url_type_id'=>$news_id));

						if($added){
							$return['success']='News slug updated successfully';
						}else{
							$return['error']='News slug not updated';
						}
					}

				}

				

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGenerateUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country_default='99';

				$_slug_type=post_data('slug_type');
				$_slug_type_id=post_data('slug_type_id');


				$sg_type=decode_data($_slug_type);
				$sg_type_id=decode_data($_slug_type_id);

				$current_year=date('Y');
				$prev_year=$current_year-1;
				$url_slug='';
				$page_key_words='';
				$page_heading='';


				$country_data=$this->com->get_country(array('country_id'=>$country_default));


				if($sg_type=='course_static_url'){

					$course_data=$this->strm->get_course(array('course_id'=>$sg_type_id));

					$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$course_data->course_stream));


					if(!empty($course_data)){

						if($course_data->course_parent_id!=NULL){
							$parent_course_data=$this->strm->get_course(array('course_id'=>$course_data->course_parent_id));
							$page_slug=url_slug($parent_course_data->course_name).'-'.url_slug($course_data->course_name);
							$page_heading=ucwords($parent_course_data->course_name).' ['.$parent_course_data->course_short_name.'] '.ucwords($course_data->course_name).' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;
							$page_key_words=$parent_course_data->course_short_name.','.generateKeywordsFromText($page_heading);
						}else{
							$page_slug=url_slug($course_data->course_name);
							$page_heading=ucwords($course_data->course_name).' ['.$course_data->course_short_name.'] '.' Syllabus, Colleges, Admission, Eligibility, Exams, Jobs, Salary '.$prev_year.'-'.$current_year;
							$page_key_words=generateKeywordsFromText($page_heading);
						}


						$url_slug=base_url().strtolower($country_data->country_iso_code_2).'/courses/'.$stream_slug->slug_value.'/'.$page_slug;
					}
				}

				if($url_slug!=''){
					$slug_data=$this->sm->get_slug_urls(array('url_type_id'=>$sg_type_id,'url_type'=>$sg_type,'url_value'=>$url_slug));

					$page_url_slug_data=array(
						'url_type'=>$sg_type,
						'url_type_id'=>$sg_type_id,
						'url_country'=>$country_default,
						'url_meta_heading'=>$page_heading,
						'url_meta_title'=>$page_heading,
						'url_meta_key_words'=>$page_key_words,
						'url_meta_desc'=>$page_heading,
						'url_og_title'=>$page_heading,
						'url_og_desc'=>$page_heading,
						'url_page_heading'=>$page_heading,
						'url_value'=>$url_slug
					);

					if(!empty($slug_data)){
						$updated=$this->sm->update_slug_urls($page_url_slug_data,array('url_type_id'=>$sg_type_id,'url_type'=>$sg_type,'url_value'=>$url_slug));
					}else{
						$updated=$this->sm->store_slug_urls($page_url_slug_data);
					}

					if($updated){
						$return['success']='Slug generated successfully';
					}else{
						$return['error']='Slug can not be generated at this momment';
					}

				}else{
					$return['error']='Slug can not be generated at this momment';
				}				

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGenerateBulkURL(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$url_type=post_data('user_type');
				$url_type_id=$this->input->post('slug_type_array_ids');

				$current_year=date('Y');
				$prev_year=$current_year-1;
				$url_slug='';
				$page_key_words='';
				$page_heading='';

				

				if(!empty($url_type_id)){

					$_url_type_id=char_separated_to_array($url_type_id);

			
					$counted_data=count($_url_type_id);
				

					if($counted_data<=550){
						foreach ($_url_type_id as $key => $value) {
							$sg_type_id=decode_data($value);

							//echo $sg_type_id;die;

							if($url_type=='college_static_url'){
								$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$sg_type_id));								

								$country_id=$college_data->college_country_id;
								$country_data=$this->com->get_country(array('country_id'=>$country_id));
								$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
								$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));

								$slug_data=$this->sm->get_slug(array('slug_type'=>'7','slug_type_id'=>$sg_type_id));

								if(!empty($slug_data)){

									// $college_url=$college_data->access_url;//;base_url().strtolower($country_data->country_iso_code_2).'/'.$slug_data->slug_value;

									$college_url=base_url().strtolower($country_data->country_iso_code_2).'/'.$slug_data->slug_value;

									$slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$college_url));

									if(empty($slug_url_data)){
										$url_meta_title=ucwords($college_data->college_name).' - Courses, Admission, Fees, Scholarship';
										$url_meta_desc=ucwords($college_data->college_name).', '.ucwords($city_data->city_name).', '.ucwords($state_data->state_name).'  Application Form, Admissions, Contact, Website, Map.';

										$_url_meta=ucwords($college_data->college_name).', '.ucwords($city_data->city_name).', '.ucwords($state_data->state_name).',  application Form, Admissions, Contact, Website, Map.';

										$keywords=generateKeywordsFromText($_url_meta);

										$slug_data_to_insert[]=array(
											'url_type'=>'college_static_url',
											'url_type_id'=>$sg_type_id,
											'url_value'=>$college_url,
											'url_country'=>$country_data->country_id,
											'url_state'=>$college_data->college_state_id,
											'url_city'=>$college_data->college_city_id,
											'url_meta_heading'=>$url_meta_title,
											'url_meta_title'=>$url_meta_title,
											'url_meta_key_words'=>$keywords,
											'url_meta_desc'=>$url_meta_desc,
											'url_og_desc'=>$url_meta_desc,
											'url_og_title'=>$url_meta_title,
											'url_priority'=>'0.8',
											'url_data_change_freq'=>'daily'
										);
									}
								}
							}
						}

						//print_obj($slug_data_to_insert);die;

						if(isset($slug_data_to_insert) && !empty($slug_data_to_insert)){

							$inserted=$this->sm->store_slug_urls($slug_data_to_insert,TRUE);

							if($inserted){
								$return['success']='Slug URLs created successfully.';
							}else{
								$return['error']='Slug URLs not created 1.';
							}

						}else{
							$return['error']='Slug URLs not created 2.';
						}
					}else{
						$return['error']='More than 10 url can not be generated at once.';
					}

						

				}else{
					$return['error']='Slug URLs not created 3.';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onGetUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$page_country=post_data('page_country');
				$page_state=post_data('page_state');
				$page_city=post_data('page_city');
				$page_type=post_data('page_type');
				$page_stream=post_data('page_stream');
				$page_course=post_data('page_course');

				$country_id=decode_data($page_country);
				$state_id=decode_data($page_state);
				$city_id=decode_data($page_city);

				$strteam_id=decode_data($page_stream);


				if($page_country!='0' && $page_state!='0'){
					if($page_city!='0'){
						$param=array('url_glob_type'=>$page_type,'url_country'=>$country_id,'url_state'=>$state_id,'url_city'=>$city_id);
					}else{
						$param=array('url_glob_type'=>$page_type,'url_country'=>$country_id,'url_state'=>$state_id);
					}					
				}else if($page_country!='0' && $page_state=='0'){
					if($page_stream!='0'){
						if($page_course!='0'){
							$param=array('url_glob_type'=>$page_type,'url_sub_type'=>'college_static_url_stream_course','url_sub_type_id'=>$page_course,'url_country'=>$country_id);
						}else{
							$param=array('url_glob_type'=>$page_type,'url_sub_type'=>'college_static_url_stream','url_sub_type_id'=>$strteam_id,'url_country'=>$country_id);
						}
						
						
					}else{
						$param=array('url_glob_type'=>$page_type,'url_country'=>$country_id);
					}
					
				}

				$param=array('url_country'=>$country_id);

				$slug_urls=$this->sm->get_slug_urls($param,FALSE,'url_id','ASC',FALSE);

				//print_obj($slug_urls);die;


				if(!empty($slug_urls)){
					foreach ($slug_urls as $key => $value) {
						$_slug_urls[]=array(
							'url_id'=>$value->url_id,
							'url_type_id'=>$value->url_type_id,
							'url_value'=>$value->url_value
						);
					}
				}else{
					$_slug_urls=array();
				}

				//print_obj($_slug_urls);die;

				$this->data['slug_urls']=$_slug_urls;

				$return['html']=$this->theme->view('_pages/seo/vw_slugs_dyna',$this->data,true);

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

				session_write_close();


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchSlugUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'url_value'
				);

				$param['url_glob_type']='colleges_search';

				$param['column_search'] = array('url_type','url_value');
				$param['order'] = array('url_id' => 'DESC');
				$posts=$this->input->post();


				if($this->data['userdata']->user_role==3){
					$param['created_by']=session_userdata('admin_id');
				}


				$list = $this->sm->_get_slugs_urls($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $slug){
					$no++;

					$row = array();

					$row[]	=	$no;
					$row[]	=	'<a href="'.$slug->url_value.'" target="_blank">'.$slug->url_value.'</a>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	/***Search URLs***/

	public function indexSearchInstSearchSlugUrlsDetails(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){

			$_url_id=$this->uri->segment(5,0);

			$url_id=decode_data($_url_id);

			$slug_data=$this->sm->get_slug_urls(array('url_id'=>$url_id));


			$this->data['slug_data']=$slug_data;


			$page_data=$this->sm->get_search_page_data(array('page_id'=>$url_id),FALSE);

		

			$this->data['page_data']=$page_data;

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'searches'));

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_ads_modal')->load('seo/vw_searches_colleges_page_details', $this->data);


		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddSearchInstSearchSlugUrlsDetails(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$page_details=$this->input->post('page_details');
				$page_id=$this->input->post('page_id');

				if(!empty($page_details)){

					$page_id=decode_data($page_id);

					$serial=0;

					foreach ($page_details as $key => $value) {
						$data_type=$value['data_type'];
						$heading_detail=$value['heading_detail'];

						if($data_type=='image'){
							$data_type_value=decode_data($value['data_type_value']);
							$data_to_store[]=array(
								'page_id'=>$page_id,
								'page_data_type_id'=>$data_type_value,
								'page_data_type'=>$data_type,
								'page_data_value'=>$heading_detail,
								'page_data_serial'=>$serial,
								'page_data_created_by'=>$this->data['userdata']->user_id,
								'page_data_updated_by'=>$this->data['userdata']->user_id,
								'page_data_created_at'=>date('Y-m-d'),
								'page_data_updated_at'=>date('Y-m-d')
							);
						}else if($data_type=='general'){
							$data_to_store[]=array(
								'page_id'=>$page_id,
								'page_data_type_id'=>NULL,
								'page_data_type'=>$data_type,
								'page_data_value'=>$heading_detail,
								'page_data_serial'=>$serial,
								'page_data_created_by'=>$this->data['userdata']->user_id,
								'page_data_updated_by'=>$this->data['userdata']->user_id,
								'page_data_created_at'=>date('Y-m-d'),
								'page_data_updated_at'=>date('Y-m-d')
							);
						}else if($data_type=='ads'){
							$data_type_value=decode_data($value['data_type_value']);
							$data_to_store[]=array(
								'page_id'=>$page_id,
								'page_data_type_id'=>$data_type_value,
								'page_data_type'=>$data_type,
								'page_data_value'=>$heading_detail,
								'page_data_serial'=>$serial,
								'page_data_created_by'=>$this->data['userdata']->user_id,
								'page_data_updated_by'=>$this->data['userdata']->user_id,
								'page_data_created_at'=>date('Y-m-d'),
								'page_data_updated_at'=>date('Y-m-d')
							);
						}

						$serial++;
					}

					if(!empty($data_to_store)){

						$this->sm->delete_search_page_data(array('page_id'=>$page_id));

						$added=$this->sm->store_search_page_data($data_to_store,TRUE);

						if($added){

							$page_slug_data=$this->sm->get_slug_urls(array('url_id'=>$page_id));

							$page_faqs=$this->input->post('page_faqs');

							if(!empty($page_faqs)){

								$faq_serial=0;
								foreach ($page_faqs as $key => $value) {
									$ques=$value['ques'];
									$ans=$value['ans'];

									if(!empty($ques) && !empty($ans)){
										$faq_data_to_store[]=array(
											'page_id'=>$page_id,
											'page_data_type_id'=>NULL,
											'page_data_type'=>'faqs',
											'page_data_heading'=>$ques,
											'page_data_value'=>$ans,
											'page_data_serial'=>$faq_serial,
											'page_data_created_by'=>$this->data['userdata']->user_id,
											'page_data_updated_by'=>$this->data['userdata']->user_id,
											'page_data_created_at'=>date('Y-m-d'),
											'page_data_updated_at'=>date('Y-m-d')
										);

										$main_activity[]=array(
											"@type"=>"Question",
											"name"=>$ques,
											"acceptedAnswer"=>array(
												"@type"=>"Answer",
									      		"text"=>$ans
											)
										);

										$faq_serial++;
									}

										
								}

								if(!empty($faq_data_to_store)){
									$faq_added=$this->sm->store_search_page_data($faq_data_to_store,TRUE);

									// {
									//   "@context": "https://schema.org",
									//   "@type": "FAQPage",
									//   "mainEntity": [{
									//     "@type": "Question",
									//     "name": "How many govt pharmacy colleges are there in West Bengal?",
									//     "acceptedAnswer": {
									//       "@type": "Answer",
									//       "text": "At present, there are around 9 government pharmacy colleges in West Bengal."
									//     }
									//   },{
									//     "@type": "Question",
									//     "name": "Which pharmacy college is best for placement in West Bengal?",
									//     "acceptedAnswer": {
									//       "@type": "Answer",
									//       "text": "Actually, most pharmacy colleges claim to have the best placement facilities for successful students. It depends on many factors and situations that vary from time to time."
									//     }
									//   }]
									// }

									if($faq_added){
										$faq_struct_data=array(
											"@context"=>"https://schema.org",
											"@type"=> "FAQPage",
											"mainEntity"=>$main_activity
										);


										$get_slug_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$page_id,'slug_type_json_ld'=>'FAQPage','slug_url'=>$page_slug_data->url_value));

										if(!empty($get_slug_struct_data)){
											$faq_struct_data_to_store=array(
												'strcut_slug_url_id'=>$page_id,
												'slug_type_json_ld'=>'FAQPage',
												'slug_type_json_ld_data'=>json_encode($faq_struct_data),
												'slug_url'=>$page_slug_data->url_value,
												'date_modified'=>date('Y-m-d H:i:s')
											);

											$this->sm->update_slug_struct_data($faq_struct_data_to_store,array('strcut_slug_url_id'=>$page_id,'slug_type_json_ld'=>'FAQPage','slug_url'=>$page_slug_data->url_value));
										}else{
											$faq_struct_data_to_store=array(
												'strcut_slug_url_id'=>$page_id,
												'slug_type_json_ld'=>'FAQPage',
												'slug_type_json_ld_data'=>json_encode($faq_struct_data),
												'slug_url'=>$page_slug_data->url_value,
												'date_modified'=>date('Y-m-d H:i:s'),
												'date_published'=>date('Y-m-d H:i:s')
											);

											$this->sm->store_slug_struct_data($faq_struct_data_to_store);
										}	
									}
								}

								
							}

							$return['success']='Data updated';
						}else{
							$return['error']='Data not updated';
						}

						
					}else{
						$return['error']='Data not added';
					}

				}else{
					$return['error']='No data found to add';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchInstSearchSlugUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'url_value'
				);

				$param['url_glob_type']='colleges_search';

				$param['column_search'] = array('url_type','url_value','url_meta_title','url_meta_key_words','url_meta_heading','url_meta_desc');
				$param['order'] = array('url_id' => 'DESC');
				$posts=$this->input->post();

				//$param['url_type']=$posts['url_type'];
				//$param['url_type_id']=$posts['url_type_id'];
				if($posts['url_state_id']>0){
					$param['url_state_id']=$posts['url_state_id'];
				}

				if($posts['url_type_id']>0){
					$param['url_type_id']=$posts['url_type_id'];
				}

				if($posts['url_stream']>0){
					$param['url_stream']=$posts['url_stream'];
				}
				


				if($this->data['userdata']->user_role==3){
					$param['created_by']=session_userdata('admin_id');
				}


				$list = $this->sm->_get_slugs_urls($posts,$param,FALSE,FALSE);

				//print_obj($list);die;
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $slug){
					$no++;

					$row = array();

					$row[]	=	$no;
					$row[]	=	'<a href="'.$slug->url_value.'" target="_blank">'.$slug->url_value.'</a><br><br>

						<span class="btn btn-xs btn-warning">State:'.$slug->url_state.'</span>  <button class="btn btn-xs btn-warning btn_update_slug_stream" data-url_id="'.$slug->url_id.'" data-url_val="'.$slug->url_value.'" data-param_type="city">City:'.$slug->url_city.'</button>  <button class="btn btn-xs btn-warning btn_update_slug_stream" data-url_id="'.$slug->url_id.'" data-url_val="'.$slug->url_value.'" data-param_type="stream">Stream:'.$slug->url_stream.'</button><br><br>
					<a href="'.$this->data['admin_base_url'].'/seo/searches/colleges/'.encode_data($slug->url_id).'" class="btn btn-xs btn-warning">Upload Page Detail</a> <button class="btn btn-xs btn-secondary btn_update_search_page_meta" data-page_id="'.encode_data($slug->url_id).'" data-page_heading="'.$slug->url_page_heading.'" data-page_meta_title="'.$slug->url_meta_title.'" data-page_meta_keywords="'.$slug->url_meta_key_words.'" data-page_meta_desc="'.$slug->url_meta_desc.'" data-page_og_title="'.$slug->url_og_title.'" data-page_og_desc="'.$slug->url_og_desc.'">Update Meta</button>
						<a href="'.$this->data['admin_base_url'].'/seo/searches/colleges/add/'.encode_data($slug->url_id).'" class="btn btn-xs btn-primary btn_college_to_url" target="_blank">Add Colleges</a> <button class="btn btn-xs btn-dark btn_college_url_update">Update URL Data</button>';

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCollegeSearchpageMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$page_id=post_data('page_id');


				$url_data=$this->sm->get_slug_urls(array('url_id'=>$page_id));

				//print_obj($url_data);die;

				if(!empty($url_data)){
					$page_meta_heading=post_data('page_meta_title');
					$page_meta_keywords=$this->input->post('page_meta_keywords');
					$page_meta_desc=post_data('page_meta_desc');
					$page_og_title=post_data('page_og_title');
					$page_og_desc=post_data('page_og_desc');
					$page_heading=post_data('page_heading');

					$page_search_heading=post_data('page_search_heading');

					$page_og_title=str_replace('&amp;','&',$page_og_title);
					$page_meta_heading=str_replace('&amp;','&',$page_meta_heading);
					$page_heading=str_replace('&amp;','&',$page_heading);
					$page_meta_desc=str_replace('&amp;','&',$page_meta_desc);
					$page_og_title=str_replace('&amp;','&',$page_og_title);
					$page_og_desc=str_replace('&amp;','&',$page_og_desc);

					$update_date=date('Y-m-d H:i:s');

					$date_modified=date('Y-m-d H:i:s');

					$_keywords='';

					//print_obj($page_meta_keywords);die;

					if(!empty($page_meta_keywords)){
						$_page_meta_keywords=json_decode($page_meta_keywords);
						foreach ($_page_meta_keywords as $key => $value) {
							$keywords[]=$value->value;
						}

						//print_obj($keywords);die;

						$_keywords=char_separated($keywords);
					}

					//print_obj($_keywords);die;

					$data_to_update=array(
						'url_type'=>'college_static_url',
						'url_glob_type'=>'colleges_search',
						'url_sub_type'=>'college_static_urls',
						'url_meta_title'=>$page_meta_heading,
						'url_meta_heading'=>$page_meta_heading,
						'url_meta_key_words'=>(!empty($_keywords))?strtolower($_keywords):'',
						'url_meta_desc'=>$page_meta_desc,
						'url_og_title'=>$page_og_title,
						'url_og_desc'=>$page_og_desc,
						'url_og_locale'=>'en_US',
						'url_og_image'=>null,
						'url_og_image_type'=>null,
						'url_og_image_width'=>null,
						'url_og_image_height'=>null,
						'url_twitter_title'=>$page_og_title,
						'url_twitter_desc'=>$page_og_desc,
						'url_page_heading'=>$page_heading,
						'url_canonical_value'=>$url_data->url_value,
						'url_permalink_value'=>null,
						'url_priority'=>'0.5',
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>$date_modified,
						'url_active'=>'1',
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$date_modified						
					);


					if(!empty($page_heading) && !empty($page_meta_heading)){
						$updated=$this->sm->update_slug_urls($data_to_update,array('url_id'=>$page_id));

						if($updated){

							if(!empty($page_search_heading)){
								$state_data=$this->com->get_state(array('state_id'=>$url_data->url_state));
								$city_data=$this->com->get_city(array('city_id'=>$url_data->url_city));
								$country_data=$this->com->get_country(array('country_id'=>$url_data->url_country));
								$search_data=array(
									'search_data_type'=>$url_data->url_id,
									'search_data_type'=>'COLLEGE_SEARCH',
									'search_data_name'=>$page_heading,
									'search_data_meta_title'=>$page_meta_heading,
									'search_data_meta_desc'=>$page_meta_desc,
									'search_data_meta_keywords'=>(!empty($_keywords))?strtolower($_keywords):'',
									'search_data_og_title'=>$page_og_title,
									'search_data_og_desc'=>$page_og_desc,
									'search_data_country_id'=>($url_data->url_country!=null)?$country_data->country_id:null,
									'search_data_country'=>($url_data->url_country!=null)?$country_data->country_name:null,
									'search_data_state_id'=>($url_data->url_state!=null)?$url_data->url_state:NULL,
									'search_data_state_name'=>($url_data->url_state!=null)?$state_data->state_name:null,
									'search_data_city_id'=>($url_data->url_city!=NULL)?$url_data->url_city:null,
									'search_data_city_name'=>$city_data->city_name,
									'search_data_address'=>null,
									'search_data_course_ids'=>null,
									'search_data_course_name'=>null,
									'search_data_course_short_name'=>null,
									'search_data_access_url'=>$url_data->url_value
								);


								//print_obj($type_base_url_data);die;

								$search_data_found=$this->sm->get_system_search_data(array('search_data_access_url'=>$url_data->url_value));			

								if(!empty($search_data_found)){
									$this->sm->update_system_search_data($search_data,array('search_data_access_url'=>$url_data->url_value));
								}else{
									$this->sm->store_system_search_data($search_data);
								}
							}	

							$return['success']='Data updated';
						}else{
							$return['error']='Data not updated';
						}

					}else{
						$return['error']='Page heading and meta title are missing';
					}
				}else{
					$return['error']='Data not found to update';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onGenerateCollegeSearchSlugs_1(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country=post_data('page_country');
				$state=post_data('page_state');
				$city=post_data('page_city');
				$stream=post_data('page_stream');
				$course=post_data('page_course');

				$inst_category=post_data('inst_category');
				$ranking_agency=post_data('ranking_agency');
				$inst_type=post_data('inst_type');
				$affiliation_type=post_data('affiliation_type');

				$country_data=$this->com->get_country(array('country_id'=>$country));

				$country_name=ucwords($country_data->country_name);
				$country_code=strtolower($country_data->country_iso_code_2);

				$state_data=$this->com->get_state(array('state_id'=>$state));

				if(!empty($state_data)){
					$state_name=ucwords(strtolower($state_data->state_name));
				}

				$city_data=$this->com->get_city(array('city_id'=>$city));

				if(!empty($city_data)){
					$city_name=ucwords(strtolower($city_data->city_name));
				}

				$stream_data=$this->strm->get_stream(array('stream_id'=>$stream));

				if(!empty($stream_data)){
					$stream_name=ucwords(strtolower($stream_data->stream_name));
				}

				$course_data=$this->strm->get_course(array('course_id'=>$course));

				if(!empty($course_data)){
					$course_name=ucwords(strtolower($course_data->course_short_name));
				}

				$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state));
				$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city));
				$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream));
				$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course));

				$type_base_url=base_url(strtolower($country_data->country_iso_code_2).'/colleges');	
				$year=date('Y');			

				if($state>0 && $city==0){
					$type_base_url=$type_base_url.'/'.$state_slug->slug_value;

					$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state));

					$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_name).' BASED ON '.$year.' RANKING';
					$url_meta_title='Top Colleges in '.$state_name.' - '.$year.' Rankings, Fees, Placements';
					$url_meta_desc='Top '.$total_colleges.' Colleges in '.$state_name.' by Fees, Ranking, Admission and Placement.';
					$url_type='country,state';
					$url_type_id=$state;

					$breadcumb=array(
						'Home'=>base_url(),
						$country_name=>base_url($country_code.'/colleges'),
						'Colleges in '.$state_name=>''
					);
				}else if($state>0 && $city!=0){
					$breadcumb=array(
						'Home'=>base_url(),
						$country_name=>base_url($country_code.'/colleges'),
						$state_name=>$type_base_url.'/'.$state_slug->slug_value,
						'Colleges in '.$city_name=>''
					);

					$type_base_url=$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value;

					$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state,'college_city_id'=>$city));

					$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_name).' BASED ON '.$year.' RANKING';
					$url_meta_title='Top Colleges in '.$city_name.' - '.$year.' Rankings, Fees, Placements';
					$url_meta_desc='Top '.$total_colleges.' Colleges in '.$city_name.' by Fees, Ranking, Admission and Placement.';
					$url_type='country,state,city';
					$url_type_id=$city;
										
				}else{
					$breadcumb=array(
						'Home'=>base_url(),
						'Colleges in '.$country_name=>''
					);

					$type_base_url=$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value;

					$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country));

					$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_name).' BASED ON '.$year.' RANKING';
					$url_meta_title='Top Colleges in '.$country_name.' - '.$year.' Rankings, Fees, Placements';
					$url_meta_desc='Top '.$total_colleges.' Colleges in '.$country_name.' by Fees, Ranking, Admission and Placement.';
					$url_type='country';
					$url_type_id=$country;
				}


				if($stream>0 && $course>0){
					$type_base_url=$type_base_url.'/'.$stream_slug->slug_value.'/'.$course_slug->slug_value;
					if($state>0 && $city==0){
						$type_base_url=$type_base_url.'/'.$state_slug->slug_value;
						$breadcumb=array(
							'Home'=>base_url(),
							$country_name=>base_url($country_code.'/colleges'),
							$state_name=>$type_base_url.'/'.$state_slug->slug_value,
							'Colleges offering '.$course_name.' course'=>''
						);

						$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state));

						$url_page_heading='LIST OF TOP COLLEGES OFFERING '.strtoupper($course_name).' COURSE IN '.strtoupper($state_name).' BASED ON '.$year.' RANKING';
						$url_meta_title='Top Colleges in '.$state_name.' - '.$year.' Rankings, Fees, Placements';
						$url_meta_desc='Top '.$total_colleges.' Colleges offering '.$course_name.' course in '.$state_name.' by Fees, Ranking, Admission and Placement.';
						$url_type='country,state,stream';
						$url_type_id=$stream;
					}else if($state>0 && $city!=0){
						$type_base_url=$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value;
						$breadcumb=array(
							'Home'=>base_url(),
							$country_name=>base_url($country_code.'/colleges'),
							$state_name=>$type_base_url.'/'.$state_slug->slug_value,
							$city_name=>$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
							'Colleges offering '.$course_name.' course'=>''
						);

						$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state,'college_city_id'=>$city));

						$url_page_heading='LIST OF TOP COLLEGES OFFERING '.strtoupper($course_name).' COURSE IN '.strtoupper($city_name).' BASED ON '.$year.' RANKING';
						$url_meta_title='Top Colleges in '.$city_name.' - '.$year.' Rankings, Fees, Placements';
						$url_meta_desc='Top '.$total_colleges.' Colleges offering '.$course_name.' course in '.$city_name.' by Fees, Ranking, Admission and Placement.';
						$url_type='country,state,city,stream,course';
						$url_type_id=$course;			
					}
				}else if($stream>0 && $course==0){
					$type_base_url=$type_base_url.'/'.$stream_slug->slug_value;

					if($state>0 && $city==0){
						$type_base_url=$type_base_url.'/'.$state_slug->slug_value;
						$breadcumb=array(
							'Home'=>base_url(),
							$country_name=>base_url($country_code.'/colleges'),
							$state_name=>$type_base_url.'/'.$state_slug->slug_value,
							'Colleges offering '.$stream_name.' courses'=>''
						);

						$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state));

						$url_page_heading='LIST OF TOP COLLEGES OFFERING '.strtoupper($stream_name).' COURSES IN '.strtoupper($state_name).' BASED ON '.$year.' RANKING';
						$url_meta_title='Top Colleges in '.$state_name.' - '.$year.' Rankings, Fees, Placements';
						$url_meta_desc='Top '.$total_colleges.' Colleges offering '.$stream_name.' courses in '.$city_name.' by Fees, Ranking, Admission and Placement.';
						$url_type='country,state,stream';
						$url_type_id=$stream;
					}else if($state>0 && $city!=0){
						$type_base_url=$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value;
						$breadcumb=array(
							'Home'=>base_url(),
							$country_name=>base_url($country_code.'/colleges'),
							$state_name=>$type_base_url.'/'.$state_slug->slug_value,
							$city_name=>$type_base_url.'/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
							'Colleges offering '.$stream_name.' courses'=>''
						);

						$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country,'college_state_id'=>$state,'college_city_id'=>$city));

						$url_page_heading='LIST OF TOP COLLEGES OFFERING '.strtoupper($stream_name).' COURSES IN '.strtoupper($city_name).' BASED ON '.$year.' RANKING';
						$url_meta_title='Top Colleges in '.$city_name.' - '.$year.' Rankings, Fees, Placements';
						$url_meta_desc='Top '.$total_colleges.' Colleges offering '.$stream_name.' courses in '.$city_name.' by Fees, Ranking, Admission and Placement.';
						$url_type='country,state,city,stream';
						$url_type_id=$stream;				
					}
				}


				if($inst_category!='0'){
					$other_base_url='?'.$inst_category;
				}

				if($ranking_agency!='0'){
					$other_base_url='?'.$ranking_agency;
				}

				if($inst_type!='0'){
					$other_base_url='?'.$inst_type;
				}

				if($affiliation_type!='0'){
					$other_base_url='?'.$affiliation_type;
				}


				if($inst_category!='0' && $ranking_agency!='0'){
					$other_base_url='?'.$inst_category.'&'.$ranking_agency;
				}


				if($inst_category!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$affiliation_type;
				}


				if($inst_category!='0' && $inst_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$inst_type;
				}


				if($inst_type!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$inst_type.'&'.$affiliation_type;
				}


				if($ranking_agency!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$ranking_agency.'&'.$affiliation_type;
				}


				if($inst_category!='0' && $ranking_agency!='0' && $inst_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$ranking_agency.'&'.$inst_type;
				}


				if($inst_category!='0' && $inst_type!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$inst_type.'&'.$affiliation_type;
				}


				if($inst_category!='0' && $ranking_agency!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$ranking_agency.'&'.$affiliation_type;
				}


				if($ranking_agency!='0' && $inst_type!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$ranking_agency.'&'.$inst_type.'&'.$affiliation_type;
				}


				if($inst_category!='0' && $ranking_agency!='0' && $inst_type!='0' && $affiliation_type!='0'){
					$other_base_url='?'.$inst_category.'&'.$ranking_agency.'&'.$inst_type.'&'.$affiliation_type;
				}

				$type_base_url.=$other_base_url;

				
				$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

				$type_base_url_data=array(
					'url_glob_type'=>'college_search',
					'url_type'=>$url_type,
					'url_sub_type'=>'college_static_urls',
					'url_type_id'=>$url_type_id,
					'url_country'=>$country,
					'url_state'=>($state>0)?$state:NULL,
					'url_total_colleges'=>$total_colleges,
					'url_meta_heading'=>$url_meta_title,
					'url_meta_title'=>$url_meta_title,
					'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
					'url_meta_desc'=>$url_meta_desc,
					'url_og_title'=>$url_meta_title,
					'url_og_desc'=>$url_meta_desc,
					'url_page_heading'=>$url_page_heading,
					'url_value'=>$type_base_url,
					'url_breadcrumb'=>json_encode($breadcumb),
					'url_priority'=>'0.7',
					'url_data_change_freq'=>'yearly',
					'url_last_update'=>date('Y-m-d H:i:s')
				);


				$search_data=array(
					'search_data_type'=>NULL,
					'search_data_type'=>'COLLEGE_SEARCH',
					'search_data_name'=>$url_meta_title,
					'search_data_country'=>$country,
					'search_data_state_id'=>($state>0)?$state:NULL,
					'search_data_state_name'=>($state>0)?'':'',
					'search_data_city_id'=>NULL,
					'search_data_city_name'=>null,
					'search_data_address'=>null,
					'search_data_course_ids'=>null,
					'search_data_course_name'=>null,
					'search_data_course_short_name'=>null,
				);


				//print_obj($type_base_url_data);die;

				$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_base_url));			

				if(empty($get_type_base_url)){

					$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
					
					if($base_url_added){
						$return['success']='URL generated';
					}else{
						$return['error']='Error occurred.';
					}
				}else{
					$base_url_added=$this->sm->update_slug_urls($type_base_url_data,array('url_value'=>$type_base_url));
					
					if($base_url_added){
						$return['success']='URL updated';
					}else{
						$return['error']='Error occurred.';
					}
				}

				header('Content-Type: application/json');

				echo json_encode($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGenerateCollegeSearchSlugs(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country=post_data('page_country');
				$state=post_data('page_state');
				$city=post_data('page_city');
				$stream=post_data('page_stream');
				$course=post_data('page_course');

				$inst_category=post_data('inst_category');
				$ranking_agency=post_data('ranking_agency');
				$inst_type=post_data('inst_type');
				$affiliation_type=post_data('affiliation_type');

				if($country>0){
					$country_data=$this->com->get_country(array('country_id'=>$country));
					$country_name=ucwords($country_data->country_name);
					$country_code=strtolower($country_data->country_iso_code_2);
					$type_base_url='https://www.sikshapedia.com/'.strtolower($country_data->country_iso_code_2).'/colleges';

					$base_url='https://www.sikshapedia.com/'.strtolower($country_data->country_iso_code_2).'/colleges';

					$breadcumb=array(
						'Home'=>base_url(),
						'Top Colleges in '.$country_name=>''
					);

					if($state>0){
						$state_data=$this->com->get_state(array('state_id'=>$state));

						if(!empty($state_data)){
							$state_name=ucwords(strtolower($state_data->state_name));
							$type_base_url.='/'.$state_data->state_name_slug;

							$breadcumb=array(
								'Home'=>base_url(),
								$country_name=>$type_base_url,
								'Top Colleges in '.$state_name=>''
							);
						}
					}
						
					if($city>0){
						$city_data=$this->com->get_city(array('city_id'=>$city));

						if(!empty($city_data)){
							$city_name=ucwords(strtolower($city_data->city_name));
							$type_base_url.='/'.$city_data->city_name_slug;

							$breadcumb=array(
								'Home'=>base_url(),
								$country_name=>$type_base_url,
								$state_name=>$base_url.'/'.$state_data->state_name_slug,
								'Top Colleges in '.$city_name=>''
							);
						}
					}

					$stream_data=$this->strm->get_stream(array('stream_id'=>$stream));

					if(!empty($stream_data)){
						$stream_name=ucwords(strtolower($stream_data->stream_name));
						$type_base_url.='/'.url_slug($stream_name);

						if($city>0){
							$breadcumb=array(
								'Home'=>base_url(),
								$country_name=>$type_base_url,
								$state_name=>$base_url.'/'.$state_data->state_name_slug,
								$city_name=>$base_url.'/'.$state_data->state_name_slug.'/'.$city_data->city_name_slug,
								$stream_name.' Colleges in '.$city_name=>''
							);
						}else{
							$breadcumb=array(
								'Home'=>base_url(),
								$country_name=>$type_base_url,
								$stream_name.' Colleges in '.$state_name=>''
							);
						}					
					}
					

					//echo $type_url_base;die;

					$type_base_url_data=array(
						'url_glob_type'=>'colleges_search',
						'url_type'=>'college_search_url',
						'url_sub_type'=>'college_static_urls',
						'url_type_id'=>'0',
						'url_country'=>$country,
						'url_state'=>$state,
						'url_city'=>$city,
						'url_stream'=>$stream,
						'url_course'=>$course,
						'url_exam'=>'0',
						'url_total_colleges'=>'0',
						'url_value'=>$type_base_url,
						'url_canonical_value'=>$type_base_url,
						'url_breadcrumb'=>json_encode($breadcumb),
						'url_priority'=>'0.7',
						'url_data_change_freq'=>'daily',
						'url_last_update'=>date('Y-m-d H:i:s')
					);

					//print_obj($type_base_url_data);die;

					//echo $type_base_url;die;

					$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_base_url));			

					if(empty($get_type_base_url)){

						$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
						
						if($base_url_added){
							$return['success']='URL generated';
						}else{
							$return['error']='Error occurred.';
						}
					}else{
						$return['error']='URL already created';
					}
				}else{
					$return['error']='Select Country';
				}

					

				json_headers($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGetCollegeSearchMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$page_id=post_data('page_id');

				$page_id=decode_data($page_id);

				$page_data=$this->sm->get_slug_urls(array('url_id'=>$page_id));

				//print_obj($page_data);die;

				if(!empty($page_data)){
					$search_data_found=$this->sm->get_system_search_data(array('search_data_access_url'=>$page_data->url_value));
				}

				if(!empty($page_data)){
					$page_structure_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$page_id,'slug_type_json_ld'=>'ItemList'));
					$page_faq_structure_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$page_id,'slug_type_json_ld'=>'FAQPage'));
				}else{
					$page_structure_data=array();
					$page_faq_structure_data=array();
				}

				//print_obj($page_structue_data);die;

				$this->data['page_id']=$page_id;
				$this->data['page_data']=$page_data;
				$this->data['search_data_found']=$search_data_found;
				$this->data['page_structure_data']=$page_structure_data;
				$this->data['page_faq_structure_data']=$page_faq_structure_data;

				$return['html']=$this->theme->view('_pages/seo/vw_college_search_page_meta_dyna',$this->data,true);

				json_headers($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	/***Search URL***/


	public function onGenerateOtherTypeUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$page_country=post_data('page_country');
				$page_state=post_data('page_state');
				$page_city=post_data('page_city');
				$page_type=post_data('page_type');
				$page_stream=post_data('page_stream');
				$page_course=post_data('page_course');


				$page_inst_category=post_data('inst_category');
				$page_ranking_agency=post_data('ranking_agency');
				$page_inst_type=post_data('inst_type');
				$page_affiliation_type=post_data('affiliation_type');

				if($page_country!='0'){
					$country_id=decode_data($page_country);

					if(!empty($page_state)){
						$state_id=decode_data($page_state);
					}else{
						$state_id='0';
					}				

					if(!empty($page_city)){
						$city_id=decode_data($page_city);
					}else{
						$city_id='0';
					}

					if(!empty($page_stream)){
						$stream_id=decode_data($page_stream);
					}else{
						$stream_id='0';
					}

					if(!empty($page_course)){
						$course_id=$page_course;
					}else{
						$course_id='0';
					}
					

					$country_data=$this->com->get_country(array('country_id'=>$country_id));

					$country_code=strtolower($country_data->country_iso_code_2);

					if($page_type=='universities' || $page_type=='colleges'){
						$type_url_base=base_url().$country_code.'/'.$page_type;
					}else{
						$type_url_base=base_url().'/'.$page_type;
					}
					
					$year=date('Y');

					$url_value='';

					if($page_type!='universities'){

						if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id>0){//state city stream course


							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value.'/'.$stream_slug->slug_value.'/'.$course_slug->slug_value);

						}else if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id==0){//state city stream

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value.'/'.$stream_slug->slug_value);
							
						}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id==0){//state city

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value);
							
						}else if($state_id>0 && $city_id==0 && $stream_id==0 && $course_id==0){//state

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value);
							
						}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id>0){//state stream course

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$stream_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id>0){//state city course

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id==0){//state stream

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$stream_slug->slug_value);
							
						}else if($state_id>0 && $city_id==0 && $stream_id==0 && $course_id>0){//state course

							$state_data=$this->com->get_state(array('state_id'=>$state_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$state_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id==0 && $city_id>0 && $stream_id>0 && $course_id>0){//city stream course



							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$city_slug->slug_value.'/'.$stream_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id==0 && $city_id>0 && $stream_id>0 && $course_id==0){//city stream


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$url_value=base_url($country_code.'/colleges/'.$city_slug->slug_value.'/'.$stream_slug->slug_value);
							
						}else if($state_id==0 && $city_id>0 && $stream_id==0 && $course_id>0){//city course


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$city_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id==0 && $city_id>0 && $stream_id==0 && $course_id==0){//city


							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));


							$url_value=base_url($country_code.'/colleges/'.$city_slug->slug_value);
							
						}else if($state_id==0 && $city_id==0 && $stream_id>0 && $course_id>0){//stream course


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$stream_slug->slug_value.'/'.$course_slug->slug_value);
							
						}else if($state_id==0 && $city_id==0 && $stream_id>0 && $course_id==0){//stream

							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));


							$url_value=base_url($country_code.'/colleges/'.$stream_slug->slug_value);
							
						}else if($state_id==0 && $city_id==0 && $stream_id==0 && $course_id>0){//course

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));


							$url_value=base_url($country_code.'/colleges/'.$course_slug->slug_value);
								
						}else{
							$url_value=base_url($country_code.'/colleges');
						}


						//print_obj($url_value);


						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$url_value));

						//print_obj($get_type_base_url);die;



						if($page_inst_category!='0' && $page_ranking_agency!='0' && $page_inst_type!='0' && $page_affiliation_type!='0'){

							$url_value.='?'.$page_inst_category.'&'.$page_ranking_agency.'&'.$page_inst_type.'&'.$page_affiliation_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' COLLEGES', $get_type_base_url->url_page_heading)).' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('ctype=', '', $page_inst_type)).' Colleges',$get_type_base_url->url_meta_title).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('ctype=', '', $page_inst_type)).' Colleges', $get_type_base_url->url_meta_desc).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated,ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category!='0' && $page_ranking_agency!='0' && $page_inst_type!='0' && $page_affiliation_type=='0'){

							$url_value.='?'.$page_inst_category.'&'.$page_ranking_agency.'&'.$page_inst_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' COLLEGES', $get_type_base_url->url_page_heading)).' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges',$get_type_base_url->url_meta_title);

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges', $get_type_base_url->url_meta_desc).',ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category!='0' && $page_ranking_agency!='0' && $page_inst_type=='0' && $page_affiliation_type=='0'){

							$url_value.='?'.$page_inst_category.'&'.$page_ranking_agency;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' COLLEGES', $get_type_base_url->url_page_heading)).' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							$url_meta_title=str_replace('Top Colleges', 'Top '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' Colleges',$get_type_base_url->url_meta_title);

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('ctype=', '', $page_inst_type)).' Colleges', $get_type_base_url->url_meta_desc).' ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category=='0' && $page_ranking_agency!='0' && $page_inst_type!='0' && $page_affiliation_type!='0'){

							$url_value.='?'.$page_ranking_agency.'&'.$page_inst_type.'&'.$page_affiliation_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' COLLEGES', $get_type_base_url->url_page_heading)).' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('ctype=', '', $page_inst_type)).' Colleges',$get_type_base_url->url_meta_title).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('ctype=', '', $page_inst_type)).' Colleges', $get_type_base_url->url_meta_desc).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated,ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category=='0' && $page_ranking_agency=='0' && $page_inst_type!='0' && $page_affiliation_type!='0'){

							$url_value.='?'.$page_inst_type.'&'.$page_affiliation_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' COLLEGES', $get_type_base_url->url_page_heading)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges',$get_type_base_url->url_meta_title).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges', $get_type_base_url->url_meta_desc).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

						}else if($page_inst_category!='0' && $page_ranking_agency=='0' && $page_inst_type=='0' && $page_affiliation_type!='0'){

							$url_value.='?'.$page_inst_category.'&'.$page_affiliation_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' COLLEGES', $get_type_base_url->url_page_heading)).' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=str_replace('Top Colleges', 'Top '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' Colleges',$get_type_base_url->url_meta_title).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=str_replace(' Colleges', ' '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' Colleges', $get_type_base_url->url_meta_desc).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated,ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category!='0' && $page_ranking_agency=='0' && $page_inst_type!='0' && $page_affiliation_type=='0'){

							$url_value.='?'.$page_inst_category.'&'.$page_inst_type;


							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' COLLEGES', $get_type_base_url->url_page_heading));

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('c_cate=', '', $page_inst_category)).' Colleges',$get_type_base_url->url_meta_title);

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('c_cate=', '', $page_inst_category)).' Colleges', $get_type_base_url->url_meta_desc).','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

						}else if($page_inst_category=='0' && $page_ranking_agency!='0' && $page_inst_type=='0' && $page_affiliation_type=='0'){

							$url_value.='?'.$page_ranking_agency;


							$url_page_heading=$get_type_base_url->url_page_heading.' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							$url_meta_title=$get_type_base_url->url_meta_title.',ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							$url_meta_desc=$get_type_base_url->url_meta_desc.',ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

						}else if($page_inst_category=='0' && $page_ranking_agency=='0' && $page_inst_type!='0' && $page_affiliation_type=='0'){

							//echo 'hi2';

							$url_value.='?'.$page_inst_type;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' COLLEGES', $get_type_base_url->url_page_heading));

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges',$get_type_base_url->url_meta_title);

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('-college','',str_replace('ctype=', '', $page_inst_type))).' Colleges', $get_type_base_url->url_meta_desc);

							//echo $get_type_base_url->url_page_heading;die;

						}else if($page_inst_category!='0' && $page_ranking_agency=='0' && $page_inst_type=='0' && $page_affiliation_type=='0'){

							$url_value.='?'.$page_inst_category;

							$url_page_heading=strtoupper(str_replace('TOP COLLEGES', 'TOP '.strtoupper(str_replace('c_cate=', '', $page_inst_category)).' COLLEGES', $get_type_base_url->url_page_heading));

							$url_meta_title=str_replace('Top Colleges', 'Top '.ucwords(str_replace('c_cate=', '', $page_inst_category)).' Colleges',$get_type_base_url->url_meta_title);

							$url_meta_desc=str_replace(' Colleges', ' '.ucwords(str_replace('c_cate=', '', $page_inst_category)).' Colleges', $get_type_base_url->url_meta_desc);

						}else if($page_inst_category=='0' && $page_ranking_agency=='0' && $page_inst_type=='0' && $page_affiliation_type!='0'){
							

							$url_value.='?'.$page_affiliation_type;

							$url_page_heading=$get_type_base_url->url_page_heading.' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=$get_type_base_url->url_meta_title.','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=$get_type_base_url->url_meta_desc.','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated,ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							//echo $url_page_heading;die;

						}else if($page_inst_category=='0' && $page_ranking_agency!='0' && $page_inst_type=='0' && $page_affiliation_type!='0'){
							

							$url_value.='?'.$page_affiliation_type;

							$url_page_heading=$get_type_base_url->url_page_heading.' BY '.strtoupper(str_replace('agn=', '', $page_ranking_agency)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' AFFILIATED';

							$url_meta_title=$get_type_base_url->url_meta_title.',ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency)).' & '.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated';

							$url_meta_desc=$get_type_base_url->url_meta_desc.','.strtoupper(str_replace('aff=', '', $page_affiliation_type)).' affiliated,ranking by '.strtoupper(str_replace('agn=', '', $page_ranking_agency));

							//echo $url_page_heading;die;
						}

						

					

						//echo $url_page_heading;die;


						$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));


						
						

						//$_get_type_base_url=$this->sm->get_slug_urls_new(array('url_value'=>$url_value));


						$_get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$url_value));



						$type_base_url_data=array(
							'url_glob_type'=>$page_type,
							'url_type'=>$get_type_base_url->url_type,
							'url_sub_type'=>'college_static_urls',
							'url_type_id'=>$get_type_base_url->url_type_id,
							'url_country'=>$get_type_base_url->url_country,
							'url_state'=>$get_type_base_url->url_state,
							'url_total_colleges'=>$get_type_base_url->url_total_colleges,
							'url_meta_heading'=>$url_meta_title,
							'url_meta_title'=>$url_meta_title,
							'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
							'url_meta_desc'=>$url_meta_desc,
							'url_og_title'=>$url_meta_title,
							'url_og_desc'=>$url_meta_desc,
							'url_page_heading'=>$url_page_heading,
							'url_value'=>$url_value,
							'url_breadcrumb'=>$get_type_base_url->url_breadcrumb,
							'url_priority'=>'0.7',
							'url_data_change_freq'=>'yearly',
							'url_last_update'=>date('Y-m-d H:i:s')
						);


						//print_obj($type_base_url_data);die;			

						if(empty($_get_type_base_url)){

							$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
							$url_id=$base_url_added;
							if($url_id){
								$return['success']='URL generated';
							}else{
								$return['error']='Error occurred.';
							}
						}else{
							$base_url_added=$this->sm->update_slug_urls($type_base_url_data,array('url_value'=>$type_url));
							$url_id=$base_url_added;
							if($url_id){
								$return['success']='URL updated';
							}else{
								$return['error']='Error occurred.';
							}
						}



					}else{
						$return['error']='University or school data can not be proccessed now';
					}

				}else{
					$return['error']='Select country';
				}

					
				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onGenerateTypeUrls(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$page_country=post_data('page_country');
				$page_state=post_data('page_state');
				$page_city=post_data('page_city');
				$page_type=post_data('page_type');
				$page_stream=post_data('page_stream');
				$page_course=post_data('page_course');

				if($page_country!='0'){
					$country_id=decode_data($page_country);

					if(!empty($page_state)){
						$state_id=decode_data($page_state);
					}else{
						$state_id='0';
					}				

					if(!empty($page_city)){
						$city_id=decode_data($page_city);
					}else{
						$city_id='0';
					}

					if(!empty($page_stream)){
						$stream_id=decode_data($page_stream);
					}else{
						$stream_id='0';
					}

					if(!empty($page_course)){
						$course_id=$page_course;
					}else{
						$course_id='0';
					}
					

					$country_data=$this->com->get_country(array('country_id'=>$country_id));

					$country_code=strtolower($country_data->country_iso_code_2);

					if($page_type=='universities' || $page_type=='colleges'){
						$type_url_base=base_url().$country_code.'/'.$page_type;
					}else{
						$type_url_base=base_url().'/'.$page_type;
					}
					
					$year=date('Y');

					if($state_id>0 && $city_id==0 && $stream_id==0 && $course_id==0){// state

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' by Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

							$type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'state',
								'url_sub_type'=>'college_static_urls',
								'url_type_id'=>$state_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$total_colleges,
								'url_meta_heading'=>$url_meta_title,
								'url_meta_title'=>$url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_title,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_page_heading,
								'url_value'=>$type_url,
								'url_breadcrumb'=>json_encode($breadcumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);				

							if(empty($get_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($type_base_url_data,array('url_value'=>$type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}
						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id==0){// state city

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$city_data=$this->com->get_city(array('city_id'=>$city_id));
						$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

						if(!empty($city_slug)){
							$city_slug_value=$city_slug->slug_value;
						}else{						
							$city_url_slug=url_slug($city_data->city_name);
							$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
							$city_slug_value=$city_url_slug;
						}

						$city_type_url=$type_url.'/'.$city_slug_value;


						if($page_type=='colleges'){

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

							if(empty($get_type_base_url)){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolwer($state_data->state_name)).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));						

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

							$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' BASED ON '.$year.' RANKING';
							$city_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).' - '.$year.' Rankings, Fees, Placements';
							$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).' by Fees, Ranking, Admission and Placement.';

							$city_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								'Colleges in '.ucwords(strtolower($city_data->city_name))=>''
							);

							$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));						

							$city_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'city',
								'url_sub_type'=>'college_static_urls',
								'url_type_id'=>$city_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$city_total_colleges,
								'url_meta_heading'=>$city_url_meta_title,
								'url_meta_title'=>$city_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
								'url_meta_desc'=>$city_url_meta_desc,
								'url_og_title'=>$city_url_meta_title,
								'url_og_desc'=>$city_url_meta_desc,
								'url_page_heading'=>$city_url_page_heading,
								'url_value'=>$city_type_url,
								'url_breadcrumb'=>json_encode($city_breadcumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_city_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($city_type_base_url_data);
								if($url_added){
									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($city_type_base_url_data,array('url_value'=>$city_type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}

						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}



					}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id==0){// state stream

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' offering '.strtoupper($stream_data->stream_name).' courses BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' by '.ucwords(strtolower($stream_data->stream_name)).' Courses, Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

							if(empty($get_type_base_url)){						

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($state_stream_type_base_url_data);
								if($url_added){
									$courses=$this->strm->get_course(array('course_stream'=>$stream_id),FALSE,'course_id','ASC');

									//print_obj($courses);die;

									if(!empty($courses)){
										foreach ($courses as $key => $v) {
											$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id));

											if(!empty($course_slug)){
												$course_slug_value=$course_slug->slug_value;
											}else{						
												$course_url_slug=url_slug($v->course_name);
												$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id,'slug_value'=>$course_url_slug));
												$course_slug_value=$course_url_slug;
											}

											$course_type_url=$stream_type_url.'/'.$course_slug_value;

											$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

											if(empty($get_course_type_base_url)){

												$ctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$v->course_id,'haystack'=>'system_users_colleges.college_course_ids'));

												$curl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($v->course_name).' BASED ON '.$year.' RANKING';
												$curl_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($v->course_name)).' - '.$year.' Rankings, Fees, Placements';
												$curl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).' offering '.ucwords($v->course_name).' of '.ucwords(strtolower($stream_data->stream_name)).' by Fees, Ranking, Admission and Placement.';

												$cbreadcumb=array(
													'Home'=>base_url(),
													ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
													ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
													'Colleges offering '.ucwords(strtolower($v->course_name))=>''
												);

												$curl_meta_key_words=generateKeywordsFromText(strtolower($curl_page_heading.'.'.$curl_meta_title.'.'.$curl_meta_desc));

																	

													$course_type_base_url_data=array(
														'url_glob_type'=>$page_type.'_search',
														'url_type'=>'course',
														'url_type_id'=>$v->course_id,
														'url_sub_type'=>'college_static_url_course',
														'url_sub_type_id'=>$v->course_id,
														'url_country'=>$country_id,
														'url_state'=>'0',
														'url_total_colleges'=>$ctotal_colleges,
														'url_meta_heading'=>$curl_meta_title,
														'url_meta_title'=>$curl_meta_title,
														'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $curl_meta_key_words)),
														'url_meta_desc'=>$curl_meta_desc,
														'url_og_title'=>$curl_meta_title,
														'url_og_desc'=>$curl_meta_desc,
														'url_page_heading'=>$curl_page_heading,
														'url_value'=>$course_type_url,
														'url_breadcrumb'=>json_encode($cbreadcumb),
														'url_priority'=>'0.8',
														'url_data_change_freq'=>'yearly',
														'url_last_update'=>date('Y-m-d H:i:s')
													);

													$this->sm->store_slug_urls($course_type_base_url_data);														
													
												

											}
										}
									}
									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($state_stream_type_base_url_data,array('url_value'=>$stream_type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id>0){// state stream course
						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' offering '.strtoupper($stream_data->stream_name).' courses BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' by '.ucwords(strtolower($stream_data->stream_name)).' Courses, Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

							if(empty($get_type_base_url)){						

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.strtoupper($state_data->state_name).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses by Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){
								$this->sm->store_slug_urls($state_stream_type_base_url_data);
							}


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

							$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
							$course_url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($course_data->course_name)).' in '.ucwords(strtolower($stream_data->stream_name)).' stream - '.$year.' Rankings, Fees, Placements';
							$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.ucwords(strtolower($stream_data->stream_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by '.ucwords(strtolower($course_data->course_name)).' in '.ucwords(strtolower($stream_data->stream_name)).' stream Fees, Ranking, Admission and Placement.';

							$d=array(
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
								'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
							);


							$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

							$course_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'course',
								'url_type_id'=>$course_id,
								'url_sub_type'=>'college_static_url_course',
								'url_sub_type_id'=>$course_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$course_total_colleges,
								'url_meta_heading'=>$course_url_meta_title,
								'url_meta_title'=>$course_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
								'url_meta_desc'=>$course_url_meta_desc,
								'url_og_title'=>$course_url_meta_title,
								'url_og_desc'=>$course_url_meta_desc,
								'url_page_heading'=>$course_url_page_heading,
								'url_value'=>$course_type_url,
								'url_breadcrumb'=>json_encode($d),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);


							if(empty($get_course_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}
					else if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id==0){// state city stream

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($state_data->state_name))=>$type_url,
									'Colleges in '.ucwords(strtolower($city_data->city_name))=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$city_type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).' by '.ucwords(strtolower($stream_data->stream_name)).' Courses, Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								ucwords(strtolower($city_data->city_name))=>$city_type_url,
								'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($state_stream_type_base_url_data);
								if($url_added){


									$courses=$this->strm->get_course(array('course_stream'=>$stream_id),FALSE,'course_id','ASC');

									//print_obj($courses);die;

									if(!empty($courses)){
										foreach ($courses as $key => $v) {
											$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id));

											if(!empty($course_slug)){
												$course_slug_value=$course_slug->slug_value;
											}else{						
												$course_url_slug=url_slug($v->course_name);
												$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id,'slug_value'=>$course_url_slug));
												$course_slug_value=$course_url_slug;
											}

											$course_type_url=$stream_type_url.'/'.$course_slug_value;

											$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

											$course_state_type_url=$type_url_base.'/'.$state_slug->slug_value.'/'.$course_slug_value;

											//echo $course_state_type_url;

											$get_state_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_state_type_url));


											if(empty($get_course_type_base_url)){

												$ctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$v->course_id,'haystack'=>'system_users_colleges.college_course_ids'));

												$curl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($v->course_name).' BASED ON '.$year.' RANKING';
												$curl_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($v->course_name)).' - '.$year.' Rankings, Fees, Placements';
												$curl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($v->course_name)).' of '.ucwords(strtolower($stream_data->stream_name)).' by Fees, Ranking, Admission and Placement.';

												$cbreadcumb=array(
													'Home'=>base_url(),
													ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
													ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
													'Colleges offering '.ucwords(strtolower($v->course_name))=>''
												);

												$curl_meta_key_words=generateKeywordsFromText(strtolower($curl_page_heading.'.'.$curl_meta_title.'.'.$curl_meta_desc));
					
												$course_type_base_url_data=array(
													'url_glob_type'=>$page_type.'_search',
													'url_type'=>'course',
													'url_type_id'=>$v->course_id,
													'url_sub_type'=>'college_static_url_course',
													'url_sub_type_id'=>$v->course_id,
													'url_country'=>$country_id,
													'url_state'=>'0',
													'url_total_colleges'=>$ctotal_colleges,
													'url_meta_heading'=>$curl_meta_title,
													'url_meta_title'=>$curl_meta_title,
													'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $curl_meta_key_words)),
													'url_meta_desc'=>$curl_meta_desc,
													'url_og_title'=>$curl_meta_title,
													'url_og_desc'=>$curl_meta_desc,
													'url_page_heading'=>$curl_page_heading,
													'url_value'=>$course_type_url,
													'url_breadcrumb'=>json_encode($cbreadcumb),
													'url_priority'=>'0.8',
													'url_data_change_freq'=>'yearly',
													'url_last_update'=>date('Y-m-d H:i:s')
												);

												$this->sm->store_slug_urls($course_type_base_url_data);
											}

											if(empty($get_state_course_type_base_url)){
												$sctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$v->course_id,'haystack'=>'system_users_colleges.college_course_ids'));

												$scurl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($v->course_name).' BASED ON '.$year.' RANKING';
												$scurl_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($v->course_name)).' - '.$year.' Rankings, Fees, Placements';
												$scurl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).' offering '.ucwords(strtolower($v->course_name)).' of '.ucwords(strtolower($stream_data->stream_name)).' by Fees, Ranking, Admission and Placement.';

												$scbreadcumb=array(
													'Home'=>base_url(),
													ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
													ucwords(strtolower($state_data->state_name))=>$type_url_base.'/'.$state_slug->slug_value,
													ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
													'Colleges offering '.ucwords(strtolower($v->course_name))=>''
												);

												$scurl_meta_key_words=generateKeywordsFromText(strtolower($scurl_page_heading.'.'.$scurl_meta_title.'.'.$scurl_meta_desc));
					
												$scourse_type_base_url_data=array(
													'url_glob_type'=>$page_type.'_search',
													'url_type'=>'course',
													'url_type_id'=>$v->course_id,
													'url_sub_type'=>'college_static_url_course',
													'url_sub_type_id'=>$v->course_id,
													'url_country'=>$country_id,
													'url_state'=>'0',
													'url_total_colleges'=>$sctotal_colleges,
													'url_meta_heading'=>$scurl_meta_title,
													'url_meta_title'=>$scurl_meta_title,
													'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $scurl_meta_key_words)),
													'url_meta_desc'=>$scurl_meta_desc,
													'url_og_title'=>$scurl_meta_title,
													'url_og_desc'=>$scurl_meta_desc,
													'url_page_heading'=>$scurl_page_heading,
													'url_value'=>$course_state_type_url,
													'url_breadcrumb'=>json_encode($cbreadcumb),
													'url_priority'=>'0.8',
													'url_data_change_freq'=>'yearly',
													'url_last_update'=>date('Y-m-d H:i:s')
												);

												$this->sm->store_slug_urls($scourse_type_base_url_data);
											}
										}
									}



									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($state_stream_type_base_url_data,array('url_value'=>$stream_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}



						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}else if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id>0){// state city stream course

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($state_data->state_name))=>$type_url,
									'Colleges in '.ucwords(strtolower($city_data->city_name))=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$city_type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if(empty($get_stream_type_base_url)){
								$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$state_stream_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
								$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses by Fees, Ranking, Admission and Placement.';

								$state_stream_breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($state_data->state_name))=>$type_url,
									ucwords(strtolower($city_data->city_name))=>$city_type_url,
									'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
								);

								$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

								$state_stream_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'stream',
									'url_type_id'=>$stream_id,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$stream_total_colleges,
									'url_meta_heading'=>$state_stream_url_meta_title,
									'url_meta_title'=>$state_stream_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
									'url_meta_desc'=>$state_stream_url_meta_desc,
									'url_og_title'=>$state_stream_url_meta_title,
									'url_og_desc'=>$state_stream_url_meta_desc,
									'url_page_heading'=>$state_stream_url_page_heading,
									'url_value'=>$stream_type_url,
									'url_breadcrumb'=>json_encode($state_stream_breadcumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($state_stream_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

							$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
							$course_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).' offering '.ucwords(strtolower($course_data->course_name)).' in '.ucwords(strtolower($stream_data->stream_name)).' stream - '.$year.' Rankings, Fees, Placements';
							$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by '.ucwords(strtolower($course_data->course_name)).' in '.ucwords(strtolower($stream_data->stream_name)).' stream Fees, Ranking, Admission and Placement.';

							$d=array(
								ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
								ucwords(strtolower($state_data->state_name))=>$type_url,
								ucwords(strtolower($city_data->city_name))=>$city_type_url,
								ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
								'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
							);


							$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

							$course_type_base_url_data=array(
								'url_glob_type'=>$page_type.'_search',
								'url_type'=>'course',
								'url_type_id'=>$course_id,
								'url_sub_type'=>'college_static_url_course',
								'url_sub_type_id'=>$course_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$course_total_colleges,
								'url_meta_heading'=>$course_url_meta_title,
								'url_meta_title'=>$course_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
								'url_meta_desc'=>$course_url_meta_desc,
								'url_og_title'=>$course_url_meta_title,
								'url_og_desc'=>$course_url_meta_desc,
								'url_page_heading'=>$course_url_page_heading,
								'url_value'=>$course_type_url,
								'url_breadcrumb'=>json_encode($d),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);


							if(empty($get_course_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id>0){//state city course

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords(strtolower($state_data->state_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($state_data->state_name))=>$type_url,
									'Colleges in '.ucwords(strtolower($city_data->city_name))=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$city_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

								$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
								$course_url_meta_title='Top Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords($country_data->country_name).' offering '.ucwords(strtolower($course_data->course_name)).' - '.$year.' Rankings, Fees, Placements';
								$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.ucwords(strtolower($city_data->city_name)).','.ucwords(strtolower($state_data->state_name)).','.ucwords(strtolower($country_data->country_name)).' by '.ucwords(strtolower($course_data->course_name)).' Courses, Fees, Ranking, Admission and Placement.';

								$d=array(
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($state_data->state_name))=>$type_url,
									ucwords(strtolower($city_data->city_name))=>$city_type_url,
									'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
								);



								$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

								//print_obj($course_url_meta_key_words);

								$course_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'course',
									'url_type_id'=>$course_id,
									'url_sub_type'=>'college_static_url_course',
									'url_sub_type_id'=>$course_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$course_total_colleges,
									'url_meta_heading'=>$course_url_meta_title,
									'url_meta_title'=>$course_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
									'url_meta_desc'=>$course_url_meta_desc,
									'url_og_title'=>$course_url_meta_title,
									'url_og_desc'=>$course_url_meta_desc,
									'url_page_heading'=>$course_url_page_heading,
									'url_value'=>$course_type_url,
									'url_breadcrumb'=>json_encode($d),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);


							if(empty($get_course_type_base_url)){

								

								//print_obj($course_type_base_url_data);

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}
					else{
						if($stream_id>0 && $course_id=='0'){//only stream
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$url_slug));
								$stream_slug_value=$url_slug;
							}

							$stream_type_url=$type_url_base.'/'.$stream_slug_value;

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if($page_type=='colleges'){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

								if(empty($get_type_base_url)){						

									$stream_type_base_url_data=array(
										'url_glob_type'=>$page_type.'_search',
										'url_type'=>'stream',
										'url_type_id'=>$stream_id,
										'url_sub_type'=>'college_static_url_stream',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$stream_type_url,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.8',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($stream_type_base_url_data);
									$url_id=$base_url_added;
									if($url_id){

										$courses=$this->strm->get_course(array('course_stream'=>$stream_id),FALSE,'course_id','ASC');

										//print_obj($courses);die;

										if(!empty($courses)){
											foreach ($courses as $key => $v) {
												$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id));

												if(!empty($course_slug)){
													$course_slug_value=$course_slug->slug_value;
												}else{						
													$course_url_slug=url_slug($v->course_name);
													$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$v->course_id,'slug_value'=>$course_url_slug));
													$course_slug_value=$course_url_slug;
												}

												$course_type_url=$stream_type_url.'/'.$course_slug_value;

												$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

												if(empty($get_course_type_base_url)){

													$ctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$v->course_id,'haystack'=>'system_users_colleges.college_course_ids'));

													$curl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($v->course_name).' BASED ON '.$year.' RANKING';
													$curl_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($v->course_name)).' - '.$year.' Rankings, Fees, Placements';
													$curl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($v->course_name)).' of '.ucwords(strtolower($stream_data->stream_name)).' by Fees, Ranking, Admission and Placement.';

													$cbreadcumb=array(
														'Home'=>base_url(),
														ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
														ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
														'Colleges offering '.ucwords(strtolower($v->course_name))=>''
													);

													$curl_meta_key_words=generateKeywordsFromText(strtolower($curl_page_heading.'.'.$curl_meta_title.'.'.$curl_meta_desc));

																		

														$course_type_base_url_data=array(
															'url_glob_type'=>$page_type.'_search',
															'url_type'=>'course',
															'url_type_id'=>$v->course_id,
															'url_sub_type'=>'college_static_url_course',
															'url_sub_type_id'=>$v->course_id,
															'url_country'=>$country_id,
															'url_state'=>'0',
															'url_total_colleges'=>$ctotal_colleges,
															'url_meta_heading'=>$curl_meta_title,
															'url_meta_title'=>$curl_meta_title,
															'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $curl_meta_key_words)),
															'url_meta_desc'=>$curl_meta_desc,
															'url_og_title'=>$curl_meta_title,
															'url_og_desc'=>$curl_meta_desc,
															'url_page_heading'=>$curl_page_heading,
															'url_value'=>$course_type_url,
															'url_breadcrumb'=>json_encode($cbreadcumb),
															'url_priority'=>'0.8',
															'url_data_change_freq'=>'yearly',
															'url_last_update'=>date('Y-m-d H:i:s')
														);

														$this->sm->store_slug_urls($course_type_base_url_data);														
														
													

												}
											}
										}

												


										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}
								
							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}

						}else if($stream_id=='0' && $course_id>0){
							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$url_slug));
								$course_slug_value=$url_slug;
							}

							$course_type_url=$type_url_base.'/'.$course_slug_value;

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							if($page_type=='colleges'){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								if(empty($get_type_base_url)){						

									$course_type_base_url_data=array(
										'url_glob_type'=>$page_type.'_search',
										'url_type'=>'course',
										'url_type_id'=>$course_id,
										'url_sub_type'=>'college_static_url_course',
										'url_sub_type_id'=>$course_id,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$course_type_url,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.8',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
									$url_id=$base_url_added;

									if($url_id){
										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}
								
							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}


						}else if($stream_id>0 && $course_id>0){
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$url_slug));
								$stream_slug_value=$url_slug;
							}

							$stream_type_url=$type_url_base.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if(empty($get_stream_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($stream_data->stream_name)).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									'Colleges offering courses in '.ucwords(strtolower($stream_data->stream_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$stream_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'stream',
									'url_type_id'=>$stream_id,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>'0',
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$stream_type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($stream_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							if($page_type=='colleges'){

								$ctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

								$curl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
								$curl_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' - '.$year.' Rankings, Fees, Placements';
								$curl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' by Fees, Ranking, Admission and Placement.';

								$cbreadcumb=array(
									'Home'=>base_url(),
									ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
									ucwords(strtolower($stream_data->stream_name))=>$stream_type_url,
									'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
								);

								$curl_meta_key_words=generateKeywordsFromText(strtolower($curl_page_heading.'.'.$curl_meta_title.'.'.$curl_meta_desc));

								$course_type_base_url_data=array(
									'url_glob_type'=>$page_type.'_search',
									'url_type'=>'course',
									'url_type_id'=>$course_id,
									'url_sub_type'=>'college_static_url_course',
									'url_sub_type_id'=>$course_id,
									'url_country'=>$country_id,
									'url_state'=>'0',
									'url_total_colleges'=>$ctotal_colleges,
									'url_meta_heading'=>$curl_meta_title,
									'url_meta_title'=>$curl_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $curl_meta_key_words)),
									'url_meta_desc'=>$curl_meta_desc,
									'url_og_title'=>$curl_meta_title,
									'url_og_desc'=>$curl_meta_desc,
									'url_page_heading'=>$curl_page_heading,
									'url_value'=>$course_type_url,
									'url_breadcrumb'=>json_encode($cbreadcumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								if(empty($get_course_type_base_url)){

									$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
									$url_id=$base_url_added;

									if($url_id){

										$only_course_type_url=$type_url_base.'/'.$course_slug_value;

										$get_only_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$only_course_type_url));

										$octotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

										$ocurl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
										$ocurl_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' - '.$year.' Rankings, Fees, Placements';
										$ocurl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' offering '.ucwords(strtolower($course_data->course_name)).' by Fees, Ranking, Admission and Placement.';

										$ocbreadcumb=array(
											'Home'=>base_url(),
											ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
											'Colleges offering '.ucwords(strtolower($course_data->course_name))=>''
										);

										$ocurl_meta_key_words=generateKeywordsFromText(strtolower($ocurl_page_heading.'.'.$ocurl_meta_title.'.'.$ocurl_meta_desc));

										$ocourse_type_base_url_data=array(
											'url_glob_type'=>$page_type.'_search',
											'url_type'=>'course',
											'url_type_id'=>$course_id,
											'url_sub_type'=>'college_static_url_course',
											'url_sub_type_id'=>$course_id,
											'url_country'=>$country_id,
											'url_state'=>'0',
											'url_total_colleges'=>$octotal_colleges,
											'url_meta_heading'=>$ocurl_meta_title,
											'url_meta_title'=>$ocurl_meta_title,
											'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $ocurl_meta_key_words)),
											'url_meta_desc'=>$ocurl_meta_desc,
											'url_og_title'=>$ocurl_meta_title,
											'url_og_desc'=>$ocurl_meta_desc,
											'url_page_heading'=>$ocurl_page_heading,
											'url_value'=>$only_course_type_url,
											'url_breadcrumb'=>json_encode($ocbreadcumb),
											'url_priority'=>'0.8',
											'url_data_change_freq'=>'yearly',
											'url_last_update'=>date('Y-m-d H:i:s')
										);

										if(empty($get_only_course_type_base_url)){
											$this->sm->store_slug_urls($ocourse_type_base_url_data);
										}else{
											$this->sm->update_slug_urls($ocourse_type_base_url_data,array('url_value'=>$only_course_type_url));
										}

										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}

								}else{
									$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
									if($base_url_added){
										$return['success']='URL updated';
									}else{
										$return['error']='URL not updated';
									}
									
								}

							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}

						}else{

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url_base));

							if($page_type=='colleges'){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,null);

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords(strtolower($country_data->country_name)).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($country_data->country_name)).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									'Colleges in '.ucwords(strtolower($country_data->country_name))=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

								if(empty($get_type_base_url)){						

									$type_base_url_data=array(
										'url_glob_type'=>$page_type.'_search',
										'url_type'=>'main',
										'url_type_id'=>0,
										'url_sub_type'=>'college_static_url_main',
										'url_sub_type_id'=>0,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$type_url_base,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.7',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
									$url_id=$base_url_added;
									if($url_id){
										$states=$this->com->get_states(array('state_country_id'=>$country_id),'state_id','ASC');

										foreach ($states as $key => $value) {
											$state_ids[]=$value->state_id;
											$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->state_id));
											if(!empty($state_slug)){
												$slug_value=$state_slug->slug_value;
											}else{						
												$url_slug=url_slug($value->state_name);
												$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$value->state_id,'slug_value'=>$url_slug));
												$slug_value=$url_slug;
											}

											$type_url=$type_url_base.'/'.$slug_value;

											$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

											
											$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$value->state_id));

											$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($value->state_name).' BASED ON '.$year.' RANKING';
											$url_meta_title='Top Colleges in '.ucwords(strtolower($value->state_name)).' - '.$year.' Rankings, Fees, Placements';
											$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($value->state_name)).' by Fees, Ranking, Admission and Placement.';

											$breadcumb=array(
												'Home'=>base_url(),
												ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
												'Colleges in '.ucwords(strtolower($value->state_name))=>''
											);

											$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

											$state_type_base_url_data[]=array(
												'url_glob_type'=>$page_type.'_search',
												'url_type'=>'state',
												'url_sub_type'=>'college_static_urls',
												'url_type_id'=>$state_id,
												'url_country'=>$country_id,
												'url_state'=>$state_id,
												'url_total_colleges'=>$total_colleges,
												'url_meta_heading'=>$url_meta_title,
												'url_meta_title'=>$url_meta_title,
												'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
												'url_meta_desc'=>$url_meta_desc,
												'url_og_title'=>$url_meta_title,
												'url_og_desc'=>$url_meta_desc,
												'url_page_heading'=>$url_page_heading,
												'url_value'=>$type_url,
												'url_breadcrumb'=>json_encode($breadcumb),
												'url_priority'=>'0.7',
												'url_data_change_freq'=>'yearly',
												'url_last_update'=>date('Y-m-d H:i:s')
											);											
										}

										$state_url_added=$this->sm->store_slug_urls($state_type_base_url_data,TRUE);

										if($state_url_added){
											if(!empty($states)){
												foreach ($states as $k => $v) {
													$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$v->state_id));
													$cities=$this->com->get_city(array('city_state_id'=>$v->state_id,'city_country_id'=>$country_id),FALSE,'city_id','ASC');

													foreach ($cities as $_k => $_v) {
														$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$_v->city_id));
														if(!empty($city_slug)){
															$city_slug_value=$city_slug->slug_value;
														}else{						
															$city_url_slug=url_slug($_v->city_name);
															$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$_v->city_id,'slug_value'=>$city_url_slug));
															$city_slug_value=$city_url_slug;
														}
														$city_type_url=$type_url_base.'/'.$state_slug->slug_value.'/'.$city_slug_value;

														$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

														$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$v->state_id,'college_city_id'=>$_v->city_id));

														$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($_v->city_name).' BASED ON '.$year.' RANKING';
														$city_url_meta_title='Top Colleges in '.ucwords(strtolower($_v->city_name)).' of '.ucwords(strtolower($v->state_name)).','.ucwords(strtolower($country_data->country_name)).' - '.$year.' Rankings, Fees, Placements';
														$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords(strtolower($_v->city_name)).' of '.ucwords(strtolower($v->state_name)).','.ucwords(strtolower($country_data->country_name)).' by Fees, Ranking, Admission and Placement.';

														$city_breadcumb=array(
															'Home'=>base_url(),
															ucwords(strtolower($country_data->country_name))=>base_url($country_code.'/colleges'),
															ucwords(strtolower($v->state_name))=>$type_url,
															'Colleges in '.ucwords(strtolower($_v->city_name))=>''
														);

														$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));	

														if(empty($get_city_type_base_url)){
															$city_type_base_url_data=array(
																'url_glob_type'=>$page_type.'_search',
																'url_type'=>'city',
																'url_sub_type'=>'college_static_urls',
																'url_type_id'=>$city_id,
																'url_country'=>$country_id,
																'url_state'=>$state_id,
																'url_total_colleges'=>$city_total_colleges,
																'url_meta_heading'=>$city_url_meta_title,
																'url_meta_title'=>$city_url_meta_title,
																'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
																'url_meta_desc'=>$city_url_meta_desc,
																'url_og_title'=>$city_url_meta_title,
																'url_og_desc'=>$city_url_meta_desc,
																'url_page_heading'=>$city_url_page_heading,
																'url_value'=>$city_type_url,
																'url_breadcrumb'=>json_encode($city_breadcumb),
																'url_priority'=>'0.7',
																'url_data_change_freq'=>'yearly',
																'url_last_update'=>date('Y-m-d H:i:s')
															);

															$this->sm->store_slug_urls($city_type_base_url_data);
														}					

															
													}

													
												}
											}
										}


										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}

							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}
						}
					}
				}else{
					$return['error']='Select country';
				}

					
				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onGenerateTypeUrls_old2(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$page_country=post_data('page_country');
				$page_state=post_data('page_state');
				$page_city=post_data('page_city');
				$page_type=post_data('page_type');
				$page_stream=post_data('page_stream');
				$page_course=post_data('page_course');

				if($page_country!='0'){
					$country_id=decode_data($page_country);

					if(!empty($page_state)){
						$state_id=decode_data($page_state);
					}else{
						$state_id='0';
					}				

					if(!empty($page_city)){
						$city_id=decode_data($page_city);
					}else{
						$city_id='0';
					}

					if(!empty($page_stream)){
						$stream_id=decode_data($page_stream);
					}else{
						$stream_id='0';
					}

					if(!empty($page_course)){
						$course_id=$page_course;
					}else{
						$course_id='0';
					}
					

					$country_data=$this->com->get_country(array('country_id'=>$country_id));

					$country_code=strtolower($country_data->country_iso_code_2);

					if($page_type=='universities' || $page_type=='colleges'){
						$type_url_base=base_url().$country_code.'/'.$page_type;
					}else{
						$type_url_base=base_url().'/'.$page_type;
					}
					
					$year=date('Y');

					if($state_id>0 && $city_id==0 && $stream_id==0 && $course_id==0){// state

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).' - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).' by Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords($state_data->state_name)=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

							$type_base_url_data=array(
								'url_type'=>'state',
								'url_sub_type'=>'college_static_urls',
								'url_type_id'=>$state_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$total_colleges,
								'url_meta_heading'=>$url_meta_title,
								'url_meta_title'=>$url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
								'url_meta_desc'=>$url_meta_desc,
								'url_og_title'=>$url_meta_title,
								'url_og_desc'=>$url_meta_desc,
								'url_page_heading'=>$url_page_heading,
								'url_value'=>$type_url,
								'url_breadcrumb'=>json_encode($breadcumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);				

							if(empty($get_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($type_base_url_data,array('url_value'=>$type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}
						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id==0){// state city

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$city_data=$this->com->get_city(array('city_id'=>$city_id));
						$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

						if(!empty($city_slug)){
							$city_slug_value=$city_slug->slug_value;
						}else{						
							$city_url_slug=url_slug($city_data->city_name);
							$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
							$city_slug_value=$city_url_slug;
						}

						$city_type_url=$type_url.'/'.$city_slug_value;


						if($page_type=='colleges'){

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

							if(empty($get_type_base_url)){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords($state_data->state_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));						

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

							$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' BASED ON '.$year.' RANKING';
							$city_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).' - '.$year.' Rankings, Fees, Placements';
							$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.strtoupper($city_data->city_name).' by Fees, Ranking, Admission and Placement.';

							$city_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								'Colleges in '.ucwords($city_data->city_name)=>''
							);

							$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));						

							$city_type_base_url_data=array(
								'url_type'=>'city',
								'url_sub_type'=>'college_static_urls',
								'url_type_id'=>$city_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$city_total_colleges,
								'url_meta_heading'=>$city_url_meta_title,
								'url_meta_title'=>$city_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
								'url_meta_desc'=>$city_url_meta_desc,
								'url_og_title'=>$city_url_meta_title,
								'url_og_desc'=>$city_url_meta_desc,
								'url_page_heading'=>$city_url_page_heading,
								'url_value'=>$city_type_url,
								'url_breadcrumb'=>json_encode($city_breadcumb),
								'url_priority'=>'0.7',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_city_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($city_type_base_url_data);
								if($url_added){
									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($city_type_base_url_data,array('url_value'=>$city_type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}

						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}



					}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id==0){// state stream

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' offering '.strtoupper($stream_data->stream_name).' courses BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).' by '.ucwords($stream_data->stream_name).' Courses, Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords($state_data->state_name)=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

							if(empty($get_type_base_url)){						

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.strtoupper($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.strtoupper($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($state_stream_type_base_url_data);
								if($url_added){
									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($state_stream_type_base_url_data,array('url_value'=>$stream_type_url));
								$url_id=$base_url_added;
								if($url_id){
									$return['success']='URL updated';
								}else{
									$return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}else if($state_id>0 && $city_id==0 && $stream_id>0 && $course_id>0){// state stream course
						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){
							$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

							$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' offering '.strtoupper($stream_data->stream_name).' courses BASED ON '.$year.' RANKING';
							$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
							$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).' by '.ucwords($stream_data->stream_name).' Courses, Fees, Ranking, Admission and Placement.';

							$breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								'Colleges in '.ucwords($state_data->state_name)=>''
							);

							$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

							if(empty($get_type_base_url)){						

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.strtoupper($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.strtoupper($state_data->state_name).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){
								$this->sm->store_slug_urls($state_stream_type_base_url_data);
							}


							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

							$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
							$course_url_meta_title='Top Colleges in '.ucwords($state_data->state_name).' offering '.ucwords($course_data->course_name).' in '.ucwords($stream_data->stream_name).' stream - '.$year.' Rankings, Fees, Placements';
							$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.strtoupper($stream_data->stream_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' by '.ucwords($course_data->course_name).' in '.ucwords($stream_data->stream_name).' stream Fees, Ranking, Admission and Placement.';

							$d=array(
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								ucwords($stream_data->stream_name)=>$stream_type_url,
								'Colleges offering '.ucwords($course_data->course_name)=>''
							);


							$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

							$course_type_base_url_data=array(
								'url_type'=>'course',
								'url_type_id'=>$course_id,
								'url_sub_type'=>'college_static_url_course',
								'url_sub_type_id'=>$course_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$course_total_colleges,
								'url_meta_heading'=>$course_url_meta_title,
								'url_meta_title'=>$course_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
								'url_meta_desc'=>$course_url_meta_desc,
								'url_og_title'=>$course_url_meta_title,
								'url_og_desc'=>$course_url_meta_desc,
								'url_page_heading'=>$course_url_page_heading,
								'url_value'=>$course_type_url,
								'url_breadcrumb'=>json_encode($d),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);


							if(empty($get_course_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}
					else if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id==0){// state city stream

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords($state_data->state_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									ucwords($state_data->state_name)=>$type_url,
									'Colleges in '.ucwords($city_data->city_name)=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$city_type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

							$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
							$state_stream_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
							$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.strtoupper($city_data->city_name).' by '.ucwords($stream_data->stream_name).' Courses, Fees, Ranking, Admission and Placement.';

							$state_stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								ucwords($city_data->city_name)=>$city_type_url,
								'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
							);

							$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

							$state_stream_type_base_url_data=array(
								'url_type'=>'stream',
								'url_type_id'=>$stream_id,
								'url_sub_type'=>'college_static_url_stream',
								'url_sub_type_id'=>$stream_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$stream_total_colleges,
								'url_meta_heading'=>$state_stream_url_meta_title,
								'url_meta_title'=>$state_stream_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
								'url_meta_desc'=>$state_stream_url_meta_desc,
								'url_og_title'=>$state_stream_url_meta_title,
								'url_og_desc'=>$state_stream_url_meta_desc,
								'url_page_heading'=>$state_stream_url_page_heading,
								'url_value'=>$stream_type_url,
								'url_breadcrumb'=>json_encode($state_stream_breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);

							if(empty($get_stream_type_base_url)){								

								$url_added=$this->sm->store_slug_urls($state_stream_type_base_url_data);
								if($url_added){
									$return['success']='URL generated';
								}else{
									$return['error']='URL not generated';
								}
							}else{
								$base_url_added=$this->sm->update_slug_urls($city_type_base_url_data,array('url_value'=>$stream_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}



						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}
					}else if($state_id>0 && $city_id>0 && $stream_id>0 && $course_id>0){// state city stream course

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords($state_data->state_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									ucwords($state_data->state_name)=>$type_url,
									'Colleges in '.ucwords($city_data->city_name)=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}


							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$stream_url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$stream_url_slug));
								$stream_slug_value=$stream_url_slug;
							}

							$stream_type_url=$city_type_url.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if(empty($get_stream_type_base_url)){
								$stream_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$state_stream_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$state_stream_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
								$state_stream_url_meta_desc='Top '.$stream_total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

								$state_stream_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									ucwords($state_data->state_name)=>$type_url,
									ucwords($city_data->city_name)=>$city_type_url,
									'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
								);

								$state_stream_url_meta_key_words=generateKeywordsFromText(strtolower($state_stream_url_page_heading.'.'.$state_stream_url_meta_title.'.'.$state_stream_url_meta_desc));

								$state_stream_type_base_url_data=array(
									'url_type'=>'stream',
									'url_type_id'=>$stream_id,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$stream_total_colleges,
									'url_meta_heading'=>$state_stream_url_meta_title,
									'url_meta_title'=>$state_stream_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $state_stream_url_meta_key_words)),
									'url_meta_desc'=>$state_stream_url_meta_desc,
									'url_og_title'=>$state_stream_url_meta_title,
									'url_og_desc'=>$state_stream_url_meta_desc,
									'url_page_heading'=>$state_stream_url_page_heading,
									'url_value'=>$stream_type_url,
									'url_breadcrumb'=>json_encode($state_stream_breadcumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($state_stream_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

							$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
							$course_url_meta_title='Top Colleges in '.ucwords($city_data->city_name).' offering '.ucwords($course_data->course_name).' in '.ucwords($stream_data->stream_name).' stream - '.$year.' Rankings, Fees, Placements';
							$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' by '.ucwords($course_data->course_name).' in '.ucwords($stream_data->stream_name).' stream Fees, Ranking, Admission and Placement.';

							$d=array(
								ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
								ucwords($state_data->state_name)=>$type_url,
								ucwords($city_data->city_name)=>$city_type_url,
								ucwords($stream_data->stream_name)=>$stream_type_url,
								'Colleges offering '.ucwords($course_data->course_name)=>''
							);


							$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

							$course_type_base_url_data=array(
								'url_type'=>'course',
								'url_type_id'=>$course_id,
								'url_sub_type'=>'college_static_url_course',
								'url_sub_type_id'=>$course_id,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_total_colleges'=>$course_total_colleges,
								'url_meta_heading'=>$course_url_meta_title,
								'url_meta_title'=>$course_url_meta_title,
								'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
								'url_meta_desc'=>$course_url_meta_desc,
								'url_og_title'=>$course_url_meta_title,
								'url_og_desc'=>$course_url_meta_desc,
								'url_page_heading'=>$course_url_page_heading,
								'url_value'=>$course_type_url,
								'url_breadcrumb'=>json_encode($d),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'yearly',
								'url_last_update'=>date('Y-m-d H:i:s')
							);


							if(empty($get_course_type_base_url)){

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}else if($state_id>0 && $city_id>0 && $stream_id==0 && $course_id>0){//state city course

						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_id));
						if(!empty($state_slug)){
							$slug_value=$state_slug->slug_value;
						}else{						
							$url_slug=url_slug($state_data->state_name);
							$this->sm->store_slug(array('slug_type'=>'1','slug_type_id'=>$state_id,'slug_value'=>$url_slug));
							$slug_value=$url_slug;
						}

						$type_url=$type_url_base.'/'.$slug_value;

						$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url));

						if($page_type=='colleges'){

							if(empty($get_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges in '.ucwords($state_data->state_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$type_base_url_data=array(
									'url_type'=>'state',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$state_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($type_base_url_data);
							}

							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));

							if(!empty($city_slug)){
								$city_slug_value=$city_slug->slug_value;
							}else{						
								$city_url_slug=url_slug($city_data->city_name);
								$this->sm->store_slug(array('slug_type'=>'2','slug_type_id'=>$city_id,'slug_value'=>$city_url_slug));
								$city_slug_value=$city_url_slug;
							}

							$city_type_url=$type_url.'/'.$city_slug_value;

							$get_city_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$city_type_url));

							if(empty($get_city_type_base_url)){

								$city_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));

								$city_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$city_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
								$city_url_meta_desc='Top '.$total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.ucwords($state_data->state_name).','.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$city_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									ucwords($state_data->state_name)=>$type_url,
									'Colleges in '.ucwords($city_data->city_name)=>''
								);

								$city_url_meta_key_words=generateKeywordsFromText(strtolower($city_url_page_heading.'.'.$city_url_meta_title.'.'.$city_url_meta_desc));				
								$city_type_base_url_data=array(
									'url_type'=>'city',
									'url_sub_type'=>'college_static_urls',
									'url_type_id'=>$city_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$city_total_colleges,
									'url_meta_heading'=>$city_url_meta_title,
									'url_meta_title'=>$city_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $city_url_meta_key_words)),
									'url_meta_desc'=>$city_url_meta_desc,
									'url_og_title'=>$city_url_meta_title,
									'url_og_desc'=>$city_url_meta_desc,
									'url_page_heading'=>$city_url_page_heading,
									'url_value'=>$city_type_url,
									'url_breadcrumb'=>json_encode($city_breadcumb),
									'url_priority'=>'0.7',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($city_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$city_type_url.'/'.$course_slug_value;							

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							$course_total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

								$course_url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
								$course_url_meta_title='Top Colleges in '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' - '.$year.' Rankings, Fees, Placements';
								$course_url_meta_desc='Top '.$course_total_colleges.' Colleges in '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.ucwords($country_data->country_name).' by '.ucwords($course_data->course_name).' Courses, Fees, Ranking, Admission and Placement.';

								$d=array(
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									ucwords($state_data->state_name)=>$type_url,
									ucwords($city_data->city_name)=>$city_type_url,
									'Colleges offering '.ucwords($course_data->course_name)=>''
								);



								$course_url_meta_key_words=generateKeywordsFromText(strtolower($course_url_page_heading.'.'.$course_url_meta_title.'.'.$course_url_meta_desc));

								//print_obj($course_url_meta_key_words);

								$course_type_base_url_data=array(
									'url_type'=>'course',
									'url_type_id'=>$course_id,
									'url_sub_type'=>'college_static_url_course',
									'url_sub_type_id'=>$course_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_total_colleges'=>$course_total_colleges,
									'url_meta_heading'=>$course_url_meta_title,
									'url_meta_title'=>$course_url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $course_url_meta_key_words)),
									'url_meta_desc'=>$course_url_meta_desc,
									'url_og_title'=>$course_url_meta_title,
									'url_og_desc'=>$course_url_meta_desc,
									'url_page_heading'=>$course_url_page_heading,
									'url_value'=>$course_type_url,
									'url_breadcrumb'=>json_encode($d),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);


							if(empty($get_course_type_base_url)){

								

								//print_obj($course_type_base_url_data);

								$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
								$url_id=$base_url_added;

								if($url_id){
									$return['success']='URL generated';
								}else{
									$return['error']='Error occurred.';
								}

							}else{
								$base_url_added=$this->sm->update_slug_urls($course_type_base_url_data,array('url_value'=>$course_type_url));
								$url_id=$base_url_added;
								if($url_id){
								    $return['success']='URL updated';
								}else{
								    $return['error']='Error occurred.';
								}
							}


						}else if($page_type=='universities'){
							$return['error']='No university data can be proccessed now';
						}

					}
					else{
						if($stream_id>0 && $course_id=='0'){//only stream
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$url_slug));
								$stream_slug_value=$url_slug;
							}

							$stream_type_url=$type_url_base.'/'.$stream_slug_value;

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if($page_type=='colleges'){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

								if(empty($get_type_base_url)){						

									$stream_type_base_url_data=array(
										'url_type'=>'stream',
										'url_type_id'=>$stream_id,
										'url_sub_type'=>'college_static_url_stream',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$stream_type_url,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.8',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($stream_type_base_url_data);
									$url_id=$base_url_added;
									if($url_id){
										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}
								
							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}

						}else if($stream_id=='0' && $course_id>0){
							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$url_slug));
								$course_slug_value=$url_slug;
							}

							$course_type_url=$type_url_base.'/'.$course_slug_value;

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							if($page_type=='colleges'){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges offering '.ucwords($course_data->course_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								if(empty($get_type_base_url)){						

									$course_type_base_url_data=array(
										'url_type'=>'course',
										'url_type_id'=>$course_id,
										'url_sub_type'=>'college_static_url_course',
										'url_sub_type_id'=>$course_id,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$course_type_url,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.8',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
									$url_id=$base_url_added;

									if($url_id){
										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}
								
							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}


						}else if($stream_id>0 && $course_id>0){
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));

							if(!empty($stream_slug)){
								$stream_slug_value=$stream_slug->slug_value;
							}else{						
								$url_slug=url_slug($stream_data->stream_name);
								$this->sm->store_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id,'slug_value'=>$url_slug));
								$stream_slug_value=$url_slug;
							}

							$stream_type_url=$type_url_base.'/'.$stream_slug_value;

							$get_stream_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$stream_type_url));

							if(empty($get_stream_type_base_url)){
								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($stream_data->stream_name).' COURSES BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($stream_data->stream_name).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
									'Colleges offering courses in '.ucwords($stream_data->stream_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));

								$stream_type_base_url_data=array(
									'url_type'=>'stream',
									'url_type_id'=>$stream_id,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>'0',
									'url_total_colleges'=>$total_colleges,
									'url_meta_heading'=>$url_meta_title,
									'url_meta_title'=>$url_meta_title,
									'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
									'url_meta_desc'=>$url_meta_desc,
									'url_og_title'=>$url_meta_title,
									'url_og_desc'=>$url_meta_desc,
									'url_page_heading'=>$url_page_heading,
									'url_value'=>$stream_type_url,
									'url_breadcrumb'=>json_encode($breadcumb),
									'url_priority'=>'0.8',
									'url_data_change_freq'=>'yearly',
									'url_last_update'=>date('Y-m-d H:i:s')
								);

								$this->sm->store_slug_urls($stream_type_base_url_data);
							}

							$course_data=$this->strm->get_course(array('course_id'=>$course_id));
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

							if(!empty($course_slug)){
								$course_slug_value=$course_slug->slug_value;
							}else{						
								$course_url_slug=url_slug($course_data->course_name);
								$this->sm->store_slug(array('slug_type'=>'5','slug_type_id'=>$course_id,'slug_value'=>$course_url_slug));
								$course_slug_value=$course_url_slug;
							}

							$course_type_url=$stream_type_url.'/'.$course_slug_value;

							$get_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$course_type_url));

							if($page_type=='colleges'){

								if(empty($get_course_type_base_url)){

									$ctotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

									$curl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
									$curl_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' - '.$year.' Rankings, Fees, Placements';
									$curl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' by Fees, Ranking, Admission and Placement.';

									$cbreadcumb=array(
										'Home'=>base_url(),
										ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
										ucwords($stream_data->stream_name)=>$stream_type_url,
										'Colleges offering '.ucwords($course_data->course_name)=>''
									);

									$curl_meta_key_words=generateKeywordsFromText(strtolower($curl_page_heading.'.'.$curl_meta_title.'.'.$curl_meta_desc));

									if(empty($get_type_base_url)){						

										$course_type_base_url_data=array(
											'url_type'=>'course',
											'url_type_id'=>$course_id,
											'url_sub_type'=>'college_static_url_course',
											'url_sub_type_id'=>$course_id,
											'url_country'=>$country_id,
											'url_state'=>'0',
											'url_total_colleges'=>$ctotal_colleges,
											'url_meta_heading'=>$curl_meta_title,
											'url_meta_title'=>$curl_meta_title,
											'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $curl_meta_key_words)),
											'url_meta_desc'=>$curl_meta_desc,
											'url_og_title'=>$curl_meta_title,
											'url_og_desc'=>$curl_meta_desc,
											'url_page_heading'=>$curl_page_heading,
											'url_value'=>$course_type_url,
											'url_breadcrumb'=>json_encode($cbreadcumb),
											'url_priority'=>'0.8',
											'url_data_change_freq'=>'yearly',
											'url_last_update'=>date('Y-m-d H:i:s')
										);

										$base_url_added=$this->sm->store_slug_urls($course_type_base_url_data);
										$url_id=$base_url_added;

										if($url_id){

											$only_course_type_url=$type_url_base.'/'.$course_slug_value;

											$get_only_course_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$only_course_type_url));

											if(empty($get_only_course_type_base_url)){

												$octotal_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,array('needle'=>$course_id,'haystack'=>'system_users_colleges.college_course_ids'));

												$ocurl_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' OFFERING '.strtoupper($course_data->course_name).' BASED ON '.$year.' RANKING';
												$ocurl_meta_title='Top Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' - '.$year.' Rankings, Fees, Placements';
												$ocurl_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' offering '.ucwords($course_data->course_name).' by Fees, Ranking, Admission and Placement.';

												$ocbreadcumb=array(
													'Home'=>base_url(),
													ucwords($country_data->country_name)=>base_url($country_code.'/colleges'),
													'Colleges offering '.ucwords($course_data->course_name)=>''
												);

												$ocurl_meta_key_words=generateKeywordsFromText(strtolower($ocurl_page_heading.'.'.$ocurl_meta_title.'.'.$ocurl_meta_desc));

												$ocourse_type_base_url_data=array(
													'url_type'=>'course',
													'url_type_id'=>$course_id,
													'url_sub_type'=>'college_static_url_course',
													'url_sub_type_id'=>$course_id,
													'url_country'=>$country_id,
													'url_state'=>'0',
													'url_total_colleges'=>$octotal_colleges,
													'url_meta_heading'=>$ocurl_meta_title,
													'url_meta_title'=>$ocurl_meta_title,
													'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $ocurl_meta_key_words)),
													'url_meta_desc'=>$ocurl_meta_desc,
													'url_og_title'=>$ocurl_meta_title,
													'url_og_desc'=>$ocurl_meta_desc,
													'url_page_heading'=>$ocurl_page_heading,
													'url_value'=>$only_course_type_url,
													'url_breadcrumb'=>json_encode($ocbreadcumb),
													'url_priority'=>'0.8',
													'url_data_change_freq'=>'yearly',
													'url_last_update'=>date('Y-m-d H:i:s')
												);

												$this->sm->store_slug_urls($ocourse_type_base_url_data);
											}

											$return['success']='URL generated';
										}else{
											$return['error']='Error occurred.';
										}
									}else{
										$return['error']='URL already exists';
									}

								}else{
									$return['error']='URL already generated';
								}

							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}

						}else{

							$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url_base));

							if($page_type=='colleges'){

								$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id),NULL,null);

								$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
								$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' courses - '.$year.' Rankings, Fees, Placements';
								$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' courses by Fees, Ranking, Admission and Placement.';

								$breadcumb=array(
									'Home'=>base_url(),
									'Colleges in '.ucwords($country_data->country_name)=>''
								);

								$url_meta_key_words=generateKeywordsFromText(strtolower($url_page_heading.'.'.$url_meta_title.'.'.$url_meta_desc));					

								if(empty($get_type_base_url)){						

									$type_base_url_data=array(
										'url_type'=>'main',
										'url_type_id'=>0,
										'url_sub_type'=>'college_static_url_main',
										'url_sub_type_id'=>0,
										'url_country'=>$country_id,
										'url_state'=>'0',
										'url_total_colleges'=>$total_colleges,
										'url_meta_heading'=>$url_meta_title,
										'url_meta_title'=>$url_meta_title,
										'url_meta_key_words'=>str_replace(' ', '', str_replace(', 0','', $url_meta_key_words)),
										'url_meta_desc'=>$url_meta_desc,
										'url_og_title'=>$url_meta_title,
										'url_og_desc'=>$url_meta_desc,
										'url_page_heading'=>$url_page_heading,
										'url_value'=>$type_url_base,
										'url_breadcrumb'=>json_encode($breadcumb),
										'url_priority'=>'0.7',
										'url_data_change_freq'=>'yearly',
										'url_last_update'=>date('Y-m-d H:i:s')
									);

									$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
									$url_id=$base_url_added;
									if($url_id){
										$return['success']='URL generated';
									}else{
										$return['error']='Error occurred.';
									}
								}else{
									$return['error']='URL already exists';
								}

							}else if($page_type=='universities'){
								$return['error']='No university data can be proccessed now';
							}
						}
					}
				}else{
					$return['error']='Select country';
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

	public function onGenerateTypeUrls_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$page_country=post_data('page_country');
				$page_state=post_data('page_state');
				$page_city=post_data('page_city');
				$page_type=post_data('page_type');
				$page_stream=post_data('page_stream');
				$page_course=post_data('page_course');

				$country_id=decode_data($page_country);

				if(!empty($page_state)){
					$state_id=decode_data($page_state);
				}else{
					$state_id='0';
				}				

				if(!empty($page_city)){
					$city_id=decode_data($page_city);
				}else{
					$city_id='0';
				}

				if(!empty($page_stream)){
					$stream_id=decode_data($page_stream);
				}else{
					$stream_id='0';
				}

				if(!empty($page_course)){
					$course_id=$page_course;
				}else{
					$course_id='0';
				}
				

				$country_data=$this->com->get_country(array('country_id'=>$country_id));

				$country_code=strtolower($country_data->country_iso_code_2);
				$type_url_base=base_url().$country_code.'/colleges';
				$year=date('Y');


				$get_type_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_url_base));

				$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id));

				$url_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
				$url_meta_title='Top Colleges in '.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
				$url_meta_desc='Top '.$total_colleges.' Colleges in '.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

				$url_meta_key_words=generateKeywordsFromText($url_page_heading.' '.$url_meta_title.' '.$url_meta_desc);

				$breadcumb=array(
					'Home'=>base_url(),
					ucwords($country_data->country_name).' Colleges'=>''
				);

				if(empty($get_type_base_url)){
					$type_base_url_data=array(
						'url_glob_type'=>$page_type,
						'url_country'=>$country_id,
						'url_meta_heading'=>$url_meta_title,
						'url_meta_title'=>$url_meta_title,
						'url_meta_key_words'=>$url_meta_key_words,
						'url_meta_desc'=>$url_meta_desc,
						'url_og_title'=>$url_meta_title,
						'url_og_desc'=>$url_meta_desc,
						'url_page_heading'=>$url_page_heading,
						'url_value'=>$type_url_base,
						'url_breadcrumb'=>json_encode($breadcumb)
					);
					$base_url_added=$this->sm->store_slug_urls($type_base_url_data);
					$url_id=$base_url_added;
				}else{
					if($get_type_base_url->url_meta_key_words!=NULL){
						$type_base_url_data=array(
							'url_glob_type'=>$page_type,
							'url_country'=>$country_id,
							'url_meta_heading'=>$url_meta_title,
							'url_meta_title'=>$url_meta_title,
							'url_meta_desc'=>$url_meta_desc,
							'url_og_title'=>$url_meta_title,
							'url_og_desc'=>$url_meta_desc,
							'url_page_heading'=>$url_page_heading,
							'url_value'=>$type_url_base,
							'url_breadcrumb'=>json_encode($breadcumb)
						);
					}else{
						$type_base_url_data=array(
							'url_glob_type'=>$page_type,
							'url_country'=>$country_id,
							'url_meta_heading'=>$url_meta_title,
							'url_meta_title'=>$url_meta_title,
							'url_meta_key_words'=>$url_meta_key_words,
							'url_meta_desc'=>$url_meta_desc,
							'url_og_title'=>$url_meta_title,
							'url_og_desc'=>$url_meta_desc,
							'url_page_heading'=>$url_page_heading,
							'url_value'=>$type_url_base,
							'url_breadcrumb'=>json_encode($breadcumb)
						);
					}
					$base_url_added=$this->sm->update_slug_urls($type_base_url_data,array('url_id'=>$get_type_base_url->url_id));
					$url_id=$get_type_base_url->url_id;
				}

				//print_obj($type_base_url_data);die;

				if($url_id){

					if($state_id!='0'){
						$state_data=$this->com->get_state(array('state_id'=>$state_id));
						$type_state_base_url=$type_url_base.'/'.url_slug($state_data->state_name);

						$get_type_state_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_state_base_url));
						$url_state_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
						$url_state_meta_title='Top Colleges In '.ucwords($state_data->state_name).' - '.$year.' Rankings, Fees, Placements';
						$url_state_meta_desc='Top 17986 Colleges In '.ucwords($state_data->state_name).' by Fees, Ranking, Admission and Placement.';

						$url_state_meta_key_words=generateKeywordsFromText($url_state_page_heading.' '.$url_state_meta_title.' '.$url_state_meta_desc);

						$state_breadcumb=array(
							'Home'=>base_url(),
							ucwords($country_data->country_name)=>$type_url_base,
							ucwords($state_data->state_name).' Colleges'=>''
						);

						if(empty($get_type_state_base_url)){
							$type_state_base_url_data=array(
								'url_glob_type'=>$page_type,
								'url_country'=>$country_id,
								'url_state'=>$state_id,
								'url_meta_heading'=>$url_state_meta_title,
								'url_meta_title'=>$url_state_meta_title,
								'url_meta_key_words'=>$url_state_meta_key_words,
								'url_meta_desc'=>$url_state_meta_desc,
								'url_og_title'=>$url_state_meta_title,
								'url_og_desc'=>$url_state_meta_desc,
								'url_page_heading'=>$url_state_page_heading,
								'url_value'=>$type_state_base_url,
								'url_breadcrumb'=>json_encode($state_breadcumb)
							);
							$state_base_url_added=$this->sm->store_slug_urls($type_state_base_url_data);
							$state_url_id=$state_base_url_added;
						}else{
							if($get_type_state_base_url->url_meta_key_words!=NULL){
								$type_state_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_meta_heading'=>$url_state_meta_title,
									'url_meta_title'=>$url_state_meta_title,
									'url_meta_desc'=>$url_state_meta_desc,
									'url_og_title'=>$url_state_meta_title,
									'url_og_desc'=>$url_state_meta_desc,
									'url_page_heading'=>$url_state_page_heading,
									'url_value'=>$type_state_base_url,
									'url_breadcrumb'=>json_encode($state_breadcumb)
								);
							}else{
								$type_state_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_meta_heading'=>$url_state_meta_title,
									'url_meta_title'=>$url_state_meta_title,
									'url_meta_key_words'=>$url_state_meta_key_words,
									'url_meta_desc'=>$url_state_meta_desc,
									'url_og_title'=>$url_state_meta_title,
									'url_og_desc'=>$url_state_meta_desc,
									'url_page_heading'=>$url_state_page_heading,
									'url_value'=>$type_state_base_url,
									'url_breadcrumb'=>json_encode($state_breadcumb)
								);
							}
							$state_base_url_added=$this->sm->update_slug_urls($type_state_base_url_data,array('url_id'=>$get_type_state_base_url->url_id));
							$url_id=$get_type_state_base_url->url_id;
						}

						//City

						if($city_id!='0'){
							$city_data=$this->com->get_city(array('city_id'=>$city_id));
							$type_city_base_url=$type_state_base_url.'/'.url_slug($city_data->city_name);

							$get_type_city_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_city_base_url));

							$url_city_page_heading='LIST OF TOP COLLEGES IN '.strtoupper($city_data->city_name).' BASED ON '.$year.' RANKING';
							$url_city_meta_title='Top Colleges In '.ucwords($city_data->city_name).' - '.$year.' Rankings, Fees, Placements';
							$url_city_meta_desc='Top 17986 Colleges In '.ucwords($city_data->city_name).' by Fees, Ranking, Admission and Placement.';

							$url_city_meta_key_words=generateKeywordsFromText($url_city_page_heading.' '.$url_city_meta_title.' '.$url_city_meta_desc);

							$city_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>$type_url_base,
								ucwords($state_data->state_name)=>$type_state_base_url,
								ucwords($city_data->city_name).' Colleges'=>''
							);

							if(empty($get_type_city_base_url)){
								$type_city_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_city'=>$city_id,
									'url_meta_heading'=>$url_city_meta_title,
									'url_meta_title'=>$url_city_meta_title,
									'url_meta_key_words'=>$url_city_meta_key_words,
									'url_meta_desc'=>$url_city_meta_desc,
									'url_og_title'=>$url_city_meta_title,
									'url_og_desc'=>$url_city_meta_desc,
									'url_page_heading'=>$url_city_page_heading,
									'url_value'=>$type_city_base_url,
									'url_breadcrumb'=>json_encode($city_breadcumb)
								);
								$city_base_url_added=$this->sm->store_slug_urls($type_city_base_url_data);
								$city_url_id=$city_base_url_added;
							}else{
								if($get_type_city_base_url->url_meta_key_words!=NULL){
									$type_city_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_city'=>$city_id,
										'url_meta_heading'=>$url_city_meta_title,
										'url_meta_title'=>$url_city_meta_title,
										'url_meta_desc'=>$url_city_meta_desc,
										'url_og_title'=>$url_city_meta_title,
										'url_og_desc'=>$url_city_meta_desc,
										'url_page_heading'=>$url_city_page_heading,
										'url_value'=>$type_city_base_url,
										'url_breadcrumb'=>json_encode($state_breadcumb)
									);
								}else{
									$type_city_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_city'=>$city_id,
										'url_meta_heading'=>$url_city_meta_title,
										'url_meta_title'=>$url_city_meta_title,
										'url_meta_key_words'=>$url_city_meta_key_words,
										'url_meta_desc'=>$url_city_meta_desc,
										'url_og_title'=>$url_city_meta_title,
										'url_og_desc'=>$url_city_meta_desc,
										'url_page_heading'=>$url_city_page_heading,
										'url_value'=>$type_city_base_url,
										'url_breadcrumb'=>json_encode($state_breadcumb)
									);
								}
								$city_base_url_added=$this->sm->update_slug_urls($type_city_base_url_data,array('url_id'=>$get_type_city_base_url->url_id));
								$city_url_id=$get_type_city_base_url->url_id;
							}
						}


						//Streams
						
						if($stream_id!='0'){
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

							//print_obj($stream_slug);die;

							$type_stream_base_url=$type_state_base_url.'/'.url_slug($stream_data->stream_name);

							$total_colleges_stream_wise=$this->im->get_total_insts_course_wise(array('user_course_stream'=>$stream_id));

							if($city_id!='0'){
								$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_id));
								$city_data=$this->com->get_city(array('city_id'=>$city_id));
								$type_city_base_url=$type_state_base_url.'/'.$city_slug->slug_value;
								$type_stream_city_base_url=$type_city_base_url.'/'.url_slug($stream_data->stream_name);

								$get_type_stream_city_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_city_base_url));
								$url_stream_city_page_heading='LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
								$url_stream_city_meta_title='Top '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($city_data->city_name).','.ucwords($state_data->state_name).' - '.$year.' Rankings, Fees, Placements';
								$url_stream_city_meta_desc='Top '.$total_colleges_stream_wise.' '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($city_data->city_name).','.ucwords($state_data->state_name).' by Fees, Ranking, Admission and Placement.';
								$url_stream_city_meta_key_words=generateKeywordsFromText($url_stream_city_page_heading.' '.$url_stream_city_meta_title.' '.$url_stream_city_meta_desc);

								$stream_city_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>$type_url_base,
									ucwords($state_data->state_name)=>$type_state_base_url,
									ucwords($city_data->city_name)=>$type_state_base_url.'/'.$city_slug->slug_value,
									ucwords($stream_data->stream_name).' Colleges'=>''
								);

								//print_obj($stream_city_breadcumb);

								$type_stream_city_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_sub_type'=>'college_static_url_stream_city',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_city'=>$city_id,
									'url_meta_heading'=>$url_stream_city_meta_title,
									'url_meta_title'=>$url_stream_city_meta_title,
									'url_meta_key_words'=>$url_stream_city_meta_key_words,
									'url_meta_desc'=>$url_stream_city_meta_desc,
									'url_og_title'=>$url_stream_city_meta_title,
									'url_og_desc'=>$url_stream_city_meta_desc,
									'url_page_heading'=>$url_stream_city_page_heading,
									'url_value'=>$type_stream_city_base_url,
									'url_breadcrumb'=>json_encode($stream_city_breadcumb)
								);

								if(empty($get_type_stream_city_base_url)){
									$stream_city_base_url_added=$this->sm->store_slug_urls($type_stream_city_base_url_data);
									$stream_city_url_id=$stream_city_base_url_added;
								}else{
									$stream_city_base_url_added=$this->sm->update_slug_urls($type_stream_city_base_url_data,array('url_id'=>$get_type_stream_base_url->url_id));
									$stream_city_url_id=$get_type_stream_city_base_url->url_id;
								}

								if($course_id!='0'){
									$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));
									$course_data=$this->strm->get_course(array('course_id'=>$course_id));
									$type_course_base_url=$type_state_base_url.'/'.$city_slug->slug_value.'/'.$stream_slug->slug_value;
									$type_stream_course_base_url=$type_course_base_url.'/'.$course_slug->slug_value;
									$type_only_course_base_url=$type_state_base_url.'/'.$city_slug->slug_value;
									$type_stream_only_course_base_url=$type_only_course_base_url.'/'.$course_slug->slug_value;

									$total_colleges_course_wise=$this->im->get_total_insts_course_wise(array('user_course'=>$course_id,'user_course_stream'=>$stream_id));

									//print_obj($course_data);die;

									$get_type_stream_course_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_course_base_url));

									$get_type_stream_only_course_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_only_course_base_url));

									$url_stream_course_page_heading='LIST OF TOP '.strtoupper($course_data->course_short_name).' COLLEGES IN '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';

									$url_stream_course_meta_title='Top '.ucwords($course_data->course_name).' Colleges in '.ucwords($city_data->city_name).','.ucwords($state_data->state_name).' - '.$year.' Rankings, Fees, Placements';

									$url_stream_course_meta_desc='Top '.$total_colleges_course_wise.' '.ucwords($course_data->course_name).' Colleges In '.ucwords($city_data->city_name).','.ucwords($state_data->state_name).' by Fees, Ranking, Admission and Placement.';

									$url_stream_course_meta_key_words=generateKeywordsFromText($url_stream_course_page_heading.' '.$url_stream_course_meta_title.' '.$url_stream_course_meta_desc);

									$stream_course_breadcumb=array(
										'Home'=>base_url(),
										ucwords($country_data->country_name)=>$type_url_base,
										ucwords($state_data->state_name)=>$type_state_base_url,
										ucwords($city_data->city_name)=>$type_city_base_url,
										ucwords($stream_data->stream_name)=>$type_city_base_url.'/'.$stream_slug->slug_value,
										ucwords($course_data->course_short_name).' Colleges'=>''
									);

									$stream_only_course_breadcumb=array(
										'Home'=>base_url(),
										ucwords($country_data->country_name)=>$type_url_base,
										ucwords($state_data->state_name)=>$type_state_base_url,
										ucwords($city_data->city_name)=>$type_city_base_url,
										ucwords($course_data->course_short_name).' Colleges'=>''
									);

									$type_stream_course_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_sub_type'=>'college_static_url_stream_city',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_city'=>$city_id,
										'url_meta_heading'=>$url_stream_course_page_heading,
										'url_meta_title'=>$url_stream_course_meta_title,
										'url_meta_key_words'=>$url_stream_course_meta_key_words,
										'url_meta_desc'=>$url_stream_course_meta_desc,
										'url_og_title'=>$url_stream_course_meta_title,
										'url_og_desc'=>$url_stream_course_meta_desc,
										'url_page_heading'=>$url_stream_course_page_heading,
										'url_value'=>$type_stream_course_base_url,
										'url_breadcrumb'=>json_encode($stream_course_breadcumb)
									);


									$type_stream_only_course_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_sub_type'=>'college_static_url_course_city',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_city'=>$city_id,
										'url_meta_heading'=>$url_stream_course_page_heading,
										'url_meta_title'=>$url_stream_course_meta_title,
										'url_meta_key_words'=>$url_stream_course_meta_key_words,
										'url_meta_desc'=>$url_stream_course_meta_desc,
										'url_og_title'=>$url_stream_course_meta_title,
										'url_og_desc'=>$url_stream_course_meta_desc,
										'url_page_heading'=>$url_stream_course_page_heading,
										'url_value'=>$type_stream_only_course_base_url,
										'url_breadcrumb'=>json_encode($stream_only_course_breadcumb)
									);


									//print_obj($type_stream_course_base_url_data);die;

									if(empty($get_type_stream_course_base_url)){
										$stream_course_base_url_added=$this->sm->store_slug_urls($type_stream_course_base_url_data);
										$stream_course_url_id=$stream_course_base_url_added;
									}else{
										$stream_course_base_url_added=$this->sm->update_slug_urls($type_stream_course_base_url_data,array('url_id'=>$get_type_stream_course_base_url->url_id));
										$stream_course_url_id=$get_type_stream_course_base_url->url_id;
									}

									if(empty($get_type_stream_only_course_base_url)){
										$stream_only_course_base_url_added=$this->sm->store_slug_urls($type_stream_only_course_base_url_data);
										$stream_only_course_url_id=$stream_only_course_base_url_added;
									}else{
										$stream_only_course_base_url_added=$this->sm->update_slug_urls($type_stream_only_course_base_url_data,array('url_id'=>$get_type_stream_only_course_base_url->url_id));
										$stream_only_course_url_id=$get_type_stream_only_course_base_url->url_id;
									}
								}
							}
									

							$get_type_stream_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_base_url));
							$url_stream_page_heading='LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.$year.' RANKING';
							$url_stream_meta_title='Top '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($state_data->state_name).' - '.$year.' Rankings, Fees, Placements';
							$url_stream_meta_desc='Top '.$total_colleges_stream_wise.' '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($state_data->state_name).' by Fees, Ranking, Admission and Placement.';
							$url_stream_meta_key_words=generateKeywordsFromText($url_stream_page_heading.' '.$url_stream_meta_title.' '.$url_stream_meta_desc);

							$stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>$type_url_base,
								ucwords($state_data->state_name)=>$type_state_base_url,
								ucwords($stream_data->stream_name).' Colleges'=>''
							);

							//print_obj($stream_breadcumb);die;

							if(empty($get_type_stream_base_url)){

								//echo 'hi';
								$type_stream_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>$state_id,
									'url_meta_heading'=>$url_stream_meta_title,
									'url_meta_title'=>$url_stream_meta_title,
									'url_meta_key_words'=>$url_stream_meta_key_words,
									'url_meta_desc'=>$url_stream_meta_desc,
									'url_og_title'=>$url_stream_meta_title,
									'url_og_desc'=>$url_stream_meta_desc,
									'url_page_heading'=>$url_stream_page_heading,
									'url_value'=>$type_stream_base_url,
									'url_breadcrumb'=>json_encode($stream_breadcumb)
								);

								//print_obj($type_state_base_url_data);die;

								$stream_base_url_added=$this->sm->store_slug_urls($type_stream_base_url_data);
								$stream_url_id=$stream_base_url_added;

								//echo $stream_url_id;die;
							}
							else{
								if($get_type_stream_base_url->url_meta_key_words!=NULL){
									$type_stream_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_sub_type'=>'college_static_url_stream',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_meta_heading'=>$url_stream_meta_title,
										'url_meta_title'=>$url_stream_meta_title,
										'url_meta_desc'=>$url_stream_meta_desc,
										'url_og_title'=>$url_stream_meta_title,
										'url_og_desc'=>$url_stream_meta_desc,
										'url_page_heading'=>$url_stream_page_heading,
										'url_value'=>$type_stream_base_url,
										'url_breadcrumb'=>json_encode($stream_breadcumb)
									);
								}else{
									$type_stream_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_country'=>$country_id,
										'url_state'=>$state_id,
										'url_city'=>$city_id,
										'url_meta_heading'=>$url_stream_meta_title,
										'url_meta_title'=>$url_stream_meta_title,
										'url_meta_key_words'=>$url_stream_meta_key_words,
										'url_meta_desc'=>$url_stream_meta_desc,
										'url_og_title'=>$url_stream_meta_title,
										'url_og_desc'=>$url_stream_meta_desc,
										'url_page_heading'=>$url_stream_page_heading,
										'url_value'=>$type_stream_base_url,
										'url_breadcrumb'=>json_encode($stream_breadcumb)
									);
								}




								$stream_base_url_added=$this->sm->update_slug_urls($type_stream_base_url_data,array('url_id'=>$get_type_stream_base_url->url_id));
								$stream_url_id=$get_type_stream_base_url->url_id;

								//print_obj($stream_base_url_added);die;
							}
						}
					}else{
						if($stream_id!='0'){
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$stream_id));
							$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

							//print_obj($stream_slug);die;

							$type_stream_base_url=base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$stream_slug->slug_value;

							//echo $type_stream_base_url;die;

							$total_colleges_stream_wise=$this->im->get_total_insts_course_wise(array('user_course_stream'=>$stream_id));

							$get_type_stream_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_base_url));
							$url_stream_page_heading='LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';
							$url_stream_meta_title='Top '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';
							$url_stream_meta_desc='Top '.$total_colleges_stream_wise.' '.ucwords($stream_data->stream_name).' Colleges in '.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';
							$url_stream_meta_key_words=generateKeywordsFromText($url_stream_page_heading.' '.$url_stream_meta_title.' '.$url_stream_meta_desc);

							$stream_breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name)=>$type_url_base,
								ucwords($stream_data->stream_name).' Colleges'=>''
							);

							//print_obj($stream_breadcumb);die;

							if(empty($get_type_stream_base_url)){

								//echo 'hi';
								$type_stream_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_sub_type'=>'college_static_url_stream',
									'url_sub_type_id'=>$stream_id,
									'url_country'=>$country_id,
									'url_state'=>null,
									'url_meta_heading'=>$url_stream_meta_title,
									'url_meta_title'=>$url_stream_meta_title,
									'url_meta_key_words'=>$url_stream_meta_key_words,
									'url_meta_desc'=>$url_stream_meta_desc,
									'url_og_title'=>$url_stream_meta_title,
									'url_og_desc'=>$url_stream_meta_desc,
									'url_page_heading'=>$url_stream_page_heading,
									'url_value'=>$type_stream_base_url,
									'url_breadcrumb'=>json_encode($stream_breadcumb)
								);

								//print_obj($type_state_base_url_data);die;

								$stream_base_url_added=$this->sm->store_slug_urls($type_stream_base_url_data);
								$stream_url_id=$stream_base_url_added;

								//echo $stream_url_id;die;
							}
							else{
								if($get_type_stream_base_url->url_meta_key_words!=NULL){
									$type_stream_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_sub_type'=>'college_static_url_stream',
										'url_sub_type_id'=>$stream_id,
										'url_country'=>$country_id,
										'url_state'=>null,
										'url_meta_heading'=>$url_stream_meta_title,
										'url_meta_title'=>$url_stream_meta_title,
										'url_meta_desc'=>$url_stream_meta_desc,
										'url_og_title'=>$url_stream_meta_title,
										'url_og_desc'=>$url_stream_meta_desc,
										'url_page_heading'=>$url_stream_page_heading,
										'url_value'=>$type_stream_base_url,
										'url_breadcrumb'=>json_encode($stream_breadcumb)
									);
								}else{
									$type_stream_base_url_data=array(
										'url_glob_type'=>$page_type,
										'url_country'=>$country_id,
										'url_state'=>null,
										'url_city'=>null,
										'url_meta_heading'=>$url_stream_meta_title,
										'url_meta_title'=>$url_stream_meta_title,
										'url_meta_key_words'=>$url_stream_meta_key_words,
										'url_meta_desc'=>$url_stream_meta_desc,
										'url_og_title'=>$url_stream_meta_title,
										'url_og_desc'=>$url_stream_meta_desc,
										'url_page_heading'=>$url_stream_page_heading,
										'url_value'=>$type_stream_base_url,
										'url_breadcrumb'=>json_encode($stream_breadcumb)
									);
								}




								$stream_base_url_added=$this->sm->update_slug_urls($type_stream_base_url_data,array('url_id'=>$get_type_stream_base_url->url_id));
								$stream_url_id=$get_type_stream_base_url->url_id;

								//print_obj($stream_base_url_added);die;
							}


							if($course_id!='0'){
								$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));
								$course_data=$this->strm->get_course(array('course_id'=>$course_id));
								$type_stream_course_base_url=$type_stream_base_url.'/'.$course_slug->slug_value;

								$type_only_course_base_url=$course_slug->slug_value;

								//print_obj($course_slug);die;

								$total_colleges_course_wise=$this->im->get_total_insts_course_wise(array('user_course'=>$course_id,'user_course_stream'=>$stream_id));

								//print_obj($course_data);die;

								$get_type_stream_course_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_stream_course_base_url));

								$get_type_only_course_base_url=$this->sm->get_slug_urls(array('url_value'=>$type_only_course_base_url));

								//print_obj($get_type_stream_course_base_url);die;

								$url_stream_course_page_heading='LIST OF TOP '.strtoupper($course_data->course_short_name).' COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.$year.' RANKING';

								$url_stream_course_meta_title='Top '.ucwords($course_data->course_name).' Colleges in '.ucwords($country_data->country_name).' - '.$year.' Rankings, Fees, Placements';

								$url_stream_course_meta_desc='Top '.$total_colleges_course_wise.' '.ucwords($course_data->course_name).' Colleges In '.ucwords($country_data->country_name).' by Fees, Ranking, Admission and Placement.';

								$url_stream_course_meta_key_words=generateKeywordsFromText($url_stream_course_page_heading.' '.$url_stream_course_meta_title.' '.$url_stream_course_meta_desc);

								$stream_course_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>$type_url_base,
									ucwords($stream_data->stream_name)=>$type_stream_base_url,
									ucwords($course_data->course_short_name).' Colleges'=>''
								);

								$only_course_breadcumb=array(
									'Home'=>base_url(),
									ucwords($country_data->country_name)=>$type_url_base,
									ucwords($course_data->course_short_name).' Colleges'=>''
								);

								$type_stream_course_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_sub_type'=>'college_static_url_stream_course',
									'url_sub_type_id'=>$course_id,
									'url_country'=>$country_id,
									'url_state'=>null,
									'url_city'=>null,
									'url_meta_heading'=>$url_stream_course_page_heading,
									'url_meta_title'=>$url_stream_course_meta_title,
									'url_meta_key_words'=>$url_stream_course_meta_key_words,
									'url_meta_desc'=>$url_stream_course_meta_desc,
									'url_og_title'=>$url_stream_course_meta_title,
									'url_og_desc'=>$url_stream_course_meta_desc,
									'url_page_heading'=>$url_stream_course_page_heading,
									'url_value'=>$type_stream_course_base_url,
									'url_breadcrumb'=>json_encode($stream_course_breadcumb)
								);


								$type_only_course_base_url_data=array(
									'url_glob_type'=>$page_type,
									'url_sub_type'=>'college_static_url_course',
									'url_sub_type_id'=>$course_id,
									'url_country'=>$country_id,
									'url_state'=>null,
									'url_city'=>null,
									'url_meta_heading'=>$url_stream_course_page_heading,
									'url_meta_title'=>$url_stream_course_meta_title,
									'url_meta_key_words'=>$url_stream_course_meta_key_words,
									'url_meta_desc'=>$url_stream_course_meta_desc,
									'url_og_title'=>$url_stream_course_meta_title,
									'url_og_desc'=>$url_stream_course_meta_desc,
									'url_page_heading'=>$url_stream_course_page_heading,
									'url_value'=>$type_only_course_base_url,
									'url_breadcrumb'=>json_encode($only_course_breadcumb)
								);


								//print_obj($type_stream_course_base_url_data);die;

								if(empty($get_type_stream_course_base_url)){
									$stream_course_base_url_added=$this->sm->store_slug_urls($type_stream_course_base_url_data);
									$stream_course_url_id=$stream_city_base_url_added;
								}else{
									$stream_course_base_url_added=$this->sm->update_slug_urls($type_stream_course_base_url_data,array('url_id'=>$get_type_stream_course_base_url->url_id));
									$stream_course_url_id=$get_type_stream_course_base_url->url_id;
								}


								if(empty($get_type_only_course_base_url)){
									$stream_course_base_url_added=$this->sm->store_slug_urls($type_only_course_base_url_data);
									$stream_course_url_id=$stream_city_base_url_added;
								}else{
									$stream_course_base_url_added=$this->sm->update_slug_urls($type_only_course_base_url_data,array('url_id'=>$get_type_stream_course_base_url->url_id));
									$stream_course_url_id=$get_type_stream_course_base_url->url_id;
								}
							}
						}
					}

					$return['success']='Url value added successfully';
				}else{
					$return['error']='Url value not generated';
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


	public function indexSitemaps(){
		if(session_userdata('isAdminLoggedin')){

			if(in_array('can_access_system_sitemaps', $this->data['permissions'])){

				$_sitemaps_data=array();

				$sitemaps_data=$this->sm->get_settings(array('settings_key'=>'config_system_sitemaps'),FALSE);

				if(!empty($sitemaps_data)){
					foreach ($sitemaps_data as $key => $value) {
						$_sitemaps_data[]=array(
							'file_name'=>$value->settings_value,
							'file_created_date'=>date('d-m-Y',strtotime($value->settings_date)),
							'file_updated_date'=>(!empty($value->settings_update_date) || $value->settings_update_date!=NULL)?date('d-m-Y',strtotime($value->settings_update_date)):''
						);
					}
				}

				$this->data['sitemaps_data']=$_sitemaps_data;


				$this->theme->title($this->data['page_title'])->load('seo/vw_sitemaps', $this->data);
			}else{
				redirect($this->data['admin_base_url']);
			}	

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onGenSiteMaps(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$site_map_type=post_data('site_map_type');

				$sitemap_xml='';

				if($site_map_type=='college'){

					$slug_urls=$this->sm->get_slug_urls(array('url_type'=>'college_static_url'),FALSE);

				}else if($site_map_type=='exam'){
					
				}else if($site_map_type=='course'){
					
				}else if($site_map_type=='news'){
					
				}else if($site_map_type=='blogs'){
					$slug_urls=$this->sm->get_slug_urls(array('url_type'=>'system_blog'),FALSE);
				}

				if(!empty($slug_urls)){

					$sitemap_xml.='<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL;
					$sitemap_xml.='<urlset'.PHP_EOL;
			      	$sitemap_xml.='xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'.PHP_EOL;
			      	$sitemap_xml.='xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'.PHP_EOL;
			      	$sitemap_xml.='xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9'.PHP_EOL;
			        $sitemap_xml.='http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'.PHP_EOL;
					$sitemap_xml.='<url>'.PHP_EOL;
					$sitemap_xml.='<loc>'.base_url().'</loc>'.PHP_EOL;
					$sitemap_xml.='<priority>1.0</priority>'.PHP_EOL;
					$sitemap_xml.='<changefreq>daily</changefreq>'.PHP_EOL;
					$sitemap_xml.='</url>'.PHP_EOL;

					foreach ($slug_urls as $key => $value) {
						$sitemap_xml.='<url>'.PHP_EOL;
						$sitemap_xml.='<loc>'.$value->url_value.'</loc>'.PHP_EOL;
						$sitemap_xml.='<priority>'.$value->url_priority.'</priority>'.PHP_EOL;
						$sitemap_xml.='<changefreq>'.$value->url_data_change_freq.'</changefreq>'.PHP_EOL;
						$sitemap_xml.='</url>'.PHP_EOL;
					}

					$sitemap_xml.='</urlset>';


					$sitemap_file="sitemap_".$site_map_type.".xml";

					//echo $sitemap_file;die;

					if(!file_exists($sitemap_file)){

					}

					$myfile = fopen(FCPATH.$sitemap_file, "wb") or die("Unable to open file!");
					fwrite($myfile, formatXmlString($sitemap_xml));
					fclose($myfile);

					$sitemaps_data=$this->sm->get_settings(array('settings_key'=>'config_system_sitemaps','settings_value'=>$sitemap_file));

					if(!empty($sitemaps_data)){
						$this->sm->update_settings(array('settings_key'=>'config_system_sitemaps','settings_value'=>$sitemap_file),array('settings_key'=>'config_system_sitemaps','settings_value'=>$sitemap_file));
					}else{
						$this->sm->store_settings(array('settings_key'=>'config_system_sitemaps','settings_value'=>$sitemap_file));
					}

					$return['success']='Sitemap Generated';//$sitemap_xml;

				}else{
					$return['error']='No data found to generate sitemap.';
				}

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

				session_write_close();
			}else{

			}
		}else{
			
		}
	}

	public function onGenSiteMapsIndex(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$sitemaps_data=$this->sm->get_settings(array('settings_key'=>'config_system_sitemaps'),FALSE);

				if(!empty($sitemaps_data)){
					$sitemap_xml.='<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL;
			        $sitemap_xml.='<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.PHP_EOL;

					foreach ($sitemaps_data as $key => $value) {
						$sitemap_xml.='<sitemap>'.PHP_EOL;
						$sitemap_xml.='<loc>'.base_url($value->settings_value).'</loc>'.PHP_EOL;
						$sitemap_xml.='<lastmod>'.date('Y-m-d').'</lastmod>'.PHP_EOL;
						$sitemap_xml.='</sitemap>'.PHP_EOL;
					}

					$sitemap_xml.='</sitemapindex>';


					$sitemap_file="sitemap.xml";

					$myfile = fopen(FCPATH.$sitemap_file, "wb") or die("Unable to open file!");
					fwrite($myfile, formatXmlString($sitemap_xml));
					fclose($myfile);

					$return['success']='Sitemap index has been created';
				}else{
					$return['error']='No sitemap found yet';
				}

			}else{

			}
		}else{

		}
	}



	/**College**/

	public function indexCollegeStructredData(){
		if(session_userdata('isAdminLoggedin')){


			$this->theme->title($this->data['page_title'])->load('seo/vw_colleges_structured_data', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onSearchCollegeStructData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('admin_id'));

				//echo $user_id;die;
				$param['column_order'] = array(
					null,
					'college_name'
				);

				$param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no','access_url');
				$param['order'] = array('college_id' => 'ASC');
				$posts=$this->input->post();

				$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);

				//print_obj($list);die;
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$meta_title='';
            	$meta_desc='';
            	$meta_key='';
            	$meta_og_title='';
            	$meta_og_desc='';

				foreach ($list as $user){
					$no++;

					$row = array();

					$slug=$this->sm->get_slug(array('slug_type_id'=>$user->user_id,'slug_type'=>'7'));


					$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user->user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

	    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
	                    $college_logo=$_college_logo->media_disk_path_relative;
	                }else{
	                    $college_logo=base_url().'uploads/app/default/no.jpg';
	                }


	                $logo='<img src="'.$college_logo.'" class="table-user-thumb" alt="">';


	                $college_name=ucwords($user->college_name);
					

					$row[]	=	$no;
					$row[]	= 	$logo.$college_name;			

					$row[]  =	'<button type="button" class="btn btn-xs btn-dark btn_edit_json_ld" data-college_name="'.$college_name.'" data-college_id="'.encode_data($user->user_id).'" data-toggle="modal" data-target="#editCollegeStructureMetaModal">Edit Structure Data</button>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_colleges($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_colleges($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddEditPageStructureData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){


				$college_id=post_data('_college');
				$menu_type=post_data('menu_type');
				$menu_link=post_data('menu_link');

				$college_page_CollegeOrUniversity=post_data('college_page_CollegeOrUniversity');
				$college_page_BreadcrumbList=post_data('college_page_BreadcrumbList');
				$college_page_Article=post_data('college_page_Article');

				$slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$menu_link));

				$college_id=decode_data($college_id);

				//'Article','CollegeOrUniversity','BreadcrumbList','ItemList'

				$CollegeOrUniversity_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$menu_link,'slug_type_json_ld'=>'CollegeOrUniversity'));

				if(empty($CollegeOrUniversity_struct_data)){

					$CollegeOrUniversity_data_to_store=array(
						'strcut_slug_url_id'=>$slug_url_data->url_id,
						'slug_type_json_ld'=>'CollegeOrUniversity',
						'slug_type_json_ld_data'=>$college_page_CollegeOrUniversity,
						'slug_url'=>$menu_link,
						'date_modified'=>date('Y-m-d H:i:s'),
						'date_published'=>date('Y-m-d H:i:s')
					);

					$this->sm->store_slug_struct_data($CollegeOrUniversity_data_to_store);
				}else{
					$this->sm->update_slug_struct_data($CollegeOrUniversity_data_to_store,array('slug_url'=>$menu_link,'slug_type_json_ld'=>'CollegeOrUniversity'));
				}


				$BreadcrumbList_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$menu_link,'slug_type_json_ld'=>'BreadcrumbList'));

				if(!empty($BreadcrumbList_struct_data)){

					$data_to_store=array(
						'strcut_slug_url_id'=>$slug_url_data->url_id,
						'slug_type_json_ld'=>'BreadcrumbList',
						'slug_type_json_ld_data'=>$college_page_BreadcrumbList,
						'slug_url'=>$menu_link,
						'date_modified'=>date('Y-m-d H:i:s'),
						'date_published'=>date('Y-m-d H:i:s')
					);

					$this->sm->store_slug_struct_data($BreadcrumbList_struct_data);
				}else{
					$this->sm->update_slug_struct_data($CollegeOrUniversity_data_to_store,array('slug_url'=>$menu_link,'slug_type_json_ld'=>'BreadcrumbList'));
				}



				$Article_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$menu_link,'slug_type_json_ld'=>'Article'));

				if(!empty($Article_struct_data)){

					$data_to_store=array(
						'strcut_slug_url_id'=>$slug_url_data->url_id,
						'slug_type_json_ld'=>'Article',
						'slug_type_json_ld_data'=>$college_page_Article,
						'slug_url'=>$menu_link,
						'date_modified'=>date('Y-m-d H:i:s'),
						'date_published'=>date('Y-m-d H:i:s')
					);

					$this->sm->store_slug_struct_data($Article_struct_data);
				}else{
					$this->sm->update_slug_struct_data($CollegeOrUniversity_data_to_store,array('slug_url'=>$menu_link,'slug_type_json_ld'=>'Article'));
				}

				$return['success']='Structure data has been updated.';

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGenerateSturectureData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=post_data('_college');
				$menu_type=post_data('menu_type');
				$menu_link=post_data('menu_link');

				$struct_type=post_data('menu_struct_type');

				$slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$menu_link));

				$college_id=decode_data($college_id);

				$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));
		        $college_type=$this->im->get_institute_types(array('inst_type'=>$college_data->college_type));

		        $country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
		        $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
		        $state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

		        $college_formatted_name=ucwords($college_data->college_name).' - ['.$college_date->college_short_name.'], '.ucwords($city_data->city_name).', '.ucwords($state_data->state_name);

		        $college_website=$college_data->college_web_address;
		        $college_email_address=$college_data->college_email;
		        $college_phone_no=$college_data->college_phone_no;
		        $college_addres=ucwords($college_data->college_address);
		        $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                    $college_logo=$_college_logo->media_disk_path_relative;
                }else{
                    $college_logo=base_url().'uploads/app/default/no.jpg';
                }


				if($struct_type==='CollegeOrUniversity'){

					$stucture_data='
					{
					  "@context": "http://schema.org/",
					  "@type": "CollegeOrUniversity",
					  "name": "'.$college_formatted_name.'",
					  "url": "'.$college_website.'",
					  "email": "'.$college_email_address.'",
					  "telephone": "'.$college_phone_no.'",
					  "logo": "'.$college_logo.'",
					  "address": {
					    "@type": "PostalAddress",
					    "streetAddress": "'.$college_addres.'"
					  }
					}';

					//print_obj($stucture_data);

					echo $stucture_data;die;

				}else if($struct_type==='BreadcrumbList'){

					$stucture_data='
					{
					  "@context": "https://schema.org",
					  "@type": "WebPage",
					  "breadcrumb": {
					    "@type": "BreadcrumbList",
					    "itemListElement": [
					      {
					        "@type": "ListItem",
					        "position": 1,
					        "name": "Home",
					        "item": "https://collegedunia.com/"
					      },
					      {
					        "@type": "ListItem",
					        "position": 2,
					        "name": "Home",
					        "item": "https://collegedunia.com/"
					      },
					      {
					        "@type": "ListItem",
					        "position": 3,
					        "name": "Kolkata",
					        "item": "https://collegedunia.com/kolkata-colleges"
					      },
					      {
					        "@type": "ListItem",
					        "position": 4,
					        "name": "MTIN",
					        "item": "https://collegedunia.com/college/63117-mother-teresa-institute-of-nursing-mtin-kolkata"
					      }
					    ]
					  }
					}';
					
				}else if($struct_type==='Article'){

					$stucture_data='
					{
					  "@context": "http://schema.org/",
					  "@type": "Article",
					  "mainEntityOfPage": {
					    "@type": "WebPage",
					    "@id": "https://www.sikshapedia.com/"
					  },
					  "headline": "About College",
					  "dateModified": "2022-06-06T14:59:26+05:30",
					  "datePublished": "2014-05-11T00:26:28+05:30",
					  "author": {
					    "@type": "Person",
					    "name": "Sikshapedia Team"
					  },
					  "publisher": {
					    "@type": "Organization",
					    "name": "Sikshapedia",
					    "logo": {
					      "@type": "ImageObject",
					      "name": "Sikshapedia",
					      "url": "https://www.sikshapedia.com/public/data/app/2021/RToXI5Hjmg.webp",
					      "height": "600",
					      "width": "88"
					    }
					  },
					  "image": {
					    "@type": "ImageObject",
					    "url": "https://www.sikshapedia.com/public/data/app/2021/RToXI5Hjmg.webp",
					    "height": "600",
					    "width": "88"
					  }
					}';
					
				}


				


				$return['stucture_data']=$stucture_data;

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	/***College***/


	/**Course**/

	public function indexCourseStructredData(){
		if(session_userdata('isAdminLoggedin')){
			$this->theme->title($this->data['page_title'])->load('seo/vw_course_structured_data', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCoursesStructuredData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$course_id=post_data('course_id');
				$course_menu_id=post_data('course_menu_id');

				if(!empty($course_id)){
					$course_data=$this->strm->get_course(array('course_id'=>$course_id));
					$_course_menues=array();

					if(!empty($course_data)){

						$course_menu=$this->sm->get_menues(array('menu_link_type'=>'20','menu_link_id'=>$course_id,'menu_id'=>$course_menu_id));


						$menu_data=$this->strm->get_course_details_data(array('course_id'=>$course_id,'course_inner_menu_id'=>$course_menu_id));

						$this->data['menu_data']=$menu_data;


						//print_obj($_course_menues);exit;

						$this->data['course_menu_data']=$course_menu;


						$return['html']=$this->theme->view('_pages/seo/vw_course_structured_data',$this->data,true);


					}else{
						$return['error']='No course data found in the system';
					}
				}else{
					$return['error']='Data manipulation is not permitted';
				}

				json_headers($return);		
				session_write_close();	

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	/**Course**/


	//**College Course Page**//

	public function onGetCollgeCourseMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=post_data('college_id');
				$course_id=post_data('course_id');

				$college_course_data=$this->im->get_user_course_data(array('user_id'=>$college_id,'user_course'=>$course_id));

				if(!empty($college_course_data)){
					$search_data_found=array();
					$course_id=$college_course_data->user_course;
					$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

					$college_course_page_url=$this->sm->get_slug_urls(array('url_glob_type'=>'college_inner_menu','url_type'=>'college_static_url','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_sub_type_id'=>$course_id,'url_type_id'=>$college_id));

					//print_obj($college_course_page_url);die;

					if(!empty($college_course_page_url)){
						$search_data_found=$this->sm->get_system_search_data(array('search_data_access_url'=>$college_course_page_url->url_value));
					}

					//print_obj($search_data_found);die;

					$this->data['college_id']=$college_id;
					$this->data['course_id']=$course_id;
					$this->data['college_course_page_url']=$college_course_page_url;
					$this->data['search_data_found']=$search_data_found;

					$return['html']=$this->theme->view('_pages/users/vw_college_course_meta_dyna',$this->data,true);

					json_headers($return);
					session_write_close();

				}else{
					$return['error']='Course data not found in the system.';
				}

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateCollegeCourseMeta(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=post_data('college_id');
				$course_id=post_data('course_id');

				$page_heading=post_data('college_course_page_heading');

				$meta_title=post_data('college_course_page_meta_title');
				$meta_keywords=$this->input->post('college_course_page_meta_keywords_edit');
				$meta_desc=post_data('college_course_page_meta_description');
				$meta_og_title=post_data('college_inner_menu_og_title');
				$meta_og_desc=post_data('college_course_og_description');

				$page_search_heading=post_data('college_course_page_data_search_title');

				$_keywords='';

				$date_modified=date('Y-m-d H:i:s');
				$date_published=date('Y-m-d H:i:s');

				$college_data=$this->im->get_college_data(array('college_user_id'=>$college_id));

				$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$course_id));

				//print_obj($course_slug);

				$course_data=$this->strm->get_course(array('course_id'=>$course_id));

				$college_course_page_url=$this->sm->get_slug_urls(array('url_glob_type'=>'college_inner_menu','url_type'=>'college_static_url','url_sub_type'=>'college_inner_menu_course_fees_url','url_type_id'=>$college_id));

				// college_inner_menu_course_fees_details_url

				//print_obj($meta_keywords);die;

				if(!empty($college_course_page_url)){
					$breadcrumb_data=array();
					$breadcumb_data=json_decode($college_course_page_url->url_breadcrumb,true);
					$last_key=array_key_last($breadcumb_data);
					$a=array_pop($breadcumb_data);

					$breadcrumb_data=$breadcumb_data;			

					$page_url=$college_course_page_url->url_value;
					$url_og_image_type=$college_course_page_url->url_og_image_type;
					$url_og_image=$college_course_page_url->url_og_image;
					$url_og_image_width=$college_course_page_url->url_og_image_width;
					$url_og_image_height=$college_course_page_url->url_og_image_height;
					$url_og_locale=$college_course_page_url->url_og_locale;
					$course_slug_url=$page_url.'/'.$course_slug->slug_value;

					//echo $course_slug_url;die;

					$breadcumb_data[$last_key]=$college_course_page_url->url_value;
					$breadcumb_data[strtoupper($course_data->course_name)]=null;


					$breadcrumb_data[$last_key]=$college_course_page_url->url_value;
					$breadcrumb_data[strtoupper($course_data->course_name)]=$course_slug_url;

					//$get_slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$course_slug_url));

					// $get_slug_url_data=$this->sm->get_slug_urls(array('url_glob_type'=>'college_inner_menu','url_type'=>'college_static_url','url_sub_type'=>'college_inner_menu_course_fees_url','url_type_id'=>$college_id,'url_sub_type_id'=>$course_id));

					$get_slug_url_data=$this->sm->get_slug_urls(array('url_glob_type'=>'college_inner_menu','url_type'=>'college_static_url','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_type_id'=>$college_id,'url_sub_type_id'=>$course_id));

					if(!empty($meta_keywords)){
						$_meta_keywords=json_decode($meta_keywords);

						//print_obj($_meta_keywords);die;

						foreach ($_meta_keywords as $key => $value) {
							$keywords[]=$value->value;
						}

						$_keywords=char_separated($keywords);
					}

					//print_obj($_keywords);die;

					$url_widgets=serialize(array('front_course_fees_course_section','front_wayto_rating_section','front_ranking_brief_section','front_custom_ads_section','front_college_comment_section','front_google_ads_section','front_nearby_colleges_universities_section'));

					$slug_data_to_update=array(
						'url_type'=>'college_static_url',
						'url_glob_type'=>'college_inner_menu',
						'url_sub_type'=>'college_inner_menu_course_fees_details_url',
						'url_type_id'=>$college_id,
						'url_sub_type_id'=>$course_id,
						'url_course'=>$course_id,
						'url_country'=>$college_data->college_country_id,
						'url_state'=>$college_data->college_state_id,
						'url_city'=>$college_data->college_city_id,
						'url_meta_title'=>$meta_title,
						'url_meta_heading'=>$meta_title,
						'url_meta_key_words'=>(!empty($_keywords))?strtolower($_keywords):'',
						'url_meta_desc'=>$meta_desc,
						'url_og_title'=>str_replace('&amp;','&',$meta_og_title),
						'url_og_desc'=>str_replace('&amp;','&',$meta_og_desc),
						'url_og_locale'=>$url_og_locale,
						'url_og_image'=>$url_og_image,
						'url_og_image_type'=>$url_og_image_type,
						'url_og_image_width'=>$url_og_image_width,
						'url_og_image_height'=>$url_og_image_height,
						'url_twitter_title'=>str_replace('&amp;','&',$meta_og_title),
						'url_twitter_desc'=>str_replace('&amp;','&',$meta_og_desc),
						'url_page_heading'=>$page_heading,
						'url_breadcrumb'=>json_encode($breadcumb_data),
						'url_value'=>$course_slug_url,
						'url_canonical_value'=>$course_slug_url,
						'url_permalink_value'=>$course_slug->slug_value,
						'url_priority'=>'0.5',
						'url_widgets'=>$url_widgets,
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>$date_modified,
						'url_active'=>'1',
						'updated_by'=>$this->data['userdata']->user_id,
						'updated_at'=>$date_modified						
					);

					//print_obj($slug_data_to_update);die;

					//print_obj($get_slug_url_data);die;

					if(empty($get_slug_url_data)){
						$added=$this->sm->store_slug_urls($slug_data_to_update);
						$url_id=$added;
					}else{
						// $added=$this->sm->update_slug_urls($slug_data_to_update,array('url_id'=>$get_slug_url_data->url_id,'url_type'=>'college_static_url',
						// 'url_glob_type'=>'college_inner_menu',
						// 'url_sub_type'=>'college_inner_menu_course_fees_details_url',
						// 'url_type_id'=>$college_id));

						$added=$this->sm->update_slug_urls($slug_data_to_update,array('url_id'=>$get_slug_url_data->url_id));

						$url_id=$get_slug_url_data->url_id;
					}

					if($added){
						if(!empty($page_search_heading)){

							$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
							$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
							$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
							$search_data=array(
								'search_data_type'=>$url_id,
								'search_data_type'=>'COLLEGE_COURSE_SEARCH',
								'search_data_name'=>str_replace('&amp;','&',$page_search_heading),
								'search_data_meta_title'=>str_replace('&amp;','&',$page_heading),
								'search_data_meta_desc'=>str_replace('&amp;','&',$meta_desc),
								'search_data_meta_keywords'=>(!empty($_keywords))?strtolower($_keywords):'',
								'search_data_og_title'=>str_replace('&amp;','&',$meta_og_title),
								'search_data_og_desc'=>str_replace('&amp;','&',$meta_og_desc),
								'search_data_country_id'=>($country_data->country_id!=null)?$country_data->country_id:null,
								'search_data_country'=>(!($state_data) && $country_data->country_name!=null)?$country_data->country_name:null,
								'search_data_state_id'=>(!($state_data) && $state_data->state_id!=null)?$state_data->state_id:NULL,
								'search_data_state_name'=>(!($state_data) && $state_data->url_state!=null)?$state_data->state_name:null,
								'search_data_city_id'=>($city_data->city_id!=NULL)?$city_data->city_id:null,
								'search_data_city_name'=>$city_data->city_name,
								'search_data_address'=>null,
								'search_data_course_ids'=>$course_id,
								'search_data_course_name'=>$course_data->course_name,
								'search_data_course_short_name'=>$course_data->course_short_name,
								'search_data_access_url'=>$course_slug_url
							);


							//print_obj($type_base_url_data);die;

							$search_data_found=$this->sm->get_system_search_data(array('search_data_access_url'=>$course_slug_url,'search_data_type'=>'COLLEGE_COURSE_SEARCH'));			

							if(!empty($search_data_found)){
								$this->sm->update_system_search_data($search_data,array('search_data_access_url'=>$course_slug_url));
							}else{
								$this->sm->store_system_search_data($search_data);
							}
						}

						if(isset($page_schema) && !empty($page_schema)){
							$structure_data_to_insert=array(
								'strcut_slug_url_id'=>$url_id,
								'slug_type_json_ld'=>'BreadcrumbList',
								'slug_type_json_ld_data'=>$page_schema,
								'slug_url'=>$course_slug_url,
								'date_modified'=>$date_modified,
								'date_published'=>$date_published
							);

							$page_schema_data=$this->sm->get_slug_struct_data(array('slug_url'=>$course_slug_url,'slug_type_json_ld'=>'BreadcrumbList'));
						}

							

						//print_obj($page_schema_data);die;

						$position=1;
						foreach ($breadcrumb_data as $key => $value) {

							$ListItem[]=array(
								"@type"=>"ListItem",
								"position"=>$position,
								"name"=>$key,
								"item"=>$value
							);

							$position++;
						}

						$_page_schema_data=array(
							"@context"=>"https://schema.org",
							"@type"=>"WebPage",
							"breadcrumb"=>array(
								"@type"=>"BreadcrumbList",
						    	"itemListElement"=>$ListItem
							)
						);

						$page_schema=json_encode($_page_schema_data);

						$page_schema_data_to_insert=array(
							'strcut_slug_url_id'=>$url_id,
							'slug_type_json_ld'=>'BreadcrumbList',
							'slug_type_json_ld_data'=>$page_schema,
							'slug_url'=>$course_slug_url,
							'date_modified'=>$date_modified,
							'date_published'=>$date_published
						);

						if(empty($page_schema_data)){

							$this->sm->store_slug_struct_data($page_schema_data_to_insert);
						}else{
							$this->sm->update_slug_struct_data($page_schema_data_to_insert,array('slug_url'=>$course_slug_url,'slug_type_json_ld'=>'BreadcrumbList'));
						}

						$return['success']='Metadata updated successfully.';
					}else{
						$rerturn['error']='Metadata not updated';
					}					
				}else{
					$return['error']='No data found regarding this URL';
				}

				json_headers($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}




	//University Slug
	// public function generate_college_menu_slug1(){
	// 	$menus=$this->sm->get_menues(array('menu_is_active'=>'1','menu_link_type'=>'10','menu_type'=>'11','menu_link_id'=>'1703'),FALSE);
	// }


	//6161 6147 10154 10167

	public function generate_college_course_clug($college_id){

		$widgets=array(
		    'front_course_fees_course_section',
		    'front_ranking_brief_section',
		    'front_custom_ads_section',
		    'front_college_comment_section',
		    'front_google_ads_section',
		    'front_nearby_colleges_universities_section'
		);

		$college_data=$this->um->get_college_profile_data(array('college_user_id'=>$college_id));

		$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
		$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

		$college_formatted_name=$college_data->college_short_name.' '.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name);

		$college_course_menu_slug=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_course_fees_url','url_type_id'=>$college_id));

		$college_menu_slug=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_info_url','url_type_id'=>$college_id));

		if(!empty($college_course_menu_slug)){

			

			$param=array(
	            'order'=>array('user_course_id' => 'ASC'),
	            'user_type'=>'4',
	            'user_id'=>$college_id
	        );

	        $_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);


	        if(!empty($_course_fees_data)){
	        	foreach ($_course_fees_data as $key => $value) {
	        		$date_modified=date('Y-m-d H:i:s');

	        		$course_breadcrumb[$value->user_course]=json_decode($college_course_menu_slug->url_breadcrumb,true);

					$d=array_key_last($course_breadcrumb[$value->user_course]);

					unset($course_breadcrumb[$value->user_course][$d]);

					$course_breadcrumb[$value->user_course][$d]=$college_course_menu_slug->url_value;

	        		$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->user_course));

	        		$mete=$college_formatted_name.' - '.$value->course_short_name.' Course, Fees';

	        		$course_slug_url=$college_course_menu_slug->url_value.'/'.$course_slug->slug_value;

					$course_breadcrumb[$value->user_course][strtoupper($value->course_short_name)]=null;


	        		$breadcrumb=json_encode($course_breadcrumb[$value->user_course]);

	        		$slug_data_to_update=array(
	        			'url_type'=>'college_static_url',
	        			'url_type_id'=>$college_id,
	        			'url_glob_type'=>'college_inner_menu',
	        			'url_sub_type'=>'college_inner_menu_course_fees_details_url',
	        			'url_sub_type_id'=>$college_id,
	        			'url_country'=>'99',
	        			'url_state'=>$college_data->college_state_id,
	        			'url_city'=>$college_data->college_city_id,
	        			'url_course'=>$value->user_course,
	        			'url_meta_heading'=>$mete,
	        			'url_meta_title'=>$mete,
	        			'url_meta_desc'=>$mete,
	        			'url_og_title'=>$mete,
	        			'url_og_desc'=>$mete,
	        			'url_og_type'=>'website',
	        			'url_og_image'=>$college_menu_slug->url_og_image,
	        			'url_og_image_width'=>$college_menu_slug->url_og_image_width,
	        			'url_og_image_height'=>$college_menu_slug->url_og_image_height,
	        			'url_og_locale'=>$college_menu_slug->url_og_locale,
	        			'url_twitter_title'=>$mete,
	        			'url_twitter_desc'=>$mete,
	        			'url_page_heading'=>$mete,
	        			'url_breadcrumb'=>$breadcrumb,
	        			'url_value'=>$course_slug_url,
	        			'url_canonical_value'=>$course_slug_url,
	        			'url_permalink_value'=>$course_slug->slug_value,
	        			'url_widgets'=>serialize($widgets),
	        			'url_priority'=>'0.5',
	        			'url_data_change_freq'=>'monthly',
	        			'url_last_update'=>$date_modified,
	        			'updated_at'=>$date_modified
	        		);

	        		$slug_data_found=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_type_id'=>$college_id,'url_sub_type_id'=>$value->user_course,'url_course'=>$value->user_course));

	        		//print_obj($slug_data_found);

	        		if(empty($slug_data_found)){
	        			$url_id=$this->sm->store_slug_urls($slug_data_to_update);

	        			echo $url_id.'<br>';
	        		}

	        		// else{
	        		// 	$this->sm->update_slug_urls($slug_data_to_update,array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_type_id'=>$college_id,'url_sub_type_id'=>$value->user_course));

	        		// 	echo $slug_data_cound->url_id.'<br>';
	        		// }


	        		//print_obj($slug_data_to_update);

	        	}
	        }



		}else{
			echo 'College course slug not found in the system';
		}
	}

	public function generate_college_menu_slug(){
		// $menus=$this->sm->get_menues(array('menu_is_active'=>'1','menu_link_type'=>'10','menu_type'=>'2','menu_link_id'=>'10130'),FALSE);

		$college_id='9267';

		$menus=$this->sm->get_menues(array('menu_is_active'=>'1','menu_link_type'=>'10','menu_link_id'=>$college_id),FALSE);

		$date_update=date('Y-m-d H:i:s');

		if(!empty($menus)){
			foreach ($menus as $key => $value) {
				$menu_link=$value->menu_link;
				$menu_college_id=$value->menu_link_id;
				$slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$value->menu_link));
				$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$menu_college_id));

				//print_obj($college_data);die;

				//if(!empty($college_data->college_country_id)){
					$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
					$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));
					$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));

					if($college_data->college_short_name==null){
						$college_short_name=abbreviate2($college_data->college_name);
						$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$college_data->college_user_id));
						
					}else{
						$college_short_name=$college_data->college_short_name;
					}

					$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_short_name).'] '.strtoupper($value->menu_name);

					$info_menu_link=$this->sm->get_menues(array('menu_is_active'=>'1','menu_link_type'=>'10','menu_type'=>'1','menu_link_id'=>$college_id));

					if($value->menu_type!='1'){
						$breadcumb=array(
							'HOME'=>base_url(),
							strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
							strtoupper($college_short_name)=>$info_menu_link->menu_link,
							strtoupper($value->menu_name)=>null
						);
					}else{
						$breadcumb=array(
							'HOME'=>base_url(),
							strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
							strtoupper($college_short_name)=>null
						);
					}

					if($value->menu_type=='1'){
						$url_sub_type='college_inner_menu_info_url';
					}else if($value->menu_type=='2'){
						$url_sub_type='college_inner_menu_course_fees_url';
					}else if($value->menu_type=='3'){
						$url_sub_type='college_inner_menu_admission_url';
					}else if($value->menu_type=='6'){
						$url_sub_type='college_inner_menu_placement_url';
					}else if($value->menu_type=='7'){
						$url_sub_type='college_inner_menu_gallery_url';
					}else if($value->menu_type=='9'){
						$url_sub_type='college_inner_menu_faculty_url';
					}					

					$slug_data_insert=array(
						'url_type'=>'college_static_url',
						'url_glob_type'=>'college_inner_menu',
						'url_type_id'=>$college_data->college_user_id,
						'url_sub_type'=>$url_sub_type,
						'url_sub_type_id'=>$value->menu_id,
						'url_country'=>$college_data->college_country_id,
						'url_state'=>$college_data->college_state_id,
						'url_city'=>$college_data->college_city_id,
						'url_value'=>$menu_link,
						'url_canonical_value'=>$menu_link,
						'url_meta_heading'=>$url_page_heading,
						'url_meta_title'=>$url_page_heading,
						'url_page_heading'=>$url_page_heading,
						'url_breadcrumb'=>json_encode($breadcumb),
						'url_priority'=>'0.6',
						'url_data_change_freq'=>'monthly',
						'url_last_update'=>$date_update,
						'url_active'=>'1',
						'updated_by'=>$college_data->updated_by,
						'updated_at'=>$date_update
					);

					//print_obj($slug_data_insert);die;

					if(empty($slug_url_data)){
						$url_id=$this->sm->store_slug_urls($slug_data_insert);
					}else{
						$url_id=$slug_url_data->url_id;
						$this->sm->update_slug_urls($slug_data_insert,array('url_id'=>$url_id));
						
					}

					echo $url_id.'<br>';
				//}

				
			}
		}
	}


	public function generate_college_menu_slug4(){
		$menues=$this->sm->get_menues(array('menu_type'=>'8','menu_link_type'=>'10'),FALSE);

		if(!empty($menues)){
			$i=1;
			foreach ($menues as $key => $value) {
				
				$menu_link=$value->menu_link;

				if(!empty($menu_link)){
					$menu_college_id=$value->menu_link_id;
					$get_slug_data=$this->sm->get_slug_urls(array('url_value'=>$menu_link));

					
						$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$menu_college_id));

						//print_obj($college_data);

						//echo $i.'='.$menu_link.'<br>';

						$date_update=date('Y-m-d H:i:s');

						if(!empty($college_data->college_country_id)){

							$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));

							//Siliguri Institute Of Technology [SIT] Admission Date, Contact, Address, Website, Map

							// {"HOME":"https:\/\/www.sikshapedia.com\/","SALBARI":"https:\/\/www.sikshapedia.com\/in\/colleges\/west-bengal\/salbari","SIOT":"https:\/\/www.sikshapedia.com\/in\/siliguri-institute-of-technology-salbari-west-bengal","INFO":null}

							// if($college_data->college_short_name!=null){
							// 	$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_data->college_short_name).']  Admission Date, Contact, Address, Website, Map';
							// }else{
							// 	$url_page_heading=strtoupper($college_data->college_name).' Admission Date, Contact, Address, Website, Map';
							// }

							if($college_data->college_short_name==null){
								$college_short_name=abbreviate2($college_data->college_name);
								$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$college_data->college_user_id));
								
							}else{
								$college_short_name=$college_data->college_short_name;
							}

							$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_short_name).'] - SCHOLARSHIP DETAILS';

							$breadcumb=array(
								'HOME'=>base_url(),
								strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
								strtoupper($college_short_name)=>$college_data->access_url,
								strtoupper($value->menu_name)=>null
							);


							$slug_data_insert=array(
								'url_type'=>'college_static_url',
								'url_glob_type'=>'college_inner_menu',
								'url_type_id'=>$college_data->college_user_id,
								'url_sub_type'=>'college_inner_menu_scholarship_url',
								'url_sub_type_id'=>$value->menu_id,
								'url_country'=>$college_data->college_country_id,
								'url_state'=>$college_data->college_state_id,
								'url_city'=>$college_data->college_city_id,
								'url_value'=>$menu_link,
								'url_canonical_value'=>$menu_link,
								'url_meta_heading'=>$url_page_heading,
								'url_meta_title'=>$url_page_heading,
								'url_page_heading'=>$url_page_heading,
								'url_breadcrumb'=>json_encode($breadcumb),
								'url_priority'=>'0.8',
								'url_data_change_freq'=>'monthly',
								'url_last_update'=>$date_update,
								'url_active'=>'1',
								'updated_by'=>'1',
								'updated_at'=>$date_update
							);

							if(empty($get_slug_data)){
								$url_id=$this->sm->store_slug_urls($slug_data_insert);
							}else{
								$this->sm->update_slug_urls($slug_data_insert,array('url_value'=>$menu_link));
								$url_id=$get_slug_data->url_id;
							}

							

							echo $url_id.'<br>';
						}

							

						//print_obj($slug_data_insert);

						$i++;
					
				}
					

				
			}
		}
	}

	public function generate_college_menu_slug5(){
		// $slug_urls=$this->sm->_get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>NULL),1000,255);

		$slug_urls=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>NULL),FALSE);

		if(!empty($slug_urls)){
			foreach ($slug_urls as $key => $value) {
				
				$college_data=$this->um->get_college_profile_data(array('college_user_id'=>$value->url_type_id));

				if(empty($college_data)){
					$menu=$this->sm->get_menues(array('menu_link'=>$value->url_value));
					// if(!empty($menu)){
					// 	$menu_id=$menu->menu_id;
					// 	$menu_link=$menu->menu_link;

					// 	$date_update=date('Y-m-d H:i:s');

					// 	if(!empty($college_data->college_country_id)){

					// 		$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
					// 		$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));
					// 		$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));

					// 		//Siliguri Institute Of Technology [SIT] Admission Date, Contact, Address, Website, Map

					// 		// {"HOME":"https:\/\/www.sikshapedia.com\/","SALBARI":"https:\/\/www.sikshapedia.com\/in\/colleges\/west-bengal\/salbari","SIOT":"https:\/\/www.sikshapedia.com\/in\/siliguri-institute-of-technology-salbari-west-bengal","INFO":null}

					// 		// if($college_data->college_short_name!=null){
					// 		// 	$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_data->college_short_name).']  Admission Date, Contact, Address, Website, Map';
					// 		// }else{
					// 		// 	$url_page_heading=strtoupper($college_data->college_name).' Admission Date, Contact, Address, Website, Map';
					// 		// }

					// 		if($college_data->college_short_name==null){
					// 			$college_short_name=abbreviate2($college_data->college_name);
					// 			$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$college_data->college_user_id));
								
					// 		}else{
					// 			$college_short_name=$college_data->college_short_name;
					// 		}

					// 		$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_short_name).'] Admission Date, Contact, Address, Website, Map';

					// 		$breadcumb=array(
					// 			'HOME'=>base_url(),
					// 			strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
					// 			strtoupper($college_short_name)=>$college_data->access_url,
					// 			strtoupper($value->menu_name)=>null
					// 		);


					// 		$slug_data_insert=array(
					// 			'url_type'=>'college_static_url',
					// 			'url_glob_type'=>'college_inner_menu',
					// 			'url_type_id'=>$college_data->college_user_id,
					// 			'url_sub_type'=>'college_inner_menu_info_url',
					// 			'url_sub_type_id'=>$menu->menu_id,
					// 			'url_country'=>$college_data->college_country_id,
					// 			'url_state'=>$college_data->college_state_id,
					// 			'url_city'=>$college_data->college_city_id,
					// 			'url_value'=>$menu->menu_link,
					// 			'url_canonical_value'=>$menu->menu_link,
					// 			'url_meta_heading'=>$url_page_heading,
					// 			'url_meta_title'=>$url_page_heading,
					// 			'url_page_heading'=>$url_page_heading,
					// 			'url_breadcrumb'=>json_encode($breadcumb),
					// 			'url_priority'=>'0.8',
					// 			'url_data_change_freq'=>'monthly',
					// 			'url_last_update'=>$date_update,
					// 			'url_active'=>'1',
					// 			'updated_by'=>'1',
					// 			'updated_at'=>$date_update
					// 		);

					// 		$this->sm->update_slug_urls($slug_data_insert,array('url_value'=>$menu_link));
					// 			$url_id=$get_slug_data->url_id;

							

					// 		echo $url_id.'<br>';
					// 	}
					// }
					

					$this->sm->delete_slug_urls(array('url_id'=>$value->url_id));
				}
			}
		}
	}


	public function generate_college_menu_slug6(){
		$menues=$this->sm->get_menues(array('menu_type'=>'1','menu_link_type'=>'10'),FALSE);

		if(!empty($menues)){
			$i=1;
			foreach ($menues as $key => $value) {
				
				$menu_link=$value->menu_link;

				if(!empty($menu_link)){
					$menu_college_id=$value->menu_link_id;
					$get_slug_data=$this->sm->get_slug_urls(array('url_value'=>$menu_link));

					if(empty($get_slug_data)){
						$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$menu_college_id));

						//print_obj($college_data);

						//echo $i.'='.$menu_link.'<br>';

						$date_update=date('Y-m-d H:i:s');

						if(!empty($college_data->college_country_id)){

							$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
							$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));
							$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));

							//Siliguri Institute Of Technology [SIT] Admission Date, Contact, Address, Website, Map

							// {"HOME":"https:\/\/www.sikshapedia.com\/","SALBARI":"https:\/\/www.sikshapedia.com\/in\/colleges\/west-bengal\/salbari","SIOT":"https:\/\/www.sikshapedia.com\/in\/siliguri-institute-of-technology-salbari-west-bengal","INFO":null}

							// if($college_data->college_short_name!=null){
							// 	$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_data->college_short_name).']  Admission Date, Contact, Address, Website, Map';
							// }else{
							// 	$url_page_heading=strtoupper($college_data->college_name).' Admission Date, Contact, Address, Website, Map';
							// }

							if($college_data->college_short_name==null){
								$college_short_name=abbreviate2($college_data->college_name);
								$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$college_data->college_user_id));
								
							}else{
								$college_short_name=$college_data->college_short_name;
							}

							$url_page_heading=strtoupper($college_data->college_name).' ['.strtoupper($college_short_name).']  Admission Date, Contact, Address, Website, Map';

							$breadcumb=array(
								'HOME'=>base_url(),
								strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
								strtoupper($college_short_name)=>null
							);


							$slug_data_insert=array(
								'url_type'=>'college_static_url',
								'url_glob_type'=>'college_inner_menu',
								'url_type_id'=>$college_data->college_user_id,
								'url_sub_type'=>'college_inner_menu_info_url',
								'url_sub_type_id'=>$value->menu_id,
								'url_country'=>$college_data->college_country_id,
								'url_state'=>$college_data->college_state_id,
								'url_city'=>$college_data->college_city_id,
								'url_value'=>$menu_link,
								'url_canonical_value'=>$menu_link,
								'url_meta_heading'=>$url_page_heading,
								'url_meta_title'=>$url_page_heading,
								'url_page_heading'=>$url_page_heading,
								'url_breadcrumb'=>json_encode($breadcumb),
								'url_priority'=>'0.6',
								'url_data_change_freq'=>'monthly',
								'url_last_update'=>$date_update,
								'url_active'=>'1',
								'updated_by'=>'1',
								'updated_at'=>$date_update
							);

							$url_id=$this->sm->store_slug_urls($slug_data_insert);

							echo $url_id.'<br>';
						}

							

						//print_obj($slug_data_insert);

						$i++;
					}
				}
					

				
			}
		}
	}

	public function generate_college_menu_slug2(){
		$college_data=$this->im->get_college_profile_data(array('access_url!='=>null,'college_country_id!='=>null),FALSE);

		if(!empty($college_data)){
			foreach ($college_data as $key => $value) {
				$menu=$this->sm->get_menues(array('menu_type'=>'1','menu_link_type'=>'10','menu_link'=>$value->access_url));

				$date_update=date('Y-m-d H:i:s');

				if(!empty($value->college_country_id)){

					$city_data=$this->com->get_city(array('city_id'=>$value->college_city_id));
					$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->college_city_id));
					$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->college_state_id));

					//Siliguri Institute Of Technology [SIT] Admission Date, Contact, Address, Website, Map

					// {"HOME":"https:\/\/www.sikshapedia.com\/","SALBARI":"https:\/\/www.sikshapedia.com\/in\/colleges\/west-bengal\/salbari","SIOT":"https:\/\/www.sikshapedia.com\/in\/siliguri-institute-of-technology-salbari-west-bengal","INFO":null}

					if($value->college_short_name!=null){
						$college_short_name=abbreviate2($value->college_name);
						$this->im->update_college_data(array('college_short_name'=>$college_short_name),array('college_user_id'=>$value->college_user_id));
						
					}else{
						$college_short_name=$value->college_short_name;
					}

					$url_page_heading=strtoupper($value->college_name).' ['.strtoupper($college_short_name).']  Admission Date, Contact, Address, Website, Map';

					$breadcumb=array(
						'HOME'=>base_url(),
						strtoupper($city_data->city_name)=>base_url('in/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
						strtoupper($college_short_name)=>$value->access_url,
						strtoupper('INFO')=>null
					);


					$get_slug_data=$this->sm->get_slug_urls(array('url_value'=>$value->access_url));

					if(empty($get_slug_data)){
						$slug_data_insert=array(
							'url_type'=>'college_static_url',
							'url_glob_type'=>'college_inner_menu',
							'url_type_id'=>$value->college_user_id,
							'url_sub_type'=>'college_inner_menu_info_url',
							'url_sub_type_id'=>$menu->menu_id,
							'url_country'=>$value->college_country_id,
							'url_state'=>$value->college_state_id,
							'url_city'=>$value->college_city_id,
							'url_value'=>$value->access_url,
							'url_canonical_value'=>$value->access_url,
							'url_meta_heading'=>$url_page_heading,
							'url_meta_title'=>$url_page_heading,
							'url_page_heading'=>$url_page_heading,
							'url_breadcrumb'=>json_encode($breadcumb),
							'url_priority'=>'0.6',
							'url_data_change_freq'=>'monthly',
							'url_last_update'=>$date_update,
							'url_active'=>'1',
							'updated_by'=>'1',
							'updated_at'=>$date_update
						);

						$url_id=$this->sm->store_slug_urls($slug_data_insert);

						echo $url_id.'<br>';
					}

						
				}
			}
		}


	}


	public function change_course_url(){
		$this->load->model('course_model','cmm');
		$get_slug_urls=$this->sm->get_slug_urls_like('url_id,url_type_id,url_value,url_page_heading','url_value','course-fees',800);



		//print_obj($get_slug_urls);die;

		$course_data=array();

		if(!empty($get_slug_urls)){
			foreach ($get_slug_urls as $key => $value) {
				echo 'URL_ID:'.$value->url_id.'<br>';
				$college_id=$value->url_type_id;
				$college_slug=$this->im->get_college_specific_data('college_user_id,college_country_id,college_city_id,college_state_id,college_country_id,college_name,college_short_name,access_url',array('college_user_id'=>$college_id));

				
				//$college_menu_data=$this->sm->get_menues_specific('menu_link_type,menu_link_id,menu_slug,menu_type',array('menu_link_type'=>'10','menu_link_id'=>$college_id,'menu_type'=>'2'));

				//print_obj($college_slug);
				$__get_user_course_data=$this->im->get_user_course_data(array('user_type'=>'4','user_id'=>$college_id),FALSE);

				if(!empty($__get_user_course_data)){
					foreach ($__get_user_course_data as $k => $v) {
						$city_data=$this->com->get_city(array('city_id'=>$college_slug[0]->college_city_id));
						$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_slug[0]->college_city_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_slug[0]->college_state_id));
						$_course_data=$this->cmm->get_course(array('course_id'=>$v->user_course));
						$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$v->user_course));

						$course_slug_url=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_type_id'=>$college_id,'url_sub_type_id'=>$v->user_course));

						$date_modified=date('Y-m-d H:i:s');
						$date_published=date('Y-m-d H:i:s');
						$college_course_url=$value->url_value.'/'.$course_slug->slug_value;

						$breadcumb_data=array(
							'HOME'=>base_url(),
							strtoupper($city_data->city_name)=>base_url('in/'.$state_slug->slug_value.'/'.$city_slug->slug_value),
							strtoupper($college_slug[0]->college_short_name)=>$college_slug[0]->access_url,
							strtoupper($_course_data->course_name)=>null
						);

						$url_widgets=serialize(array('front_course_fees_course_section','front_wayto_rating_section','front_ranking_brief_section','front_custom_ads_section','front_college_comment_section','front_google_ads_section','front_nearby_colleges_universities_section'));

						$meta_title=strtoupper($college_slug[0]->college_name).'-'.strtoupper($_course_data->course_name);
						$meta_desc=$meta_title.' DETAILS';
						$meta_og_title=$meta_title;
						$meta_og_desc=$meta_desc;
						$url_og_locale='en_US';

						$_keywords=$college_slug[0]->college_name.' '.$_course_data->course_name;

						$slug_data_to_update=array(
							'url_type'=>'college_static_url',
							'url_glob_type'=>'college_inner_menu',
							'url_sub_type'=>'college_inner_menu_course_fees_details_url',
							'url_type_id'=>$college_id,
							'url_sub_type_id'=>$v->user_course,
							'url_course'=>$v->user_course,
							'url_country'=>(!empty($college_slug[0]->college_country_id))?$college_slug[0]->college_country_id:'99',
							'url_state'=>$college_slug[0]->college_state_id,
							'url_city'=>$college_slug[0]->college_city_id,
							'url_meta_title'=>$meta_title,
							'url_meta_heading'=>$meta_title,
							'url_meta_key_words'=>(!empty($_keywords))?strtolower($_keywords):'',
							'url_meta_desc'=>$meta_desc,
							'url_og_title'=>str_replace('&amp;','&',$meta_og_title),
							'url_og_desc'=>str_replace('&amp;','&',$meta_og_desc),
							'url_og_locale'=>$url_og_locale,
							'url_og_image'=>null,
							'url_og_image_type'=>null,
							'url_og_image_width'=>null,
							'url_og_image_height'=>null,
							'url_twitter_title'=>str_replace('&amp;','&',$meta_og_title),
							'url_twitter_desc'=>str_replace('&amp;','&',$meta_og_desc),
							'url_page_heading'=>str_replace('&amp;','&',$meta_title),
							'url_breadcrumb'=>json_encode($breadcumb_data),
							'url_value'=>$college_course_url,
							'url_canonical_value'=>$college_course_url,
							'url_permalink_value'=>$course_slug->slug_value,
							'url_priority'=>'0.5',
							'url_widgets'=>$url_widgets,
							'url_data_change_freq'=>'monthly',
							'url_last_update'=>$date_modified,
							'url_active'=>'1',
							'updated_by'=>$this->data['userdata']->user_id,
							'updated_at'=>$date_modified						
						);

						if(empty($course_slug_url)){
							$added=$this->sm->store_slug_urls($slug_data_to_update);
							$url_id=$added;
						}else{
							$added=$this->sm->update_slug_urls($slug_data_to_update,array('url_id'=>$course_slug_url->url_id,'url_type'=>'college_static_url',
							'url_glob_type'=>'college_inner_menu',
							'url_sub_type'=>'college_inner_menu_course_fees_details_url',
							'url_type_id'=>$college_id));

							$url_id=$get_slug_url_data->url_id;
						}

						//print_obj(array('url_id',$url_id));

						// $course_data[$college_id][]=array(
						// 	'course_id'=>$_course_data->course_id,
						// 	'course_name'=>$_course_data->course_name,
						// 	'course_slug'=>$course_slug->slug_value,
						// 	'course_url'=>$value->url_value.'/'.$course_slug->slug_value
						// );
					}
				}

				//$course_slug=$college_slug[0]->access_url.'/'.$college_menu_data->menu_slug;

				//echo 'URL ID:'.$value->url_id.'<br>';

				//$this->sm->update_slug_urls(array('url_value'=>$course_slug,'url_canonical_value'=>$course_slug),array('url_id'=>$value->url_id));

				// $college_data[]=array(
				// 	'college_id'=>$college_id,
				// 	'college_course_url'=>$value->url_value,
				// 	'college_page_heading'=>$value->url_page_heading,
				// 	'college_courses'=>$course_data
				// );
			}

			//print_obj($college_data);
		}

		
	}


	public function onUpdateExamSlugs(){

		$exam_slugs=$this->sm->get_slug_urls(array('url_type'=>'exam'),FALSE);

		//print_obj($exam_slugs);

		if(!empty($exam_slugs)){

			$updated_at=date('Y-m-d H:i:s');

			foreach ($exam_slugs as $key => $value) {

				//$keywords=$value->url_meta_key_words;

				//$c=$this->removeItemString($keywords,'0');

				//$v=$this->removeItemString($c,' ');

				//print_obj($c);

				//$this->sm->update_slug_urls(array('url_canonical_value'=>$value->url_value),array('url_id'=>$value->url_id));

				//$this->sm->update_slug_urls(array('url_og_type'=>'article'),array('url_id'=>$value->url_id));	

				//$this->sm->update_slug_urls(array('url_meta_key_words'=>$c,'url_data_change_freq'=>'monthly','url_last_update'=>$updated_at,'updated_by'=>$this->data['userdata']->user_id,'updated_at'=>$updated_at),array('url_id'=>$value->url_id));

				if(!empty($value->url_state)){
					$state_data=$this->com->get_state(array('state_id'=>$value->url_state));
					$state_name=$state_data->state_name;
					$state_id=$state_data->state_id;
				}else{
					$state_name=null;
					$state_id=null;
				}

				$exam=$this->strm->_get_exam(array('exam_id'=>$value->url_type_id));

				$exam_logo=$this->sm->get_user_file(array('user_storage_type'=>'exam_logo','user_file_type_id'=>$value->url_type_id));

				if(!empty($exam_logo)){
					$logo=$exam_logo->media_disk_path_relative;
				}else{
					$logo='';
				}

				if(!empty($exam->exam_full_name)){
					$search_data_to_add=array(
						'search_data_type_id'=>$value->url_type_id,
						'search_data_type'=>'EXAM_NAME',
						'search_data_name'=>$exam->exam_full_name,
						'search_data_short_name'=>$exam->exam_short_name,
						'search_data_country_id'=>$value->url_country,
						'search_data_country'=>'india',
						'search_data_state_id'=>$state_id,
						'search_data_state_name'=>$state_name,
						'search_data_exam_ids'=>$value->url_type_id,
						'search_data_access_url'=>$value->url_value,
						'search_storage_access_url'=>$logo
					);

					$found1=$this->sm->__get_system_search_data(array('search_data_type_id'=>$value->url_type_id,'search_data_name'=>$exam->exam_full_name,'search_data_short_name'=>$exam->exam_short_name,'search_data_type'=>'EXAM_NAME'));

					//$found=$this->sm->__get_system_search_data(array('search_data_access_url'=>$value->url_value,'search_data_type'=>'EXAM_NAME'));

					if(empty($found1)){
						$this->sm->store_system_search_data($search_data_to_add);
					}
				}

					
			}

			//$exam_slugs2=$this->sm->get_slug_urls(array('url_type'=>'exam'),FALSE);

			//print_obj($search_data_to_add);
			
		}
	}



	public function onUpdateExamSearchData(){
		$exams=$this->strm->_get_exam(NULL,NULL,FALSE);

		if(!empty($exams)){
			foreach ($exams as $key => $value) {
				$exam_name=$value->exam_full_name;
				$exam_short_name=$vlaue->exam_short_name;

				if(!empty($value->exam_state)){
					$state_data=$this->com->get_state(array('state_id'=>$value->exam_state));
					$state_name=$state_data->state_name;
					$state_id=$state_data->state_id;
				}else{
					$state_name=null;
					$state_id=null;
				}

				$search_data_to_add=array(
					'search_data_type_id'=>$value->exam_id,
					'search_data_type'=>'EXAM_NAME',
					'search_data_name'=>$exam_name,
					'search_data_short_name'=>$exam_short_name,
					'search_data_country_id'=>$value->exam_country,
					'search_data_country'=>'india',
					'search_data_state_id'=>$state_id,
					'search_data_state_name'=>$state_name,
					'search_data_exam_ids'=>$value->exam_id,
					'search_data_access_url'=>'',
					'search_storage_access_url'=>''
				);

				$found=$this->sm->__get_system_search_data(array('search_data_type_id'=>$value->exam_id,'search_data_type'=>'EXAM_NAME'));

				if(empty($found)){
					$this->sm->store_system_search_data($search_data_to_add);
				}

				
			}
		}
	}

	function removeItemString($str, $item) {
		$parts = char_separated_to_array($str);
		while(($i = array_search($item, $parts)) !== false) {
			unset($parts[$i]);
		}
		return char_separated($parts);
	}



	public function indexUpdateCollegeSearchdata(){
		$slug_data=$this->sm->_get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_type_id!='=>null),'1000','0','url_type_id','ASC');

		//print_obj($slug_data);die;

		if(!empty($slug_data)){
			foreach ($slug_data as $key => $value) {

				if (strpos($value->url_value,'https://www.sikshapedia.com/university') !== false) {
				   
				}else{
					print_obj($value->url_value);
				}

				// $search_data_to_add=array(
				// 	'search_data_type_id'=>$value->url_type_id
				// );
			}
		}
	}



	/***Create College Search Data***/

	public function onCreateInstSearchData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$selected_colleges_for_search=post_data('selected_colleges_for_search');

				if(!empty($selected_colleges_for_search)){
					$data=explode(",", $selected_colleges_for_search);

					// Remove duplicate values and blank values
					$uniqueArray = array_unique(array_filter($data));

					// Sort in ascending order
					sort($uniqueArray);

					if(!empty($uniqueArray)){
						foreach ($uniqueArray as $key => $value) {

							$list = $this->im->_get_college(array('user_id'=>$value));

							if(!empty($list)){

								//if ($list->user_role=='4') {
									$search_data_type='COLLEGE_NAME';
								//}

								// $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

								$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value,'user_storage_type'=>'user_logo'));

				    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
				                    $college_logo=$_college_logo->media_disk_path_relative;
				                    $college_logo_name=$_college_logo->media_org_name;
				                }else{
				                    $college_logo=base_url('data/app/app_data/sikshapedia-small-logo.png');
				                    $college_logo_name='';
				                }

				                $slug_data=$this->sm->get_slug_urls(array('url_value'=>$list->access_url));

				                if(!empty($slugs_data)){
				                	$search_data_meta_title=$slug_data->url_meta_title;
				                	$search_data_meta_keywords=$slug_data->url_meta_key_words;
				                	$search_data_meta_desc=$slug_data->url_meta_desc;
				                	$search_data_og_title=$slug_data->url_og_title;
				                	$search_data_og_desc=$slug_data->url_og_desc;
				                }else{
				                	$search_data_meta_title=null;
				                	$search_data_meta_keywords=null;
				                	$search_data_meta_desc=null;
				                	$search_data_og_title=null;
				                	$search_data_og_desc=null;
				                }

				                $p=array('user_id'=>$list->college_user_id,'stream_parent_id'=>NULL);

								$stream_ids_data=$this->strm->_get_user_course_stream_groupconcat($p);

								if(!empty($stream_ids_data)){
									$search_data_stream_name=$stream_ids_data->stream_names;
									$search_data_stream_ids=$stream_ids_data->stream_ids;
								}else{
									$search_data_stream_name=null;
									$search_data_stream_ids=null;
								}

								$_p=array('user_id'=>$list->college_user_id);

								$exam_ids_data=$this->strm->_get_user_course_exam_groupconcat($_p);

								if(!empty($exam_ids_data)){
									$search_data_exam_name=$exam_ids_data->exam_names;
									$search_data_exam_ids=$exam_ids_data->exam_ids;
								}else{
									$search_data_exam_name=null;
									$search_data_exam_ids=null;
								}

								$course_stream_ids_data=$this->strm->__get_user_course_groupconcat(array('user_id'=>$list->college_user_id));

								if(!empty($course_stream_ids_data)){
									$search_data_course_name=$course_stream_ids_data->course_names;
									$search_data_course_short_name=$course_stream_ids_data->course_short_name;
									$search_data_course_ids=$course_stream_ids_data->course_ids;
								}else{
									$search_data_course_name=null;
									$search_data_course_short_name=null;
									$search_data_course_ids=null;
								}

			                	$data_to_insert=array(
									'search_data_type_id'=>$value,
									'search_data_type_menu_id'=>'1',
									'search_data_type'=>$search_data_type,
									'search_data_name'=>strtoupper($list->college_name),
									'search_data_short_name'=>$list->college_short_name,
									'search_data_country_id'=>$list->college_country_id,
									'search_data_country'=>strtoupper($list->country_name),
									'search_data_state_id'=>$list->college_state_id,
									'search_data_state_name'=>strtoupper($list->state_name),
									'search_data_city_id'=>$list->college_city_id,
									'search_data_city_name'=>strtoupper($list->city_name),
									'search_data_address'=>$list->college_address,
									'search_data_course_ids'=>$search_data_course_ids,
									'search_data_course_name'=>$search_data_course_name,
									'search_data_course_short_name'=>$search_data_course_short_name,
									'search_data_stream_ids'=>$search_data_stream_ids,
									'search_data_stream_name'=>$search_data_stream_name,
									'search_data_exam_ids'=>$search_data_exam_ids,
									'search_data_exam_name'=>$search_data_exam_name,
									'search_data_meta_title'=>$search_data_meta_title,
									'search_data_meta_desc'=>$search_data_meta_desc,
									'search_data_meta_keywords'=>$search_data_meta_keywords,
									'search_data_og_title'=>$search_data_og_title,
									'search_data_og_desc'=>$search_data_og_desc,
									'search_data_access_url'=>$list->access_url,
									'search_storage_access_url'=>$college_logo
								);

								$system_data_search=$this->sm->get_system_search_data(array('search_data_type'=>'COLLEGE_NAME','search_data_access_url'=>$list->access_url));

								if(empty($system_data_search)){									
									$updated=$this->sm->store_system_search_data($data_to_insert);
								}else{
									$updated=$this->sm->update_system_search_data($data_to_insert,array('search_data_type'=>'COLLEGE_NAME','search_data_access_url'=>$list->access_url));
								}
				                

								
							}

							
						}
					}

						

				}

			}else{

			}
		}else{

		}
	}


	public function slug_gen(){

		$cities=$this->com->get_city(array('city_country_id'=>'99'),FALSE);

		if(!empty($cities)){
			foreach ($cities as $key => $value) {
				$city_slug=url_slug($value->city_name);
				$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->city_state_id));
				$city_name_state_slug=$state_slug->slug_value.'/'.$city_slug;
				$this->com->update_city_data(array('city_name_slug'=>$city_slug,'city_name_state_slug'=>$city_name_state_slug),array('city_id'=>$value->city_id));
			}
		}



	}




	//***GENERATE COLLEGE MENU STRUCTURE DATA***//

	public function onGenerateCollegeMenuStructureData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_menu_url_id=post_data('menu_url_id');
				$college_id=post_data('college_id');
				$data_name=post_data('data_name');

				$strcut_data_rtype=post_data('struct_data_type');

				$college_data=$this->im->get_college_data(array('college_user_id'=>$college_id));

				if(!empty($college_data)){

					$url_data=$this->sm->get_slug_urls(array('url_id'=>$college_menu_url_id));

					$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
					$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));

					$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));

					if($college_data->college_pincode!=''){
						$college_address=$college_data->college_address.','.$city_data->city_name.','.$state_data->state_name.','.$college_data->college_pincode.','.$country_data->country_name;
					}else{
						$college_address=$college_data->college_address.','.$city_data->city_name.','.$state_data->state_name.','.$country_data->country_name;
					}
					

					$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

					if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
					    $college_logo=$user_logo->media_disk_path_relative;

					    if($strcut_data_rtype=='CollegeOrUniversity'){
							$strcut_data='{
							  "@context": "http://schema.org/",
							  "@type": "CollegeOrUniversity",
							  "name": "'.$data_name.'",
							  "url": "'.$url_data->url_value.'",
							  "email": "'.$college_data->college_email.'",
							  "telephone": "'.$college_data->college_phone_no.'",
							  "logo": "'.$college_logo.'",
							  "address": {
							    "@type": "PostalAddress",
							    "streetAddress": "'.$college_address.'"
							  }
							}';						

						}else if($strcut_data_rtype=='BreadcrumbList'){
							$url_breadcrumb=json_decode($url_data->url_breadcrumb);
							$i=1;
							foreach ($url_breadcrumb as $key => $value) {

							    $b_arr[]=[
							                "@type" => "ListItem",
							                "position" => $i,
							                "name" => "$key",
							                "item" => "$value",
							            ];

							      $i++;
							}

							print_obj($b_arr);die; 

							// Define the JSON-LD data
							$json_ld_data = [
							    "@context" => "https://schema.org",
							    "@type" => "WebPage",
							    "breadcrumb" => [
							        "@type" => "BreadcrumbList",
							        "itemListElement" => $b_arr
							    ],
							];

							// Convert the PHP array to JSON
							$strcut_data = json_encode($json_ld_data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
							
						}

							//echo $strcut_data;die;

						$data_found=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$college_menu_url_id));

						if(!empty($data_found)){
							$data_to_store=array(
								'strcut_slug_url_id'=>$college_menu_url_id,
								'slug_type_json_ld'=>$strcut_data_rtype,
								'slug_type_json_ld_data'=>$strcut_data,
								'slug_url'=>$url_data->url_value,
								'date_modified'=>date('Y-m-d')
							);

							//print_obj($data_to_store);die;

							$updated=$this->sm->update_slug_struct_data($data_to_store,array('strcut_slug_url_id'=>$college_menu_url_id,'slug_type_json_ld'=>$strcut_data_rtype));

							$strcut_data_id=$data_found->strcut_data_id;
						}else{
							$data_to_store=array(
								'strcut_slug_url_id'=>$college_menu_url_id,
								'slug_type_json_ld'=>$strcut_data_rtype,
								'slug_type_json_ld_data'=>$strcut_data,
								'slug_url'=>$url_data->url_value,
								'date_modified'=>date('Y-m-d'),
								'date_published'=>date('Y-m-d')
							);
							$updated=$this->sm->store_slug_struct_data($data_to_store);

							$strcut_data_id=$updated;
						}

						//echo $strcut_data_id;die;

						if($updated){
							$sdata=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$college_menu_url_id,'slug_type_json_ld'=>$strcut_data_rtype));
							$return['structure_data']=$sdata->slug_type_json_ld_data;
						}else{
							$return['error']='Data not updated';
						}
						
					}else{
						$return['error']='College logo needs to be updated.Logo not found.';
					}						

				}else{
					$return['error']='College not found';
				}

				json_headers($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onUrlParameters(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param_type=post_data('param_type');
				$param_url=post_data('param_url');
				$url_id=post_data('param_url_id');

				if(!empty($param_url)){

					if($param_type=='stream'){
						$lastValue = basename($param_url);

						$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_value'=>$lastValue));

						if(!empty($stream_slug)){
							$updated=$this->sm->update_slug_urls(array('url_stream'=>$stream_slug->slug_type_id),array('url_id'=>$url_id));

							if($updated){
								$return['success']='Slug has been updated';
							}else{
								$return['error']='Slug data not found';
							}

						}else{
							$return['error']='Slug data not found';
						}
					}else if($param_type=='city'){

					}

				}else{
					$return['error']='URL not found';
				}

				json_headers($return);

				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}




	/***URL Checker***/
	public function onSearchURLChecker(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $param['column_order'] = array(
                    null,
                    'url_value',
                );

                $param['column_search'] = array('url_value');
                $param['order'] = array('url_id' => 'DESC');
                $posts=$this->input->post();

                $list = $this->sm->_get_slugs_urls($posts,$param,FALSE,FALSE);
                 
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $urldata){
                    $no++;

                    $row = array();

                    $action='<div class="button-group">
                    <button type="button" class="btn btn-xs btn-dark btn_url_data_edit" data-url_id="'.$urldata->url_id.'">Edit</button>
                    <a href="https://search.google.com/u/3/search-console/inspect?resource_id='.$urldata->url_value.'&id=Wf4SOT1MOy0rpcCnYX4KFg" target="_blank" class="btn btn-xs btn-dark">Go To Console</a>
                    </div>';
                    
                    $row[]  =   $no; 

                    $row[]  =   $urldata->url_value.'<br>'.$action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
                    "recordsFiltered" => $this->sm->_get_slugs_urls($posts,$param,TRUE),
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


    public function onLoadURLMetadata(){
    	if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

            	$url_id=post_data('url_id');

            	$this->data['url_data']=$this->sm->get_slug_urls(array('url_id'=>$url_id));

            	$return['html']=$this->theme->view('_pages/seo/vw_slugs_meta_dyna',$this->data,true);

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

				session_write_close();

            }else{
            	redirect($this->data['admin_base_url']);
            }
        }else{
        	redirect($this->data['admin_base_url']);
        }
    }




    	public function indexFileeditor(){

			if(session_userdata('isAdminLoggedin')){

				$admin_id = decode_data(session_userdata('admin_id'));

		        $user_internal = $this->um->get_internal_user_profile_data(array('user_m_id' => $admin_id));

		        $user_name = str_replace(" ", "_", $user_internal->user_fullname);

		        if(in_array('can_tools_editor', $this->data['permissions'])){
					$dt=date('Y-m-d H:i:s');

			        $ip=$this->input->ip_address();

					$filePath = FCPATH . 'robots.txt'; // FCPATH is the absolute path to the front controller (index.php) of your application
			        $this->data['robotsTxtContent'] = '';
			        $file_is_locked='no';
			        $file_is_locked_by='me';

			        if (file_exists($filePath)) {
			        	$robotsTxtContent=file_get_contents($filePath);
			            $this->data['robotsTxtContent'] = $robotsTxtContent;

			            $check_file_lock=$this->sm->get_file_access_data(array('file_name'=>'robots.txt'));

			            $accessData = [
					        'user_name' => $user_internal->user_fullname,
					        'access_date' => $dt,
					        'user_id' => $admin_id
					    ];

			            
			            if(!empty($check_file_lock)){

			            	if($check_file_lock->file_access_lock==='yes'){
			            		if($check_file_lock->file_access_by==$admin_id){
			            			$this->data['message']='File can not be saved by others as it is being updated by <strong>You</strong>.File can only be edited when <strong>You</strong> close the file.';
			            			$file_is_locked_by='me';
			            		}else{
			            			$this->data['message']='File can not be saved as it is being updated by <strong>'.$check_file_lock->file_access_by_name.'</strong>.You can not edit the file until it is closed by <strong>'.$check_file_lock->file_access_by_name.'</strong>';
			            			$file_is_locked_by='others';
			            		}

			            		$file_is_locked=$check_file_lock->file_access_lock;	            		
			            	}else{

			            		$existingAccessData = json_decode($check_file_lock->file_access_data, true);
						        if (!is_array($existingAccessData) || array_keys($existingAccessData) !== range(0, count($existingAccessData) - 1)) {
						            $existingAccessData = []; // Reset if not an indexed array
						        }
						        $existingAccessData[] = $accessData; // Append new data using [] to ensure index


		                    	$updatedata=array(			                    		
		                    		'file_access_by'=>$admin_id,
		                    		'file_access_by_name'=>$user_internal->user_fullname,
		                    		'file_access_date'=>$dt,
		                    		'file_access_lock'=>'yes',
		                    		'file_last_update'=>date('Y-m-d H:i:s'),
		                    		'file_access_data'=>json_encode(array_values($existingAccessData)),
		                    		'file_last_dump_data'=>$robotsTxtContent,
		                    		'file_access_ip'=>$ip,
		                    		'file_access_agent'=>_user_agent()
		                    	);

		                    	$this->sm->update_file_access_data($updatedata,array('file_name'=>'robots.txt'));
		                    	$this->data['message']='File can not be saved by others as it is being updated by <strong>You</strong>.File can only be edited when <strong>You</strong> close the file.';
		                    	$file_is_locked_by='me';
		                    	$file_is_locked='yes';
			            	}
			            }else{
			            	$dt=date('Y-m-d H:i:s');

			            	$a[]=$accessData;

		                	$updatedata=array(
		                		'file_name'=>'robots.txt',
		                		'file_access_by'=>$admin_id,
		                		'file_access_by_name'=>$user_internal->user_fullname,
		                		'file_access_date'=>$dt,
		                		'file_access_lock'=>'yes',
		                		'file_last_update'=>date('Y-m-d H:i:s'),
		                		'file_access_data'=>json_encode(array_values($a)),
		                		'file_last_dump_data'=>$robotsTxtContent,
		                		'file_access_ip'=>$ip,
		                		'file_access_agent'=>_user_agent()
		                	);

		                	$this->sm->store_file_access_data($updatedata);

		                	$this->data['message']='File can not be saved by others as it is being updated by <strong>You</strong>.File can only be edited when <strong>You</strong> close the file.';

		                	$file_is_locked='yes';
		                	$file_is_locked_by='me';
			            }     
			        }

			        $this->data['file_is_locked']=$file_is_locked;
			        $this->data['file_is_locked_by']=$file_is_locked_by;
		        }else{
		        	$this->data['error_msg']='You are not permitted to accees this section';
		        }

			        


				$this->theme->title($this->data['page_title'])->load('seo/vw_file_editor', $this->data);
					

			}else{
				redirect($this->data['admin_base_url']);
			}
		}



		public function onUpdateRobotsTxt() {
		    $return = array(); // Initialize return array

		    if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
		        if ($this->input->is_ajax_request() && $this->input->method() == 'post') {

		        	$op_type=post_data('op_type');

		            $admin_id = decode_data(session_userdata('admin_id'));

		            $dt=date('Y-m-d H:i:s');

		            $user_internal = $this->um->get_internal_user_profile_data(array('user_m_id' => $admin_id));

		            $user_name = str_replace(" ", "_", $user_internal->user_fullname);

		            $accessData = [
				        'user_name' => $user_internal->user_fullname,
				        'access_date' => $dt,
				        'user_id' => $admin_id
				    ];

		            if($op_type=='update_file'){
		            	$check_file_lock=$this->sm->get_file_access_data(array('file_name'=>'robots.txt'));

			            if(!empty($check_file_lock)){
							$editorContent = $this->input->post('editorContent');

				            $filePath = FCPATH . 'robots.txt';
							$backupDir = FCPATH . 'robots_backups/';

							// Check if the backup directory exists, if not create it
							if (!file_exists($backupDir)) {
							    if (!mkdir($backupDir, 0755, true)) {
							        $return['error'] = "Failed to create backup directory.";
							        $this->output->set_content_type('application/json')->set_output(json_encode($return));
							    }

							    
							}else{
								if (file_exists($filePath)) {
					                // Create a backup file name with a timestamp
					                $backupFilePath = $backupDir . "robots_" . $user_name . '_' . date('Ymd_H-i-s') . ".txt";

					                // Attempt to copy the current robots.txt to the backup file
								    if (!@copy($filePath, $backupFilePath)) {
								        $error = error_get_last();
								        $return['error'] = "Failed to create backup. Error: " . $error['message'];
								    } else {
					                    // Save the new content to the robots.txt file
					                    if (file_put_contents($filePath, $editorContent) !== false) {

					                    	$dt=date('Y-m-d H:i:s');

					                    	$existingAccessData = json_decode($check_file_lock->file_access_data, true);
									        if (!is_array($existingAccessData) || array_keys($existingAccessData) !== range(0, count($existingAccessData) - 1)) {
									            $existingAccessData = []; // Reset if not an indexed array
									        }
									        $existingAccessData[] = $accessData; // Append new data using [] to ensure index

					                    	$updatedata=array(			                    		
					                    		'file_access_by'=>$admin_id,
					                    		'file_access_by_name'=>$user_internal->user_fullname,
					                    		'file_access_date'=>$dt,
					                    		'file_access_lock'=>'no',
					                    		'file_last_update'=>date('Y-m-d H:i:s'),
					                    		'file_access_data'=>json_encode(array_values($existingAccessData)),
					                    		'file_last_dump_data'=>$editorContent,
					                    		'file_access_ip'=>$this->input->ip_address(),
					                    		'file_access_agent'=>_user_agent()
					                    	);

					                    	$this->sm->update_file_access_data($updatedata,array('file_name'=>'robots.txt'));
					                        $return['success'] = "Content saved successfully.";
					                        $return['redirect']=$this->data['admin_base_url'].'/dashboard';
					                    } else {
					                        $return['error'] = "Error saving content.";
					                    }
					                }
					            } else {
					                $return['error'] = 'robots.txt file does not exist.';
					            }
							}

					            
			            }else{
			            	$return['error']='File can not be saved as it is being updated by '.$check_file_lock->file_access_by_name;
			            }
		            }else if($op_type=='close_file'){
		            	$check_file_lock=$this->sm->get_file_access_data(array('file_name'=>'robots.txt'));
		            	$ip=$this->input->ip_address();
		            	if(!empty($check_file_lock) && $check_file_lock->file_access_lock==='yes' && $check_file_lock->file_access_ip==$ip && $check_file_lock->file_access_by==$admin_id){
							$this->sm->update_file_access_data(array('file_access_lock'=>'no'),array('file_name'=>'robots.txt'));
							$return['success']='File has been closed';
							$return['redirect']=$this->data['admin_base_url'].'/dashboard';
		            	}else{
		            		$return['error']='File can only closed by the user last updating and last IP opened.';
		            	}		            	
		            }
			            

		            $this->output
		                ->set_content_type('application/json')
		                ->set_output(json_encode($return));

		        } else {
		            $return['redirect'] = $this->data['admin_base_url'];
		            $this->output
		                ->set_content_type('application/json')
		                ->set_output(json_encode($return));
		        }
		    } else {
		        $return['redirect'] = $this->data['admin_base_url'];
		        $this->output
		            ->set_content_type('application/json')
		            ->set_output(json_encode($return));
		    }
		}



		public function onUpdateCollegeSearchListOrder(){
			if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
				if ($this->input->is_ajax_request() && $this->input->method() == 'post') {

					$college_ids=$this->input->post('colleges');
					if(!empty($college_ids)){
						foreach ($college_ids as $key => $value) {
							$this->im->update_college_data(array('college_short_order'=>$value['order']),array('college_user_id'=>$value['college_id']));
						}
					}

					$return['success']='Updated';

					json_headers($return);

				}else{
					$return['redirect'] = $this->data['admin_base_url'];
		        	$this->output
		            ->set_content_type('application/json')
		            ->set_output(json_encode($return));
				}
			}else{
				$return['redirect'] = $this->data['admin_base_url'];
		        $this->output
		            ->set_content_type('application/json')
		            ->set_output(json_encode($return));
			}
		}



}