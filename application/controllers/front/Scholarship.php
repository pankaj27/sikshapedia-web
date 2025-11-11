<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/vendor/autoload.php';

/**
 * 
 */
class Scholarship extends BaseFrontController
{
	public function index(){
	    if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){ 
	    
       //$this->data['userdata']= $userdata;
        //print_r($this->data['userdata']);exit;
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//scholarship
        $this->data['page_title']="Apply for Scholarship";

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1!='scholarship')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){
				$segment_2_slug=$this->sm->get_slug(array('slug_value'=>$segment_2));
				if(!empty($segment_2_slug) && $segment_2_slug->slug_value='scholarship'){
					$page_title=$this->data['page_title'];
                    

					$breadcumb=array(
						'HOME'=>base_url(),
						'Scholarship'=>''
					);

					$this->data['news_page']=array(
						'news_page_heading'=>'Apply for Scholarship',
						'news_breadcumb'=>$breadcumb
					);
					
					
						//$this->load->helper('security');
		
                		$this->form_validation->set_rules('scholarship_name', ' Name', 'required');
                        $this->form_validation->set_rules('scholarship_dov', ' Date of Birth', 'required');
                        $this->form_validation->set_rules('scholarship_address', 'Applicant Address', 'required');
                        $this->form_validation->set_rules('scholarship_pincode', 'PINCODE', 'required');
                        $this->form_validation->set_rules('scholarship_qualification', 'Qualification', 'required');
                        $this->form_validation->set_rules('scholarship_course', 'Course', 'required');
                        
                        if (empty($_FILES['adhar_card']['name']))
                        {
                            $this->form_validation->set_rules('adhar_card', 'Adhar Card Files ', 'required');
                        }
                        if (empty($_FILES['hs_marksheet']['name']))
                        {
                            $this->form_validation->set_rules('hs_marksheet', 'H.S Marksheet Files ', 'required');
                        }
                        
                		
                		if ($this->form_validation->run() == FALSE)
                        {
                           $view_page='webpage/others/vw_scholarship';
                        }else{
                            
                            $userid=$this->data['userdata']->user_id;
                            
                            //check lready applied or not
                            $get_user_alraedy_applied=$this->db->query('select * from way2_system_scholarships where scholarship_userid="'.$userid.'" and scholarship_course="'.$this->input->post('scholarship_course').'"')->result();
                            //print_r($get_user_alraedy_applied);exit;
                            if(isset($get_user_alraedy_applied) && !empty($get_user_alraedy_applied)){
                                $message='
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                          <strong>Oh Snap!</strong> You have already applied scholarship for this course earlier.
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>';
                                
                                $this->session->set_flashdata('message', $message);
                                $view_page='webpage/others/vw_scholarship';
                                
                            }else{
                                
                                $adhar_card_file_id='';
                                $hs_marksheet_file_id='';
                                $graduation_marksheet_file_id='';
                                if(isset($_FILES['hs_marksheet']) && $_FILES['hs_marksheet']['name']!=''){
                                    
                                    $hsmarksheet_data=array(
										'file_size'=>'1',
										'file_name'=>'hs_marksheet',
										'file_types'=>'png,jpg,jpeg,pdf,PDF,PNG,JPEG,JPG',
										'file_folder'=>'scholarships',
										'file_child_folder'=>'hs_marksheet',
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);
									//print_r($hsmarksheet_data);

									$hs_marksheet_file_id=$this->onUploadFiles($hsmarksheet_data);
									//print_r($hs_marksheet_file_id);exit;
                                }
                                if(isset($_FILES['adhar_card']) && $_FILES['adhar_card']['name']!=''){
                                    
                                    $adhar_card=array(
										'file_size'=>'1',
										'file_name'=>'adhar_card',
										'file_types'=>'png,jpg,jpeg,pdf,PNG,PDF,JPEG,JPG',
										'file_folder'=>'scholarships',
										'file_child_folder'=>'adhaar_card',
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);

									$adhar_card_file_id=$this->onUploadFiles($adhar_card);
                                }
                                
                                 if(isset($_FILES['graduation_marksheet']) && $_FILES['graduation_marksheet']['name']!=''){
                                    
                                    $graduation_marksheet=array(
										'file_size'=>'1',
										'file_name'=>'graduation_marksheet',
										'file_types'=>'png,jpg,jpeg,PDF,pdf,PNG,JPEG,JPG',
										'file_folder'=>'scholarships',
										'file_child_folder'=>'graduation',
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);

									$graduation_marksheet_file_id=$this->onUploadFiles($graduation_marksheet);
                                }
                                
                                $error="";
                                if(isset($hs_marksheet_file_id) && !(intval($hs_marksheet_file_id)>0)){
                                    $error=$hs_marksheet_file_id;
                                }
                                if(isset($adhar_card_file_id) && !intval($adhar_card_file_id)>0){
                                    $error .=$adhar_card_file_id;
                                }
                                
                                if(isset($error) && !empty($error)){
                                    
                                    
                                    $message='
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                          <strong>Oh Snap!</strong> '.$error.'.
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>';
                                
                                    $this->session->set_flashdata('message', $message);
                                    $view_page='webpage/others/vw_scholarship';
                                    
                                    
                                }else{
                                    
                                    $scholarship_data=array(
        								'scholarship_name'=>$this->input->post('scholarship_name'),
        								'scholarship_studentid'=>date(dmyhis).rand(111111,895632),
        								'scholarship_dob'=>$this->input->post('scholarship_dov'),
        								'scholarship_address'=>$this->input->post('scholarship_address'),
        								'scholarship_pincode'=>$this->input->post('scholarship_pincode'),
        								'scholarship_qualification'=>$this->input->post('scholarship_qualification'),
        								'scholarship_course'=>$this->input->post('scholarship_course'),
        								'scholarship_hsmarksheet'=>$hs_marksheet_file_id,
        								'scholarship_adharcard'=>$adhar_card_file_id,
        								'scholarship_graduation'=>$graduation_marksheet_file_id,
        								'scholarship_userid'=>$userid,
        								'scholarship_uploadat'=>date('Y-m-d H:i:s')
        							);
        							//print_r($scholarship_data);exit;
        							
        						$result_submit=$this->schm->save_scholarship_data($scholarship_data);
        						    
        						    if(isset($result_submit) && !empty($result_submit))	
        						    {
        						        $student_id=$this->db->query("select * from way2_system_scholarships where scholarship_id='".$result_submit."'")->result();
        						        $sidddd=$student_id[0]->scholarship_studentid;
        						       
        						       //get user detailss=
        						      /* $student_id=$this->db->query("select * from way2_system_scholarships where scholarship_id='".$result_submit."'")->result();
        						        $sidddd=$student_id[0]->scholarship_studentid;
        						        
        						        
        						        	$htmlContent = '<h1>Application For Scholarship on Waytoadmission</h1>';
			                            	$htmlContent .= '<p>Dear, '.$this->input->post('scholarship_name').'</p>';
			                            	$htmlContent .= '<p>Student ID '.$sidddd.'</p>';
			                            	$htmlContent .= '<p>You have successfully applied for our scholarship programme.Please download our prospectus to click on following link </p>';
        						            $htmlContent .= '<p><a href="https://drive.google.com/file/d/1m-Z3I3JaA7dLthUuxLYuV7rDpZD98n_o/view?usp=sharing">https://drive.google.com/file/d/1m-Z3I3JaA7dLthUuxLYuV7rDpZD98n_o/view?usp=sharing</a></p>';
        						            $htmlContent .= '<p>Thanks & Regards</p>';
        						            $htmlContent .= '<p>Waytoaddmission Team</p>';
        						        
        						        $this->load->library('email');
                                        $this->email->from('info@waytoadmissions.com', 'Way to Admission');
                                        $this->email->to('patrapankaj36@gmail.com');
                                        $this->email->cc('info@waytoadmissions.com');
                                        $this->email->bcc('mail.nirmalsarkar@gmail.com');
                                        
                                        $this->email->subject('Waytoadmission Scholarship Application ');
                                        $this->email->message('Testing the email class.');
                                        
                                        $this->email->send();
        						        */
        						        
        						        
        						        $message='
                                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                                              <strong>Congratulation!</strong> Thanks for applying with us. Please note down your scholarship id (<b style="color:red">'.$sidddd.'</b>) for future reference. we will contact you soon .Please Download our prospectus <a target="_blank" href="https://drive.google.com/file/d/1m-Z3I3JaA7dLthUuxLYuV7rDpZD98n_o/view?usp=sharing" class="btn btn-primary">DOWNLOAD PROSPECTUS</a> 
                                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>';
                                          $this->session->set_flashdata('message', $message);   
                                        //$view_page='webpage/others/vw_scholarship';
                                        redirect(base_url().'in/scholarship','refresh');
        						        
        						    }else{
        						        
        						        
        						        $message='
                                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                                              <strong>Oh Snap!</strong> some technical issue occured . Please try after some times 
                                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>';
                                         $this->session->set_flashdata('message', $message);
                                       $view_page='webpage/others/vw_scholarship';
        						        
        						        
        						    }
        							
                                    
                                }
                            
                                
                            }
                            
                            //$view_page='webpage/others/vw_scholarship';
                        }
					

					

				}else{
					$page_title='404 Not Found';
					$view_page='notfound/vw_notfound';
				}
			}else{
				$page_title='404 Not Found';
				$view_page='notfound/vw_notfound';
			}
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
		
	 }else{
	     
	     redirect(base_url());
	 }
	}
	public function save_scholarship_data(){
	    
	    print_r($_POST);
	    
	    
	}
}