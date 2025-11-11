<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Departments  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function indexCollegesFacultyDepartments(){
		if(session_userdata('isAdminLoggedin')){
			$userdata=$this->data['userdata'];

			$this->data['page_title']='Faculty Departments';

			//print_obj($this->data);die;

			$this->theme->title($this->data['page_title'])->load('departments/vw_faculty_departments', $this->data);
							
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCollegesFacultyDepartments(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'department_name'
				);

				$param['column_search'] = array('department_name');
				$param['order'] = array('department_name' => 'ASC');
				$posts=$this->input->post();

				$list = $this->im->_get_departments($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $dep){
					$no++;

					$row = array();

					
					$row[]	=	$no;
					$row[]	=	$dep->department_name;
	
					if($dep->department_status=='1'){
						$status  =	'<button type="button" class="btn btn-xs btn-success">Active</button>';
					}else if($dep->department_status=='2'){
						$status  =	'<button type="button" class="btn btn-xs btn-secondary">Deactive</button>';
					}

					$actions=	'<button type="button" class="btn btn-xs btn-primary btn_edit_department" data-dep_id="'.$dep->department_id.'" data-dep_name="'.$dep->department_name.'" data-dep_status="'.$dep->department_status.'">Edit</button>';

					//<button type="button" class="btn btn-xs btn-danger btn_del_department" data-dep_id="'.$dep->department_id.'">Delete</button>';

					$row[]	=	'<div class="btn-group btn-group-sm" role="group">'.$status.$actions.'</div>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_departments($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_departments($posts,$param,TRUE),
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


	public function onAddEditCollegesFacultyDepartments(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$dep_id=post_data('_department');
				$dep_name=post_data('department_name');
				$dep_status=post_data('department_status');

				if(!empty($dep_id)){
					$data_to_store=array(
						'department_name'=>strtoupper($dep_name),
						'department_status'=>$dep_status,
						'updated_at'=>date('Y-m-d'),
						'updated_by'=>$this->data['userdata']->user_id
					);

					$data_found=$this->im->get_departments(array('department_id'=>$dep_id));


					if(!empty($data_found)){

						$data_found2=$this->im->get_departments(array('department_id'=>$dep_id,'department_name!='=>strtoupper($dep_name)));

						//print_obj($data_found2);die;

						if(empty($data_found2)){
							$added=$this->im->update_departments($data_to_store,array('department_id'=>$dep_id));
							if($added){
								$return['success']='Department updated successfully.';
							}else{
								$return['error']='Department not updated.';
							}
						}else{
							$return['error']='Department already exists2';
						}
							
					}else{
						$return['error']='Department already exists.1';
					}
				}else{
					$data_to_store=array(
						'department_name'=>strtoupper($dep_name),
						'department_status'=>$dep_status,
						'created_at'=>date('Y-m-d'),
						'created_by'=>$this->data['userdata']->user_id
					);

					$data_found=$this->im->get_departments(array('department_name'=>strtoupper($dep_name)));

					if(empty($data_found)){
						$added=$this->im->add_departments($data_to_store);
						if($added){
							$return['success']='Department added successfully.';
						}else{
							$return['error']='Department not added.';
						}
					}else{
						$return['error']='Department already exists.';
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


