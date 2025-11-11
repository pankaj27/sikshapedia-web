<?php defined('BASEPATH') OR exit('No direct script access allowed');

error_reporting(0);

require_once APPPATH.'third_party/vendor/autoload.php';

use Spatie\ImageOptimizer\OptimizerChainFactory;
use WebPConvert\WebPConvert;
/**
 * 
 */
class BaseFrontController extends CI_Controller
{
	  public $data=array();
  	public $permission = array();
  	public $login_session_duration = 5;
    public $current_url='';


  	function __construct(){
  		
  		  parent::__construct();
        //force_ssl();

        $this->output->enable_profiler(TRUE);

        $this->current_url=current_url();

        $segment_1=$this->uri->segment(1,0);


        //$slug_data=$this->sm->__get_slug_urls('url_id,url_type_id,url_value,url_meta_title,url_meta_desc,url_meta_key_words,url_og_title,url_og_desc,url_page_heading,url_page_sub_heading,url_breadcrumb,url_og_image,url_og_image_type,url_og_image_width,url_og_image_height,url_og_type',array('url_value'=>$this->current_url),TRUE);

  		  $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));

        $system_common_straucture_data_settings=$this->sm->get_settings(array('settings_key'=>'config_system_common_structure_data'));

        $settings_value=json_decode($system_general_settings->settings_value);
        
        $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):null;

        //print_obj($settings_general_value);

        //print_obj($settings_general_value->system_title_name);die;
        $cdn_server=(!empty($settings_general_value->system_assests_domain))?$settings_general_value->system_assests_domain:null;

        $site_title=$settings_value->system_meta_title.' - '.$settings_value->system_title;
          $site_description=$settings_value->system_meta_desc;
          $site_key_words=$settings_value->system_meta_keywords;
          $site_og_title=$site_title;
          $site_og_desc=$site_description;
          $site_og_img='https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp';
          $site_og_img_type='image/webp';
          $site_og_img_width='601';
          $site_og_img_height='81';
          $site_og_locale='en';
          $site_og_type=(!empty($slug_data->url_og_type))?$slug_data->url_og_type:'website';
          $page_heading='';
          $page_sub_heading='';

