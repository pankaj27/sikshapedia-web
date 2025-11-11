<?php defined('BASEPATH') or exit('No direct script access allowed');
/**
 * 
 */
class BaseModel extends CI_Model
{
	
	public $table='';
	public $table_joined='';
	public $primary_key='id';
	

	public function store($data,$batch=FALSE,$return_query=FALSE){
		if($return_query==FALSE){
			if($batch==FALSE){
				$this->db->insert($this->table,$data);
				return $this->db->insert_id();
			}else{
				return $this->db->insert_batch($this->table,$data);
			}	
		}else{
			return $this->db->set($data)->get_compiled_insert($this->table);
		}	
	}

	public function store_replace($data,$return_query=FALSE){
		if($return_query==FALSE){
			return $this->db->replace($this->table,$data);
		}else{
			$this->db->replace($this->table,$data);
			return $this->db->last_query();
		}
	}

	public function modify($data=array(),$param=array(),$batch=FALSE,$return_query=FALSE){
		if(!empty($data) && !empty($param)){
			if($return_query==FALSE){
				if($batch==FALSE){
					return $this->db->update($this->table,$data,$param);
				}else{
					return $this->db->update_batch($this->table,$data,$param);
				}
			}else{
				if($batch==FALSE){
					$this->db->update($this->table,$data,$param);
				}else{
					$this->db->update_batch($this->table,$data,$param);
				}
				return $this->db->last_query();
			}
		}else{
			return 'Data and param are empty';
		}		
	}

	public function remove($param,$truncate=0,$return_query=FALSE){
		if($return_query==FALSE){
			if($truncate==0){
				return $this->db->delete($this->table,$param);
			}else if($truncate==1){
				return $this->db->empty_table($this->table);
			}else if($truncate==2){
				return $this->db->truncate($this->table);
			}
		}else{
			if($truncate==0){
				$this->db->delete($this->table,$param);
			}else if($truncate==1){
				$this->db->empty_table($this->table);
			}else if($truncate==2){
				$this->db->truncate($this->table);
			}
			return $this->db->last_query();
		}	
	}

	public function remove_soft($param,$deleted_by,$return_query=FALSE){
		$data=array(
			'is_deleted'=>1,
			'deleted_by'=>$deleted_by,
			'deleted_date'=>date('Y-m-d H:i:s')
		);
		if($return_query==FALSE){			
			return $this->modify($data,$param,FALSE,$return_query=FALSE);
		}else{
			return $this->modify($data,$param,FALSE,TRUE);
		}
	}

	public function get_joined($fields,$joined_fields,$param,$param_or=NULL,$join_type='LEFT',$result_type='object',$return_multi=FALSE,$return_query=FALSE){
		$this->db->select($fields);
		if(is_array($this->table_joined)){
			foreach ($this->table_joined as $key => $value) {
				$this->db->join($value,$joined_fields[$key],$join_type);
			}
		}else{
			$this->db->join($this->table_joined,$joined_fields,$join_type);
		}

		if($return_query==FALSE){
			if($return_multi==FALSE){
				if($param_or!=NULL){
					$this->db->or_where($param_or);
				}else{
					$this->db->where($param);
				}
				$result=$this->db->get($this->table);
				return $result->first_row();
			}else{
				if($param_or!=NULL){
					$this->db->or_where($param_or);
				}else{
					$this->db->where($param);
				}
				$result=$this->db->get($this->table);
				if($result_type=='object'){
					return $result->result();
				}else if($result_type=='array'){
					return $result->result_array();
				}	
			}	
		}else{
			if($return_multi==FALSE){
				if($param_or!=NULL){
					$this->db->or_where($param_or);
				}else{
					$this->db->where($param);
				}
				$this->db->get($this->table);
				return $this->db->last_query();
			}else{
				if($param_or!=NULL){
					$this->db->or_where($param_or);
				}else{
					$this->db->where($param);
				}
				$this->db->get($this->table);
				return $this->db->last_query();	
			}			
		}	
	}

	

