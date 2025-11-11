<?php


/**
 * 
 */
class Front_blogs_feature_blog_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);
        $this->load->model('blogs_model','bm');

        $_blog_post_data=array();

        $blog_post_data=$this->bm->___get_blog_data(array('post_status'=>'published'));

        //print_obj($blog_post_data);die;


        if(!empty($blog_post_data)){
            foreach ($blog_post_data as $key => $value) {
                $slug_url_data=$this->sm->__get_slug_urls('url_type,url_glob_type,url_type_id,url_value',array('url_glob_type'=>'blog_post_url','url_type'=>'system_blog','url_type_id'=>$value->post_id));
                $_blog_post_data[]=array(
                    'blog_link'=>$slug_url_data->url_value,
                    'blog_title'=>$value->post_title,
                    'blog_exerpt'=>$value->post_exerpt,
                    'blog_cover_image'=>$value->post_cover_image
                );
            }
        }

        $data['blog_post_data']=$_blog_post_data;

        if ($visible) $this->render('front_blogs_feature_blog_section',$data);        
    }
}