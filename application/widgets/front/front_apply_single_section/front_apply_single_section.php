<?php


/**
 * 
 */
class Front_apply_single_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


     $country_id=$ids['country_id'];
     $college_id=$ids['college_id'];

     $cdata=array();

        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        if(!empty($college_data)){

            $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
            $country_data=$this->com->__get_country('country_id,country_phone_code',array('country_id'=>$college_data->college_country_id));


            $user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

            if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
                $college_logo=$user_logo->media_disk_path_relative;
            }else{
                $college_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
            }

            if(!empty($college_data->college_whatsapp_no)){
                $college_whatsapp_link="https://wa.me/{$college_data->college_whatsapp_no}?text=Hello ,I am contacting through https://www.sikshapedia.com&utm_source=website&utm_medium=whatsapp";
            }else{
                $college_whatsapp_link='';
            }

            if(!empty($college_data->college_phone_no)){

                $college_phone_link="tel:{$college_data->college_phone_no}";
            }else{
                $college_phone_link="";
            }

            //echo session_userdata('user_id');die;

            if(session_userdata('user_id')){
                $user_id=session_userdata('user_id');
            }else{
                $user_id='';
            }

            

            if($user_id==''){
                $college_phone_link="https://www.sikshapedia.com/signup/student";
                $college_whatsapp_link='https://www.sikshapedia.com/signup/student';
            }

            $cdata=array(
                'college_id'=>$college_data->college_user_id,
                'college_name'=>strtoupper($college_data->college_name),
                'college_type'=>$college_data->college_utype,
                'college_city'=>strtoupper($city_data->city_name),
                'college_country_id'=>$country_data->country_id,
                'college_country_phone_code'=>$country_data->country_phone_code,
                'college_logo'=>$college_logo,
                'college_has_verified_badge'=>$college_data->college_has_verified_badge,
                'college_whatsapp_link'=>$college_whatsapp_link,
                'college_phone_link'=>$college_phone_link
            );
        }

        //print_obj($cdata);die;

        $data['college_data']=$cdata;


      if ($visible) $this->render('front_apply_single_section',$data);
    }
}