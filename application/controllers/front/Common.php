<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Common  extends BaseFrontController{

	function __construct()
	{

		parent::__construct();

	    // $this->load->model(array('settings_model'=>'sm','user_model'=>'um','stream_model'=>'strm','institution_model'=>'im','country_model'=>'com'));

	    $this->load->model(array('user_model'=>'um','stream_model'=>'strm','country_model'=>'com'));
	}

	public function onGetCountries_old(){

					// $userdata='';

					// if(isset($this->data['userdata']) && !empty($this->data['userdata'])){
					// 	$userdata=$this->data['userdata'];
					// }

					// $c=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

					// if(!empty($c)){
			  //         foreach ($c as $key => $value) {
			  //           $countries[]=array(
			  //             'country_id'=>encode_data($value->country_id),
			  //             'country_name'=>$value->country_name,
			  //             'selected'=>((!empty($userdata)) && ($value->country_id==$userdata->user_country))?'selected':''
			  //           );
			  //         }
			  //       }

					// header('Content-Type: application/json; charset=utf-8');

					//echo json_encode($countries);

		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$url=API_URL.'coapi/countries/yes';
	    $curl_param['url']=$url;
	    $curl_param['headers']='';
	    $curl_param['auth_user']=API_GEN_AUTH_USER;
	    $curl_param['auth_pass']=API_GEN_AUTH_PASS;
	    $curl_param['ssl_verify']='1';
	    $curl_param['ssl_verify_peer']=true;
	    //$curl_param['data']=$userdata;

	    $response=_curl_get($curl_param,FALSE);

			echo $response['response'];
		}else{
			redirect(base_url());
		}
		
	}


	public function onGetCountries(){
		$countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

		foreach ($countries as $key => $value) {
			$countries_data[]=array(
                'country_id'=>encode_data($value->country_id),
                'country_name'=>$value->country_name,
                'country_code'=>$value->country_phone_code
            );
		}

		json_headers($countries_data);
	}

	public function onGetStates($country_id){

		//echo $country_id;die;

		//if($country_id!==null){

            if(is_string($country_id)){
                $c_id=decode_data($country_id);
            }else{
                $c_id=$country_id;
            }

            //echo $c_id;die;

            $states=$this->com->get_states(array('state_status'=>'1','state_country_id'=>$c_id),'state_serial','ASC');

            //print_obj($states);

            if(!empty($states)){

                foreach ($states as $key => $value) {
                    $states_data[]=array(
                        'state_id'=>encode_data($value->state_id),
                        'state_name'=>$value->state_name,
                        'state_name_slug'=>$value->state_name_slug
                    );
                }
            }

            json_headers($states_data);
        //}
	}

	public function onGetStates_old($country){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$url=API_URL.'coapi/country_states/'.$country;
		    $curl_param['url']=$url;
		    $curl_param['headers']='';
		    $curl_param['auth_user']=API_GEN_AUTH_USER;
		    $curl_param['auth_pass']=API_GEN_AUTH_PASS;
		    $curl_param['ssl_verify']='1';
		    $curl_param['ssl_verify_peer']=true;
		    //$curl_param['data']=$userdata;

		    $response=_curl_get($curl_param,FALSE);

				echo $response['response'];
			}else{
				redirect(base_url());
		}


		//if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			// $ctext=post_data('ctext');

			// $security_token = $this->data['security_token'];

			// $decrypted = CryptoJsAes::decrypt($ctext, $security_token);

			// //echo $decrypted[1];die;

			// $country=decode_data(clean_data($decrypted[0]));


			// //echo $country;die;

			// $states=$this->com->get_states(array('state_country_id'=>$country,'state_status'=>'1'),'state_serial','ASC');

			// //print_obj($states);die;

			// if(!empty($states)){
			// 	foreach ($states as $key => $value) {
			// 		$_states[]=array(
			// 			'state_id'=>encode_data($value->state_id),
			// 			'state_name'=>$value->state_name
			// 		);
			// 	}
			// }else{
			// 	$_states=array();
			// }

			// $this->data['states']=$_states;

			// if(isset($decrypted[1])){
			// 	$this->data['control_type']=clean_data($decrypted[1]);
			// }else{
			// 	$this->data['control_type']='selectbox';
			// }

			// $return['html']=$this->theme->view('_pages/common/vw_states_dyna',$this->data,true);

			// header('Content-Type: application/json; charset=utf-8');

			// echo json_encode($return);


			

		// }else{
		// 	redirect(base_url());
		// }
	}

	public function onGetDistricts(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$ctext=post_data('ctext');

			$security_token = $this->data['security_token'];

			$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

			$country=decode_data(clean_data($decrypted[0]));
			$state=decode_data(clean_data($decrypted[0]));

			$districts=$this->com->get_districts(array('district_country_id'=>$country,'district_state_id'=>$state,'district_status'=>'1'),'district_serial','ASC');

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

		}else{
			redirect(base_url());
		}
	}

	public function onGetCitiesold($country,$state){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$url=API_URL.'coapi/state_cities/'.$country.'/'.$state;
		    $curl_param['url']=$url;
		    $curl_param['headers']='';
		    $curl_param['auth_user']=API_GEN_AUTH_USER;
		    $curl_param['auth_pass']=API_GEN_AUTH_PASS;
		    $curl_param['ssl_verify']='1';
		    $curl_param['ssl_verify_peer']=true;
		    //$curl_param['data']=$userdata;

		    $response=_curl_get($curl_param,FALSE);

				echo $response['response'];
			}else{
				redirect(base_url());
		}
	}

	public function onGetCities(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			$_country=post_data('_co');
			$_state=post_data('_st');

			if(!is_numeric($_country)){
				$_country=decode_data($_country);
			}

			if(!is_numeric($_state)){
				$_state=decode_data($_state);
			}


			$searched_data=array();
			$cities=array();

            $cities=$this->com->__get_city('city_id,city_name,city_country_id,city_state_id',array('city_country_id'=>$_country,'city_state_id'=>$_state,'city_status'=>'1'),FALSE);

            foreach ($cities as $key => $value) {
            	$searched_data['searched_cities'][]=array(
            		'city_id'=>$value->city_id,
            		'city_name'=>$value->city_name,
            		'selected'=>''
            	);
            }

            json_headers($searched_data);

		}else{
			redirect(base_url());
		}
	}

	public function _onGetCities(){
		//if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$_country=$this->input->get('_co');
			$_state=$this->input->get('_st');

			if(!is_numeric($_country)){
				$_country=decode_data($_country);
			}

			if(!is_numeric($_state)){
				$_state=decode_data($_state);
			}


			$searched_data=array();
			$cities=array();

            $cities=$this->com->__get_city('city_id,city_name,city_country_id,city_state_id',array('city_country_id'=>$_country,'city_state_id'=>$_state,'city_status'=>'1'),FALSE);

            foreach ($cities as $key => $value) {
            	$searched_data['searched_cities'][]=array(
            		'city_id'=>$value->city_id,
            		'city_name'=>$value->city_name
            	);
            }

            json_headers($searched_data);

		// }else{
		// 	redirect(base_url());
		// }
	}


	public function __onGetCities(){
		$_country=$this->input->get('_co');
		if(!is_numeric($_country)){
			$_country=decode_data($_country);
		}

		$searched_data=array();
		$cities=array();

        $cities=$this->com->__get_city('city_id,city_name,city_country_id,city_state_id',array('city_country_id'=>$_country,'city_status'=>'1'),FALSE);

        foreach ($cities as $key => $value) {
        	$searched_data['searched_cities'][]=array(
        		'city_id'=>$value->city_id,
        		'city_name'=>$value->city_name
        	);
        }

        json_headers($searched_data);

	}

	public function onLoadAccountPages(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				if(!empty($this->data['userdata'])){
					$user_id=decode_data(session_userdata('user_id'));
					$userdata=$this->data['userdata'];
					$user_role=decode_data(session_userdata('user_role'));
					$ctext=post_data('ctext');

					$security_token = $this->data['security_token'];

					$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

					$page_type=clean_data($decrypted[0]);

					$states=$this->com->get_states(array('state_country_id'=>$userdata->user_country,'state_status'=>'1'),'state_serial','ASC');

					if(!empty($states)){
						foreach ($states as $key => $value) {
							$_states[]=array(
								'state_id'=>encode_data($value->state_id),
								'state_name'=>$value->state_name
							);
						}
					}else{
						$_states=array();
					}

					$this->data['states']=$_states;


					if($user_role==0){
						$return['html']=$this->theme->view('_pages/account/vw_account_profile_basic_info_dyna',$this->data,true);
					}else if($user_role==3){
						if($page_type=='general_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_profile_basic_info_dyna',$this->data,true);
						}else if($page_type=='page_settings'){

							$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

				          if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
				            $this->data['user_logo']=$user_logo->media_disk_path_relative;
				          }else{
				            $this->data['user_logo']=base_url().'uploads/app/default/no.jpg';
				          }


					          $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

					          if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
					            $this->data['user_banner']=$user_banner->media_disk_path_relative;
					          }else{
					            $this->data['user_banner']=base_url().'uploads/app/default/pageBnr.jpg';
					          }

							$return['html']=$this->theme->view('_pages/account/vw_account_university_profile_page_settings_dyna',$this->data,true);
						}else if($page_type=='info_settings'){
							$institue_types=$this->im->get_institute_types(null,FALSE);
							if(!empty($institue_types)){
								foreach ($institue_types as $key => $value) {
									$selcted=(!empty($this->data['userdata']->user_type) && ($this->data['userdata']->user_type==$value->inst_type))?'selected':'';
									$_institue_types[]=array(
										'inst_type'=>encode_data($value->inst_type),
										'inst_type_name'=>$value->inst_type_name,
										'selected'=>$selcted
									);
								}
							}else{
								$_institue_types=array();
							}

							$this->data['institue_types']=$_institue_types;

							$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$this->data['userdata']->user_country),FALSE);
							if(!empty($affiliation_types)){
								foreach ($affiliation_types as $key => $value) {
									$selcted=(!empty($this->data['userdata']->user_affiliation_type) && in_array($value->statutory_body_id, char_separated_to_array($this->data['userdata']->user_affiliation_type)))?'checked':'';
									$_affiliation_types[]=array(
										'statutory_body_id'=>encode_data($value->statutory_body_id),
										'statutory_body_abbr'=>$value->statutory_body_abbr,
										'statutory_body_name'=>$value->statutory_body_name,
										'selected'=>$selcted
									);
								}
							}else{
								$_affiliation_types=array();
							}

							$this->data['affiliation_types']=$_affiliation_types;

							$ranking_types=$this->im->get_ranking_types(null,FALSE);
							if(!empty($ranking_types)){
								foreach ($ranking_types as $key => $value) {
									$_ranking_types[]=array(
										'rank_id'=>encode_data($value->rank_id),
										'rank_body'=>$value->rank_body,
										'rank_value'=>$value->rank_value
									);
								}
							}else{
								$_ranking_types=array();
							}

							$this->data['ranking_types']=$_ranking_types;

							$this->data['years_5_back']=date('Y')-5;
							$this->data['current_year']=date('Y');

							$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

					        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
					            $this->data['user_logo']=$user_logo->media_disk_path_relative;
					        }else{
					            $this->data['user_logo']=base_url().'uploads/app/default/no.jpg';
					        }


					        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

					        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
					            $this->data['user_banner']=$user_banner->media_disk_path_relative;
					        }else{
					            $this->data['user_banner']=base_url().'uploads/app/default/pageBnr.jpg';
					        }

							$return['html']=$this->theme->view('_pages/account/vw_account_university_info_settings_dyna',$this->data,true);
						}else if($page_type=='ranking_settings'){

							$ranking_types=$this->im->get_ranking_types(null,FALSE);
							if(!empty($ranking_types)){
								foreach ($ranking_types as $key => $value) {
									$_ranking_types[]=array(
										'rank_id'=>encode_data($value->rank_id),
										'rank_body'=>$value->rank_body,
										'rank_value'=>$value->rank_value
									);
								}
							}else{
								$_ranking_types=array();
							}

							$this->data['ranking_types']=$_ranking_types;

							$this->data['years_5_back']=date('Y')-5;
							$this->data['current_year']=date('Y');

							$return['html']=$this->theme->view('_pages/account/vw_account_university_ranking_settings_dyna',$this->data,true);
						}else if($page_type=='course_settings'){
							$courses=$this->strm->get_course(array('course_status'=>'1'),FALSE);
							if(!empty($courses)){
								foreach ($courses as $key => $value) {
									$course_name=($value->course_short_name!='')?$value->course_name.'('.$value->course_short_name.')':$value->course_name;
									$_courses[]=array(
										'course_id'=>encode_data($value->course_id),
										'course_name'=>$course_name,
										'course_short_name'=>$value->course_short_name,
										'course_type'=>$value->course_type,
										'course_passed_type'=>$value->course_passed_type
									);
								}
							}else{
								$_courses=array();
							}

							$currencies=$this->com->get_currency(array('currency_status'=>'1'),FALSE);
							if(!empty($currencies)){
								foreach ($currencies as $key => $value) {
									$currency_code=($value->currency_symbol_left!='')?$value->currency_symbol_left.'-'.$value->currency_code:$value->currency_code.'-'.$value->currency_symbol_right;
									$_currencies[]=array(
										'currency_id'=>encode_data($value->currency_id),
										'currency_code'=>$currency_code
									);
								}
							}else{
								$_currencies=array();
							}


							$this->data['course_duration_years']=array('1','2','3','4','5','6');
							$this->data['course_duration_months']=array('1','2','3','4','5','6','7','8');
							$this->data['course_types']=array('Doctorate','Degree','Diploma','Certificate');
							$this->data['course_pass_types']=array('Phd','Post Graduation','Graduation','Diploma','Certificate');
							$this->data['placement_types']=array('On Campus','Off Campus');
							$this->data['duration_types']=array('Full Time','Part Time');

							$this->data['courses']=$_courses;
							$this->data['currencies']=$_currencies;

							$this->data['user_currency_symbol_side']=($this->data['userdata']->currency_symbol_left!='')?'1':'2';
							$this->data['user_currency']=($this->data['userdata']->currency_symbol_left!='')?$this->data['userdata']->currency_symbol_left:$this->data['userdata']->currency_symbol_right;

							$return['html']=$this->theme->view('_pages/account/vw_account_university_course_settings_dyna',$this->data,true);
						}else if($page_type=='admission_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_admission_settings_dyna',$this->data,true);
						}else if($page_type=='placement_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_placement_settings_dyna',$this->data,true);
						}else if($page_type=='gallery_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_gallery_settings_dyna',$this->data,true);
						}else if($page_type=='result_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_result_settings_dyna',$this->data,true);
						}else if($page_type=='cut_off_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_cut_offs_settings_dyna',$this->data,true);
						}else if($page_type=='faculty_settings'){
							$departments=$this->im->get_departments(array('department_type'=>'1','department_type_id'=>$user_id),FALSE);
							if(!empty($departments)){
								foreach ($departments as $key => $value) {
									$_departments[]=array(
										'department_id'=>encode_data($value->department_id),
										'department_name'=>$value->department_name,
										'selected'=>''
									);
								}
							}else{
								$_departments=array();
							}


							$subjects=$this->im->get_subjects(array('subject_status'=>'1'),FALSE);
							if(!empty($subjects)){
								foreach ($subjects as $key => $value) {
									$_subjects[]=array(
										'subject_id'=>encode_data($value->subject_id),
										'subject_name'=>$value->subject_name,
										'selected'=>''
									);
								}
							}else{
								$_subjects=array();
							}

							$designations=$this->im->get_designations(null,FALSE);
							if(!empty($designations)){
								foreach ($designations as $key => $value) {
									$_designations[]=array(
										'designation_id'=>encode_data($value->designation_id),
										'designation_name'=>$value->designation_name
									);
								}
							}else{
								$_designations=array();
							}

							$qualifications=$this->im->get_qualifications(array('qualification_status'=>'1'),FALSE);
							if(!empty($qualifications)){
								foreach ($qualifications as $key => $value) {
									$_qualifications[]=array(
										'qualification_id'=>encode_data($value->qualification_id),
										'qualification_name'=>$value->qualification_name,
										'selected'=>''
									);
								}
							}else{
								$_qualifications=array();
							}

							$this->data['qualifications']=$_qualifications;
							$this->data['subjects']=$_subjects;
							$this->data['departments']=$_departments;
							$this->data['designations']=$_designations;

							$return['html']=$this->theme->view('_pages/account/vw_account_university_faculty_settings_dyna',$this->data,true);
						}else if($page_type=='department_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_department_settings_dyna',$this->data,true);
						}else if($page_type=='scholarships_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_scholarships_settings_dyna',$this->data,true);
						}else if($page_type=='colleges_settings'){
							$return['html']=$this->theme->view('_pages/account/vw_account_university_colleges_settings_dyna',$this->data,true);
						}
					}else if($user_role==4){

					}else if($user_role==8){

					}
				}else{
					redirect(base_url());
				}

					

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}

	public function onGetCitiesStatewise(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			$country=post_data('_co');
			$country_id=decode_data($country);
			

			$states=$this->com->get_states(array('state_country_id'=>$country_id,'state_status'=>'1'),'state_serial','ASC');

			if(!empty($states)){
				foreach ($states as $key => $value) {
					$cities=$this->com->get_city(array('city_country_id'=>$country_id,'city_state_id'=>$value->state_id,'city_status'=>'1'),FALSE,'city_serial','ASC');

					if(!empty($cities)){
						foreach ($cities as $k => $v) {
							$_cities[$value->state_name][]=array(
								'city_id'=>encode_data($v->city_id),
								'city_name'=>$v->city_name
							);
						}							
					}						
				}
			}else{
				$_cities=array();
			}

			$this->data['cities']=$_cities;

			$return['html']=$this->theme->view('_pages/common/vw_cities_by_states_dyna',$this->data,true);

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);
		}else{
			redirect(base_url());
		}
	}


	public function onGetCourses(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			$_inst=post_data('_inst');
			$searched_data=array();

			$_course_data=array(); 

			$course_data=$this->strm->get_inst_streams_courses(array('course_status'=>'1','college_user_id'=>$_inst));

			if(!empty($course_data)){
				$_course_data=$course_data;
			}else{
				$_course_data=$this->strm->__get_course('course_id,course_name,course_short_name,course_status',array('course_status'=>'1'),FALSE);
			}

			$students_courses=array();				

			if($_course_data && !empty($_course_data)){
                foreach($_course_data as $key=>$value){

                	if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
						$students_courses=$this->sm->get_higher_edu_interests_details(array('edu_user_id'=>$this->data['userdata']->user_id,'edu_course_id'=>$value->course_id));
					}

                    $searched_data['searched_data'][]=array(
                        'course_id'=>$value->course_id,
                        'course_name'=>$value->course_name,
                        'course_short_name'=>$value->course_short_name,
                        'selected'=>(!empty($students_courses))?'selected':''
                    );                  
                }
            }

            //print_obj($searched_data);die;


            json_headers($searched_data);

		}else{
			redirect(base_url());
		}
	}


	public function onGetStateCourses(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			$_inst=post_data('_inst');
			$_country=post_data('_co');
			$_course=post_data('_cu');
			$searched_data=array();

			$states=array();
			$cities=array();
			$countries=array();

			$_course_data=array();

			$course_data=$this->strm->get_inst_streams_courses(array('course_status'=>'1','college_user_id'=>$_inst));

			if(!empty($course_data)){
				$_course_data=$course_data;
			}else{
				$_course_data=$this->strm->__get_course('course_id,course_name,course_short_name,course_status',array('course_status'=>'1'),FALSE);
			}

			$students_courses=array();				

			if($_course_data && !empty($_course_data)){
                foreach($_course_data as $key=>$value){

                	if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
						$students_courses=$this->sm->get_higher_edu_interests_details(array('edu_user_id'=>$this->data['userdata']->user_id,'edu_course_id'=>$value->course_id));
					}

					if($value->course_id==$_course){
						$selected='selected';
					}else{
						$selected='';
					}

                    $searched_data['searched_data'][]=array(
                        'course_id'=>$value->course_id,
                        'course_name'=>$value->course_name,
                        'course_short_name'=>$value->course_short_name,
                        'selected'=>$selected
                    );                  
                }
            }


            $countries=$this->com->__get_country('country_id,country_name,country_status',array('country_status'=>'1'),FALSE);

            foreach ($countries as $key => $value) {
            	$searched_data['searched_countries'][]=array(
            		'country_id'=>$value->country_id,
            		'country_name'=>$value->country_name,
            		'selected'=>($value->country_id==$_country)?'selected':''
            	);
            }


            $states=$this->com->__get_states('state_id,state_name,state_country_id',array('state_country_id'=>$_country));

            foreach ($states as $key => $value) {
            	$searched_data['searched_states'][]=array(
            		'state_id'=>$value->state_id,
            		'state_name'=>$value->state_name,
            		'selected'=>''
            	);
            }

            $cities=$this->com->__get_city('city_id,city_name,city_country_id,city_state_id',array('city_country_id'=>$_country,'city_status'=>'1'),FALSE);

            foreach ($cities as $key => $value) {
            	$searched_data['searched_cities'][]=array(
            		'city_id'=>$value->city_id,
            		'city_name'=>$value->city_name,
            		'selected'=>''
            	);
            }


            //print_obj($searched_data);die;


            json_headers($searched_data);

		}else{
			redirect(base_url());
		}
	}


	public function onGetCollegeCourses(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			if($this->input->post('_c_c')){
				$college_id=post_data('_c_c');

				$college_id=(is_numeric($college_id))?$college_id:decode_data($college_id);


				$param=array(
					'order'=>array('user_course_id' => 'ASC'),
					'user_type'=>'4',
					'user_id'=>$college_id
				);


				$_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);

				if(!empty($_course_fees_data)){
					foreach ($_course_fees_data as $key => $value) {

						if(!empty($value->user_course)){

							if(!empty($value->course_name)){
								$course_short_name=strtoupper($value->course_short_name);

								if($value->course_is_lateral=='1'){
									$course_short_name=strtoupper($value->course_short_name).'{Lateral}';
								}else{
									$course_short_name=strtoupper($value->course_short_name);
								}

								$course_formatted_name=(!empty($course_short_name))?strtoupper($value->course_name).' ['.$course_short_name.']':strtoupper($value->course_name);


								$course_data[]=array(
									'course_id'=>encode_data($value->user_course),
									'course_full_name'=>strtoupper($value->course_name),
									'course_short_name'=>$course_short_name,
									'course_formatted_name'=>$course_formatted_name
								);
							}
								
						}
						
					}
				}
			}else{
				$courses_data=$this->strm->__get_course('course_id,course_name,course_short_name,course_status,course_is_lateral',array('course_status'=>'1','course_is_top'=>'1'),FALSE,'course_name','ASC');

				if(!empty($courses_data)){
					foreach ($courses_data as $key => $value) {
						$course_short_name=strtoupper($value->course_short_name);

						if($value->course_is_lateral=='1'){
							$course_short_name=strtoupper($value->course_short_name).'{Lateral}';
						}else{
							$course_short_name=strtoupper($value->course_short_name);
						}

						$course_formatted_name=(!empty($course_short_name))?strtoupper($value->course_name).' ['.$course_short_name.']':strtoupper($value->course_name);

						$course_data[]=array(
							'course_id'=>encode_data($value->course_id),
							'course_full_name'=>strtoupper($value->course_name),
							'course_short_name'=>$course_short_name,
							'course_formatted_name'=>$course_formatted_name
						);
					}
				}
			}

			

	        $data['course_data']=$course_data;

	        //print_obj($data);die;

	        json_headers($data);
		}
	}


	public function onGetCourseslist(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$_search_param=$this->input->get('_searched_param');
			$searched_data=array();

			$_course_data=array();

			if(!empty($_searched_param)){
				$courses=$this->strm->__get_courses(array('course_name'=>$_search_param),array('course_short_name'=>$_search_param),TRUE);

				print_obj($courses);die;

				if(!empty($courses)){
					foreach ($courses as $key => $value) {

						//https://www.sikshapedia.com/courses/master-of-business-administration

						$slug=base_url('courses/'.url_slug($value->course_name));

						//$slug_data=$this->sm->get_slug_urls(array('url_value'=>$slug));

						//if(!empty($slug)){
							$_course_data=array(
								'course_id'=>$value->course_id,
	                        	'course_name'=>$value->course_name,
	                        	'course_short_name'=>$value->course_short_name,
	                        	'course_url'=>$slug
							);
						//}							
					}
				}
			}

            $searched_data['searched_data']=$_course_data;


            json_headers($searched_data);

		}else{
			redirect(base_url());
		}
	}



	public function onGetCourseAndExams(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){

			$country=$this->input->get('_c');

			$_top_courses=array();
			$_streams=array();

			$streams=$this->strm->__get_stream('stream_id,stream_icon_id,stream_name',array('stream_status'=>'1','stream_show_in_widget'=>'1'),FALSE);

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
                    $icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));

                     $total_data=$this->im->get_total_colleges(array('college_country_id'=>$country),NULL,array('needle'=>$value->stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

                     $slug=$this->sm->__get_slug('slug_value,slug_type,slug_type_id',array('slug_type'=>'3','slug_type_id'=>$value->stream_id));


                     $total_exams=$this->strm->_get_total_exams(null,'exam_stream_id',$value->stream_id,FALSE);

                    // print_obj($total_exams);

                    $access_link=(!empty($slug->slug_value))?base_url('in/colleges/'.$slug->slug_value):'';
                    $exam_access_link=(!empty($slug->slug_value))?base_url('exams/'.$slug->slug_value):'';

                    $_streams[]=array(
                        'stream_name'=>$value->stream_name,
                        'stream_icon'=>$icon->icon_value,
                        'stream_tolal_colleges'=>$total_data.' Colleges',
                        'stream_tolal_exams'=>$total_exams.' Exams',
                        'access_link'=>$access_link,
                        'exam_access_link'=>$exam_access_link,
                    );
                }
			}


			// $top_courses=$this->strm->_____get_courses(array('system_courses.course_show_in_widget'=>'1','system_slugs.slug_type'=>'5'),'system_courses.course_id,system_courses.course_stream,system_courses.course_short_name,system_slugs.slug_value');

			// if(!empty($top_courses)){
			// 	foreach ($top_courses as $key => $value) {

	        //         $stream_slug=$this->sm->__get_slug('slug_value',array('slug_type'=>'3','slug_type_id'=>$value->course_stream));
	        //         $_top_courses[]=array(
	        //             'course_id'=>encode_data($value->course_id),
	        //             'course_name'=>$value->course_short_name,
	        //             'course_college_url'=>base_url('courses/'.$stream_slug->slug_value.'/'.$value->slug_value)
	        //         );
	        //     }
			// }


			// $return['top_courses']=$_top_courses;
			$return['top_streams']=$_streams;

			json_headers($return);
		}else{
			redirect(base_url());
		}
	}

	public function onGetCompanies(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){

			$companies=$this->im->get_company_data(array('placement_company_status'=>'1'),FALSE);

			foreach ($companies as $key => $value) {
				$searched_data['searched_data'][]=array(
					'company_id'=>encode_data($value->placement_company_id),
					'company_name'=>$value->placement_company_name
				);
			}

			json_headers($searched_data);

		}else{
			redirect(base_url());
		}
	}


	public function onGetFilterList(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			//print_obj($_POST);die;

			$return['html']=$this->widget->run('front_search_colleges_filter',TRUE);


			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($return);
		}
	}


	public function indexAboutus(){
		$segment_1=$this->uri->segment(1,0);//career


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='about-us')){

			$view_page='webpage/others/vw_about_us';
		}else{
			$page_title='404 Not Found';
			$this->data['page_title']=$page_title;
			$view_page='webpage/others/vw_notfound';
		}		

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
	}


	public function indexContactus(){
		$segment_1=$this->uri->segment(1,0);//career
		
		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='contact-us')){

			$view_page='webpage/others/vw_contact_us';
		}else{
			$page_title='404 Not Found';
			$this->data['page_title']=$page_title;
			$view_page='webpage/others/vw_notfound';
		}

		

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
	}

	public function indexAdvertiseWithus(){
		$segment_1=$this->uri->segment(1,0);//career
		
		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='advertise-with-us')){

			$view_page='webpage/others/vw_advertise_with_us';
		}else{
			$page_title='404 Not Found';
			$this->data['page_title']=$page_title;
			$view_page='webpage/others/vw_notfound';
		}

		

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
	}

	public function indexTermsConditions(){
		$segment_1=$this->uri->segment(1,0);//career
		
		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='terms-conditions')){

			$view_page='webpage/others/vw_terms_conditions';
		}else{
			$page_title='404 Not Found';
			$this->data['page_title']=$page_title;
			$view_page='webpage/others/vw_notfound';
		}

		

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
	}


	public function indexPrivacyPolicy(){
		$segment_1=$this->uri->segment(1,0);//career
		
		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='privacy-policy')){

			$this->data['page_title']='Privacy Policy';

			$view_page='webpage/others/vw_privacy_policy';
		}else{
			$page_title='404 Not Found';
			$this->data['page_title']=$page_title;
			$view_page='webpage/others/vw_notfound';
		}

		

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
	}

	//Comments
	public function onAddComments(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('user_id'));
				$comment_type=post_data('comment_type');
				$comment_type_id=post_data('comment_type_id');
				$comment_value=post_data('comment_value');
				$comment_to_reply=post_data('comment_to_reply');

				$type_id=decode_data($comment_type_id);

				//echo $user_id;

				$comment_found=$this->sm->get_comments(array('comment_type'=>$comment_type,'comment_type_id'=>$type_id,'comment_user_id'=>$user_id));

				//print_obj($comment_found);die;

				if(empty($comment_found)){

					if(!empty($comment_to_reply)){
						$comment_id=decode_data($comment_to_reply);

						$comment_data=array(
							'comment_p_id'=>$comment_id,
							'comment_type'=>$comment_type,
							'comment_type_id'=>$type_id,
							'comment_user_id'=>$user_id,
							'comment_value'=>$comment_value
						);
					}else{
						$comment_data=array(
							'comment_type'=>$comment_type,
							'comment_type_id'=>$type_id,
							'comment_user_id'=>$user_id,
							'comment_value'=>$comment_value
						);
					}					

					$added=$this->sm->store_comments($comment_data);

					if($added){
						$return['success']='Your comment will be visible after approval.';
					}else{
						$return['error']='Error occurred.Try after some time.';
					}
				}else{
					$return['error']='You have already commented';
				}



				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect(base_url('signin'));
			}
		}else{
			redirect(base_url('signin'));
		}
	}



	//Add rating
	public function onAddWaytoRating(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$rating_value=post_data('rating_value');
			$rating_reason=post_data('rating_reason');
			$rating_comment=post_data('rating_comment');	

			$rating_ip=$this->input->ip_address();

			$rating_val=$this->sm->get_rating(array('rating_ip'=>$rating_ip,'DATE(created_at)'=>date('Y-m-d')));

			$data=array('rating_value'=>$rating_value,'rating_ip'=>$rating_ip,'rating_reason'=>$rating_reason,'rating_comment'=>$rating_comment,'created_at'=>date('Y-m-d'));

			if(empty($rating_val)){
				$added=$this->sm->store_rating($data);
			}else{
				$added=$this->sm->update_rating($data,array('rating_ip'=>$rating_ip,'DATE(created_at)'=>date('Y-m-d')));
			}

			if($added){
				$return['success']='Thank you for your valuable opinion.We will take note of you valuable thoughts.';
			}else{
				$return['error']='Rating not added';
			}

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);

		}else{
			redirect(base_url('signin'));
		}
	}



	public function onAddVisistsData(){

		$visit_type=post_data('visit_type');
		$_visit_type_id=post_data('visit_type_id');

		$visit_type_id=decode_data($_visit_type_id);

		$visit_type_state_id='';
		$visit_type_city_id='';
		$visit_ip='';
		$visit_total='';

		$get_ipgeo_data=get_ipgeo_data();

		$visit_type='BLOGS';

         if(!empty($get_ipgeo_data) && $get_ipgeo_data['geoplugin_status']=='200'){
            $geoplugin_city=$get_ipgeo_data['geoplugin_city'];
            $geoplugin_regionCode=$get_ipgeo_data['geoplugin_regionCode'];
            $geoplugin_regionName=$get_ipgeo_data['geoplugin_regionName'];
            $geoplugin_countryCode=$get_ipgeo_data['geoplugin_countryCode'];
            $geoplugin_countryName=$get_ipgeo_data['geoplugin_countryName'];
            $geoplugin_request=$get_ipgeo_data['geoplugin_request']; //ip

            $visit_date=date('Y-m-d');

            $country_data=$this->com->__get_country('country_id,country_name,country_iso_code_2,country_iso_code_4,country_lang,country_default',array('country_iso_code_2'=>$geoplugin_countryCode));

            $country_id=$country_data->country_id;

            $state_data=$this->com->get_state_specific('state_id,state_name,state_code',array('state_code'=>$geoplugin_regionCode));

            if(!empty($state_data)){
                $state_id=$state_data->state_id;
            }else{

                $get_total_states=$this->com->get_total_states(array('state_country_id'=>$country_id));

                $state_data_to_insert=array(
                    'state_country_id'=>$country_id,
                    'state_code'=>$geoplugin_regionCode,
                    'state_name'=>$geoplugin_regionName,
                    'state_name_slug'=>url_slug(strtolower($geoplugin_regionName)),
                    'state_serial'=>($get_total_states+1),
                    'created_by'=>'1'
                );

                $state_id=$this->com->add_state_data($state_data_to_insert);
            }

            $city_data=$this->com->get_city_specific('city_id,city_name',array('city_name'=>$geoplugin_city));

            if(!empty($city_data)){
                $city_id=$city_data->city_id;
            }else{

                $city_data_to_insert=array(
                    'city_country_id'=>$country_id,
                    'city_state_id'=>$state_id,
                    'city_name'=>$geoplugin_city,
                    'city_img_alt_text'=>$geoplugin_city,
                    'city_img_title'=>$geoplugin_city,
                    'city_name_slug'=>url_slug(strtolower($geoplugin_city)),
                    'created_by'=>'1'
                );

                $city_id=$this->com->add_city_data($city_data_to_insert);
            }

            $visit_data_found=$this->sm->get_visit_data(array('visit_type'=>$visit_type,'visit_ip'=>$geoplugin_request,'visit_type_id'=>$visit_type_id));

            if(!empty($visit_data_found)){
                $visit_total=$visit_data_found->visit_total+1;
            }else{
                $visit_total=1;
            }

            $visits_data=array(
                'visit_type'=>$visit_type,
                'visit_type_id'=>$visit_type_id,
                'visit_type_country_id'=>$country_id,
                'visit_type_state_id'=>$state_id,
                'visit_type_city_id'=>$city_id,
                'visit_ip'=>$geoplugin_request,
                'visit_total'=>$visit_total
            );

            if(!empty($visit_data_found)){
                $this->sm->update_visit_data($visits_data,array('visit_type'=>$visit_type,'visit_ip'=>$geoplugin_request,'visit_type_id'=>$visit_type_id));
                $inserted=$visit_data_found->visit_id;
            }else{
                $inserted=$this->sm->add_visit_data($visits_data);
            }
            

            if($inserted){

                $get_visit_date_data=$this->sm->get_visit_date_data(array('visited_id'=>$inserted,'visited_ip'=>$geoplugin_request,'DATE(visited_date)'=>$visit_date));

                if(!empty($get_visit_date_data)){
                    $visit_count=$get_visit_date_data->visited_count;
                }else{
                    $visit_count=1;
                }

                $visited_data=array(
                    'visited_id'=>$inserted,
                    'visited_date'=>$visit_date,
                    'visited_ip'=>$geoplugin_request,
                    'visited_region'=>$geoplugin_countryCode,
                    'visited_region_name'=>$geoplugin_countryName,
                    'visited_region_id'=>$country_id,
                    'visited_count'=>$visit_count
                );

                if(!empty($get_visit_date_data)){
                    $added=$this->sm->update_visit_date_data($visited_data,array('visited_id'=>$inserted,'visited_ip'=>$geoplugin_request,'DATE(visited_date)'=>$visit_date));
                }else{
                   $added=$this->sm->add_visit_date_data($visited_data); 
                }
                
            }

         }

	}


	/**Search Courses**/
	public function onSearchCourselist(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$searched_param=post_data('_searched_name');

			if(!empty($searched_param)){
				$courses=$this->strm->__get_course_like('course_id,course_short_name,course_name',array('course_status'=>'1'),'course_name',$searched_param,FALSE);
			}else{
				$courses=$this->strm->___get_course('course_id,course_short_name,course_name',array('course_status'=>'1'),FALSE,10,0,FALSE);
			}


			$return['courses']=$courses;

			json_headers($return);			

		}else{
			redirect(base_url());
		}
	}

	/**Search College List**/
	public function onSearchReviewColleges(){
		$param_val=$this->input->get('_c');
		
		// Set a limit for results per page
		$limit = 10;

		// Calculate the offset based on the current page
		if($this->input->get('_cp')){
			$page=$this->input->get('_cp');	
		}else{
			$page=1;
		}

		$offset = ($page - 1) * $limit;

		$colleges=array();

		$data_searched=$this->sm->_____get_system_search_data('search_data_type_id,search_data_name,search_data_short_name,search_data_state_name',array('search_data_type_id!='=>'0','search_data_type'=>'COLLEGE_NAME'),'search_data_type_id','ASC',$limit,$page,FALSE);

		if(!empty($data_searched)){
			foreach ($data_searched as $key => $value) {
				$colleges[]=array(
					'data_review_link'=>base_url('reviews/write/'.encode_data($value->search_data_type_id)),
					'data_formatted_name'=>$value->search_data_name.'['.$value->search_data_short_name.'],'. $value->search_data_state_name
				);
			}
		}

		$return['colleges']=$colleges;

		json_headers($return);
	}


	//Add to favorite
	public function onAddFavourite(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
				$college_id=decode_data(post_data('cid'));
				$stu_id=decode_data(post_data('sid'));
				$fav_type=post_data('fav_type');
				$liked=post_data('liked');

				if($liked==1){
					$this->im->delete_favourite_institutions(array('favi_inst_id'=>$college_id,'favi_user_id'=>$stu_id));
					$this->im->store_favourite_institutions(array('favi_inst_id'=>$college_id,'favi_user_id'=>$stu_id,'favi_inst_type'=>$fav_type));
				}else if($liked==0){
					$this->im->delete_favourite_institutions(array('favi_inst_id'=>$college_id,'favi_user_id'=>$stu_id));
				}

				
				$return['success']=true;
			}else{
				$return['redirect']=base_url('signin');
			}
			
			echo json_encode($return);
		}
	}



	//Add to compare
	public function onAddCompare(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
				$college_id=decode_data(post_data('cid'));
				$stu_id=decode_data(post_data('sid'));
				$fav_type=post_data('comp_type');
				$liked=post_data('liked');

				$compared_colleges=[];

				if($liked==1){
					$this->im->delete_compare_institutions(array('comp_inst_id'=>$college_id,'comp_user_id'=>$stu_id));
					$this->im->store_compare_institutions(array('comp_inst_id'=>$college_id,'comp_user_id'=>$stu_id,'comp_inst_type'=>$fav_type));
				}else if($liked==0){
					$this->im->delete_compare_institutions(array('comp_inst_id'=>$college_id,'comp_user_id'=>$stu_id));
				}

				//Get compared data back
				$compared_data=$this->im->_get_compare_institutions(array('comp_user_id'=>$stu_id));


				if(!empty($compared_data)){
					foreach ($compared_data as $key => $value) {
						$college_statedata=$this->com->get_state_specific('state_id,state_name',array('state_id'=>$value->college_state_id));
						$college_citydata=$this->com->get_city_specific('city_id,city_name',array('city_id'=>$value->college_city_id));

						$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner','user_file_type'=>'4'));
						$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

						if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative) && file_exists($_college_logo->media_disk_path)){
							$college_logo=$_college_logo->media_disk_path_relative;
						}else{
							$college_logo=base_url().'uploads/app/default/no.jpeg';
						}

						if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative) && file_exists($_college_banner->media_disk_path)){
							$college_banner=$_college_banner->media_disk_path_relative;
						}else{
							$college_banner=base_url().'uploads/app/default/pageBnr.jpg';
						}


						$compared_colleges[]=array(
							'data_id'=>$value->comp_id,
							'_id'=>$value->comp_inst_id,
							'college_id'=>encode_data($value->comp_inst_id),
							'college_sid'=>encode_data($value->comp_user_id),
							'college_name'=>$value->college_name,
							'college_short_name'=>$value->college_short_name,
							'college_state_city'=>$college_statedata->state_name.' - '.$college_citydata->city_name,
							'college_url'=>$value->access_url,
							'college_logo'=>$college_logo,
							'college_banner'=>$college_banner,
							'liked'=>($value->comp_inst_type==$fav_type)?'liked':''
						);
					}
				}

				$this->data['compared_colleges']=$compared_colleges;
				
				$return['success']=true;
				$return['html']=$this->theme->view('_pages/common/vw_compared_insts_dyna',$this->data,true);
			}else{
				$return['redirect']=base_url('signin');
			}
			
			echo json_encode($return);
		}
	}


	public function onDeleteCompare(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
			if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
				$id=post_data('did');

				$deleted=$this->im->delete_compare_institutions(array('comp_id'=>$id));

				if($deleted){
					$return['success']='College deleted successfully';
				}else{
					$return['error']='College not deleted';
				}

				echo json_encode($return);
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}
	
}