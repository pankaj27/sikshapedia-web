<?php


/**
 * 
 */
class Front_blogs_hot_topic_section extends Widget
{
    function run($visible = FALSE,$post_id=0){
        $this->front_theme='default';
        $this->get_type(2);
        $this->load->model('blogs_model','bm');

        $_blog_post_data=array();

        if($post_id!=0){

            //'post_id!='=>$post_id,

            $blog_post_data=$this->sm->__get_visit_data(array('visit_type'=>'BLOGS','post_status'=>'published'),TRUE);

            //print_obj($blog_post_data);die;


            if(!empty($blog_post_data)){
                foreach ($blog_post_data as $key => $value) {
                    $slug_url_data=$this->sm->__get_slug_urls('url_type,url_glob_type,url_type_id,url_value',array('url_glob_type'=>'blog_post_url','url_type'=>'system_blog','url_type_id'=>$value->post_id));

                    $blog_category=$this->bm->get_blog_categories(array('blog_category_id'=>$value->post_category_id));

                    $_blog_post_data[]=array(
                        'blog_link'=>$slug_url_data->url_value,
                        'blog_category'=>$blog_category->blog_category_name,
                        'blog_post_date'=>date('F d,Y',strtotime($value->post_created_at)),
                        'blog_title'=>$value->post_title,
                        'blog_cover_image'=>$value->post_cover_image,
                        'blog_views'=>$value->visit_total,
                        'blog_selected_color_class'=>($value->post_id==$post_id)?'class="color2"':''
                    );
                }
            }

            $data['blog_post_data']=$_blog_post_data;

            if ($visible) $this->render('front_blogs_hot_topic_section',$data);
        }
    }
}