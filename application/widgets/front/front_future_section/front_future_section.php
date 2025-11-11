<?php


/**
 * 
 */
class Front_future_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
         	$this->get_type(2);
         	
         	$streams=$this->strm->get_stream(array('stream_status'=>'1','stream_show_in_widget'=>'1'),FALSE,'stream_serial','ASC');

         	if(!empty($streams)){
         		foreach ($streams as $key => $value) {
         			$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));

                     $total_data=$this->im->get_total_colleges(array('college_country_id'=>'99'),NULL,array('needle'=>$value->stream_id,'haystack'=>'system_users_colleges.college_streams_ids'));

                     $slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));


                     $total_exams=$this->strm->_get_total_exams(null,'exam_stream_id',$value->stream_id,FALSE);

                    // print_obj($total_exams);

         			$_streams[]=array(
         				'stream_name'=>$value->stream_name,
         				'stream_icon'=>$icon->icon_value,
         				'stream_tolal_colleges'=>$total_data.' Colleges',
         				'stream_tolal_exams'=>$total_exams.' Exams',
                         'access_link'=>base_url().'in/colleges/'.$slug->slug_value,
                         'exam_access_link'=>base_url().'exams/'.$slug->slug_value,
         			);
         		}
         	}else{
         		$_streams=array();
         	}


          //print_obj(json_encode($_streams));die;

             

         	$data['streams']=$_streams;


        if ($visible) $this->render('front_future_section',$data);
    }
}