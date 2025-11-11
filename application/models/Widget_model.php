<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Widget_model extends BaseModel
{
	
	public function store_widgets($data,$return_query=FALSE){
        $this->table='system_widgets';
        return $this->store($data,FALSE,$return_query);
    }


    public function _get_widgets($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_widgets.*');

        $i = 0;

        if(isset($param['menu_link_id'])){
            $this->db->where(array('menu_link_id'=>$param['menu_link_id']));
        }

        if(isset($param['menu_is_active'])){
            $this->db->where(array('menu_is_active'=>$param['menu_is_active']));
        }

        if(isset($param['menu_is_inner'])){
            $this->db->where(array('menu_is_inner'=>$param['menu_is_inner']));
        }

        if(isset($param['menu_link_type'])){
            $this->db->where(array('menu_link_type'=>$param['menu_link_type']));
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
            
            $query = $this->db->get('system_widgets');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_widgets');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

}