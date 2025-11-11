<?php


/**
 * 
 */
class Front_exam_details_data extends Widget
{
    function run($visible = FALSE,$exam_id=0,$menu_id=0,$menu_slug='overview') {
        $this->front_theme='default';
        $this->get_type(2);

        //echo $exam_id;die;


        $data=array();

        $_cmenues=array();

        //$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_slug'=>$menu_slug),TRUE);

        $menu_data=$this->sm->get_menues_specific('menu_id,menu_parent_id,menu_name,menu_link,menu_link_id,menu_is_active,menu_link_type,menu_is_inner,menu_slug',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_slug'=>$menu_slug,'menu_link_id'=>$exam_id,'menu_is_active'=>'1'),TRUE);

       // print_obj($menu_data);die;

 

        if($menu_id!=0){
            $param=array('exam_id'=>$exam_id,'exam_menu_id'=>$menu_id,'exam_data_type!='=>'faq');
        }else{
            //$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_slug'=>$menu_slug),TRUE,null,'DESC',FALSE);
            $param=array('exam_id'=>$exam_id,'exam_menu_id'=>$menu_data->menu_id,'exam_data_type!='=>'faq');
        }


        //print_obj($menu_data);

        $exam_details_data=$this->strm->get_exam_details_data($param,FALSE,'exam_serial','ASC');

        // print_obj($exam_details_data);die;


        $exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

        //print_obj($exam_data);die;

        $data['exam_menu_faq_heading']=$exam_data->exam_short_name.' '.$menu_data->menu_name.' FAQs';


        $data['exam_faq_menu_details']=$this->strm->get_exam_details_data(array('exam_id'=>$exam_id,'exam_menu_id'=>$menu_id,'exam_data_type'=>'faq'),FALSE);

        if($menu_data->menu_parent_id!=null && $menu_data->menu_parent_id>0){
            //echo 'hi';
           // $cmenues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>$menu_data->menu_parent_id),FALSE,'menu_serial','ASC');


            $cmenues=$this->sm->get_menues_specific('menu_id,menu_name,menu_link,menu_link_id,menu_is_active,menu_link_type,menu_is_inner,menu_slug,menu_serial',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>$menu_data->menu_parent_id,'menu_is_active'=>'1'),FALSE,'menu_serial','ASC');
        }else{
           // echo 'hi2';
           //$cmenues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>$menu_data->menu_id),FALSE,'menu_serial','ASC'); 


            $cmenues=$this->sm->get_menues_specific('menu_id,menu_name,menu_link,menu_link_id,menu_is_active,menu_link_type,menu_is_inner,menu_slug,menu_serial',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_id,'menu_parent_id'=>$menu_data->menu_id),FALSE,'menu_serial','ASC');
        }

        //die;
        

        if(!empty($cmenues)){
            foreach ($cmenues as $k => $v) {
                $_cmenues[]=array(
                    'menu_id'=>$v->menu_id,
                    'menu_name'=>$v->menu_name,
                    'menu_link'=>$v->menu_link,
                    'menu_selected'=>($v->menu_id===$menu_data->menu_id)?'style="color:#fff;background-color:#3b3b3b;border-color:#3b3b3b;"':''
                );
            }
        }

        //print_obj($_cmenues);die;

        $data['cmenues']=$_cmenues;

        if(!empty($exam_details_data)){

            //print_obj($exam_details_data);die;


            $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$exam_details_data[0]->created_by));

            $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$exam_details_data[0]->created_by),NULL,FALSE);


            //print_obj($user_image);die;

            if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
              $data['user_image']=$user_image->media_disk_path_relative;
            }else{
              $data['user_image']=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
            }


            $data['uploaded_by']=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:'Waytoadmissions Team';

            $data['uploaded_by_alt']=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname.' Waytoadmissions Team':'Waytoadmissions Team';

            $data['data_updated_on']=date('M d,Y',strtotime($exam_details_data[0]->created_at));

            $data['exam_details_data']=$exam_details_data;
        }

            

        if ($visible) $this->render('front_exam_details_data',$data);

    }
}