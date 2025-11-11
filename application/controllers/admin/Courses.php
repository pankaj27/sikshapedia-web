<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Courses  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Courses';

			$this->theme->title($this->data['page_title'])->load('courses/vw_courses', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexAdd(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Course Addition';

			$this->theme->title($this->data['page_title'])->load('courses/vw_courses_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexEdit(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Course Updation';

			$_course_id=$this->uri->segment(4);

			$this->data['course_id']=$_course_id;


			$course_id=decode_data($_course_id);

			$this->data['course_data']=$this->cm->_get_course(array('course_id'=>$course_id));

			$this->data['course_pre_requisit']=$this->cm->get_course_prequisit(array('course_pk_id'=>$course_id),FALSE);
			$this->data['course_sylabus']=$this->cm->get_course_sylabus(array('course_pk_id'=>$course_id),FALSE);

			$this->theme->title($this->data['page_title'])->load('courses/vw_courses_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddCourse(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course=post_data('_course');
				$course_name=post_data('course_name');
				$course_price=post_data('course_price');
				$course_years=post_data('course_years');
				$course_months=post_data('course_months');
				$course_short_description=post_data('course_short_description');
				$course_long_description=post_data('course_long_description');

				$course_prerequisite=$this->input->post('course_prerequisite');
				$course_sylabus=$this->input->post('course_sylabus');
				$course_status=post_data('course_status');


				if(empty($_course)){
					$course_data=$this->cm->get_course(array('course_name'=>$course_name));

					if(empty($course_data)){
						$data_to_insert=array(
							'course_name'=>$course_name,
							'course_short_description'=>$course_short_description,
							'course_long_description'=>$course_long_description,
							'course_months'=>$course_months,
							'course_years'=>$course_years,
							'course_price'=>$course_price,
							'course_slug'=>url_slug($course_name),
							'course_url'=>base_url().'courses/'.url_slug($course_name),
							'course_status'=>$course_status,
							'course_created_by'=>session_userdata('admin_id')
						);

						$inserted=$this->cm->store_course_data($data_to_insert);

						if($inserted){
							if(!empty($course_prerequisite)){
								foreach ($course_prerequisite as $key => $value) {
									$preq_data=array(
										'course_pk_id'=>$inserted,
										'course_prereq_value'=>$value
									);

									$this->cm->store_course_prequisit_data($preq_data);
								}
							}

							if(!empty($course_sylabus)){
								foreach ($course_sylabus as $key => $value) {
									$sylabus_data=array(
										'course_pk_id'=>$inserted,
										'course_sylabus_short_description'=>$value['short_description'],
										'course_sylabus_long_description'=>$value['long_description']
									);

									$this->cm->store_course_sylabus_data($sylabus_data);
								}
							}

							if(!is_file(DIR_UPLOADS.'/app')){
								@mkdir(DIR_UPLOADS.'/app', 0777);
							}
							

							if(isset($_FILES['course_banner_image']) && $_FILES['course_banner_image']['name']!=''){
								$course_banner_image=array(
									'file_name'=>'course_banner_image',
									'file_types'=>'png,jpg,jpeg',
									'file_size'=>20,
									'file_type'=>'course_banner_image',
									'file_type_id'=>$inserted,
									'file_absolute_path'=>'app/',
									'file_relative_path'=>'app'
								);

								$this->onUploadFiles($course_banner_image);
							}


							if(!empty($course_short_title)){

								foreach ($course_short_title as $key => $value) {
									
									if(isset($_FILES['short_title_image']) && $_FILES['short_title_image']['name']!=''){
										$course_banner_image=array(
											'file_name'=>'short_title_image',
											'file_types'=>'png,jpg,jpeg',
											'file_size'=>1,
											'file_type'=>'course_short_title_image',
											'file_type_id'=>$inserted,
											'file_absolute_path'=>'app/',
											'file_relative_path'=>'app'
										);

										$this->onUploadFiles($course_banner_image);
									}
								}
							}

							$return['success']='Course data added successfully';

						}else{
							$return['error']='Course data not added';
						}

					}else{
						$return['error']='Course already found in the system';
					}
				}else{
					$course_id=decode_data($_course);

					$course_data=$this->cm->get_course(array('course_name'=>$course_name,'course_id!='=>$course_id));

					if(empty($course_data)){

						$data_to_insert=array(
							'course_name'=>$course_name,
							'course_short_description'=>$course_short_description,
							'course_long_description'=>$course_long_description,
							'course_months'=>$course_months,
							'course_years'=>$course_years,
							'course_price'=>$course_price,
							'course_status'=>$course_status,
							'course_updated_by'=>session_userdata('admin_id'),
							'course_updated_at'=>date('Y-m-d')
						);

						$updated=$this->cm->update_course_data($data_to_insert,array('course_id'=>$course_id));

						if($updated){
							if(!empty($course_prerequisite)){

								$this->cm->delete_course_prequisit_data(array('course_pk_id'=>$course_id));

								foreach ($course_prerequisite as $key => $value) {
									$preq_data=array(
										'course_pk_id'=>$course_id,
										'course_prereq_value'=>$value
									);

									$this->cm->store_course_prequisit_data($preq_data);
								}
							}

							if(!empty($course_sylabus)){
								$this->cm->delete_course_sylabus_data(array('course_pk_id'=>$course_id));

								foreach ($course_sylabus as $key => $value) {
									$sylabus_data=array(
										'course_pk_id'=>$course_id,
										'course_sylabus_short_description'=>$value['short_description'],
										'course_sylabus_long_description'=>$value['long_description']
									);

									$this->cm->store_course_sylabus_data($sylabus_data);
								}
							}
															

							if(isset($_FILES['course_banner_image']) && $_FILES['course_banner_image']['name']!=''){
								$course_banner_image_data=$this->sm->get_file(array('media_type'=>'course_banner_image','media_type_data_id'=>$course_id));

								if(!empty($course_banner_image_data)){
									if(is_file($course_banner_image_data->media_disk_path)){
										@unlink($course_banner_image_data->media_disk_path);
									}

									$this->sm->delete_file(array('media_type'=>'course_banner_image','media_type_data_id'=>$course_id));
								}

								$course_banner_image=array(
									'file_name'=>'course_banner_image',
									'file_types'=>'png,jpg,jpeg',
									'file_size'=>20,
									'file_type'=>'course_banner_image',
									'file_type_id'=>$course_id,
									'file_absolute_path'=>'app/',
									'file_relative_path'=>'app'
								);

								$this->onUploadFiles($course_banner_image);
							}

							$return['success']='Course data updated successfully';

						}else{
							$return['error']='Course data not updated';
						}

					}else{
						$return['error']='Course already exists in the system with the same name';
					}
				}
			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}


		header('Content-Type: application/json');

		echo json_encode($return);
		session_write_close();
	}


	public function onDeleteCourse(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_course=post_data('_course');

				$course_id=decode_data($_course);

				$course_data=$this->cm->_get_course(array('course_id'=>$course_id));

				if($course_data){

					$deleted=$this->cm->delete_course_data(array('course_id'=>$course_id));

					if($deleted){
						if(is_file($course_data->media_disk_path)){
							@unlink($course_data->media_disk_path);
						}

						$this->sm->delete_file(array('media_type'=>'course_banner_image','media_type_data_id'=>$course_id));
						$this->cm->delete_course_sylabus_data(array('course_pk_id'=>$course_id));
						$this->cm->delete_course_prequisit_data(array('course_pk_id'=>$course_id));

						$return['success']='Course deleted successfully';

					}else{
						$return['error']='Course can not be deleted at this momment';
					}

				}else{
					$return['error']='Course data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
		session_write_close();
	}


	public function onSearchCourses(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'course_name',
					'media_org_name'
				);

				$param['column_search'] = array('course_name','media_org_name');
				$param['order'] = array('course_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->cm->_get_courses($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $course){
					$no++;

					$row = array();


					$action='<div class="table-actions">
					<a href="'.$this->data['admin_base_url'].'/courses/add/'.encode_data($course->course_id).'"><i class="ik ik-edit-2"></i></a>
					<a href="javascript::void()" class="btn_del_course" data-aid="'.encode_data($course->course_id).'"><i class="ik ik-trash-2"></i></a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$course->course_name;

					if(!empty($course)){
						$row[]	=	'<img src="'.$course->media_disk_path_relative.'" class="table-user-thumb" alt="">';
					}else{
						$row[]	=	'';
					}

					$row[]	=	$this->data['system_settings']->system_currency.$course->course_price;

					if($course->course_years>0 && $course->course_months>0){
						$duration=$course->course_years.' years '.$course->course_months.' months';
					}else if($course->course_years>0 && $course->course_months==0){
						$duration=$course->course_years.' years';
					}else if($course->course_years==0 && $course->course_months>0){
						$duration=$course->course_months.' months';
					}else if($course->course_years==0 && $course->course_months==0){
						$duration='Not Added';
					}

					$row[]	=	$duration;

					$row[]  =	'<button type="button" class="btn btn-sm btn-success btn_short_title" data-toggle="modal" data-target="#course_short_title_modal" data-course="'.$course->course_name.'" data-course_id="'.encode_data($course->course_id).'">Short Title</button>';

					if($course->course_status==1){
						$row[]  =	'<span class="badge badge-pill badge-success">Active</span>';
					}else if($course->course_status==2){
						$row[]  =	'<span class="badge badge-pill badge-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->cm->_get_courses($posts,$param,TRUE),
					"recordsFiltered" => $this->cm->_get_courses($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
}