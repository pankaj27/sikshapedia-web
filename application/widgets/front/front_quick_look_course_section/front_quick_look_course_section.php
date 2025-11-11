<?php


/**
 * 
 */
class Front_quick_look_course_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $_streams=array();
        $_courses=array();

        $streams=$this->strm->get_stream(array('stream_show_in_home_widget'=>'yes'),FALSE,'stream_show_in_home_widget_serial','ASC');

        //stream_show_in_home_widget_serial



        if(!empty($streams)){
            foreach ($streams as $key => $value) {

                $courses=$this->strm->get_course(array('course_stream'=>$value->stream_id,'course_is_top'=>'1','course_show_in_widget'=>'1','course_status'=>'1'),FALSE);

                if(!empty($courses)){
                    foreach ($courses as $k => $v) {
                        $child_courses=$this->strm->get_course(array('course_parent_id'=>$v->course_id,'course_show_in_widget'=>'1','course_status'=>'1'),FALSE);

                        if(!empty($child_courses)){
                            foreach ($child_courses as $_k => $_v) {
                                $_child_courses[$v->course_id][]=array(
                                    'course_name'=>$v->course_name.' ['.$v->course_short_name.'] ('.$_v->course_name.')',
                                    'course_short_name'=>$_v->course_short_name
                                );
                            }
                        }
                        $_courses[$value->stream_id][]=array(
                            'course_name'=>$v->course_name,
                            'course_short_name'=>$v->course_short_name,
                            'child_courses'=>$_child_courses[$v->course_id]
                        );
                    }
                }

                $_streams[]=array(
                    'stream_name'=>$value->stream_name,
                    'stream_courses'=>$_courses[$value->stream_id]
                );
            }
        }

        //print_obj($_streams);die;
       

        $data['streams']=$_streams;

        if ($visible) $this->render('front_quick_look_course_section',$data);
    }
}