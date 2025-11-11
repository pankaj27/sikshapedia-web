<?php


/**
 * 
 */
class Front_search_universities_filter extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$slug_3=$this->uri->segment(3,0);//state
		$slug_4=$this->uri->segment(4,0);//city

		//echo $slug_4;die;

		$slug_data_3=$this->sm->get_slug(array('slug_value'=>$slug_3));


    	$country_id=$this->data['default_country_data']->country_id;

    	$country_states=$this->com->get_states(array('state_country_id'=>$country_id),'state_serial','ASC');

    	if(isset($slug_3)){
    		if(!empty($slug_data_3)){
    			if($slug_data_3->slug_type=='1'){
					$country_cities=$this->com->get_city(array('city_country_id'=>$country_id,'city_state_id'=>$slug_data_3->slug_type_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    			}else{
    				$country_cities=$this->com->get_city(array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    			}
				
    		}else{
    			$country_cities=$this->com->get_city(array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    		}
			
    	}else{
    		$country_cities=$this->com->get_city(array('city_country_id'=>$country_id,'city_status'=>'1'),FALSE,'city_serial','ASC');
    	}

		

		$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);
		$course_program_types=$this->strm->get_course_program_type(NULL,FALSE,'program_type_serial','ASC');

		if(!empty($country_states)){
			foreach ($country_states as $key => $value) {
				$total_data=$this->im->get_total_universities(array('university_country_id'=>$country_id,'university_state_id'=>$value->state_id));
				//$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_state_id'=>$value->state_id));
				//$total_data=$total_universities+$total_colleges;

				$_states[]=array(
					'state_id'=>encode_data($value->state_id),
					'state_name'=>$value->state_name,
					'state_name_slug'=>$value->state_name_slug,
					'state_selected'=>(isset($slug_3) && ($value->state_name_slug==$slug_3))?'checked':'',
					'total_data'=>$total_data
				);
			}
		}else{
			$_states=array();
		}


		if(!empty($country_cities)){
			foreach ($country_cities as $key => $value) {
				$total_data=$this->im->get_total_universities(array('university_country_id'=>$country_id,'university_city_id'=>$value->city_id));
				//$total_colleges=$this->im->get_total_colleges(array('college_country_id'=>$country_id,'college_city_id'=>$value->city_id));	
				//$total_data=$total_universities+$total_colleges;
				$_cities[]=array(
					'city_id'=>encode_data($value->city_id),
					'city_name'=>$value->city_name,
					'city_name_slug'=>$value->city_name_slug,
					'city_selected'=>(isset($slug_4) && ($value->city_name_slug==$slug_4))?'checked':'',
					'total_data'=>$total_data
				);
			}
		}else{
			$_cities=array();
		}

		//print_obj($_cities);die;

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

		if(!empty($streams)){
			foreach ($streams as $key => $value) {
				$total_data=$this->im->get_total_universities_by_course(array('user_course_stream'=>$value->stream_id,'user_type'=>'3'));
				$_streams[]=array(
					'stream_id'=>encode_data($value->stream_id),
					'stream_name'=>$value->stream_name,
					'total_data'=>$total_data
				);
			}
		}else{
			$_streams=array();
		}


		$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$this->data['userdata']->user_country),FALSE);
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


		$courses=$this->strm->get_course(array('course_status'=>'1'),FALSE);
		if(!empty($courses)){
			foreach ($courses as $key => $value) {
				$total_data=$this->im->get_total_universities_by_course(array('user_course'=>$value->course_id,'user_type'=>'3'));
				$_courses[]=array(
					'course_id'=>encode_data($value->course_id),
					'course_name'=>$value->course_name,
					'total_data'=>$total_data
				);
			}
		}else{
			$_courses=array();
		}

		$this->data['country_states']=$_states;
		$this->data['country_cities']=$_cities;
		$this->data['course_program_types']=$_program_types;
		$this->data['course_streams']=$_streams;
		$this->data['affiliation_types']=$_affiliation_types;
		$this->data['courses']=$_courses;


        if ($visible) $this->render('front_search_universities_filter',$this->data);
    }
}