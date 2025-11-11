<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Settings  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Settings';

			$this->theme->title($this->data['page_title'])->load('settings/vw_settings', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexSocial(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Settings';

			$this->theme->title($this->data['page_title'])->load('settings/vw_settings_social', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexServer(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Settings';

			$this->theme->title($this->data['page_title'])->load('settings/vw_settings_server', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSaveSystemSettings(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				//$ctext=post_data('ctext');

				//$security_token =$this->data['security_token'];

				//$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$settings_type 			=	decode_data(post_data('settings_type'));

				//echo $settings_type;die;


				if($settings_type=='general_settings'){
					$system_name 				=	post_data('system_name');
					$system_assests_domain 		=	post_data('system_assests_domain');
					$system_assests_domain_path =	post_data('system_assests_domain_path');
					$system_meta_title 			=	post_data('system_meta_title');
					$system_meta_desc 			=	post_data('system_meta_desc');
					$system_meta_keywords 		=	post_data('system_meta_keywords');

					$system_auto_email 			=	post_data('system_auto_email');
					$system_info_email 			=	post_data('system_info_email');
					$system_web_master_email 	=	post_data('system_web_master_email');
					$system_hr_email 			=	post_data('system_hr_email');
					$system_webmaster_ph		=	post_data('system_webmaster_ph');

					$system_gtag_manager 				=	$this->input->post('system_gtag_manager');
					$system_gtag_manager_noscript 		=	post_data('system_gtag_manager_noscript');
					$system_gaddsensetag_manager 		=	$this->input->post('system_gaddsensetag_manager');
					$system_application_ld_json 		=	$this->input->post('system_application_ld_json');


					$system_assests_domain 				=	post_data('system_assests_domain');
					$system_assests_domain_path 		=	post_data('system_assests_domain_path');


					$system_google_client_id 			=	post_data('system_google_client_id');
					$system_google_secret_key 			=	post_data('system_google_secret_key');
					$system_fb_app_secret 				=	post_data('system_fb_app_secret');

					$file_child_folder=date('Y');


					if(isset($_FILES['system_logo']) && $_FILES['system_logo']['name']!=''){

						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_logo'));

						//print_obj($file_logo_found);die;

						if(!empty($file_logo_found)){
							if(is_file($file_logo_found->media_disk_path)){
								@unlink($file_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_logo'));
							}
						}

						$logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_logo',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);

						$file_id=$this->onUploadFiles($logo_data);

						if(!empty($file_id) && $file_id>0){						

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_logo'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $syslogo=$this->sm->get_file(array('storage_id'=>$file_id));

				            if(!empty($syslogo)){
				            	$system_logo=$syslogo->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_logo'));
						$system_logo=$file_logo_found->media_disk_path_relative;
					}


					if(isset($_FILES['system_logo_white']) && $_FILES['system_logo_white']['name']!=''){

						$file_white_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_logo_white'));

						//print_obj($file_logo_found);die;

						if(!empty($file_white_logo_found)){
							if(is_file($file_white_logo_found->media_disk_path)){
								@unlink($file_white_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_white_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_logo_white'));
							}
						}

						$white_logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_logo_white',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$white_file_id=$this->onUploadFiles($white_logo_data);

						if(!empty($white_file_id) && $white_file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_logo_white'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$white_file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_logo_white'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $syswlogo=$this->sm->get_file(array('storage_id'=>$file_id,'user_storage_type'=>'system_logo_white'));

				            if(!empty($syswlogo)){
				            	$system_white_logo=$syswlogo->media_disk_path_relative;
				            }
				        } 
					}


					if(isset($_FILES['system_logo_small']) && $_FILES['system_logo_small']['name']!=''){


						$file_small_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_logo_small'));

						//print_obj($file_logo_found);die;

						if(!empty($file_small_logo_found)){
							if(is_file($file_small_logo_found->media_disk_path)){
								@unlink($file_small_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_small_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_logo_small'));
							}
						}

						$small_logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_logo_small',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$small_file_id=$this->onUploadFiles($small_logo_data);

						if(!empty($small_file_id) && $small_file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_logo_small'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$small_file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_logo_small'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $syslogosmall=$this->sm->get_file(array('storage_id'=>$small_file_id));

				            if(!empty($syslogosmall)){
				            	$system_small_logo=$syslogosmall->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_logo_small'));
						$system_small_logo=$file_logo_found->media_disk_path_relative;
					}


					if(isset($_FILES['system_favicon']) && $_FILES['system_favicon']['name']!=''){

						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_favicon'));

						//print_obj($file_logo_found);die;

						if(!empty($file_logo_found)){
							if(is_file($file_logo_found->media_disk_path)){
								@unlink($file_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_favicon'));
							}
						}

						$logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_favicon',
							'file_types'=>'png,jpg,jpeg,ico',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$file_id=$this->onUploadFiles($logo_data);

						if(!empty($file_id) && $file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_favicon'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_favicon'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $sysfavicon=$this->sm->get_file(array('storage_id'=>$file_id));

				            if(!empty($sysfavicon)){
				            	$system_favbicon=$sysfavicon->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_favicon'));
						$system_favbicon=$file_logo_found->media_disk_path_relative;
					}


					if(isset($_FILES['system_apple_store_logo']) && $_FILES['system_apple_store_logo']['name']!=''){

						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_apple_store_logo'));

						//print_obj($file_logo_found);die;

						if(!empty($file_logo_found)){
							if(is_file($file_logo_found->media_disk_path)){
								@unlink($file_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_apple_store_logo'));
							}
						}

						$logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_apple_store_logo',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$file_id=$this->onUploadFiles($logo_data);

						if(!empty($file_id) && $file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_apple_store_logo'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_apple_store_logo'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $sysapplelogo=$this->sm->get_file(array('storage_id'=>$file_id));

				            if(!empty($sysapplelogo)){
				            	$system_apple_store_logo=$sysapplelogo->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_apple_store_logo'));
						$system_apple_store_logo=$file_logo_found->media_disk_path_relative;
					}

					if(isset($_FILES['system_play_store_logo']) && $_FILES['system_play_store_logo']['name']!=''){

						$file_play_store_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_play_store_logo'));

						//print_obj($file_logo_found);die;

						if(!empty($file_logo_found)){
							if(is_file($file_logo_found->media_disk_path)){
								@unlink($file_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_play_store_logo'));
							}
						}

						$logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_play_store_logo',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$file_id=$this->onUploadFiles($logo_data);

						if(!empty($file_id) && $file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_play_store_logo'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_play_store_logo'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $sysplaystorelogo=$this->sm->get_file(array('storage_id'=>$file_id));

				            if(!empty($sysplaystorelogo)){
				            	$system_play_store_logo=$sysplaystorelogo->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_play_store_logo'));
						$system_apple_store_logo=$file_logo_found->media_disk_path_relative;
					}

					if(isset($_FILES['system_mobile_app_image']) && $_FILES['system_mobile_app_image']['name']!=''){

						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_mobile_app_image'));

						//print_obj($file_logo_found);die;

						if(!empty($file_logo_found)){
							if(is_file($file_logo_found->media_disk_path)){
								@unlink($file_logo_found->media_disk_path);
								$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								$this->sm->delete_user_file(array('user_storage_type'=>'system_mobile_app_image'));
							}
						}

						$logo_data=array(
							'file_size'=>'1',
							'file_name'=>'system_mobile_app_image',
							'file_types'=>'png,jpg,jpeg',
							'file_folder'=>'app',
							'file_child_folder'=>$file_child_folder,
							'file_compress'=>false,
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);

						//print_obj($logo_data);die;

						$file_id=$this->onUploadFiles($logo_data);

						if(!empty($file_id) && $file_id>0){

							$this->sm->delete_user_file(array('user_storage_type'=>'system_mobile_app_image'));

				            $user_logo_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>'0',
				            	'user_file_type'=>'0',
				            	'user_storage_type'=>'system_mobile_app_image'
				            );

				            $this->sm->store_user_file($user_logo_storage_data);

				            $sysmobilelogo=$this->sm->get_file(array('storage_id'=>$file_id));

				            if(!empty($sysmobilelogo)){
				            	$system_mobile_app_image=$sysmobilelogo->media_disk_path_relative;
				            }
				        } 
					}else{
						$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'system_mobile_app_image'));
						$system_mobile_app_image=$file_logo_found->media_disk_path_relative;
					}

					$get_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));

					if(!empty($get_settings)){
						$deleted=$this->sm->delete_settings(array('settings_key'=>'config_system_general_settings'));
					}

					$system_settings=array(
						'settings_key'=>'config_system_general_settings',
						'settings_value'=>json_encode(array(
							'system_name'=>$system_name,
							'system_title'=>$system_name,
							'system_meta_title'=>$system_meta_title,
							'system_meta_desc'=>$system_meta_desc,
							'system_meta_keywords'=>$system_meta_keywords,
							'system_auto_email'=>$system_auto_email,
							'system_info_email'=>$system_info_email,
							'system_web_master_email'=>$system_web_master_email,
							'system_hr_email'=>$system_hr_email,
							'system_webmaster_ph'=>$system_webmaster_ph,
							'system_gtag_manager'=>$system_gtag_manager,
							'system_gtag_manager_noscript'=>$system_gtag_manager_noscript,
							'system_gaddsensetag_manager'=>$system_gaddsensetag_manager,
							'system_application_ld_json'=>$system_application_ld_json,
							'system_google_client_id'=>$system_google_client_id,
							'system_google_secret_key'=>$system_google_secret_key,
							'system_fb_app_secret'=>$system_fb_app_secret,
							'system_assests_domain'=>$system_assests_domain,
							'system_assests_domain_path'=>$system_assests_domain_path,
							'system_logo'=>$system_logo,
							'system_logo_white'=>$system_white_logo,
							'system_logo_small'=>$system_small_logo,
							'system_favicon'=>$system_favbicon,
							'system_apple_store_logo'=>$system_apple_store_logo,
							'ystem_play_store_logo'=>$system_play_store_logo,
							'system_mobile_app_image'=>$system_mobile_app_image
						))
					);


				}else if($settings_type=='social_settings'){
					$system_facebook_link 	=	clean_data($decrypted['system_facebook_link']);
					$system_google_link 	=	clean_data($decrypted['system_google_link']);
					$system_linkedin_link 	=	clean_data($decrypted['system_linkedin_link']);
					$system_twitter_link 	=	clean_data($decrypted['system_twitter_link']);

					$get_settings=$this->sm->get_settings(array('settings_key'=>'config_system_social_settings'));

					if(!empty($get_settings)){
						$deleted=$this->sm->delete_settings(array('settings_key'=>'config_system_social_settings'));
					}

					$system_settings=array(
						'settings_key'=>'config_system_social_settings',
						'settings_value'=>json_encode(array(
							'system_facebook_link'=>$system_facebook_link,
							'system_google_link'=>$system_google_link,
							'system_linkedin_link'=>$system_linkedin_link,
							'system_twitter_link'=>$system_twitter_link
						))
					);
				}else if($settings_type=='email_settings'){
					$system_contact_email 	=	clean_data($decrypted['system_contact_email']);
					$system_webmaster_email =	clean_data($decrypted['system_webmaster_email']);
					$system_webmaster_ph 	=	clean_data($decrypted['system_webmaster_ph']);

					$get_settings=$this->sm->get_settings(array('settings_key'=>'config_system_email_settings'));

					if(!empty($get_settings)){
						$deleted=$this->sm->delete_settings(array('settings_key'=>'config_system_email_settings'));
					}

					$system_settings=array(
						'settings_key'=>'config_system_email_settings',
						'settings_value'=>json_encode(array(
							'system_contact_email'=>$system_contact_email,
							'system_webmaster_email'=>$system_webmaster_email,
							'system_webmaster_ph'=>$system_webmaster_ph
						))
					);
				}
				

				$inserted=$this->sm->store_settings($system_settings);

				if($inserted){

					// if(!is_file(DIR_UPLOADS.'/app')){
					// 	@mkdir(DIR_UPLOADS.'/app', 0777);
					// }													

					// if(isset($_FILES['system_logo']) && $_FILES['system_logo']['name']!=''){
					// 	$system_logo_data=$this->sm->get_file(array('media_type'=>'system_logo'));

					// 	if(!empty($system_logo_data)){
					// 		if(is_file($system_logo_data->media_disk_path)){
					// 			@unlink($system_logo_data->media_disk_path);
					// 		}

					// 		$this->sm->delete_file(array('media_type'=>'system_logo'));
					// 	}

					// 	$system_logo=array(
					// 		'file_name'=>'system_logo',
					// 		'file_types'=>'png,jpg,jpeg',
					// 		'file_type'=>'system_logo',
					// 		'file_type_id'=>$inserted,
					// 		'file_absolute_path'=>'app/',
					// 		'file_relative_path'=>'app'
					// 	);

					// 	$this->onUploadFiles($system_logo);
					// }

					// if(isset($_FILES['system_logo_white']) && $_FILES['system_logo_white']['name']!=''){
					// 	$system_logowhite__data=$this->sm->get_file(array('media_type'=>'system_logo_white'));

					// 	if(!empty($system_logowhite__data)){
					// 		if(is_file($system_logowhite__data->media_disk_path)){
					// 			@unlink($system_logowhite__data->media_disk_path);
					// 		}

					// 		$this->sm->delete_file(array('media_type'=>'system_logo_white'));
					// 	}

					// 	$system_logo=array(
					// 		'file_name'=>'system_logo_white',
					// 		'file_types'=>'png,jpg,jpeg',
					// 		'file_type'=>'system_logo_white',
					// 		'file_type_id'=>$inserted,
					// 		'file_absolute_path'=>'app/',
					// 		'file_relative_path'=>'app'
					// 	);

					// 	$this->onUploadFiles($system_logo);
					// }

					// $system_favicon_data=$this->sm->get_file(array('media_type'=>'system_favicon'));													

					// if(isset($_FILES['system_favicon']) && $_FILES['system_favicon']['name']!=''){
					// 	if(!empty($system_favicon_data)){
					// 		if(is_file($system_favicon_data->media_disk_path)){
					// 			@unlink($system_favicon_data->media_disk_path);
					// 		}

					// 		$this->sm->delete_file(array('media_type'=>'system_favicon'));
					// 	}

					// 	$system_logo=array(
					// 		'file_name'=>'system_favicon',
					// 		'file_types'=>'png,jpg,jpeg,ico',
					// 		'file_type'=>'system_favicon',
					// 		'file_type_id'=>$inserted,
					// 		'file_absolute_path'=>'app/',
					// 		'file_relative_path'=>'app'
					// 	);

					// 	$this->onUploadFiles($system_logo);
					// }


					$return['success']='System settings updated successfully';
				}else{
					$return['error']='System settings not updated';
				}

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}	
	}


	public function onUpdateEditorVersion(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$editor_key=$this->input->post('editor_key');

				$updated=$this->sm->update_settings(array('settings_value'=>$editor_key),array('settings_key'=>'config_tinymce_key'));

				if($updated){
					$this->output->delete_cache();
					$return['success']='Editor version updated successfully';
				}else{
					$return['error']='Editor version not updated';
				}

				header('Content-Type: application/json; charset=utf-8');				
				echo json_encode($return);
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}
}