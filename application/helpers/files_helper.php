<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');


if (!function_exists('rrmdir')){
	// Function to remove folders and files 
	function rrmdir($dir) {
	    if (is_dir($dir)) {
	        $files = scandir($dir);
	        foreach ($files as $file)
	            if ($file != "." && $file != "..") rrmdir("$dir/$file");
	        rmdir($dir);
	    }
	    else if (file_exists($dir)) unlink($dir);
	}
}

	
if (!function_exists('rcopy')){
	// Function to Copy folders and files       
	function rcopy($src, $dst) {
	    if (file_exists ( $dst ))
	        rrmdir ( $dst );
	    if (is_dir ( $src )) {
	        mkdir ( $dst );
	        $files = scandir ( $src );
	        foreach ( $files as $file )
	            if ($file != "." && $file != "..")
	                rcopy ( "$src/$file", "$dst/$file" );
	    } else if (file_exists ( $src ))
	        copy ( $src, $dst );
	}
}


if (!function_exists('rcopy')){
	function recurse_copy($src,$dst) { 
	    $dir = opendir($src); 
	    @mkdir($dst); 
	    while(false !== ( $file = readdir($dir)) ) { 
	        if (( $file != '.' ) && ( $file != '..' )) { 
	            if ( is_dir($src . '/' . $file) ) { 
	                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
	            } 
	            else { 
	                copy($src . '/' . $file,$dst . '/' . $file); 
	            } 
	        } 
	    } 
	    closedir($dir); 
	}
}


/**
 * Encrypt the passed file and saves the result in a new file with ".enc" as suffix.
 * 
 * @param string $source Path to file that should be encrypted
 * @param string $key    The key used for the encryption
 * @param string $dest   File name where the encryped file should be written to.
 * @return string|false  Returns the file name that has been created or FALSE if an error occured
 */

if (!function_exists('encryptFile')){
	function encryptFile($source, $key, $dest)
	{
	    $key = substr(sha1($key, true), 0, 16);
	    $iv = openssl_random_pseudo_bytes(16);

	    $error = false;
	    if ($fpOut = fopen($dest, 'w')) {
	        // Put the initialzation vector to the beginning of the file
	        fwrite($fpOut, $iv);
	        if ($fpIn = fopen($source, 'rb')) {
	            while (!feof($fpIn)) {
	                $plaintext = fread($fpIn, 16 * FILE_ENCRYPTION_BLOCKS);
	                $ciphertext = openssl_encrypt($plaintext, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);
	                // Use the first 16 bytes of the ciphertext as the next initialization vector
	                $iv = substr($ciphertext, 0, 16);
	                fwrite($fpOut, $ciphertext);
	            }
	            fclose($fpIn);
	        } else {
	            $error = true;
	        }
	        fclose($fpOut);
	    } else {
	        $error = true;
	    }

	    return $error ? false : $dest;
	}
}


/**
 * Dencrypt the passed file and saves the result in a new file, removing the
 * last 4 characters from file name.
 * 
 * @param string $source Path to file that should be decrypted
 * @param string $key    The key used for the decryption (must be the same as for encryption)
 * @param string $dest   File name where the decryped file should be written to.
 * @return string|false  Returns the file name that has been created or FALSE if an error occured
 */

if (!function_exists('decryptFile')){
	function decryptFile($source, $key, $dest)
	{
	    $key = substr(sha1($key, true), 0, 16);

	    $error = false;
	    if ($fpOut = fopen($dest, 'w')) {
	        if ($fpIn = fopen($source, 'rb')) {
	            // Get the initialzation vector from the beginning of the file
	            $iv = fread($fpIn, 16);
	            while (!feof($fpIn)) {
	                $ciphertext = fread($fpIn, 16 * (FILE_ENCRYPTION_BLOCKS + 1)); // we have to read one block more for decrypting than for encrypting
	                $plaintext = openssl_decrypt($ciphertext, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);
	                // Use the first 16 bytes of the ciphertext as the next initialization vector
	                $iv = substr($ciphertext, 0, 16);
	                fwrite($fpOut, $plaintext);
	            }
	            fclose($fpIn);
	        } else {
	            $error = true;
	        }
	        fclose($fpOut);
	    } else {
	        $error = true;
	    }

	    return $error ? false : $dest;
	}
}

function is_dir_empty($dir) {
  if (!is_readable($dir)) return null; 
  return (count(scandir($dir)) == 2);
}
	
function filemtime_remote($uri)
{
    $uri = parse_url($uri);
    $handle = @fsockopen($uri['host'],80);
    if(!$handle)
        return 0;

    fputs($handle,"GET $uri[path] HTTP/1.1\r\nHost: $uri[host]\r\n\r\n");
    $result = 0;
    while(!feof($handle))
    {
        $line = fgets($handle,1024);
        if(!trim($line))
            break;

        $col = strpos($line,':');
        if($col !== false)
        {
            $header = trim(substr($line,0,$col));
            $value = trim(substr($line,$col+1));
            if(strtolower($header) == 'last-modified')
            {
                $result = strtotime($value);
                break;
            }
        }
    }
    fclose($handle);
    return $result;
}