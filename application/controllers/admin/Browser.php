<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Browser  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Settings';

			$this->theme->title($this->data['page_title'])->load('browser/vw_browser', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onCreateFiles(){
		 if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){

				$user_id=decode_data(session_userdata('admin_id'));
				$_folder_id=post_data('document_folder');

				if(!empty($_folder_id)){
					$folder_id=decode_data($_folder_id);
					$folder=$folder_id;
					$parent_folder_id=$folder_id;
				}else{
					$folder='';
					$parent_folder_id='0';
				}

				$document_data_array=array(
					'file_types'=>'png,jpg,jpeg,mp4,ico,pdf',
					'file_folder'=>$folder,
					'file_parent_id'=>$parent_folder_id,
					'file_uploaded_by'=>$user_id
				);

				//print_obj($document_data_array);die;


				$inserted=$this->onUploadFiles($document_data_array,'pluploader');

				//echo $inserted;
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onCreateBrowseFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$parent_folder=post_data('file_parent_folder');

				//echo $parent_folder;

				if(!empty($parent_folder)){
					$parent_data    =	$this->sm->get_file(array('media_disk_name'=>$parent_folder,'storage_type'=>'1'));

					//print_obj($parent_data);die;

					$folder_path=$parent_data->media_disk_path;
					$relative_path=$parent_data->media_disk_path_relative;
					$file_parent_id=$parent_data->storage_id;

					if(isset($_FILES['file_browse']) && $_FILES['file_browse']['name']!=''){

						$ext = pathinfo($_FILES['file_browse']['name'], PATHINFO_EXTENSION);

						$file_data=array(
							'file_size'=>'10',
							'file_name'=>'file_browse',
							'file_types'=>'png,jpg,jpeg,webp',
							'file_parent_id'=>$file_parent_id,
							'file_parent_folder'=>$folder_path,
							'file_parent_relative_url'=>$relative_path,
							'file_compress'=>($ext==='webp')?false:true,
							'file_compress_protocol'=>'webp',
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);


						//print_obj($file_data);die;

						$file_id=$this->onUploadFiles($file_data);

						//print_obj($file_id);die;

				        if($file_id){
				        	$return['success']='File Uploaded Successfully';
				        }else{
				        	$return['error']='File can not be uploaded at this moment';
				        }
					}else{
			        	$return['error']='No File selected';
			        }


				}else{
					$return['error']='No folder found to upload';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onCreateFolder(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));
				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$folder_name = 	clean_data($decrypted['folder_name']);

				$parent_folder_name=post_data('parent_folder_name');

				$folder = basename(html_entity_decode($folder_name, ENT_QUOTES, 'UTF-8'));

				// Make sure we have the correct directory
				if (isset($decrypted['parent_folder_name']) && $decrypted['parent_folder_name']!='') {
					$parent_folder_id=decode_data(clean_data($decrypted['parent_folder_name']));
					$parent_folder=$this->sm->get_file(array('storage_id'=>$parent_folder_id));
					if(!empty($parent_folder)){
						$directory=$parent_folder->media_disk_path;
					}else{
						$parent_folder_id=null;
						$is_root=TRUE;
						$directory = '/home/thencriptechindia/'.$this->data['static_assests_path_domain'].'/data';//DIR_UPLOADS. '/data';
					}
				} else {
					$parent_folder_id=null;
					$is_root=TRUE;
					$directory = '/home/thencriptechindia/'.$this->data['static_assests_path_domain'].'/data';//DIR_UPLOADS. '/data';
				}

				//home/thencriptechindiaext_root/static_waytoadmissions_com/data

				//home/thencriptechindiaext_root/static_waytoadmissions_com/data/courses_old/ 

				//echo $directory;die;

				// Check its a directory
				if ($is_root!=TRUE && !is_dir($directory)){
					$return['error'] = 'Warning: Directory does not exist!';
				}else{
					// Validate the filename length
					if ((utf8_strlen($folder) < 3) || (utf8_strlen($folder) > 128)) {
						$return['error'] = 'Warning: Folder name must be between 3 and 255!';
					}else{
						// Check if directory already exists or not
						if (is_dir($directory . '/' . $folder)) {
							$return['error'] = 'Warning: A folder with the same name "'.$folder_name.'" already exists!';
						}else{
							$dir=$directory .'/'. $folder;
							mkdir($dir, 0777);
							chmod($dir, 0777);

							@touch($dir . '/' . 'index.html');

							$media_disk_path=str_replace('\\', '/', $directory.'/'.$folder);

							$basepath=str_replace('\\', '/', realpath(FCPATH));
    						$relative_path=str_replace($basepath.'/', '', $media_disk_path);

    						if(DIR_CDN!=''){
    							$relative_url=DIR_CDN.'data/'.$folder;
    						}else{
    							$relative_url=base_url().'data/'.$folder;
    						}

    						

							$folder_data=array(
								'storage_type'=>'1',
								'storage_parent_id'=>$parent_folder_id,
								'media_disk_path'=>$media_disk_path,
								'media_disk_path_relative'=>$relative_url,
								'media_disk_name'=>encode_data($folder),
								'media_org_name'=>$folder,
								'media_uploaded_by'=>$user_id
							);

							$this->sm->store_file($folder_data);

							$return['success']='Success: Folder created!';
						}
					}	
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onDeleteFolderFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id 		=	decode_data(session_userdata('admin_id'));
				$ctext 			=	post_data('ctext');
				$security_token = 	$this->data['security_token'];
				$decrypted 		= 	CryptoJsAes::decrypt($ctext, $security_token);

				//print_obj($decrypted);

				$folder_id 		= 	decode_data(clean_data($decrypted[0]));

				//print_obj($folder_id);
				$delete_method 	= 	clean_data($decrypted[1]);

				$delete_type 	= 	clean_data($decrypted[2]);

				$folder_data	=	$this->sm->get_file(array('media_disk_name'=>$folder_id));

				//print_obj($folder_data);die;

				if(!empty($folder_data)){

					$paths =	$folder_data->media_disk_path;

					if (!is_dir($paths)) {
						$return['error']='Warning: You can not delete this directory!';
					}else{
						
						if($delete_method=='move_to_trash'){

						}else if($delete_method=='delete_permanent'){
							if(is_dir($paths)){
								@rrmdir($paths);
							}

							$this->sm->delete_file(array('storage_id'=>$folder_data->storage_id));
						}

						$return['success'] = 'Success: Your file or directory has been deleted!';
					}

				}else{
					$return['error']='Warning: You can not delete this directory!';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onLoadBrowserFolderData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				if($this->data['userdata']->user_role=='1'){

					$_parent_folder=post_data('parent_folder');
					$parent_folder_type=post_data('folder_back');

					//echo $_parent_folder;die;

					if(!empty($_parent_folder)){
						$parent_folder_id=decode_data($_parent_folder);

						// if($parent_folder_type==''){
						// 	// $_f_back=$parent_folder_type;
						// 	// if($_f_back=='back_to_parent'){
						// 	// 	$parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','storage_id'=>$parent_folder_id));
						// 	// 	print_obj();die;
						// 	// }else{
						// 	// 	$parent_folder_data=$this->sm->get_files(array('storage_type'=>'1','storage_parent_id'=>$parent_folder_id));
						// 	// }

						// 	$parent_folder_data=$this->sm->get_files(array('storage_type'=>'1','storage_parent_id'=>$parent_folder_id));

							
						// }else{
							
						// }

						//echo $parent_folder_id;

						$parent_folder_data=$this->sm->get_files(array('storage_type'=>'1','storage_parent_id'=>$parent_folder_id));

						//print_obj($parent_folder_data);die;

						$this->data['system_folders']=$parent_folder_data;
					}else{
						$this->data['system_folders']=$this->sm->get_files(array('storage_type'=>'1','storage_parent_id'=>null),'storage_id');
					}


					//print_obj($this->data['system_folders']);die;

					$return['html']=$this->theme->view('_pages/browser/vw_browser_folders',$this->data,true);

					header('Content-Type: application/json');

					echo json_encode($return);
					session_write_close();
				}else{
					redirect($this->data['admin_base_url']);
				}
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onLoadBrowserFolderInnerData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				if($this->data['userdata']->user_role=='1'){
					$user_id 		=	decode_data(session_userdata('admin_id'));
					$ctext 			=	post_data('ctext');
					$security_token = 	$this->data['security_token'];
					$decrypted 		= 	CryptoJsAes::decrypt($ctext, $security_token);

					//print_obj($decrypted);die;

					$parent 		=	decode_data(clean_data($decrypted[0]));



					$parent_data    =	$this->sm->get_files(array('storage_parent_id'=>$parent));



					if(!empty($parent_data)){
						foreach ($parent_data as $key => $value) {
							$folder_data[]=array(
								'storage_id'=>encode_data($value->storage_id),
								'storage_type'=>$value->storage_type,
								'media_disk_path'=>$value->media_disk_path,
								'media_disk_path_relative'=>$value->media_disk_path_relative,
								'media_disk_name'=>$value->media_disk_name,
								'media_org_name'=>$value->media_org_name,
								'media_size'=>$value->media_size,
								'media_size2'=>$value->media_size2,
								'media_mime'=>$value->media_mime
							);
						}
					}else{
						$folder_data=array();
					}

					//print_obj($folder_data);die;

					$this->data['folder_data']=$folder_data;


					$return['html']=$this->theme->view('_pages/browser/vw_browser_folders_data',$this->data,true);

					header('Content-Type: application/json');

					echo json_encode($return);
					session_write_close();
				}else{
					redirect($this->data['admin_base_url']);
				}
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}




	public function onBrowseFolder(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$parent_folder=post_data('parent_folder');

				if(!empty($parent_folder)){

					$parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','media_disk_name'=>$parent_folder));

					$_sub_folder_data=$this->sm->get_files(array('storage_parent_id'=>$parent_folder_data->storage_id,'storage_type'=>'1'));

					//print_obj($_sub_folder_data);die;


					if(!empty($_sub_folder_data)){
						foreach ($_sub_folder_data as $key => $value) {
							$_super_parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','storage_id'=>$value->storage_super_parent_id));
							if(is_dir_empty($value->media_disk_path)){
								$super_parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','storage_parent_id'=>$value->storage_super_parent_id));
								$parent_folder_disk_name=$super_parent_folder_data->media_disk_name;
							}else{
								$parent_folder_disk_name=$parent_folder_data->media_disk_name;
							}

							$sub_folder_data[]=array(
								'storage_id'=>encode_data($value->storage_id),
								'media_org_name'=>str_ellipses($value->media_org_name),
								'storage_parent_id'=>encode_data($value->storage_parent_id),
								'parent_folder_disk_name'=>$parent_folder_disk_name,
								'super_parent_folder_disk_name'=>$_super_parent_folder_data->media_disk_name,
								'media_disk_name'=>$value->media_disk_name,
								'back_path'=>$value->storage_back_path,
								'created_date'=>date('d/m/Y',strtotime($value->created_at))
							);
						}
					}

					$this->data['system_folders']=$sub_folder_data;

					$this->data['system_pfolders']=$parent_folder_data;
				}

				$return['html']=$this->theme->view('_pages/browser/vw_browser_folders_tiny',$this->data,true);



				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onBrowseFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$parent_folder=post_data('parent_folder');

				$file_data=array();

				if($parent_folder!=''){
					$parent_data    =	$this->sm->get_file(array('media_disk_name'=>$parent_folder,'storage_type'=>'1'));

					//print_obj($parent_data);die;

					$files_in_parent=$this->sm->get_files(array('storage_parent_id'=>$parent_data->storage_id,'storage_type'=>'2'),'storage_id');

					if(!empty($files_in_parent)){
						foreach ($files_in_parent as $key => $value) {
							$file_data[]=array(
								'file_id'=>encode_data($value->storage_id),
								'file_name'=>$value->media_org_name,
								'file_relative_path'=>$value->media_disk_path_relative
							);
						}
					}
				}


				$this->data['system_files']=$file_data;

				$return['html']=$this->theme->view('_pages/browser/vw_browser_folders_files_tiny',$this->data,true);

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchStorageFolder(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$path_name=post_data('path_name');
				$path_parent=post_data('path_parent');


				if($path_name!=''){
					$parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','media_disk_name'=>$path_parent,'storage_type'=>'1'));

					$_sub_folder_data=$this->sm->get_files(array('storage_parent_id'=>$parent_folder_data->storage_id,'storage_type'=>$path_type));

					if(!empty($_sub_folder_data)){
						foreach ($_sub_folder_data as $key => $value) {
							$_super_parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','storage_id'=>$value->storage_super_parent_id));
							if(is_dir_empty($value->media_disk_path)){
								$super_parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','storage_parent_id'=>$value->storage_super_parent_id));
								$parent_folder_disk_name=$super_parent_folder_data->media_disk_name;
							}else{
								$parent_folder_disk_name=$parent_folder_data->media_disk_name;
							}

							$sub_folder_data[]=array(
								'storage_id'=>encode_data($value->storage_id),
								'media_org_name'=>str_ellipses($value->media_org_name),
								'storage_parent_id'=>encode_data($value->storage_parent_id),
								'parent_folder_disk_name'=>$parent_folder_disk_name,
								'super_parent_folder_disk_name'=>$_super_parent_folder_data->media_disk_name,
								'media_disk_name'=>$value->media_disk_name,
								'back_path'=>$value->storage_back_path,
								'created_date'=>date('d/m/Y',strtotime($value->created_at))
							);
						}
					}

					$this->data['system_folders']=$sub_folder_data;
				}

				$return['html']=$this->theme->view('_pages/browser/vw_browser_folders_tiny',$this->data,true);

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{

			}
		}else{

		}
	}


	public function onCreateSubFolder(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('admin_id'));

				$parent_folder_disk_name=post_data('parent_folder_disk_name');

				$FCPATH=$directory = '/home/thencriptechindia/'.$this->data['static_assests_path_domain'];

				$folder_name=post_data('folder_name');

				$parent_folder_data=$this->sm->get_file(array('storage_type'=>'1','media_disk_name'=>$parent_folder_disk_name));

				//echo $parent_folder_disk_name;

				//print_obj($parent_folder_data->media_disk_path);die;

				if(is_dir($parent_folder_data->media_disk_path)){
					$folder_path=$parent_folder_data->media_disk_path.'/'.$folder_name;

					if(is_dir($folder_path)){
						$return['error'] = 'Warning: A folder with the same name "'.$folder_name.'" already exists!';
					}else{
						$parent_folder_id=$parent_folder_data->storage_id;
						$dir=$folder_path;
						mkdir($dir, 0777);
						chmod($dir, 0777);

						@touch($dir . '/' . 'index.html');

						if(is_dir($dir)){
							$media_disk_path=str_replace('\\', '/', $dir);

							$basepath=str_replace('\\', '/', realpath($FCPATH));
							$relative_path=str_replace($basepath.'/', '', $media_disk_path);

							//echo $basepath;

							$relative_url=DIR_CDN.$relative_path;

							//echo $relative_url;die;

							$folder_data=array(
								'storage_type'=>'1',
								'storage_parent_id'=>$parent_folder_id,
								'media_disk_path'=>$media_disk_path,
								'media_disk_path_relative'=>$relative_url,
								'media_disk_name'=>encode_data($folder_name),
								'media_org_name'=>$folder_name,
								'media_uploaded_by'=>$user_id
							);

							$this->sm->store_file($folder_data);

							$return['success']='Success: Folder created!';
						}else{
							$return['error'] = 'Warning: Folder not created!';
						}	
					}
				}else{
					$return['error'] = 'Warning: Parent Folder not created!';
				}


				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	///


	public function indexFileCompressWindow(){
		if(session_userdata('isAdminLoggedin')){
			$this->data['page_title']='Settings';

			$this->theme->title($this->data['page_title'])->load('browser/vw_browser_storage_compress', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchStoragedata(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$storage_type=post_data('storage_type');

				$param['column_order'] = array(
					null,
					null,
					'media_size'
				);

				$param['column_search'] = array('media_disk_name','media_org_name','user_storage_type');
				$param['order'] = array('storage_id' => 'ASC');
				$posts=$this->input->post();

				$application_type=$posts['application_type'];

				if(isset($posts['image_type'])){
					$param['_user_storage_type']=$posts['image_type'];
				}

				$param['storage_type']='2';


				$param['not_in_storage_type']='application/pdf,youtube';

				$list = $this->sm->_get_guser_files($posts,$param,FALSE,FALSE);

				//print_obj($list);die;
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $strg){
					$no++;

					$row = array();

					if(in_array($strg->user_storage_type, array('user_logo','user_banner'))){
						$college_data=$this->um->get_college_profile_data(array('college_user_id'=>$strg->user_file_type_id));
						$image_of=$college_data->college_name;
						$image_alt_text=$college_data->colllege_logo_alt_text;
					}else{
						$image_of='';
						$image_alt_text='';
					}

					$image_url=$strg->media_disk_path_relative;

					$row[]	=	$no;
					$row[]	=	'<img src="'.$image_url.'" width="100px" height="100px">';
					$row[]	=	'Image of:'.$image_of.'<br>Image Alt:'.$image_alt_text.'<br>Image SEO Name:'.$strg->media_disk_name.'<br>'.ucwords(str_replace('_', ' ', $strg->user_storage_type)).'<br><button class="btn btn-xs btn-dark data_update_image_data" data-storage_id="'.$strg->storage_id.'">Update</button>';	
					$row[]	=	$strg->media_mime;
					$row[]	=	(is_numeric($strg->media_size2))?formatSize($strg->media_size2):$strg->media_size2;

					// if(!empty($strg->media_disk_path_relative) && file_exists($srg->media_disk_path)){
					// 	$row[]  =	($strg->media_mime!='image/webp')?'<button type="button" class="btn btn-xs btn-secondary btn_convert_to_webp" data-storage_id="'.$strg->storage_id.'">Convert to WEBP</button>':'';
					// }else{
					// 	$row[]	=	'File not found';
					// }

					if($application_type!='seo_update'){
						$row[]  =	($strg->media_mime!='image/webp')?'<button type="button" class="btn btn-xs btn-secondary btn_convert_to_webp" data-storage_id="'.$strg->storage_id.'">Convert to WEBP</button>':'';
					}else{
						$row[]='';
					}

					
	
						

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_guser_files($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_guser_files($posts,$param,TRUE),
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

	public function onConvertFile(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$storage_id=post_data('storage_id');

				$converted=$this->onCompressConvertFiles($storage_id,$this->data['userdata']->user_id);

				$return['success']=$converted;

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onCreateSelectedBrowseFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$parent_folder=post_data('file_upload_parent_folder');
				$file_type=post_data('file_upload_type');

				$file_type_id=post_data('file_type_id');

				$file_type=post_data('file_type');

				$file_upload_type_name=post_data('file_upload_type_name');

				// echo $parent_folder;die;

				if(!empty($parent_folder)){
					$parent_data    =	$this->sm->get_file(array('media_disk_name'=>$parent_folder,'storage_type'=>'1'));

					//print_obj($parent_data);die;

					$folder_path=$parent_data->media_disk_path;
					$relative_path=$parent_data->media_disk_path_relative;
					$file_parent_id=$parent_data->storage_id;

					$file_type_id=decode_data($file_type_id);

					if(isset($_FILES['file_browse_file']) && $_FILES['file_browse_file']['name']!=''){

						$ext = pathinfo($_FILES['file_browse_file']['name'], PATHINFO_EXTENSION);

						$file_data=array(
							'file_size'=>'10',
							'file_name'=>'file_browse_file',
							'file_types'=>'png,jpg,jpeg,webp,pdf',
							'file_parent_id'=>$file_parent_id,
							'file_parent_folder'=>$folder_path,
							'file_parent_relative_url'=>$relative_path,
							'file_compress'=>($ext==='webp' || $ext==='pdf')?false:true,
							'file_compress_protocol'=>'webp',
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);


						//print_obj($file_data);die;

						$file_id=$this->onUploadFiles($file_data);

						//print_obj($file_id);die;

				        if($file_id){
				        	$this->sm->delete_user_file(array('user_file_type_id'=>$file_type_id,'user_file_type'=>'15','user_storage_type'=>$file_type));

				            $_storage_data=array(
				            	'user_file_storage_id'=>$file_id,
				            	'user_file_type_id'=>$file_type_id,
				            	'user_file_type'=>$file_type,
				            	'user_storage_type'=>$file_type,
				            	'user_storage_type_2'=>$file_upload_type_name
				            );

				            $this->sm->store_user_file($_storage_data);
				        	$return['success']='File Uploaded Successfully';
				        }else{
				        	$return['error']='File can not be uploaded at this moment';
				        }
					}else{
			        	$return['error']='No File selected';
			        }
				}else{
					$return['error']='No folder found to upload';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onCreateSpecBrowseFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$parent_folder=post_data('file_spec_upload_parent_folder');
				$file_upload_type=post_data('file_spec_upload_type');
				$file_upload_type_name=post_data('file_upload_type_name');

				//echo $parent_folder;die;

				if(!empty($parent_folder)){
					$parent_data    =	$this->sm->get_file(array('media_disk_name'=>$parent_folder,'storage_type'=>'1'));

					//print_obj($parent_data);die;

					$folder_path=$parent_data->media_disk_path;
					$relative_path=$parent_data->media_disk_path_relative;
					$file_parent_id=$parent_data->storage_id;

					$file_type_id=decode_data($file_type_id);

					if(isset($_FILES['file_browse_file']) && $_FILES['file_browse_file']['name']!=''){

						$ext = pathinfo($_FILES['file_browse_file']['name'], PATHINFO_EXTENSION);

						$file_data=array(
							'file_size'=>'10',
							'file_name'=>'file_browse_file',
							'file_types'=>'png,jpg,jpeg,webp',
							'file_parent_id'=>$file_parent_id,
							'file_parent_folder'=>$folder_path,
							'file_parent_relative_url'=>$relative_path,
							'file_compress'=>($ext==='webp')?false:true,
							'file_compress_protocol'=>'webp',
							'file_uploaded_by'=>$this->data['userdata']->user_id
						);


						//print_obj($file_data);die;

						$file_id=$this->onUploadFiles($file_data);

						//print_obj($file_id);die;

				        if($file_id){
				        	$return['success']='File Uploaded Successfully';
				        }else{
				        	$return['error']='File can not be uploaded at this moment';
				        }
					}else{
			        	$return['error']='No File selected';
			        }
				}else{
					$return['error']='No folder found to upload';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onDeleteBrowseFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_file_id=post_data('file_id');

				$file_id=decode_data($_file_id);

				$file_data    =	$this->sm->get_file(array('storage_id'=>$file_id));

				if(!empty($file_data)){

					if(file_exists($file_data->media_disk_path)){
						@unlink($file_data->media_disk_path);
						$return['success']='File deleted successfully.';
					}else{
						$return['error']='File not found in the system.';
					}

				}else{
					$return['error']='File not found';
				}

				header('Content-Type: application/json');

				echo json_encode($return);
				session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onLoadFiles(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_files=array();

				$folder=post_data('parent_folder');

				$file_name=post_data('folder_file_name');

				$param['media_disk_name']=$folder;

				$folder_files=$this->sm->_get_files(null,$param,FALSE,FALSE);

				if(!empty($folder_files)){
					foreach ($fodler_files as $key => $value) {
						$_files[]=array(
							'file_id'=>encode_data($value->storage_id),
							'file_name'=>$value->media_org_name,
							'file_size'=>$value->media_size2
						);
					}
				}

				$return['files']=$_files;


				header('Content-Type: application/json; charset=utf-8');

        		echo json_encode($return);
        		session_write_close();

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	///


}