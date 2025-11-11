<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');



// --------------------------------------------------------------------

/**
 * Returns the global CI object
 *
 * @return 	object
 */
if (!function_exists('CI'))
{
	function CI() {
	    if (!function_exists('get_instance')) return FALSE;

	    $CI =& get_instance();
	    return $CI;
	}
}

if (!function_exists('html_purify')) {
    function html_purify($dirty_html, $config = false)
    {
        if (is_array($dirty_html)) {
            foreach ($dirty_html as $key => $val) {
                $clean_html[$key] = html_purify($val, $config);
            }
        } else {
            $ci = &get_instance();

            switch ($config) {
                case 'comment':
                    $config = \HTMLPurifier_Config::createDefault();
                    $config->set('Core.Encoding', $ci->config->item('charset'));
                    $config->set('HTML.Doctype', 'XHTML 1.0 Strict');
                    $config->set('HTML.Allowed', 'p,a[href|title],abbr[title],acronym[title],b,strong,blockquote[cite],code,em,i,strike');
                    $config->set('AutoFormat.AutoParagraph', true);
                    $config->set('AutoFormat.Linkify', true);
                    $config->set('AutoFormat.RemoveEmpty', true);
                    break;

                case false:
                    $config = \HTMLPurifier_Config::createDefault();
                    $config->set('Core.Encoding', $ci->config->item('charset'));
                    $config->set('HTML.Doctype', 'XHTML 1.0 Strict');
                    break;

                default:
                    show_error('The HTMLPurifier configuration labeled "'.htmlspecialchars($config, ENT_QUOTES, $ci->config->item('charset')).'" could not be found.');
            }

            $purifier = new \HTMLPurifier($config);
            $clean_html = $purifier->purify($dirty_html);
        }

        return $clean_html;
    }
}



	

// --------------------------------------------------------------------

/**
 * Capture content via an output buffer
 *
 * @param	boolean	turn on output buffering
 * @param	string	if set to 'all', will clear end the buffer and clean it
 * @return 	string	return buffered content
 */
if (!function_exists('capture'))
{
	function capture($on = TRUE, $clean = 'all')
	{
		$str = '';
		if ($on)
		{
			ob_start();
		}
		else
		{
			$str = ob_get_contents();
			if (!empty($str))
			{
				if ($clean == 'all')
				{
					ob_end_clean();
				}
				else if ($clean)
				{
					ob_clean();
				}
			}
			return $str;
		}
	}
}

// --------------------------------------------------------------------

/**
 * Format true value
 *
 * @param	mixed	possible true value
 * @return 	string	formatted true value
 */
if (!function_exists('is_true_val'))
{
	function is_true_val($val)
	{
		$val = strtolower($val);
		return ($val == 'y' || $val == 'yes' || $val === 1  || $val == '1' || $val== 'true' || $val == 't');
	}
}

// --------------------------------------------------------------------

/**
 * Boolean check to determine string content is serialized
 *
 * @param	mixed	possible serialized string
 * @return 	boolean
 */
if (!function_exists('is_serialized_str'))
{
	function is_serialized_str($data)
	{
		if ( !is_string($data))
			return false;
		$data = trim($data);
		if ( 'N;' == $data )
			return true;
		if ( !preg_match('/^([adObis]):/', $data, $badions))
			return false;
		switch ( $badions[1] ) :
		case 'a' :
		case 'O' :
		case 's' :
			if ( preg_match("/^{$badions[1]}:[0-9]+:.*[;}]\$/s", $data))
				return true;
			break;
		case 'b' :
		case 'i' :
		case 'd' :
			if ( preg_match("/^{$badions[1]}:[0-9.E-]+;\$/", $data))
				return true;
			break;
		endswitch;
		return false;
	}
}

// --------------------------------------------------------------------

/**
 * Boolean check to determine string content is a JSON object string
 *
 * @param	mixed	possible serialized string
 * @return 	boolean
 */
if (!function_exists('is_json_str'))
{
	function is_json_str($data,$is_true=TRUE)
	{
		if (is_string($data))
		{
			$json = json_decode($data, $is_true);
			return ($json !== NULL AND $data != $json);
		}
		return NULL;
	}
}

// --------------------------------------------------------------------

/**
 * Print object in human-readible format
 * 
 * @param	mixed	The variable to dump
 * @param	boolean	Return string
 * @return 	string
 */
if (!function_exists('print_obj'))
{
	function print_obj($obj, $return = FALSE)
	{
		$str = "<pre>";
		if (is_array($obj))
		{
			// to prevent circular references
			if (is_a(current($obj), 'Data_record'))
			{
				foreach($obj as $key => $val)
				{
					$str .= '['.$key.']';
					$str .= $val;
				}
			}
			else
			{
				$str .= print_r($obj, TRUE);
			}
		}
		else
		{
			if (is_a($obj, 'Data_record'))
			{
				$str .= $obj;
			}
			else
			{
				$str .= print_r($obj, TRUE);
			}
		}
		$str .= "</pre>";
		if ($return) return $str;
		echo $str;
	}
}

// --------------------------------------------------------------------

/**
 * Logs an error message to logs file
 *
 * @param	string	Error message
 * @return 	void
 */
if (!function_exists('log_error'))
{
	function log_error($error) 
	{
		log_message('error', $error);
	}
}

// --------------------------------------------------------------------

/**
 * Returns whether the current environment is set for development
 *
 * @return 	boolean
 */
if (!function_exists('is_dev_mode'))
{
	function is_dev_mode()
	{
		return (ENVIRONMENT != 'production');
	}
}

// --------------------------------------------------------------------

/**
 * Returns whether the current environment is equal to the passed environment
 *
 * @return 	boolean
 */
if (!function_exists('is_environment'))
{
	function is_environment($environment)
	{
		return (strtolower(ENVIRONMENT) == strtolower($environment));
	}
}

if (!function_exists('json_headers'))
{
	function json_headers($value,$no_cache = TRUE)
	{
		if ($no_cache)
		{
			header('Cache-Control: no-cache, must-revalidate');
			header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		}
		header('Content-type: application/json');

		echo json_encode($value);
	}
}

if(!function_exists('char_separated')){

	function char_separated($array,$char=','){
		$char_separated = (is_array($array))?implode($char, $array):'';
		return $char_separated;
	}
}


if(!function_exists('char_separated_to_array')){

	function char_separated_to_array($string,$char=','){
		$char_separated_to_array = explode($char, $string);
		return $char_separated_to_array;
	}
}

if(!function_exists('ordinal')){
	function ordinal($number) {
	    $ends = array('th','st','nd','rd','th','th','th','th','th','th');
	    if ((($number % 100) >= 11) && (($number%100) <= 13))
	        return $number. 'th';
	    else
	        return $number. $ends[$number % 10];
	}
}
	
if(!function_exists('uniqidReal')){
	function uniqidReal($lenght = 13) {
	    // uniqid gives 13 chars, but you could adjust it to your needs.
	    if (function_exists("random_bytes")) {
	        $bytes = random_bytes(ceil($lenght / 2));
	    } elseif (function_exists("openssl_random_pseudo_bytes")) {
	        $bytes = openssl_random_pseudo_bytes(ceil($lenght / 2));
	    } else {
	        throw new Exception("no cryptographically secure random function available");
	    }
	    return substr(bin2hex($bytes), 0, $lenght);
	}
}


