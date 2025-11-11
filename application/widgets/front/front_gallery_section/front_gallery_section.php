<?php


/**
 * 
 */
class Front_gallery_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

   
        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));                        

        $gallery_types=$this->sm->get_gallery_types(array('gallery_type_status'=>'1'),FALSE);

        //print_obj($gallery_types);die;

        if(!empty($gallery_types)){
            foreach ($gallery_types as $key => $types) {

                $param=array(
                    'order'=>array('storage_id' => 'DESC'),
                    '_user_storage_type'=>$types->gallery_type_alias,
                    'user_file_type_id'=>$college_id
                );

                $files = $this->sm->_get_gallery_files(null,$param,FALSE,FALSE);

                //print_obj($files);die;

                if(!empty($files)){
                    foreach ($files as $key => $value) {
                        if(file_exists($value->media_disk_path)){
                            $gallery_image[$types->gallery_type][]=array(
                                'storage_id'=>encode_data($value->storage_id),
                                'storage_file'=>$value->media_disk_path_relative,
                                'storage_file_alt'=>$value->user_file_alt_title,
                                'storage_file_caption'=>$value->college_gallery_image_caption,
                                'storage_file_description'=>$value->user_file_description,
                            );
                        }
                            
                    }
                }else{
                    $gallery_image=array();
                }
                    

                $gallery_data[]=array(
                    'gallery_type'=>strtoupper($types->gallery_type),
                    'gallery_files'=>$gallery_image[$types->gallery_type]
                );
            }
        }else{
            $gallery_data=array();
        }

       //print_obj($gallery_data);die;

        $data['gallery_data']=$gallery_data;

        if ($visible) $this->render('front_gallery_section',$data);
    }
}