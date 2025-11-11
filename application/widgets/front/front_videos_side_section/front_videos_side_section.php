<?php


/**
 * 
 */
class Front_videos_side_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $country_data=$this->com->get_country(array('country_id'=>$country_id));

        if(!empty($country_data)){
            $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id)); 

            $files=$this->sm->___get_user_file('storage_id,media_disk_path_relative,user_storage_type,user_file_type_id,user_file_type',array('user_storage_type'=>'user_intro_video','user_file_type'=>'4','user_file_type_id'=>$college_id),FALSE);

            //print_obj($files);die;
           

            if(!empty($files)){
                foreach ($files as $key => $value) {

                    if(!empty($value->media_disk_path_relative)){
                         $video_data[]=array(
                            'storage_id'=>encode_data($value->storage_id),
                            'storage_file'=>$value->media_disk_path_relative
                        );
                    }                           
                }
            }else{
                $video_data=array();
            } 
        }else{
            $video_data=array();
        }

       //print_obj($gallery_data);die;

        $data['video_data']=$video_data;
        $data['college_id']=$college_id;

        if ($visible) $this->render('front_videos_side_section',$data);
    }
}