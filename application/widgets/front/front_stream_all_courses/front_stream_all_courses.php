<?php


/**
 * 
 */
class Front_stream_all_courses extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    
    	$segment_1=$this->uri->segment(1,0);
    	$segment_2=$this->uri->segment(2,0);
    	$segment_3=$this->uri->segment(3,0);

    	$courses=array();
    	$_courses=array();


    	if(is_string($segment_1) && $segment_1=='courses'){
    		if(is_string($segment_2) && $segment_2!='0'){
    			$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2,'slug_type'=>'3'));
    			if(!empty($slug_found)){
    				$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;

					if(is_string($segment_3) && $segment_3!='0'){
						$menu_data=$this->sm->get_menues(array('menu_slug'=>$segment_3,'menu_link_type'=>'13','menu_link_id'=>$slug_type_id));

						if(!empty($menu_data)){
							$course_details=$this->strm->get_stream_details_courses_data(array('courses_data_type_stream_id'=>$slug_type_id,'courses_data_type_menu_id'=>$menu_data->menu_id),FALSE,'courses_data_type_serial','ASC',FALSE);

							if(!empty($course_details)){

								foreach ($course_details as $key => $value) {

									if($value->courses_data_type=='ads'){
										$ads=$this->um->get_listing_package_users(array('listing_id'=>$value->courses_data_type_id));
										$courses_data_type_value=$ads->listing_embed_code;
									}else{
										$course_data=$this->strm->get_course(array('course_id'=>$value->courses_data_type_id));
										if($course_data->course_short_name!=null){
											$courses_data_type_value=$value->courses_data_type_value.' ['.$course_data->course_short_name.']';
										}else{
											$courses_data_type_value=$value->courses_data_type_value;
										}
										
										$course_duration_type=($course_data->course_duration_type!=null)?ucwords(str_replace('_', ' ', $course_data->course_duration_type)):'';
										$years_text=($course_data->course_duration_year!=null && $course_data->course_duration_year>1)?' Years':' Year';
										$course_duration=($course_data->course_duration_year!=null || $course_data->course_duration_year!=0)?$course_data->course_duration_year.$years_text:'';
										$total_colleges=$this->um->get_total_user_courses(array('user_course'=>$value->courses_data_type_id));
									}

									$_courses[]=array(
							            'courses_data_type' => $value->courses_data_type,
							            'course_duration_type'=>isset($course_duration_type)?$course_duration_type:'',
							            'course_duration'=>isset($course_duration)?$course_duration:'',
							            'cpourse_offerd_total_colleges'=>(isset($total_colleges))?$total_colleges:'',
							            'courses_data_type_value' => $courses_data_type_value
									);
								}
							}else{
								$courses=$this->strm->get_course(array('course_stream'=>$slug_type_id),FALSE);

                                if(!empty($courses)){
                                    foreach ($courses as $key => $value) {

                                        if($value->course_short_name!=null){
                                            $courses_data_type_value=$value->course_name.' ['.$value->course_short_name.']';
                                        }else{
                                            $courses_data_type_value=$value->course_name;
                                        }
                                        
                                        $course_duration_type=($value->course_duration_type!=null)?ucwords(str_replace('_', ' ', $value->course_duration_type)):'';
                                        $years_text=($value->course_duration_year!=null && $value->course_duration_year>1)?' Years':' Year';
                                        $course_duration=($value->course_duration_year!=null || $value->course_duration_year!=0)?$value->course_duration_year.$years_text:'';
                                        $total_colleges=$this->um->get_total_user_courses(array('user_course'=>$value->courses_data_type_id));

                                        $_courses[$v->course_category_name][]=array(
                                            'courses_data_type' => 'course',
                                            'course_duration_type'=>isset($course_duration_type)?$course_duration_type:'',
                                            'course_duration'=>isset($course_duration)?$course_duration:'',
                                            'cpourse_offerd_total_colleges'=>(isset($total_colleges))?$total_colleges:'',
                                            'courses_data_type_value' => $courses_data_type_value
                                        );
                                    }
                                }
							}
						}
					}
    			}
    		}
    	}

    	
    	$data['courses']=$_courses;

    	//print_obj($data);die;
		

    	if ($visible) $this->render('front_stream_all_courses',$data);
    }
}