<?php


/**
 * 
 */
class Front_student_prof_exp_details_section extends Widget
{
    function run($visible = FALSE,$user_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

        $prof_details_found=$this->sm->get_professional_exp_details(array('exp_user_id'=>$user_id),FALSE);

        //print_obj($prof_details_found);die;

        $years=array('0-1'=>'0-1','1-2'=>'1-2','2-3'=>'2-3','3-4'=>'3-4','4-5'=>'4-5','5-6'=>'5-6','6-7'=>'6-7','7-8'=>'7-8','>10'=>'>10');

        $data['years']=$years;
        $data['prof_details_found']=$prof_details_found;

        //print_obj($data);

        $userdata=$this->data['userdata'];

        //$data=$userdata;

        if ($visible) $this->render('front_student_prof_exp_details_section',$data);
    }
}