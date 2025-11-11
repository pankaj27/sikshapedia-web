<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Settings_model extends BaseModel
{
	
	//Settings
    public function store_settings($data,$return_query=FALSE){
        $this->table='system_settings';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_settings($param,$return_query=FALSE){
        $this->table='system_settings';
        return $this->remove($param,0,$return_query);
    }

    public function update_settings($data,$param,$return_query=FALSE){
        $this->table='system_settings';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_settings($param,$single_row=TRUE,$fields=null,$return_query=FALSE){
		$this->table='system_settings';
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


    //Widgets
    public function get_widgets($param,$single_row=TRUE,$fields=null,$return_query=FALSE){
        $this->table='system_widgets';
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


    //Queries
    public function store_query($data,$return_query=FALSE){
        $this->table='system_enquires';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_query($param,$return_query=FALSE){
        $this->table='system_enquires';
        return $this->remove($param,0,$return_query);
    }

    public function get_query($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_enquires';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }



    //Storage
	public function store_file($data,$return_query=FALSE){
        $this->table='system_storage';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_file($param,$return_query=FALSE){
        $this->table='system_storage';
        return $this->remove($param,0,$return_query);
    }

    public function update_files($data,$param,$return_query=FALSE){
        $this->table='system_storage';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_file($param=null,$return_query=FALSE){
        $this->table='system_storage';
        return $this->get_one($param,$return_query);    
    }

    public function get_files($param,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_storage';
        return $this->get_many($param,$order_by,$order,$return_query);  
    }

    public function get_total_user_files($param=null,$return_query=FALSE){
        $this->table='system_users_storage';
        return $this->get_total_count($param,NULL,NULL,$return_query);
    }

    public function _get_files($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_storage.*');

        if(isset($param['storage_type'])){
            $this->db->where('storage_type',$param['storage_type']);
        }

        if(isset($param['media_data_type_id'])){
            $this->db->where('media_type_data_id',$param['media_data_type_id']);
        }

        if(isset($param['media_type'])){
            $this->db->where('media_type',$param['media_type']);
        }

        if(isset($param['media_identity_name'])){
            $this->db->where('media_identity_name',$param['media_identity_name']);
        }

        if(isset($param['media_org_name'])){
            $this->db->where('media_org_name',$param['media_org_name']);
        }

        if(isset($param['media_mime'])){
            $this->db->where('media_mime',$param['media_mime']);
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
            
            $query = $this->db->get('system_storage');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_storage');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    //User files
    public function store_user_file($data,$return_query=FALSE){
        $this->table='system_users_storage';
        return $this->store($data,0,$return_query);
    }

    public function delete_user_file($data,$return_query=FALSE){
        $this->table='system_users_storage';
        return $this->remove($data,FALSE,$return_query);
    }


    public function update_user_files($data,$param,$return_query=FALSE){
        $this->table='system_users_storage';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_user_file($param=NULL,$param_or=NULL,$return_query=FALSE){
        $this->table='system_users_storage';
        $this->table_joined='system_storage';
        $fields='system_storage.*,system_users_storage.*';
        $joined_fields='system_storage.storage_id=system_users_storage.user_file_storage_id';
        return $this->get_joined($fields,$joined_fields,$param,$param_or,'LEFT','object',FALSE,$return_query);
    }

    public function __get_user_file($fields,$param=NULL,$param_or=NULL,$return_query=FALSE){
        $this->table='system_users_storage';
        $this->table_joined='system_storage';
        $joined_fields='system_storage.storage_id=system_users_storage.user_file_storage_id';
        return $this->get_joined($fields,$joined_fields,$param,$param_or,'LEFT','object',FALSE,$return_query);
    }

    public function get_user_files($param=NULL,$param_or=NULL,$return_query=FALSE){
        $this->table='system_users_storage';
        $this->table_joined='system_storage';
        $fields='system_storage.*,system_users_storage.*';
        $joined_fields='system_storage.storage_id=system_users_storage.user_file_storage_id';
        return $this->get_joined($fields,$joined_fields,$param,$param_or,'LEFT','object',TRUE,$return_query);
    }

    public function _get_user_file($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_users_storage';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }
    }



    public function get_gallery_types($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_gallery_type';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function _get_gallery_files($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_storage.*,system_users_storage.*,system_gallery_type.*');
        $this->db->join('system_users_storage','system_users_storage.user_file_storage_id=system_storage.storage_id','LEFT');
        $this->db->join('system_gallery_type','system_gallery_type.gallery_type_id=system_users_storage.user_storage_type_2','LEFT');

        if(isset($param['user_file_type_id'])){
            $this->db->where('user_file_type_id',$param['user_file_type_id']);
        }

        if(isset($param['user_storage_type'])){
            $this->db->where('user_storage_type!=',$param['user_storage_type']);
        }

        if(isset($param['_user_storage_type'])){
            $this->db->where('user_storage_type',$param['_user_storage_type']);
        }

        if(isset($param['user_storage_type_2'])){
            $this->db->where('user_storage_type_2',$param['user_storage_type_2']);
        }

        if(isset($param['user_storage_type_3'])){
            $this->db->where('user_storage_type_3',$param['user_storage_type_3']);
        }

        $this->db->group_start();

        $this->db->where('storage_type','2');
        $this->db->or_where('storage_type','3');

        $this->db->group_end();

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
            
            $query = $this->db->get('system_storage');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_storage');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function ___get_user_file($fields='system_storage.*,system_users_storage.*',$param=array(),$single_row=TRUE,$return_query=FALSE){
        $this->db->select($fields);
        $this->db->join('system_storage','system_users_storage.user_file_storage_id=system_storage.storage_id');
        $this->db->where($param);
        $result=$this->db->get('system_users_storage');

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

    public function _get_guser_files($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_storage.*,system_users_storage.*');
        $this->db->join('system_users_storage','system_users_storage.user_file_storage_id=system_storage.storage_id');

        if(isset($param['user_file_type_id'])){
            $this->db->where('user_file_type_id',$param['user_file_type_id']);
        }

        if(isset($param['user_storage_type'])){
            $this->db->where('user_storage_type!=',$param['user_storage_type']);
        }

        if(isset($param['_user_storage_type'])){
            $this->db->where('user_storage_type',$param['_user_storage_type']);
        }

        if(isset($param['user_storage_type_2'])){
            $this->db->where('user_storage_type_2',$param['user_storage_type_2']);
        }


        if(isset($param['storage_type'])){
            $this->db->where('storage_type',$param['storage_type']);
        }

        if(isset($param['not_in_storage_type'])){
            $this->db->where_not_in('media_mime',$param['not_in_storage_type']);
        }

        if(isset($param['in_file_type'])){
            $this->db->where('FIND_IN_SET('.$this->db->dbprefix.'system_users_storage.user_file_type,"'.$param['in_file_type'].'")<>0');
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
            
            $query = $this->db->get('system_storage');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_storage');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function __get_banner_files($fields,$param,$single_row=FALSE,$return_query=FALSE){
        $this->db->select($fields);
        $this->db->join('system_storage','system_users_storage.user_file_storage_id=system_storage.storage_id');
        $this->db->join('system_banner_storage','system_users_storage.user_file_type_id=system_banner_storage.banner_id');
        $this->db->where('user_file_type',3);
        $this->db->where('user_storage_type','banner_image');
        $this->db->where('storage_type','2');
        $this->db->where($param);
        $this->db->order_by('banner_serial','ASC');
        $result=$this->db->get('system_users_storage');
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


    public function _get_banner_files($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_storage.*,system_users_storage.*,system_banner_storage.*');
        $this->db->join('system_storage','system_users_storage.user_file_storage_id=system_storage.storage_id');
        $this->db->join('system_banner_storage','system_users_storage.user_file_type_id=system_banner_storage.banner_id');

        $this->db->where('user_file_type',3);

        $this->db->where('user_storage_type','banner_image');

        $this->db->where('storage_type','2');

        if(isset($param['user_file_published'])){
            $this->db->where('system_users_storage.user_file_published',$param['user_file_published']);
        }

        if(isset($param['banner_status'])){
            $this->db->where('system_banner_storage.banner_status',$param['banner_status']);
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
            
            $query = $this->db->get('system_users_storage');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_users_storage');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function store_banner_files($data,$return_query=FALSE){
        $this->table='system_banner_storage';
        return $this->store($data,FALSE,$return_query);
    }

    public function update_banner_files($data,$param,$return_query=FALSE){
        $this->table='system_banner_storage';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_banner_files($param,$return_query=FALSE){
        $this->table='system_banner_storage';
        return $this->remove($param,0,$return_query);
    }

    public function get_banner_file($param,$return_query=FALSE){
        $this->db->select('system_storage.*,system_users_storage.*,system_banner_storage.*');
        $this->db->join('system_storage','system_users_storage.user_file_storage_id=system_storage.storage_id');
        $this->db->join('system_banner_storage','system_users_storage.user_file_type_id=system_banner_storage.banner_id');

        $this->db->where('user_file_type',3);

        $this->db->where('user_storage_type','banner_image');

        $this->db->where('storage_type','2');

        $this->db->where($param);
        $query = $this->db->get('system_users_storage');

        if($return_query==FALSE){
            return $query->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }       
    }


    //Storage


    //Security
    public function store_security_settings($data,$return_query=FALSE){
        $this->table='system_security';
        return $this->store($data,FALSE,$return_query);
    }

    public function update_security_settings($data,$param,$return_query=FALSE){
        $this->table='system_security';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_security_settings($param,$return_query=FALSE){
        $this->table='system_security';
        return $this->remove($param,0,$return_query);
    }

    public function get_security_settings($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_security';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    //Menus    

    public function get_menue_categories($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu_category';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_menues($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_menues_count($param,$return_query=FALSE){
         $this->table='system_menu';
         return $this->get_count($param,null,null,'menu_id','DESC',null,null,$return_query=FALSE);
    }

    public function get_menues_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu';
        if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        }       
    }


    public function get_course_inner_menues($param,$param_or=NULL){
        $this->db->select('system_menu.*,system_courses.*');
        $this->db->join('system_courses','system_menu.menu_link_id=system_courses.course_id','LEFT');
        $this->db->where('menu_link_type','20');
        $this->db->where($param);
        $this->db->like($param);
        if($param_or!=null){
          $this->db->or_like($param_or);  
        }
        
        $query=$this->db->get('system_courses');
        if($return_query==FALSE){           
            return $query->result();
        }else{
            return $this->db->last_query();
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


    // public function _get_menues($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
    //     $this->db->select('system_menu.*');

    //     if(isset($param['menu_link_id'])){
    //         $this->db->where('menu_link_id',$param['menu_link_id']);
    //     }

    //     if(isset($param['menu_link_type'])){
    //         $this->db->where('menu_link_type',$param['menu_link_type']);
    //     }

    //     if(isset($param['menu_is_inner'])){
    //         $this->db->where('menu_is_inner',$param['menu_is_inner']);
    //     }

    //     if(isset($param['menu_category_id'])){
    //         $this->db->where('menu_category_id',$param['menu_category_id']);
    //     }

    //     $i = 0;

    //     if(isset($param['column_search'])){
    //         foreach ($param['column_search'] as $item)
    //         {
    //             if(isset($post['search']['value']) && $post['search']['value'])
    //             {                    
    //                 if($i===0)
    //                 {
    //                     $this->db->group_start();
    //                     $this->db->like($item, $post['search']['value']);
    //                 }
    //                 else
    //                 {
    //                     $this->db->or_like($item, $post['search']['value']);
    //                 }

    //                 if(count($param['column_search']) - 1 == $i)
    //                     $this->db->group_end();
    //             }
                
    //             $i++;
    //         }
    //     }

            
    //     if(isset($post['order']))
    //     {
    //         $column_order=$param['column_order'];
    //         $this->db->order_by($column_order[$post['order']['0']['column']], $post['order']['0']['dir']);
    //     } 
    //     else if(isset($param['order']))
    //     {
    //         $order = $param['order'];
    //         $this->db->order_by(key($order), $order[key($order)]);
    //     }

    //     if($count==FALSE){
    //         if(isset($post['length']) && $post['length'] != -1){
    //             $this->db->limit($post['length'],$post['start']);   
    //         }
            
    //         $query = $this->db->get('system_menu');

    //         if($return_query==FALSE){
    //             return $query->result();
    //         }else if($return_query==TRUE){
    //             return $this->db->last_query();
    //         }       
            
    //     }else if($count==TRUE){
    //         $query = $this->db->get('system_menu');
    //         if($return_query==FALSE){
    //             return $query->num_rows();
    //         }else if($return_query==TRUE){
    //             return $this->db->last_query();
    //         }           
    //     }
    // }

    public function __get_inner_menues($fields,$param,$single_row=TRUE,$order_by='menu_serial',$order='DESC',$return_query=FALSE){
        $this->db->select($fields);
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');    
        $this->db->where(array('menu_is_inner'=>'1'));
        $this->db->where(array('menu_link_type'=>'10'));  
        $this->db->where($param);

        $query = $this->db->get('system_menu');

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

    public function _get_inner_menues($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_menu.*,system_menu_types.*');
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');

        $i = 0;

        $this->db->where(array('menu_link_id'=>$param['menu_link_id']));
        $this->db->where(array('menu_type_alias!='=>NULL));
        $this->db->where(array('menu_is_inner'=>'1'));
        $this->db->where(array('menu_link_type'=>'10'));

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
            
            $query = $this->db->get('system_menu');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_menu');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function get_inner_menues($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_menu.*,system_menu_types.*');
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');

        $i = 0;

        $this->db->where(array('menu_link_id'=>$param['menu_link_id']));
        $this->db->where(array('menu_type_alias!='=>NULL));
        $this->db->where(array('menu_is_inner'=>'1'));

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
            
            $query = $this->db->get('system_menu');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_menu');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function _get_inner_menu($param=array(),$return_query=FALSE){
        $this->db->select('system_menu.*,system_menu_types.*');
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');    
        $this->db->where(array('menu_is_inner'=>'1'));
        $this->db->where(array('menu_link_type'=>'10'));

        $this->db->where($param);

        $query = $this->db->get('system_menu');

        if($return_query==FALSE){
            return $query->first_row();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }


    public function _get_menues($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_menu.*,system_menu_types.*');
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');

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

        if(isset($param['menu_is_upper_top'])){
            $this->db->where(array('menu_is_upper_top'=>$param['menu_is_upper_top']));
        }

        if(isset($param['menu_is_top'])){
            $this->db->where(array('menu_is_top'=>$param['menu_is_top']));
        }

        if(isset($param['menu_parent_id'])){
            $this->db->where(array('menu_parent_id'=>$param['menu_parent_id']));
        }

        if(isset($param['menu_category_id'])){
            $this->db->where(array('menu_category_id'=>$param['menu_category_id']));
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
            
            $query = $this->db->get('system_menu');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_menu');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function get_menue_columns($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu_columns';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_menue_columns_specific($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu_columns';
        if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        }       
    }

    public function get_menue_types($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_menu_types';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    
    public function get_menu_types_with_menu($param=NULL,$single_row=TRUE,$return_query=FALSE){
        $this->db->select('system_menu.*,system_menu_types.*');
        $this->db->join('system_menu_types','system_menu.menu_type=system_menu_types.menu_type_id','LEFT');

        $this->db->where($param);
        $query=$this->db->get('system_menu');
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

    public function store_menu($data,$return_query=FALSE){
        $this->table='system_menu';
        return $this->store($data,FALSE,$return_query);
    }

    public function update_menu($data,$param,$return_query=FALSE){
        $this->table='system_menu';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_menu($param,$return_query=FALSE){
        $this->table='system_menu';
        return $this->remove($param,0,$return_query);
    }

    public function get_total_menues($param=null,$group_by=NULL,$find_in_set=NULL,$return_query=FALSE){
        $this->table='system_menu';
        return $this->get_total_count($param,$group_by,$find_in_set,$return_query);
    }

    public function get_slug($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_slug($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_slugs.*');
        $i = 0;

        if(isset($param['slug_type']) && $param['slug_type']!=NULL){
            $this->db->where('slug_type',$param['slug_type']);
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
            
            $query = $this->db->get('system_slugs');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_slugs');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    public function store_slug($data,$return_query=FALSE){
        $this->table='system_slugs';
        return $this->store($data,FALSE,$return_query);
    }

    public function update_slug($data,$param,$return_query=FALSE){
        $this->table='system_slugs';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_slug($param,$return_query=FALSE){
        $this->table='system_slugs';
        return $this->remove($param,0,$return_query);
    }

    public function get_slug_urls($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs_urls';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function get_slug_urls_like($fields,$item,$search_value,$limit=10,$start=0,$place='before'){
        $this->db->select($fields);
        $this->db->like($item,$search_value,$place);
        $this->db->order_by('url_type_id','ASC');
        $this->db->limit($limit,$start);
        $query=$this->db->get('system_slugs_urls');
        return $query->result();
    }


    public function __get_slug_urls($fields,$param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs_urls';
        if($single_row==TRUE){
            return $this->get_one_specific($fields,$param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many_specific($fields,$param,$order_by,$order,$return_query);
        }       
    }

    public function get_slug_filters($param,$single_row=TRUE,$order_by='url_filter_id',$order='ASC',$return_query=FALSE){
        $this->table='system_slugs_urls_filters';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_slug_urls($param,$length=6,$start=0,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs_urls';
        return $this->get_limit_many($param,$length,$start,$order_by,$order,$return_query);       
    }

    public function store_slug_urls($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_slugs_urls';
        return $this->store($data,$batch,$return_query);
    }

    public function update_slug_urls($data,$param,$return_query=FALSE){
        $this->table='system_slugs_urls';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_slug_urls($param,$return_query=FALSE){
        $this->table='system_slugs_urls';
        return $this->remove($param,0,$return_query);
    }


    public function _get_slugs_urls($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_slugs_urls.*');
        $i = 0;

        if(isset($param['url_type']) && $param['url_type']!=NULL){
            $this->db->where('url_type',$param['url_type']);
        }

        if(isset($param['url_glob_type']) && $param['url_glob_type']!=NULL){
            $this->db->where('url_glob_type',$param['url_glob_type']);
        }

        if(isset($param['url_type_id']) && $param['url_type_id']!=NULL){
            $this->db->where('url_type_id',$param['url_type_id']);
        }


        if(isset($param['url_state_id']) && $param['url_state_id']!=NULL){
            $this->db->where('url_state',$param['url_state_id']);
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
            
            $query = $this->db->get('system_slugs_urls');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_slugs_urls');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function get_slug_struct_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs_urls_struct_data';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function store_slug_struct_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_slugs_urls_struct_data';
        return $this->store($data,$batch,$return_query);
    }

    public function update_slug_struct_data($data,$param,$return_query=FALSE){
        $this->table='system_slugs_urls_struct_data';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_slug_struct_data($param,$return_query=FALSE){
        $this->table='system_slugs_urls_struct_data';
        return $this->remove($param,0,$return_query);
    }


    public function get_slug_urls_new($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_slugs_urls_new';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function store_slug_urls_new($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_slugs_urls_new';
        return $this->store($data,$batch,$return_query);
    }

    public function update_slug_urls_new($data,$param,$return_query=FALSE){
        $this->table='system_slugs_urls_new';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_slug_urls_new($param,$return_query=FALSE){
        $this->table='system_slugs_urls_new';
        return $this->remove($param,0,$return_query);
    }


    public function _get_slugs_urls_new($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_slugs_urls_new.*');
        $i = 0;

        if(isset($param['url_type']) && $param['url_type']!=NULL){
            $this->db->where('url_type',$param['url_type']);
        }

        if(isset($param['url_type_id']) && $param['url_type_id']!=NULL){
            $this->db->where('url_type_id',$param['url_type_id']);
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
            
            $query = $this->db->get('system_slugs_urls_new');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_slugs_urls_new');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }

    //Listing Pacakge
    public function get_listing_packages($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_listing_package';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function store_listing_packages($data,$return_query=FALSE){
        $this->table='system_listing_package';
        return $this->store($data,FALSE,$return_query);
    }

    public function update_listing_packages($data,$param,$return_query=FALSE){
        $this->table='system_listing_package';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_listing_packages_category($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_listing_package_category';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function get_listing_package_types($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_listing_package_type';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function store_system_search_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_data_search';
        return $this->store($data,$batch,$return_query);
    }

    public function update_system_search_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_data_search';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_system_search_data($param,$return_query=FALSE){
        $this->table='system_data_search';
        return $this->remove($param,0,$return_query);
    }


    public function get_system_search_data($param=null,$orlike=null,$order_by='search_data_id',$order='ASC',$limit=null,$offset=null,$return_query=FALSE){
        $this->table='system_data_search';
        return $this->get_like($param,'search_data_type_id,search_data_type,search_data_name,search_data_access_url','search_data_name,search_data_course_name',$orlike,$order_by,$order,$limit,$offset,$return_query);    
    }

    public function _get_system_search_data($against_val,$param=NULL,$param_or=NULL,$mode='BOOLEAN',$limit=null,$offset=null,$order_by='search_data_id',$order='ASC',$return_query=FALSE){
        $this->table='system_data_search';
        return $this->get_match_against('search_data_type_id,search_data_type,search_data_name','search_data_type,  
search_data_name,   
search_data_short_name, 
search_data_country,
search_data_state_name,     
search_data_city_name,      
search_data_address,    
search_data_course_name,    
search_data_course_short_name,      
search_data_stream_name,        
search_data_exam_name,      
search_data_meta_title,     
search_data_meta_desc,      
search_data_meta_keywords',$against_val,$param,$param_or,$mode,$order_by,$order,$limit,$offset,$return_query);  

        // SELECT `search_data_id`, `search_data_type_id`, `search_data_type`, `search_data_name` FROM `way2_system_data_search` WHERE MATCH(search_data_name,search_data_course_name,search_data_meta_keywords,search_data_state_name,search_data_city_name) AGAINST("du" IN NATURAL LANGUAGE MODE) AND (`search_data_type` = 'COLLEGE_NAME' OR `search_data_type` = 'UNIVERSITY_NAME') ORDER BY `search_data_id` ASC LIMIT 10 
    }

    public function __get_system_search_data($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_data_search';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        } 
    }


    public function ___get_system_search_data($param=NULL,$order_by='search_data_type_id',$order='ASC',$limit=10,$offset=0,$return_query=FALSE){
        $this->db->select('system_data_search.*');


        if($param!=null){
            $this->db->where($param);
        }
        

        $this->db->order_by($order_by,$order);

        $this->db->order_by($order_by, $order);
        //if($limit!=null && $offset!=null){
            $this->db->limit($limit, $offset);
       // }

        $query=$this->db->get('system_data_search');
        if($return_query==FALSE){           
            return $query->result();
        }else{
            return $this->db->last_query();
        }   
    }



    public function store_system_search_data2($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_data_search_2';
        return $this->store($data,$batch,$return_query);
    }

    public function update_system_search_data2($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_data_search_2';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_system_search_data2($param,$return_query=FALSE){
        $this->table='system_data_search_2';
        return $this->remove($param,0,$return_query);
    }



    public function get__colleges($param) {
        $insert_user_stored_proc = "CALL get_searched_colleges(".$param.")";
        $result = $this->db->query($insert_user_stored_proc);
        if ($result !== NULL) {
            return $query->result();
            $this->db->reconnect();
        }else{
            return FALSE;
        }        
    }


    public function delete_system_search_filters($param,$return_query=FALSE){
        $this->table='system_users_college_filter';
        return $this->remove($param,0,$return_query);
    }


    //System facilities
    public function get_system_facilities($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_facilities';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    public function get_system_facilities_in($param,$param_val,$return_query=FALSE){
        $this->table='system_facilities';
        return $this->get_in($param,$param_val,$return_query);
    }

    public function get_group_concat_system_facilities($field_to_concat,$field,$field_value,$return_query=FALSE){
        $this->db->select('GROUP_CONCAT('.$field_to_concat.') as concated_value');
        $this->db->where('FIND_IN_SET('.$field.',"'.$field_value.'")<>0');
        $result=$this->db->get('system_facilities');
        if($return_query==TRUE){
            return $this->db->last_query();
        }else if($return_query==FALSE){
            return $result->first_row();
        }
    }



    public function store_system_users_faqs_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_faqs';
        return $this->store($data,$batch,$return_query);
    }

    public function update_system_users_faqs_data($data,$param,$return_query=FALSE){
        $this->table='system_users_faqs';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function delete_system_users_faqs_data($param,$return_query=FALSE){
        $this->table='system_users_faqs';
        return $this->remove($param,0,$return_query);
    }

    public function get_system_users_faqs_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_users_faqs';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    public function get_system_counts($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_counts';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    //Temp
    public function store_temp($data,$return_query=FALSE){
        $this->table='system_temp';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_temp($param,$return_query=FALSE){
        $this->table='system_temp';
        return $this->remove($param,0,$return_query);
    }

    public function update_temp($data,$param,$return_query=FALSE){
        $this->table='system_temp';
        return $this->modify($data,$param,FALSE,$return_query);
    }

    public function get_system_temp($param,$return_query=FALSE){
        $this->table='system_temp';
         return $this->get_one($param,$return_query);       
    }


    public function get_visit_data($data,$return_query=FALSE){
        $this->table='system_visited';
        return $this->get_one($data,'',$return_query);
    }


    public function __get_visit_data($param=array(),$join=FALSE,$length=6,$start=0,$order_by='visit_total', $order='DESC',$return_query=FALSE){        
        $this->db->distinct();
        if($join==TRUE){
            $this->db->select('system_visited.*,system_blog_posts.post_title,system_blog_posts.post_id,system_blog_posts.post_category_id,system_blog_posts.post_created_at,system_blog_posts.post_cover_image,system_blog_posts.post_status');
            $this->db->join('system_blog_posts','system_blog_posts.post_id=system_visited.visit_type_id','LEFT');
        }else{
            $this->db->select('system_visited.*');
        }

        $this->db->where($param);

        $this->db->group_by('system_blog_posts.post_id');
            
        $this->db->order_by($order_by, $order);

        $this->db->limit($length,$start);
        
        $query = $this->db->get('system_visited');

        if($return_query==FALSE){
            return $query->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }  
    }

    public function add_visit_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_visited';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_visit_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_visited';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function update_visit_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_visited';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function get_total_visit_data($field,$as,$param=null,$return_query=FALSE){
        $this->table='system_visited';
        return $this->get_sum($field,$as,$param,$return_query);
    }


    public function get_visit_date_data($data,$return_query=FALSE){
        $this->table='system_visited_dates';
        return $this->get_one($data,'',$return_query);
    }

    public function add_visit_date_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_visited_dates';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_visit_date_data($param,$soft_delete=FALSE,$deleted_by=0,$return_query=FALSE){
        $this->table='system_visited_dates';
        if($soft_delete==FALSE){
            return $this->remove($param);
        }else if($soft_delete==TRUE){
            return $this->remove_soft($param,$deleted_by);
        }       
    }

    public function update_visit_date_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_visited_dates';
        return $this->modify($data,$param,$batch,$return_query);
    }


    public function get_grades($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_grading_system';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    //Settings
    public function store_mail($data,$return_query=FALSE){
        $this->table='system_mails';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_mail($param,$return_query=FALSE){
        $this->table='system_mails';
        return $this->remove($param,0,$return_query);
    }

    public function get_mail($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_mails';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    //system_users_edu_details
    public function get_edu_details($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_users_edu_details';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    public function store_edu_details($data,$return_query=FALSE){
        $this->table='system_users_edu_details';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_edu_details($param,$return_query=FALSE){
        $this->table='system_users_edu_details';
        return $this->remove($param,0,$return_query);
    }

    public function update_edu_details($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_edu_details';
        return $this->modify($data,$param,$batch,$return_query);
    }


    //system_users_higher_edu_interests
    public function get_higher_edu_interests_details($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_users_higher_edu_interests';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    public function store_higher_edu_interests_details($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_higher_edu_interests';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_higher_edu_interests_details($param,$return_query=FALSE){
        $this->table='system_users_higher_edu_interests';
        return $this->remove($param,0,$return_query);
    }

    public function update_higher_edu_interests_details($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_higher_edu_interests';
        return $this->modify($data,$param,$batch,$return_query);
    }


    //system_users_professional_exp
    public function get_professional_exp_details($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_users_professional_exp';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    public function store_professional_exp_details($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_professional_exp';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_professional_exp_details($param,$return_query=FALSE){
        $this->table='system_users_professional_exp';
        return $this->remove($param,0,$return_query);
    }

    public function update_professional_exp_details($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_users_professional_exp';
        return $this->modify($data,$param,$batch,$return_query);
    }


    //Caste Quota
    public function get_caste_quota($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_caste_quota';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    //Review data
    public function get_review_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_institute_reviews_data';
        if($single_row==TRUE){
            return $this->get_one($param,'',$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }
    }

    public function get_total_review_data($param=null,$return_query=FALSE){
        $this->table='system_institute_reviews_data';
        return $this->get_total_count($param,$return_query);
    }


    public function add_review_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_institute_reviews_data';
        return $this->store($data,$batch,$return_query);
    }


    public function update_review_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_institute_reviews_data';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function get_review_datas($post=array(),$param=array(),$return_query=FALSE){
        $this->db->select('system_institute_reviews_data.*,system_users_colleges.college_user_id,system_users_colleges.college_name,system_users_colleges.college_short_name');
        $this->db->join('system_users_colleges','system_users_colleges.college_user_id=system_institute_reviews_data.review_inst_id','LEFT');

        if($param!=NULL){
            $this->db->where($param);           
        }

        if(isset($post['length']) && $post['length'] != -1){
            $this->db->limit($post['length'],$post['start']);   
        }
        
        $query = $this->db->get('system_institute_reviews_data');

        if($return_query==FALSE){
            return $query->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }


    public function __get_review_datas($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_institute_reviews_data';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    public function _get_review_data($post=array(),$param=array(),$group_by=FALSE,$count=FALSE,$return_query=FALSE){
        if($group_by==TRUE){
            $this->db->select('system_users_colleges.college_user_id ,system_users_colleges.college_name,count(*) as total_reviews');
            $this->db->join('system_users_colleges','system_users_colleges.college_user_id=system_institute_reviews_data.review_inst_id','INNER');
        }else{
            $this->db->select('system_institute_reviews_data.*');
        }
        
        $i = 0;


        if(isset($param['review_approved']) && $param['review_approved']!=null){
            $this->db->where('review_approved',$param['review_approved']);
        }

        if(isset($param['review_inst_id']) && $param['review_inst_id']!=null){
            $this->db->where('review_inst_id',$param['review_inst_id']);
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

        if($group_by==TRUE){
            $this->db->group_by('system_users_colleges.college_user_id ,system_users_colleges.college_name');
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
            
            $query = $this->db->get('system_institute_reviews_data');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_institute_reviews_data');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function get_review_question_data($param,$single_row=TRUE,$group_by='',$return_query=FALSE){
        $this->table='system_institute_reviews_question_data';
        if($single_row==TRUE){
            return $this->get_one($param,$group_by,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }
    }

    public function add_review_question_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_institute_reviews_question_data';
        return $this->store($data,$batch,$return_query);
    }


    public function update_review_question_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_institute_reviews_question_data';
        return $this->modify($data,$param,$batch,$return_query);
    }


    //Comments
    public function store_comments($data,$return_query=FALSE){
        $this->table='system_comments';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_comments($param,$return_query=FALSE){
        $this->table='system_comments';
        return $this->remove($param,0,$return_query);
    }

    public function get_comments($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_comments';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function _get_comments($param,$order_by=null,$order='DESC',$length=10,$start=0,$return_query=FALSE){
        $this->db->select('system_comments.*,system_users_profile.user_fullname');
        $this->db->join('system_users_profile','system_users_profile.user_m_id=system_comments.comment_user_id','INNER');

        $this->db->where($param);

        $this->db->order_by($order_by,$order);
        $this->db->limit($length,$start);

        $query=$this->db->get('system_comments');
        if($return_query==FALSE){
            return $query->result();
        }else if($return_query==TRUE){
            return $this->db->last_query();
        }
    }

    public function __get_comments($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){

        if(isset($param['comment_type']) && $param['comment_type']=='college'){
            $this->db->select('system_comments.*,system_users_profile.user_fullname,system_users_colleges.college_name');
            $this->db->join('system_users_profile','system_users_profile.user_m_id=system_comments.comment_user_id','LEFT');
            $this->db->join('system_users_colleges','system_users_colleges.college_user_id=system_comments.comment_type_id','LEFT');
        }else{
            $this->db->select('system_comments.*,system_users_profile.user_fullname');
            $this->db->join('system_users_profile','system_users_profile.user_m_id=system_comments.comment_user_id','LEFT');
        }
        
        
        $i = 0;


        // if(isset($param['review_approved']) && $param['review_approved']!=null){
        //     $this->db->where('review_approved',$param['review_approved']);
        // }

        // if(isset($param['review_inst_id']) && $param['review_inst_id']!=null){
        //     $this->db->where('review_inst_id',$param['review_inst_id']);
        // }

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
            
            $query = $this->db->get('system_comments');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_comments');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    public function store_comments_reply($data,$return_query=FALSE){
        $this->table='system_comments_reply';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_comments_reply($param,$return_query=FALSE){
        $this->table='system_comments_reply';
        return $this->remove($param,0,$return_query);
    }

    public function get_comments_reply($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_comments_reply';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }


    //Wayto Ratings

    public function get_rating($param,$single_row=TRUE,$order_by=null,$order='DESC',$return_query=FALSE){
        $this->table='system_ratings';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$order_by,$order,$return_query);
        }       
    }

    public function store_rating($data,$return_query=FALSE){
        $this->table='system_ratings';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_rating($param,$return_query=FALSE){
        $this->table='system_ratings';
        return $this->remove($param,0,$return_query);
    }

    public function update_rating($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_ratings';
        return $this->modify($data,$param,$batch,$return_query);
    }


    //Broucher Types
    public function store_broucher_types($data,$return_query=FALSE){
        $this->table='system_broucher_types';
        return $this->store($data,FALSE,$return_query);
    }

    public function delete_broucher_types($param,$return_query=FALSE){
        $this->table='system_broucher_types';
        return $this->remove($param,0,$return_query);
    }

    public function get_broucher_types($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_broucher_types';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    public function get_broucher_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->db->select('system_broucher_data.*,system_broucher_types.*');
        $this->db->join('system_broucher_types','system_broucher_types.broucher_type_id=system_broucher_data.broucher_types_id','INNER');

        $this->db->where($param);
        $query=$this->db->get('system_broucher_data');

        if($single_row==TRUE){
            if($return_query==FALSE){
                return $query->first_row();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }else if($single_row==FALSE){
            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }
        }       
    }

    public function _get_broucher_data($post=array(),$param=array(),$count=FALSE,$return_query=FALSE){
        $this->db->select('system_broucher_data.*,system_broucher_types.*');
        $this->db->join('system_broucher_types','system_broucher_types.broucher_type_id=system_broucher_data.broucher_types_id','INNER');
        
        $i = 0;

        if(isset($param['broucher_data_type'])){
            $this->db->where('broucher_data_type',$param['broucher_data_type']);
        }

        if(isset($param['broucher_data_type_id'])){
            $this->db->where('broucher_data_type_id',$param['broucher_data_type_id']);
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
            
            $query = $this->db->get('system_broucher_data');

            if($return_query==FALSE){
                return $query->result();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }       
            
        }else if($count==TRUE){
            $query = $this->db->get('system_broucher_data');
            if($return_query==FALSE){
                return $query->num_rows();
            }else if($return_query==TRUE){
                return $this->db->last_query();
            }           
        }
    }


    //Search Page Data
    public function store_search_page_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_search_page_data';
        return $this->store($data,$batch,$return_query);
    }

    public function delete_search_page_data($param,$return_query=FALSE){
        $this->table='system_search_page_data';
        return $this->remove($param,0,$return_query);
    }

    public function get_search_page_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_search_page_data';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }


    //Menu widget data
    public function get_menu_widget_data($param,$single_row=TRUE,$return_query=FALSE){
        $this->table='system_menu_widgets';
        if($single_row==TRUE){
            return $this->get_one($param,$return_query);
        }else if($single_row==FALSE){
            return $this->get_many($param,$return_query);
        }       
    }

    public function store_menu_widget_data($data,$batch=FALSE,$return_query=FALSE){
        $this->table='system_menu_widgets';
        return $this->store($data,$batch,$return_query);
    }


    public function update_menu_widget_data($data,$param,$batch=FALSE,$return_query=FALSE){
        $this->table='system_menu_widgets';
        return $this->modify($data,$param,$batch,$return_query);
    }

    public function delete_menu_widget_data($param,$return_query=FALSE){
        $this->table='system_menu_widgets';
        return $this->remove($param,0,$return_query);
    }

}