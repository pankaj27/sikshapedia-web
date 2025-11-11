<?php


/**
 * 
 */
class Front_student_high_school_details_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

        $grade_system=$this->sm->get_grades(array('grading_status'=>'1'),FALSE);

        $data['edu_details']=$this->sm->get_school_edu_details(array('details_user_id'=>$user_id));

        //print_obj($data['edu_details']);die;

        // foreach ($grade_system as $key => $value) {
        //    $_grades
        // }




        $data['userdata']=$this->data['userdata'];

        $data['grade_system']=$grade_system;

        if ($visible) $this->render('front_student_high_school_details_section',$data);
    }
}