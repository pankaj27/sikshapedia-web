<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_rating_brief_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);


    	$data['news_data']='';

    	if ($visible) $this->render('front_rating_brief_section',$data);
    }
}