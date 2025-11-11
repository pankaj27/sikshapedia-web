<?php


/**
 * 
 */
class Front_info_review_list extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url

        $infos_data=array();


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
						$post=array('length'=>'8','start'=>'0')
                        $param=arry('review_approved'=>'1');
                        $reviews=$this->um->_get_review_data($post,$param);

                        if(!empty($reviews)){
                            foreach ($reviews as $key => $value) {
                                $_reviews[]=array(
                                    'review_user_name'=>,
                                    'review_user_short_name'=>'',
                                    'review_heading'=>,
                                    'review_value'=>$value->review_value,
                                    'review_campus_life_details'=>$value->review_campus_life_details,
                                    'review_faculty_details'=>$value->review_faculty_details,
                                    'review_placement_details'=>$value->review_placement_details,
                                    'review_internship_details'=>$value->review_internship_details,
                                    'review_interview_details'=>$value->review_interview_details,
                                    'review_course_details'=>$value->review_course_details,
                                    'review_social_life_details'=>$value->review_social_life_details,
                                    'review_college_life_details'=>$value->review_college_life_details,
                                    'review_hostel_details'=>$value->review_hostel_details,
                                    'review_detail_courses_curriculum'=>$value->review_detail_courses_curriculum,
                                    'review_detail_loan_scholarships'=>$value->review_detail_loan_scholarships,
                                    'review_remarks'=>$value->review_remarks
                                );
                            }
                        }
					}
				}
        	}
        }

    	$data['reviews']=$_reviews;
        if ($visible) $this->render('front_info_review_list',$data);
    }
}