<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_menu extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $slug_1=$this->uri->segment(1,0);//country

        $footer_ads_heading=array();
        $footer_ads=array();

 
        if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
           $user_id_decoded=decode_data(session_userdata('user_id'));
           $userdata=$this->um->get_user_data(array('user_id'=>$user_id_decoded),null,'0');

           if($userdata->user_phone_no_verified=='1'){
            $data['scholarshiplink']='href="'.base_url().'in/scholarship"';
           }else{
            $data['scholarshiplink']='href="'.base_url().'account/'.encode_data($userdata->user_id).'/'.encode_data('scholarship').'"';
           }

           //print_obj($userdata);die;

           $data['userdata']=$userdata;
        }else{
          $data['scholarshiplink']='href="#logModal" data-toggle="modal"';
        }

           
        $data['mainmenu']='';

        if ($visible) $this->render('front_menu',$data);
    }
}