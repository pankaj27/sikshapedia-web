<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH."third_party/vendor/autoload.php";

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;




class Social{

	public $clientID='';
	public $clientSecret='';
	public $redirectUri='';

	public function google_login($code=null){

		// create Client Request to access Google API
		$client = new Google_Client();
		$client->setClientId($this->clientID);
		$client->setClientSecret($this->clientSecret);
		$client->setRedirectUri($this->redirectUri);
		$client->addScope("email");
		//$client->addScope("phone");
		$client->addScope("profile");

		if (isset($code) && $code!=null) {
		  $token = $client->fetchAccessTokenWithAuthCode($code);

		  if(isset($token['access_token'])){
		  	$client->setAccessToken($token['access_token']);			  
			  // get profile info
			$google_oauth = new Google_Service_Oauth2($client);
			$google_account_info = $google_oauth->userinfo->get();
			return $google_account_info;
		  }else if(isset($token['error'])) {
		  	return false;		  	
		  }
			  
		}else{
			return false;
		}
	}


	public function get_google_authurl(){

		// create Client Request to access Google API
		$client = new Google_Client();
		$client->setClientId($this->clientID);
		$client->setClientSecret($this->clientSecret);
		$client->setRedirectUri($this->redirectUri);
		$client->addScope("email");
		$client->addScope("profile");

		return $client->createAuthUrl();
	}


	public function fb_login(){
		// try {
		//     return $helper->getAccessToken($this->redirectUri);
		// } catch(FacebookResponseException $e) {
		//      return $e->getMessage();
		// } catch(FacebookSDKException $e) {
		//     return $e->getMessage();
		// }
	}


	public function get_fb_authurl(){

		// $api_data=array(
		//     'app_id' => $this->clientID,
		//     'app_secret' => $this->clientSecret,
		//     'default_graph_version' => 'v3.2',
		// );

		//print_obj($api_data);die;
		// Call Facebook API
		// $fb = new Facebook($api_data);

		$fb = new Facebook([
		  'app_id'     => '{'.$this->clientID.'}',
		  'app_secret' => '{'.$this->clientSecret.'}',
		  'default_graph_version' => 'v2.3',
		]);

		

		// Get redirect login helper
		$helper = $fb->getRedirectLoginHelper();
		$fbPermissions = array('public_profile','email');

		$loginUrl = $helper->getLoginUrl($this->redirectUri, $fbPermissions);


		// Try to get access token
		try {
		    return $loginUrl;
		} catch(FacebookResponseException $e) {
		     return $e->getMessage();
		} catch(FacebookSDKException $e) {
		    return $e->getMessage();
		}
	}
}