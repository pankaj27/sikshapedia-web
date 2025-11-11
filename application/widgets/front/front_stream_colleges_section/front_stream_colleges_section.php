<?php


/**
 * 
 */
class Front_stream_colleges_section extends Widget
{
    function run($visible = FALSE,$stream=0){
        $this->front_theme='default';
        $this->get_type(2);

        if($stream=='0'){
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

                        //print_obj($colleges);die;


                        if(!empty($colleges)){
                            foreach ($colleges as $key => $value) {
                                $college_data=$this->um->get_user_courses_college(array('user_id'=>$value->user_id),TRUE);
                                $_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_banner'));
                                $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->college_user_id,'user_storage_type'=>'user_logo'));

                                if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                                    $college_logo=$_college_logo->media_disk_path_relative;
                                    $college_logo_name=$_college_logo->media_org_name;
                                }else{
                                    $college_logo=base_url().'uploads/app/default/no.jpg';
                                    $college_logo_name='';
                                }

                                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
                                    $college_banner=$_college_banner->media_disk_path_relative;
                                    $college_banner_name=$_college_banner->media_org_name;
                                }else{
                                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
                                    $college_banner_name='';
                                }

                                $city=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
                                $state=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

                                $country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));

                                $is_featured='2';

                                $_colleges[]=array(
                                    'college_id'=>encode_data($college_data->college_user_id),
                                    'college_type'=>encode_data(7),
                                    'college_name'=>$college_data->college_name,
                                    'college_logo'=>$college_logo,
                                    'college_banner'=>$college_banner,
                                    'college_country_phone_code'=>$country_data->country_phone_code,
                                    'college_country_id'=>encode_data($college_data->college_country_id),
                                    'college_city'=>$city->city_name,
                                    'college_state'=>$state->state_name,
                                    'is_featured'=>$is_featured,
                                    'access_url'=>$college_data->access_url
                                );
                            }
                        }
                    }
                }
            }
        }else if($stream>0){
            $starem_data=$this->strm->get_stream(array('stream_id'=>$stream));

            $colleges=$this->um->get_user_courses_college(array('user_course_stream'=>$stream),FALSE);


            if(!empty($colleges)){
                foreach ($colleges as $key => $value) {
                    $_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
                    $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

                    if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                        $college_logo=$_college_logo->media_disk_path_relative;
                        $college_logo_name=$_college_logo->media_org_name;
                    }else{
                        $college_logo=base_url().'uploads/app/default/no.jpg';
                        $college_logo_name='';
                    }

                    if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
                        $college_banner=$_college_banner->media_disk_path_relative;
                        $college_banner_name=$_college_banner->media_org_name;
                    }else{
                        $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
                        $college_banner_name='';
                    }

                    $city=$this->com->get_city(array('city_id'=>$value->college_city_id));
                    $state=$this->com->get_state(array('state_id'=>$value->college_state_id));

                    $is_featured='2';

                    $_colleges[]=array(
                        'college_id'=>encode_data($value->college_user_id),
                        'college_type'=>encode_data(7),
                        'college_name'=>$value->college_name,
                        'college_logo'=>$college_logo,
                        'college_banner'=>$college_banner,
                        'college_city'=>$city->city_name,
                        'college_state'=>$state->state_name,
                        'is_featured'=>$is_featured,
                        'access_url'=>''
                    );
                }
            }
        }
    
        

        $data['stream_data']=$starem_data;

        $data['colleges']=$_colleges;

        //print_obj($data);die;

        if ($visible) $this->render('front_stream_colleges_section',$data);
    }
}