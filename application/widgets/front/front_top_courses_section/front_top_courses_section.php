<?php


/**
 * 
 */
class Front_top_courses_section extends Widget
{
	
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$_top_courses=array();

    	$top_courses=$this->strm->get_course(array('course_show_in_widget'=>'1'),FALSE);

    	if(!empty($top_courses)){
    		foreach ($top_courses as $key => $value) {

    			//$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->course_stream));
    			$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->course_id));
    			$_top_courses[]=array(
    				'course_name'=>$value->course_short_name,
    				'course_college_url'=>'https://www.sikshapedia.com/courses/'.$course_slug->slug_value
    			);
    		}
    	}



		$data['top_courses']=$_top_courses;
		if ($visible) $this->render('front_top_courses_section',$data);
	}
}