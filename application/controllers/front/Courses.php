<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Courses  extends BaseFrontController{

	function __construct()
	{

		parent::__construct();

	    $this->load->model(array('settings_model'=>'sm','stream_model'=>'strm'));

	}


	public function index(){


		$slug_1=$this->uri->segment(1,0);
		$slug_2=$this->uri->segment(2,0);

		$categories=array();
		$streams=array();


		//$page_title='Top Courses';

		// $this->data['course_categories']=$categories;
		// $this->data['category_streams']=$streams;


		$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal',$this->data)->load('search/vw_search_courses_page', $this->data);
	}

	public function indexCourseDetails(){
		
	}

	public function indexCourseStreamDetails1(){
		$slug_1=$this->uri->segment(1,0);//static courses
		$slug_2=$this->uri->segment(2,0);//stream category
		$slug_3=$this->uri->segment(3,0);//stream inner menu
		//$slug_3=$this->uri->segment(3,0);//stream inner menu

		if((is_string($slug_1) && $slug_1=='courses') && (is_string($slug_2) && $slug_2!='0')){

			$stream_slug_data=$this->sm->get_slug(array('slug_value'=>$slug_2));

			// echo $stream_slug_data->slug_type;die;

			//print_obj($stream_slug_data);die;

			//print_obj($stream_slug_data);die;

			if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='3'){
				$slug_data=$this->data['slug_data'];

				$url_breadcrumb=json_decode($slug_data->url_breadcrumb);
				$menues=$this->sm->get_menues(array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_slug_data->slug_type_id,'menu_parent_id'=>'0','menu_is_active'=>'1'),FALSE);


				if(!empty($menues)){
					$i=0;
					foreach ($menues as $key => $value) {

						if($slug_3!='0' && $value->menu_slug==$slug_3){
	        				$active='active';
	        			}else{
	        				$active='';
	        			}

	        			//($active=='')?'active':''

						$_menues[]=array(
							'menu_id'=>$value->menu_id,
							'menu_name'=>$value->menu_name,
							'menu_link'=>$value->menu_link,
							'menu_default_active'=>($slug_3=='0' && $i==0)?'active':'',
							'menu_active'=>$active
						);

						$i++;
					}
				}

				//print_obj($_menues);die;

				$this->data['stream_data']=array(
					'breadcumb'=>$url_breadcrumb,
					'stream_heading'=>$slug_data->url_page_heading,
					'stream_menu'=>$_menues
				);

				//->add_partial('partial_apply_modal',$this->data)

				//->add_partial('partial_apply_through_stream_page_modal')

				$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal')->add_partial('partial_ask_question_of_courses_modal')->load('webpage/streams/vw_streams_details', $this->data);
			}else if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='5'){
				$slug_data=$this->data['slug_data'];

				//$j=array('Home'=>base_url(),'B.Tech Mechanical Engineering'=>null);

				//echo json_encode($j);

				//print_obj($slug_data);die;

				$url_breadcrumb=json_decode($slug_data->url_breadcrumb);

				$course_data=$this->strm->get_course(array('course_id'=>$stream_slug_data->slug_type_id));

				//print_obj($course_data);die;

				$menues=$this->sm->get_menues(array('menu_link_id'=>$stream_slug_data->slug_type_id,'menu_link_type'=>'10','menu_is_inner'=>'1','menu_category_id'=>'5','menu_is_active'=>'1'),FALSE);

				//print_obj($menues);die;

				if(!empty($menues)){
					$i=0;
					foreach ($menues as $key => $value) {

						if($slug_3!='0' && $value->menu_slug==$slug_3){
	        				$active='active';
	        			}else{
	        				$active='';
	        			}

	        			//($active=='')?'active':''

						$_menues[]=array(
							'menu_id'=>$value->menu_id,
							'menu_name'=>$value->menu_name,
							'menu_link'=>$value->menu_link,
							'menu_default_active'=>($slug_3=='0' && $i==0)?'active':'',
							'menu_active'=>$active
						);

						$i++;
					}
				}

				$this->data['course_data']=array(
					'breadcumb'=>$url_breadcrumb,
					'course_heading'=>$slug_data->url_page_heading,
					'course_id'=>$course_data->course_id,
					'course_menues'=>$_menues
				);

				//print_obj($this->data['course_data']);die;

				$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal')->load('webpage/streams/vw_streams_course_details', $this->data);

			}else if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='8'){
				$slug_data=$this->data['slug_data'];
				$stream_category_id=$stream_slug_data->slug_type_id;

				$category_data=$this->strm->get_stream_category(array('stream_category_id'=>$stream_category_id));

				$url_breadcrumb=json_decode($slug_data->url_breadcrumb);

				$this->data['bread_crumb']=$url_breadcrumb;

				//print_obj($this->data['page_heading']);die;

				// if(!empty($category_data)){
				// 	$stream_category=array(
				// 		'category_name'=>$category_data->stream_category.' in '.$country->country_name,
				// 		'category_long_desc'=>$category_data->stream_category_long_description,
				// 		'bread_crumb'=>array(
				// 			'Home'=>base_url(),
				// 			'Courses'=>base_url().$slug_1.'/'.$slug_2,
				// 			$category_data->stream_category_show_name=>''
				// 		)
				// 	);
				// }

				//echo json_encode($stream_category['bread_crumb']);die;

				$show_stream_category_widget=FALSE;

				if($slug_3!='0'){
					//echo $slug_3;
					$show_stream_category_widget=FALSE;

					$slug3_data=$this->sm->get_slug(array('slug_value'=>$slug_3,'slug_type'=>'3'));

					//print_obj($slug3_data);
					$slug3_type_id=$slug3_data->slug_type_id;

					//echo $slug3_type_id;

					$carray[0]=['category_name'=>'All'];

					$course_categories=$this->strm->get_course_categories(array('course_category_status'=>1),FALSE,'course_category_serial','ASC');

					foreach ($course_categories as $key => $value) {
						$course_details=$this->strm->get_stream_details_courses_data(array('courses_data_type_stream_id'=>$slug3_type_id,'courses_filter_type'=>$value->course_category_name),FALSE,'courses_data_type_serial','ASC',FALSE);
						$courses=$this->strm->get_course(array('course_stream'=>$slug3_type_id,'course_type_2'=>$value->course_category_name),FALSE,$order_by=null,$order='DESC',$return_query=FALSE);
						//print_obj($courses);
						$_c_categories[]=array(
							'category_name'=>$value->course_category_name,
							'tab_active'=>(count($course_details)>0 || count($courses)>0)?'1':'2'
						);
					}

					//die;

					//$this->data['categories']=$_c_categories;//array_merge($carray,$_c_categories);

					$this->data['categories']=array_merge($carray,$_c_categories);

					//print_obj($this->data['categories']);die;

					$this->data['stream_id']=$slug3_type_id;



					$view='webpage/streams/vw_stream_category_courses';
				}else{
					$show_stream_category_widget=TRUE;

					$view='webpage/streams/vw_streams_category_details';
				}

				// $_streams=$this->strm->get_inset_stream('stream_category',$stream_category_id);

				// if(!empty($_streams)){
				// 	foreach ($_streams as $key => $value) {
				// 		$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));
				// 		$stream_slug=$this->sm->get_slug(array('slug_type_id'=>$value->stream_id,'slug_type'=>'3'));

				// 		// $param['column_search'] = array('course_name');
				// 		// $param['order'] = array('course_id' => 'ASC');
				// 		// $post['length']='6';

				// 		//$courses = $this->strm->_get_courses($post,$param,FALSE,FALSE);

				// 		$courses=$this->strm->get_system_courses(array('course_stream'=>$value->stream_id),4,'course_id','ASC',FALSE);

				// 		if(!empty($courses)){
				// 			foreach ($courses as $k => $v) {
				// 				$course_slug=$this->sm->get_slug(array('slug_type_id'=>$v->course_id,'slug_type'=>'5'));
				// 				$stream_courses[$value->stream_id][]=array(
				// 					'course_name'=>$v->course_name,
				// 					'access_link'=>base_url().strtolower($country->country_iso_code_2).'/courses/'.$course_slug->slug_value
				// 				);
				// 			}
				// 		}else{
				// 			$stream_courses=array();
				// 		}

				// 		$streams[]=array(
				// 			'stream_id'=>$value->stream_id,
				// 			'stream_name'=>$value->stream_name,
				// 			'strteam_icon'=>$icon->icon_value,
				// 			'stream_access_link'=>strtolower($country->country_iso_code_2).'/courses/'.$slug_data_3->slug_value.'/'.$stream_slug->slug_value,
				// 			'stream_courses'=>$stream_courses[$value->stream_id]
				// 		);
				// 	}
				// }

				// $ads_data=array(
				// 	'ads_link'=>'https://paruluniversity.ac.in/landingpage/2021/pu-admissions/?utm_source=collegedunia&amp;utm_type=bann&amp;utm_campaign=Parul2021',
				// 	'ads_image'=>'https://images.static-collegedunia.com//public/image/client_images_new/B_ParulUniversityGenericDS_S_27_120210128144856.png'
				// );

				// $this->data['stream_category_data']=$stream_category;
				// $this->data['streams']=$streams;
				// $this->data['ads_data']=$ads_data;

				// $page_title='List of '.$category_data->stream_category_show_name.' in '.$country->country_name.' '.date('Y');

				 //echo $show_stream_category_widget;die;

				 $this->data['show_stream_category_widget']=$show_stream_category_widget;


				$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal')->load($view, $this->data);
			}	
		}else{
			redirect(base_url('courses'));
		}
	}


	public function indexCourseDetailsData(){
		$slug_1=$this->uri->segment(1,0);//static courses
		$slug_2=$this->uri->segment(2,0);//course category
		$slug_3=$this->uri->segment(3,0);//course inner menu

		if((is_string($slug_1) && $slug_1=='courses') && (is_string($slug_2) && $slug_2!='0')){

			// $course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_value'=>$slug_2));

			$course_slug=$this->sm->get_slug(array('slug_value'=>$slug_2));

			/**
			 * course stream slug type:3
			 * course slug type:9
			 * 
			 * 
			 * **/

			//print_obj($course_slug);die;

			if(!empty($course_slug)){

				$current_url=current_url();

				$slug_type_id=$course_slug->slug_type_id;

				$slug_type=$course_slug->slug_type;

				$slug_data=$this->sm->get_slug_urls(array('url_value'=>$current_url));//$this->data['slug_data'];

				//print_obj($slug_type);die;

				if(!empty($slug_data)){
					$url_breadcrumb=json_decode($slug_data->url_breadcrumb);
				}else{
					$url_breadcrumb=array();
				}

				
					
					// 1>>course,2>>course streams,3>>Others,20>>course inner menu,10>>college inner menu,11>>other,12>>exams inner menu,13>>stream inner menu



				if($slug_type=='3'){ //stream

					$stream_data=$this->strm->get_stream(array('stream_id'=>$slug_type_id));

					$menues_fields='menu_id,menu_name,menu_link_type,menu_is_inner,menu_link_id,menu_slug,menu_serial,menu_category_id,menu_link';


					if($slug_3!='0'){
						$menu_data=$this->sm->get_menues_specific($menues_fields,array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_data->stream_id,'menu_slug'=>$slug_3),TRUE,'menu_serial','ASC',FALSE);
					}else{
						$menu_data=$this->sm->get_menues_specific($menues_fields,array('menu_link_type'=>'13','menu_is_inner'=>'1','menu_link_id'=>$stream_data->stream_id,'menu_slug'=>'overview'),TRUE,'menu_serial','ASC',FALSE);
					}

					//echo $stream_data->stream_id;die;


					$menues=$this->sm->get_menues_specific($menues_fields,array('menu_link_id'=>$stream_data->stream_id,'menu_link_type'=>'13','menu_is_inner'=>'1','menu_is_active'=>'1'),FALSE);

					//print_obj($menues);die;

					if(!empty($menues)){
						$i=0;
						foreach ($menues as $key => $value) {

							if(($value->menu_id==$menu_data->menu_parent_id) || ($value->menu_id==$menu_data->menu_id)){
								$menu_active='yes';
							}else{
								if($i==0){
									if($slug_3!='0'){
										$menu_active='no';
									}else{
										$menu_active='yes';
									}
									
								}else{
									$menu_active='no';
								}									
							}

		        			//($active=='')?'active':''

							$_menues[]=array(
								'menu_id'=>$value->menu_id,
								'menu_name'=>$value->menu_name,
								'menu_link'=>$value->menu_link,
								'menu_default_active'=>($menu_active=='yes')?'active':'',
								'menu_active'=>''
							);

							$i++;
						}
					}

					$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

					$this->data['page_structure_data']=$structure_data;

					$this->data['stream_data']=array(
						'breadcumb'=>$url_breadcrumb,
						'stream_heading'=>$slug_data->url_page_heading,
						'stream_id'=>$stream_data->stream_id,
						'stream_menu_id'=>$menu_data->menu_id,
						'stream_menu_slug'=>$menu_data->menu_slug,
						'stream_menues'=>$_menues
					);

					//print_obj($this->data['stream_data']);die;

					$view='webpage/streams/vw_streams_details';

				}else if($slug_type=='5'){ //course
					$course_data=$this->strm->get_course(array('course_id'=>$course_slug->slug_type_id));

					$menues_fields='menu_id,menu_parent_id,menu_name,menu_link_type,menu_is_inner,menu_link_id,menu_slug,menu_serial,menu_category_id,menu_link';

	        
					if($slug_3!='0'){
						// $menu_data=$this->sm->get_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_data->course_id,'menu_slug'=>$slug_3),TRUE,'menu_serial','ASC',FALSE);

						$menu_data=$this->sm->get_menues_specific($menues_fields,array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_data->course_id,'menu_slug'=>$slug_3),TRUE,'menu_serial','ASC',FALSE);
					}else{
						// $menu_data=$this->sm->get_menues(array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_data->course_id,'menu_slug'=>'overview'),TRUE,'menu_serial','ASC',FALSE);


						$menu_data=$this->sm->get_menues_specific($menues_fields,array('menu_link_type'=>'20','menu_is_inner'=>'1','menu_link_id'=>$course_data->course_id,'menu_slug'=>'overview'),TRUE,'menu_serial','ASC',FALSE);
					}

					//print_obj($menu_data);die;

					//$menues=$this->sm->get_menues(array('menu_link_id'=>$course_slug->slug_type_id,'menu_link_type'=>'20','menu_is_inner'=>'1','menu_category_id'=>'5'),FALSE);


					$menues=$this->sm->get_menues_specific($menues_fields,array('menu_link_id'=>$course_slug->slug_type_id,'menu_link_type'=>'20','menu_is_inner'=>'1','menu_category_id'=>'5','menu_is_active'=>'1'),FALSE);

					//print_obj($menues);die;

					if(!empty($menues)){
						$i=0;
						foreach ($menues as $key => $value) {

							if(!empty($menu_data) && (($value->menu_id==$menu_data->menu_parent_id) || ($value->menu_id==$menu_data->menu_id))){
								$menu_active='yes';
							}else{
								if($i==0){
									if($slug_3!='0'){
										$menu_active='no';
									}else{
										$menu_active='yes';
									}
									
								}else{
									$menu_active='no';
								}									
							}

		        			//($active=='')?'active':''

							$_menues[]=array(
								'menu_id'=>$value->menu_id,
								'menu_name'=>$value->menu_name,
								'menu_link'=>$value->menu_link,
								'menu_default_active'=>($menu_active=='yes')?'active':'',
								'menu_active'=>''
							);

							$i++;
						}
					}

					//print_obj($_menues);die;

					// $article_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url,'slug_type_json_ld'=>'NewsArticle'));

					// $breadcrumb_struct_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url,'slug_type_json_ld'=>'BreadcrumbList'));

					$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

					$this->data['page_structure_data']=$structure_data;

					$this->data['course_data']=array(
						'breadcumb'=>$url_breadcrumb,
						'course_heading'=>$slug_data->url_page_heading,
						'course_id'=>$course_data->course_id,
						'course_menu_id'=>$menu_data->menu_id,
						'course_menu_slug'=>$menu_data->menu_slug,
						'course_menues'=>$_menues
					);

					//print_obj($this->data['course_data']);die;

					$view='webpage/streams/vw_streams_course_details';
				}else if($slug_type=='8'){ //category courses

					$course_category_id=$course_slug->slug_type_id;

					//echo $slug_3;die;

					if($slug_3!='0'){
						$category_course_slug=$this->sm->get_slug(array('slug_value'=>$slug_3));

						$current_url=decode_data($this->data['current_url']);

						//echo $current_url;die;

						$slug_url_data=$this->sm->get_slug_urls(array('url_value'=>$current_url,'url_type'=>'course_stream','url_glob_type'=>'course_stream_colleges_search'));

						// $slug_url_data=$this->sm->get_slug_urls(array('url_type_id'=>$stream_category_id,'url_sub_type_id'=>$stream_id,'url_type'=>'course_stream','url_glob_type'=>'course_stream_colleges_search'));

						//echo $slug_url_data->url_id;die;

						$get_struct_data=$this->sm->get_slug_struct_data(array('slug_type_json_ld'=>'ItemList','strcut_slug_url_id'=>$slug_url_data->url_id,'slug_url'=>$current_url),FALSE);

						//print_obj($get_struct_data);die;

						$this->data['page_structure_data']=$get_struct_data;

						$this->data['bread_crumb']=json_decode($slug_url_data->url_breadcrumb);

						//print_obj($slug_url_data);die;

						$this->data['slug_url_data']=$slug_url_data;

						$view='webpage/streams/vw_stream_category_courses';
					}else{
						$view='webpage/streams/vw_streams_category_details';
					}		

				}
				
				$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal')->load($view, $this->data);
					

			}else{
				redirect(base_url('courses'));
			}

		}else{
			redirect(base_url('courses'));
		}
	}


	public function indexCoursecategoryDetails_old(){
		$slug_1=$this->uri->segment(1,0);//Country
		$slug_2=$this->uri->segment(2,0);//static courses
		$slug_3=$this->uri->segment(3,0);//stream category	


		$streams=array();

		if((is_string($slug_1) && $slug_1!='0') && (is_string($slug_2) && $slug_2=='courses') && (is_string($slug_3) && $slug_3!='0')){
			$country=$this->com->get_country(array('country_iso_code_2'=>strtoupper($slug_1)));

			$slug_data_3=$this->sm->get_slug(array('slug_value'=>$slug_3));

			

			if(!empty($slug_data_3) && $slug_data_3->slug_type=='3'){
				
				$_course_data=$this->strm->get_course(array('course_stream'=>$slug_data_3->slug_type_id),FALSE);

			}else if(!empty($slug_data_3) && $slug_data_3->slug_type=='5'){

				$_course_data=$this->strm->get_course(array('course_id'=>$slug_data_3->slug_type_id));

				$course_data=array(
					'course_name_tab'=>$_course_data->course_name.' Colleges',
					'course_name_title'=>$_course_data->course_name.": Colleges, Jobs, Syllabus, Distance Education ".date('Y'),
					'bread_crumb'=>array(
						'Home'=>base_url(),
						'Courses'=>base_url().$slug_1.'/'.$slug_2,
						$_course_data->course_name=>''
					)
				);


				$ads_data=array(
					'ads_link'=>'https://paruluniversity.ac.in/landingpage/2021/pu-admissions/?utm_source=collegedunia&amp;utm_type=bann&amp;utm_campaign=Parul2021',
					'ads_image'=>'https://images.static-collegedunia.com//public/image/client_images_new/B_ParulUniversityGenericDS_S_27_120210128144856.png'
				);

				$this->data['course_data']=$course_data;
				$this->data['ads_data']=$ads_data;

				$page_title=$_course_data->course_name.": Colleges, Jobs, Syllabus, Distance Education";

				$this->theme->title($page_title)->load('search/vw_search_courses_details_page', $this->data);
			}
			else if(!empty($slug_data_3) && $slug_data_3->slug_type=='8'){
				// $stream_category_id=$slug_data_3->slug_type_id;

				// $category_data=$this->strm->get_stream_category(array('stream_category_id'=>$stream_category_id));

				// if(!empty($category_data)){
				// 	$stream_category=array(
				// 		'category_name'=>$category_data->stream_category.' in '.$country->country_name,
				// 		'category_long_desc'=>$category_data->stream_category_long_description,
				// 		'bread_crumb'=>array(
				// 			'Home'=>base_url(),
				// 			'Courses'=>base_url().$slug_1.'/'.$slug_2,
				// 			$category_data->stream_category_show_name=>''
				// 		)
				// 	);
				// }

				// $_streams=$this->strm->get_inset_stream('stream_category',$stream_category_id);

				// if(!empty($_streams)){
				// 	foreach ($_streams as $key => $value) {
				// 		$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));
				// 		$stream_slug=$this->sm->get_slug(array('slug_type_id'=>$value->stream_id,'slug_type'=>'3'));

				// 		// $param['column_search'] = array('course_name');
				// 		// $param['order'] = array('course_id' => 'ASC');
				// 		// $post['length']='6';

				// 		//$courses = $this->strm->_get_courses($post,$param,FALSE,FALSE);

				// 		$courses=$this->strm->get_system_courses(array('course_stream'=>$value->stream_id),4,'course_id','ASC',FALSE);

				// 		if(!empty($courses)){
				// 			foreach ($courses as $k => $v) {
				// 				$course_slug=$this->sm->get_slug(array('slug_type_id'=>$v->course_id,'slug_type'=>'5'));
				// 				$stream_courses[$value->stream_id][]=array(
				// 					'course_name'=>$v->course_name,
				// 					'access_link'=>base_url().strtolower($country->country_iso_code_2).'/courses/'.$course_slug->slug_value
				// 				);
				// 			}
				// 		}else{
				// 			$stream_courses=array();
				// 		}

				// 		$streams[]=array(
				// 			'stream_id'=>$value->stream_id,
				// 			'stream_name'=>$value->stream_name,
				// 			'strteam_icon'=>$icon->icon_value,
				// 			'stream_access_link'=>strtolower($country->country_iso_code_2).'/courses/'.$slug_data_3->slug_value.'/'.$stream_slug->slug_value,
				// 			'stream_courses'=>$stream_courses[$value->stream_id]
				// 		);
				// 	}
				// }

				// $ads_data=array(
				// 	'ads_link'=>'https://paruluniversity.ac.in/landingpage/2021/pu-admissions/?utm_source=collegedunia&amp;utm_type=bann&amp;utm_campaign=Parul2021',
				// 	'ads_image'=>'https://images.static-collegedunia.com//public/image/client_images_new/B_ParulUniversityGenericDS_S_27_120210128144856.png'
				// );

				// $this->data['stream_category_data']=$stream_category;
				// $this->data['streams']=$streams;
				// $this->data['ads_data']=$ads_data;

				// $page_title='List of '.$category_data->stream_category_show_name.' in '.$country->country_name.' '.date('Y');


				$this->theme->title($this->data['page_title'])->load('search/vw_search_courses_streams_page', $this->data);
			}
			else {
				redirect(base_url().$slug_1.'/'.$slug_2);
			}
		}else{
			redirect(base_url());
		}
	}


	public function indexCourseStreamDetails_old(){
		$slug_1=$this->uri->segment(1,0);//Country
		$slug_2=$this->uri->segment(2,0);//static courses
		$slug_3=$this->uri->segment(3,0);//stream category
		$slug_4=$this->uri->segment(4,0);//stream
		

		if((is_string($slug_1) && $slug_1!='0') && (is_string($slug_2) && $slug_2=='courses') && (is_string($slug_3) && $slug_3!='0') && (is_string($slug_4) && $slug_4!='0')){
			$country=$this->com->get_country(array('country_iso_code_2'=>strtoupper($slug_1)));

			$slug_data_3=$this->sm->get_slug(array('slug_value'=>$slug_3));
			$slug_data_4=$this->sm->get_slug(array('slug_value'=>$slug_4));

			//print_obj($slug_data_4);die;

			if(!empty($slug_data_4) && $slug_data_4->slug_type=='3'){
				$_course_data=$this->strm->get_course(array('course_stream'=>$slug_data_4->slug_type_id,'course_parent_id!='=>NULL,'course_duration_type'=>'full_time'),FALSE,'course_id','ASC',FALSE);

				$this->data['bread_crumb']=array(
					'Home'=>base_url(),
					'Courses'=>base_url().strtolower($country->country_iso_code_2).'/'.$slug_2,
					ucwords(str_replace('_', ' ', $slug_data_4->slug_value))=>''
				);

				$stream=str_replace('_', ' ', $slug_data_4->slug_value);

				if(!empty($_course_data)){

					foreach ($_course_data as $key => $value) {

						$parent_course=$this->strm->get_course(array('course_id'=>$value->course_parent_id));

						$course_name=$parent_course->course_name.'['.$value->course_short_name.'] ('.$value->course_name.')';

						$total_collegecount=$this->sm->get_system_counts(array('count_type'=>'college_enrolled_to_course','count_type_id'=>$value->course_id));

						if(!empty($total_collegecount)){
							$total_count=$total_collegecount->count_value;
						}else{
							$total_count='N/A';
						}

						$slug_value=$this->sm->get_slug_urls(array('url_type'=>'course_static_url','url_type_id'=>$value->course_id));					

						$course_data[]=array(
							'course_parent_id'=>$value->course_parent_id,
							'course_name'=>$course_name,
							'course_duration'=>$value->course_duration.' Years',
							'course_duration_type'=>ucwords(str_replace('_', ' ', $value->course_duration_type)),
							'course_colleges_total'=>$total_count,
							'course_link'=>$slug_value->url_value
						);
					}

					$this->data['course_data']=$course_data;

					$this->data['top_stream_colleges']='';
					$this->data['top_courses_colleges']='';

					$this->data['stream_id']=$slug_data_4->slug_type_id;

					$this->data['top_colleges_heading']='TOP '.strtoupper($stream).' COLLEGES IN '.strtoupper($country->country_name);

					$this->data['top_courese_colleges_heading']='TOP BE/B.TECH COLLEGES IN '.strtoupper($country->country_name);
				}

				$page_title=$this->data['page_title'];

				//print_obj($this->data['page_title']);die;

				$this->theme->title($page_title)->load('search/vw_search_stream_courses_page', $this->data);
			}else if(!empty($slug_data_4) && $slug_data_4->slug_type=='5'){

				$_course_data=$this->strm->get_course(array('course_id'=>$slug_data_4->slug_type_id));

				$slug_5=$this->uri->segment(5,0);//menu

				//echo $slug_5;die;

				if(!empty($slug_5)){
					$menu_data=$this->sm->get_menues(array('menu_link_type'=>'10','menu_link_id'=>$slug_data_4->slug_type_id,'menu_slug'=>$slug_5));

					//print_obj($slug_data_4->slug_type_id);die;

					if(!empty($menu_data)){
						$course_details_data=$this->strm->get_course_details_data(array('course_id'=>$slug_data_4->slug_type_id,'course_inner_menu_id'=>$menu_data->menu_id),FALSE);
					}
				}else{
					$menu_data=$this->sm->get_menues(array('menu_link_type'=>'10','menu_link_id'=>$slug_data_4->slug_type_id,'menu_name'=>'overview'));
					if(!empty($menu_data)){
						$course_details_data=$this->strm->get_course_details_data(array('course_id'=>$slug_data_4->slug_type_id,'course_inner_menu_id'=>$menu_data->menu_id),FALSE);
					}					
				}

				

				

				$course_menues=$this->sm->get_menues(array('menu_link_id'=>$slug_data_4->slug_type_id,'menu_link_type'=>'10','menu_is_inner'=>'1','menu_category_id'=>'5'),FALSE);

				//print_obj($slug_data_4);die;

				$_course_menues=array();
				if(!empty($course_menues)){

					foreach ($course_menues as $key => $value) {
						$_course_menues[]=array(
							'menu_name'=>$value->menu_name,
							'menu_link'=>$value->menu_link,
							'menu_active'=>($menu_data->menu_id==$value->menu_id)?'active':''
						);
					}
				}

				

				

				$course_data=array(
					'course_name_tab'=>$_course_data->course_name.' Colleges',
					'course_name_title'=>$_course_data->course_name.": Colleges, Jobs, Syllabus, Distance Education ".date('Y'),
					'course_name'=>$_course_data->course_name,
					'bread_crumb'=>array(
						'Home'=>base_url(),
						'Courses'=>base_url().$slug_1.'/'.$slug_2,
						ucwords(str_replace('_',' ',$slug_data_3->slug_value))=>base_url().$slug_1.'/'.$slug_2.'/'.$slug_3,
						$_course_data->course_name=>''
					),
					'inner_menues'=>$_course_menues,
					'course_details_data'=>$course_details_data
				);


				$ads_data=array(
					'ads_link'=>'https://paruluniversity.ac.in/landingpage/2021/pu-admissions/?utm_source=collegedunia&amp;utm_type=bann&amp;utm_campaign=Parul2021',
					'ads_image'=>'https://images.static-collegedunia.com//public/image/client_images_new/728x9020210628100849.gif'
				);

				//print_obj($course_details_data);die;

				$this->data['course_data']=$course_data;
				$this->data['ads_data']=$ads_data;

				$this->data['country_id']=encode_data($country->country_id);

				//$page_title=$_course_data->course_name.": Colleges, Jobs, Syllabus, Distance Education";

				$page_title=$this->data['page_title'];

				$this->theme->title($page_title)->add_partial('partial_ask_question_modal',$this->data)->load('search/vw_search_courses_details_page', $this->data);
			}
			else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}

	public function indexCourseStreamMenuDetails(){
		$slug_1=$this->uri->segment(1,0);//Country
		$slug_2=$this->uri->segment(2,0);//static courses
		$slug_3=$this->uri->segment(3,0);//stream category
		$slug_4=$this->uri->segment(4,0);//stream
		$slug_4=$this->uri->segment(5,0);//menu
	}



	
	public function onSearchCourse(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$searched_param=post_data('_searched_param');

			if(!empty($_searched_param)){

			}else{
				
			}

		}else{

		}
	}

}