<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Country_model extends BaseModel
{

	public function add_country_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country';
		return $this->store($data,$batch,$return_query);
	}


	public function update_country_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_country_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_country';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function get_country($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function __get_country($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}

	public function _get_country($param,$single_row=TRUE,$return_query=FALSE){

		$this->db->select('system_country.*,system_currency.*');
		$this->db->join('system_currency','system_currency.currency_id=system_country.country_currency','LEFT');

		$this->db->where($param);

		$result=$this->db->get('system_country');
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


	public function _get_countries($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_country.*');

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
			
			$query = $this->db->get('system_country');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_country');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	//States

	public function get_total_states($param=null,$return_query=FALSE){
		$this->table='system_country_states';
		return $this->get_total_count($param,$return_query);
	}

	public function get_state($param=null,$return_query=FALSE){
		$this->table='system_country_states';
		return $this->get_one($param,$return_query);
	}

	public function get_states($param=null,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_states';
		return $this->get_many($param,$order_by,$order,$return_query);
	}

	public function __get_states($fields,$param=null,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_states';
		return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
	}

	public function get_state_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_states';
		if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        } 		
	}


	public function get_institute_states($param,$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('system_users_colleges.college_state_id,system_country_states.state_name');
		$this->db->join('system_country_states','system_users_colleges.college_state_id=system_country_states.state_id','LEFT');

		$this->db->where($param);
		$this->db->order_by('state_id','ASC');
		$result=$this->db->get('system_users_colleges');
		if($return_query==FALSE){
			return $result->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function add_state_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_states';
		return $this->store($data,$batch,$return_query);
	}

	public function get_group_concat_country_states($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_country_states');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function update_state_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_states';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function _get_states($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_country_states.*');

		if(isset($param['country'])){
			$this->db->where('state_country_id',$param['country']);
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
			
			$query = $this->db->get('system_country_states');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_country_states');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	//City

	public function get_total_cities($param=null,$return_query=FALSE){
		$this->table='system_country_cities';
		return $this->get_total_count($param,$return_query);
	}

	public function get_city($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_cities';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function get_city_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_cities';
		if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        } 		
	}

	public function __get_city($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_cities';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}

	public function get_institute_cities($param,$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('system_users_colleges.college_city_id,system_country_cities.city_name');
		$this->db->join('system_country_cities','system_users_colleges.college_city_id=system_country_cities.city_id','LEFT');

		$this->db->where($param);
		$this->db->order_by('city_id','ASC');
		$result=$this->db->get('system_users_colleges');
		if($return_query==FALSE){
			return $result->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function add_city_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_cities';
		return $this->store($data,$batch,$return_query);
	}

	public function update_city_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_cities';
		return $this->modify($data,$param,$batch,$return_query);
	}


	public function delete_city_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_country_cities';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function _get_cities($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_country_cities.*,system_country_states.state_name');
		$this->db->join('system_country_states','system_country_states.state_id=system_country_cities.city_state_id','LEFT');

		if(isset($param['country'])){
			$this->db->where('city_country_id',$param['country']);
		}

		if(isset($param['state'])){
			$this->db->where('city_state_id',$param['state']);
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
			
			$query = $this->db->get('system_country_cities');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_country_cities');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

	//Districts

	public function get_total_districts($param=null,$return_query=FALSE){
		$this->table='system_country_districts';
		return $this->get_total_count($param,$return_query);
	}

	public function get_district($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_districts';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function add_district_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_districts';
		return $this->store($data,$batch,$return_query);
	}

	public function update_district_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_districts';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_district_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_country_districts';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function _get_districts($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_country_districts.*,system_country_states.state_name');
		$this->db->join('system_country_states','system_country_states.state_id=system_country_districts.district_state_id','LEFT');

		if(isset($param['country'])){
			$this->db->where('district_country_id',$param['country']);
		}

		if(isset($param['state'])){
			$this->db->where('district_state_id',$param['state']);
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
			
			$query = $this->db->get('system_country_districts');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_country_districts');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	//Zipcodes
	public function add_country_zipcodes_data($data,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_zipcodes';
		return $this->store($data,$batch,$return_query);
	}


	public function update_country_zipcodes_data($data,$param,$batch=FALSE,$return_query=FALSE){
		$this->table='system_country_zipcodes';
		return $this->modify($data,$param,$batch,$return_query);
	}

	public function delete_country_zipcodes_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
		$this->table='system_country_zipcodes';
		if($soft_delete==FALSE){
			return $this->remove($param);
		}else if($soft_delete==TRUE){
			return $this->remove_soft($param,$deleted_by);
		}		
	}

	public function get_country_zipcodes($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_country_zipcodes';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function get_currency($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_currency';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


}