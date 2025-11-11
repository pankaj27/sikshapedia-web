<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Reviews extends BaseFrontController
{
	public function index(){

		$segment_1=$this->uri->segment(1,0);//reviews


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='reviews')){

			$param=array('is_initial_visiblein_review'=>'yes');

			$data_searched = $this->im->_get_college_specific_data('college_user_id,college_name,college_short_name,state_name',$param);


			if(!empty($data_searched)){
				foreach($data_searched as $key=>$value){

					$get_course_data=$this->um->get_total_user_courses(array('user_type'=>4,'user_id'=>$value->college_user_id));

					if($get_course_data>0){
						if($value->college_short_name!=null){
							if($value->state_name!=null){
								$formatted_name=$value->college_name.' - ['.$value->college_short_name.'],'.$value->state_name;
							}else{
								$formatted_name=$value->college_name.' - ['.$value->college_short_name.']';
							}					
						}else{
							if($value->state_name!=null){
								$formatted_name=$value->college_name.','.$value->state_name;
							}else{
								$formatted_name=$value->college_name;
							}					
						}

						// $review_link=base_url().'reviews/write/'.encode_data($value->search_data_type_id).'/'.encode_data($value->search_data_type).'/'.encode_data($value->search_data_name);

						$review_link=base_url('reviews/write/'.encode_data($value->college_user_id).'/'.encode_data('COLLEGE_NAME'));

						$searched_data[]=array(
							'inst_name'=>$formatted_name,
							'inst_review_link'=>$review_link
						);
					}
					
				}
			}

			$this->data['data_searched']=$searched_data;

			$page_title='College, University, Institute, Placement, Course Fees, Admission, Entrance - Reviews and Rating';
			$view_page='webpage/others/vw_reviews_write-new';
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->data['page_title']=$page_title;

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	
	}


	public function onLoadReviewColleges(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){

			$college_name=$this->input->get('search_param');

			$searched_data=array();
			$param=null;//array('is_initial_visiblein_review'=>'yes');

			$likeparam=array('college_name'=>$college_name);

			$data_searched = $this->im->_get_college_specific_data('college_user_id,college_name,college_short_name,state_name',$param,$likeparam,10,FALSE,FALSE);

			//print_obj($data_searched);die;

			$this->data['data_searched']=$college_list;

			if(!empty($data_searched)){
				foreach($data_searched as $key=>$value){


					$get_course_data=$this->um->get_total_user_courses(array('user_type'=>4,'user_id'=>$value->college_user_id));

					if($get_course_data>0){
						if($value->college_short_name!=null){
							if($value->state_name!=null){
								$formatted_name=$value->college_name.' - ['.$value->college_short_name.'],'.$value->state_name;
							}else{
								$formatted_name=$value->college_name.' - ['.$value->college_short_name.']';
							}					
						}else{
							if($value->state_name!=null){
								$formatted_name=$value->college_name.','.$value->state_name;
							}else{
								$formatted_name=$value->college_name;
							}					
						}

						// $review_link=base_url().'reviews/write/'.encode_data($value->search_data_type_id).'/'.encode_data($value->search_data_type).'/'.encode_data($value->search_data_name);

						$review_link=base_url('reviews/write/'.encode_data($value->college_user_id).'/'.encode_data('COLLEGE_NAME'));

						$searched_data[]=array(
							'inst_name'=>$formatted_name,
							'inst_review_link'=>$review_link
						);
					}
					
				}
			}

			$return['searched_data']=$searched_data;

			json_headers($return);

		}else{
			redirect(base_url());
		}
	}


	public function indexWrite(){

		$segment_1=$this->uri->segment(1,0);//reviews
		$segment_2=$this->uri->segment(2,0);//reviews

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') && (is_string($segment_1) && $segment_1=='reviews' && $segment_2=='write')){


			$data_searched=$this->sm->___get_system_search_data(array('search_data_type_id!='=>'0','search_data_type'=>'COLLEGE_NAME'));

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

						// $review_link=base_url().'reviews/write/'.encode_data($value->search_data_type_id).'/'.encode_data($value->search_data_type).'/'.encode_data($value->search_data_name);

						$review_link=base_url().'reviews/write/'.encode_data($value->search_data_type_id).'/'.encode_data($value->search_data_type);

						$searched_data[]=array(
							'inst_name'=>$formatted_name,
							'inst_review_link'=>$review_link
						);
					}
					
				}
			}

			$this->data['data_searched']=$searched_data;

			//print_obj($this->data['data_searched']);die;


			$page_title='Write a review';
			$this->data['guideline_link']=base_url().'reviews/write/guidelines';
			$view_page='webpage/others/reviews/vw_reviews_write';
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->data['page_title']=$page_title;

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	
	}

	public function onLoadReviewCollegeList(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$searched_data=[];
			$search_text=$this->input->get('search_txt');
			
			if(!empty($search_text)){
				$college_list=$this->im->get_college_by_name($search_text);

				if(!empty($college_list)){

					foreach ($college_list as $key => $value) {
						$review_link=base_url().'reviews/write/'.encode_data($value->college_user_id).'/'.encode_data('COLLEGE_NAME');

						$searched_data[]=array(
							'inst_name'=>strtoupper($value->college_name),
							'inst_review_link'=>$review_link
						);
					}
					
				}
			}

			$this->data['searched_data']=$searched_data;
			echo json_encode($this->data['searched_data']);
		}
	}

	public function indexWriteGuidelines(){

		$segment_1=$this->uri->segment(1,0);//reviews


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='reviews')){
			$page_title='Write a review Guidelines';
			$view_page='webpage/others/reviews/vw_reviews_write_guide_lines';
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->data['page_title']=$page_title;

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	
	}


	public function indexWriteReview($data_id,$data_type=null){
		$segment_3=$this->uri->segment(3,0);
		$segment_4=$this->uri->segment(4,0);
		//$segment_5=$this->uri->segment(5,0);

		//echo $segment_3;

		// $inst_id=decode_data($segment_3);
		// $inst_type=decode_data($segment_4);
		// $inst_name=decode_data($segment_5);

		$inst_id=decode_data($data_id);
		$inst_type=decode_data($data_type);

		$college_data=$this->sm->__get_system_search_data(array('search_data_type_id'=>$inst_id,'search_data_type'=>$inst_type));

		//echo $inst_name;

		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			if(!empty($this->data['userdata'])){

				$userdata=$this->data['userdata'];

				$this->data['inst_data']=array(
					'inst_id'=>$inst_id,
					'inst_type'=>$inst_type,
					'inst_type_id'=>$inst_id,
					'inst_name'=>$college_data->search_data_name
				);


				$page_title='Write review for '.$college_data->search_data_name;

				session_set_userdata(array('review_inst'=>$inst_id));


				$this->data['page_title']=$page_title;

				$view_page='webpage/others/vw_reviews_inst_course_list';

				$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	

			}else{
				redirect(base_url());
			}

		}else{
			//echo $this->current_url;die;
			session_set_userdata(array('custom_redirect'=>$this->current_url,'review_inst'=>$inst_id));
			redirect(base_url().'signin');
		}
	}

	public function indexAddReview(){
		$segment_3=$this->uri->segment(3,0);
		$segment_4=$this->uri->segment(4,0);

		$segment_3_exp=explode('_', $segment_3);


		$inst_id=decode_data($segment_3_exp[0]);
		$inst_type=decode_data($segment_3_exp[1]);
		$inst_course_id=decode_data($segment_4);

		$courses=array();

		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			//echo $inst_id.'<br>'.$inst_type.'<br>'.$inst_course_id;die;

			$inst_data=$this->im->get_college_profile_data(array('college_user_id'=>$inst_id));

			$inst_name=strtoupper($inst_data->college_name);

			$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$inst_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

			if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
	            $inst_logo=$user_logo->media_disk_path_relative;
	        }else{
	            $inst_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
	        }

	        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$inst_id,'user_storage_type'=>'user_banner'));

	        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
	            $inst_banner=$user_banner->media_disk_path_relative;
	        }else{
	            $inst_banner=base_url().'uploads/app/default/pageBnr.jpg';
	        }

	        $college_courses=$this->strm->get_inst_streams_courses(array('user_id'=>$inst_id));

	        if(!empty($college_courses)){
	        	foreach ($college_courses as $key => $value) {
	        		$courses[]=array(
	        			'course_id'=>$value->user_course,
	        			'course_name'=>$value->course_name,
	        			'selected'=>($value->user_course==$inst_course_id)?'selected':''
	        		);
	        	}
	        }

	        $this->data['inst_courses']=$courses;

			$page_title='Write review for '.$inst_name;

			$this->data['inst_data']=array(
				'inst_type'=>$inst_type,
				'inst_type_id'=>$inst_id,
				'inst_course_id'=>$inst_course_id,
				'inst_name'=>$inst_name,
				'inst_logo'=>$inst_logo,
				'inst_banner'=>$inst_banner,
			);

			$_SESSION['review_course_id']=encode_data($inst_course_id);

			//print_obj($this->data['inst_data']);die;


			$current_year=date('Y');
			$past_30_year=$current_year-30;

			for ($i=$current_year; $i >=$past_30_year ; $i--) { 
				$enrollment_years[]=$i;
			}

			session_set_userdata(array('review_inst'=>encode_data($inst_id),'review_course'=>encode_data($inst_course_id)));


			$this->data['enrollment_years']=$enrollment_years;

			$this->data['statutory_bodies_10th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_10th'=>'yes'),FALSE);

			$this->data['statutory_bodies_12th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_12th'=>'yes'),FALSE);

			$this->data['caste_quota']=$this->sm->get_caste_quota(array('quota_status'=>'active'),FALSE);

			$user_id=decode_data(session_userdata('user_id'));
			$inst_id=decode_data(session_userdata('review_inst'));
			$inst_course_id=$inst_course_id;  //decode_data(session_userdata('review_course'));

			$step_no='step_1';

			$review_data=array();

			$this->data['enrollment_years']=$enrollment_years;

			$rdata=$this->sm->get_review_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$step_no));

			if(!empty($rdata)){

				$review_other_program_data=(!empty($rdata->review_other_program_data))?unserialize($rdata->review_other_program_data):'';

				if(!empty($review_other_program_data) && is_array($review_other_program_data)){
					foreach ($review_other_program_data as $key => $value) {
						$program[]=array(
							'name'=>$value['name'],
							'course'=>$value['course'],
							'reason'=>$value['reason']
						);
					}
				}else{
					$program=array();
				}

				//print_obj($program);die;




				$review_data=array(
					'review_enroll_year'=>$rdata->review_enroll_year,
					'review_program_fees'=>$rdata->review_program_fees,
					'review_12th_board_id'=>$rdata->review_12th_board_id,
					'review_12th_board_percentage'=>$rdata->review_12th_board_percentage,
					'review_10th_board_id'=>$rdata->review_10th_board_id,
					'review_10th_board_percentage'=>$rdata->review_10th_board_percentage,
					'review_caste_quota_applicable'=>$rdata->review_caste_quota_applicable,
					'review_gd_pi_applicable'=>$rdata->review_gd_pi_applicable,
					'review_opt_hostel'=>$rdata->review_opt_hostel,
					'review_opt_hostel_fees'=>$rdata->review_opt_hostel_fees,
					'review_caste_quota_id'=>$rdata->review_caste_quota_id,
					'review_class_size'=>$rdata->review_class_size,
					'review_inst_placement_applicable'=>$rdata->review_inst_placement_applicable,
					'review_inst_internship_applicable'=>$rdata->review_inst_internship_applicable,
					'review_other_program_data'=>$program
				);
			}

			if(!isset($_SESSION['review_token'])){
				$review_status=$this->sm->get_review_status_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

				if(!empty($review_status)){
					$_SESSION['review_token']=$review_status->review_uid;
				}
			}	

			$this->data['review_data']=$review_data;

			$this->data['page_title']=$page_title;

			$view_page='webpage/others/vw_reviews_add_edit';

			//$view_page='webpage/others/vw_reviews_add_edit_step_final';

			$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
		}else{
			//echo $this->current_url;die;

			session_set_userdata(array('custom_redirect'=>$this->current_url,'review_inst'=>encode_data($inst_id),'review_course'=>encode_data($inst_course_id)));

			redirect(base_url().'signin');
		}
	}


	public function onAddEditReview(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('user_id'));

				$inst_id=decode_data(post_data('review_college_id'));

				session_set_userdata(array('review_inst',encode_data($inst_id)));
				//$inst_course_id=decode_data(session_userdata('review_course_id'));

				//echo $inst_id;die;

				//print_obj($this->data['userdata']);die;

				$userdata=$this->data['userdata'];

				$inst_course_id=post_data('review_enrollment_course');//post_data('review_course');

				if(isset($_SESSION['review_token'])){
					$token=$_SESSION['review_token'];
				}else{
					$_review_status=$this->sm->get_review_status_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));
					if(empty($_review_status)){
						$token=token(16);
					}else{
						$token=$_review_status->review_uid;
					}
					
					$_SESSION['review_token']=$token;
				}				

				if(!empty($inst_course_id)){
					//$inst_course_id=decode_data($inst_course_id);

					//session_set_userdata(array('review_course_id'=>encode_data($inst_course_id)));

					
					$_SESSION['review_course_id']=encode_data($inst_course_id);
				}else{
					$inst_course_id=decode_data($_SESSION['review_course_id']);
				}

				$college_data=$this->im->get_college_data(array('college_user_id'=>$inst_id));

				//echo $inst_course_id;die;

				$step_no=post_data('review_step');
				$review_step_data=post_data('review_step_data');
				$review_q_type=post_data('review_q_type');
				$review_q_category=post_data('review_q_category');

				if($review_step_data=='step_1'){

					$review_enroll_year=post_data('review_enrollment_year');
					$review_program_fees=post_data('review_program_fees');
					$review_12th_board_id=post_data('review_board_12th');
					$review_12th_board_percentage=post_data('review_percentage_12th_marks');
					$review_10th_board_id=post_data('review_board_10th');
					$review_10th_board_percentage=post_data('review_percentage_10th_marks');
					$review_caste_quota_applicable=post_data('review_quota_available');
					$review_caste_quota_id=post_data('review_quota_type');
					$review_gd_pi_applicable=post_data('review_gd_pi_available');
					$review_class_size=post_data('review_class_size');
					$review_opt_hostel=post_data('review_opt_for_hostels');
					$review_opt_hostel_fees=post_data('review_hostel_fees');
					$review_inst_placement_applicable=post_data('review_placement_provided');
					$review_inst_internship_applicable=post_data('review_internship_provided');
					$review_other_program_data=$this->input->post('review_inst');

					$referrel_code=post_data('review_referrel_code');

					$course_data=$this->strm->get_course(array('course_id'=>$inst_course_id));

	                if($review_caste_quota_applicable=='yes'){
	                    $quota=$this->sm->get_caste_quota(array('quota_id'=>$review_caste_quota_id));
	                    $course_name=strtoupper($course_data->course_name.','.$quota->quota_name);
	                }else{
	                    $course_name=strtoupper($course_data->course_name);
	                }

					$_review_data=$this->sm->get_review_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$review_step_data));

					//print_obj($_review_data);die;

					//print_obj($review_other_program_data);

					//print_obj(serialize($review_other_program_data));die;

					if(!empty($referrel_code)){
						$referrel_user=$this->um->get_user_data(array('referrel_code'=>$referrel_code),null,8);
						$referrel_user_id=$referrel_user->user_id;
					}else{
						$referrel_user_id=0;
					}
					

					$review_data=array(
						'review_unique_id'=>$token,
						'review_user_as'=>'real',
						'review_user_name'=>$userdata->user_fullname,
						'review_user_name_short'=>createShortName($userdata->user_fullname),
						'review_user_id'=>$user_id,
						'review_inst_id'=>$inst_id,
						'review_course_id'=>$inst_course_id,
						'review_course_name'=>$course_name,
						'review_step'=>$review_step_data,
						'review_enroll_year'=>$review_enroll_year,
						'review_program_fees'=>$review_program_fees,
						'review_12th_board_id'=>$review_12th_board_id,
						'review_12th_board_percentage'=>$review_12th_board_percentage,
						'review_10th_board_id'=>$review_10th_board_id,
						'review_10th_board_percentage'=>$review_10th_board_percentage,
						'review_caste_quota_applicable'=>$review_caste_quota_applicable,
						'review_caste_quota_id'=>$review_caste_quota_id,
						'review_gd_pi_applicable'=>$review_gd_pi_applicable,
						'review_class_size'=>$review_class_size,
						'review_opt_hostel'=>$review_opt_hostel,
						'review_opt_hostel_fees'=>$review_opt_hostel_fees,
						'review_inst_placement_applicable'=>$review_inst_placement_applicable,
						'review_inst_internship_applicable'=>$review_inst_internship_applicable,
						'review_inst_name'=>$college_data->college_name,
						'review_other_program_data'=>serialize($review_other_program_data),
						'review_referrel_code'=>$referrel_code,
						'review_referrel_code_user_id'=>$referrel_user_id
					);

					//print_obj($review_data);die;


					if(empty($_review_data)){
						$added=$this->sm->add_review_data($review_data);
						$review_id=$added;
					}else{
						$added=$this->sm->update_review_data($review_data,array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$review_step_data));
						$review_id=$_review_data->review_id;
					}

					if($added){

						$review_status=$this->sm->get_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

						if(empty($review_status)){
							$this->sm->add_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_inst_type'=>$college_data->college_utype,'review_user_type'=>'real','review_last_step'=>'step_1','review_approved'=>'incomplete_and_not_approved','review_course_id'=>$inst_course_id,'created_at'=>date('Y-m-d'),'created_by'=>$user_id));
						}else{
							$this->sm->update_review_status_data(array('review_last_step'=>$step_no),array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id));
						}

						$return['next_step']=$step_no;
						$return['review_id']=$review_id;
						$return['review_inst_id']=$inst_id;
						$return['review_token']=$token;
						session_set_userdata(array('review_data_id'=>$review_id,'review_inst'=>encode_data($inst_id),'review_course_id'=>encode_data($inst_course_id)));
					}else{
						$return['error']='Error occurred';
					}

					
				}else if($review_step_data=='step_11'){
					$inst_id=post_data('review_college_id');
					$inst_course_id=post_data('review_course');
					//echo $inst_id;die;
					$review_id=session_userdata('review_data_id');//post_data('review_id');
					//$review_step=post_data('review_step');
					$review_opt=post_data('review_opt');
					$review_rating=post_data('review_rating');
					//$review_q_type=post_data('review_q_type');
					$review_question=post_data('review_question');
					$review_q_type_title=post_data('review_q_type_title');
					$review_q_categor=post_data('review_q_category');

					$_review_data=$this->sm->get_review_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));
					$review_nice_title=post_data('review_nice_title');

					//echo session_userdata('review_id');die;
					$added=$this->sm->update_review_data(array('review_title'=>$review_nice_title,'review_agreed_tc'=>'1'),array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));
					$review_id=$_review_data->review_id;

					if($added){
						$return['next_step']='final';
						$return['review_id']=$review_id;
						session_set_userdata(array('review_data_id'=>$review_id));
						//$user_logo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';

				        //$user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

				        //$user_banner=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';

				        $profile_photo=base_url('uploads/app/default/no.jpg?tr=h-50,w-50,c-force');

				        if($user_id>0){
				            $profile_image_found=$this->sm->__get_user_file('user_storage_type,user_file_type_id,media_disk_path_relative',array('user_storage_type'=>'user_image','user_file_type_id'=>$user_id));

				            if(!empty($profile_image_found)){
				                $profile_photo=$profile_image_found->media_disk_path_relative;
				            }
				        }


				        $file_id_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_identity_proof','user_storage_type_2'=>'user_identity_proof_file','user_file_type'=>'8','user_file_type_id'=>$user_id));

				        if(!empty($file_id_proof_found) && !empty($file_id_proof_found->media_disk_path_relative) && file_exists($file_id_proof_found->media_disk_path)){
				        	$id_photo=$file_id_proof_found->media_disk_path_relative;
				        }else{
				        	$id_photo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';
				        }


				        $file_marksheet_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_marksheet','user_storage_type_2'=>'user_marksheet_file','user_file_type'=>'8','user_file_type_id'=>$user_id));

				        if(!empty($file_marksheet_proof_found) && !empty($file_marksheet_proof_found->media_disk_path_relative) && file_exists($file_marksheet_proof_found->media_disk_path)){
				        	$marksheet_photo=$file_marksheet_proof_found->media_disk_path_relative;
				        }else{
				        	$marksheet_photo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';
				        }

				        $review_status=$this->sm->get_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

						if(empty($review_status)){
							$this->sm->add_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_last_step'=>'step_10','review_approved'=>'incomplete_and_not_approved','review_course_id'=>$inst_course_id,'created_at'=>date('Y-m-d'),'created_by'=>$user_id));
						}else{
							$this->sm->update_review_status_data(array('review_last_step'=>$step_no),array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id));
						}


				        $this->data['file_logo']=$marksheet_photo;
				        $this->data['file_cover_image']=$id_photo;
				        $this->data['file_profile_image']=$profile_photo;
						$this->data['college_data']=$this->im->get_college_data(array('college_user_id'=>$inst_id));
						$view_page='_pages/webpage/others/vw_reviews_add_edit_step_final';

						$return['html']=$this->theme->view($view_page,$this->data,true);
					}else{
						$return['error']='Error occurred';
					}
				}
				else{
					$inst_id=post_data('review_college_id');
					$inst_course_id=post_data('review_course');
					//echo $inst_id;die;
					$review_id=session_userdata('review_data_id');//post_data('review_id');
					//$review_step=post_data('review_step');
					$review_opt=post_data('review_opt');
					$review_rating=post_data('review_rating');
					//$review_q_type=post_data('review_q_type');
					$review_question=post_data('review_question');
					$review_q_type_title=post_data('review_q_type_title');
					$review_q_categor=post_data('review_q_category');

					$_review_data=$this->sm->get_review_question_data(array('review_data_id'=>$review_id,
						'review_step'=>$review_step_data,
						'review_inst_id'=>$inst_id,
						'review_course_id'=>$inst_course_id,
						'review_user_id'=>$user_id));

					//print_obj($_review_data);die;

					$review_data=array(
						'review_data_id'=>$review_id,
						'review_step'=>$review_step_data,
						'review_inst_id'=>$inst_id,
						'review_course_id'=>$inst_course_id,
						'review_user_id'=>$user_id,
						'review_question_title'=>$review_q_type_title,
						'review_category'=>$review_q_category,
						'review_question'=>$review_question,
						'review_question_type'=>$review_q_type,
						'review_question_answer'=>$review_opt,
						'review_question_rating'=>$review_rating
					);


					//print_obj($review_data);die;


					if(empty($_review_data)){
						$added=$this->sm->add_review_question_data($review_data);
					}else{
						$added=$this->sm->update_review_question_data($review_data,array('review_data_id'=>$review_id,
						'review_step'=>$review_step_data,
						'review_inst_id'=>$inst_id,
						'review_course_id'=>$inst_course_id,
						'review_user_id'=>$user_id));

						//echo $added;die;
					}

					if($added){
						$review_status=$this->sm->get_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id));

						// if(empty($review_status)){
						// 	$this->sm->add_review_status_data(array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_last_step'=>'step_1','review_approved'=>'incomplete_and_not_approved','review_course_id'=>$inst_course_id,'created_at'=>date('Y-m-d'),'created_by'=>$user_id));
						// }

						if(!empty($review_status)){
							$this->sm->update_review_status_data(array('review_last_step'=>$step_no),array('review_uid'=>$token,'review_user_id'=>$user_id,'review_inst_id'=>$inst_id));
						}
						$return['next_step']=$step_no;
						$return['review_id']=$review_id;
						$return['review_token']=$token;
					}else{
						$return['error']='Error occurred';
					}
				}					


				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				rerdirect(base_url());
			}

		}else{
			rerdirect(base_url());
		}
	}

	public function onLoadReviewStepdata(){

		//print_obj($_SESSION);
		$user_id=decode_data(session_userdata('user_id'));
		$inst_id=decode_data(session_userdata('review_inst'));
		$inst_course_id=decode_data(session_userdata('review_course_id'));

		//echo $inst_course_id;die;

		//echo $inst_course_id;die;

		$step_no=post_data('review_step');

		$review_data=array();

		$current_year=date('Y');
		$past_30_year=$current_year-30;

		for ($i=$current_year; $i >=$past_30_year ; $i--) { 
			$enrollment_years[]=$i;
		}


		$this->data['enrollment_years']=$enrollment_years;

		$college_courses=$this->strm->get_inst_streams_courses(array('user_id'=>$inst_id));

        if(!empty($college_courses)){
        	foreach ($college_courses as $key => $value) {
        		$courses[]=array(
        			'course_id'=>$value->user_course,
        			'course_name'=>$value->course_name,
        			'selected'=>($value->user_course==$inst_course_id)?'selected':''
        		);
        	}
        }

        $this->data['inst_courses']=$courses;

		$this->data['statutory_bodies_10th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_10th'=>'yes'),FALSE);

		$this->data['statutory_bodies_12th']=$this->im->get_affiliation_types(array('statutory_body_is_board'=>'yes','statutory_body_for_12th'=>'yes'),FALSE);

		$this->data['caste_quota']=$this->sm->get_caste_quota(array('quota_status'=>'active'),FALSE);

		if($step_no=='step_10'){
			$rdata=$this->sm->get_review_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>'step_1'));
		}else{
			$rdata=$this->sm->get_review_data(array('review_user_id'=>$user_id,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_step'=>$step_no));
		}
		

		//print_obj($rdata);

		if(!empty($rdata)){

			$review_other_program_data=(!empty($rdata->review_other_program_data))?unserialize($rdata->review_other_program_data):'';

			if(!empty($review_other_program_data) && is_array($review_other_program_data)){
				foreach ($review_other_program_data as $key => $value) {
					$program[]=array(
						'name'=>$value['name'],
						'course'=>$value['course'],
						'reason'=>$value['reason']
					);
				}
			}else{
				$program=array();
			}

			//print_obj($program);die;

			//if($step_no=='step_10'){
				
			//}


			$review_data=array(
				'review_enroll_year'=>$rdata->review_enroll_year,
				'review_program_fees'=>$rdata->review_program_fees,
				'review_12th_board_id'=>$rdata->review_12th_board_id,
				'review_12th_board_percentage'=>$rdata->review_12th_board_percentage,
				'review_10th_board_id'=>$rdata->review_10th_board_id,
				'review_10th_board_percentage'=>$rdata->review_10th_board_percentage,
				'review_caste_quota_applicable'=>$rdata->review_caste_quota_applicable,
				'review_gd_pi_applicable'=>$rdata->review_gd_pi_applicable,
				'review_opt_hostel'=>$rdata->review_opt_hostel,
				'review_opt_hostel_fees'=>$rdata->review_opt_hostel_fees,
				'review_caste_quota_id'=>$rdata->review_caste_quota_id,
				'review_class_size'=>$rdata->review_class_size,
				'review_inst_placement_applicable'=>$rdata->review_inst_placement_applicable,
				'review_inst_internship_applicable'=>$rdata->review_inst_internship_applicable,
				'review_other_program_data'=>$program,
				'review_nice_title'=>$rdata->review_title,
				'review_agreed_tc'=>$rdata->review_agreed_tc,
				'review_course_id'=>encode_data($inst_course_id)
			);

			//print_obj($review_data);die;
		}

		//die;

		$this->data['review_data']=$review_data;

		$this->data['college_id']=$inst_id;
		$this->data['course_id']=$inst_course_id;

		//print_obj($this->data['review_data']);die;

		$this->data['review_question_data']=$this->sm->get_review_question_data(array('review_step'=>$step_no,'review_inst_id'=>$inst_id,'review_course_id'=>$inst_course_id,'review_user_id'=>$user_id));

		//print_obj($this->data['review_question_data']);die;

		$user_logo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';

        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

        $user_banner=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';


        $this->data['file_logo']=$user_logo;
        $this->data['file_cover_image']=$user_banner;

        $this->data['college_data']=$this->im->get_college_data(array('college_user_id'=>$inst_id));

        //print_obj($this->data['college_data']);die;

		$view_page='_pages/webpage/others/vw_reviews_add_edit_'.$step_no;

		$return['html']=$this->theme->view($view_page,$this->data,true);

		header('Content-Type: application/json');

		echo json_encode($return);
	}


	public function onUploadInstIdentityDocs(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$user_id=decode_data(session_userdata('user_id'));
				$user_data=$this->data['userdata'];

				$review_college_email_id=post_data('review_college_email_id');

				if(isset($_FILES['file_profile_photo']) && $_FILES['file_profile_photo']['name']!=''){
					$file_profile_found=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_storage_type_2'=>'user_profile_image','user_file_type_id'=>$user_id));

					if(!empty($file_profile_found)){
						if(is_file($file_profile_found->media_disk_path)){
							@unlink($file_profile_found->media_disk_path);
							$this->sm->delete_file(array('storage_id'=>$file_profile_found->storage_id));
						}
					}

					$profile_photo_data=array(
						'file_size'=>'4',
						'file_name'=>'file_profile_photo',
						'file_types'=>'png,jpg,jpeg',
						'file_folder'=>'identityfiles',
						'file_uploaded_by'=>$user_id,
						'file_compress'=>true,
						'file_compress_protocol'=>'webp'
					);

					$file_profile_id=$this->onUploadFiles($profile_photo_data);

					//print_obj($file_profile_id);die;



					if(!empty($file_profile_id) && is_numeric($file_profile_id) && $file_profile_id>0){

						$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_image','user_storage_type_2'=>'user_profile_image'));

			            $user_identity_storage_data=array(
			            	'user_file_storage_id'=>$file_profile_id,
			            	'user_file_type_id'=>$user_id,
			            	'user_file_type'=>$user_data->user_role,
			            	'user_storage_type'=>'user_image',
			            	'user_storage_type_2'=>'user_profile_image'
			            );

			            $this->sm->store_user_file($user_identity_storage_data);
			        }
				}

				if(isset($_FILES['file_idproof_image']) && $_FILES['file_idproof_image']['name']!=''){
					
					$file_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_identity_proof','user_storage_type_2'=>'user_identity_proof_file','user_file_type_id'=>$user_id));

					//print_obj($file_logo_found);die;

					if(!empty($file_proof_found)){
						if(is_file($file_proof_found->media_disk_path)){
							@unlink($file_proof_found->media_disk_path);
							$this->sm->delete_file(array('storage_id'=>$file_proof_found->storage_id));
						}
					}

					$identity_data=array(
						'file_size'=>'4',
						'file_name'=>'file_idproof_image',
						'file_types'=>'png,jpg,jpeg',
						'file_folder'=>'identityfiles',
						'file_uploaded_by'=>$user_id,
						'file_compress'=>true,
						'file_compress_protocol'=>'webp'
					);

					//print_obj($logo_data);die;

					$id_file_id=$this->onUploadFiles($identity_data);

					if(!empty($id_file_id) && is_numeric($id_file_id) && $id_file_id>0){

						$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_identity_proof','user_storage_type_2'=>'user_identity_proof_file'));

			            $user_identity_storage_data=array(
			            	'user_file_storage_id'=>$id_file_id,
			            	'user_file_type_id'=>$user_id,
			            	'user_file_type'=>$user_data->user_role,
			            	'user_storage_type'=>'user_identity_proof',
			            	'user_storage_type_2'=>'user_identity_proof_file'
			            );

			            $this->sm->store_user_file($user_identity_storage_data);
			        }							
				}

				if(isset($_FILES['file_marksheet_image']) && $_FILES['file_marksheet_image']['name']!=''){
					
					$file_proof_found=$this->sm->get_user_file(array('user_storage_type'=>'user_marksheet','user_storage_type_2'=>'user_marksheet_file','user_file_type_id'=>$user_id));

					//print_obj($file_logo_found);die;

					if(!empty($file_proof_found)){
						if(is_file($file_proof_found->media_disk_path)){
							@unlink($file_proof_found->media_disk_path);
							$this->sm->delete_file(array('storage_id'=>$file_proof_found->storage_id));
						}
					}

					$marksheet_data=array(
						'file_size'=>'4',
						'file_name'=>'file_marksheet_image',
						'file_types'=>'png,jpg,jpeg',
						'file_folder'=>'identityfiles',
						'file_uploaded_by'=>$user_id,
						'file_compress'=>true,
						'file_compress_protocol'=>'webp'
					);

					//print_obj($logo_data);die;

					$mark_file_id=$this->onUploadFiles($marksheet_data);

					if(!empty($mark_file_id) && is_numeric($mark_file_id) && $mark_file_id>0){

						$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_marksheet','user_storage_type_2'=>'user_marksheet_file'));

			            $user_marksheet_storage_data=array(
			            	'user_file_storage_id'=>$mark_file_id,
			            	'user_file_type_id'=>$user_id,
			            	'user_file_type'=>$user_data->user_role,
			            	'user_storage_type'=>'user_marksheet',
			            	'user_storage_type_2'=>'user_marksheet_file'
			            );

			            $this->sm->store_user_file($user_marksheet_storage_data);
			        }							
				}

				if(!empty($review_college_email_id)){
					$this->sm->delete_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_college_email','user_storage_type_2'=>'user_email'));

		            $user_marksheet_storage_data=array(
		            	'user_file_storage_id'=>'0',
		            	'user_file_type_id'=>$user_id,
		            	'user_file_type'=>$user_data->user_role,
		            	'user_storage_type'=>'user_college_email',
		            	'user_storage_type_2'=>'user_email'
		            );

		            $this->sm->store_user_file($user_marksheet_storage_data);

		            $return['success']='Thank you for the review.';
		            $return['redirect']=base_url().'account';
				}else{
					$return['error']='Please provide a valid email address';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				rerdirect(base_url());
			}
		}else{
			rerdirect(base_url());
		}
	}

	public function advertisement(){
		$segment_1=$this->uri->segment(1,0);//reviews


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1=='reviews')){
			$page_title='Subscription';
			$view_page='webpage/others/vw_advertisement_write';
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->data['page_title']=$page_title;

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	 
	}

	public function onLoadReviews(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$college_id=$this->input->get('_p');

			$reviews_data=array();

			if(!empty($college_id)){
				$inst_id=decode_data($college_id);



				$college_data=$this->im->_get_college(array('college_user_id'=>$inst_id));

				//echo $inst_id;die;

				$param['review_inst_id']=$inst_id;
				$param['review_approved']='approved';
	            $param['order'] = array('review_status_id' => 'DESC');

				$reviews=$this->sm->_get_review_status_data(null,$param,false,false);

				//print_obj($reviews);die;

				if(!empty($reviews)){
					foreach ($reviews as $key => $value) {
						$review_user_type=$value->review_user_type;

						if($review_user_type=='real'){

							$userdata=$this->um->get_user_data(array('user_id'=>$value->review_user_id),null,8);

							//print_obj($userdata);die;

							$user_full_name=ucwords($userdata->user_fullname);
							$user_short_name=createShortName($userdata->user_fullname);

							$qdata=$this->sm->get_review_question_data(array('review_user_id'=>$value->review_user_id,'review_inst_id'=>$inst_id),FALSE);

							$total=0;

							$rating=$this->sm->get_total_rating(array('review_user_id'=>$value->review_user_id,'review_inst_id'=>$inst_id));

							$average_out_of_10 = $rating->rating;

							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->review_course_id));

							if(!empty($course_slug)){
								$course_slug_value=$college_data->access_url.'/course-and-fees/'.$course_slug->slug_value;
							}else{
								$course_slug_value=$college_data->access_url.'/course-and-fees/'.url_slug($value->review_course_name);
							}


							$reviews_data[]=array(
								'user_full_name'=>$user_full_name,
								'user_short_name'=>$user_short_name,
								'user_image'=>'',
								'enroll_year'=>$value->review_enroll_year,
								'enroll_course'=>$value->review_course_name,
								'enroll_course_url'=>$course_slug_value,
								'review_date'=>date("F j, Y", strtotime($value->review_at)),
								'review_title'=>$value->review_title,
								'review_college_overview'=>$value->review_inst_overall,
								'review_remarks'=>$value->review_remarks,
								'review_details'=>$qdata,
								'class_size'=>$value->review_class_size,
								'course_fees'=>number_format($value->review_program_fees),
								'hostel_opt'=>$value->review_opt_hostel,
								'hostel_fee'=>number_format($value->review_opt_hostel_fees),
								'college_access_url'=>$college_data->access_url,
								'average_out_of_10'=>$average_out_of_10
							);

						}else if($review_user_type=='anonymous'){
							$anonymus_ids=$this->config->item('anonym_ids');

							$user_full_name=$anonymus_ids[$value->review_anonymid];
							$user_short_name=createShortName($anonymus_ids[$value->review_anonymid]);

							$qdata=$this->sm->get_review_question_data(array('review_user_anonymusid'=>$value->review_anonymid,'review_inst_id'=>$inst_id),FALSE);

							$total=0;

							$rating=$this->sm->get_total_rating(array('review_user_anonymusid'=>$value->review_anonymid,'review_inst_id'=>$inst_id));

							// print_obj($rating);die

							$average_out_of_10 = $rating->rating;

							$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->review_course_id));

							if(!empty($course_slug)){
								$course_slug_value=$college_data->access_url.'/course-and-fees/'.$course_slug->slug_value;
							}else{
								$course_slug_value=$college_data->access_url.'/course-and-fees/'.url_slug($value->review_course_name);
							}


							$reviews_data[]=array(
								'user_full_name'=>$user_full_name,
								'user_short_name'=>$user_short_name,
								'user_image'=>'',
								'enroll_year'=>$value->review_enroll_year,
								'enroll_course'=>$value->review_course_name,
								'enroll_course_url'=>$course_slug_value,
								'review_date'=>date("F j, Y", strtotime($value->review_at)),
								'review_title'=>$value->review_title,
								'review_college_overview'=>$value->review_inst_overall,
								'review_remarks'=>$value->review_remarks,
								'review_details'=>$qdata,
								'class_size'=>$value->review_class_size,
								'course_fees'=>number_format(floatval($value->review_program_fees)),
								'hostel_opt'=>$value->review_opt_hostel,
								'hostel_fee'=>number_format(floatval($value->review_opt_hostel_fees)),
								'college_access_url'=>$college_data->access_url,
								'average_out_of_10'=>$average_out_of_10
							);
						}
					}
				}

				$this->data['reviews_data']=$reviews_data;

				//print_obj($this->data['reviews_data']);die;

				
				$return['html']=$this->theme->view('_pages/webpage/others/reviews/vw_reviews_all',$this->data,true);

				//print_obj($return);die;

				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($return);
			}
		}
			
	}

}