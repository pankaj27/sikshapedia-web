<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_details_section extends Widget
{
	function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        if($visible=='1'){
            $visible=TRUE;
        }

        $segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //news
        $segment_4=$this->uri->segment(4,0); //news

        $_news_data=array();
        $news_details=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') && (is_string($segment_3) && $segment_3=='news') && (is_string($segment_4) && $segment_4!='0')){

            $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

            if(!empty($country_data)){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));//College slug

                if(!empty($slug_found)){

                    $slug_type=$slug_found->slug_type;
                    $slug_type_id=$slug_found->slug_type_id;


                    if($slug_type=='6'){ //university
                    }else if($slug_type=='7'){ //college

                        $news_slug_found=$this->sm->get_slug(array('slug_value'=>$segment_4,'slug_type'=>'11'));//College slug

                        //print_obj($news_slug_found);die;

                        if(!empty($slug_found)){
                            $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

                            $_news_data=$this->nm->get_news(array('news_id'=>$news_slug_found->slug_type_id));

                            if(!empty($_news_data)){
                                $news_details=$this->nm->get_news_data(array('news_id'=>$news_slug_found->slug_type_id),FALSE);

                                
                            }else{

                            }

                            $news_details_data=array(
                                'news_data'=>$_news_data,
                                'news_details'=>$news_details
                            ); 
                        }  
                    }
                }
            }
        }

        $data['news_details_data']=$news_details_data;

        if ($visible) $this->render('front_news_details_section',$data);
    }
}