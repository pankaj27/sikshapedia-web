<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Common  extends BaseAdminController
{
	function __construct()
    {
        parent::__construct();
        $this->load->model('blogs_model','bm');
    }

	public function onGetStates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');
				$listing_type=post_data('listing_type');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				//echo $decrypted[1];die;

				$country=decode_data(clean_data($decrypted[0]));


				//echo $country;die;

				$states=$this->com->get_states(array('state_country_id'=>$country,'state_status'=>'1'),'state_serial','ASC');

				//print_obj($states);die;

				if(!empty($states)){
					

					if($listing_type=='2'){
						foreach ($states as $key => $value) {
							$__states[]=array(
								'state_id'=>encode_data($value->state_id),
								'state_name'=>$value->state_name
							);
						}
						$_states=array_chunk($__states, 4);
					}else{
						foreach ($states as $key => $value) {
							$_states[]=array(
								'state_id'=>encode_data($value->state_id),
								'state_name'=>$value->state_name
							);
						}
					}

				}else{
					$_states=array();
				}

				$this->data['states']=$_states;
				$this->data['listing_type']=$listing_type;

				$return['html']=$this->theme->view('_pages/common/vw_states_dyna',$this->data,true);

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

	public function onGetInstituteStates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country_id=post_data('country_id');

				$states=$this->com->get_institute_states(array('college_country_id'=>$country_id,'college_state_id!='=>'0'));

				$return['states']=$states;

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

	public function onGetDistricts(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				//echo $decrypted[1];die;

				$country=decode_data(clean_data($decrypted[0]));
				$state=decode_data(clean_data($decrypted[1]));

				//echo $country;die;

				$districts=$this->com->get_district(array('district_country_id'=>$country,'district_state_id'=>$state,'district_status'=>'1'),FALSE,'district_id','ASC');

				//print_obj($states);die;

				if(!empty($districts)){
					foreach ($districts as $key => $value) {
						$_districts[]=array(
							'district_id'=>encode_data($value->district_id),
							'district_name'=>$value->district_name
						);
					}
				}else{
					$_districts=array();
				}

				$this->data['districts']=$_districts;

				$return['html']=$this->theme->view('_pages/common/vw_districts_dyna',$this->data,true);

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

	public function onGetCities(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$country=decode_data(clean_data($decrypted[0]));
				$state=decode_data(clean_data($decrypted[1]));
				//$district=decode_data(clean_data($decrypted['_district']));

				if(isset($district)){
					$cities=$this->com->get_districts(array('city_country_id'=>$country,'city_state_id'=>$state,'city_district_id'=>$district,'city_status'=>'1'),'city_serial','ASC');
				}else{

					$cities=$this->com->get_city(array('city_country_id'=>$country,'city_state_id'=>$state,'city_status'=>'1'),FALSE,'city_serial','ASC');
				}

				

				if(!empty($cities)){
					foreach ($cities as $key => $value) {
						$_cities[]=array(
							'city_id'=>encode_data($value->city_id),
							'city_name'=>$value->city_name
						);
					}
				}else{
					$_cities=array();
				}

				$this->data['cities']=$_cities;

				$return['html']=$this->theme->view('_pages/common/vw_cities_dyna',$this->data,true);

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


	public function onGetInstituteCities(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$state_id=post_data('state_id');

				$cities=$this->com->get_institute_cities(array('college_state_id'=>$state_id,'college_city_id!='=>'0'));

				//print_obj($cities);die;

				$return['cities']=$cities;

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

	public function onGetUniversities(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				//echo $decrypted[1];die;

				$_state=clean_data($decrypted[1]);
				$_city=clean_data($decrypted[2]);

				$country=decode_data(clean_data($decrypted[0]));
				$state=($_state!='')?decode_data($_state):'0';
				$city=($_city!='')?decode_data($_city):'0';

				//echo $country;die;

				if($state!='0' && $city!='0'){
					$param=array('country_id'=>$country,'state_id'=>$state,'city_id'=>$city,'status'=>'1');
					$universities=$this->im->get_universities(null,$param);
				}else if($state!='0' && $city=='0'){
					$param=array('country_id'=>$country,'state_id'=>$state,'status'=>'1');
					$universities=$this->im->get_universities(null,$param);
				}else{
					$param=array('country_id'=>$country,'status'=>'1');
					$universities=$this->im->get_universities(null,$param);
				}

				

				//print_obj($states);die;

				if(!empty($universities)){
					foreach ($universities as $key => $value) {
						$_universities[]=array(
							'university_id'=>encode_data($value->university_user_id),
							'university_name'=>$value->university_name
						);
					}
				}else{
					$_universities=array();
				}

				$this->data['universities']=$_universities;

				$return['html']=$this->theme->view('_pages/common/vw_universities_dyna',$this->data,true);

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

	public function onGetStatuetoryBodies(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$country=decode_data(clean_data($decrypted[0]));



				$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$country),FALSE);
				if(!empty($affiliation_types)){
					foreach ($affiliation_types as $key => $value) {
						$_affiliation_types[]=array(
							'statutory_body_id'=>encode_data($value->statutory_body_id),
							'statutory_body_abbr'=>$value->statutory_body_abbr,
							'statutory_body_name'=>$value->statutory_body_name
						);
					}
				}else{
					$_affiliation_types=array();
				}

				$this->data['affiliation_types']=$_affiliation_types;

				$return['html']=$this->theme->view('_pages/common/vw_affiliations_dyna',$this->data,true);

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

	public function onGetColleges(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				if($this->input->post('view_param')){
					$view_param=post_data('view_param');
				}

				$country_id=post_data('country_id');

				$country=decode_data($country_id);

				//echo $country;die;

				$param=array('country_id'=>$country,'status'=>'1');
				$colleges=$this->im->_get_colleges(null,$param);

				

				//print_obj($states);die;

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {
						$_colleges[]=array(
							'college_id'=>encode_data($value->college_user_id),
							'college_name'=>$value->college_name
						);
					}
				}else{
					$_colleges=array();
				}


				if(isset($view_param) && $view_param=='json'){
					$return['colleges']=$_colleges;
				}else{
					$this->data['colleges']=$_colleges;

					$return['html']=$this->theme->view('_pages/common/vw_colleges_dyna',$this->data,true);
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

	public function onGetStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$exam_id=post_data('_exam');

				//echo $exam_id;die;

				if(!empty($exam_id)){
					$exid=decode_data($exam_id);

					//echo $exid;

					$get_exam_data=$this->strm->get_exam(array('exam_id'=>$exid));

					//print_obj($get_exam_data);die;

					if(!empty($get_exam_data)){
						$exam_streams=char_separated_to_array($get_exam_data->exam_stream_id);
					}
				}

				// print_obj($exam_streams);die;
					

				$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

				//print_obj($streams);die;

				if(!empty($streams)){
					
					foreach ($streams as $key => $value) {
						if(isset($exam_streams)){
							//echo 'got';echo $exam_streams[0];die;
							if(count($exam_streams)==1){
								if($value->stream_id==$exam_streams[0]){
									//echo 'hi';die;
									$selected='checked';
								}else{
									//echo 'hi2';die;
									$selected='';
								}
								
							}else if(count($exam_streams)>1){
								if(in_array($value->stream_id, $exam_streams)){
									//echo 'hi3';die;
									$selected='checked';
								}else{
									//echo 'hi4';die;
									$selected='';
								}
							}
						}else{
							//echo 'hi5';die;
							$selected='';
						}
						$_streams[]=array(
							'stream_id'=>encode_data($value->stream_id),
							'stream_name'=>$value->stream_name,
							'selected'=>$selected
						);
					}
				}else{
					$_streams=array();
				}

				$this->data['exams_streams']=$_streams;

				$return['html']=$this->theme->view('_pages/common/vw_exams_streams_dyna',$this->data,true);

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


	public function onGetInstituteStreams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country_id=post_data('country_id');
				$state_id=post_data('state_id');
				$city_id=post_data('city_id');

				/*
				if($state_id==0 && $city_id==0){
					$streams=$this->strm->get_inst_streams(array('college_country_id'=>$country_id));
				}else if($state_id!=0 && $city_id==0){
					$streams=$this->strm->get_inst_streams(array('college_country_id'=>$country_id,'college_state_id'=>$state_id));
				}if($state_id!=0 && $city_id!=0){
					$streams=$this->strm->get_inst_streams(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id));
				}
				*/

				$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);

				//$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

				//print_obj($streams);die;

				$return['streams']=$streams;

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

	public function onGetStreamCourses(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$stream_id=post_data('_stream');

				//echo $exam_id;die;

				if(!empty($stream_id)){
					$strmid=decode_data($stream_id);

					$param['column_search'] = array('course_name','course_short_name');
					$param['order'] = array('course_id' => 'ASC');
					

					$param['course_stream']=decode_data($stream_id);

					$courses = $this->strm->_get_courses(NULL,$param,FALSE,FALSE);

					if(!empty($courses)){
						foreach ($courses as $key => $value) {
							$_courses[]=array(
								'course_id'=>$value->course_id,
								'course_name'=>$value->course_name.' ['.$value->course_short_name.']'
							);
						}
					}
				}else{
					$_courses=array();
				}


				$this->data['courses']=$_courses;

				$return['html']=$this->theme->view('_pages/common/vw_streams_courses_dyna',$this->data,true);

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


	public function onGetInstituteStreamCourses(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country_id=post_data('country_id');
				$state_id=post_data('state_id');
				$city_id=post_data('city_id');
				$stream_id=post_data('stream_id');

				if($state_id==0 && $city_id==0){
					$courses=$this->strm->get_inst_streams_courses(array('college_country_id'=>$country_id,'user_course_stream'=>$stream_id));
				}else if($state_id!=0 && $city_id==0){
					$courses=$this->strm->get_inst_streams_courses(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'user_course_stream'=>$stream_id));
				}if($state_id!=0 && $city_id!=0){
					$courses=$this->strm->get_inst_streams_courses(array('college_country_id'=>$country_id,'college_state_id'=>$state_id,'college_city_id'=>$city_id,'user_course_stream'=>$stream_id));
				}

				$return['courses']=$courses;

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

	public function onGetExams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$country_id=post_data('country_id');

				$country=decode_data($country_id);

				$_exams=array();

				$exams=$this->strm->get_exam(array('exam_country'=>$country),FALSE,'exam_id','ASC');

				// print_obj($exams);die;

				if(!empty($exams)){
					foreach ($exams as $key => $value) {
						$_exams[]=array(
							'exam_id'=>encode_data($value->exam_id),
							'exam_name'=>$value->exam_full_name,
							'exam_short_name'=>$value->exam_short_name
						);
					}
				}


				$return['exams']=$_exams;


				//print_obj($return);die;

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


	public function onGetCollegeExams(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=post_data('college_id');

				$college_id=decode_data($college_id);

				$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

				if(!empty($college_data->college_exam_ids)){
					$college_exams=char_separated_to_array($college_data->college_exam_ids);
				}else{
					$college_exams=array();
				}

				$_exams=array();

				$exams=$this->strm->get_exam(array('exam_status'=>'1'),FALSE,'exam_id','ASC');

				// print_obj($exams);die;

				if(!empty($exams)){
					foreach ($exams as $key => $value) {
						$_exams[]=array(
							'exam_id'=>encode_data($value->exam_id),
							'exam_name'=>$value->exam_full_name,
							'selected'=>(!empty($college_exams) && (in_array($value->exam_id, $college_exams)))?'selected':''
						);
					}
				}


				$return['exams']=$_exams;


				//print_obj($return);die;

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


	public function onGetPlacementCompanies(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_placement_companies=$this->im->get_placement_companies(array('placement_company_status'=>'1'),FALSE);

				if(!empty($_placement_companies)){
					foreach ($_placement_companies as $key => $value) {
						$placement_companies[]=array(
							'placement_company_id'=>$value->placement_company_id,
							'placement_company_name'=>$value->placement_company_name
						);
					}
				}else{
					$placement_companies=array();
				}

				$return['placement_companies']=$placement_companies;

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

	public function onGetBroucherTypes(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$college_id=decode_data(post_data('college_id'));

				$_broucher_type=$this->sm->get_broucher_types(array('broucher_type_status'=>'1','broucher_type_creator'=>$college_id),FALSE);

				if(!empty($_broucher_type)){
					foreach ($_broucher_type as $key => $value) {
						$broucher_type[]=array(
							'broucher_type_id'=>$value->broucher_type_id,
							'broucher_type_name'=>$value->broucher_type_name
						);
					}
				}else{
					$broucher_type=array();
				}

				$return['broucher_types']=$broucher_type;

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



	/**Link LIsts for TinyMCE**/

	public function onGetLinkList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){

				$search_tag=$this->input->get('search_tag');
				$search_from=$this->input->get('search_from');

				$_college_links=array();
				$_exam_links=array();
				$_course_links=array();

				// $exams=$this->strm->_get_exam(array('exam_status'=>'1'),NULL,FALSE);

				if($search_from=='exam'){
					$exams=$this->strm->__get_exams(array('exam_short_name'=>$search_tag));

					if(!empty($exams)){
						foreach ($exams as $key => $value) {
							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
							$_exam_links[]=array(
								'title'=>$value->exam_short_name,
								'value'=>base_url('exams/'.$exam_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_exam_links))?json_encode($_exam_links):'';
				}else if($search_from=='college'){
					$colleges=$this->im->__get_colleges(array('college_name'=>$search_tag),4);

					//$colleges_inner_menues=$this->sm->get_menues(array('menu_link_type'=>'10'));

					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {
							$_college_links[]=array(
								'title'=>$value->college_name,
								'value'=>$value->access_url
							);
						}
					}

					$return['link_list']=(!empty($_college_links))?json_encode($_college_links):'';
				}else if($search_from=='universities'){
					$colleges=$this->im->__get_colleges(array('college_name'=>$search_tag),3);

					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {
							$_college_links[]=array(
								'title'=>$value->college_name,
								'value'=>$value->access_url
							);
						}
					}

					$return['link_list']=(!empty($_college_links))?json_encode($_college_links):'';
				}
				else if($search_from=='courses'){
					$courses=$this->strm->__get_courses(array('course_name'=>$search_tag),array('course_short_name'=>$search_tag));

					if(!empty($courses)){
						foreach ($courses as $key => $value) {
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));

							$_course_name=($value->course_short_name!=null)?$value->course_name.' [ '.$value->course_short_name.' ]':$value->course_name;

							if($value->course_is_lateral=='1'){
								if($value->course_is_honors=='1'){
									$course_name=$_course_name.'{ Lateral (Hons.) }';
								}else{							
									$course_name=$_course_name.'{ Lateral }';
								}
							}else{
								if($value->course_is_honors=='1'){
									$course_name=$_course_name.'{ Hons. }';
								}else{							
									$course_name=$_course_name;
								}
							}


							$_course_links[]=array(
								'title'=>$_course_name,
								'value'=>base_url('courses/'.$course_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_course_links))?json_encode($_course_links):'';
				}else if($search_from=='streams'){
					$streams=$this->strm->__get_streams(array('stream_name'=>$search_tag));

					if(!empty($streams)){
						foreach ($streams as $key => $value) {
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
							$_stream_links[]=array(
								'title'=>$value->stream_name,
								'value'=>base_url('courses/'.$stream_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_stream_links))?json_encode($_stream_links):'';
				}else if($search_from=='college_menues'){
					$courses=$this->strm->__get_courses(array('course_name'=>$search_tag),array('course_short_name'=>$search_tag));

					

					if(!empty($courses)){
						foreach ($courses as $key => $value) {
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));
							$_course_links[]=array(
								'title'=>$value->course_short_name,
								'value'=>base_url('courses/'.$course_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_course_links))?json_encode($_course_links):'';
				}else if($search_from=='blogs'){

					if(!empty($search_tag)){
						$blogs=$this->bm->__get_blog_data(array('post_title'=>$search_tag),array('post_name'=>$search_tag,'blog_category_name'=>$search_tag));
					}else{
						$blogs=$this->bm->__get_blog_data(null);
					}

					

					if(!empty($blogs)){
						foreach ($blogs as $key => $value) {
							$blog_slug=$this->sm->get_slug(array('slug_type'=>'40','slug_type_id'=>$value->post_id));
							$_blog_links[]=array(
								'title'=>$value->post_title.' [ '.date('F d , Y',strtotime($value->post_created_at)).']',
								'value'=>base_url('blog/'.$blog_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_blog_links))?json_encode($_blog_links):'';
				}else if($search_from=='news'){
					if(!empty($search_tag)){
						$news=$this->nm->__get_news(array('news_title'=>$search_tag),false,100,0,);
					}else{
						$news=$this->nm->__get_news(null,false,100,0,);
					}					

					if(!empty($news)){
						foreach ($news as $key => $value) {
							$news_slug=$this->sm->get_slug(array('slug_type'=>'11','slug_type_id'=>$value->news_id));
							$_news_links[]=array(
								'title'=>$value->news_title.' [ '.date('F d , Y',strtotime($value->created_at)).']',
								'value'=>base_url('news/'.$news_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_news_links))?json_encode($_news_links):'';
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

	public function onGetExamsLinkList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){

				$search_tag=$this->input->get('search_tag');
				$search_from=$this->input->get('search_from');

				$_college_links=array();
				$_exam_links=array();
				$_course_links=array();

				// $exams=$this->strm->_get_exam(array('exam_status'=>'1'),NULL,FALSE);

				if($search_from=='exam'){
					$exams=$this->strm->__get_exams(array('exam_short_name'=>$search_tag));

					if(!empty($exams)){
						foreach ($exams as $key => $value) {
							$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
							$_exam_links[]=array(
								'title'=>$value->exam_short_name,
								'value'=>base_url('exams/'.$exam_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_exam_links))?json_encode($_exam_links):'';
				}else if($search_from=='college'){
					$colleges=$this->im->__get_colleges(array('college_name'=>$search_tag),4);

					//$colleges_inner_menues=$this->sm->get_menues(array('menu_link_type'=>'10'));

					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {
							$_college_links[]=array(
								'title'=>$value->college_name,
								'value'=>$value->access_url
							);
						}
					}

					$return['link_list']=(!empty($_college_links))?json_encode($_college_links):'';
				}else if($search_from=='universities'){
					$colleges=$this->im->__get_colleges(array('college_name'=>$search_tag),4);

					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {
							$_college_links[]=array(
								'title'=>$value->college_name,
								'value'=>$value->access_url
							);
						}
					}

					$return['link_list']=(!empty($_college_links))?json_encode($_college_links):'';
				}
				else if($search_from=='courses'){
					$courses=$this->strm->__get_courses(array('course_name'=>$search_tag),array('course_short_name'=>$search_tag));

					if(!empty($courses)){
						foreach ($courses as $key => $value) {
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));

							$_course_name=($value->course_short_name!=null)?$value->course_name.' [ '.$value->course_short_name.' ]':$value->course_name;

							if($value->course_is_lateral=='1'){
								if($value->course_is_honors=='1'){
									$course_name=$_course_name.'{ Lateral (Hons.) }';
								}else{							
									$course_name=$_course_name.'{ Lateral }';
								}
							}else{
								if($value->course_is_honors=='1'){
									$course_name=$_course_name.'{ Hons. }';
								}else{							
									$course_name=$_course_name;
								}
							}


							$_course_links[]=array(
								'title'=>$_course_name,
								'value'=>base_url('courses/'.$course_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_course_links))?json_encode($_course_links):'';
				}else if($search_from=='streams'){
					$streams=$this->strm->__get_streams(array('stream_name'=>$search_tag));

					if(!empty($streams)){
						foreach ($streams as $key => $value) {
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
							$_stream_links[]=array(
								'title'=>$value->stream_name,
								'value'=>base_url('courses/'.$stream_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_stream_links))?json_encode($_stream_links):'';
				}else if($search_from=='college_menues'){
					$courses=$this->strm->__get_courses(array('course_name'=>$search_tag),array('course_short_name'=>$search_tag));

					

					if(!empty($courses)){
						foreach ($courses as $key => $value) {
							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));
							$_course_links[]=array(
								'title'=>$value->course_short_name,
								'value'=>base_url('courses/'.$course_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_course_links))?json_encode($_course_links):'';
				}else if($search_from=='blogs'){
					$blogs=$this->bm->__get_blog_data(array('post_title'=>$search_tag),array('post_name'=>$search_tag,'blog_category_name'=>$search_tag));

					if(!empty($blogs)){
						foreach ($blogs as $key => $value) {
							$blog_slug=$this->sm->get_slug(array('slug_type'=>'40','slug_type_id'=>$value->post_id));
							$_blog_links[]=array(
								'title'=>$value->post_title.' [ '.date('F d , Y',strtotime($value->post_created_at)).']',
								'value'=>base_url('blog/'.$blog_slug->slug_value)
							);
						}
					}

					$return['link_list']=(!empty($_blog_links))?json_encode($_blog_links):'';
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
	
}