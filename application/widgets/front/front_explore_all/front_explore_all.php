<?php


/**
 * 
 */
class Front_explore_all extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    	

        $country_data=$this->com->get_country(array('country_status'=>'1','country_id'=>'99'));

        // $data=array(
        //     'college_access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges',
        //     'course_access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/courses',
        //     'exam_access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/exams'
        // );

        $data=array(
            'college_access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges',
            'course_access_url'=>base_url('courses'),
            'exam_access_url'=>base_url('exams')
        );

        if ($visible) $this->render('front_explore_all',$data);
    }
}