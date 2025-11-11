<?php

if(!function_exists('curl_get')){

	function curl_get($param=array()){

		if(is_array($param) && isset($param['url']) && $param['url']!=''){

			if(isset($param['port'])){
				$curl_array=array(
				  CURLOPT_PORT => $param['port'],
				  CURLOPT_URL => $param['url'],
				  CURLOPT_RETURNTRANSFER => true,
				  CURLOPT_ENCODING => "",
				  CURLOPT_MAXREDIRS => 10,
				  CURLOPT_TIMEOUT => 30,
				  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				  CURLOPT_CUSTOMREQUEST => "GET",
				  CURLOPT_HTTPHEADER => array("Cache-Control: no-cache")
				);
			}else{
				$curl_array=array(
				  CURLOPT_URL => $param['url'],
				  CURLOPT_RETURNTRANSFER => true,
				  CURLOPT_ENCODING => "",
				  CURLOPT_MAXREDIRS => 10,
				  CURLOPT_TIMEOUT => 30,
				  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				  CURLOPT_CUSTOMREQUEST => "GET",
				  CURLOPT_HTTPHEADER => array("Cache-Control: no-cache")
				);
			}

			// return $curl_array;

			$curl = curl_init();
			curl_setopt_array($curl,$curl_array);
			$response = curl_exec($curl);
			$err = curl_error($curl);
			curl_close($curl);

			if ($err) {
			  $return['errors']=$err;
			} else {
			  $return['response']=$response;
			}
		}else{
			$return['errors']='Endpoint Url is not valid';
		}

		return $return;
	}

}


if(!function_exists('curl_post')){

	function curl_post($param=array(),$is_json_encode=TRUE){

		if(is_array($param) && isset($param['url']) && $param['url']!=''){
			$curl = curl_init();

			if(isset($param['data']) && !empty($param['data'])){
				curl_setopt_array($curl, array(
				  CURLOPT_URL => $param['url'],
				  CURLOPT_RETURNTRANSFER => true,
				  CURLOPT_ENCODING => "",
				  CURLOPT_MAXREDIRS => 10,
				  CURLOPT_TIMEOUT => 30,
				  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				  CURLOPT_CUSTOMREQUEST => "POST",
				  CURLOPT_POSTFIELDS => ($is_json_encode==FALSE)?$param['data']:json_encode($param['data']),
				  CURLOPT_HTTPHEADER => $param['headers'],
				));

				$response = curl_exec($curl);
				$err = curl_error($curl);

				curl_close($curl);

				if ($err) {
				  $return['errors']=$err;
				} else {
				  $return['success']=$response;
				}
			}else{
				$return['errors']='Endpoint Data not valid';
			}	
		}else{
			$return['errors']='Endpoint Url is not valid';
		}

		return $return;
	}

}


if(!function_exists('_curl_post')){

	function _curl_post($param){
		if(!empty($param)){
			$ch = curl_init($param['url']);

			$authuser=$param['auth_user'];
			$authpass=$param['auth_pass'];

			curl_setopt($ch, CURLOPT_TIMEOUT, 30);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $param['headers']);
			curl_setopt($ch, CURLOPT_USERPWD, "$authuser:$authpass");
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $param['ssl_verify']);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $param['ssl_verify_peer']);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $param['data']);

			$response = curl_exec($ch);

			$err     = curl_errno($ch);
		    $errmsg  = curl_error($ch) ;
		    $header  = curl_getinfo($ch);

			curl_close($ch);

			if ($err) {
			  $return['errors']=array('Error'=>$err,'Error Message'=>$errmsg,'Headers'=>$header);
			} else {
			  $return['response']=$response;
			}
		}else{
			$return['errors']='Param is not valid';
		}

		return $return;
	}
}




if(!function_exists('_curl_get')){

	function _curl_get($param,$json_decode=TRUE){
		if(!empty($param)){
			$ch = curl_init($param['url']);

			$authuser=$param['auth_user'];
			$authpass=$param['auth_pass'];

			curl_setopt($ch, CURLOPT_TIMEOUT, 30);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
			if(isset($param['headers']) && !empty($param['headers'])){
				curl_setopt($ch, CURLOPT_HTTPHEADER, $param['headers']);
			}
			
			curl_setopt($ch, CURLOPT_USERPWD, "$authuser:$authpass");
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $param['ssl_verify']);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $param['ssl_verify_peer']);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
			//curl_setopt($ch, CURLOPT_POSTFIELDS, $param['data']);

			$response = curl_exec($ch);

			$err     = curl_errno($ch);
		    $errmsg  = curl_error($ch) ;
		    $header  = curl_getinfo($ch);

			curl_close($ch);

			//echo $response;die;

			// print_obj($response);die;

			if ($err) {
			  $return['errors']=array('Error'=>$err,'Error Message'=>$errmsg,'Headers'=>$header);
			} else {
			  $return['response']=$response;
			}
		}else{
			$return['errors']='Param is not valid';
		}

		//print_obj($return);die;

		return $return;
	}
}