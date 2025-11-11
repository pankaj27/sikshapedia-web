<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_featured extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);


    	$segment_1=$this->uri->segment(1,0);

    	if((is_string($segment_1) && $segment_1=='news')){
			$news=$this->nm->get_news(array('news_is_featured'=>'1','is_published'=>'1'),FALSE,'news_id','DESC');

			//$news=$this->nm->__get_news(array('system_news.news_is_featured'=>'1','system_news.is_published'=>'1'),TRUE,$length=6,$start=0,$order_by='news_id', $order='DESC',$return_query=TRUE);

			//print_obj($news);die;
	    	
	    	if(!empty($news)){
	    		foreach ($news as $key => $value) {

	    			$news_type=$this->nm->get_news_type(array('news_types_news_id'=>$value->news_id));    			

	    			if($news_type->news_types=='1'){
	    				$param=array('url_type'=>'news_article','url_sub_type'=>'college_news_url','url_type_id'=>$value->news_id,'url_sub_type_id'=>$news_type->news_types_id);
	    			}else{
	    				$param=null;
	    			}

	    			$slug=$this->sm->get_slug_urls($param);

	    			//print_obj($slug);

	    			$news_data[]=array(
	    				'news_short_title'=>str_ellipses($value->news_title,30),
	    				'news_publish_date'=>date('M d,Y',strtotime($value->created_at)),
	    				'news_image'=>$value->news_image_banner_url,
	    				'news_title'=>$value->news_title,
	    				'news_link'=>$slug->url_value,
	    				'news_types'=>''
	    			);
	    		}


	    		//die;

	    		//print_obj($news_data);die;
	    	}
    	}
	    	
    	$data['news_data']=$news_data;

    	if ($visible) $this->render('front_news_featured',$data);
    }
}