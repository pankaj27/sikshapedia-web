<?php


/**
 * 
 */
class Front_exams_courses_side_section extends Widget
{
    function run($visible = FALSE,$exam_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $_courses_data=array();

        if($exam_id!='0'){
            $exams_courses=$this->strm->__get_user_courses_exam_by_group(array('system_users_courses_exams.exam_id'=>$exam_id,'system_courses.course_name!='=>NULL),'course_name,exam_name,course_short_name');

            //print_obj($exams_courses);die;

            if(!empty($exams_courses)){
                foreach ($exams_courses as $ke => $vx){
                    $_courses_data[]=array(
                        'course_id'=>$vx->course_id,
                        'course_name'=>$vx->course_name,
                        'course_url'=>'courses/'.url_slug($vx->course_short_name)
                    );
                }
            }
        }


        $data['courses_data']=$_courses_data;


        if ($visible) $this->render('front_exams_courses_side_section',$data);
    }
}