if(!function_exists('post_data')){
	function post_data($post_var=NULL){
		if($post_var==NULL){
			return html_purify(xss_clean(remove_invisible_characters(html_escape(CI()->input->post()))));
		}else{
			return html_purify(remove_invisible_characters(xss_clean(strip_javascript(strip_whitespace(encode_php_tags(CI()->input->post($post_var)))))));
		}
		
	}
}

if(!function_exists('get_data')){
	function get_data($get_var){
		return xss_clean(strip_javascript(strip_whitespace(encode_php_tags(CI()->input->get($post_var)))));
	}
}

if(!function_exists('clean_data')){
	function clean_data($data){
		return html_escape(xss_clean(strip_javascript(strip_whitespace(encode_php_tags($data)))));	
	}
}

if(!function_exists('clean_json_data')){
	function clean_json_data($data){
		return clean_data(remove_invisible_characters(xss_clean(strip_javascript(strip_whitespace(encode_php_tags($data))))));
	}
}



function _user_agent()
{
	if( CI()->ua->is_browser() ){
		$agent = CI()->ua->browser() . ' ' . CI()->ua->version();
	}else if( CI()->ua->is_robot() ){
		$agent = CI()->ua->robot();
	}else if( CI()->ua->is_mobile() ){
		$agent = CI()->ua->mobile();
	}else{
		$agent = 'Unidentified User Agent';
	}

	$platform = CI()->ua->platform();

	return $platform 
		? $agent . ' on ' . $platform 
		: $agent; 
}

//------------------------------------------------------------------

/*=================================================================
=            			EMAIL HELPER           	 				=
=================================================================*/

if( ! function_exists('send_system_mail')){


	function send_system_mail($mail_data=array(),$mail_type='html',$print_status_msg=FALSE){

		CI()->load->library('email');

		if($mail_data['protocol']=='smtp'){
			$config['protocol'] = 'smtp';
            $config['smtp_host'] = $mail_data['smtp_host'];
            $config['smtp_user'] = $mail_data['from'];
            $config['smtp_pass'] = $mail_data['password'];
            $config['smtp_port'] = '587';
            $config['mailtype'] = $mail_type;
            CI()->email->initialize($config);
		}else{
			if($mail_type=='html'){
				CI()->email->set_header('Content-Type', 'text/html');
			}
		}

		CI()->email->from($mail_data['from'], $mail_data['from_name']);
		CI()->email->to($mail_data['to']);

		if(isset($mail_data['cc'])){
			CI()->email->cc($mail_data['cc']);
		}

		if(isset($mail_data['bcc'])){
			CI()->email->bcc($mail_data['bcc']);
		}

		CI()->email->subject($mail_data['subject']);

		if(isset($mail_data['has_attachment']) && $mail_data['has_attachment']==FALSE){
			CI()->email->attach($mail_data['attachment']);
		}

		if($mail_type=='text'){	
			$message=$mail_data['data'];
		}else if($mail_type=='html'){
			//$message=CI()->load->view($mail_data['view'],$mail_data['data']);
			$message=CI()->theme->view($mail_data['view'],$mail_data['data'],true);
		}

		CI()->email->message($message);
		CI()->email->send(TRUE);

		if($print_status_msg==TRUE){
			$debug=CI()->email->print_debugger(array('headers'));

			print_obj($debug);
		}
	}
}



/*=================================================================
=            			ASSETS COMMON           	 				=
=================================================================*/


if( ! function_exists('assets_url')){

	function assets_url(){
		return base_url().'common/assets/';
	}
}

if( ! function_exists('cdn_url')){

	function cdn_url($file_path){
		return DIR_CDN.'assets/'.$file_path;
	}
}

if(!function_exists('delete_files')){

	function delete_files($target) {
	    if(is_dir($target)){
	        $files = glob( $target . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned

	        foreach( $files as $file ){
	            delete_files( $file );      
	        }
	        if(isset($target) && is_dir($target)){
	        	rmdir( $target );
	        }
	       
	    } elseif(is_file($target)) {
	        unlink( $target );  
	    }
	}	
}

if(!function_exists('isHomogenous')){

	function isHomogenous($arr) {
	    $firstValue = current($arr);
	    foreach ($arr as $val) {
	        if ($firstValue !== $val) {
	            return false;
	        }
	    }
	    return true;
	}


	// function isHomogenous(array $arr, $testValue = null) {
	//     // If they did not pass the 2nd func argument, then we will use an arbitrary value in the $arr.
	//     // By using func_num_args() to test for this, we can properly support testing for an array filled with nulls, if desired.
	//     // ie isHomogenous([null, null], null) === true
	//     $testValue = func_num_args() > 1 ? $testValue : current($arr);
	//     foreach ($arr as $val) {
	//         if ($testValue !== $val) {
	//             return false;
	//         }
	//     }
	//     return true;
	// }

}

function clean($string) {
   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

if(!function_exists('addtoString')){
	function addtoString($str, $item) {
	    $parts = explode(',', $str);
	    $parts[] = $item;

	    return implode(',', $parts);
	}
}


if(!function_exists('removeFromString')){
	function removeFromString($str, $item) {
	    $parts = explode(',', $str);

	    while(($i = array_search($item, $parts)) !== false) {
	        unset($parts[$i]);
	    }

	    return implode(',', $parts);
	}
}

if (!function_exists('removeDuplicate')) {
    function removeDuplicate($dep) {
        // Ensure that $dep is a string
        if (is_array($dep)) {
            $dep = implode(',', $dep);  // Convert array to a comma-separated string if needed
        }
        return implode(',', array_keys(array_flip(explode(',', $dep))));
    }
}


if(!function_exists('encode_url')){
	function encode_url($string, $key="", $url_safe=TRUE)
	{
	    if($key==null || $key=="")
	    {
	        $key="tyz_mydefaulturlencryption";
	    }

	    $CI =& get_instance();
	    
	    if (version_compare(PHP_VERSION, '5.3', '>=')){
	    	$ret = $CI->encryption->encrypt($string);
	    }else{
	    	$ret = $CI->encrypt->encode($string, $key);
	    }
	    

	    if ($url_safe)
	    {
	        $ret = strtr(
	                $ret,
	                array(
	                    '+' => '.',
	                    '=' => '-',
	                    '/' => '~'
	                )
	            );
	    }

	    return $ret;
	}
}

if(!function_exists('decode_url')){
	function decode_url($string, $key="")
		{
		    if($key==null || $key=="")
		    {
		        $key="tyz_mydefaulturlencryption";
		    }
		        $CI =& get_instance();
		    	$string = strtr(
		            $string,
		            array(
		                '.' => '+',
		                '-' => '=',
		                '~' => '/'
		            )
		        );

		        if (version_compare(PHP_VERSION, '5.3', '>=')){
			    	return $CI->encryption->decrypt($string);
			    }else{
			    	return $CI->encrypt->decode($string, $key);
			    }  
		}
}

if(!function_exists('encode_data')){
	function encode_data($string, $key="", $url_safe=TRUE){
		$cipher="AES-128-CBC";
		if($key==null || $key=="")
	    {
	        $key="tyz_mydefaulturlencryption";
	    }

	    if (version_compare(PHP_VERSION, '5.6', '>=')){
	    	$ivlen = openssl_cipher_iv_length($cipher);
			$iv = openssl_random_pseudo_bytes($ivlen);
			$ciphertext_raw = openssl_encrypt($string, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
			$hmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
			$ret = base64_encode( $iv.$hmac.$ciphertext_raw );
	    }

	    if ($url_safe)
	    {
	        $ret = strtr(
	                $ret,
	                array(
	                    '+' => '.',
	                    '=' => '-',
	                    '/' => '~'
	                )
	            );
	    }

	    return $ret;
	}
}
	
if(!function_exists('decode_data')){
	function decode_data($string, $key=""){
		$cipher="AES-128-CBC";
		if($key==null || $key=="")
	    {
	        $key="tyz_mydefaulturlencryption";
	    }

    	$string = strtr(
	            $string,
	            array(
	                '.' => '+',
	                '-' => '=',
	                '~' => '/'
	            )
	        );

	     if (version_compare(PHP_VERSION, '5.6', '>=')){
	     	$c = base64_decode($string);
			$ivlen = openssl_cipher_iv_length($cipher);
			$iv = substr($c, 0, $ivlen);
			$hmac = substr($c, $ivlen, $sha2len=32);
			$ciphertext_raw = substr($c, $ivlen+$sha2len);
			$original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
			$calcmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
			if (hash_equals((string)$hmac, $calcmac))//PHP 5.6+ timing attack safe comparison
			{
			    return $original_plaintext;
			}
	     }
	}
}

function encryptIt( $q ) {
    $cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
    $qEncoded      = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $q, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
    return( $qEncoded );
}

function decryptIt( $q ) {
    $cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
    $qDecoded      = rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), base64_decode( $q ), MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ), "\0");
    return( $qDecoded );
}



