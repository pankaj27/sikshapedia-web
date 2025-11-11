<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_search_colleges_filter extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$this->output->cache(120);

		$slug_1=$this->uri->segment(1,0);//country
		$slug_2=$this->uri->segment(2,0);//static segment "colleges"
		$slug_3=$this->uri->segment(3,0);//state or course or stream
		$slug_4=$this->uri->segment(4,0);//city or course
		$slug_5=$this->uri->segment(5,0);//course
		$slug_6=$this->uri->segment(6,0);//stream

		//print_obj($slug_3);die;

		$c_type=$this->input->get('ctype');
		$appr=$this->input->get('appr');
		$aff=$this->input->get('aff');

		$_course_selected='';
		$_stream_selected='';
		$_city_selected='';
		$_state_selected='';

		//echo $slug_5;

		$slug_data_3=$this->sm->get_slug(array('slug_value'=>$slug_3));


    	$country_id=$this->data['default_country_data']->country_id;

    	$country_data=$this->com->__get_country('country_id,country_name,country_iso_code_4',array('country_id'=>$country_id));

    	//print_obj($country_data);die;

    	$country_states=$this->com->__get_states('state_id,state_name,state_name_slug',array('state_country_id'=>$country_id),'state_serial','ASC');

    	if(isset($slug_3)){
    		if(!empty($slug_data_3)){
    			if($slug_data_3->slug_type=='1'){
					$country_cities=$this->com->__get_city('city_id,city_name',array('city_country_id'=>$country_id,'city_state_id'=>$slug_data_3->slug_type_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    			}else{
    				$country_cities=$this->com->__get_city('city_id,city_name',array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    			}
				
    		}else{
    			$country_cities=$this->com->__get_city('city_id,city_name',array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    		}
			
    	}else{
    		$country_cities=$this->com->__get_city('city_id,city_name',array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    	}		

		
		$course_program_types=$this->strm->get_course_program_type(NULL,FALSE,'program_type_serial','ASC');


		if(!empty($country_states)){
			$college_srch_base_url=base_url($country_data->country_iso_code_4.'/colleges');
			foreach ($country_states as $key => $value) {

				if(isset($slug_3) && $slug_3!='0'){
					$slug_3_data=$this->sm->get_slug(array('slug_value'=>$slug_3));
					$slug_3_type=$slug_3_data->slug_type;
					$slug_3_type_id=$slug_3_data->slug_type_id;

					if($slug_3_type=='1'){//State
						if($slug_4!='0'){
							$slug_4_data=$this->sm->get_slug(array('slug_value'=>$slug_4));
							$slug_4_type=$slug_4_data->slug_type;
							$slug_4_type_id=$slug_4_data->slug_type_id;

							if($slug_4_type=='2'){//City
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//Course
										$total_data='0';
										$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
										$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_5;
									}else if($slug_5_type=='3'){//stream

										if($slug_6!='0'){
											$slug_6_data=$this->sm->get_slug(array('slug_value'=>$slug_6));
											$slug_6_type=$slug_6_data->slug_type;
											$slug_6_type_id=$slug_6_data->slug_type_id;

											if($slug_6_type=='5'){//course
												$total_data='0';
												$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
												$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_5.'/'.$slug_6;
											}
										}else{
											$total_data='0';
											$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
											$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_5;
										}
									}

								}else{
									
									$total_data='0';
									$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
									$state_slug=$college_srch_base_url.'/'.$value->state_name_slug;
								}								
							}else if($slug_4_type=='5'){//Course
								
								$total_data='0';
								$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
								$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_4;
							}else if($slug_4_type=='3'){//Stream
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//course
										
										$total_data='0';
										$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
										$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_4.'/'.$slug_5;
									}else{

									}
								}else{
									
									$total_data='0';
									$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
									$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_4;
								}
							}							
						}else{
							
							$total_data='0';
							$_state_selected=($value->state_id==$slug_3_type_id)?'checked':'';
							$state_slug=$college_srch_base_url.'/'.$value->state_name_slug;
						}						
					}else if($slug_3_type=='5'){//Course
						
						$total_data='0';
						$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_3;
					}else if($slug_3_type=='3'){//Stream
						
						$total_data='0';
						$state_slug=$college_srch_base_url.'/'.$value->state_name_slug.'/'.$slug_3;
					}
				}else{
					
					$total_data='0';
					$state_slug=$college_srch_base_url.'/'.$value->state_name_slug;
				}	

				//(isset($slug_3) && ($value->state_name_slug==$slug_3))?'checked':''	

				$state_slug=$college_srch_base_url.'/'.$value->state_name_slug;	
	
				$_states[]=array(
					'state_id'=>encode_data($value->state_id),
					'state_name'=>$value->state_name,
					'state_name_slug'=>$value->state_name_slug,
					'state_selected'=>$_state_selected,
					'total_data'=>$total_data,
					'url_slug'=>$state_slug
				);
			}

			$state_selected = array_column($_states, 'state_selected');

			array_multisort($state_selected, SORT_DESC, $_states);
		}else{
			$_states=array();
		}

		//print_obj($_states);die;

		$approval_types=$this->im->get_approval_types(array('approval_type_country'=>$country_id));

		if(!empty($approval_types)){
			foreach ($approval_types as $key => $value) {

				if(!empty($value->approval_type_name)){
					$_approval_types[]=array(
						'approval_type_id'=>encode_data($value->approval_type_id),
						'approval_type_name'=>$value->approval_type_name,
						'approval_type_selected'=>($value->approval_type_name_slug==$appr)?'checked':'',
						'url_slug'=>current_url().'?appr='.$value->approval_type_name_slug
					);
				}
					
			}
		}else{
			$_approval_types=array();
		}


		if(!empty($country_cities)){
			foreach ($country_cities as $key => $value) {
				if(isset($slug_3) && $slug_3!='0'){
					$slug_3_data=$this->sm->get_slug(array('slug_value'=>$slug_3));
					$slug_3_type=$slug_3_data->slug_type;
					$slug_3_type_id=$slug_3_data->slug_type_id;

					if($slug_3_type=='1'){//State
						if($slug_4!='0'){
							$slug_4_data=$this->sm->get_slug(array('slug_value'=>$slug_4));
							$slug_4_type=$slug_4_data->slug_type;
							$slug_4_type_id=$slug_4_data->slug_type_id;

							if($slug_4_type=='2'){//City
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//course
										
										$total_data='0';

									}else if($slug_5_type=='3'){//stream

										if($slug_6!='0'){
											$slug_6_data=$this->sm->get_slug(array('slug_value'=>$slug_6));
											$slug_6_type=$slug_6_data->slug_type;
											$slug_6_type_id=$slug_6_data->slug_type_id;

											//echo $slug_6_type;die;

											if($slug_6_type=='5'){//course
												
												$total_data='0';
												$_city_selected=($value->city_id==$slug_4_type_id)?'checked':'';
											}
										}else{
											
											$total_data='0';
											$_city_selected=($value->city_id==$slug_4_type_id)?'checked':'';
										}
									}
								}else{
									
									$total_data='0';
									$_city_selected=($value->city_id==$slug_4_type_id)?'checked':'';
								}								
							}else if($slug_4_type=='5'){//Course
								
								$total_data='0';
							}else if($slug_4_type=='3'){//Stream
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//course
										
										$total_data='0';
									}else{

									}

								}else{
									$total_data=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$slug_3_type_id,'college_city_id'=>$value->city_id),NULL,NULL,FALSE);
								}
							}						
						}else{
							
							$total_data='0';
						}						
					}else if($slug_3_type=='5'){//Course
						
						$total_data='0';
					}else if($slug_3_type=='3'){//Stream
						
						$total_data='0';
					}
				}else{
					
					$total_data='0';
				}

				//(isset($slug_4) && ($value->city_name_slug==$slug_4))?'checked':''

				$state_name_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->city_state_id));
				$city_slug=$college_srch_base_url.'/'.$state_name_slug->slug_value.'/'.$value->city_name_slug;

				$_cities[]=array(
					'city_id'=>encode_data($value->city_id),
					'city_name'=>$value->city_name,
					'city_name_slug'=>$value->city_name_slug,
					'city_selected'=>$_city_selected,
					'total_data'=>$total_data,
					'url_slug'=>$city_slug
				);

				$city_selected = array_column($_cities, 'city_selected');

				array_multisort($city_selected, SORT_DESC, $_cities);
			}
		}else{
			$_cities=array();
		}

		// print_obj($_cities);die;

		if(!empty($course_program_types)){
			foreach ($course_program_types as $key => $value) {
				$_program_types[]=array(
					'program_type_id'=>encode_data($value->program_type_id),
					'program_type_name'=>$value->program_type_name
				);
			}
		}else{
			$_program_types=array();
		}

		$affiliation_types=$this->im->__get_affiliation_types('statutory_body_id,statutory_body_abbr,statutory_body_name,statutory_body_abbr_slug',array('statutory_body_status'=>'1','statutory_body_country_id'=>$country_data->country_id),FALSE,'statutory_body_id','ASC');
		if(!empty($affiliation_types)){
			foreach ($affiliation_types as $key => $value) {
				$_affiliation_types[]=array(
					'statutory_body_id'=>encode_data($value->statutory_body_id),
					'statutory_body_abbr'=>$value->statutory_body_abbr,
					'statutory_body_name'=>$value->statutory_body_name,
					'statutory_body_selected'=>($value->statutory_body_abbr_slug==$aff)?'checked':'',
					'url_slug'=>current_url().'?aff='.$value->statutory_body_abbr_slug
				);
			}
		}else{
			$_affiliation_types=array();
		}

		$streams=$this->strm->__get_stream('stream_id,stream_name',array('stream_status'=>'1'),FALSE,'stream_serial','ASC');
		if(!empty($streams)){
			foreach ($streams as $key => $value) {
				if(isset($slug_3) && $slug_3!='0'){
					$slug_3_data=$this->sm->get_slug(array('slug_value'=>$slug_3));
					$slug_3_type=$slug_3_data->slug_type;
					$slug_3_type_id=$slug_3_data->slug_type_id;

					//print_obj($slug_3_data);die;

					if($slug_3_type=='1'){//State
						if($slug_4!='0'){
							$slug_4_data=$this->sm->get_slug(array('slug_value'=>$slug_4));
							$slug_4_type=$slug_4_data->slug_type;
							$slug_4_type_id=$slug_4_data->slug_type_id;

							if($slug_4_type=='2'){//City
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//Course
										
										$total_data='0';
										$course_data=$this->strm->get_course(array('course_id'=>$slug_5_type_id));
										$_stream_selected=(isset($course_data) && ($value->stream_id==$course_data->course_stream))?'checked':'';
									}else if($slug_5_type=='3'){//stream

										
										$total_data='0';
										$_stream_selected=($value->stream_id==$slug_5_type_id)?'checked':'';
									}

								}else{
									
									$total_data='0';
								}
															
							}else if($slug_4_type=='5'){//Course
								
								$total_data='0';
								$course_data=$this->strm->get_course(array('course_id'=>$slug_4_type_id));
								$_stream_selected=(isset($course_data) && ($value->stream_id==$course_data->course_stream))?'checked':'';
							}else if($slug_4_type=='3'){//Stream
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){
										
										$total_data='0';
										$course_data=$this->strm->get_course(array('course_id'=>$slug_5_type_id));
										$_stream_selected=(isset($course_data) && ($value->stream_id==$course_data->course_stream))?'checked':'';
									}else{

									}
								}else{
									
									$total_data='0';
									$_stream_selected=($value->stream_id==$slug_4_type_id)?'checked':'';
								}
							}
						}else{
							
							$total_data='0';
						}
					}else if($slug_3_type=='5'){//Course
						
						$total_data='0';
						$course_data=$this->strm->get_course(array('course_id'=>$slug_3_type_id));
						$_stream_selected=(isset($course_data) && ($value->stream_id==$course_data->course_stream))?'checked':'';
					}else if($slug_3_type=='3'){//Stream
						
						$total_data='0';
						$_stream_selected=($value->stream_id==$slug_3_type_id)?'checked':'';
					}
				}else{
					
					$total_data='0';
					$_stream_selected='';
				}

				//$course_stream=(isset($course_data))?$course_data->course_stream:'';

				$_streams[]=array(
					'stream_id'=>encode_data($value->stream_id),
					'stream_name'=>$value->stream_name,
					'stream_selected'=>$_stream_selected,
					'total_data'=>$total_data,
					'stream_name'=>$value->stream_name,
					'url_slug'=>$college_srch_base_url.'/'.url_slug($value->stream_name)
				);

				$stream_selected = array_column($_streams, 'stream_selected');

				array_multisort($stream_selected, SORT_DESC, $_streams);
			}
		}else{
			$_streams=array();
		}

		//print_obj($_streams);die;


		if(!empty($slug_data_3) && $slug_data_3->slug_type=='3'){
			$courses=$this->strm->__get_course('course_id,course_name,course_short_name',array('course_status'=>'1','course_stream'=>$slug_data_3->slug_type_id),FALSE,'course_name','ASC');
		}else{
			$courses=$this->strm->__get_course('course_id,course_name,course_short_name',array('course_status'=>'1'),FALSE,'course_name','ASC');
		}
		

		//$courses=$this->im->_get_user_course_data(array('course_status'=>'1'));



		if(!empty($courses)){
			foreach ($courses as $key => $value) {

				$course_name_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));

				if(isset($slug_3) && $slug_3!='0'){
					$slug_3_data=$this->sm->get_slug(array('slug_value'=>$slug_3));
					$slug_3_type=$slug_3_data->slug_type;
					$slug_3_type_id=$slug_3_data->slug_type_id;

					//print_obj($slug_3_data);die;

					if($slug_3_type=='1'){//State
						if($slug_4!='0'){
							$slug_4_data=$this->sm->get_slug(array('slug_value'=>$slug_4));
							$slug_4_type=$slug_4_data->slug_type;
							$slug_4_type_id=$slug_4_data->slug_type_id;

							if($slug_4_type=='2'){//City
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									//print_obj($slug_5_data);die;


									//echo $slug_5_type_id;die;

									if($slug_5_type=='5'){//course
										
										$total_data='0';
										$_course_selected=(isset($slug_5_type_id) && ($value->course_id==$slug_5_type_id))?'checked':'';
									}else if($slug_5_type=='3'){//Streams
										if($slug_6!='0'){
											$slug_6_data=$this->sm->get_slug(array('slug_value'=>$slug_6));
											$slug_6_type=$slug_6_data->slug_type;
											$slug_6_type_id=$slug_6_data->slug_type_id;

											//echo $slug_6_type_id;die;

											if($slug_6_type=='5'){//Course
												
												$total_data='0';
												$_course_selected=(isset($slug_6_type_id) && ($value->course_id==$slug_6_type_id))?'checked':'';
											}
										}
									}

								}else{
									
									$total_data='0';	
								}

								$city_name_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$slug_4_type_id));

								$course_slug=$college_srch_base_url.'/'.$slug_3.'/'.$city_name_slug->slug_value.'/'.$course_name_slug->slug_value;
															
							}else if($slug_4_type=='5'){//Course
								
								$total_data='0';
								$_course_selected=(isset($slug_4_type_id) && ($value->course_id==$slug_4_type_id))?'checked':'';
							}else if($slug_4_type=='3'){//stream
								if($slug_5!='0'){
									$slug_5_data=$this->sm->get_slug(array('slug_value'=>$slug_5));
									$slug_5_type=$slug_5_data->slug_type;
									$slug_5_type_id=$slug_5_data->slug_type_id;

									if($slug_5_type=='5'){//course
										
										$total_data='0';
										$_course_selected=(isset($slug_5_type_id) && ($value->course_id==$slug_5_type_id))?'checked':'';
									}else{
										

										$total_data='0';
									}
								}else{
									

									$total_data='0';
								}

								$course_slug=$college_srch_base_url.'/'.$slug_3.'/'.url_slug($value->course_name);
							}
						}else{
								
							$total_data='0';						

							$course_slug=$college_srch_base_url.'/'.$slug_3.'/'.$course_name_slug->slug_value;
						}
					}else if($slug_3_type=='5'){//Course
					
						$total_data='0';
						$_course_selected=(isset($slug_3_type_id) && ($value->course_id==$slug_3_type_id))?'checked':'';
					}else if($slug_3_type=='3'){//stream
						if($slug_4!='0'){
							$slug_4_data=$this->sm->get_slug(array('slug_value'=>$slug_4));
							$slug_4_type=$slug_4_data->slug_type;
							$slug_4_type_id=$slug_4_data->slug_type_id;

							if($slug_4_type=='5'){
								
								$total_data='0';
								$_course_selected=(isset($slug_4_type_id) && ($value->course_id==$slug_4_type_id))?'checked':'';
								$course_slug=$college_srch_base_url.'/'.$slug_3.'/'.url_slug($value->course_name);
							}

						}else{

						}
									
					}
				}else{
					

					$total_data='0';
				}
				
				$_courses[]=array(
					'course_id'=>encode_data($value->course_id),
					'course_name'=>$value->course_name,
					'course_selected'=>$_course_selected,
					'total_data'=>$total_data,
					'slug_3_type'=>$slug_3_type,
					'slug_4_type'=>$slug_4_type,
					'url_slug'=>$course_slug
				);

				$course_selected = array_column($_courses, 'course_selected');

				array_multisort($course_selected, SORT_DESC, $_courses);
			}
		}else{
			$_courses=array();
		}

		//print_obj($_courses);die;


		$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4'),FALSE);

		if(!empty($institute_types)){
			foreach ($institute_types as $key => $value) {
				if(!empty($value->inst_type_short_name)){
					$_institute_types[]=array(
						'inst_type'=>encode_data($value->inst_type),
						'inst_type_short_name'=>$value->inst_type_short_name,
						'inst_type_selected'=>($value->inst_type_name_slug==$c_type)?'checked':'',
						'url_slug'=>current_url().'?ctype='.$value->inst_type_name_slug
					);
				}
				
			}

		}else{
			$_institute_types=array();
		}

		$institute_categories=$this->im->get_institute_categories(array('inst_category_country_id'=>$country_id),FALSE);

		if(!empty($institute_categories)){
			foreach ($institute_categories as $key => $value) {
				$_institute_categories[]=array(
					'inst_category_id'=>encode_data($value->inst_category_id),
					'inst_category_short_name'=>$value->inst_category_short_name,
					'inst_category_selected'=>'',
					'url_slug'=>current_url().'?c_cate='.$value->inst_category_name_slug
				);
			}

		}else{
			$_institute_categories=array();
		}



		$entrance_exams=$this->strm->__get_exam('exam_id,exam_short_name',array('exam_country'=>$country_id,'exam_status'=>'1'),'exam_id','ASC');

		if(!empty($entrance_exams)){
			foreach ($entrance_exams as $key => $value) {
				$_entrance_exams[]=array(
					'exam_id'=>encode_data($value->exam_id),
					'exam_short_name'=>$value->exam_short_name
				);
			}

		}else{
			$_entrance_exams=array();
		}


		$agencies=$this->im->__get_agencies('agency_id,agency_short_name,agency_name_slug',array('agency_country_id'=>$country_id),'agency_id','ASC');

		if(!empty($agencies)){
			foreach ($agencies as $key => $value) {
				$_agencies[]=array(
					'agency_id'=>encode_data($value->agency_id),
					'agency_short_name'=>$value->agency_short_name,
					'agency_selected'=>'',
					'url_slug'=>current_url().'?agn='.$value->agency_name_slug
				);
			}

		}else{
			$_agencies=array();
		}


		$course_types=$this->strm->__get_course_categories('course_category_id,course_category_name',array('course_category_status'=>'1'),FALSE,'course_category_id','ASC');



		if(!empty($course_types)){
			foreach ($course_types as $key => $value) {
				$_course_types[]=array(
					'course_type_id'=>encode_data($value->course_category_id),
					'course_type_name'=>$value->course_category_name
				);
			}

		}else{
			$_course_types=array();
		}


		$college_universities=$this->im->__get_university_profile_data('university_user_id,university_name',array('university_country_id'=>$country_id,'university_status'=>'1','is_verified_by_admin'=>'1'),FALSE);

		if(!empty($college_universities)){
			foreach ($college_universities as $key => $value) {
				$_college_universities[]=array(
					'university_id'=>encode_data($value->university_user_id),
					'university_name'=>$value->university_name
				);
			}

		}else{
			$_college_universities=array();
		}

		$course_duration=array('1'=>'1 Year','2'=>'2 Year','3'=>'3 Year','4'=>'4 Year','5'=>'5 Year','6'=>'6 Year','7'=>'7 Year','8'=>'8 Year','9'=>'9 Year');

		if(!empty($course_duration)){
			foreach ($course_duration as $key => $value) {
				$_course_duration[]=array(
					'duration_value'=>$key,
					'duration_name'=>$value
				);
			}

		}else{
			$_course_duration=array();
		}

		$this->data=array(
			'country_states'=>$_states,
			'country_cities'=>$_cities,
			'course_program_types'=>$_program_types,
			'course_streams'=>$_streams,
			'affiliation_types'=>$_affiliation_types,
			'institute_types'=>$_institute_types,
			'institute_categories'=>$_institute_categories,
			'universities'=>$_college_universities,
			'courses'=>$_courses,
			'course_types'=>$_course_types,
			'course_duration'=>$_course_duration,
			'entrance_exams'=>$_entrance_exams,
			'approval_types'=>$_approval_types,
			'agencies'=>$_agencies
		);


        if ($visible) $this->render('front_search_colleges_filter',$this->data);
    }
}