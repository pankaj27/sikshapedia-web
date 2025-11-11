<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Service_model extends BaseModel
{
	
	public function store_service($data,$return_query=FALSE){
        $this->table='system_services';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_service($param,$return_query=FALSE){
        $this->table='system_services';
        return $this->remove($param,0,$return_query);
    }

    public function update_service($data,$param,$return_query=FALSE){
        $this->table='system_services';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_service($param,$single_row=TRUE,$return_query=FALSE){
		$this->table='system_services';
		if($single_row==TRUE){
			return $this->get_one($param,$return_query);
		}else if($single_row==FALSE){
			return $this->get_many($param,$return_query);
		}		
	}

    public function _get_service($param,$param_or=NULL,$return_query=FALSE){
        $this->table='system_services';
        $this->table_joined='system_storage';
        $fields='system_services.*,system_storage.storage_id,system_storage.media_type_data_id,system_storage.media_disk_path,system_storage.media_disk_path_relative,system_storage.media_org_name';
        $joined_fields='system_storage.media_type_data_id=system_services.service_id';

        return $this->get_joined($fields,$joined_fields,$param,$param_or,'LEFT','object',FALSE,$return_query);
    }

    public function _get_services($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_services.*');

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
            
            $query = $this->db->get('system_services');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_services');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function store_service_desc($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_services_descriptions';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_service_desc($param,$return_query=FALSE){
        $this->table='system_services_descriptions';
        return $this->remove($param,0,$return_query);
    }

    public function update_service_desc($data,$param,$return_query=FALSE){
        $this->table='system_services_descriptions';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_service_desc($param,$single_row=TRUE,$order_by='',$order='ASC',$return_query=FALSE){
        $this->table='system_services_descriptions';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            if($order_by!='' || $order_by!=NULL){
                return $this->get_order_many($param,$order_by,$order,$return_query);
            }else{
                return $this->get_many($param,$return_query);
            }            
        }       
    }
    

    public function get_service_desc_in_set($param_field,$param_val,$return_query=FALSE){
        $this->table='system_services_descriptions';
        return $this->get_in($param_field,$param_val,$return_query);
    }


    public function store_service_broad_desc($data,$return_query=FALSE){
        $this->table='system_services_broad_descriptions';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_service_broad_desc($param,$return_query=FALSE){
        $this->table='system_services_broad_descriptions';
        return $this->remove($param,0,$return_query);
    }

    public function update_service_broad_desc($data,$param,$return_query=FALSE){
        $this->table='system_services_broad_descriptions';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_service_broad_desc($param,$single_row=TRUE,$order_by='',$order='ASC',$return_query=FALSE){
        $this->table='system_services_broad_descriptions';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            if($order_by!='' || $order_by!=NULL){
                return $this->get_order_many($param,$order_by,$order,$return_query);
            }else{
                return $this->get_many($param,$return_query);
            }            
        }       
    }

    public function get_service_broad_desc_count($param=null,$return_query=FALSE){
        $this->table='system_services_broad_descriptions';
        return $this->get_total_count($param,$return_query);
    }

    public function _get_services_broad_desc($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_services_broad_descriptions.*');

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
            
            $query = $this->db->get('system_services_broad_descriptions');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_services_broad_descriptions');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }



    public function store_subscription_data($data,$return_query=FALSE){
        $this->table='system_newsletter_subscriber';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_subscription_data($param,$return_query=FALSE){
        $this->table='system_newsletter_subscriber';
        return $this->remove($param,0,$return_query);
    }

    public function update_subscription_data($data,$param,$return_query=FALSE){
        $this->table='system_newsletter_subscriber';
        return $this->modify($data,$param,FALSE,$return_query);
    }


    public function _get_subscription_data($param=null,$param_or=NULL,$single_row=TRUE,$return_query=FALSE){
        $this->db->select('system_newsletter_subscriber.*');

        if($param!=NULL){
            $this->db->where($param);
        }

        if($param_or!=NULL){
            $this->db->or_where($param_or);
        }

        $query=$this->db->get('system_newsletter_subscriber');

        if($return_query==FALSE){
            if($single_row==TRUE){
                return $query->first_row();
            }else if($single_row==FALSE){
                return $query->result();
            }
            
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }


    }

    public function get_subscription_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_newsletter_subscriber';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }
}