<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Scholarship_model extends BaseModel
{
	
	//get_alreday_applied
	public function get_userdata($userid,$course){
	    $this->table='system_scholarships';
	    $this->db->where(array('scholarship_userid'=>$userid,'scholarship_course'=>$course));
	    $result=$this->db->get($this->table)->result();
	    return $result();
	    
	}
	
	//save scholarship data
	public function save_scholarship_data($scholarship_data){
	    $this->table='system_scholarships';
	    $this->db->insert($this->table,$scholarship_data);
	    return $this->db->insert_id();
	}
    
}