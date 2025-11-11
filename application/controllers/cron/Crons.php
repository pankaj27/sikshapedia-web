<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//require_once APPPATH.'libraries/Cwebp.php';
/**
 * 
 */
class Crons  extends CI_Controller{

	public function cronEmailCampaign() {
	    // if (!$this->input->is_cli_request()) {
	    //     show_error('Direct access is not allowed');
	    // }


	    $campaigns = $this->sm->get_campaigns(array('campaign_status' => 'status'), false);

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

	                $this->data['email_data'] = '';

	                $email_template = $this->theme->view("_email/templates/vw_email_campaign_1", $this->data, true);

	                $emailData = [
	                    "sender" => [
	                        "email" => "info@sikshapedia.com",
	                        "name" => "Sikshapedia"
	                    ],
	                    "subject" => "Test mail for email template test 28-03-24",
	                    "htmlContent" => "<!DOCTYPE html><html><body>{$email_template}</body></html>",
	                    "messageVersions" => [
	                        [
	                            "to" => [
	                                ["email" => "prolay7@hotmail.com", "name" => "Prolay Kumar Panda"],
	                                ["email" => "prolay.mobilefirst@gmail.com", "name" => "Prolay Kumar Panda"],
	                                ["email" => "ananyachoudhury32@gmail.com", "name" => "Anaya"]
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
	                		$this->sm->update_campaigns(array('campaign_last_run_date'=>$cu_dt),array('campaign_id'=>$value->campaign_id));
	                	}	                	
	                }
	            }
	        }
	    }
	}


	public function cronAddRemoveCityFromSearch() {
		$cities=$this->com->get_city_specific('city_id,city_name,city_country_id,city_state_id,city_status',array('city_status'=>'1'),false);
;
		if(!empty($cities)){
			foreach ($cities as $key => $value) {
				//echo '<pre>';print_r($value);die;
				$count_city_colleges=$this->im->get_colleges_count(array('college_city_id'=>$value->city_id),false);

				echo $value->city_name.'='.$count_city_colleges.'<br>';
				
				if($count_city_colleges>0){
					$city_visible_in_filter='yes';
				}else{
					$city_visible_in_filter='no';
				}

				//$this->com->update_city_data(array('city_visible_in_filter'=>$city_visible_in_filter),array('city_id'=>$value->city_id));
			}
		}
		
	}



	public function cronCreateSearchData(){
		$this->sm->delete_system_search_data(array('search_data_type!='=>null));
		$colleges=$this->im->_get__colleges();

		if(!empty($colleges)){
			foreach ($colleges as $key => $list) {

				//if(!empty($college_slug)){
					$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$list->college_user_id,'user_storage_type'=>'user_logo'));

					if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
						$college_logo=$_college_logo->media_disk_path_relative;
						$college_logo_name=$_college_logo->media_org_name;
					}else{
						$college_logo=base_url('data/app/app_data/sikshapedia-small-logo.png');
						$college_logo_name='';
					}

					$slug_data=$this->sm->get_slug_urls(array('url_value'=>$list->access_url));

					if(!empty($slugs_data)){
						$search_data_meta_title=$slug_data->url_meta_title;
						$search_data_meta_keywords=$slug_data->url_meta_key_words;
						$search_data_meta_desc=$slug_data->url_meta_desc;
						$search_data_og_title=$slug_data->url_og_title;
						$search_data_og_desc=$slug_data->url_og_desc;
					}else{
						$search_data_meta_title=null;
						$search_data_meta_keywords=null;
						$search_data_meta_desc=null;
						$search_data_og_title=null;
						$search_data_og_desc=null;
					}

					$data_to_insert=array(
						'search_data_type_id'=>$list->college_user_id,
						'search_data_type'=>'COLLEGE_NAME',
						'search_data_name'=>strtoupper($list->college_name),
						'search_data_short_name'=>$list->college_short_name,
						'search_data_country_id'=>$list->college_country_id,
						'search_data_country'=>strtoupper($list->country_name),
						'search_data_state_id'=>$list->college_state_id,
						'search_data_state_name'=>strtoupper($list->state_name),
						'search_data_city_id'=>$list->college_city_id,
						'search_data_city_name'=>strtoupper($list->city_name),
						'search_data_address'=>$list->college_address,
						'search_data_access_url'=>$list->access_url,
						'search_storage_access_url'=>$college_logo
					);

					//print_obj($data_to_insert);

					$system_data_search=$this->sm->get_system_search_data(array('search_data_type'=>'COLLEGE_NAME','search_data_access_url'=>$list->access_url));

					if(empty($system_data_search)){									
						$updated=$this->sm->store_system_search_data($data_to_insert);
					}else{
						$updated=$this->sm->update_system_search_data($data_to_insert,array('search_data_type'=>'COLLEGE_NAME','search_data_access_url'=>$list->access_url));
					}
				//}
			}
		}
	}

}