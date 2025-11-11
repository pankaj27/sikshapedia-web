<?php


/**
 * 
 */
class Front_top_study_places extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $default_country_data=$this->data['default_country_data'];


        //,'city_is_top'=>'1'

        $top_cities=$this->com->get_city(array('city_country_id'=>$default_country_data->country_id,'city_show_in_widget'=>'yes'),FALSE,'city_serial','ASC');

        $data['default_country_data']=$default_country_data;

        $_top_cities=array();

        if(!empty($top_cities)){
            foreach ($top_cities as $key => $value) {
                $slug_url=$this->sm->get_slug_urls(array('url_type'=>'college_static_urls','url_country'=>$default_country_data->country_id,'url_city'=>$value->city_id));
                $_top_cities[]=array(
                    'city_name'=>$value->city_name,
                    'city_slug_url'=>base_url($value->city_name_state_slug),
                    'city_icon_img'=>DIR_CDN.'data/cities/'.strtolower($value->city_name).'.svg?tr=c-force',
                    'city_img_alt_text'=>ucwords($value->city_img_alt_text),
                    'city_img_title'=>ucwords($value->city_img_title)
                );
            }
        }

        $data['top_cities']=$_top_cities;


        if ($visible) $this->render('front_top_study_places',$data);
    }
}