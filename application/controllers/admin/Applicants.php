<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Applicants  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Applicants';

			$this->theme->title($this->data['page_title'])->load('users/vw_applicants', $this->data);


			$colleges=$this->im->get_college_specific_data('college_user_id',array('college_user_id!='=>null));

			// foreach ($colleges as $key => $value) {
			// 	$streams=$this->strm->get_user_course_stream_concat(array('user_id'=>$value->college_user_id,'stream_parent_id'=>null));

			// 	if(!empty($streams)){
			// 		echo $value->college_user_id.'='.$stream_parent_id ->stream_id.'<br>';
			// 	}
			// }


			// $streams=$this->strm->get_user_course_stream_user_distinct(array('stream_parent_id'=>null));

			// foreach ($streams as $key => $value) {
				

			// 	$stream_ids=$this->strm->get_user_course_stream_concat(array('user_id'=>$value->user_id));

			// 	echo $value->user_id.'='.$stream_ids->stream_id.'<br>';

			// 	$this->im->update_college_data(array('college_sub_streams_ids'=>$stream_ids->stream_id),array('college_user_id'=>$value->user_id));
			// }


		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchApplicantsList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'applicant_name',
					'applicant_email',
					'country_name',
					'city_name',
					'course_name'
				);

				$param['column_search'] = array('applicant_name','applicant_email','country_name','city_name','course_name');
				$param['order'] = array('application_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->um->_get_applicants($posts,$param,FALSE,FALSE);
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $user){
					$no++;

					$row = array();

					if($user->applicant_ph_verified=='yes'){
						$phone_verified=' <span class="badge badge-pill badge-success">Verified</span>';
					}else{
						$phone_verified=' <span class="badge badge-pill badge-danger">Not Verified</span>';
					}


					$applicats_details='<table style="text-align:left;border:none;">';
					$applicats_details.='<tbody>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Name:</b></td>';
					$applicats_details.='<td>'.ucwords($user->applicant_name).'</td>';
					$applicats_details.='</tr>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Email:</b></td>';
					$applicats_details.='<td>'.$user->applicant_email.'</td>';
					$applicats_details.='</tr>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Mobile. No.:</b></td>';
					$applicats_details.='<td>'.$user->applicant_ph.$phone_verified.'</td>';
					$applicats_details.='</tr>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Country:</b></td>';
					$applicats_details.='<td>'.$user->country_name.'</td>';
					$applicats_details.='</tr>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>City:</b></td>';
					$applicats_details.='<td>'.$user->city_name.'</td>';
					$applicats_details.='</tr>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Date:</b></td>';
					$applicats_details.='<td>'.date('d-m-Y',strtotime($user->application_date)).'</td>';
					$applicats_details.='<tr>';
					$applicats_details.='<td><b>Course interested in:</b></td>';
					$applicats_details.='<td>'.$user->course_name.'</td>';
					$applicats_details.='</tr>';	                    	
					$applicats_details.='</tbody>';
					$applicats_details.='</table>';

					
					$row[]	=	$no;
					$row[]	=	$applicats_details;

					if($user->application_inst_type=='4'){
						$inst_data=$this->im->get_college_profile_data(array('college_user_id'=>$user->application_inst_id));
						$inst_name=$inst_data->college_name;
						$inst_email=$inst_data->college_email;
						$inst_ph=$inst_data->college_phone_no;
						$inst_type='College';
					}else if($user->application_inst_type=='6'){
						$inst_data=$this->im->get_university_data(array('university_user_id'=>$user->application_inst_id));						
						$inst_name=$inst_data->university_name;
						$inst_email=$inst_data->college_email;
						$inst_ph=$inst_data->college_phone_no;
						$inst_type='University';
					}else if($user->application_inst_type='7'){
						$inst_data=$this->im->get_college_profile_data(array('college_user_id'=>$user->application_inst_id));
						$inst_name=$inst_data->college_name;
						$inst_email=(isset($inst_data->college_email))?$inst_data->college_email:'';
						$inst_ph=$inst_data->college_phone_no;
						$inst_type='College';
					}

					$inst_data_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user->application_inst_id,'user_storage_type'=>'user_logo'));

					if(!empty($inst_data_logo) && !empty($inst_data_logo->media_disk_path_relative)){
		                $inst_logo=$inst_data_logo->media_disk_path_relative;
		            }else{
		                $inst_logo=base_url().'uploads/app/default/no.jpg';
		            }

		            $inst_details='<table style="text-align:left;border:none;">';
		            $inst_details.='<tbody>';
					$inst_details.='<tr>';
					$inst_details.='<td><b>'.$inst_type.':</b></td>';
					if(!empty($inst_name)){
						$inst_details.='<td>'.$inst_name.'</td>';
					}else{
						$inst_details.='<td>Not Specified</td>';
					}
					
					$inst_details.='</tr>';
					$inst_details.='<tr>';
					$inst_details.='<td><b>Email:</b></td>';
					if(!empty($inst_email)){
						$inst_details.='<td>'.$inst_email.'</td>';
					}else{
						$inst_details.='<td>Not Specified</td>';
					}
					
					$inst_details.='</tr>';
					$inst_details.='<tr>';
					$inst_details.='<td><b>Ph. No.:</b></td>';
					if(!empty($inst_ph)){
						$inst_details.='<td>'.$inst_ph.'</td>';
					}else{
						$inst_details.='<td>Not Specified</td>';
					}
					
					$inst_details.='</tr>';
					$inst_details.='</tbody>';
		            $inst_details.='</table>';

					$row[]	=	 $inst_details;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_applicants($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_applicants($posts,$param,TRUE),
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
}