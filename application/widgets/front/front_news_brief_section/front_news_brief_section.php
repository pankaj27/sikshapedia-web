<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_brief_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $country_data=$this->com->get_country(array('country_id'=>$country_id));

        if(!empty($country_data)){

            $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

            //print_obj($_college_data);die;

            $news_view_all_link=$_college_data->access_url.'/news';

            if(!empty($_college_data)){

                $news_type_data=$this->nm->_get_news_type(array('news_types_id'=>$college_id,'news_types'=>'1'),FALSE);

                //print_obj($news_type_data);die;

                //https://static.waytoadmissions.com/data/colleges/new-horizon-college-of-engineering-bangalore-karnataka/Q8tGIY5vXO.jpg

                if(!empty($news_type_data)){
                    foreach ($news_type_data as $key => $value) {

                        //$news_slug=$this->sm->get_slug_urls(array('url_sub_type'=>'college_news_url','url_sub_type_id'=>$college_id,'url_type'=>'news_article','url_type_id'=>$value->news_types_news_id));

                        $news_slug=base_url('news/'.url_slug($value->news_title));

                        //$news_banner_image=$this->sm->get_file(array('storage_id'=>$value->));
                        $news_data[]=array(
                            'news_title'=>$value->news_title,
                            'news_image'=>($value->news_image_banner_url!=NULL)?$value->news_image_banner_url:'https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg',
                            'news_published'=>date('F d,Y',strtotime($value->created_at)),
                            'news_link'=>$news_slug,
                            'new_user_image'=>base_url('public/data/app/app_data/way2a.png?tr=h-50,w-50,c-force'),
                            'news_user_name'=>'Sikshapedia'
                        );
                    }
                }
            }
        }        	
       

        $data['news_data']=$news_data;
        $data['news_view_all_link']=$news_view_all_link;

       //print_obj($data);die;
        

    	if ($visible) $this->render('front_news_brief_section',$data);
	}
}