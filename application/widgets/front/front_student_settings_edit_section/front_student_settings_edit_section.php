<?php


/**
 * 
 */
class Front_student_settings_edit_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));


        $data['userdata']=$this->data['userdata'];

      

        //print_obj($data['affiliations']);die;

       
        if ($visible) $this->render('front_student_settings_edit_section',$data);
    }
}