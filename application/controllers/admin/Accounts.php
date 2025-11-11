<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Accounts  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(!session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Login';

			$this->theme->title($this->data['page_title'])->load('accounts/vw_login', $this->data);

			//News Slug generation
			// $news=$this->nm->get_news(array('is_published'=>'1'),FALSE);

			// foreach ($news as $key => $value) {
			// 	$slug=url_slug($value->news_title);
			// 	$slug_url=base_url('news/'.$slug);
				
			// 	$get_slug=$this->sm->get_slug(array('slug_type'=>'11','slug_type_id'=>$value->news_id,'slug_value'=>$slug));
			// 	if(empty($get_slug)){
			// 		echo $this->sm->store_slug(array('slug_type'=>'11','slug_type_id'=>$value->news_id,'slug_value'=>$slug)).'<br>';
			// 	}
			// }
		}else{

			redirect($this->data['admin_base_url'].'/dashboard');
		}
	}


	function indexProfile(){
		if(!session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Login';

			redirect($this->data['admin_base_url']);
		}else{

			$this->data['page_title']='My Profile';

			$userdata=$this->data['userdata'];

			//print_obj($userdata);die;

			$userdata_account_data=array(
				'user_name'=>$userdata->user_name,
				'user_fullname'=>$userdata->user_fullname,
				'user_email'=>$userdata->user_email,
				'user_phone_no'=>$userdata->user_phone_no,
				'user_bank_details_added'=>$userdata->user_bank_account_added,
				'user_bank_name'=>$userdata->user_bank_name,
				'user_bank_acc'=>$userdata->user_bank_acc,
				'user_bank_acc_name'=>$userdata->user_bank_acc_name,
				'user_bank_ifcs'=>$userdata->user_bank_ifsc,
				'user_per_month_upload_quota'=>$userdata->user_per_month_data_upload_quota,
				'user_per_upload_amount'=>$userdata->user_per_upload_amount,
				'user_image'=>$this->data['user_image']
			);

			$this->data['profile_data']=$userdata_account_data;


			$this->theme->title($this->data['page_title'])->load('accounts/vw_profile', $this->data);
		}
	}


	function onSystemLogin(){
		echo 'System login';
	}

	public function onAdminLogin(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$ctext=post_data('ctext');

			$security_token = $this->data['security_token'];

			$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

			if($decrypted!=null){

				$username 		= 	clean_data($decrypted['user_name']);
				$password 		=	clean_data($decrypted['user_password']);
				$current_date	=	date('Y-m-d H:i:s');

				//echo $password;die;

				if(valid_email($username) || is_string($username) || is_numeric($username)){
					$param 			= 	array('user_name'=>$username);

					$userdata 		=	$this->um->_get_internal_user($param,FALSE);

					//print_obj($userdata);die;

					//if($userdata!='' && in_array($userdata->user_role, array(1,2))){
						if($userdata!='' && ($userdata->user_blocked==1)){

							if(password_verify($password,$userdata->user_password)){
								$token=token();
								$this->um->update_internal_user(array('user_login_token'=>$token,'user_last_login_time'=>date('Y-m-d H:i:s')),array('user_id'=>$userdata->user_id));
								$session_data=array(
									'isAdminLoggedin'=>true,
									'admin_id'=>encode_data($userdata->user_id),
									'admin_role'=>$userdata->user_role,
									'admin_token'=>encode_data($token),
									'loggedin_time'=>time()
								);

								session_set_userdata($session_data);

								// if($userdata->user_role=='5' && $userdata->user_bank_account_added=='2'){
								// 	$return['redirect'] = $this->data['admin_base_url'].'/profile';
								// }else{
								// 	$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
								// }

								$return['redirect'] = $this->data['admin_base_url'].'/dashboard';

				            	
								$return['success']='Loggedin successfully';
							}else{
								$return['error']='Credentials are invalid';
								$return['hash']=$this->security->get_csrf_hash();			
							}

						}else if($userdata!='' && ($userdata->user_blocked==2)){
							$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
							$return['error']='Your id is deactivated.';
						}else{
							$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
							$return['error']='Credentials are invalid';	
						}
					// }else{
					// 	$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
					// 	$return['error']='Credentials are invalid';	
					// }						
				}else{
					$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
					$return['error']='Credentials are invalid';	
				}
			}else{
				$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
				$return['error']='Request can not be served now.';
			}

					

			header('Content-Type: application/json; charset=utf-8');

        	echo json_encode($return);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAdminLogout(){
		if(session_userdata('admin_id') && session_userdata('isAdminLoggedin')==TRUE){
			$this->um->update_user_data(array('user_login_token'=>NULL),array('user_id'=>decode_data(session_userdata('admin_id'))));
			$this->sm->delete_security_settings(array('security_token_ip'=>$this->input->ip_address(),'security_token_user_type'=>'1'));
			$this->session->sess_destroy();
			redirect($this->data['admin_base_url']);	
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateAccountData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));

				$data_update_type=post_data('update_type');

				if($data_update_type=='profile_data'){

					$profile_bank_acc_name=post_data('profile_bank_acc_name');
					$profile_bank_acc=post_data('profile_bank_acc');
					$profile_bank_name=post_data('profile_bank_name');
					$profile_bank_ifsc=post_data('profile_bank_ifsc');

					$profile_phone_no=post_data('profile_phone_no');


					$user_data=$this->um->_get_internal_user(array('user_id'=>$user_id));

					$folder=date('Y');

					//print_obj($user_data);die;

					if(!empty($user_data)){

						$data_to_update=array(
							'user_bank_account_added'=>'1',
							'user_bank_name'=>$profile_bank_name,
							'user_bank_acc_name'=>$profile_bank_acc_name,
							'user_bank_acc'=>$profile_bank_acc,
							'user_bank_ifsc'=>$profile_bank_ifsc,
							'user_phone_no'=>$profile_phone_no
						);

						$updated=$this->um->update_internal_user_profile_data($data_to_update,array('user_m_id'=>$user_id));

						if($updated){

							if(isset($_FILES['profile_photo']) && $_FILES['profile_photo']['name']!=''){

								$file_found=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$user_id));

								//print_obj($file_logo_found);die;

								if(!empty($file_found)){
									if(is_file($file_found->media_disk_path)){
										@unlink($file_found->media_disk_path);
										$this->sm->delete_file(array('storage_id'=>$file_found->storage_id));
									}
								}

								$ext = pathinfo($_FILES['file_browse']['name'], PATHINFO_EXTENSION);


								$image_data=array(
									'file_size'=>'1',
									'file_name'=>'profile_photo',
									'file_types'=>'png,jpg,jpeg,webp',
									'file_folder'=>'users',
									'file_child_folder'=>$folder,
									'file_compress'=>($ext==='webp')?false:true,
									'file_compress_protocol'=>'webp',
									'file_uploaded_by'=>$user_id
								);

								$file_id=$this->onUploadFiles($image_data);

								if(!empty($file_id) && $file_id>0){

									$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_image'));

						            $user_image_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>$user_id,
						            	'user_file_type'=>'5',
						            	'user_storage_type'=>'user_image'
						            );

						            $this->sm->store_user_file($user_image_storage_data);
						        } 
							}

							if($user_data->user_bank_account_added=='1'){
								$msg='Data has been updated successfully.';
							}else{
								$msg='Data has been updated successfully.Now you can access the system.';
							}


							$return['success']=$msg;
						}else{
							$return['error']='Data can not be updated at this momment.try again later.';
						}

					}else{
						$return['error']='Data not found in the system.';
					}
				}else if($data_update_type=='profile_user_data'){

					$ctext=post_data('ctext');

					$security_token = $this->data['security_token'];

					$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

					if($decrypted!=null){
						$old_password=clean_data($decrypted['user_old_password']);
						$new_password=clean_data($decrypted['user_new_password']);

						$param 			= 	array('user_id'=>$user_id);

						$userdata 		=	$this->um->_get_internal_user($param,FALSE);

						if(password_verify($old_password,$userdata->user_password)){
							$password=password_hash($new_password, PASSWORD_BCRYPT, array('cost'=>12));

							$user_data=array(
								'user_password'=>$password,
								'user_password_visible'=>encode_data($input_user_password),
								'updated_by'=>$user_id,
								'updated_by_type'=>$userdata->user_role
							);

							$updated=$this->um->update_internal_user($user_data,$param);

							if($updated){
								$return['success']='Password chnaged successfully.';
							}else{
								$return['error']='Password can not be changed.';
							}
						}else{
							$return['error']='Old password not matched';
						}

					}else{
						$return['redirect'] = $this->data['admin_base_url'].'/dashboard';
						$return['error']='Request can not be served now.';
					}
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

}