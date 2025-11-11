<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Dashboard  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			//$this->update_university_url();die;

			//$admission_leads=$this->sm->_get_admissions_list(array('deleted_at'=>null));

			$userdata=$this->data['userdata'];
			$user_id=decode_data(session_userdata('admin_id'));
			$quota=array();
			if($userdata->user_role=='5'){
				if($userdata->user_bank_account_added=='2'){
					redirect($this->data['admin_base_url'].'/profile');
				}else{
					$month=date('m');
					$year=date('Y');

					//$param['month']=$month;
					$param['year']=$year;
					$param['created_by']=$user_id;
					//$param['updated_by']=$user_id;

					$total_university_uploaded = $this->im->_get_universities(null,$param,TRUE,FALSE);
					$total_college_uploaded = $this->im->_get_colleges(null,$param,TRUE,FALSE);

					//echo $total_college_uploaded;die;

					$param['is_verified_by_admin']='1';

					$total_university_uploaded_approved = $this->im->_get_universities(null,$param,TRUE,FALSE);
					$not_university_approved=($total_university_uploaded-$total_university_uploaded_approved);
					$total_university_uplaod_earning=($total_university_uploaded_approved*$userdata->user_per_upload_amount);


					$total_college_uploaded_approved = $this->im->_get_colleges(null,$param,TRUE,FALSE);
					$not_college_approved=($total_college_uploaded-$total_college_uploaded_approved);
					$total_college_upload_earning=($total_college_uploaded_approved*$userdata->user_per_upload_amount);


					$total_data_uploaded=($total_university_uploaded+$total_college_uploaded);
					$total_approved=($total_university_uploaded_approved+$total_college_uploaded_approved);
					$not_approved=($not_university_approved+$not_college_approved);
					$total_earning=($total_university_uplaod_earning+$total_college_upload_earning);


					$total_reviews=$this->um->get_total_review_data(array('created_by'=>$user_id,'review_approved'=>'1'));


					$quota=array(
						'month'=>date('F'),
						'year'=>date('Y'),
						'completed'=>number_format($total_data_uploaded),
						'approved'=>number_format($total_approved),
						'not_approved'=>number_format($not_approved),
						'total_earned'=>number_format($total_earning)
					);

					$this->data['quota']=$quota;

					$this->data['page_title']='Dashboard';
				

					$this->theme->title($this->data['page_title'])->load('dashboard/vw_dashboard', $this->data);
				}
				
			}else if($userdata->user_role=='2'){
				$month=date('m');
				$year=date('Y');

				$param['month']=$month;
				$param['year']=$year;
				$param['created_by']=$user_id;				

				$month=date('m');
				$year=date('Y');

				$param2['month']=($month-1);
				$param2['year']=$year;
				$param2['created_by']=$user_id;
				//$param2['updated_by']=$user_id;

				$total_college_uploaded_current_month = $this->im->_get_colleges(null,$param,TRUE,FALSE);
				$total_college_uploaded_prev_month = $this->im->_get_colleges(null,$param2,TRUE,FALSE);

				$param3['updated_month']=($month-1);
				$param3['updated_year']=$year;
				$param3['updated_by']=$user_id;
				$total_college_updated_prev_month = $this->im->_get_colleges(null,$param3,TRUE,FALSE);

				$_total_college_uploaded_prev_month=$total_college_uploaded_prev_month+$total_college_updated_prev_month;

				//print_obj($total_college_uploaded_prev_month);die;

				$prev_month = date("F", strtotime ( '-1 month' , strtotime ( date('Y-m-d') ) )) ;

				$quota=array(
					'month'=>date('F'),
					'prev_month'=>$prev_month,
					'year'=>date('Y'),
					'total_uploaded_current_month'=>number_format($total_college_uploaded_current_month),
					'total_uploaded_prev_month'=>number_format($_total_college_uploaded_prev_month),
				);

				$this->data['quota']=$quota;
				$this->theme->title($this->data['page_title'])->load('dashboard/vw_dashboard', $this->data);
			}
			else{
				$this->data['page_title']='Dashboard';

				//print_obj($this->data);die;

				$this->theme->title($this->data['page_title'])->load('dashboard/vw_dashboard', $this->data);
			}				
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	function update_university_url(){

		$udata=$this->im->__get_colleges(array('access_url'=>'https://www.sikshapedia.com/university'),'3');

		if(!empty($udata)){
			foreach ($udata as $key => $value) {
				if(!empty($value->city_id)){
					$slug=url_slug($value->college_name.' '.$value->city_name.' '.$value->state_name);
					$slug_url=base_url($value->country_iso_code_4.'/'.$slug);
					$this->im->update_college_data(array('access_url'=>$slug_url),array('college_id'=>$value->college_id));
				}
					
			}
		}

		// $udata2=$this->im->__get_colleges(null,'3');

		//print_obj($udata);
	}
}


