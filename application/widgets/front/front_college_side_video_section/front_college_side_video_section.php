<?php


/**
 * 
 */
class Front_college_side_video_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


     	$country_id=$ids['country_id'];
     	$college_id=$ids['college_id'];


     	$_college_intro_video=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_intro_video'));

     	//print_obj($_college_intro_video);die;

     	$data['college_intro_vide']=$college_intro_video=$_college_intro_video->media_disk_path_relative;

     	if ($visible) $this->render('front_college_side_video_section',$data);

    }
}