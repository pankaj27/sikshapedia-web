<?php


/**
 * 
 */
class Front_ranking_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
     	$college_id=$ids['college_id'];
     	$info_type=$ids['college_info_type'];

    	$infos_data=array();
     	$info_curator='';
     	$curator_image=base_url('public/data/app/app_data/waytologo.png');
     	$info_updated='';

      $college_data=$this->im->___get_college_profile_data('college_user_id,college_name,state_name',array('college_user_id'=>$college_id));

     	$system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
     	$settings_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';
     	$system_name=$this->data['system_title_name'];
     	$country_data=$this->com->get_country(array('country_id'=>$country_id));
     	$infos_data=$this->im->__get_inst_info_data(array('info_type'=>$info_type,'info_type_2'=>'ranking_info','info_type_id'=>$college_id),NULL,'info_serial','ASC',FALSE);

      //print_obj($infos_data);die;

     	if(!empty($infos_data)){
     		$uploaded_by=$this->um->_get_internal_user(array('user_id'=>$infos_data[0]->info_creator_id));
     		$info_updated=(isDateValid($infos_data[0]->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($infos_data[0]->info_updated_at)):'';
     		$user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$infos_data[0]->info_creator_id),NULL,FALSE);

           if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
             $curator_image=$user_image->media_disk_path_relative;
           }
           $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';
     	}

     	$ranking_faqs=$this->sm->get_system_users_faqs_data(array('faq_data_id'=>$college_id,'faq_data_id_type'=>$info_type,'faq_type'=>'6'),FALSE);

      //$college_ranking_data=$this->im->get_inst_ranking_data(array('ranking_inst_type'=>'college','ranking_inst_id'=>$college_id),FALSE);
      $info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id,'info_value_type'=>'2','info_type_2'=>'general_info'));
     
      $college_ranking_info=(!empty($info))?$info->info_value_ranking_intro:'';


      $college_ranking_bodies=$this->im->get_college_ranking_bodies($college_id);

      if(!empty($college_ranking_bodies)){
        foreach ($college_ranking_bodies as $key => $value) {
          $ranking_data=$this->im->_get_inst_ranking_data(array('ranking_inst_type'=>'college','ranking_inst_id'=>$college_id,'ranking_body_id'=>$value->ranking_body_id));
          $college_ranking_data[]=array(
            'ranking_text'=>$college_data->college_name.' '.$value->rank_category.' ranking by '.$value->rank_body.' is '.$value->ranking_value.' out of '.$value->ranking_value.' colleges in India in '.$value->ranking_year,
            'ranking_category'=>$value->rank_category,
            'ranking_body'=>$value->rank_body,
            'ranking_body_logo'=>$value->ranking_logo,
            'ranking'=>$ranking_data
          );
        }
      }

      //print_obj($college_ranking_data);die;



     	$data=array(
         'college_info_curator'=>$info_curator,
         'college_curator_image'=>$curator_image,
         'college_info_updated'=>$info_updated,
         'college_ranking_data'=>$college_ranking_data,
         'college_ranking_info'=>$college_ranking_info,
         'college_ranking_faqs'=>$ranking_faqs,
      	);


      //print_obj($college_ranking_data);die;

     	

    	if ($visible) $this->render('front_ranking_section',$data);
    }
}