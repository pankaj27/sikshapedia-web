<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//require_once APPPATH.'libraries/Cwebp.php';
/**
 * 
 */
class Crons  extends BaseFrontController{

	public function cronEmailCampaign() {
	    // if (!$this->input->is_cli_request()) {
	    //     show_error('Direct access is not allowed');
	    // }

	    $campaigns = $this->sm->__get_campaigns(array('campaign_status' => 'active'));

	    //print_obj($campaigns);

	    if (!empty($campaigns)) {
	        foreach ($campaigns as $key => $value) {
	            $campaign_start_date = strtotime($value->campaign_start);
	            $campaign_end_date = strtotime($value->campaign_end);
	            $campaign_last_run_date = strtotime($value->campaign_last_run_date);

	            $cu_dt=date('Y-m-d');

	            // Get the current date
	            $current_date = strtotime($cu_dt);

	            // Check if the current date is within the campaign start and end dates and not equal to the last run date
	            if (($current_date >= $campaign_start_date && $current_date <= $campaign_end_date) && $current_date != $campaign_last_run_date) {

	            	$campaign_last_frequency=$value->campaign_last_frequency;
	            	$campaign_stream=$value->campaign_target_stream;
	            	$campaign_data_frequency=$value->campaign_data_frequency;

	            	$param['inst_course_streams']=$campaign_stream;

	            	$start=$campaign_last_frequency+$campaign_data_frequency;

	            	$posts['start']=$start;
	            	$posts['length']=$campaign_data_frequency;

	            	$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);

	            	$total_records=$this->im->_get_colleges($posts,$param,TRUE);

	            	if(!empty($list)){
	            		if(!empty($total_records)){
		            		$this->sm->update_campaigns(array('campaign_total_records'=>$total_records,'campaign_last_frequency'=>$start),array('campaign_id'=>$value->campaign_id));
		            	}
		            	

		            	if($campaign_last_frequency<=$total_records){
		            		$campaign_variables=json_decode($value->campaign_variables);

			                $this->data['email_data'] = $campaign_variables;

			                $this->data['campaign_link']=$value->campaign_link;

			                $email_template = $this->theme->view("_email/templates/{$value->template_file}", $this->data, true);

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
			                    "subject" => "{$value->campaign_subject}",
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
			                		
			                	}else{
			                		echo 'Mail not sent';
			                	}	                	
			                }
		            	}else{
		            		echo 'Email list has been completed to send mail.';
		            	}

		            	if($campaign_last_frequency>=$total_records){
							$this->sm->update_campaigns(array('campaign_last_run_date'=>$cu_dt,'campaign_total_records'=>$campaign_total_records,'campaign_status'=>'inactive'),array('campaign_id'=>$value->campaign_id));
	            		} 
	            	}else{
	            		echo 'No data found';
	            	}

		            	 	
	            }
	        }
	    }else{
	    	echo 'No campaigns to run';
	    }
	}




}