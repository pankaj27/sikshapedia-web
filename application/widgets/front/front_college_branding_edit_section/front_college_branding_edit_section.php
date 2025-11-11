<?php


/**
 * 
 */
class Front_college_branding_edit_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

    	// $xapi_key=$this->um->get_user_api_key(array('user_id'=>decode_data('user_id')));

     //    $url=API_URL.'instapi/colleges/'.$user_id;
     //    $curl_param['url']=$url;
     //    $curl_param['headers']=array("X-API-KEY: ".$xapi_key->key);
     //    $curl_param['auth_user']=API_GEN_AUTH_USER;
     //    $curl_param['auth_pass']=API_GEN_AUTH_PASS;
     //    $curl_param['ssl_verify']='1';
     //    $curl_param['ssl_verify_peer']=true;
     //    //$curl_param['data']=$userdata;

     //    $data=_curl_get($curl_param);

        $user_logo=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$user_id));

        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
            $user_logo=$user_logo->media_disk_path_relative;
            $user_logo_name=$user_logo->media_org_name;
        }else{
            $user_logo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';
            $user_logo_name='';
        }

        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
            $user_banner=$user_banner->media_disk_path_relative;
            $user_banner_name=$user_banner->media_org_name;
        }else{
            $user_banner=base_url().'uploads/app/default/pageBnr.jpg';
            $user_banner_name='';
        }


        $data['file_logo']=$user_logo;
        $data['file_cover_image']=$user_banner;

        //print_obj($data['file_logo']);

        if ($visible) $this->render('front_college_branding_edit_section',$data);
    }
}