	public function get_one($param,$is_group='',$return_query=FALSE){
		if($return_query==FALSE){
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			return $this->db->get_where($this->table,$param)->first_row();
		}else{
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			$this->db->get_where($this->table,$param)->first_row();
			return $this->db->last_query();
		}		
	}

	public function get_one_specific($fields=null,$param,$is_group='',$return_query=FALSE){
		if($fields!=''){
			$this->db->select($fields);
		}
		if($return_query==FALSE){
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			return $this->db->get_where($this->table,$param)->first_row();
		}else{
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			$this->db->get_where($this->table,$param)->first_row();
			return $this->db->last_query();
		}		
	}

	public function get_one_order($param,$is_group='',$is_order='',$is_order_by='ASC',$return_query=FALSE){
		if($return_query==FALSE){
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			if($is_order!=''){
				$this->db->order_by($is_order,$is_order_by);
				$this->db->limit(1);
			}
			return $this->db->get_where($this->table,$param)->first_row();
		}else{
			if($is_group!=''){
				$this->db->group_by($is_group);
			}
			if($is_order!=''){
				$this->db->order_by($is_order,$is_order_by);
				$this->db->limit(1);
			}
			$this->db->get_where($this->table,$param)->first_row();
			return $this->db->last_query();
		}		
	}

