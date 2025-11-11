<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/vendor/autoload.php';

use Spatie\ImageOptimizer\OptimizerChainFactory;
use WebPConvert\WebPConvert;
/**
 * 
 */
class BaseAdminController extends CI_Controller
{
	  public $data=array();
  	public $permission = array();
  	public $login_session_duration = 5;


  function __construct()
  {

  	parent::__construct();


        $searched_data=array();

        // Login URL:https://www.sikshapedia.com/admin08wayto
        // Username:sabitaseo
        // Password:Sabita@##2024%

        ///$this->index_update_search_data('COLLEGE_NAME','0','10');die;

        //$password = password_hash('Tiyasa@#01#2025%', PASSWORD_BCRYPT, array('cost'=>12));

        //echo $password;

        $this->config->load('tinymce');
        $tinymce_key=$this->config->item('anonym_tinymce_keys');
        $config_tinymce_key =	$this->sm->get_settings(array('settings_key'=>'config_tinymce_key'));
        $tinymce_keys=array();
        $_exams_links=array();

        if(!empty($tinymce_key)){
          foreach($tinymce_key as $k=>$v){
            $tinymce_keys[]=array(
              'key'=>$k,
              'v'=>$v,
              'selected'=>($k==$config_tinymce_key->settings_value)?'selected':''
            );
          }
        }

        $this->data['tinymce_keys']=$tinymce_keys;

  		  $system_admin_url =	$this->sm->get_settings(array('settings_key'=>'config_admin_base_route'));
  		  $this->data['admin_base_url']   =	base_url().$system_admin_url->settings_value;

        $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
        $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';


        $system_social_settings=$this->sm->get_settings(array('settings_key'=>'config_system_social_settings'));
        $settings_social_value=(!empty($system_social_settings->settings_value))?json_decode($system_social_settings->settings_value):'';


        $system_email_settings=$this->sm->get_settings(array('settings_key'=>'config_system_email_settings'));
        $settings_email_value=(!empty($system_email_settings->settings_value))?json_decode($system_email_settings->settings_value):'';


        $system_server_settings=$this->sm->get_settings(array('settings_key'=>'config_system_server_settings'));
        $settings_server_value=(!empty($system_server_settings->settings_value))?json_decode($system_server_settings->settings_value):'';


        $system_ip=$this->input->ip_address();

        $security_token=encode_url($this->config->item('encryption_key'));


        $now=now();


        $security_settings=$this->sm->get_security_settings(array('security_token_ip'=>$system_ip,'security_token_user_type'=>'1'));

        //print_obj($security_settings);die;

        if(empty($security_settings)){
          $security_data=array(
            'security_token'=>$security_token,
            'security_token_ip'=>$system_ip,
            'security_token_user_type'=>'1',
            'security_token_status'=>'1',
            'security_token_date'=>$now
          );

          $this->sm->store_security_settings($security_data);
          $this->data['security_token']=$security_token;
        }else{
          $security_token_date=$security_settings->security_token_date;

          if(date('Y-m-d',$now)==date('Y-m-d',$security_token_date)){
            $this->data['security_token']=$security_settings->security_token;
          }else{
            $security_data=array(
              'security_token'=>$security_token,
              'security_token_ip'=>$system_ip,
              'security_token_user_type'=>'1',
              'security_token_status'=>'1',
              'security_token_date'=>$now
            );

            $this->sm->update_security_settings($security_data,array('security_token_ip'=>$system_ip,'security_token_user_type'=>'1'));
            $this->data['security_token']=$security_token;
          }
        }
      
        // $this->data['system_logo_data']=$this->sm->get_file(array('media_type'=>'system_logo'));
        // $this->data['system_logo_white_data']=$this->sm->get_file(array('media_type'=>'system_logo_white'));
        // $this->data['system_favicon_data']=$this->sm->get_file(array('media_type'=>'system_favicon'));

  		  $this->theme->view_type='admin';

        $this->theme->initialize(array(
          'theme'            => 'default',
          'master'           => 'default',
          'layout'           => 'default',
          'title_sep'        => '-',
          'compress'         => (ENVIRONMENT !== 'development')?false:false,
          'cache_lifetime'   => 0,
          'cdn_enabled'      => false,
          'cdn_server'       => null,
          'site_name'        => $settings_general_value->system_meta_title,
          'site_description' => '',
          'site_keywords'    => ''
        ));

        $this->data['csrf']=array(
        	'name' => $this->security->get_csrf_token_name(),
        	'hash' => $this->security->get_csrf_hash()
      	);


        $this->data['system_general_settings']=$settings_general_value;
        $this->data['system_social_settings']=$settings_social_value;
        $this->data['system_email_settings']=$settings_email_value;
        $this->data['system_server_settings']=$settings_server_value;

        
        if(!empty($settings_general_value)){
          $file_data_path=$settings_general_value->system_assests_domain.'data';
          $file_data_path_domain=$settings_general_value->system_assests_domain_path;
        }else{
          $file_data_path=DIR_UPLOADS.'/data';
          $file_data_path_domain=FCPATH;
        }

        $this->data['static_assests_path']=$file_data_path;
        $this->data['static_assests_path_domain']=$file_data_path_domain;


      	$system_ip=$this->input->ip_address();

      	if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){

          $user_id=decode_data(session_userdata('admin_id'));

          $userdata=$this->um->_get_internal_user(array('user_id'=>$user_id));

         // print_obj($userdata);die;

          $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$user_id),NULL,FALSE);

          if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
            $this->data['user_image']=$user_image->media_disk_path_relative;
          }else{
            if(isset($settings_general_value->system_logo_small) && $settings_general_value->system_logo_small!=''){
              $this->data['user_image']=$settings_general_value->system_logo_small;
            }else{
              $this->data['user_image']=base_url().'uploads/app/default/no.jpg';
            }
            
          }    
          $this->data['permissions']=explode(',', $userdata->user_permissions);
          $this->data['userdata']=$userdata;


          $college_widgets=array(
            'front_info_section'=>'College Info Section',
            'front_admission_section'=>'College Admission Info Section',
            'front_course_fees_section'=>'College Course Fees Section',
            'front_course_fees_brief_with_ads_section'=>'College Course Fees Section With Ads',
            'front_placement_section'=>'College Placement Section',
            'front_facilities_section'=>'College Facilities Section',
            'front_news_brief_section'=>'College News Brief Section',
            'front_gallery_brief_section'=>'College Gallery Brief Section',
            'front_gallery_section'=>'College Gallery Full Section',
            'front_google_maps_section'=>'College Address Google Map Section',
            'front_college_comment_section'=>'College Comment Section',
            'front_nearby_colleges_universities_section'=>'Nearby College/University Section',
            'front_subscription_section'=>'Newsletter Subscription Section',
            'front_google_ads_section'=>'Google Ads Section'
          );

          $this->data['college_widgets']=$college_widgets;

          $university_widgets=array(
            "front_info_university_section"=>'University Info Section',
            "front_course_fees_section"=>'University Course Fees Section',
            "front_course_fees_course_section"=>'University Course Fees Details Section',
            "front_course_fees_brief_with_ads_section"=>'University Course fees with Ads section',
            "front_placement_section"=>'University Placement Brief Details Section',
            "front_placement_details_section"=>'University Placement Details Section',
            "front_facilities_section"=>'University Facilities Section',
            'front_results_section'=>'University Results Section',
            "front_news_brief_section"=>'University News Brief Section',
            "front_google_maps_section"=>'University Google Map Section',
            "front_wayto_rating_section"=>'Waytoadmissions Rating Section',
            "front_nearby_colleges_universities_section"=>'Nearby Colleges Section',
            "front_college_comment_section"=>'University comment Section'
          );

          $this->data['university_widgets']=$university_widgets;

          $this->data['inner_menu_types']=$this->sm->get_menue_types(array('menu_type_status'=>'1'),FALSE);

          $exams=$this->strm->get_exam(array('exam_status'=>'1'),FALSE);

          // $news_section=array(
          //   "front_news_brief_section",
          //   "front_google_ads_section",
          //   "front_college_comment_section",
          //   "front_nearby_colleges_universities_section"
          // );

          // $faculty_section=array(
          //   "front_distance_education_section",
          //   "front_google_ads_section",
          //   "front_news_brief_section",
          //   "front_college_comment_section",
          //   "front_nearby_colleges_universities_section"
          // );

          // echo serialize($faculty_section);die;




          //print_obj($exmas);die;

          if(!empty($exams)){
            foreach ($exams as $key => $value) {
              $slug_data=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
              if(!empty($slug_data)){
                $_exams_links[]=array(
                  'exam_name'=>$value->exam_short_name,
                  'exam_link'=>base_url('exams/'.$slug_data->slug_value)
                );
              }
                
            }
          }



          $this->data['exams_links']=$_exams_links;

          

          $other_colleges=$this->im->__get_college_profile_data('college_user_id,college_name,access_url,college_city_id',array('is_verified_by_admin'=>'1'),FALSE);

          if(!empty($other_colleges)){
            foreach ($other_colleges as $key => $value) {
              $city_data=$this->com->get_city(array('city_id'=>$value->college_city_id));
              $college_links[]=array(
                'college_name'=>$value->college_name.' - ['.$city_data->city_name.']',
                'college_link'=>$value->access_url
              );
            }
          }

          $this->data['college_links']=$college_links;


          //print_obj($this->data);die;

          $this->theme->add_partial('partial_header',$this->data)->add_partial('partial_change_pass_modal')->add_partial('partial_file_upload_modal')->add_partial('partial_college_inner_menues_modal')->add_partial('partial_college_inner_menues_edit_modal')->add_partial('partial_menu_widgets_modal')->add_partial('partial_cmenu_widgets_modal')->add_partial('partial_superadmin_sidebar',$this->data)->add_partial('partial_footer'); 
      	}else{
      		$this->theme->theme('default');	
      	}
  }


    public function index_update_search_data($search_type='COLLEGE_NAME',$limit_start='0',$limit_end){

      $this->db->select('college_user_id,UPPER(college_name) as college_name,college_short_name,access_url,country_id,country_name,state_id,state_name,city_id,city_name');
      $this->db->join('system_country','system_users_colleges.college_country_id=system_country.country_id','LEFT');
      $this->db->join('system_country_cities','system_users_colleges.college_city_id=system_country_cities.city_id','LEFT');
      $this->db->join('system_country_states','system_users_colleges.college_state_id=system_country_states.state_id','LEFT');
      $this->db->from('system_users_colleges');
      $this->db->limit($limit_end, $limit_start);
      $query = $this->db->get();

      if ($query->num_rows() > 0) {

        $result=$query->result();

        if(!empty($result)){
          foreach ($result as $key => $value) {
             $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_logo','user_file_type_id'=>$value->college_user_id),NULL,FALSE);

             echo $value->college_name;

             $data_to_store[]=array(
              'search_data_type_id'=>$value->college_user_id,
              'search_data_type'=>'COLLEGE_NAME',
              'search_data_name'=>$value->college_name,
              'search_data_short_name'=>'',
              'search_data_country_id'=>$value->country_id,
              'search_data_country'=>$value->country_name,
              'search_data_state_id'=>$value->state_id,
              'search_data_state_name'=>$value->state_name,
              'search_data_city_id'=>$value->city_id,
              'search_data_city_name'=>$value->city_name,
              'search_data_access_url'=>$value->access_url,
              'search_storage_access_url'=>$user_image->media_disk_path_relative
             );
          }

          //print_obj($data_to_store);
        }

        die;

        //print_obj($query->result());
        
      } else {
          return array(); // Return an empty array if no results found
      }
    }

    public function onUploadFiles($param,$uploader_method='uploader'){

      $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
      $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

      if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain_path)){
       // $file_data_path=$settings_general_value->system_assests_domain.'data';
        $file_data_path = '/home/u986533929/'.$settings_general_value->system_assests_domain_path.'/data';//DIR_UPLOADS. '/data';
        $file_data_path_domain=$settings_general_value->system_assests_domain_path;
      }else{
        $file_data_path=DIR_UPLOADS.'/data';
        $file_data_path_domain=FCPATH;
      }

      if(isset($param['file_group_name']) && !empty($param['file_group_name'])){
        $file_group_name=$param['file_group_name'];
      }else{
        $file_group_name=NULL;
      }

     // echo $file_data_path;

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
          $absolute_path= str_replace('//', '/', str_replace('public/data/','',$absolute_path)) ;

          //echo $absolute_path;echo '<br><br>';

         // print_obj($settings_general_value);

          if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain)){
            $relative_url=$file_data_path=$settings_general_value->system_assests_domain.'data/'.str_replace($file_data_path, '', $absolute_path);
            $file_relative_url=$relative_url;
            
          }else{
            $relative_url=base_url().$absolute_path;
            $file_relative_url=$relative_url;
          }

          //echo $relative_url;die;

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
            'title' => (isset($param['file_custom_title']))?$param['file_custom_title']:array('auto', 10),
            'removeFiles' => true,
            'perms' => null,
            'onCheck' => null,
            'onError' => null,
            'onSuccess' =>null ,
            'onUpload' => '',
            'onComplete' => null,
            'onRemove' => ''
        );

        //print_obj($document_to_upload);die;
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
              }else{
                $file_name=$files['metas'][0]['name'];
                $file_relative_path=$file_relative_path;
                $file_disk_path=$files['metas'][0]['file'];
                $file_mime=$media_mime;
                $file_size2=$files['metas'][0]['size'];
                $file_size2=$files['metas'][0]['size2'];
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
              }else{
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
            'media_identity_name'=>$file_group_name,
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
            'media_type'=>'youtube',
            'media_mime'=>'youtube',
            'media_uploaded_by'=>decode_data(session_userdata('admin_id'))
          );

          $temp_file_id=$this->sm->store_file($data);         

          return $temp_file_id;
      }
    }


    public function onCopyCompress(){

      $college_logo_new_name=strtolower($college_short_name).'-'.$city_slug->slug_value.'-'.$state_slug->slug_value;
      $new_media_strtok=strtok($college_logo_name,'.');
      $path_parts = pathinfo($college_log_disk_path);

      $new_file_name=$college_logo_new_name.'.'.$path_parts['extension'];

      $file_upload_real_path=str_replace($college_logo_name, '', $college_log_disk_path);
      $file_upload_relative_path=str_replace($college_logo_name, '', $college_logo);

      $file_new_relative_path=$file_upload_relative_path.$new_file_name;
      $file_new_real_path=$file_upload_real_path.$new_file_name;

      $college_logo=$file_new_real_path;

      //print_obj($new_media_strtok);die;

      copy($cover_image_real_path, $file_new_real_path);

      $file_data=array(
        'storage_type'=>'1',
        'storage_parent_id'=>$_college_logo->storage_parent_id,
        'storage_type'=>$_college_logo->storage_type,
        'media_type'=>$_college_logo->media_type,
        'media_disk_path'=>$file_new_real_path,
        'media_disk_path_relative'=>$file_new_relative_path,
        'media_disk_name'=>$new_file_name,
        'media_org_name'=>$_college_logo->media_org_name,
        'media_size'=>$_college_logo->media_size,
        'media_size2'=>$_college_logo->media_size2,
        'media_mime'=>$_college_logo->media_mime,
        'media_uploaded_by'=>$this->data['userdata']->user_id,
        'media_deletable'=>$_college_logo->media_deletable,
        'created_at'=>$_college_logo->created_at
      );
      
      $file_parent_id=$this->sm->store_file($file_data);




    }


    public function onCompressConvertFiles($file_id,$user_id){
      $file_found=$this->sm->get_file(array('storage_id'=>$file_id));

        $filefound=FALSE;

        if(!empty($file_found)){

          $filepath=$file_found->media_disk_path;

          $file_path=FCPATH.$file_found->media_disk_path;

          if(file_exists($filepath)){
            $filefound=true;
          }else if(file_exists($file_path)){
            $filefound=true;
          }else{
            $filefound=FALSE;
          }


          if($filefound==TRUE){
            $file_name=$file_found->media_disk_path;
            $file_relative_path=$file_found->media_disk_path_relative;

            $file_media_name=end(explode('/', $file_name));

            $file_replative_media_name=end(explode('/',$file_relative_path));

            $ext = pathinfo($file_name, PATHINFO_EXTENSION);

            $destination = str_replace('.'.$ext, '', $file_name). '.webp';            

            $link_array = explode('/',$destination);
            $media_name = end($link_array);

          

            $new_path=str_replace($file_media_name, $media_name, $file_name);
            $new_relative_path=str_replace($file_replative_media_name,$media_name, $file_relative_path);

            $options = [
              'converters' => [
                    'cwebp', 'vips', 'imagick', 'gmagick', 'imagemagick', 'graphicsmagick', 'wpc', 'ewww', 'gd'
                ],

                // Any available options can be set here, they dribble down to all converters.
                'metadata' => 'all',

                // To override for specific converter, you can prefix with converter id:
                'cwebp-metadata' => 'exif'
            ];

            WebPConvert::convert($file_name, $destination, $options);

            $media_size=filesize($new_path);
            $media_size_2=get_filesize($new_path);

            //echo $media_size_2;die;

            $updated=$this->sm->update_files(array('media_disk_path'=>$new_path,'media_disk_path_relative'=>$new_relative_path,'media_disk_name'=>$media_name,'media_size'=>$media_size,'media_size2'=>$media_size_2,'media_mime'=>'image/webp','media_uploaded_by'=>$user_id,'updated_at'=>date('Y-m-d')),array('storage_id'=>$file_found->storage_id));

            if($updated){
              //@unlink($file_name);
              return 'File converted & compress to '.$media_size_2.' from '.$file_found->media_size2;
            }else{
              return 'File not converted';
            }


          }else{
            return 'File not found physically';
          }
        }else{
          return 'File not found';
        }
    }


    public function onCompressConvertFiles1($file_id){
      if(!empty($file_id)){

        $fid=decode_data($file_id);

        $file_data=$this->sm->get_banner_file(array('banner_id'=>$fid));

        //print_obj($file_data);die;

        $file_name=$file_data[0]->media_disk_path;
        $file_relative_path=$file_data[0]->media_disk_path_relative;
        $ext = pathinfo($file_name, PATHINFO_EXTENSION);


        echo $file_name.'<br>'.$ext.'<br>';

        $destination = str_replace('.'.$ext, '', $file_name). '.webp';

       echo $destination;die;

        $options = [
          'converters' => [
                'cwebp', 'vips', 'imagick', 'gmagick', 'imagemagick', 'graphicsmagick', 'wpc', 'ewww', 'gd'
            ],

            // Any available options can be set here, they dribble down to all converters.
            'metadata' => 'all',

            // To override for specific converter, you can prefix with converter id:
            'cwebp-metadata' => 'exif'
        ];

        WebPConvert::convert($file_name, $destination, $options);

        WebPConvert::serveConverted($file_name, $destination, [
            'fail' => 'original',     // If failure, serve the original image (source). Other options include 'throw', '404' and 'report'
            'show-report' => true,  // Generates a report instead of serving an image

            'serve-image' => [
                'headers' => [
                    'cache-control' => true,
                    'vary-accept' => true,
                    // other headers can be toggled...
                ],
                'cache-control-header' => 'max-age=2',
            ],

            'convert' => [
                // all convert option can be entered here (ie "quality")
            ],
        ]);

       //  $cfile_name=str_replace($ext, '.webp', $file_name);
       //  $cfile_relative_path=str_replace($file_name, $cfile_name, $file_relative_path);
       //  $cfile_disk_path=$destination;
       //  $bytes=filesize($destination);
       //  $cfile_mime='image/webp';
       //  if ($bytes >= 1073741824){
       //      $bytes = number_format($bytes / 1073741824, 2) . ' GB';
       //  }elseif ($bytes >= 1048576){
       //      $bytes = number_format($bytes / 1048576, 2) . ' MB';
       //  }elseif ($bytes > 0){
       //      $bytes = number_format($bytes / 1024, 2) . ' KB';
       //  }else{
       //      $bytes = '0 bytes';
       //  }
        
       //  $file_size2=$bytes;
       //  $file_size=filesize($destination);

       // // @unlink($source);


       //  $data=array(
       //    'storage_type'=>'2',
       //    'media_disk_path'=>$cfile_disk_path,
       //    'media_disk_path_relative'=>$cfile_relative_path,
       //    'media_disk_name'=>$cfile_name,
       //    'media_size'=>$file_size,
       //    'media_size2'=>$file_size2,
       //    'media_mime'=>$cfile_mime,
       //    'media_uploaded_by'=>decode_data(session_userdata('admin_id'))
       //  );

       //  $updated=$this->sm->update_files($data,array('storage_id'=>$fid));
       //  if($updated){
       //    return 'File updated';
       //  }else{
       //    return 'File not updated';
       //  }

      }else{
        return 'Select file';
      }
    }


    public function onUploadFiles_old2($param,$uploader_method='uploader'){

      $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
      $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

      if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain_path)){
       // $file_data_path=$settings_general_value->system_assests_domain.'data';
        $file_data_path = '/home/thencriptechindia/'.$settings_general_value->system_assests_domain_path.'/data';//DIR_UPLOADS. '/data';
        $file_data_path_domain=$settings_general_value->system_assests_domain_path;
      }else{
        $file_data_path=DIR_UPLOADS.'/data';
        $file_data_path_domain=FCPATH;
      }

     // echo $file_data_path;

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

         // echo $absolute_path;echo '<br><br>';

         // print_obj($settings_general_value);

          if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain)){
            $relative_url=$file_data_path=$settings_general_value->system_assests_domain.'data'.str_replace($file_data_path, '', $absolute_path);
            $file_relative_url=$relative_url;
            
          }else{
            $relative_url=base_url().$absolute_path;
            $file_relative_url=$relative_url;
          }

          //echo $relative_url;die;

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

        // print_obj($data);die;

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

    public function onUploadFiles_old1($param,$uploader_method='uploader'){

      $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
      $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

      if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain_path)){
       // $file_data_path=$settings_general_value->system_assests_domain.'data';
        $file_data_path = '/home/thencriptechindia/'.$settings_general_value->system_assests_domain_path.'/data';//DIR_UPLOADS. '/data';
        $file_data_path_domain=$settings_general_value->system_assests_domain_path;
      }else{
        $file_data_path=DIR_UPLOADS.'/data';
        $file_data_path_domain=FCPATH;
      }

     // echo $file_data_path;

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

         // echo $absolute_path;echo '<br><br>';

         // print_obj($settings_general_value);

          if(!empty($settings_general_value) && !empty($settings_general_value->system_assests_domain)){
            $relative_url=$file_data_path=$settings_general_value->system_assests_domain.'data'.str_replace($file_data_path, '', $absolute_path);
            $file_relative_url=$relative_url;
            
          }else{
            $relative_url=base_url().$absolute_path;
            $file_relative_url=$relative_url;
          }

          //echo $relative_url;die;

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
              'media_uploaded_by'=>decode_data(session_userdata('admin_id'))
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

          $media_mime=implode('/',$files['metas'][0]['type']);

          $file_relative_path=$file_relative_url.'/'.$files['metas'][0]['name'];

          //echo $file_relative_url;die;       

          $pathToImage=$files['metas'][0]['file'];


          //if($files['metas'][0]['size']>=5000){
            if(isset($param['file_compress'])){
              if($param['file_compress']==true){
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
              }
            }
          //}

           

            
          

          //echo $pathToImage;die;
          // $imagecache = new ImageCache();
          // $cached_src_one = $imagecache->cache($pathToImage);

          // $factory = new \ImageOptimizer\OptimizerFactory();
          // $optimizer = $factory->get();
          // $optimizer->optimize($pathToImage);

          $data=array(
            'storage_parent_id'=>$file_parent_id,
            'storage_type'=>'2',
            'media_disk_path'=>$files['metas'][0]['file'],
            'media_disk_path_relative'=>$file_relative_path,
            'media_disk_name'=>$files['metas'][0]['name'],
            'media_org_name'=>$files['metas'][0]['old_name'].'.'.$files['metas'][0]['extension'],
            'media_size'=>$files['metas'][0]['size'],
            'media_size2'=>$files['metas'][0]['size2'],
            'media_mime'=>$media_mime,
            'media_uploaded_by'=>decode_data(session_userdata('admin_id'))
          );

         

          //print_obj($data);die;

          $temp_file_id=$this->sm->store_file($data);         

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


     function compress_image($source_url, $destination_url, $quality) {
        $info = getimagesize($source_url);
        if ($info['mime'] == 'image/jpeg')
            $image = imagecreatefromjpeg($source_url);
        elseif ($info['mime'] == 'image/gif')
            $image = imagecreatefromgif($source_url);
        elseif ($info['mime'] == 'image/png')
            $image = imagecreatefrompng($source_url);
        imagejpeg($image, $destination_url, $quality);
       // echo "Image uploaded successfully.";
    }


    function setCompressionQuality($imagePath, $quality) {

      $backgroundImagick = new \Imagick(realpath($imagePath));
      $imagick = new \Imagick();
      $imagick->setCompressionQuality($quality);
      $imagick->newPseudoImage(
          $backgroundImagick->getImageWidth(),
          $backgroundImagick->getImageHeight(),
          'canvas:white'
      );

      $imagick->compositeImage(
          $backgroundImagick,
          \Imagick::COMPOSITE_ATOP,
          0,
          0
      );
      
      $imagick->setFormat("jpg");    
      header("Content-Type: image/jpg");
      echo $imagick->getImageBlob();
  }
}