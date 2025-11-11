<?php


/**
 * 
 */
class Front_mobile_app_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    	$data['system_apple_store_logo']=CI()->data['system_apple_store_logo'];
    	$data['system_play_store_logo']=CI()->data['system_play_store_logo'];
    	$data['system_mobile_app_image']=CI()->data['system_mobile_app_image'];
        if ($visible) $this->render('front_mobile_app_section',$data);
    }
}