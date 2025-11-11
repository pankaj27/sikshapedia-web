<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH."/libraries/PHPMailer.php";
/**
 * 
 */
class Mail  extends BaseAdminController
{
    function __construct()
    {
        parent::__construct();
    }

    function index(){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Mail';

            $this->theme->title($this->data['page_title'])->load('mails/vw_mails', $this->data);
        }else{

            redirect($this->data['admin_base_url']);
        }
    }

    public function onSendEmail(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
           if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $mail_ids=post_data('mail_ids');
                $mail_type=post_data('mail_type');
                $mail_from=$this->data['system_general_settings']->system_info_email;

                if(!empty($mail_ids)){
                    if(is_array($mail_ids) && count($mail_ids)<=50){
                        foreach ($mail_ids as $key => $value) {

                            $college_data=$this->int->get_college_profile_data(array('college_email'=>$value));
                            $message=$this->theme->view('_email/vw_college_invitation_mail','sample',true);

                            $config['protocol'] = 'smtp';
                            $config['smtp_host'] = 'host.waytoadmissions.com';
                            $config['smtp_user'] = $mail_from;
                            $config['smtp_pass'] = 'InfoWaytoadmin@123%';
                            $config['smtp_port'] = '587';
                            $config['mailtype'] = 'html';
                            $this->email->initialize($config);

                            $this->email->from($mail_from, $this->data['system_general_settings']->system_name);
                            $this->email->to($value);
                            //$this->email->set_header('Content-Type', 'text/html');
                            $this->email->subject('Welcome To '.$this->data['system_general_settings']->system_name);
                            $this->email->message($message);
                            if($this->email->send(TRUE)){
                                $mail_data=array(
                                    'mail_address_from'=>$mail_from,
                                    'mail_address_to'=>$mail_address_to,
                                    'mail_content'=>$message,
                                    'mail_address_type'=>'COLLEGE',
                                    'mail_address_type_id'=>$college_data->college_user_id,
                                    'mail_status'=>'sent'
                                );

                                $this->sm->store_mail($mail_data);
                            }else{
                                $mail_data=array(
                                    'mail_address_from'=>$mail_from,
                                    'mail_address_to'=>$mail_address_to,
                                    'mail_content'=>$message,
                                    'mail_address_type'=>'COLLEGE',
                                    'mail_address_type_id'=>$college_data->college_user_id,
                                    'mail_status'=>$this->email->print_debugger(array('headers'))
                                );

                                $this->sm->store_mail($mail_data);
                            }
                        }

                        $return['success']="Mail Sent";

                    }else if(is_string($mail_ids)){
                        $college_data=$this->im->get_college_profile_data(array('college_email'=>$mail_ids));
                        $message=$this->theme->view('_email/vw_college_invitation_mail','sample',true);

                        $config['protocol'] = 'smtp';
                        $config['smtp_host'] = 'host.waytoadmissions.com';
                        $config['smtp_user'] = $mail_from;
                        $config['smtp_pass'] = 'InfoWaytoadmin@123%';
                        $config['smtp_port'] = '587';
                        $config['mailtype'] = 'html';
                        $this->email->initialize($config);

                        $this->email->from($mail_from, $this->data['system_general_settings']->system_name);
                        $this->email->to($mail_ids);
                        //$this->email->to('mail.nirmalsarkar@gmail.com');
                        //$this->email->set_header('Content-Type', 'text/html');
                        $this->email->subject('Welcome To '.$this->data['system_general_settings']->system_name);
                        $this->email->message($message);
                        if($this->email->send(TRUE)){
                            $mail_data=array(
                                'mail_address_from'=>$mail_from,
                                'mail_address_to'=>$mail_ids,
                                'mail_content'=>$message,
                                'mail_address_type'=>'COLLEGE',
                                'mail_address_type_id'=>$college_data->college_user_id,
                                'mail_status'=>'sent'
                            );

                            $this->sm->store_mail($mail_data);
                            $return['success']="Mail Sent";
                        }else{
                            $mail_data=array(
                                'mail_address_from'=>$mail_from,
                                'mail_address_to'=>$mail_ids,
                                'mail_content'=>$message,
                                'mail_address_type'=>'COLLEGE',
                                'mail_address_type_id'=>$college_data->college_user_id,
                                'mail_status'=>$this->email->print_debugger(array('headers'))
                            );

                            $this->sm->store_mail($mail_data);
                            $return['error']="Mail Not Sent";
                        } 
                    }
                }else{
                    $return['error']='No Email found';
                }

                header('Content-Type: application/json; charset=utf-8');

                echo json_encode($return);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    // public function onSendEmail_old(){
    //     if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
    //        if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

    //             // $mail_to=post_data('mail_to');

    //             $mail_from=$this->data['system_general_settings']->system_info_email;

    //             //echo $mail_from;die;


    //             // $mail_data['from']=$mail_from;
    //             // $mail_data['from_name']=$this->data['system_general_settings']->system_name;
    //             // $mail_data['to']='prolaypanda7@gmail.com';
    //             // $mail_data['subject']='Welcome To Waytoadmissions';
    //             // $mail_data['view']='_email/vw_college_invitation_mail';
    //             // $mail_data['data']=array();

    //             // $result=send_system_mail($mail_data,'html');

    //             // print_obj($result);

    //             //'info@waytoadmissions.com'

    //             //echo $mail_from;die;

    //             $message=$this->theme->view('_email/vw_college_invitation_mail','sample',true);

    //             //print_obj($message);die;

    //             //$message='';

    //             //$message='This is test mail';

    //             // $config = array();
    //             $config['protocol'] = 'smtp';
    //             $config['smtp_host'] = 'host.waytoadmissions.com';
    //             $config['smtp_user'] = $mail_from;
    //             $config['smtp_pass'] = 'InfoWaytoadmin@123%';
    //             $config['smtp_port'] = '587';
    //             $config['mailtype'] = 'html';
    //             $this->email->initialize($config);

    //             // $this->load->library('email');

    //             // $this->email->initialize($config);

    //             $this->email->from('info@waytoadmissions.com', $this->data['system_general_settings']->system_name);
    //             //$this->email->to('info@technoindiahooghly.org');
    //             $this->email->to('prolaypanda7@gmail.com');
    //             //$this->email->set_header('Content-Type', 'text/html');
    //             $this->email->subject('Welcome To '.$this->data['system_general_settings']->system_name);
    //             $this->email->message($message);
    //             if($this->email->send(TRUE)){            
    //                 echo "Mail Sent";
    //             }else{ 
    //                 print_obj($this->email->print_debugger(array('headers')));
    //             }

    //             //$this->load->library('phpmailer');

    //             // $mail = new PHPMailer();

    //             // $mail->IsSMTP();
    //             // //$mail->isSendmail();                                      // set mailer to use SMTP
    //             // // $mail->Host = "http://103.93.16.76/";  // specify main and backup server
    //             // // $mail->SMTPAuth = true;     // turn on SMTP authentication
    //             // // $mail->Username = "info@waytoadmissions.com";  // SMTP username
    //             // // $mail->Password = "InfoWaytoadmin@123%"; // SMTP password
    //             // $mail->Mailer = "Mailer";
    //             // // $mail->SMTPDebug = 4;
    //             // // $mail->Port = "465";
    //             // $mail->From = "info@waytoadmissions.com";
    //             // $mail->FromName = "Waytoadmissions";
    //             // $mail->AddAddress("prolaypanda7@gmail.com", " test");
    //             // #$mail->AddAddress("ellen@example.com");                  // name is optional
    //             // #$mail->AddReplyTo("info@example.com", "Information");
    //             // $mail->WordWrap = 50;                                 // set word wrap to 50 characters
    //             // #$mail->AddAttachment("/var/tmp/file.tar.gz");         // add attachments
    //             // #$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
    //             // $mail->IsHTML(true);                                  // set email format to HTML
    //             // $mail->Subject = 'Welcome To '.$this->data['system_general_settings']->system_name;
    //             // $mail->Body    = $message;
    //             // $mail->AltBody = "This is the body in plain text for non-HTML mail clients";

    //             // if(!$mail->Send())
    //             // {
    //             //    echo "Message could not be sent.";
    //             //    echo "Mailer Error: " . $mail->ErrorInfo;
    //             //    exit;
    //             // }
    //             // echo "Message has been sent";

    //         }else{
    //             redirect($this->data['admin_base_url']);
    //         }
    //     }else{
    //         redirect($this->data['admin_base_url']);
    //     }
    // }
}
