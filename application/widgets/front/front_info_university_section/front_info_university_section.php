<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_info_university_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$infos_data=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $system_name=$this->data['system_title_name'];

        //echo $college_id;die;

		    $info=$this->im->get_inst_info_data(array('info_type'=>'1','info_type_id'=>$college_id));

		    //print_obj($info);die;

		    $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$info->info_creator_id));

        $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$info->info_creator_id),NULL,FALSE);

        if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
          $curator_image=$user_image->media_disk_path_relative;
        }else{
          $curator_image=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
        }


        $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';

    		$infos_data=array(
    			'info_curator'=>$info_curator,
    			'info_curator_image'=>$curator_image,
    			'info_updated'=>(isDateValid($info->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($info->info_updated_at)):'',
          'info_college_intro'=>$info->info_value,
          'info_college_about'=>$info->info_value_about,
    		);

        //print_obj($infos_data);die;

        $data['college_intro_data']=$infos_data;


        //print_obj($data['college_intro_data']);die;

        if ($visible) $this->render('front_info_university_section',$data);
	}
}