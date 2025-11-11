<?php


/**
 * 
 */
class Front_exam_stream_list_section extends Widget
{
    function run($visible = FALSE,$ids=null) {
        $this->front_theme='default';
        $this->get_type(2);

        $_streams=array();

        $country_id=$ids['country_id'];

        $streams=$this->strm->get_streams_with_exam_url(array('stream_status'=>'1','url_type'=>'exam_stream'));

        if(!empty($streams)){
            foreach ($streams as $key => $value) {
                $slug_data=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
                $total_exam_count=$this->strm->get_inset_exam_count('exam_stream_id',$value->stream_id);
                $exams=$this->strm->get_indset_exam('exam_stream_id',$value->stream_id,false,array('url_type'=>'exam'),7,'exam_id','ASC',FALSE);
                $_streams[]=array(
                    'stream_id'=>$value->stream_id,
                    'stream_name'=>strtoupper($value->stream_name),
                    'stream_exams_count'=>$total_exam_count,
                    'stream_url'=>(!empty($slug_data))?base_url('exams/'.$slug_data->slug_value):base_url('exams'),                 
                );
            }
        }

        $data['streams']=$_streams;

        if ($visible) $this->render('front_exam_stream_list_section',$data);
    }
}