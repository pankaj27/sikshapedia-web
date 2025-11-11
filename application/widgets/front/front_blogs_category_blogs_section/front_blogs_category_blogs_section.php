<?php


/**
 * 
 */
class Front_blogs_category_blogs_section extends Widget
{
    function run($visible = FALSE,$post_category_id=0,$post_id=0){
        $this->front_theme='default';
        $this->get_type(2);

        $_blog_post_data=array();

        if($post_category_id!=0){

            //'post_id!='=>$post_id,

            $blog_post_data=$this->bm->get_blog_data(array('post_category_id'=>$post_category_id,'post_status'=>'published'),FALSE);


            if(!empty($blog_post_data)){
                foreach ($blog_post_data as $key => $value) {
                    $slug_url_data=$this->sm->__get_slug_urls('url_type,url_glob_type,url_type_id,url_value',array('url_glob_type'=>'blog_post_url','url_type'=>'system_blog','url_type_id'=>$value->post_id));
                    $_blog_post_data[]=array(
                        'blog_link'=>$slug_url_data->url_value,
                        'blog_title'=>$value->post_title,
                        'blog_cover_image'=>$value->post_cover_image
                    );
                }
            }

            $data['blog_post_data']=$_blog_post_data;

            if ($visible) $this->render('front_blogs_category_blogs_section',$data);
        }
    }
}