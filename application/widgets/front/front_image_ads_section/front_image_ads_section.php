<?php


/**
 * 
 */
class Front_image_ads_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

        $today=date('Y-m-d');
        $ads_data=array();

        if(isset($ids['ads_id'])){
            $ads_id=$ids['ads_id'];
            $ads=$this->um->_get_listing_package_users(array('listing_id'=>$ads_id,'listing_status'=>'1'));
        }else{
            $page_link=$ids['page_link'];
            $ads_position=$ids['ads_position'];
            $ads=$this->um->_get_listing_package_users(array('listing_page_link'=>$page_link,'listing_category'=>'CUSTOM_IMG_ADS','listing_package_type_ids_values'=>$ads_position,'listing_status'=>'1'));
        }
        

         // print_obj($ads);die;

        if(!empty($ads)){

            $ads_start_date=date('Y-m-d',strtotime($ads->listing_package_start_date));
            $ads_end_date=($ads->listing_package_end_date!=NULL)?date('Y-m-d',strtotime($ads->listing_package_end_date)):'';

            if(!empty($ads_end_date)){
                if($today>=$ads_start_date && $today<=$ads_end_date){
                    $ads_active='yes';
                }else{
                    $ads_active='no';
                }
            }else{
                if($today>=$ads_start_date){
                    $ads_active='yes';
                }else{
                    $ads_active='no';
                }
            }

            if($ads_active=='yes'){
                if ($this->ua->is_mobile()) {
                    // The device is a mobile device
                    $device='mobile';
                } else {
                    // The device is a desktop
                    $device='desktop';
                }

                if($device=='mobile'){
                    $user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$ads->listing_id,'user_storage_type_3'=>'mobile'));

                    $img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

                    if(!empty($img)){
                        $ads_data=array(
                            'ads_id'=>encode_data($ads->listing_id),
                            'ads_image'=>$img->media_disk_path_relative,
                            'image_height'=>$ads->listing_height,
                            'image_width'=>$ads->listing_width,
                            'image_title'=>$ads->listing_short_desc,
                            'image_alt'=>$ads->listing_name,
                            'ads_link'=>$ads->listing_link,
                            'track_visits'=>$ads->listing_track
                        );
                    } 
                }else{
                    $user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$ads->listing_id,'user_storage_type_3'=>'desktop'));

                    $img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

                    if(!empty($img)){
                        $ads_data=array(
                            'ads_id'=>encode_data($ads->listing_id),
                            'ads_image'=>$img->media_disk_path_relative,
                            'image_height'=>$ads->listing_height,
                            'image_width'=>$ads->listing_width,
                            'image_title'=>$ads->listing_short_desc,
                            'image_alt'=>$ads->listing_name,
                            'ads_link'=>$ads->listing_link,
                            'track_visits'=>$ads->listing_track
                        );
                    } 
                } 
            }else{
                $this->um->update_listing_package_users(array('listing_status'=>'2'),array('listing_id'=>$ads->listing_id));
            }                             
        }

        // print_obj($ads_data);die;

      $data['ads']=$ads_data;

      if ($visible) $this->render('front_image_ads_section',$data);
    }
}