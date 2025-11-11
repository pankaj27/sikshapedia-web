<?php


/**
 * 
 */
class Front_blogs_post_gallery_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $this->load->model('blogs_model','bm');

        $blog_post_data=array();

        $latest_blogs=$this->bm->get_last_3_months_blog(array('post_status'=>'published'));

        if(!empty($latest_blogs)){
            foreach ($latest_blogs as $key => $value) {

                $post_link=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_glob_type'=>'blog_post_url','url_type_id'=>$value->post_id));

                $post_intro_content=$this->bm->get_blog_content_data('content_value,content_post_id,content_type',array('content_post_id'=>$value->post_id,'content_type'=>'general'));

                $post_indtro=strlen($post_intro_content->content_value) > 1050 ? substr($post_intro_content->content_value,0,50)."..." : $post_intro_content->content_value;

                $blog_post_data[]=array(
                    'post_category'=>strtoupper($value->blog_category_name),
                    'post_title'=>$value->post_title,
                    'post_cover_image'=>$value->post_cover_image,
                    'post_created_at'=>date('M d,Y',strtotime($value->post_created_at)),
                    'post_link'=>$post_link->url_value,
                    'post_intro'=>$post_intro,
                    'post_video'=>''
                );
            }
        }

        // print_obj($blog_post_data);die;
      

        $data['blog_post_data']=$blog_post_data;

        if ($visible) $this->render('front_blogs_post_gallery_section',$data);
        
    }
}