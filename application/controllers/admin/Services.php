<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Services  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	public function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services';

			$this->theme->title($this->data['page_title'])->load('services/vw_services', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexAdd(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services Add';

			$this->theme->title($this->data['page_title'])->load('services/vw_services_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexEdit(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services Update';

			$_service=$this->uri->segment(4);

			$service_id=decode_data($_service);

			$service=$this->serm->_get_service(array('service_id'=>$service_id));

			if(!empty($service)){

				$service_desc=$this->serm->get_service_desc(array('data_service_id'=>$service_id),FALSE);
				$service_broad_desc=$this->serm->get_service_broad_desc(array('data_service_id'=>$service_id),FALSE);
				$service_banner_image_data=$this->sm->get_file(array('media_type'=>'service_banner_image','media_type_data_id'=>$service->service_id));

				$this->data['service_data']=array(
					'service_id'=>$_service,
					'service_name'=>$service->service_name,
					'service_long_desc'=>$service->service_long_desc,
					'service_svg_icon'=>$service->service_svg_icon,
					'service_media_name'=>$service->media_org_name,
					'service_banner_image'=>(!empty($service_banner_image_data))?$service_banner_image_data->media_disk_path_relative:'',
					'service_meta_keywords'=>$service->service_meta_keywords,
					'service_meta_desc'=>$service->service_meta_desc,
					'service_show_on_top_slider'=>$service->service_show_on_top_slider,
					'service_status'=>$service->service_status,
					'service_desc'=>$service_desc,
					'service_broad_esc'=>$service_broad_desc
				);
			}else{
				$this->data['service_data']=array();
			}


			$this->theme->title($this->data['page_title'])->load('services/vw_services_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexDesc(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services Description';

			$this->data['service_id']=$this->uri->segment(4);

			$this->theme->title($this->data['page_title'])->load('services/vw_services_descriptions', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexDescEdit(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services Description';

			$_service_id=$this->uri->segment(4);
			$_service_desc_id=$this->uri->segment(5);

			$this->data['service_id']=$_service_id;
			$this->data['service_desc_id']=$_service_desc_id;

			$service_id=decode_data($_service_id);
			$service_desc_id=decode_data($_service_desc_id);

			$this->data['service_desc_data']=$this->serm->get_service_broad_desc(array('data_service_id'=>$service_id,'broad_desc_id'=>$service_desc_id));


			$this->theme->title($this->data['page_title'])->load('services/vw_services_descriptions', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexPortFolios(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Services Portfolio';

			$_service_id=$this->uri->segment(4);

			$this->data['service_id']=$_service_id;

			$this->theme->title($this->data['page_title'])->load('services/vw_service_portfolio', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchServices(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'service_name',
					'service_tag'
				);

				$param['column_search'] = array('service_name','service_tag');
				$param['order'] = array('service_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->serm->_get_services($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $service){
					$no++;

					$row = array();


					$action='<div class="table-actions">
					<a href="'.$this->data['admin_base_url'].'/services/add/'.encode_data($service->service_id).'"><i class="ik ik-edit-2"></i></a>
					<a href="javascript::void()" class="btn_del_service" data-sid="'.encode_data($service->service_id).'"><i class="ik ik-trash-2"></i></a>
					</div>';				
					
					$row[]	=	$no;
					$row[]	=	$service->service_name;

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/services/desc/'.encode_data($service->service_id).'" class="badge badge-pill badge-primary">Descriptions</a>';

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/services/portfolio/'.encode_data($service->service_id).'" class="badge badge-pill badge-primary">Portfolio</a>';
					

					if($service->service_status==1){
						$row[]  =	'<span class="badge badge-pill badge-success">Active</span>';
					}else if($service->service_status==2){
						$row[]  =	'<span class="badge badge-pill badge-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->serm->_get_services($posts,$param,TRUE),
					"recordsFiltered" => $this->serm->_get_services($posts,$param,TRUE),
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

	public function onAddService(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_service=post_data('_service');
				$service_name=post_data('service_name');
				$service_long_desc=post_data('service_long_desc');
				$service_svg_icon=post_data('service_svg_icon');
				$service_meta_desc=post_data('service_meta_desc');
				$service_meta_keywords=post_data('service_meta_keywords');
				$service_status=post_data('service_status');

				$service_show_on_top_slider=post_data('service_show_on_top_slider');

				$service_descriptions=$this->input->post('service_desc');


				$service_broad_desc=$this->input->post('service_broad_desc');

				if(empty($_service) || $_service==''){
					$service_found=$this->serm->get_service(array('service_name'=>$service_name));

					if(empty($service_found)){

						$service_slug=url_slug($service_name);

						$data_to_insert=array(
							'service_name'=>$service_name,
							'service_svg_icon'=>$service_svg_icon,
							'service_meta_keywords'=>$service_meta_keywords,
							'service_meta_desc'=>$service_meta_desc,
							'service_long_desc'=>$service_long_desc,
							'service_slug'=>$service_slug,
							'service_url'=>base_url().'services/'.$service_slug,
							'service_show_on_top_slider'=>$service_show_on_top_slider,
							'service_status'=>$service_status
						);

						$added=$this->serm->store_service($data_to_insert);

						if($added){

							if(isset($service_descriptions) && $service_descriptions!=''){
								foreach ($service_descriptions as $key => $value) {
									$data_desc=array(
										'data_service_id'=>$added,
										'data_service_tag'=>$value['service_tag'],
										'data_service_tag_data'=>$value['service_tag_data'],
										'data_service_icon'=>$value['service_icon'],
									);

									$this->serm->store_service_desc($data_desc);
								}
							}


							if(!is_file(DIR_UPLOADS.'/app')){
								@mkdir(DIR_UPLOADS.'/app', 0777);
							}
							

							if(isset($_FILES['service_banner_image']) && $_FILES['service_banner_image']['name']!=''){
								$service_banner_image=array(
									'file_name'=>'service_banner_image',
									'file_types'=>'png,jpg,jpeg',
									'file_size'=>20,
									'file_type'=>'service_banner_image',
									'file_type_id'=>$added,
									'file_absolute_path'=>'app/',
									'file_relative_path'=>'app'
								);

								$this->onUploadFiles($service_banner_image);
							}

							$return['success']='Service added in the system';
						}else{
							$return['error']='Service not added in the system';
						}
					}else{
						$return['error']='Service already found in the system';
					}
				}else{
					$service_id=decode_data($_service);

					$service_found=$this->serm->get_service(array('service_id'=>$service_id));

					if(!empty($service_found)){

						$service_slug=url_slug($service_name);

						$data_to_insert=array(
							'service_name'=>$service_name,
							'service_svg_icon'=>$service_svg_icon,
							'service_meta_keywords'=>$service_meta_keywords,
							'service_meta_desc'=>$service_meta_desc,
							'service_long_desc'=>$service_long_desc,
							'service_slug'=>$service_slug,
							'service_url'=>base_url().'services/'.$service_slug,
							'service_status'=>$service_status
						);

						$added=$this->serm->update_service($data_to_insert,array('service_id'=>$service_id));

						if($added){

							$this->serm->delete_service_desc(array('data_service_id'=>$service_id));

							if(isset($service_descriptions) && $service_descriptions!=''){
								foreach ($service_descriptions as $key => $value) {
									$data_desc[]=array(
										'data_service_id'=>$service_id,
										'data_service_tag'=>$value['service_tag'],
										'data_service_tag_data'=>$value['service_tag_data'],
										'data_service_icon'=>$value['service_icon'],
									);
								}

								$this->serm->store_service_desc($data_desc,TRUE);
							}

							if(isset($_FILES['service_banner_image']) && $_FILES['service_banner_image']['name']!=''){
								$service_banner_image_data=$this->sm->get_file(array('media_type'=>'service_banner_image','media_type_data_id'=>$service_id));

								if(!empty($service_banner_image_data)){
									if(is_file($service_banner_image_data->media_disk_path)){
										@unlink($service_banner_image_data->media_disk_path);
									}

									$this->sm->delete_file(array('media_type'=>'service_banner_image','media_type_data_id'=>$service_id));
								}

								$service_banner_image=array(
									'file_name'=>'service_banner_image',
									'file_types'=>'png,jpg,jpeg',
									'file_size'=>20,
									'file_type'=>'service_banner_image',
									'file_type_id'=>$service_id,
									'file_absolute_path'=>'app/',
									'file_relative_path'=>'app'
								);

								$this->onUploadFiles($service_banner_image);
							}

							$return['success']='Service updated in the system';
						}else{
							$return['error']='Service not updated in the system';
						}
					}else{
						$return['error']='Service not found in the system';
					}
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

	public function onDeleteService(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_service=post_data('_service');

				$service_id=decode_data($_service);

				$service_data=$this->serm->get_service(array('service_id'=>$service_id));

				if($service_data){

					$deleted=$this->serm->delete_service(array('service_id'=>$service_id));

					if($deleted){
						
						$this->serm->delete_service_desc(array('data_service_id'=>$service_id));
						$this->serm->delete_service_broad_desc(array('data_service_id'=>$service_id));

						$return['success']='Service deleted successfully';

					}else{
						$return['error']='Service can not be deleted at this momment';
					}

				}else{
					$return['error']='Service data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onSearchServicesDescriptions(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'broad_desc_title',
					'broad_desc_content'
				);

				$param['column_search'] = array('broad_desc_title','broad_desc_content');
				$param['order'] = array('broad_desc_serial_no' => 'ASC');
				$posts=$this->input->post();

				$list = $this->serm->_get_services_broad_desc($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $service){
					$no++;

					$row = array();


					$action='<div class="table-actions">
					<a href="'.$this->data['admin_base_url'].'/services/desc/'.encode_data($service->data_service_id).'/'.encode_data($service->broad_desc_id).'"><i class="ik ik-edit-2"></i></a>
					<a href="javascript::void()" class="btn_del_service_desc" data-sid="'.encode_data($service->data_service_id).'" data-sdid="'.encode_data($service->broad_desc_id).'"><i class="ik ik-trash-2"></i></a>
					</div>';				
					
					$row[]	=	$service->broad_desc_title;


					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->serm->_get_services_broad_desc($posts,$param,TRUE),
					"recordsFiltered" => $this->serm->_get_services_broad_desc($posts,$param,TRUE),
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


	public function onAddServiceDescriptions(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_service=post_data('_service');
				$_service_desc=post_data('_service_desc');
				$service_desc_title=post_data('service_desc_title');
				$service_long_desc=post_data('service_long_desc');

				if(empty($_service_desc) || $_service_desc==''){

					$service_id=decode_data($_service);

					$recordsTotal=$this->serm->get_service_broad_desc_count(array('data_service_id'=>$service_id));
					$serial=($recordsTotal>0)?($recordsTotal+1):'1';

					$service_desc_found=$this->serm->get_service_broad_desc(array('broad_desc_title'=>$service_desc_title));

					if(empty($service_desc_found)){

						$data_broad_desc=array(
							'data_service_id'=>$service_id,
							'broad_desc_title'=>$service_desc_title,
							'broad_desc_content'=>$service_long_desc,
							'broad_desc_serial_no'=>$serial
						);

						$added=$this->serm->store_service_broad_desc($data_broad_desc);

						if($added){
							$return['success']='Service Description added in the system';
						}else{
							$return['error']='Service Description not added in the system';
						}
					}else{
						$return['error']='Service Description already found in the system';
					}
				}else{
					$service_id=decode_data($_service);
					$service_desc_id=decode_data($_service_desc);

					$service_desc_found=$this->serm->get_service_broad_desc(array('data_service_id'=>$service_id,'broad_desc_id'=>$service_desc_id));

					if(!empty($service_desc_found)){

						$data_broad_desc=array(
							'data_service_id'=>$service_id,
							'broad_desc_title'=>$service_desc_title,
							'broad_desc_content'=>$service_long_desc
						);

						$added=$this->serm->update_service_broad_desc($data_broad_desc,array('data_service_id'=>$service_id,'broad_desc_id'=>$service_desc_id));

						if($added){
							$return['success']='Service Description updated in the system.Redirecting to Add description page';
							$return['redirect']=$this->data['admin_base_url'].'/services/desc/'.$_service;
						}else{
							$return['error']='Service Description not updated in the system';
						}

					}else{
						$return['error']='Service Description not found in the system';
					}
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

	public function onDeleteServiceDescriptions(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_service=post_data('_service');
				$_service_desc=post_data('_service_desc');

				$service_id=decode_data($_service);
				$service_desc_id=decode_data($_service_desc);

				$service_data=$this->serm->get_service_broad_desc(array('data_service_id'=>$service_id,'broad_desc_id'=>$service_desc_id));

				if($service_data){

					$deleted=$this->serm->delete_service_broad_desc(array('broad_desc_id'=>$service_desc_id));

					if($deleted){

						$return['success']='Service Description deleted successfully';

					}else{
						$return['error']='Service Description can not be deleted at this momment';
					}

				}else{
					$return['error']='Service Description data not found in the system';
				}

			}else{
				$retturn['redirect']=$this->data['admin_base_url'];
			}
		}else{
			$retturn['redirect']=$this->data['admin_base_url'];
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onAddPortfolio(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_service=post_data('_service');
				$service_id=decode_data($_service);
				
				if(!is_file(DIR_UPLOADS.'/app')){
					@mkdir(DIR_UPLOADS.'/app', 0777);
				}												

				if(isset($_FILES['portfolio_file']) && $_FILES['portfolio_file']['name']!=''){	

					$document_data_array=array(
						'file_name'=>'portfolio_file',
						'file_types'=>'png,jpg,jpeg',
						'file_type'=>'service_portfolio_image',
						'file_heading_text'=>'',
						'file_text'=>'',
						'file_youtube_link'=>'',
						'file_type_id'=>$service_id,
						'file_absolute_path'=>'app/',
						'file_relative_path'=>'app'
					);

					$inserted=$this->onUploadFiles($document_data_array);

					if($inserted){

						$return['success']='Portfolio uploaded successfully';
					}else{
						$return['error']='Portfolio not uploaded';
					}
				}
				
			}else{
				$return['error']='Action not allowed';
			}
		}else{
			$return['error']='Action not allowed';
		}

		header('Content-Type: application/json');

		echo json_encode($return);
	}

	public function onSearchPortfolio(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'media_org_name'
				);

				$param['column_search'] = array('media_org_name');
				$param['order'] = array('storage_id' => 'DESC');

				$posts=$this->input->post();

				$param['media_data_type_id']=decode_data($posts['_service']);
				$param['media_type']='service_portfolio_image';

				$list = $this->sm->_get_files($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $doc){
					$no++;

					$row = array();


					$action='<div class="table-actions">
					<button type="button" class="btn btn-theme btn_del_document" data-fileid="'.encode_data($doc->storage_id).'" data-filetype="'.$doc->media_type.'"><i class="ik ik-trash-2"></i></button>
					</div>';

								
					
					$row[]	=	$no;

					if(in_array($doc->media_mime, array('image/png','image/jpeg','image/jpg','image/icon'))){
						$file_view='<img src="'.$doc->media_disk_path_relative.'" class="responsive border-0" width="100px" height="50px">';
					}else if($doc->media_mime=='video/mp4'){
						$file_view='<video autoplay="" muted="" loop="" id="myVideo" width="100px" height="50px;">
				          <source src="'.$doc->media_disk_path_relative.'" type="video/mp4">
				        </video>';
					}else{
						$file_view='';
					}



					$row[]	=	$file_view;

					$row[]	=	$doc->media_size2;

					$row[]	=	date('F jS, Y',strtotime($doc->created_at));



					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_files($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_files($posts,$param,TRUE),
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