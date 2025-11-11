<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Reports_model extends BaseModel
{
    
    public function _get_scholoarship_application($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        
        $this->db->select(
			'system_scholarships.scholarship_studentid,
			 system_scholarships.scholarship_name,
			 system_scholarships.scholarship_dob,
			 system_scholarships.scholarship_address,
			 system_scholarships.scholarship_pincode,
			 system_scholarships.scholarship_qualification,
			 system_scholarships.scholarship_course,
			 system_scholarships.scholarship_hsmarksheet,
			 system_scholarships.scholarship_adharcard,
			 system_scholarships.scholarship_graduation,
			 system_scholarships.scholarship_uploadat
		    '

		);
		
	//	$query = $this->db->get('system_scholarships');

		if($count==FALSE){
		
			$query = $this->db->get('system_scholarships');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_scholarships');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	
        
        
    }
    
}