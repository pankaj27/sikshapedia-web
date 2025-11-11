<?php


/**
 * 
 */
class Front_exam_page_button_section extends Widget
{
    function run($visible = FALSE,$exam_id=0) {
        $this->front_theme='default';
        $this->get_type(2);

        $exams_data=$this->strm->_get_exam(array('exam_id'=>$exam_id));

        if(!empty($exams_data)){

        }


        $data['exam_page_buttons']='';
        if ($visible) $this->render('front_exam_page_button_section',$data);
    }
}