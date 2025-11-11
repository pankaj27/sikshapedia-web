<?php


/**
 * 
 */
class Front_results_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

        //print_obj($ids);die;


     $country_id=$ids['country_id'];
     $college_id=$ids['college_id'];
     $info_type=$ids['college_info_type'];

     //echo $info_type;die;

     $infos_data=array();
     $info_curator='';
     $curator_image=base_url('public/data/app/app_data/waytologo.png'); 

     $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
     $settings_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

     //print_obj($system_general_settings);

     //$system_name=($settings_value!='')?$settings_value->system_name:'Waytoadmissions';

     $system_name=$this->data['system_title_name'];

    	$country_data=$this->com->get_country(array('country_id'=>$country_id));

      $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$info->info_creator_id));

    
    	//print_obj($country_data);die;

      //echo $info_type;

    	//if(!empty($country_data)){
    		   $infos_data=$this->im->__get_inst_info_data(array('info_type'=>$info_type,'info_type_2'=>'result_info','info_type_id'=>$college_id),NULL,'info_serial','ASC',FALSE);

               //print_obj($infos_data);die;



            $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$infos_data[0]->info_creator_id));

            //print_obj($uploaded_by);

            $info_updated=(isDateValid($infos_data[0]->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($infos_data[0]->info_updated_at)):'';

            $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$infos_data[0]->info_creator_id),NULL,FALSE);

           if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
             $curator_image=$user_image->media_disk_path_relative;
           }

           $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';

           //print_obj($info_curator);

            $result_faqs=$this->sm->get_system_users_faqs_data(array('faq_data_id'=>$college_id,'faq_data_id_type'=>$info_type,'faq_type'=>'5'),FALSE);
    	//}
        

      $data=array(
         'college_info_curator'=>$info_curator,
         'college_curator_image'=>$curator_image,
         'college_info_updated'=>$info_updated,
         'college_results_data'=>$infos_data,
         'college_results_faqs'=>$result_faqs,
      );

      //print_obj($data);exit;

      if ($visible) $this->render('front_results_section',$data);
    }
}