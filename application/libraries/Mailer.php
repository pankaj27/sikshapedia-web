<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\SMTP;
// use PHPMailer\PHPMailer\Exception;

require_once APPPATH."/third_party/vendor/autoload.php";

class Mailer{

	private $mailer='';

	// public function __construct(){
	// 	$this->mailer=new PHPMailer(true);
	// }


	public function send_email($mail_params){
		$mail = new PHPMailer(true);

		try {
		    //Server settings
		    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
		    // $mail->isSMTP();                                            //Send using SMTP
		    // $mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
		    // $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
		    // $mail->Username   = 'user@example.com';                     //SMTP username
		    // $mail->Password   = 'secret';                               //SMTP password
		    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
		    // $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
$mail->isSendmail();
		    //Recipients
		    $mail->setFrom($mail_params['from'], $mail_params['from_name']);
		    $mail->addAddress($mail_params['to'], $mail_params['to_name']);      //Add a recipient
		    // $mail->addAddress('ellen@example.com');               //Name is optional
		    // $mail->addReplyTo('info@example.com', 'Information');
		    // $mail->addCC('cc@example.com');
		    // $mail->addBCC('bcc@example.com');

		    //Attachments
		    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
		    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

		    //Content
		    $mail->isHTML($mail_params['is_html']);                                  //Set email format to HTML
		    $mail->Subject = $mail_params['subject'];
		    $mail->Body    = $mail_params['body'];

		    if($mail->send()){
		    	$return['response']='success';
		    }else{
		    	$return=array('response'=>'error','message'=>$mail->ErrorInfo);
		    }
		} catch (Exception $e) {
		    $return=array('response'=>'error','message'=>$mail->ErrorInfo);
		}

		return $return;
	}

	public function send_emailol($mail_params){

		//if(!empty($mail_params) && is_array($mail_params))

		try {
		    //Server settings
		    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
		    // $mail->isSMTP();                                            //Send using SMTP
		    // $mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
		    // $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
		    // $mail->Username   = 'user@example.com';                     //SMTP username
		    // $mail->Password   = 'secret';                               //SMTP password
		    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
		    // $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

		    //Recipients
		    $this->mailer->setFrom($mail_params['from'], $mail_params['from_name']);
		    $this->mailer->addAddress($mail_params['to'], $mail_params['to_name']);     //Add a recipient
		    //$mail->addAddress('ellen@example.com');               //Name is optional
		    //$mail->addReplyTo('info@example.com', 'Information');
		   // $mail->addCC('cc@example.com');
		    //$mail->addBCC('bcc@example.com');

		    //Attachments
		    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
		    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

		    //Content
		    $this->mailer->isHTML($mail_params['is_html']);                                  //Set email format to HTML
		    $this->mailer->Subject = $mail_params['subject'];
		    $this->mailer->Body    = $mail_params['body'];
		    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

		    if($this->mailer->send()){
		    	$return['response']='success';
		    }else{
		    	$return=array('response'=>'error','message'=>$this->mailer->ErrorInfo);
		    }
		   
		} catch (Exception $e) {
		    $return=array('response'=>'error','message'=>$this->mailer->ErrorInfo);
		}

		return $return;
	}
}