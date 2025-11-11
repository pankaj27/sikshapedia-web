<?php


/**
 * 
 */
class Front_user_menu extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $data=array();

        if ($visible) $this->render('front_user_menu',$data);
    }
}