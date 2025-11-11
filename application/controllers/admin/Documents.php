<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Documents  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Documents';

			$this->theme->title($this->data['page_title'])->load('documents/vw_manage_docs', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchDocuments(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'media_org_name'
				);

				$param['column_search'] = array('media_org_name');
				$param['order'] = array('storage_id' => 'DESC');
				$posts=$this->input->post();

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

					// if($doc->media_mime=='image/png'){
					// 	$file_view='<a class="d-flex card-img" href="#editLayoutItem" data-toggle="modal" data-target="#editLayoutItem">
                    //                     <img src="'.$doc->media_disk_path_relative.'" alt="Donec sit amet est at sem iaculis aliquam." class="list-thumbnail responsive border-0" width="100px" height="100px">
                    //                 </a>';
					// }else if($doc->media_mime=='image/jpg'){
					// 	$file_view='<a class="d-flex card-img" href="#editLayoutItem" data-toggle="modal" data-target="#editLayoutItem">
                    //                     <img src="'.$doc->media_disk_path_relative.'" alt="Donec sit amet est at sem iaculis aliquam." class="list-thumbnail responsive border-0" width="100px" height="100px">
                    //                 </a>';
					// }

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

					$row[]	=	$doc->media_text;

					$row[]	=	ucwords(str_replace('_',' ',$doc->media_type));

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


	public function onSaveDocuments(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$document_type=post_data('document_type');
				$document_text=post_data('document_text');
				$document_heading=post_data('document_youtube_link_heading');
				$document_youtube_link=post_data('document_youtube_link');
				$file_size='20';

				$file_external_type=($document_type=='testimonial_youtube_link')?'2':'1';
				
				if(!is_file(DIR_UPLOADS.'/app')){
					@mkdir(DIR_UPLOADS.'/app', 0777);
				}

				$ignored=array('trending_progmes_image','students_works_with_image','client_image','partners_image','skills_image','paymentgateway_image','gallery_image','hero_banner_image','testimonial_youtube_link','recognition_badge_image','member_of_image','listen_to_students_video');													

				if(isset($_FILES['documet_file']) && $_FILES['documet_file']['name']!=''){

					if(!in_array($document_type, $ignored)){
						$document_data=$this->sm->get_file(array('media_type'=>$document_type));

						if(!empty($document_data)){
							if(is_file($document_data->media_disk_path)){
								@unlink($document_data->media_disk_path);
							}

							$this->sm->delete_file(array('media_type'=>$document_type));
						}
					}

					if($document_type=='listen_to_students_video'){
						$document_heading=post_data('student_name');
						$document_youtube_link='';
						$file_size='100';
					}
						

					$document_data_array=array(
						'file_name'=>'documet_file',
						'file_types'=>'png,jpg,jpeg,mp4,ico',
						'file_size'=>$file_size,
						'file_type'=>$document_type,
						'file_heading_text'=>$document_heading,
						'file_text'=>$document_text,
						'file_youtube_link'=>$document_youtube_link,
						'file_type_id'=>'0',
						'file_absolute_path'=>'app/',
						'file_relative_path'=>'app'
					);

					$inserted=$this->onUploadFiles($document_data_array);

					if(is_numeric($inserted)){

						if($document_type=='listen_to_students_video'){
							if(isset($_FILES['documet_file_snapshot']) && $_FILES['documet_file_snapshot']['name']!=''){

								$document_snapshot_data_array=array(
									'file_name'=>'documet_file_snapshot',
									'file_types'=>'png,jpg,jpeg',
									'file_type'=>'listen_to_students_video_snapshot',
									'file_heading_text'=>'',
									'file_text'=>'',
									'file_youtube_link'=>'',
									'file_type_id'=>$inserted,
									'file_absolute_path'=>'app/',
									'file_relative_path'=>'app'
								);

								$uploaded=$this->onUploadFiles($document_snapshot_data_array);

								if(is_numeric($uploaded)){
									$return['success']='Snapshot uploaded successfully';
								}else{
									$return['error']='Snapshot not uploaded.'.$uploaded;
								}
							}
						}else{
							$return['success']='Document uploaded successfully';
						}


					}else{
						$return['error']='Document not uploaded.'.$inserted;
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


	public function onDeleteDocument(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$document_type=post_data('file_type');
				$_document_id=post_data('file_id');

				$document_id=decode_data($_document_id);

				$document_data=$this->sm->get_file(array('media_type'=>$document_type,'storage_id'=>$document_id));

				if(!empty($document_data)){
					if(is_file($document_data->media_disk_path)){
						@unlink($document_data->media_disk_path);
					}

					$deleted=$this->sm->delete_file(array('media_type'=>$document_type,'storage_id'=>$document_id));

					if($deleted){
						$snapshot=$this->sm->get_file(array('media_type'=>'listen_to_students_video_snapshot','media_type_data_id'=>$document_id));
						if(!empty($snapshot)){
							if(is_file($snapshot->media_disk_path)){
								@unlink($snapshot->media_disk_path);
							}

							$this->sm->delete_file(array('media_type'=>'listen_to_students_video_snapshot','storage_id'=>$snapshot->storage_id));
						}
						$return['success']='Document deleted from the system';
					}else{
						$return['error']='Document can not be deleted at this mmment';
					}

				}else{
					$return['error']='Document not found';
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
}