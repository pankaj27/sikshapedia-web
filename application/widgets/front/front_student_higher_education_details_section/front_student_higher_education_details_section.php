<?php


/**
 * 
 */
class Front_student_higher_education_details_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

        $data['higher_edu_details']=$this->sm->get_higher_edu_interests_details(array('edu_user_id'=>$user_id),FALSE);

        //print_obj($data['higher_edu_details']);die;


        $data['course_program_type']=$this->strm->get_course_program_type(null,FALSE);

        $userdata=$this->data['userdata'];

        if ($visible) $this->render('front_student_higher_education_details_section',$data);
    }
}