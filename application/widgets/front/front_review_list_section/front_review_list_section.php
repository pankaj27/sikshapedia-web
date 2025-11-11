<?php


/**
 * 
 */
class Front_review_list_section extends Widget
{

    function run($visible = FALSE,$user_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        // $reviews=$this->sm->get_review_datas(null,array('review_user_anonymus_id!='=>null));

        // print_obj($reviews);die;

        // $data['user_image']=$user_image;

        $data=array();

        if ($visible) $this->render('front_review_list_section',$data);
    }
}