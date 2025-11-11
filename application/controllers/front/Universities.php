<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Universities extends BaseFrontController
{


	public function index(){
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course

		$top_cities=array();
		$first_middle_ads_data=array();
		$second_middle_ads_data=array();
		$third_middle_ads_data=array();

		$state_id='';
		$city_id='';
		$stream_id='';
		$course_id='';


		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='universities')){
			if(is_string($segment_2) && $segment_2=='universities'){
				$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
				if(!empty($country_data)){		
					if($segment_3!='0'){

					}

					$param['country_id']=$country_data->country_id;

					$post=array('length'=>'16','start'=>'0');

					$universities=$this->im->_get_universities($post,$param,null,FALSE,FALSE,FALSE,FALSE);

					if(!empty($universities)){
						foreach ($universities as $key => $value) {
							$_university_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->university_user_id,'user_storage_type'=>'user_banner'));
			    			$_university_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->university_user_id,'user_storage_type'=>'user_logo'));
			    			$currency=$this->com->get_currency(array('currency_id'=>$value->university_currency_id));

			    			if(!empty($_university_logo) && !empty($_university_logo->media_disk_path_relative)){
			                    $university_logo=$_university_logo->media_disk_path_relative;
			                    $university_logo=$_university_logo->media_org_name;
			                }else{
			                    $university_logo=base_url().'uploads/app/default/no.jpg';
			                    $university_logo_name='';
			                }

			                if(!empty($_university_banner) && !empty($_university_banner->media_disk_path_relative)){
			                    $university_banner=$_university_banner->media_disk_path_relative;
			                    $university_banner_name=$_university_banner->media_org_name;
			                }else{
			                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
			                    $college_banner_name='';
			                }

			                $current_date=date('Y-m-d');

			                $is_featured=$value->university_is_featured;

			                if(!empty($value->university_facilities)){
			                    $cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->university_facilities);

			                    foreach ($cfacilities as $k => $v) {
			                        $university_facilities[]=array(
			                            'facility_name'=>$v->facility_name,
			                            'facility_icon'=>$v->facility_icon
			                        );
			                    }
			                }else{
			                    $university_facilities=array();
			                }

			                if(!empty($value->university_affiliation_type)){
			                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$value->university_affiliation_type);

			                    $college_affiliations=$caffiliations->concated_value;
			                }else{
			                    $college_affiliations='';
			                }


			                $university_courses=$this->im->get_user_course_data(array('is_visible_in_grid_list'=>'1','user_id'=>$value->college_user_id),FALSE);

			                

			                if(!empty($university_courses)){
			                    foreach ($university_courses as $k => $v) {
			                        $course=$this->strm->get_course(array('course_id'=>$v->user_course));
			                        $cost=$this->im->get_course_fees_data(array('user_id'=>$value->university_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));

			                        $_course_cost=($currency->currency_symbol_left!='')?$currency->currency_symbol_left.number_format($cost->user_course_total_fee):number_format($cost->user_course_total_fee).$currency->currency_symbol_right;

			                        $_course_cost_data[]=array(
			                            'cost_value'=>$_course_cost,
			                            'course_name'=>$course->course_short_name.' - 1ST YEAR FEES'
			                        );
			                    }
			                }else{
			                    $_course_cost_data=array();
			                }

			                $university_data[]=array(
			                    'university_id'=>encode_data($value->university_id),
			    				'university_name'=>$value->university_name,
			    				'university_city'=>$value->city_name,
			    				'university_state'=>$value->state_name,
			    				'university_country_id'=>encode_data($value->university_country_id),
			    				'university_country'=>$value->country_name,
			                    'university_total_course_amount'=>number_to_currency($total_cost),
			                    'university_total_course_amount_with_currency'=>$course_cost,
			    				'university_logo'=>$university_logo,
			    				'university_banner'=>$university_banner,
			                    'university_intro_video'=>$university_intro_video,
			                    'university_affiliations'=>$university_affiliations,
			                    'is_featured'=>$is_featured,
			                    'access_url'=>$value->access_url,
			                    'university_country_phone_code'=>$country_data->country_phone_code,
			                    'university_facilities'=>$university_facilities,
			                    'university_courses_cost'=>$_course_cost_data,
			                    'university_course_fees_link'=>$value->access_url.'/courses-fees',
			                    'university_reviews_link'=>$value->access_url.'/reviews',
                    			'university_admissions_link'=>$value->access_url.'/admission-'.date('Y'),
			                    'university_ranks'=>array(),
			                    'institute_type'=>encode_data(7)
			    			);
						}
					}else{
						$university_data=array();
					}

					$this->data['searched_universities']=$university_data;

					$view_page='search/vw_search_universities_page';

					$this->theme->title($page_title)->add_partial('partial_apply_modal',$this->data)->load($view_page, $this->data);
				}else{
					redirect(base_url().'in/universities');
				}
			}else{
				redirect(base_url().'in/universities');
			}
		}else{
			redirect(base_url().'in/universities');
		}
	}

	public function indexOld(){

		$segment_1=$this->uri->segment(1,0);
		$segment_2=$this->uri->segment(2,0);
		$segment_3=$this->uri->segment(3,0);//state
		$segment_4=$this->uri->segment(4,0);//city


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='universities')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){				

				$post=array('length'=>'10','start'=>'0');

				if($segment_3!='0'){

					$slug_data_3=$this->sm->get_slug(array('slug_value'=>$segment_3));

					if(!empty($slug_data_3)){
						$slug_type=$slug_data_3->slug_type;

						if($slug_type=='1'){
							$state_data=$this->com->get_state(array('state_name_slug'=>$segment_3));
						}
					}
					

					if($segment_4!='0'){
						$slug_data_4=$this->sm->get_slug(array('slug_value'=>$segment_4));

						if(!empty($slug_data_4)){
							$slug_type_4=$slug_data_4->slug_type;

							if($slug_type_4=='2'){
								$city_data=$this->com->get_city(array('city_name_slug'=>$segment_4));

								$page_title='Top Universities in '.$city_data->city_name.','.$state_data->state_name.','.$country_data->country_name;
								$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_data->state_id,'city_id'=>$city_data->city_id,'status'=>'1','is_verified'=>'1');
							}else{
								$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
								$page_title='Top Universities in '.$country_data->country_name;
							}

						}else{
							$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
							$page_title='Top Universities in '.$country_data->country_name;
						}

						
						

					}else{
						$page_title='Top Universities in '.$state_data->state_name.','.$country_data->country_name;
						$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_data->state_id,'status'=>'1','is_verified'=>'1');
					}
				}else{
					$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
					$page_title='Top Universities in '.$country_data->country_name;
				}
				
				
				$universities=$this->im->get_universities($post,$param,null,FALSE,FALSE,FALSE,FALSE);


				//print_obj($universities);die;


				if(!empty($universities)){
		    		foreach ($universities as $key => $value) {
		    			$_university_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->university_user_id,'user_file_type'=>'3','user_storage_type'=>'user_banner'));
		    			$_university_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->university_user_id,'user_file_type'=>'3','user_storage_type'=>'user_logo'));

		    			if(!empty($_university_logo) && !empty($_university_logo->media_disk_path_relative)){
		                    $university_logo=$_university_logo->media_disk_path_relative;
		                    $university_logo_name=$_university_logo->media_org_name;
		                }else{
		                    $university_logo=base_url().'uploads/app/default/no.jpg';
		                    $university_logo_name='';
		                }

		                if(!empty($_university_banner) && !empty($_university_banner->media_disk_path_relative)){
		                    $university_banner=$_university_banner->media_disk_path_relative;
		                    $university_banner_name=$_university_banner->media_org_name;
		                }else{
		                    $university_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                    $university_banner_name='';
		                }

		    			$is_featured='2';

		    			$university_data[]=array(
		    				'university_name'=>$value->university_name,
		    				'university_city'=>$value->city_name,
		    				'university_state'=>$value->state_name,
		    				'university_country'=>$value->country_name,
		    				'university_logo'=>$university_logo,
		    				'university_banner'=>$university_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url
		    			);
		    		}
		    	}else{
		    		$university_data=array();
		    	}


		    	//print_obj($university_data);die;


				$this->data['searched_universities']=$university_data;
				$this->data['country_id']=encode_data($country_data->country_id);
				$this->data['country_name']=strtoupper($country_data->country_name);
				$this->data['page_title']=$page_title;

				$this->theme->title($this->data['page_title'])->load('search/vw_search_universities_page', $this->data);
			}else{
				show_404();
			}
			
		}else if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='colleges')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

			if(!empty($country_data)){
				$post=array('length'=>'10','start'=>'0');
				if($segment_3!='0'){

				}else{
					$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
					$page_title='Top Colleges in '.$country_data->country_name;
				}

				$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);


				if(!empty($colleges)){
		    		foreach ($colleges as $key => $value) {
		    			$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
		    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
		                    $college_logo=$_college_logo->media_disk_path_relative;
		                    $college_logo_name=$_college_logo->media_org_name;
		                }else{
		                    $college_logo=base_url().'uploads/app/default/no.jpg';
		                    $college_logo_name='';
		                }

		                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
		                    $college_banner=$_college_banner->media_disk_path_relative;
		                    $college_banner_name=$_college_banner->media_org_name;
		                }else{
		                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                    $college_banner_name='';
		                }

		                $is_featured='2';

		    			$college_data[]=array(
		    				'college_name'=>$value->college_name,
		    				'college_city'=>$value->city_name,
		    				'college_state'=>$value->state_name,
		    				'college_country'=>$value->country_name,
		    				'college_logo'=>$college_logo,
		    				'college_banner'=>$college_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url
		    			);
		    		}
		    	}else{
		    		$college_data=array();
		    	}

		  
		    	$this->data['searched_colleges']=$college_data;
				$this->data['country_id']=encode_data($country_data->country_id);
				$this->data['country_name']=strtoupper($country_data->country_name);
	

				$this->theme->title($this->data['page_title'])->load('search/vw_search_colleges_page', $this->data);

			}else{
				show_404();
			}
		}
	}


	public function indexPublicPages(){

		$segment_1=$this->uri->segment(1,0); //country
		$segment_2=$this->uri->segment(2,0); //college,university url
		$segment_3=$this->uri->segment(3,0); //inner menues
		$segment_4=$this->uri->segment(4,0); //inner menues
		$segment_5=$this->uri->segment(5,0); //streams

		//echo $segment_1;die;

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

			if(!empty($country_data)){

				//echo $segment_2;

				$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

				//print_obj($slug_found);die;

				if(!empty($slug_found)){

					$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;


					if($slug_type=='6'){ //university

						$university_data=$this->im->get_university_profile_data(array('university_user_id'=>$slug_type_id));

						$university_type=$this->im->get_institute_types(array('inst_type'=>$university_data->university_type));

						$country_data=$this->com->get_country(array('country_id'=>$university_data->university_country_id));
						$city_data=$this->com->get_city(array('city_id'=>$university_data->university_city_id));
						$state_data=$this->com->get_state(array('state_id'=>$university_data->university_state_id));

						$uni_slug=$this->sm->get_slug(array('slug_type'=>'6','slug_type_id'=>$university_data->university_user_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));
						$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));

						$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$slug_type_id,'user_storage_type'=>'user_logo'));

				        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
				            $user_logo=$user_logo->media_disk_path_relative;
				            $user_logo_name=$user_logo->media_org_name;
				        }else{
				            $user_logo=base_url().'uploads/app/default/no.jpg';
				            $user_logo_name='';
				        }


				        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$slug_type_id,'user_storage_type'=>'user_banner'));

				        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
				            $user_banner=$user_banner->media_disk_path_relative;
				            $user_banner_name=$user_banner->media_org_name;
				        }else{
				            $user_banner=base_url().'uploads/app/default/pageBnr.jpg';
				            $user_banner_name='';
				        }


				        $_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$slug_type_id),FALSE,'menu_serial','ASC');

				        if(!empty($_inner_menu)){
				        	$i=0;
				        	foreach ($_inner_menu as $k => $v) {

				        		if($segment_3!='0' && $v->menu_slug==$segment_3){
			        				$active='active';
			        			}else{
			        				$active='';
			        			}
				        		
				        		$inner_menu[]=array(
				        			'menu_name'=>$v->menu_name,
				        			'menu_link'=>$v->menu_link,
				        			'menu_default_active'=>($i==0)?'active':'',
				        			'menu_active'=>$active
				        		);

				        		$_inner_menu_names[]=$v->menu_name;
				        		$i++;
				        	}
				        }else{
				        	$inner_menu=array();
				        	$_inner_menu_names=array();
				        }

				        if($segment_3!='0'){
				        	$segment_3_details=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$slug_type_id,'menu_slug'=>$segment_3));				        	

							if(!empty($segment_3_details->menu_name_alias) || $segment_3_details->menu_name_alias!=NULL){
								$university_name_formatted=strtoupper($university_data->university_name).','.strtoupper($city_data->city_name).' - '.strtoupper($segment_3_details->menu_name_alias);
								$breadcumb=array(
									'HOME'=>base_url(),
									strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/universities/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
									strtoupper($segment_3_details->menu_name_alias)=>''
								);
							}else{
								$university_name_formatted=strtoupper($university_data->university_name).','.strtoupper($city_data->city_name);
								$breadcumb=array(
									'HOME'=>base_url(),
									strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/universities/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
									strtoupper($segment_3_details->menu_name_alias)=>''
								);
							}
				        }else{
				        	$breadcumb=array(
								'HOME'=>base_url(),
								strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/universities/'.$state_slug->slug_value.'/'.$city_slug->slug_value
							);

							$university_name_formatted=strtoupper($university_data->university_name).','.strtoupper($city_data->city_name);
				        }

				        //print_obj($breadcumb);die;

						$this->data['university_data']=array(
							'university_name'=>strtoupper($university_data->university_name),
							'university_name_formatted'=>$university_name_formatted,
							'university_country'=>strtoupper($country_data->country_name),
							'university_state'=>strtoupper($state_data->state_name),
							'university_city'=>strtoupper($city_data->city_name),
							'university_logo'=>$user_logo,
							'university_banner'=>$user_banner,
							'university_estd'=>$university_data->university_estd_year,
							'university_type'=>strtoupper($university_type->inst_type_name),
							'university_breadcrumb'=>$breadcumb,
							'university_inner_menues'=>$inner_menu
						);

						$this->data['popup_data']=array(
							'popup_logo'=>$user_logo,
							'popup_name'=>$university_name_formatted
						);

					

						$page_title=$university_data->university_name;


						if(isset($segment_3_details) && !empty($segment_3_details)){
							$web_page='webpage/universities/vw_university_'.str_replace('-', '_', strtolower($segment_3_details->menu_slug)).'_web_page';
						}else{
							$web_page='webpage/universities/vw_university_web_page';
						}

						$this->theme->title($page_title)->add_partial('partial_register_specific_modal',$this->data)->load($web_page, $this->data);

					}else if($slug_type=='7'){ //college
						$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

						//print_obj($college_data);die;

						$college_type=$this->im->get_institute_types(array('inst_type'=>$college_data->college_type));

						$country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
						$city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
						$state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

						$uni_slug=$this->sm->get_slug(array('slug_type'=>'7','slug_type_id'=>$college_data->college_user_id));
						$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));
						$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));


						$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$slug_type_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

						//$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->colege_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

						//print_obj($user_logo);die;

				        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
				            $user_logo=$user_logo->media_disk_path_relative;
				            $user_logo_name=$user_logo->media_org_name;
				        }else{
				            $user_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
				            $user_logo_name='';
				        }


				        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$slug_type_id,'user_storage_type'=>'user_banner'));

				        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
				            $user_banner=$user_banner->media_disk_path_relative;
				            $user_banner_name=$user_banner->media_org_name;
				        }else{
				            $user_banner=base_url().'uploads/app/default/pageBnr.jpg';
				            $user_banner_name='';
				        }


				        if(!empty($college_data->college_affiliation_type)){
		                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$college_data->college_affiliation_type);

		                    $college_affiliations=$caffiliations->concated_value;
		                }else{
		                    $college_affiliations='';
		                }


				        $info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$slug_type_id));

				        if(!empty($info)){
				        	$college_info=array(
				        		'content_value'=>$info->info_value,
				        		'content_curator'=>$this->data['system_name_title'],
				        		'content_updated_on'=>date('F dS,Y',strtotime($info->info_updated_at))
				        	);
				        }else{
				        	$college_info=array();
				        }

				        

				        $_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$slug_type_id),FALSE,'menu_serial','ASC');

				        //print_obj($_inner_menu);die;

				        if(!empty($_inner_menu)){
				        	$i=0;
				        	foreach ($_inner_menu as $k => $v) {

				        		if($segment_3!='0' && $v->menu_slug==$segment_3){
			        				$active='active';
			        				$default_active='';
			        				$i++;
			        			}else{
			        				$active='';
			        				$default_active=($segment_3=='0' && $i==0 && $v->menu_slug=='info')?'active':'';
			        			}
				        		
				        		$inner_menu[]=array(
				        			'menu_name'=>$v->menu_name,
				        			'menu_link'=>$v->menu_link,
				        			'menu_default_active'=>$default_active,
				        			'menu_active'=>$active
				        		);

				        		$_inner_menu_names[]=$v->menu_name;
				        		
				        	}
				        }else{
				        	$inner_menu=array();
				        	$_inner_menu_names=array();
				        }


				        if($segment_3!='0'){
				        	$segment_3_details=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$slug_type_id,'menu_slug'=>$segment_3));

				        	//print_obj($segment_3_details);die;			        	

							if(!empty($segment_3_details->menu_name_alias) || $segment_3_details->menu_name_alias!=NULL){
								$college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name).' - '.strtoupper($segment_3_details->menu_name_alias);
								$breadcumb=array(
									'HOME'=>base_url(),
									strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
									strtoupper($segment_3_details->menu_name)=>''
								);
							}else{
								$college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name);
								$breadcumb=array(
									'HOME'=>base_url(),
									strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
									strtoupper($segment_3_details->menu_name)=>''
								);
							}
				        }else{
				        	$breadcumb=array(
								'HOME'=>base_url(),
								strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value
							);

							$college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name);
				        }


				        $current_date=date('Y-m-d');

			
				        //print_obj($inner_menu);die;

				        //print_obj($college_data->college_university_id);

				        if($college_data->college_university_id!=null && $college_data->college_university_id!=0){
				        	$college_university=$this->im->_get_university_profile_data(array('university_user_id'=>$college_data->college_university_id));
				        }

				        
				    	

				    	//print_obj($college_university);die;

				    	if(isset($this->data['userdata']) && !empty($this->data['userdata']) && $this->data['userdata']->user_role=='8'){
				    		$application_data=$this->um->get_applicant(array('applicant_ph'=>$this->data['userdata']->user_phone_no,'application_inst_id'=>$college_data->college_user_id));

				    		if(!empty($application_data)){
				    			$apply_disabled='disabled="true"';
				    		}else{
				    			$apply_disabled='';
				    		}

				    		$show_apply_button=true;

				    		$inst_web_page='inst_web_page';
				    	}else if(isset($this->data['userdata']) && !empty($this->data['userdata']) && in_array($this->data['userdata']->user_roleedle, array(3,4,5,6,7,12)) ){
				    		$inst_web_page='';
				    		$show_apply_button=false;
				    		$apply_disabled='';
				    	}else{
			    			$inst_web_page='inst_web_page';
			    			$show_apply_button=true;
			    			$apply_disabled='';
			    		}

				        //print_obj($this->data['college_data']);die;

				        $page_title=$college_data->college_name;

				        // $page_title=$this->data['page_title'];

				        $show_info_widget=FALSE;
				        $show_gallery_widget=FALSE;
				        $show_gallery_brief_widget=TRUE;
				        $show_gallery_video_widget=FALSE;
				        $show_gallery_video_brief_widget=TRUE;
				        $show_course_fees_widget=FALSE;
				        $show_course_fees_course_widget=FALSE;
				        $show_course_fees_brief_widget=FALSE;
				        $show_course_fees_brief_width_ads_widget=FALSE;
				        $show_facilities_widget=FALSE;
				        $show_placement_companies_widget=FALSE;
				        $show_similar_colleges_universities_widget=FALSE;
				        $show_nearby_colleges_universities_widget=FALSE;

				        $show_news_brief_widget=TRUE;
				        $show_news_widget=FALSE;
				        $show_news_details_widget=FALSE;

				        $show_hostel_widget=FALSE;
				        $show_news_widget=FALSE;

				        $show_subscription_section_widget=FALSE;
				        $show_faculties_section_widget=FALSE;
				        $show_info_review_list_widget=FALSE;

				        $show_scholarship_widget=FALSE;

				        $show_broucher_widget=FALSE;
				        $show_google_maps=FALSE;
				        $show_admission_widget=FALSE;

				        $show_placement_details_widget=FALSE;


				        if($segment_3!='0'){
				        	if($segment_3=='gallery'){
				        		$show_gallery_widget=TRUE;
				        		$show_gallery_brief_widget=FALSE;
				        		$show_course_fees_brief_widget=FALSE;
				        		$show_course_fees_brief_width_ads_widget=FALSE;
				        		$show_broucher_widget=FALSE;
				        		$show_news_details_widget=FALSE;
				        		$show_news_brief_widget=FALSE;
				        	}

				        	if($segment_3=='video'){
				        		$show_gallery_video_widget=TRUE;
				        		$show_gallery_video_brief_widget=FALSE;
				        		$show_course_fees_brief_widget=FALSE;
				        		$show_course_fees_brief_width_ads_widget=FALSE;
				        	}

				        	if($segment_3=='hostel'){
				        		$show_hostel_widget=TRUE;
				        		$show_course_fees_brief_widget=FALSE;
				        		$show_course_fees_brief_width_ads_widget=FALSE;
				        	}

				        	if($segment_3=='news'){				        		

				        		if($segment_4!='0'){
				        			$slug4_found=$this->sm->get_slug(array('slug_type'=>11,'slug_value'=>$segment_4));

				        			if(!empty($slug4_found)){
				        				$show_news_details_widget=TRUE;
				        				$show_news_brief_widget=FALSE;
				        				$show_gallery_brief_widget=FALSE;
				        				$show_gallery_video_brief_widget=FALSE;				        				
				        			}
				        			
				        		}else{
				        			$show_news_widget=TRUE;
					        		$show_news_brief_widget=FALSE;
					        		$show_course_fees_widget=FALSE;
					        		$show_course_fees_course_widget=FALSE;
					        		$show_course_fees_brief_widget=FALSE;
					        		$show_course_fees_brief_width_ads_widget=FALSE;
					        		$show_gallery_brief_widget=FALSE;
				        		}
				        	}
				        	//echo $segment_3;die;

				        	if($segment_3=='courses-fees' || $segment_3=='course-and-fees' || $segment_3=='course-fees'){
				        		//echo 'hi';
				        		//echo $segment_4;die;
				        		if($segment_4!='0'){
				        			
				        			$slug4_found=$this->sm->get_slug(array('slug_type'=>'5','slug_value'=>$segment_4));

				        			//print_obj($slug4_found);die;

				        			if(!empty($slug4_found)){
				        				$show_course_fees_course_widget=TRUE;
				        				$show_course_fees_brief_widget=FALSE;
				        				$show_course_fees_brief_width_ads_widget=FALSE;
				        				$show_nearby_colleges_universities_widget=TRUE;
				        				$show_subscription_section_widget=TRUE;
				        				
				        			}
				        		}else{
				        			$show_course_fees_course_widget=FALSE;
				        			$show_course_fees_widget=TRUE;
				        			$show_subscription_section_widget=TRUE;
				        		}

				        		//echo $show_course_fees_widget;die;

				        		$show_faculties_section_widget=TRUE;
				        		$show_info_review_list_widget=TRUE;

				        	}

				        	if($segment_3=='scholarships'){
				        		$show_scholarship_widget=TRUE;
				        		$show_news_details_widget=FALSE;
				        		$show_news_brief_widget=FALSE;
				        	}

				        	if($segment_3=='placement'){
				        		$show_placement_companies_widget=TRUE;
				        		$show_info_review_list_widget=TRUE;
				        		$show_course_fees_brief_widget=FALSE;
				        		$show_course_fees_brief_width_ads_widget=FALSE;
				        		$show_placement_details_widget=TRUE;
				        	}

				        	if($segment_3=='faculty'){
				        		$show_faculties_section_widget=TRUE;
				        		$show_subscription_section_widget=TRUE;
				        		$show_info_review_list_widget=TRUE;
				        		$show_course_fees_brief_widget=FALSE;
				        		$show_course_fees_brief_width_ads_widget=FALSE;
				        		$show_news_details_widget=TRUE;
				        		$show_news_brief_widget=FALSE;
				        		$show_gallery_brief_widget=FALSE;
				        	}

				        	if($segment_3==='admission'){
				        		$show_admission_widget=TRUE;
				        	}


				        	if($segment_3=='clientclaim'){

				        		$designations=$this->im->get_designations(array('designation_status'=>'1'),false);

				        		foreach ($designations as $key => $value) {
				        			$_designations[]=array(
				        				'designation_id'=>encode_data($value->designation_id),
				        				'designation_name'=>$value->designation_name
				        			);
				        		}

				        		$inst_web_page='';

				        		$this->data['designations']=$_designations;
					        	$view_page='webpage/colleges/vw_college_web_claim_page';
					        }else{
					        	$view_page='webpage/colleges/vw_college_web_page';
					        }
				        }else{
				        	$show_info_widget=TRUE;
				        	$show_facilities_widget=TRUE;
				        	$show_course_fees_widget=TRUE;
				        	$show_course_fees_brief_widget=FALSE;
				        	$show_course_fees_brief_width_ads_widget=TRUE;
				        	$show_gallery_widget=FALSE;
				        	$show_gallery_brief_widget=TRUE;
				        	$show_similar_colleges_universities_widget=FALSE;
				        	$show_nearby_colleges_universities_widget=TRUE;
				        	$show_placement_companies_widget=TRUE;
				        	$show_subscription_section_widget=FALSE;
				        	$show_info_review_list_widget=TRUE;
				        	$show_news_brief_widget=TRUE;
				        	$show_broucher_widget=TRUE;
				        	$show_google_maps=TRUE;

				        	$view_page='webpage/colleges/vw_college_web_page';
				        }

				        $college_address=$college_data->college_address.','.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).','.$college_data->college_zipcode;

				         $this->data['college_data']=array(
				        	'college_id'=>encode_data($college_data->college_id),
				        	'college_user_id'=>encode_data($college_data->college_user_id),
				        	'college_name'=>strtoupper($college_data->college_name),
				        	'college_name_formatted'=>$college_name_formatted,
				        	'college_affiliations'=>$college_affiliations,
							'college_country'=>strtoupper($country_data->country_name),
							'college_state'=>strtoupper($state_data->state_name),
							'college_country_id'=>encode_data($college_data->college_country_id),
							'college_country_iso_code_4'=>$country_data->country_iso_code_4,
							'college_city_id'=>$city_data->city_id,
							'college_city_state_id'=>$city_data->city_state_id,
							'college_city_country_id'=>$city_data->city_country_id,
							'college_city'=>strtoupper($city_data->city_name),
							'college_address'=>$college_address,
							'college_zipcode'=>$college_data->college_zipcode,
							'college_web_address'=>$college_data->college_web_address,
							'college_google_map'=>'https://www.google.com/maps/embed/v1/place?key=AIzaSyCZm1_Yt_mBz93LOSnI640QAn6eeP891MU&q='.$college_address,
							'college_logo'=>$user_logo,
							'college_banner'=>$user_banner,
							'college_estd'=>$college_data->college_estd_year,
							'college_type'=>strtoupper($college_type->inst_type_name),
							'college_university'=>(isset($college_university))?$college_university->university_name.','.strtoupper($college_university->city_name):'',
							'college_breadcrumb'=>$breadcumb,
							'college_inner_menues'=>$inner_menu,
							'college_page_top_ads'=>$top_ads_data,
							'college_claim_url'=>$college_data->access_url.'/clientclaim',
							'college_country_phone_code'=>$country_data->country_phone_code,
							'institute_type'=>encode_data(7),
							'inst_web_page'=>$inst_web_page,
							'apply_disabled'=>$apply_disabled,
							'show_apply'=>$show_apply_button,
							'college_info'=>$college_info
				        );

				        // print_obj($this->data['college_data']);die;



				        //echo $show_news_widget;die;

				       // die;

				        $this->data['show_info_widget']=$show_info_widget;
				        $this->data['show_facilities_widget']=$show_facilities_widget;
				        $this->data['show_gallery_widget']=$show_gallery_widget;
				        $this->data['show_gallery_brief_widget']=$show_gallery_brief_widget;
				        $this->data['show_gallery_video_widget']=$show_gallery_video_widget;
				        $this->data['show_gallery_video_brief_widget']=$show_gallery_video_brief_widget;
				        $this->data['show_hostel_widget']=$show_hostel_widget;
				        $this->data['show_course_fees_widget']=$show_course_fees_widget;
				        $this->data['show_placement_companies_widget']=$show_placement_companies_widget;
				        $this->data['show_course_fees_course_widget']=$show_course_fees_course_widget;

				        $this->data['show_course_fees_brief_widget']=$show_course_fees_brief_widget;
				        $this->data['show_course_fees_brief_width_ads_widget']=$show_course_fees_brief_width_ads_widget;

				        $this->data['show_similar_colleges_universities_widget']=$show_similar_colleges_universities_widget;
				        $this->data['show_nearby_colleges_universities_widget']=$show_nearby_colleges_universities_widget;

				        $this->data['show_news_brief_widget']=$show_news_brief_widget;
				        $this->data['show_news_widget']=$show_news_widget;

				        $this->data['show_news_details_widget']=$show_news_details_widget;

				        $this->data['show_subscription_section_widget']=$show_subscription_section_widget;

				        $this->data['show_faculties_section_widget']=$show_faculties_section_widget;

				        $this->data['show_info_review_list_widget']=$show_info_review_list_widget;

				        $this->data['show_scholarship_widget']=$show_scholarship_widget;
				        $this->data['show_broucher_widget']=$show_broucher_widget;
				        $this->data['show_google_maps']=$show_google_maps;

				        $this->data['show_admission_widget']=$show_admission_widget;

				        $this->data['show_placement_details_widget']=$show_placement_details_widget;

				        //\print_obj($this->data);die;

				       // echo $segment_3;

				      

				       //echo $view_page;die;

						$this->theme->title($page_title)->add_partial('partial_application_thanks_modal')->load($view_page, $this->data);
					}
				}

			}else{

			}
		}
	}



	//Search Universities
	public function onSearchUniversities(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$_country=post_data('_country');
			$search_streams=post_data('search_streams');
			$search_course=post_data('search_course');
			$search_cities=post_data('search_cities');

			$search_states=post_data('search_states');

			$search_type=post_data('_search_type');


			$courses= '';
			$streams= '';
			$states='';
			$cities='';
			$university_data=array();

			$country_id=decode_data($_country);

			if(!empty($search_streams)){
				$_streams=char_separated_to_array($search_streams);
				foreach ($_streams as $key => $value) {
					$_str[]=decode_data($value);
				}

				$streams= char_separated($_str);
			}


			if(!empty($search_course)){
				$_courses=char_separated_to_array($search_course);
				foreach ($_courses as $key => $value) {
					$_cstr[]=decode_data($value);
				}

				$courses= char_separated($_cstr);
			}

			if(!empty($search_states)){
				$_states=char_separated_to_array($search_states);
				foreach ($_states as $key => $value) {
					$_sstr[]=decode_data($value);
				}

				$states= char_separated($_sstr);
			}

			if(!empty($search_cities)){
				$_cities=char_separated_to_array($search_cities);
				foreach ($_cities as $key => $value) {
					$_cistr[]=decode_data($value);
				}

				$cities= char_separated($_cistr);
			}


			if($search_type=='6'){
				if(!empty($states) && !empty($cities) && !empty($courses) && !empty($streams)){//state,city,course,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course','param_val'=>$courses),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && !empty($courses) && empty($streams)){//state,city,course
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course','param_val'=>$courses));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && empty($courses) && empty($streams)){//state,city
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'university_city_id','param_val'=>$cities));
				}else if(!empty($states) && empty($cities) && empty($courses) && !empty($streams)){//state,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && !empty($courses) && !empty($streams)){//state,course
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'user_course','param_val'=>$courses));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && empty($courses) && !empty($streams)){//state,city,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && empty($courses) && !empty($streams)){//city,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && !empty($cities) && !empty($courses) && empty($streams)){//city,course
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course','param_val'=>$courses));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && empty($cities) && !empty($courses) && !empty($streams)){//state,course,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_state_id','param_val'=>$states),array('param'=>'user_course','param_val'=>$courses),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(empty($states) && !empty($cities) && !empty($courses) && !empty($streams)){//city,course,streams
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_city_id','param_val'=>$cities),array('param'=>'user_course','param_val'=>$courses),array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(empty($states) && empty($cities) && empty($courses) && !empty($streams)){//streams
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'user_course_stream','param_val'=>$streams));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(empty($states) && empty($cities) && !empty($courses) && empty($streams)){//courses
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'user_course','param_val'=>$courses));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(empty($states) && !empty($cities) && empty($courses) && empty($streams)){//cities
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in['params']=array(array('param'=>'university_city_id','param_val'=>$cities));
					$universities=$this->im->get_universities($post,$param,$where_in,TRUE,TRUE);
				}else if(!empty($states) && empty($cities) && empty($courses) && empty($streams)){//states
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');

					$where_in=array('param'=>'university_state_id','param_val'=>$states);
					$universities=$this->im->get_universities($post,$param,$where_in);
				}else{//all
					$post=array('length'=>'8','start'=>'0');
					$param=array('university_country_id'=>$country_id,'university_is_top'=>'1','university_status'=>'1','is_verified_by_admin'=>'1');
					$universities=$this->im->get_universities($post,$param);
				}


				if(isset($universities) && !empty($universities)){
		    		foreach ($universities as $key => $value) {
		    			$_university_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
		    			$_university_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_university_logo) && !empty($_university_logo->media_disk_path_relative)){
		                    $university_logo=$_college_logo->media_disk_path_relative;
		                    $university_logo_name=$_college_logo->media_org_name;
		                }else{
		                    $university_logo=base_url().'uploads/app/default/no.jpg';
		                    $university_logo_name='';
		                }

		                if(!empty($_university_banner) && !empty($_university_banner->media_disk_path_relative)){
		                    $university_banner=$_university_banner->media_disk_path_relative;
		                    $university_banner_name=$_university_banner->media_org_name;
		                }else{
		                    $university_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                    $university_banner_name='';
		                }

		                $is_featured='2';

		    			$university_data[]=array(
		    				'university_name'=>$value->university_name,
		    				'university_city'=>$value->city_name,
		    				'university_state'=>$value->state_name,
		    				'university_country'=>$value->country_name,
		    				'university_logo'=>$university_logo,
		    				'university_banner'=>$university_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url
		    			);
		    		}
		    	}else{
		    		$university_data=array();
		    	}


				$this->data['searched_universities']=$university_data;

				
				$return['html']=$this->theme->view('_pages/search/vw_search_universities_list_dyna',$this->data,true);
			}else if($search_type=='7'){
				if(!empty($states)){//state,city,course,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('country_id'=>$country_id,'state_id'=>$states,'is_top'=>'1','status'=>'1','is_verified'=>'1');

					//$where_in['params']=array(array('param'=>'college_state_id','param_val'=>$states));
				}

				if(!empty($cities)){//state,city,course,stream
					$post=array('length'=>'8','start'=>'0');
					$param=array('country_id'=>$country_id,'city_id'=>$cities,'is_top'=>'1','status'=>'1','is_verified'=>'1');

					//$where_in['params']=array(array('param'=>'college_state_id','param_val'=>$states));			
				}


				$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

				//print_obj($colleges);die;

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {

						$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
		    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
		                    $college_logo=$_college_logo->media_disk_path_relative;
		                }else{
		                    $college_logo=base_url().'uploads/app/default/no.jpg';
		                }

		                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
		                    $college_banner=$_college_banner->media_disk_path_relative;
		                }else{
		                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                }


						$is_featured=$value->college_is_featured;

		    			$filtered_data[]=array(
		    				'college_id'=>encode_data($value->college_id),
		    				'college_name'=>$value->college_name,
		    				'college_city'=>$value->city_name,
		    				'college_state'=>$value->state_name,
		    				'college_country_id'=>encode_data($value->college_country_id),
		    				'college_country'=>$value->country_name,
		    				'college_logo'=>$college_logo,
		    				'college_banner'=>$college_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url,
		    				'college_country_phone_code'=>$country_data->country_phone_code,
		    				'institute_type'=>encode_data(7),
		    			);
					}
				}

				$this->data['filtered_data']=$filtered_data;

				$return['html']=$this->theme->view('_pages/search/vw_filter_result_dyna',$this->data,true);
			}


				

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);

		}else{
			redirect(base_url());
		}
	}

	//Search Universities


	//Info
	public function indexAccountInfoSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if(!empty($this->data['userdata'])){
				$userdata=$this->data['userdata'];

				//print_obj($userdata);die;

				$user_id=$userdata->user_id;
				$this->data['page_title']=(!isset($userdata->user_meta_title))?$userdata->user_fullname:$userdata->user_meta_title;
				$institue_types=$this->im->get_institute_types(array('inst_data_type'=>$this->data['userdata']->user_role),FALSE);
				if(!empty($institue_types)){
					foreach ($institue_types as $key => $value) {
						$selcted=(!empty($this->data['userdata']->user_type) && ($this->data['userdata']->user_type==$value->inst_type))?'selected':'';
						$_institue_types[]=array(
							'inst_type'=>encode_data($value->inst_type),
							'inst_type_name'=>$value->inst_type_name,
							'selected'=>$selcted
						);
					}
				}else{
					$_institue_types=array();
				}

				$this->data['institue_types']=$_institue_types;

				$affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$this->data['userdata']->user_country),FALSE);
				if(!empty($affiliation_types)){
					foreach ($affiliation_types as $key => $value) {
						$selcted=(!empty($this->data['userdata']->user_affiliation_type) && in_array($value->statutory_body_id, char_separated_to_array($this->data['userdata']->user_affiliation_type)))?'checked':'';
						$_affiliation_types[]=array(
							'statutory_body_id'=>encode_data($value->statutory_body_id),
							'statutory_body_abbr'=>$value->statutory_body_abbr,
							'statutory_body_name'=>$value->statutory_body_name,
							'selected'=>$selcted
						);
					}
				}else{
					$_affiliation_types=array();
				}

				$this->data['affiliation_types']=$_affiliation_types;

				$ranking_types=$this->im->get_ranking_types(null,FALSE);
				if(!empty($ranking_types)){
					foreach ($ranking_types as $key => $value) {
						$_ranking_types[]=array(
							'rank_id'=>encode_data($value->rank_id),
							'rank_body'=>$value->rank_body,
							'rank_value'=>$value->rank_value
						);
					}
				}else{
					$_ranking_types=array();
				}

				$this->data['ranking_types']=$_ranking_types;

				$this->data['years_5_back']=date('Y')-5;
				$this->data['current_year']=date('Y');

				$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));



		        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
		            $this->data['user_logo']=$user_logo->media_disk_path_relative;
		            $this->data['user_logo_name']=$user_logo->media_org_name;
		        }else{
		            $this->data['user_logo']=base_url().'uploads/app/default/no.jpg';
		            $this->data['user_logo_name']='';
		        }


		        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

		        //print_obj($user_banner);die;

		        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
		            $this->data['user_banner']=$user_banner->media_disk_path_relative;
		            $this->data['user_banner_name']=$user_banner->media_org_name;
		        }else{
		            $this->data['user_banner']=base_url().'uploads/app/default/pageBnr.jpg';
		            $this->data['user_banner_name']='';
		        }

		        // print_obj($this->data['userdata']);die;


		        if($this->data['userdata']->user_role=='3'){
		        	$view='account/university/vw_account_university_info_settings';
		        }else if($this->data['userdata']->user_role=='4'){
		        	$universities=$this->im->get_university_profile_data(array('university_status'=>'1','university_country_id'=>$this->data['userdata']->user_country),FALSE);

		        	if(!empty($universities)){
		        		foreach ($universities as $key => $value) {
		        			$selcted=(!empty($this->data['userdata']->college_university_id) && ($value->university_user_id==$this->data['userdata']->college_university_id))?'selected':'';
		        			$_universities[]=array(
		        				'university_id'=>encode_data($value->university_user_id),
		        				'university_name'=>$value->university_name,
		        				'selected'=>$selcted
		        			);
		        		}		        		
		        	}else{
		        		$_universities=array();
		        	}

		        	//print_obj($this->data);die;

					$this->data['universities']=$_universities;

		        	$view='account/college/vw_account_college_info_settings';
		        }

				$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load($view, $this->data);
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}

	//


	public function indexAccountCollegeSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load('account/vw_account_university_colleges', $this->data);
		}else{
			redirect(base_url());
		}
	}

	//Courses
	public function indexAccountCoursesFeesSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if(!empty($this->data['userdata'])){
				$userdata=$this->data['userdata'];
				$this->data['page_title']=(!isset($userdata->user_meta_title))?$userdata->user_fullname:$userdata->user_meta_title;


				if($this->data['userdata']->user_role=='3'){
					$view='account/university/vw_account_university_course_settings';
				}else if($this->data['userdata']->user_role=='4'){
					$view='account/college/vw_account_college_course_settings';
				}

				$this->data['page_title']=$this->data['userdata']->user_fullname.' Courses & Fees';


				$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load($view, $this->data);

			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}

	public function indexAccountCoursesFeesSettingsAdd($user_course_id=NULL){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			$this->data['page_title']=$this->data['userdata']->user_fullname.' Courses & Fees';

			if(!empty($this->data['userdata'])){
				$userdata=$this->data['userdata'];
				$this->data['page_title']=(!isset($userdata->user_meta_title))?$userdata->user_fullname:$userdata->user_meta_title;

				if($user_course_id!=NULL || $user_course_id!=''){
					$user_course_id_decoded=decode_data($user_course_id);

					if($user_course_id_decoded!=null || $user_course_id_decoded!=''){
						$user_course_data=$this->im->get_course_data(array('user_course_id'=>$user_course_id_decoded,'user_id'=>$userdata->user_id));
						$user_course_data_costs=$this->im->get_course_fees_data(array('user_course_cost_pk'=>$user_course_id_decoded),FALSE);

						//print_obj($user_course_data);die;
					}
				}


				$courses=$this->strm->get_course(array('course_status'=>'1'),FALSE);
				if(!empty($courses)){
					foreach ($courses as $key => $value) {
						$course_name=($value->course_short_name!='')?$value->course_name.'('.$value->course_short_name.')':$value->course_name;
						$_courses[]=array(
							'course_id'=>encode_data($value->course_id),
							'course_name'=>$course_name,
							'course_short_name'=>$value->course_short_name,
							'course_type'=>$value->course_type,
							'course_passed_type'=>$value->course_passed_type,
							'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course==$value->course_id))?'selected':''
						);
					}
				}else{
					$_courses=array();
				}

				$currencies=$this->com->get_currency(array('currency_status'=>'1'),FALSE);
				if(!empty($currencies)){
					foreach ($currencies as $key => $value) {
						$currency_code=($value->currency_symbol_left!='')?$value->currency_symbol_left.'-'.$value->currency_code:$value->currency_code.'-'.$value->currency_symbol_right;
						$_currencies[]=array(
							'currency_id'=>encode_data($value->currency_id),
							'currency_code'=>$currency_code
						);
					}
				}else{
					$_currencies=array();
				}

				$course_duration_years=array('1','2','3','4','5','6');

				foreach ($course_duration_years as $key => $value) {
					$_course_duration_years[]=array(
						'course_duration_year'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_duration_year==$value))?'selected':''
					);
				}

				$course_duration_months=array('0','1','2','3','4','5','6');

				foreach ($course_duration_months as $key => $value) {
					$_course_duration_months[]=array(
						'course_duration_month'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_duration_month==$value))?'selected':''
					);
				}

				$course_types=array('Doctorate','Degree','Diploma','Certificate');

				foreach ($course_types as $key => $value) {
					$_course_types[]=array(
						'course_type'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_type==$value))?'selected':''
					);
				}

				$course_pass_types=array('Phd','Post Graduation','Graduation','Diploma','Certificate');

				foreach ($course_pass_types as $key => $value) {
					$_course_pass_types[]=array(
						'course_pass_type'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_pass_type==$value))?'selected':''
					);
				}

				$placement_types=array('On Campus','Off Campus');

				foreach ($placement_types as $key => $value) {
					$_placement_types[]=array(
						'placement_type'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_placement_type==$value))?'selected':''
					);
				}

				$duration_types=array('Full Time','Part Time');

				foreach ($duration_types as $key => $value) {
					$_duration_types[]=array(
						'duration_type'=>$value,
						'selected'=>(isset($user_course_data) && !empty($user_course_data) && ($user_course_data->user_course_duration_type==$value))?'selected':''
					);
				}


				$this->data['course_duration_years']=$_course_duration_years;
				$this->data['course_duration_months']=$_course_duration_months;
				$this->data['course_types']=$_course_types;
				$this->data['course_pass_types']=$_course_pass_types;
				$this->data['placement_types']=$_placement_types;
				$this->data['duration_types']=$_duration_types;

				$this->data['courses']=$_courses;
				$this->data['currencies']=$_currencies;

				$this->data['user_currency_symbol_side']=($this->data['userdata']->currency_symbol_left!='')?'1':'2';
				$this->data['user_currency']=($this->data['userdata']->currency_symbol_left!='')?$this->data['userdata']->currency_symbol_left:$this->data['userdata']->currency_symbol_right;

				$this->data['course_data_costs']=(isset($user_course_data_costs))?$user_course_data_costs:'';

				//print_obj($this->data['userdata']);die;

				if($this->data['userdata']->user_role=='3'){
					$view='account/vw_account_university_course_settings_add_edit';
				}else if($this->data['userdata']->user_role=='4'){
					$view='account/college/vw_account_college_course_settings_add_edit';
				}

				$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load($view, $this->data);


			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}

	public function onSearchUserCourses(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'course_name'
				);

				$param['column_search'] = array('course_name');
				$param['order'] = array('user_course_id' => 'DESC');
				$param['user_type']=$this->data['userdata']->user_role;
				$param['user_id']=decode_data(session_userdata('user_id'));
				$posts=$this->input->post();

				$list = $this->im->_get_users_courses($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $course){
					$no++;

					$row = array();

					$action='<div class="table-actions">
					<a href="'.base_url().'account/course/add/'.encode_data($course->user_course_id).'" class="btn btn-sm btn-primary"><i class="fa fa-pen"></i></a>
					<button type="button" class=" btn btn-sm btn-danger btn_del_ucourse" data-ucid="'.encode_data($course->user_course_id).'"><i class="fa fa-trash"></i></button>
					</div>';

					$total_cost=$this->im->get_user_course_grand_total(array('user_id'=>$param['user_id'],'user_course_id'=>$course->user_course_id),FALSE)[0]->total_cost;

					$course_cost=($this->data['userdata']->currency_symbol_left!='')?$this->data['userdata']->currency_symbol_left.number_to_currency($total_cost):number_to_currency($total_cost).$this->data['userdata']->currency_symbol_right;

					$course_ducration=($course->user_course_duration_month>0)?$course->user_course_duration_year.' year(s) '.$course->user_course_duration_month.' month(s)':$course->user_course_duration_year.' year(s)';
					
					$row[]	=	$no;
					$row[]	=	ucwords($course->course_name).'('.$course->course_short_name.')';
					$row[]	=	$course_ducration;
					$row[]	=	$course_cost;
					

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_users_courses($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_users_courses($posts,$param,TRUE),
					"data" => $data,
				);

				echo json_encode($output);

			}else{
				redirect(base_url());
			}	
		}else{
			redirect(base_url());
		}
	}
	//Courses


	//Gallery
	public function indexAccountGallerySettingsAdd(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			if($this->data['userdata']->user_role==3){
				$view='account/university/vw_account_university_gallery_add_edit';
			}else if($this->data['userdata']->user_role==4){
				$view='account/college/vw_account_college_gallery_add_edit';
			}


			$this->data['page_title']=$this->data['userdata']->user_fullname.' Gallery';

			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load($view, $this->data);
		}else{
			redirect(base_url());
		}
	}

	public function onSearchGallery(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('user_id'));

				$param['column_order'] = array(
					null,
					'media_org_name'
				);

				$param['column_search'] = array('media_org_name');
				$param['order'] = array('user_storage_id' => 'DESC');
				$param['user_file_type_id']=$user_id;
				$posts=$this->input->post();

				$list = $this->sm->_get_gallery_files($posts,$param,FALSE,FALSE);
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();

					// $user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user->user_id));

					$action='<button type="button" class=" btn btn-sm btn-danger btn_del_gallery_file" data-aid="'.encode_data($user->storage_id).'"><i class="fa fa-trash"></i></button>';
					
					$row[]	=	$no;
					$row[]	=	'<img src="'.$user->media_disk_path_relative.'" class="hover-shadow cursor" style="width:50px;height:50px;">';
					$row[]	=	ucwords($user->user_storage_type);

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_gallery_files($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_gallery_files($posts,$param,TRUE),
					"data" => $data,
				);

				echo json_encode($output);

			}else{
				redirect(base_url());
			}	
		}else{
			redirect(base_url());
		}
	}

	public function onDeleteGalleryFile(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_gallery_id=post_data('_gallery');
				$gallery_id=decode_data($_gallery_id);
				$user_id=decode_data(session_userdata('user_id'));

				//echo $gallery_id;die;

				$deleted=$this->sm->delete_user_file(array('user_file_storage_id'=>$gallery_id,'user_file_type_id'=>$user_id));

				if($deleted){
					$file=$this->sm->get_file(array('storage_id'=>$gallery_id));

					if(!empty($file) && is_file($file->media_disk_path)){
						@unlink($file->media_disk_path);
					}

					$this->sm->delete_file(array('storage_id'=>$gallery_id));

					$return['success']='File deleted successfully';
				}else{
					$return['error']='You can not delete the file.';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}
	//Gallery


	//Facullties
	public function indexAccountFacultiesSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){


			$this->data['page_title']=$this->data['userdata']->user_fullname.' Faculties';


			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->add_partial('partial_account_faculties_settings_modal',$this->data)->load('account/vw_account_university_faculty_settings', $this->data);
		}else{
			redirect(base_url());
		}
	}

	public function indexAccountFacultiesSettingsAdd($faculty_id=null){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			$user_id=$this->data['userdata']->user_id;

			if($faculty_id!=null){
				$fid=decode_url($faculty_id);

				$faculty_data=$this->im->get_faculty_data(array('faculty_id'=>$fid,'faculty_type'=>'1'));

				if(!empty($faculty_data)){
					$faculty_quaf=char_separated_to_array($faculty_data->faculty_qualifications);
					$faculty_subjects=char_separated_to_array($faculty_data->faculty_subjects);
				}
				$this->data['faculty_id']=$faculty_id;
				$this->data['faculty_data']=$faculty_data;
			}

			$qualifications=$this->im->get_qualifications(array('qualification_status'=>'1'),FALSE);

			if(!empty($qualifications)){
				foreach ($qualifications as $key => $value) {
					$_qualifications[]=array(
						'qualification_id'=>encode_url($value->qualification_id),
						'qualification_name'=>$value->qualification_name,
						'selected'=>(isset($faculty_quaf) && in_array($value->qualification_id, $faculty_quaf))?'checked':''
					);
				}
			}else{
				$_qualifications=array();
			}

			$this->data['qualifications']=$_qualifications;


			$subjects=$this->im->get_subjects(array('subject_status'=>'1'),FALSE);

			if(!empty($subjects)){
				foreach ($subjects as $key => $value) {
					$_subjects[]=array(
						'subject_id'=>encode_url($value->subject_id),
						'subject_name'=>$value->subject_name,
						'selected'=>(isset($faculty_quaf) && in_array($value->subject_id, $faculty_subjects))?'checked':''
					);
				}
			}else{
				$_subjects=array();
			}

			$this->data['subjects']=$_subjects;


			$designations=$this->im->get_designations(array('designation_status'=>'1'),FALSE);

			if(!empty($designations)){
				foreach ($designations as $key => $value) {
					$_designations[]=array(
						'designation_id'=>encode_url($value->designation_id),
						'designation_name'=>$value->designation_name,
						'selected'=>(isset($faculty_data) && ($value->designation_id==$faculty_data->faculty_designation))?'selected':''
					);
				}
			}else{
				$_designations=array();
			}

			$this->data['designations']=$_designations;

			$departments=$this->im->get_departments(array('department_type_id'=>$user_id),FALSE);

			if(!empty($departments)){
				foreach ($departments as $key => $value) {
					$_departments[]=array(
						'department_id'=>encode_url($value->department_id),
						'department_name'=>$value->department_name,
						'selected'=>(isset($faculty_data) && ($value->department_id==$faculty_data->faculty_departments))?'selected':''
					);
				}
			}else{
				$_departments=array();
			}

			$this->data['departments']=$_departments;

			$this->data['page_title']=$this->data['userdata']->user_fullname.' Faculties';

			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load('account/university/vw_account_university_faculty_settings_add_edit', $this->data);
		}else{
			redirect(base_url());
		}
	}

	public function onSearchfaculties(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'faculty_name'
				);

				$param['column_search'] = array('faculty_name');
				$param['order'] = array('faculty_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->im->_get_faculties($posts,$param,FALSE,FALSE);

				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();

					// $user_image=$this->sm->get_file(array('media_type'=>'user_image','media_type_data_id'=>$user->user_id));

					$action='<div class="table-actions">
					<a href="'.base_url().'account/faculties/add/'.encode_url($user->faculty_id).'" class="btn btn-sm btn-primary"><i class="fa fa-pen"></i></a>
					<button type="button" class=" btn btn-sm btn-danger btn_del_faculty" data-aid="'.encode_url($user->faculty_id).'"><i class="fa fa-trash"></i></button>
					</div>';
					
					$row[]	=	$no;
					$row[]	=	ucwords($user->faculty_name);
					$row[]	=	$user->faculty_email;
					$row[]	=	$user->facullty_contact_no;
					if($user->faculty_status==1){
						$row[]  =	'<span class="btn btn-sm btn-success">Active</span>';
					}else if($user->faculty_status==2){
						$row[]  =	'<span class="btn btn-sm btn-danger">Deactive</span>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->im->_get_faculties($posts,$param,TRUE),
					"recordsFiltered" => $this->im->_get_faculties($posts,$param,TRUE),
					"data" => $data,
				);

				echo json_encode($output);

			}else{
				redirect(base_url());
			}	
		}else{
			redirect(base_url());
		}
	}

	public function onDeletefaculties(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('user_id'));
				$_faculty=post_data('_faculty');

				$faculty=decode_url($_faculty);

				$get_faculty_data=$this->im->get_faculty_data(array('faculty_type'=>'1','faculty_type_id'=>$user_id,'faculty_id'=>$faculty));

				if(!empty($get_faculty_data)){
					$deleted=$this->im->delete_faculty_data(array('faculty_type'=>'1','faculty_type_id'=>$user_id,'faculty_id'=>$faculty));

						if($deleted){
							$return['success']='Data deleted';
						}else{
							$return['error']='Data can not be deleted';
						}
				}else{
					$return['error']='Data can not be deleted';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}
	//Faculties

	//Hostels
	public function indexAccountHostelSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			$user_id=decode_data(session_userdata('user_id'));

			$this->data['men_hostel_data']=$this->im->get_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'1'));

			$this->data['men_hostel_notes_data']=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));

			$this->data['women_hostel_data']=$this->im->get_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'2'));

			$this->data['women_hostel_notes_data']=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'2','hostel_data_type_id'=>$user_id));

			if($this->data['userdata']->user_role=='3'){
				$view='account/university/vw_account_university_hostel_settings';
			}else if($this->data['userdata']->user_role=='4'){
				$view='account/college/vw_account_college_hostel_settings';
			}

			$this->data['page_title']=$this->data['userdata']->user_fullname.' Hostels';


			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load('account/university/vw_account_university_hostel_settings', $this->data);
		}else{
			redirect(base_url());
		}
	}
	//Hostels


	//Scholarships
	public function indexAccountScholarshipsSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			$this->data['page_title']=$this->data['userdata']->user_fullname.' Scholarships';
			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load('account/university/vw_account_university_scholarships_settings', $this->data);
		}else{
			redirect(base_url());
		}
	}
	//Scholarships



	//Update University Data

	public function onUpdateUserData(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				//897468fabb7741f5d21150b7bc44f1f481eaec67

				// echo sha1('H1WbkK@S0kpJ');die;

				$user_id=decode_data(session_userdata('user_id'));

				$data_found=$this->um->get_user_data(array('user_id'=>$user_id));

				//$_user_type=post_data('user_type');

				// if(isset($_user_type) && $_user_type!=''){
				// 	$user_type=decode_data($_user_type);
				// }else{
					$user_type=$data_found->user_role;//decode_data(session_userdata('user_role'));
				//}

				

				$data_type=post_data('data_type');

				//echo $user_type;die;

				// $data_to_update=array(
				// 	'user_profile_pk_id'=>'',
				// 	'user_role'=>$user_type,
				// 	'created_by'=>$user_id,
				// 	'created_by_type'=>$user_type,
				// 	'updated_by'=>$user_id
				// );

				//print_obj($user_type);die;

				//$updated=$this->um->update_user_data($data_to_update,array('user_id'=>$user_id));

				if($user_type=='3'){				
					//if($updated){
						if($data_type=='general_settings'){
							$registration_name 					=	post_data('registration_name');
							$registration_email 				=	post_data('registration_email');
							$registration_phone_no 				=	post_data('registration_phone_no');
							$register_country 					=	decode_data(post_data('register_country'));
							$registration_state 				=	decode_data(post_data('registration_state'));
							$registration_district 				=	post_data('registration_district');
							$registration_city 					=	post_data('registration_city');
							$registration_pincode 				=	post_data('registration_pincode');
							$registration_address 				=	post_data('registration_address');

							$city=(!empty($registration_city))?$registration_city:0;

							//echo 'hi';die;

							$university_found=$this->im->get_university_data(array('university_user_id'=>$user_id));

							if(empty($university_found)){
								$general_data=array(
									'university_user_id'=>$user_id,
									'university_country_id'=>$register_country,
									'university_state_id'=>$registration_state,
									'university_city_id'=>decode_data($city),
									'university_name'=>$registration_name,
									'university_address'=>$registration_address,
									'university_zipcode'=>$registration_pincode,
									'university_email'=>$registration_email,
									'university_phone_no'=>$registration_phone_no,
									'university_status'=>'1',
									'created_by'=>$user_id
								);
								$user_pk_id=$this->im->add_universities_data($general_data);
							}else{
								$user_pk_id=$university_found->university_id;
								$general_data=array(
									'university_user_id'=>$user_id,
									'university_country_id'=>$register_country,
									'university_state_id'=>$registration_state,
									'university_city_id'=>decode_data($city),
									'university_name'=>$registration_name,
									'university_address'=>$registration_address,
									'university_zipcode'=>$registration_pincode,
									'university_email'=>$registration_email,
									'university_phone_no'=>$registration_phone_no,
									'university_status'=>'1',
									'updated_by'=>$user_id
								);
								$this->im->update_universities_data($general_data,array('university_user_id'=>$user_id));
							}							


							if($user_pk_id){
								$updated=$this->um->update_user_data(array('user_profile_pk_id'=>$user_pk_id),array('user_id'=>$user_id));			
							}

							$zipcode_data=array(
								'zip_code_country_id'=>$register_country,
								'zip_code_state_id'=>$registration_state,
								'zip_code'=>$registration_pincode
							);

							$zipcode_found=$this->com->get_country_zipcodes($zipcode_data);

							if(empty($zipcode_found)){
								$this->com->add_country_zipcodes_data($zipcode_data);
							}

							$session_data=array(
								'user_role'=>encode_data($user_type)
							);

							session_set_userdata($session_data);

							$return['success']='University basic information has been updated';
						}else if($data_type=='page_settings'){
							$data_type=post_data('data_type');
							$registration_title=post_data('registration_title');
							$registration_keywords=post_data('registration_keywords');
							$registration_short_description=post_data('registration_short_description');

							$page_data=array(
								'university_meta_title'=>$registration_title,
								'university_meta_keywords'=>$registration_keywords,
								'university_meta_description'=>$registration_short_description
							);

							$updated=$this->im->update_universities_data($page_data,array('university_user_id'=>$user_id));

							if($updated){
								$folder_name=$user_id.'-'.url_slug($registration_title);

								if(isset($_FILES['registration_logo']) && $_FILES['registration_logo']['name']!=''){

									$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$user_id));

									//print_obj($file_logo_found);die;

									if(!empty($file_logo_found)){
										if(is_file($file_logo_found->media_disk_path)){
											@unlink($file_logo_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
										}
									}

									$logo_data=array(
										'file_size'=>'1',
										'file_name'=>'registration_logo',
										'file_types'=>'png,jpg,jpeg',
										'file_parent_folder'=>'universities',
										'file_child_folder'=>$folder_name,
										'file_uploaded_by'=>$user_id
									);

									$file_id=$this->onUploadFiles($logo_data);

									if(!empty($file_id) && $file_id>0){

										$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

							            $user_logo_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$user_id,
							            	'user_storage_type'=>'user_logo'
							            );

							            $this->sm->store_user_file($user_logo_storage_data);
							        } 
								}


								if(isset($_FILES['registration_banner']) && $_FILES['registration_banner']['name']!=''){
									$file_banner_found=$this->sm->get_user_file(array('user_storage_type'=>'user_banner','user_file_type_id'=>$user_id));

									if(!empty($file_banner_found)){
										if(is_file($file_banner_found->media_disk_path)){
											@unlink($file_banner_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_banner_found->storage_id));
										}
									}

									$banner_data=array(
										'file_size'=>'1',
										'file_name'=>'registration_banner',
										'file_types'=>'png,jpg,jpeg',
										'file_parent_folder'=>'universities',
										'file_child_folder'=>$folder_name,
										'file_uploaded_by'=>$user_id
									);

									$file_id=$this->onUploadFiles($banner_data);

									if(!empty($file_id) && $file_id>0){
										$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));
							            $user_banner_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$user_id,
							            	'user_storage_type'=>'user_banner'
							            );

							            $this->sm->store_user_file($user_banner_storage_data);
							        }
								}

								$return['success']='Page settings updated successfully';

							}else{
								$return['error']='Page settings can not be updated at this momment';
							}
						}else if($data_type=='info_settings'){
							$registration_estd_year=post_data('registration_estd_year');
							$registration_type=post_data('registration_type');
							$registration_affiliation_type=$this->input->post('registration_affiliation_type');

							//print_obj($registration_type);

							if(!empty($registration_affiliation_type) && is_array($registration_affiliation_type)){
								foreach ($registration_affiliation_type as $key => $value) {
									$_aft[]=decode_data($value);
								}
							}

							//print_obj(decode_data($registration_type));die;

							$info_data=array(
								'university_estd_year'=>$registration_estd_year,
								'university_type'=>decode_data($registration_type),
								'university_affiliation_type'=>(isset($_aft))?char_separated($_aft):NULL,
								'updated_at'=>date('Y-m-d H:i:s')
							);

							//print_obj($info_data);die;

							$updated=$this->im->update_universities_data($info_data,array('university_user_id'=>$user_id));

							if($updated){
								$digits = 3;
								$prename=rand ( 10000 , 99999 )+$user_id;

								$folder_name=$user_id.'-'.url_slug($this->data['userdata']->user_fullname);

								if(isset($_FILES['registration_logo']) && $_FILES['registration_logo']['name']!=''){

									$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$user_id));

									//print_obj($file_logo_found);die;

									if(!empty($file_logo_found)){
										if(is_file($file_logo_found->media_disk_path)){
											@unlink($file_logo_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
										}
									}

									$logo_data=array(
										'file_size'=>'1',
										'file_name'=>'registration_logo',
										'file_types'=>'png,jpg,jpeg',
										'file_parent_folder'=>'universities',
										'file_child_folder'=>$folder_name,
										'file_uploaded_by'=>$user_id
									);

									//print_obj($logo_data);die;

									$file_id=$this->onUploadFiles($logo_data);

									if(!empty($file_id) && $file_id>0){

										$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

							            $user_logo_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$user_id,
							            	'user_storage_type'=>'user_logo'
							            );

							            $this->sm->store_user_file($user_logo_storage_data);
							        } 
								}


								if(isset($_FILES['registration_banner']) && $_FILES['registration_banner']['name']!=''){
									$file_banner_found=$this->sm->get_user_file(array('user_storage_type'=>'user_banner','user_file_type_id'=>$user_id));

									if(!empty($file_banner_found)){
										if(is_file($file_banner_found->media_disk_path)){
											@unlink($file_banner_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$file_banner_found->storage_id));
										}
									}

									$banner_data=array(
										'file_size'=>'15',
										'file_name'=>'registration_banner',
										'file_types'=>'png,jpg,jpeg',
										'file_parent_folder'=>'universities',
										'file_child_folder'=>$folder_name,
										'file_uploaded_by'=>$user_id
									);

									$file_id=$this->onUploadFiles($banner_data);

									if(!empty($file_id) && $file_id>0){
										$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));
							            $user_banner_storage_data=array(
							            	'user_file_storage_id'=>$file_id,
							            	'user_file_type_id'=>$user_id,
							            	'user_storage_type'=>'user_banner'
							            );

							            $this->sm->store_user_file($user_banner_storage_data);
							        }
								}

								$return['success']='Info settings updated successfully';

							}else{
								$return['error']='Info settings can not be updated at this momment';
							}
						}else if($data_type=='faculty_settings'){

							$_faculty 						=	post_data('_faculty');
							$registration_faculty_name 		=	post_data('registration_faculty_name');
							$registration_faculty_email 	=	post_data('registration_faculty_email');
							$registration_faculty_phone 	=	post_data('registration_faculty_phone');
							$registration_faculty_exp 		=	post_data('registration_faculty_exp');
							$registration_designation 		=	post_data('registration_designation');
							$registration_department 		=	post_data('registration_department');
							$registration_quallifications 	=	$this->input->post('registration_quallifications');
							$registration_subjects  		=	$this->input->post('registration_subjects');

							if(!empty($registration_subjects)){
								foreach ($registration_subjects as $key => $value) {
									$_registration_subjects[]=decode_url($value);
								}

								$reg_subjects=char_separated($_registration_subjects);
							}else{
								$reg_subjects=null;
							}

							if(!empty($registration_quallifications)){
								foreach ($registration_quallifications as $key => $value) {
									$_registration_quallifications[]=decode_url($value);
								}

								$reg_qualifications=char_separated($_registration_quallifications);
							}else{
								$reg_qualifications=null;
							}
							

							$data=array(
								'faculty_type'=>'1',
								'faculty_type_id'=>$user_id,
								'faculty_name'=>$registration_faculty_name,
								'facullty_contact_no'=>$registration_faculty_phone,
								'faculty_email'=>$registration_faculty_email,
								'faculty_designation'=>decode_url($registration_designation),
								'faculty_departments'=>decode_url($registration_department),
								'faculty_academic_exp'=>$registration_faculty_exp,
								'faculty_subjects'=>$reg_subjects,
								'faculty_qualifications'=>$reg_qualifications
							);

							if(empty($_faculty)){
								$get_faculty_data 				=	$this->im->get_faculty_data(array('faculty_type'=>'1','faculty_type_id'=>$user_id,'faculty_email'=>$registration_faculty_email));

								if(empty($get_faculty_data)){
									$added=$this->im->add_faculties_data($data);
									if($added){
										$return['success']='Faculty registered';
									}else{
										$return['error']='Data can not be registered';
									}										
								}else{
									$return['error']='Faculty already registered';
								}
							}else if(!empty($_faculty)){
								$faculty_id=decode_url($_faculty);
								$added=$this->im->update_faculties_data($data,array('faculty_id'=>$faculty_id,'faculty_type'=>'1','faculty_type_id'=>$user_id));
								if($added){
									$return['success']='Faculty data updated';
								}else{
									$return['error']='Data can not be updated now';
								}
							}								
						}else if($data_type=='course_settings'){
							$_course_id=post_data('_course');
							$course_fees=$this->input->post('registration_course_fees');
							$registration_course=post_data('registration_course');
							$registration_course_duration_years=post_data('registration_course_duration_years');
							$registration_course_duration_months=post_data('registration_course_duration_months');
							$registration_course_duration_type=post_data('registration_course_duration_type');
							$registration_course_type=post_data('registration_course_type');
							$registration_course_pass_type=post_data('registration_course_pass_type');
							$registration_course_placement_type=post_data('registration_course_placement_type');

							//print_obj($course_fees);die;

							if(empty($_course_id)){
								$course_id=decode_data($_course_id);
								$course_found=$this->im->get_course_data(array('user_id'=>$user_id,'user_type'=>$user_type,'user_course'=>$course_id));
							}else{

								$course_id=decode_data($registration_course);
								$course_found=$this->im->get_course_data(array('user_id'=>$user_id,'user_type'=>$user_type,'user_course'=>$course_id));

								if(empty($course_found)){
									$course_data=array(
										'user_id'=>$user_id,
										'user_type'=>$user_type,
										'user_course'=>$course_id,
										'user_course_duration_year'=>$registration_course_duration_years,
										'user_course_duration_month'=>$registration_course_duration_months,
										'user_course_duration_type'=>$registration_course_duration_type,
										'user_course_type'=>$registration_course_type,
										'user_course_pass_type'=>$registration_course_pass_type,
										'user_course_placement_type'=>$registration_course_placement_type
									);

									$inserted=$this->im->add_course_data($course_data);

									if($inserted){

										if(!empty($course_fees)){
											foreach ($course_fees as $key => $value) {

												$user_course_tution_fee_sem_1=clean_data($value['course_tution_fee_sem_1']);
												$user_course_tution_fee_sem_2=clean_data($value['course_tution_fee_sem_2']);
												$user_course_admisssion_fee_sem_1=clean_data($value['course_admisssion_fee_sem_1']);
												$user_course_admisssion_fee_sem_2=clean_data($value['course_admisssion_fee_sem_2']);
												$user_course_reg_fee_sem_1=clean_data($value['course_reg_fee_sem_1']);
												$user_course_reg_fee_sem_2=clean_data($value['course_reg_fee_sem_2']);
												$user_course_exam_fee_sem_1=clean_data($value['course_exam_fee_sem_1']);
												$user_course_exam_fee_sem_2=clean_data($value['course_exam_fee_sem_2']);
												$user_course_other_fee_sem_1=clean_data($value['course_other_fee_sem_1']);
												$user_course_other_fee_sem_2=clean_data($value['course_other_fee_sem_2']);

												// if(is_numeric($user_course_tution_fee_sem_1) && is_numeric($user_course_tution_fee_sem_2) && is_numeric($user_course_tution_fee_sem_3)){

												// }

												$total_fee=$user_course_tution_fee_sem_1+$user_course_tution_fee_sem_2+$user_course_admisssion_fee_sem_1+$user_course_admisssion_fee_sem_2+$user_course_reg_fee_sem_1+$user_course_reg_fee_sem_2+$user_course_exam_fee_sem_1+$user_course_exam_fee_sem_2+$user_course_other_fee_sem_1+$user_course_other_fee_sem_2;

												$course_fees_data[]=array(
													'user_course_cost_pk'=>$inserted,
													'user_id'=>$user_id,
													'user_course_id'=>$inserted,
													'user_course_year'=>$value['course_year'],
													'user_course_tution_fee_sem_1'=>$user_course_tution_fee_sem_1,
													'user_course_tution_fee_sem_2'=>$user_course_tution_fee_sem_2,
													'user_course_admisssion_fee_sem_1'=>$user_course_admisssion_fee_sem_1,
													'user_course_admisssion_fee_sem_2'=>$user_course_admisssion_fee_sem_2,
													'user_course_reg_fee_sem_1'=>$user_course_reg_fee_sem_1,
													'user_course_reg_fee_sem_2'=>$user_course_reg_fee_sem_2,
													'user_course_exam_fee_sem_1'=>$user_course_exam_fee_sem_1,
													'user_course_exam_fee_sem_2'=>$user_course_exam_fee_sem_2,
													'user_course_other_fee_sem_1'=>$user_course_other_fee_sem_1,
													'user_course_other_fee_sem_2'=>$user_course_other_fee_sem_2,
													'user_course_total_fee'=>$total_fee
												);
											}
											if(isset($course_fees_data) && !empty($course_fees_data)){
												$this->im->add_course_fees_data($course_fees_data,TRUE);
											}
										}

										$return['success']='Course data added';
									}else{
										$return['error']='Course data not added';	
									}
								}else{
									$return['error']='Course Data already added';
								}
							}		
						}else if($data_type=='gallery_settings'){
							$gallery_category=post_data('gallery_category');

							if($gallery_category==5){

							}else{
								if(isset($_FILES['gallery_file']) && $_FILES['gallery_file']['name']!=''){
									
									$folder_name=$user_id.'-'.url_slug($this->data['userdata']->user_fullname);
									$gallery_file_found=$this->sm->get_user_file(array('user_storage_type'=>'gallery_file','user_file_type_id'=>$user_id));

									if(!empty($gallery_file_found)){
										if(is_file($gallery_file_found->media_disk_path)){
											@unlink($gallery_file_found->media_disk_path);
											$this->sm->delete_file(array('storage_id'=>$gallery_file_found->storage_id));
										}
									}

									$gallery_file_data=array(
										'file_size'=>'1',
										'file_name'=>'gallery_file',
										'file_types'=>'png,jpg,jpeg',
										'file_parent_folder'=>'universities',
										'file_child_folder'=>$folder_name,
										'file_uploaded_by'=>$user_id
									);

									$file_id=$this->onUploadFiles($gallery_file_data);

									if(!empty($file_id)){
										$gallery_data=array(
											'user_file_type_id'=>$user_id,
											'user_file_storage_id'=>$file_id,
											'user_storage_type'=>$gallery_category,
											'user_storage_type_2'=>'gallery'
										);
										$this->sm->store_user_file($gallery_data);
										$return['success']='File uploaded successfully';
							        }else{
							        	$return['error']='Please select file';
							        }
								}else{
									$return['error']='Please select file';
								}
							}
						}else if($data_type=='hostel_settings_men'){

							$hostel_data=$this->input->post('hostel');
							$hostel_extra_notes=post_data('hostel_extra_notes');

							//print_obj($hostel_data);die;

							if(!empty($hostel_extra_notes)){
								$hostel_extra_notes_data=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));

								if(!empty($hostel_extra_notes_data)){
									$this->im->delete_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));
								}

								$hostel_notes_data=array(
									'hostel_data_type'=>'1',
									'hostel_data_type_id'=>$user_id,
									'hostel_type'=>'1',
									'hostel_notes'=>$hostel_extra_notes
								);

								$this->im->add_hostels_notes_data($hostel_notes_data);
							}

							if(!empty($hostel_data)){
								$this->im->delete_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'1'));
								foreach ($hostel_data as $key => $value) {
									$data_to_insert[]=array(
										'hostel_data_type'=>'1',
										'hostel_data_type_id'=>$user_id,
										'hostel_rooms'=>$value['rooms'],
										'hostel_rooms_type'=>'1',
										'hostel_non_ac_charge'=>$value['rooms_non_ac_charges'],
										'hostel_ac_charge'=>$value['rooms_ac_charges']
									);
								}

								//print_obj($data_to_insert);die;

								if(!empty($data_to_insert)){
									$inserted=$this->im->add_hostels_data($data_to_insert,TRUE);
									if($inserted){
										$return['success']='Hostel data added';
									}else{
										$return['error']='Hostel data not added';
									}
								}else{
									$return['error']='Please enter some value';
								}
							}else{
								$return['error']='';
							}
						}else if($data_type=='hostel_settings_women'){
							$hostel_data=$this->input->post('hostel');
							$hostel_extra_notes=post_data('hostel_extra_notes_women');

							if(!empty($hostel_extra_notes)){
								$hostel_extra_notes_data=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));

								if(!empty($hostel_extra_notes_data)){
									$this->im->delete_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));
								}

								$hostel_notes_data=array(
									'hostel_data_type'=>'1',
									'hostel_data_type_id'=>$user_id,
									'hostel_type'=>'2',
									'hostel_notes'=>$hostel_extra_notes
								);

								$this->im->add_hostels_notes_data($hostel_notes_data);
							}

							if(!empty($hostel_data)){
								$this->im->delete_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'2'));
								foreach ($hostel_data as $key => $value) {
									$data_to_insert[]=array(
										'hostel_data_type'=>'1',
										'hostel_data_type_id'=>$user_id,
										'hostel_rooms'=>$value['rooms'],
										'hostel_rooms_type'=>'2',
										'hostel_non_ac_charge'=>$value['rooms_non_ac_charges'],
										'hostel_ac_charge'=>$value['rooms_ac_charges']
									);
								}

								if(!empty($data_to_insert)){
									$inserted=$this->im->add_hostels_data($data_to_insert,TRUE);
									if($inserted){
										$return['success']='Hostel data added';
									}else{
										$return['error']='Hostel data not added';
									}
								}else{
									$return['error']='Please enter some value';
								}
							}else{
								$return['error']='';
							}
						}else if($data_type=='scholarships_settings'){

							$scholarship_data=post_data('scholarship_data');

							$sfound=$this->im->get_scholarship_data(array('scholarship_data_type_id'=>$user_id,'scholarship_data_type'=>'1'));

							if(!empty($sfound)){
								$this->im->delete_scholarship_data(array('scholarship_data_type_id'=>$user_id,'scholarship_data_type'=>'1'));
							}

							$data_to_insert=array(
								'scholarship_data_type_id'=>$user_id,
								'scholarship_data_type'=>'1',
								'scholarship_data'=>$scholarship_data
							);

							$inserted=$this->im->add_scholarship_data($data_to_insert);

							if($inserted){
								$return['success']='Scholarship data added';
							}else{
								$return['error']='Scholarship data is not added';
							}
						}	
					// }else{
					// 	$return['error']='Data can not be updated now';
					// }
				}else if($user_type=='4'){

					if($data_type=='info_settings'){
						$registration_university_affiliation=post_data('registration_university_affiliation');
						$registration_estd_year=post_data('registration_estd_year');
						$registration_type=post_data('registration_type');
						$registration_affiliation_type=$this->input->post('registration_affiliation_type');

						//print_obj($registration_type);

						if(!empty($registration_affiliation_type) && is_array($registration_affiliation_type)){
							foreach ($registration_affiliation_type as $key => $value) {
								$_aft[]=decode_data($value);
							}
						}

						//print_obj(decode_data($registration_type));die;

						$info_data=array(
							'college_university_id'=>decode_data($registration_university_affiliation),
							'college_estd_year'=>$registration_estd_year,
							'college_type'=>decode_data($registration_type),
							'college_affiliation_type'=>(isset($_aft))?char_separated($_aft):NULL,
							'updated_at'=>date('Y-m-d H:i:s'),
							'updated_by'=>$user_id
						);

						//print_obj($info_data);

						$updated=$this->im->update_college_data($info_data,array('college_user_id'=>$user_id),FALSE,FALSE);

						//print_obj($updated);die;

						if($updated){
							$digits = 3;
							$prename=rand ( 10000 , 99999 )+$user_id;

							$folder_name=$user_id.'-'.url_slug($this->data['userdata']->user_fullname);

							if(isset($_FILES['registration_logo']) && $_FILES['registration_logo']['name']!=''){

								$file_logo_found=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$user_id));

								//print_obj($file_logo_found);die;

								if(!empty($file_logo_found)){
									if(is_file($file_logo_found->media_disk_path)){
										@unlink($file_logo_found->media_disk_path);
										$this->sm->delete_file(array('storage_id'=>$file_logo_found->storage_id));
									}
								}

								$logo_data=array(
									'file_size'=>'1',
									'file_name'=>'registration_logo',
									'file_types'=>'png,jpg,jpeg',
									'file_parent_folder'=>'universities',
									'file_child_folder'=>$folder_name,
									'file_uploaded_by'=>$user_id
								);

								//print_obj($logo_data);die;

								$file_id=$this->onUploadFiles($logo_data);

								if(!empty($file_id) && $file_id>0){

									$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

						            $user_logo_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>$user_id,
						            	'user_storage_type'=>'user_logo'
						            );

						            $this->sm->store_user_file($user_logo_storage_data);
						        } 
							}


							if(isset($_FILES['registration_banner']) && $_FILES['registration_banner']['name']!=''){
								$file_banner_found=$this->sm->get_user_file(array('user_storage_type'=>'user_banner','user_file_type_id'=>$user_id));

								if(!empty($file_banner_found)){
									if(is_file($file_banner_found->media_disk_path)){
										@unlink($file_banner_found->media_disk_path);
										$this->sm->delete_file(array('storage_id'=>$file_banner_found->storage_id));
									}
								}

								$banner_data=array(
									'file_size'=>'15',
									'file_name'=>'registration_banner',
									'file_types'=>'png,jpg,jpeg',
									'file_parent_folder'=>'universities',
									'file_child_folder'=>$folder_name,
									'file_uploaded_by'=>$user_id
								);

								$file_id=$this->onUploadFiles($banner_data);

								if(!empty($file_id) && $file_id>0){
									$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));
						            $user_banner_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>$user_id,
						            	'user_storage_type'=>'user_banner'
						            );

						            $this->sm->store_user_file($user_banner_storage_data);
						        }
							}

							$return['success']='Info settings updated successfully';

						}else{
							$return['error']='Info settings can not be updated at this momment';
						}
					}else if($data_type=='course_settings'){
						$_course_id=post_data('_course');
						$course_fees=$this->input->post('registration_course_fees');
						$registration_course=post_data('registration_course');
						$registration_course_duration_years=post_data('registration_course_duration_years');
						$registration_course_duration_months=post_data('registration_course_duration_months');
						$registration_course_duration_type=post_data('registration_course_duration_type');
						$registration_course_type=post_data('registration_course_type');
						$registration_course_pass_type=post_data('registration_course_pass_type');
						$registration_course_placement_type=post_data('registration_course_placement_type');

						//print_obj($course_fees);die;

						if(empty($_course_id)){
							$course_id=decode_data($_course_id);
							$course_found=$this->im->get_course_data(array('user_id'=>$user_id,'user_type'=>$user_type,'user_course'=>$course_id));
						}else{

							$course_id=decode_data($registration_course);
							$course_found=$this->im->get_course_data(array('user_id'=>$user_id,'user_type'=>$user_type,'user_course'=>$course_id));

							if(empty($course_found)){
								$course_data=array(
									'user_id'=>$user_id,
									'user_type'=>$user_type,
									'user_course'=>$course_id,
									'user_course_duration_year'=>$registration_course_duration_years,
									'user_course_duration_month'=>$registration_course_duration_months,
									'user_course_duration_type'=>$registration_course_duration_type,
									'user_course_type'=>$registration_course_type,
									'user_course_pass_type'=>$registration_course_pass_type,
									'user_course_placement_type'=>$registration_course_placement_type
								);

								$inserted=$this->im->add_course_data($course_data);

								if($inserted){

									if(!empty($course_fees)){
										foreach ($course_fees as $key => $value) {

											$user_course_tution_fee_sem_1=clean_data($value['course_tution_fee_sem_1']);
											$user_course_tution_fee_sem_2=clean_data($value['course_tution_fee_sem_2']);
											$user_course_admisssion_fee_sem_1=clean_data($value['course_admisssion_fee_sem_1']);
											$user_course_admisssion_fee_sem_2=clean_data($value['course_admisssion_fee_sem_2']);
											$user_course_reg_fee_sem_1=clean_data($value['course_reg_fee_sem_1']);
											$user_course_reg_fee_sem_2=clean_data($value['course_reg_fee_sem_2']);
											$user_course_exam_fee_sem_1=clean_data($value['course_exam_fee_sem_1']);
											$user_course_exam_fee_sem_2=clean_data($value['course_exam_fee_sem_2']);
											$user_course_other_fee_sem_1=clean_data($value['course_other_fee_sem_1']);
											$user_course_other_fee_sem_2=clean_data($value['course_other_fee_sem_2']);

											// if(is_numeric($user_course_tution_fee_sem_1) && is_numeric($user_course_tution_fee_sem_2) && is_numeric($user_course_tution_fee_sem_3)){

											// }

											$total_fee=$user_course_tution_fee_sem_1+$user_course_tution_fee_sem_2+$user_course_admisssion_fee_sem_1+$user_course_admisssion_fee_sem_2+$user_course_reg_fee_sem_1+$user_course_reg_fee_sem_2+$user_course_exam_fee_sem_1+$user_course_exam_fee_sem_2+$user_course_other_fee_sem_1+$user_course_other_fee_sem_2;

											$course_fees_data[]=array(
												'user_course_cost_pk'=>$inserted,
												'user_id'=>$user_id,
												'user_course_id'=>$inserted,
												'user_course_year'=>$value['course_year'],
												'user_course_tution_fee_sem_1'=>$user_course_tution_fee_sem_1,
												'user_course_tution_fee_sem_2'=>$user_course_tution_fee_sem_2,
												'user_course_admisssion_fee_sem_1'=>$user_course_admisssion_fee_sem_1,
												'user_course_admisssion_fee_sem_2'=>$user_course_admisssion_fee_sem_2,
												'user_course_reg_fee_sem_1'=>$user_course_reg_fee_sem_1,
												'user_course_reg_fee_sem_2'=>$user_course_reg_fee_sem_2,
												'user_course_exam_fee_sem_1'=>$user_course_exam_fee_sem_1,
												'user_course_exam_fee_sem_2'=>$user_course_exam_fee_sem_2,
												'user_course_other_fee_sem_1'=>$user_course_other_fee_sem_1,
												'user_course_other_fee_sem_2'=>$user_course_other_fee_sem_2,
												'user_course_total_fee'=>$total_fee
											);
										}
										if(isset($course_fees_data) && !empty($course_fees_data)){
											$this->im->add_course_fees_data($course_fees_data,TRUE);
										}
									}

									$return['success']='Course data added';
								}else{
									$return['error']='Course data not added';	
								}
							}else{
								$return['error']='Course Data already added';
							}
						}		
					}
					
				}

				// else if($user_type=='8'){
					
				// }else{
				// 	if($updated){
				// 		$return['success']='General information has been updated';
				// 	}else{
				// 		$return['error']='General information has not been updated';
				// 	}
				// }

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect(base_url());
			}
		}else{
			rerdirect(base_url());
		}
	}




	//University profile Page

	public function indexUniversityProfile(){

		$segment_3=$this->uri->segment(3,0);

		$university_data=$this->im->get_university_profile_data(array('access_url_slug'=>$segment_3));

		if(!empty($university_data)){

			$this->data['page_title']=$university_data->university_name;

			$banner=$this->sm->get_user_file(array('user_file_type_id'=>$university_data->university_user_id,'user_file_type'=>'3','user_storage_type'=>'user_banner'));
		   	$logo=$this->sm->get_user_file(array('user_file_type_id'=>$university_data->university_user_id,'user_file_type'=>'3','user_storage_type'=>'user_logo'));



			if(!empty($logo) && !empty($logo->media_disk_path_relative)){
                $university_logo=$logo->media_disk_path_relative;
                $university_logo_name=$logo->media_org_name;
            }else{
                $university_logo=base_url().'uploads/app/default/no.jpg';
                $university_logo_name='';
            }

            if(!empty($banner) && !empty($banner->media_disk_path_relative)){
                $university_banner=$banner->media_disk_path_relative;
                $university_banner_name=$banner->media_org_name;
            }else{
                $university_banner=base_url().'uploads/app/default/pageBnr.jpg';
                $university_banner_name='';
            }

			$this->data['university_data']=array(
				'university_id'=>encode_data($university_data->university_user_id),
				'university_name'=>$university_data->university_name,
				'university_email'=>$university_data->university_email,
				'university_logo'=>$university_logo,
		    	'university_banner'=>$university_banner,		
			);

			print_obj($this->data['university_data']);die;

			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header_public',$this->data)->load('account/university/vw_university_profile_data', $this->data);
		}else{
			show_404();
		}

			
	}

	//university profile Page


}