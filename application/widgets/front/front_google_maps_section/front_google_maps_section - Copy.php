<?php


/**
 * 
 */
class Front_google_maps_section extends Widget
{
  function run($visible = FALSE){
    $this->front_theme='default';
    $this->get_type(2);
      
    $segment_1=$this->uri->segment(1,0); //country
    $segment_2=$this->uri->segment(2,0); //college,university url

    $maps_data=array();

    if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
      $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

      if(!empty($country_data)){
        $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

        if(!empty($slug_found)){
          $slug_type=$slug_found->slug_type;
          $slug_type_id=$slug_found->slug_type_id; 

          if($slug_type=='6'){

          }else if($slug_type=='7'){
            $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

            $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
            $state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

            $college_address=$college_data->college_address.','.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).','.$college_data->college_zipcode;

            $maps_data=array(
              'college_name'=>$college_data->college_name,
              'college_phone_no'=>$college_data->user_phone_no,
              'college_country'=>strtoupper($country_data->country_name),
              'college_state'=>strtoupper($state_data->state_name),
              'college_country_id'=>encode_data($college_data->college_country_id),
              'college_city_id'=>$city_data->city_id,
              'college_city_state_id'=>$city_data->city_state_id,
              'college_city_country_id'=>$city_data->city_country_id,
              'college_city'=>strtoupper($city_data->city_name),
              'college_address'=>$college_address,
              'college_zipcode'=>$college_data->college_zipcode,
              'college_direction'=>'',
              'college_web_address'=>$college_data->college_web_address,
              'college_google_map'=>'https://www.google.com/maps/embed/v1/place?key=AIzaSyCZm1_Yt_mBz93LOSnI640QAn6eeP891MU&q='.$college_address,
            );
          }
        }
      }
    }

    $data['google_maps_data']=$maps_data;

    if ($visible) $this->render('front_google_maps_section',$data);
  }
}