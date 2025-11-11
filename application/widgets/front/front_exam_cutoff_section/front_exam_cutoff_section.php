<?php


/**
 * 
 */
class Front_exam_cutoff_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];





    	$data['cutoff_data']='';

       //print_obj($data);

        if ($visible) $this->render('front_exam_cutoff_section',$data);

    }

}