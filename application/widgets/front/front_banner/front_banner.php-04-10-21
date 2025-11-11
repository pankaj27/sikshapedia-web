<?php


/**
 * 
 */
class Front_banner extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$banners=$this->sm->get_user_files(array('user_file_show_in_banner'=>'1','user_storage_type'=>'user_banner'));

    	if(!empty($banners)){
    		foreach ($banners as $key => $value) {

    			if($value->user_file_type=='3'){
    				$type_data=$this->im->get_university_profile_data(array('university_user_id'=>$value->user_file_type_id));
    				$banner_name=$type_data->university_name;
                    $access_url=$type_data->access_url;
    			}else if($value->user_file_type=='4'){
    				$type_data=$this->im->get_college_profile_data(array('college_user_id'=>$value->user_file_type_id));
    				$banner_name=$type_data->college_name;
                    $access_url=$type_data->access_url;
    			}

    			//$type_data=$this->um->get_user_data(array('user_id'=>$value->user_file_type_id,'user_role'=>$value->user_file_type));

    			//print_obj($type_data);

    			$_banners[]=array(
    				'banner_image'=>$value->media_disk_path_relative,
    				'banner_name'=>ucwords($banner_name),
                    'access_url'=>$access_url
    			);
    		}
    	}else{
    		$_banners=array();
    	}

    	//die;

    	//print_obj($_banners);die;

    	$data['banners']=$_banners;
        if ($visible) $this->render('front_banner',$data);
    }
}