<?php


/**
 * 
 */
class Front_college_account_settings_section extends Widget
{

    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);

        

        if ($visible) $this->render('front_college_account_settings_section',$data);
    }
}