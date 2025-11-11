<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Rankingagencies extends BaseAdminController
{
	
	function __construct()
	{
		parent::__construct();
	}


	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Ranking Agencies';

			$this->theme->title($this->data['page_title'])->load('others/vw_ranking_agencies', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchRankingAgency(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'agency_name'
				);

				$param['column_search'] = array('agency_name');
				$param['order'] = array('agency_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->im->_get_agencies($posts,$param,FALSE,FALSE);


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $agency){
					$no++;

					$row = array();


					$agency_image=$this->sm->get_user_file(array('user_file_type_id'=>$agency->agency_id,'user_storage_type'=>'ranking_agency_logo','user_file_type'=>'7'));

					if(!empty($agency_image)){
						$_agency_image=$agency_image->media_disk_path_relative;
					}else{
						$_agency_image=base_url().'uploads/app/default/no.jpg';
					}

					$logo='<img src="'.$_agency_image.'" class="table-user-thumb" alt="">';

					$row[]	=	$no;
					$row[]	=	$agency->agency_name;
					$row[]	=	$logo;


					$row[]	=	'<button class="btn btn-xs btn-dark btn_edit_agency" data-agency_id="'.encode_data($agency->agency_id).'" data-agency_name="'.$agency->agency_name.'" data-target="#agenciesModal" data-toggle="modal">Edit</button>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_agencies($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_agencies($posts,$param,TRUE),
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


	public function onAddRankingAgency(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
			
				$_agency 			= 	post_data('_agency');				
				$agency_name 		= 	post_data('agency_name');

				if(empty($_agency)){

					
				}else{
					$agency_id 			=	decode_data($_agency);
					$agency_found=$this->im->get_agency(array('agency_id'=>$agency_id));
					if($agency_found){

						$year=date('Y');

						$agency_found2=$this->im->get_agency(array('agency_id!='=>$agency_id,'agency_name'=>$agency_name));

						if(empty($agency_found2)){

							$agency_data=array(
								'agency_name'=>$agency_name,
								'agency_country_id'=>'99'
							);

							$updated=$this->im->update_agency_data($exam_data,array('agency_id'=>$agency_id));
							if($updated){

								if(isset($_FILES['agency_logo']) && $_FILES['agency_logo']['name']!=''){

									$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'ranking_agency_logo','user_file_type_id'=>$agency_id));

									if(!empty($file_logo_found)){
										if(is_file($file_logo_found->media_disk_path)){
											@unlink($file_logo_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
										}
									}

									$logo_data=array(
										'file_size'=>'1',
										'file_name'=>'agency_logo',
										'file_types'=>'png,jpg,jpeg',
										'file_folder'=>'agencies',
										'file_child_folder'=>$year,
										'file_uploaded_by'=>$this->data['userdata']->user_id
									);

									$file_id=$this->onUploadFiles($logo_data);

									//print_obj($file_id);die;

									if(!empty($file_id) && $file_id>0){

										$this->sm->delete_user_file(array('user_file_type_id'=>$agency_id,'user_storage_type'=>'ranking_agency_logo'));

							            $agency_logo_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$agency_id,
							            	'user_file_type'=>'7',
							            	'user_storage_type'=>'ranking_agency_logo'
							            );

							            $this->sm->store_user_file($agency_logo_storage_data);
							        } 
								}

								$return['success']='Agency data updated';
							}else{
								$return['error']='Agency data not updated';
							}
						}else{
							$return['error']='Data already exists';
						}

							
					}else{
						$return['error']='Agency not found in the system';
					}
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

}