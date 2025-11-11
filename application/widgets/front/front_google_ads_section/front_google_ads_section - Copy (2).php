<?php


/**
 * 
 */
class Front_google_ads_section extends Widget
{
    function run($visible = FALSE,$ads_type='horizontal',$ca_pub='9545373166119354',$ad_slot='',$ad_format=null,$ad_responsive){
        $this->front_theme='default';
        $this->get_type(2);

        $data['ads_type']=$ads_type;
        $data['ca_pub']=$ca_pub;
        $data['ad_slot']=$ad_slot;

        $data['ad_format']=$ad_format;
        $data['ad_responsive']=$ad_responsive;

        if ($visible) $this->render('front_google_ads_section',$data);
    }
}