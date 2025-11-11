<?php


/**
 * 
 */
class Front_stream_details_data extends Widget
{
    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);

        $segment_1=$this->uri->segment(1,0);//static segment "courses"
        $segment_2=$this->uri->segment(2,0);//stream name
        $segment_3=$this->uri->segment(3,0);//stream inner menu

        //echo $segment_3;die;

        $current_url=decode_data($this->data['current_url']);


        if(is_string($segment_1) && $segment_1=='courses'){

            //echo $segment_1;die;

            if(is_string($segment_2) && $segment_2!='0'){
                $slug_data=$this->sm->get_slug(array('slug_value'=>$segment_2,'slug_type'=>3));

                //print_obj($slug_data);

                if(!empty($slug_data)){
                    $slug_type=$slug_data->slug_type;
                    $slug_type_id=$slug_data->slug_type_id;

                    $stream_data=$this->strm->get_stream(array('stream_id'=>$slug_type_id));

                    //echo $segment_3;die;

                    //echo $slug_type_id;die;

                    if($segment_3!='0'){

                        $menu_data=$this->sm->get_menues(array('menu_slug'=>$segment_3,'menu_link'=>$current_url));

                        //print_obj($menu_data);die;

                        if(!empty($menu_data)){
                            $stream_details_data=$this->strm->get_stream_details_data(array('stream_id'=>$slug_type_id,'stream_menu_id'=>$menu_data->menu_id),FALSE,'stream_serial','ASC'); 
                            $stream_faq_details=$this->strm->get_stream_details_faq_data(array('stream_id'=>$slug_type_id,'stream_menu_id'=>$menu_data->menu_id),FALSE);
                        }else{
                            $stream_details_data=$this->strm->get_stream_details_data(array('stream_id'=>$slug_type_id),FALSE,'stream_serial','ASC');
                            $stream_faq_details=$this->strm->get_stream_details_faq_data(array('stream_id'=>$slug_type_id,'stream_menu_id'=>$menu_data->menu_id),FALSE);
                        }
                    }else{
                       $menu_data=$this->sm->get_menues(array('menu_slug'=>'overview','menu_link'=>$current_url));
                       $stream_details_data=$this->strm->get_stream_details_data(array('stream_id'=>$slug_type_id,'stream_menu_id'=>$menu_data->menu_id),FALSE,'stream_serial','ASC');
                       $stream_faq_details=$this->strm->get_stream_details_faq_data(array('stream_id'=>$slug_type_id,'stream_menu_id'=>$menu_data->menu_id),FALSE);
                    }

                    if($segment_3!='0'){
                        $faq_heading=ucwords(str_replace('-', ' ', $segment_3)).': FAQs';
                    }else{
                        $faq_heading=ucwords(str_replace('-', ' ', $segment_2)).' Courses: FAQs';
                    }


                    if(!empty($stream_details_data)){
                        $uploaded_by_user_data=$this->um->_get_internal_user(array('user_id'=>$stream_details_data[0]->created_by));

                        if(!empty($uploaded_by_user_data)){
                            if($uploaded_by_user_data->user_role!='1'){
                                $data['uploaded_by']=$uploaded_by_user_data->user_fullname;
                            }else{
                                $data['uploaded_by']='Waytoadmissions';
                            }                            
                        }else{
                            $data['uploaded_by']='Waytoadmissions';
                        }

                        $data['updated_on']=date('F d, Y',strtotime($stream_details_data[0]->created_at)); 
                    }else{
                        $data['uploaded_by']='Waytoadmissions';
                        $data['updated_on']='';
                    } 

                    $data['faq_heading']=$faq_heading;

                    $data['stream_data']=$stream_data;
                    $data['stream_details_data']=$stream_details_data;
                    $data['stream_faq_details']=$stream_faq_details;

                    //print_obj($stream_faq_details);die;
                }                
            }
        }



        if ($visible) $this->render('front_stream_details_data',$data);

    }
}