<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Drive  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Drive';

			$this->theme->title($this->data['page_title'])->load('drive/vw_manage_drive', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onUploadDriveFiles(){
	    // Check if the user is an admin and is logged in
	    if($this->session->userdata('isAdminLoggedin') == TRUE && $this->session->userdata('admin_id')){
	        // Check for AJAX request and POST method
	        if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST'){

	            // Collect POST data
	            $parent_folder = post_data('file_spec_upload_parent_folder');
	            $file_upload_type = post_data('file_spec_upload_type');
	            $file_spec_group_name = post_data('file_spec_group_name');
	            $file_type_id = post_data('file_type_id'); // Assuming this is part of your POST data

	            // Initialize return array
	            $return = array();

	            // Check if the parent folder is not empty
	            if(!empty($parent_folder)){

	                // Retrieve parent data
	                $parent_data = $this->sm->get_file(array('storage_id' => $parent_folder, 'storage_type' => '1'));

	                if(!empty($parent_data)){
	                    // Extract data from parent_data object
	                    $folder_path = $parent_data->media_disk_path;
	                    $relative_path = $parent_data->media_disk_path_relative;
	                    $file_parent_id = $parent_data->storage_id;

	                    // Decode the file_type_id if it is set
	                    if(isset($file_type_id)){
	                        $file_type_id = decode_data($file_type_id);
	                    }

	                    // Check if files are uploaded
	                    if(isset($_FILES['file_browse_file']) && $_FILES['file_browse_file']['name'] != ''){

	                        // Count the number of files
	                        //$file_count = count($_FILES['file_browse_file']['name']);

	                        // Determine the file extension
	                        $ext = '';
	                        if(is_string($_FILES['file_browse_file']['name'])){
	                            $ext = pathinfo($_FILES['file_browse_file']['name'], PATHINFO_EXTENSION);
	                        } else if(is_array($_FILES['file_browse_file']['name'])){
	                            $ext = pathinfo($_FILES['file_browse_file']['name'][0], PATHINFO_EXTENSION);
	                        }

	                        // Prepare file data array
	                        $file_data = array(
	                            'file_size' => '5',
	                            'file_name' => 'file_browse_file',
	                            'file_types' => 'png,jpg,jpeg,webp,pdf,gif',
	                            'file_group_name' => $file_spec_group_name,
	                            'file_parent_id' => $file_parent_id,
	                            'file_parent_folder' => $folder_path,
	                            'file_parent_relative_url' => $relative_path,
	                            'file_compress' => ($ext === 'webp') ? false : true,
	                            'file_compress_protocol' => 'webp',
	                            'file_uploaded_by' => $this->data['userdata']->user_id
	                        );

	                        // Upload the files
	                        $file_id = $this->onUploadFiles($file_data);

	                        // Determine the outcome
	                        if($file_id){
	                            $return['success'] = 'File Uploaded Successfully';
	                        } else {
	                            $return['error'] = 'File cannot be uploaded at this moment';
	                        }
	                    } else {
	                        $return['error'] = 'No File selected';
	                    }
	                } else {
	                    $return['error'] = 'Parent folder not defined';
	                }
	            } else {
	                $return['error'] = 'No folder found to upload';
	            }

	            // Set content type to JSON and return the result
	            $this->output
	                ->set_content_type('application/json')
	                ->set_output(json_encode($return));

	        } else {
	            // Redirect if not an AJAX request or if not using POST
	            redirect($this->data['admin_base_url']);
	        }
	    } else {
	        // Redirect if user is not admin or not logged in
	        redirect($this->data['admin_base_url']);
	    }
	}



	function onSearchDriveFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
                    'storage_id'                    
                );

                $param['column_search'] = array('media_org_name');
                $param['order'] = array('storage_id' => 'DESC');

                $param['storage_type']='2';
                $posts=$this->input->post();
                

                $list = $this->sm->_get_files($posts,$param,FALSE,FALSE);

                //print_obj($list);die;

                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $listing){
                    $no++;

                    $row = array();

                    $action='<div class="btn-group btn-group-xs">
                    <button type="button" class="btn btn-sm btn-dark btn_del_ads">Delete</button>
                    </div>';

                    // $row[]	=	$no;

                    if(!empty($listing->media_disk_path_relative)){
                    	if(file_exists($listing->media_disk_path_relative)){
                    		$img=$listing->media_disk_path_relative;
                    	}else{
                    		$img=base_url('public/data/app/app_data/no.jpg');
                    	}
                    }else{
                    	$img=base_url('public/data/app/app_data/no.jpg');
                    }

                   	$row[]	=	'<img src="'.$img.'" class="img-fluid" draggable="false">'; 

                   	$row[] 	=	$action;                     

                    $data[] = 	$row;
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->_get_files($posts,$param,TRUE),
                    "recordsFiltered" => $this->sm->_get_files($posts,$param,TRUE),
                    "data" => $data,
                );

                //print_obj($output);die;
                
                echo json_encode($output);

               

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function onSearchLoadDriveFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$file_data=array();

				$param['column_order'] = array(
                    'storage_id'                    
                );

                $param['column_search'] = array('media_org_name','media_identity_name');
                $param['order'] = array('storage_id' => 'DESC');

                
                $posts=$this->input->post();


                $param['storage_type']='2';

                if(isset($posts['file_name']) && !empty($posts['file_name'])){
                	//$param['media_org_name']=$posts['file_name'];

                	$posts['search']['value']=$posts['file_name'];
                }

                if(isset($posts['file_type']) && $posts['file_type']!='0'){
                	$param['media_type']=$posts['file_type'];
                	if($posts['file_type']=='youtube'){
                		$param['storage_type']='3';
                	}else{
						$param['storage_type']='2';
                	}
                	
                }

                 if((isset($posts['file_name']) && !empty($posts['file_name'])) && (isset($posts['file_type']) && $posts['file_type']!='0')){
                 	$param['media_type']=$posts['file_type'];
                 	//$param['media_org_name']=$posts['file_name'];
                 	$posts['search']['value']=$posts['file_name'];

                 	if($posts['file_type']=='youtube'){
                		$param['storage_type']='3';
                	}else{
						$param['storage_type']='2';
                	}
                 }
                           

                $list = $this->sm->_get_files($posts,$param,FALSE,FALSE);

                //print_obj($list);die;

                foreach ($list as $key => $value) {

                	$file_name=explode('.', $value->media_disk_name);
                	
                	$file_data[]=array(
                		'file_id'=>$value->storage_id,
                		'file_name'=>$value->media_disk_name,
                		'file_wname'=>$file_name[0],
                		'file_extension'=>$file_name[1],
                		'file_identification_name'=>$value->media_identity_name,
                		'file_size'=>$value->media_size2,
                		'file_type'=>$value->media_type,
                		'file_url'=>$value->media_disk_path_relative
                	);
                }

                //print_obj($file_data);die;

                $this->data['recordsTotal'] = $this->sm->_get_files($posts,$param,TRUE);

                $this->data['file_data']=$file_data;


                $return['html']=$this->theme->view('_pages/drive/vw_manage_drive_file_load',$this->data,true);

                json_headers($return);


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
}