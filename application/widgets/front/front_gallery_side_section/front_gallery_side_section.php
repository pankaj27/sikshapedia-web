<?php


/**
 * 
 */
class Front_gallery_side_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

         $country_data=$this->com->get_country(array('country_id'=>$country_id));

            if(!empty($country_data)){
                $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id)); 

                $param=array(
                    'order'=>array('storage_id' => 'DESC'),
                    'user_file_type_id'=>$college_id,
                    'user_storage_type!='=>'user_logo',
                    'user_storage_type_3'=>'gallery_files'
                );

                $post['length']=10;
                $post['start']=0;


                $files = $this->sm->_get_gallery_files($post,$param,FALSE,FALSE);
               

                if(!empty($files)){
                    foreach ($files as $key => $value) {

                        if(file_exists($value->media_disk_path)){
                             $gallery_data[]=array(
                                'storage_id'=>encode_data($value->storage_id),
                                'storage_file'=>$value->media_disk_path_relative.'?h=100&amp;w=205&amp;mode=stretch',
                                'storage_file_alt'=>$value->user_file_alt_title,
                                'storage_file_caption'=>$value->college_gallery_image_caption,
                                'storage_file_description'=>$value->user_file_description,
                            );
                        }

                           
                    }
                }else{
                    $gallery_data=array();
                } 
            }else{
                $gallery_data=array();
            }

       //print_obj($gallery_data);die;

        $data['gallery_data']=$gallery_data;
        $data['gallery_link']=$college_data->access_url.'/gallery';

        if ($visible) $this->render('front_gallery_side_section',$data);
    }
}