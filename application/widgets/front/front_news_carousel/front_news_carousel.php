<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_carousel extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0);

    	$news_data=array();

    	if((is_string($segment_1) && $segment_1=='news')){

    		$news=$this->nm->get_news(array('news_is_trending'=>'yes','is_published'=>'1'),FALSE,'news_id','DESC');

	    	if(!empty($news)){
	    		foreach ($news as $key => $value) {
	    			$news_type=$this->nm->get_news_type(array('news_types_news_id'=>$value->news_id));

	    			if($news_type->news_types=='1'){
	    				//$param=array('url_type'=>'news_article','url_sub_type'=>'college_news_url','url_type_id'=>$value->news_id,'url_sub_type_id'=>$news_type->news_types_id);

	    				$param=array('url_type'=>'news_article','url_type_id'=>$value->news_id,'url_sub_type_id'=>$news_type->news_types_id);
	    			}else{
	    				$param=null;
	    			}

	    			$slug=$this->sm->get_slug_urls($param);

	    			//print_obj($slug);die;

	    			$n_slug=url_slug($value->news_title);
	    			$n_slug_url=base_url('news/'.$n_slug);
	    			
	    			$news_data[]=array(
	    				'news_short_title'=>$value->news_title,
	    				'news_publish_date'=>date('M d,Y',strtotime($value->created_at)),
	    				'news_image'=>$value->news_image_banner_url,
	    				'news_title'=>$value->news_title,
	    				'news_link'=>$n_slug_url
	    			);
	    		}
	    	}
    	}
	    	
    	$data['news_data']=$news_data;

    	if ($visible) $this->render('front_news_carousel',$data);
    }
}