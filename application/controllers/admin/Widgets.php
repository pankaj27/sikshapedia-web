<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Widgets  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='System Widgets';

			$this->theme->title($this->data['page_title'])->load('widgets/vw_widgets', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchWidgets(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'course_name'
				);

				$param['column_search'] = array('widget_name');
				$param['order'] = array('widget_id' => 'ASC');
				$posts=$this->input->post();

				$list = $this->wm->_get_widgets($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $widget){
					$no++;

					$row = array();


					$action='<div class="btn-group btn-group-sm" role="group">
					<button type="button" data-widget_id="'.encode_data($widget->widget_id).'" data-widget_name="'.$widget->widget_name.'" data-status="'.$widget->widget_status.'" class="btn btn-xs btn-primary btn_edit_widget">Edit</button>
					<a href="javascript::void()" class="btn btn-xs btn-dark btn_del_course" data-course="'.encode_data($course->widget_id).'">Delete</a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$course->widget_name;

					if($course->widget_status==1){
						$row[]  =	'<span class="btn btn-xs btn-success">Active</span>';
					}else if($course->widget_status==2){
						$row[]  =	'<span class="btn btn-xs btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->wm->_get_widgets($posts,$param,TRUE),
					"recordsFiltered" => $this->wm->_get_widgets($posts,$param,TRUE),
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


}