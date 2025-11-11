<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH."third_party/PHPExcel.php";
require_once APPPATH."third_party/PHPExcel/IOFactory.php";

/**
 * 
 */
class Users  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Users';

			$this->theme->title($this->data['page_title'])->load('users/vw_users', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexSystemUsers(){
		if(session_userdata('isAdminLoggedin')){
			$_user_id=$this->uri->segment(5,0);
			$this->data['page_title']='System Users';

			$states=$this->com->get_states(array('state_country_id'=>'99','state_status'=>'1'));

			if(!empty($states)){
				foreach ($states as $key => $value) {
					$_states[]=array(
						'state_id'=>encode_data($value->state_id),
						'state_name'=>$value->state_name
					);
				}
			}

			$this->data['states']=$_states;

			if($_user_id!='0'){
				$user_id=decode_data($_user_id);

				//echo $user_id;die;

				$userdata=$this->um->_get_internal_user(array('user_id'=>$user_id));

				$this->data['internal_userdata']=$userdata;


				$this->theme->title($this->data['page_title'])->load('users/vw_system_users_stats', $this->data);
			}else{

				$countries=$this->com->get_country(array('country_status'=>'1','country_id'=>'99'),FALSE,'country_serial','ASC');

				if(!empty($countries)){
					foreach ($countries as $key => $value) {
						$_countries[]=array(
							'country_id'=>encode_data($value->country_id),
							'country_name'=>$value->country_name
						);
					}
				}


				$this->data['countries']=$_countries;
				

				$this->theme->title($this->data['page_title'])->load('users/vw_system_users', $this->data);
			}


		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexCollegeUsers(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='System Users';

			$this->theme->title($this->data['page_title'])->load('users/vw_college_users', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexUniversityUsers(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='System Users';

			$this->theme->title($this->data['page_title'])->load('users/vw_university_users', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexSchoolUsers(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='System Users';

			$this->theme->title($this->data['page_title'])->load('users/vw_school_users', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexAdd(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Add User';

			$this->theme->title($this->data['page_title'])->load('users/vw_users_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexEdit(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Edit User';

			$_user_id=$this->uri->segment(4);

			$user_id=decode_data($_user_id);

			$userdata=$this->um->get_user_data(array('user_id'=>$user_id));

			$this->data['user_data_image']=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user_id));			
			
			$this->data['user_permissions']=explode(',', $userdata->user_permissions);
				

			$this->data['user_data']=$userdata;

			$this->data['_user_id']=$_user_id;

			$this->theme->title($this->data['page_title'])->load('users/vw_users_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAddUsers(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_user_id=post_data('_user');
				$user_type=post_data('user_type');
				$user_abbr=post_data('user_abbr');
				$user_first_name=post_data('user_first_name');
				$user_middle_name=post_data('user_middle_name');
				$user_last_name=post_data('user_last_name');
				$user_email=post_data('user_email');
				$user_phone_no=post_data('user_phone_no');
				$user_gender=post_data('user_gender');
				$user_password=post_data('user_password');
				$user_status=post_data('user_status');
				$user_address=post_data('user_address');
				$user_permissions=$this->input->post('permissions');

				$password	=	($user_password!='')?password_hash($user_password, PASSWORD_BCRYPT, array('cost'=>12)):'';

				if($user_type==3){
					$user_code_abbr='MGMT';
				}else if($user_type==4){
					$user_code_abbr='PLYR';
				}else if($user_type==5){
					$user_code_abbr='COH';
				}else if($user_type==6){
					$user_code_abbr='OFFL';
				}

				if(valid_email($user_email)){
					if($_user_id==''){
						$get_user_email_duplicate=$this->um->get_total_user_profiles(array('user_email'=>$user_email));
						$get_user_phone_duplicate=$this->um->get_total_user_profiles(array('user_phone_no'=>$user_phone_no));

						if($get_user_email_duplicate==0 && $get_user_phone_duplicate==0){

							$total_users=$this->um->get_total_users(array('user_role_id'=>$user_type));
							$code=($total_users>0)?($total_users+1):1;
							$user_code=acronym($user_code_abbr,$code);

							$user_data_to_insert=array(
								'user_role_id'=>$user_type,
								'user_name'=>$user_email,
								'user_password'=>$password,
								'user_blocked'=>$user_status,
								'user_permissions'=>(!empty($user_permissions))?char_separated($user_permissions):null,
							);

							$inserted=$this->um->add_user_data($user_data_to_insert);

							if($inserted){
								$user_profile_data_to_insert=array(
									'user_pk_id'=>$inserted,
									'user_code'=>$user_code,
									'user_abbr'=>$user_abbr,
									'user_first_name'=>$user_first_name,
									'user_middle_name'=>$user_middle_name,
									'user_last_name'=>$user_last_name,
									'user_email'=>$user_email,
									'user_phone_no'=>$user_phone_no,
									'user_address'=>$user_address,
									'user_gender'=>$user_gender,
									'created_by'=>session_userdata('admin_id')
								);

								$profile_data_inserted=$this->um->add_user_profile_data($user_profile_data_to_insert);

								if($profile_data_inserted){
									$this->um->update_user_data(array('user_profile_pk_id'=>$profile_data_inserted),array('user_id'=>$inserted));

									if(!is_file(DIR_UPLOADS.'/users')){
										@mkdir(DIR_UPLOADS.'/users', 0777);
									}									

									if(isset($_FILES['file_user_image']) && $_FILES['file_user_image']['name']!=''){
										$user_image=array(
											'file_name'=>'file_user_image',
											'file_types'=>'png,jpg,jpeg',
											'file_type'=>'user_image',
											'file_type_id'=>$inserted,
											'file_absolute_path'=>'users/',
											'file_relative_path'=>'users'
										);

										$this->onUploadFiles($user_image);
									}
								}

								$return['success']='User registered in the system successfully.';
							}else{
								$return['error']='There was an error occurred to upload data.Please try after some time.';
							}

						}else if($get_user_email_duplicate>0 && $get_user_phone_duplicate==0){
							$return['error']='Duplicate Email address found.';
						}else if($get_user_email_duplicate==0 && $get_user_phone_duplicate>0){
							$return['error']='Duplicate Phone No. found.';
						}else if($get_user_email_duplicate>0 && $get_user_phone_duplicate>0){
							$return['error']='Duplicate Email address & Phone No. found.';
						}
					}else{
						$user_id=decode_data($_user_id);
						$get_user_email_duplicate=$this->um->get_total_user_profiles(array('user_email'=>$user_email,'user_pk_id!='=>$user_id));
						$get_user_phone_duplicate=$this->um->get_total_user_profiles(array('user_phone_no'=>$user_phone_no,'user_pk_id!='=>$user_id));

						if($get_user_email_duplicate==0 && $get_user_phone_duplicate==0){
							if($password!=''){
								$user_data_to_insert=array(
									'user_role_id'=>$user_type,
									'user_name'=>$user_email,
									'user_password'=>$password,
									'user_blocked'=>$user_status,
									'user_permissions'=>(!empty($user_permissions))?char_separated($user_permissions):null,
								);
							}else{
								$user_data_to_insert=array(
									'user_role_id'=>$user_type,
									'user_name'=>$user_email,
									'user_blocked'=>$user_status,
									'user_permissions'=>(!empty($user_permissions))?char_separated($user_permissions):null,
								);
							}	
								

							$updated=$this->um->update_user_data($user_data_to_insert,array('user_id'=>$user_id));

							if($updated){

								if(isset($_FILES['file_user_image']) && $_FILES['file_user_image']['name']!=''){
									$_user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user_id));
									if($_user_image){
										if(is_file($_user_image->media_disk_path)){
											@unlink($_user_image->media_disk_path);
										}

										$this->sm->delete_file(array('media_type'=>'user_image','media_type_data_id'=>$user_id));
									}
									$user_image=array(
										'file_name'=>'file_user_image',
										'file_types'=>'png,jpg,jpeg',
										'file_type'=>'user_image',
										'file_type_id'=>$user_id,
										'file_absolute_path'=>'users/',
										'file_relative_path'=>'users'
									);

									$this->onUploadFiles($user_image);
								}

								$user_profile_data_to_insert=array(
									'user_abbr'=>$user_abbr,
									'user_first_name'=>$user_first_name,
									'user_middle_name'=>$user_middle_name,
									'user_last_name'=>$user_last_name,
									'user_email'=>$user_email,
									'user_phone_no'=>$user_phone_no,
									'user_address'=>$user_address,
									'user_gender'=>$user_gender,
									'updated_by'=>session_userdata('admin_id')
								);

								$this->um->update_user_profile_data($user_profile_data_to_insert,array('user_pk_id'=>$user_id));

								$return['success']='User updated in the system successfully.';
							}else{
								$return['error']='User data not updated';
							}
						}else if($get_user_email_duplicate>0 && $get_user_phone_duplicate==0){
							$return['error']='Duplicate Email address found.';
						}else if($get_user_email_duplicate==0 && $get_user_phone_duplicate>0){
							$return['error']='Duplicate Phone No. found.';
						}else if($get_user_email_duplicate>0 && $get_user_phone_duplicate>0){
							$return['error']='Duplicate Email address & Phone No. found.';
						}
					}
				}else{
					$return['error']='Email address is not valid';
				}


			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onDeleteUser(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_user_id=post_data('_user');
				$user_id=decode_data($_user_id);

				$userdata=$this->um->get_user_data(array('user_id'=>$user_id));

				if(!empty($userdata)){
					$deleted=$this->um->delete_user_data(array('user_id'=>$user_id));
					if($deleted){
						$this->um->delete_user_profile_data(array('user_pk_id'=>$user_id));
						$return['success']='User deleted from the system';
					}else{
						$return['error']='User not deleted from the system';
					}
				}else{
					$return['error']='Userdata not found in the system';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onSearchExternalUsersList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				
				// $param['order'] = array('user_id' => 'DESC');

				// $posts=$this->input->post();

				// if(!empty($posts) && !empty($posts['user_type']) && is_numeric($posts['user_type'])){
				// 	$param['users_type']=$posts['user_type'];
				// 	if($param['users_type']=='4'){
				// 		$param['column_order'] = array(
				// 			null,
				// 			'college_name',
				// 			'college_email',
				// 			'college_phone_no'
				// 		);

				// 		$param['column_search'] = array('college_name','user_name','college_email','college_phone_no');
				// 	}
						
				// }else{
				// 	$param['column_order'] = array(
				// 		null,
				// 		'user_fullname',
				// 		'user_email',
				// 		'user_code',
				// 		'user_phone_no'
				// 	);

				// 	$param['column_search'] = array('user_fullname','user_name','user_email','user_phone_no','user_code');
				// }


				// $list = $this->um->_get_users($posts,$param,FALSE,FALSE);

				$param['column_order'] = array(
					null,
					'college_name',
					'country_name',
					'state_name',
					'college_estd_year'
				);

				$param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no');
				$param['order'] = array('college_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->im->_get_colleges($posts,$param,FALSE,FALSE);

				//print_obj($list);die;

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();
					//$user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user->user_id));

					$action='<div class="btn-group btn-group-sm">
					<button type="button" class="btn btn-xs btn-primary btn_user_update" data-id="'.encode_data($user->user_id).'" data-user_name="'.$user->user_name.'" data-toggle="modal" data-target="#userRegModal"><i class="fa fa-pen"></i></button>
					<button type="button" class="btn btn-xs btn-danger btn_del_user" data-aid="'.encode_data($user->user_id).'"><i class="fa fa-trash"></i></button>
					</div>';

					// if($user->user_role_id=='2'){
					// 	$user_type='Admin';
					// }else if($user->user_role_id=='3'){
					// 	$user_type='Management';
					// }else if($user->user_role_id=='4'){
					// 	$user_type='Player';
					// }else if($user->user_role_id=='5'){
					// 	$user_type='Coach';
					// }else if($user->user_role_id=='6'){
					// 	$user_type='Official';
					// }

					$encoded_user_id=encode_data($user->user_id);
					
					$row[]	=	$no;
					//$row[]	=	$user_type;
					//$row[]	=	$user->user_code;
					// if(!empty($user_image)){
					// 	$row[]	=	'<img src="'.$user_image->media_disk_path_relative.'" class="table-user-thumb" alt="">';
					// }else{
					// 	$row[]	=	'';
					// }

					if($user->user_login_token!=null){
						$online_status='[ Online ]';
					}else{
						$online_status='[ Offline ]';
					}

					$user_name=$user->user_name;
					$password=decode_data($user->user_password_visible);

					
					if($user->user_registration_type=='self'){
						$college_name	=	'<strong style="color:green;">'.$user->college_name.'</strong><br>Username:'.$user_name.'<br>Password:'.$password;
					}else{
						$college_name 	=	$user->college_name.'<br>Username:'.$user_name.'<br>Password:'.$password;
					}
					

					$row[]	= $college_name;


					//.'-'.$user->user_estd_year.'-'.$user->user_state.'.'.$user->user_city;					
					$row[]	=	$user->college_phone_no;
					$row[]	=	$user->college_email;
					//$row[]	=	$user_name;
					//$row[]	=	$password;
					if($user->user_blocked==1){
						$row[]  =	'<button class="btn btn-xs btn-success">Active</button>';
					}else if($user->user_blocked==2){
						$row[]  =	'<button class="btn btn-xs btn-danger">Deactive</button>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_colleges($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_colleges($posts,$param,TRUE),
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


	public function onSearchInternalUsersList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'user_fullname',
					'user_email',
					'user_code',
					'user_phone_no'
				);

				$param['column_search'] = array('user_fullname','user_name','user_email','user_phone_no','user_code');
				$param['order'] = array('user_id' => 'DESC');

				$posts=$this->input->post();

				$param['users_type_not']='1';

				$list = $this->um->_get_internal_users($posts,$param,FALSE,FALSE);

				$month=date('m')-1;
				$this_month=date('m');
				$year=date('Y');
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();					

					//Created By
					$_param['month']=$this_month;
					$_param['year']=$year;
					$_param['created_by']=$user->user_id;

					$total_college_uploaded = $this->im->_get_colleges(null,$_param,TRUE,FALSE);
					//$total_university_uploaded = $this->im->_get_universities(null,$_param,TRUE,FALSE);

					//Updated By
					$___param['updated_month']=$this_month;
					$___param['updated_year']=$year;
					$___param['updated_by']=$user->user_id;

					$total_college_updated = $this->im->_get_colleges(null,$___param,TRUE,FALSE);
					//$total_university_updated = $this->im->_get_universities(null,$___param,TRUE,FALSE);

					//Today
					$__param['created_at']=date('Y-m-d');
					$__param['created_by']=$user->user_id;

					$total_college_uploaded_today = $this->im->_get_colleges(null,$__param,TRUE,FALSE);


					$____param['updated_at']=date('Y-m-d');
					$____param['updated_by']=$user->user_id;

					$total_college_updated_today = $this->im->_get_colleges(null,$____param,TRUE,FALSE);

					$total_uploaded_today=$total_college_uploaded_today+$total_college_updated_today;

					if($this->data['userdata']->user_role=='1'){
						$action='<div class="btn-group btn-group-sm">
						<button type="button" class="btn btn-xs btn-primary btn_user_update" data-id="'.encode_data($user->user_id).'" data-user_name="'.$user->user_name.'" data-toggle="modal" data-target="#userRegModal"><i class="fa fa-pen"></i></button>
						<button type="button" class="btn btn-xs btn-danger btn_del_internal_user" data-id="'.encode_data($user->user_id).'"><i class="fa fa-trash"></i></button>
						</div>';
					}else{
						$action='';
					}

					
		

					$encoded_user_id=encode_data($user->user_id);
					
					$row[]	=	$no;

					if($user->user_login_token!=null){
						$online_status='[ Online ]';
					}else{
						$online_status='[ Offline ]';
					}

					$row[]	=	$user->user_name.$online_status.'<br><strong>College Created in '.date('F').':'.$total_college_uploaded.'</strong><br><strong>College Updated in '.date('F').':'.$total_college_updated.'</strong><br><strong>College Created Today :'.$total_college_uploaded_today.'</strong><br><strong>College Updated Today :'.$total_college_updated_today.'</strong><br><strong>Total Data Uploaded Today (created+updated) :'.$total_uploaded_today.'</strong><br><a href="'.$this->data['admin_base_url'].'/users/internal/stat/'.encode_data($user->user_id).'" class="btn btn-sm btn-warning">Stat</a>';

					$row[]	=	ucwords($user->user_fullname).'<br>'.$user->user_role_name;					
					$row[]	=	$user->user_phone_no;
					$row[]	=	$user->user_email;
					
					$row[]	=	$user->user_per_month_data_upload_quota;
					$row[]	=	$user->user_per_upload_amount;

					if($user->user_blocked==1){
						$row[]  =	'<button class="btn btn-xs btn-success btn_single_data_update" data-aid="'.encode_data($user->user_id).'" data-val="'.encode_data('deactive').'" data-field="'.encode_data('user_status').'">Active</button>';
					}else if($user->user_blocked==2){
						$row[]  =	'<button class="btn btn-xs btn-danger btn_single_data_update" data-aid="'.encode_data($user->user_id).'" data-val="'.encode_data('active').'" data-field="'.encode_data('user_status').'">Deactive</button>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_internal_users($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_internal_users($posts,$param,TRUE),
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

	public function onAddInternalUsers(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=session_userdata('admin_id');

				$input_user=post_data('input_user');

				$input_user_name=post_data('input_user_name');

				$input_full_name=post_data('input_full_name');
				$input_user_email=post_data('input_user_email');
				$input_user_phone=post_data('input_user_phone');
				$input_user_name=post_data('input_user_name');
				$input_user_password=post_data('input_user_password');
				$input_user_type=post_data('input_user_type');
				$input_user_gender=post_data('input_user_gender');
				$input_user_dob=post_data('input_user_dob');
				$input_user_doj=post_data('input_user_doj');


				$input_user_country=post_data('input_user_country');
				$input_user_state=post_data('input_user_state');
				$input_user_city=post_data('input_user_city');
				$input_user_address=post_data('input_user_address');
				$input_user_pincode=post_data('input_user_pincode');


				$input_user_permission_type=post_data('input_user_permission_type');
				$input_user_permissions=$this->input->post('input_user_permissions');
				$input_user_status=post_data('input_user_status');
				$input_user_approved=post_data('input_user_approved');


				$input_data_quota=post_data('input_data_quota');

				$input_data_quota_amount=post_data('input_data_quota_amount');

				$input_data_quota_per_day=post_data('input_data_quota_per_day');

				$input_exam_data_quota_amount=post_data('input_exam_data_quota_amount');

				if(empty($input_user)){
					$user_profile_found=$this->um->get_user_profile_duplicate(array('user_email'=>$input_user_email),'user_email');
					$user_found=$this->um->get_internal_user_duplicate(array('user_name'=>$input_user_name),'user_name');

					//print_obj($user_found[0]->counted);die;

					if($user_profile_found[0]->counted==0 && $user_found[0]->counted==0){

						$country_id=decode_data($input_user_country);
						$state_id=decode_data($input_user_state);
						$city_id=decode_data($input_user_city);

						$dob=(!empty($input_user_dob))?date('Y-m-d',strtotime($input_user_dob)):null;
						$doj=(!empty($input_user_doj))?date('Y-m-d',strtotime($input_user_doj)):null;

						$permissions=(!empty($input_user_permissions))?char_separated($input_user_permissions):null;

						$user_profile_data=array(
							'user_fullname'=>$input_full_name,
							'user_gender'=>$input_user_gender,
							'user_email'=>$input_user_email,
							'user_phone_no'=>$input_user_phone,
							'user_dob'=>$dob,
							'user_doj'=>$doj,
							'user_country'=>$country_id,
							'user_state'=>$state_id,
							'user_city'=>$city_id,
							'user_pincode'=>$input_user_pincode,
							'user_address'=>$input_user_address,
							'user_per_day_data_upload_quota'=>$input_data_quota_per_day,
							'user_per_month_data_upload_quota'=>$input_data_quota,
							'user_per_upload_amount'=>$input_data_quota_amount,
							'user_per_exam_stream_data_upload_amount'=>$input_exam_data_quota_amount,
							'user_per_review_amount'=>$input_review_amount
						);

						//print_obj($user_profile_data);die;

						$profile_id=$this->um->add_internal_user_profile_data($user_profile_data);

						if($profile_id){
							$password=password_hash($input_user_password, PASSWORD_BCRYPT, array('cost'=>12));

							if($input_user_type=='2'){
								$role_name='Admin';
							}else if($input_user_type=='5'){
								$role_name='Data Entry Operator';
							}

							$user_data=array(
								'user_role'=>$input_user_type,
								'user_role_name'=>$role_name,
								'user_profile_pk_id'=>$profile_id,
								'user_name'=>$input_user_name,
								'user_password'=>$password,
								'user_password_visible'=>encode_data($input_user_password),
								'user_blocked'=>'1',
								'user_approved'=>'1',
								'user_email_verified'=>'1',
								'user_permissions'=>$permissions,
								'user_created_through'=>'1',
								'created_by'=>$user_id
							);

							$user_id=$this->um->add_internal_user_data($user_data);

							if($user_id){
								$updated=$this->um->update_internal_user_profile_data(array('user_m_id'=>$user_id),array('user_profile_id'=>$profile_id));

								if($updated){

									//print_obj($this->data['system_general_settings']);die;

									$login_link=$this->data['admin_base_url'];

									if(isset($this->data['system_general_settings']->system_logo) && $this->data['system_general_settings']->system_logo!=''){
										$logo=$this->data['system_general_settings']->system_logo;
									}else{
										$logo='';
									}

									$mail_data['from']=$this->data['system_general_settings']->system_hr_email;
									$mail_data['from_name']=$this->data['system_general_settings']->system_name;
									$mail_data['to']=$input_user_email;
									$mail_data['subject']='Account Activation';
									$mail_data['data']=array(
										'system_logo'=>$logo,
										'system_name'=>$this->data['system_general_settings']->system_name,
										'system_hr_email'=>$this->data['system_general_settings']->system_hr_email,
										'system_facebook_link'=>$this->data['system_social_settings']->system_facebook_link,
										'system_instagram_link'=>$this->data['system_social_settings']->system_instagram_link,
										'system_linkedin_link'=>$this->data['system_social_settings']->system_linkedin_link,
										'system_youtube_link'=>$this->data['system_social_settings']->system_youtube_link,
										'system_twitter_link'=>$this->data['system_social_settings']->system_twitter_link,
										'system_twitter_image'=>base_url().'uploads/app/default/image-2.png',
										'system_facebook_image'=>base_url().'uploads/app/default/image-4.png',
										'system_linkedin_image'=>base_url().'uploads/app/default/image-5.png',
										'system_youtube_image'=>base_url().'uploads/app/default/image-6.png',
										'system_instagram_image'=>base_url().'uploads/app/default/image-7.png',
										'welcome_image'=>base_url().'uploads/app/default/image-10.gif',
										'user_full_name'=>$input_full_name,
										'user_name'=>$input_user_email,
										'user_password'=>$input_user_password,
										'login_link'=>$login_link,
										'today_date'=>date('F d,Y')
									);

									$mail_data['view']='_email/vw_account_activation_mail';

									//print_obj($mail_data);die;

									send_system_mail($mail_data,'html');
								}

								$return['success']='User created successfully';
							}else{
								$return['error']='User can not be created at this momment';
							}

						}else{
							$return['error']='User can not be created at this momment';
						}
					}else{
						$return['error']='Username already taken';
					}
				}else{

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


	public function onDeleteInternalUser(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_user_id=post_data('_user');
				$user_id=decode_data($_user_id);

				//echo $user_id;die;

				$userdata=$this->um->get_internal_user(array('user_id'=>$user_id));

				if(!empty($userdata)){
					$deleted=$this->um->delete_internal_user(array('user_id'=>$user_id));
					if($deleted){
						$this->um->delete_internal_user_profile_data(array('user_m_id'=>$user_id));
						$return['success']='User deleted from the system';
					}else{
						$return['error']='User not deleted from the system';
					}
				}else{
					$return['error']='Userdata not found in the system';
				}

			}else{
				$return['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$return['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onChangeSingleData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$data_id=post_data('data_id');
				$data_field=post_data('data_field');
				$data_value=post_data('data_value');

				$_data_id=decode_data($data_id);
				$_data_field=decode_data($data_field);
				$_data_value=decode_data($data_value);

				//echo $_data_id;die;


				if($_data_field=='user_name'){
					$get_user=$this->um->get_user_duplicate(array('user_name'=>$_data_value));

					print_obj($get_user);die;
				}else if($_data_field=='user_status'){
					$updated=$this->um->update_internal_user(array($_data_field=>$_data_value),array('user_id'=>$_data_id));
					if($updated){
						$return['success']='Data updated';
					}else{
						$return['error']='Data not updated';
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


	/***Students Llist****/

	function indexStudents(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Students';

			// echo '10445='.encode_data('10445').'<br>';

			// echo 'COLLEGE_NAME='.encode_data('COLLEGE_NAME').'<br>';

			// echo 'BABASAHEB BHIMRAO AMBEDKAR UNIVERSITY='.encode_data('BABASAHEB BHIMRAO AMBEDKAR UNIVERSITY');

			// die;

			$this->theme->title($this->data['page_title'])->load('users/vw_users_students', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchStudentsList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'user_fullname',
					'user_email',
					'user_code',
					'user_phone_no'
				);

				$param['column_search'] = array('user_fullname','user_email','user_phone_no','user_code');
				$param['order'] = array('user_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->um->_get_students($posts,$param,FALSE,FALSE);

				//print_obj($list);die;


				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();
					//$user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user->user_id));

					// $action='<div class="table-actions">
					// <a href="'.$this->data['admin_base_url'].'/users/students/add/'.encode_data($user->user_id).'"><i class="ik ik-edit-2"></i></a>
					// <a href="javascript::void(0);" class="btn_del_user" data-aid="'.encode_data($user->user_id).'"><i class="ik ik-trash-2"></i></a>
					// </div>';

					$country_data=$this->com->get_country(array('country_id'=>$user->user_country));
					$state_data=$this->com->get_state(array('state_id'=>$user->user_state));
					$city_data=$this->com->get_city(array('city_id'=>$user->user_city));
					
					$row[]	=	$no;
					$row[]	=	$user->user_code;
					//$row[]	=	$user->user_code;
					// if(!empty($user_image)){
					// 	$row[]	=	'<img src="'.$user_image->media_disk_path_relative.'" class="table-user-thumb" alt="">';
					// }else{
					// 	$row[]	=	'<img src="'.base_url().'uploads/users/no.jpg" class="table-user-thumb" alt="">';
					// }

					$row[]	=	ucwords($user->user_fullname);
					$row[]	=	($user->user_phone_no_verified=='1')?'<span class="badge badge-success">'.$user->user_phone_no.'</span>':'<span class="badge badge-danger">'.$user->user_phone_no.'</span>';
					$row[]	=	(!empty($user->user_email))?$user->user_email:'Not added yet';
					$row[]	=	(!empty($city_data->city_name))?$city_data->city_name:'Not added yet';
					$row[]	=	(!empty($state_data->state_name))?$state_data->state_name:'Not added yet';
					$row[]	=	$country_data->country_name;
										
					$row[]	=	date('F jS, Y',strtotime($user->created_date));
					// if($user->user_blocked==1){
					// 	$row[]  =	'<span class="badge badge-pill badge-success">Active</span>';
					// }else if($user->user_blocked==2){
					// 	$row[]  =	'<span class="badge badge-pill badge-danger">Deactive</span>';
					// }

					// $row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_students($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_students($posts,$param,TRUE),
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


	/***Students Llist  by Course****/

	function indexStudentsCourses(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Students';

			$this->theme->title($this->data['page_title'])->load('users/vw_users_students_by_course', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchStudentsCoursesList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'user_fullname',
					'user_email',
					'user_code',
					'user_phone_no'
				);

				$param['column_search'] = array('user_fullname','user_email','user_phone_no','user_code');
				$param['order'] = array('user_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->um->_get_students_courses($posts,$param,FALSE,FALSE);
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();
					$user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user->user_id));
					
					$row[]	=	$no;
					$row[]	=	$user->user_code;
					$row[]	=	$user->course_name;
					if(!empty($user_image)){
						$row[]	=	'<img src="'.$user_image->media_disk_path_relative.'" class="table-user-thumb" alt="">';
					}else{
						$row[]	=	'<img src="'.base_url().'uploads/users/no.jpg" class="table-user-thumb" alt="">';
					}

					$row[]	=	ucwords($user->user_fullname);
					$row[]	=	$user->user_email;
					$row[]	=	$user->user_phone_no;
					$row[]	=	date('F jS, Y',strtotime($user->enrollment_date));
					if($user->user_blocked==1){
						$row[]  =	'<span class="badge badge-pill badge-success">Active</span>';
					}else if($user->user_blocked==2){
						$row[]  =	'<span class="badge badge-pill badge-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_students_courses($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_students_courses($posts,$param,TRUE),
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


	public function onSearchStatData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_user_id=post_data('user_id');
				$_state_id=post_data('state_id');
				$_start_date=post_data('start_date');
				$_end_date=post_data('end_date');
				$user_id=decode_data($_user_id);

				if($_state_id!='0'){
					$state_id=decode_data($_state_id);
				}else{
					$state_id='0';
				}
				
				$userdata=$this->um->_get_internal_user(array('user_id'=>$user_id));
				//echo $state_id;die;

				$start_date= date('Y-m-d',strtotime($_start_date));
				$end_date= date('Y-m-d',strtotime($_end_date));

				$param['updated_at_start']=$start_date;
				$param['updated_at_end']=$end_date;
				$param['updated_by']=$user_id;

				if($state_id!='0'){
					$param['state_id']=$state_id;
				}
				
				$param['order']=array('updated_at' => 'ASC');

				$searched_data=$this->im->_get_colleges(NULL,$param,FALSE,FALSE);

				
				if(!empty($searched_data)){

					$fileType = 'Excel2007';
					$fileName = FCPATH . 'uploads/app/samples/worksheet_data.xlsx';
					$objReader = PHPExcel_IOFactory::createReader($fileType);
					$objPHPExcel = $objReader->load($fileName);

					$objPHPExcel->setActiveSheetIndex(0)
									->setCellValue('B1', $userdata->user_fullname)
									->setCellValue('B2', date("F d Y",strtotime($start_date)).' - '.date("F d Y",strtotime($end_date)));
					$i=1;

					foreach ($searched_data as $key => $value) {
						$row = $i + 5;

						$updated_date=	date("F d Y",strtotime($value->updated_at));				

						$user_logo_files=$this->sm->get_user_file(array('user_file_type'=>'4','user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

						$user_banner_files=$this->sm->get_user_file(array('user_file_type'=>'4','user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));

						//$get_slug=$this->sm->get_slug(array());

						//clearstatcache();

						$logo_modified_date=filemtime_remote($user_logo_files->media_disk_path_relative);
						$banner_modified_date=filemtime_remote($user_banner_files->media_disk_path_relative);

						if(!empty($logo_modified_date) && (date('Y-m-d',$logo_modified_date)>=$start_date && date('Y-m-d',$logo_modified_date)<=$end_date)){
							$logo_update_conted=' (Counted)';
						}else{
							$logo_update_conted=' (Not Counted)';
						}

						if(!empty($banner_modified_date) && (date('Y-m-d',$banner_modified_date)>=$start_date && date('Y-m-d',$banner_modified_date)<=$end_date)){
							$banner_update_conted=' (Counted)';
						}else{
							$banner_update_conted=' (Not Counted)';
						}

						$logo_updated=($user_logo_files->media_disk_path_relative!='')?'Updated':'Not Updated';
						$banner_updated=($user_banner_files->media_disk_path_relative!='')?'Updated':'Not Updated';

						$menu_param=array('menu_link_type'=>'10','menu_link_id'=>$value->user_id,'menu_is_inner'=>'1');

						$_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$value->user_id),FALSE,'menu_serial','ASC');

						if(!empty($_inner_menus)){
							$total_inner_meues=count($_inner_menus);
						}else{
							$total_inner_meues='0';
						}

						$user_course_data=$this->im->get_user_course_data(array('user_id'=>$value->user_id,'user_type'=>'4','user_course_duration_year!='=>NULL,'user_course_duration_type!='=>NULL,'user_course_type!='=>NULL,'user_course_cost_type!='=>NULL,'user_course_cost_breakup_type!='=>NULL,'user_course_pass_type!='=>NULL,'user_course_placement_type!='=>NULL,'user_course_eligibility!='=>NULL),FALSE);

						if(!empty($user_course_data)){

							foreach ($user_course_data as $k => $v) {
								$cost_data[]=$this->im->get_course_fees_data(array('user_id'=>$value->user_id,'user_course_id'=>$v->user_course,'user_course_cost_pk'=>$v->user_course_id),FALSE);
							}

							$course_cost_count=count($cost_data);

							$course_counted=count($user_course_data);
						}else{
							$course_cost_count='0';
							$course_counted='0';
						}

						if($course_cost_count>0){
							$course_cost_updated='Updated';
						}else{
							$course_cost_updated='Not Updated';
						}

						$srch_data[]=array(
							'inst_name'=>$value->college_name,
							'inst_access_url'=>$value->access_url,
							'inst_state'=>$value->state_name,
							'inst_logo'=>($user_logo_files->media_disk_path_relative!='')?$user_logo_files->media_disk_path_relative:base_url().'uploads/app/default/no.jpg',
							'inst_banner'=>($user_banner_files->media_disk_path_relative!='')?$user_banner_files->media_disk_path_relative:base_url().'uploads/app/default/no.jpg',
							'inst_logo_updated'=>$logo_updated,
							'inst_banner_updated'=>$banner_updated,
							'inst_logo_updated_date'=>(!empty($logo_modified_date))?date("F d Y", $logo_modified_date):'Not Added Yet',
							'inst_banner_updated_date'=>(!empty($banner_modified_date))?date("F d Y", $banner_modified_date):'Not Added Yet'
						);

						$logo_update_date=(!empty($logo_modified_date))?date("F d Y", $logo_modified_date):'Not Added Yet';
						$banner_update_date=(!empty($banner_modified_date))?date("F d Y", $banner_modified_date):'Not Added Yet';

						$objPHPExcel->setActiveSheetIndex(0)
									->setCellValue('A' . $row, $i)
									->setCellValue('B' . $row, $value->state_name)
									->setCellValue('C' . $row, $value->college_name)
									->setCellValue('D' . $row, $updated_date)
									->setCellValue('E' . $row, $logo_updated.$logo_update_conted)
									->setCellValue('F' . $row, $logo_update_date)
									->setCellValue('G' . $row, $banner_updated.$banner_update_conted)
									->setCellValue('H' . $row, $banner_update_date)
									->setCellValue('I' . $row, $total_inner_meues)
									->setCellValue('J' . $row, $course_counted)
									->setCellValue('K' . $row, $course_cost_updated);

						$i++;
					}
				}else{
					$srch_data=array();
				}

				//print_obj($srch_data);die;

				if(!empty($srch_data)){
					$file_name=str_replace(" ", "_", $userdata->user_fullname).'_worksheet_data_' . date('Y-m-d') . '.xlsx';
					$file_path = FCPATH . 'uploads/temps/'.$file_name;

					$file_relative_path = base_url() . 'uploads/temps/' .$file_name;

					$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $fileType);
					$objWriter->save($file_path);

					$return['file_link'] = $file_relative_path;
				}

				$this->data['stat_data']=$srch_data;

				$return['html']=$this->theme->view('_pages/users/vw_users_stats_dyna',$this->data,true);

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