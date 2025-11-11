<?php


/**
 * 
 */
class Front_exam_notifications_section extends Widget
{

    function run($visible = FALSE) {
        $this->front_theme='default';
        $this->get_type(2);


        $slugs_in_notify=$this->sm->_get_slug_urls(array('url_type'=>'exam','url_type_in_notification'=>'yes'));


        $data['notifications_data']=$slugs_in_notify;
        if ($visible) $this->render('front_exam_notifications_section',$data);
    }
}