<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Blogs_model extends BaseModel
{

    public function get_blog_categories($param=null,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_blog_categories';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        } 
    }

    public function store_blog_categories($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_categories';
        return $this->store($data,$batch,$return_query);
    }


     public function get_blog_other_categories($param=null,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_blog_posts_other_categories';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        } 
    }

    public function store_blog_other_categories($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_posts_other_categories';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_blog_other_categories($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_blog_posts_other_categories';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }
    }


    public function get_blog_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_blog_posts';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_blog_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_blog_posts';
        if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        }       
    }

    public function ___get_blog_data($param=null,$limit=10,$order_by='post_created_at',$order='DESC',$return_query=FALSE){
        $this->db->select('system_blog_posts.*,system_blog_categories.blog_category_name,way2_system_users.user_name');
        $this->db->join('system_blog_categories','system_blog_categories.blog_category_id=system_blog_posts.post_category_id','LEFT');
        $this->db->join('way2_system_users','way2_system_users.user_id=system_blog_posts.post_created_by','LEFT');
        if($param!=null){
            $this->db->where($param);
        }

        $this->db->order_by($order_by,$order);
        $this->db->limit($limit);

        $result=$this->db->get('system_blog_posts');

        if($return_query==FALSE){
            return $result->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }

    public function __get_blog_data($param=null,$param_or=null,$return_query=FALSE){
        $this->db->select('system_blog_posts.*,system_blog_categories.*');
        $this->db->join('system_blog_categories','system_blog_categories.blog_category_id=system_blog_posts.post_category_id','LEFT');
        if(!empty($param)){
            $this->db->like($param);
            $this->db->or_like($param_or);
        }
       
        $query=$this->db->get('system_blog_posts');
        if($return_query==FALSE){           
            return $query->result();
        }else{
            return $this->db->last_query();
        }
    }


    public function get_last_3_months_blog($param=null,$limit=10,$order_by='post_created_at',$order='DESC',$return_query=FALSE){
        $this->db->select('system_blog_posts.*,system_blog_categories.blog_category_name');
        $this->db->join('system_blog_categories','system_blog_categories.blog_category_id=system_blog_posts.post_category_id','LEFT');
        if($param!=null){
            $this->db->where($param);
        }
        
        $this->db->where(array('post_created_at>='=>'last_day(now()) + interval 1 day - interval 3 month'));

        $this->db->order_by($order_by,$order);
        $this->db->limit($limit);

        $result=$this->db->get('system_blog_posts');

        if($return_query==FALSE){
            return $result->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }

    public function store_blog_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_posts';
        return $this->store($data,$batch,$return_query);
    }

    public function update_blog_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_posts';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_blog_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_blog_posts';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }
    }


    public function store_blog_content_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_posts_content';
        return $this->store($data,$batch,$return_query);
    }


    public function get_blog_content_data($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_blog_posts_content';
        if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        }       
    }

    public function update_blog_content_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_blog_posts_content';
        return $this->modify($data,$param,$batch,$return_query);
    }
    
    public function delete_blog_content_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_blog_posts_content';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }
    }

    public function _get_blog_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_blog_posts.*,system_blog_categories.blog_category_name');
        $this->db->join('system_blog_categories','system_blog_categories.blog_category_id=system_blog_posts.post_category_id','LEFT');

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
            
            $query = $this->db->get('system_blog_posts');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_blog_posts');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

}