<?php


/**
 * 
 */
class Front_stream_category_courses extends Widget
{   
    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);

        $segment_1=$this->uri->segment(1,0);
        $segment_2=$this->uri->segment(2,0);
        $segment_3=$this->uri->segment(3,0);


        if(is_string($segment_1) && $segment_1=='courses'){
            if(is_string($segment_2) && $segment_2!='0'){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));
                if(!empty($slug_found)){
                    $slug_type=$slug_found->slug_type;
                    $slug_type_id=$slug_found->slug_type_id;

                    if(is_string($segment_3) && $segment_3!='0'){
                        $slug3_found=$this->sm->get_slug(array('slug_value'=>$segment_3));

                        if(!empty($slug3_found)){
                            $slug3_type=$slug3_found->slug_type;
                            $slug3_type_id=$slug3_found->slug_type_id;

                            $carray[0]=['category_name'=>'All'];

                            $course_categories=$this->strm->get_course_categories(array('course_category_status'=>1),FALSE,'course_category_serial','ASC');

                            foreach ($course_categories as $key => $value) {
                                $_c_categories[]=array(
                                    'category_name'=>$value->course_category_name
                                );
                            }

                            $_categories=array_merge($carray,$_c_categories);

                            foreach ($_categories as $k => $v) {

                                if($v['category_name']=='All'){
                                    $course_details=$this->strm->get_stream_details_courses_data(array('courses_data_type_stream_id'=>$slug3_type_id),FALSE,'courses_data_type_serial','ASC',FALSE);
                                }else{
                                    $course_details=$this->strm->get_stream_details_courses_data(array('courses_data_type_stream_id'=>$slug3_type_id,'courses_filter_type'=>$v['category_name']),FALSE,'courses_data_type_serial','ASC',FALSE);
                                }
                               

                               //print_obj($course_details);

                               if(!empty($course_details)){

                                    foreach ($course_details as $key => $value) {

                                        if($value->courses_data_type=='ads'){
                                            $ads=$this->um->get_listing_package_users(array('listing_id'=>$value->courses_data_type_id));
                                            $courses_data_type_value=$ads->listing_embed_code;
                                        }else{
                                            $course_data=$this->strm->get_course(array('course_id'=>$value->courses_data_type_id));
                                            if($course_data->course_short_name!=null){
                                                $courses_data_type_value=$value->courses_data_type_value.' ['.$course_data->course_short_name.']';
                                            }else{
                                                $courses_data_type_value=$value->courses_data_type_value;
                                            }
                                            
                                            $course_duration_type=($course_data->course_duration_type!=null)?ucwords(str_replace('_', ' ', $course_data->course_duration_type)):'';
                                            $years_text=($course_data->course_duration_year!=null && $course_data->course_duration_year>1)?' Years':' Year';
                                            $course_duration=($course_data->course_duration_year!=null || $course_data->course_duration_year!=0)?$course_data->course_duration_year.$years_text:'';
                                            $total_colleges=$this->um->get_total_user_courses(array('user_course'=>$value->courses_data_type_id));
                                        }

                                        $_courses[$v['category_name']][]=array(
                                            'courses_data_type' => $value->courses_data_type,
                                            'course_duration_type'=>isset($course_duration_type)?$course_duration_type:'',
                                            'course_duration'=>isset($course_duration)?$course_duration:'',
                                            'course_offerd_total_colleges'=>(isset($total_colleges))?$total_colleges:'',
                                            'courses_data_type_value' => $courses_data_type_value
                                        );
                                    }
                               }else{
                                //echo 'hi';die;
                                    if($v['category_name']=='All'){
                                        $courses=$this->strm->get_course(array('course_stream'=>$slug3_type_id),FALSE);
                                    }else{
                                        $courses=$this->strm->get_course(array('course_stream'=>$slug3_type_id,'course_type_2'=>$v['category_name']),FALSE);
                                    }
                                    

                                    if(!empty($courses)){
                                       
                                        foreach ($courses as $key => $value) {
                                            
                                            $course_details_data=$this->strm->get_course_details_data(array('course_id'=>$value->course_id),FALSE,'course_data_id','ASC');
                                            
                                            //echo count($course_details_data).'-'.$value->course_name.'<br>';

                                            if(!empty($course_details_data)){
                                                $degree_slug=$this->sm->get_slug(array('slug_type_id'=>$value->course_id,'slug_type'=>'5'));
                                                $course_url=base_url('courses/'.$degree_slug->slug_value);
                                            }else{
                                                $course_url='';
                                            }

                                            if($value->course_short_name!=null){
                                                $courses_data_type_value=$value->course_name.' ['.$value->course_short_name.']';
                                            }else{
                                                $courses_data_type_value=$value->course_name;
                                            }
                                            
                                            $course_duration_type=($value->course_duration_type!=null)?ucwords(str_replace('_', ' ', $value->course_duration_type)):'';
                                            $years_text=($value->course_duration_year!=null && $value->course_duration_year>1)?' Years':' Year';
                                            $course_duration=($value->course_duration_year!=null || $value->course_duration_year!=0)?$value->course_duration_year.$years_text:'';
                                            $total_colleges=$this->um->get_total_user_courses(array('user_course'=>$value->courses_data_type_id));

                                            $_courses[$v['category_name']][]=array(
                                                'courses_data_type' => 'course',
                                                'course_duration_type'=>isset($course_duration_type)?$course_duration_type:'',
                                                'course_duration'=>isset($course_duration)?$course_duration:'',
                                                'course_offerd_total_colleges'=>(isset($total_colleges))?$total_colleges:'',
                                                'courses_data_type_value' => $courses_data_type_value,
                                                'course_url'=>$course_url
                                            );
                                            
                                        }
                                    }
                               }

                                
                            }
                            
                            //die;

                            //print_obj($_courses);

                        }
                    }
                }
            }
        }

        $data['courses']=$_courses;

        // /print_obj($data['courses']);die;

        if ($visible) $this->render('front_stream_category_courses',$data);
    }
}