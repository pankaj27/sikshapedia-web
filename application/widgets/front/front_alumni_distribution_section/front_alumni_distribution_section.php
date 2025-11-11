<?php


/**
 * 
 */
class Front_alumni_distribution_section extends Widget
{
    function run($visible = FALSE,$college_id=0){

        $this->front_theme='default';
        $this->get_type(2);

        if ($visible) $this->render('front_alumni_distribution_section',$data);
    }
}