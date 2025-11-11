<?php


/**
 * 
 */
class Front_news_side_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];


        if ($visible) $this->render('front_news_side_section',$data);
    }
}