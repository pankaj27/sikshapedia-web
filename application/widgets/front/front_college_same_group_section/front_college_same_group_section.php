<?php


/**
 * 
 */
class Front_college_same_group_section extends Widget
{
    
    function run($visible = FALSE,$ids=null) {
        $this->front_theme='default';
        $this->get_type(2);


         $country_id=$ids['country_id'];
         $college_id=$ids['college_id'];
         $college_type=$ids['college_type'];

         $_group_colleges=array();


         $group_colleges=$this->im->get_college_group_data(array('group_inst_parent_id'=>$college_id),FALSE);

         if(!empty($group_colleges)){
            foreach ($group_colleges as $key => $value) {
                $user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->group_inst_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

                if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
                    $college_logo=$user_logo->media_disk_path_relative;
                }else{
                    $college_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
                }

                $_group_colleges[]=array(
                    'college_name'=>$value->group_inst_name,
                    'college_city'=>$value->group_inst_city,
                    'college_state'=>$value->group_inst_state,
                    'college_url'=>$value->group_inst_link,
                    'college_logo'=>$college_logo
                );
            }
         }

         $data['college_groups']=$_group_colleges;


         if ($visible) $this->render('front_college_same_group_section',$data);
    }

}