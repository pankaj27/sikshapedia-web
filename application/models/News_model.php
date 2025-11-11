<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class News_model extends BaseModel
{

    public function add_news($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news';
        return $this->store($data,$batch,$return_query);
    }


    public function update_news($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_news($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_news';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function get_news($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_news';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_news($post=array(),$param=array(),$join=FALSE,$count=FALSE,$return_query=FALSE){        

        if($join==TRUE){
            $this->db->select('system_news.*,system_news_type_data.*');
            $this->db->join('system_news_type_data','system_news_type_data.news_types_news_id=system_news.news_id','LEFT');
        }else{
            $this->db->select('system_news.*');
        }



        $i = 0;

        if(isset($param['news_type']) && $param['news_type']!='all'){
            $this->db->where('news_type',$param['news_type']);
        }

        if($join==TRUE && isset($param['news_types_id']) && !is_null($param['news_types_id'])){
            $this->db->where('news_types_id',$param['news_types_id']);
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
            
            $query = $this->db->get('system_news');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_news');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function __get_news($param=array(),$join=FALSE,$length=6,$start=0,$order_by='news_id', $order='DESC',$return_query=FALSE){        

        if($join==TRUE){
            $this->db->select('system_news.*,system_news_type_data.*');
            $this->db->join('system_news_type_data','system_news_type_data.news_types_news_id=system_news.news_id','LEFT');
        }else{
            $this->db->select('system_news.*');
        }

        if(!empty($param)){
            $this->db->where($param);
        }        
            
        $this->db->order_by($order_by, $order);

        $this->db->limit($length,$start);
        
        $query = $this->db->get('system_news');

        if($return_query==FALSE){
            return $query->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }  
    }


    public function get_news_types($param=array(),$join=FALSE,$length=10,$start=0,$order_by='system_news.news_id', $order='ASC',$return_query=FALSE){        

        if($join==TRUE){
            $this->db->select('system_news.*,system_news_type_data.*');
            $this->db->join('system_news_type_data','system_news_type_data.news_types_news_id=system_news.news_id','LEFT');
        }else{
            $this->db->select('system_news.*');
        }

        $this->db->where($param);
            
        $this->db->order_by($order_by, $order);

        $this->db->limit($length,$start);
        
        $query = $this->db->get('system_news');

        if($return_query==FALSE){
            return $query->first_row();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }  
    }

    public function add_news_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news_data';
        return $this->store($data,$batch,$return_query);
    }


    public function update_news_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news_data';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_news_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_news_data';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function get_news_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_news_data';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_news_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_news_data.*');

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
            
            $query = $this->db->get('system_news_data');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_news_data');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }



    public function add_news_type($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news_type_data';
        return $this->store($data,$batch,$return_query);
    }


    public function update_news_type($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news_type_data';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_news_type($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_news_type_data';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function get_news_type($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_news_type_data';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_news_count($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
        $this->table='system_news_type_data';
        return $this->get_total_count($param,$group_by,$find_in_set,$return_query);
    }

    public function _get_news_type($param,$single_row=TRUE,$order_by='news_types_pid',$order='DESC',$limit=8,$start=0,$return_query=FALSE){
        $this->db->select('system_news_type_data.*,system_news.*');
        $this->db->join('system_news','system_news.news_id=system_news_type_data.news_types_news_id','INNER');

        if($param!=NULL){
            $this->db->where($param);
        }        

        if($single_row==FALSE){
            if($order_by!=NULL){
                $this->db->order_by($order_by,$order);
            }
            $this->db->limit($limit,$start);
        }

        $query=$this->db->get('system_news_type_data');

        if($return_query==FALSE){
            if($single_row==TRUE){
                return $query->first_row();
            }else{
                return $query->result();
            }
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }


    //Scholarship
    public function add_scholarship($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_scholarship';
        return $this->store($data,$batch,$return_query);
    }


    public function update_scholarship($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_scholarship';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_scholarship($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_scholarship';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function get_scholarship($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_scholarship';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_scholarship($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_scholarship.*');

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
            
            $query = $this->db->get('system_scholarship');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_scholarship');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function add_scholarship_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_scholarship_data';
        return $this->store($data,$batch,$return_query);
    }


    public function update_scholarship_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_news_data';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_scholarship_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_scholarship_data';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function get_scholarship_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_scholarship_data';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }
}