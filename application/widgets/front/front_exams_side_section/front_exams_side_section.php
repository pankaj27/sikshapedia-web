<?php


/**
 * 
 */
class Front_exams_side_section extends Widget
{
    function run($visible = FALSE,$ids=null){
        $this->front_theme='default';
        $this->get_type(2);

        $exam_data=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        if($college_id!=0){

            $user_exams=$this->strm->_get_user_courses_exam(array('user_id'=>$college_id,'user_type'=>'4'));

            //print_obj($user_exams);die;

            if(!empty($user_exams)){                
                foreach ($user_exams as $ke => $vx) {
                    if(!empty($vx->course_name)){
                       $slug=$this->sm->get_slug_urls(array('url_type'=>'exam','url_sub_type'=>'exam_inner_default_menu_url','url_type_id'=>$vx->exam_id));
                        $exam_data[]=array(
                            'exam_id'=>$vx->exam_id,
                            'exam_course'=>$vx->course_name,
                            'exam_name'=>$vx->exam_name,
                            'exam_full_name'=>$vx->exam_full_name,
                            'exam_url'=>(!empty($slug))?$slug->url_value:''
                        ); 
                    }     
                }
            }


            $data['exam_data']=$exam_data;

            //print_obj($data['exam_data']);die;

            if ($visible) $this->render('front_exams_side_section',$data);


        }
    }
}