<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_latest extends Widget
{
	function run($visible = FALSE,$country_code='in'){
		$this->front_theme='default';
    	$this->get_type(2);

        $param=array('news_country_code'=>$country_code,'is_published'=>'1');

        $news=$this->nm->__get_news($param,TRUE,10);

        $news_list=array();

        if(!empty($news)){
            foreach ($news as $key => $value) {
                if($value->news_image_banner_url!=NULL){
                    $news_banner=$value->news_image_banner_url;
                }else{
                    $news_banner=SITE_ASSETS_URL.'data/app/app_data/no.jpg';
                }

                $get_slug_urls=$this->sm->get_slug_urls(array('url_type'=>'news_article','url_type_id'=>$value->news_id));

                
                if(!empty($get_slug_urls)){
                    $news_url=$get_slug_urls->url_value;
                }else{
                    $news_url='';
                }

                $news_list[]=array(
                    'news_heading'=>$value->news_title,
                    'news_banner'=>$news_banner,
                    'news_link'=>$news_url,
                    'news_published_date'=>date('F d,Y',strtotime($value->created_at))
                );
            }
        }

	    	
    	$data['news_list']=$news_list;

    	if ($visible) $this->render('front_news_latest',$data,60);
    }
}