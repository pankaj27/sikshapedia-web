<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_placement_details_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];


    	$college_placements=array();
		$placement_intro=array();
		$info_curator='Waytoadmissions Team';
		$curator_image='';

		$system_name=$this->data['system_title_name'];

		/*
		

         'college_info_curator'=>$info_curator,
         'college_curator_image'=>$curator_image,
         'college_info_updated'=>$info_updated,
         'college_admission_data'=>$infos_data,
         'college_admission_faqs'=>$admission_faqs,

		*/

		$info=$this->im->_get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id,'info_type_2'=>'placement_info'));


		if(!empty($info)){
			$uploaded_by=$this->um->_get_internal_user(array('user_id'=>$info[0]->info_creator_id));

	        $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$info[0]->info_creator_id),NULL,FALSE);

	        if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
	          $curator_image=$user_image->media_disk_path_relative;
	        }else{
	          $curator_image=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
	        }


	        $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';

	        $info_updated=(isDateValid($info[0]->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($info[0]->info_updated_at)):'';
		}

			

		 // print_obj($info);exit;
		$data=array(
			'college_info_curator'=>$info_curator,
         	'college_curator_image'=>$curator_image,
         	'college_info_updated'=>$info_updated,
        	'college_placement_data'=>$info,
        	'college_placements'=>null
      );

     //print_obj($data);exit;

      if ($visible) $this->render('front_placement_details_section',$data);
    }
}