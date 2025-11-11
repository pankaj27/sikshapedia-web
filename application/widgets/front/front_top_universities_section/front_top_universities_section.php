<?php


/**
 * 
 */
class Front_top_universities_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$param=array('university_status'=>'1','university_is_top'=>'1','university_is_top_visible_home'=>'1','is_verified_by_admin'=>'1');

    	$top_universities=$this->im->_get_universities(null,$param);

    	//print_obj($top_universities);die;

    	if(!empty($top_universities)){
    		foreach ($top_universities as $key => $value) {
    			$university_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
    			$university_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

    			//print_obj($type_data);

    			$university_data[]=array(
    				'university_name'=>$value->university_name,
    				'university_city'=>$value->city_name,
    				'university_state'=>$value->state_name,
    				'university_country'=>$value->country_name,
    				'university_logo'=>$university_logo->media_disk_path_relative,
    				'university_banner'=>$university_banner->media_disk_path_relative
    			);
    		}
    	}else{
    		$university_data=array();
    	}

    	//die;

    	//print_obj($college_data);die;


    	$data['top_universities']=$university_data;
        if ($visible) $this->render('front_top_universities_section',$data);
    }
}