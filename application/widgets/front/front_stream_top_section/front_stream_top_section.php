<?php


/**
 * 
 */
class Front_stream_top_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);
    
        $_streams=array();
        $streams=$this->strm->get_stream(array('stream_is_top'=>'1','stream_status'=>'1'),FALSE);



        if(!empty($streams)){
            foreach ($streams as $key => $value) {

                $slug=$this->sm->get_slug(array('slug_type_id'=>$value->stream_id,'slug_type'=>'3'));

                $_streams[]=array(
                    'stream_name'=>$value->stream_name,
                    'stream_url'=>base_url('courses/'.$slug->slug_value)
                );
            }
        }

        //print_obj($_streams);die;

        $data['streams']=$_streams;

        if ($visible) $this->render('front_stream_top_section',$data);
    }
}