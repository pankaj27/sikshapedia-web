<?php


/**
 * 
 */
class Front_menu_top extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $menues_fields='menu_name,menu_link,menu_is_top,menu_is_active,menu_parent_id,menu_is_upper_top';

        $top_menues=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'2','menu_is_active'=>'1','menu_parent_id'=>'0','menu_is_upper_top'=>'1'),FALSE,'menu_serial','ASC',FALSE);

    	$main_menues=array();


    	if(!empty($top_menues)){
    		foreach ($top_menues as $key => $value){
    			$main_menues[]=array(
    				'menu_name'=>strtoupper($value->menu_name),
    				'menu_link'=>$value->menu_link                    
    			);
    		}
    	}


        if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
           $user_id_decoded=decode_data(session_userdata('user_id'));
           

           if($this->data['userdata']->user_phone_no_verified=='1'){
            $data['scholarshiplink']='href="'.base_url().'in/scholarship"';
           }else{
            $data['scholarshiplink']='href="'.base_url().'account/'.encode_data($userdata->user_id).'/'.encode_data('scholarship').'"';
           }

           $data['userdata']=$this->data['userdata'];
        }else{
          $data['scholarshiplink']='href="#logModal" data-toggle="modal"';
        }



    	$data['top_menues']=$main_menues;

      if ($visible) $this->render('front_menu_top',$data);
    }
}