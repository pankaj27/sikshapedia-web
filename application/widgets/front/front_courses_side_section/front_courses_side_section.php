<?php


/**
 * 
 */
class Front_courses_side_section extends Widget
{
    function run($visible = FALSE,$ids=null){
        $this->front_theme='default';
        $this->get_type(2);

        $courses=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        if($college_id!=0){

            $param['user_type']='4';
            $param['user_id']=$college_id;

            $college_courses=$this->im->_get_users_courses(null,$param);

            if(!empty($college_courses)){
                foreach ($college_courses as $key => $value) {
                    $slug=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_type_id'=>$value->user_course));

                    $slug_data=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->user_course));

                    //(!empty($slug))?$slug->url_value:''
                    $courses[]=array(
                        'course_name'=>strtoupper($value->course_name),
                        'course_url'=>base_url('courses/'.$slug_data->slug_value)
                    );
                }
            }


            $data['course_data']=$courses;

            //print_obj($data['course_data']);die;

            if ($visible) $this->render('front_courses_side_section',$data);


        }
    }
}