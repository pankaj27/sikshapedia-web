<?php


/**
 * 
 */
class Front_gallery_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    	
        $segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //inner menues



        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
            $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

            if(!empty($country_data)){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

                if(!empty($slug_found)){
                    $slug_type=$slug_found->slug_type;
                    $slug_type_id=$slug_found->slug_type_id;

                    if($slug_type=='6'){

                    }else if($slug_type=='7'){
                        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));                        

                        $gallery_types=$this->sm->get_gallery_types(array('gallery_type_status'=>'1'),FALSE);

                        if(!empty($gallery_types)){
                            foreach ($gallery_types as $key => $types) {

                                $param=array(
                                    'order'=>array('storage_id' => 'DESC'),
                                    '_user_storage_type'=>$types->gallery_type_alias,
                                    'user_file_type_id'=>$slug_type_id
                                );

                                $files = $this->sm->_get_gallery_files(null,$param,FALSE,FALSE);

                                if(!empty($files)){
                                    foreach ($files as $key => $value) {
                                        $gallery_image[]=array(
                                            'storage_id'=>encode_data($value->storage_id),
                                            'storage_file'=>$value->media_disk_path_relative
                                        );
                                    }
                                }else{
                                    $gallery_image=array();
                                }
                                    

                                $gallery_data[]=array(
                                    'gallery_type'=>strtoupper($types->gallery_type),
                                    'gallery_files'=>$gallery_image
                                );
                            }
                        }else{
                            $gallery_data=array();
                        }                        
                    }else{
                        $gallery_data=array();
                    }
                }else{
                    $gallery_data=array();
                }
            }else{
                $gallery_data=array();
            }
        }else{
            $gallery_data=array();
        }

       //print_obj($gallery_data);die;

        $data['gallery_data']=$gallery_data;

        if ($visible) $this->render('front_gallery_section',$data);
    }
}