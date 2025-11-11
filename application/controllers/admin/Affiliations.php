<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Affiliations  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function indexCollegeAffiliations(){
		if(session_userdata('isAdminLoggedin')){
			$userdata=$this->data['userdata'];

			$this->data['page_title']='Affiliations';

			//print_obj($this->data);die;

			$this->theme->title($this->data['page_title'])->load('affiliations/vw_affiliations', $this->data);
							
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchCollegeAffiliations(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'statutory_body_name',
					'statutory_body_abbr'
				);

				$param['column_search'] = array('statutory_body_abbr','statutory_body_name');
				$param['order'] = array('statutory_body_abbr' => 'ASC');
				$posts=$this->input->post();

				$list = $this->im->_get_affiliation_types($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $aff){
					$no++;

					$row = array();

					
					$row[]	=	$no;
					$row[]	=	$aff->statutory_body_name;
					$row[]	=	$aff->statutory_body_abbr;
	
					if($aff->statutory_body_status=='1'){
						$status  =	'<button type="button" class="btn btn-xs btn-success">Active</button>';
					}else if($aff->statutory_body_status=='2'){
						$status  =	'<button type="button" class="btn btn-xs btn-secondary">Deactive</button>';
					}

					$actions=	'<button type="button" class="btn btn-xs btn-primary btn_edit_affiliations" data-statutory_body_id="'.$aff->statutory_body_id.'" data-statutory_body_name="'.$aff->statutory_body_name.'" data-statutory_abbr_name="'.$aff->statutory_body_abbr.'" data-statutory_body_status="'.$aff->statutory_body_status.'">Edit</button>';

					//<button type="button" class="btn btn-xs btn-danger btn_del_department" data-dep_id="'.$dep->department_id.'">Delete</button>';

					$row[]	=	'<div class="btn-group btn-group-sm" role="group">'.$status.$actions.'</div>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_affiliation_types($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_affiliation_types($posts,$param,TRUE),
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


	public function onAddEditCollegesAffiliations(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$aff_id=post_data('_affiliation');
				$aff_name=post_data('affiliation_name');
				$aff_abbr_name=post_data('affiliation_abbr_name');
				$aff_status=post_data('affiliation_status');

				$slug=url_slug($aff_abbr_name);

				if(!empty($aff_id)){
					$data_to_store=array(
						'statutory_body_country_id'=>'99',
						'statutory_body_abbr'=>strtoupper($aff_abbr_name),
						'statutory_body_name'=>strtoupper($aff_name),
						'statutory_body_abbr_slug'=>$slug,
						'statutory_body_status'=>$aff_status,
						'updated_at'=>date('Y-m-d'),
						'updated_by'=>$this->data['userdata']->user_id
					);

					$data_found=$this->im->get_affiliation_types(array('statutory_body_id'=>$aff_id));


					if(!empty($data_found)){

						$data_found2=$this->im->get_affiliation_types(array('statutory_body_id'=>$aff_id,'statutory_body_abbr!='=>$slug));

						//print_obj($data_found2);die;

						if(empty($data_found2)){
							$added=$this->im->update_affiliation_types($data_to_store,array('statutory_body_id'=>$aff_id));
							if($added){
								$return['success']='Affiliation updated successfully.';
							}else{
								$return['error']='Affiliation not updated.';
							}
						}else{
							$return['error']='Affiliation already exists.';
						}
							
					}else{
						$return['error']='Affiliation already exists.';
					}
				}else{
					$data_to_store=array(
						'statutory_body_country_id'=>'99',
						'statutory_body_abbr'=>strtoupper($aff_abbr_name),
						'statutory_body_name'=>strtoupper($aff_name),
						'statutory_body_abbr_slug'=>$slug,
						'statutory_body_status'=>$aff_status,
						'created_at'=>date('Y-m-d'),
						'created_by'=>$this->data['userdata']->user_id
					);

					$data_found=$this->im->get_affiliation_types(array('statutory_body_abbr_slug'=>$slug));

					if(empty($data_found)){
						$added=$this->im->add_affiliation_types($data_to_store);
						if($added){
							$return['success']='Affiliation added successfully.';
						}else{
							$return['error']='Affiliation not added.';
						}
					}else{
						$return['error']='Affiliation already exists.';
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


