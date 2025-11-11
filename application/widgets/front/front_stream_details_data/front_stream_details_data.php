<?php


/**
 * 
 */
class Front_stream_details_data extends Widget
{
    function run($visible = FALSE,$ids=null) {
        $this->front_theme='default';
        $this->get_type(2);

        $stream_id=$ids['stream_id'];
        $inner_menu_id=$ids['stream_inner_menu_id'];
        $menu_slug=$ids['stream_slug'];

        $current_url=decode_data($this->data['current_url']);

        $stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

        if($inner_menu_id!=''){

            $menu_data=$this->sm->get_menues(array('menu_id'=>$inner_menu_id,'menu_link'=>$current_url));

            if(!empty($menu_data)){
                $stream_details_data_param=array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_data->menu_id);
                $stream_faq_details_param=array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_data->menu_id);
            }else{

                $stream_details_data_param=array('stream_id'=>$stream_id);
                $stream_faq_details_param=array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_data->menu_id);
            }
        }else{
           $menu_data=$this->sm->get_menues(array('menu_slug'=>'overview','menu_link'=>$current_url));

            $stream_details_data_param=array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_data->menu_id);
            $stream_faq_details_param=array('stream_id'=>$stream_id,'stream_menu_id'=>$menu_data->menu_id);
        }

        $stream_details_data=$this->strm->get_stream_details_data($stream_details_data_param,FALSE,'stream_serial','ASC');
        $stream_faq_details=$this->strm->get_stream_details_faq_data($stream_faq_details_param,FALSE);

        if($inner_menu_id!=''){
            $faq_heading=ucwords(str_replace('-', ' ', $menu_data->menu_name)).': FAQs';
        }else{
            $faq_heading='FAQs';
        }

        //print_obj($stream_details_data);die;


        if(!empty($stream_details_data)){
            $uploaded_by_user_data=$this->um->_get_internal_user(array('user_id'=>$stream_details_data[0]->created_by));


            if(!empty($uploaded_by_user_data)){
                if($uploaded_by_user_data->user_role!='1'){
                    $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$uploaded_by_user_data->user_id),NULL,FALSE);



                    if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
                      $data['curator_image']=$user_image->media_disk_path_relative;
                      $data['creator_image_name']=$uploaded_by_user_data->user_fullname.'- Sikshapedia Team';
                    }else{
                      $data['curator_image']=base_url('public/data/app/app_data/sikshapedia_logo.png');
                      $data['creator_image_name']='Sikshapedia Team';        
                    }

                    $data['uploaded_by']=$uploaded_by_user_data->user_fullname;
                }else{
                    $data['uploaded_by']='Sikshapedia Team';
                    $data['creator_image_name']='Sikshapedia Team'; 
                    $data['curator_image']=base_url('public/data/app/app_data/Sikshapedia_logo.png');
                }                            
            }else{
                 $data['creator_image_name']='Sikshapedia Team';
                $data['uploaded_by']='Sikshapedia Team';
                $data['curator_image']=base_url('public/data/app/app_data/Sikshapedia_logo.png');
            }

            $data['updated_on']=date('F d, Y',strtotime($stream_details_data[0]->created_at)); 
        }else{
            $data['uploaded_by']='Sikshapedia Team';
            $data['updated_on']='';
        } 

        $data['faq_heading']=$faq_heading;

        $data['stream_data']=$stream_data;
        $data['stream_details_data']=$stream_details_data;
        $data['stream_faq_details']=$stream_faq_details;

        if ($visible) $this->render('front_stream_details_data',$data);

    }
}