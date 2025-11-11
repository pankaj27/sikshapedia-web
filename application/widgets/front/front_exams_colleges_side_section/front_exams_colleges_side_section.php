<?php


/**
 * 
 */
class Front_exams_colleges_side_section extends Widget
{
    function run($visible = FALSE,$exam_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $_college_data=array();

        if($exam_id!=0){

            $exams_colleges=$this->strm->__get_user_courses_exam_by_group(array('system_users_courses_exams.exam_id'=>$exam_id),'user_id,user_type');

            // $exam_data=$this->strm->get_exam('exam_id'=>$exam_id);

            // if(!empty($exam_data->exam_name)){
            //     $data['exam_name']=$exam_data->exam_name;
            // }else{
            //     $data['exam_name']=$exam_data->exam_full_name;
            // }

           //print_obj($exams_colleges);die;

            if(!empty($exams_colleges)){                
                foreach ($exams_colleges as $ke => $vx) {

                    if($vx->user_type=='4'){
                        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$vx->user_id));
                        if(!empty($college_data)){

                            $slug_data=$this->sm->get_slug_urls(array('url_value'=>$college_data->access_url));

                            if(!empty($slug_data)){
                                $state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
                                $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
                                $logo=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$vx->user_id));

                                if(!empty($logo) && !empty($logo->media_disk_path_relative)){
                                    $college_logo=$logo->media_disk_path_relative;
                                }else{
                                    $college_logo=base_url().'uploads/app/default/no.jpg';
                                }

                                $_college_data[]=array(
                                    'college_id'=>$vx->user_id,
                                    'college_name'=>str_replace('&amp;', '&', $college_data->college_name),
                                    'college_formatted_name'=>(!empty($college_data->college_short_name))?str_replace('&amp;', '&', $college_data->college_name).'- ['.$college_data->college_short_name.']':str_replace('&amp;', '&', $college_data->college_name),
                                    'college_short_name'=>$college_data->college_short_name,
                                    'college_estd'=>$college_data->college_estd_year,
                                    'college_logo'=>$college_logo,
                                    'college_state'=>$state_data->state_name,
                                    'college_city'=>$city_data->city_name,
                                    'college_url'=>$college_data->access_url
                                );
                            }                                
                        }
                    }     
                }
            }

            // print_obj($_college_data);die;


            $data['college_data']=$_college_data;

            //print_obj($data['exam_data']);die;

            if ($visible) $this->render('front_exams_colleges_side_section',$data);


        }
    }
}