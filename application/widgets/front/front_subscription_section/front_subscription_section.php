<?php


/**
 * 
 */
class Front_subscription_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_i=$this->uri->segment(1,0);

    	$country_data=$this->com->__get_country('country_id,country_iso_code_4',array('country_iso_code_4'=>$segment_i));

		$system_courses=$this->strm->get_course(array('course_status'=>'1','course_is_top'=>'1'),FALSE);

    	$data['country_data']=$country_data;
		$data['courses']=$system_courses;
        if ($visible) $this->render('front_subscription_section',$data);
    }
}