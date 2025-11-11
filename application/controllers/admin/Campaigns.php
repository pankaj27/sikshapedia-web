<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//require_once APPPATH.'libraries/Cwebp.php';
/**
 * 
 */
class Campaigns  extends BaseAdminController
{


	function __construct()
	{
		parent::__construct();
	}

	function index(){

		//$this->cwebp->getCommand();die;


		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Email campaigns';

			$campaign_veriables=array(
				'other_variable'=>array(
					'colleges'=>'10000',
					'universities'=>'400',
					'courses'=>'1200',
					'exams'=>'800'
				),
				'special_variable'=>'20'	
			);

			//echo json_encode($campaign_veriables);die;

			/*$dataArray = [
			    "name" => "Newsletter - May 2024",
			    "sender" => [
			        "name" => "Test from Sikshapedia",
			        "email" => "info@sikshapedia.com",
			        "id" => 3
			    ],
			    "tag" => "Newsletter",
			    "htmlContent" => "<!DOCTYPE html> <html> <body> <h1>Confirm you email</h1> <p>Please confirm your email address by clicking on the link below</p> </body> </html>",
			    "htmlUrl" => "https://html.domain.com",
			    "templateId" => 71900287,
			    "scheduledAt" => "Excepteur molli",
			    "subject" => "Discover the New Collection !",
			    "replyTo" => "support@myshop.com",
			    "toField" => "{FNAME} {LNAME}",
			    "recipients" => [
			        "exclusionListIds" => [
			            8,
			            8
			        ],
			        "listIds" => [
			            32,
			            32
			        ]
			    ],
			    "attachmentUrl" => "https://attachment.domain.com",
			    "inlineImageActivation" => true,
			    "mirrorActive" => true,
			    "footer" => "[DEFAULT_FOOTER]",
			    "header" => "[DEFAULT_HEADER]",
			    "utmCampaign" => "NL_05_2017",
			    "params" => [
			        "veniam_8" => [],
			        "nullac" => [],
			        "cillum3c" => []
			    ],
			    "sendAtBestTime" => true,
			    "abTesting" => true,
			    "subjectA" => "Discover the New Collection!",
			    "subjectB" => "Want to discover the New Collection?",
			    "splitRule" => 50,
			    "winnerCriteria" => "open",
			    "winnerDelay" => 50,
			    "ipWarmupEnable" => true,
			    "initialQuota" => 3000,
			    "increaseRate" => 70,
			    "unsubscriptionPageId" => "62cbb7fabbe85021021aac52",
			    "updateFormId" => "6313436b9ad40e23b371d095"
			];*/

			//$data_param['data']=$dataArray;
			/*$data_param['headers']=array("Content-Type:application/json","Accept:application/json","API-key:".BREVO_API_KEY);
			$data_param['url']=BREVO_API_URL.'contacts?limit=50&offset=0&modifiedSince=2024-03-02T04:54:00&sort=desc';
			$p=curl_get($data_param);

			print_obj($p);

			die;*/


			$this->theme->title($this->data['page_title'])->load('campaigns/vw_email_campaign', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexAddEditCampaigns($campaign_id=null){
		if(session_userdata('isAdminLoggedin')){

			if($campaign_id!=null){
				$campaign_id=decode_data($campaign_id);

				$campaign_data=$this->sm->get_campaigns(array('campaign_id'=>$campaign_id));

				if(!empty($campaign_data)){
					$campaign_variables=json_decode($campaign_data->campaign_variables);
				}

				$this->data['campaign_data']=$campaign_data;

				$this->data['campaign_variables']=$campaign_variables;
			}else{
				$this->data['campaign_data']=null;
				$this->data['campaign_variables']=null;
			}

			$this->data['campaign_sreams']=$this->strm->get_stream(array('stream_status'=>'1'),FALSE);

			$template_data=$this->sm->get_template(array('template_id'=>'1'));

			if(!empty($template_data)){
				$template_variables=unserialize($template_data->template_variables);

				$this->data['template_data']=$template_data;
				$this->data['template_variables']=unserialize($template_data->template_variables);
			}

			$this->theme->title($this->data['page_title'])->load('campaigns/vw_email_create_campaign', $this->data);

		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSendCampaignMail_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$campaign_id=post_data('campaign_id');

				$cu_dt=date('Y-m-d');


				$campaign_detail=$this->sm->get_campaigns(array('campaign_status'=>'active','campaign_id'=>$campaign_id));

				if(!empty($campaign_detail)){

					$campaign_last_frequency=$campaign_detail->campaign_last_frequency;
	            	$campaign_stream=$campaign_detail->campaign_target_stream;
	            	$campaign_data_frequency=$campaign_detail->campaign_data_frequency;



	            	$param['inst_course_streams']=$campaign_stream;

	            	$start=$campaign_last_frequency+$campaign_data_frequency;

	            	$posts['start']=$start;
	            	$posts['length']=$campaign_data_frequency;

	            	$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);

	            	$total_records=$this->im->_get_colleges($posts,$param,TRUE);

	            	$remain_data=$total_records-$campaign_data_frequency;

					if(!empty($list)){
						if(!empty($total_records) && $total_records>0){
		            		$this->sm->update_campaigns(array('campaign_total_records'=>$total_records,'campaign_last_frequency'=>$start),array('campaign_id'=>$campaign_id));
		            	}

		            	
		            		$campaign_variables=json_decode($campaign_detail->campaign_variables);

			                $this->data['email_data'] = $campaign_variables;

			                $this->data['campaign_link']=$campaign_detail->campaign_link;

			                $email_template = $this->theme->view("_email/templates/{$campaign_detail->template_file}", $this->data, true);

			                foreach ($list as $k => $v) {
			                	$to_emails[]=[
			                		"email"=>$v->college_email,
			                		"name"=>$v->college_name
			                	];
			                }			                

			                $emailData = [
			                    "sender" => [
			                        "email" => "info@sikshapedia.com",
			                        "name" => "Sikshapedia"
			                    ],
			                    "subject" => "{$campaign_detail->campaign_subject}",
			                    "htmlContent" => "{$email_template}",
			                    "messageVersions" => [
			                        [
			                            "to" => [
			                                ["email" => "prolay7@hotmail.com", "name" => "Prolay Kumar Panda"],
	                                		["email" => "prolay.mobilefirst@gmail.com", "name" => "Prolay Kumar Panda"]
			                            ]
			                        ]
			                    ]
			                ];

			                $data_param['data'] = $emailData;
			                $data_param['headers'] = array("Content-Type:application/json", "Accept:application/json", "API-key:" . BREVO_API_KEY);
			                $data_param['url'] = BREVO_API_URL . 'smtp/email';
			                $response = curl_post($data_param);

			                if(isset($response['success'])){
			                	$success_data=json_decode($response['success']);
			                	if(isset($success_data->messageIds)){
			                		echo 'Mail sent';
			                		$this->sm->update_campaigns(array('campaign_remain_records'=>$remain_data),array('campaign_id'=>$campaign_id));
			                	}else{
			                		echo 'Mail not sent';
			                	}	                	
			                }
		            
					}else{
						echo 'No data found';
					}

					
				}	

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSendCampaignMail_old2() {
	    if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
	        if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

	            $campaign_id ='1';// post_data('campaign_id');
	            $cu_dt = date('Y-m-d');
	            $campaign_detail = $this->sm->get_campaigns(array('campaign_status' => 'active', 'campaign_id' => $campaign_id));

	            if (!empty($campaign_detail)) {

	                $campaign_last_frequency = $campaign_detail->campaign_last_frequency;
	                $campaign_stream = $campaign_detail->campaign_target_stream;
	                $campaign_data_frequency = $campaign_detail->campaign_data_frequency;

	                $param['inst_course_streams'] = $campaign_stream;

	                $start = $campaign_last_frequency + $campaign_data_frequency;

	                $posts['start'] = $start;
	                $posts['length'] = $campaign_data_frequency;

	                $list = $this->im->_get_colleges($posts, $param, FALSE, FALSE);

	                $total_records = $this->im->_get_colleges($posts, $param, TRUE);

	                $remain_data = $total_records - $campaign_data_frequency;

	                // Check if campaign_remain_records is null or zero
	                if ($campaign_detail->campaign_remain_records === null) {
	                    // If remain_records is null, update and send emails
	                    $this->sm->update_campaigns(array('campaign_remain_records' => $remain_data), array('campaign_id' => $campaign_id));
	                    $this->sendEmails($list, $campaign_detail); // Function to send emails
	                } elseif ($campaign_detail->campaign_remain_records == 0) {
	                    // If remain_records is 0, update campaign status to inactive
	                    $this->sm->update_campaigns(array('campaign_status' => 'inactive'), array('campaign_id' => $campaign_id));
	                    echo 'Campaign is now inactive, no emails sent.';
	                } else {
	                    // If remain_records is greater than 0, send emails
	                    $this->sendEmails($list, $campaign_detail); // Function to send emails
	                }
	            } else {
	                echo 'No campaign details found';
	            }

	        } else {
	            redirect($this->data['admin_base_url']);
	        }
	    } else {
	        redirect($this->data['admin_base_url']);
	    }
	}


	public function onSendCampaignMail() {
	    if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
	        if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

	            $campaign_id = post_data('campaign_id');
	            $cu_dt = date('Y-m-d');
	            // Get the current date
	            $current_date = strtotime($cu_dt);
	            $campaign_detail = $this->sm->__get_campaigns(array('campaign_status' => 'active', 'campaign_id' => $campaign_id));

	            if (!empty($campaign_detail)) {

	                $campaign_last_run_date = strtotime($campaign_detail->campaign_last_run_date);
	                $campaign_last_frequency = $campaign_detail->campaign_last_frequency;
	                $campaign_stream = $campaign_detail->campaign_target_stream;
	                $campaign_data_frequency = $campaign_detail->campaign_data_frequency;

	                $param['inst_course_streams'] = $campaign_stream;

	                $start = $campaign_last_frequency;
	                $total_records = $this->im->_get_colleges(['start' => $start, 'length' => 0], $param, TRUE);  // Fetch total records without offset and limit

	                // Check if it's a new day compared to last run
	                if ($current_date > $campaign_last_run_date) {
	                    while ($start < $total_records && $campaign_data_frequency > 0) {
	                        $posts = [
	                            'start' => $start,
	                            'length' => $campaign_data_frequency
	                        ];
	                        $list = $this->im->_get_colleges($posts, $param, FALSE, FALSE);

	                        print_obj($list);die;

	                        // Send emails for the current batch
	                        if (!empty($list)) {
	                            $this->sendEmails($list, $campaign_detail);
	                            $campaign_data_frequency -= count($list);  // Decrement the limit for the day
	                        }

	                        // Update start for next batch
	                        $start += count($list);

	                        // Recalculate remaining data
	                        $remain_data = $total_records - $start;

	                        // Update campaign records and frequency
	                        $this->sm->update_campaigns([
	                            'campaign_last_frequency' => $start,
	                            'campaign_last_run_date' => $cu_dt,
	                            'campaign_remain_records' => max(0, $remain_data)
	                        ], ['campaign_id' => $campaign_id]);

	                        if ($remain_data <= 0) {
	                            break;
	                        }
	                    }

	                    // If all records are processed, mark the campaign as inactive
	                    if ($remain_data <= 0) {
	                        $this->sm->update_campaigns(['campaign_status' => 'inactive'], ['campaign_id' => $campaign_id]);
	                        $return['success']= 'Campaign completed and marked as inactive.';
	                    } else if ($campaign_data_frequency <= 0) {
	                        $return['success']= 'Daily email sending limit reached.';
	                    }
	                } else {
	                    $return['success']= 'Emails have already been sent today.';
	                }
	            } else {
	                $return['error']= 'No campaign details found';
	            }

	            header('Content-Type: application/json; charset=utf-8');

	        	echo json_encode($return);

	        } else {
	            redirect($this->data['admin_base_url']);
	        }
	    } else {
	        redirect($this->data['admin_base_url']);
	    }
	}


	private function sendEmails($list, $campaign_detail) {
	    if (!empty($list) && !empty($campaign_detail)) {
	        $to_emails = array_map(function ($v) {
	            return ["email" => $v->college_email, "name" => $v->college_name];
	        }, $list);

	        $campaign_variables = json_decode($campaign_detail->campaign_variables);
	        $this->data['email_data'] = $campaign_variables;
	        $this->data['campaign_link'] = $campaign_detail->campaign_link;

	        $email_template = $this->theme->view("_email/templates/{$campaign_detail->template_file}", $this->data, true);

	        $emailData = [
	            "sender" => ["email" => "info@sikshapedia.com", "name" => "Sikshapedia"],
	            "subject" => "Your College Has {$campaign_detail->campaign_subject}",
	            "htmlContent" => "{$email_template}",
	            "messageVersions" => [["to" => $to_emails]]
	        ];

	        // $emailData = [
            //     "sender" => [
            //         "email" => "info@sikshapedia.com",
            //         "name" => "Sikshapedia"
            //     ],
            //     "subject" => "Your College Have 20 {$campaign_detail->campaign_subject}",
            //     "htmlContent" => "{$email_template}",
            //     "messageVersions" => [
            //         [
            //             "to" => [
            //                 ["email" => "prolay7@hotmail.com", "name" => "Prolay Kumar Panda"],
            //         		["email" => "prolay.mobilefirst@gmail.com", "name" => "Prolay Kumar Panda"],
            //         		["email" => "mail.nirmalsarkar@gmail.com", "name" => "Nirmal Sarkar"]
            //             ]
            //         ]
            //     ]
            // ];

	        $data_param = [
	            'data' => $emailData,
	            'headers' => ["Content-Type:application/json", "Accept:application/json", "API-key:" . BREVO_API_KEY],
	            'url' => BREVO_API_URL . 'smtp/email'
	        ];
	        $response = curl_post($data_param);

	        if (isset($response['success'])) {
	            $success_data = json_decode($response['success']);
	            if (isset($success_data->messageIds)) {

	            	foreach ($list as $key => $value) {
	            		$campaign_data[]=array(
		            		'campu_pk_id'=>$campaign_detail->campaign_id,
		            		'campu_name'=>$value->college_name,
		            		'campu_email'=>$value->college_email,
		            		'campu_status'=>'sent',
		            		'campu_sent_date'=>date('Y-m-d')
		            	);
	            	}

	            	$this->sm->store_campaigns_mails($campaign_data,TRUE);
	            }
	        }
	    } else {
	        echo 'No data found to send emails';
	    }
	}



	/**Create and Update Campaign**/
	function onAddEditCampaign(){
		if(session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')){
	        if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST'){

	        	$campaign_name=post_data('campaign_name');
	        	$campaign_start=post_data('campaign_start');
	        	$campaign_end=post_data('campaign_end');
	        	$campaign_schedule_time=post_data('campaign_schedule_time');
	        	$campaign_fire_frequency=post_data('campaign_fire_frequency');
	        	$campaign_status=post_data('campaign_status');
	        	$campaign_template=post_data('campaign_template');
	        	$campaign_type=post_data('campaign_type');

	        	$campaign_variables=$this->input->post('campaign_variabales');

	           	if(!empty($campaign_variables)){

	           		foreach ($campaign_variables as $key => $value) {
	           			$_campaign_variables[]=array(
	           				$value['name']=>$value['val']
	           			);
	           		}

	           		$template_data=array(
		        		'campaign_type'=>$campaign_type,
		        		'campaign_name'=>$campaign_name,
		        		'campaign_variables'=>json_encode($_campaign_variables),
		        		'campaign_template'=>$campaign_template,
		        		'campaign_start'=>$campaign_start,
		        		'campaign_end'=>$campaign_start,
		        		'campaign_schedule_time'=>$campaign_schedule_time,
		        		'campaign_status'=>$campaign_status
		        	);

		        	$added=$this->sm->store_campaigns($template_data);

		        	if($added){
		        		$return['success']='Campaign has been created';
		        	}else{
		        		$return['error']='No campaign created';
		        	}
	           	}else{
	           		$return['error']='Set Campaign variables value';
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


	function onCreateNewCampaign(){
	    if(session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')){
	        if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST'){

	            // Load the form validation library
	            $this->load->library('form_validation');

	            // Set validation rules
	            $this->form_validation->set_rules('contact_firstname', 'First Name', 'required|trim');
	            $this->form_validation->set_rules('contact_lastname', 'Last Name', 'required|trim');
	            $this->form_validation->set_rules('contact_country', 'Country', 'required|trim');
	            $this->form_validation->set_rules('contact_phone', 'Phone', 'required|trim|numeric');

	            if ($this->form_validation->run() == FALSE) {
	                // Validation failed, handle the error
	                $errorMessages = validation_errors();
	                // You can return these errors to the AJAX request or handle them however you prefer
	            } else {
	                // Validation passed, proceed with further processing

	                $contact_firstname = post_data('contact_firstname');
	                $contact_lastname = post_data('contact_lastname');
	                $contact_country = post_data('contact_country');
	                $contact_phone = post_data('contact_phone');

	                // Your existing code to process the form data goes here


	            }

	        } else {
	            redirect($this->data['admin_base_url']);
	        }
	    } else {
	        redirect($this->data['admin_base_url']);
	    }
	}


	/**get All Institutions*
	public function onSearchInstitutions(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('admin_id'));

				//echo $user_id;die;
				$param['column_order'] = array(
					null,
					'college_name',
					'country_name',
					'state_name',
					'college_estd_year'
				);

				$param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no');
				$param['order'] = array('college_id' => 'DESC');
				//$param['college_utype']='4';
				$posts=$this->input->post();				

				$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$count_potential_duplicates=0;

				foreach ($list as $user){
					$no++;

					$row = array();

					$row[]	=	'<input type="checkbox">';

					$row[]	=	$user->college_name;
					$row[]	=	$user->college_email;
					

					$row[]  =	'<button class="btn btn-dark" type="button">Send Mail</button>';	

					$data[] = $row;	
				}


				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_colleges($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_colleges($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	/**Get All Contact List**/

	public function onSearchCampaignContacts(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

            	$recordsTotal=0;
            	$recordsFiltered=0;

            	$posts=$this->input->post();
				$no = isset($posts['start'])?$posts['start']:0;

            	$param['headers']=array("Content-Type:application/json","Accept:application/json","API-key:".BREVO_API_KEY);
				$param['url']=BREVO_API_URL.'contacts?limit='.$posts['length'].'&offset='.$posts['start'].'&sort=desc';

				//print_obj($param);die;

				$responsedata=curl_get($param);

				//print_obj($param);die;

				if(!empty($responsedata['response'])){
					
					$contacts=json_decode($responsedata['response'],true);

					$recordsTotal=$contacts['count'];
					$recordsFiltered=$contacts['count'];

					foreach($contacts['contacts'] as $contact){
						$no++;

						$row = array();

						$row[]	=	$contact['attributes']['FIRSTNAME'];
						$row[]	=	$contact['attributes']['LASTNAME'];
						$row[]	=	$contact['email'];
						$row[]	=	'';

						$data[] = $row;	
					}
				}


				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $recordsTotal,
					"recordsFiltered" => $recordsFiltered,
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



	public function onImportColleges(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$data_imported=FALSE;

				$table_rows='';

				// Array to store the formatted data
				$recipients = [];

				if(isset($_FILES['college_excel']) && $_FILES['college_excel']['name']!=''){

					$excel_data=array(
						'file_size'=>'10',
						'file_name'=>'college_excel',
						'file_types'=>'xls,xlsx',
					);

					$file_path=$this->onUploadFiles($excel_data,'excel_import');

					if(is_file($file_path)){
						$validated=$this->onValidateCollegeExcel($file_path);

						if($validated['validated']==200){
							$exceldata=$validated['exceldata'];

							//print_obj($exceldata);die;

							foreach ($exceldata as $_key => $_value) {
					    		$_exceldata[]=array_filter($_value[0]);
					    	}

							foreach ($_exceldata as $key => $value){
								$row=$key+1;

								$name		=	isset($value[1])?strip_javascript(xss_clean(trim($value[1]))):'';
			    				$email		=	isset($value[2])?strip_javascript(xss_clean(trim($value[2]))):'';

			    				$email_data=$this->sm->get_campaigns_mails(null,array('campu_email'=>$email));			

			    				if(empty($email_data)){
			    					
			    					$data_to_insert[]=array(
			    						'campu_name'=>$name,
			    						'campu_email'=>$email,
			    						'campu_status'=>'not_sent'
			    					);

			    					// Append each row to the 'to' array in the required format
							        $recipients[] = [
							            "email" => $email,
							            "name" => $name
							        ];

									$data_imported=TRUE;		    					
			    				}
							}
							

							if($data_imported==TRUE){
								@unlink($file_path);

								//Send mail
								$emails=["prolaypanda7@gmail.com","prolay.mobilefirst@gmail.com"];

								//$email_template=$this->theme->view("_email/templates/{$campaign_template}",$this->data,true);

								$email_template=$this->theme->view("_email/templates/vw_email_campaign_7",$this->data,true);


								$emailData = [
								    "sender" => [
								        "email" => "info@sikshapedia.com",
								        "name" => "Sikshapedia"
								    ],
								    "subject" => "Test mail for email temlate test 08-04-24",
								    "htmlContent" => "{$email_template}",
								    "messageVersions" => [
								        // Definition for Message Version 2
								        [
								            "to" => [
								                $recipients
								            ]
								        ]
								    ]
								];

								$data_param['data']=$emailData;
								$data_param['headers']=array("Content-Type:application/json","Accept:application/json","API-key:".BREVO_API_KEY);
								$data_param['url']=BREVO_API_URL.'smtp/email';
								$response=curl_post($data_param);

								if(isset($response['success'])){
				                	$success_data=json_decode($response['success']);
				                	if(isset($success_data->messageIds)){
				                		$email_sent_msg= 'Mail sent';

				                		foreach ($recipients as $key => $value) {
				                			$updated=$this->sm->update_campaigns_mails(array('campu_status'=>'sent'),array('campu_email'=>$value['email']));
				                		}	
				                	}else{
				                		$email_sent_msg= 'Mail not sent';
				                	}
				                }


								$return['success']='Data imported successfully & '.$email_sent_msg;
							}else{
								$return['error']='Data not imported into the system';
							}
						}else{
							$return['error']=$validated['error'];
						}
					}else{
						$return['error']='File upload error';
					}

				}else{
					$return['error']='Excel file is missing';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onSearchCampaignMail(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'campu_name',
					'campu_email',
					'campu_status'
				);

				$param['column_search'] = array('campu_name','campu_email');
				$param['order'] = array('campu_id' => 'DESC');
				$posts=$this->input->post();


				$list = $this->sm->_get_campaigns_mails($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $country){
					$no++;

					$row = array();	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_campaigns_mails($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_campaigns_mails($posts,$param,TRUE),
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


	public function onSearchCampaigns(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

            	$param['column_order'] = array(
					null,
					'campaign_name'
				);

				$param['column_search'] = array('campaign_name','campaign_template');
				$param['order'] = array('campaign_id' => 'DESC');
				$posts=$this->input->post();


				$list = $this->sm->_get_campaigns($posts,$param,FALSE,FALSE);

				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $campaign){
					$no++;

					$row = array();

					$row[]	=	$no;
					$row[]	=	$campaign->campaign_name;
					$row[]	=	$campaign->template_name;
					
					$row[]	=	$campaign->campaign_status;


					if($campaign->campaign_status=='active'){
						$action='<a class="btn btn-xs btn-dark" href="'.$this->data['admin_base_url'].'/emailcampaigns/add/'.encode_data($campaign->campaign_id).'">Edit</a><button class="btn btn-xs btn-primary btn_send_campaign_mail" type="button" data-campaign_id="'.$campaign->campaign_id.'">Send Email</button>';
					}else if($campaign->campaign_status=='inactive'){
						$action='';
					}

					$row[]	=	$action;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_campaigns($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_campaigns($posts,$param,TRUE),
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