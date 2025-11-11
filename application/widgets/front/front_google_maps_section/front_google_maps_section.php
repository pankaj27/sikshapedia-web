<?php


/**
 * 
 */
class Front_google_maps_section extends Widget
{
  function run($visible = FALSE,$ids=null){
    $this->front_theme='default';
    $this->get_type(2);
      
    // $segment_1=$this->uri->segment(1,0); //country
    // $segment_2=$this->uri->segment(2,0); //college,university url


    $country_id=$ids['country_id'];
    $college_id=$ids['college_id'];

    $maps_data=array();

   $country_data=$this->com->get_country(array('country_id'=>$country_id));

    if(!empty($country_data)){
      $college_data=$this->im->___get_college_profile_data('college_user_id,college_city_id,city_name,college_email,college_state_id,state_name,college_name,college_phone_no,country_name,college_country_id,city_id,city_state_id,college_zipcode,college_web_address,college_address,college_paid',array('college_user_id'=>$college_id));

      //print_obj($college_data);


      //print_obj($college_data);

      //$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
      //$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

      $college_address=$college_data->college_address.','.strtoupper($college_data->city_name).','.strtoupper($college_data->state_name).','.strtoupper($college_data->country_name).','.$college_data->college_zipcode;

      $maps_data=array(
        'college_paid'=>$college_data->college_paid,
        'college_name'=>$college_data->college_name,
        'college_phone_no'=>$college_data->college_phone_no,
        'college_country'=>strtoupper($college_data->country_name),
        'college_state'=>strtoupper($college_data->state_name),
        'college_country_id'=>encode_data($college_data->college_country_id),
        'college_city_id'=>$college_data->city_id,
        'college_city_state_id'=>$college_data->city_state_id,
        'college_city_country_id'=>$college_data->city_country_id,
        'college_city'=>strtoupper($college_data->city_name),
        'college_address'=>strtoupper($college_address),
        'college_zipcode'=>$college_data->college_zipcode,
        'college_direction'=>'',
        'college_web_address'=>$college_data->college_web_address,
        'college_email_address'=>$college_data->college_email,
        'college_google_map'=>'https://www.google.com/maps/embed/v1/place?key=AIzaSyCZm1_Yt_mBz93LOSnI640QAn6eeP891MU&q='.$college_address,
      );

      //print_obj($maps_data);die;
    }

    $data['google_maps_data']=$maps_data;

    // print_obj($data['google_maps_data']);

    if ($visible) $this->render('front_google_maps_section',$data);
  }
}