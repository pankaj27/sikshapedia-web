<?php


/**
 * 
 */
class Front_exam_upcomming_section extends Widget
{

    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);

        $_exams=array();
        $segment_1=$this->uri->segment(1,0);    //Static Exam url

        if($segment_1=='exams'){


            $exams=$this->strm->_get_exam_detailed_data(array('exam_year'=>date('Y'),'exam_data_upcomming'=>'yes','exam_data_status'=>'active'),null,FALSE);

            //print_obj($exams);die;

            if(!empty($exams)){
                foreach ($exams as $key => $value) {
                    $slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
                    $_exams[]=array(
                        'exam_formatted_name'=>$value->exam_short_name.'-'.$value->exam_full_name.' '.$value->exam_year,
                        'exam_date'=>($value->exam_start_date!='')?date('dS F',strtotime($value->exam_start_date)):'',
                        'exam_url'=>base_url('exams/'.$slug->slug_value)
                    );
                }
            }
        }

        //print_obj($_exams);die;     


        $data['upcomming_exams']=$_exams;
        if ($visible) $this->render('front_exam_upcomming_section',$data);
    }
}