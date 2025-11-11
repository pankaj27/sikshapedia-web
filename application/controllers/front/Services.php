<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Services  extends BaseFrontController{

	public function index(){

		$slug=$this->uri->segment(2);

		$service_data=$this->serm->_get_service(array('service_slug'=>$slug));

		if(!empty($service_data)){

			$service_banner_image_data=$this->sm->get_file(array('media_type'=>'service_banner_image','media_type_data_id'=>$service_data->service_id));

			$service_portfolio_image=$this->sm->get_files(array('media_type'=>'service_portfolio_image','media_type_data_id'=>$service_data->service_id));

			$service_broad_desc=$this->serm->get_service_broad_desc(array('data_service_id'=>$service_data->service_id),FALSE,'broad_desc_serial_no');

			$this->data['service_data']=array(
				'service_id'=>$service_data->service_id,
				'service_name'=>$service_data->service_name,
				'service_long_desc'=>$service_data->service_long_desc,
				'service_banner_image'=>(!empty($service_banner_image_data))?$service_banner_image_data->media_disk_path_relative:'',
				'service_broad_desc'=>$service_broad_desc,
				'service_portfolio_image'=>$service_portfolio_image
			);
			
			$this->theme->title($service_data->service_name)->description($service_data->service_meta_desc)->keywords($service_data->service_meta_keywords)->load('service/vw_service', $this->data);
		}else{
			show_404();
		}
	}


	public function onSubscribeNewsletter(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$subscriber_email=post_data('subscriber_email');
			$subscriber_phone=post_data('subscriber_phone');
			$subscriber_course=post_data('subscriber_course');
			$course_id=decode_data($_course);
			$page=post_data('page');

			$country_id=decode_data(post_data('country_id'));

			$ip_address=$this->input->ip_address();

			$college_data=array();

			$country_data=$this->com->get_country(array('country_id'=>$country_id));

			$datat_to_store=array(
				'subscription_country_id'=>$country_id,
				'subscription_course_id'=>$course_id,
				'subscription_email'=>$email,
				'subscription_phone_country_code'=>$country_data->country_phone_code,
				'subscription_phone'=>$phone,
				'subscription_ip'=>$ip_address
			);

			$data_found=$this->serm->_get_subscription_data(array('subscription_course_id'=>$course_id));

			if(empty($data_found)){
				if($data_found->subscription_phone!=$phone && $data_found->subscription_email!=$email){
					$added=$this->serm->store_subscription_data($datat_to_store);

					if($added){
						$return['success']='Thanks for subscribing.You will be the first to recieve College related news.';
					}else{
						$return['error']='There was an error for this momment.Try later';
					}
				}else if($data_found->subscription_phone!=$phone && $data_found->subscription_email==$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}else if($data_found->subscription_phone==$phone && $data_found->subscription_email!=$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}else if($data_found->subscription_phone==$phone && $data_found->subscription_email==$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}
			}else{
				$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				
			}

			$param['user_course']=$course_id;
			$post['length']='3';
			$institutes=$this->im->_get_users_courses($post,$param);


			if(!empty($institutes)){
				foreach ($institutes as $key => $value) {

			    	$college_profile=$this->sm->__get_system_search_data(array('search_data_type_id'=>$value->user_id,'search_data_type'=>'COLLEGE_NAME'));

					$college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
    				$college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

    				if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
	                    $college_logo=$college_logo->media_disk_path_relative;
	                    $college_logo_name=$college_logo->media_org_name;
	                }else{
	                    $college_logo='https://static.waytoadmissions.com/data/app/app_data/no.jpg';
	                    $college_logo_name='';
	                }


	                if(!empty($college_banner) && !empty($college_banner->media_disk_path_relative)){
	                    $college_banner=$college_banner->media_disk_path_relative;
	                    $college_banner_name=$college_banner->media_org_name;
	                }else{
	                    $college_banner='https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg';
	                    $college_banner_name='';
	                }

	                $college_data[]=array(
                        'college_name'=>$college_profile->search_data_name,
                        'college_city'=>$college_profile->search_data_city_name,
                        'college_state'=>$college_profile->search_data_state_name,
                        'college_logo'=>$college_logo,
                        'college_banner'=>$college_banner,
                        'college_course_full_name'=>$value->course_name,
                        'college_course_short_name'=>$value->course_short_name,
                        'college_course_placement'=>$value->user_course_placement_type,
                        'college_course_duration'=>$value->user_course_duration_year.' yrs.',
                        'college_course_duration_type'=>$value->user_course_duration_type,
                        'access_url'=>$college_profile->search_data_access_url
                    );
				}
			}

			$return['colleges']=$college_data;

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);


		}else{
			redirect(base_url());
		}
	}


	public function onSubscribeNewsletter_old(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$ctext=post_data('ctext');

			$security_token = $this->data['security_token'];
			$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

			$email=clean_data($decrypted['subscriber_email']);
			$phone=clean_data($decrypted['subscriber_phone']);

			$_course=clean_data($decrypted['subscriber_course']);

			$course_id=decode_data($_course);

			$page=post_data('page');

			$ip_address=$this->input->ip_address();

			$college_data=array();

			$datat_to_store=array(
				'subscription_country_id'=>'99',
				'subscription_course_id'=>$course_id,
				'subscription_email'=>$email,
				'subscription_phone_country_code'=>'+91',
				'subscription_phone'=>$phone,
				'subscription_ip'=>$ip_address
			);

			$data_found=$this->serm->_get_subscription_data(array('subscription_course_id'=>$course_id));

			if(empty($data_found)){
				if($data_found->subscription_phone!=$phone && $data_found->subscription_email!=$email){
					$added=$this->serm->store_subscription_data($datat_to_store);

					if($added){
						$return['success']='Thanks for subscribing.You will be the first to recieve College related news.';
					}else{
						$return['error']='There was an error for this momment.Try later';
					}
				}else if($data_found->subscription_phone!=$phone && $data_found->subscription_email==$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}else if($data_found->subscription_phone==$phone && $data_found->subscription_email!=$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}else if($data_found->subscription_phone==$phone && $data_found->subscription_email==$email){
					$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				}
			}else{
				$return['error']='You have already subscribed.You will be the first to recieve College related news.';
				
			}


			// if($page=='home'){


			// }

			$param['user_course']=$course_id;
			$post['length']='3';
			$institutes=$this->im->_get_users_courses($post,$param);




			if(!empty($institutes)){
				foreach ($institutes as $key => $value) {

			    	$college_profile=$this->sm->__get_system_search_data(array('search_data_type_id'=>$value->user_id,'search_data_type'=>'COLLEGE_NAME'));

					$college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
    				$college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

    				if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
	                    $college_logo=$college_logo->media_disk_path_relative;
	                    $college_logo_name=$college_logo->media_org_name;
	                }else{
	                    $college_logo='https://static.waytoadmissions.com/data/app/app_data/no.jpg';
	                    $college_logo_name='';
	                }


	                if(!empty($college_banner) && !empty($college_banner->media_disk_path_relative)){
	                    $college_banner=$college_banner->media_disk_path_relative;
	                    $college_banner_name=$college_banner->media_org_name;
	                }else{
	                    $college_banner='https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg';
	                    $college_banner_name='';
	                }

	                $college_data[]=array(
                        'college_name'=>$college_profile->search_data_name,
                        'college_city'=>$college_profile->search_data_city_name,
                        'college_state'=>$college_profile->search_data_state_name,
                        'college_logo'=>$college_logo,
                        'college_banner'=>$college_banner,
                        'college_course_full_name'=>$value->course_name,
                        'college_course_short_name'=>$value->course_short_name,
                        'college_course_placement'=>$value->user_course_placement_type,
                        'college_course_duration'=>$value->user_course_duration_year.' yrs.',
                        'college_course_duration_type'=>$value->user_course_duration_type,
                        'access_url'=>$college_profile->search_data_access_url
                    );
				}
			}

			$return['colleges']=$college_data;

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);

		}else{
			redirect(base_url());
		}
	}

}