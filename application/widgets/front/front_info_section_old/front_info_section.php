<?php


/**
 * 
 */
class Front_info_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url

        //echo $segment_4;die;

        $course_fees_data=array();
        $college_data=array();
        $course_stream_details=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
        	$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

        	if(!empty($country_data)){

        		$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

        		if(!empty($slug_found)){
        			$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;
					$slug_value=$slug_found->slug_value;

					if($slug_type=='6'){//University

					}else if($slug_type=='7'){//College

						$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

						//print_obj($_college_data);die;

						if(!empty($_college_data)){
							$college_user_data=$this->um->get_user_data(array('user_id'=>$_college_data->college_user_id),null,'4');

							$college_data=array(
								'college_name'=>strtoupper($_college_data->college_name)
							);

							$param=array(
			        			'order'=>array('user_course_id' => 'DESC'),
			        			'user_type'=>'4',
			        			'user_id'=>$slug_type_id
		        			);

							$_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);

							if(!empty($_course_fees_data)){
								foreach ($_course_fees_data as $key => $value) {

									$cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$slug_type_id,'user_course_id'=>$value->user_course_id,'user_course_year'=>'1'),FALSE);

									//print_obj($cost_data);

									$total_cost=number_format($cost_data[0]->total_cost, 2,'.', ',');

									$course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$total_cost:$total_cost.$college_user_data->currency_symbol_right;

									$course_fees_data[]=array(
										'course_full_name'=>strtoupper($value->course_name),
										'course_short_name'=>strtoupper($value->course_short_name),
										'course_type'=>strtoupper($value->user_course_type),
										'course_pass_type'=>strtoupper($value->user_course_pass_type),
										'course_placement'=>strtoupper($value->user_course_placement_type),
										'course_duration'=>$value->user_course_duration_year,
										'course_duration_type'=>strtoupper($value->user_course_duration_type),
										'course_fees_1st_tear'=>$course_cost.' (1st Year Fees)',
										'course_eligibility'=>'',
										'course_link'=>base_url().strtolower($country_data->country_iso_code_2).'/'.$slug_value.'/course-fees/'.url_slug(strtolower($value->course_name))
									);
								}
							}
						}						
					}
        		}		        		
        	}
        }

       // print_obj($course_fees_data);

       // die;

    	$data['course_fees_data']=$course_fees_data;
    	$data['college_data']=$college_data;

        if ($visible) $this->render('front_info_section',$data);
	}
}