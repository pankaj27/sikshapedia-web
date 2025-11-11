<?php


/**
 * 
 */
class Front_exams_upcomming_side_section extends Widget
{

    function run($visible = FALSE,$exam_id=0) {
        $this->front_theme='default';
        $this->get_type(2);

        $_exams=array();
     
        if($exam_id!='0'){

            $exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

            //print_obj($exam_data);

            if(!empty($exam_data)){
                $exam_stream=$exam_data->exam_stream_id;

                if(is_null($exam_stream) || empty($exam_stream) || $exam_stream===NULL || trim($exam_stream)===''){
                    $param=null;
                }else{
                    $param['where_in']='exam_stream_id';
                    $param['where_in_value']=$exam_stream;
                }                
            }
            
        } else{
            $param['where_in']='exam_stream_id';
        }

        $exams=$this->strm->_get_exam_detailed_data(array('exam_year'=>date('Y'),'exam_data_upcomming'=>'yes','exam_data_status'=>'active'),$param,FALSE);

        //print_obj($exams);die;

        if(!empty($exams)){
            foreach ($exams as $key => $value) {
                $slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
                $_exams[]=array(
                    'exam_formatted_name'=>$value->exam_short_name.'-'.$value->exam_year,
                    'exam_date'=>($value->exam_start_date!='')?date('dS F',strtotime($value->exam_start_date)):'',
                    'exam_url'=>base_url('exams/'.$slug->slug_value)
                );
            }
        }   


        $data['upcomming_exams']=$_exams;
        if ($visible) $this->render('front_exams_upcomming_side_section',$data);
    }
}