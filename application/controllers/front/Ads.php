<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Ads extends BaseFrontController
{
    public function indexCollegesTopAds(){

        $param['url']='https://api.waytoadmissions.com/v1/adsapi/ads_frame/_searched_param/COLLEGE_PAGE_AT_TOP';

        $response=curl_get($param);
        $this->data['ads_data']= $response['success'];

       // print_obj($this->data['ads_data']);die;

        $this->theme->title('')->remove_partial(array('partial_header','partial_footer','partial_login_modal','partial_password_change_modal','partial_claim_modal','partial_apply_modal','partial_account_header','partial_apply_job_modal','partial_account_header_public','partial_account_faculties_settings_modal','partial_account_course_settings_modal','partial_register_modal','partial_register_specific_modal'))->load('ads/vw_embeded', $this->data);
    }

    public function indexShowCampaign($campaign_code){

        //echo $campaign_code;

        $today=date('Y-m-d');
        $ads_data=array();

        $ads=$this->um->get_listing_package_users(array('listing_code'=>$campaign_code,'listing_status'=>'1'));

      //print_obj($ads);

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

           //echo $ads_active;die;

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
                            'track_visits'=>$ads->listing_track,
                            'listing_category'=>$ads->listing_category
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
                            'track_visits'=>$ads->listing_track,
                            'listing_category'=>$ads->listing_category
                        );
                    } 
                } 
            }else{
                $this->um->update_listing_package_users(array('listing_status'=>'2'),array('listing_id'=>$ads->listing_id));
            }

           // print_obj($ads_data);die;

            $this->data['ads']=$ads_data;

            $this->load->view('ads/vw_embeded', $this->data);

        }

        
    }
}