function build_short($str){

	

	$words=array('a','an','the','of','for','to','from','in','at','on','by','or');




}

function advanced_replace($searchStart, $searchEnd, $replace, $subject, &$assignValue = array(), $addValue = false, $inReplace = false, $valueKey = "") {
    $strlen = strlen( $subject );
    $open = 0;
    $ob = false;
    $ob_message = "";
    $message = "";
    for( $i = 0; $i <= $strlen; $i++ ) {
        $char = substr( $subject, $i, 1 );

        if ($char == $searchStart) {
            $open++;
            $ob = true;
        }
        if ($ob) {
            $ob_message .= $char;
        } else {
            $message .= $char;
        }
        if ($char == $searchEnd) {
            $open--;
            if ($open == 0) {
                $ob = false;
                $message .= ($replace.($addValue!== false && $inReplace?$addValue:""));
                $assignValue[$valueKey.($addValue!== false?$addValue:"")] = $ob_message;
                $ob_message = "";
                if ($addValue !== false) $addValue++;
            }
        }
    }
    return $message; 
}

if(!function_exists('get_avatar')){
    function get_avatar($str){
        $acronym="";
        $word="";
        $words = preg_split("/(\s|\-|\.)/", $str);

        if(count($words)>1){
        	foreach($words as $w) {
	            $acronym .= substr($w,0,1);
	        }
	        $word = $word . $acronym ;
        }else{	        
        	$acronym .=substr($words[0],0,3);
        	$word = $word . $acronym ;
        }

        return $word;
    }
}


function acronym($s,$no=null){
	$pattern = '~(?:(\()|(\[)|(\{))(?(1)(?>[^()]++|(?R))*\))(?(2)(?>[^][]++|(?R))*\])(?(3)(?>[^{}]++|(?R))*\})~';
	$new_string=trim(strtolower(preg_replace($pattern , '', $s)));
	$exploded=explode(' ', $new_string);
	$ignore=array('&','aboard','about','above','across','after','against','along','amid','among','anti','around','as','at','before','behind','below','beneath','beside','besides','between','beyond','but','by','concerning','considering','despite','down','during','except','excepting','excluding','following','for','from','in','inside','into','like','minus','near','of','off','on','onto','opposite','outside','over','past','per','plus','regarding','round','save','since','than','through','to','toward','towards','under','underneath','unlike','until','up','upon','versus','via','with','within','without','and','but','or','also');
	$array = array_diff($exploded, $ignore);
	$new_string=implode(' ',$array);

	if($no==null){
		$new_string2=(get_avatar(strtoupper($new_string)));
	}else{
		$new_string2=(get_avatar(strtoupper($new_string))).'-'.str_pad($no,4, 0, STR_PAD_LEFT);
	}

	

	return $new_string2;
}



function SKU_gen($string, $id = null, $l = 2){
    $results = ''; // empty string
    $vowels = array('a', 'e', 'i', 'o', 'u', 'y'); // vowels
    preg_match_all('/[A-Z][a-z]*/', ucfirst($string), $m); // Match every word that begins with a capital letter, added ucfirst() in case there is no uppercase letter
    foreach($m[0] as $substring){
        $substring = str_replace($vowels, '', strtolower($substring)); // String to lower case and remove all vowels
        $results .= preg_replace('/([a-z]{'.$l.'})(.*)/', '$1', $substring); // Extract the first N letters.
    }
    $results .= '-'. str_pad($id, 4, 0, STR_PAD_LEFT); // Add the ID
    return $results;
}




function number_format_short( $n, $precision = 1 ) {
	if ($n < 900) {
		// 0 - 900
		$n_format = number_format($n, $precision);
		$suffix = '';
	} else if ($n < 900000) {
		// 0.9k-850k
		$n_format = number_format($n / 1000, $precision);
		$suffix = 'K';
	} else if ($n < 900000000) {
		// 0.9m-850m
		$n_format = number_format($n / 1000000, $precision);
		$suffix = 'M';
	} else if ($n < 900000000000) {
		// 0.9b-850b
		$n_format = number_format($n / 1000000000, $precision);
		$suffix = 'B';
	} else {
		// 0.9t+
		$n_format = number_format($n / 1000000000000, $precision);
		$suffix = 'T';
	}
  // Remove unecessary zeroes after decimal. "1.0" -> "1"; "1.00" -> "1"
  // Intentionally does not affect partials, eg "1.50" -> "1.50"
	if ( $precision > 0 ) {
		$dotzero = '.' . str_repeat( '0', $precision );
		$n_format = str_replace( $dotzero, '', $n_format );
	}
	return $n_format . $suffix;
}

function number_format_short2( $n ) {
	if ($n > 0 && $n < 1000) {
		// 1 - 999
		$n_format = floor($n);
		$suffix = '';
	} else if ($n >= 1000 && $n < 1000000) {
		// 1k-999k
		$n_format = floor($n / 1000);
		$suffix = 'K+';
	} else if ($n >= 1000000 && $n < 1000000000) {
		// 1m-999m
		$n_format = floor($n / 1000000);
		$suffix = 'M+';
	} else if ($n >= 1000000000 && $n < 1000000000000) {
		// 1b-999b
		$n_format = floor($n / 1000000000);
		$suffix = 'B+';
	} else if ($n >= 1000000000000) {
		// 1t+
		$n_format = floor($n / 1000000000000);
		$suffix = 'T+';
	}

	return !empty($n_format . $suffix) ? $n_format . $suffix : 0;
}

function _money_format($num) {
    $explrestunits = "" ;
    if(strlen($num)>3) {
        $lastthree = substr($num, strlen($num)-3, strlen($num));
        $restunits = substr($num, 0, strlen($num)-3); // extracts the last three digits
        $restunits = (strlen($restunits)%2 == 1)?"0".$restunits:$restunits; // explodes the remaining digits in 2's formats, adds a zero in the beginning to maintain the 2's grouping.
        $expunit = str_split($restunits, 2);
        for($i=0; $i<sizeof($expunit); $i++) {
            // creates each of the 2's group and adds a comma to the end
            if($i==0) {
                $explrestunits .= (int)$expunit[$i].","; // if is first value , convert into integer
            } else {
                $explrestunits .= $expunit[$i].",";
            }
        }
        $thecash = $explrestunits.$lastthree;
    } else {
        $thecash = $num;
    }
    return $thecash; // writes the final format where $currency is the currency symbol.
}


	

