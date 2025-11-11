<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_course_fees_brief_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //inner menues
        $segment_4=$this->uri->segment(4,0);//city

        //echo $visible;die;

        if($visible=='1'){
        	$visible=TRUE;
        }

        $course_fees_data=array();
        $college_data=array();
        $course_stream_details=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') || (is_string($segment_3) && $segment_3!='0')){

            $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

            if(!empty($country_data)){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

                // print_obj($slug_found);die;

                if(!empty($slug_found)){
                    $slug_type=$slug_found->slug_type;
                    $slug_type_id=$slug_found->slug_type_id;
                    $slug_value=$slug_found->slug_value;

                    if($slug_type=='6'){//University

                    }else if($slug_type=='7'){//College
                        $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

                        if(!empty($_college_data)){
                            
                        }
                    }
                }
            }
        }

        if ($visible) $this->render('front_course_fees_brief_section',$data);
	}
}