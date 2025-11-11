<?php


/**
 * 
 */
class Front_college_courses_dropdown_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $course_data=array();

        $param=array(
            'order'=>array('user_course_id' => 'ASC'),
            'user_type'=>'4',
            'user_id'=>$college_id
        );

        $_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);

        if(!empty($_course_fees_data)){
            foreach ($_course_fees_data as $key => $value) {
                // if($value->course_is_lateral=='1'){
                //     $course_short_name=strtoupper($value->course_short_name).'{Lateral}';
                // }else{
                //     $course_short_name=strtoupper($value->course_short_name);
                // }

                $course_short_name=strtoupper($value->course_short_name);


                $course_data[]=array(
                    'course_id'=>encode_data($value->course_id),
                    'course_full_name'=>strtoupper($value->course_name),
                    'course_short_name'=>$course_short_name,
                    'course_formatted_name'=>strtoupper($value->course_name).' [ '.$course_short_name.' ]'
                );
            }
        }

        $data['course_data']=$course_data;


        if ($visible) $this->render('front_college_courses_dropdown_section',$data);
    }
}