<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class REPORTS  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	public function scholarshipReports(){
	    
	    if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']="Scholarship Reports";
			$this->theme->title($this->data['page_title'])->load('reports/vw_scholarship_reports', $this->data);
				

		}else{
			redirect($this->data['admin_base_url']);
		}
	    
	}
	
	
	public function onSearchScholarshipReports(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$user_id=decode_data(session_userdata('admin_id'));

				//echo $user_id;die;
				$param['column_order'] = array(
					null,
					'scholarship_studentid',
					'scholarship_name',
					'scholarship_dob',
					'scholarship_address',
					'scholarship_pincode',
					'scholarship_qualification',
					'scholarship_course',
					'scholarship_hsmarksheet',
					'scholarship_adharcard',
					'scholarship_graduation',
					'scholarship_uploadat'
				);

				$param['column_search'] = array('scholarship_studentid','scholarship_name','scholarship_dob','scholarship_address','scholarship_pincode','scholarship_qualification','scholarship_course','scholarship_hsmarksheet','scholarship_adharcard','scholarship_graduation','scholarship_uploadat');
				$param['order'] = array('scholarship_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->rm->_get_scholoarship_application($posts,$param,FALSE,FALSE);

			//	print_obj($list);die;
				
				$data = array();
				$no = 0;

				$action='';

				

				foreach ($list as $user){
					$no++;

					$row = array();

					//$slug=$this->sm->get_slug(array('slug_type_id'=>$user->user_id,'slug_type'=>'7'));

	                
					$row[]	=	$no;
					$hsfile='';
					$gradfile='';
					$adharfile='';
					//check hs markshhet or other file upload or not
					if(isset($user->scholarship_hsmarksheet) && !empty($user->scholarship_hsmarksheet)){
					    
					    $hsfile=$this->db->query("select media_disk_path_relative as pathfile from way2_system_storage where storage_id='".$user->scholarship_hsmarksheet."'")->result();
					    //$filelinkhs=$this->rm->_get_file_link($user->scholarship_hsmarksheet);
					    $hsfilelink=$hsfile[0]->pathfile;
					    $hsfile='<a target="_blank" href="'.$hsfilelink.'">H.S Marksheet</a>';
					    
					}
					if(isset($user->scholarship_adharcard) && !empty($user->scholarship_adharcard)){
					    $filelinkadhar=$this->db->query("select media_disk_path_relative as pathfile from way2_system_storage where storage_id='".$user->scholarship_adharcard."'")->result();
					    $adharfilelink=$filelinkadhar[0]->pathfile;
					    $adharfile='<a target="_blank" href="'.$adharfilelink.'">Adhaar Card</a>';
					    
					}
					if(isset($user->scholarship_graduation) && !empty($user->scholarship_graduation)){
					    $filelinkgradua=$this->db->query("select media_disk_path_relative as pathfile from way2_system_storage where storage_id='".$user->scholarship_graduation."'")->result();
					    $gradfilelink=$filelinkgradua[0]->pathfile;
					    $gradfile='<a target="_blank" href="'.$gradfilelink.'">Graduation Marksheet</a>';
					    
					}
					
						

					//$row[]	= 	$college_data_row;
					$row[]	=	$user->scholarship_studentid;
					$row[]	=	ucwords($user->scholarship_name).'<br><span>DOB-<i>'.$user->scholarship_dob.'</i></span>';
					//$row[]	=	$user->scholarship_dob;
					$row[]	=	$user->scholarship_address.'<br>Pin-<span>'.$user->scholarship_pincode.'</span>';
					//$row[]	=	$user->scholarship_pincode;
					$row[]	=	$user->scholarship_qualification;
					$row[]	=	$user->scholarship_course;
					//$row[]='';
					$row[]	=	$hsfile.'<br>'.$adharfile.'<br>'.$gradfile;
					$row[]	=	$user->scholarship_uploadat;
					
					$row[]  =     '';

					//$row[]  =	'<button type="button" class="btn btn-xs btn-dark btn_edit_meta" data-college_user="'.encode_data($user->user_id).'" data-college_name="'.$college_name.'" data-meta_title="'.$meta_title.'" data-meta_desc="'.$meta_desc.'" data-meta_keywords="'.$meta_key.'" data-meta_og_title="'.$meta_og_title.'" data-meta_og_desc="'.$meta_og_desc.'" data-toggle="modal" data-target="#editCollegeMetaModal">Edit Meta</button>';	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->rm->_get_scholoarship_application($posts,$param,TRUE),
					"recordsFiltered" => $this->rm->_get_scholoarship_application($posts,$param,TRUE),
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