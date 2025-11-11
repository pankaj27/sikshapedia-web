<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Stream_model extends BaseModel
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

    public function get_course($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function __get_course($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}

	public function ___get_course($fields,$param,$single_row=TRUE,$limit_length=10,$limit_start=0,$return_query=FALSE){
		$this->table='system_courses';

		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific_limit($fields,$param,'course_id','ASC',$limit_length,$limit_start,$return_query);
		}		
	}

	public function _____get_courses($param,$fields=null,$order_by='course_id',$order='ASC',$return_query=FALSE){
		$this->db->select($fields);
		$this->db->join('system_slugs','system_slugs.slug_type_id=system_courses.course_id','LEFT');
		if($param!=NULL){
			$this->db->where($param);
		}

		$this->db->order_by($order_by,$order);
		$query = $this->db->get('system_courses');

		if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function __get_course_like($fields,$param,$like_field,$like_param,$single_row=TRUE,$return_query=FALSE){
		$this->db->select($fields);
		$this->db->where($param);
		$this->db->like($like_field, $like_param);
		$result=$this->db->get('system_courses');

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

	public function get_inset_courses($field,$field_value,$return_query=FALSE){
		$this->db->where('FIND_IN_SET("'.$field_value.'",'.$field.')<>0');
		$result=$this->db->get('system_courses');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->result();
		}
	}



	public function store_course_details_data($data,$in_batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_data';
        return $this->store($data,$in_batch,$return_query);
    }

    public function delete_course_details_data($param,$return_query=FALSE){
        $this->table='system_courses_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_course_details_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_course_details_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_data';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function get_course_categories($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_categories';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function __get_course_categories($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_categories';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}

	public function get_system_courses($param=null,$limit=6,$order_by='course_id',$order='ASC',$return_query=FALSE){
		$this->db->select('system_courses.course_id,system_courses.course_name');
		if($param!=NULL){
			$this->db->where($param);
		}


		$this->db->order_by($order_by,$order);
		$this->db->limit($limit);
		$query = $this->db->get('system_courses');

		if($return_query==FALSE){
			return $query->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}


	public function _get_courses($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses.*,system_courses_streams.stream_name');
		$this->db->join('system_courses_streams','system_courses_streams.stream_id=system_courses.course_stream','LEFT');

		$i = 0;

		if(isset($param['course_parent_id']) && $param['course_parent_id']!=NULL){
			$this->db->where('course_parent_id',$param['course_parent_id']);
		}

		if(isset($param['course_stream']) && $param['course_stream']!=NULL){
			$this->db->where('course_stream',$param['course_stream']);
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


	public function get_stream_category($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->db->select('system_courses_streams_categories.*,system_slugs.*');
		$this->db->join('system_slugs','system_slugs.slug_type_id=system_courses_streams_categories.stream_category_id','LEFT');
		$this->db->where($param);
		if($order_by!=null){
			$this->db->order_by($order_by,$order);
		}
		$query=$this->db->get('system_courses_streams_categories');
		if($single_row==TRUE){			
			return $query->first_row();
		}else if($single_row==FALSE){
			return $query->result();
		}
	}

	public function _get_stream_category($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams_categories';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function _get_course_categories($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_streams_categories.*');

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
			
			$query = $this->db->get('system_courses_streams_categories');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses_streams_categories');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	public function store_stream_data($data,$return_query=FALSE){
        $this->table='system_courses_streams';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_stream_data($param,$return_query=FALSE){
        $this->table='system_courses_streams';
        return $this->remove($param,0,$return_query);
    }

    public function update_stream_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_streams';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_stream($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function __get_stream($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
		}		
	}


	 public function __get_streams($param,$return_query=FALSE){
		$this->db->select('system_courses_streams.*');
		$this->db->like($param);		
		$query=$this->db->get('system_courses_streams');
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}

	public function get_streams_with_exam_url($param,$single=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_streams.*,system_slugs_urls.*');
		$this->db->join('system_slugs_urls','system_slugs_urls.url_type_id=system_courses_streams.stream_id','LEFT');
		$this->db->where($param);
		$this->db->order_by('stream_serial','ASC');
		$result=$this->db->get('system_courses_streams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			if($single==FALSE){
				return $result->result();
			}else if($single==TRUE){
				return $result->first_row();
			}
			
		}
	}



	public function get_inset_stream($field,$field_value,$return_query=FALSE){
		$this->db->where('FIND_IN_SET("'.$field_value.'",'.$field.')<>0');
		$result=$this->db->get('system_courses_streams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->result();
		}
	}


	public function get_group_concat($field_to_concat,$field,$field_value,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
		$result=$this->db->get('system_courses_streams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

	public function get_system_icon($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_icons';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}



	public function _get_streams($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_streams.*');

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
			
			$query = $this->db->get('system_courses_streams');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses_streams');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	public function store_degree_data($data,$return_query=FALSE){
        $this->table='system_courses_degrees';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_degree_data($param,$return_query=FALSE){
        $this->table='system_courses_degrees';
        return $this->remove($param,0,$return_query);
    }

    public function update_degree_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_degrees';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_degree($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_degrees';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function get_total_courses($param=null,$return_query=FALSE){
		$this->table='system_courses';
		return $this->get_total_count($param,$return_query);
	}

	public function _get_degrees($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_degrees.*,system_course_streams.stream_name');
		$this->db->join('system_course_streams','system_course_streams.stream_id=system_courses_degrees.degree_stream_id','LEFT');

		$i = 0;

		if(isset($param['stream_id'])){
			$this->db->where('degree_stream_id',$param['stream_id']);
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
			
			$query = $this->db->get('system_courses_degrees');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses_degrees');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	//Exams

	public function store_degree_exam_data($data,$return_query=FALSE){
        $this->table='system_courses_degrees_exams';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_degree_exam_data($param,$return_query=FALSE){
        $this->table='system_courses_degrees_exams';
        return $this->remove($param,0,$return_query);
    }

    public function update_degree_exam_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_degrees_exams';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_degree_exam($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_courses_degrees_exams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

	public function get_total_exams($param=null,$return_query=FALSE){
		$this->table='system_courses_degrees_exams';
		return $this->get_total_count($param,$return_query);
	}

	public function get_exam_states($param,$order_by='state_name',$order='ASC',$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('exam_state,state_name');
		$this->db->join('system_country_states','system_country_states.state_id=system_course_exams.exam_state','INNER');
		if($param!=NULL){
			$this->db->where($param);
		}

		$this->db->order_by($order_by, $order);

		$query=$this->db->get('system_course_exams');

		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $query->result();
		}
	}

	public function get_exam_countries($param,$order_by='country_name',$order='ASC',$return_query=FALSE){
		$this->db->distinct();
		$this->db->select('exam_country,country_name');
		$this->db->join('system_country','system_country.country_id=system_course_exams.exam_country','INNER');
		if($param!=NULL){
			$this->db->where($param);
		}

		$this->db->order_by($order_by, $order);

		$query=$this->db->get('system_course_exams');

		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $query->result();
		}
	}

	public function _get_total_exams($param=null,$in_set_field=NULL,$in_set_value=null,$return_query=FALSE){
		$this->db->select('system_course_exams.*');
		if($param!=NULL){
			$this->db->where($param);
		}

		if($in_set_field!=null && $in_set_value!=NULL){
			//$this->db->where('FIND_IN_SET('.$in_set_value.',"'.$in_set_field.'")<>0');

			$this->db->where_in($in_set_field,$in_set_value,FALSE);
		}

		$query=$this->db->get('system_course_exams');

		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $query->num_rows();
		}

	}

	public function _get_degree_exams($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_degrees_exams.*,system_courses_degrees.degree_name');
		$this->db->join('system_courses_degrees','system_courses_degrees_exams.exam_degree_id=system_courses_degrees.degree_id','LEFT');

		$i = 0;

		if(isset($param['degree_id'])){
			$this->db->where(array('exam_degree_id'=>$param['degree_id']));
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
			
			$query = $this->db->get('system_courses_degrees_exams');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses_degrees_exams');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	public function _get_exams($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		//$this->db->select('system_course_exams.*,system_courses_streams.stream_name');
		//$this->db->join('system_courses_streams','system_courses_streams.stream_id=system_course_exams.exam_stream_id','LEFT');

		// $this->db->select('system_course_exams.*,system_country.country_name,system_course_exams_data.*');
		$this->db->select('system_course_exams.*,system_country.country_name');
		$this->db->join('system_country','system_country.country_id=system_course_exams.exam_country','LEFT');
		//$this->db->join('system_course_exams_data','system_course_exams_data.exam_pk_id=system_course_exams.exam_id');

		$i = 0;

		if(isset($param['country']) && !empty($param['country'])){
			$this->db->where(array($this->db->dbprefix.'system_course_exams.exam_country'=>$param['country']));
		}

		if(isset($param['exam_state']) && !empty($param['exam_state'])){
			$this->db->where(array($this->db->dbprefix.'system_course_exams.exam_state'=>$param['exam_state']));
		}

		if(isset($param['exam_states']) && !empty($param['exam_states'])){
			$this->db->where_in($this->db->dbprefix.'system_course_exams.exam_state',$param['exam_states'],FALSE);
		}

		if(isset($param['stream_ids']) && !empty($param['stream_ids'])){
			$this->db->where('FIND_IN_SET('.$param['stream_ids'].','.$this->db->dbprefix.'system_course_exams.exam_stream_id)<>0');
		}


		if(isset($param['exam_mode']) && !empty($param['exam_mode'])){
			$this->db->where(array($this->db->dbprefix.'system_course_exams.exam_mode'=>$param['exam_mode']));
		}

		if(isset($param['exam_application_mode']) && !empty($param['exam_application_mode'])){
			$this->db->where(array($this->db->dbprefix.'system_course_exams.exam_application_mode'=>$param['exam_application_mode']));
		}


		if(isset($param['exam_practice_paper_available']) && !empty($param['exam_practice_paper_available'])){
			$this->db->where(array($this->db->dbprefix.'system_course_exams.exam_practice_paper_available'=>$param['exam_practice_paper_available']));
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
			
			$query = $this->db->get('system_course_exams');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_course_exams');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}



	public function _get_exams_dates($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_course_exams_data.*');

		$i = 0;

		if(isset($post['exam_id'])){
			$this->db->where(array('exam_pk_id'=>$post['exam_id']));
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
			
			$query = $this->db->get('system_course_exams_data');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_course_exams_data');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	public function store_exam_data($data,$return_query=FALSE){
        $this->table='system_course_exams';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_exam_data($param,$return_query=FALSE){
        $this->table='system_course_exams';
        return $this->remove($param,0,$return_query);
    }

    public function update_exam_data($data,$param,$return_query=FALSE){
		$this->table='system_course_exams';
		return $this->modify($data,$param,FALSE,$return_query);
	}


	public function get_exam_detailed_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams_data';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}


	public function store_exam_dates_data($data,$return_query=FALSE){
        $this->table='system_course_exams_data';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_exam_dates_data($param,$return_query=FALSE){
        $this->table='system_course_exams_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_exam_dates_data($data,$param,$return_query=FALSE){
		$this->table='system_course_exams_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}


	public function _get_exam_detailed_data($param,$param_where_in=null,$single_row=TRUE,$order_by=null,$order='DESC',$length=3,$start=0,$return_query=FALSE){
		$this->db->select('system_course_exams_data.*,system_course_exams.*');
		$this->db->join('system_course_exams','system_course_exams.exam_id=system_course_exams_data.exam_pk_id','LEFT');

		if($param!=null){
			$this->db->where($param);			
		}

		if(!is_null($param_where_in) || !empty($param_where_in) || $param_where_in!=''){
			$this->db->where_in($param_where_in['where_in'],$param_where_in['where_in_value'],FALSE);
		}

		

		if($single_row==TRUE){
			$this->db->order_by($order_by,$order);
		}

		if($single_row==FALSE){
			$this->db->limit($length,$start);
		}

		$result=$this->db->get('system_course_exams_data');

		if($single_row==TRUE){
			if($return_query==TRUE){
				return $this->db->last_query();
			}else{
				return $result->first_row();
			}
		}else{
			if($return_query==TRUE){
				return $this->db->last_query();
			}else{
				return $result->result();
			}
		}
	}

	public function __get_exam($fields,$param=array(),$order_by=null,$order=null,$return_query=FALSE){
		$this->table='system_course_exams';
		return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
	}

	


	public function _get_exam($param=null,$or_param=NULL,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->db->select('system_course_exams.*');

		if($param!=null){
			$this->db->where($param);
		}

		if($or_param!=null){
			$this->db->group_start();
			$this->db->or_where($or_param);
			$this->db->group_end();
		}

		if($single_row==TRUE){
			$this->db->order_by($order_by,$order);
		}

		$result=$this->db->get('system_course_exams');

		if($single_row==TRUE){
			if($return_query==TRUE){
				return $this->db->last_query();
			}else{
				return $result->first_row();
			}
		}else{
			if($return_query==TRUE){
				return $this->db->last_query();
			}else{
				return $result->result();
			}
		}
	}


	public function __get_exams($param,$return_query=FALSE){
		$this->db->select('system_course_exams.exam_full_name,system_course_exams.exam_short_name,system_course_exams.exam_status,system_course_exams.exam_id');
		$this->db->like($param);
		$query=$this->db->get('system_course_exams');
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}


	public function get_exam($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}

	public function get_exam_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams';
		if($single_row==TRUE){
			return $this->get_one_specific($fields,$param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many_specific($fields,$param,'exam_id','ASC',$return_query);
		}
	}

	public function __get_exam_specific($fields,$param,$param_or=null,$return_query=FALSE){
		$this->db->select($fields);
		$this->db->join('system_slugs_urls','system_course_exams.exam_id=system_slugs_urls.url_type_id','LEFT');
		$this->db->where('url_glob_type','exam_inner_menu');
		$this->db->where('url_sub_type','exam_inner_default_menu_url');
		$this->db->group_start();
		$this->db->like($param);
		if(!empty($param_or)){
			$this->db->or_like($param_or);
		}
		$this->db->group_end();
		$query=$this->db->get('system_course_exams');
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}

	public function get_indset_exam($field,$field_value,$join=FALSE,$param=NULL,$limit=NULL,$order_by=null,$order='ASC',$return_query=FALSE){
		if($join==TRUE){
			$this->db->select('system_course_exams.*,system_slugs_urls.*');
			$this->db->join('system_slugs_urls','system_course_exams.exam_id=system_slugs_urls.url_type_id','INNER');
			$this->db->where($param);
		}
		$this->db->where('FIND_IN_SET(`'.$field.'`,"'.$field_value.'")<>0');

		if($limit!=null){
			$this->db->limit($limit);
		}

		if($order_by!=null){
			$this->db->order_by($order_by,$order);
		}		

		$result=$this->db->get('system_course_exams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->result();
		}
	}

	public function get_inset_exam_count($field,$field_value,$return_query=FALSE){
		$this->db->where('FIND_IN_SET(`'.$field.'`,"'.$field_value.'")<>0');

		$result=$this->db->get('system_course_exams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->num_rows();
		}
	}


	public function get_exam_fees_structre($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->db->select('system_course_exams_fees_structure.*,system_caste_quota.quota_name');
		$this->db->join('system_caste_quota','system_course_exams_fees_structure.fees_structure_category=system_caste_quota.quota_id','LEFT');
		$this->db->where($param);
		//$this->db->group_by($group_by);
		$query=$this->db->get('system_course_exams_fees_structure');

		if($return_query==FALSE){
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}


	public function get_exam_rounds($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_cut_offs_rounds';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}

	public function store_user_courses_exam_data($data,$return_query=FALSE){
        $this->table='system_users_courses_exams';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_user_courses_exam_data($param,$return_query=FALSE){
        $this->table='system_users_courses_exams';
        return $this->remove($param,0,$return_query);
    }

    public function update_user_courses_exam_data($data,$param,$return_query=FALSE){
		$this->table='system_users_courses_exams';
		return $this->modify($data,$param,FALSE,$return_query);
	}

	public function get_user_courses_exam($param,$single_row=TRUE,$order_by=null,$order='DESC',$limit=NULL,$field='exam_name',$return_query=FALSE){
		$this->table='system_users_courses_exams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			if($limit!=null){
				return $this->get_distinct($param,$field,$limit,0,$order_by,$order,$return_query);
			}else{
				return $this->get_many($param,$order_by,$order,$return_query);
			}
			
		}
	}

	public function __get_courses($param,$param_or,$return_query=FALSE){
		$this->db->select('system_courses.course_id,system_courses.course_name,system_courses.course_short_name');
		$this->db->like($param);
		$this->db->or_like($param_or);
		$query=$this->db->get('system_courses');
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}


	public function _get_user_courses_exam($param,$group_by=null,$return_query=FALSE){
		$this->db->select('system_users_courses_exams.exam_id,system_users_courses_exams.exam_name,system_users_courses_exams.user_type,system_users_courses_exams.user_id,system_course_exams.exam_full_name,system_users_courses_exams.user_course_pk_id,system_users_courses_exams.course_id,system_courses.course_name,system_courses.course_short_name');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses_exams.course_id','LEFT');
		$this->db->join('system_course_exams','system_course_exams.exam_id=system_users_courses_exams.exam_id','LEFT');
		$this->db->where($param);
		$query=$this->db->get('system_users_courses_exams');

		if($return_query==FALSE){
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}


	public function _get_user_courses_exam_by_group($param,$group_by=null,$return_query=FALSE){
		$this->db->select('system_users_courses_exams.exam_name,system_users_courses_exams.user_course_pk_id,system_users_courses_exams.course_id,system_courses.course_name,system_courses.course_short_name');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses_exams.course_id','LEFT');
		$this->db->where($param);
		if($group_by!=null){
			$this->db->group_by($group_by);
		}
		
		$query=$this->db->get('system_users_courses_exams');

		if($return_query==FALSE){
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}


	public function __get_user_courses_exam_by_group($param,$fields=null,$group_by=null,$return_query=FALSE){
		$this->db->distinct();
		if($fields!=NULL){
			$this->db->select($fields);
		}else{
			$this->db->select('system_users_courses_exams.exam_id,system_users_courses_exams.exam_name,system_users_courses_exams.user_id,system_users_courses_exams.user_type,system_users_courses_exams.user_course_pk_id,system_users_courses_exams.course_id,system_courses.course_name,system_courses.course_short_name');
		}
		
		$this->db->join('system_courses','system_courses.course_id=system_users_courses_exams.course_id','LEFT');
		$this->db->where($param);
		if($group_by!=null){
			$this->db->group_by($group_by);
		}
		
		$query=$this->db->get('system_users_courses_exams');

		if($return_query==FALSE){
			return $query->result();
		}else{
			return $this->db->last_query();
		}
	}




	//Exam Details
	public function store_exam_details_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_course_exams_details_data';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_exams_details_data($param,$return_query=FALSE){
        $this->table='system_course_exams_details_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_exam_details_data($data,$param,$return_query=FALSE){
		$this->table='system_course_exams_details_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_exam_details_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams_details_data';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	//Exam Details


	//Stream Details
	public function store_stream_details_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_streams_details_data';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_stream_details_data($param,$return_query=FALSE){
        $this->table='system_courses_streams_details_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_stream_details_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_streams_details_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_stream_details_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams_details_data';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	//
	public function store_stream_details_courses_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_streams_details_data_courses';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_stream_details_courses_data($param,$return_query=FALSE){
        $this->table='system_courses_streams_details_data_courses';
        return $this->remove($param,0,$return_query);
    }

    public function update_stream_details_courses_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_streams_details_data_courses';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_stream_details_courses_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams_details_data_courses';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function store_stream_details_faq_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_streams_details_data_faqs';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_stream_details_faq_data($param,$return_query=FALSE){
        $this->table='system_courses_streams_details_data_faqs';
        return $this->remove($param,0,$return_query);
    }

    public function update_stream_details_faq_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_streams_details_data_faqs';
		return $this->modify($data,$param,FALSE,$return_query);
	}

    public function get_stream_details_faq_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_streams_details_data_faqs';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	//Stream Details

	public function get_course_program_type($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_program_type';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function get_user_course_stream($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_users_courses_streams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}

	public function _get_user_course_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT user_course ORDER BY user_course ASC) as course_idss');

		$this->db->where($param);

		$query = $this->db->get('system_users_courses');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}


	public function __get_user_course_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT user_course ORDER BY user_course ASC) as course_ids,GROUP_CONCAT(DISTINCT course_name ORDER BY course_name ASC) as course_names,GROUP_CONCAT(DISTINCT course_short_name ORDER BY course_short_name ASC) as course_short_name');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','LEFT');

		$this->db->where($param);

		$query = $this->db->get('system_users_courses');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function _get_user_course_exam_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT exam_id ORDER BY exam_id ASC) as exam_ids, GROUP_CONCAT(exam_name ORDER BY exam_id ASC) as exam_names');

		$this->db->where($param);

		$query = $this->db->get('system_users_courses_exams');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}


	public function _get_user_course_stream_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT stream_id ORDER BY stream_id ASC) as stream_ids,GROUP_CONCAT(DISTINCT stream_id ORDER BY stream_id ASC) as sub_stream_ids, GROUP_CONCAT(DISTINCT stream_name ORDER BY stream_id ASC) as stream_names');

		$this->db->where($param);

		$query = $this->db->get('system_users_courses_streams');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	} 

	public function _get_user_course_substream_groupconcat($param=array(),$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(stream_id ORDER BY stream_id ASC) as stream_ids, GROUP_CONCAT(stream_name ORDER BY stream_id ASC) as stream_names');

		$this->db->where($param);
		
		$query = $this->db->get('system_users_courses_streams');

		if($return_query==FALSE){
			return $query->first_row();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	} 

	
	public function _get_sub_streams($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_courses_sub_streams.*');

		$i = 0;

		if(isset($param['parent_stream'])){
			$this->db->where('FIND_IN_SET("'.$param['parent_stream'].'",sub_stream_parent_id)<>0');
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
			
			$query = $this->db->get('system_courses_sub_streams');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_courses_sub_streams');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}


	public function get_course_sub_stream($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_sub_streams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}

	public function store_course_sub_stream_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_sub_streams';
        return $this->store($data,$batch,$return_query);
    }

    public function update_course_stream_data($data,$param,$return_query=FALSE){
		$this->table='system_courses_sub_streams';
		return $this->modify($data,$param,FALSE,$return_query);
	}


	public function get_total_course_stream($param=null,$group_by=NULL,$return_query=FALSE){
		$this->table='system_users_courses_streams';
		return $this->get_total_count($param,$group_by,$return_query);
	}

	public function get_total_sub_stream($param=null,$group_by=NULL,$return_query=FALSE){
		$this->table='system_courses_sub_streams';
		return $this->get_total_count($param,$group_by,$return_query);
	}


	public function store_user_course_stream_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_courses_streams';
        return $this->store($data,$batch,$return_query);
    }

    public function get_user_course_stream_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_users_courses_streams';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}
	}

	public function get_group_concat_user_course_stream_data($field_to_concat,$param,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
		$this->db->where($param);
		$result=$this->db->get('system_users_courses_streams');
		if($return_query==TRUE){
			return $this->db->last_query();
		}else if($return_query==FALSE){
			return $result->first_row();
		}
	}

    public function delete_user_course_stream_data($param,$return_query=FALSE){
        $this->table='system_users_courses_streams';
        return $this->remove($param,0,$return_query);
    }

    public function update_user_course_stream_data($data,$param,$return_query=FALSE){
		$this->table='system_users_courses_streams';
		return $this->modify($data,$param,FALSE,$return_query);
	}

	public function get_cutoff_categories($param=null,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_cut_offs_categories';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function get_cutoffs($param=null,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_courses_cut_offs';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

	public function store_cutoffs($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_cut_offs';
        return $this->store($data,$batch,$return_query);
    }

	public function delete_cutoffs($param,$return_query=FALSE){
        $this->table='system_courses_cut_offs';
        return $this->remove($param,0,$return_query);
    }

	public function store_cutoff_categories($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_courses_cut_offs_categories';
        return $this->store($data,$batch,$return_query);
    }

	public function delete_cutoff_categories($param,$return_query=FALSE){
        $this->table='system_courses_cut_offs_categories';
        return $this->remove($param,0,$return_query);
    }

    public function update_cutoff_categories($data,$param,$return_query=FALSE){
		$this->table='system_courses_cut_offs_categories';
		return $this->modify($data,$param,FALSE,$return_query);
	}



	public function get_inst_streams($param,$return_query=FALSE){
		$this->db->select('system_users_courses.user_course_stream,system_courses_streams.stream_name');
		$this->db->join('system_courses_streams','system_courses_streams.stream_id=system_users_courses.user_course_stream ','INNER');
		$this->db->join('system_users_colleges','system_users_colleges.college_user_id=system_users_courses.user_id','INNER');
		$this->db->where($param);
		$this->db->group_by('user_course_stream');
		$this->db->order_by('stream_name','ASC');
		$result=$this->db->get('system_users_courses');
		if($return_query==FALSE){
			return $result->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}	
	}


	public function get_inst_streams_courses($param,$return_query=FALSE){
		$this->db->select('system_courses.course_id,system_users_colleges.college_user_id,system_users_colleges.college_name,system_users_colleges.access_url,system_users_colleges.college_state_id,,system_users_colleges.college_city_id,system_users_courses.user_course_stream,system_users_courses.user_course,system_courses.course_name,system_courses.course_short_name,system_courses.course_status');
		$this->db->join('system_courses','system_courses.course_id=system_users_courses.user_course','INNER');
		$this->db->join('system_users_colleges','system_users_colleges.college_user_id=system_users_courses.user_id','INNER');
		$this->db->where($param);
		$this->db->group_by('user_course');
		$this->db->order_by('course_name','ASC');
		$result=$this->db->get('system_users_courses');
		if($return_query==FALSE){
			return $result->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}



	///Preparation Guide
	public function store_exam_preperation_data($data,$return_query=FALSE){
        $this->table='system_course_exams_preparation_data';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_exam_preperation_data($param,$return_query=FALSE){
        $this->table='system_course_exams_preparation_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_exam_preperation_data($data,$param,$return_query=FALSE){
		$this->table='system_course_exams_preparation_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}

	public function _get_exam_prepperation_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
		$this->db->select('system_course_exams_preparation_data.*');

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
			
			$query = $this->db->get('system_course_exams_preparation_data');

			if($return_query==FALSE){
				return $query->result();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}		
			
		}else if($count==TRUE){
			$query = $this->db->get('system_course_exams_preparation_data');
			if($return_query==FALSE){
				return $query->num_rows();
			}else if($return_query==TRUE){
				return $this->db->last_query();
			}			
		}
	}

    public function get_exam_preperation_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams_preparation_data';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}


	public function store_exam_preperation_details_data($data,$return_query=FALSE){
        $this->table='system_course_exams_preperation_details_data';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_exam_preperation_details_data($param,$return_query=FALSE){
        $this->table='system_course_exams_preperation_details_data';
        return $this->remove($param,0,$return_query);
    }

    public function update_exam_preperation_details_data($data,$param,$return_query=FALSE){
		$this->table='system_course_exams_preperation_details_data';
		return $this->modify($data,$param,FALSE,$return_query);
	}


	public function get_exam_preperation_details_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->table='system_course_exams_preperation_details_data	';
		if($single_row==TRUE){
			return $this->get_one($param,'',$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$order_by,$order,$return_query);
		}		
	}

}