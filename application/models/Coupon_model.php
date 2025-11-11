<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Coupon_model extends BaseModel
{
	public function store_coupons_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_coupons';
        return $this->store($data,$batch,$return_query);
    }

    public function store_coupon_categories_data($data,$return_query=FALSE){
        $this->table='system_coupon_categories';
        return $this->store($data,FALSE,$return_query);
    }

    public function store_coupons_synced_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_coupon_synced';
        return $this->store($data,$batch,$return_query);
    }


    public function get_coupon_categories_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_coupon_categories';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }



    public function _get_coupons($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_coupons.*');

        $i = 0;


        if(isset($param['status'])){
            $this->db->where('coupon_status',$param['status']);
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
            
            $query = $this->db->get('system_coupons');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_coupons');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

}