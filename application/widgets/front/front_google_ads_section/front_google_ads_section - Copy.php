<?php


/**
 * 
 */
class Front_google_ads_section extends Widget
{
    function run($visible = FALSE,$ads_type='horizontal'){
        $this->front_theme='default';
        $this->get_type(2);

        $data['ads_type']=$ads_type;

        if ($visible) $this->render('front_google_ads_section',$data);
    }
}