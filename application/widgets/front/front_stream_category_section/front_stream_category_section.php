<?php


/**
 * 
 */
class Front_stream_category_section extends Widget
{
    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);

      
        $slug_1=$this->uri->segment(1,0);//static courses
        $slug_2=$this->uri->segment(2,0);//stream category 


        if((is_string($slug_1) && $slug_1=='courses') && (is_string($slug_2) && $slug_2!='0')){
            $slug_data_2=$this->sm->get_slug(array('slug_value'=>$slug_2,'slug_type'=>'8'));



            if(!empty($slug_data_2)){

                $stream_category_id=$slug_data_2->slug_type_id;

                $category_data=$this->strm->get_stream_category(array('stream_category_id'=>$stream_category_id));

                //print_obj($category_data);die;

                if(!empty($category_data)){
                    $stream_category=array(
                        'category_name'=>$category_data->stream_category.' in '.$country->country_name,
                        'category_long_desc'=>$category_data->stream_category_long_description,
                        'bread_crumb'=>array(
                            'Home'=>base_url(),
                            'Courses'=>base_url($slug_1.'/'.$slug_2),
                            $category_data->stream_category_show_name=>''
                        )
                    );
                }

                $_streams=$this->strm->get_inset_stream('stream_category',$stream_category_id);

                if(!empty($_streams)){
                    foreach ($_streams as $key => $value) {
                        $icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));
                        $stream_slug=$this->sm->get_slug(array('slug_type_id'=>$value->stream_id,'slug_type'=>'3'));

                        // $param['column_search'] = array('course_name');
                        // $param['order'] = array('course_id' => 'ASC');
                        // $post['length']='6';

                        //$courses = $this->strm->_get_courses($post,$param,FALSE,FALSE);

                        $courses=$this->strm->get_system_courses(array('course_stream'=>$value->stream_id),4,'course_id','ASC',FALSE);

                        if(!empty($courses)){
                            foreach ($courses as $k => $v) {
                                $course_slug=$this->sm->get_slug(array('slug_type_id'=>$v->course_id,'slug_type'=>'5'));
                                $stream_courses[$value->stream_id][]=array(
                                    'course_name'=>$v->course_name,
                                    'access_link'=>base_url('courses/'.$course_slug->slug_value)
                                );
                            }
                        }else{
                            $stream_courses=array();
                        }

                        $streams[]=array(
                            'stream_id'=>$value->stream_id,
                            'stream_name'=>$value->stream_name,
                            'strteam_icon'=>$icon->icon_value,
                            'stream_access_link'=>base_url('courses/'.$slug_data_2->slug_value.'/'.$stream_slug->slug_value),
                            'stream_courses'=>$stream_courses[$value->stream_id]
                        );
                    }
                }

                $ads_data=array(
                    'ads_link'=>'https://paruluniversity.ac.in/landingpage/2021/pu-admissions/?utm_source=collegedunia&amp;utm_type=bann&amp;utm_campaign=Parul2021',
                    'ads_image'=>'https://images.static-collegedunia.com//public/image/client_images_new/B_ParulUniversityGenericDS_S_27_120210128144856.png'
                );

                $data['stream_category_data']=$stream_category;
                $data['streams']=$streams;
                $data['ads_data']=$ads_data;
            }

        }

        //print_obj($data);die;

        if ($visible) $this->render('front_stream_category_section',$data);
    }
}