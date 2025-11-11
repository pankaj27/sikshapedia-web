<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Datasearch extends BaseFrontController
{
	public function onSearch(){

		//$searched_param=post_data('_searched_param');

		$searched_param=$this->input->get('_searched_param');

		$searched_data=array();

		//$param=array('search_data_name'=>$searched_param);

		//$or_param=array(array('search_data_type'=>$searched_param,'search_data_country'=>$searched_param,'search_data_state_name'=>$searched_param,'search_data_city_name'=>$searched_param,'search_data_course_name'=>$searched_param,'search_data_course_short_name'=>$searched_param,'search_data_stream_name'=>$searched_param));

		//$or_param=array(array('search_data_course_name'=>$searched_param,'search_data_course_short_name'=>$searched_param,'search_data_stream_name'=>$searched_param));

		//$or_param=array(array('search_data_course_name'=>$searched_param));

		//$data_searched=$this->sm->get_system_search_data($param,null,'search_data_id','ASC','100','0',FALSE);

		//$data_searched=$this->sm->_get_system_search_data($searched_param,'NATURAL LANGUAGE');

		$data_searched=$this->sm->_get_system_search_data($searched_param,NULL,NULL,'NATURAL LANGUAGE',null,null,'search_data_id','ASC',FALSE);

		//print_obj($data_searched);die;

		if(!empty($data_searched)){
			foreach ($data_searched as $key => $value) {
				if($value->search_data_type=='COLLEGE_NAME'){
					$search_data_type='College';
					$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$value->search_data_type_id));
					$searched_access_url=$college_data->access_url;
				}else if($value->search_data_type=='UNIVERSITY_NAME'){
					$search_data_type='University';
					$searched_access_url='';
				}else if($value->search_data_type=='EXAM_NAME'){
					$search_data_type='Exam';
					$searched_access_url='';
				}

				$_searched_data_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->search_data_type_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

				//print_obj($_searched_data_logo);

				if(!empty($_searched_data_logo) && !empty($_searched_data_logo->media_disk_path_relative)){
                    $searched_data_logo=$_searched_data_logo->media_disk_path_relative.'?tr=h-50,w-50,c-force';
                }else{
                    $searched_data_logo=base_url().'uploads/app/default/w2a.png?tr=h-50,w-50,c-force';
                }


                $slug='';

				$searched_data[]=array(
					'serach_data_name'=>strtoupper($value->search_data_name),
					'search_data_type'=>$search_data_type,
					'searched_data_logo'=>$searched_data_logo,
					'searched_access_url'=>$searched_access_url
				);
			}
		}


		//$this->data['searched_data']=$searched_data;


		//$return['html']=$this->theme->view('_pages/search/vw_search_result_dyna',$this->data,true);

		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($searched_data);
	}


	public function onSearchInstitutes(){
		$searched_param=$this->input->get('_searched_param');

		//$param="(search_data_type='COLLEGE_NAME' OR search_data_type='UNIVERSITY_NAME')";
		//$param_or=array('search_data_type'=>'COLLEGE_NAME','search_data_type'=>'UNIVERSITY_NAME');

		$param="(search_data_type='COLLEGE_NAME')";

		$searched_data=array();

		$data_searched=$this->sm->_get_system_search_data($searched_param,$param,NULL,'NATURAL LANGUAGE',10,null,'search_data_id','ASC',FALSE);

		//print_obj($data_searched);die;

		//$data_searched=$this->sm->__get_system_search_data(array('search_data_name'=>$searched_param),FALSE,null,'DESC',TRUE);

		//$data_searched=$this->sm->get__colleges($searched_param);

		// 		$sql="SELECT `search_data_id`, `search_data_type_id`, `search_data_type`, `search_data_name`
		// FROM `way2_system_data_search`
		// WHERE MATCH(search_data_name,search_data_course_name) AGAINST('".$searched_param."' IN NATURAL LANGUAGE MODE)
		// AND (`search_data_type` = 'COLLEGE_NAME' OR `search_data_type` = 'UNIVERSITY_NAME')
		// ORDER BY `search_data_id` ASC";

		// $qry=$this->db->query($sql);
		// $result=$qry->result();

		//print_obj($data_searched);die;

		if(!empty($data_searched)){
			foreach($data_searched as $key=>$value){

				

				$get_course_data=$this->um->get_total_user_courses(array('user_type'=>4,'user_id'=>$value->search_data_type_id));

				if($get_course_data>0){
					if($value->search_data_short_name!=null){
						if($value->search_data_state_name!=null){
							$formatted_name=$value->search_data_name.' - ['.$value->search_data_short_name.'],'.$value->search_data_state_name;
						}else{
							$formatted_name=$value->search_data_name.' - ['.$value->search_data_short_name.']';
						}					
					}else{
						if($value->search_data_state_name!=null){
							$formatted_name=$value->search_data_name.','.$value->search_data_state_name;
						}else{
							$formatted_name=$value->search_data_name;
						}					
					}

					$searched_data[]=array(
						'inst_name'=>$formatted_name,
						'inst_review_link'=>base_url().'reviews/write/'.encode_data($value->search_data_type_id).'/'.encode_data($value->search_data_type).'/'.encode_data($value->search_data_name)
					);
				}

				
			}
		}

		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($searched_data);

	}


	public function onFilter(){
		// $segment_1=$this->uri->segment(1,0);//country
		// $segment_2=$this->uri->segment(2,0);//static segment "colleges"
		// $segment_3=$this->uri->segment(3,0);//state or course or stream
		// $segment_4=$this->uri->segment(4,0);//city or course
		// $segment_5=$this->uri->segment(5,0);//stream or course
		// $segment_6=$this->uri->segment(6,0);//course


		$length=post_data('_l');
		$start=post_data('_s');

		$country=post_data('_c');
		$state=post_data('_st');
		$city=post_data('_ct');
		$stream=post_data('_strm');
		$course=post_data('_cu');

		$program_type=post_data('_ptype');
		$college_type=post_data('_ctype');
		$exams=post_data('_exam');
		$course_type=post_data('_curstype');
		$affiliation=post_data('_aff');
		$course_duration=post_data('_cduration');
		$ageny=post_data('_agn');
		$approval=post_data('_appr');
		$college_cat=post_data('_c_cate');

		$dpr=$this->input->get('dpr');

		if (isset($dpr) && $dpr === 'reviews' && $total_reviews <= 0){
			$length=12;
		}

		$post['length']=$length;
		$post['start']=$start;
		//echo $stream;

		//$page=$start;

        //$pages  = ceil($total/post_data('length'));

        //$start = ($page-1)*$length;
        //if($start < 0) $start = 0;

        //$param['length']=$length;
        //$param['start']=$start;

        //echo $course;


		$country_id=decode_data($country);
		if(!empty($state)){
			$state_id=decode_data($state);			
		}

		//echo $state_id;die;
		
		if(!empty($city)){
			$city_id=decode_data($city);
		}

		if(!empty($stream)){
			$stream_id=decode_data($stream);			
		}

		//echo $state_id;die;

		if(!empty($course)){
			$course_id=decode_data($course);			
		}

		if(!empty($program_type)){
			$program_type_id=decode_data($program_type);
		}

		if(!empty($college_type)){
			$college_type=decode_data($college_type);
		}

		if(!empty($exams)){
			$exams_id=decode_data($exams);
		}

		//echo $exams_id;

		if(!empty($course_type)){
			$course_type_id=decode_data($course_type);
		}

		if(!empty($affiliation)){
			$affiliation_id=decode_data($affiliation);
		}

		if(!empty($course_duration)){
			$course_duration=$course_duration;
		}

		if(!empty($ageny)){
			$ageny_id=decode_data($ageny);
		}

		if(!empty($approval)){
			$approval_id=decode_data($approval);
		}

		if(!empty($college_cat)){
			$college_cat_id=decode_data($college_cat);
		}

		//echo $stream_id;

		//echo $city_id;die;

		//echo $country_id;

		$filtered_data=array();

		//if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='colleges')){
			$country_data=$this->com->_get_country(array('country_id'=>$country_id));

			//print_obj($country_data);die;

			if(!empty($country_data)){

				//$currency=$this->com->get_currency(array('currency_id'=>$country_data->country_currency));

				$post=array('length'=>$length,'start'=>$start);

				// $param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');

				$param=array('country_id'=>$country_data->country_id,'status'=>'1');

				//state/city/stream/course
				if(isset($state_id) && isset($city_id) && isset($stream_id) && isset($course_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'courses'=>$course_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'courses'=>$course_id,'status'=>'1');
				}

				//state/stream/course/exam
				else if(isset($state_id) && isset($stream_id) && isset($course_id) && isset($exams_id)){
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'streams'=>$stream_id,'courses'=>$course_id,'exams'=>$exams_id,'status'=>'1');
					$this->data['exam_id']=$exams_id;
				}

				//city/staream/course/exam
				else if(isset($city_id) && isset($stream_id) && isset($course_id) && isset($exams_id)){
					$param=array('country_id'=>$country_id,'city_id'=>$city_id,'streams'=>$stream_id,'courses'=>$course_id,'exams'=>$exams_id,'status'=>'1');
					$this->data['exam_id']=$exams_id;
				}

				//state/course/stream
				else if(isset($state_id) && isset($course_id) && isset($stream_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'courses'=>$course_id,'status'=>'1');
				}

				//state/city/stream
				else if(isset($state_id) && isset($city_id) && isset($stream_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1');
				}

				//state/city/course
				else if(isset($state_id) && isset($city_id) && isset($course_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'courses'=>$course_id,'status'=>'1');
				}

				//stream/course/exam
				else if(isset($stream_id) && isset($course_id) && isset($exams_id)){
					$param=array('country_id'=>$country_id,'streams'=>$stream_id,'courses'=>$course_id,'exams'=>$exams_id,'status'=>'1');
					$this->data['exam_id']=$exams_id;
				}

				//state/city
				else if(isset($state_id) && isset($city_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'status'=>'1');
				}

				//state/stream
				else if(isset($state_id) && isset($stream_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'streams'=>$stream_id,'status'=>'1');
				}

				//city/stream
				else if(isset($city_id) && isset($stream_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'city_id'=>$city_id,'streams'=>$stream_id,'status'=>'1');
				}

				//stream/course
				else if(isset($stream_id) && isset($course_id)){
					// $param=array('country_id'=>$country_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'streams'=>$stream_id,'courses'=>$course_id,'status'=>'1');
				}

				//state/course
				else if(isset($state_id) && isset($course_id)){
					// $param=array('country_id'=>$country_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'courses'=>$course_id,'status'=>'1');
				}

				//city/course
				else if(isset($city_id) && isset($course_id)){
					// $param=array('country_id'=>$country_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'city_id'=>$city_id,'courses'=>$course_id,'status'=>'1');
				}

				//city
				else if(isset($city_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'city_id'=>$city_id,'status'=>'1');
				}

				//state
				else if(isset($state_id)){
					// $param=array('country_id'=>$country_id,'state_id'=>$state_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'state_id'=>$state_id,'status'=>'1');
				}				

				//stream
				else if(isset($stream_id)){
					// $param=array('country_id'=>$country_id,'streams'=>$stream_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'streams'=>$stream_id,'status'=>'1');
				}

				//course
				else if(isset($course_id)){
					// $param=array('country_id'=>$country_id,'courses'=>$course_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'courses'=>$course_id,'status'=>'1');
				}

				//exam
				else if(isset($exams_id)){
					// $param=array('country_id'=>$country_id,'courses'=>$course_id,'status'=>'1','is_verified'=>'1');
					$param=array('country_id'=>$country_id,'exams'=>$exams_id,'status'=>'1');
					$this->data['exam_id']=$exams_id;
				}


				if(isset($college_type)){
					if(is_numeric($college_type)){
						$_ctype_param=array('college_type'=>$college_type);
					}else{
						$_ctype_param=array('inst_type_name_slug'=>$college_type);
					}
					

					$_param=array_merge($param,$_ctype_param);
					$param=$_param;
				}


				if(isset($approval_id)){
					$_appr_param=array('college_approval_type'=>$approval_id);
					$_appparam=array_merge($param,$_appr_param);
					$param=$_appparam;
				}


				if(isset($affiliation_id)){
					$_aff_param=array('college_affiliation_type'=>$affiliation_id);
					$_affparam=array_merge($param,$_aff_param);
					$param=$_affparam;
				}


				if(isset($college_cat_id)){
					$_c_cate_param=array('college_category'=>$college_cat_id);
					$_c_cateparam=array_merge($param,$_c_cate_param);
					$param=$_c_cateparam;
				}


				if(isset($agency_id)){
					$_agency_param=array('college_agency'=>$agency_id);
					$_agencyparam=array_merge($param,$_agency_param);
					$param=$_agencyparam;
				}


				//$param['show_in_search_grid']='1';


				$param['order_by']='college_short_order';
				$param['order']='ASC';

				//echo $approval_id;


				//print_obj($param);

				$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

				//print_obj($colleges);die;

				//$return['qry']=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,TRUE);


				//$colleges=$this->im->_get_colleges($post,$param);

				//print_obj($colleges);die;

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {
						// $_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner','user_file_type'=>'4'));
		    			// $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

		    			// $_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner','user_file_type'=>$value->college_utype));
		    			// $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo','user_file_type'=>$value->college_utype));

		    			$total_reviews=$this->sm->get_total_review_status_data(array('review_approved'=>'approved','review_inst_id'=>$value->college_user_id));

		                $total_average_ratings=$this->sm->get_total_average_rating($value->college_user_id);

		                if($total_reviews>0 && $total_average_ratings->total_average_rating!=''){
		                    $college_total_avg_rating=$total_average_ratings->total_average_rating;
		                }else{
		                    $college_total_avg_rating='0';
		                }


		    			$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
		    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative) && file_exists($_college_logo->media_disk_path)){
		                    $college_logo=$_college_logo->media_disk_path_relative;
		                }else{
		                    $college_logo=base_url().'uploads/app/default/no.jpeg';
		                }

		                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative) && file_exists($_college_banner->media_disk_path)){
		                    $college_banner=$_college_banner->media_disk_path_relative;
		                }else{
		                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                }


						$is_featured=$value->college_is_featured;


						$college_inner_meues='';

						//$cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->college_facilities,TRUE);

						if(!empty($value->college_facilities)){
		                    $cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->college_facilities);

		                    foreach ($cfacilities as $k => $v) {
		                        $college_facilities[$value->college_user_id][]=array(
		                            'facility_name'=>$v->facility_name,
		                            'facility_icon_2'=>$v->facility_icon_2,
		                            'facility_icon_3'=>base_url('public/data/app/app_data/icon/withoutbackground/'.$v->facility_icon_3)
		                        );
		                    }
		                }else{
		                	$cfacilities='';
		                    $college_facilities=array();
		                }

		                if(!empty($value->college_affiliation_type)){
		                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$value->college_affiliation_type);

		                    $college_affiliations=$caffiliations->concated_value;
		                }else{
		                    $college_affiliations='';
		                }

		                //$college_affiliations=$value->college_affiliation_type;




		                // if(isset($stream_id) && isset($course_id)){
		                // 	$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id,'user_course_stream'=>$stream_id),FALSE,3);
                    	// }else if(!isset($stream_id) && isset($course_id)){
		                // 	$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),FALSE,3);
                    	// }else if(isset($stream_id) && !isset($course_id)){
		                // 	$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,6,FALSE);
                    	// }else{
                    	// 	$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),FALSE,6);
                    	// }

		                /*

                    	 if(isset($stream_id) && isset($course_id)){
                    	 	if(!empty($stream_id) && !empty($course_id)){
                    	 		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id,'user_course_stream'=>$stream_id),FALSE,3);
                    	 		//echo '1';
                    	 	}else if(!empty($stream_id) && empty($course_id)){
                    	 		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,6);
                    	 		//echo '2';
                    	 	}else if(empty($stream_id) && !empty($course_id)){
                    	 		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),FALSE,6);
                    	 		//echo '3';
                    	 	}else{
                    	 		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),FALSE,6);
                    	 		//echo '4';
                    	 	}

                    	}else if(isset($stream_id) && !isset($course_id)){
                    		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,6);
                    		//echo '5';
                    	}else if(!isset($stream_id) && isset($course_id)){
                    		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),FALSE,6);
                    		//echo '6';
                    	}else{
                    		$college_courses=$this->im->___get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),FALSE,6);
                    		//echo '7';
                    	}

                    	*/

                    	if(isset($stream_id) && isset($course_id)){
                    	 	if(!empty($stream_id) && !empty($course_id)){
                    	 		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),$stream_id,FALSE,3);
                    	 		//echo '1';
                    	 	}else if(!empty($stream_id) && empty($course_id)){
                    	 		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),$stream_id,FALSE,6);
                    	 		//echo '2';
                    	 	}else if(empty($stream_id) && !empty($course_id)){
                    	 		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),null,FALSE,6);
                    	 		//echo '3';
                    	 	}else{
                    	 		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),null,FALSE,6);
                    	 		//echo '4';
                    	 	}

                    	}else if(isset($stream_id) && !isset($course_id)){
                    		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),$stream_id,FALSE,6);
                    		//echo '5';
                    	}else if(!isset($stream_id) && isset($course_id)){
                    		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),null,FALSE,6);
                    		//echo '6';
                    	}else{
                    		$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),null,FALSE,6);
                    		//echo '7';
                    	}

                    	//die;

		                //$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,3);

                    	//echo $value->college_user_id;

                    	//print_obj($college_courses);die;


                    	//print_obj($college_courses);


		                $firstyear_total=array();

		                if(!empty($college_courses)){
		                    foreach ($college_courses as $k => $v) {

		                    	$course=$this->strm->get_course(array('course_id'=>$v->user_course));

		                    	//echo 'user_course_cost_type:'.$v->user_course_cost_type;'<br>';
		                    	//echo 'user_course_cost_breakup_type:'.$v->user_course_cost_breakup_type;

		                    	if($v->user_course_cost_type==1 && $v->user_course_cost_breakup_type==1){

		                    		if($v->user_course_cost_category!=null){
		                    			$fees_data=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_cost_category'=>$v->category_name,'user_course_year'=>'1'));

			                    		//echo $value->college_user_id;

			                    		//print_obj($fees_data);

					    				$total=0;

					    				// foreach ($fees_data as $k => $fv) {

					    				// 	$firstyear_total[]=$fv->user_course_tution_fee_total+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fv->user_course_exam_fee_sem_1+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_total;
					    				// }

					    				$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;

					    				//print_obj($firstyear_total);


					    				$_total=number_format($firstyear_total);


					    				$_course_cost=($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

					    				$fees_duration_text='FIRST YEAR FEES';
		                    		}else{
		                    			$_fees_data=array();
					    				$first_year_fees=0;
					    				$total=0;
					    				$_course_cost=0;
					    				$reg_fee_available='no';
					    				$exam_fee_available='no';
					    				$fees_duration_text='';
		                    		}

			                    		

		                    	}else if($v->user_course_cost_type==2 && $v->user_course_cost_breakup_type==1){
		                    		$fees_data=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_cost_category'=>$v->category_name,'user_course_id'=>$v->user_course),FALSE);

		                    		//print_obj($fees_data);

		                    		$total=0;

		                    		$firstyear_total=[];

				    				if(!empty($fees_data)){
				    					foreach ($fees_data as $k => $fv){
	                                     	$firstyear_total[]=$fv->user_course_tution_fee_sem_1+$fv->user_course_tution_fee_sem_2+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_admisssion_fee_sem_2+$fv->user_course_reg_fee_sem_1+$fv->user_course_reg_fee_sem_2+$fv->user_course_exam_fee_sem_1+$fv->user_course_exam_fee_sem_2+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_sem_2;

	                                    }
				    				}else{
				    					$firstyear_total=array();
				    				}
			                    		

				    				$total_1st_year_wise=(!empty($firstyear_total))?$firstyear_total[0]:'0';

				    				$_total=number_format($total_1st_year_wise);

				    				$_course_cost=($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

				    				$fees_duration_text='FIRST YEAR FEES';
				    				

		                    	}else if($v->user_course_cost_type==1 && $v->user_course_cost_breakup_type==2){
		                    		$fees_data=$this->im->get_user_course_grand_total(array('user_id'=>$value->college_user_id,'user_course_cost_category'=>$v->category_name,'user_course_id'=>$v->user_course));

		                    		//print_obj($fees_data);


				    				$total=$fees_data[0]->total_cost;

				    				$_total=number_format($total,2);

				    				$firstyear_total=$_total;

				    				$_course_cost=($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

				    				$fees_duration_text='TOTAL FEES';
		                    	}else{
				    				$_fees_data=array();
				    				$first_year_fees=0;
				    				$total=0;
				    				$_course_cost=0;
				    				$reg_fee_available='no';
				    				$exam_fee_available='no';
				    				$fees_duration_text='';
				    			}	                    	
		                    	
		                        // $course=$this->strm->get_course(array('course_id'=>$v->user_course));
		                        // $cost=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));

		                        // $_course_cost=($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.number_format($cost->user_course_total_fee):number_format($cost->user_course_total_fee).$country_data->currency_symbol_right;

		                        // $fees_duration_text='FIRST YEAR FEES';

		                        if(!empty($course->course_short_name)){
		                        	$course_formatted_name=(!empty($fees_duration_text))?$course->course_short_name.' - '.$fees_duration_text:$course->course_short_name;
		                        }else{
		                        	$course_formatted_name=(!empty($fees_duration_text))?$course->course_name.' - '.$fees_duration_text:$course->course_name;
		                        }

		                        $_course_cost_data[$value->college_user_id][]=array(
		                            'cost_value'=>($firstyear_total>0)?$_course_cost:'',
		                            'course_name'=>$course_formatted_name
		                        );
		                    }
		                }else{
		                    $_course_cost_data=array();
		                }

		               //print_obj($_course_cost_data);die;


		               //die;

		                //print_obj($_course_cost_data);die;

		                $current_year=date('Y');

		                $college_ranks=$this->im->_get_inst_ranking_data(array('ranking_inst_id'=>$value->college_user_id,'ranking_inst_type'=>'college'),FALSE);

		                if(!empty($college_ranks)){
		                	foreach ($college_ranks as $k => $v) {
		                		$_ranking_data[$value->college_user_id][]=array(
		                			'rank_body'=>$v->rank_body,
		                			'rank_value'=>$v->rank_value,
		                			'ranking_value'=>$v->ranking_value,
		                			'rank_year'=>$v->ranking_year
		                		);
		                	}
		                }else{
		                	$_ranking_data=array();
		                }

		                $exams_accepted=$this->strm->get_user_courses_exam(array('user_type'=>'4','user_id'=>$value->college_user_id),FALSE,'exam_id','ASC','3','exam_id,exam_name');

		                if(!empty($exams_accepted)){
		                	foreach ($exams_accepted as $k => $v) {
		                		$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$v->exam_id));
		                		$_exams_accepted[$value->college_user_id][]=array(
		                			'exam_id'=>$v->exam_id,
		                			'exam_name'=>$v->exam_name,
		                			'exam_link'=>(!empty($exam_slug))?base_url('exams/'.$exam_slug->slug_value):'javascript::void(0);'
		                		);
		                	}
		                }else{
		                	$_exams_accepted=array();
		                }

		                $total_gallery_img=$this->sm->get_total_user_files(array('user_file_type_id'=>$value->college_user_id,'user_file_type'=>'4'));

		                $menu_link_type=($value->college_utype=='4')?'10':'101';

		                $college_info_menu=$this->sm->get_menues(array('menu_type'=>'1','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
		                $college_courses_menu=$this->sm->get_menues(array('menu_type'=>'2','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
		                $college_gallery_menu=$this->sm->get_menues(array('menu_type'=>'7','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
		                $college_admission_menu=$this->sm->get_menues(array('menu_type'=>'3','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));

		                //if(!empty($_course_cost_data) && isset($_course_cost_data[$value->college_user_id]) && !empty($_course_cost_data[$value->college_user_id])){
		                	$filtered_data[]=array(
			                    'college_id'=>encode_data($value->college_user_id),
			    				'college_name'=>strtoupper(strtolower($value->college_name)),
			    				'college_city'=>$value->city_name,
			    				'college_state'=>$value->state_name,
			    				'college_country_id'=>encode_data($value->college_country_id),
			    				'college_country'=>$value->country_name,
			                    'college_total_course_amount'=>number_to_currency($total_cost),
			                    'college_total_course_amount_with_currency'=>$course_cost,
			    				'college_logo'=>$value->college_logo,
			    				'college_banner'=>$value->college_banner,
			                    'college_intro_video'=>$college_intro_video,
			                    'college_inner_menues'=>$college_inner_meues,
			                    'college_affiliations'=>$college_affiliations,
			                    'is_featured'=>$is_featured,
			                    'access_url'=>$value->access_url,
			                    'college_country_phone_code'=>$country_data->country_phone_code,
			                    'college_facilities'=>(!empty($value->college_facilities))?$college_facilities[$value->college_user_id]:null,
			                    'college_courses'=>$college_courses,
			                    'college_courses_cost'=>(!empty($college_courses))?$_course_cost_data[$value->college_user_id]:'N/A',
			                    'college_course_fees_link'=>$college_courses_menu->menu_link,
			                    'college_reviews_link'=>$value->access_url.'/reviews',
	                			'college_admissions_link'=>$college_admission_menu->menu_link,
	                			'college_gallery_link'=>$college_gallery_menu->menu_link,
			                    'college_ranks'=>(!empty($college_ranks))?$_ranking_data[$value->college_user_id]:null,
			                    'college_total_review'=>$total_reviews,
                        		'college_total_avg_rating'=>$college_total_avg_rating,
			                    'college_exams_accepted'=>(!empty($exams_accepted))?$_exams_accepted[$value->college_user_id]:'',
			                    'college_total_gallery_img'=>$total_gallery_img,
			                    'institute_type'=>encode_data(7)
			    			);

			    			// Exclude data if $dpr is set to 'reviews' and total_reviews is not more than 0
							if (isset($dpr) && $dpr === 'reviews' && $total_reviews <= 0) {
							    array_pop($filtered_data);
							    // Sort $filtered_data array by 'college_total_review' in descending order
								// usort($filtered_data, function($a, $b) {
								//     return (int)$b['college_total_review'] - (int)$a['college_total_review'];
								// });

							}
		               // }
					}

					//die;
				}

				//die;


				//print_obj($filtered_data);die;

				// $new_arr=array(
				//     'gads' => '<ins class="adsbygoogle"
			 //                 style="display:inline-block;width:728px;height:90px"
			 //                 data-ad-client="ca-pub-9545373166119354"
			 //                 data-ad-slot="2846553403"></ins>
			 //            <script>
			 //                 (adsbygoogle = window.adsbygoogle || []).push({});
			 //            </script>'
				// );

				// array_splice($filtered_data,12,0,$new_arr); // can be more items

				// print_obj($filtered_data);die;

				/*if(!empty($filtered_data)){
					$_filtered_data=array_chunk($filtered_data,6);
				}else{
					$_filtered_data=array();
				}*/




				
				//print_obj($filtered_data);die;

				//die;

				$this->data['filtered_data']=$filtered_data;
				$this->data['data_start']=$start;

				//print_obj($this->data['exam_id']);die;



				$return['html']=$this->theme->view('_pages/search/vw_filter_result_dyna',$this->data,true);

				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($return);
			}
		//}
	}


	public function onFilters(){
		$length=$this->input->get('_l');
		$start=$this->input->get('_s');

		$country=$this->input->get('_c');
		$state=$this->input->get('_st');
		$city=$this->input->get('_ct');
		$stream=$this->input->get('_strm');
		$course=$this->input->get('_cu');

		$program_type=$this->input->get('_ptype');
		$college_type=$this->input->get('_ctype');
		$exams=$this->input->get('_exam');
		$course_type=$this->input->get('_curstype');
		$affiliation=$this->input->get('_aff');
		$course_duration=$this->input->get('_cduration');
		$ageny=$this->input->get('_agn');
		$approval=$this->input->get('_appr');
		$college_cat=$this->input->get('_c_cate');

		$post['length']=$length;
		$post['start']=$start;

		$country_id=decode_data($country);
		if(!empty($state)){
			$state_id=decode_data($state);			
		}


	}


	public function onSearchInstituteCourse(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			$_searched_param=$this->input->get('_searched_param');
			$_searched_param_type=$this->input->get('_searched_param_type');

			$inst_id=$_searched_param;
			$inst_type=$_searched_param_type;

			//echo $inst_id;die;

			$_u_courses=array();

			if(is_numeric($inst_id) && is_string($inst_type)){
				if($inst_type=='COLLEGE_NAME'){
					$int_type='4';
				}else{
					$int_type='5';
				}

				$user_courses=$this->im->_get_users_courses(null,array('user_id'=>$inst_id,'user_type'=>$int_type),FALSE);

				if(!empty($user_courses)){
					foreach($user_courses as $key=>$value){
						$enc_course_id=encode_data($value->user_course);
						$_u_courses[]=array(
							'_course'=>$enc_course_id,
							'course_name'=>$value->course_name,
							'review_link'=>base_url().'reviews/write/'.encode_data($inst_id).'_'.encode_data($_searched_param_type).'/'.$enc_course_id
						);
					}
				}
			}

				

			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($_u_courses);

		}else{
			redirect(base_url());
		}
		
	}


	public function onSearchCourseList(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			$_searched_param=$this->input->get('_searched_param');
			
			$system_courses=array();

			$courses=$this->im->get_courses(array('course_short_name_2'=>$system_course));

			$data_searched=$this->im->_get_courses($_searched_param,NULL,NULL,'NATURAL LANGUAGE',null,null,'course_id','ASC',FALSE);

			//print_obj($data_searched);die;

			if(!empty($data_searched)){
				foreach ($data_searched as $key => $value) {
					$system_courses['searched_data'][]=array(
						'course_name'=>$value->course_name,
						'course_short_name'=>$value->course_short_name,
						'course_url'=>''
					);
				}
			}

			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($system_courses);

		}else{
			redirect(base_url());
		}
	}



	public function onSearchFilter(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$country=post_data('_country');

			$search_streams=post_data('search_streams');
			$search_course=post_data('search_course');
			$search_cities=post_data('search_cities');

			$search_states=post_data('search_states');

		}else{
			redirect(base_url());
		}
	}




	public function index(){
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course or stream
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course or exam or ranking

		$c_type=$this->input->get('ctype');
		$appr=$this->input->get('appr');

		$aff=$this->input->get('aff');

		$c_cate=$this->input->get('c_cate');

		$agn=$this->input->get('agn');

		$state_id='';
		$city_id='';
		$course_id='';
		$stream_id='';
		$exam_id='';
		$rank_id='';
		$ctype_id='';
		$appr_id='';
		$aff_id='';
		$c_cate_id='';
		$agn_id='';

		//print_obj($segment_3);die;

		$current_url= current_url();


		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='colleges')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){
				if(is_string($segment_2) && $segment_2=='colleges'){

					$current_url_slug=$this->sm->get_slug_urls(array('url_value'=>$current_url));

					if(!empty($current_url_slug)){
						if($segment_3!='0'){
							
							$segment_3_slug=$this->sm->get_slug(array('slug_value'=>$segment_3));

							//print_obj($segment_3_slug);die;

							$segment_3_slug_type=$segment_3_slug->slug_type;

							//echo $segment_3_slug->slug_type_id;die;

							if($segment_3_slug_type=='1'){
								$state_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='2'){
								$city_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='3'){
								$stream_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='5'){
								$course_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='10'){
								$exam_id=encode_data($segment_3_slug->slug_type_id);
							}
						}

						//echo $state_id;die;


						if($segment_4!='0'){
							$segment_4_slug=$this->sm->get_slug(array('slug_value'=>$segment_4));

							$segment_4_slug_type=$segment_4_slug->slug_type;

							if($segment_4_slug_type=='2'){
								$city_id=encode_data($segment_4_slug->slug_type_id);
							}else if($segment_4_slug_type=='3'){
								$stream_id=encode_data($segment_4_slug->slug_type_id);
							}else if($segment_4_slug_type=='5'){
								$course_id=encode_data($segment_4_slug->slug_type_id);
							}
						}

						if($segment_5!='0'){
							$segment_5_slug=$this->sm->get_slug(array('slug_value'=>$segment_5));

							$segment_5_slug_type=$segment_5_slug->slug_type;

							if($segment_5_slug_type=='3'){
								$stream_id=encode_data($segment_5_slug->slug_type_id);
							}else if($segment_5_slug_type=='5'){
								$course_id=encode_data($segment_5_slug->slug_type_id);
							}else if($segment_5_slug_type=='10'){
								$exam_id=encode_data($segment_5_slug->slug_type_id);
							}
						}

						if($segment_6!='0'){
							$segment_6_slug=$this->sm->get_slug(array('slug_value'=>$segment_6));

							$segment_6_slug_type=$segment_6_slug->slug_type;

							if($segment_6_slug_type=='5'){
								$course_id=encode_data($segment_6_slug->slug_type_id);
							}else if($segment_6_slug_type=='10'){
								$exam_id=encode_data($segment_6_slug->slug_type_id);
							}
						}


						if($c_type!=''){
							$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4','inst_type_name_slug'=>$c_type));
							$ctype_id=encode_data($institute_types->inst_type);
						}


						if($appr!=''){
							$appr_data=$this->im->get_approval_type(array('approval_type_name_slug'=>$appr));
							$appr_id=encode_data($appr_data->approval_type_id);
						}

						if($aff!=''){
							$aff_data=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$country_data->country_id,'statutory_body_abbr_slug'=>$aff),TRUE);
							$aff_id=encode_data($aff_data->statutory_body_id);
						}


						if($c_cate!=''){
							$c_cate_data=$this->im->get_institute_categories(array('inst_category_name_slug'=>$c_cate));
							$c_cate_id=encode_data($c_cate_data->inst_category_id);
						}


						if($agn!=''){
							$agn_data=$this->im->get_agency(array('agency_name_slug'=>$agn));
							$agn_id=encode_data($agn_data->agency_id);
						}




						$this->data['country_id']=encode_data($country_data->country_id);
						$this->data['state_id']=$state_id;
						$this->data['city_id']=$city_id;
						$this->data['stream_id']=$stream_id;
						$this->data['course_id']=$course_id;
						$this->data['exam_id']=$exam_id;

						$this->data['rank_id']='';

						$this->data['ctype_id']=$ctype_id;
						$this->data['appr_id']=$appr_id;

						$this->data['aff_id']=$aff_id;

						$this->data['c_cate_id']=$c_cate_id;

						$this->data['agn_id']=$agn_id;

						$cfacilities=$this->sm->get_system_facilities(array('facility_status'=>'1'),FALSE);

	                    foreach ($cfacilities as $k => $v) {
	                        $college_facilities[]=array(
	                            'facility_icon_3'=>base_url('public/data/app/app_data/icon/withoutbackground/'.$v->facility_icon_3)
	                        );
	                    }

	                  

	                    $this->data['facilities']=$college_facilities;

						//this->data['page_title']=(!empty($this->data['slug_data']))?$this->data['slug_data']->url_page_heading:'';
						$this->data['page_inner_title']=(!empty($this->data['slug_data']))?$this->data['slug_data']->url_page_heading:'';
						$this->data['breadcumb']=(!empty($this->data['slug_data']))?json_decode($this->data['slug_data']->url_breadcrumb,TRUE):'';

						//print_obj($this->data);die;

						$this->data['page_id']=$current_url_slug->url_id;

						$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

						//print_obj($structure_data);die;

						$this->data['page_structure_data']=$structure_data;


						$view_page='search/vw_search_colleges_page';
					}else{
						$this->data['page_title']='404 not found';
						$view_page='webpage/others/vw_notfound';
					}

						

					$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($view_page, $this->data);
				}else{
					redirect(base_url('in/colleges'));
				}
			}else{
				redirect(base_url('in/colleges'));
			}
				
		}else{
			redirect(base_url('in/colleges'));
		}
	}
	
}