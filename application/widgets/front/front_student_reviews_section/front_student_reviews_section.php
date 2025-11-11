<?php


/**
 * 
 */
class Front_student_reviews_section extends Widget
{
    function run($visible = FALSE,$user_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $_reviews_data=array();

        $reviews=$this->sm->get_review_datas(null,array('review_user_id'=>$user_id));

        if(!empty($reviews)){
            foreach ($reviews as $key => $value) {
                $course_data=$this->strm->get_course(array('course_id'=>$value->review_course_id));

                $status=$this->sm->get_review_status_data(array('review_uid'=>$value->review_unique_id,'review_user_id'=>$value->review_user_id));

                if($value->college_utype=='4'){
                    $inst_type='COLLEGE_NAME';
                }else{
                    $inst_type='UNIVERSITY_NAME';
                }

                $file_id_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_identity_proof','user_storage_type_2'=>'user_identity_proof_file','user_file_type'=>'8','user_file_type_id'=>$value->review_user_id));

                $file_marksheet_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_marksheet','user_storage_type_2'=>'user_marksheet_file','user_file_type'=>'8','user_file_type_id'=>$value->review_user_id));

                $_reviews_data[]=array(
                    'college_name'=>$value->college_name,
                    'college_short_name'=>$value->college_short,
                    'course_name'=>(!empty($course_data))?$course_data->course_name:'',
                    'review_at'=>date('M d,Y H:i A'),
                    'review_approval_at'=>'',
                    'review_status'=>$status->review_approved,
                    'review_moderation'=>$status->review_moderation,
                    'review_id_proof'=>(!empty($file_id_proof_found))?'yes':'no',
                    'review_marksheet'=>(!empty($file_marksheet_proof_found))?'yes':'no',
                    'review_edit'=>(!in_array($status->review_approved, array('approved','rejected')))?base_url('reviews/write/'.encode_data($value->college_user_id).'_'.encode_data($inst_type).'/'.encode_data($value->review_course_id)):''
                );
            }
        }



        $data['review_data']=$_reviews_data;

        //$data=$userdata;

        if ($visible) $this->render('front_student_reviews_section',$data);
    }
}