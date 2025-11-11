
<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Institution_model extends BaseModel
{

	public function _get_universities($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select(
			'system_users.user_id as user_id,
			system_users.user_role as user_role,
			system_users.user_name as user_name,
			system_users.user_password as user_password,
			system_users.user_blocked as user_blocked,
			system_users.user_last_login_ip as user_last_login_ip,
			system_users.user_last_login_time as user_last_login_time,
			system_users_universities.university_id,
			system_users_universities.university_user_id,
			system_users_universities.university_name,
			system_users_universities.university_govt_reg_code,			
			system_users_universities.university_email,
			system_users_universities.university_email_alter,
			system_users_universities.university_phone_no,
			system_users_universities.university_phone_no_alter,
			system_users_universities.university_estd_year,
			system_users_universities.university_status,
			system_users_universities.access_url,
			system_users_universities.created_by,
			system_users_universities.created_at as created_at,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'

		);

		$this->db->join('system_users','system_users_universities.university_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_universities.university_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_universities.university_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_universities.university_city_id','LEFT');
		$this->db->where('system_users.user_role','3');


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users_universities.created_by',$param['created_by']);
		}

		if(isset($param['updated_by']) && $param['updated_by']!=''){
			$this->db->geoup_start();
			$this->db->or_where('system_users_universities.updated_by',$param['updated_by']);
			$this->db->geoup_end();
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}


		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_universities.university_country_id',$param['country_id']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}


		if(isset($param['is_verified_by_admin']) && $param['is_verified_by_admin']!=''){
			$this->db->where('system_users_universities.is_verified_by_admin',$param['is_verified_by_admin']);
		}


		if(isset($param['month']) && $param['month']!=''){
			$this->db->where('MONTH('.$this->db->dbprefix.'system_users_universities.created_at)',$param['month']);
		}

		if(isset($param['year']) && $param['year']!=''){
			$this->db->where('YEAR('.$this->db->dbprefix.'system_users_universities.created_at)',$param['year']);
		}

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_universities');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_universities');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_universities($post=array(),$param=array(),$where_in=null,$where_in_multi=FALSE,$other_params=FALSE,$count=FALSE,$return_query=FALSE){

		if($other_params==TRUE){
			$this->db->select('system_users_universities.*,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name,
				system_users_courses.user_course,
				system_users_courses.user_course_stream'
			);
		}else{
			$this->db->select('system_users_universities.*,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name'
			);
		}			

		//$this->db->join('system_users','system_users_universities.university_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_universities.university_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_universities.university_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_universities.university_city_id','LEFT');

		if($other_params==TRUE){
			$this->db->join('system_users_courses','system_users_courses.user_id=system_users_universities.university_user_id','LEFT');
		}

		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users_universities.created_by',$param['created_by']);
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_universities.university_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_universities.university_state_id',$param['state_id']);
		}

		if(isset($param['city_id']) && $param['city_id']!=''){
			$this->db->where('system_users_universities.university_city_id',$param['city_id']);
		}


		if(isset($param['is_top']) && $param['is_top']!=''){
			$this->db->where('system_users_universities.university_is_top',$param['is_top']);
		}


		if(isset($param['is_verified']) && $param['is_verified']!=''){
			$this->db->where('system_users_universities.is_verified_by_admin',$param['is_verified']);
		}


		if(isset($param['status']) && $param['status']!=''){
			$this->db->where('system_users_universities.university_status',$param['status']);
		}

		if($where_in_multi==FALSE){
			if($where_in!=null && isset($where_in['param']) && isset($where_in['param_val'])){
				$this->db->where_in($where_in['param'],$where_in['param_val'],FALSE);
			}
		}else if($where_in_multi==TRUE){
			$this->db->group_start();

			if($where_in!=null && isset($where_in['params'])){
				foreach ($where_in['params'] as $key => $value) {
					$this->db->or_where_in($value['param'],$value['param_val'],FALSE);
				}
			}

			$this->db->group_end();
		}
			
		

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_universities');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_universities');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_university_profile_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_users_universities';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function __get_university_profile_data($fields,$param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_users_universities';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,'university_id','ASC',$return_query);
		}		
	}


	public function _get_university_profile_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->db->select('system_users_universities.*,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'
		);			
		$this->db->join('system_country','system_country.country_id=system_users_universities.university_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_universities.university_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_universities.university_city_id','LEFT');

		$this->db->where($param);
		$query=$this->db->get('system_users_universities');
		if($single_row==TRUE){
			if($return_query==FALSE){
				return $query->first_row();
			}else{
				return $this->db->last_query();
			}				
		}else{
			if($return_query==FALSE){
				return $query->result();
			}else{
				return $this->db->last_query();
			}
		}
	}

	public function add_universities_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_universities';
		return $this->store($data,$batch,$return_query);
	}

	public function update_universities_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_universities';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_university_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_universities';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function get_university_data($data,$return_query=FALSE){
		$this->table='system_users_universities';
		return $this->get_one($data,'',$return_query);
	}


	public function ____get_colleges($param, $fields = null,$single=TRUE, $limit = 10, $offset = 0, $return_query = false) {

	    $selectFields = !empty($fields) ? $fields : 'college_user_id,college_utype,college_is_university,CONCAT(college_name, "- [", college_short_name,"]") as college_formatted_name,college_short_name,access_url,college_state_id,college_city_id,college_country_id,state_name,city_name,college_logo,college_banner,college_logo_alt_text,college_banner_alt_text';

	    $this->db->select($selectFields);

	    $this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');

	    $this->db->where($param);

	    if($single==FALSE){
	    	$this->db->limit($limit, $offset);
	    }
	    

	    $query = $this->db->get('system_users_colleges');

	    if (!$return_query) {
	    	if($single==FALSE){
				return $query->result();
	    	}else{
	    		return $query->first_row();
	    	}	        
	    } else {
	        return $this->db->last_query();
	    }
	}


	public function _get__colleges($param=null,$order_by='college_id',$order='DESC',$return_query=FALSE){
		$this->db->select(
			'system_users.user_id as user_id,
			system_users.user_role as user_role,
			system_users.user_name as user_name,
			system_users.user_password as user_password,
			system_users.user_password_visible as user_password_visible,
			system_users.user_blocked as user_blocked,
			system_users.user_registration_type,
			system_users.user_last_login_ip as user_last_login_ip,
			system_users.user_last_login_time as user_last_login_time,
			system_users_colleges.college_id,
			system_users_colleges.college_user_id,
			system_users_colleges.college_state_id,
			system_users_colleges.college_city_id,
			system_users_colleges.college_country_id,
			system_users_colleges.college_course_ids,
			system_users_colleges.college_category_ids,
			system_users_colleges.college_name,
			system_users_colleges.college_govt_reg_code,			
			system_users_colleges.college_email,
			system_users_colleges.college_phone_no,
			system_users_colleges.college_alter_phone_no,
			system_users_colleges.college_estd_year,
			system_users_colleges.college_address,
			system_users_colleges.college_zipcode,
			system_users_colleges.access_url,
			system_users_colleges.access_url_slug,
			system_users_colleges.college_type,
			system_users_colleges.college_utype,
			system_users_colleges.college_streams_ids,
			system_users_colleges.college_is_featured,
			system_users_colleges.college_is_top,
			system_users_colleges.college_is_top_visible_home,
			system_users_colleges.college_is_featured_visible_in_menu,
			system_users_colleges.college_is_featured_visible_in_menu_id,
			system_users_colleges.college_facilities,
			system_users_colleges.college_affiliation_type,
			system_users_colleges.created_by,
			system_users_colleges.created_at as created_at,
			system_users_colleges.updated_at as updated_at,
			system_users_colleges.is_verified_by_admin,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'

		);

		$this->db->join('system_users','system_users_colleges.college_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');

		if(!empty($param)){
			$this->db->where($param);
		}

		$this->db->order_by($order_by, $order);

		$query = $this->db->get('system_users_colleges');

		if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}


	public function ___get__colleges($param = null, $order_by = 'college_id', $order = 'DESC', $limit = 6, $offset = 0, $return_query = FALSE)
	{
		$this->db->select(
			'system_users.user_id as user_id,
			system_users.user_role as user_role,
			system_users.user_name as user_name,
			system_users.user_password as user_password,
			system_users.user_password_visible as user_password_visible,
			system_users.user_blocked as user_blocked,
			system_users.user_registration_type,
			system_users.user_last_login_ip as user_last_login_ip,
			system_users.user_last_login_time as user_last_login_time,
			system_users_colleges.college_id,
			system_users_colleges.college_user_id,
			system_users_colleges.college_state_id,
			system_users_colleges.college_city_id,
			system_users_colleges.college_country_id,
			system_users_colleges.college_course_ids,
			system_users_colleges.college_category_ids,
			system_users_colleges.college_name,
			system_users_colleges.college_govt_reg_code,            
			system_users_colleges.college_email,
			system_users_colleges.college_phone_no,
			system_users_colleges.college_alter_phone_no,
			system_users_colleges.college_estd_year,
			system_users_colleges.college_address,
			system_users_colleges.college_zipcode,
			system_users_colleges.access_url,
			system_users_colleges.access_url_slug,
			system_users_colleges.college_type,
			system_users_colleges.college_utype,
			system_users_colleges.college_streams_ids,
			system_users_colleges.college_is_featured,
			system_users_colleges.college_is_top,
			system_users_colleges.college_is_top_visible_home,
			system_users_colleges.college_is_featured_visible_in_menu,
			system_users_colleges.college_is_featured_visible_in_menu_id,
			system_users_colleges.college_facilities,
			system_users_colleges.college_affiliation_type,
			system_users_colleges.created_by,
			system_users_colleges.created_at as created_at,
			system_users_colleges.updated_at as updated_at,
			system_users_colleges.is_verified_by_admin,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'
		);

		$this->db->join('system_users', 'system_users_colleges.college_user_id = system_users.user_id', 'LEFT');
		$this->db->join('system_country', 'system_country.country_id = system_users_colleges.college_country_id', 'LEFT');
		$this->db->join('system_country_states', 'system_country_states.state_id = system_users_colleges.college_state_id', 'LEFT');
		$this->db->join('system_country_cities', 'system_country_cities.city_id = system_users_colleges.college_city_id', 'LEFT');

		if (!empty($param)) {
			$this->db->where($param);
		}

		$this->db->order_by($order_by, $order);

		if (!is_null($limit)) {
			$this->db->limit($limit, $offset);
		}

		$query = $this->db->get('system_users_colleges');

		if ($return_query == FALSE) {
			return $query->result();
		} else if ($return_query == TRUE) {
			return $this->db->last_query();
		}
	}



	public function _get_colleges($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select(
			'system_users.user_id as user_id,
			system_users.user_role as user_role,
			system_users.user_name as user_name,
			system_users.user_password as user_password,
			system_users.user_password_visible as user_password_visible,
			system_users.user_blocked as user_blocked,
			system_users.user_registration_type,
			system_users.user_last_login_ip as user_last_login_ip,
			system_users.user_last_login_time as user_last_login_time,
			system_users_colleges.college_id,
			system_users_colleges.college_user_id,
			system_users_colleges.college_state_id,
			system_users_colleges.college_city_id,
			system_users_colleges.college_country_id,
			system_users_colleges.college_course_ids,
			system_users_colleges.college_category_ids,
			system_users_colleges.college_name,
			system_users_colleges.college_govt_reg_code,			
			system_users_colleges.college_email,
			system_users_colleges.college_phone_no,
			system_users_colleges.college_alter_phone_no,
			system_users_colleges.college_estd_year,
			system_users_colleges.college_address,
			system_users_colleges.college_zipcode,
			system_users_colleges.access_url,
			system_users_colleges.access_url_slug,
			system_users_colleges.college_type,
			system_users_colleges.college_utype,
			system_users_colleges.college_streams_ids,
			system_users_colleges.college_is_featured,
			system_users_colleges.college_is_top,
			system_users_colleges.college_is_top_visible_home,
			system_users_colleges.college_is_featured_visible_in_menu,
			system_users_colleges.college_is_featured_visible_in_menu_id,
			system_users_colleges.college_has_verified_badge,
			system_users_colleges.college_has_leads_access,
			system_users_colleges.college_max_leads,
            system_users_colleges.college_leads_start,
            system_users_colleges.college_leads_end,
			system_users_colleges.college_perday_leads,
			system_users_colleges.college_facilities,
			system_users_colleges.college_affiliation_type,
			system_users_colleges.college_logo,
			system_users_colleges.colllege_logo_alt_text,
			system_users_colleges.created_by,
			system_users_colleges.created_at as created_at,
			system_users_colleges.updated_at as updated_at,
			system_users_colleges.is_verified_by_admin,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'

		);

		$this->db->join('system_users','system_users_colleges.college_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');

		if(isset($param['user_role']) && $param['user_role']!=''){
			$this->db->where('system_users.user_role',$param['user_role']);
		}

		if(isset($param['college_utype']) && $param['college_utype']!=''){
			$this->db->where('system_users_colleges.college_utype',$param['college_utype']);
		}

		//$this->db->where('system_users.user_role','4');


		if(isset($param['user_id']) && $param['user_id']!=''){
			$this->db->where('system_users.user_id',$param['user_id']);
		}


		if(isset($param['not_college_id']) && $param['not_college_id']!=''){
			$this->db->where('system_users_colleges.college_user_id!=',$param['not_college_id']);
		}


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users.created_by',$param['created_by']);
		}

		if(isset($param['updated_by']) && $param['updated_by']!=''){
			$this->db->group_start();
			$this->db->or_where('system_users_colleges.updated_by',$param['updated_by']);
			$this->db->group_end();
		}


		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}


		if(isset($param['city_id']) && $param['city_id']!=''){
			$this->db->where('system_users_colleges.college_city_id',$param['city_id']);
		}


		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_colleges.college_state_id',$param['state_id']);
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}

		if(isset($param['inst_course_streams']) && $param['inst_course_streams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['inst_course_streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
		}


		if(isset($param['created_at']) && $param['created_at']!=''){
			$this->db->where('DATE('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['created_at']);
		}

		if(isset($param['updated_at']) && $param['updated_at']!=''){
			$this->db->where('DATE('.$this->db->dbprefix.'system_users_colleges.updated_at)',$param['updated_at']);
		}

		if(isset($param['updated_at_start']) && $param['updated_at_end']!=''){
			$this->db->group_start();
			$this->db->where('DATE('.$this->db->dbprefix.'system_users_colleges.updated_at)>=',$param['updated_at_start']);
			$this->db->where('DATE('.$this->db->dbprefix.'system_users_colleges.updated_at)<=',$param['updated_at_end']);
			$this->db->group_end();
		}

		if(isset($param['month']) && $param['month']!=''){
			$this->db->where('MONTH('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['month']);
		}

		if(isset($param['year']) && $param['year']!=''){
			$this->db->where('YEAR('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['year']);
		}


		if(isset($param['updated_month']) && $param['updated_month']!=''){
			$this->db->where('MONTH('.$this->db->dbprefix.'system_users_colleges.updated_at)',$param['updated_month']);
		}

		if(isset($param['updated_year']) && $param['updated_year']!=''){
			$this->db->where('YEAR('.$this->db->dbprefix.'system_users_colleges.updated_at)',$param['updated_year']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_colleges.college_state_id',$param['state_id']);
		}

		if(isset($param['inst_type']) && $param['inst_type']!=''){
			$this->db->where('system_users_colleges.college_type',$param['inst_type']);
		}



		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		if(isset($param['is_verified_by_admin']) && $param['is_verified_by_admin']!=''){
			$this->db->where('system_users_colleges.is_verified_by_admin',$param['is_verified_by_admin']);
		}


		if(isset($param['college_is_top']) && $param['college_is_top']!=''){
			$this->db->where('system_users_colleges.college_is_top',$param['college_is_top']);
		}

		if(isset($param['college_in_set']) && $param['college_in_set']!=''){
			$this->db->where('FIND_IN_SET('.$this->db->dbprefix.'system_users_colleges.college_user_id,'.$param['college_in_set'].')<>0');
		}

		if(isset($param['college_is_top_ranked']) && $param['college_is_top_ranked']!=''){
			$this->db->where('system_users_colleges.college_is_top_ranked',$param['college_is_top_ranked']);
		}


		if(isset($param['college_is_top_visible_home']) && $param['college_is_top_visible_home']!=''){
			$this->db->where('system_users_colleges.college_is_top_visible_home',$param['college_is_top_visible_home']);
		}

		if(isset($param['college_status']) && $param['college_status']!=''){
			$this->db->where('system_users_colleges.college_status',$param['college_status']);
		}

		if(isset($param['is_initial_review']) && $param['is_initial_review']!=''){
			$this->db->where('system_users_colleges.is_initial_visiblein_review',$param['is_initial_review']);
		}

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && isset($post['start']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_colleges');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_colleges');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function _get_college($param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select(
			'system_users.user_id as user_id,
			system_users.user_role as user_role,
			system_users.user_name as user_name,
			system_users.user_password as user_password,
			system_users.user_blocked as user_blocked,
			system_users.user_last_login_ip as user_last_login_ip,
			system_users.user_last_login_time as user_last_login_time,
			system_users_colleges.college_id,
			system_users_colleges.college_user_id,
			system_users_colleges.college_course_ids,
			system_users_colleges.college_category_ids,
			system_users_colleges.college_name,
			system_users_colleges.college_short_name,
			system_users_colleges.college_govt_reg_code,			
			system_users_colleges.college_email,
			system_users_colleges.college_phone_no,
			system_users_colleges.college_alter_phone_no,
			system_users_colleges.college_estd_year,
			system_users_colleges.college_address,
			system_users_colleges.college_zipcode,
			system_users_colleges.access_url,
			system_users_colleges.access_url_slug,
			system_users_colleges.college_is_featured,
			system_users_colleges.college_is_featured_visible_in_menu,
			system_users_colleges.college_is_featured_visible_in_menu_id,
			system_users_colleges.college_facilities,
			system_users_colleges.college_affiliation_type,
			system_users_colleges.created_by,
			system_users_colleges.created_at as created_at,
			system_users_colleges.college_country_id,
			system_users_colleges.college_state_id,
			system_users_colleges.college_city_id,
			system_users_colleges.is_verified_by_admin,
			system_country.country_name,
			system_country_cities.city_name,
			system_country_states.state_name'

		);

		$this->db->join('system_users','system_users_colleges.college_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');
		$this->db->where('system_users.user_role','4');


		if(isset($param['user_id']) && $param['user_id']!=''){
			$this->db->where('system_users.user_id',$param['user_id']);
		}


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users.created_by',$param['created_by']);
		}

		if(isset($param['updated_by']) && $param['updated_by']!=''){
			$this->db->group_start();
			$this->db->or_where('system_users_colleges.updated_by',$param['updated_by']);
			$this->db->group_end();
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['created_at']) && $param['created_at']!=''){
			$this->db->where('DATE('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['created_at']);
		}

		if(isset($param['month']) && $param['month']!=''){
			$this->db->where('MONTH('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['month']);
		}

		if(isset($param['year']) && $param['year']!=''){
			$this->db->where('YEAR('.$this->db->dbprefix.'system_users_colleges.created_at)',$param['year']);
		}


		if(isset($param['updated_month']) && $param['updated_month']!=''){
			$this->db->where('MONTH('.$this->db->dbprefix.'system_users_colleges.updated_at)',$param['updated_month']);
		}

		if(isset($param['updated_year']) && $param['updated_year']!=''){
			$this->db->where('YEAR('.$this->db->dbprefix.'system_users_colleges.updated_at)',$param['updated_year']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		if(isset($param['is_verified_by_admin']) && $param['is_verified_by_admin']!=''){
			$this->db->where('system_users_colleges.is_verified_by_admin',$param['is_verified_by_admin']);
		}


		if(isset($param['college_is_top']) && $param['college_is_top']!=''){
			$this->db->where('system_users_colleges.college_is_top',$param['college_is_top']);
		}

		if(isset($param['college_in_set']) && $param['college_in_set']!=''){
			$this->db->where('FIND_IN_SET('.$this->db->dbprefix.'system_users_colleges.college_user_id,'.$param['college_in_set'].')<>0');
		}

		if(isset($param['college_is_top_ranked']) && $param['college_is_top_ranked']!=''){
			$this->db->where('system_users_colleges.college_is_top_ranked',$param['college_is_top_ranked']);
		}


		if(isset($param['college_is_top_visible_home']) && $param['college_is_top_visible_home']!=''){
			$this->db->where('system_users_colleges.college_is_top_visible_home',$param['college_is_top']);
		}

		if(isset($param['college_status']) && $param['college_status']!=''){
			$this->db->where('system_users_colleges.college_status',$param['college_status']);
		}

		
		$query = $this->db->get('system_users_colleges');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}	
	}


	public function get_college_specific_data($fields,$param,$single_row=FALSE,$return_query=FALSE){
		$this->db->select($fields);
		$this->db->join('system_users','system_users_colleges.college_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');
		$this->db->where('system_users.user_role','4');

		$this->db->where($param);

		$result=$this->db->get('system_users_colleges');

		if($return_query==FALSE){
			if($single_row==FALSE){
				return $result->result();
			}else if($single_row==TRUE){
				return $result->first_row();
			}
		}else if($return_query==TRUE){
			$this->db->last_query();
		}

	}

	public function _____get_colleges($param=[],$return_query=FALSE){
		$this->db->select("
			way2_system_users_colleges.college_user_id, 
			way2_system_users_colleges.college_utype, 
			way2_system_users_colleges.college_is_university, 
			CASE 
				WHEN way2_system_users_colleges.college_short_name IS NULL OR way2_system_users_colleges.college_short_name = '' 
				THEN UPPER(way2_system_users_colleges.college_name) 
				ELSE UPPER(CONCAT(way2_system_users_colleges.college_name, ' - [ ', way2_system_users_colleges.college_short_name, ' ]')) 
			END as college_formatted_name, 
			way2_system_users_colleges.college_short_name, 
			way2_system_users_colleges.access_url, 
			way2_system_users_colleges.college_affiliation_type, 
			way2_system_users_colleges.college_state_id, 
			way2_system_users_colleges.college_city_id, 
			way2_system_users_colleges.college_country_id, 
			way2_system_country.country_name, 
			way2_system_country.country_currency_symbol, 
			way2_system_country_states.state_name, 
			way2_system_country_cities.city_name, 
			way2_system_users_colleges.college_logo, 
			way2_system_users_colleges.college_banner, 
			way2_system_users_colleges.colllege_logo_alt_text, 
			way2_system_users_colleges.colllege_banner_alt_text, 
			way2_system_users_colleges.college_is_featured, 
			way2_system_users_colleges.college_is_top, 
			way2_system_users_colleges.college_is_top_visible_home, 
			way2_system_users_colleges.college_has_verified_badge, 
			way2_system_users_colleges.college_short_order, 
			way2_system_users_colleges.college_is_visible_in_search, 
			way2_system_users_colleges.college_type, 
			way2_system_users_colleges.college_type_name, 
			way2_system_users_colleges.college_affiliation_type, 
			way2_system_users_colleges.college_streams_ids, 
			way2_system_users_colleges.college_course_ids, 
			way2_system_users_colleges.college_exam_ids, 
			way2_system_users_colleges.college_sub_streams_ids, 
			way2_system_users_colleges.college_facilities
		");

		$this->db->from('way2_system_users_colleges');
		$this->db->join('way2_system_country', 'way2_system_country.country_id = way2_system_users_colleges.college_country_id', 'left');
		$this->db->join('way2_system_country_states', 'way2_system_country_states.state_id = way2_system_users_colleges.college_state_id', 'left');
		$this->db->join('way2_system_country_cities', 'way2_system_country_cities.city_id = way2_system_users_colleges.college_city_id', 'left');

		if(isset($param['country_id'])){
			$this->db->where('way2_system_users_colleges.college_country_id', $param['country_id']);
		}

		if(isset($param['state_id'])){
			$this->db->where('way2_system_users_colleges.college_state_id', $param['state_id']);
		}

		if(isset($param['city_id'])){
			$this->db->where('way2_system_users_colleges.college_city_id', $param['city_id']);
		}

		if(isset($param['stream_id'])){
			$this->db->where('FIND_IN_SET(' . $param['stream_id'] . ', way2_system_users_colleges.college_streams_ids) <>', 0);
		}		

		if(isset($param['short_by_order']) && $param['short_by_order']=='yes'){
			$this->db->order_by('way2_system_users_colleges.college_short_order', 'ASC');
		}

		if(isset($param['short_by_verified_badge']) && $param['short_by_verified_badge']=='yes'){
			$this->db->order_by('way2_system_users_colleges.college_has_verified_badge', 'ASC');
		}
	
		//$this->db->order_by('way2_system_users_colleges.college_has_verified_badge = "yes"', 'DESC');

		//$this->db->limit(100, 0);

		$result = $this->db->get();

	    if ($return_query == FALSE) {
	        return $result->result();
	    } else if ($return_query == TRUE) {
	        return $this->db->last_query();
	    }
	}


	public function _get_college_specific_data($fields, $param, $like_param = array(), $limit = 10, $single_row = FALSE, $return_query = FALSE) {
	    $this->db->select($fields);
	    $this->db->join('system_country', 'system_country.country_id=system_users_colleges.college_country_id', 'LEFT');
	    $this->db->join('system_country_states', 'system_country_states.state_id=system_users_colleges.college_state_id', 'LEFT');
	    $this->db->join('system_country_cities', 'system_country_cities.city_id=system_users_colleges.college_city_id', 'LEFT');

	    if($param!=null){
	    	$this->db->where($param);
	    }	    

	    // Add LIKE queries
	    if (!empty($like_param)) {
	        foreach ($like_param as $field => $value) {
	            $this->db->like($field, $value);
	        }
	    }

	    // Add LIMIT
	    if (!is_null($limit)) {
	        $this->db->limit($limit);
	    }

	    $result = $this->db->get('system_users_colleges');

	    if ($return_query == FALSE) {
	        if ($single_row == FALSE) {
	            return $result->result();
	        } else if ($single_row == TRUE) {
	            return $result->first_row();
	        }
	    } else if ($return_query == TRUE) {
	        return $this->db->last_query();
	    }
	}



	public function ___get_colleges_data($param=array(),$returned_fields=NULL,$orlike=null,$order_by=NULL,$order=NULL,$limit=null,$offset=null,$return_query=FALSE){
			$this->table='system_users_colleges';

			return $this->get_like($param,$returned_fields,$orlike,$order_by,$order,$limit,$offset,$return_query);
	}


	public function __get_college_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){

		$this->db->select('system_users_colleges.*');

		$i = 0;

		if(isset($param['is_initial_review'])){
			$this->db->where(array('is_initial_visiblein_review',$param['is_initial_review']));
		}

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_colleges');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_colleges');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}

	}


	public function get_college_by_name($name) {
		$this->db->select('*');
		$this->db->from('system_users_colleges');
		$this->db->like('college_name', $name);
		$query = $this->db->get();
		return $query->result(); // Returns an array of results
	}
	


	public function get_colleges($post=array(),$param=array(),$where_in=null,$where_in_multi=FALSE,$other_params=FALSE,$count=FALSE,$return_query=FALSE){

		//$this->db->cache_on();

		if($other_params==TRUE){
			$this->db->select('system_users_colleges.college_id,
				system_users_colleges.college_type,
				system_users_colleges.college_utype,
				system_users_colleges.college_user_id,
				system_users_colleges.college_name,
				system_users_colleges.access_url,
				system_users_colleges.college_logo,
				system_users_colleges.college_banner,
				system_users_colleges.college_facilities,
				system_users_colleges.college_affiliation_type,
				system_users_colleges.college_is_featured,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name,
				system_users_courses.user_course,
				system_users_courses.user_course_stream,
				system_institute_types.inst_type_name_slug'
			);
		}else{
			$this->db->select('system_users_colleges.college_id,
				system_users_colleges.college_type,
				system_users_colleges.college_utype,
				system_users_colleges.college_user_id,
				system_users_colleges.college_name,
				system_users_colleges.access_url,
				system_users_colleges.college_logo,
				system_users_colleges.college_banner,
				system_users_colleges.college_facilities,
				system_users_colleges.college_affiliation_type,
				system_users_colleges.college_is_featured,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name,
				system_institute_types.inst_type_name_slug'
			);
		}			

		//$this->db->join('system_users','system_users_universities.university_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');
		$this->db->join('system_institute_types','system_institute_types.inst_type=system_users_colleges.college_type','LEFT');


		if(isset($param['show_in_search_grid']) && $param['show_in_search_grid']!=''){
			$this->db->where('system_users_colleges.college_is_visible_in_search',$param['show_in_search_grid']);
		}


		if($other_params==TRUE){
			$this->db->join('system_users_courses','system_users_courses.user_id=system_users_colleges.college_user_id','LEFT');
		}

		if(isset($param['college_id']) && $param['college_id']!=''){
			$this->db->where('system_users_colleges.college_id!=',$param['college_id']);
		}

		if(isset($param['college_user_id']) && $param['college_user_id']!=''){
			$this->db->where('system_users_colleges.college_user_id!=',$param['college_user_id']);
		}

		if(isset($param['college_university_id']) && $param['college_university_id']!=''){
			$this->db->where('system_users_colleges.college_university_id',$param['college_university_id']);
		}


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users_colleges.created_by',$param['created_by']);
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		if(isset($param['country_id']) && $param['country_id']!='' && $param['country_id']>0){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!='' && $param['state_id']>0){
			$this->db->where('system_users_colleges.college_state_id',$param['state_id']);
		}

		if(isset($param['city_id']) && $param['city_id']!='' && $param['city_id']>0){
			$this->db->where('system_users_colleges.college_city_id',$param['city_id']);
		}


		if(isset($param['is_university']) && $param['is_university']!=''){
			$this->db->where('system_users_colleges.college_is_university',$param['is_university']);
		}

		// if(isset($param['college_type']) && $param['college_type']!=''){
		// 	$this->db->where('system_users_colleges.college_type',$param['college_type']);
		// }else{
		// 	if(isset($param['sub_streams']) && $param['sub_streams']!=''){
		// 		$this->db->where('FIND_IN_SET("'.$param['sub_streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_sub_streams_ids)<>0');
		// 	}

		// 	if(isset($param['streams']) && $param['streams']!=''){
		// 		$this->db->where('FIND_IN_SET("'.$param['streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
		// 	}
		// }


		if(isset($param['sub_streams']) && $param['sub_streams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['sub_streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_sub_streams_ids)<>0');
		}

		if(isset($param['streams']) && $param['streams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
		}


		/*if(isset($param['inst_type_name_slug']) && $param['inst_type_name_slug']!=''){
			$this->db->where('system_institute_types.inst_type_name_slug',$param['inst_type_name_slug']);
		}else{
			if(isset($param['sub_streams']) && $param['sub_streams']!=''){
				$this->db->where('FIND_IN_SET("'.$param['sub_streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_sub_streams_ids)<>0');
			}

			if(isset($param['streams']) && $param['streams']!=''){
				$this->db->where('FIND_IN_SET("'.$param['streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
			}
		}*/


		// if(isset($param['college_approval_type']) && $param['college_approval_type']!=''){
		// 	$this->db->where('FIND_IN_SET("'.$param['college_approval_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_affiliation_type)<>0');
		// }

		if(isset($param['college_affiliation_type']) && $param['college_affiliation_type']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_affiliation_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_affiliation_type)<>0');
		}

		if(isset($param['college_category']) && $param['college_category']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_category'].'",'.$this->db->dbprefix.'system_users_colleges.college_category_ids)<>0');
		}

		if(isset($param['college_agency']) && $param['college_agency']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_agency'].'",'.$this->db->dbprefix.'system_users_colleges.college_agency_ids)<>0');
		}


		if(isset($param['is_top']) && $param['is_top']!=''){
			$this->db->where('system_users_colleges.college_is_top',$param['is_top']);
		}


		if(isset($param['is_verified']) && $param['is_verified']!=''){
			$this->db->where('system_users_colleges.is_verified_by_admin',$param['is_verified']);
		}


		if(isset($param['status']) && $param['status']!=''){
			$this->db->where('system_users_colleges.college_status',$param['status']);
		}

		if(isset($param['courses']) && $param['courses']!=''){
			$this->db->where('FIND_IN_SET("'.$param['courses'].'",'.$this->db->dbprefix.'system_users_colleges.college_course_ids)<>0');
		}

		


		if(isset($param['exams']) && $param['exams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['exams'].'",'.$this->db->dbprefix.'system_users_colleges.college_exam_ids)<>0');
		}

		if($where_in_multi==FALSE){
			if($where_in!=null && isset($where_in['param']) && isset($where_in['param_val'])){
				$this->db->where_in($where_in['param'],$where_in['param_val'],FALSE);
			}
		}else if($where_in_multi==TRUE){
			$this->db->group_start();

			if($where_in!=null && isset($where_in['params'])){
				foreach ($where_in['params'] as $key => $value) {
					$this->db->or_where_in($value['param'],$value['param_val'],FALSE);
				}
			}

			$this->db->group_end();
		}
			
		

		$i = 0;

		// if(isset($param['column_search'])){
		// 	foreach ($param['column_search'] as $item)
		// 	{
		// 		if(isset($post['search']['value']) && $post['search']['value'])
		// 		{
					
		// 			if($i===0)
		// 			{
		// 				$this->db->group_start();
		// 				$this->db->like($item, $post['search']['value']);
		// 			}
		// 			else
		// 			{
		// 				$this->db->or_like($item, $post['search']['value']);
		// 			}

		// 			if(count($param['column_search']) - 1 == $i)
		// 				$this->db->group_end();
		// 		}
				
		// 		$i++;
		// 	}
		// }

			
		// if(isset($post['order']))
		// {
		// 	$column_order=$param['column_order'];
		// 	$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		// } 
		// else if(isset($param['order']))
		// {
		// 	$order = $param['order'];
		// 	$this->db->order_by(key($order), $order[key($order)]);
		// }

		if(isset($param['order_by']) && isset($param['order'])){
			$this->db->order_by($param['order_by'], $param['order']);
		}

		

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_colleges');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_colleges');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_colleges_from_view($post=array(),$param=array(),$where_in=null,$where_in_multi=FALSE,$other_params=FALSE,$count=FALSE,$return_query=FALSE){

		$this->db->cache_on();

		if($other_params==TRUE){
			$this->db->select('system_users_colleges.college_id,
				system_users_colleges.college_user_id,
				system_users_colleges.college_name,
				system_users_colleges.access_url,
				system_users_colleges.college_facilities,
				system_users_colleges.college_affiliation_type,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name,
				system_users_courses.user_course,
				system_users_courses.user_course_stream'
			);
		}else{
			$this->db->select('system_users_colleges.college_id,
				system_users_colleges.college_user_id,
				system_users_colleges.college_name,
				system_users_colleges.access_url,
				system_users_colleges.college_facilities,
				system_users_colleges.college_affiliation_type,
				system_country.country_name,
				system_country_cities.city_name,
				system_country_states.state_name'
			);
		}

		$this->db->select('system_college_list_view.*');			

		//$this->db->join('system_users','system_users_universities.university_user_id=system_users.user_id','LEFT');
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');


		if(isset($param['show_in_search_grid']) && $param['show_in_search_grid']!=''){
			$this->db->where('system_users_colleges.college_is_visible_in_search',$param['show_in_search_grid']);
		}


		if($other_params==TRUE){
			$this->db->join('system_users_courses','system_users_courses.user_id=system_users_colleges.college_user_id','LEFT');
		}

		if(isset($param['college_id']) && $param['college_id']!=''){
			$this->db->where('system_users_colleges.college_id!=',$param['college_id']);
		}

		if(isset($param['college_university_id']) && $param['college_university_id']!=''){
			$this->db->where('system_users_colleges.college_university_id',$param['college_university_id']);
		}


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users_colleges.created_by',$param['created_by']);
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_colleges.college_state_id',$param['state_id']);
		}

		if(isset($param['city_id']) && $param['city_id']!=''){
			$this->db->where('system_users_colleges.college_city_id',$param['city_id']);
		}


		if(isset($param['college_type']) && $param['college_type']!=''){
			$this->db->where('system_users_colleges.college_type',$param['college_type']);
		}


		// if(isset($param['college_approval_type']) && $param['college_approval_type']!=''){
		// 	$this->db->where('FIND_IN_SET("'.$param['college_approval_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_affiliation_type)<>0');
		// }

		if(isset($param['college_affiliation_type']) && $param['college_affiliation_type']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_affiliation_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_affiliation_type)<>0');
		}

		if(isset($param['college_category']) && $param['college_category']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_category'].'",'.$this->db->dbprefix.'system_users_colleges.college_category_ids)<>0');
		}

		if(isset($param['college_agency']) && $param['college_agency']!=''){
			$this->db->where('FIND_IN_SET("'.$param['college_agency'].'",'.$this->db->dbprefix.'system_users_colleges.college_agency_ids)<>0');
		}


		if(isset($param['is_top']) && $param['is_top']!=''){
			$this->db->where('system_users_colleges.college_is_top',$param['is_top']);
		}


		if(isset($param['is_verified']) && $param['is_verified']!=''){
			$this->db->where('system_users_colleges.is_verified_by_admin',$param['is_verified']);
		}


		if(isset($param['status']) && $param['status']!=''){
			$this->db->where('system_users_colleges.college_status',$param['status']);
		}

		if(isset($param['courses']) && $param['courses']!=''){
			$this->db->where('FIND_IN_SET("'.$param['courses'].'",'.$this->db->dbprefix.'system_users_colleges.college_course_ids)<>0');
		}

		if(isset($param['sub_streams']) && $param['sub_streams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['sub_streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_sub_streams_ids)<>0');
		}

		if(isset($param['streams']) && $param['streams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['streams'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
		}


		if(isset($param['exams']) && $param['exams']!=''){
			$this->db->where('FIND_IN_SET("'.$param['exams'].'",'.$this->db->dbprefix.'system_users_colleges.college_exam_ids)<>0');
		}

		if($where_in_multi==FALSE){
			if($where_in!=null && isset($where_in['param']) && isset($where_in['param_val'])){
				$this->db->where_in($where_in['param'],$where_in['param_val'],FALSE);
			}
		}else if($where_in_multi==TRUE){
			$this->db->group_start();

			if($where_in!=null && isset($where_in['params'])){
				foreach ($where_in['params'] as $key => $value) {
					$this->db->or_where_in($value['param'],$value['param_val'],FALSE);
				}
			}

			$this->db->group_end();
		}
			

		$i = 0;


		$this->db->order_by($param['order_by'], $param['order']);

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_college_list_view');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_college_list_view');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function __get_filtered_colleges($param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select(
            'system_users_colleges.college_id,
            system_users_colleges.college_user_id,
            system_country.country_name,
            system_country_states.state_name,
            system_country_states.state_id,
            system_country_cities.city_name,
            system_country_cities.city_id,
            system_users_colleges.college_university_id,
            system_users_colleges.college_name,
            system_users_colleges.college_short_name,
            system_users_colleges.college_facilities,
            system_users_colleges.college_affiliation_type,
            system_users_colleges.access_url'
        );

        $this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
        $this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
        $this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');

        //$this->db->join('system_facilities','system_facilities.facility_id=system_users_colleges.college_user_id','INNER');
        //$this->db->join('system_storage ss','ss.storage_id=sus.user_file_storage_id','INNER');

        if(!empty($param['country_id'])){
            $this->db->where('system_users_colleges.college_country_id',$param['country_id']);
        }

        if(!empty($param['state_id'])){
            $this->db->where('system_users_colleges.college_state_id',$param['state_id']);
        }

        if(!empty($param['city_id'])){
            $this->db->where('system_users_colleges.college_city_id',$param['city_id']);
        }

        if(!empty($param['college_type'])){
            $this->db->where('system_users_colleges.college_type',$param['college_type']);
        }

        if(isset($param['course_id']) && $param['course_id']!=''){
            $this->db->where('FIND_IN_SET("'.$param['course_id'].'",'.$this->db->dbprefix.'system_users_colleges.college_course_ids)<>0');
        }

        if(isset($param['stream_id']) && $param['stream_id']!=''){
            $this->db->where('FIND_IN_SET("'.$param['stream_id'].'",'.$this->db->dbprefix.'system_users_colleges.college_streams_ids)<>0');
        }

        if(isset($param['sub_stream_id']) && $param['sub_stream_id']!=''){
            $this->db->where('FIND_IN_SET("'.$param['sub_stream_id'].'",'.$this->db->dbprefix.'system_users_colleges.college_sub_streams_ids)<>0');
        }


        if(isset($param['college_type']) && $param['college_type']!=''){
            $this->db->where('FIND_IN_SET("'.$param['college_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_type)<>0');
        }

        if(isset($param['college_affiliation_type']) && $param['college_affiliation_type']!=''){
            $this->db->where('FIND_IN_SET("'.$param['college_affiliation_type'].'",'.$this->db->dbprefix.'system_users_colleges.college_affiliation_type)<>0');
        }


        if(isset($param['college_exam_id']) && $param['college_exam_id']!=''){
            $this->db->where('FIND_IN_SET("'.$param['college_exam_id'].'",'.$this->db->dbprefix.'system_users_colleges.college_exam_ids)<>0');
        }

        $this->db->order_by($param['order_by'], $param['order']);
        
       if($count==FALSE){
            if(isset($param['length']) && $param['length'] != -1){
                $this->db->limit($param['length'],$param['start']);   
            }
            
            $query = $this->db->get('system_users_colleges');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_users_colleges');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
  
    }



    public function __get_colleges($param,$college_utype,$return_query=FALSE){
		$this->db->select('system_users_colleges.college_name,system_users_colleges.college_id,system_users_colleges.college_user_id,system_users_colleges.access_url,system_country.country_id,system_country.country_iso_code_4,system_country_cities.city_id,system_country_cities.city_name,system_country_states.state_id,system_country_states.state_name');
		$this->db->join('system_country','system_users_colleges.college_country_id=system_country.country_id','LEFT');
		$this->db->join('system_country_cities','system_users_colleges.college_city_id=system_country_cities.city_id','LEFT');
		$this->db->join('system_country_states','system_users_colleges.college_state_id=system_country_states.state_id','LEFT');
		$this->db->where('college_utype',$college_utype);
		if($param!=null){
			$this->db->like($param);	
		}
				
		$query=$this->db->get('system_users_colleges');
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}

	public function get__colleges($param) {
        $insert_user_stored_proc = "CALL get_colleges(".$param.")";
        $result = $this->db->query($insert_user_stored_proc);
        if ($result !== NULL) {
            return $query->result();
        }else{
        	return FALSE;
        }
        
    }


	public function get_colleges_count($param,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->get_total_count($param,NULL,NULL,$return_query=FALSE);
	}


	public function get_college_filter_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_users_college_filter.*');

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_college_filter.filter_college_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_college_filter.filter_college_state_id',$param['state_id']);
		}

		if(isset($param['city_id']) && $param['city_id']!=''){
			$this->db->where('system_users_college_filter.filter_college_city_id',$param['city_id']);
		}


		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_college_filter');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_college_filter');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_college_profile_duplicate($param=null,$param_or=null,$field=null,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->get_duplicates($param,$param_or,$field,$return_query);
	}

	public function _get_college_profile_duplicate($param=null,$param_or=null,$group_field=null,$field=null,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->_get_duplicates($param,$param_or,$group_field,$field,$return_query);
	}

	public function get_university_profile_duplicate($param=null,$param_or=null,$field=null,$return_query=FALSE){
		$this->table='system_users_universities';
		return $this->get_duplicates($param,$param_or,$field,$return_query);
	}


	public function get_college_profile_data($param,$single_row=TRUE,$return_query=FALSE){
		//$this->db->cache_on();
		$this->table='system_users_colleges';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function ___get_college_profile_data($fields,$param=NULL,$single_row=TRUE,$return_query=FALSE){
		//$this->db->cache_on();
		$this->db->select($fields);
		$this->db->join('system_country','system_country.country_id=system_users_colleges.college_country_id','LEFT');
		$this->db->join('system_country_cities','system_country_cities.city_id=system_users_colleges.college_city_id','LEFT');
		$this->db->join('system_country_states','system_country_states.state_id=system_users_colleges.college_state_id','LEFT');
		$this->db->join('system_institute_types','system_institute_types.inst_type=system_users_colleges.college_type','LEFT');
		$this->db->join('system_currency','system_currency.currency_id=system_users_colleges.college_currency_id','LEFT');
		if(!empty($param)){
			$this->db->where($param);
		}
		
		$result=$this->db->get('system_users_colleges');

		if($single_row==TRUE){
			if($return_query==TRUE){
				return $this->db->last_query();
			}else if($return_query==FALSE){
				return $result->first_row();
			}
		}elseif($single_row==FALSE){
			if($return_query==TRUE){
				return $this->db->last_query();
			}else if($return_query==FALSE){
				return $result->result();
			}
		}
	}

	public function __get_college_profile_data($fields,$param,$single_row=TRUE,$return_query=FALSE){
		//$this->db->cache_on();
		$this->table='system_users_colleges';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$return_query);
		}		
	}

	public function _get_college_profile_data($param,$like=null,$returned_fields='college_id',$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->get_like($param,$returned_fields,$like,null,null,null,null,$return_query);	
	}

	public function _get_college_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_users_colleges.*');

		if(isset($param['country_id']) && $param['country_id']!=''){
			$this->db->where('system_users_colleges.college_country_id',$param['country_id']);
		}

		if(isset($param['state_id']) && $param['state_id']!=''){
			$this->db->where('system_users_colleges.college_state_id',$param['state_id']);
		}

		if(isset($param['city_id']) && $param['city_id']!=''){
			$this->db->where('system_users_colleges.college_city_id',$param['city_id']);
		}


		if(isset($param['college_status']) && $param['college_status']!=''){
			$this->db->where('system_users_colleges.college_status',$param['college_status']);
		}


		if(isset($param['college_is_top_ranked']) && $param['college_is_top_ranked']!=''){
			$this->db->where('system_users_colleges.college_is_top_ranked',$param['college_is_top_ranked']);
		}


		if(isset($param['is_verified_by_admin']) && $param['is_verified_by_admin']!=''){
			$this->db->where('system_users_colleges.is_verified_by_admin',$param['is_verified_by_admin']);
		}


		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_colleges');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_colleges');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_college_data($data,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->get_one($data,'',$return_query);
	}

	public function add_college_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_college_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_colleges';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_college_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_institute_types($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_institute_types';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_institute_types_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_institute_types';
		if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        } 		
	}

	public function get_institute_categories($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_institute_category';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_group_concat_institute_categories($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_institute_category');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}


	public function add_affiliation_types($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_statutory_bodies';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_affiliation_types($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_statutory_bodies';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_affiliation_types($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_statutory_bodies';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_affiliation_types($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_statutory_bodies';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function __get_affiliation_types($fields,$param,$single_row=TRUE,$order_by=null,$order=null,$return_query=FALSE){
		$this->table='system_statutory_bodies';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}

	public function _get_affiliation_types($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_statutory_bodies.*');

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_statutory_bodies');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_statutory_bodies');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	public function get_group_concat_affiliation_types($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_statutory_bodies');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function get_grade_types($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_institute_grades';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_ranking_types($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_statutory_ranking_bodies';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function _get_ranking_types($param,$param_val,$return_query=FALSE){
		$this->table='system_statutory_ranking_bodies';
		return $this->get_in($param,$param_val,$return_query);
	}



	public function get_inst_ranking_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_institute_ranking_data';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,'ranking_body_id','ASC',$return_query);
		}		
	}

	public function get_group_concat_inst_ranking_data($param,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT inst_rank_id) as concated_value');
		$this->db->where($param);
		$result=$this->db->get('system_institute_ranking_data');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}


	public function _get_inst_ranking_data($param, $order_by = 'ranking_year', $order = 'DESC', $return_query = FALSE) {
    // Select all relevant fields from the tables
    $this->db->select('system_institute_ranking_data.*, system_statutory_ranking_bodies.*, system_statutory_ranking_categories.*, system_country_states.state_name');
    
    // Join with ranking bodies
    $this->db->join('system_statutory_ranking_bodies', 'system_statutory_ranking_bodies.rank_id = system_institute_ranking_data.ranking_body_id', 'LEFT');
    
    // Correct join with states (corrected table name to system_country_states)
    $this->db->join('system_country_states', 'system_country_states.state_id = system_institute_ranking_data.ranking_state_id', 'LEFT');
    
    // Join with ranking categories
    $this->db->join('system_statutory_ranking_categories', 'system_statutory_ranking_categories.rank_category_id = system_institute_ranking_data.ranking_category_id', 'LEFT');
    
    // Apply ordering
    $this->db->order_by($order_by, $order);
    
    // Apply where conditions
    $this->db->where($param);
    
    // Execute the query
    $query = $this->db->get('system_institute_ranking_data');
    
    // Return query or result based on $return_query flag
    if ($return_query === TRUE) {
        return $this->db->last_query();
    } else {
        return $query->result();
    }
}


	public function add_inst_ranking_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_institute_ranking_data';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_inst_ranking_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_institute_ranking_data';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}


	public function get_college_ranking_bodies($college_id, $return_query = FALSE) {
    // Select the required columns
    $this->db->select('ranking_body_id, system_statutory_ranking_categories.rank_category, system_statutory_ranking_bodies.rank_body, system_statutory_ranking_bodies.rank_body_alias, system_statutory_ranking_bodies.ranking_logo,system_institute_ranking_data.ranking_value,system_institute_ranking_data.ranking_value_outof,system_institute_ranking_data.ranking_year');
    
    // From main table
    $this->db->from('system_institute_ranking_data');
    
    // Join with system_statutory_ranking_bodies
    $this->db->join('system_statutory_ranking_bodies', 'system_statutory_ranking_bodies.rank_id = system_institute_ranking_data.ranking_body_id', 'left');
    
    // Join with system_statutory_ranking_categories based on ranking_category_id
    $this->db->join('system_statutory_ranking_categories', 'system_statutory_ranking_categories.rank_category_id = system_institute_ranking_data.ranking_category_id', 'left');
    
    // Where clause
    $this->db->where('ranking_inst_id', $college_id);
    
    // Group by ranking_body_id
    $this->db->group_by('ranking_body_id');
    
    // Execute query
    $query = $this->db->get();

    // Return the query or the result based on the $return_query flag
    if ($return_query === TRUE) {
        return $this->db->last_query();  // Return the SQL query string
    } else {
        return $query->result();  // Return the query result as an array of objects
    }
}


	public function update_inst_ranking_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_institute_ranking_data';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_ranking_categories($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_statutory_ranking_categories';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function add_departments($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_departments';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_departments($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_departments';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_departments($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_departments';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_departments($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_departments';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function _get_departments($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_departments.*');

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_departments');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_departments');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	public function get_subjects($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_subjects';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_qualifications($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_qualifications';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function get_group_concat_qualifications_data($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_qualifications');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function _get_faculties($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select(
			'system_users_faculties.faculty_id as faculty_id,
			system_users_faculties.faculty_type as faculty_type,
			system_users_faculties.faculty_type_id as faculty_type_id,
			system_users_faculties.faculty_name as faculty_name,
			system_users_faculties.facullty_contact_no as facullty_contact_no,
			system_users_faculties.faculty_email as faculty_email,
			system_users_faculties.faculty_academic_exp as faculty_academic_exp,
			system_users_faculties.faculty_qualifications as faculty_qualifications,
			system_designations.designation_name,
			system_departments.department_name,
			system_users_faculties.faculty_status as faculty_status'
		);


		$this->db->join('system_departments','system_departments.department_id=system_users_faculties.faculty_departments','LEFT');
		$this->db->join('system_designations','system_designations.designation_id=system_users_faculties.faculty_designation','LEFT');
		

		if(isset($param['faculty_type_id']) && $param['faculty_type_id']!=''){
			$this->db->where('system_users_faculties.faculty_type_id',$param['faculty_type_id']);
		}

		if(isset($param['faculty_type']) && $param['faculty_type']!=''){
			$this->db->where('system_users_faculties.faculty_type',$param['faculty_type']);
		}


		if(isset($param['created_by']) && $param['created_by']!=''){
			$this->db->where('system_users_colleges.created_by',$param['created_by']);
		}

		if(isset($param['city_name']) && $param['city_name']!=''){
			$this->db->where('system_country_cities.city_name',$param['city_name']);
		}


		if(isset($param['state_name']) && $param['state_name']!=''){
			$this->db->where('system_country_states.state_name',$param['state_name']);
		}


		if(isset($param['country_name']) && $param['country_name']!=''){
			$this->db->where('system_country.country_name',$param['country_name']);
		}

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_faculties');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_faculties');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function add_faculties_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_faculties';
		return $this->store($data,$batch,$return_query);
	}

	public function update_faculties_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_faculties';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_faculty_data($data,$return_query=FALSE){
		$this->table='system_users_faculties';
		return $this->get_one($data,'',$return_query);
	}

	public function get_designations($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_designations';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function delete_faculty_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_faculties';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function get_user_course_data($param,$single_row=TRUE,$limit=NULL,$return_query=FALSE){
		$this->table='system_users_courses';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			if($limit!=NULL){
				return $this->get_limit_many($param,$limit,0,'user_course_id','ASC',$return_query);
			}else{
				return $this->get_many($param,$return_query);
			}			
		}
	}

	public function get_user_course_data_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(user_course ORDER BY user_course ASC) as course_ids');

		$this->db->where($param);

		$query = $this->db->get('system_users_courses');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	} 

	public function _get_user_course_data($param,$where_in=null,$single=FALSE,$limit=NULL,$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('system_users_courses.*,system_courses.*,system_users_courses_cost_categories.category_id,system_users_courses_cost_categories.category_name');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');
		$this->db->join('system_users_courses_cost_categories','system_users_courses_cost_categories.category_id=system_users_courses.user_course_cost_category','LEFT');

		$this->db->where($param);

		if($where_in!=null){
			$this->db->where('FIND_IN_SET("'.$where_in.'",'.$this->db->dbprefix.'system_users_courses.user_course_stream)<>0');
		}

		$result=$this->db->get('system_users_courses');
		if($return_query==FALSE){
			if($single==TRUE){
				return $result->first_row();
			}else if($single==FALSE){
				if($limit==null){
					return $result->result();
				}else{
					$this->db->limit($limit,0);
					return $result->result();
				}
				
			}
			
		}else{
			return $this->db->last_query();
		}
	}

	public function ___get_user_course_data($param,$single=FALSE,$limit=NULL,$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('system_users_courses.*,system_courses.*');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');

		$this->db->where($param);

		$result=$this->db->get('system_users_courses');
		if($return_query==FALSE){
			if($single==TRUE){
				return $result->first_row();
			}else if($single==FALSE){
				if($limit==null){
					return $result->result();
				}else{
					$this->db->limit($limit,0);
					return $result->result();
				}
				
			}
			
		}else{
			return $this->db->last_query();
		}
	}

	public function __get_user_course_data($fields,$param,$single=FALSE,$limit=NULL,$return_query=FALSE){
		$this->db->distinct();
		$this->db->select($fields);
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');
		$this->db->join('system_users_courses_cost_categories','system_users_courses_cost_categories.category_id=system_users_courses.user_course_cost_category','LEFT');

		$this->db->where($param);

		$result=$this->db->get('system_users_courses');
		if($return_query==FALSE){
			if($single==TRUE){
				return $result->first_row();
			}else if($single==FALSE){
				if($limit==null){
					return $result->result();
				}else{
					$this->db->limit($limit,0);
					return $result->result();
				}
				
			}
			
		}else{
			return $this->db->last_query();
		}
	}

	public function get_group_concat_user_course_data($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_courses');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function _get_group_concat_user_course_data($param=null,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$this->db->dbprefix.'system_courses.course_short_name) as concated_value');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');
		if($param!=NULL){
			$this->db->where($param);
		}
		$result=$this->db->get('system_users_courses');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function add_course_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_courses';
		return $this->store($data,$batch,$return_query);
	}

	public function update_course_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_courses';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_course_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_courses';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}


	public function get_course_fees_categories_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_users_courses_cost_categories';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function add_course_fees_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_courses_cost';
		return $this->store($data,$batch,$return_query);
	}

	public function update_course_fees_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_courses_cost';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_course_fees_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_courses_cost';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}


	public function get_user_courses_cost_group($param,$group_by,$return_query=FALSE){
		$this->db->select('system_users_courses_cost.*');
		$this->db->where($param);
		$this->db->group_by($group_by);
		$result=$this->db->get('system_users_courses_cost');
		if($return_query==FALSE){
			return $result->result();
		}else{
			return $this->db->last_query();
		}
	}

	public function get_course_fees_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_users_courses_cost';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}


	public function get_user_course_cost_categories_in_set($param_val,$return_query=FALSE){
		$this->db->select('system_users_courses_cost_categories.category_name');
		$this->db->where_in('category_id',$param_val,FALSE);
		$query=$this->db->get('system_users_courses_cost_categories');
		if($return_query==FALSE){
			return $query->result();
		}else{
			return $this->db->last_query();
		}

	}

	public function _get_users_courses($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		//$this->db->cache_on();
		$this->db->select(
			'system_users_courses.*,system_courses.course_name,system_courses.course_short_name,system_courses.course_is_lateral'
		);

		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');


		if(isset($param['user_type']) && $param['user_type']!=''){
			$this->db->where('system_users_courses.user_type',$param['user_type']);
		}

		if(isset($param['user_id']) && $param['user_id']!=''){
			$this->db->where('system_users_courses.user_id',$param['user_id']);
		}

		if(isset($param['user_course']) && $param['user_course']!=''){
			$this->db->where('system_users_courses.user_course',$param['user_course']);
		}

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_users_courses');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_users_courses');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function _get_colleges_by_courses($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){


		//$this->db->cache_on();
		$this->db->from('system_users_courses AS wuc');
		$this->db->select(
			'wuc.user_course_id,
			wuc.user_course,
			wuc.user_course_placement_type,
			wuc.user_course_duration_year,
			wuc.user_course_duration_type,
		    wc.course_name,
		    wc.course_short_name,
		    wc.course_is_lateral,
		    wucol.college_user_id,
		    wucol.college_short_name,
		    wucol.college_name,
		    wucol.college_country_id,
		    wucol.college_state_id,
		    wucol.college_city_id,
		    wucol.access_url,
		    wsc.country_name,
		    wscs.state_name,
		    wccc.city_name'
		);

		$this->db->join('system_courses AS wc','wuc.user_course = wc.course_id','LEFT');
		$this->db->join('system_users_colleges AS wucol','wucol ON wucol.college_user_id = wuc.user_id','LEFT');
		$this->db->join('system_country AS wsc','wucol.college_country_id = wsc.country_id','LEFT');
		$this->db->join('system_country_states AS wscs','wucol.college_state_id = wscs.state_id','LEFT');
		$this->db->join('system_country_cities AS wccc','wucol.college_city_id = wccc.city_id','LEFT');


		if(isset($param['user_type']) && $param['user_type']!=''){
			$this->db->where('wuc.user_type',$param['user_type']);
		}

		if(isset($param['user_id']) && $param['user_id']!=''){
			$this->db->where('wuc.user_id',$param['user_id']);
		}

		if(isset($param['user_course']) && $param['user_course']!=''){
			$this->db->where('wuc.user_course',$param['user_course']);
		}

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get();

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get();
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function get_user_course($param=null,$return_query=FALSE){
		$this->db->select(
			'system_users_courses.*,system_courses.course_name,system_courses.course_short_name,system_courses.course_is_lateral'
		);

		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');


		if(isset($param['user_type']) && $param['user_type']!=''){
			$this->db->where('system_users_courses.user_type',$param['user_type']);
		}

		if(isset($param['user_id']) && $param['user_id']!=''){
			$this->db->where('system_users_courses.user_id',$param['user_id']);
		}

		if(isset($param['user_course']) && $param['user_course']!=''){
			$this->db->where('system_users_courses.user_course',$param['user_course']);
		}

		$query = $this->db->get('system_users_courses');
		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function get_total_insts_course_wise($param=null,$return_query=FALSE){
		$this->table='system_users_courses';
		return $this->get_total_count($param,NULL,NULL,$return_query);
	}

	public function get_user_course_grand_total($param=null,$return_query=FALSE){
		$this->table='system_users_courses_cost';
		return $this->get_sum('user_course_total_fee','total_cost',$param,$return_query);
	}


	public function get_user_course_avg($param=null,$return_query=FALSE){
		$this->table='system_users_courses_cost';
		return $this->get_avg('user_course_total_fee','total_cost',$param,$return_query);
	}

	public function get_hostels_data($param=array(),$return_query=FALSE){
		$this->table='system_hostels';
		return $this->get_many($param,$return_query);
	}

	public function add_hostels_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_hostels';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_hostels_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_hostels';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function get_hostels_notes_data($param=array(),$return_query=FALSE){
		$this->table='system_hostels_notes';
		return $this->get_one($param,'',$return_query);
	}

	public function add_hostels_notes_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_hostels_notes';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_hostels_notes_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_hostels_notes';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_hostels_notes_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_hostels_notes';
		return $this->modify($data,$param,$batch,$return_query);
	}


	public function add_hostels_total_fees_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_hostel_total_fees_data';
		return $this->store($data,$batch,$return_query);
	}

	public function get_hostels_total_fees_data($param=array(),$return_query=FALSE){
		$this->table='system_hostel_total_fees_data';
		return $this->get_one($param,'',$return_query);
	}

	public function delete_hostels_total_fees_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_hostel_total_fees_data';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_hostels_total_fees_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_hostel_total_fees_data';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_scholarship_data($param=array(),$return_query=FALSE){
		$this->table='system_scholarships';
		return $this->get_one($param,'',$return_query);
	}

	public function add_scholarship_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_scholarships';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_scholarship_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_scholarships';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}


	//Info data

	public function get_inst_info_data($param=array(),$return_query=FALSE){
		$this->table='system_users_general_infos';
		return $this->get_one($param,$return_query);
	}


	public function _get_inst_info_data($param=array(),$order_by='info_serial',$order='ASC',$return_query=FALSE){
		$this->db->select('system_users_general_infos.*');

		if(!empty($param)){
			$this->db->where($param);
		}

		$this->db->order_by($order_by,$order);

		$query=$this->db->get('system_users_general_infos');


		if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function __get_inst_info_data($param=array(),$or_param=array(),$order_by='info_serial',$order='ASC',$return_query=FALSE){
		$this->db->select('system_users_general_infos.*');

		if(!empty($param)){
			$this->db->where($param);
		}

		if(!empty($or_param)){
			$this->db->or_where($or_param);
		}

		$this->db->order_by($order_by,$order);

		$query=$this->db->get('system_users_general_infos');


		if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function add_inst_info_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_general_infos';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_inst_info_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_users_general_infos';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_inst_info_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_users_general_infos';
		return $this->modify($data,$param,$batch,$return_query);
	}


	//Info data


	//Total Universities

	public function get_total_universities($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
		$this->table='system_users_universities';
		return $this->get_total_count($param,$group_by,$find_in_set,$return_query);
	}


	//Total Colleges

	public function get_total_colleges($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
		$this->table='system_users_colleges';
		return $this->get_total_count($param,$group_by,$find_in_set,$return_query);
	}

	//Total Universities ini Courses

	public function get_total_user_courses($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
		$this->table='system_users_courses';
		return $this->get_total_count($param,$group_by,$find_in_set,$return_query);
	}


	//Approval Types
	public function get_approval_types($param=array(),$return_query=FALSE){
		$this->table='system_approval_types';
		return $this->get_many($param,$return_query);
	}

	public function get_approval_type($param=array(),$return_query=FALSE){
		$this->table='system_approval_types';
		return $this->get_one($param,$return_query);
	}

	//Ranking Agencies
	public function get_agencies($param=array(),$return_query=FALSE){
		$this->table='system_agencies';
		return $this->get_many($param,$return_query);
	}

	public function __get_agencies($fields,$param=array(),$order_by=null,$order=null,$return_query=FALSE){
		$this->table='system_agencies';
		return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
	}

	public function get_agency($param=array(),$return_query=FALSE){
		$this->table='system_agencies';
		return $this->get_one($param,'',$return_query);
	}

	public function add_agency_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_agencies';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_agency_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_agencies';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_agency_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_agencies';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function _get_agencies($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_agencies.*');

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_agencies');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_agencies');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	//Placement Companies
	public function get_placement_companies($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_placement_companies';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function _get_companies($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_placement_companies.*');

		$i = 0;

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_placement_companies');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_placement_companies');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	public function _get_placement_companies($param,$order_by=null,$order='DESC',$length=NULL,$start=0,$return_query=FALSE){
		$this->db->select('system_placement_companies.*');
		$this->db->where_in($this->db->dbprefix.'system_placement_companies.placement_company_id',$param['companies'],FALSE);
		if($order_by!=null){
			$this->db->order_by($order_by,$order);
		}

		if(isset($length) && $length != NULL){
			$this->db->limit($length,$start);	
		}

		$query=$this->db->get('system_placement_companies');
		if($return_query==TRUE){			
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $query->result();
		}
	}

	public function get_company_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_placement_companies';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }
    }

	public function add_company_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_company_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_placement_companies';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_company_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies';
		return $this->modify($data,$param,$batch,$return_query);
	}


	public function get_company_sectors_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_placement_companies_sectors';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }
    }



    public function add_company_freq_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies_frequent';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_company_freq_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_placement_companies_frequent';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_company_freq_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies_frequent';
		return $this->modify($data,$param,$batch,$return_query);
	}


	public function _get_company_freq_data_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT freq_company_id ORDER BY freq_company_id ASC) as freq_company_ids');

		$this->db->where($param);

		$query = $this->db->get('system_placement_companies_frequent');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function get_company_freq_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->db->select('system_placement_companies_frequent.*,system_placement_companies.*');
		$this->db->join('system_placement_companies','system_placement_companies.placement_company_id=system_placement_companies_frequent.freq_company_id','LEFT');

		$this->db->where($param);
		$result=$this->db->get('system_placement_companies_frequent');

        if($single_row==TRUE){
        	if($return_query==TRUE){
        		return $this->db->last_query();
        	}else{
        		return $result->first_row();
        	}
        }else if($single_row==FALSE){
        	if($return_query==TRUE){
        		return $this->db->last_query();
        	}else{
        		return $result->result();
        	}
        }
    }


	public function get_placement_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_placement_data';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}



	public function add_placement_pacakge_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_package';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_placement_pacakge_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_placement_package';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_placement_pacakge_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_package';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_placement_pacakge_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_placement_package';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}



	//Package Alumni

	public function add_placement_pacakge_alumni_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies_alumni';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_placement_pacakge_alumni_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_placement_companies_alumni';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_placement_pacakge_alumni_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_companies_alumni';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function get_placement_pacakge_alumni_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_placement_companies_alumni';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function _get_placement_pacakge_alumni_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->db->select('system_placement_companies_alumni.*,system_placement_companies.placement_company_name');
		$this->db->join('system_placement_companies','system_placement_companies.placement_company_id=system_placement_companies_alumni.alumni_type_id','LEFT');

		$this->db->where($param);
		$result=$this->db->get('system_placement_companies_alumni');

		if($single_row==TRUE){
			if($return_query==FALSE){
				return $result->first_row();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}else if($single_row==FALSE){
			if($return_query==FALSE){
				return $result->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}
		}		
	}


	public function __get_placement_pacakge_alumni_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->db->select('system_placement_companies_alumni.*,system_placement_companies_sectors.sector_name');
		$this->db->join('system_placement_companies_sectors','system_placement_companies_sectors.sector_id=system_placement_companies_alumni.alumni_type_id','LEFT');

		$this->db->where($param);
		$result=$this->db->get('system_placement_companies_alumni');

		if($single_row==TRUE){
			if($return_query==FALSE){
				return $result->first_row();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}else if($single_row==FALSE){
			if($return_query==FALSE){
				return $result->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}
		}		
	}


	

	//Package Aluimni


	public function _get_placement_data($param,$count=FALSE,$return_query=FALSE){
		$this->db->select('system_placement_data.*,system_placement_companies.placement_company_name');
		$this->db->join('system_placement_companies','system_placement_companies.placement_company_id=system_placement_data.placement_company','LEFT');
		$i = 0;

		if(isset($param['placement_type_id'])){
			$this->db->where('placement_type_id',$param['placement_type_id']);
		}

		if(isset($param['column_search'])){
			foreach ($param['column_search'] as $item)
			{
				if(isset($post['search']['value']) && $post['search']['value'])
				{
					
					if($i===0)
					{
						$this->db->group_start();
						$this->db->like($item, $post['search']['value']);
					}
					else
					{
						$this->db->or_like($item, $post['search']['value']);
					}

					if(count($param['column_search']) - 1 == $i)
						$this->db->group_end();
				}
				
				$i++;
			}
		}

			
		if(isset($post['order']))
		{
			$column_order=$param['column_order'];
			$this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
		} 
		else if(isset($param['order']))
		{
			$order = $param['order'];
			$this->db->order_by(key($order), $order[key($order)]);
		}

		if($count==FALSE){
			if(isset($post['length']) && $post['length'] != -1){
				$this->db->limit($post['length'],$post['start']);	
			}
			
			$query = $this->db->get('system_placement_data');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_placement_data');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}		
	}


	public function add_placement_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_placement_data';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_placement_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_placement_data';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}



	public function get_courses($param=null,$return_query=FALSE){
		$this->db->select(
			'system_courses.course_name,system_courses.course_short_name'
		);


		if(isset($param['course_name']) && $param['course_name']!=''){
			$this->db->where('system_courses.course_name',$param['course_name']);
		}

		if(isset($param['course_short_name']) && $param['course_short_name']!=''){
			$this->db->where('system_courses.course_short_name',$param['course_short_name']);
		}



		$query = $this->db->get('system_courses');
		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}


	public function _get_courses($against_val,$param=NULL,$param_or=NULL,$mode='BOOLEAN',$limit=null,$offset=null,$order_by='search_data_id',$order='ASC',$return_query=FALSE){
        $this->table='system_courses';
        return $this->get_match_against('course_id,course_name,course_short_name,course_short_name_2','course_short_name_2',$against_val,$param,$param_or,$mode,$order_by,$order,$limit,$offset,$return_query);     
    }


    //Institute Shortlist
    public function get_inst_shortlist_data($data,$return_query=FALSE){
		$this->table='ystem_shortlisted_institutes';
		return $this->get_one($data,'',$return_query);
	}

	public function add_inst_shortlist_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='ystem_shortlisted_institutes';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_inst_shortlist_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='ystem_shortlisted_institutes';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_inst_shortlist_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='ystem_shortlisted_institutes';
		return $this->modify($data,$param,$batch,$return_query);
	}



	//College Group Data
	public function add_college_group_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_institute_groups';
		return $this->store($data,$batch,$return_query);
	}

	public function delete_college_group_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_institute_groups';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function update_college_group_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_institute_groups';
		return $this->modify($data,$param,$batch,$return_query);
	}


	public function get_college_group_data($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_institute_groups';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_system_college_leads(){
		$this->table='system_college_leads';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}
	}

	public function add_system_college_leads($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_college_leads';
		return $this->store($data,$batch,$return_query);
	}

	public function update_system_college_leads($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_college_leads';
		return $this->modify($data,$param,$batch,$return_query);
	}




	///Favourite colleges
	
    public function store_favourite_institutions($data,$return_query=FALSE){
        $this->table='system_users_favourite_institutions';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_favourite_institutions($param,$return_query=FALSE){
        $this->table='system_users_favourite_institutions';
        return $this->remove($param,0,$return_query);
    }

    public function update_favourite_institutions($data,$param,$return_query=FALSE){
        $this->table='system_users_favourite_institutions';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_favourite_institutions($param,$single_row=TRUE,$fields=null,$return_query=FALSE){
		$this->table='system_users_favourite_institutions';
		if($single_row==TRUE){
            if($fields!=null){
              return $this->get_one_specific($fields,$param,'',$return_query);
            }else{
               return $this->get_one($param,$return_query); 
            }
			
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}




	///Compare colleges
	
    public function store_compare_institutions($data,$return_query=FALSE){
        $this->table='system_users_compare_institutions';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_compare_institutions($param,$return_query=FALSE){
        $this->table='system_users_compare_institutions';
        return $this->remove($param,0,$return_query);
    }

    public function update_compare_institutions($data,$param,$return_query=FALSE){
        $this->table='system_users_compare_institutions';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_compare_institutions($param,$single_row=TRUE,$fields=null,$return_query=FALSE){
		$this->table='system_users_compare_institutions';
		if($single_row==TRUE){
            if($fields!=null){
              return $this->get_one_specific($fields,$param,'',$return_query);
            }else{
               return $this->get_one($param,$return_query); 
            }
			
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function _get_compare_institutions($param, $single_row = FALSE, $return_query = FALSE) {
		$this->db->select('system_users_compare_institutions.*, system_users_colleges.*');
		$this->db->join('system_users_colleges', 'system_users_colleges.college_user_id = system_users_compare_institutions.comp_inst_id', 'LEFT');
	
		$this->db->where($param);
		$this->db->order_by('system_users_compare_institutions.comp_id', 'DESC'); // Order by comp_id DESC
	
		$result = $this->db->get('system_users_compare_institutions');
	
		if ($single_row) {
			return $return_query ? $this->db->last_query() : $result->first_row();
		} else {
			return $return_query ? $this->db->last_query() : $result->result();
		}
	}


	public function get_college_pages_by_search($search = '', $return_query = FALSE)
	{
	    $this->db->select('college_id,college_user_id,college_name');
	    $this->db->from('system_users_colleges');

	    if (!empty($search)) {
	        // Escapes special characters safely
	        $this->db->like('college_name', $search);
	    }

	    $query = $this->db->get();
	    if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	



}