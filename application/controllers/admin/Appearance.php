<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Appearance  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function indexMenues(){
		if(session_userdata('isAdminLoggedin')){

			//$this->onCreateMenuJSON();die;

			$this->data['page_title']='Ads';

			$this->data['menu_categories']=$this->sm->get_menue_categories(array('menu_category_status'=>'1'),FALSE);

			$segment=$this->uri->segment(3);
			$segment4=$this->uri->segment(4);

			//echo $segment;
			//echo $segment4;die;


			if($category!=0){
				$id=decode_data($category);
			}else{
				$id='1';
			}

			echo $id;

			// $data_searched=$this->sm->__get_system_search_data(null,FALSE);			

			// if(!empty($data_searched)){
			// 	foreach ($data_searched as $key => $value) {
			// 		if($value->search_data_type=='COLLEGE_NAME'){
			// 			$search_data_type='College';
			// 			$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$value->search_data_type_id));
			// 			$searched_access_url=$college_data->access_url;
			// 		}else if($value->search_data_type=='UNIVERSITY_NAME'){
			// 			$search_data_type='University';
			// 			$searched_access_url='';
			// 		}else if($value->search_data_type=='EXAM_NAME'){
			// 			$search_data_type='Exam';
			// 			$searched_access_url='';
			// 		}

			// 		$_searched_data_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->search_data_type_id,'user_storage_type'=>'user_logo'));

			// 		if(!empty($_searched_data_logo) && !empty($_searched_data_logo->media_disk_path_relative)){
	  //                   $searched_data_logo=$_searched_data_logo->media_disk_path_relative.'?tr=h-50,w-50,c-force';
	  //               }else{
	  //                   $searched_data_logo=base_url().'uploads/app/default/w2a.png?tr=h-50,w-50,c-force';
	  //               }


	  //               $slug='';

			// 		$searched_data['searched_data'][]=array(
			// 			'serach_data_name'=>strtoupper($value->search_data_name),
			// 			'search_data_type'=>$search_data_type,
			// 			'searched_data_logo'=>$searched_data_logo,
			// 			'searched_access_url'=>$searched_access_url
			// 		);
			// 	}
			// }

			// $json_file=FCPATH.'uploads/app/searchresults.json';

			// $fp = fopen($json_file, 'w');
			// fwrite($fp, json_encode($searched_data));
			// fclose($fp);

			// //die;

			// $str = file_get_contents($json_file);

			// $json = json_decode($str, true);

			// print_obj($json);die;

			//$top_menues=$this->sm->get_menues(array('menu_is_upper_top'=>'1'),FALSE,'menu_serial','ASC');

			$top_menues=$this->sm->get_menues(array('menu_category_id'=>$id),FALSE,'menu_serial','ASC');

			if(!empty($top_menues)){
				foreach ($top_menues as $key => $value) {
					$slug_data=$this->sm->get_slug_urls(array('url_type'=>'static_url','url_type_id'=>$value->menu_id));
					$_top_menues[]=array(
						'menu_id'=>$value->menu_id,
						'menu_name'=>$value->menu_name,
						'menu_link'=>$value->menu_link,
						'menu_status'=>$value->menu_is_active,
						'menu_meta_heading'=>$slug_data->url->url_meta_heading,
						'menu_meta_title'=>$slug_data->url->meta_title,
						'menu_mete_desc'=>$slug_data->url->url_meta_desc,
						'menu_meta_keywords'=>$slug_data->url->url_meta_key_words,
						'menu_meta_og_title'=>$slug_data->url->url_og_title,
						'menu_meta_og_desc'=>$slug_data->url->url_og_desc
					);
				}
			}else{
				$_top_menues=array();
			}

			//print_obj($_top_menues);die;


			$this->data['top_menues']=$_top_menues;

			$this->theme->title($this->data['page_title'])->load('appearance/vw_menues', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onLoadMenu(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$menu_category=post_data('menu_category');

				$_menues=$this->sm->get_menues(array('menu_category_id'=>$menu_category),FALSE,'menu_serial','ASC');

				//print_obj($_menues);die;

				if(!empty($_menues)){
					foreach ($_menues as $key => $value) {
						$slug_data=$this->sm->get_slug_urls(array('url_type'=>'static_url','url_type_id'=>$value->menu_id));
						$menues[]=array(
							'menu_id'=>$value->menu_id,
							'menu_name'=>$value->menu_name,
							'menu_link'=>$value->menu_link,
							'menu_status'=>$value->menu_is_active,
							'menu_meta_heading'=>$slug_data->url->url_meta_heading,
							'menu_meta_title'=>$slug_data->url->meta_title,
							'menu_mete_desc'=>$slug_data->url->url_meta_desc,
							'menu_meta_keywords'=>$slug_data->url->url_meta_key_words,
							'menu_meta_og_title'=>$slug_data->url->url_og_title,
							'menu_meta_og_desc'=>$slug_data->url->url_og_desc
						);
					}
				}else{
					$menues=array();
				}

				$this->data['menues']=$menues;

				$return['html']=$this->theme->view('_pages/appearance/vw_menues_data',$this->data,true);

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexBanners(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Banners';


			$this->data['colleges']=$this->im->__get_college_profile_data('college_user_id,college_name,access_url',array('college_status'=>'1'),FALSE);

			$this->theme->title($this->data['page_title'])->load('appearance/vw_banners', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchBanners(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'banner_main_title'
				);

				$param['column_search'] = array('banner_main_title');
				$param['order'] = array('banner_id' => 'DESC');
				$posts=$this->input->post();


				$list = $this->sm->_get_banner_files($posts,$param,FALSE,FALSE);	

				//print_obj($list);die;			
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $banner){
					$no++;

					$row = array();

					$row[]=$no;

					$row[]='<img class="img-fluid img-thumbnail" src="'.$banner->media_disk_path_relative.'">'.$banner->banner_main_title;

					$banner_status=($banner->banner_status=='active')?'<button type="button" class="btn btn-xs btn-success">Active</button>':'<button type="button" class="btn btn-xs btn-danger">Inactive</button>';

					$action='<div class="btn-group btn-group-xs">'.$banner_status.'
						<button type="button" data-banner="'.encode_data($banner->banner_id).'" data-banner_title="'.$banner->banner_main_title.'" data-banner_sub_title="'.$banner->banner_sub_title.'" data-banner_link="'.$banner->banner_link.'" data-banner_link_type="'.$banner->banner_link_type.'" data-banner_status="'.$banner->banner_status.'" data-banner_image="'.$banner->media_disk_path_relative.'" data-serial="'.$banner->banner_serial.'" data-toggle="modal" data-target="#bannerUploadModal" class="btn btn-xs btn-primary btn_edit_banner"><i class="fa fa-pen fa-xs"></i></button>
						<button type="button" data-banner="'.encode_data($banner->banner_id).'" class="btn btn-xs btn-warning btn_compress_banner">Compress</button>
						<button class="btn btn-xs btn-dark btn_del_banner" data-bannerid="'.encode_data($banner->banner_id).'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';

					$row[]	=	$action;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_banner_files($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_banner_files($posts,$param,TRUE),
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


	public function onAddBanners(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_banner=post_data('_banner');
				$banner_title=post_data('banner_title');
				$banner_sub_title=post_data('banner_sub_title');

				$banner_status=post_data('banner_status');
				$banner_link_type=post_data('banner_link_type');
				$banner_link=post_data('banner_link');
				$banner_serial=post_data('banner_serial');
				$folder_name=date('Y');


				if(empty($_banner)){

					if($banner_link_type==1){

						$college_id=post_data('banner_link_college');
						$college_data=$this->im->__get_college_profile_data('college_user_id,college_name,access_url',array('college_user_id'=>$college_id));

						$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));
						$city_data=$this->com->get_city(array('city_id'=>$college_state->college_city_id));

						$subtitle=strtoupper($city_data->city_name.','.$state_data->state_name);

						$banner_data=array(
							'banner_main_title'=>strtoupper($college_data->college_name),
							'banner_sub_title'=>$subtitle,
							'banner_link'=>$college_data->access_url,
							'banner_link_type'=>$banner_link_type,
							'banner_serial'=>$banner_serial,
							'created_at'=>date('Y-m-d'),
							'created_by'=>decode_data(session_userdata('admin_id')),
							'banner_status'=>$banner_status
						);

					}else if($banner_link_type==2){
						$banner_data=array(
							'banner_main_title'=>$banner_title,
							'banner_sub_title'=>$banner_sub_title,
							'banner_link'=>$banner_link,
							'banner_link_type'=>$banner_link_type,
							'banner_serial'=>$banner_serial,
							'created_at'=>date('Y-m-d'),
							'created_by'=>decode_data(session_userdata('admin_id')),
							'banner_status'=>$banner_status
						);
					}
						

					$banner_id=$this->sm->store_banner_files($banner_data);

					if($banner_id){

					
						if(isset($_FILES['banner_image']) && $_FILES['banner_image']['name']!=''){

							$file_banner_found=$this->sm->get_user_file(array('user_storage_type'=>'banner_image','user_file_type_id'=>$banner_id));

							//print_obj($file_logo_found);die;

							if(!empty($file_banner_found)){
								if(is_file($file_banner_found->media_disk_path)){
									@unlink($file_banner_found->media_disk_path);
									$this->sm->delete_file(array('storage_id'=>$file_banner_found->storage_id));
								}
							}

							$ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);

							$file_banner_data=array(
								'file_size'=>'10',
								'file_name'=>'banner_image',
								'file_types'=>'png,jpg,jpeg,webp',
								'file_folder'=>'banners',
								'file_child_folder'=>$folder_name,
								'file_compress'=>($ext==='webp')?false:true,
								'file_compress_protocol'=>'webp',
								'file_uploaded_by'=>$this->data['userdata']->user_id
							);

							$file_id=$this->onUploadFiles($file_banner_data);

							if(!empty($file_id) && $file_id>0){

								$this->sm->delete_user_file(array('user_file_type_id'=>$banner_id,'user_storage_type'=>'banner_image'));

					            $banner_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>$banner_id,
					            	'user_file_type'=>'3',
					            	'user_storage_type'=>'banner_image'
					            );

					            $this->sm->store_user_file($banner_storage_data);
					        } 
						}
						

						$return['success']='banner added successfully';
					}else{
						$return['error']='Banner not added';
					}				
				}else{
					$banner_id=decode_data($_banner);

					$banner_data=array(
						'banner_main_title'=>$banner_title,
						'banner_sub_title'=>$banner_sub_title,
						'banner_link'=>$banner_link,
						'banner_link_type'=>$banner_link_type,
						'banner_serial'=>$banner_serial,
						'updated_at'=>date('Y-m-d'),
						'updated_by'=>decode_data(session_userdata('admin_id')),
						'banner_status'=>$banner_status
					);

					$updated=$this->sm->update_banner_files($banner_data,array('banner_id'=>$banner_id));

					if($updated){
						if(isset($_FILES['banner_image']) && $_FILES['banner_image']['name']!=''){

							$file_banner_found=$this->sm->get_user_file(array('user_storage_type'=>'banner_image','user_file_type_id'=>$banner_id));

							//print_obj($file_logo_found);die;

							if(!empty($file_banner_found)){
								if(is_file($file_banner_found->media_disk_path)){
									@unlink($file_banner_found->media_disk_path);
									$this->sm->delete_file(array('storage_id'=>$file_banner_found->storage_id));
								}
							}

							$file_banner_data=array(
								'file_size'=>'10',
								'file_name'=>'banner_image',
								'file_types'=>'png,jpg,jpeg',
								'file_folder'=>'banners',
								'file_child_folder'=>$folder_name,
								'file_compress'=>false,
								'file_uploaded_by'=>$this->data['userdata']->user_id
							);

							$file_id=$this->onUploadFiles($file_banner_data);

							if(!empty($file_id) && $file_id>0){

								$this->sm->delete_user_file(array('user_file_type_id'=>$banner_id,'user_storage_type'=>'banner_image'));

					            $banner_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>$banner_id,
					            	'user_file_type'=>'3',
					            	'user_storage_type'=>'banner_image'
					            );

					            $this->sm->store_user_file($banner_storage_data);
					        } 
						}

						$return['success']='Banner Updated successfully';
					}else{
						$return['error']='Banner not updated';
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


	public function onDeleteBanners(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_banner=post_data('_banner');

				if(!empty($_banner) && is_string($_banner)){
					$banner_id=decode_data($_banner);

					if(is_numeric($banner_id)){
						$get_banner_file=$this->sm->get_banner_file(array('user_file_type_id'=>$banner_id));

						if(!empty($get_banner_file)){
							$deleted=$this->sm->delete_banner_files(array('banner_id'=>$banner_id));
							if($deleted){
								if(is_file($get_banner_file->media_disk_path)){
									@unlink($get_banner_file->media_disk_path);
									$this->sm->delete_file(array('storage_id'=>$get_banner_file->storage_id));
								}

								$return['success']='Banner deleted successfully.';
							}else{
								$return['error']='Banner not deleted';
							}
						}else{
							$return['error']='Banner not deleted.';
						}
					}else{
						$return['error']='Banner not deleted.';
					}
				}else{
					$return['error']='Banner not deleted.';
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


	public function onCompressBanner(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$fid=post_data('fid');

				if(!empty($fid)){
					$updated=$this->onCompressConvertFiles($fid);

					$return['success']=$updated;
				}else{
					$return['error']='Banner not deleted.';
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

	
	public function onSearchMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'menu_country',
					'menu_country_code',
					'menu_name'
				);

				$param['column_search'] = array('menu_country','menu_country_code','menu_name');
				$param['order'] = array('menu_link_type' => 'ASC');
				$posts=$this->input->post();

				//echo $posts['menu_is_upper_top'];die;

				if(isset($posts['menu_is_upper_top']) && $posts['menu_is_upper_top']='1'){
					$param['menu_is_upper_top']=$posts['menu_is_upper_top'];
				}else if(isset($posts['menu_is_upper_top']) && $posts['menu_is_upper_top']='2'){
					if(isset($posts['parent_menu'])){
						$param['menu_parent_id']=($posts['parent_menu']=='0')?$posts['parent_menu']:decode_data($posts['parent_menu']);
						if($posts['parent_menu']=='0'){
							$param['menu_is_top']='1';
						}else{
							$param['menu_is_top']='2';
						}					
					}
				}

				//print_obj($param);die;

				$list = $this->sm->_get_menues($posts,$param,FALSE,TRUE);

				print_obj($list);die;
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $menu){
					$no++;

					$row = array();

					if($menu->menu_parent_id!='0'){
						$parent_menu=$this->sm->get_menues(array('menu_id'=>$menu->menu_parent_id));
						$parent_menu_name=$parent_menu->menu_name;
					}else{
						$parent_menu_name='Not Applicable';
					}

					$total_child_menues=$this->sm->get_total_menues(array('menu_parent_id'=>$menu->menu_id));					
					

					$mlink=$this->data['admin_base_url'].'/settings/menues/'.encode_data($menu->menu_id);
					
					$row[]	=	$no;

					$row[]	=	($menu->menu_link!='')?$menu->menu_name.'<br><strong>Menu URL:'.$menu->menu_link.'</strong>':$menu->menu_name;
					if($menu->menu_parent_id!='0'){
						$row[]	=	$parent_menu_name;
					}

					if($menu->menu_parent_id!='0'){
						$row[]	=	'<a href="javascript:void(0)" data-toggle="modal" data-target="#nexchildMenuModal" data-parent="'.encode_data($menu->menu_id).'" data-parent_name="'.$menu->menu_name.'" data-parent_this="'.encode_data($menu->menu_id).'"  class="btn btn-xs btn-warning btn_child_menu">'.$total_child_menues.'</a>';
					}else{
						$row[]	=	'<a href="javascript:void(0)" data-toggle="modal" data-target="#childMenuModal" data-parent="'.encode_data($menu->menu_id).'" data-parent_name="'.$menu->menu_name.'" data-parent_this="0" class="btn btn-xs btn-warning btn_child_menu">'.$total_child_menues.'</a>';
					}

						
					//$row[]	=	'';

					$action='<div class="btn-group btn-group-sm">
						<a href="'.$this->data['admin_base_url'].'/ads/add/'.encode_data($menu->menu_id).'" class="btn btn-xs btn-primary"><i class="fa fa-pen fa-xs"></i></a>
						<button class="btn btn-xs btn-dark btn_del_ads" data-aid="'.encode_data($menu->menu_id).'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';

					$row[]	=	$action;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_menues($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_menues($posts,$param,TRUE),
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


	public function onCreateMenuJSON(){
		// if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
		// 	if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				    $footer_ads_heading=array();
			        $footer_ads=array();

			        $country_data=$this->com->get_country(array('country_id'=>'99'));
			        $country_name=strtoupper($country_data->country_name);

			    	$top_menues=$this->sm->get_menues(array('menu_is_top'=>'1','menu_is_active'=>'1','menu_parent_id'=>'0'),FALSE,'menu_serial','ASC',FALSE);

			    	//print_obj($top_menues);

			        $main_menues=array();
			        $featured_colleges_data=array();
			        $featured_college_heading='';

			    	if(!empty($top_menues)){
			    		foreach ($top_menues as $key => $value) {
			                $top_menu_id=$value->menu_id;
			    			$sub_menues=$this->sm->get_menues(array('menu_is_top'=>'2','menu_is_active'=>'1','menu_parent_id'=>$value->menu_id),FALSE); 

			                $sub_menues_data=array();             

			    			if(!empty($sub_menues)){
			    			   	foreach ($sub_menues as $k => $v) {

			                       $sub_menues_data_2=array();                       

			                       $menu_columns=$this->sm->get_menue_columns(array('menu_column_parent_id'=>$v->menu_id,'menu_column_status'=>'1'),FALSE);                       

			                        if(!empty($menu_columns)){
			                            foreach ($menu_columns as $__k => $__v) {
			                                $sub_menues_column_data_2=array();

			                                if($__v->menu_column_has_menu=='1'){
			                                    $sub_menues_2=$this->sm->get_menues(array('menu_is_top'=>'2','menu_is_active'=>'1','menu_parent_id'=>$__v->menu_column_parent_id,'menu_column_id'=>$__v->menu_column_id),FALSE);

			                                    foreach ($sub_menues_2 as $_k => $_v) {

			                                        if($_v->menu_link_type=='4'){//Exam Link
			                                            $exam_image=$this->sm->get_user_file(array('user_file_type_id'=>$_v->menu_link_id,'user_storage_type'=>'exam_logo'));
			                                            if(!empty($exam_image)){
			                                                $menu_image=$exam_image->media_disk_path_relative;
			                                            }else{
			                                                $menu_image='';
			                                            }                                            
			                                        }else{
			                                            $menu_image='';
			                                        }

			                                        $sub_menues_column_data_2[]=array(
			                                            'menu_link_type'=>$_v->menu_link_type,
			                                            'menu_name'=>$_v->menu_name,
			                                            'menu_image'=>$menu_image,
			                                            'menu_link'=>str_replace('http://waytoadmissions.com/', base_url(), $_v->menu_link)
			                                        );
			                                    }

			                                    if($__v->menu_column_has_menu=='0'){
			                                        $column_width='6';
			                                    }else if($__v->menu_column_has_menu=='1'){
			                                        $column_width=$__v->menu_column_no;
			                                    }else if($__v->menu_column_has_menu=='2'){
			                                        $column_width='4';
			                                    }


			                                    $_col_image=$this->sm->get_user_file(array('user_file_type_id'=>$__v->menu_column_name_id,'user_storage_type'=>'ranking_agency_logo'));
			                                    if(!empty($_col_image)){
			                                        $column_image=$_col_image->media_disk_path_relative;
			                                    }else{
			                                        $column_image='';
			                                    }

			                                    $sub_menues_data_2[]=array(
			                                        'menu_column'=>$__v->menu_column_name,
			                                        'menu_column_has_image'=>$__v->menu_column_has_image,
			                                        'menu_column_image_position'=>$__v->menu_column_image_position,
			                                        'menu_column_image'=>$column_image,
			                                        'menu_column_width'=>$column_width,
			                                        'sub_menues'=>$sub_menues_column_data_2                                                                   
			                                    );
			                                }
			                                    
			                            }
			                        }                       

			                       $sub_menues_data[]=array(
			                           'menu_name'=>$v->menu_name,
			                           'sub_menues'=>$sub_menues_data_2
			                       );
			                    }	
			    			}

			    			$main_menues['menues'][]=array(
			                    'menu_id'=>$value->menu_id,
			    				'menu_name'=>$value->menu_name,
			                    'menu_link_id'=>$value->menu_link_id,
			                    'menu_link'=>str_replace('http://waytoadmissions.com/', base_url(), $value->menu_link),
			    				'sub_menues'=>$sub_menues_data                    
			    			);               
			    		}

			            if(!empty($main_menues['menues'])){
			                foreach ($main_menues['menues'] as $key => $value) {
			                    $_footer_ads_param=array('listing_is_top_menu_id'=>$value['menu_id'],'listing_is_top_menu'=>'1','listing_is_top_menu_type_id'=>$value['menu_link_id'],'listing_status'=>'1');

			                    $_footer_ads=$this->um->get_listing_package_users($_footer_ads_param,FALSE);

			                    //print_obj($_footer_ads);

			                    if(!empty($_footer_ads)){
			                        $footer_ads_heading[$value['menu_id']]['heading']='FEATURED '.strtoupper($value['menu_name']).' COLLEGES IN '.$country_name;
			                        foreach ($_footer_ads as $k => $v){
			                            $college_profile_found=$this->im->get_college_profile_data(array('college_user_id'=>$v->listing_user_id));
			                            $college_city=$this->com->get_city(array('city_id'=>$college_profile_found->college_city_id));
			                            $college_state=$this->com->get_state(array('state_id'=>$college_profile_found->college_state_id));

			                            $college_address=ucwords($college_city->city_name).','.ucwords($college_state->state_name);


			                            $college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_profile_found->college_user_id,'user_storage_type'=>'user_logo'));

			                            if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
			                                $college_logo=$college_logo->media_disk_path_relative;
			                            }else{
			                                $college_logo=base_url().'uploads/app/default/no.jpg';
			                            }

			                            $footer_ads[$value['menu_id']][]=array(
			                                'college_name'=>ucwords($college_profile_found->college_name),
			                                'college_address'=>$college_address,
			                                'college_logo'=>$college_logo,
			                                'college_link'=>$v->listing_link
			                            );
			                        }
			                        
			                    }
			                }
			            }
			    	}


			    	//print_obj($main_menues);die;


			        $json_menu=json_encode($main_menues);

			        //echo $json_menu;

			        $bytes = file_put_contents(FCPATH.'uploads/app/menu.json', json_encode($json_menu['top_menues']));

		// 	}else{
		// 		redirect($this->data['admin_base_url']);
		// 	}
		// }else{
		// 	redirect($this->data['admin_base_url']);
		// }		
	}

	public function onUpdateMenuWidgets(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$widget_menu_id=post_data('widget_menu_id');
				$widget_name=$this->input->post('widget_name');

				$widget_data=array();

				if(!empty($widget_menu_id) && !empty($widget_name)){

					$data_found=$this->sm->get_menu_widget_data(array('widget_menu_id'=>$widget_menu_id));

					if(!empty($data_found)){
						$this->sm->delete_menu_widget_data(array('widget_menu_id'=>$widget_menu_id));
					}

					$i=1;

					foreach ($widget_name as $key => $value) {
						$widget_data[]=array(
							'widget_menu_id'=>$widget_menu_id,
							'widget_name'=>$value,
							'widget_show'=>'TRUE',
							'widget_serial'=>$i
						);

						$i++;
					}

					if(!empty($widget_data)){
						$added=$this->sm->store_menu_widget_data($widget_data,TRUE);

						if($added){
							$return['success']='Widgets added updated';
						}else{
							$return['error']='Data not updated';
						}
					}else{
						$return['error']='No data found to add';
					}


				}else{
					$return['error']='Menu not defined';
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

	public function onUpdateMenuWidgetsSpecificData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$widget_menu_id=post_data('widget_menu_id');
				$wdfield=post_data('wdfield');
				$wdstatus=post_data('wdstatus');

				$widget_data=array();

				if(!empty($widget_menu_id)){

					$added=$this->sm->update_menu_widget_data(array($wdfield=>$wdstatus),array('menu_widgets_id'=>$widget_menu_id));

					if($added){
						$return['success']='Widgets updated';
					}else{
						$return['error']='Data not updated';
					}


				}else{
					$return['error']='Menu not defined';
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


	public function onDeleteMenuWidgets(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$widget_menu_id=post_data('widget_menu_id');

				$deleted=$this->sm->delete_menu_widget_data(array('menu_widgets_id'=>$widget_menu_id));

				if($deleted){
					$return['success']='Widget deleted';
				}else{
					$return['error']='Widget not deleted';
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


	public function onUpdateMenuSerial(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$menu_type=post_data('menu_type');
				$menu_data_type=post_data('menu_data_type');
				$menu_data_type_id=post_data('menu_data_type_id');
				$menu_serialize_ids=$this->input->post('menu_serialize_ids');

				if(!empty($menu_type)){

					$menu_data_type_id=decode_data($menu_data_type_id);

					if(!empty($menu_serialize_ids)){
						$i=1;
						foreach ($menu_serialize_ids as $key => $value) {

							//echo $value;
							
							$data_toupdate[$value]=array('menu_serial'=>$i);

							$updated=$this->sm->update_menu($data_toupdate[$value],array('menu_id'=>$value));

							//echo $updated.'<br>';

							$i++;
						}

						//die;

						//print_obj($data_toupdate);die;

						$return['success']='Menu order updated';
					}else{
						$return['error']='No data to change';
					}
				}else{
					$return['error']='Menu type not defined';
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

	public function onUpdateParentChildMenu(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$parent_menu_id=post_data('parent_menu_id');
				$child_menu_id=post_data('child_menu_id');

				$updated=$this->sm->update_menu(array('menu_parent_id'=>$parent_menu_id),array('menu_id'=>$child_menu_id));

				if($updated){
					$return['success']='Menu updated';
				}else{
					$return['error']='Menu not updated';
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


	public function onLoadMenuWidgets(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$widget_menu_id=post_data('widget_menu_id');

				$return['widget_data']=$this->sm->get_menu_widget_data(array('widget_menu_id'=>$widget_menu_id),FALSE);

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