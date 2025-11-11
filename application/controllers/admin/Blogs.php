<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Blogs  extends BaseAdminController
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('blogs_model','bm');
    }

    function index(){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Blogs';

            $this->theme->title($this->data['page_title'])->load('blogs/vw_blogs', $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    function indexAddEditBlog($blog_id=null){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Blogs';

            $_blog_categories=array();
            $blog_post_data=array();
            $_selcted_other_categories=array();

            $college_links=array();
            $_exams_links=array();
            $_courses_links=array();

            $this->data['blog_id']=$blog_id;

            if($blog_id!=null){
                $blog_id=decode_data($blog_id);
                $blog_post_data=$this->bm->get_blog_data(array('post_id'=>$blog_id));
            }

            

            $blogs_category=$this->bm->get_blog_categories(array('blog_category_status'=>'active'),FALSE);

            if(!empty($blogs_category)){
                foreach ($blogs_category as $key => $value) {
                    $_blog_categories[]=array(
                        'category_id'=>$value->blog_category_id,
                        'category_name'=>$value->blog_category_name,
                        'selected'=>(!empty($blog_post_data) && $value->blog_category_id==$blog_post_data->post_category_id)?'selected':''
                    );
                }
            }

            $this->data['blog_categories']=$_blog_categories;

            if(!empty($blogs_category)){
                foreach ($blogs_category as $key => $value) {
                    if(!empty($blog_post_data->post_related_category_id)){
                        $bother_categories=char_separated_to_array($blog_post_data->post_related_category_id);
                    }else{
                        $bother_categories=array();
                    }
                    $_blog_o_categories[]=array(
                        'category_id'=>$value->blog_category_id,
                        'category_name'=>$value->blog_category_name,
                        'selected'=>(!empty($bother_categories) && in_array($value->blog_category_id,$bother_categories))?'selected':''
                    );
                }
            }

            $this->data['blog_o_categories']=$_blog_o_categories;

            $this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'blogs'));

            $this->data['blog_post_data']=$blog_post_data;

            $get_blog_data=$this->bm->get_blog_content_data('content_id,content_type_id,content_post_id,content_type,content_value_ans,content_value,content_value_image_name,content_value_image_ext,content_serial',array('content_post_id'=>$blog_id,'content_type!='=>'faqs'),FALSE);


            $this->data['blog_contents_data']=$get_blog_data;

            $blogs_status=array('0'=>'Select Post Status','published'=>'Published','unpublished'=>'Unpublished','draft'=>'Draft');

            foreach ($blogs_status as $key => $value) {
                $_blog_status[]=array(
                    'status_value'=>$key,
                    'status_name'=>$value,
                    'selected'=>(!empty($blog_post_data) && $key==$blog_post_data->post_status)?'selected':''
                );
            }

            $this->data['blog_status']=$_blog_status;

            $get_blog_faqs_data=$this->bm->get_blog_content_data('content_id,content_post_id,content_type,content_value,content_value_ans,content_serial',array('content_post_id'=>$blog_id,'content_type'=>'faqs'),FALSE);

            $this->data['get_blog_faqs_data']=$get_blog_faqs_data;

            $blog_slug_data=$this->sm->get_slug_urls(array('url_glob_type'=>'blog_post_url',"url_type"=>'system_blog',"url_type_id"=>$blog_id));

            $this->data['blog_slug_data']=$blog_slug_data;

            if($blog_id){
                $blog_param=array('post_status'=>'publish','post_id!='=>$blog_id);
            }else{
                $blog_param=array('post_status'=>'publish');
            }


            $other_blogs_link=$this->bm->get_blog_specific('post_id,post_title,post_status',$blog_param,TRUE);

            if(!empty($other_blogs_link)){
                foreach ($other_blogs_link as $key => $blog) {
                    $slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_sub_type'=>'blog_url','url_type_id'=>$blog->post_id));

                    $_other_blogs_link[]=array(
                        'title'=>$blog->post_title,
                        'value'=>$slug_data->url_value
                    );
                }
            }

            if(!empty($blog_slug_data)){
               $blog_struct_data=$this->sm->get_slug_struct_data(array('slug_type_json_ld'=>'BlogPosting','strcut_slug_url_id'=>$blog_slug_data->url_id)); 
           }else{
            $blog_struct_data='';
           }

             

             $json_ld='';
             $struct_description='';


            if(!empty($blog_struct_data)){
                // print_obj($blog_struct_data);

                $ds=json_decode($blog_struct_data->slug_type_json_meta_data);

                $struct_description=$ds->description;

                $json_ld=$blog_struct_data->slug_type_json_ld_data;
            }


        
           

            $this->data['college_links']=(!empty($college_links))?json_encode($college_links):'';
            $this->data['exams_links']=(!empty($_exams_links))?json_encode($_exams_links):'';
            $this->data['courses_links']=(!empty($_courses_links))?json_encode($_courses_links):'';
            $this->data['blogs_links']=(!empty($_other_blogs_link))?json_encode($_other_blogs_link):'';

            $this->data['blog_struct_data_description']=$struct_description;
            $this->data['blog_struct_data_ld']=$json_ld;

            $this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_file_upload_big_modal')->add_partial('partial_ads_modal')->load('blogs/vw_blogs_add_edit_new', $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function onSearchBlogsPosts(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $param['column_order'] = array(
                    null,
                    'post_title',
                );

                $param['column_search'] = array('post_title','post_name');
                $param['order'] = array('post_id' => 'DESC');
                $posts=$this->input->post();

                $list = $this->bm->_get_blog_data($posts,$param,FALSE,FALSE);
                 
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $blog){
                    $no++;

                    $row = array();

                    //$blog_slug_data=$this->sm->get_slug(array('slug_type_id'=>$blog->post_id,'slug_type'=>'40'));

                    $blog_slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_glob_type'=>'blog_post_url','url_type_id'=>$blog->post_id));

                    $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$blog->post_created_by));

                    $action='<div class="button-group"><a class="btn btn-xs btn-dark" href="blogs/add/'.encode_data($blog->post_id).'">Edit</a>
                    <button type="button" class="btn btn-xs btn-danger btn_blog_post_del" data-post_id="'.$blog->post_id.'"><i class="fa fa-trash"></i></button></div>';
                    
                    $row[]  =   $no; 

                    $row[]  =   '<img src="'.$blog->post_cover_image.'" style="width:100px !important;height:50px !important;border-radius:0px;"><br><a href="'.$blog_slug_data->url_value.'" target="_blank"><span style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">'.$blog->post_name.'</span></a>';
                    $row[]  =   $uploaded_by->user_fullname;
                    $row[]  =   $blog->blog_category_name;
                    $row[]  =   $blog->post_status;
                    $row[]  =   $blog->post_created_at;

                    $row[]  =   $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->bm->_get_blog_data($posts,$param,TRUE),
                    "recordsFiltered" => $this->bm->_get_blog_data($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }

    public function onDeleteBlogPost(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $post_id=post_data('post_id');

                if(!empty($post_id) && is_numeric($post_id)){
                    $post_data=$this->bm->get_blog_data(array('post_id'=>$post_id));

                    if(!empty($post_data)){
                        $deleted=$this->bm->delete_blog_data(array('post_id'=>$post_id));

                        if($deleted){

                            $this->um->delete_blog_content_data(array('content_post_id'=>$post_id));

                            $slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_sub_type'=>'blog_url', 'url_glob_type'=>'blog_post_url','url_type_id'=>$post_id));

                            if(!empty($slug_data)){
                                 $this->sm->delete_system_search_data(array('search_data_type'=>'BLOG_POST','search_data_access_url'=>$slug_data->url_value));

                                 $this->sm->delete_slug_urls(array('url_type'=>'system_blog','url_sub_type'=>'blog_url','url_glob_type'=>'blog_post_url','url_type_id'=>$post_id));

                                 $this->sm->delete_slug_struct_data(array('slug_url'=>$slug_data->url_value,'slug_type_json_ld'=>'BlogPosting'));
                            }

                            $return['success']='Post has been deleted successfully.';

                           
                        }else{
                            $return['error']='Post can not be deleted now.Try after some time';
                        }
                    }else{
                        $return['error']='Post not found in the system';
                    }
                }else{
                    $return['error']='Data manipulation is not allowed';
                }

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    private function get_blog_post($param){
        $post_data=array(
            'post_category_id'=>$param['blog_post_category'],
            'post_title'=>$param['blog_post_title'],
            'post_name'=>$param['blog_post_name'],
            'post_cover_image'=>$param['blog_post_cover_image'],
            'post_status'=>$param['blog_post_status'],
            'post_created_by'=>$this->data['userdata']->user_id
        );

        //print_obj($post_data);die;

        if($param['add_blog_post']){
            $post_id=$this->bm->store_blog_data($post_data);
            if($post_id){

            }else{
                $return['error']='Blog post not created.';
            }
        }else if($param['update_blog_post']){
            $updated=$this->bm->store_blog_data($post_data);
            //$post_id=$param[]
        }

        if(!empty($param['blog_post_details'])){
            foreach ($param['blog_post_details'] as $key => $value) {
                $serial=$value['data_serial'];
                $$serial=(!empty($serial))?$serial:'0';
                $data_type_value=(isset($value['data_type_value']))?$value['data_type_value']:'';
                $post_content[]=array(
                    'content_post_id'=>$post_id,
                    'content_type'=>$value['data_type'],
                    'content_type_id'=>$data_type_value,
                    'content_serial'=>$serial,
                    'content_value'=>$value['post_content'],
                    'content_created_by'=>$this->data['userdata']->user_id
                );
            }

            if(isset($post_content) && !empty($post_content)){
                $this->bm->delete_blog_content_data(array('content_post_id'=>$post_id));
                $this->bm->store_blog_content_data($post_content,TRUE);
            }           
        }


        


        if(isset($post_id)){



        }else if(isset($updated)){

        }

        
    }




    //***New blog**//

    public function indexAddEditBlogNew($blog_id=null){
        if(session_userdata('isAdminLoggedin')){
            $this->data['page_title']='Blogs';

            $_blog_categories=array();
            $blog_post_data=array();
            $_selcted_other_categories=array();

            $college_links=array();
            $_exams_links=array();
            $_courses_links=array();

            $blog_slug_data=array();

            $this->data['blog_id']=$blog_id;


            if($blog_id!=null){
                $blog_id=decode_data($blog_id);
                $blog_post_data=$this->bm->get_blog_data(array('post_id'=>$blog_id));

                $blog_slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_glob_type'=>'blog_post_url','url_type_id'=>$blog_id,'url_sub_type'=>'blog_url'));
            }


            $blogs_category=$this->bm->get_blog_categories(array('blog_category_status'=>'active'),FALSE);

            if(!empty($blogs_category)){
                foreach ($blogs_category as $key => $value) {
                    $_blog_categories[]=array(
                        'category_id'=>$value->blog_category_id,
                        'category_name'=>$value->blog_category_name,
                        'selected'=>(!empty($blog_post_data) && $value->blog_category_id==$blog_post_data->post_category_id)?'selected':''
                    );
                }
            }

            $this->data['blog_categories']=$_blog_categories;

            if(!empty($blogs_category)){
                foreach ($blogs_category as $key => $value) {
                    if(!empty($blog_post_data->post_related_category_id)){
                        $bother_categories=char_separated_to_array($blog_post_data->post_related_category_id);
                    }else{
                        $bother_categories=array();
                    }
                    $_blog_o_categories[]=array(
                        'category_id'=>$value->blog_category_id,
                        'category_name'=>$value->blog_category_name,
                        'selected'=>(!empty($bother_categories) && in_array($value->blog_category_id,$bother_categories))?'selected':''
                    );
                }
            }


            $this->data['blog_o_categories']=$_blog_o_categories;

            $this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'blogs'));

            $this->data['blog_post_data']=$blog_post_data;

            $blogs_status=array('0'=>'Select Post Status','published'=>'Published','unpublished'=>'Unpublished','draft'=>'Draft');

            foreach ($blogs_status as $key => $value) {
                $_blog_status[]=array(
                    'status_value'=>$key,
                    'status_name'=>$value,
                    'selected'=>(!empty($blog_post_data) && $key==$blog_post_data->post_status)?'selected':''
                );
            }

            $this->data['blog_status']=$_blog_status;

            $this->data['blog_slug_data']=$blog_slug_data;

            $blog_struct_data=$this->sm->get_slug_struct_data(array('slug_type_json_ld'=>'BlogPosting','strcut_slug_url_id'=>$blog_slug_data->url_id));

            if(!empty($blog_struct_data)){
                print_obj($blog_struct_data);
            }


            die;

            $this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_file_upload_big_modal')->add_partial('partial_ads_modal')->load('blogs/vw_blogs_add_edit_new', $this->data);
        }
    }

    /***Blog Page***/

     public function onAddEditBlog(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $admin_id                   =   decode_data(session_userdata('admin_id'));

                $blog_id                    =   post_data('_blog_post');
                $blog_post_category         =   post_data('blog_post_category');
                $blog_post_other_category   =   $this->input->post('blog_post_other_category');
                $blog_post_status           =   post_data('blog_post_status');
                $blog_post_title            =   post_data('blog_post_title');
                $blog_post_subtitle         =   post_data('blog_post_sub_title');
                $blog_post_name             =   post_data('blog_post_name');
                $blog_post_details          =   $this->input->post('blog_post_details');

                $blog_post_cover_image_id   =   post_data('blog_post_cover_image_id');
                $blog_post_cover_image      =   post_data('blog_post_cover_image'); 
                $blog_post_cover_image_file_name    =   post_data('blog_post_cover_image_file_name');               

                $blog_add_to_search         =   post_data('blog_to_search');

                $blog_faqus                 =   post_data('blog_faqus');

                $blog_focus_keyword         =   post_data('blog_post_focus_keyphrase');
                $post_meta_title            =   post_data('blog_post_meta_title');
                $post_meta_keywords         =   post_data('blog_post_meta_keywords');
                $post_meta_desc             =   post_data('blog_post_meta_desc');
                $post_mete_og_title         =   post_data('blog_post_meta_og_title');
                $post_meta_og_desc          =   post_data('blog_post_mete_og_desc');

                $blog_post_meta_twitter_title           =   post_data('blog_post_meta_twitter_title');
                $blog_post_mete_twitter_desc            =   post_data('blog_post_mete_twitter_desc');

                $blog_post_name             =   post_data('blog_post_name');


                $blog_perma_link_slug       =   post_data('blog_permalink_slug');
               
                $blog_perma_link            =   post_data('blog_permalink');
                $blog_canonical_url         =   post_data('blog_canonical_url');

                $blog_image_file_name       =   post_data('blog_image_file_name');
                $blog_image_alt             =   post_data('blog_image_alt');
                $blog_image_title           =   post_data('blog_image_title');

                $article_data               =   post_data('blog_schema_article_body');

                $blog_is_add_editable=true;

                $system_logo='https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp';

                $width = '0';
                $height = '0';

                if($blog_id!=''){
                    $blog_id=decode_data($blog_id);
                }

                $dt=date('Y-m-d H:i:s');

                if(!empty($blog_post_other_category)){
                    $blog_subcategory=char_separated($blog_post_other_category);
                }else{
                    $blog_subcategory=null;
                }

                // Define the path for the new "blogs" directory
                $blogs_dir_path = FCPATH.'/public/data/blogs';

                //Cover Image file update according to SEO 

                if(!empty($blog_post_cover_image_id)){
                    $get_storage_data=$this->sm->get_file(array('storage_id'=>$blog_post_cover_image_id));
                    
                    $file_path=$get_storage_data->media_disk_path;

                     // Sanitize the $blog_image_file_name by removing unwanted characters and replacing whitespaces with hyphens
                    $blog_image_file_name = preg_replace('/[^A-Za-z0-9 ]/', '', $blog_image_file_name); // Remove unwanted characters
                    $blog_image_file_name = str_replace(' ', '-', $blog_image_file_name); // Replace spaces with hyphens

                    
                    // Check if the "blogs" directory exists, if not, create it
                    if (!is_dir($blogs_dir_path)) {
                        mkdir($blogs_dir_path, 0755, true); // The directory does not exist, so create it.
                        chmod($media_disk_path, 0777);
                        @touch($media_disk_path . '/' . 'index.html');
                    }

                    // Check if the original file exists
                    if (file_exists($file_path)) {

                        // Define the temporary file name with the original extension in the "blogs" directory
                        $temp_file_name = basename($file_path); // Use the original file name for the temporary copy
                        $temp_file_path = $blogs_dir_path . '/' . $temp_file_name;
                        copy($file_path, $temp_file_path);
                        // Extract the file extension from the original file path
                        $file_extension = pathinfo($file_path, PATHINFO_EXTENSION);

                        // Define the new file name with the sanitized name and original extension
                        $new_file_name = $blog_image_file_name . '.' . $file_extension;
                        $new_file_path = $blogs_dir_path . '/' . $new_file_name;

                        if($get_storage_data->media_disk_name!==$new_file_name){
                            // Create the full path for the new file in the "blogs" directory
                            $new_file_path = $blogs_dir_path . '/' . $new_file_name;
                            $new_relative_path = base_url('public/data/blogs/'.$new_file_name);
                            $image_data = getimagesize($new_file_path);
                            $width = $image_data[0];
                            $height = $image_data[1];

                            $blog_post_cover_image=$new_relative_path;

                            // Create a new fileinfo resource
                            $finfo = finfo_open(FILEINFO_MIME_TYPE); // Return mime type

                            // Use the fileinfo resource to get the MIME type of the file
                            $file_mime = finfo_file($finfo, $new_file_path);

                            // Close the fileinfo resource
                            finfo_close($finfo);

                            // Copy the file to the new location within the "blogs" directory
                            if (rename($temp_file_path, $new_file_path)) {
                                $sdata=array(
                                    'storage_parent_id'=>$get_storage_data->storage_id,
                                    'storage_type'=>'2',
                                    'media_disk_path'=>$new_file_path,
                                    'media_disk_path_relative'=>$new_relative_path,
                                    'media_disk_name'=>$new_file_name,
                                    'media_org_name'=>$get_storage_data->media_org_name,
                                    'media_size'=>$get_storage_data->media_size,
                                    'media_size2'=>$get_storage_data->media_size2,
                                    'media_mime'=>$file_mime,
                                    'media_identity_name'=>'blogs',
                                    'media_uploaded_by'=>$admin_id
                                );

                                $temp_file_id=$this->sm->store_file($sdata);
                            }
                        }      
                    }                    
                }


                $post_data=array(
                    'post_title'=>$blog_post_title,
                    'post_subtitle'=>$blog_post_subtitle,
                    'post_name'=>$blog_post_name,
                    'post_status'=>$blog_post_status                   
                );

                if(!empty($blog_post_cover_image)){
                    $post_data['post_cover_image_id']=$blog_post_cover_image_id;
                    $post_data['post_cover_image']=$blog_post_cover_image;
                    $post_data['post_cover_image_extension']=$file_extension;
                    $post_data['post_cover_image_name']=$blog_image_file_name;
                    $post_data['post_cover_image_alt']=$blog_image_alt;
                    $post_data['post_cover_image_title']=$blog_image_title;
                }

                if(!empty($blog_post_category)){
                    $post_data['post_category_id']=$blog_post_category; 
                }

                if(!empty($blog_subcategory)){
                    $post_data['post_related_category_id']=$blog_subcategory; 
                }

                if(is_numeric($blog_id)){
                    $post_data['post_updated_at']=$dt; 
                    $post_data['post_updated_by']=$admin_id;
                }else{
                    $post_data['post_created_at']=$dt;
                    $post_data['post_updated_by']=$admin_id;
                }

                if(is_numeric($blog_id)){
                    $post_name_data=$this->bm->get_blog_data(array('post_name'=>$blog_post_name,'post_id!='=>$blog_id));

                    $post_title_data=$this->bm->get_blog_data(array('post_title'=>$blog_post_title,'post_id!='=>$blog_id));

                    if(!empty($post_name_data) || !empty($post_title_data)){
                        $blog_is_add_editable=false;
                    }else{
                        $blog_is_add_editable=true;
                    }
                }else{
                    $post_name_data=$this->bm->get_blog_data(array('post_name'=>$blog_post_name));

                    $post_title_data=$this->bm->get_blog_data(array('post_title'=>$blog_post_title));

                    if(!empty($post_name_data) || !empty($post_title_data)){
                        $blog_is_add_editable=false;
                    }else{
                        $blog_is_add_editable=true;
                    }
                }
                    

                if($blog_is_add_editable==true){

                    if(is_numeric($blog_id)){
                        $this->bm->update_blog_data($post_data,array('post_id'=>$blog_id));
                        $post_id=$blog_id;
                        $post_msg='Post updated successfully';
                    }else{
                        $post_id=$this->bm->store_blog_data($post_data);
                        $post_msg='Post created successfully';
                    }
                    

                    if($post_id){

                        //Create post other category
                        if(!empty($blog_post_other_category)){
                            foreach ($blog_post_other_category as $key => $value) {
                                $this->bm->delete_blog_other_categories(array('blog_post_id'=>$post_id));
                                $_b_o_cat[]=array(
                                    'blog_post_id'=>$post_id,
                                    'blog_post_category_id'=>$value
                                );
                            }
                        }

                        //create post details

                        if(!empty($blog_post_details)){
                            foreach ($blog_post_details as $key => $value) {
                                $serial=$value['data_serial'];
                                $serial=(!empty($serial))?$serial:'0';
                                $data_type_value=(isset($value['data_type_value']))?$value['data_type_value']:'';
                                $content_value_image_name=(isset($value['data_file_name']))?$value['data_file_name']:'';
                                $content_value_image_ext=(isset($value['data_file_ext']))?$value['data_file_ext']:'';
                                $content_value_ans=(isset($value['data_alt_text']))?$value['data_alt_text']:'';


                                $get_mstorage_data=$this->sm->get_file(array('storage_id'=>$data_type_value));
                    
                                $file_mpath=$get_mstorage_data->media_disk_path;

                                  // Sanitize the $blog_image_file_name by removing unwanted characters and replacing whitespaces with hyphens
                                $blog_mimage_file_name = preg_replace('/[^A-Za-z0-9 ]/', '', $content_value_image_name); // Remove unwanted characters
                                $blog_mimage_file_name = str_replace(' ', '-', $content_value_image_name); // Replace spaces with hyphens

                                // Check if the original file exists
                                if (file_exists($file_mpath)) {

                                    // Define the temporary file name with the original extension in the "blogs" directory
                                    $temp_mfile_name = basename($file_mpath); // Use the original file name for the temporary copy
                                    $temp_mfile_path = $blogs_dir_path . '/' . $temp_file_name;
                                    copy($file_mpath, $temp_mfile_path);
                                    // Extract the file extension from the original file path
                                    $file_mextension = pathinfo($file_mpath, PATHINFO_EXTENSION);

                                    // Define the new file name with the sanitized name and original extension
                                    $new_mfile_name = $blog_mimage_file_name . '.' . $file_mextension;
                                    $new_mfile_path = $blogs_dir_path . '/' . $new_mfile_name;

                                    if($get_mstorage_data->media_disk_name!==$new_mfile_name){
                                        // Create the full path for the new file in the "blogs" directory
                                        $new_mfile_path = $blogs_dir_path . '/' . $new_mfile_name;
                                        $new_mrelative_path = base_url('public/data/blogs/'.$new_mfile_name);
                                        $image_mdata = getimagesize($new_mfile_path);
                                        $mwidth = $image_mdata[0];
                                        $mheight = $image_mdata[1];

                                        $post_m_image=$new_mrelative_path;

                                        // Create a new fileinfo resource
                                        $mfinfo = finfo_open(FILEINFO_MIME_TYPE); // Return mime type

                                        // Use the fileinfo resource to get the MIME type of the file
                                        $mfile_mime = finfo_file($mfinfo, $new_mfile_path);

                                        // Close the fileinfo resource
                                        finfo_close($mfinfo);

                                        // Copy the file to the new location within the "blogs" directory
                                        if (rename($temp_mfile_path, $new_mfile_path)) {
                                            $smdata=array(
                                                'storage_parent_id'=>$get_mstorage_data->storage_id,
                                                'storage_type'=>'2',
                                                'media_disk_path'=>$new_mfile_path,
                                                'media_disk_path_relative'=>$new_mrelative_path,
                                                'media_disk_name'=>$new_mfile_name,
                                                'media_org_name'=>$get_mstorage_data->media_org_name,
                                                'media_size'=>$get_mstorage_data->media_size,
                                                'media_size2'=>$get_mstorage_data->media_size2,
                                                'media_mime'=>$mfile_mime,
                                                'media_identity_name'=>'blogs',
                                                'media_uploaded_by'=>$admin_id
                                            );

                                            $this->sm->store_file($smdata);
                                        }
                                    }      
                                }

                                $post_content[]=array(
                                    'content_post_id'=>$post_id,
                                    'content_type'=>$value['data_type'],
                                    'content_type_id'=>$data_type_value,
                                    'content_serial'=>$serial,
                                    'content_value'=>($value['data_type']=='image')?$new_mrelative_path:$value['post_content'],
                                    'content_value_ans'=>$content_value_ans,
                                    'content_value_image_name'=>$content_value_image_name,
                                    'content_value_image_ext'=>$content_value_image_ext,
                                    'content_created_by'=>$this->data['userdata']->user_id
                                );  
                            }

                            $this->bm->delete_blog_content_data(array('content_post_id'=>$post_id));

                            $this->bm->store_blog_content_data($post_content,TRUE);
                        }


                        //SEO data
                        if(!empty($blog_perma_link)){

                            if(!empty($post_meta_keywords)){
                                $ld_keywords=json_decode($post_meta_keywords);

                                foreach ($ld_keywords as $key => $value) {
                                    $keywords[]=$value->value;
                                }

                                $_keywords=char_separated($keywords);
                            }else{
                                $_keywords=null;
                            }

                            $breadcumb=array(
                                'HOME'=>base_url(),
                                'BLOGS'=>base_url('blog'),
                                ucwords($blog_post_title)=>null
                            );

                            $slug_data_to_update=array(
                                'url_type'=>'system_blog',
                                'url_sub_type'=>'blog_url',
                                'url_glob_type'=>'blog_post_url',
                                'url_type_id'=>$post_id,
                                'url_focus_keyphrase'=>$blog_focus_keyword,
                                'url_meta_heading'=>$post_meta_title,
                                'url_meta_title'=>$post_meta_title,
                                'url_meta_key_words'=>$_keywords,
                                'url_meta_desc'=>$post_meta_desc,
                                'url_og_title'=>$post_mete_og_title,
                                'url_og_desc'=>$post_meta_og_desc,
                                'url_og_image'=>$blog_post_cover_image,
                                'url_og_image_type'=>$cover_image_mime,
                                'url_og_image_width'=>$width,
                                'url_og_image_height'=>$height,
                                'url_og_type'=>'article',
                                'url_page_heading'=>$blog_post_title,
                                'url_breadcrumb'=>json_encode($breadcumb),
                                'url_priority'=>'0.5',
                                'url_data_change_freq'=>'monthly',
                                'url_slug'=>$blog_perma_link_slug,
                                'url_value'=>$blog_perma_link,
                                'url_canonical_value'=>$blog_canonical_url,
                                'url_permalink_value'=>$blog_perma_link,
                                'url_last_update'=>$dt,
                                'updated_by'=>$admin_id,
                                'updated_at'=>$dt
                            );

                            if(is_numeric($blog_id)){
                                $this->sm->update_slug_urls($slug_data_to_update,array('url_type'=>'system_blog','url_sub_type'=>'blog_url','url_glob_type'=>'blog_post_url','url_type_id'=>$post_id));


                            }else{
                                $this->sm->store_slug_urls($slug_data_to_update);
                            }
                        }


                        //Structured data
                        $blog_slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_sub_type'=>'blog_url','url_glob_type'=>'blog_post_url','url_type_id'=>$post_id));

                        $slug_url_id=$blog_slug_data->url_id;

                        $BlogPosting='{
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": "'.$blog_post_title.'",
                            "alternativeHeadline": "'.$post_meta_title.'",
                            "isFamilyFriendly": "true",
                            "image": "'.$blog_post_cover_image.'",
                            "inLanguage": "en-US",
                            "publisher": {
                              "@type": "Organization",
                              "name": "Sikshapedia",
                              "url": "'.base_url().'",
                              "logo": {
                                "@type": "ImageObject",
                                "url": "'.$system_logo.'",
                                "width": "600",
                                "height": "88"
                              }
                            },
                            "url": "'.$blog_perma_link.'",
                            "datePublished": "'.date('c',strtotime($dt)).'",
                            "dateCreated": "'.date('c',strtotime($dt)).'",
                            "dateModified": "'.date('c',strtotime($dt)).'",
                            "description": "'.$post_meta_desc.'",
                            "author": {
                              "@type": "Person",
                              "name": "Sikshapedia Team",
                              "url": "'.base_url().'"
                            },
                            "mainEntityOfPage": {
                              "@type": "WebPage",
                              "@id": "'.base_url('blog').'"
                            },
                            "keywords": ['.$_keywords.'],
                            "articleSection": "'.$blog_category_name.'",
                            "articleBody": "'.json_encode($article_data).'"
                          }';

                        $slug_type_json_meta_data=json_encode(array('headline'=>$blog_post_title,'description'=>$article_data));

                        $blog_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'BlogPosting'));

                        $blog_struct_data_to_store=array(
                            'strcut_slug_url_id'=>$slug_url_id,
                            'slug_type_json_ld'=>'BlogPosting',
                            'slug_type_json_ld_data'=>$BlogPosting,
                            'slug_type_json_meta_data'=>$slug_type_json_meta_data,
                            'slug_url'=>$blog_perma_link
                        );

                        if(is_numeric($blog_id)){
                            $blog_struct_data_to_store['date_modified']=$dt;
                        }else{
                            $blog_struct_data_to_store['date_published']=$dt;
                        }

                        if(empty($blog_struct_data)){
                            $this->sm->store_slug_struct_data($blog_struct_data_to_store);
                        }else{
                            $this->sm->update_slug_struct_data($blog_struct_data_to_store,array('slug_url'=>$blog_perma_link,'slug_type_json_ld'=>'BlogPosting'));
                        }
                    }


                   $return['success']=$post_msg;
                   $return['redirect']=$this->data['admin_base_url'].'blogs/add/'.encode_data($post_id);

                }else{
                    $return['error']='Post already exists with same post name or post title';
                }

                    

                $this->output->set_content_type('application/json')->set_output(json_encode($return));



            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
     }


     public function onUpdateBlogSchema(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $admin_id                   =   decode_data(session_userdata('admin_id'));

                $post_id                    =   post_data('_blog_post');

                $dt=date('Y-m-d H:i:s');

                //Structured data
                $blog_slug_data=$this->sm->get_slug_urls(array('url_type'=>'system_blog','url_sub_type'=>'blog_url','url_glob_type'=>'blog_post_url','url_type_id'=>$post_id));

                $slug_url_id=$blog_slug_data->url_id;

                $BlogPosting='{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": "'.$blog_post_title.'",
                    "alternativeHeadline": "'.$post_meta_title.'",
                    "isFamilyFriendly": "true",
                    "image": "'.$blog_post_cover_image.'",
                    "inLanguage": "en-US",
                    "publisher": {
                      "@type": "Organization",
                      "name": "Sikshapedia",
                      "url": "'.base_url().'",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "'.$system_logo.'",
                        "width": "600",
                        "height": "88"
                      }
                    },
                    "url": "'.$blog_perma_link.'",
                    "datePublished": "'.date('c',strtotime($dt)).'",
                    "dateCreated": "'.date('c',strtotime($dt)).'",
                    "dateModified": "'.date('c',strtotime($dt)).'",
                    "description": "'.$post_meta_desc.'",
                    "author": {
                      "@type": "Person",
                      "name": "Sikshapedia Team",
                      "url": "'.base_url().'"
                    },
                    "mainEntityOfPage": {
                      "@type": "WebPage",
                      "@id": "'.base_url('blog').'"
                    },
                    "keywords": ['.$_keywords.'],
                    "articleSection": "'.$blog_category_name.'",
                    "articleBody": "'.json_encode($article_data).'"
                  }';

                $slug_type_json_meta_data=json_encode(array('headline'=>$blog_post_title,'description'=>$article_data));

                $blog_struct_data=$this->sm->get_slug_struct_data(array('strcut_slug_url_id'=>$slug_url_id,'slug_type_json_ld'=>'BlogPosting'));

                $blog_struct_data_to_store=array(
                    'strcut_slug_url_id'=>$slug_url_id,
                    'slug_type_json_ld'=>'BlogPosting',
                    'slug_type_json_ld_data'=>$BlogPosting,
                    'slug_type_json_meta_data'=>$slug_type_json_meta_data,
                    'slug_url'=>$blog_perma_link
                );

                $blog_struct_data_to_store['date_published']=$dt;

                if(empty($blog_struct_data)){
                    $this->sm->store_slug_struct_data($blog_struct_data_to_store);
                }else{
                    $this->sm->update_slug_struct_data($blog_struct_data_to_store,array('slug_url'=>$blog_perma_link,'slug_type_json_ld'=>'BlogPosting'));
                }
            }else{

            }
        }else{

        }
     }
}