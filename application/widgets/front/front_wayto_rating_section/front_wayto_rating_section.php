<?php


/**
 * 
 */
class Front_wayto_rating_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$data=array();

    	if ($visible) $this->render('front_wayto_rating_section',$data);
    }
}