/*
        if($this->current_url==base_url()){         
          $site_title=$settings_value->system_meta_title.' - '.$settings_value->system_title;
          $site_description=$settings_value->system_meta_desc;
          $site_key_words=$settings_value->system_meta_keywords;
          $site_og_title=$site_title;
          $site_og_desc=$site_description;
          $site_og_img='https://www.sikshapedia.com/public/data/app/2021/sikshapedia.webp';
          $site_og_img_type='image/webp';
          $site_og_img_width='601';
          $site_og_img_height='81';
          $site_og_locale='en';
          $site_og_type=(!empty($slug_data->url_og_type))?$slug_data->url_og_type:'website';
          $page_heading='';
          $page_sub_heading='';
        }else{          
          $site_title=(!empty($slug_data))?$slug_data->url_meta_title:'';
          $site_description=(!empty($slug_data))?$slug_data->url_meta_desc:'';
          $site_key_words=(!empty($slug_data))?$slug_data->url_meta_key_words:'';
          $site_og_title=(!empty($slug_data))?$slug_data->url_og_title:'';
          $site_og_desc=(!empty($slug_data))?$slug_data->url_og_desc:'';
          $site_og_img=(!empty($slug_data))?$slug_data->url_og_image:'';
          $site_og_img_type=(!empty($slug_data))?$slug_data->url_og_image_type:'';
          $site_og_img_width=(!empty($slug_data))?$slug_data->url_og_image_width:'';
          $site_og_img_height=(!empty($slug_data))?$slug_data->url_og_image_height:'';
          $site_og_locale=(!empty($slug_data) && !empty($slug_data->url_og_locale))?$slug_data->url_og_locale:'en';
          $site_og_type=(!empty($slug_data) && !empty($slug_data->url_og_type))?$slug_data->url_og_type:'website';
          $page_heading=$slug_data->url_page_heading;
          $page_sub_heading=$slug_data->url_page_sub_heading;
        }

        */

        // $site_name=$settings_value->system_name;

        $site_name=$settings_value->system_title_name;

        $this->data['system_name']=$site_name;
        $this->data['system_title']=$site_title;

		    $this->theme->view_type='front';

        if(is_controller(array('Blog'))){
          $compress=false;
          $cache_lifetime=0;
        }else{
          $compress=false;
          $cache_lifetime=0;
        }

      	$this->theme->initialize(array(
	        'theme'            => 'default',
	        'master'           => 'default_new',
	        'layout'           => 'default',
	        'title_sep'        => '-',
	        'compress'         => (ENVIRONMENT !== 'development')?$compress:false,
	        'cache_lifetime'   => $cache_lifetime,
	        'cdn_enabled'      => false,
	        'cdn_server'       => $cdn_server,
	        'site_name'        => $site_name,
          'site_description' => $site_description,
          'site_keywords'    => $site_key_words
      	));


        $this->theme->add_meta('robots', 'index,follow', 'meta');
        $this->theme->add_meta('googlebot', 'index,follow', 'meta');
       
        //$this->theme->add_meta('title',$site_title,'meta',array('id'=>'meta_title'));
        $this->theme->add_meta('description', $site_description,'meta',array('id'=>'meta_description'));

        if(!empty($site_key_words)){
          $this->theme->add_meta('keywords', $site_key_words);
        }
        
        

        $this->theme->add_meta('og:locale', $site_og_locale, 'meta');

        $this->theme->add_meta('og:type', $site_og_type, 'meta');
        if(!empty($site_og_title)){
          $this->theme->add_meta('og:title', $site_og_title, 'meta'); 
        }

        if(!empty($site_og_desc)){
          $this->theme->add_meta('og:description', $site_og_desc, 'meta');
        }
               
        
        $this->theme->add_meta('og:url', $this->current_url, 'meta');
        $this->theme->add_meta('og:site_name', $site_name, 'meta');

        if(!empty($site_og_img)){
          $this->theme->add_meta('og:image', $site_og_img, 'meta');
        }

        if(!empty($site_og_img_width)){
          $this->theme->add_meta('og:image:width', $site_og_img_width, 'meta');
        }

        if(!empty($site_og_img_height)){
          $this->theme->add_meta('og:image:height', $site_og_img_height, 'meta');
        }

        if(!empty($site_og_img_type)){
          $this->theme->add_meta('og:image:type', $site_og_img_type, 'meta');
        }        

        $this->theme->add_meta('twitter:card', 'summary_large_image', 'meta');
        $this->theme->add_meta('twitter:site', $site_name, 'meta');
        $this->theme->add_meta('twitter:url', $this->current_url, 'meta');
        $this->theme->add_meta('twitter:title', $site_title, 'meta');
        $this->theme->add_meta('twitter:description', $site_description, 'meta');

        if(!empty($site_og_img)){
          $this->theme->add_meta('twitter:image', $site_og_img, 'meta');
        }


        

        $this->data=array(
          'csrf'=>array(
            'name' => $this->security->get_csrf_token_name(),
            'hash' => $this->security->get_csrf_hash()
          )
        );

        $this->data['page_title']=$site_title;
        $this->data['page_heading']=$page_heading;
        $this->data['page_sub_heading']=$page_sub_heading;
        
        $this->data['redirectUri']=base_url().'authsocial';

        $this->data['slug_data']=$slug_data;

        $country_data=$this->com->__get_country('country_id,country_name,country_iso_code_2,country_iso_code_4,country_lang,country_default',array('country_default'=>'1'));


        $this->data['default_country_data']=$country_data;

        $this->data['top_universities_link']=base_url($country_data->country_iso_code_4.'/universities');

        $this->data['top_colleges_link']=base_url($country_data->country_iso_code_4.'/colleges');

        $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';
        $system_social_settings=$this->sm->get_settings(array('settings_key'=>'config_system_social_settings'));


        $settings_social_value=(!empty($system_social_settings->settings_value))?json_decode($system_social_settings->settings_value):'';


        if(isset($settings_general_value->system_title_name) && $settings_general_value->system_title_name!=''){

          $this->data['system_name_title']=$settings_general_value->system_title_name;
        }else{
          $this->data['system_name_title']='';
        }

        if(isset($settings_general_value->system_meta_title) && $settings_general_value->system_meta_title!=''){
          $this->data['system_name']=$settings_general_value->system_meta_title;
        }else{
          $this->data['system_name']='';
        }

        if(isset($settings_general_value->system_logo) && $settings_general_value->system_logo!=''){
          $this->data['system_logo']=$settings_general_value->system_logo;
        }else{
          $this->data['system_logo']='';
        }

        //$this->data['system_logo']=DIR_CDN.'data/app/2021/waytonewlogo.svg';

        if(isset($settings_general_value->system_logo_white) && $settings_general_value->system_logo_white!=''){
          $this->data['system_logo_white']=$settings_general_value->system_logo_white;
        }else{
          $this->data['system_logo_white']='';
        }

        if(isset($settings_general_value->system_logo_small) && $settings_general_value->system_logo_small!=''){
          $this->data['system_logo_small']=$settings_general_value->system_logo_small;
        }else{
          $this->data['system_logo_small']='';
        }

        if(isset($settings_general_value->system_favicon) && $settings_general_value->system_favicon!=''){
          $this->data['system_favicon']=$settings_general_value->system_favicon;
        }else{
          $this->data['system_favicon']=DIR_CDN.'data/app/2021/favicon.png';
        }

        if(isset($settings_general_value->system_apple_store_logo) && $settings_general_value->system_apple_store_logo!=''){
          $this->data['system_apple_store_logo']=$settings_general_value->system_apple_store_logo;
        }else{
          $this->data['system_apple_store_logo']='';
        }

        if(isset($settings_general_value->system_play_store_logo) && $settings_general_value->system_play_store_logo!=''){
          $this->data['system_play_store_logo']=$settings_general_value->system_play_store_logo;
        }else{
          $this->data['system_play_store_logo']='';
        }

        if(isset($settings_general_value->system_mobile_app_image) && $settings_general_value->system_mobile_app_image!=''){
          $this->data['system_mobile_app_image']=$settings_general_value->system_mobile_app_image;
        }else{
          $this->data['system_mobile_app_image']='';
        }

        if(isset($settings_general_value->system_info_email) && $settings_general_value->system_info_email!=''){
          $this->data['system_info_email']=$settings_general_value->system_info_email;
        }else{
          $this->data['system_info_email']='';
        }

        if(isset($settings_general_value->system_auto_email) && $settings_general_value->system_auto_email!=''){
          $this->data['system_auto_email']=$settings_general_value->system_auto_email;
        }else{
          $this->data['system_auto_email']='';
        }

        if(isset($settings_general_value->system_web_master_email) && $settings_general_value->system_web_master_email!=''){
          $this->data['system_web_master_email']=$settings_general_value->system_web_master_email;
        }else{
          $this->data['system_web_master_email']='';
        }

        if(isset($settings_general_value->system_webmaster_ph) && $settings_general_value->system_webmaster_ph!=''){
          $this->data['system_webmaster_ph']=$settings_general_value->system_webmaster_ph;
        }else{
          $this->data['system_webmaster_ph']='';
        }

        if(isset($settings_social_value->system_facebook_link) && $settings_social_value->system_facebook_link!=''){
          $this->data['system_facebook_link']=$settings_social_value->system_facebook_link;
        }else{
          $this->data['system_facebook_link']='';
        }        

        if(isset($settings_social_value->system_google_link) && $settings_social_value->system_google_link!=''){
          $this->data['system_google_link']=$settings_social_value->system_google_link;
        }else{
          $this->data['system_google_link']='';
        }


        if(isset($settings_social_value->system_youtube_link) && $settings_social_value->system_youtube_link!=''){
          $this->data['system_youtube_link']=$settings_social_value->system_youtube_link;
        }else{
          $this->data['system_youtube_link']='';
        }

        if(isset($settings_social_value->system_instagram_link) && $settings_social_value->system_instagram_link!=''){
          $this->data['system_instagram_link']=$settings_social_value->system_instagram_link;
        }else{
          $this->data['system_instagram_link']='';
        }

        if(isset($settings_social_value->system_linkedin_link) && $settings_social_value->system_linkedin_link!=''){
          $this->data['system_linkedin_link']=$settings_social_value->system_linkedin_link;
        }else{
          $this->data['system_linkedin_link']='';
        }


        if(isset($settings_social_value->system_twitter_link) && $settings_social_value->system_twitter_link!=''){
          $this->data['system_twitter_link']=$settings_social_value->system_twitter_link;
        }else{
          $this->data['system_twitter_link']='';
        }


        if(isset($system_common_straucture_data_settings->settings_value) && $system_common_straucture_data_settings->settings_value!=''){
          $this->data['system_application_json_ld']=trim($system_common_straucture_data_settings->settings_value);
        }else{
          $this->data['system_application_json_ld']='';
        }


  
        //print_obj($this->data);die;

        
        $this->data['system_title_name']=$settings_value->system_title_name;



        $this->data['system_social_settings']=$settings_social_value;


        $this->data['current_url']=encode_data($this->current_url);

        $system_ip=$this->input->ip_address();

        $security_token=encode_url($this->config->item('encryption_key'));
        $this->data['security_token']=$security_token;


        $now=now();


      $countries=$this->com->__get_country('country_id,country_name',array('country_status'=>'1'),FALSE,'country_serial','ASC');


      if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

        $user_id=decode_data(session_userdata('user_id'));
        $user_role=decode_data(session_userdata('user_role'));


         // print_obj($_SESSION);

        //echo $user_role;


        $userdata=$this->um->get_user_data(array('user_id'=>$user_id),null,$user_role);

       //print_obj($userdata);die;

       

        if(!empty($countries)){
          foreach ($countries as $key => $value) {
            $this->data['countries'][]=array(
              'country_id'=>encode_data($value->country_id),
              'country_name'=>$value->country_name,
              'selected'=>($value->country_id==$userdata->user_country)?'selected':''
            );
          }
        }

       // print_obj($this->data['countries']);die;

        $this->data['user_fullname']=strlen($userdata->user_fullname) > 6 ? substr($userdata->user_fullname,0,6)."..." : $userdata->user_fullname;

        $this->data['userdata']=$userdata;

        //print_obj($this->data['userdata']);die;

        if(in_array($userdata->user_role,array(3,4))){
          $this->data['account_url']=base_url().'account/settings';
        }else{
          $this->data['account_url']=base_url().'account';
        }

        $user_logo=$this->sm->__get_user_file('user_file_type_id,user_storage_type,media_disk_path,media_disk_path_relative',array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'));

        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
          $this->data['user_logo']=$user_logo->media_disk_path_relative;
        }else{
          if($userdata->user_role=='0'){
            if($userdata->user_image!=null){
              $this->data['user_logo']=$userdata->user_image;
            }else{
              $this->data['user_logo']=base_url().'uploads/app/default/no.jpg';
            }            
          }else{
            $this->data['user_logo']=base_url().'uploads/app/default/no.jpg';
          }          
        }


        $user_banner=$this->sm->__get_user_file('user_file_type_id,user_storage_type,media_disk_path,media_disk_path_relative',array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
          $this->data['user_banner']=$user_banner->media_disk_path_relative;
        }else{
          $this->data['user_banner']=base_url().'uploads/app/default/pageBnr.jpg';
        }

        $this->theme->theme('default',$this->data)->add_partial('partial_popup_modal',$this->data)->add_partial('partial_password_change_modal',$this->data)->add_partial('partial_claim_modal',$this->data)->add_partial('partial_header',$this->data)->add_partial('partial_footer',$this->data);
      }else{
        if(!empty($countries)){
          foreach ($countries as $key => $value) {
            $this->data['countries'][]=array(
              'country_id'=>encode_data($value->country_id),
              'country_name'=>$value->country_name,
              'selected'=>''
            );
          }
        }
        $this->theme->theme('default',$this->data)->add_partial('partial_popup_modal',$this->data)->add_partial('partial_login_modal',$this->data)->add_partial('partial_claim_modal',$this->data)->add_partial('partial_register_modal',$this->data)->add_partial('partial_subscription_thank_you_modal')->add_partial('partial_header',$this->data)->add_partial('partial_footer',$this->data);
      }

      //print_obj($this->data['countries']);die;
  	}



    public function onUploadFiles($param,$uploader_method='uploader'){

      $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
      $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

      // if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain_path)){
      //  // $file_data_path=$settings_general_value->system_assests_domain.'data';
      //   $file_data_path = DIR_STATIC_PATH.'/data';// '/home/thencriptechindia/'.$settings_general_value->system_assests_domain_path.'/data';//DIR_UPLOADS. '/data';
      //   $file_data_path_domain=$settings_general_value->system_assests_domain_path;
      // }else{
      //   $file_data_path=DIR_UPLOADS.'/data';
      //   $file_data_path_domain=FCPATH;
      // }

      if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain_path)){
       // $file_data_path=$settings_general_value->system_assests_domain.'data';
        $file_data_path = '/home/u835722343/'.$settings_general_value->system_assests_domain_path.'/data';//DIR_UPLOADS. '/data';
        $file_data_path_domain=$settings_general_value->system_assests_domain_path;
      }else{
        $file_data_path=DIR_UPLOADS.'/data';
        $file_data_path_domain=FCPATH;
      }

     //echo $file_data_path_domain;die;

      if($uploader_method=='uploader'){
        $document_to_upload     =     $_FILES[$param['file_name']];

        $uploader = new Uploader();

        $file_types=explode(',', $param['file_types']);

        $file_size=isset($param['file_size'])?$param['file_size']:5;

        $file_limit=isset($param['file_limit'])?$param['file_limit']:1;

        //$file_parent_id=isset($param['file_parent_id'])?$param['file_parent_id']:'0';



        if(isset($param['file_folder']) && $param['file_folder']!=''){
          // $file_parent_folder=DIR_UPLOADS.'/data'.'/'.$param['file_folder'];
          $file_parent_folder=$file_data_path.'/'.$param['file_folder'];
          $_parent_folder=str_replace('\\', '/', $file_parent_folder);
          $parent_folder=$this->sm->get_file(array('media_disk_path'=>$_parent_folder));

         // echo $_parent_folder;die;

          

          if(!empty($parent_folder)){
            $upload_dir=$parent_folder->media_disk_path.'/';
            $file_relative_url=$parent_folder->media_disk_path_relative;
            $file_parent_id=$parent_folder->storage_id;
          }else{
            // $upload_dir=DIR_UPLOADS.'/data';
            $upload_dir=$_parent_folder.'/';
            $file_relative_url=base_url().'uploads/data/'.$param['file_folder'];
           // $file_relative_url=$_parent_folder.'/';
            $file_parent_id='0';
          }
            
        }else{
          // $upload_dir=DIR_UPLOADS.'/data';
          $upload_dir=$file_data_path;
          // $file_relative_url=base_url().'uploads/data/';
          $file_relative_url=$file_data_path.'/';
          $file_parent_id='0';
        }


        if(isset($param['file_parent_folder']) && $param['file_parent_folder']!=''){
          $upload_dir=$param['file_parent_folder'].'/';
          $file_relative_url=$relative_url;
        }

        if(isset($param['file_parent_relative_url']) && $param['file_parent_relative_url']!=''){
          $file_relative_url=$param['file_parent_relative_url'];
        }

        if(isset($param['file_parent_id']) && $param['file_parent_id']!=''){
          $file_parent_id=$param['file_parent_id'];
        }

       //echo $upload_dir;die;

        if(isset($param['file_child_folder'])){
          $folder = basename(html_entity_decode($param['file_child_folder'], ENT_QUOTES, 'UTF-8'));
          $dir=$upload_dir .'/'. $folder;
          $media_disk_path=str_replace('//', '/',str_replace('\\', '/', $dir));
          $basepath=str_replace('\\', '/', realpath(FCPATH));
          $absolute_path=str_replace($basepath.'/', '', $media_disk_path);

          //echo str_replace($file_data_path, '', $absolute_path);
          $absolute_path= str_replace('//', '/', $absolute_path) ;

          //echo $absolute_path;echo '<br><br>';

          //print_obj($settings_general_value);

          //echo $file_data_path;

          // if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain)){
          //   $relative_url=$settings_general_value->system_assests_domain;//.'data'.str_replace($file_data_path, '', $absolute_path);
          //   $file_relative_url=$relative_url;
            
          // }else{
          //   //$relative_url=base_url().$absolute_path;
          //   //$file_relative_url=$relative_url;
          // }

          $relative_url=base_url().$absolute_path;
          $file_relative_url=$relative_url;


          //echo $relative_url;die;

          //echo $media_disk_path;die;

          $child_folder_found=$this->sm->get_file(array('media_disk_path'=>$media_disk_path));

          //print_obj($child_folder_found);

          if(empty($child_folder_found)){              
            mkdir($media_disk_path, 0777);
            chmod($media_disk_path, 0777);
            @touch($media_disk_path . '/' . 'index.html');

            $folder_data=array(
              'storage_type'=>'1',
              'storage_parent_id'=>$file_parent_id,
              'media_disk_path'=>$media_disk_path,
              'media_disk_path_relative'=>$relative_url,
              'media_disk_name'=>encode_data($folder),
              'media_org_name'=>$folder,
              'media_uploaded_by'=>$param['file_uploaded_by']
            );
            
            $file_parent_id=$this->sm->store_file($folder_data);
            $upload_dir=$media_disk_path.'/';
          }else{

            if(!file_exists($media_disk_path)){
              mkdir($media_disk_path, 0777);
              chmod($media_disk_path, 0777);
              @touch($media_disk_path . '/' . 'index.html');

              $file_parent_id=$child_folder_found->storage_id;
              $upload_dir=$media_disk_path.'/';
              
            }else{
              $file_parent_id=$child_folder_found->storage_id;
              $upload_dir=$media_disk_path.'/';
            }

            //echo $upload_dir;die;
          }
        }

       // echo $upload_dir;die;
        

        $document_data=array(
            'limit' => $file_limit,
            'maxSize' => $file_size,
            'extensions' => $file_types,
            'required' => true,
            'uploadDir' =>$upload_dir,
            'title' => array('auto', 10),
            'removeFiles' => true,
            'perms' => null,
            'onCheck' => null,
            'onError' => null,
            'onSuccess' =>null ,
            'onUpload' => '',
            'onComplete' => null,
            'onRemove' => ''
        );

        //print_obj($document_to_upload);

        //print_obj($document_data);die;

        $data = $uploader->upload($document_to_upload, $document_data);

        //print_obj($data);die;

        if($data['isComplete']==1 && $data['isSuccess']==1 && $data['hasErrors']==NULL){

          $files = $data['data'];

          //print_obj($files);die;

          $media_mime=implode('/',$files['metas'][0]['type']);

          $file_relative_path=$file_relative_url.'/'.$files['metas'][0]['name'];

          //echo $file_relative_url;die;       

          $pathToImage=$files['metas'][0]['file'];


          //if($files['metas'][0]['size']>=5000){
            if(isset($param['file_compress'])){
              if($param['file_compress']==true){

                if($param['file_compress_protocol']=='webp'){
                  $source=$files['metas'][0]['file'];

                  $destination = str_replace('.'.$files['metas'][0]['extension'], '', $source). '.webp';

                  $options = [
                    'converters' => [
                          'cwebp', 'vips', 'imagick', 'gmagick', 'imagemagick', 'graphicsmagick', 'wpc', 'ewww', 'gd'
                      ],

                      // Any available options can be set here, they dribble down to all converters.
                      'metadata' => 'all',

                      // To override for specific converter, you can prefix with converter id:
                      'cwebp-metadata' => 'exif'
                  ];
                  WebPConvert::convert($source, $destination, $options);

                  // WebPConvert::serveConverted($source, $destination, [
                  //   'fail' => 'original',     // If failure, serve the original image (source). Other options include 'throw', '404' and 'report'
                  //   'show-report' => true,  // Generates a report instead of serving an image

                  //   'serve-image' => [
                  //       'headers' => [
                  //           'cache-control' => true,
                  //           'vary-accept' => true,
                  //           // other headers can be toggled...
                  //       ],
                  //       'cache-control-header' => 'max-age=2',
                  //   ],

                  //   'convert' => [
                  //       // all convert option can be entered here (ie "quality")
                  //   ],
                  // ]);

                  $file_name=str_replace('.'.$files['metas'][0]['extension'], '.webp', $files['metas'][0]['name']);
                  $file_relative_path=str_replace($files['metas'][0]['name'], $file_name, $file_relative_path);
                  $file_disk_path=$destination;
                  $bytes=filesize($destination);
                  $file_mime='image/webp';
                  if ($bytes >= 1073741824){
                      $bytes = number_format($bytes / 1073741824, 2) . ' GB';
                  }elseif ($bytes >= 1048576){
                      $bytes = number_format($bytes / 1048576, 2) . ' MB';
                  }elseif ($bytes > 0){
                      $bytes = number_format($bytes / 1024, 2) . ' KB';
                  }else{
                      $bytes = '0 bytes';
                  }
                  
                  $file_size2=$bytes;
                  $file_size=filesize($destination);

                  @unlink($source);

                }else{
                    if($media_mime=='image/jpeg' || $media_mime=='image/png' || $media_mime=='image/jpg'){
                      chmod($pathToImage, 0755);
                      //$this->compress_image($pathToImage, $pathToImage, 10);

                      //echo $pathToImage;die;
                      // $imagecache = new ImageCache();
                      // $cached_src_one = $imagecache->cache($pathToImage);

                      // $factory = new \ImageOptimizer\OptimizerFactory();
                      // $optimizer = $factory->get();
                      // $optimizer->optimize($pathToImage);

                      $optimizerChain = OptimizerChainFactory::create();

                      $optimizerChain->optimize($pathToImage, $pathToImage);

                      $file_name=$files['metas'][0]['name'];
                      $file_relative_path=$file_relative_path;
                      $file_disk_path=$files['metas'][0]['file'];
                      $file_mime=$files['metas'][0]['size'];
                      $file_size2=$files['metas'][0]['size2'];
                    }
                  }
                }
                                
            }else{
              if($media_mime=='image/jpeg' || $media_mime=='image/png' || $media_mime=='image/jpg'){
                chmod($pathToImage, 0755);
                //$this->compress_image($pathToImage, $pathToImage, 10);

                // $imagecache = new ImageCache();
                // $cached_src_one = $imagecache->cache($pathToImage);

                // $factory = new \ImageOptimizer\OptimizerFactory();
                // $optimizer = $factory->get();
                // $optimizer->optimize($pathToImage);

                $optimizerChain = OptimizerChainFactory::create();

                $optimizerChain->optimize($pathToImage, $pathToImage);

                $file_name=$files['metas'][0]['name'];
                $file_relative_path=$file_relative_path;
                $file_disk_path=$files['metas'][0]['file'];
                $file_mime=$media_mime;
                $file_size2=$files['metas'][0]['size'];
                $file_size2=$files['metas'][0]['size2'];
              }
            }
          //}

           

            
          

          //echo $pathToImage;die;
          // $imagecache = new ImageCache();
          // $cached_src_one = $imagecache->cache($pathToImage);

          // $factory = new \ImageOptimizer\OptimizerFactory();
          // $optimizer = $factory->get();
          // $optimizer->optimize($pathToImage);

          $sdata=array(
            'storage_parent_id'=>$file_parent_id,
            'storage_type'=>'2',
            'media_disk_path'=>$file_disk_path,
            'media_disk_path_relative'=>$file_relative_path,
            'media_disk_name'=>$file_name,
            'media_org_name'=>$files['metas'][0]['old_name'].'.'.$files['metas'][0]['extension'],
            'media_size'=>$file_size,
            'media_size2'=>$file_size2,
            'media_mime'=>$file_mime,
            'media_uploaded_by'=>$param['file_uploaded_by']
          );

         

          //print_obj($sdata);die;

          $temp_file_id=$this->sm->store_file($sdata);         

          return $temp_file_id;
         
        }else if($data['isComplete']==NuLL && $data['hasErrors']==1 && $data['isSuccess']==NULL){
          return $data['errors'][0][0];
        }else if($data['isComplete']==1 && $data['hasErrors']==1 && $data['isSuccess']==NULL){
          return $data['errors'][0][0];
        }
      }else if($uploader_method=='pluploader'){

        $file_types=$param['file_types'];
        $file_size=isset($param['file_size'])?$param['file_size']:5;

        $file_limit=isset($param['file_limit'])?$param['file_limit']:1;

        $file_parent_id=isset($param['file_parent_id'])?$param['file_parent_id']:'0';

        if(isset($param['file_folder']) && $param['file_folder']!=''){
          $parent_folder=$this->sm->get_file(array('storage_id'=>$param['file_folder']));
          $upload_dir=$parent_folder->media_disk_path;
          $file_relative_url=$parent_folder->media_disk_path_relative.'/';
        }else{
          $upload_dir=DIR_UPLOADS.'/data';
          $file_relative_url=base_url().'uploads/data/';
        }

        $configs=array(
          'target_dir' => $upload_dir,
          'allow_extensions' => $file_types
        );

        $uploader=new PluploadHandler($configs);

        $uploader->sendNoCacheHeaders();
        $uploader->sendCORSHeaders();

        if ($result = $uploader->handleUpload()) {
          $uploaded_data=array(
            'isComplete' => 1,
            'info' => $result
          );
        } else {
          $uploaded_data=array(
            'isComplete' => 0,
            'error' => array(
              'code' => $uploader->getErrorCode(),
              'message' => $uploader->getErrorMessage()
            )
          );
        }

        if($uploaded_data['isComplete']=='1' && isset($uploaded_data['info']) && isset($uploaded_data['info']['new_name'])){
  
          compressImage($uploaded_data['info']['path'],$uploaded_data['info']['path'],60);
          $file_relative_path=$file_relative_url.$uploaded_data['info']['new_name']; 
          $data=array(
            'storage_parent_id'=>$file_parent_id,
            'storage_type'=>'2',
            'media_disk_path'=>$uploaded_data['info']['path'],
            'media_disk_path_relative'=>$file_relative_path,
            'media_disk_name'=>$uploaded_data['info']['new_name'],
            'media_org_name'=>$uploaded_data['info']['name'],
            'media_size'=>$uploaded_data['info']['size'],
            'media_size2'=>$uploaded_data['info']['sizeformat'],
            'media_mime'=>$uploaded_data['info']['mime'],
            'media_uploaded_by'=>$param['file_uploaded_by']
          );

          $temp_file_id=$this->sm->store_file($data);         

          return $temp_file_id;
        }else if($uploaded_data['isComplete']=='1' && isset($uploaded_data['error'])){
          return $uploaded_data['error']['message'];
        }
      }else if($uploader_method=='excel_import'){
        $document_to_upload     =     $_FILES[$param['file_name']];

        $file_types=explode(',', $param['file_types']);

        $file_size=isset($param['file_size'])?$param['file_size']:5;

        $file_limit=isset($param['file_limit'])?$param['file_limit']:1;

        $upload_dir=FCPATH.'uploads/temp/';

        $uploader = new Uploader();

        $document_data=array(
            'limit' => $file_limit,
            'maxSize' => $file_size,
            'extensions' => $file_types,
            'required' => true,
            'uploadDir' =>$upload_dir,
            'title' => array('auto', 10),
            'removeFiles' => true,
            'perms' => null,
            'onCheck' => null,
            'onError' => null,
            'onSuccess' =>null ,
            'onUpload' => '',
            'onComplete' => null,
            'onRemove' => ''
        );
        

        $data = $uploader->upload($document_to_upload, $document_data);

       // print_obj($data);die;

        if($data['isComplete']==1 && $data['isSuccess']==1 && $data['hasErrors']==NULL){

          $files = $data['data'];

          $file_path=$files['metas'][0]['file'];
          chmod($file_path, 0777);
          return $file_path;
        }else if($data['isComplete']==NuLL && $data['hasErrors']==1 && $data['isSuccess']==NULL){
          return $data['errors'][0][0];
        }else if($data['isComplete']==1 && $data['hasErrors']==1 && $data['isSuccess']==NULL){
          return $data['errors'][0][0];
        }
      }else if($uploader_method=='youtube'){
        $youtube_link=$param['youtube_link'];
        $youtube_video_name=$param['youtube_video_name'];
        $youtube_video_parent_id=$param['youtube_video_parent_id'];

        $data=array(
            'storage_parent_id'=>$youtube_video_parent_id,
            'storage_type'=>'3',
            'media_disk_path'=>null,
            'media_disk_path_relative'=>$youtube_link,
            'media_disk_name'=>null,
            'media_org_name'=>$youtube_video_name,
            'media_size'=>'0',
            'media_size2'=>'0',
            'media_mime'=>'youtube',
            'media_uploaded_by'=>decode_data(session_userdata('admin_id'))
          );

          $temp_file_id=$this->sm->store_file($data);         

          return $temp_file_id;
      }
    }
}