<?php


/**
 * 
 */
class Front_ranking_brief_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$data['news_data']='';

    	if ($visible) $this->render('front_ranking_brief_section',$data);
    }
}