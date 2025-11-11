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

  		$this->output->enable_profiler(TRUE);

        $this->current_url=current_url();
        $segment_1=$this->uri->segment(1,0);

        $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
        $system_common_straucture_data_settings=$this->sm->get_settings(array('settings_key'=>'config_system_common_structure_data'));
        $settings_value=json_decode($system_general_settings->settings_value);        
        $settings_general_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):null;

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


        $site_name=$settings_value->system_title_name;

        $this->data['system_name']=$site_name;
        $this->data['system_title']=$site_title;

		    $this->theme->view_type='front';

        if(is_controller(array('Blog'))){
          $compress=false;
          $cache_lifetime=0;
        }else{
          $compress=false;
          $cache_lifetime=0;.0
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


        $this->data=array(
          'csrf'=>array(
            'name' => $this->security->get_csrf_token_name(),
            'hash' => $this->security->get_csrf_hash()
          )
        );

        $this->theme->theme('default',$this->data)->add_partial('partial_popup_modal',$this->data)->add_partial('partial_login_modal',$this->data)->add_partial('partial_claim_modal',$this->data)->add_partial('partial_register_modal',$this->data)->add_partial('partial_subscription_thank_you_modal')->add_partial('partial_header',$this->data)->add_partial('partial_footer',$this->data);

  	}

}