	public function get_many($param=null,$order_by=null,$order='DESC',$return_query=FALSE){
		if($param==null || empty($param)){
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}				
				return $this->db->get($this->table)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->get($this->table);
				return $this->db->last_query();
			}
			
		}else{
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				return $this->db->get_where($this->table,$param)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->get_where($this->table,$param);
				return $this->db->last_query();
			}
		}
	}

	public function get_many_specific($fields,$param=null,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->db->select($fields);
		if($param==null || empty($param)){
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}				
				return $this->db->get($this->table)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->get($this->table);
				return $this->db->last_query();
			}
			
		}else{
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				return $this->db->get_where($this->table,$param)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->get_where($this->table,$param);
				return $this->db->last_query();
			}
		}
	}

	public function get_limit_many($param=null,$length=6,$start=0,$order_by=null,$order='DESC',$return_query=FALSE){
		if($param==null || empty($param)){
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->limit($length,$start);				
				return $this->db->get($this->table)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->limit($length,$start);
				$this->db->get($this->table);
				return $this->db->last_query();
			}
			
		}else{
			if($return_query==FALSE){
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}

				$this->db->limit($length,$start);
				return $this->db->get_where($this->table,$param)->result();
			}else{
				if($order_by!=null){
					$this->db->order_by($order_by,$order);
				}
				$this->db->limit($length,$start);
				$this->db->get_where($this->table,$param);
				return $this->db->last_query();
			}
		}
	}

	public function get_order_many($param=null,$order_by='',$order='ASC',$return_query=FALSE){
		if($param==null || empty($param)){
			if($return_query==FALSE){
				if($order_by!=''){
					$this->db->order_by($order_by,$order);
				}
				return $this->db->get($this->table)->result();
			}else{
				if($order_by!=''){
					$this->db->order_by($order_by,$order);
				}
				$this->db->get($this->table)->result();
				return $this->db->last_query();
			}
			
		}else{
			if($return_query==FALSE){
				$this->db->where($param);
				if($order_by!=''){
					$this->db->order_by($order_by,$order);
				}
				return $this->db->get($this->table)->result();
			}else{
				$this->db->where($param);
				if($order_by!=''){
					$this->db->order_by($order_by,$order);
				}
				return $this->db->get($this->table)->result();
				return $this->db->last_query();
			}
		}
	}

	public function get_like($param=NULL,$returned_fields=NULL,$orlike=null,$order_by=NULL,$order=NULL,$limit=null,$offset=null,$return_query=FALSE){
		if($returned_fields!=NULL){
			$this->db->select($returned_fields);
		}
		
		if($orlike==''){
			$this->db->like($param);
		}else if($orlike!=''){
			$this->db->like($param);
			if(is_array($orlike)){
				foreach ($orlike as $key => $value) {
					$this->db->or_like($value);
				}
			}			
		}
		$this->db->order_by($order_by, $order);
		if($limit==null && $offset==null){
			$this->db->limit($limit, $offset);
		}
		$query=$this->db->get($this->table);
		if($return_query==FALSE){			
			return $query->result();
		}else{
			return $this->db->last_query();
		}			
	}


	public function get_match_against($returned_fields=NULL,$match_fields,$against_val,$param=NULL,$param_or=NULL,$mode,$order_by='id',$order='ASC',$limit=null,$offset=null,$return_query=FALSE){

		//$this->db->cache_on();
		if($returned_fields!=NULL){
			$this->db->select($returned_fields);
		}

		$this->db->where('MATCH('.$match_fields.') AGAINST("'.$against_val.'" IN '.$mode.' MODE)');

		if($param!=NULL){
			$this->db->where($param);
		}

		if($param_or!=NULL){
			$this->db->group_start();
			$this->db->or_where($param_or,TRUE);
			$this->db->group_end();
		}

		// $query=$this->db->get($this->table);
		if($return_query==FALSE){			
			if($limit==null && $offset==null){
				return $this->db->order_by($order_by, $order)->get($this->table)->result();
			}else{
				return $this->db->order_by($order_by, $order)->get($this->table, $limit, $offset)->result();
			}
		}else{
			if($limit==null && $offset==null){
				$this->db->order_by($order_by, $order)->get($this->table)->result();
			}else{
				$this->db->order_by($order_by, $order)->get($this->table, $limit, $offset)->result();
			}
			return $this->db->last_query();
		}
	}


	public function get($param=null,$search_str=null,$orlike=null,$order_by='id',$order='DESC',$limit=null,$offset=null,$return_query=FALSE){

		if(isset($this->primary_key)){
			$order_by=$this->primary_key;
		}

		if(($param==null || empty($param)) && ($search_str==null || empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					return $this->db->order_by($order_by, $order)->get($this->table)->result();
				}else{
					return $this->db->order_by($order_by, $order)->get($this->table, $limit, $offset)->result();
				}	
			}else{
				if($limit==null && $offset==null){
					$this->db->get($this->table)->order_by($order_by, $order)->result();
				}else{
					$this->db->order_by($order_by, $order)->get($this->table, $limit, $offset)->result();
				}
				return $this->db->last_query();
			}
		}else if(($param!=null || !empty($param)) && ($search_str==null || empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					return $this->db->order_by($order_by, $order)->get_where($this->table,$param)->result();
				}else{
					return $this->db->order_by($order_by, $order)->get_where($this->table,$param,$limit, $offset)->result();
				}
				
			}else{
				if($limit==null && $offset==null){
					$this->db->order_by($order_by, $order)->get_where($this->table,$param)->result();
				}else{
					$this->db->order_by($order_by, $order)->get_where($this->table,$param,$limit, $offset);
				}

				return $this->db->last_query();
			}
		}else if(($param!=null || !empty($param)) && ($search_str!=null || !empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					$this->db->where($param);
					if($orlike==''){
						$this->db->like($search_str);
					}else if($orlike!=''){
						$this->db->like($search_str);
						$this->db->or_like($orlike);
					}
					$this->db->order_by($order_by, $order);
					return $this->db->get($this->table,$param)->result();
				}else{
					return $this->db->order_by($order_by, $order)->get_where($this->table,$param,$limit, $offset);
				}
				
			}else{
				if($limit==null && $offset==null){
					$this->db->where($param);
					if($orlike==''){
						$this->db->like($search_str);
					}else if($orlike!=''){
						$this->db->like($search_str);
						$this->db->or_like($orlike);
					}
					$this->db->order_by($order_by, $order);
					$this->db->get($this->table,$param)->result();
				}else{
					$this->db->order_by($order_by, $order)->get_where($this->table,$param,$limit, $offset);
				}

				return $this->db->last_query();
			}
		}
	}


	public function get_count($param=null,$search_str=null,$orlike=null,$order_by='id',$order='DESC',$limit=null,$offset=null,$return_query=FALSE){

		if(isset($this->primary_key)){
			$order_by=$this->primary_key;
		}

		if(($param==null || empty($param)) && ($search_str==null || empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					$this->db->order_by($order_by, $order);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}else{
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}	
			}else{
				if($limit==null && $offset==null){
					$this->db->order_by($order_by, $order);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}else{
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}
				return $this->db->last_query();
			}
		}else if(($param!=null || !empty($param)) && ($search_str==null || empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}else{
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}
			}else{
				if($limit==null && $offset==null){
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}else{
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}

				return $this->db->last_query();
			}
		}else if(($param!=null || !empty($param)) && ($search_str!=null || !empty($search_str))){
			if($return_query==FALSE){
				if($limit==null && $offset==null){
					$this->db->where($param);
					if($orlike==''){
						$this->db->like($search_str);
					}else if($orlike!=''){
						$this->db->like($search_str);
						$this->db->or_like($orlike);
					}
					$this->db->order_by($order_by, $order);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}else{
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					return $this->db->count_all_results();
				}
			}else{
				if($limit==null && $offset==null){
					$this->db->where($param);
					if($orlike==''){
						$this->db->like($search_str);
					}else if($orlike!=''){
						$this->db->like($search_str);
						$this->db->or_like($orlike);
					}
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit,$offset);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}else{
					$this->db->where($param);
					$this->db->order_by($order_by, $order);
					$this->db->limit($limit, $offset);
					$this->db->from($this->table);
					$this->db->count_all_results();
				}

				return $this->db->last_query();
			}
		}
	}

	public function get_total_count($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
		if($param!=null){
			$this->db->where($param);
		}

		if($find_in_set!=NULL){
			$this->db->where('FIND_IN_SET("'.$find_in_set['needle'].'",'.$this->db->dbprefix.$find_in_set['haystack'].')<>0');
		}

		if($group_by!=NULL){
			$this->db->group_by($group_by);
		}
		$num_rows = $this->db->count_all_results($this->table);

		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $num_rows;
		}		
	}

	public function get_many_not_in($param,$param_val,$return_query=FALSE){
		if($return_query==FALSE){
			return $this->db->where_not_in($param,$param_val)->get($this->table)->result();
		}else if($return_query==TRUE){
			$this->db->where_not_in($param,$param_val)->get($this->table)->result();
			return $this->db->last_query();
		}	
	}

	public function get_in($param,$param_val,$return_query=FALSE){
		if($return_query==FALSE){
			return $this->db->where_in($param,$param_val,FALSE)->get($this->table)->result();	
		}else if($return_query==TRUE){
			$this->db->where_in($param,$param_val,FALSE)->get($this->table);
			return $this->db->last_query();
		}		
	}


	public function get_find_in_set($param_val,$param_field,$find_in_field=FALSE,$return_query=FALSE){
		$this->db->select('*');
		if($find_in_field==FALSE){
			$this->db->where('FIND_IN_SET("'.$param_field.'","'.$param_val.'")<>0');
		}else if($find_in_field==TRUE){
			$this->db->where('FIND_IN_SET("'.$param_val.'","'.$param_field.'")<>0');
		}
		
		$result=$this->db->get($this->table);
		if($return_query==FALSE){
			return $result->result();
		}else if($return_query==TRUE){
			return $this->db->last_query();
		}
	}

	public function get_many_or_not_in($param=array(),$param_val){
		return $this->db->or_where_not_in($param,$param_val)->get($this->table)->result();	
	}	

	public function get_distinct($param,$fields='*',$limit=3,$start=0,$order_by=null,$order='DESC',$return_query=FALSE){
		$this->db->distinct();
		$this->db->select($fields);
		if($return_query==TRUE){
			$this->db->where($param);

			if($order_by!=null){
				$this->db->order_by($order_by,$order);
			}

			if($limit>0){
				$this->db->limit($length,$start);
			}

			$this->db->get($this->table)->result();
			return $this->db->last_query();
		}else{
			$this->db->where($param);
			if($order_by!=null){
				$this->db->order_by($order_by,$order);
			}

			if($limit>0){
				$this->db->limit($length,$start);
			}

			return $this->db->get($this->table)->result(); 
		}		
	}

	public function get_group_concat($param,$param_field,$param_field_as,$return_query=FALSE){
		$this->db->select('GROUP_CONCAT(DISTINCT '.$param_field.') as '.$param_field_as);
		$this->db->where($param);
		$query = $this->db->get($this->table);
		if($return_query==FALSE){
			return $query->first_row();
		}else{
			return $this->db->last_query();
		}		
	}

	public function get_max($field,$as,$return_query=FALSE){
		$this->db->select_max($field, $as);
		if($return_query==TRUE){
			$this->db->get($this->table)->result();
			return $this->db->last_query();
		}else{
			return $this->db->get($this->table)->result();
		}	
	}

	public function get_min($field,$as,$return_query=FALSE){
		$this->db->select_min($field, $as);
		if($return_query==TRUE){
			$this->db->get($this->table)->result();
			return $this->db->last_query();
		}else{
			return $this->db->get($this->table)->result();
		}
	}

	public function get_avg($field,$as,$param=null,$return_query=FALSE){
		$this->db->select_avg($field, $as);
		if($param!=null){
			$this->db->where($param);
		}
		if($return_query==TRUE){
			$this->db->get($this->table)->result();
			return $this->db->last_query();
		}else{
			return $this->db->get($this->table)->result();
		}	
	}

	public function get_sum($field,$as,$param=null,$return_query=FALSE){
		$this->db->select_sum($field, $as);
		if($param!=null){
			$this->db->where($param);
		}
		if($return_query==TRUE){
			$this->db->get($this->table)->result();
			return $this->db->last_query();
		}else{
			return $this->db->get($this->table)->result();
		}	
	}

	public function get_duplicates($param=array(),$param_or=array(),$field=null,$return_query=FALSE){
		if($field==null){
			$this->db->select('COUNT(*) AS counted');
		}else{
			$this->db->select($field.',COUNT('.$field.') AS counted');
		}
		if($param!=null){
			$this->db->where($param);
		}

		if($param_or!=null){
			$this->db->or_where($param_or);
		}
		
		if($field!=null){
			$this->db->group_by($field);
			$this->db->having('COUNT('.$field.')>0');
		}

		$result=$this->db->get($this->table);
		
		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $result->result();
		}
	}

	public function _get_duplicates($param=array(),$param_or=array(),$group_field=null,$field=null,$return_query=FALSE){
		if($field==null){
			$this->db->select('COUNT(*) AS counted');
		}else{
			if($group_field!=null){
				$this->db->select($group_field.',COUNT('.$field.') AS counted');
			}else{
				$this->db->select($field.',COUNT('.$field.') AS counted');
			}
			
		}
		if($param!=null){
			$this->db->where($param);
		}

		if($param_or!=null){
			$this->db->or_where($param_or);
		}
		
		if($field!=null){
			if($group_field!=null){
				$this->db->group_by($group_field);
			}else{
				$this->db->group_by($field);
			}
			
			$this->db->having('COUNT('.$field.')>0');
		}

		$result=$this->db->get($this->table);
		
		if($return_query==TRUE){
			return $this->db->last_query();
		}else{
			return $result->result();
		}
	}

}