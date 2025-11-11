<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Companies extends BaseAdminController
{
	
	function __construct()
	{
		parent::__construct();
	}


	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Companies';

			$this->theme->title($this->data['page_title'])->load('others/vw_companies', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCompany(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'placement_company_name'
				);

				$param['column_search'] = array('placement_company_name');
				$param['order'] = array('placement_company_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->im->_get_companies($posts,$param,FALSE,FALSE);


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $agency){
					$no++;

					$row = array();


					$agency_image=$this->sm->get_user_file(array('user_file_type_id'=>$agency->placement_company_id,'user_storage_type'=>'company_logo','user_file_type'=>'8'));

					if(!empty($agency_image)){
						$_agency_image=$agency_image->media_disk_path_relative;
					}else{
						$_agency_image=base_url().'uploads/app/default/no.jpg';
					}

					$logo='<img src="'.$_agency_image.'" class="table-user-thumb" alt="">';

					$row[]	=	$no;
					$row[]	=	$agency->placement_company_name;
					$row[]	=	$logo;


					$row[]	=	'<div class="btn-group" aria-label="Basic example"><button class="btn btn-xs btn-dark btn_edit_company" data-company_id="'.encode_data($agency->placement_company_id).'" data-company_name="'.$agency->placement_company_name.'" data-company_about="'.$agency->placement_company_about.'" data-target="#companiesModal" data-toggle="modal">Edit</button><button class="btn btn-xs btn-danger btn_del_company" data-company_id="'.encode_data($agency->placement_company_id).'" >Delete</button></div>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_companies($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_companies($posts,$param,TRUE),
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


	public function onAddCompany(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
			
				$_company 			= 	post_data('_company');				
				$company_name 		= 	post_data('company_name');
				$company_about 		=	post_data('company_about');

				//echo $_company;die;

				if(empty($_company)){

					$company_found=$this->im->get_placement_companies(array('placement_company_name'=>$company_name));

					if(empty($company_found2)){

						$company_data=array(
							'placement_company_name'=>$company_name,
							'placement_company_about'=>$company_about,
							'placement_company_status'=>'1'
						);

						$company_id=$this->im->add_company_data($company_data);

						if($company_id){

							$year=date('Y');

							if(isset($_FILES['company_logo']) && $_FILES['company_logo']['name']!=''){

								$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'company_logo','user_file_type_id'=>$company_id,'user_file_type'=>'8'));

								if(!empty($file_logo_found)){
									if(is_file($file_logo_found->media_disk_path)){
										@unlink($file_logo_found->media_disk_path);
										$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
									}
								}

								$logo_data=array(
									'file_size'=>'1',
									'file_name'=>'company_logo',
									'file_types'=>'png,jpg,jpeg',
									'file_compress'=>false,
									'file_folder'=>'companies',
									'file_child_folder'=>$year,
									'file_uploaded_by'=>$this->data['userdata']->user_id
								);

								$file_id=$this->onUploadFiles($logo_data);

								//print_obj($file_id);die;

								if(!empty($file_id) && $file_id>0){

									$this->sm->delete_user_file(array('user_file_type_id'=>$company_id,'user_file_type'=>'8','user_storage_type'=>'company_logo'));

						            $agency_logo_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>$company_id,
						            	'user_file_type'=>'8',
						            	'user_storage_type'=>'company_logo'
						            );

						            $this->sm->store_user_file($agency_logo_storage_data);
						        } 
							}

							$return['success']='Company data updated';

						}else{
							$return['error']='Data not saved';
						}

					}else{
						$return['error']='Company already exists';
					}
				}else{
					$company_id 			=	decode_data($_company);


					//echo $company_id;die;


					$company_found=$this->im->get_placement_companies(array('placement_company_id'=>$company_id));
					if($company_found){

						$year=date('Y');

						$company_found2=$this->im->get_placement_companies(array('placement_company_id!='=>$company_id,'placement_company_name'=>$company_name));

						if(empty($company_found2)){

							$company_data=array(
								'placement_company_name'=>$company_name,
								'placement_company_about'=>$company_about,
								'placement_company_status'=>'1'
							);

							$updated=$this->im->update_company_data($company_data,array('placement_company_id'=>$company_id));
							if($updated){

								if(isset($_FILES['company_logo']) && $_FILES['company_logo']['name']!=''){

									$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'company_logo','user_file_type_id'=>$company_id,'user_file_type'=>'8'));

									if(!empty($file_logo_found)){
										if(is_file($file_logo_found->media_disk_path)){
											@unlink($file_logo_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
										}
									}

									$logo_data=array(
										'file_size'=>'1',
										'file_name'=>'company_logo',
										'file_types'=>'png,jpg,jpeg',
										'file_compress'=>false,
										'file_folder'=>'companies',
										'file_child_folder'=>$year,
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);

									$file_id=$this->onUploadFiles($logo_data);

									//print_obj($file_id);die;

									if(!empty($file_id) && $file_id>0){

										$this->sm->delete_user_file(array('user_file_type_id'=>$company_id,'user_file_type'=>'8','user_storage_type'=>'company_logo'));

							            $agency_logo_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$company_id,
							            	'user_file_type'=>'8',
							            	'user_storage_type'=>'company_logo'
							            );

							            $this->sm->store_user_file($agency_logo_storage_data);
							        } 
								}

								$return['success']='Company data updated';
							}else{
								$return['error']='Company data not updated';
							}
						}else{
							$return['error']='Data already exists';
						}

							
					}else{
						$return['error']='Company not found in the system';
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


	public function onDeleteCompany(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
			
				$_company 			= 	post_data('_company');

				if(!empty($_company)){

					$company_id=decode_data($_company);

					$company_found=$this->im->get_placement_companies(array('placement_company_id'=>$company_id));

					if(!empty($company_found)){

						$deleted=$this->im->delete_company_data(array('placement_company_id'=>$company_id));

						if($deleted){

							$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'company_logo','user_file_type_id'=>$company_id,'user_file_type'=>'8'));

							if(!empty($file_logo_found)){
								if(is_file($file_logo_found->media_disk_path)){
									@unlink($file_logo_found->media_disk_path);
									$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
								}
							}

							$this->sm->delete_user_file(array('user_file_type_id'=>$company_id,'user_file_type'=>'8','user_storage_type'=>'company_logo'));

							$return['success']='Company deleted successfully';
						}else{
							$return['error']='Company not deleted';
						}


					}else{
						$return['error']='Company not found';
					}


				}else{
					$return['error']='Company data not found.';
				}

				json_headers($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
}