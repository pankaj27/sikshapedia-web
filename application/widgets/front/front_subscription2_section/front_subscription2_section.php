<?php


/**
 * 
 */
class Front_subscription2_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    	$data['hi']='hi';
        if ($visible) $this->render('front_subscription2_section',$data);
    }
}