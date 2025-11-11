<?php


/**
 * 
 */
class Front_stream_colleges_top_section extends Widget
{
    function run($visible = FALSE,$stream=0){
        $this->front_theme='default';
        $this->get_type(2);

        if($stream>0){
            $starem_data=$this->strm->get_stream(array('stream_id'=>$stream));

            $colleges=$this->um->_get_user_courses_college(array('user_course_stream'=>$stream),FALSE);

            //print_obj($colleges);die;


            if(!empty($colleges)){
                foreach ($colleges as $key => $value) {
                    $college_data=$this->um->get_user_courses_college(array('user_id'=>$value->user_id));
                    $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_logo'));

                    if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                        $college_logo=$_college_logo->media_disk_path_relative;
                        $college_logo_name=$_college_logo->media_org_name;
                    }else{
                        $college_logo=base_url().'uploads/app/default/no.jpg';
                        $college_logo_name='';
                    }

                    $city=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
                    $state=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

                    $is_featured='2';

                    $_colleges[]=array(
                        'college_name'=>$college_data->college_name,
                        'college_logo'=>$college_logo,
                        'college_city'=>$city->city_name,
                        'college_state'=>$state->state_name,
                        'access_url'=>''
                    );
                }
            }
        }else{
            $segment_1=$this->uri->segment(1,0);//static 'courses'
            $segment_2=$this->uri->segment(2,0);//strteam

            if(is_string($segment_1) && $segment_1=='courses'){
                if(is_string($segment_2) && $segment_2!='0'){
                    $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2,'slug_type'=>'3'));
                    if(!empty($slug_found)){
                        $slug_type=$slug_found->slug_type;
                        $slug_type_id=$slug_found->slug_type_id;

                        $starem_data=$this->strm->get_stream(array('stream_id'=>$slug_type_id));

                        $colleges=$this->um->_get_user_courses_college(array('user_course_stream'=>$slug_type_id),FALSE);


                        if(!empty($colleges)){
                            foreach ($colleges as $key => $value) {
                                $college_data=$this->um->get_user_courses_college(array('user_id'=>$value->user_id));
                                $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_logo'));

                                if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                                    $college_logo=$_college_logo->media_disk_path_relative;
                                    $college_logo_name=$_college_logo->media_org_name;
                                }else{
                                    $college_logo=base_url().'uploads/app/default/no.jpg';
                                    $college_logo_name='';
                                }

                                $city=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
                                $state=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

                                $is_featured='2';

                                $_colleges[]=array(
                                    'college_name'=>$college_data->college_name,
                                    'college_logo'=>$college_logo,
                                    'college_city'=>$city->city_name,
                                    'college_state'=>$state->state_name,
                                    'access_url'=>''
                                );
                            }
                        }
                    }
                }
            }
        }
    
            

        $data['stream_data']=$starem_data;

        $data['colleges']=$_colleges;

        //print_obj($data);die;

        if ($visible) $this->render('front_stream_colleges_top_section',$data);
    }
}