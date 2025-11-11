<?php
require_once ('Mail.php');

$from = 'yourmail ID'; //change this to your email address
$to = 'sender mail'; // change to address
$subject = 'Checking mail with SMTP PHP'; // subject of mail
$body = "Hello your mail function is working fine"; //content of mail

$headers = array(
'From' => $from,
'To' => $to,
'Subject' => $subject
);

$smtp = Mail::factory('smtp', array(
'host' => 'Hostname',
'port' => '465',
'auth' => true,
'username' => 'your mailID', //your gmail account
'password' => 'mailID password' // your password
));

// Send the mail
$mail = $smtp->send($to, $headers, $body);

//check mail sent or not
if (PEAR::isError($mail)) {
echo '<p>'.$mail->getMessage().'</p>';
} else {
echo '<p>Message successfully sent!</p>';
}
?>