function alphaID($in, $to_num = false, $pad_up = false, $pass_key = null)
{
	$out   =   '';
	$index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$base  = strlen($index);

	if ($pass_key !== null) {
		// Although this function's purpose is to just make the
		// ID short - and not so much secure,
		// with this patch by Simon Franz (http://blog.snaky.org/)
		// you can optionally supply a password to make it harder
		// to calculate the corresponding numeric ID

		for ($n = 0; $n < strlen($index); $n++) {
			$i[] = substr($index, $n, 1);
		}

		$pass_hash = hash('sha256',$pass_key);
		$pass_hash = (strlen($pass_hash) < strlen($index) ? hash('sha512', $pass_key) : $pass_hash);

		for ($n = 0; $n < strlen($index); $n++) {
			$p[] =  substr($pass_hash, $n, 1);
		}

		array_multisort($p, SORT_DESC, $i);
		$index = implode($i);
	}

	if ($to_num) {
		// Digital number  <<--  alphabet letter code
		$len = strlen($in) - 1;

		for ($t = $len; $t >= 0; $t--) {
			$bcp = bcpow($base, $len - $t);
			$out = $out + strpos($index, substr($in, $t, 1)) * $bcp;
		}

		if (is_numeric($pad_up)) {
			$pad_up--;

			if ($pad_up > 0) {
				$out -= pow($base, $pad_up);
			}
		}
	} else {
		// Digital number  -->>  alphabet letter code
		if (is_numeric($pad_up)) {
			$pad_up--;

			if ($pad_up > 0) {
				$in += pow($base, $pad_up);
			}
		}

		for ($t = ($in != 0 ? floor(log($in, $base)) : 0); $t >= 0; $t--) {
			$bcp = bcpow($base, $t);
			$a   = floor($in / $bcp) % $base;
			$out = $out . substr($index, $a, 1);
			$in  = $in - ($a * $bcp);
		}
	}

	return $out;
}



if(!function_exists('menu_active')){

	function menu_active(){

		$routes=CI()->uri->uri_string();

		if($routes=='candidates/create' || $routes=='candidates'){
			$a='if';
		}else{
			$a='else';
		}

		return $a;
	}
}


if(!function_exists('get_percentage')){

	function get_percentage($m,$v){
		return (($m*$v)/100);
	}
}

if(!function_exists('shuffle_assoc')){
	function shuffle_assoc($my_array)
	{
	    $keys = array_keys($my_array);

	    shuffle($keys);

	    foreach($keys as $key) {
	        $new[$key] = $my_array[$key];
	    }

	    $my_array = $new;

	    return $my_array;
	}
}



if(!function_exists('calculate_age')){
	function calculate_age($birthDate){
		$now = time();
		$dob = strtotime($birthDate);
		$difference = $now - $dob;
		$age = floor($difference / 31556926);
		return $age;
	}
}



function check($number){ 
    if($number % 2 == 0){ 
        return "Even";  
    } 
    else{ 
        return "Odd"; 
    } 
}

//indian number format---------------------------------------------------

function IND_money_format($number){        
    $decimal = (string)($number - floor($number));
    $money = floor($number);
    $length = strlen($money);
    $delimiter = '';
    $money = strrev($money);

    for($i=0;$i<$length;$i++){
        if(( $i==3 || ($i>3 && ($i-1)%2==0) )&& $i!=$length){
            $delimiter .=',';
        }
        $delimiter .=$money[$i];
    }

    $result = strrev($delimiter);
    $decimal = preg_replace("/0\./i", ".", $decimal);
    $decimal = substr($decimal, 0, 3);

    if( $decimal != '0'){
        $result = $result.$decimal;
    }

    return $result;
}


//no to word--------------------------------------------------------------------------------------------
function no_to_words($no)
{   
 $words = array('0'=> '' ,'1'=> 'One' ,'2'=> 'Two' ,'3' => 'Three','4' => 'Four','5' => 'Five','6' => 'Six','7' => 'Seven','8' => 'Eight','9' => 'Nine','10' => 'Ten','11' => 'Eleven','12' => 'Twelve','13' => 'Thirteen','14' => 'Fouteen','15' => 'Fifteen','16' => 'Sixteen','17' => 'Seventeen','18' => 'Eighteen','19' => 'Nineteen','20' => 'Twenty','30' => 'Thirty','40' => 'Fourty','50' => 'Fifty','60' => 'Sixty','70' => 'Seventy','80' => 'Eighty','90' => 'Ninty','100' => 'Hundred &','1000' => 'Thousand','100000' => 'Lakh','10000000' => 'Crore');
    if($no == 0)
        return ' ';
    else {
	$novalue='';
	$highno=$no;
	$remainno=0;
	$value=100;
	$value1=1000;       
            while($no>=100)    {
                if(($value <= $no) &&($no  < $value1))    {
                $novalue=$words["$value"];
                $highno = (int)($no/$value);
                $remainno = $no % $value;
                break;
                }
                $value= $value1;
                $value1 = $value * 100;
            }       
          if(array_key_exists("$highno",$words))
              return $words["$highno"]." ".$novalue." ".no_to_words($remainno);
          else {
             $unit=$highno%10;
             $ten =(int)($highno/10)*10;            
             return $words["$ten"]." ".$words["$unit"]." ".$novalue." ".no_to_words($remainno);
           }
    }
}


function convert_to_words($num) 
{ 
    // Get number of digits 
    // in given number 
    $len = strlen($num);  
  
    // Base cases  
    if ($len == 0)  
    { 
        return "Empty string\n";
    } 
    if ($len > 4)  
    { 
        return "Length more than 4 " .  
               "is not supported\n"; 
    } 
  
    /* The first string is not used,  
    it is to make array indexing simple */
    $single_digits = array("zero", "one", "two",  
                           "three", "four", "five",  
                           "six", "seven", "eight",  
                                           "nine"); 
  
    /* The first string is not used,  
    it is to make array indexing simple */
    $two_digits = array("", "ten", "eleven", "twelve",  
                        "thirteen", "fourteen", "fifteen",  
                        "sixteen", "seventeen", "eighteen",  
                                               "nineteen"); 
  
    /* The first two string are not used, 
    they are to make array indexing simple*/
    $tens_multiple = array("", "", "twenty", "thirty",  
                           "forty", "fifty", "sixty",  
                           "seventy", "eighty", "ninety"); 
  
    $tens_power = array("hundred", "thousand"); 
  
    /* Used for debugging purpose only */
    return $num.": "; 
  
    /* For single digit number */
    if ($len == 1)  
    { 
        echo $single_digits[$num[0] - '0'] . " \n"; 
        return; 
    } 
  
    /* Iterate while num 
        is not '\0' */
    $x = 0; 
    while ($x < strlen($num))  
    { 
  
        /* Code path for first 2 digits */
        if ($len >= 3) 
        { 
            if ($num[$x]-'0' != 0) 
            { 
                echo $single_digits[$num[$x] - '0'] . " "; 
                echo $tens_power[$len - 3] . " ";  
                // here len can be 3 or 4 
            } 
            --$len; 
        } 
  
        /* Code path for last 2 digits */
        else 
        { 
            /* Need to explicitly handle  
            10-19. Sum of the two digits 
            is used as index of "two_digits" 
            array of strings */
            if ($num[$x] - '0' == 1)  
            { 
                $sum = $num[$x] - '0' +  
                       $num[$x] - '0'; 
                echo $two_digits[$sum] . " \n"; 
                return; 
            } 
  
            /* Need to explicitely handle 20 */
            else if ($num[$x] - '0' == 2 &&  
                     $num[$x + 1] - '0' == 0) 
            { 
                echo "twenty\n"; 
                return; 
            } 
  
            /* Rest of the two digit  
            numbers i.e., 21 to 99 */
            else 
            { 
                $i = $num[$x] - '0'; 
                if($i > 0) 
                echo $tens_multiple[$i] . " "; 
                else
                echo ""; 
                ++$x; 
                if ($num[$x] - '0' != 0) 
                    echo $single_digits[$num[$x] -'0'] . " \n"; 
            } 
        } 
        ++$x; 
    } 
}


