<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_nearby_colleges_universities_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];

    	// $segment_1=$this->uri->segment(1,0); //country
     //    $segment_2=$this->uri->segment(2,0); //college,university url

        $college_data=array();

        $country_data=$this->com->get_country(array('country_id'=>$country_id));

    	if(!empty($country_data)){
    		$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

			//print_obj($_college_data);

			$city_id=$_college_data->college_city_id;
			$state_id=$_college_data->college_state_id;
			$country_id=$_college_data->college_country_id;

			$country_data=$this->com->get_country(array('country_id'=>$country_id));

			$param=array('college_user_id'=>$college_id,'country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'status'=>'1','is_verified'=>'1');

			$post=array('length'=>'6','start'=>'0');

			$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

			
			if(!empty($colleges)){
	    		foreach ($colleges as $key => $value) {
	    			$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
	    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

	    			$general_infos=$this->im->_get_inst_info_data(array('info_type_id'=>$value->college_user_id));

	    			if(!empty($general_infos)){
	    				if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
	                    $college_logo=$_college_logo->media_disk_path_relative;
	                    $college_logo_name=$_college_logo->media_org_name;
	                }else{
	                    $college_logo=base_url().'uploads/app/default/no.jpg';
	                    $college_logo_name='';
	                }

	                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
	                    $college_banner=$_college_banner->media_disk_path_relative;
	                    $college_banner_name=$_college_banner->media_org_name;
	                }else{
	                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
	                    $college_banner_name='';
	                }

	                $is_featured='2';

		    			$college_data[]=array(
		    				'college_id'=>encode_data($value->college_user_id),
		    				'college_type'=>encode_data(7),
		    				'college_name'=>$value->college_name,
		    				'college_city'=>$value->city_name,
		    				'college_state'=>$value->state_name,
		    				'college_country'=>$value->country_name,
		    				'college_country_id'=>encode_data($country_data->country_id),
		    				'college_country_phone_code'=>$country_data->country_phone_code,
		    				'college_logo'=>$college_logo,
		    				'college_banner'=>$college_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url
		    			);
	    			}	    				
	    		}
	    	}
    	}

        $data['colleges']=$college_data;

    	if ($visible) $this->render('front_nearby_colleges_universities_section',$data);
	}
}