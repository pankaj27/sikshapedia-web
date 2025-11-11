<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Payments  extends BaseAdminController
{
    function __construct()
    {
        parent::__construct();
    }

    function indexAdmission(){
       
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Admission Payments Dashboard';

            $current_year=date('Y');

            $this->data['current_year']=$current_year;

            $this->data['total_admissions_current_year']=$this->adm->get_total_admissions(array('YEAR(created_at)'=>$current_year,'admission_inst_id'=>$this->data['userdata']->user_id));
            $this->data['total_admissions']=$this->adm->get_total_admissions(array('admission_inst_id'=>$this->data['userdata']->user_id));

            $agent_payment=$this->fm->_get_payments_total(array('details_type'=>'agent_payment','details_inst_id'=>$this->data['userdata']->user_id));

            $_agent_payment=(!empty($agent_payment) && isset($agent_payment[0]->total))?$agent_payment[0]->total:0;


            //$total_new_admission_payment=$this->fm->_get_payments_in_total(array('details_inst_id'=>$this->data['userdata']->user_id),'details_type',"'new_admission','seat_booking'");

            $total_new_admission_payment=$this->fm->_get_payments_in_total(array('details_inst_id'=>$this->data['userdata']->user_id),'details_type',"'new_admission'");

            $_total_new_admission_payment=(!empty($total_new_admission_payment) && isset($total_new_admission_payment[0]->total))?$total_new_admission_payment[0]->total:0;

            $income=$_total_new_admission_payment-$_agent_payment;

            $this->data['total_new_admission_payment']=(!empty($_total_new_admission_payment))?number_format($_total_new_admission_payment,2):'0.00';
            $this->data['total_agent_payment']=(!empty($_agent_payment))?number_format($_agent_payment,2):'0.00';
            $this->data['total_income']=(!empty($income))?number_format($income,2):'0.00';

            $this->theme->title($this->data['page_title'])->load('payments/vw_payment_admission', $this->data);
        }else{

            redirect($this->data['base_url']);
        }
    }


    public function onSearchAdmissionPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $param['column_order'] = array(
                    null,
                    'admission_code'
                );

                $param['inst_id']=$this->data['userdata']->user_id;
                $param['accounting_type']='income';
                $param['details_type']='new_admission';

                $param['column_search'] = array('admission_code');
                $param['order'] = array('details_type_id' => 'ASC');
                $posts=$this->input->post();

                $list = $this->fm->_get_payments_details($posts,$param,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                $agent_data=array();

                foreach ($list as $payment){
                    $no++;

                    $row = array();

                    $admission_data=$this->adm->get_admission_data(array('admission_code'=>$payment->admission_code));

                    $course_data=$this->cm->get_course(array('course_id'=>$payment->details_course_id));

                    $student_data=$this->um->get_user(array('user_id'=>$payment->details_stu_id),'student');

                    //print_obj($student_data);die;

                    $student_name=$student_data->stu_first_name.' '.$student_data->stu_mid_name.' '.$student_data->stu_last_name;

                    //$agent_payment=$this->fm->_get_payments_total(array('details_type'=>'agent_payment','details_inst_id'=>$this->data['userdata']->user_id,'details_accounting_type'=>'expenditure'));

                    //$total_agent_payment=(!empty($agent_payment))?number_format($agent_payment[0]->total,2):'0.00';

                    if($admission_data->admission_agent_id>0){
                        $agent_data=$this->um->get_user(array('agent_id'=>$admission_data->admission_agent_id),'agent');

                        $payment_booking_data=$this->fm->get_agent_payment(array('agent_id'=>$agent_data->agent_user_id,'booking_id'=>$admission_data->admission_id,'booking_type'=>'admission'));
                    }

                    

                    $total_agent_payment=0;

                    $income=$payment->details_amount-$total_agent_payment;

                    $total_income=(!empty($income))?number_format($income,2):'0.00';

                    $admission_session=$payment->session_start_year.'-'.$payment->session_end_year;

                    $row[]  =   $no;
                    $row[]  =   '<strong>'.$payment->admission_code.'</strong>';
                    $row[]  =   '<strong>'.$admission_session.'</strong>';
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($payment->details_amount,2).'</span>';

                    

                    if(!empty($agent_data)){
                        $agent=$agent_data->agent_name;

                        if(!empty($payment_booking_data)){
                            $agent_payment=(!empty($payment_booking_data))?number_format($payment_booking_data->amount_value,2):'0.00';
                            $agent.='<br><span class="label label-danger "><i class="fa fa-inr"></i> '.$agent_payment.'</span>';
                        }else{
                            $agent_commision_preset=$this->sm->get_agent_commission_settings(array('com_inst_id'=>$admission_data->admission_inst_id,'com_session_id'=>$admission_data->admission_sess_id,'com_course_id'=>$admission_data->admission_course_id));

                            $agent_commission_settings=$agent_commision_preset->com_max_value;

                            $agent_commission_text='Agent maximum commission for '.$course_data->course_code.'/'.$admission_session.' is ₹ '.number_format($agent_commision_preset->com_max_value,2);

                            $agent.='<br><button type="button" class="btn btn-xs btn-dark btn_set_agent_payment" data-admission_code="'.$admission_data->admission_code.'" data-admission_id="'.encode_data($admission_data->admission_id).'" data-admission_amount="'.$payment->details_amount.'"
                            data-admission_session="'.$admission_session.'" data-admission_course="'.$course_data->course_name.'" data-agent_name="'.$agent_data->agent_name.'" data-agent_id="'.encode_data($admission_data->admission_agent_id).'" data-admission_student="'.$student_name.'" data-agent_max_commission="'.$agent_commission_settings.'" data-agent_commission_text="'.$agent_commission_text.'" data-toggle="modal" data-target="#paySetAgentModal">Set Payment</button>';
                        }

                        
                    }else{
                        $agent='N/A';
                    }

                    $row[]  =  $agent; 
                   // $row[]  =   '<span class="label label-danger "><i class="fa fa-inr"></i> '.$total_agent_payment.'</span>';
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.$total_income.'</span>';
                    $row[]  =   '<button type="button" class="btn btn-xs btn-dark">View Details</button>';
                                       

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->_get_payments_details($posts,$param,TRUE),
                    "recordsFiltered" => $this->fm->_get_payments_details($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    //Own Seat Booking
    function indexSeatbookingPayments(){
       
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Seatbooking Payments Dashboard';

            $userdata=$this->data['userdata'];

            $current_year=date('Y');

            $total_tobe_pay_amount=0;
            $total_agent_payment=0;
            $total_income=0;

            $this->data['current_year']=$current_year;

            $this->data['total_admissions']=$this->adm->get_total_admissions(array('DATE(created_at)'=>$current_year));

            $this->data['total_seat_bookings']=$this->adm->get_seat_booking_count(array('booking_inst_id'=>$this->data['userdata']->user_id));

            $this->data['total_conversion']=$this->adm->get_seat_booking_count(array('booking_inst_id'=>$this->data['userdata']->user_id,'booking_converted'=>'yes'));

            $total_booking_payments=$this->adm->get_seat_booking_payment_total(array('booking_inst_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'yes'));
            $total_booking_payments_due=$this->adm->get_seat_booking_payment_total(array('booking_inst_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'no'));

            $this->data['total_booking_payments']=(!empty($total_booking_payments) && $total_booking_payments[0]->total!=null)?number_format($total_booking_payments[0]->total,2):'0.00';
            $this->data['total_booking_payments_due']=(!empty($total_booking_payments_due) && $total_booking_payments_due[0]->total!=null)?number_format($total_booking_payments_due[0]->total,2):'0.00';

            $agent_payment=$this->fm->_get_agent_payments_total(array('booking_type'=>'seat_booking','inst_id'=>$this->data['userdata']->user_id,'amount_paid'=>'yes'));

            //print_obj($agent_payment);die;

            if(!empty($agent_payment) && $agent_payment[0]->total!=null){
                $total_agent_payment=$agent_payment[0]->total;
            }

            if(!empty($total_booking_payments) && $total_booking_payments[0]->total!=null){
                if(!empty($agent_payment) && $agent_payment[0]->total!=null){
                    $total_tobe_pay_amount=$total_booking_payments[0]->total-$agent_payment[0]->total;
                }                    
            }

            $total_income=$total_tobe_pay_amount;


            $this->data['total_tobe_pay_amount']=number_format($total_tobe_pay_amount,2);
            

            $this->data['total_agent_payment']=number_format($total_agent_payment,2);

            $this->data['total_income']=number_format($total_income,2);

            if($userdata->user_type=='institute'){
                $sessions_param=array('session_parent_inst_id'=>$userdata->user_id);
            }else if($userdata->user_type=='institute_branch'){
                $sessions_param=array('session_inst_id'=>$userdata->user_id);
            }


            $this->data['sessions']=$this->sessm->get_session($sessions_param,FALSE);

            $banks=$this->sm->get_banks(array('bank_inst_id'=>$this->data['userdata']->user_id),FALSE);

            $this->data['banks']=$banks;

            $this->data['payment_mode']='indirect_payment';
            $this->data['online_payment_url']=$this->data['base_url'].'/admission_bookings_payment_initialize_inst';

            $this->theme->title($this->data['page_title'])->add_partial('partial_booking_fee_payment_inst_mode_modal',$this->data)->load('payments/vw_payment_seatbooking', $this->data);
        }else{

            redirect($this->data['base_url']);
        }
    }


    //Branch Seat Booking
    function indexSeatbookingBranchPayments(){
       
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Branch Seatbooking Payments Dashboard';

            $user_id=$this->data['userdata']->user_id;

            $current_year=date('Y');

            $this->data['branches']=$this->um->get_institute_branch(array('branch_parent_inst_id'=>$user_id),FALSE);

            $this->data['current_year']=$current_year;

            $this->data['total_admissions']=$this->adm->get_total_admissions(array('DATE(created_at)'=>$current_year));

            $this->data['total_seat_bookings']=$this->adm->get_seat_booking_count(array('booking_inst_parent_id'=>$user_id));

            $this->data['total_conversion']=$this->adm->get_seat_booking_count(array('booking_inst_parent_id'=>$user_id,'booking_converted'=>'yes'));

            $total_booking_payments=$this->adm->get_seat_booking_payment_total(array('booking_inst_parent_id'=>$user_id,'booking_payment_paid'=>'yes'));
            $_total_booking_payments=(!empty($total_booking_payments) && isset($total_booking_payments[0]->total))?$total_booking_payments[0]->total:0;

            $total_booking_payments_due=$this->adm->get_seat_booking_payment_total(array('booking_inst_parent_id'=>$user_id,'booking_payment_paid'=>'no'));

            $_total_booking_payments_due=(!empty($total_booking_payments_due) && isset($total_booking_payments_due[0]->total))?$total_booking_payments_due[0]->total:0;

            $this->data['total_booking_payments']=(!empty($_total_booking_payments))?number_format($_total_booking_payments,2):'0.00';
            $this->data['total_booking_payments_due']=(!empty($_total_booking_payments_due))?number_format($_total_booking_payments_due,2):'0.00';

            $agent_payment=$this->fm->_get_agent_payments_total(array('booking_type'=>'seat_booking','inst_parent_id'=>$user_id,'amount_paid'=>'yes'));

            $_agent_payment=(!empty($agent_payment) && isset($agent_payment[0]->total))?$agent_payment[0]->total:0;

            if(!empty($agent_payment)){
                $total_income=$_total_booking_payments-$_agent_payment;
            }else{
                $total_income=$_total_booking_payments;
            }
            

            $this->data['total_agent_payment']=(!empty($_agent_payment))?number_format($_agent_payment,2):'0.00';

            $this->data['total_income']=number_format($total_income,2);


            $total_tobe_pay_amount=$_total_booking_payments+$_total_booking_payments_due;


            $this->data['total_tobe_pay_amount']=number_format($total_tobe_pay_amount,2);

            $this->theme->title($this->data['page_title'])->load('payments/vw_payment_branch_seatbooking', $this->data);
        }else{

            redirect($this->data['base_url']);
        }
    }


    public function onSearchSeatBookingsPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $param['column_order'] = array(
                    null,
                    'course_name'
                );

                //$param['inst_id']=$this->data['userdata']->user_id;

                $param['column_search'] = array('course_name','booking_code');
                $param['order'] = array('booking_payment_id' => 'DESC');
                $posts=$this->input->post();

                if($posts['data_of']==='own'){
                    $param['inst_id']=$this->data['userdata']->user_id;
                }else if($posts['data_of']==='branch'){
                    $param['inst_parent_id']=$this->data['userdata']->user_id;
                }

                if(isset($posts['data_of_id']) && !empty($posts['data_of_id'])){
                    $param['inst_id']=$posts['data_of_id'];
                }

                if(isset($posts['data_of_pay_status']) && !empty($posts['data_of_pay_status'])){
                    $param['inst_payment_paid']=$posts['data_of_pay_status'];
                }

                if(isset($posts['data_of_session_id']) && !empty($posts['data_of_session_id'])){
                    $param['inst_session_id']=$posts['data_of_session_id'];
                }

                if(isset($posts['data_of_course_id']) && !empty($posts['data_of_course_id'])){
                    $param['inst_session_course_id']=$posts['data_of_course_id'];
                }

                if(isset($posts['data_payment_mode']) && !empty($posts['data_payment_mode'])){
                    $param['inst_booking_pay_mode']=$posts['data_payment_mode'];
                }

                //print_obj($param);

                $list = $this->adm->_get_seat_booking_payment_data($posts,$param,FALSE,FALSE);

                //print_obj($list);die;                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                $current_year=date('Y');

                //$this->data['current_year']=$current_year;

                if($posts['data_of']==='own'){
                    if(!empty($posts['data_of_id'])){
                        $total_booking_payments_param=array('booking_inst_id'=>$posts['data_of_id'],'booking_payment_paid'=>'yes');
                        $total_booking_payments_due_param=array('booking_inst_id'=>$posts['data_of_id'],'booking_payment_paid'=>'no');
                        $total_admissions_param=array('DATE(created_at)'=>$current_year,'admission_inst_id'=>$posts['data_of_id']);
                        $total_seat_bookings_param=array('booking_inst_parent_id'=>$posts['data_of_id']);
                        $total_conversion_param=array('booking_inst_parent_id'=>$posts['data_of_id'],'booking_converted'=>'yes');
                    }else{
                        $total_booking_payments_param=array('booking_inst_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'yes');
                        $total_booking_payments_due_param=array('booking_inst_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'no');
                        $total_admissions_param=array('DATE(created_at)'=>$current_year,'admission_inst_id'=>$this->data['userdata']->user_id);
                        $total_seat_bookings_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id);
                        $total_conversion_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_converted'=>'yes');
                    }
                        
                }else if($posts['data_of']==='branch'){
                    if(!empty($posts['data_of_id'])){
                        $total_booking_payments_param=array('booking_inst_id'=>$posts['data_of_id'],'booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'yes');
                        $total_booking_payments_due_param=array('booking_inst_id'=>$posts['data_of_id'],'booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'no');
                        $total_admissions_param=array('DATE(created_at)'=>$current_year,'admission_inst_parent_id'=>$this->data['userdata']->user_id,'admission_inst_id'=>$posts['data_of_id']);
                        $total_seat_bookings_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_inst_id'=>$posts['data_of_id']);
                        $total_conversion_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_inst_id'=>$posts['data_of_id'],'booking_converted'=>'yes');
                    }else if(empty($posts['data_of_id'])){
                        $total_booking_payments_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'yes');
                        $total_booking_payments_due_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_payment_paid'=>'no');
                        $total_admissions_param=array('DATE(created_at)'=>$current_year,'admission_inst_parent_id'=>$this->data['userdata']->user_id);
                        $total_seat_bookings_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id);
                        $total_conversion_param=array('booking_inst_parent_id'=>$this->data['userdata']->user_id,'booking_converted'=>'yes');
                    }                    
                }

                if(isset($posts['data_of_session_id']) && !empty($posts['data_of_session_id'])){  
                    $booking_sess_id['booking_sess_id']=$posts['data_of_session_id'];
                    $total_booking_payments_param+=$booking_sess_id;
                    $total_booking_payments_due_param+=$booking_sess_id;
                    $admission_sess_id['admission_sess_id']=$posts['data_of_session_id'];
                    $total_admissions_param+=$admission_sess_id;
                    $total_seat_bookings_param+=$booking_sess_id;
                    $total_conversion_param+=$booking_sess_id;
                }

                if(isset($posts['data_of_course_id']) && !empty($posts['data_of_course_id'])){
                    $booking_course_id['booking_course_id']=$posts['data_of_course_id'];
                    $total_booking_payments_param+=$booking_course_id;
                    $total_booking_payments_due_param+=$booking_course_id;
                    $admission_course_id['admission_course_id']=$posts['data_of_course_id'];
                    $total_admissions_param+=$admission_course_id;
                    $total_seat_bookings_param+=$booking_course_id;
                    $total_conversion_param+=$booking_course_id;
                }

                $total_admissions=$this->adm->get_total_admissions($total_admissions_param);

                $total_seat_bookings=$this->adm->get_seat_booking_count($total_seat_bookings_param);  

                $total_conversion=$this->adm->get_seat_booking_count($total_conversion_param);    

                $total_booking_payments=$this->adm->get_seat_booking_payment_total($total_booking_payments_param,FALSE);

                //print_obj($total_booking_payments);die;

                $total_booking_payments_due=$this->adm->get_seat_booking_payment_total($total_booking_payments_due_param);

                $total_tobe_pay_amount=0;

                if(!empty($total_booking_payments) && $total_booking_payments[0]->total!=null){
                    if(!empty($total_booking_payments_due) && $total_booking_payments_due[0]->total!=null){
                        $total_tobe_pay_amount=$total_booking_payments[0]->total+$total_booking_payments_due[0]->total;
                    }                    
                }
                

                if(!empty($posts['data_of_id']) && ($posts['data_of']==='own')){
                    $agent_payment_param=array('booking_type'=>'seat_booking','inst_id'=>$posts['data_of_id'],'amount_paid'=>'yes');
                }else if(!empty($posts['data_of_id']) && ($posts['data_of']==='branch')){
                    $agent_payment_param=array('booking_type'=>'seat_booking','inst_id'=>$posts['data_of_id'],'inst_parent_id'=>$this->data['userdata']->user_id,'amount_paid'=>'yes');
                }
                else if(empty($posts['data_of_id']) && $posts['data_of']=='own'){
                    $agent_payment_param=array('booking_type'=>'seat_booking','inst_id'=>$this->data['userdata']->user_id,'amount_paid'=>'yes');
                }else if(empty($posts['data_of_id']) && ($posts['data_of']==='branch')){
                    $agent_payment_param=array('booking_type'=>'seat_booking','inst_parent_id'=>$this->data['userdata']->user_id,'amount_paid'=>'yes');
                }
                else if(empty($posts['data_of_id']) && empty($posts['data_of'])){
                    $agent_payment_param=array('booking_type'=>'seat_booking','inst_id'=>$this->data['userdata']->user_id,'amount_paid'=>'yes');
                }

                if(isset($posts['data_of_session_id']) && !empty($posts['data_of_session_id'])){ 
                    $agent_payment_param['session_id']=$posts['data_of_session_id'];
                }

                if(isset($posts['data_of_course_id']) && !empty($posts['data_of_course_id'])){
                    $agent_payment_param['course_id']=$posts['data_of_course_id'];
                }

                $_agent_payment=$this->fm->get_agent_payments_total($agent_payment_param,FALSE);

                //print_obj($_agent_payment);die;

                if(!empty($total_booking_payments) && $total_booking_payments[0]->total!=null){
                    if(!empty($_agent_payment) && $_agent_payment[0]->total!=null){
                        $total_income=$total_booking_payments[0]->total-$_agent_payment[0]->total;
                    }else{
                        $total_income=$total_booking_payments[0]->total;
                    }
                }else{
                    $total_income=$total_booking_payments[0]->total;
                }

                //echo $total_income;die;

                foreach ($list as $payment){
                    $no++;

                    $row = array();

                    $course_data=$this->cm->get_course(array('course_id'=>$payment->booking_course_id));

                    $agent_payment=$this->fm->get_agent_payment(array('booking_id'=>$payment->booking_id,'booking_type'=>'seat_booking','inst_id'=>$this->data['userdata']->user_id));

                    if(!empty($agent_payment)){
                        if($agent_payment->amount_paid=='yes'){
                            $income=$payment->booking_payment-$agent_payment->amount_value;
                        }else{
                            $income=$payment->booking_payment;
                        }
                        
                    }else{
                        $income=$payment->booking_payment;
                    }


                    if($payment->stu_mid_name!=''){
                        $student_name=$payment->stu_first_name.' '.$payment->stu_mid_name.' '.$payment->stu_last_name;
                    }else{
                        $student_name=$payment->stu_first_name.' '.$payment->stu_last_name;
                    }

                    // if(!empty($payment->stu_ph_no)){
                    //     $student_name.='<br><b>Phone No</b>:'.$payment->stu_ph_no;
                    // }

                    // if(!empty($payment->stu_whatsapp_no)){
                    //     $student_name.='<br><b>Whatsapp</b>:'.$payment->stu_whatsapp_no;
                    // }


                    // if(!empty($payment->stu_email)){
                    //     $student_name.='<br><b>Email</b>:'.$payment->stu_email;
                    // }

                    $stu_image=$this->sm->get_file(array('storage_type'=>'student_profile_photo','storage_type_id'=>$payment->stu_user_id,'storage_parent_id'=>$payment->stu_inst_id));

                    if(!empty($stu_image) && is_file(FCPATH.$stu_image->media_disk_path)){
                        $image=$this->data['base_url'].$stu_image->media_disk_path;
                    }else{
                        $image=$this->data['no_image'];
                    }

                    if($payment->booking_converted=='no' && $payment->booking_payment_paid=='yes'){
                        $convert_url='<br><a style="margin-left: 0px;text-decoration: underline;" href="'.$this->data['base_url'].'/admission/bookings/convert/'.encode_data($payment->booking_id).'">Covert to Admission</a>';
                    }else if($payment->booking_converted=='yes' && $payment->booking_payment_paid=='yes'){
                        $convert_url='<br><label class="label label-inverse">Converted to Admission<label>';
                    }else if($payment->booking_converted=='cancel' && $payment->booking_payment_paid=='yes'){
                        $convert_url='<br><label class="label label-danger">Booking Cancelled<label>';
                    }else if($payment->booking_converted=='cancel' && $payment->booking_payment_paid=='no'){
                        $convert_url='<br><label class="label label-danger">Booking Cancelled<label>';
                    }else if($payment->booking_converted=='no' && $payment->booking_payment_paid=='yes'){
                        $convert_url='<br><label class="label label-danger">Admission can be done after payment<label>';
                    }else if($payment->booking_converted=='no' && $payment->booking_payment_paid=='no'){
                        $convert_url='<br><label class="label label-danger">Admission can be done after payment<label>';
                    }


                   // $admission_data=$this->adm->get_admission_data(array('admission_seat_booking_id'=>$payment->booking_id,'admission_inst_id'=>$this->data['userdata']->user_id));

                   
                    $booking_date='<br>Booking Date: '.date('d-m-Y',strtotime($payment->booking_date));
                    

                    if($payment->booking_converted=='yes' && $payment->admission_date!=null){
                        $convert_url.='<br>Admission Date: '.date('d-m-Y',strtotime($payment->admission_date));
                    }else if($payment->booking_converted=='cancel' && $payment->admission_date!=null){
                        $convert_url.='<br>Cancel Date: '.date('d-m-Y',strtotime($payment->admission_date));
                    }

                    if($posts['data_of']==='branch'){
                        $convert_url='';
                    }

                    if($payment->booking_payment_paid==='yes'){                        

                        if($payment->booking_pay_mode==='cheque'){

                            if(!empty($payment->booking_payment_checq_files_ids)){
                                $cheque_file_data=$this->sm->get_file_in('storage_id',$payment->booking_payment_checq_files_ids);

                                if(!empty($cheque_file_data)){
                                    foreach ($cheque_file_data as $k => $v) {
                                        $c_file[$payment->booking_id][]=base_url($v->media_disk_path_relative);
                                    }
                                }else{
                                    $c_file='';
                                }

                                if($c_file!=''){
                                    $_cfile=char_separated($c_file[$payment->booking_id]);                                
                                }else{
                                    $_cfile='';
                                } 
                            }else{
                                $_cfile='';
                            }

                            $view_bill='<br><button type="button" class="btn btn-xs btn-dark btn_view_bill" data-payment_id="'.encode_data($payment->booking_id).'" data-bill_type="seat_booking" data-booking_code="'.$payment->booking_code.'" data-target="#paymentBillModal" data-toggle="modal">View Bill</button> <button type="button" class="btn btn-xs btn-dark btn_view_cheque" data-booking_id="'.encode_data($payment->booking_id).'" data-booking_code="'.$payment->booking_code.'" data-checq_no="'.$payment->booking_payment_checq_no.'" data-student_name="'.$student_name.'" data-student_email="'.$payment->stu_email.'" data-payment_amount="'.$payment->booking_payment.'" data-cfile="'.$_cfile.'" data-paid="yes">View Cheque Details</button>';
                        }else{
                            $view_bill='<br><button type="button" class="btn btn-xs btn-dark btn_view_bill" data-payment_id="'.encode_data($payment->booking_id).'" data-bill_type="seat_booking" data-booking_code="'.$payment->booking_code.'" data-target="#paymentBillModal" data-toggle="modal">View Bill</button>';
                        } 
                    }else{

                        if($payment->booking_pay_mode==='cheque'){

                            if(!empty($payment->booking_payment_checq_files_ids)){
                                 $cheque_file_data=$this->sm->get_file_in('storage_id',$payment->booking_payment_checq_files_ids);

                                if(!empty($cheque_file_data)){
                                    foreach ($cheque_file_data as $k => $v) {
                                        $c_file[$payment->booking_id][]=base_url($v->media_disk_path_relative);
                                    }
                                }else{
                                    $c_file='';
                                }

                                if($c_file!=''){
                                    $_cfile=char_separated($c_file[$payment->booking_id]);                                
                                }else{
                                    $_cfile='';
                                }
                            }else{
                                $_cfile='';
                            }

                               

                            $view_bill='<br><button type="button" class="btn btn-xs btn-dark btn_view_bill" data-payment_id="'.encode_data($payment->booking_id).'" data-bill_type="seat_booking" data-booking_code="'.$payment->booking_code.'" data-target="#paymentBillModal" data-toggle="modal">View Bill</button> <button type="button" class="btn btn-xs btn-dark btn_view_cheque" data-booking_id="'.encode_data($payment->booking_id).'" data-booking_code="'.$payment->booking_code.'" data-checq_no="'.$payment->booking_payment_checq_no.'" data-student_name="'.$student_name.'" data-student_email="'.$payment->stu_email.'" data-payment_amount="'.$payment->booking_payment.'" data-cfile="'.$_cfile.'" data-paid="no">View Cheque Details - '.$payment->booking_id.'</button>';
                        }else{
                            $view_bill='';
                        } 
                    }

                    $course_name='<br>Course:'.$course_data->course_code;

                    $session=$payment->session_start_year.'-'.$payment->session_end_year;

                    $row[]  =   $no;
                    $row[]  =   $payment->booking_code.$course_name.$booking_date.$convert_url;
                    //$row[]  =   '<img class="img-thumbnail" src="'.$image.'" height="80px;" width="80px;">';
                    //$row[]  =   $student_name;
                    $row[]  =   $session.$view_bill;
                    // $row[]  =   $payment->course_name;
                    // $row[]  =   $payment->subject_name;

                    if($payment->booking_payment_paid=='yes'){
                        $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($payment->booking_payment,2).' paid</span>'; 
                    }else{
                        $row[]  =   '<span class="label label-danger "><i class="fa fa-inr"></i> '.number_format($payment->booking_payment,2).' not paid</span>';
                    }


                    if(!empty($agent_payment) && $agent_payment->amount_value>0){
                        if($agent_payment->amount_paid=='yes'){
                            $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($agent_payment->amount_value,2);
                        }else{
                            $row[]  =   '<span class="label label-danger "><i class="fa fa-inr"></i> '.number_format($agent_payment->amount_value,2);
                        }
                        
                    }else{
                        $row[]  = '-';
                    }
                   
                    if($payment->booking_payment_paid=='yes'){
                        $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($income,2);
                    }else{
                        $row[]  =   '-';
                    }
                    

                    $payment_and_cancel='<div class="button-group">';

                    if($payment->booking_payment_paid=='yes'){
                        $payment_and_cancel  =   ''; 
                    }else{
                        $payment_code=$payment->booking_code.'_stuinst';
                        $booking_date=date('d-m-Y',strtotime($payment->booking_date));
                        if($payment->booking_converted=='yes'){
                            $payment_and_cancel  .=   ''; 
                        }else if($payment->booking_converted=='no'){
                            $payment_and_cancel .=   '<button type="button" class="btn btn-xs btn-danger btn_cancel_booking" data-booking_id="'.encode_data($payment->booking_id).'" data-booking_code="'.$payment->booking_code.'" data-student_name="'.$student_name.'" data-student_email="'.$payment->stu_email.'" data-payment_amount="'.$payment->booking_payment.'" data-booking_date="'.date('d-m-Y',strtotime($payment->created_at)).'">Cancel</button>'; 
                        }else if($payment->booking_converted=='cancel'){
                            $payment_and_cancel  .=   '<label class="label label-inverse">Canceled</label>'; 
                        }

                        if($payment->booking_pay_mode==='cheque'){
                            $payment_and_cancel.='<label class="label label-inverse">Waiting for Cheque to cash</label>';
                        }else{
                            $payment_and_cancel.='<button class="btn btn-xs btn-dark btn_recieve_seatbooking_payment_now" type="button" data-amount_to_pay="'.$payment->booking_payment.'" data-booking_code="'.$payment->booking_code.'" data-enrolled_course="'.$course_data->course_code.'/'.$session.'" data-booking_date="
                        '.$booking_date.'" data-payment_code="'.$payment_code.'" data-payment_id="'.encode_data($payment->booking_payment_id).'" data-student_name="'.$student_name.'" data-toggle="modal" data-target="#payBookingFeesInstModeModal">Recieve Payment Now</button>';
                        }

                        
                    }

                    $payment_and_cancel.='</div>';

                    $row[]  =$payment_and_cancel;               

                    $data[] = $row; 
                }

                //print_obj($total_booking_payments);die;

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->adm->_get_seat_booking_payment_data($posts,$param,TRUE),
                    "recordsFiltered" => $this->adm->_get_seat_booking_payment_data($posts,$param,TRUE),
                    "data" => $data,
                    "total_tobe_pay_amount"=>number_format($total_tobe_pay_amount,2),
                    "total_admissions"=>$total_admissions,
                    "total_seat_bookings"=>$total_seat_bookings,
                    "total_conversion"=>$total_conversion,
                    "total_booking_payments"=>(!empty($total_booking_payments) && $total_booking_payments[0]->total!=null)?number_format($total_booking_payments[0]->total,2):'0.00',
                    "total_booking_payments_due"=>(!empty($total_booking_payments_due) && $total_booking_payments_due[0]->total!=null)?number_format($total_booking_payments_due[0]->total,2):'0.00',
                    "total_agent_payment"=>(!empty($_agent_payment) && $_agent_payment[0]->total!=null)?number_format($_agent_payment[0]->total,2):'0.00',
                    "total_income"=>number_format($total_income,2)
                );

                

                //print_obj($output);die;
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    //Agents

    function indexAgentsPayments(){
       
        if(session_userdata('isAdminLoggedin')){

            $agent_id=$this->uri->segment(4,0);

            if($agent_id!='0'){
                $agent_id=decode_data($agent_id);

                //echo $agent_id;

                if(!empty($agent_id)){

                    $agent_data=$this->um->get_user(array('agent_user_id'=>$agent_id),'agent');

                    //print_obj($agent_data);die;

                    if(!empty($agent_data)){
                        $this->data['page_title']='Agent - '.$agent_data->agent_name.' Payments Dashboard';

                        $this->data['agent_data']=$agent_data;

                        $total_payments=$this->fm->_get_agent_payments_total(array('agent_id'=>$agent_id,'amount_paid'=>'yes','inst_id'=>$agent_data->agent_inst_id));
                        $total_payments_due=$this->fm->_get_agent_payments_total(array('agent_id'=>$agent_id,'amount_paid'=>'no','inst_id'=>$agent_data->agent_inst_id));

                        $this->data['total_payments']=(!empty($total_payments) && $total_payments[0]->total)?number_format($total_payments[0]->total,2):'0.00';
                        $this->data['total_payments_due']=(!empty($total_payments_due) && $total_payments_due[0]->total!=null)?number_format($total_payments_due[0]->total,2):'0.00';

                        $this->data['total_seats_bookings_given']=$this->fm->_get_agent_booking_count(array('agent_id'=>$agent_id,'booking_type'=>'seat_booking','inst_id'=>$agent_data->agent_inst_id));


                        $this->theme->title($this->data['page_title'])->load('payments/vw_payment_agent', $this->data);
                    }else{
                        redirect($this->data['base_url'].'/agents');
                    }
                }else{
                    redirect($this->data['base_url'].'/agents');
                }
            }else{

                $this->data['page_title']='Agent Payments Dashboard';

                $this->data['total_seats_bookings_given']=$this->fm->_get_agent_booking_count(array('agent_id!='=>NULL,'booking_type'=>'seat_booking','inst_id'=>$this->data['userdata']->user_id));

                $total_payments=$this->fm->_get_payments_total(array('details_type'=>'agent_payment'));

                $this->data['total_agent_payments']=(!empty($total_payments) && isset($total_payments[0]->total))?number_format($total_payments[0]->total,2):'0.00';

                $this->theme->title($this->data['page_title'])->load('payments/vw_payment_agents', $this->data);
            }
            
        }else{

            redirect($this->data['base_url']);
        }
    }


    //All Payments
    public function onSearchAgentsPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $param['column_order'] = array(
                    null,
                    'agent_code',
                    'agent_name'
                );


                $param['inst_id']=$this->data['userdata']->user_id;

                $param['column_search'] = array('agent_code','agent_name');
                $param['order'] = array('details_amount' => 'ASC');
                $posts=$this->input->post();

                $list = $this->fm->___get_agent_payments($posts,$param,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $payment){
                    $no++;

                    $row = array();

                    $row[]  =   $no;
                    $row[]  =   $payment->agent_code;
                    $row[]  =   $payment->agent_name;
                    $row[]  =   $payment->agent_email;
                    $row[]  =   $payment->agent_ph;
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($payment->details_amount,2).'</span>';
                    $row[]  =   '<a href="'.$this->data['base_url'].'/payments/agents/'.encode_data($payment->agent_user_id).'" class="btn btn-xs btn-info">Payments</a>';
                    

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->__get_agent_payments($posts,$param,TRUE),
                    "recordsFiltered" => $this->fm->__get_agent_payments($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    //Specific Payments
    public function onSearchAgentPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $param['column_order'] = array(
                    null,
                    'course_name'
                );


                $param['inst_id']=$this->data['userdata']->user_id;

                $param['column_search'] = array('course_name');
                $param['order'] = array('payment_id' => 'ASC');
                $posts=$this->input->post();

                $param['agent_id']=decode_data($posts['agent_id']);

                $list = $this->fm->_get_agent_payments($posts,$param,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $payment){
                    $no++;

                    $row = array();

                    if($payment->booking_type=='seat_booking'){

                        $booking_data=$this->adm->get_seat_bookings_data(array('booking_id'=>$payment->booking_id));

                        $student_name=$booking_data->stu_first_name.' '.$booking_data->stu_mid_name.' '.$booking_data->stu_last_name.'<br><strong>'.$booking_data->stu_user_code.'</strong>';
                        $booking_code=$booking_data->booking_code;

                    }else if($payment->booking_type=='admission'){
                        $admission_data=$this->adm->get_admission_data(array('admission_id'=>$payment->booking_id));

                        $student_name=$admission_data->stu_first_name.' '.$admission_data->stu_mid_name.' '.$admission_data->stu_last_name.'<br><strong>'.$admission_data->stu_user_code.'</strong>';
                        $booking_code=$admission_data->admission_code;
                    }

                    if($payment->amount_paid_at!=null && $payment->amount_paid_at!='0000-00-00'){
                        $amount_paid_at=date('d-m-Y',strtotime($payment->amount_paid_at));
                    }else{
                        $amount_paid_at='--';
                    }

                    if($payment->amount_paid=='yes'){
                        $payment_status='<span class="badge badge-sm badge-success">Yes</span>';
                        $dates='<br><strong>Date Initiated:'.date('d-m-Y',strtotime($payment->amount_created_at)).'</strong><br><strong>Date Completed:'.$amount_paid_at.'</strong>';
                    }else if($payment->amount_paid=='no'){
                        $payment_status='<span class="badge badge-sm badge-danger">No</span>';
                        $dates='<br><strong>Date Initiated:'.date('d-m-Y',strtotime($payment->amount_created_at)).'</strong>';
                    }

                    $row[]  =   $no;
                    $row[]  =   '<b>'.$booking_code.'</b>'.$dates;
                    $row[]  =   $student_name;
                    $row[]  =   $payment->session_start_year.'-'.$payment->session_end_year;
                    $row[]  =   $payment->course_name;
                    $row[]  =   '<i class="fa fa-inr"></i> <b>'.number_format($payment->amount_value).'</b>';

                    

                    $row[]  =   $payment_status;

                    if($payment->amount_paid=='yes'){
                        $row[]  =   '<button class="btn btn-xs btn-info"><i class="fa fa-eye"></i></button>';
                    }else{

                        $seatbooking_payment=$this->adm->get_seat_booking_payment_data(array('booking_inst_id'=>$payment->inst_id,'booking_pk_id'=>$payment->booking_id));

                        if(!empty($seatbooking_payment) && $seatbooking_payment->booking_payment_paid=='yes'){
                            $row[]  =   '<button type="button" class="btn btn-xs btn-info btn_pay_now_to_agent" data-amount="'.$payment->amount_value.'" data-agent_id="'.encode_data($payment->agent_id).'" data-booking_id="'.encode_data($payment->booking_id).'" data-inst_id="'.encode_data($payment->inst_id).'" data-payment_id="'.encode_data($payment->payment_id).'" data-toggle="modal" data-target="#payToAgentModal">Pay now</button>';
                        }else{
                            $row[]  =   'Student not paid yet';
                        }

                        
                    }
                    
                    

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->_get_agent_payments($posts,$param,TRUE),
                    "recordsFiltered" => $this->fm->_get_agent_payments($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    //Agents




    public function indexHostelPayments(){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Hostel Payments';






            $this->theme->title($this->data['page_title'])->add_partial('partial_payment_bill_modal')->load('payments/vw_payment_hostels', $this->data);

        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchStudentHostelPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $userdata=$this->data['userdata'];

                $param['column_order'] = array(
                    null,
                    'payment_month'
                );

                $param['column_search'] = array('payment_month');
                $param['order'] = array('payment_id' => 'ASC');
                $posts=$this->input->post();


                $param['inst_id']=$userdata->user_id;


                $list = $this->fm->_get_hostel_fees_payment($posts,$param,FALSE,FALSE);

               // print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                $next=1;

                $date_now = new DateTime();

                foreach ($list as $fees){
                    $no++;

                    $row = array();

                    $due_date    = new DateTime($fees->due_at);

                    if($userdata->user_type=='student'){
                        $order_id='ORDHT'.date('Ymd').'_'.$fees->payment_year.'_'.$fees->payment_month.'_'.gen_code(2).'_'.$fees->payment_id.'_stu_hostel';
                    }else if($userdata->user_type=='institute'){
                        $order_id='ORDHT'.date('Ymd').'_'.$fees->payment_year.'_'.$fees->payment_month.'_'.gen_code(2).'_'.$fees->payment_id.'_stuinst_hostel';
                    }

                   

                    if($date_now>$due_date){
                        $penalty_applied=TRUE;
                        $total_due=$fees->payment_value+$fees->payment_late_value;  
                    }else if($date_now==$due_date){
                        $penalty_applied=FALSE;
                        $total_due=$fees->payment_value;
                    }else{
                        $penalty_applied=FALSE;
                        $total_due=$fees->payment_value;
                    }

                    $order_id='';

                    if($fees->payment_status=='not paid'){

                        if($no==1){
                            $paybtn='<button type="button" class="btn btn-xs btn-info btn_pay_hostel_fees" data-payment_id="'.encode_data($fees->payment_id).'" data-order_id="'.$order_id.'" data-hostel_name="'.$fees->hostel_name.'" data-month="'.ucwords($fees->payment_month).'" data-year="'.$fees->payment_year.'">Recieve Now</button>';
                        }else{
                            if($next==$no){
                                 $paybtn='<button type="button" class="btn btn-xs btn-info btn_pay_hostel_fees" data-payment_id="'.encode_data($fees->payment_id).'" data-order_id="'.$order_id.'" data-hostel_name="'.$fees->hostel_name.'" data-month="'.ucwords($fees->payment_month).'" data-year="'.$fees->payment_year.'">Recieve Now</button>';                               
                            }else{
                                $paybtn=''; 
                            }
                        }

                    }else{
                        $next+=1;
                        $paybtn='<label class="label label-success">Paid</label>';
                    }

                    
                    $row[]  =   $no;
                    $row[]  =   $fees->session_start_year.'-'.$fees->session_end_year;
                    $row[]  =   $fees->stu_first_name.' '.$fees->stu_mid_name.' '.$fees->stu_last_name;
                    $row[]  =   ucwords($fees->payment_month).' - '.$fees->payment_year;
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($fees->payment_value,2).'</span>';
                    $row[]  =   ($penalty_applied==TRUE)?'<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($fees->payment_late_value,2).'</span>':'';
                    
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($total_due,2).'</span>';
                    $row[]  =   date('d-m-Y',strtotime($fees->due_at));
                    $row[]  =   ($fees->payment_status=='paid')?date('d-m-Y',strtotime($fees->recieved_at)):'<span class="label label-danger ">'.ucwords($fees->payment_status).'</span>';
                    $row[]  =   $paybtn;



                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->_get_hostel_fees_payment($posts,$param,TRUE),
                    "recordsFiltered" => $this->fm->_get_hostel_fees_payment($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchStudentHostelAdmissionPayments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $userdata=$this->data['userdata'];

                $param['column_order'] = array(
                    null,
                    'payment_month'
                );

                $param['column_search'] = array('payment_month');
                $param['order'] = array('assigned_id' => 'ASC');
                $posts=$this->input->post();

                $param['inst_id']=$userdata->user_id;

                $list = $this->hm->_get_hostel_admission_fees_assign_data($posts,$param,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                $next=1;

                $date_now = new DateTime();

                foreach ($list as $fees){
                    $no++;

                    $row = array();

                    $total_fees=$fees->admission_fees_value+$fees->admission_caution_fees_value;


                    $payment_data=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_payment_type'=>'hostel_admission_fees_payment','details_payment_id'=>$fees->assigned_id));

                    if($fees->assign_fees_paid=='yes'){
                        $paid_date=date('d-m-Y',strtotime($fees->assign_fees_paid_date));
                        $action='<button type="button" class="btn btn-xs btn-dark btn_view_bill" data-payment_id="'.encode_data($payment_data->details_id).'" data-bill_type="hostel_admission_fees_payment">Bill</button>';
                    }else{
                        $paid_date='Not Paid';
                        $action='<button type="button" class="btn btn-xs btn-info btn_pay_hostel_admission_fees" data-payment_id="" data-academic_session="'.$fees->assign_sess_id.'" data-admission_fee="'.$fees->admission_fees_value.'" data-caution_fee="'.$fees->admission_caution_fees_value.'" data-total_fee="'.$total_fees.'" data-order_id="'.$fees->assigned_id.'" data-hostel_name="'.$fees->hostel_name.'">Pay Now</button>';
                    }

                    $row[]  =   $fees->session_start_year.'-'.$fees->session_end_year;
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($fees->admission_fees_value,2).'</span>';
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($fees->admission_caution_fees_value,2).'</span>';
                    $row[]  =   '<span class="label label-success "><i class="fa fa-inr"></i> '.number_format($total_fees,2).'</span>';

                    

                    $row[]  =   $paid_date;

                    $row[]  =   $action;


                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->hm->_get_hostel_admission_fees_assign_data($posts,$param,TRUE),
                    "recordsFiltered" => $this->hm->_get_hostel_admission_fees_assign_data($posts,$param,TRUE),
                    "data" => $data,
                );

                echo json_encode($output);
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }



    //Recive payments through gateway
    public function onRedirectToPaymentGateway(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){    

                $userdata = $this->data['userdata'];

                if($userdata->user_type=='insttitute'){
                    $parent_inst_id=$userdata->user_id;
                }else if($userdata->user_type=='institute_branch'){
                    $parent_inst_id=$userdata->branch_parent_inst_id;
                }else if($userdata->user_type=='student'){
                    $parent_inst_id=$userdata->stu_inst_parent_id;
                }  

                $payment_gateway=post_data('payment_gateway');
                $payment_order_id=post_data('payment_order_id');
                $payment_amount=post_data('payment_amount');

                //echo $payment_amount;die;

                $order_data=explode('_', $payment_order_id);

                //print_obj($order_data);die;

                $_fisrt_sec_order_id=$order_data[0];
                $order_prefix = preg_replace("/[^A-Z]+/", "", $_fisrt_sec_order_id);

                //echo $order_prefix;die;

                $inst_id=$this->data['inst_id'];

                $gatewaydata=array('payment_gateway'=>$payment_gateway);

                session_set_userdata($gatewaydata);

                $payment_settings=$this->sm->get_system_settings(array('settings_inst_id'=>$inst_id,'settings_type'=>'payment_gateway','settings_type_key'=>$payment_gateway));

                if(!empty($payment_settings->settings_value)){
                    $gateway_settings=unserialize($payment_settings->settings_value);

                    //echo $_fisrt_sec_order_id.'<br>';

                    //echo $inst_id;

                    if($order_prefix=='SB'){
                        $payment_details=$this->fm->_get_payment_details(array('details_order_code'=>$_fisrt_sec_order_id,'details_inst_id'=>$inst_id));


                        //print_obj($payment_details);die;


                        $student_name=$payment_details->stu_first_name.' '.$payment_details->stu_mid_name.' '.$payment_details->stu_last_name;
                        $student_email=$payment_details->stu_email;
                        $student_ph=$payment_details->stu_ph_no;
                        $payment_description=$payment_details->details_type_text;
                    }else if($order_prefix=='ADM'){
                        $order__id=$order_data[0];
                        $installemnt_unique_code=$order_data[4];
                        $utype=(isset($order_data[5]))?$order_data[5]:'';

                        $booking_data=$this->adm->get_admission_data(array('admission_code'=>$order__id));

                        //print_obj($booking_data);die;

                        if($utype=='stu'){
                          $stu_id=$booking_data->admission_stu_id;
                        }else if($utype=='stuinst'){
                          $stu_id=$booking_data->admission_stu_id;                      
                        }

                        $student_data=$this->um->get_user(array('user_id'=>$stu_id),'student');

                        $student_name=$student_data->stu_first_name.' '.$student_data->stu_mid_name.' '.$student_data->stu_last_name;
                        $student_email=$student_data->stu_email;
                        $student_ph=$student_data->stu_ph_no;
                        $payment_description='Admission installment fees';


                    }else if($order_prefix=='ORDHT'){
                        $order__id=$order_data[4];
                        $utype=(isset($order_data[5]))?$order_data[5]:'';

                        if($utype=='admfee'){
                            $hostel_admission_fees=$this->hm->__get_hostel_admission_fees_assign_data(array('assign_unique_payid'=>$order__id));

                            //print_obj($hostel_admission_fees);die;
                            $student_data=$this->um->get_user(array('user_id'=>$hostel_admission_fees->assign_stu_id),'student');

                            $student_name=$student_data->stu_first_name.' '.$student_data->stu_mid_name.' '.$student_data->stu_last_name;
                            $student_email=$student_data->stu_email;
                            $student_ph=$student_data->stu_ph_no;
                            $payment_amount=$hostel_admission_fees->admission_fees_value+$hostel_admission_fees->admission_caution_fees_value;
                            $payment_description='Hostel Admission fees';
                        }else if($utype=='stu'){
                            $hostel_fees_data=$this->fm->get_hostel_fees_payment(array('payment_unique_code'=>$order__id));

                            print_obj($hostel_fees_data);die;

                            $student_data=$this->um->get_user(array('user_id'=>$hostel_fees_data->payment_hostel_stu_id),'student');

                            $student_name=$student_data->stu_first_name.' '.$student_data->stu_mid_name.' '.$student_data->stu_last_name;
                            $student_email=$student_data->stu_email;
                            $student_ph=$student_data->stu_ph_no;

                            $date=date('Y-m-d');
                            $due_date=$hostel_fees_data->due_at;

                            if($date>$due_date){
                                $payment_amount=$hostel_fees_data->payment_value+$hostel_fees_data->payment_late_value;
                            }else{
                                $payment_amount=$hostel_fees_data->payment_value;
                            }

                            $payment_description='Hostel Rent fees of '.ucwords($hostel_fees_data->payment_month).'-'.$hostel_fees_data->payment_year;
                        }else{
                            $hostel_fees_data=$this->fm->get_hostel_fees_payment(array('payment_id'=>$order__id));
                        }
                    }


                    //print_obj($gateway_settings);die;

                        
                    //print_obj($payment_details);die;

                    //$gateway_data=$this->sm->get_payment_gateway_settings(array('gateway_id'=>$gateway_settings->PAYMENT_GATEWAY));

                    if($payment_gateway=='PAYTM'){
                        //$payment_settings=$this->data['payment_settings'];
                        //print_obj($payment_settings);die;

                        if($gateway_settings[$payment_settings->settings_type_id]['PAYMENT_MODE']=='TEST'){
                            $param['mid']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_MID'];
                            $param['mkey']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_KEY'];
                            $param['industry_type_id']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_INDUSTRY_TYPE_ID'];
                            $param['channel_id']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_CHANNEL_ID'];
                            $param['mwebsite']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_WEBSITE'];
                            $param['txn_url']=PAYTM_TEST_TXN_URL;
                        }else if($gateway_settings[$payment_settings->settings_type_id]['PAYMENT_MODE']=='PROD'){
                            $param['mid']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_MID'];
                            $param['mkey']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_KEY'];
                            $param['industry_type_id']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_INDUSTRY_TYPE_ID'];
                            $param['channel_id']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_CHANNEL_ID'];
                            $param['mwebsite']=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_WEBSITE'];
                            $param['txn_url']=PAYTM_PROD_TXN_URL;
                        }

                        //print_obj($param);die;

                        //$cust_id=post_data('payment_user_code');

                        $cust_id=ge_rand_code('CUST');//str_replace('/', '|', $cust_id);


                        $param["txn_amount"]=$payment_amount;
                        $param["order_id"]=$payment_order_id.'_'.$payment_gateway.'_'.$inst_id;
                        $param["cust_id"]=$cust_id;
                        $param['callback']=$this->data['base_url'].'/payments_reciept_success';


                        

                        //$total_discount=$scholarship+$special_amount;

                        if($this->input->post('payment_scholarship_amount')){
                            $scholarship=post_data('payment_scholarship_amount');
                            $special_amount=post_data('payment_special_amount');
                            $scholarship_reason=post_data('payment_scholarship_reason');
                            $special_reason=post_data('payment_special_reason');
                            $checksum=post_data('checksum');

                            $total_discount=$scholarship+$special_amount;

                            $data_to_add=array(
                                'temp_checksum'=>$param["order_id"],
                                'temp_scholarship_discount'=>$scholarship,
                                'temp_payment_actual'=>$param["txn_amount"],
                                'temp_payment_total_discount'=>$total_discount,
                                'temp_special_discount'=>$special_amount,
                                'temp_scholarship_discount_reason'=>$scholarship_reason,
                                'temp_special_discount_reason'=>$special_reason
                            );

                            $this->fm->store_temp_payment($data_to_add);
                        }
                        
                        

                        $payment_procees_form=pgRedirect($param);

                        //print_obj($payment_procees_form);die;

                        echo $payment_procees_form;

                        //json_headers($return);
                    }else if($payment_gateway=='RAZORPAY'){

                        if($gateway_settings[$payment_settings->settings_type_id]['PAYMENT_MODE']=='TEST'){
                            $rz_mid=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_MID'];
                            $rz_key=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_KEY'];
                            $rz_key_secret=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_TEST_MERCHANT_SECRET_KEY'];
                        }else if($gateway_settings[$payment_settings->settings_type_id]['PAYMENT_MODE']=='PROD'){
                            $rz_mid=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_MID'];
                            $rz_key=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_KEY'];
                            $rz_key_secret=$gateway_settings[$payment_settings->settings_type_id]['PAYMENT_PROD_MERCHANT_SECRET_KEY'];
                        }

                        //$order_name=post_data('payment_name');

                        $reciept_no=ge_rand_code('RCPT');

                        // $rz_key='rzp_test_JOC0wRKpLH1cVW';

                        // $rz_key_secret='9EzSlxvJbTyQ2Hg0Us5ZX4VD';

                        $param=array(
                            'key'=>$rz_key,
                            'key_secret'=>$rz_key_secret,
                            'order_amount'=>$payment_amount,
                            'reciept_no'=>$reciept_no,
                            'order_name'=>$student_name,
                            'order_description'=>$payment_description,
                            'order_cust_email'=>$student_email,
                            'order_cust_ph'=>$student_ph,
                            'order_address'=>'',
                            'order_id'=>$payment_order_id,
                            'order_screen_color'=>'#212529',
                            'order_logo'=>$this->data['link_logo'],
                            'order_action_url'=>$this->data['base_url'].'/payments_reciept_success'
                        );

                        //print_obj($param);die;



                        $razorpayRedirect=$this->razorpay->rzRedirect($param);

                        //print_obj($razorpayRedirect);die;

                        //echo get_cookie('payment_gateway');die;

                        echo $razorpayRedirect;
                    }
                }else{
                    $return['error']='Payment settings not found';
                }
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function indexPaymentResponse(){
        header("Pragma: no-cache");
        header("Cache-Control: no-cache");
        header("Expires: 0");

        //print_obj($this->config);exit;

        //print_obj($_SERVER);

        //print_obj($_POST);die;

       //print_obj($_SESSION);die;

        //print_obj($_SESSION);die;


        if($this->input->get()){
            $payment_error=array(
                'payment_error'=>$this->input->get('errorMessage')
            );

            session_set_userdata($payment_error);

            $admin_type=session_userdata('admin_type');

            $booking_code=session_userdata('booking_code');

            $order_prefix = preg_replace("/[^A-Z]+/", "", $booking_code);

            if($admin_type==='institute' || $admin_type==='institute_branch'){

                $payment_details=$this->fm->get_payment_details(array('details_order_code'=>$booking_code));

                if(!empty($payment_details)){
                    $this->fm->update_payment_details(array('details_accounting_type'=>'not_settled','details_status'=>'error','details_gateway_status'=>'error','details_msg'=>$this->input->get('errorMessage')),array('details_order_code'=>$booking_code));
                }


                $redirect=$this->data['base_url'].'/admission/bookings';

                // if($order_prefix==='SB'){
                //     $redirect=$this->data['base_url'].'/admission/bookings?err='.session_userdata('booking_code');
                // }else{
                //     $redirect=$this->data['base_url'].'/admission/bookings?err='.session_userdata('booking_code');
                // }                
            }
            else{
                $redirect=$this->data['base_url'].'/account';
            }

            redirect($redirect);
        }else{
            if(isset($_POST['ORDERID'])){
                $exp_od=explode('_',$_POST['ORDERID']);
                $payment_gateway=$exp_od[2];
                $inst_id=$exp_od[3];
            }else{
                $payment_gateway=session_userdata('payment_gateway');
                $inst_id=$this->data['inst_id'];
            }

            //echo $payment_gateway;exit;

            if($payment_gateway){

                //print_obj($payment_gateway);die;

                //echo session_userdata('payment_gateway');die;

                $_payment_settings=$this->sm->get_system_settings(array('settings_inst_id'=>$inst_id,'settings_type_key'=>$payment_gateway,'settings_type'=>'payment_gateway'));

                //print_obj($_payment_settings);die;

                $gateway_settings=unserialize($_payment_settings->settings_value);

                $gatewaysettings_data=$gateway_settings[$_payment_settings->settings_type_id];

                if($payment_gateway=='PAYTM'){

                    //print_obj($_POST);

                    //[RESPCODE] => 01  success
                    //[RESPCODE] => 402  pending
                    //[RESPCODE] => 141 user cancelled

                    $order_id=$this->input->post('ORDERID');

                    $status=$this->input->post('STATUS');

                    $msg=$this->input->post('RESPMSG');

                    $txn_id=$this->input->post('TXNID');

                    $resp_code=$this->input->post('RESPCODE');

                    //echo $status;

                    //echo $msg;die;

                    if($gatewaysettings_data['PAYMENT_MODE']=='TEST'){
                        $mkey=$gatewaysettings_data['PAYMENT_TEST_MERCHANT_KEY'];
                        $mid=$gatewaysettings_data['PAYMENT_TEST_MERCHANT_MID'];
                        //$PAYTM_STATUS_QUERY_URL=$payment_settings['PAYTM_TEST_STATUS_QUERY_URL'];
                        $PAYTM_STATUS_QUERY_NEW_URL=PAYTM_TEST_STATUS_QUERY_NEW_URL;
                    }else if($gatewaysettings_data['PAYMENT_MODE']=='PROD'){
                        $mkey=$gatewaysettings_data['PAYMENT_PROD_MERCHANT_KEY'];
                        $mid=$gatewaysettings_data['PAYMENT_PROD_MERCHANT_MID'];
                        //$PAYTM_STATUS_QUERY_URL=$payment_settings['PAYTM_PROD_STATUS_QUERY_URL'];
                        $PAYTM_STATUS_QUERY_NEW_URL=PAYTM_PROD_STATUS_QUERY_NEW_URL;
                    }

                    $param['mkey']=$mkey;
                    $param['mid']=$mid;
                    //$param['paytm_status_query_url']=$PAYTM_STATUS_QUERY_URL;
                    $param['paytm_status_query_new_url']=$PAYTM_STATUS_QUERY_NEW_URL;

                    $payment_response=pgResponse($param);

                    //print_obj($payment_response);die;                 

                    if(!empty($payment_response)){

                        if($status==='TXN_SUCCESS'){
                            $order_id=$payment_response['ORDERID'];
                            $txn_amount=$payment_response['TXNAMOUNT'];
                            $txn_id=$payment_response['TXNID'];
                            $payment_id=$payment_response['BANKTXNID'];
                        }else{
                            $order_id=$order_id;
                            $txn_amount=$payment_response['TXNAMOUNT'];
                            $txn_id=$payment_response['TXNID'];
                            $payment_id='0';
                        }                        

                        //echo $order_id;die;

                        $order_exp_id=char_separated_to_array($order_id,'_');


                        $order_prefix = preg_replace("/[^A-Z]+/", "", $order_exp_id[0]);

                        //print_obj($order_exp_id);die;
                        

                        //print_obj($payment_data);die;

                        if($order_prefix==='SB'){
                            if($order_exp_id[1]==='stuinst'){
                                $payment_data=$this->fm->get_payment_details(array('details_order_id'=>$order_id));
                                //print_obj($payment_data);die;
                                $user_id_to_login=(!empty($payment_data))?$payment_data->details_inst_id:$order_exp_id[3];
                            }else if($order_exp_id[1]==='stu'){
                                $booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));
                                $user_id_to_login=$booking_data->stu_user_id;
                            }                        
                        }else if($order_prefix==='ADM'){
                            if($order_exp_id[5]==='stuinst'){
                                $admission_data=$this->adm->get_admission_data(array('admission_code'=>$order_exp_id[0]));

                                //print_obj($admission_data);

                                $user_id_to_login=$admission_data->admission_inst_id;

                                //echo $user_id_to_login;die;
                            }else if($order_exp_id[5]==='stu'){
                                //$booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));

                                $admission_data=$this->adm->get_admission_data(array('admission_code'=>$order_exp_id[0]));

                                $user_id_to_login=$admission_data->stu_user_id;
                            }                            
                        }else if($order_prefix==='ORDHT'){
                            //print_obj($order_exp_id);die;

                            if($order_exp_id[5]==='stu'){
                                $booking_data=$this->fm->get_hostel_fees_payment(array('payment_unique_code'=>$order_exp_id[4]));
                                $user_id_to_login=$booking_data->payment_hostel_stu_id;
                            }
                        }

                        //echo $user_id_to_login;


                        $userdata = $this->um->_get_user(array('user_id'=>$user_id_to_login));

                        //print_obj($userdata);die;

                        $payment_session_data=array(
                            'isAdminLoggedin'=>true,
                            'admin_id'=>encode_data($userdata->user_id),
                            'admin_type'=>$userdata->user_type,
                            'loggedin_time'=>time(),
                            'payment_success'=>'Payment has been recieved.'
                        );

                        session_set_userdata($payment_session_data);

                        //print_obj($payment_data);

                        $paymant_param=array(
                            'order_id'=>$order_id,
                            'payment_platform'=>'paytm',
                            'payment_amount'=>$txn_amount,
                            'msg'=>$msg,
                            'gateway_status'=>strtolower($status),
                            'pay_id'=>$payment_id,
                            'txn_id'=>$txn_id,
                            'user_id_to_login'=>$user_id_to_login
                        );

                        //print_obj($paymant_param);die;

                        $this->get_payment_response($paymant_param);

                    }else{
                        redirect($this->data['base_url']);
                    }

                   
                }else if($payment_gateway=='RAZORPAY'){

                    //echo 'RAZORPAY 1';die;

                    //echo session_userdata('payment_gateway');
                    unset($_SESSION['payment_gateway']);

                    $payment_id=post_data('razorpay_payment_id');
                    $signature=post_data('razorpay_signature');
                    $order_id=post_data('razorpay_order_id');
                    $order_code=post_data('razorpay_order_code');

                    //echo $order_code;die;

                    $gateway_key=($gatewaysettings_data['PAYMENT_MODE']=='TEST')?$gatewaysettings_data['PAYMENT_TEST_MERCHANT_KEY']:$gatewaysettings_data['PAYMENT_PROD_MERCHANT_KEY'];

                    $gateway_key_secret=($gatewaysettings_data['PAYMENT_MODE']=='TEST')?$gatewaysettings_data['PAYMENT_TEST_MERCHANT_SECRET_KEY']:$gatewaysettings_data['PAYMENT_PROD_MERCHANT_SECRET_KEY'];               

                    $param=array(
                        'key'=>$gateway_key,
                        'key_secret'=>$gateway_key_secret,
                        'order_id'=>$order_id,
                        'order_payment_id'=>$payment_id,
                        'order_signature'=>$signature
                    );

                    //print_obj($param);

                    $payment_response=$this->razorpay->rzResponse($param);

                    $response=json_decode($payment_response);

                    //print_obj($response);die;

                    $order_exp_id=char_separated_to_array($order_code,'_');

                    $order_prefix = preg_replace("/[^A-Z]+/", "", $order_exp_id[0]);

                    // print_obj($order_exp_id);die;
                    

                    //print_obj($payment_data);die;

                    //print_obj($order_exp_id);die;

                    if($order_prefix==='SB'){
                        if($order_exp_id[1]==='stuinst'){
                            $payment_data=$this->fm->get_payment_details(array('details_order_code'=>$order_exp_id[0]));
                            $booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));

                            //print_obj($payment_data);die;

                            $user_id_to_login=$payment_data->details_inst_id;
                            $txn_id='T'.date('YmdHis').$payment_data->details_inst_id.$payment_data->details_stu_id.$booking_data->booking_id.$payment_data->details_payment_id;
                        }else if($order_exp_id[1]==='stu'){
                            $booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));
                            $user_id_to_login=$booking_data->stu_user_id;
                            $txn_id='T'.date('YmdHis').$booking_data->booking_inst_id.$booking_data->booking_stu_id.$booking_data->booking_pk_id.$booking_data->booking_payment_id;
                        }else if($order_exp_id[1]==='agt'){
                            $payment_data=$this->fm->_get_agent_payment(array('booking_code'=>$order_code));
                            $booking_data=$this->adm->get_seat_booking_data(array('booking_id'=>$payment_data->booking_id));
                            $user_id_to_login=$payment_data->inst_id;
                            $txn_id='T'.date('YmdHis').$payment_data->inst_id.$payment_data->agent_id.$payment_data->booking_id.$payment_data->payment_id ;

                            //print_obj($payment_data);die;
                        }                    
                    }else if($order_prefix==='ADM'){
                        if(isset($order_exp_id[5]) && $order_exp_id[5]==='stuinst'){
                            $admission_data=$this->adm->get_admission_data(array('admission_code'=>$order_exp_id[0]));

                            //print_obj($admission_data);

                            $user_id_to_login=$admission_data->admission_inst_id;

                            $txn_id='T'.date('YmdHis').$admission_data->admission_inst_id.$admission_data->admission_stu_id.$admission_data->admission_id;

                            //echo $user_id_to_login;die;
                        }else if(isset($order_exp_id[5]) && $order_exp_id[5]==='stu'){
                            //$booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));

                            $admission_data=$this->adm->get_admission_data(array('admission_code'=>$order_exp_id[0]));

                            //print_obj($admission_data);die;

                            $user_id_to_login=$admission_data->admission_stu_id;

                            $txn_id='T'.date('YmdHis').$admission_data->admission_inst_id.$admission_data->admission_stu_id.$admission_data->admission_id;
                        }else if(isset($order_exp_id[1]) && $order_exp_id[1]==='agt'){
                            $payment_data=$this->fm->_get_agent_payment(array('booking_code'=>$order_code));
                            $booking_data=$this->adm->get_seat_booking_data(array('booking_id'=>$payment_data->booking_id));
                            $user_id_to_login=$payment_data->inst_id;
                            $txn_id='T'.date('YmdHis').$payment_data->inst_id.$payment_data->agent_id.$payment_data->booking_id.$payment_data->payment_id ;

                            //print_obj($payment_data);die;
                        }
                            
                    }else if($order_prefix==='ORDHT'){
                        //print_obj($order_exp_id);die;

                        if($order_exp_id[5]==='stu'){
                            $booking_data=$this->fm->get_hostel_fees_payment(array('payment_unique_code'=>$order_exp_id[4]));
                            $user_id_to_login=$booking_data->payment_hostel_stu_id;
                            $txn_id='T'.date('YmdHis').$booking_data->payment_hostel_inst_id.$booking_data->payment_hostel_stu_id.$booking_data->payment_hostel_id.$booking_data->payment_id;
                        }else if($order_exp_id[5]==='admfee'){
                            $booking_data=$this->hm->get_hostel_admission_fees_assign_data(array('assign_unique_payid'=>$order_exp_id[4]));
                            $user_id_to_login=$booking_data->assign_stu_id;
                            $txn_id='T'.date('YmdHis').$booking_data->assign_hostel_inst_id.$booking_data->assign_stu_id.$booking_data->assign_hostel_id.$booking_data->assigned_id;
                            //print_obj($booking_data);
                        }
                    }

                    //die;

                    //print_obj($user_id_to_login);die;

                    //print_obj($response);die;

                    // if($order_exp_id[1]==='stuinst'){
                    //     $payment_data=$this->fm->get_payment_details(array('details_order_id'=>$order_code));

                    //     //print_obj($payment_data);die;

                    //     $user_id_to_login=$payment_data->details_inst_id;
                    // }else if($order_exp_id[1]==='stu'){
                    //     $booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order_exp_id[0]));
                    //     $user_id_to_login=$booking_data->stu_user_id;
                    // }

                    $payment_response_check_param=array(
                        'key'=>$gateway_key,
                        'key_secret'=>$gateway_key_secret,
                        'fetch_type'=>'single',
                        'payment_id'=>$payment_id
                    );


                    $rzFetchPayments=$this->razorpay->rzFetchPayments($payment_response_check_param);

                    $payment_param=array(
                        'order_id'=>$order_code,
                        'payment_platform'=>'razorpay',
                        'payment_amount'=>$response->payment_response->payment_amount,
                        'msg'=>$response->payment_response->status,
                        'pay_status'=>$rzFetchPayments->status,
                        'pay_signature'=>$signature,
                        'pay_id'=>$payment_id,
                        'txn_id'=>$txn_id,
                        'pay_order_id'=>$rzFetchPayments->order_id,                    
                        'pay_currency'=>$rzFetchPayments->currency,
                        'pay_email'=>$rzFetchPayments->email,
                        'pay_contact'=>$rzFetchPayments->contact,
                        'pay_created_at'=>$rzFetchPayments->created_at,
                        'user_id_to_login'=>$user_id_to_login
                    );

                    //print_obj($payment_param);


                    $this->get_payment_response($payment_param);


                }

            }else{
               redirect($this->data['base_url']);
            }
       }                          
    }


    protected function get_payment_response($param){

        //$loogeduserdata = $this->data['userdata'];

        //print_obj($param);

        $userdata = $this->um->_get_user(array('user_id'=>$param['user_id_to_login']));

       //print_obj($userdata);exit;

        if($userdata->user_type=='institute'){
            $parent_inst_id=$userdata->user_id;
        }else if($userdata->user_type=='institute_branch'){
            $inst_branch_data=$this->um->get_user(array('user_id'=>$userdata->user_id),'institute_branch');
            $parent_inst_id=$inst_branch_data->branch_parent_inst_id;
        }else if($userdata->user_type=='student'){
            $student_data=$this->um->get_user(array('user_id'=>$userdata->user_id),'student');

            // if($student_data->stu_inst_type==='institute'){
            //     $parent_inst_id=$userdata->stu_inst_parent_id;
            // }elseif($student_data->stu_inst_type==='institute_branch'){
            //     $parent_inst_id=$userdata->stu_inst_parent_id;
            // }

            $parent_inst_id=$student_data->stu_inst_id;
            
        }

        // $payment_session_data=array(
        //     'isAdminLoggedin'=>true,
        //     'admin_id'=>encode_data($userdata->user_id),
        //     'admin_type'=>$userdata->user_type,
        //     'loggedin_time'=>time()
        // );

        // //print_obj($session_data);

        // //echo $redirect_url;

        // //die;

         //session_set_userdata($payment_session_data);

        if(!empty($param['order_id'])){

            $_order_id=explode('_', $param['order_id']);

            //print_obj($_order_id);die;

            //print_obj($_order_id);

            $_fisrt_sec_order_id=$_order_id[0];

            $order_prefix = preg_replace("/[^A-Z]+/", "", $_fisrt_sec_order_id);
            $balance='0';

            //echo $order_prefix;die;

            if($order_prefix=='SB'){
                $order__id=$_order_id[0];
                $utype=$_order_id[1];
                //print_obj($_order_id);die;
                
                if($utype=='agt'){
                    $booking_type='agent_payment';
                    $booking_data=$this->fm->_get_agent_payment(array('booking_code'=>$param['order_id']));
                    $txn_amount=$booking_data->amount_value;
                    $booking_inst_id=$booking_data->inst_id;
                    $booking_inst_parent_id=$booking_data->inst_parent_id;
                    $session_id=$booking_data->session_id;
                    $course_id=$booking_data->course_id;
                    $subject_id=$booking_data->subject_id;
                }else{
                    $booking_type='seat_booking';
                    $booking_data=$this->adm->get_seat_bookings_data(array('booking_code'=>$order__id));                    
                    $txn_amount=$booking_data->booking_payment;

                    $booking_inst_id=$booking_data->booking_inst_id;
                    $booking_inst_parent_id=$booking_data->booking_inst_parent_id;
                    $session_id=$booking_data->booking_sess_id;
                    $course_id=$booking_data->booking_course_id;
                    $subject_id=$booking_data->booking_subject_id;
                }
                    
                if($utype=='stu'){
                    //$student_data=$this->um->get_user(array('user_id'=>$booking_data->booking_stu_id),'student');
                    //print_obj($student_data);die;
                    $user_id=$booking_data->stu_user_id;
                    $stu_id=$booking_data->stu_user_id;                    
                }else if($utype=='stuinst'){
                   $user_id=$booking_data->booking_inst_id;
                   $stu_id=$booking_data->stu_user_id;
                }else if($utype=='agt'){
                   $user_id=$booking_data->inst_id;
                   $agent_id=$booking_data->agent_id;
                   $stu_id=$booking_data->stu_id;
                }
                
                
                $booking_id=$booking_data->booking_id;

                if($utype=='stu'){
                    $redirect_url=$this->data['base_url'].'/account';
                }else if($utype=='stuinst'){
                    $redirect_url=$this->data['base_url'].'/admission/bookings?p='.$order__id;
                }else if($utype=='agt'){
                    $redirect_url=$this->data['base_url'].'/payments/agents/'.encode_data($agent_id);
                }
                
                
            }else if($order_prefix=='ADM'){                

                if(isset($_order_id[5])){
                    $utype=$_order_id[5];
                }else if(isset($_order_id[1])){
                    $utype=$_order_id[1];
                }else{
                    $utype='';
                }
                

                // print_obj($booking_data);die;

                $booking_type='new_admission';
                if($utype=='stu'){
                    $installemnt_unique_code=$_order_id[4];
                    $booking_data=$this->adm->get_admission_data(array('admission_code'=>$_fisrt_sec_order_id));                  
                    $details_payment_type='installment_fees';
                    $user_id=$booking_data->admission_stu_id;
                    $stu_id=$booking_data->admission_stu_id;
                    $admission_id=$booking_data->admission_id;
                    $session_id=$booking_data->admission_sess_id;
                    $course_id=$booking_data->admission_course_id;
                    $session_year=$_order_id[1];
                    $txn_amount=$param['payment_amount'];
                    $booking_id=$booking_data->admission_id;
                    $booking_inst_id=$booking_data->admission_inst_id;
                    $booking_inst_parent_id=$booking_data->admission_inst_parent_id;
                }else if($utype=='stuinst'){
                    $installemnt_unique_code=$_order_id[4];
                    $booking_data=$this->adm->get_admission_data(array('admission_code'=>$_fisrt_sec_order_id));
                    $details_payment_type='installment_fees';
                    $user_id=$booking_data->admission_inst_id; 
                    $stu_id=$booking_data->admission_stu_id;
                    $admission_id=$booking_data->admission_id;
                    $session_id=$booking_data->admission_sess_id;
                    $course_id=$booking_data->admission_course_id;
                    $session_year=$_order_id[1];
                    $txn_amount=$param['payment_amount'];
                    $booking_id=$booking_data->admission_id;
                    $booking_inst_id=$booking_data->admission_inst_id;
                    $booking_inst_parent_id=$booking_data->admission_inst_parent_id; 
                }else if($utype=='agt'){
                    $booking_data=$this->fm->_get_agent_payment(array('booking_code'=>$param['order_id']));
                    $admission_data=$this->adm->get_admission_data(array('admission_id'=>$booking_data->booking_id));
                    $details_payment_type='admission_agent_fees';
                    $user_id=$booking_data->inst_id;
                    $agent_id=$booking_data->agent_id;
                    $session_id=$booking_data->session_id;
                    $course_id=$booking_data->course_id;
                    $subject_id=$booking_data->subject_id;
                    $stu_id=$booking_data->stu_id;
                    $txn_amount=$booking_data->amount_value;
                    $booking_id=$booking_data->booking_id;
                    $booking_inst_id=$booking_data->inst_id;
                    $booking_inst_parent_id=$booking_data->inst_parent_id;
                    $details_payment_id=$booking_data->payment_id;
                    $details_stu_id=null;
                    $details_agent_id=$booking_data->agent_id;
                    $details_order_code=$admission_data->admission_code;


                }
                
                    
                if($utype=='stu'){
                    $redirect_url=$this->data['base_url'].'/account/installments';
                }else if($utype=='stuinst'){
                    $redirect_url=$this->data['base_url'].'/admission/payments/'.encode_data($booking_id).'?p='.$param['order_id']; 
                }else if($utype=='agt'){
                    $redirect_url=$this->data['base_url'].'/payments/agents/'.encode_data($agent_id);
                }

                //print_obj($redirect_url);die;
            }else if($order_prefix=='ORDHT'){
                $order__id=$_order_id[4];
                $utype=(isset($_order_id[5]))?$_order_id[5]:'';

                if($utype=='admfee'){
                    $hostel_admission_fees=$this->hm->__get_hostel_admission_fees_assign_data(array('assign_unique_payid'=>$order__id));

                    //print_obj($hostel_admission_fees);die;
                    $student_data=$this->um->get_user(array('user_id'=>$hostel_admission_fees->assign_stu_id),'student');

                    $student_name=$student_data->stu_first_name.' '.$student_data->stu_mid_name.' '.$student_data->stu_last_name;
                    $student_email=$student_data->stu_email;
                    $student_ph=$student_data->stu_ph_no;

                    $payment_amount=$hostel_admission_fees->admission_fees_value+$hostel_admission_fees->admission_caution_fees_value;

                    $txn_amount=$payment_amount;
                    $hostel_id=$hostel_admission_fees->assign_hostel_id;
                    $booking_type='hostel_fees_payment';
                    $user_id=$hostel_admission_fees->assign_stu_id;
                    $stu_id=$hostel_admission_fees->assign_stu_id;
                    $session_id=$hostel_admission_fees->assign_sess_id;
                    $course_id=$hostel_admission_fees->assign_course_id;
                    $booking_id=$hostel_admission_fees->assigned_id;
                    $booking_inst_id=$hostel_admission_fees->assign_hostel_inst_id;
                    $booking_inst_parent_id=$parent_inst_id;
                    $payment_description='Hostel Admission fees';
                    $redirect_url=$this->data['base_url'].'/account/hostels';
                }else if($utype=='stu'){
                    $hostel_fees_data=$this->fm->get_hostel_fees_payment(array('payment_unique_code'=>$order__id));

                    $date=date('Y-m-d');
                    $due_date=$hostel_fees_data->due_at;

                    if($date>$due_date){
                        $txn_amount=$hostel_fees_data->payment_value+$hostel_fees_data->payment_late_value;
                    }else{
                        $txn_amount=$hostel_fees_data->payment_value;
                    }

                    //print_obj($hostel_fees_data);
                    $hostel_id=$hostel_fees_data->payment_hostel_id;
                    $booking_type='hostel_fees_payment';
                    $user_id=$hostel_fees_data->payment_hostel_stu_id;
                    $stu_id=$hostel_fees_data->payment_hostel_stu_id;
                    $booking_due_date=$hostel_fees_data->due_at;
                    $session_id=$hostel_fees_data->payment_hostel_sess_id;
                    $course_id=$hostel_fees_data->payment_hostel_course_id;
                    $session_year=$_order_id[1];
                    $booking_id=$hostel_fees_data->payment_id;
                    $booking_inst_id=$hostel_fees_data->payment_hostel_inst_id;
                    $booking_inst_parent_id=$parent_inst_id;
                    $payment_description='Hostel rent fees of '.ucwords($hostel_fees_data->payment_month).'-'.$hostel_fees_data->payment_year;
                    $redirect_url=$this->data['base_url'].'/account/hostels';
                }else if($utype=='stuinst'){
                    echo 'hi';die;
                }
                
            }

            //echo $session_year;

            //echo $redirect_url;die;

            $course_data=$this->cm->get_course(array('course_id'=>$course_id));
            $session_data=$this->sessm->get_session(array('session_id'=>$session_id));

            ///print_obj($session_data);die;


            
            //echo $redirect_url;
            //print_obj($userdata);die;

            //print_obj($userdata);

            

            // print_obj($_SESSION);die;

            if($userdata->user_type=='institute'){
                $inst_id=$userdata->user_id;
                $student_data=$this->um->get_user(array('user_id'=>$stu_id),'student');
                $institute_data=$this->um->get_user(array('user_id'=>$inst_id),'institute');
                $institute_profile_name=$institute_data->user_profile_name;
                $institute_email=$institute_data->user_email;
                $institute_phone_no=$institute_data->user_contact_no;
            }else if($userdata->user_type=='institute_branch'){
                $inst_id=$userdata->user_id;

                $student_data=$this->um->get_user(array('user_id'=>$stu_id),'student');
                $institute_data=$this->um->get_user(array('user_id'=>$inst_id),'institute_branch');
                $institute_profile_name=$institute_data->branch_name;
                $institute_email=$institute_data->branch_email;
                $institute_phone_no=$institute_data->branch_contact_no;

            }else if($userdata->user_type=='agent'){
                $inst_id=$userdata->user_id;
            }else if($userdata->user_type=='student'){
                $student_data=$this->um->get_user(array('user_id'=>$userdata->user_id),'student');
                $inst_id=$student_data->stu_inst_id;
                $institute_data=$this->um->get_user(array('user_id'=>$inst_id),'institute');
                $institute_profile_name=$institute_data->user_profile_name;
                $institute_email=$institute_data->user_email;
                $institute_phone_no=$institute_data->user_contact_no;
            }else{
                $inst_id='';
            }


            $_payment_settings=$this->sm->get_system_settings(array('settings_inst_id'=>$inst_id));

            if($order_prefix=='SB'){

                if($_order_id[1]=='agt'){
                    $this->fm->update_agent_payment(array('amount_paid'=>'yes','booking_pay_mode'=>'online','amount_paid_at'=>date('Y-m-d H:i:s'),'amount_paid_by'=>$param['user_id_to_login']),array('booking_code'=>$param['order_id'],'agent_id'=>$agent_id));

                    $details_payment_type='seatbooking_agent_fees';
                    $details_payment_id=$booking_data->payment_id;
                    $details_stu_id=$booking_data->stu_id;
                    $details_agent_id=$agent_id;
                    $details_accounting_type='expenditure';
                    $details_order_code=$param['order_id'];
                    $payment_details_param=array('details_order_code'=>$_fisrt_sec_order_id,'details_inst_id'=>$booking_inst_id,'details_agent_id'=>$agent_id,
                        'details_type_id'=>$booking_id,
                        'details_sess_id'=>$session_id,
                        'details_course_id'=>$course_id);
                }else{
                    $this->adm->update_seat_booking_payment_data(array('booking_payment_paid'=>'yes','booking_pay_mode'=>'online'),array('booking_pk_id'=>$booking_id));


                    //$this->adm->update_seat_booking_data(array('booking_converted'=>'yes','updated_at'=>date('Y-m-d'),'updated_by'=>$user_id),array('booking_code'=>$order__id));

                    // if($param['payment_platform']=='razorpay'){
                    //     $txn_id='T'.date('YmdHis').$inst_id.$user_id.$booking_id.$booking_data->booking_payment_id;
                    // }else if($param['payment_platform']=='paytm'){
                    //     $txn_id=$param['txn_id'];
                    // }

                    $details_payment_type='seatbooking_fees';
                    $details_payment_id=$booking_data->booking_payment_id;
                    $details_stu_id=$student_data->stu_user_id;
                    $details_agent_id=null;
                    $details_accounting_type='income';
                    $details_order_code=$_fisrt_sec_order_id;

                    $payment_details_param=array('details_order_code'=>$_fisrt_sec_order_id,'details_inst_id'=>$booking_inst_id,'details_stu_id'=>$student_data->stu_user_id,
                        'details_type_id'=>$booking_id,
                        'details_sess_id'=>$session_id,
                        'details_course_id'=>$course_id);
                }

                $payment_details=array(
                    'details_type'=>$booking_type,
                    'details_payment_type'=>$details_payment_type,
                    'details_payment_id'=>$details_payment_id,
                    'details_stu_id'=>$details_stu_id,
                    'details_agent_id'=>$details_agent_id,
                    'details_type_id'=>$booking_id,
                    'details_sess_id'=>$session_id,
                    'details_course_id'=>$course_id,
                    'details_subject_id'=>$subject_id,
                    'details_payment_platform'=>$param['payment_platform'],
                    'details_inst_id'=>$booking_inst_id,                                
                    'details_parent_inst_id'=>$booking_inst_parent_id,
                    'details_txn_id'=>$param['txn_id'],
                    'details_pay_id'=>(isset($param['pay_id']))?$param['pay_id']:null,
                    'details_pay_signature'=>(isset($param['pay_signature']))?$param['pay_signature']:null,
                    'details_pay_order_id'=>(isset($param['pay_order_id']))?$param['pay_order_id']:null,
                    'details_pay_currency'=>(isset($param['pay_currency']))?$param['pay_currency']:null,
                    'details_payee_email'=>(isset($param['pay_email']))?$param['pay_email']:null,
                    'details_payee_contact'=>(isset($param['pay_contact']))?$param['pay_contact']:null,
                    'details_gateway_created_at'=>(isset($param['pay_created_at']))?$param['pay_created_at']:null,
                    'details_gateway_status'=>(isset($param['pay_status']))?$param['pay_status']:null,
                    'details_order_id'=>$param['order_id'],
                    'details_order_code'=>$details_order_code,
                    'details_amount'=>$txn_amount,
                    'details_discount_amount'=>'0',
                    'details_created_by_type'=>($utype=='stu')?'student':'institute',
                    'details_accounting_type'=>$details_accounting_type,
                    'details_created_by'=>$user_id,
                    'details_gateway_status'=>$param['gateway_status'],
                    'details_msg'=>$param['msg'],
                    'details_status'=>'success',
                    'details_created_at'=>date('Y-m-d'),
                    'details_gateway_created_at'=>''
                );


                //print_obj($payment_details);die;

                $paymentdetails=$this->fm->_get_payment_details($payment_details_param);

                if(!empty($paymentdetails)){
                    $this->fm->update_payment_details($payment_details,array('details_id'=>$paymentdetails->details_id));
                }else{
                    $this->fm->store_payment_details($payment_details);
                }

               
               //mail Section

               $session_course_data=$this->sessm->get_session_courses(array('session_id'=>$session_id,'session_course_id'=>$course_id,'session_inst_id'=>$booking_inst_id));


                $mail_subject='Seat Booking Payment for booking no :'.$booking_data->booking_code;

                $mail_data['inst_id']=$booking_inst_id;
                $mail_data['mail_from']='webmaster';

                if(isset($student_data) && !empty($student_data)){

                    if(!empty($booking_data->stu_mid_name)){
                        $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_mid_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                    }else{
                        $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                    }


                    $mail_data['to_email']=$booking_data->stu_email;
                }

                if($userdata->user_type=='student'){
                    $mail_data['mail_from_name']=$institute_profile_name;

                    $mail_data['mail_subject']=$mail_subject;
                    
                    $profile_name=$institute_profile_name;
                    $college_email=$institute_email;
                    $college_phone=$institute_phone_no;
                    $link_logo=$this->data['link_logo'];
                }else{

                    //print_obj($institute_data);die;

                    $mail_data['mail_from_name']=$institute_data->user_profile_name;
                    $mail_data['mail_subject']=$mail_subject;
                    $profile_name=$institute_data->user_profile_name;
                    $college_email=$institute_data->user_email;
                    $college_phone=$institute_data->user_contact_no;
                    $link_logo=$this->data['link_logo'];

                    //print_obj($mail_data);die;
                }
                
                
                $mail_data['mail_type']='html';
                $mail_data['mail_custom_type']='html';
                $mail_data['mail_data']=array(
                    'stu_name'=>ucwords($student_name),
                    'stu_email'=>$student_data->stu_email,
                    'stu_ph'=>$student_data->stu_ph_no,
                    'booking_code'=>$booking_data->booking_code,
                    'course_fees'=>(!empty($session_course_data))?number_format($session_course_data->session_course_fees,2):'',
                    'booking_data'=>$booking_data,
                    'payment_details'=>$payment_details,
                    'session_data'=>$session_data->session_start_year.'-'.$session_data->session_end_year,
                    'portal_url'=>$this->data['base_url'],
                    'portal_logo'=>$link_logo,
                    'portal_inst_name'=>$profile_name,
                    'college_email'=>$college_email,
                    'college_phone'=>$college_phone,
                    'default_logo_small'=>$this->data['default_logo_small'],
                    'created_at'=>date('d-m-Y')
                );


                //print_obj($mail_data);die;

                
                $mail_data['mail_view']='_pages/mails/vw_seatbook_payment_mail';

                $this->onSendMail($mail_data);

                $mail_data_2=$mail_data;

                $mail_data_2['to_email']=$institute_email;
                $mail_data_2['mail_subject']=$mail_subject.' [Copy mail]';
                
                $this->onSendMail($mail_data_2);

                // unset($_SESSION['payment_gateway']);


                redirect($redirect_url);

            }else if($order_prefix=='ADM'){

                if($_order_id[1]=='agt'){

                    if($param['payment_platform']=='razorpay'){
                        $txn_id='T'.date('YmdHis').$inst_id.$user_id.$booking_id.$booking_data->admission_id;
                    }else if($param['payment_platform']=='paytm'){
                        $txn_id=$param['txn_id'];
                        $temp_payment_data=$this->fm->get_temp_payment(array('temp_checksum'=>$param['order_id']));
                    }

                    $this->fm->update_agent_payment(array('amount_paid'=>'yes','booking_pay_mode'=>'online','amount_paid_at'=>date('Y-m-d H:i:s'),'amount_paid_by'=>$user_id),array('booking_code'=>$param['order_id'],'agent_id'=>$agent_id));

                    $payment_details=array(
                        'details_type'=>$booking_type,
                        'details_payment_type'=>$details_payment_type,
                        'details_payment_id'=>$details_payment_id,
                        'details_stu_id'=>$details_stu_id,
                        'details_agent_id'=>$details_agent_id,
                        'details_type_id'=>$booking_id,
                        'details_sess_id'=>$session_id,
                        'details_course_id'=>$course_id,
                        'details_subject_id'=>$subject_id,
                        'details_payment_platform'=>$param['payment_platform'],
                        'details_inst_id'=>$booking_inst_id,                                
                        'details_parent_inst_id'=>$booking_inst_parent_id,
                        'details_txn_id'=>$param['txn_id'],
                        'details_pay_id'=>(isset($param['pay_id']))?$param['pay_id']:null,
                        'details_pay_signature'=>(isset($param['pay_signature']))?$param['pay_signature']:null,
                        'details_pay_order_id'=>(isset($param['pay_order_id']))?$param['pay_order_id']:null,
                        'details_pay_currency'=>(isset($param['pay_currency']))?$param['pay_currency']:null,
                        'details_payee_email'=>(isset($param['pay_email']))?$param['pay_email']:null,
                        'details_payee_contact'=>(isset($param['pay_contact']))?$param['pay_contact']:null,
                        'details_gateway_created_at'=>(isset($param['pay_created_at']))?$param['pay_created_at']:null,
                        'details_gateway_status'=>(isset($param['pay_status']))?$param['pay_status']:null,
                        'details_order_id'=>$param['order_id'],
                        'details_order_code'=>$details_order_code,
                        'details_amount'=>$txn_amount,
                        'details_discount_amount'=>'0',
                        'details_created_by_type'=>($utype=='stu')?'student':'institute',
                        'details_accounting_type'=>'expenditure',
                        'details_created_by'=>$user_id,
                        'details_gateway_status'=>$param['gateway_status'],
                        'details_msg'=>$param['msg'],
                        'details_status'=>'success',
                        'details_created_at'=>date('Y-m-d'),
                        'details_gateway_created_at'=>''
                    );


                    //print_obj($payment_details);die;

                    $paymentdetails=$this->fm->_get_payment_details(array('details_order_code'=>$details_order_code,'details_inst_id'=>$booking_inst_id,'details_agent_id'=>$agent_id,'details_type_id'=>$booking_id,'details_sess_id'=>$session_id,'details_course_id'=>$course_id));

                    if(!empty($paymentdetails)){
                         $this->fm->update_payment_details($payment_details,array('details_id'=>$paymentdetails->details_id));
                    }else{
                        $this->fm->store_payment_details($payment_details);
                    }


                    redirect($redirect_url);

                }else{
                    $this->adm->update_admission_data(array('updated_at'=>date('Y-m-d'),'updated_by'=>$user_id),array('admission_id'=>$booking_id));

                    if($param['payment_platform']=='razorpay'){
                        $txn_id='T'.date('YmdHis').$inst_id.$user_id.$booking_id.$booking_data->admission_id;
                    }else if($param['payment_platform']=='paytm'){
                        $txn_id=$param['txn_id'];
                        $temp_payment_data=$this->fm->get_temp_payment(array('temp_checksum'=>$param['order_id']));
                    }

                    $total_fees_value=0;

                    if(isset($_order_id[4])){
                        $installment_data=$this->fm->get_installment(array('installment_unique_code'=>$_order_id[4]));
                        $installment_id=$installment_data->installment_id;
                        $installment_no=$_order_id[2];
                        $details_order_code=$_fisrt_sec_order_id.$_order_id[4];
                        //echo $installment_id;die;
                    }else{
                        $installment_no=$_order_id[2];
                        $details_order_code=$_fisrt_sec_order_id.$_order_id[4];
                        $year_data=$this->sessm->get_session_year(array('year_value'=>$session_year,'year_session_id'=>$session_id,'year_session_inst_id'=>$booking_inst_id));

                        $fees_types=$this->fm->__get_fees_type(array('fees_inst_id'=>$booking_inst_id,'fees_session_id'=>$session_id,'fees_course_id'=>$course_id,'fees_year_id'=>$year_data->year_id));

                        // print_obj($fees_types);die;

                        if(!empty($fees_types)){


                            foreach ($fees_types as $k => $v) {

                                $_get_fees_details=$this->fm->_get_fees_details(array('payment_stu_id'=>$stu_id,
                                    'payment_inst_id'=>$booking_inst_id,
                                    'payment_admission_id'=>$admission_id,
                                    'payment_sess_id'=>$session_id,
                                    'payment_course_id'=>$course_id,
                                    'payment_fees_type_id'=>$v->fees_type_id,
                                    'payment_fees_value'=>$v->fees_value,
                                    'payment_sess_year'=>$session_year));

                                if(empty($_get_fees_details)){
                                    $total_fees_value+=$v->fees_value;
                                    $fees_type_data=array(
                                        'payment_stu_id'=>$stu_id,
                                        'payment_inst_id'=>$booking_inst_id,
                                        'payment_admission_id'=>$admission_id,
                                        'payment_sess_id'=>$session_id,
                                        'payment_course_id'=>$course_id,
                                        'payment_fees_type_id'=>$v->fees_type_id,
                                        'payment_fees_value'=>$v->fees_value,
                                        'payment_sess_year'=>$session_year,
                                        'created_by'=>$user_id,
                                        'created_at'=>date('Y-m-d')
                                    );

                                    $this->fm->_store_fees_details($fees_type_data,TRUE);
                                }

                                    
                            }

                            //print_obj($fees_type_data);die;

                            
                        }

                        $get_installments=$this->fm->get_installments(array('installment_stu_id'=>$stu_id,
                            'installment_inst_id'=>$booking_inst_id,
                            'installment_no'=>$installment_no,
                            'installment_admission_id'=>$admission_id,
                            'installment_sess_id'=>$session_id,
                            'installment_sess_year'=>$session_year,
                            'installment_course_id'=>$course_id));

                        //print_obj($get_installments);die;

                        if(!empty($get_installments)){
                            $installment_id=$get_installments->installment_id;
                        }else{
                            $installment_data_to_add=array(
                                'installment_stu_id'=>$stu_id,
                                'installment_inst_id'=>$booking_inst_id,
                                'installment_admission_id'=>$admission_id,
                                'installment_sess_id'=>$session_id,
                                'installment_sess_year'=>$session_year,
                                'installment_course_id'=>$course_id,
                                'installment_value'=>$txn_amount,
                                'installment_date'=>date('Y-m-d'),
                                'created_by'=>$user_id,
                                'created_at'=>date('Y-m-d')
                            );

                            $installment_id=$this->fm->store_installments($installment_data_to_add);
                        }
                        
                    }

                    //echo $installment_id;  

                    if($installment_id){

                        $installment_data=$this->fm->get_installments(array('installment_id'=>$installment_id),TRUE);

                        //print_obj($installment_data);die;

                        $_get_fees_details_last=$this->fm->_get_fees_details_last(array('payment_stu_id'=>$installment_data->installment_stu_id,'payment_inst_id'=>$installment_data->installment_inst_id,'payment_installment_id'=>$installment_data->installment_id));

                        //$balance=$this->fm->get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id));

                        if(!empty($_get_fees_details_last)){
                             // $balance_last_data=$this->fm->get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id,'inst_payment_id'=>$_get_fees_details_last->payment_fees_details_id));

                            $balance_last_data=$this->fm->_get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id,'inst_payment_id'=>$_get_fees_details_last->payment_fees_details_id));
                        }else{
                             // $balance_last_data=$this->fm->get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id));

                            $balance_last_data=$this->fm->_get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id));
                        }

                        //print_obj($balance_last_data);die;



                        //$balance_last_data=$this->fm->_get_installments_balance_last(array('inst_installment_id'=>$installment_data->installment_id,'inst_stu_id'=>$installment_data->installment_stu_id,'inst_session_id'=>$installment_data->installment_sess_id),TRUE);

                       // print_obj($balance_last_data);die;

                        $date_now = date('Y-m-d');// new DateTime();
                        $installment_date    = date('Y-m-d',strtotime($installment_data->installment_date));//new DateTime($installment_data->installment_date);

                        // print_obj($date_now);
                        // echo '<br>';
                        // print_obj($installment_date);

                        // if($date_now>$installment_date){
                        //     echo 'Date now is greater';
                        // }else if($date_now==$installment_date){
                        //     echo 'date now is equal';
                        // }else{
                        //     echo 'Date now is smaller';
                        // }

                        // die;

                        if(!empty($balance_last_data) && $balance_last_data->inst_payment_balance>0){
                            if($date_now>$installment_date){
                                $penalty_applied=TRUE;  
                            }else if($date_now==$installment_date){
                                $penalty_applied=FALSE;
                            }else{
                                $penalty_applied=FALSE;
                            } 
                            //echo '1';
                            $balance=$balance_last_data->inst_payment_balance-$txn_amount;
                        }else{
                            if($date_now>$installment_date){
                                $penalty_applied=TRUE;
                                $total_due=$installment_data->installment_value+$installment_data->installment_value_penalty;  
                            }else if($date_now==$installment_date){
                                $penalty_applied=FALSE;
                                $total_due=$installment_data->installment_value;
                            }else{
                                $penalty_applied=FALSE;
                                $total_due=$installment_data->installment_value;
                            }                                    

                            if(!empty($_get_fees_details_last)){
                                if(isset($_get_fees_details_last->inst_payment_balance) && $_get_fees_details_last->inst_payment_balance>0){
                                    //echo '2';
                                    $balance=$_get_fees_details_last->inst_payment_balance-$txn_amount;
                                }else{
                                    //echo '3';
                                    $balance=$total_due-$txn_amount;
                                }                                        
                            }else{
                                //echo '4';
                                $balance=$total_due-$txn_amount;
                            }                                    
                        }

                        //echo $balance;die;
                        

                        $pay_data_to_add=array(
                            'payment_stu_id'=>$stu_id,
                            'payment_inst_id'=>$booking_inst_id,
                            'payment_session_id'=>$session_id,
                            'payment_session_year'=>$session_year,
                            'payment_admission_id'=>$admission_id,
                            'payment_course_id'=>$course_id,
                            'payment_installment_id'=>$installment_id,
                            'payment_fees_total'=>$total_fees_value,
                            'payment_fees_scholarship_discount'=>(!empty($temp_payment_data))?$temp_payment_data->temp_scholarship_discount:'0',
                            'payment_fees_scholarship_discount_reason'=>(!empty($temp_payment_data))?$temp_payment_data->temp_scholarship_discount_reason:null,
                            'payment_fees_special_discount'=>(!empty($temp_payment_data))?$temp_payment_data->temp_special_discount:'0',
                            'payment_fees_special_discount_reason'=>(!empty($temp_payment_data))?$temp_payment_data->temp_special_discount_reason:null,
                            'payment_fees_total_discount'=>(!empty($temp_payment_data))?$temp_payment_data->temp_payment_total_discount:'0',
                            'payment_fees_grand_total'=>$total_fees_value,
                            'payment_fees_admission_amount'=>$txn_amount,
                            'payment_fees_balance_amount'=>$balance,
                            'payment_late_fee_applied'=>($penalty_applied==TRUE)?'yes':'no',
                            'payment_late_fee'=>$installment_data->installment_value_penalty,
                            'pay_mode'=>'online',
                            'pay_bank_cheque_no'=>null,
                            'pay_bank_name'=>null,
                            'pay_deposit_bank'=>null,
                            'created_by'=>$user_id,
                            'created_at'=>date('Y-m-d')
                        );

                        //print_obj($pay_data_to_add);die;

                        $payment_id=$this->fm->store_fees_details($pay_data_to_add);

                        if($payment_id){

                            if($balance>0){

                                $balance_data=array(
                                    'inst_id'=>$booking_inst_id,
                                    'inst_parent_id'=>$booking_inst_parent_id,
                                    'inst_stu_id'=>$stu_id,
                                    'inst_session_id'=>$session_id,
                                    'inst_course_id'=>$course_id,
                                    'inst_subject_id'=>$installment_data->installment_subject_id,
                                    'inst_year'=>$session_year,
                                    'inst_installment_id'=>$installment_id,
                                    'inst_payment_id'=>$payment_id,
                                    'inst_payment_total'=>$txn_amount,
                                    'inst_payment_balance'=>$balance,
                                    'created_at'=>date('Y-m-d'),
                                    'created_by'=>$user_id
                                );

                                $this->fm->store_installments_balance($balance_data);
                            }else if($balance==0){

                                //print_obj($balance_last_data);die;

                                if(!empty($balance_last_data)){
                                    $this->fm->update_installments_balance(array('inst_balance_paid'=>'yes'),array('balance_id'=>$balance_last_data->balance_id));
                                        $balance_data=array(
                                            'inst_id'=>$booking_inst_id,
                                            'inst_parent_id'=>$booking_inst_parent_id,
                                            'inst_stu_id'=>$stu_id,
                                            'inst_session_id'=>$session_id,
                                            'inst_course_id'=>$course_id,
                                            'inst_subject_id'=>$installment_data->installment_subject_id,
                                            'inst_year'=>$session_year,
                                            'inst_installment_id'=>$installment_id,
                                            'inst_payment_id'=>$payment_id,
                                            'inst_payment_total'=>$txn_amount,
                                            'inst_payment_balance'=>$balance,
                                            'inst_balance_paid'=>'yes',
                                            'created_at'=>date('Y-m-d'),
                                            'created_by'=>$user_id
                                        );

                                        $this->fm->store_installments_balance($balance_data);

                                        $this->fm->update_installments_balance(array('inst_balance_paid'=>'yes'),array('inst_id'=>$booking_inst_id,
                                            'inst_parent_id'=>$booking_inst_parent_id,
                                            'inst_stu_id'=>$stu_id,
                                            'inst_session_id'=>$session_id,
                                            'inst_course_id'=>$course_id,
                                            'inst_subject_id'=>$installment_data->installment_subject_id,
                                            'inst_year'=>$session_year,
                                            'inst_installment_id'=>$installment_id));
                                }


                                $this->fm->update_installments(array('installment_paid_full'=>'yes'),array('installment_id'=>$installment_id));
                            }


                            if(isset($order_id_exp[6]) && $order_id_exp[6]=='bal'){
                                $details_payment_type='installment_balance_fees';
                            }else{
                                $details_payment_type='installment_fees';
                            }
                                                                

                            $payment_details=array(
                                'details_type_text'=>'Admission ['.$booking_data->admission_code.'] Payment Details',
                                'details_order_code'=>$_fisrt_sec_order_id,
                                'details_payment_platform'=>$param['payment_platform'],
                                'details_type'=>$booking_type,
                                'details_payment_type'=>$details_payment_type,
                                'details_type_id'=>$booking_id,
                                'details_payment_id'=>$payment_id,
                                'details_inst_id'=>$booking_inst_id,
                                'details_parent_inst_id'=>$booking_inst_parent_id,
                                'details_stu_id'=>$student_data->stu_user_id,
                                'details_sess_id'=>$session_id,
                                'details_course_id'=>$course_id,
                                'details_sess_year'=>$session_year,
                                'details_installment_id'=>$installment_id,
                                'details_txn_id'=>$txn_id,
                                'details_order_id'=>$param['order_id'],
                                'details_order_code'=>$details_order_code,
                                'details_pay_id'=>(isset($param['pay_id']))?$param['pay_id']:null,
                                'details_amount'=>$txn_amount,
                                'details_discount_amount'=>(!empty($temp_payment_data))?$temp_payment_data->temp_payment_total_discount:'0',
                                'details_prev_total_amount'=>0,
                                'details_accounting_type'=>'income',
                                'details_created_by_type'=>$userdata->user_type,
                                'details_created_by'=>$user_id,
                                'details_status'=>'success',
                                'details_msg'=>$param['msg'],
                                'details_created_at'=>date('Y-m-d')
                            );

                            //print_obj($payment_details);die;

                            // $paymentdetails=$this->fm->_get_payment_details(array('details_order_code'=>$_fisrt_sec_order_id,'details_inst_id'=>$booking_inst_id,'details_stu_id'=>$user_id,
                            //     'details_type_id'=>$booking_id,
                            //     'details_sess_id'=>$session_id,
                            //     'details_course_id'=>$course_id));

                            // if(!empty($paymentdetails)){
                            //     $this->fm->update_payment_details($payment_details,array('details_id'=>$paymentdetails->details_id));
                            //     $payment_details_id=$paymentdetails->details_id;
                            // }else{
                            //     $payment_details_id=$this->fm->store_payment_details($payment_details);
                            // }

                            $payment_details_id=$this->fm->store_payment_details($payment_details);

                            $prev_payment_data=$this->fm->get_payment_details(array('details_stu_id'=>$stu_id,'details_sess_id'=>$session_id,'details_course_id'=>$course_id,'details_sess_year'=>$session_year,'details_installment_id'=>$installment_id),FALSE);

                            //print_obj($prev_payment_data);die;

                            if(!empty($prev_payment_data) && count($prev_payment_data)>1){
                                $prev_total=$this->fm->_get_payments_total(array('details_stu_id'=>$stu_id,'details_sess_id'=>$session_id,'details_course_id'=>$course_id,'details_sess_year'=>$session_year,'details_installment_id'=>$installment_id,'details_id!='=>$payment_details_id));
                                $_prev_total=(!empty($prev_total) && isset($prev_total[0]->total))?$prev_total[0]->total:0;
                                $details_prev_total_amount=$_prev_total;//+$txn_amount;
                            }else{
                                $details_prev_total_amount=0;
                            }

                            $this->fm->update_payment_details(array('details_prev_total_amount'=>$details_prev_total_amount),array('details_id'=>$payment_details_id));

                            $this->fm->delete_temp_payment(array('temp_checksum'=>$param['order_id']));


                            $payment_details=$this->fm->get_payment_details(array('details_id'=>$payment_details_id));

                            //print_obj($payment_details);die;

                            if(!empty($payment_details)){
                                $payment_data=$this->fm->get_fees_details(array('payment_fees_details_id'=>$payment_id));


                                //print_obj($this->data);die;

                                $mail_data['inst_id']=$booking_inst_id;
                                $mail_data['mail_from']='webmaster';

                                if(isset($student_data) && !empty($student_data)){

                                    if(!empty($student_data->stu_mid_name)){
                                        $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_mid_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                                    }else{
                                        $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                                    }


                                    $mail_data['to_email']=$student_data->stu_email;
                                }

                                if($userdata->user_type=='student'){
                                    $mail_data['mail_from_name']=$institute_profile_name;

                                    if($payment_details->details_payment_type=='installment_balance_fees'){
                                        $mail_data['mail_subject']='Admission ['.$booking_data->admission_code.'] Balance Payment Details';
                                    }else{
                                        $mail_data['mail_subject']='Admission ['.$booking_data->admission_code.'] Payment Details';
                                    }


                                    
                                    $profile_name=$institute_profile_name;
                                    $college_email=$institute_email;
                                    $college_phone=$institute_phone_no;
                                    $link_logo=$this->data['link_logo'];
                                }else{
                                    $mail_data['mail_from_name']=$institute_profile_name;
                                    $mail_data['mail_subject']=ucwords($institute_profile_name).' Admission ['.$booking_data->admission_code.'] Details';
                                    $profile_name=$institute_profile_name;
                                    $college_email=$institute_email;
                                    $college_phone=$institute_phone_no;
                                    $link_logo=$this->data['link_logo'];
                                }


                                ///print_obj($session_data);die;
                                
                                
                                $mail_data['mail_type']='html';
                                $mail_data['mail_custom_type']='html';
                                $mail_data['mail_data']=array(
                                    'stu_name'=>ucwords($student_name),
                                    'stu_email'=>$student_data->stu_email,
                                    'stu_ph'=>$student_data->stu_ph_no,
                                    'booking_code'=>$booking_data->admission_code,
                                    'booking_session'=>$session_data->session_start_year.'-'.$session_data->session_end_year,
                                    'booking_course'=>$course_data->course_name,
                                    'booking_subject'=>(!empty($subject_data))?$subject_data->subject_name:'N/A',
                                    'booking_amount'=>'0',
                                    'installment_data'=>$installment_data,
                                    'payment_data'=>$payment_data,
                                    'payment_details'=>$payment_details,
                                    'portal_url'=>$this->data['base_url'],
                                    'portal_logo'=>$link_logo,
                                    'portal_inst_name'=>$profile_name,
                                    'college_email'=>$college_email,
                                    'college_phone'=>$college_phone,
                                    'default_logo_small'=>$this->data['default_logo_small'],
                                    'created_at'=>date('d-m-Y')
                                );

                                
                                $mail_data['mail_view']='_pages/mails/vw_admission_installments_payment_mail';

                                $this->onSendMail($mail_data);

                                $mail_data_2=$mail_data;

                                $mail_data_2['to_email']=$institute_email;
                                if($payment_details->details_payment_type=='installment_balance_fees'){
                                    $mail_data_2['mail_subject']='Admission ['.$booking_data->admission_code.'] Balance Payment Details [Copy mail]';
                                }else{
                                    $mail_data_2['mail_subject']='Admission ['.$booking_data->admission_code.'] Payment Details [Copy mail]';
                                }
                                
                                $this->onSendMail($mail_data_2); 

                                //unset($_SESSION['payment_gateway']);


                                // $session_data=array(
                                //     'isAdminLoggedin'=>true,
                                //     'admin_id'=>encode_data($user_id),
                                //     'admin_type'=>$userdata->user_type,
                                //     'txn_id'=>$txn_id,
                                //     'loggedin_time'=>time()
                                // );

                                // //print_obj($session_data);

                                // //echo $redirect_url;

                                // //die;

                                // session_set_userdata($session_data);



                                //echo $redirect_url;die;

                                redirect($redirect_url);
                            }else{
                                redirect($redirect_url);
                            }
                        }else{
                            echo 'error 1';
                        }
                    }else{
                        redirect($redirect_url);
                    }
                }


                   
            }else if($order_prefix=='ORDHT'){
                if($utype=='stu'){
                    $order_code=$_fisrt_sec_order_id.$order__id;

                    if($param['payment_platform']=='razorpay'){
                        $txn_id='T'.date('YmdHis').$inst_id.$user_id.$booking_id.$hostel_id;
                    }else if($param['payment_platform']=='paytm'){
                        $txn_id=$param['txn_id'];
                    }

                    //echo $order_code;die;
                    $date_now = date('Y-m-d');// new DateTime();
                    $due_date = date('Y-m-d',strtotime($booking_due_date));//new DateTime($booking_due_date);

                    if($date_now>$due_date){
                        $penalty_applied='applied';  
                    }else if($date_now==$due_date){
                        $penalty_applied='not applied';
                    }else{
                        $penalty_applied='not applied';
                    }

                    //echo $order_code;die;
            

                   $updated=$this->fm->update_hostel_fees_payment(array('recieved_at'=>date('Y-m-d'),'payment_status'=>'paid','payment_penalty'=>$penalty_applied),array('payment_id'=>$booking_id));

                    $payment_details=array(
                        'details_type_text'=>$payment_description,
                        'details_payment_platform'=>$param['payment_platform'],
                        'details_type'=>$booking_type,
                        'details_payment_type'=>'hostel_fees',
                        'details_payment_id'=>$booking_id,
                        'details_type_id'=>$hostel_id,
                        'details_inst_id'=>$booking_inst_id,
                        'details_parent_inst_id'=>$booking_inst_parent_id,
                        'details_stu_id'=>$student_data->stu_user_id,
                        'details_sess_id'=>$session_id,
                        'details_course_id'=>$course_id,
                        'details_sess_year'=>$session_year,
                        'details_installment_id'=>$booking_id,
                        'details_txn_id'=>$txn_id,
                        'details_pay_id'=>(isset($param['pay_id']))?$param['pay_id']:null,
                        'details_order_id'=>$param['order_id'],
                        'details_order_code'=>$order_code,                                 
                        'details_amount'=>$txn_amount,
                        'details_discount_amount'=>'0',
                        'details_accounting_type'=>'income',
                        'details_msg'=>$param['msg'],
                        'details_status'=>'success',
                        'details_created_by_type'=>$userdata->user_type,
                        'details_created_by'=>$user_id,
                        'details_created_at'=>date('Y-m-d')
                    );


                    //print_obj($payment_details);die;

                    $payment_id=$this->fm->store_payment_details($payment_details);

                    if($payment_id){
                        $hostel_data=$this->hm->get_hostel(array('hostel_inst_id'=>$booking_inst_id,'hostel_id'=>$hostel_id));

                        //print_obj($hostel_data);die;

                        $hostel_payment_details=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_txn_id'=>$txn_id));

                        //print_obj($hostel_payment_details);die;

                        if($utype=='stu'){
                            $get_hostel_fees_payment=$this->fm->get_hostel_fees_payment(array('payment_hostel_id'=>$hostel_id,'payment_hostel_inst_id'=>$booking_inst_id,'payment_hostel_sess_id'=>$session_id,'payment_hostel_stu_id'=>$user_id,'payment_year'=>$session_year,'payment_id'=>$booking_id));
                        }else if($utype=='stuinst'){
                            $get_hostel_fees_payment=$this->fm->get_hostel_fees_payment(array('payment_hostel_id'=>$hostel_id,'payment_hostel_inst_id'=>$booking_inst_id,'payment_hostel_sess_id'=>$session_id,'payment_hostel_stu_id'=>$hostel_fees_data->payment_hostel_stu_id,'payment_year'=>$session_year,'payment_id'=>$booking_id));
                        }

                        $session_data=$this->sessm->get_session(array('session_id'=>$session_id));

                        $mail_subject='Hostel Rent Payment Details for '.ucwords($get_hostel_fees_payment->payment_month).'-'.$get_hostel_fees_payment->payment_year;

                        $mail_data['inst_id']=$booking_inst_id;
                        $mail_data['mail_from']='webmaster';

                        if(isset($student_data) && !empty($student_data)){

                            if(!empty($student_data->stu_mid_name)){
                                $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_mid_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                            }else{
                                $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                            }


                            $mail_data['to_email']=$student_data->stu_email;
                        }

                        if($userdata->user_type=='student'){
                            $mail_data['mail_from_name']=$institute_profile_name;

                            $mail_data['mail_subject']=$mail_subject;
                            
                            $profile_name=$institute_profile_name;
                            $college_email=$institute_email;
                            $college_phone=$institute_phone_no;
                            $link_logo=$this->data['link_logo'];
                        }else{

                            //print_obj($institute_data);die;

                            $mail_data['mail_from_name']=$institute_data->user_profile_name;
                            $mail_data['mail_subject']=$mail_subject;
                            $profile_name=$institute_data->user_profile_name;
                            $college_email=$institute_data->user_email;
                            $college_phone=$institute_data->user_contact_no;
                            $link_logo=$this->data['link_logo'];

                            //print_obj($mail_data);die;
                        }
                        
                        
                        $mail_data['mail_type']='html';
                        $mail_data['mail_custom_type']='html';
                        $mail_data['mail_data']=array(
                            'stu_name'=>ucwords($student_name),
                            'stu_email'=>$student_data->stu_email,
                            'stu_ph'=>$student_data->stu_ph_no,
                            'payment_details'=>$get_hostel_fees_payment,
                            'hostel_data'=>$hostel_data,
                            'hostel_payment_details'=>$hostel_payment_details,
                            'session_data'=>$session_data,
                            'portal_url'=>$this->data['base_url'],
                            'portal_logo'=>$link_logo,
                            'portal_inst_name'=>$profile_name,
                            'college_email'=>$college_email,
                            'college_phone'=>$college_phone,
                            'default_logo_small'=>$this->data['default_logo_small'],
                            'created_at'=>date('d-m-Y')
                        );

                        
                        $mail_data['mail_view']='_pages/mails/vw_hostel_fees_payment_mail';

                        $this->onSendMail($mail_data);

                        $mail_data_2=$mail_data;

                        $mail_data_2['to_email']=$institute_email;
                        $mail_data_2['mail_subject']=$mail_subject.' [Copy mail]';
                        
                        $this->onSendMail($mail_data_2);

                        unset($_SESSION['payment_gateway']);

                        redirect($redirect_url);
                    }
                }else if($utype=='admfee'){

                    $order_code=$_fisrt_sec_order_id.$order__id;

                    if($param['payment_platform']=='razorpay'){
                        $txn_id='T'.date('YmdHis').$inst_id.$user_id.$booking_id.$hostel_id;
                    }else if($param['payment_platform']=='paytm'){
                        $txn_id=$param['txn_id'];
                        $temp_payment_data=$this->fm->get_temp_payment(array('temp_checksum'=>$param['order_id']));
                    }

                    //echo $order_code;
                    $this->hm->update_hostel_admission_fees_assign_data(array('assign_fees_paid'=>'yes','assign_fees_paid_date'=>date('Y-m-d H:i:s')),array('assigned_id'=>$booking_id));

                    $hpd=$this->hm->__get_hostel_admission_fees_assign_data(array('assigned_id'=>$booking_id));

                    $session_years=$session_data->session_start_year.'-'.$session_data->session_end_year;                                

                    //print_obj($hostel_payment_details);die;

                    $payment_details=array(
                        'details_payment_id'=>$hpd->assigned_id,
                        'details_payment_platform'=>$param['payment_platform'],
                        'details_type'=>$booking_type,
                        'details_payment_type'=>'hostel_admission_fees_payment',
                        'details_type_id'=>$hostel_id,
                        'details_inst_id'=>$booking_inst_id,
                        'details_parent_inst_id'=>$booking_inst_parent_id,
                        'details_sess_id'=>$session_id,
                        'details_course_id'=>$course_id,
                        'details_stu_id'=>$student_data->stu_user_id,
                        'details_sess_year'=>'0',
                        'details_installment_id'=>$booking_id,
                        'details_txn_id'=>$txn_id,
                        'details_pay_id'=>(isset($param['pay_id']))?$param['pay_id']:null,
                        'details_order_id'=>$param['order_id'],
                        'details_order_code'=>$order_code,
                        'details_pay_signature'=>(isset($param['pay_signature']))?$param['pay_signature']:null,
                        'details_type_text'=>'Hostel Admission ['.$session_years.'] Payment Details',
                        'details_pay_order_id'=>(isset($param['pay_order_id']))?$param['pay_order_id']:null,
                        'details_pay_currency'=>(isset($param['pay_currency']))?$param['pay_currency']:null,
                        'details_payee_email'=>(isset($param['pay_email']))?$param['pay_email']:null,
                        'details_payee_contact'=>(isset($param['pay_contact']))?$param['pay_contact']:null,
                        'details_gateway_created_at'=>(isset($param['pay_created_at']))?$param['pay_created_at']:null,
                        'details_gateway_status'=>(isset($param['pay_status']))?$param['pay_status']:null,
                        'details_amount'=>$txn_amount,
                        'details_created_by_type'=>($utype=='stu')?'student':'institute',
                        'details_discount_amount'=>'0',
                        'details_accounting_type'=>'income',
                        'details_msg'=>$param['msg'],
                        'details_status'=>'success',
                        'details_created_by_type'=>$userdata->user_type,
                        'details_created_by'=>$user_id,
                        'details_created_at'=>date('Y-m-d H:i:s')
                    );

                   //print_obj($payment_details);die;

                    $payment_id=$this->fm->store_payment_details($payment_details);

                    if($payment_id){
                        $session_data=$this->sessm->get_session(array('session_id'=>$session_id));

                        $_hpd=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_payment_type'=>'hostel_admission_fees_payment','details_txn_id'=>$txn_id));

                        $hostel_payment_details=array(
                            'hostel_name'=>$hpd->hostel_name,
                            'session_years'=>$session_years,
                            'admission_fee'=>number_format($hpd->admission_fees_value,2),
                            'caution_fee'=>number_format($hpd->admission_caution_fees_value,2),
                            'total_fee'=>number_format(($hpd->admission_fees_value+$hpd->admission_caution_fees_value),2),
                            'payment_mode'=>ucwords($_hpd->details_payment_platform),
                            'taxation_no'=>$_hpd->details_txn_id,
                            'payment_date'=>date('d-m-Y')
                        );

                        $session_years=$session_data->session_start_year.'-'.$session_data->session_end_year;

                        $mail_subject='Hostel Admission Payment Details [Session : '.$session_years.']';

                        $mail_data['inst_id']=$booking_inst_id;
                        $mail_data['mail_from']='webmaster';

                        if(isset($student_data) && !empty($student_data)){

                            if(!empty($student_data->stu_mid_name)){
                                $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_mid_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                            }else{
                                $student_name=ucwords(strtolower($student_data->stu_first_name)).' '.ucwords(strtolower($student_data->stu_last_name));
                            }


                            $mail_data['to_email']=$student_data->stu_email;
                        }

                        if($userdata->user_type=='student'){
                            $mail_data['mail_from_name']=$institute_profile_name;

                            $mail_data['mail_subject']=$mail_subject;
                            
                            $profile_name=$institute_profile_name;
                            $college_email=$institute_email;
                            $college_phone=$institute_phone_no;
                            $link_logo=$this->data['link_logo'];
                        }else{

                            //print_obj($institute_data);die;

                            $mail_data['mail_from_name']=$institute_data->user_profile_name;
                            $mail_data['mail_subject']=$mail_subject;
                            $profile_name=$institute_data->user_profile_name;
                            $college_email=$institute_data->user_email;
                            $college_phone=$institute_data->user_contact_no;
                            $link_logo=$this->data['link_logo'];

                            //print_obj($mail_data);die;
                        }
                        
                        
                        $mail_data['mail_type']='html';
                        $mail_data['mail_custom_type']='html';
                        $mail_data['mail_data']=array(
                            'stu_name'=>ucwords($student_name),
                            'stu_email'=>$student_data->stu_email,
                            'stu_ph'=>$student_data->stu_ph_no,
                            'hostel_payment_details'=>$hostel_payment_details,
                            'session_data'=>$session_data,
                            'portal_url'=>$this->data['base_url'],
                            'portal_logo'=>$link_logo,
                            'portal_inst_name'=>$profile_name,
                            'college_email'=>$college_email,
                            'college_phone'=>$college_phone,
                            'default_logo_small'=>$this->data['default_logo_small'],
                            'created_at'=>date('d-m-Y')
                        );


                        //print_obj($mail_data);die;

                        
                        $mail_data['mail_view']='_pages/mails/vw_hostel_admission_fees_payment_mail';

                        $this->onSendMail($mail_data);

                        $mail_data_2=$mail_data;

                        $mail_data_2['to_email']=$institute_email;
                        $mail_data_2['mail_subject']=$mail_subject.' [Copy mail]';
                        
                        $this->onSendMail($mail_data_2);

                        unset($_SESSION['payment_gateway']);

                        redirect($redirect_url);
                    }
                } 
            }
            else{
                echo 'error 00';
            }

        }else{
            return 'Order ID is missing';
        }

    }


    //Temp Payment 
    public function onTempPaymentStore(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $scholarship=post_data('payment_scholarship_amount');
                $special_amount=post_data('payment_special_amount');
                $scholarship_reason=post_data('payment_scholarship_reason');
                $special_reason=post_data('payment_special_reason');
                $checksum=post_data('checksum');

                //$total_discount=$scholarship+$special_amount;
                
                $data_to_add=array(
                    'temp_checksum'=>$checksum,
                    'temp_scholarship_discount'=>$scholarship,
                    'temp_special_discount'=>$special_amount,
                    'temp_scholarship_discount_reason'=>$scholarship_reason,
                    'temp_special_discount_reason'=>$special_reason
                );

                $this->fm->store_temp_payment($data_to_add);
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }



    //Bill Generation

    public function onGenerateBill(){
      if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $userdata=$this->data['userdata'];

                if($userdata->user_type=='student'){
                    $inst_id=$userdata->stu_inst_id;
                }else{
                    $inst_id=$userdata->user_id;
                }

                $institute_user_data=$this->um->get_user(array('user_id'=>$inst_id));

                //print_obj($institute_user_data);die;

                $bill_type=post_data('bill_type');
                $booking_id=post_data('booking_id');

                $booking_payment_details=array();

                if($institute_user_data->user_type==='institute'){
                    $college_data=$this->um->get_institute(array('user_pk_id'=>$inst_id));
                    $college_profile_name=$college_data->user_profile_name;
                    $college_website=$college_data->user_website;
                    $college_email=$college_data->user_email;
                    $college_contact_no=$college_data->user_contact_no;
                }else if($institute_user_data->user_type==='institute_branch'){
                    $college_data=$this->um->get_institute_branch(array('branch_user_id'=>$inst_id));
                    $college_profile_name=$college_data->branch_name;
                    $college_website=$college_data->branch_website;
                    $college_email=$college_data->branch_email;
                    $college_contact_no=$college_data->branch_contact_no;
                }else if($institute_user_data->user_type==='student'){
                    if($userdata->stu_inst_type=='stu_inst_type'){
                        $college_data=$this->um->get_institute_branch(array('branch_user_id'=>$inst_id));
                        $college_profile_name=$college_data->branch_name;
                        $college_website=$college_data->branch_website;
                        $college_email=$college_data->branch_email;
                        $college_contact_no=$college_data->branch_contact_no;
                    }else{
                       $college_data=$this->um->get_institute(array('user_pk_id'=>$inst_id));
                       $college_profile_name=$college_data->user_profile_name;
                       $college_website=$college_data->user_website;
                       $college_email=$college_data->user_email;
                       $college_contact_no=$college_data->user_contact_no;
                    }                    
                }                

                //print_obj($college_data);die;

                if(!empty($booking_id)){                    

                    $college_address='';

                    if($institute_user_data->user_type==='institute'){

                        if($college_data->user_address_1!=''){
                            $college_address.=$college_data->user_address_1;
                        }                        

                        if($college_data->user_address_2!=''){
                            $college_address.=$college_data->user_address_2;
                        }                        

                        if($college_data->user_city!=''){                        
                            $college_address.=','.$college_data->user_city;
                        }

                        if($college_data->user_state!=''){
                            $state_data=$this->sm->_get_states(array('state_id'=>$college_data->user_state));
                            $college_address.=','.$state_data->state_name;
                        }

                        if($college_data->user_pincode!=''){
                            $college_address.=','.$college_data->user_pincode;
                        }

                        $payment_college=$college_data->user_profile_name;

                        $payment_college_website=$college_data->user_website;
                        $payment_college_email=$college_data->user_email;
                        $payment_college_ph_no=$college_data->user_contact_no;

                        $college_img_data=$this->sm->get_file(array('storage_type'=>'college_logo','storage_type_id'=>$inst_id));

                        //print_obj($college_img_data);die;

                        if(!empty($college_img_data) && is_file(FCPATH.$college_img_data->media_disk_path)){
                            $college_logo=base_url($college_img_data->media_disk_path_relative);
                        }else{
                            $college_logo=$this->data['no_image'];
                        }
                        
                    }else if($institute_user_data->user_type==='institute_branch'){


                        if($college_data->branch_address!=''){
                            $college_address.=$college_data->branch_address;
                        }

                        if($college_data->branch_address_1!=''){
                            $college_address.=$college_data->branch_address_1;
                        }                        

                        if($college_data->branch_city!=''){
                            $college_address.=$college_data->branch_city;
                        }

                        if($college_data->branch_state!=''){
                            $state_data=$this->sm->_get_states(array('state_id'=>$college_data->branch_state));
                            $college_address.=','.$state_data->state_name;
                        }

                        if($college_data->branch_pincode!=''){
                            $college_address.=','.$college_data->branch_pincode;
                        }

                        $payment_college=$college_data->branch_name;

                        $payment_college_website=$college_data->branch_website;
                        $payment_college_email=$college_data->branch_email;
                        $payment_college_ph_no=$college_data->branch_contact_no;

                        $college_img_data=$this->sm->get_file(array('storage_type'=>'college_branch_logo','storage_type_id'=>$inst_id));

                        //print_obj($college_img_data);die;

                        if(!empty($college_img_data) && is_file(FCPATH.$college_img_data->media_disk_path)){
                            $college_logo=base_url($college_img_data->media_disk_path_relative);
                        }else{
                            $college_logo=$this->data['no_image'];
                        }                        
                    }

                    $booking_id=decode_data($booking_id);

                    $file_data=array();
                    $payment_cheque_data=array();

                    if($bill_type=='seat_booking'){

                        $invd=$this->fm->_get_seat_booking_payments_details(array('booking_id'=>$booking_id));

                        //print_obj($invd);die;

                        if(!empty($invd)){

                            $booking_name=$invd->stu_first_name.' '.$invd->stu_mid_name.' '.$invd->stu_last_name;

                            if($invd->details_type=='seat_booking'){
                                $seat_booking_data=$this->adm->get_seat_bookings_data(array('booking_payment_id'=>$invd->details_type_id,'booking_pk_id'=>$invd->details_type_id,'booking_stu_id'=>$invd->details_stu_id));

                                //print_obj($seat_booking_data);die;

                                $pay_mode=ucwords($seat_booking_data->booking_pay_mode);

                                if(!empty($seat_booking_data)){
                                    if($seat_booking_data->booking_pay_mode==='cheque'){
                                        $deposite_bank_data=$this->sm->get_banks(array('bank_id'=>$seat_booking_data->booking_payment_deposite_bank));
                                        if(!empty($seat_booking_data->booking_payment_checq_files_ids)){
                                            $cheque_files=$this->sm->get_file_in('storage_id',$seat_booking_data->booking_payment_checq_files_ids);
                                        }else {
                                            $cheque_files='';
                                        }
                                        

                                        if(!empty($cheque_files)){
                                            foreach ($cheque_files as $key => $value) {
                                                $file_data[]=base_url($value->media_disk_path_relative);
                                            }
                                        }

                                        $payment_cheque_data=array(
                                            'bank_name'=>$seat_booking_data->booking_payment_bank,
                                            'bank_cheque_no'=>$seat_booking_data->booking_payment_checq_no,
                                            'bank_deposite_to'=>ucwords($deposite_bank_data->bank_name).' ['.ucwords($deposite_bank_data->bank_branch).' Branch]',
                                            'bank_cheque_files'=>(isset($file_data))?$file_data:null
                                        );  
                                    }
                                }                                
                            }

                            $invoice_details=array(
                                'payment_code'=>$invd->booking_code,
                                'payment_stu_code'=>$invd->stu_user_code,
                                'payment_txn_code'=>$invd->details_txn_id,
                                'payment_name'=>ucwords($booking_name),
                                'payment_email'=>$invd->stu_email,
                                'payment_phone_no'=>$invd->stu_ph_no,
                                'payment_course'=>$invd->course_name,
                                'payment_subject'=>'N/A',
                                'payment_session'=>$invd->session_start_year.'-'.$invd->session_end_year,
                                'payment_amount'=>number_format($invd->details_amount,2),
                                'payment_platform'=>ucwords($invd->details_payment_platform),
                                'payment_mode'=>(isset($pay_mode))?$pay_mode:'',
                                'payment_date'=>date('d/m/Y',strtotime($invd->created_at)),
                                'payment_cheque_data'=>$payment_cheque_data,
                                'payment_college'=>$payment_college,
                                'payment_college_logo'=>$this->data['link_logo'],
                                'payment_college_address'=>$college_address,
                                'payment_college_website'=>$payment_college_website,
                                'payment_college_email'=>$payment_college_email,
                                'payment_college_ph_no'=>$payment_college_ph_no
                            );


                            //print_obj($invoice_details);die;


                            $this->data['invoice_data']=$invoice_details;

                            $return['html']=$this->theme->view('_pages/bills/vw_bill_seatbooking',$this->data,true);

                        }else{
                            $return['error']='Details not found';
                        }
                    }else if($bill_type=='new_admission'){

                        $invd=$this->fm->get_installment(array('installment_id'=>$booking_id));

                        //print_obj($invd);die;

                        if(!empty($invd)){

                            $admission_data=$this->adm->get_admission_data(array('admission_id'=>$invd->installment_admission_id));

                            $payment_details=$this->fm->get_payment_details(array('details_installment_id'=>$booking_id),FALSE);


                            if($invd->stu_mid_name!=''){
                                $booking_name=$invd->stu_first_name.' '.$invd->stu_mid_name.' '.$invd->stu_last_name;
                            }else if($invd->stu_id_name!=''){
                                $booking_name=$invd->stu_first_name.' '.$invd->stu_last_name;
                            }

                            $date_now = new DateTime();
                            $installment_date    = new DateTime($invd->installment_date);

      
                            if($date_now>$installment_date){
                                $penalty_applied=TRUE;
                                $total_due=$invd->installment_value+$invd->installment_value_penalty;  
                            }else if($date_now==$installment_date){
                                $penalty_applied=FALSE;
                                $total_due=$invd->installment_value;
                            }else{
                                $penalty_applied=FALSE;
                                $total_due=$invd->installment_value;
                            }
                            

                            if(!empty($payment_details)){
                                if(!empty($payment_details)){
                                    foreach ($payment_details as $key => $value) {

                                        $details_order_id=explode('_', $value->details_order_id);

                                        if($value->details_payment_type=='installment_fees'){
                                            $payment_type='Installment payment';
                                        }else if($value->details_payment_type=='installment_balance_fees'){
                                            $paynment_type='Balance Payment';
                                        }

                                        $booking_payment_details[]=array(
                                            'detaile_payment_type'=>$payment_type,
                                            'details_amount'=>number_format($value->details_amount,2)
                                        );
                                    }
                                    
                                }
                            }

                            $invoice_details=array(
                                'booking_code'=>$admission_data->admission_code,
                                'booking_name'=>ucwords($booking_name),
                                'booking_email'=>$invd->stu_email,
                                'booking_phone_no'=>$invd->stu_ph_no,
                                'booking_course'=>$invd->course_name,
                                'booking_session'=>$invd->session_start_year.'-'.$invd->session_end_year,                                
                                'booking_penalty_applied'=>$penalty_applied,
                                'booking_installment'=>number_format($invd->installment_value,2),                                
                                'booking_penalty'=>$invd->installment_value_penalty,
                                'booking_amount'=>number_format($total_due,2),
                                'booking_date'=>date('d/m/Y',strtotime($invd->created_at)),
                                'booking_college'=>$college_data->user_profile_name,
                                'booking_college_logo'=>$college_logo,
                                'bokking_college_address'=>$college_address,
                                'booking_college_website'=>$college_data->user_website,
                                'booking_college_email'=>$college_data->user_email,
                                'booking_college_ph_no'=>$college_data->user_contact_no,
                                'booking_payment_details'=>$booking_payment_details
                            );

                            $this->data['invoice_data']=$invoice_details;

                            //print_obj($invoice_details);die;


                            $return['html']=$this->theme->view('_pages/bills/vw_bill_admissionbooking',$this->data,true);

                        }else{
                            $return['error']='Details not found';
                        }
                        
                    }else if($bill_type=='hostel_fees_payment'){

                        //echo $booking_id;


                        $_payment_data=$this->fm->__get_hostel_fees_payment(array('payment_id'=>$booking_id));

                        //print_obj($_payment_data);die;

                        //$_payment_data=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_payment_type'=>'hostel_fees','details_id'=>$booking_id));

                        //print_obj($_payment_data);die;

                        if(!empty($_payment_data)){


                            // $date_now = new DateTime();
                            // $due_date = new DateTime($_payment_data->due_at);

                            // if($date_now>$due_date){
                            //     $penalty_applied='applied';  
                            // }else if($date_now==$due_date){
                            //     $penalty_applied='not applied';
                            // }else{
                            //     $penalty_applied='not applied';
                            // }


                            $payment_details=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_payment_type'=>'hostel_fees','details_payment_id'=>$_payment_data->payment_id,'details_type_id'=>$_payment_data->payment_hostel_id,'details_inst_id'=>$_payment_data->payment_hostel_inst_id));

                            //print_obj($payment_details);die;

                            // if($_payment_data->stu_mid_name!=''){
                            //     $booking_name=$_payment_data->stu_first_name.' '.$_payment_data->stu_mid_name.' '.$_payment_data->stu_last_name;
                            // }else if($_payment_data->stu_mid_name!=''){
                            //     $booking_name=$_payment_data->stu_first_name.' '.$_payment_data->stu_last_name;
                            // }

                            $booking_name=$_payment_data->stu_first_name.' '.$_payment_data->stu_mid_name.' '.$_payment_data->stu_last_name;

                            $ordeid=explode('_', $payment_details->details_order_id);

                            $payment_data=array(
                                'payment_code'=>$payment_details->details_order_code,
                                'payment_name'=>ucwords($booking_name),
                                'payment_email'=>$_payment_data->stu_email,
                                'payment_phone_no'=>$_payment_data->stu_ph_no,
                                'payment_course'=>$_payment_data->course_name,
                                'payment_session'=>$_payment_data->session_start_year.'-'.$_payment_data->session_end_year,
                                'payment_hostel_name'=>ucwords($_payment_data->hostel_name),
                                'payment_hostel_addresss'=>$_payment_data->hostel_address,
                                'payment_platform'=>ucwords($payment_details->details_payment_platform),
                                'payment_txn_code'=>$payment_details->details_txn_id,
                                'payment_fee'=>number_format($_payment_data->payment_value,2),
                                'payment_late_fee'=>number_format($_payment_data->payment_late_value,2),
                                'payment_month'=>ucwords($_payment_data->payment_month),
                                'payment_year'=>$_payment_data->payment_year,
                                'payment_month_year'=>strtoupper($_payment_data->payment_month).'-'.$_payment_data->payment_year,
                                'payment_amount'=>number_format($payment_details->details_amount,2),
                                'payment_late_fee_applied'=>$_payment_data->payment_penalty,
                                'payment_due_date'=>date('d-m-Y',strtotime($_payment_data->due_at)),
                                'payment_date'=>date('d-m-Y',strtotime($_payment_data->recieved_at)),
                                'payment_college'=>$college_data->user_profile_name,
                                'payment_college_logo'=>$college_logo,
                                'payment_college_address'=>$college_address,
                                'payment_college_website'=>$college_data->user_website,
                                'payment_college_email'=>$college_data->user_email,
                                'payment_college_ph_no'=>$college_data->user_contact_no
                            );

                            $this->data['invoice_data']=$payment_data;

                            //print_obj($this->data['invoice_data']);die;


                            $return['html']=$this->theme->view('_pages/bills/vw_bill_hostelfees',$this->data,true);


                        }else{
                            $return['error']='Payment data not found';
                        }

                    }else if($bill_type=='hostel_admission_fees_payment'){

                        //echo $booking_id;

                        $_payment_data=$this->fm->get_payment_details(array('details_type'=>'hostel_fees_payment','details_payment_type'=>'hostel_admission_fees_payment','details_id'=>$booking_id));

                        //print_obj($_payment_data);die;


                        $hpd=$this->hm->__get_hostel_admission_fees_assign_data(array('assigned_id'=>$_payment_data->details_installment_id));

                        //print_obj($hpd);die;

                        $booking_name=$hpd->stu_first_name.' '.$hpd->stu_mid_name.' '.$hpd->stu_last_name;

                        $admission_fees_value=$hpd->admission_fees_value;
                        $caution_fees_value=$hpd->admission_caution_fees_value;
                        $total_fees_value=$admission_fees_value+$caution_fees_value;

                        $payment_data=array(
                            'payment_code'=>$_payment_data->details_order_code,
                            'payment_name'=>ucwords($booking_name),
                            'payment_email'=>$hpd->stu_email,
                            'payment_stu_code'=>$hpd->stu_user_code,
                            'payment_phone_no'=>$hpd->stu_ph_no,
                            'payment_course'=>$hpd->course_name,
                            'payment_subject'=>(!empty($hpd->subject_name))?$hpd->subject_name:'N/A',
                            'payment_session'=>$hpd->session_start_year.'-'.$hpd->session_end_year,
                            'payment_platform'=>ucwords($_payment_data->details_payment_platform),
                            'payment_txn_code'=>$_payment_data->details_txn_id,
                            'payment_admission_fee'=>number_format($admission_fees_value,2),
                            'payment_caution_fee'=>number_format($caution_fees_value,2),
                            'payment_amount'=>number_format($total_fees_value,2),
                            'payment_date'=>date('d-m-Y',strtotime($_payment_data->details_created_at)),
                            'payment_hostel_name'=>$hpd->hostel_name,
                            'payment_college'=>$college_profile_name,
                            'payment_college_logo'=>$college_logo,
                            'payment_college_address'=>$college_address,
                            'payment_college_website'=>$college_website,
                            'payment_college_email'=>$college_email,
                            'payment_college_ph_no'=>$college_contact_no
                        );

                        $this->data['invoice_data']=$payment_data;

                        //print_obj($this->data['invoice_data']);die;


                        $return['html']=$this->theme->view('_pages/bills/vw_bill_hostel_admission_fees',$this->data,true);

                    }else if($bill_type=='installment_fees'){

                        $_payment_data=$this->fm->_get_payment_details(array('details_type'=>'new_admission','details_payment_type'=>'installment_fees','details_id'=>$booking_id),TRUE,FALSE);


                        //print_obj($_payment_data);die;

                        $invd=$this->fm->get_installment(array('installment_id'=>$_payment_data->details_installment_id));


                        $payment_data=$this->fm->get_fees_details(array('payment_fees_details_id'=>$_payment_data->details_payment_id));

                        //print_obj($payment_data);die;

                        $admission_data=$this->adm->get_admission_data(array('admission_id'=>$invd->installment_admission_id));

                        //print_obj($_payment_data);die;

                        $booking_name=$_payment_data->stu_first_name.' '.$_payment_data->stu_mid_name.' '.$_payment_data->stu_last_name;


                        if($payment_data->payment_late_fee_applied=='no'){
                            $amount_payable=$invd->installment_value;
                        }else if($payment_data->payment_late_fee_applied=='yes'){
                            $amount_payable=$invd->installment_value+$invd->installment_value_penalty;
                        } 

                        //if($_payment_data->details_payment_platform=='cheque'){
                            $payment_details_data=$this->fm->get_fees_details(array('payment_fees_details_id'=>$_payment_data->details_payment_id));
                        //}  

                         $payment_data=array(
                            'payment_admission_code'=>$admission_data->admission_code,
                            'payment_code'=>$_payment_data->details_order_code,
                            'payment_name'=>ucwords($booking_name),
                            'payment_email'=>$_payment_data->stu_email,
                            'payment_stu_code'=>$_payment_data->stu_user_code,
                            'payment_phone_no'=>$_payment_data->stu_ph_no,
                            'payment_course'=>$_payment_data->course_name,
                            'payment_subject'=>(!empty($_payment_data->subject_name))?$_payment_data->subject_name:'N/A',
                            'payment_session'=>$_payment_data->session_start_year.'-'.$_payment_data->session_end_year,
                            'payment_platform'=>ucwords($_payment_data->details_payment_platform),
                            'payment_mode'=>ucwords($payment_data->pay_mode),
                            'payment_txn_code'=>$_payment_data->details_txn_id,
                            'payment_late_fee_applied'=>$payment_data->payment_late_fee_applied,
                            'payment_late_fee'=>$payment_data->payment_late_fee,
                            'payment_balance_amount'=>(!empty($payment_data) && $payment_data->payment_fees_balance_amount>0)?number_format($payment_data->payment_fees_balance_amount,2):'',
                            'payment_amount'=>number_format($amount_payable,2),
                            'payment_amount_paid'=>number_format($_payment_data->details_amount,2),
                            'payment_details_data'=>(isset($payment_details_data) && !empty($payment_details_data))?$payment_details_data:'',
                            'payment_discount'=>($_payment_data->details_discount_amount>0)?number_format($_payment_data->details_discount_amount,2):'0',
                            'payment_installment_data'=>$invd,
                            'payment_date'=>date('d-m-Y',strtotime($_payment_data->details_created_at)),
                            'payment_college'=>$payment_college,
                            'payment_college_logo'=>$college_logo,
                            'payment_college_address'=>$college_address,
                            'payment_college_website'=>$payment_college_website,
                            'payment_college_email'=>$payment_college_email,
                            'payment_college_ph_no'=>$payment_college_ph_no
                        );

                        $this->data['invoice_data']=$payment_data;

                        //print_obj($this->data['invoice_data']);die;


                        $return['html']=$this->theme->view('_pages/bills/vw_bill_admission_installments',$this->data,true);
                    }else if($bill_type=='installment_balance_fees'){

                        $payment_details=$this->fm->get_payment_details(array('details_id'=>$booking_id));

                        $payment_data=$this->fm->get_fees_details(array('payment_fees_details_id'=>$payment_details->details_payment_id));

                        $_get_fees_details_last=$this->fm->_get_fees_details_last(array('payment_stu_id'=>$payment_details->details_stu_id,'payment_inst_id'=>$payment_details->details_inst_id,'payment_installment_id'=>$payment_details->details_installment_id));



                        $invd=$this->fm->get_installment(array('installment_id'=>$payment_details->details_installment_id));
                        $admission_data=$this->adm->get_admission_data(array('admission_id'=>$invd->installment_admission_id));

                        // //print_obj($admission_data);die;

                        $booking_name=$admission_data->stu_first_name.' '.$admission_data->stu_mid_name.' '.$admission_data->stu_last_name;

                        $prev_payment_data=$this->fm->_get_payment_details(array('details_type'=>'new_admission','details_installment_id'=>$payment_details->details_installment_id,'details_payment_id'=>$payment_details->details_payment_id),TRUE);


                        //$prev_payment_data=$this->fm->_get_payments_total(array('details_type'=>'new_admission','details_installment_id'=>$payment_details->details_installment_id,'details_payment_id!='=>$payment_details->details_payment_id));

                        $balance_last_data=$this->fm->_get_installments_balance_last(array('inst_installment_id'=>$payment_details->details_installment_id,'inst_stu_id'=>$admission_data->admission_stu_id,'inst_session_id'=>$admission_data->admission_sess_id));

                        $last_payment_data=$this->fm->get_payment_details_last(array('details_type'=>'new_admission','details_payment_type'=>'installment_balance_fees','details_stu_id'=>$admission_data->admission_stu_id,'details_parent_inst_id'=>$admission_data->admission_inst_id,'details_sess_id'=>$admission_data->admission_sess_id,'details_course_id'=>$admission_data->admission_course_id));

                        if($payment_data->payment_late_fee_applied=='no'){
                            $amount_payable=$invd->installment_value;
                        }else if($payment_data->payment_late_fee_applied=='yes'){
                            $amount_payable=$invd->installment_value+$invd->installment_value_penalty;
                        } 

                        $prev_balance=$amount_payable-$prev_payment_data->details_prev_total_amount;
                        $due_amount=$prev_balance-$payment_details->details_amount;


                        //print_obj($due_amount);die;

                        


                        //$payment_data=$this->fm->get_fees_details(array('payment_fees_details_id'=>$_payment_data->details_payment_id));

                        //print_obj($payment_data);die;





                        $payment_data=array(
                            'payment_admission_code'=>$admission_data->admission_code,
                            'payment_code'=>$last_payment_data->details_order_code,
                            'payment_name'=>ucwords($booking_name),
                            'payment_email'=>$invd->stu_email,
                            'payment_stu_code'=>$invd->stu_user_code,
                            'payment_phone_no'=>$invd->stu_ph_no,
                            'payment_course'=>$invd->course_name,
                            'payment_subject'=>(!empty($invd->subject_name))?$invd->subject_name:'N/A',
                            'payment_session'=>$invd->session_start_year.'-'.$invd->session_end_year,
                            'payment_platform'=>ucwords($last_payment_data->details_payment_platform),
                            'payment_is_balance'=>($payment_details->details_payment_type=='installment_balance_fees')?'[ Balance Payment ]':'',
                            'payment_mode'=>'Online',
                            'payment_txn_code'=>$last_payment_data->details_txn_id,
                            'payment_late_fee_applied'=>$payment_data->payment_late_fee_applied,
                            'payment_late_fee'=>number_format($payment_data->payment_late_fee,2),
                            'payment_balance_amount'=>number_format($prev_balance,2),
                            'payment_prev_amount_paid'=>number_format($prev_payment_data->details_prev_total_amount,2),
                            'payment_amount_paid'=>number_format($payment_details->details_amount,2),
                            'payment_amount'=>number_format($amount_payable,2),
                            'payment_due_amount'=>($due_amount>0)?number_format($due_amount,2):'',
                            'payment_installment_data'=>$invd,
                            'payment_date'=>date('d-m-Y',strtotime($last_payment_data->details_created_at)),
                            'payment_college'=>$college_data->user_profile_name,
                            'payment_college_logo'=>$college_logo,
                            'payment_college_address'=>$college_address,
                            'payment_college_website'=>$college_data->user_website,
                            'payment_college_email'=>$college_data->user_email,
                            'payment_college_ph_no'=>$college_data->user_contact_no
                        );


                        $this->data['invoice_data']=$payment_data;

                        //print_obj($this->data['invoice_data']);die;


                        $return['html']=$this->theme->view('_pages/bills/vw_bill_admission_balance_installments',$this->data,true);
                    }

                        

                }else{
                    $return['error']='No booking data found';
                }


                


                json_headers($return);
                

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }
}