function getIndianCurrency(float $number)
{
    $decimal = round($number - ($no = floor($number)), 2) * 100;
    $hundred = null;
    $digits_length = strlen($no);
    $i = 0;
    $str = array();
    $words = array(0 => '', 1 => 'one', 2 => 'two',
        3 => 'three', 4 => 'four', 5 => 'five', 6 => 'six',
        7 => 'seven', 8 => 'eight', 9 => 'nine',
        10 => 'ten', 11 => 'eleven', 12 => 'twelve',
        13 => 'thirteen', 14 => 'fourteen', 15 => 'fifteen',
        16 => 'sixteen', 17 => 'seventeen', 18 => 'eighteen',
        19 => 'nineteen', 20 => 'twenty', 30 => 'thirty',
        40 => 'forty', 50 => 'fifty', 60 => 'sixty',
        70 => 'seventy', 80 => 'eighty', 90 => 'ninety');
    $digits = array('', 'hundred','thousand','lakh', 'crore');
    while( $i < $digits_length ) {
        $divider = ($i == 2) ? 10 : 100;
        $number = floor($no % $divider);
        $no = floor($no / $divider);
        $i += $divider == 10 ? 1 : 2;
        if ($number) {
            $plural = (($counter = count($str)) && $number > 9) ? 's' : null;
            $hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
            $str [] = ($number < 21) ? $words[$number].' '. $digits[$counter]. $plural.' '.$hundred:$words[floor($number / 10) * 10].' '.$words[$number % 10]. ' '.$digits[$counter].$plural.' '.$hundred;
        } else $str[] = null;
    }
    $Rupees = implode('', array_reverse($str));
    $paise = ($decimal > 0) ? "." . ($words[$decimal / 10] . " " . $words[$decimal % 10]) . ' Paise' : '';
    return ($Rupees ? ucwords($Rupees) . 'Rupees ' : '') . $paise;


}



function countChar($str, $x)  
{  
    $count = 0;  
    $n = 10; 
    for ($i = 0; $i < strlen($str); $i++)  
        if ($str[$i] == $x)  
            $count++;  
  
    // atleast k repetition are required  
    $repititions = (int)($n / strlen($str));  
    $count = $count * $repititions;  
  
    // if n is not the multiple of  
    // the string size check for the  
    // remaining repeating character.  
    for ($i = 0; $i < $n % strlen($str); $i++)  
    {  
        if ($str[$i] == $x)  
            $count++;  
    }  
  
    return $count;  
}

function countt($s, $c) 
{ 
      
    // Count variable 
    $res = 0; 
  
    for ($i = 0; $i < strlen($s); $i++) 
  
        // checking character in string 
        if ($s[$i] == $c) 
            $res++; 
  
    return $res; 
}




function get_ipgeo_data(){
	$user_ip = CI()->input->ip_address();
	$geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
	return $geo;



	// $json     = file_get_contents("http://ipinfo.io/$user_ip/geo");
	// $json     = json_decode($json, true);

	// return $json;
}


function changePass($user, $newpass, $type="SHA", $salt="", $oldpass="", $path=".htaccess")
{
    switch ($type) {
        case "DES" :
            $salt = substr($salt,0,2);  // Salt must be 2 char range 0-9A-Za-z
            $newpass = crypt($newpass,$salt);
            if ($oldpass != null) {
                $oldpass = crypt($oldpass,$salt);
            }
            break;

        case "SHA" :
            $newpass = '{SHA}'.base64_encode(sha1($newpass, TRUE));
            if ($oldpass != null) {
                $oldpass = '{SHA}'.base64_encode(sha1($oldpass, TRUE));
            }
            break;

        case "MD5" :
            $salt = substr($salt,0,8);  //Salt must be max 8 char range 0-9A-Za-z
            $newpass = crypt_apr1_md5($newpass, $salt);
            if ($oldpass != null) {
                $oldpass = crypt_apr1_md5($oldpass, $salt);
            }
            break;

        default:
            return false;
            break;
    }

    $hta_arr = explode("\n", file_get_contents($path));

    foreach ($hta_arr as $line) {
        $line = preg_replace('/\s+/','',$line); // remove spaces
        if ($line) {
            $line_arr = explode('"', $line);
            if (strcmp($line_arr[0],"AuthUserFile") == 0) {
                $path_htaccess = $line_arr[1];
            }   
        }
    }  
    $htp_arr = explode("\n", file_get_contents($path_htaccess));

    $new_file = "";
    foreach ($htp_arr as $line) {
        $line = preg_replace('/\s+/', '', $line); // remove spaces
        if ($line) {
            list($usr, $pass) = explode(":", $line, 2);
            if (strcmp($user, $usr) == 0) {
                if ($oldpass != null) {
                    if ($oldpass == $pass) {
                        $new_file .= $user.':'.$newpass."\n";
                    } else {
                        return false;
                    }
                } else {
                    $new_file .= $user.':'.$newpass."\n";
                }
            } else {
                $new_file .= $user.':'.$pass."\n";
            }
        }
    }
    $f = fopen($path_htaccess,"w") or die("couldn't open the file");
    fwrite($f, $new_file);
    fclose($f);
    return true;
}


function crypt_apr1_md5($password, $salt = null)
{
    if (!$salt) {
        $salt = substr(base_convert(bin2hex('prolay'), 16, 36), 1, 8);
    }
    $len = strlen($password);

    $text = $password . '$apr1$' . $salt;

    $bin = pack("H32", md5($password . $salt . $password));

    for ($i = $len; $i > 0; $i -= 16) {
        $text .= substr($bin, 0, min(16, $i));
    }

    for ($i = $len; $i > 0; $i >>= 1) {
        $text .= ($i & 1) ? chr(0) : $password[0];
    }

    $bin = pack("H32", md5($text));

    for ($i = 0; $i < 1000; $i++) {
        $new = ($i & 1) ? $password : $bin;

        if ($i % 3) {
            $new .= $salt;
        }

        if ($i % 7) {
            $new .= $password;
        }

        $new .= ($i & 1) ? $bin : $password;
        $bin = pack("H32", md5($new));
    }

    $tmp = '';

    for ($i = 0; $i < 5; $i++) {
        $k = $i + 6;
        $j = $i + 12;

        if ($j == 16) {
            $j = 5;
        }

        $tmp = $bin[$i] . $bin[$k] . $bin[$j] . $tmp;
    }

    $tmp = chr(0) . chr(0) . $bin[11] . $tmp;
    $tmp = strtr(
        strrev(substr(base64_encode($tmp), 2)),
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    );

    return "$" . "apr1" . "$" . $salt . "$" . $tmp;
}

