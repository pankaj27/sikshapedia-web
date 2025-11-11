<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_colleges_same_location_side_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);


    	

    	if ($visible) $this->render('front_colleges_same_location_side_section',$data);
    }
}
