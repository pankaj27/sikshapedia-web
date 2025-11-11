<?php


/**
 * 
 */
class Front_course_details_data extends Widget
{
    function run($visible = FALSE,$course_id=0,$menu_id=0,$menu_slug='overview') {
        $this->front_theme='default';
        $this->get_type(2);

        // echo 'Course:'.$course_id;
        // echo 'Menu:'.$menu_id.'<br>';exit;

        $menu_data=$this->sm->get_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_id,'menu_slug'=>$menu_slug),TRUE,null,'DESC',FALSE);

        //echo $menu_id;die

        //print_obj($menu_data);die;

        if($menu_id!=0){
            $param=array('course_id'=>$course_id,'course_inner_menu_id'=>$menu_id);
        }else{            
            $param=array('course_id'=>$course_id);
        }

        //print_obj($param);die;

        //$exam_details_data=$this->strm->get_exam_details_data($param,FALSE,'exam_serial','ASC');

        $course_details_data=$this->strm->get_course_details_data($param,FALSE,'course_data_id','ASC');

       // print_obj($course_details_data);die;

        $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$course_details_data[0]->course_data_created_by));

        $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$course_details_data[0]->course_data_created_by),NULL,FALSE);

        if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
          $data['user_image']=$user_image->media_disk_path_relative;
        }else{
          $data['user_image']=base_url('public/data/app/app_data/waytologo.png');         
        }


        $data['uploaded_by']=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:'Waytoadmissions Team';
        
        $data['data_updated_on']=date('M d,Y',strtotime($course_details_data[0]->course_data_created_at));

        $data['course_details_data']=$course_details_data;

        if ($visible) $this->render('front_course_details_data',$data);

    }


    // function run($visible = FALSE) {
    //     $this->front_theme='default';
    //     $this->get_type(2);

    //     $segment_1=$this->uri->segment(1,0);//static segment "exams"
    //     $segment_2=$this->uri->segment(2,0);//stream name
    //     $segment_3=$this->uri->segment(3,0);//exam name
    //     $segment_4=$this->uri->segment(4,0);//exam sub name


    //     if(is_string($segment_1) && $segment_1=='exams'){

    //         //echo $segment_1;die;

    //         if(is_string($segment_2) && $segment_2!='0'){
    //             if(is_string($segment_3) && $segment_3!='0'){
    //                 $slug_data=$this->sm->get_slug(array('slug_value'=>$segment_3));

    //                 //print_obj($slug_data);die;

    //                 if(!empty($slug_data)){
    //                     $slug_type=$slug_data->slug_type;
    //                     $slug_type_id=$slug_data->slug_type_id;

    //                     if($slug_type=='10'){
    //                         $data['exam_details_data']=$this->strm->get_exam_details_data(array('exam_id'=>$slug_type_id),FALSE,'exam_serial','ASC');
    //                     }
    //                 }
    //             }
                
    //         }

    //     }

    //     if ($visible) $this->render('front_exam_details_data',$data);

    // }
}