function getEncodedVideoString($type, $file) {
   return 'data:video/' . $type . ';base64,' . base64_encode(file_get_contents($file));
}


function cors() {

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    echo "You have CORS!";
}
	

	//Trim Functions

	if(!function_exists('str_trim')){
		function strip($str){
			return preg_replace('!\s+!', '', $str);
		} 
	}
		

	if(!function_exists('str_trim')){
		function str_trim($str,$remove){
			return str_rtrim(str_ltrim($str,$remove),$remove);
		}
	}

	if(!function_exists('str_ltrim')){
		function str_ltrim($str,$remove){
			if(!$str || !$remove) return $str;
			while(substr($str,0,strlen($remove)) == $remove){
				$str = substr($str,strlen($remove));
			}
			return $str;
		}
	}

	if(!function_exists('str_rtrim')){
		function str_rtrim($str,$remove){
			if(!$str || !$remove) return $str;
			while(substr($str,-strlen($remove)) == $remove){
				$str = substr($str,0,-strlen($remove));
				echo $str;
			}
			return $str;
		}
	}

	//Time Functions
	if(!function_exists('mtime')){
		function mtime(){
			$t= explode(' ',microtime());
			$time = $t[0]+$t[1];
			return $time;
		}
	}


	if(!function_exists('ignore_timeout')){
		function ignore_timeout(){
			@ignore_user_abort(true);
			@ini_set("max_execution_time",48 * 60 * 60);
			@set_time_limit(48 * 60 * 60);//set_time_limit(0)  2day
			@ini_set('memory_limit', '4000M');//4G;
		}
	}

		

		
	//HTML Fucntion
	if(!function_exists('clear_html')){
		function clear_html($HTML, $br = true){
			$HTML = htmlspecialchars(trim($HTML));
			$HTML = str_replace("\t", ' ', $HTML);
			if ($br) {
				return nl2br($HTML);
			} else {
				return str_replace("\n", '', $HTML);
			} 
		}
	}

	if(!function_exists('filter_html')){
		function filter_html($html){
			$find = array(
				"/<(\/?)(script|i?frame|style|html|body|title|link|meta|\?|\%)([^>]*?)>/isU",
				"/(<[^>]*)on[a-zA-Z]+\s*=([^>]*>)/isU",
				"/javascript\s*:/isU",
			);
			$replace = array("＜\\1\\2\\3＞","\\1\\2","");
			return preg_replace($find,$replace,$html);
		}
	}


	//Array Funcntions

	if(!function_exists('in_array_not_case')){
		function in_array_not_case($needle, $haystack) {
			return in_array(strtolower($needle),array_map('strtolower',$haystack));
		}	
	}

	if(!function_exists('obj2array')){
		function obj2array($obj){
			if (is_array($obj)) {
				foreach($obj as &$value) {
					$value = obj2array($value);
				} 
				return $obj;
			} elseif (is_object($obj)) {
				$obj = get_object_vars($obj);
				return obj2array($obj);
			} else {
				return $obj;
			} 
		}
	}


	if(!function_exists('array_sort_by')){
		function array_sort_by($records, $field, $reverse=false){
			$reverse = $reverse?SORT_DESC:SORT_ASC;
			array_multisort(array_column($records,$field),$reverse,$records);
			return $records;
		}
	}


	if (!function_exists('array_column')) {
	    function array_column($array, $column_key, $index_key = null) {
	        $column_key_isNumber = (is_numeric($column_key)) ? true : false;
	        $index_key_isNumber  = (is_numeric($index_key)) ? true : false;
	        $index_key_isNull    = (is_null($index_key)) ? true : false;
	         
	        $result = array();
	        foreach((array)$array as $key=>$val){
	            if($column_key_isNumber){
	                $tmp = array_slice($val, $column_key, 1);
	                $tmp = (is_array($tmp) && !empty($tmp)) ? current($tmp) : null;
	            } else {
	                $tmp = isset($val[$column_key]) ? $val[$column_key] : null;
	            }
	            if(!$index_key_isNull){
	                if($index_key_isNumber){
	                    $key = array_slice($val, $index_key, 1);
	                    $key = (is_array($key) && !empty($key)) ? current($key) : null;
	                    $key = is_null($key) ? 0 : $key;
	                }else{
	                    $key = isset($val[$index_key]) ? $val[$index_key] : 0;
	                }
	            }
	            $result[$key] = $tmp;
	        }
	        return $result;
	    }
	}


	if (!function_exists('array_try')) {

		function array_try($array, $callback){
			if (!$array || !$callback) {
				return false;
			} 
			$args = func_get_args();
			array_shift($args);
			array_shift($args);
			if (!$args) {
				$args = array();
			} 
			foreach($array as $v) {
				$params = $args;
				array_unshift($params, $v);
				$x = call_user_func_array($callback, $params);
				if ($x) {
					return $x;
				} 
			} 
			return false;
		}
	}

	if (!function_exists('array_union')) {
		function array_union(){
			$argsCount = func_num_args();
			if ($argsCount < 2) {
				return false;
			} else if (2 === $argsCount) {
				list($arr1, $arr2) = func_get_args();

				while ((list($k, $v) = each($arr2))) {
					if (!in_array($v, $arr1)) $arr1[] = $v;
				} 
				return $arr1;
			} else { // 三个以上的数组合并
				$arg_list = func_get_args();
				$all = call_user_func_array('array_union', $arg_list);
				return array_union($arg_list[0], $all);
			} 
		}
	}


	if (!function_exists('array_get_index')) {
		function array_get_index($arr,$index){
		   foreach($arr as $k=>$v){
			   $index--;
			   if($index<0) return array($k,$v);
		   }
		}
	}
	 
	
	if (!function_exists('array_field_values')) {
		function array_field_values($arr,$field){
		   $result = array();
			foreach ($arr as $val) {
				if(is_array($val) && isset($val[$field])){
					$result[] = $val[$field];
				}		
			}
			return $result;
		}
	}

	if (!function_exists('array_remove_value')) {
		function array_remove_value($array, $value){
			$isNumericArray = true;
			foreach ($array as $key => $item) {
				if ($item === $value) {
					if (!is_int($key)) {
						$isNumericArray = false;
					}
					unset($array[$key]);
				}
			}
			if ($isNumericArray) {
				$array = array_values($array);
			}
			return $array;
		}
	}

	if (!function_exists('array_remove_value')) {
		function array_key_max($array){
			if(count($array)==0){
				return 1;
			}
			$idArr = array_keys($array);
			rsort($idArr,SORT_NUMERIC);//id从高到底
			return intval($idArr[0]);
		}
	}
		
	
	//JsONN functon


	if (!function_exists('json_comment_clear')) {
		function json_comment_clear($str){
			$result = '';
			$inComment = false;
			$commentType = '//';// /*,//
			$quoteCount  = 0;
			$str = str_replace(array('\"',"\r"),array("\\\0","\n"),$str);

			for ($i=0; $i < strlen($str); $i++) {
				$char = $str[$i];
				if($inComment){
					if($commentType == '//' && $char == "\n"){
						$result .= "\n";
						$inComment = false;
					}else if($commentType == '/*' && $char == '*' && $str[$i+1] == '/'){
						$i++;
						$inComment = false;
					}
				}else{
					if($str[$i] == '/'){
						if($quoteCount % 2 != 0){//成对匹配，则当前不在字符串内
							$result .= $char;
							continue;
						}	
						if($str[$i+1] == '*'){
							$inComment = true;
							$commentType = '/*';
							$i++;
							continue;
						}else if($str[$i+1] == '/'){
							$inComment = true;
							$commentType = '//';
							$i++;
							continue;
						}
					}else if($str[$i] == '"'){
						$quoteCount++;
					}
					$result .= $char;
				}
			}
			$result = str_replace("\\\0",'\"',$result);
			$result = str_replace("\n\n","\n",$result);
			return $result;
		}
	}

	if (!function_exists('json_space_clear')) {

		function json_space_clear($str){
			$result = '';
			$quoteCount  = 0;
			$str = str_replace(array('\"',"\r"),array("\\\0","\n"),$str);
			for ($i=0; $i < strlen($str); $i++) {
				$char = $str[$i];
				//忽略不在字符串中的空格 tab 和换行
				if( $quoteCount % 2 == 0 &&
					($char == ' ' || $char == '	' || $char == "\n") ){
					continue;
				}
				if($char == '"'){
					$quoteCount ++;
				}
				$result .= $char;
			}
			$result = str_replace("\\\0",'\"',$result);
			return $result;
		}
	}
		
	if (!function_exists('json_decode_force')) {
		function json_decode_force($str){
			$str = trim($str,'﻿');
			$str = json_comment_clear($str);
			$str = json_space_clear($str);

			//允许最后一个多余逗号(todo:字符串内)
			$str = str_replace(array(',}',',]',"\n","\t"),array('}',']','',' '),$str);
			$result = json_decode($str,true);
			if(!$result){
				//show_json($result,false);
			}
			return $result;
		}
	}

	if (!function_exists('json_decode_force')) {
		function json_encode_force($json){
			if(defined('JSON_PRETTY_PRINT')){
				$jsonStr = json_encode($json,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
			}else{
				$jsonStr = json_encode($json);
			}
			if($jsonStr === false){
				include_once(dirname(__FILE__)."/others/JSON.php");
				$parse = new Services_JSON();
				$jsonStr =  $parse->encode($json);
			}
			return $jsonStr;
		}
	}


	if (!function_exists('json_decode_force')) {
		function show_json($data,$code = true,$info=''){
			if($GLOBALS['SHOW_JSON_RETURN']){
				return;
			}
			$useTime = mtime() - $GLOBALS['config']['appStartTime'];
			$result = array('code'=>$code,'use_time'=>$useTime,'data'=>$data);
			if(defined("GLOBAL_DEBUG") && GLOBAL_DEBUG==1){
				$result['call'] = get_caller_info();
			}
			if ($info != '') {
				$result['info'] = $info;
			}
			ob_end_clean();
			if(!headers_sent()){
				header("X-Powered-By: kodExplorer.");
				header('Content-Type: application/json; charset=utf-8'); 
			}
			if(class_exists('Hook')){
				$temp = Hook::trigger("show_json",$result);
				if(is_array($temp)){
					$result = $temp;
				}
			}
			$json = json_encode_force($result);
			if(isset($_GET['callback'])){
				if(!preg_match("/^[0-9a-zA-Z_.]+$/",$_GET['callback'])){
					die("calllback error!");
				}
				echo $_GET['callback'].'('.$json.');';
			}else{
				echo $json;
			}
			if(!isset($GLOBALS['SHOW_JSON_EXIT']) || !$GLOBALS['SHOW_JSON_EXIT']){
				exit;
			}
		}
	}


	//String Ffunctions
	if (!function_exists('file_sub_str')) {
		function file_sub_str($file,$start=0,$len=0){
			$size = filesize($file);
			if($start < 0 ){
				$start = $size + $start;
				$len = $size - $start;
			}
		    $fp = fopen($file,'r');
		    fseek($fp,$start);
		    $res = fread($fp,$len);
		    fclose($fp);
		    return $res;
		}
	}

	function str_ellipses($in,$length=18){
		$out = strlen($in) > $length ? substr($in,0,$length)."..." : $in;
		return $out;
	}		
		
			
function token($length = 32) {
	// Create random token
	$string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
	$max = strlen($string) - 1;
	
	$token = '';
	
	for ($i = 0; $i < $length; $i++) {
		$token .= $string[mt_rand(0, $max)];
	}	
	
	return $token;
}


 
function generate_string($strength = 16) {
	$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $input_length = strlen($permitted_chars);
    $random_string = '';
    for($i = 0; $i < $strength; $i++) {
        $random_character = $permitted_chars[mt_rand(0, $input_length - 1)];
        $random_string .= $random_character;
    }
 
    return $random_string;
}


function compressImage($source, $destination, $quality) {

  $info = getimagesize($source);

  if ($info['mime'] == 'image/jpeg') 
    $image = imagecreatefromjpeg($source);

  elseif ($info['mime'] == 'image/gif') 
    $image = imagecreatefromgif($source);

  elseif ($info['mime'] == 'image/png') 
    $image = imagecreatefrompng($source);

  imagejpeg($image, $destination, $quality);

}


function createAvatarImage($string)
{
 
    $imageFilePath = "images/".$string . ".png";

    //base avatar image that we use to center our text string on top of it.
    $avatar = imagecreatetruecolor(60,60);
    $bg_color = imagecolorallocate($avatar, 211, 211, 211);
    imagefill($avatar,0,0,$bg_color);
    $avatar_text_color = imagecolorallocate($avatar, 0, 0, 0);
	// Load the gd font and write 
    $font = imageloadfont('gd-files/gd-font.gdf');
    imagestring($avatar, $font, 10, 10, $string, $avatar_text_color);
    imagepng($avatar, $imageFilePath);
    imagedestroy($avatar);
 
    return $imageFilePath;
}


function count_digit($number) {
  return strlen($number);
}

function divider($number_of_digits) {
    $tens="1";

  if($number_of_digits>8)
    return 10000000;

  while(($number_of_digits-1)>0)
  {
    $tens.="0";
    $number_of_digits--;
  }
  return $tens;
}

function number_to_currency($num,$show_ext=TRUE){

	$ext="";//thousand,lac, crore
	$str_arr = explode('.',$num);
	$number_of_digits = count_digit($str_arr[0]); //this is call :)

	//return $number_of_digits;


	if($number_of_digits>3)
	{
	    if($number_of_digits%2!=0)
	        $divider=divider($number_of_digits-1);
	    else
	        $divider=divider($number_of_digits);
	}
	else
	    $divider=1;

	$fraction=$num/$divider;
	$fraction=number_format($fraction,2);

	//return $fraction;

	if($show_ext==TRUE){
		if($number_of_digits==4 ||$number_of_digits==5)
		    $ext="Thousand";
		if($number_of_digits==6 ||$number_of_digits==7)
		    $ext="Lakhs";
		if($number_of_digits==8 ||$number_of_digits==9)
		    $ext="Cr";
		return $fraction." ".$ext;
	}else if($show_ext==FALSE){
		return $fraction;
	}		
}


function validate_youtube_url($yt_url){
   	$url_parsed_arr = parse_url($yt_url);
   if ($url_parsed_arr['host'] == "www.youtube.com" && $url_parsed_arr['path'] == "/watch" && substr($url_parsed_arr['query'], 0, 2) == "v=" && substr($url_parsed_arr['query'], 2) != "") {
       return true;
   } else {
       return false;
   }
}


function remove_hyper_link($string){
	$pattern = "/[a-zA-Z]*[:\/\/]*[A-Za-z0-9\-_]+\.+[A-Za-z0-9\.\/%&=\?\-_]+/i";
	$replacement = "";
	return preg_replace($pattern, $replacement, $string);
}


function force_ssl() {
    CI()->config->config['base_url'] = str_replace('http://', 'https://www.', CI()->config->config['base_url']);
    if ($_SERVER['SERVER_PORT'] != 443) redirect(CI()->uri->uri_string());
}


function gen_otp_code($limit = 6){
	$otp= random_int(10 ** ($limit - 1), (10 ** $limit) - 1);
	return $otp;
}


function ge_rand_code($str='WA',$limit=6){
	$code='WA'.date('Ymd').random_int(10 ** ($limit - 1), (10 ** $limit) - 1);
	return $code;
}

function formatXmlString($xml){
    $xml = preg_replace('/(>)(<)(\/*)/', "$1\n$2$3", $xml);
    $token      = strtok($xml, "\n");
    $result     = '';
    $pad        = 0; 
    $matches    = array();
    while ($token !== false) : 
        if (preg_match('/.+<\/\w[^>]*>$/', $token, $matches)) : 
          $indent=0;
        elseif (preg_match('/^<\/\w/', $token, $matches)) :
          $pad--;
          $indent = 0;
        elseif (preg_match('/^<\w[^>]*[^\/]>.*$/', $token, $matches)) :
          $indent=1;
        else :
          $indent = 0; 
        endif;
        $line    = str_pad($token, strlen($token)+$pad, ' ', STR_PAD_LEFT);
        $result .= $line . "\n";
        $token   = strtok("\n");
        $pad    += $indent;
    endwhile; 
    return $result;
}

function random_username($string) {
	$pattern = " ";
	$firstPart = strstr(strtolower($string), $pattern, true);
	$secondPart = substr(strstr(strtolower($string), $pattern, false), 0,3);
	$nrRand = rand(0, 100);

	$username = trim($firstPart).trim($secondPart).trim($nrRand);
	return $username;
}


function split_name($name) {
    $name = trim($name);
    $last_name = (strpos($name, ' ') === false) ? '' : preg_replace('#.*\s([\w-]*)$#', '$1', $name);
    $first_name = trim( preg_replace('#'.preg_quote($last_name,'#').'#', '', $name ) );
    return array($first_name, $last_name);
}

function split_name2($name) {
    $parts = array();

    while ( strlen( trim($name)) > 0 ) {
        $name = trim($name);
        $string = preg_replace('#.*\s([\w-]*)$#', '$1', $name);
        $parts[] = $string;
        $name = trim( preg_replace('#'.preg_quote($string,'#').'#', '', $name ) );
    }

    if (empty($parts)) {
        return false;
    }

    $parts = array_reverse($parts);
    $name = array();
    $name['first_name'] = $parts[0];
    $name['middle_name'] = (isset($parts[2])) ? $parts[1] : '';
    $name['last_name'] = (isset($parts[2])) ? $parts[2] : ( isset($parts[1]) ? $parts[1] : '');
    
    return $name;
}


function create_initiala($s){
	if(preg_match_all('/\b(\w)/',strtoupper($s),$m)) {
	    $v = implode('',$m[1]); // $v is now SOQTU
	}

	return $v;
}


function get_filesize($destination){
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

  return $file_size;
}

function formatSize($bytes){
    if ($bytes >= 1073741824){
        $bytes = number_format($bytes / 1073741824, 2) . ' GB';
    }elseif ($bytes >= 1048576){
        $bytes = number_format($bytes / 1048576, 2) . ' MB';
    }elseif ($bytes > 0){
        $bytes = number_format($bytes / 1024, 2) . ' KB';
    }else{
        $bytes = '0 bytes';
    }
    
    return $bytes;
}


function remove_html_tags($data_content, $html_tags) 
{
    $tagStr = "";
  
        foreach($html_tags as $key => $value) 
        { 
            $tagStr .= $key == count($html_tags)-1 ? $value : "{$value}|"; 
        }
  
    $pat_str= array("/(<\s*\b({$tagStr})\b[^>]*>)/i", "/(<\/\s*\b({$tagStr})\b\s*>)/i");
    $result = preg_replace($pat_str, "", $data_content);
    return $result;
}


function createShortName($fullName) {
    // Split the full name into words
    $words = explode(' ', $fullName);
    
    // Initialize an empty string to store the short name
    $shortName = '';
    
    if (count($words) <= 3) {
        // If there are 3 or fewer words, use the first letter of each word
        foreach ($words as $word) {
            $shortName .= substr($word, 0, 1);
        }
    } else {
        // If there are more than 3 words, use the first letter of the first and last names
        $shortName .= substr($words[0], 0, 1);
        $shortName .= substr($words[count($words) - 1], 0, 1);
    }
    
    // Convert the short name to uppercase (optional)
    $shortName = strtoupper($shortName);
    
    return $shortName;
}


function generateRandomName() {
    $firstNames = ['Aarav', 'Aanya', 'Advait', 'Anika', 'Arjun', 'Avni', 'Dhruv', 'Isha', 'Kabir', 'Kiara'];
    $lastNames = ['Sharma', 'Patel', 'Gupta', 'Kumar', 'Singh', 'Jain', 'Mehta', 'Verma', 'Shah', 'Mishra'];

    $firstName = $firstNames[array_rand($firstNames)];
    $lastName = $lastNames[array_rand($lastNames)];

    return "$firstName $lastName";
}

function sendSMS($mobile_no,$otp){
	$sms_data=array(
		"template_id"=>"651802b2d6fc052d5f183233",
		"short_url"=>"0",
		"recipients"=>array(
			array(
				"mobiles"=> "$mobile_no",
			    "otpno"=> "$otp"
			)
		)
	);

	$param=array(
		"url"=>"https://control.msg91.com/api/v5/flow/",
		"headers"=>array(
			"accept: application/json",
	        "content-type: application/json",
	        "authkey:197850AFrGnNLUa5a816402"
		),
		"data"=>$sms_data
	);

	$response=curl_post($param);

	return $response;
}


function sendSMS_v2($mobile_no,$otp){
	$curl = curl_init();

	$sms_data=array(
		"template_id"=>"651802b2d6fc052d5f183233",
		"short_url"=>"0",
		"recipients"=>array(
			array(
				"mobiles"=> "$mobile_no",
			    "otpno"=> "$otp"
			)
		)
	);

	//"{\n  \"template_id\": \"EntertemplateID\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"realTimeResponse\": \"1 (Optional)\", \n  \"recipients\": [\n    {\n      \"mobiles\": \"919XXXXXXXXX\",\n      \"VAR1\": \"VALUE 1\",\n      \"VAR2\": \"VALUE 2\"\n    }\n  ]\n}"

	curl_setopt_array($curl, [
	  CURLOPT_URL => "https://control.msg91.com/api/v5/flow",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_POSTFIELDS => json_encode($sms_data),
	  CURLOPT_HTTPHEADER => [
	    "accept: application/json",
	    "authkey: 197850AFrGnNLUa5a816402",
	    "content-type: application/json"
	  ],
	]);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
	  echo "cURL Error #:" . $err;
	} else {
	  echo $response;
	}
}


function load_editor_version(){
	$config_tinymce_key=CI()->sm->get_settings(array('settings_key'=>'config_tinymce_key'));
	return $config_tinymce_key->settings_value;
}

/* End of file utility_helper.php */
/* Location: ./helpers/utility_helper.php */
