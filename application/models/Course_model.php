<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Course_model extends BaseModel
{
	public function store_course_data($data,$return_query=FALSE){
        $this->table='system_courses';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_course_data($param,$return_query=FALSE){
        $this->table='system_courses';
        return $this->remove($param,0,$return_query);
    }

    public function update_course_data($data,$param,$return_query=FALSE){
		$this->table='system_courses';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_course($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_courses';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_course_schedule($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_course_schedule';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function store_course_short_title_data($data,$return_query=FALSE){
        $this->table='system_courses_short_titles';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_course_short_title_data($param,$return_query=FALSE){
        $this->table='system_courses_short_titles';
        return $this->remove($param,0,$return_query);
    }

    public function update_course_short_title_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_short_titles';
		return $this->modify($data,$param,FALSE,$return_query);
	}


	public function _get_course($param,$param_or=NULL,$return_query=FALSE){
		$this->table='system_courses';
		$this->table_joined='system_storage';
		$fields='system_courses.*,system_storage.storage_id,system_storage.media_type_data_id,system_storage.media_disk_path,system_storage.media_disk_path_relative,system_storage.media_org_name';
		$joined_fields='system_storage.media_type_data_id=system_courses.course_id';

		return $this->get_joined($fields,$joined_fields,$param,$param_or,'LEFT','object',FALSE,$return_query);
	}


	public function store_course_prequisit_data($data,$return_query=FALSE){
        $this->table='system_courses_prerequisites';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_course_prequisit_data($param,$return_query=FALSE){
        $this->table='system_courses_prerequisites';
        return $this->remove($param,0,$return_query);
    }

    public function update_course_prequisit_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_prerequisites';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_course_prequisit($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_courses_prerequisites';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function store_course_sylabus_data($data,$return_query=FALSE){
        $this->table='system_courses_sylabus';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_course_sylabus_data($param,$return_query=FALSE){
        $this->table='system_courses_sylabus';
        return $this->remove($param,0,$return_query);
    }

    public function update_course_sylabus_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_sylabus';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_course_sylabus($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_courses_sylabus';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}


	public function _get_courses($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses.*,system_storage.media_disk_path_relative,system_storage.media_org_name');

		$this->db->join('system_storage','system_storage.media_type_data_id=system_courses.course_id','LEFT');

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
			
			$query = $this->db->get('system_courses');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	public function get_qualifications($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_qualifications';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

}