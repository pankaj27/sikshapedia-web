<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/vendor/autoload.php';

use Spatie\ImageOptimizer\OptimizerChainFactory;
/**
 * 
 */
class News  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='News';

			// $pathToImage='/home/thencriptechindia/static_waytoadmissions_com/data/banners/2021/WJFZkTYmRV.jpg';

			// $pathToImageDir='/home/thencriptechindia/static_waytoadmissions_com/data/banners/2021/demoimg/WJFZkTYmRV.jpg';

			// $pathToImageDir1='/home/thencriptechindia/static_waytoadmissions_com/data/banners/2021/demoimg1/WJFZkTYmRV.jpg';

			// $this->compress_image1($pathToImage, $pathToImageDir, 10);

   			// $optimizerChain = OptimizerChainFactory::create();

			// $optimizerChain->optimize($pathToImageDir, $pathToImageDir1);

			// 

   			// die;

			$this->theme->title($this->data['page_title'])->load('news/vw_news', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexAdd(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='News Add';

			$this->data['countries']=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'newsarticles'));

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->load('news/vw_news_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexEdit(){
		if(session_userdata('isAdminLoggedin')){

			$_news_id=$this->uri->segment(4,0);

			//echo $_news_id;

			$news_id=decode_data($_news_id);

			//echo $news_id;die;

			$news_detail_data=array();

			$news_data=$this->nm->get_news(array('news_id'=>$news_id));

			$this->data['countries']=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');
			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'newsarticles'));

			if(!empty($news_data)){
				$news_detail_data=$this->nm->get_news_data(array('news_id'=>$news_id),FALSE);
			}

			$this->data['news_data']=$news_data;
			$this->data['news_detail_data']=$news_detail_data;

			//print_obj($this->data['news_detail_data']);die;

			$this->data['page_title']='News Add';



			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->load('news/vw_news_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexExamNews($exam_id){
		if(session_userdata('isAdminLoggedin')){

			$_exam_id=decode_data($exam_id);

			$this->data['exam_data']=$this->strm->_get_exam(array('exam_id'=>$_exam_id));

			//print_obj($this->data['exam_data']);die;

			$this->data['news_type_id']=$exam_id;

			$this->data['news_type']='exams';

			$this->data['page_title']='Exam News';

			$this->theme->title($this->data['page_title'])->load('news/vw_news_exams', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexExamNewsAddEdit(){
		if(session_userdata('isAdminLoggedin')){

			$exam_id=$this->uri->segment(3);
			$news_id=$this->uri->segment(5,0);

			//echo $exam_id;die;

			$_exam_id=decode_data($exam_id);

			//echo $_examid;die;

			$news_data=array();
			$news_detail_data=array();

			if($news_id!='0'){
				$_news_id=decode_data($news_id);

				//echo $_news_id;
				$news_data=$this->nm->get_news(array('news_id'=>$_news_id));
				if(!empty($news_data)){
					$news_detail_data=$this->nm->get_news_data(array('news_id'=>$_news_id),FALSE);
				}

				
			}

			$this->data['news_data']=$news_data;
			$this->data['news_detail_data']=$news_detail_data;



			$this->data['exam_data']=$this->strm->_get_exam(array('exam_id'=>$_exam_id));

			$this->data['news_type_id']=$_exam_id;

			$this->data['countries']=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'newsarticles'));

			$this->data['news_type']='exams';

			$this->data['page_title']='Exam News';

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->load('news/vw_news_add_edit', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	public function onAddNews_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				
				$_news=post_data('_news');
				$news_category=post_data('news_category');
				$news_country=post_data('news_country');
				$news_is_featured=post_data('news_is_featured');
				$news_publish=post_data('news_publish');
				$news_title=post_data('news_title');
				$news_banner_image_id=post_data('news_banner_image_id');
				$news_banner_image_url=post_data('news_banner_image_url');
				$news_content=$this->input->post('news_content');

				$user_id=decode_data(session_userdata('admin_id'));

				print_obj($_POST);die;

				if(empty($_news)){
					$news_data=$this->nm->get_news(array('news_title'=>$news_title));

					if(empty($news_data)){

						$data_to_add=array(
							'news_title'=>$news_title,
							'news_type'=>$news_category,
							'news_type_id'=>'0',
							'news_country'=>$news_country,
							'news_content'=>$news_content,
							'news_is_featured'=>$news_is_featured,
							'news_status'=>$news_publish,
							'news_data_banner_image_url'=>(!empty($news_banner_image_url))?$news_banner_image_url:NULL,
							'news_data_banner_image_id '=>(!empty($news_banner_image_id))?decode_data($news_banner_image_id):NULL,
							'created_by'=>$user_id,
							'created_at'=>date('Y-m-d')
						);



						$added=$this->nm->add_news_data($data_to_add);

						if($added){
							$return['success']='News content added';
						}else{
							$return['error']='News content not added';
						}
					}else{
						$return['error']='News content already';
					}
				}else{
					if(is_string($_news)){
						$news_id=decode_data($_news);

						$news_data=$this->nm->get_news(array('news_id'=>$news_id));

						if(empty($news_data)){
							$data_to_add=array(
								'news_title'=>$news_title,
								'news_type'=>$news_category,
								'news_type_id'=>'0',
								'news_country'=>$news_country,
								'news_content'=>$news_content,
								'news_is_featured'=>$news_is_featured,
								'news_status'=>$news_publish,
								'news_data_banner_image_url'=>(!empty($news_banner_image_url))?$news_banner_image_url:NULL,
								'news_data_banner_image_id '=>(!empty($news_banner_image_id))?decode_data($news_banner_image_id):NULL,
								'created_by'=>$user_id,
								'created_at'=>date('Y-m-d')
							);

							$updated=$this->nm->update_news_data($data_to_add,array('news_id'=>$news_id));

							if($updated){
								$return['success']='News content added';
							}else{
								$return['error']='News content not added';
							}
						}else{
							$return['error']='News content not added';
						}
					}else{
						$return['error']='News content not added';
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



	public function onAddNews(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$news_category=post_data('news_category');
				$news_country=post_data('news_country');
				$news_is_featured=post_data('news_is_featured');
				$news_title=post_data('news_title');
				$news_short_title=post_data('news_short_title');
				$news_publish=post_data('news_publish');
				$news_details=$this->input->post('news_details');
				$news_category_type_value=post_data('news_category_type_value');
				$news_banner_image_id=post_data('news_banner_image_id');
				$news_banner_image_url=post_data('news_banner_image_url');


				//print_obj($news_details);die;


				$_news_type_id=post_data('_news_type_id');

				if(!empty($_news_type_id)){
					$news_type_id=$_news_type_id;//decode_data($_news_type_id);
				}else{
					$news_type_id='';
				}

				//echo decode_data($_news_type_id);die;

				

				//echo $news_banner_image_url;die;

				$_news=post_data('_news');

				if($_news!=NULL){
					$news_id=decode_data($_news);
				}else{
					$news_id='0';
				}

				//echo $news_id;die;

				$user_id=decode_data(session_userdata('admin_id'));
				$news_is_being_updated=FALSE;

				if($news_country!='0'){
					$country_data=$this->com->get_country(array('country_id'=>decode_data($news_country)));

					//print_obj($news_details);die;

					//echo $news_id;

					//if($news_category=='1'){

						if($news_id=='0'){						
							$news_found=$this->nm->get_news(array('news_title'=>$news_title));
						}else{
							$news_found=$this->nm->get_news(array('news_id'=>$news_id));
						}

						//print_obj($news_found);die;

						$news_data_to_add=array(
							'news_title'=>$news_title,
							'news_short_title'=>$news_short_title,
							'news_type'=>$news_category,
							'news_type_id'=>($news_category_type_value!=NULL)?decode_data($news_category_type_value):'0',
							'news_country'=>decode_data($news_country),
							'news_image_banner_id'=>($news_banner_image_id!=NULL)?decode_data($news_banner_image_id):NULL,
							'news_image_banner_url'=>($news_banner_image_url!=NULL)?$news_banner_image_url:NULL,
							'news_is_featured'=>$news_is_featured,
							'is_published'=>$news_publish,
							'created_by'=>$user_id,
							'created_at'=>date('Y-m-d H:i:s')
						);

						//print_obj($news_data_to_add);die;

						if($news_id=='0'){

							//echo 'hi';die;

							if(empty($news_found)){

								$slug_value=url_slug($news_title);
								$get_slug_urls=$this->sm->get_slug_urls(array('url_value'=>$slug_value));

								if(empty($get_slug_urls)){
									$news_added=$this->nm->add_news($news_data_to_add);

									if($news_added){
										if(!empty($news_details)){
											$serial=0;
											foreach ($news_details as $key => $value){
												$data_type=$value['data_type'];
												$news_content=$value['news_content'];

												if($data_type=='image'){
													
													$data_type_value=decode_data($value['data_type_value']);
													$data_to_store=array(
														'news_id'=>$news_added,
														'news_data_image_id'=>$data_type_value,
														'news_data_type'=>$data_type,
														'news_content'=>$news_content,
														'news_serial'=>$serial,
														'created_by'=>$user_id,
														'created_at'=>date('Y-m-d H:i:s')
													);
												}else{
													$data_to_store=array(
														'news_id'=>$news_added,
														'news_data_type'=>$data_type,
														'news_content'=>$news_content,
														'news_serial'=>$serial,
														'created_by'=>$user_id,
														'created_at'=>date('Y-m-d H:i:s')
													);

													if($serial==0){
														$meta_desc=get_values_uder_first_p_tag($news_content);
													}
												}

												$serial++;

												
												$this->nm->add_news_data($data_to_store);
												
											}

											//print_obj($data_to_store);
										}

										$_get_slug=$this->sm->get_slug(array('slug_type'=>'11','slug_type_id'=>$news_added));

										if(!empty($_get_slug)){
											$slug_added=$this->sm->update_slug(array('slug_type'=>'news_article','slug_type_id'=>$news_added,'slug_value'=>$slug_value),array('slug_type'=>'news_article','slug_type_id'=>$news_added));
										}else{
											$slug_added=$this->sm->store_slug(array('slug_type'=>'11','slug_type_id'=>$news_added,'slug_value'=>$slug_value));
										}

										if($slug_added){
											$slug_url=base_url().strtolower($country_data->country_iso_code_2).'/news/'.$slug_value;

											$get_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$news_added,'url_type'=>'news_article','url_value'=>$slug_url));

											if(isset($meta_desc)){
												$keywords=generateKeywordsFromText($news_title).','.generateKeywordsFromText($meta_desc);
											}else{
												$keywords=generateKeywordsFromText($news_title);
											}									

											$slug_url_data=array(
												'url_type'=>'news_article',
												'url_type_id'=>$news_added,
												'url_country'=>$country_data->country_id,
												'url_meta_heading'=>$news_title,
												'url_meta_desc'=>$meta_desc,
												'url_meta_title'=>$news_title,
												'url_meta_key_words'=>$keywords,
												'url_og_title'=>$news_title,
												'url_og_desc'=>$meta_desc,
												'url_page_heading'=>$news_title,
												'url_value'=>$slug_url
											);

											if(!empty($get_slug_urls)){
												$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'news_article','url_type_id'=>$news_added,'url_value'=>$slug_url));
											}else{
												//echo 'hi';die;
												$this->sm->store_slug_urls($slug_url_data);
											}
										}

										//die;

										//if(!empty($news_type_id)){
											$this->tag_to_type($news_added,$news_type_id,$news_category);
										//}								

										$return['success']='News added successfully';
									}else{
										$return['error']='There was an error to save the data.';
									}
								}else{
									$return['error']='News already found in the system with same title';
								}	
							}else{
								$return['error']='News alreday found in the system with the same title';
							}

						}else{

							//echo 'hi';

							$slug_value=url_slug($news_title);
							$slug_url=base_url().strtolower($country_data->country_iso_code_2).'/news/'.$slug_value;
							$_get_slug_url=$this->sm->get_slug_urls(array('url_value'=>$slug_url));

							//print_obj($get_slug_url);die;

							$updated=$this->nm->update_news($news_data_to_add,array('news_id'=>$news_id));

							if($updated){
								if(!empty($news_details)){
									$serial=0;

									$this->nm->delete_news_data(array('news_id'=>$news_id));

									//print_obj($news_details);die;

									foreach ($news_details as $key => $value){
										$data_type=$value['data_type'];
										$news_content=$value['news_content'];

										if($data_type=='image'){
											
											$data_type_value=decode_data($value['data_type_value']);
											$data_to_store=array(
												'news_id'=>$news_id,
												'news_data_image_id'=>$data_type_value,
												'news_data_type'=>$data_type,
												'news_content'=>$news_content,
												'news_serial'=>$serial,
												'created_by'=>$user_id,
												'created_at'=>date('Y-m-d H:i:s')
											);
										}else{
											$data_to_store=array(
												'news_id'=>$news_id,
												'news_data_type'=>$data_type,
												'news_content'=>$news_content,
												'news_serial'=>$serial,
												'created_by'=>$user_id,
												'created_at'=>date('Y-m-d H:i:s')
											);

											if($serial==0){
												$meta_desc=get_values_uder_first_p_tag($news_content);
											}
										}

										$serial++;

										// print_obj($data_to_store);die;

										$this->nm->add_news_data($data_to_store);
									}
								}

								
								$get_slug=$this->sm->get_slug(array('slug_type'=>'11','slug_type_id'=>$news_id));								
								

								if(!empty($_get_slug_url)){
									$slug_added=$this->sm->update_slug(array('slug_type'=>'11','slug_type_id'=>$news_id,'slug_value'=>$slug_value),array('slug_type'=>'11','slug_type_id'=>$news_id));
								}else{
									$slug_added=$this->sm->store_slug(array('slug_type'=>'11','slug_type_id'=>$news_id,'slug_value'=>$slug_value));
								}

								if($slug_added){

									//echo 'hi';die;

									if($news_category=='3'){
										$get_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$news_id,'url_type'=>'news_article','url_sub_type'=>'exam_news_url','url_sub_type_id'=>$news_type_id),TRUE,null,'DESC',TRUE);

										//print_obj($get_slug_url);die;
									}else{
										// $slug_url=base_url().strtolower($country_data->country_iso_code_2).'/news/'.$slug_value;
										$get_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$news_id,'url_type'=>'news_article','url_value'=>$slug_url));
									}

									//print_obj($get_slug_url);die;

									if(isset($meta_desc)){
										$keywords=generateKeywordsFromText($news_title).','.generateKeywordsFromText($meta_desc);
									}else{
										$keywords=generateKeywordsFromText($news_title);
									}

									//print_obj($_get_slug_url);die;

									if(!empty($_get_slug_url)){
										//echo 'hi';die;
										$slug_url_data=array(
											'url_type'=>'news_article',
											'url_type_id'=>$news_id,
											'url_country'=>$country_data->country_id,
											'url_meta_heading'=>$news_title,
											'url_meta_desc'=>$meta_desc,
											'url_meta_title'=>$news_title,
											'url_meta_key_words'=>$keywords,
											'url_og_title'=>$news_title,
											'url_og_desc'=>$meta_desc,
											'url_page_heading'=>$news_title
										);
										$this->sm->update_slug_urls($slug_url_data,array('url_type'=>'news_article','url_type_id'=>$news_id,'url_value'=>$slug_url));
									}else{
										//echo 'hi2';die;
										$slug_url_data=array(
											'url_type'=>'news_article',
											'url_type_id'=>$news_id,
											'url_country'=>$country_data->country_id,
											'url_meta_heading'=>$news_title,
											'url_meta_desc'=>$meta_desc,
											'url_meta_title'=>$news_title,
											'url_meta_key_words'=>$keywords,
											'url_og_title'=>$news_title,
											'url_og_desc'=>$meta_desc,
											'url_page_heading'=>$news_title,
											'url_value'=>$slug_url
										);
										$this->sm->store_slug_urls($slug_url_data);
									}
								}


								//if(!empty($news_type_id)){
									$this->tag_to_type($news_id,$news_type_id,$news_category);
								//}

								$return['success']='News updated successfully';
							}else{
								$return['error']='News alreday found in the system with the same title';
							}	
						}

					// }else if($news_category=='2'){

					// }
				}else{
					$return['error']='Select Country';
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


	function tag_to_type($news_id,$news_type_id,$news_type){

		if($news_type=='3'){ //Exam Tag

			$exam_data=$this->strm->_get_exam(array('exam_id'=>$news_type_id));
			$news_data=$this->nm->get_news(array('news_id'=>$news_id));

			$exam_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$news_type_id,'url_type'=>'exam'));

			$news_meta_heading=$news_data->news_title;
			$news_slug_url=$exam_slug_url->url_value.'/news/'.url_slug($news_meta_heading);

			// $slug_url=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$news_type_id,'url_type'=>'news_article','url_type_id'=>$news_id,'url_value'=>$news_slug_url));

			$slug_url=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_type'=>'news_article','url_type_id'=>$news_id,'url_value'=>$news_slug_url));

			//print_obj($slug_url);die;

			if(empty($slug_url)){
				$news_tag_data=array(
					'news_types_news_id'=>$news_id,
					'news_types_id'=>$news_type_id,
					'news_types'=>$news_type
				);

				//$this->nm->delete_news_type(array('news_types_id'=>$news_type_id,'news_types'=>$news_type));

				$news_added=$this->nm->add_news_type($news_tag_data);

				//echo $news_added;

				if($news_added){
					$key_words=generateKeywordsFromText($news_meta_heading);

					$this->sm->delete_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$news_type_id,'url_type'=>'news_article','url_type_id'=>$news_id));
					
					$news_slug_data=array(
						'url_type'=>'news_article',
						'url_sub_type'=>'exam_news_url',
						'url_type_id'=>$news_id,
						'url_sub_type_id'=>$news_type_id,
						'url_country'=>'99',
						'url_state'=>'0',
						'url_meta_heading'=>$news_meta_heading,
						'url_meta_title'=>$news_meta_heading,
						'url_meta_key_words'=>$key_words,
						'url_meta_desc'=>$news_meta_heading,
						'url_og_title'=>$news_meta_heading,
						'url_og_desc'=>$news_meta_heading,
						'url_page_heading'=>$news_meta_heading,
						'url_page_sub_heading'=>$news_meta_heading,
						'url_value'=>$news_slug_url
					);

					$this->sm->store_slug_urls($news_slug_data);
				}else{
					return false;
				}
			}else{
				return false;
			}

				
		}

	}


	public function onDeleteNews(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$news_id=post_data('news_id');

				$news_types_id=post_data('news_types_id');

				$news_type=post_data('news_type');

				$_news_id=decode_data($news_id);

				$news_found=$this->nm->get_news(array('news_id'=>$_news_id));

				if($news_found){

					$deleted=$this->nm->delete_news(array('news_id'=>$_news_id));

					if($deleted){
						$this->nm->delete_news_data(array('news_id'=>$_news_id));
						$this->nm->delete_news_type(array('news_types_id'=>$news_types_id,'news_types_news_id'=>$_news_id,'news_types'=>$news_type));
						$this->sm->delete_slug(array('slug_type'=>'11','slug_type_id'=>$_news_id));
						$this->sm->delete_slug_urls(array('url_type'=>'news_article','url_type_id'=>$_news_id));
						$return['success']='Data deletede successfully.';
					}else{
						$return['error']='Data can not be deleted at this momment';
					}

				}else{
					$redirect['error']='Data not found in the system';
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


	public function onSearchNews(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'news_title'
				);

				$param['column_search'] = array('news_title');
				$param['order'] = array('news_id' => 'DESC');
				$posts=$this->input->post();

				$param['news_type']=$posts['news_type'];

				$news_type_id=$posts['news_types_id'];

				if($param['news_type']!='all'){
					$param['news_types_id']=decode_data($news_type_id);
					$join=TRUE;
				}else{
					$join=FALSE;
				}

				$list = $this->nm->_get_news($posts,$param,$join,FALSE,FALSE);

				//print_obj($list);die;	


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $news){
					$no++;

					$row = array();

					if($param['news_type']!='all'){
						$action='<div class="btn-group btn-group-sm">
						<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/exam_news/'.encode_data($news_type_id).'/add/'.encode_data($news->news_id).'">Edit</a>
						<button class="btn btn-xs btn-dark btn_del_news" data-aid="'.encode_data($news->news_id).'" data-news_type="'.$news->news_type.'" data-news_types_id="'.$news->news_types_id.'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';
					}else{
						$action='<div class="btn-group btn-group-xs">
						<a class="btn btn-xs btn-primary" href="'.$this->data['admin_base_url'].'/news/add/'.encode_data($news->news_id).'">Edit</a>
						<button class="btn btn-xs btn-dark btn_del_news" data-aid="'.encode_data($news->news_id).'" data-news_type="'.$news->news_type.'" data-news_types_id="'.$news->news_types_id.'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';
					}

					if($news->is_published=='1'){
						$published='<span class="btn btn-xs btn-success">Published</span>';
					}else{
						$published='<span class="btn btn-xs btn-success">Not Published</span>';
					}

										
					$row[]	=	$no;

					$row[]  =	'<a href="javascript:void(0);" class="btn_news_url_edit" data-toggle="modal" data-target="#newsSlugsURLModal" data-news_title="'.$news->news_title.'" data-news_id="'.$news->news_id.'" data-url_sub_type="college_news_url">'.$news->news_title.'</a><br>'.$published.'<br>'.$action;

					
					

					$row[]=$published;

					$row[]=	date('d-m-Y',strtotime($news->created_at));


							

					

					$row[]	=	$action;	

					$data[] = $row;	
				}

				

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->nm->_get_news($posts,$param,$join,TRUE),
					"recordsFiltered" => $this->nm->_get_news($posts,$param,$join,TRUE),
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


	public function onLoadNews(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$cid=post_data('cid');
				$country=post_data('country');
				$news_type=post_data('news_type');
				$_news_data=array();

				$inst_id=decode_data($cid);

				//echo $inst_id;die;

				$news_data=$this->nm->get_news(array('news_country'=>$country),FALSE);

				//.print_obj($news_data);die;

				if(!empty($news_data)){
					foreach ($news_data as $key => $value) {

						$inst_news=$this->nm->get_news_type(array('news_types_id'=>$inst_id,'news_types'=>$news_type,'news_types_news_id'=>$value->news_id));

						if(!empty($inst_news) && ($inst_news->news_types_news_id==$value->news_id)){
							$selected='selected';
						}else{
							$selected='';
						}

						$_news_data[]=array(
							'news_id'=>encode_data($value->news_id),
							'news_title'=>$value->news_title,
							'news_country'=>$value->news_country,
							'selected'=>$selected
						);
					}
				}

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($_news_data);


			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onTagNews(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$cid=post_data('cid');
				$_news=$this->input->post('course_news');
				$news_type=post_data('news_type');

				$inst_id=decode_data($cid);

				if($news_type=='1'){
					$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$inst_id));
					$college_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$inst_id,'url_type'=>'college_url'));

					//print_obj($college_data);die;

					//print_obj($college_slug_url);die;

					// if(!empty($college_slug_url)){
					// 	$college_slug=$college_slug_url->url_value;
					// }else{

					// 	$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));

					// 	$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));
					// 	$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));

					// 	$state_data=$this->com->get_state(array('state_country_id'=>$college_data->college_country_id));
					// 	$city_data=$this->com->get_city(array('city_country_id'=>$college_data->college_country_id,'city_state_id'=>$college_data->country_state_id));

					// 	$college_slug=base_url().strtolower($country_data->country_iso_code_2).'/'.url_slug($college_data->college_name).'-'.$city_slug->slug_value.'-'.$state_slug->slug_value;

					// 	//echo $college_slug;

					// 	$college_key_words=generateKeywordsFromText($college_data->college_name);

					// 	$_college_slug_url=$this->sm->get_slug_urls(array('url_type_id'=>$inst_id,'url_type'=>'college_static_url','url_value'=>$college_slug));

					// 	//print_obj($_college_slug_url);die;

					// 	$this->sm->delete_slug_urls(array('url_value'=>$news_slug_url));

					// 	if(empty($_college_slug_url)){
					// 		$college_slug_data=array(
					// 			'url_type'=>'college_static_url',
					// 			'url_type_id'=>$inst_id,
					// 			'url_country'=>$college_data->college_country_id,
					// 			'url_state'=>$college_data->college_state_id,
					// 			'url_meta_heading'=>$college_data->college_name,
					// 			'url_meta_title'=>$college_data->college_name,
					// 			'url_meta_key_words'=>$college_key_words,
					// 			'url_meta_desc'=>$college_data->college_name,
					// 			'url_og_title'=>$college_data->college_name,
					// 			'url_og_desc'=>$college_data->college_name,
					// 			'url_page_heading'=>$college_data->college_name,
					// 			'url_page_sub_heading'=>'',
					// 			'url_value'=>$college_slug
					// 		);

					// 		$this->sm->store_slug_urls($college_slug_data);
					// 	}							
					// }
				}

				if(!empty($_news) && is_array($_news)){
					$this->nm->delete_news_type(array('news_types_id'=>$inst_id,'news_types'=>$news_type));
					foreach ($_news as $key => $value) {
						$news_id=decode_data($value);

						$news_tag_data[]=array(
							'news_types_news_id'=>$news_id,
							'news_types_id'=>$inst_id,
							'news_types'=>$news_type
						);

						$news_data=$this->nm->get_news(array('news_id'=>$news_id));

						$news_meta_heading=$news_data->news_title;
						$news_slug_url=$college_slug.'/news/'.url_slug($news_meta_heading);

						//echo $news_slug_url;die;

						// $slug_url=$this->sm->get_slug_urls(array('url_sub_type'=>'college_news_url','url_sub_type_id'=>$inst_id,'url_type'=>'news_article','url_type_id'=>$news_id,'url_value'=>$news_slug_url));

						$slug_url=$this->sm->get_slug_urls(array('url_value'=>$news_slug_url));


						$key_words=generateKeywordsFromText($news_meta_heading).','.generateKeywordsFromText($college_data->college_name);

						//if(!empty($slug_url)){
							//$this->sm->delete_slug_urls(array('url_sub_type'=>'college_news_url','url_sub_type_id'=>$inst_id,'url_type'=>'news_article','url_type_id'=>$news_id));

							$this->sm->delete_slug_urls(array('url_value'=>$news_slug_url));
						//}						
						
						$news_slug_data[]=array(
							'url_type'=>'news_article',
							'url_sub_type'=>'college_news_url',
							'url_type_id'=>$news_id,
							'url_sub_type_id'=>$inst_id,
							'url_country'=>$college_data->college_country_id,
							'url_state'=>$college_data->college_state_id,
							'url_meta_heading'=>$news_meta_heading,
							'url_meta_title'=>$news_meta_heading,
							'url_meta_key_words'=>$key_words,
							'url_meta_desc'=>$news_meta_heading,
							'url_og_title'=>$news_meta_heading,
							'url_og_desc'=>$news_meta_heading,
							'url_page_heading'=>$news_meta_heading,
							'url_page_sub_heading'=>null,
							'url_value'=>$news_slug_url
						);
					}

					$news_added=$this->nm->add_news_type($news_tag_data,TRUE);

					if($news_added){
						if(empty($slug_url)){
							$this->sm->store_slug_urls($news_slug_data,TRUE);
						}
						

						$return['success']='News tagged successfully';
					}else{
						$return['error']='News not tagged';
					}
				}else{
					$return['error']='Select news please';
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


	function compress_image1($source_url, $destination_url, $quality) {
        $info = getimagesize($source_url);
        if ($info['mime'] == 'image/jpeg')
            $image = imagecreatefromjpeg($source_url);
        elseif ($info['mime'] == 'image/gif')
            $image = imagecreatefromgif($source_url);
        elseif ($info['mime'] == 'image/png')
            $image = imagecreatefrompng($source_url);
        imagejpeg($image, $destination_url, $quality);
       // echo "Image uploaded successfully.";
    }

}