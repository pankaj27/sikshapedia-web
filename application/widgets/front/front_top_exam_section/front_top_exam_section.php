<?php


/**
 * 
 */
class Front_top_exam_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $current_year=date('Y');
        $_top_exams=array();
        $top_exams=$this->strm->get_exam(array('exam_is_top'=>'yes','exam_show_in_widget'=>'yes'),FALSE);

        if(!empty($top_exams)){
            foreach ($top_exams as $key => $value) {
                $slug=$this->sm->get_slug(array('slug_type_id'=>$value->exam_id,'slug_type'=>'10'));
                $_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

                if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
                    $exam_logo=$_exam_logo->media_disk_path_relative;
                }else{
                    $exam_logo=base_url().'uploads/app/default/no.jpg';
                }
                $_top_exams[]=array(
                    'exam_short_name'=>$value->exam_short_name,
                    'exam_short_desc'=>$value->exam_description,
                    'exam_link'=>base_url('exams/'.$slug->slug_value),
                    'exam_result_link_title'=>$value->exam_short_name.' '.$current_year.' Result',
                    'exam_cutoff_link_title'=>$value->exam_short_name.' '.$current_year.' Cutoff',
                    'exam_result_link'=>'exams/'.url_slug($value->exam_short_name).'/result',
                    'exam_cutoff_link'=>'exams/'.url_slug($value->exam_short_name).'/cut-off',
                    'exam_readmore_link'=>'exams/'.url_slug($value->exam_short_name),
                    'exam_logo'=>$exam_logo
                );
            }
        }


        $data['top_exams']=$_top_exams;
        if ($visible) $this->render('front_top_exam_section',$data);
    }
}