<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Blog extends BaseFrontController
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('blogs_model','bm');
    }

    public function index(){

        $_featured_blog=array();
        $_blog_post_data=array();

        $blog_post_data=$this->bm->___get_blog_data(array('post_status'=>'published'),30);

        if(!empty($blog_post_data)){
            foreach ($blog_post_data as $key => $value) {
                $slug_url_data=$this->sm->__get_slug_urls('url_type,url_glob_type,url_type_id,url_value',array('url_glob_type'=>'blog_post_url','url_type'=>'system_blog','url_type_id'=>$value->post_id));
                $_blog_post_data[]=array(
                    'blog_id'=>$value->post_id,
                    'blog_link'=>$slug_url_data->url_value,
                    'blog_category'=>$value->blog_category_name,
                    'blog_title'=>$value->post_title,
                    'blog_exerpt'=>$value->post_exerpt,
                    'blog_cover_image'=>$value->post_cover_image,
                    'blog_user_name'=>'Sikshapedia',//$value->user_name,
                    'blog_created_at'=>date('F j,Y',strtotime($value->post_created_at)),
                    'blog_user_image'=>'https://www.sikshapedia.com/public/data/app/app_data/way2a.png?tr=h-50,w-50,c-force'
                );
            }
        }

        $this->data['blog_post_data']=$_blog_post_data;


        $this->theme->title('Blogs on the Best Colleges in West Bengal, India')->add_partial('partial_apply_modal',$this->data)->load('webpage/blogs/vw_blog_main_page', $this->data);
    }


    public function indexBlogdetails($slug){

        $_blog_details=array();

        $current_url=current_url();

        $get_slug_data=$this->sm->get_slug_urls(array('url_value'=>$current_url));

        //print_obj($get_slug_data);die;

        if(!empty($get_slug_data)){

            $breadcumb=(!empty($get_slug_data))?json_decode($get_slug_data->url_breadcrumb,TRUE):'';


            $post_id=$get_slug_data->url_type_id;

            $blog_post_data=$this->bm->get_blog_data(array('post_id'=>$post_id,'post_status'=>'published'));

            //print_obj($blog_post_data);die;

            if(!empty($blog_post_data)){

                $blog_category=$this->bm->get_blog_categories(array('blog_category_id'=>$blog_post_data->post_category_id));
                $structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

                $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$blog_post_data->post_created_by));

                $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$blog_post_data->post_created_by),NULL,FALSE);

                if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
                  $user_image=$user_image->media_disk_path_relative;
                }else{
                  $user_image=base_url('public/data/app/app_data/way2a.png?tr=h-50,w-50,c-force');         
                }


                $blog_details=$this->bm->get_blog_content_data('*',array('content_post_id'=>$blog_post_data->post_id),FALSE,'content_serial','ASC');


                if(!empty($blog_details)){
                    foreach ($blog_details as $key => $value) {
                        $_blog_details[]=array(
                            'blog_post_id'=>$blog_post_data->post_id,
                            'bolg_content_type'=>$value->content_type,
                            'blog_content_value'=>$value->content_value
                        );
                    }
                }

                //print_obj($uploaded_by);die;


                if(!empty($uploaded_by) && $uploaded_by->user_role!='1'){
                    if($uploaded_by->user_show_real_name=='2'){
                        $blog_creator_name='Sikshapedia Team';
                    }else{
                        $blog_creator_name=$uploaded_by->user_fullname;
                    }
                }else{
                    $blog_creator_name='Sikshapedia Team';
                }

                $visist_data=$this->sm->get_total_visit_data('visit_total','visit_total',array('visit_type'=>'BLOGS','visit_type_id'=>$blog_post_data->post_id));

                $__blog_details=array(
                    'blog_category_id'=>$blog_post_data->post_category_id,
                    'blog_post_id'=>$blog_post_data->post_id,
                    'blog_category'=>$blog_category->blog_category_name,
                    'blog_breadcumb'=>$breadcumb,
                    'blog_total_view'=>number_format_short2($visist_data[0]->visit_total),
                    'blog_title'=>$blog_post_data->post_title,
                    'blog_cover_image'=>$blog_post_data->post_cover_image,
                    'blog_cover_image_alt'=>'Sikshapedia:'.$blog_post_data->post_title,
                    'blog_creator_img'=>$user_image,
                    'blog_creator_name'=>$blog_creator_name,
                    'blog_updated_at'=>(empty($blog_post_data->post_updated_at))?'Created on '.date('F d,Y',strtotime($blog_post_data->post_created_at)):'Updated on '.date('F S,Y',strtotime($blog_post_data->post_updated_at)),
                    'blog_details_data'=>$_blog_details
                );


                $this->data['blog_details']=$__blog_details;

                //print_obj($this->data['blog_details']);die;


                $this->data['page_structure_data']=$structure_data;

               //$this->record_visist_data($blog_post_data->post_id);

                // $this->theme->title($this->data['page_title'])->load('webpage/blogs/vw_blog_details_page', $this->data); 

                $this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal',$this->data)->load('webpage/blogs/vw_blog_details_page_new', $this->data); 
            }else{
                redirect(base_url('blog'));
            }

                

        }else{
            redirect(base_url('blog'));
        }
    }
    
    public function blogDetails(){
        
       $this->theme->title('Blog Details')->load('webpage/blogs/vw_blog_details_page_1', $this->data); 
        
    }


    private function record_visist_data($blog_id){
         $get_ipgeo_data=get_ipgeo_data();

         $visit_type='BLOGS';

         if(!empty($get_ipgeo_data) && $get_ipgeo_data['geoplugin_status']=='200'){
            $geoplugin_city=$get_ipgeo_data['geoplugin_city'];
            $geoplugin_regionCode=$get_ipgeo_data['geoplugin_regionCode'];
            $geoplugin_regionName=$get_ipgeo_data['geoplugin_regionName'];
            $geoplugin_countryCode=$get_ipgeo_data['geoplugin_countryCode'];
            $geoplugin_countryName=$get_ipgeo_data['geoplugin_countryName'];
            $geoplugin_request=$get_ipgeo_data['geoplugin_request']; //ip

            $visit_date=date('Y-m-d');

            $country_data=$this->com->__get_country('country_id,country_name,country_iso_code_2,country_iso_code_4,country_lang,country_default',array('country_iso_code_2'=>$geoplugin_countryCode));

            $country_id=$country_data->country_id;

            $state_data=$this->com->get_state_specific('state_id,state_name,state_code',array('state_code'=>$geoplugin_regionCode));

            if(!empty($state_data)){
                $state_id=$state_data->state_id;
            }else{

                $get_total_states=$this->com->get_total_states(array('state_country_id'=>$country_id));

                $state_data_to_insert=array(
                    'state_country_id'=>$country_id,
                    'state_code'=>$geoplugin_regionCode,
                    'state_name'=>$geoplugin_regionName,
                    'state_name_slug'=>url_slug(strtolower($geoplugin_regionName)),
                    'state_serial'=>($get_total_states+1),
                    'created_by'=>'1'
                );

                $state_id=$this->com->add_state_data($state_data_to_insert);
            }

            $city_data=$this->com->get_city_specific('city_id,city_name',array('city_name'=>$geoplugin_city));

            if(!empty($city_data)){
                $city_id=$city_data->city_id;
            }else{

                $city_data_to_insert=array(
                    'city_country_id'=>$country_id,
                    'city_state_id'=>$state_id,
                    'city_name'=>$geoplugin_city,
                    'city_img_alt_text'=>$geoplugin_city,
                    'city_img_title'=>$geoplugin_city,
                    'city_name_slug'=>url_slug(strtolower($geoplugin_city)),
                    'created_by'=>'1'
                );

                $city_id=$this->com->add_city_data($city_data_to_insert);
            }

            $visit_data_found=$this->sm->get_visit_data(array('visit_type'=>$visit_type,'visit_ip'=>$geoplugin_request,'visit_type_id'=>$blog_id));

            if(!empty($visit_data_found)){
                $visit_total=$visit_data_found->visit_total+1;
            }else{
                $visit_total=1;
            }

            $visits_data=array(
                'visit_type'=>$visit_type,
                'visit_type_id'=>$blog_id,
                'visit_type_country_id'=>$country_id,
                'visit_type_state_id'=>$state_id,
                'visit_type_city_id'=>$city_id,
                'visit_ip'=>$geoplugin_request,
                'visit_total'=>$visit_total
            );

            if(!empty($visit_data_found)){
                $this->sm->update_visit_data($visits_data,array('visit_type'=>$visit_type,'visit_ip'=>$geoplugin_request,'visit_type_id'=>$blog_id));
                $inserted=$visit_data_found->visit_id;
            }else{
                $inserted=$this->sm->add_visit_data($visits_data);
            }
            

            if($inserted){

                $get_visit_date_data=$this->sm->get_visit_date_data(array('visited_id'=>$inserted,'visited_ip'=>$geoplugin_request,'DATE(visited_date)'=>$visit_date));

                if(!empty($get_visit_date_data)){
                    $visit_count=$get_visit_date_data->visited_count;
                }else{
                    $visit_count=1;
                }

                $visited_data=array(
                    'visited_id'=>$inserted,
                    'visited_date'=>$visit_date,
                    'visited_ip'=>$geoplugin_request,
                    'visited_region'=>$geoplugin_countryCode,
                    'visited_region_name'=>$geoplugin_countryName,
                    'visited_region_id'=>$country_id,
                    'visited_count'=>$visit_count
                );

                if(!empty($get_visit_date_data)){
                    $added=$this->sm->update_visit_date_data($visited_data,array('visited_id'=>$inserted,'visited_ip'=>$geoplugin_request,'DATE(visited_date)'=>$visit_date));
                }else{
                   $added=$this->sm->add_visit_date_data($visited_data); 
                }
                
            }

         }
    }
}