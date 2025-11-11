<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_info_review_list_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //college,university url

       // echo $segment_1;

        //print_obj($segment_1);die;

        $_reviews=array();


        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
        	$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

            //print_obj($country_data);

        	if(!empty($country_data)){
        		$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

                //print_obj($slug_found);

        		if(!empty($slug_found)){
        			$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;
					$slug_value=$slug_found->slug_value;

					if($slug_type=='6'){//University
					}else if($slug_type=='7'){//College
						$post=array('length'=>'8','start'=>'0');

                        if((is_string($segment_3) && $segment_3!='0' && $segment_3=='faculty')){
                            $param=array('review_approved'=>'1','review_inst_id'=>$slug_type_id,'review_faculty_details!='=>NULL);
                            $data['review_list_heading']='COLLEGE FACULTY REVIEWS';
                        }else if((is_string($segment_3) && $segment_3!='0' && $segment_3=='placement')){
                            $param=array('review_approved'=>'1','review_inst_id'=>$slug_type_id,'review_faculty_details'=>NULL,'    review_placement_details!='=>NULL);
                            $data['review_list_heading']='COLLEGE PLACEMENT REVIEWS';
                        }else{
                            $param=array('review_approved'=>'1','review_inst_id'=>$slug_type_id);
                            $data['review_list_heading']='COLLEGE INFO REVIEWS';
                        }


                        
                        $reviews=$this->um->get_review_datas($post,$param);

                        //print_obj($reviews);die;

                        $data['total_reviews']=$this->um->_get_review_data($post,$param,TRUE);

                        //print_obj($reviews);data['

                        if(!empty($reviews)){
                            foreach ($reviews as $key => $value) {
                                $average_rating=$value->review_average_rating;
                                $_reviews[]=array(
                                    'review_user_name'=>$value->review_user_name,
                                    'review_user_short_name'=>$value->review_user_name_short,
                                    'review_heading'=>$value->review_heading,
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
                                    'review_remarks'=>$value->review_remarks,
                                    'review_faculty_marks'=>$value->review_faculty_marks,
                                    'review_placement_marks'=>$value->review_placement_marks,
                                    'review_campus_life_marks'=>$value->review_campus_life_marks,
                                    'review_college_life_marks'=>$value->review_college_life_marks,
                                    'review_hostel_life_marks'=>$value->review_hostel_life_marks,
                                    'review_internship_marks'=>$value->review_internship_marks,
                                    'review_interviews_marks'=>$value->review_interviews_marks,
                                    'review_course_marks'=>$value->review_course_marks,
                                    'review_social_life_marks'=>$vlaue->review_social_life_marks,
                                    'average_rating'=>$average_rating
                                );
                            }
                        }
					}
				}
        	}
        }

        //print_obj($_reviews);die;

    	$data['reviews']=$_reviews;
        if ($visible) $this->render('front_info_review_list_section',$data);
    }
}