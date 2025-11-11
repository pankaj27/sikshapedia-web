<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_top_trending extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);


    	$segment_1=$this->uri->segment(1,0);

    	//echo $segment_1;die;

    	$news_data=array();

    	$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));



    	if(!empty($country_data)){
    		$country_id=$country_data->country_id;

    		$news=$this->nm->get_news(array('news_is_top_trending'=>'yes','is_published'=>'1','news_country'=>$country_id),FALSE,'news_id','DESC');



	    	if(!empty($news)){
	    		foreach ($news as $key => $value) {
	    			$news_data[]=array(
	    				'news_short_title'=>$value->news_title,
	    				'news_publish_date'=>date('M d,Y',strtotime($value->created_at)),
	    				'news_image'=>$value->news_image_banner_url,
	    				'news_title'=>$value->news_title,
	    				'news_link'=>''
	    			);
	    		}

	    		//print_obj($news_data);die;
	    	}
    	}



	    	
    	$data['news_data']=$news_data;

    	if ($visible) $this->render('front_news_top_trending',$data);
    }
}