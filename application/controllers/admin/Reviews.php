<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Reviews extends BaseAdminController
{

    function __construct()
    {
        parent::__construct();
    }


    public function index($college_id=null){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Reviews';

            if($college_id!=null){
                $id=decode_data($college_id);
                $this->data['college_data']=$this->im->get_college_profile_data(array('college_user_id'=>$id));
                $this->data['college_id']=$college_id;
                $view='others/vw_reviews_list';
            }else{
                $view='others/vw_reviews';
            }

            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function indexDetails($college_id=null,$review_id){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Reviews';

            if($college_id!=null && $review_id!=null){
                $id=decode_data($college_id);
                $review_id=decode_data($review_id);

                $avaerage_rating='0';

                $_review_data=array();

                $review_detail_data=array();

                $review_other_program_data=array();

                $review_data=$this->sm->__get_review_datas(array('review_id'=>$review_id,'review_inst_id'=>$id));

                //print_obj($review_data);die;

                if(!empty($review_data)){

                    $userdata=$this->um->get_user_data(array('user_id'=>$review_data->review_user_id),null,'8');

                    $course_data=$this->strm->get_course(array('course_id'=>$review_data->review_course_id));

                    if(!empty($review_data->review_other_program_data)){
                        $review_other_program_data=unserialize($review_data->review_other_program_data);
                    }

                    $class_12th_board=$this->im->get_affiliation_types(array('statutory_body_id'=>$review_data->review_12th_board_id));
                    $class_10th_board=$this->im->get_affiliation_types(array('statutory_body_id'=>$review_data->review_12th_board_id));

                    $review_detail_data=array(
                        'review_enroll_year'=>$review_data->review_enroll_year,
                        'review_program_fees'=>number_format($review_data->review_program_fees,2),
                        'review_12th_board'=>$class_12th_board->statutory_body_abbr,
                        'review_12th_board_percentage'=>$review_data->review_12th_board_percentage.'%',
                        'review_10th_board'=>$class_10th_board->statutory_body_abbr,
                        'review_10th_board_percentage'=>$review_data->review_10th_board_percentage,
                        'review_caste_quota_applicable'=>strtoupper($review_data->review_caste_quota_applicable),
                        'review_caste_quota'=>$class_12th_board->statutory_body_abbr,
                        'review_gd_pi_applicable'=>strtoupper($review_data->review_gd_pi_applicable),
                        'review_class_size'=>$review_data->review_class_size,
                        'review_opt_hostel'=>strtoupper($review_data->review_opt_hostel),
                        'review_opt_hostel_fees'=>(!empty($review_data->review_opt_hostel_fees))?number_format($review_data->review_opt_hostel_fees,2):'',
                        'review_inst_placement_applicable'=>strtoupper($review_data->review_inst_placement_applicable),
                        'review_inst_internship_applicable'=>strtoupper($review_data->review_inst_internship_applicable),
                        'review_at'=>date('M d,Y H:i A',strtotime($review_data->review_at)),
                        'review_other_program_data'=>$review_other_program_data
                    );


                    $review_questions_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_id,'review_inst_id'=>$id),FALSE);

                    foreach ($review_questions_data as $key => $value) {
                        $_review_data[]=array(
                            'review_step'=>$value->review_step,
                            'review_question'=>$value->review_question,
                            'review_question_answer'=>$value->review_question_answer,
                            'review_question_rating'=>$value->review_question_rating
                        );
                    }                        
                }


                $reviewdata=array(
                    'review_id'=>$review_id,
                    'first_step_data'=>$review_data,
                    'other_step_data'=>$_review_data,
                    'review_detail_data'=>$review_detail_data,
                    'avaerage_rating'=>$avaerage_rating,
                    'user_name'=>strtoupper($userdata->user_fullname),
                    'user_email'=>$userdata->user_email,
                    'course_name'=>$course_data->course_name
                );

                $this->data['review_data']=$reviewdata;

                //print_obj($this->data['review_data']);die;


                $this->data['college_data']=$this->im->get_college_profile_data(array('college_user_id'=>$id));
                $this->data['college_id']=$id;
            }

            $view='others/vw_reviews_details';

            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }

    public function onSearchReviews(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $param['column_order'] = array(
                    null,
                    'college_name'
                );

                $param['column_search'] = array('college_name');
               
                $posts=$this->input->post();

                if(isset($posts['_college']) && !empty($posts['_college'])){
                    $param['review_inst_id']=decode_data($posts['_college']);
                    $param['order'] = array('review_id' => 'DESC');
                    $group=FALSE;
                }else{
                    $group=TRUE;
                    $param['order'] = array('college_name' => 'DESC');
                }

                $list = $this->sm->_get_review_data($posts,$param,$group,FALSE,FALSE);

                //print_obj($list);die;


                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $r){
                    $no++;

                    $row = array();


                    $row[]  =   $no;

                    $status=$this->sm->get_review_status_data(array('review_uid'=>$r->review_unique_id,'review_user_id'=>$r->review_user_id));

                    if($group==TRUE){
                        $row[]  =   $r->college_name;
                        $row[]  =   '<spn class="badge badge-sm badge-warning">'.$r->total_reviews.'</span>';
                        $row[]  =   '<a href="'.$this->data['admin_base_url'].'/reviews/colleges/'.encode_data($r->college_user_id).'" class="btn btn-sm btn-primary">View</a>';
                    }else if($group==FALSE){
                        $row[]  =   $r->review_title;

                        // if($status->review_approved=='yes'){
                        //     $row[]  =   '<span class="badge bage-sm badge-success">Approved</span>';
                        // }else{
                        //     $row[]  =   '<span class="badge bage-sm badge-default">Unapproved</span>';
                        // }

                        $row[]  =   ucwords(str_replace('_', ' ' , $status->review_approved));

                         $row[]  =   '<a href="'.$this->data['admin_base_url'].'/reviews/colleges/'.encode_data($r->review_inst_id).'/'.encode_data($r->review_id).'" class="btn btn-sm btn-primary">View</a>';  
                    }

                    $data[] = $row; 
                   
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->_get_review_data($posts,$param,$group,TRUE),
                    "recordsFiltered" => $this->sm->_get_review_data($posts,$param,$group,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function onCheckReviews(){
        if(session_userdata('isAdminLoggedin')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $college_id=post_data('college_id');
                $review_id=post_data('review_id');
                $review_status=post_data('review_status');
                $review_comment=post_data('review_comment');

                $review_data=$this->sm->__get_review_datas(array('review_id'=>$review_id,'review_inst_id'=>$college_id));

                if(!empty($review_data)){

                    $approval_data=array(
                        'review_status_comment'=>$review_comment,
                        'review_approved'=>$review_status,
                        'review_approved_by'=>$this->data['userdata']->user_id,
                        'review_approval_date'=>date('Y-m-d H:i:s')
                    );

                    $updated=$this->sm->update_review_data($approval_data,array('review_id'=>$review_id,'review_inst_id'=>$college_id));

                    if($updated){
                        $return['success']='Review status has been updated.';
                    }else{
                        $return['error']='Review status not updated.';
                    }

                }else{
                    $return['error']='No review data found';
                }

                json_headers($return);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    //***Anonymus Reviews**/
    public function indexCollegeReviewsAdd(){
        if(session_userdata('isAdminLoggedin')){
            $user_id=decode_data(session_userdata('admin_id'));

            $college_id=$this->uri->segment(6,0);
            $review_id=$this->uri->segment(7,0);
            $college_id=decode_data($college_id);

            // $people = [];

            // for ($i = 1; $i <= 10; $i++) {
            //     $person = [strtoupper(token())=>generateRandomName()];

            //     $people[] = $person;
            // }

            // print_obj($people);die;

            $this->data['review_id']=($review_id!='0')?$review_id:'';

            $this->data['college_data']=$this->im->get_college_data(array('college_user_id'=>$college_id));


            $college_courses=$this->strm->get_inst_streams_courses(array('user_id'=>$college_id));

            if(!empty($college_courses)){
                foreach ($college_courses as $key => $value) {
                    $courses[]=array(
                        'course_id'=>$value->user_course,
                        'course_name'=>$value->course_name,
                        'selected'=>($value->user_course==$inst_course_id)?'selected':''
                    );
                }
            }

            $current_year=date('Y');
            $past_30_year=$current_year-30;

            for ($i=$current_year; $i >=$past_30_year ; $i--) { 
                $enrollment_years[]=$i;
            }

            $this->data['statutory_bodies_10th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_10th'=>'yes'),FALSE);

            $this->data['statutory_bodies_12th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_12th'=>'yes'),FALSE);

            $this->data['caste_quota']=$this->sm->get_caste_quota(array('quota_status'=>'active'),FALSE);

            $this->data['enrollment_years']=$enrollment_years;

            $this->data['inst_courses']=$courses;

            $this->data['college_id']=encode_data($college_id);


            $this->data['countries']=$this->com->get_country(array('country_default'=>1));

            $this->config->load('anonymus');

            $this->data['anonymus_ids']=$this->config->item('anonym_ids');

            $review_data=array();
            $review_status_data=array();
            $review_admission_data=array();
            $review_academics_data=array();
            $review_scholarship_data=array();
            $review_campus_life_data=array();
            $review_accomodation_data=array();
            $review_placement_data=array();
            $review_internship_data=array();
            $review_interview_data=array();
            $review_faculty_data=array();
            $review_remarks_data=array();
            $review_likes_data=array();
            $review_dislikes_data=array();

            if($review_id!='0'){
                $review_data=$this->sm->get_review_data(array('review_unique_id'=>$review_id,'review_inst_id'=>$college_id,'review_step'=>'step_1'));
                $review_status_data=$this->sm->get_review_status_data(array('review_uid'=>$review_data->review_unique_id));
                $review_admission_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'1'));
                $review_academics_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'2'));
                $review_scholarship_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'3'));
                $review_campus_life_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'4'));
                $review_accomodation_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'5'));
                $review_placement_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'6'));
                $review_internship_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'7'));
                $review_interview_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'8'));
                $review_faculty_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'9'));
                $review_remarks_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'10'));
                $review_likes_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'11'));
                $review_dislikes_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_data->review_id,'review_question_type'=>'12'));

            }

            $this->data['review_data']=$review_data;
            $this->data['review_status_data']=$review_status_data;
            $this->data['review_admission_data']=$review_admission_data; 
            $this->data['review_academics_data']=$review_academics_data; 
            $this->data['review_scholarship_data']=$review_scholarship_data;
            $this->data['review_campus_life_data']=$review_campus_life_data; 
            $this->data['review_accomodation_data']=$review_accomodation_data;
            $this->data['review_placement_data']=$review_placement_data; 
            $this->data['review_internship_data']=$review_internship_data;
            $this->data['review_interview_data']=$review_interview_data;  
            $this->data['review_faculty_data']=$review_faculty_data;  
            $this->data['review_remarks_data']=$review_remarks_data;
            $this->data['review_likes_data']=$review_likes_data;
            $this->data['review_dislikes_data']=$review_dislikes_data;  

            $this->data['back_link']=$this->data['admin_base_url'].'/institutions/colleges/reviews/'.encode_data($college_id);          
            
            // $this->theme->title($this->data['page_title'])->add_partial('partial_file_upload_big_modal')->load('users/vw_colleges_reviews_add', $this->data);  

            $this->theme->title($this->data['page_title'])->load('users/vw_colleges_reviews_add', $this->data); 
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function onAddAnonymusInstReview(){
        if(session_userdata('isAdminLoggedin')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $anonymus_ids=$this->config->item('anonym_ids');

                $created_by=decode_data(session_userdata('admin_id'));

                $review_unique_id=post_data('review_unique_id');

                $review_status_change=post_data('review_status_change');

                if($review_status_change=='no'){
                    $step_no=post_data('review_step');
                    $review_step_data=post_data('review_step_data');
                    $review_q_type=post_data('review_q_type');

                    $review_title=post_data('review_title');

                    $college_id=post_data('review_college_id');
                    $user_id=post_data('review_user_id');
                    $inst_course_id=post_data('review_enrollment_course');
                    $review_enroll_year=post_data('review_enrollment_year');
                    $review_program_fees=post_data('review_program_fees');
                    $review_12th_board_id=post_data('review_board_12th');
                    $review_12th_board_percentage=post_data('review_percentage_12th_marks');
                    $review_10th_board_id=post_data('review_board_10th');
                    $review_10th_board_percentage=post_data('review_percentage_10th_marks');
                    $review_caste_quota_applicable=post_data('review_quota_available');
                    $review_caste_quota_id=post_data('review_quota_type');
                    $review_gd_pi_applicable=post_data('review_gd_pi_available');
                    $review_class_size=post_data('review_class_size');
                    $review_opt_hostel=post_data('review_opt_for_hostels');
                    $review_opt_hostel_fees=post_data('review_hostel_fees');
                    $review_inst_placement_applicable=post_data('review_placement_provided');
                    $review_inst_internship_applicable=post_data('review_internship_provided');

                    $review_college_overview=post_data('review_college_overview');

                    $review_q_category=post_data('review_q_category');
                    

                    //echo $review_step_data;die;

                    $inst_id=decode_data($college_id);

                    $college_data=$this->im->get_college_data(array('college_user_id'=>$inst_id));

                    if($review_step_data=='step_1'){
                       if(!empty($review_unique_id)){
                           $_review_data=$this->sm->get_review_data(array('review_unique_id'=>$review_unique_id));
                           $token=$review_unique_id;
                        }else{
                           $_review_data=$this->sm->get_review_data(array('review_user_anonymus_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$review_step_data));
                           $token=token();
                        }

                        $course_data=$this->strm->get_course(array('course_id'=>$inst_course_id));

                        if($review_caste_quota_applicable=='yes'){
                            $quota=$this->sm->get_caste_quota(array('quota_id'=>$review_caste_quota_id));
                            $course_name=strtoupper($course_data->course_name.','.$quota->quota_name);
                        }else{
                            $course_name=strtoupper($course_data->course_name);
                        }

                        $review_data=array(
                            'review_unique_id'=>$token,
                            'review_user_as'=>'anonymous',
                            'review_user_name'=>$anonymus_ids[$user_id],
                            'review_user_name_short'=>createShortName($anonymus_ids[$user_id]),
                            'review_user_id'=>'0',
                            'review_user_anonymus_id'=>$user_id,
                            'review_inst_id'=>$inst_id,
                            'review_course_id'=>$inst_course_id,
                            'review_course_name'=>$course_name,
                            'review_step'=>$review_step_data,
                            'review_enroll_year'=>$review_enroll_year,
                            'review_program_fees'=>$review_program_fees,
                            'review_12th_board_id'=>$review_12th_board_id,
                            'review_12th_board_percentage'=>$review_12th_board_percentage,
                            'review_10th_board_id'=>$review_10th_board_id,
                            'review_10th_board_percentage'=>$review_10th_board_percentage,
                            'review_caste_quota_applicable'=>$review_caste_quota_applicable,
                            'review_caste_quota_id'=>$review_caste_quota_id,
                            'review_gd_pi_applicable'=>$review_gd_pi_applicable,
                            'review_class_size'=>$review_class_size,
                            'review_opt_hostel'=>$review_opt_hostel,
                            'review_opt_hostel_fees'=>$review_opt_hostel_fees,
                            'review_inst_placement_applicable'=>$review_inst_placement_applicable,
                            'review_inst_internship_applicable'=>$review_inst_internship_applicable,
                            'review_inst_name'=>$college_data->college_name,
                            'review_title'=>$review_title,
                            'review_other_program_data'=>'',
                            'review_inst_overall'=>$review_college_overview
                        );

                        //review_anonymid

                        if(empty($_review_data)){
                            $added=$this->sm->add_review_data($review_data);
                            $review_id=$added;
                        }else{
                            $added=$this->sm->update_review_data($review_data,array('review_user_anonymus_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$review_step_data));
                            $review_id=$_review_data->review_id;
                        }

                        if($added){

                            $review_status=$this->sm->get_review_status_data(array('review_uid'=>$token,'review_anonymid'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

                            if(empty($review_status)){
                                $this->sm->add_review_status_data(array('review_uid'=>$token,'review_anonymid'=>$user_id,'review_user_type'=>'anonymous','review_inst_id'=>$inst_id,'review_inst_type'=>$college_data->college_utype,'review_last_step'=>'step_1','review_approved'=>'incomplete_and_not_approved','review_course_id'=>$inst_course_id,'created_at'=>date('Y-m-d'),'created_by'=>$created_by));
                            }else{
                                $this->sm->update_review_status_data(array('review_last_step'=>$step_no),array('review_uid'=>$token,'review_anonymid'=>$user_id,'review_inst_id'=>$inst_id));
                            }

                            // if($this->input->post('review_status')){
                            //     $r_status=$this->input->post('review_status');
                            //     $this->sm->update_review_status_data(array('review_approved'=>$r_status,'review_approved_by'=>$created_by,'review_moderation'=>'done','review_approve_date'=>date('Y-m-d')),array('review_uid'=>$token,'review_anonymid'=>$user_id,'review_inst_id'=>$inst_id));

                            //     $this->sm->update_review_data(array('review_approved'=>$r_status,'review_approved_by'=>$created_by,'review_approval_date'=>date('Y-m-d')),array('review_user_anonymus_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$review_step_data));
                            // }

                            session_set_userdata(array('review_data_id'=>$review_id));
                            session_set_userdata(array('review_token_id'=>$token));
                            session_set_userdata(array('review_last_step'=>'step_1'));

                            $return['success']='Step 1 for review added.';
                        }else{
                            $return['error']='Error occurred';
                        } 
                    }else{

                        $review_id=session_userdata('review_data_id');
                        $token=session_userdata('review_token');
                        $last_step=session_userdata('review_last_step');
                        //$review_step=post_data('review_step');
                        $review_opt=post_data('review_opt');
                        $review_rating=post_data('review_rating');
                        //$review_q_type=post_data('review_q_type');
                        $review_question=post_data('review_question');
                        $review_q_type_title=post_data('review_q_type_title');

                        $inst_course_id=post_data('inst_course_id');
                        $anonym_user_id=post_data('review_anonym_user_id');

                        $review_step_1_data=$this->sm->get_review_data(array('review_id'=>$review_id));

                        if(!empty($review_step_1_data)){
                            //echo $inst_id;

                            $_review_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_id,
                                'review_step'=>$review_step_data,
                                'review_inst_id'=>$inst_id,
                                'review_course_id'=>$inst_course_id,
                                'review_user_anonymusid'=>$anonym_user_id));

                            $review_data=array(
                                'review_data_id'=>$review_id,
                                'review_step'=>$review_step_data,
                                'review_inst_id'=>$inst_id,
                                'review_course_id'=>$inst_course_id,
                                'review_user_id'=>'0',
                                'review_user_anonymusid'=>$anonym_user_id,
                                'review_question_title'=>$review_q_type_title,
                                'review_category'=>$review_q_category,
                                'review_question'=>$review_question,
                                'review_question_type'=>$review_q_type,
                                'review_question_answer'=>$review_opt,
                                'review_question_rating'=>$review_rating
                            );

                            //print_obj($review_data);die;

                            if(empty($_review_data)){
                                $added=$this->sm->add_review_question_data($review_data);
                            }else{
                                $added=$this->sm->update_review_question_data($review_data,array('review_data_id'=>$review_id,
                                'review_step'=>$review_step_data,
                                'review_inst_id'=>$inst_id,
                                'review_course_id'=>$inst_course_id,
                                'review_user_anonymusid'=>$anonym_user_id));
                            }

                            if($added){
                                if($review_q_type=='8'){
                                    $this->sm->update_review_data(array('review_remarks'=>$review_opt),array('review_id'=>$review_id));
                                }

                                $review_status=$this->sm->get_review_status_data(array('review_uid'=>$token,'review_anonymid'=>$anonym_user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

                                if(empty($review_status)){
                                    
                                    $this->sm->update_review_status_data(array('review_last_step'=>$step_no),array('review_uid'=>$token,'review_anonymid'=>$anonym_user_id,'review_inst_id'=>$inst_id));
                                }

                                $return['success']=ucwords(str_replace('_', ' ', $review_step_data)).' for review added.';
                             
                                session_set_userdata(array('review_last_step'=>$review_step_data));
                            }else{
                                $return['error']='Error occurred';
                            }
                        }else{
                            $return['error']='Step 1 needs to be completed first';
                        }
                    }
                }else if($review_status_change=='yes'){
                    $review_status=post_data('review_status');
                    $review_status_comment=post_data('review_comment');

                    $updated=$this->sm->update_review_status_data(array('review_approved'=>$review_status,'review_approved_by'=>$created_by,'review_approve_date'=>date('Y-m-d')),array('review_uid'=>$review_unique_id));

                    if($updated){
                        if(!empty($review_status_comment)){
                           $this->sm->update_review_data(array('review_status_comment'=>$review_status_comment,'review_approved_by'=>$created_by,'review_approval_date'=>date('Y-m-d')),array('review_unique_id'=>$review_unique_id)); 
                        }
                        
                        $return['success']='Review status has been updated.';
                    }else{
                        $return['error']='Review status not updated';
                    }
                }
       

                json_headers($return);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function onDeleteReviews(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

            }else{
                 redirect($this->data['admin_base_url']);
            }
        }else{
             redirect($this->data['admin_base_url']);
        }
    }


    public function onSearchAnonymousReviews(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $param['column_order'] = array(
                    null,
                    'college_name'
                );

                $param['column_search'] = array('college_name');
               
                $posts=$this->input->post();

                $param['review_user_anonymus_id']=true;

                $param['review_inst_id']=decode_data($posts['_college']);
                $param['order'] = array('review_id' => 'DESC');
                $group=FALSE;

                $list = $this->sm->_get_review_data($posts,$param,$group,FALSE,FALSE);

                //print_obj($list);die;

                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $r){
                    $no++;

                    $row = array();


                    $row[]  =   $no;

                    $status=$this->sm->get_review_status_data(array('review_uid'=>$r->review_unique_id,'review_user_id'=>$r->review_user_id));

                    $row[]  =   $r->review_title;
                    $row[]  =   '<a href="'.$this->data['admin_base_url'].'/institutions/colleges/reviews/add/'.encode_data($r->review_inst_id).'/'.$r->review_unique_id.'" class="btn btn-sm btn-primary">View</a>';

                    $data[] = $row; 
                   
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->_get_review_data($posts,$param,$group,TRUE),
                    "recordsFiltered" => $this->sm->_get_review_data($posts,$param,$group,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }

}