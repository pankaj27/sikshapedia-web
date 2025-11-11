<?php
defined('BASEPATH') OR exit('No direct script access allowed');


$autoload['packages'] = array();


$autoload['libraries'] = array('database', 'email', 'session','calendar','theme','encryption'=>'enc','user_agent' => 'ua','uploader','PluploadHandler','tokens','passwordhash','CryptoJsAes','widget','social','form_validation');

$autoload['drivers'] = array();

$autoload['helper'] = array('url','security','cookie','file','directory','session_helper','email','xml','captcha','utility_helper','date_helper','string_helper','curl_helper','format_helper','utf8_helper','files_helper');

$autoload['config'] = array('anonymus');


$autoload['language'] = array();

$autoload['model'] = array('settings_model'=>'sm','user_model'=>'um','stream_model'=>'strm','country_model'=>'com','service_model'=>'serm','institution_model'=>'im','widget_model'=>'wm','news_model'=>'nm','scholarship_model'=>'schm','reports_model'=>'rm','coupon_model'=>'coup');