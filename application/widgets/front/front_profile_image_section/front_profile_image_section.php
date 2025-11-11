<?php


/**
 * 
 */
class Front_profile_image_section extends Widget
{

    function run($visible = FALSE,$user_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $user_image=base_url('uploads/app/default/no.jpg');

        if($user_id>0){
            $profile_image_found=$this->sm->__get_user_file('user_storage_type,user_file_type_id,media_disk_path_relative',array('user_storage_type'=>'user_image','user_file_type_id'=>$user_id));

            if(!empty($profile_image_found)){
                $user_image=$profile_image_found->media_disk_path_relative;
            }
        }

        $data['user_image']=$user_image;

        if ($visible) $this->render('front_profile_image_section',$data);
    }
}