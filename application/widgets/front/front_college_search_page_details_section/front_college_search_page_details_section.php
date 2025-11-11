<?php


/**
 * 
 */
class Front_college_search_page_details_section extends Widget
{

    function run($visible = FALSE,$ids=null) {
        $this->front_theme='default';
        $this->get_type(2);


        //print_obj($ids);


        $url_id=$ids['url_id'];

        //echo $url_id;die;

        $page_data=$this->sm->get_search_page_data(array('page_id'=>$url_id,'page_data_type!='=>'faqs'),FALSE);

        $page_faq_data=$this->sm->get_search_page_data(array('page_id'=>$url_id,'page_data_type'=>'faqs'),FALSE);

        //print_obj($page_data);die;

        $data['page_data']=$page_data;
        $data['page_faq_data']=$page_faq_data;

        if ($visible) $this->render('front_college_search_page_details_section',$data);
    }

}