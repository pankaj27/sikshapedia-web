<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Coupon extends BaseFrontController
{
    public function index(){
        $slug_1=$this->uri->segment(1,0);

        $categories=array();
        $streams=array();

        if($slug_1=='coupons-and-deals'){

            if(session_userdata('isUserLoggedin')){
                $this->theme->title($this->data['page_title'])->load('webpage/others/vw_coupons_page', $this->data);
            }else{
                $this->theme->title($this->data['page_title'])->add_partial('partial_register_cdm_modal')->load('webpage/others/vw_coupons_page', $this->data);
            }
            
        }else{
            redirect(base_url());
        }


        
    }
}