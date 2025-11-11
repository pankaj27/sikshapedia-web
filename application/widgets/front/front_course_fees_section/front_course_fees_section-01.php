<?php


/**
 * 
 */
class Front_course_fees_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];

    	$course_fees_data=array();
      	$college_data=array();
      	$course_stream_details=array();

    	$country_data=$this->com->get_country(array('country_id'=>$country_id));

    	if(!empty($country_data)){

    		$college_data=$this->im->get_college_specific_data(array('college_user_id'=>$college_id),'',TRUE);



    	}


    }

}