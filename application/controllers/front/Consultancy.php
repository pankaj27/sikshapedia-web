<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Consultancy extends BaseFrontController
{
	
	public function index()
	{
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "consultantcy"

		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='consultancy')){

			
			if(is_string($segment_2) && $segment_2=='consultancy'){
				
				$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

				if(!empty($country_data)){
					$states=$this->com->get_states(array('state_country_id'=>$country_data->country_id));

					foreach ($states as $key => $value) {
						$_states[]=array(
							'state_id'=>encode_data($value->state_id),
							'state_name'=>$value->state_name
						);
					}

					$this->data['states']=$_states;

					$this->theme->title($page_title)->load('webpage/consultancies/vw_consultancy', $this->data);
				}else{
					redirect(base_url());
				}
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}


	public function onRegisterConsultacny(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			$ctext=post_data('ctext');

			$security_token = $this->data['security_token'];
			//print_obj($security_token);die;

			$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

			//print_obj($decrypted);die;

			$register_course=clean_data($decrypted['register_course']);
			$registration_name=clean_data($decrypted['registration_name']);
			$registration_contact_person_name=clean_data($decrypted['registration_contact_person_name']);
			$registration_email=clean_data($decrypted['registration_email']);
			$registration_phone_no=clean_data($decrypted['registration_phone_no']);
			$registration_contact_person_phone_no=clean_data($decrypted['registration_contact_person_phone_no']);
			$registration_state=clean_data($decrypted['registration_state']);
			$registration_city=clean_data($decrypted['registration_city']);
			$registration_pincode=clean_data($decrypted['registration_pincode']);			

			$registration_address=clean_data($decrypted['registration_address']);

			if(isset($decrypted['registration_otp'])){
				$registration_otp=clean_data($decrypted['registration_otp']);

				//echo $registration_phone_no;die;

				$user_by_phone=$this->um->get_user_data(array('consultant_phone'=>$registration_phone_no),null,'6',FALSE);

				//print_obj($user_by_phone);die;

				if(!empty($user_by_phone) && $user_by_phone->user_otp==$registration_otp){
					$data_to_update=array(
						'user_email_verified'=>'0',
						'user_phone_no_verified'=>'1'
					);

					$updated=$this->um->update_user_data($data_to_update,array('user_id'=>$user_by_phone->user_id));

					if($updated){
						$return['success']='Account verified.You will be notified shortly.';
					}else{
						$return['error']='Account not verified';
					}
				}else{
					$return['error']='User not found in the system.';
				}
			}else{
				$get_duplicate_consultant=$this->um->get_user_consultant_duplicate(NULL,array('consultant_email'=>$registration_email,'consultant_phone'=>$registration_phone_no,'consultant_contact_person_phone'=>$registration_contact_person_phone_no));

				//print_obj($get_duplicate_user);die;

				if($get_duplicate_consultant[0]->counted=='0'){
					$get_duplicate_user=$this->um->get_user_duplicate(NULL,array('user_name'=>$registration_email));

					if($get_duplicate_user[0]->counted=='0'){
						$password	=	password_hash('Password@123', PASSWORD_BCRYPT, array('cost'=>12));

						$limit = 6;
						$otp= random_int(10 ** ($limit - 1), (10 ** $limit) - 1);

						$data=array(
							'user_name'=>$registration_email,
							'user_password'=>$password,
							'user_role'=>'9',
							'user_blocked'=>'1',
							'user_email_verified'=>'0',
							'user_otp'=>$otp,
							'user_phone_no_verified'=>'2',
							'user_sent_from'=>'normal'
						);

						$inserted=$this->um->add_user_data($data);

						if($inserted){
							$datato_insert=array(
								'consultant_user_id'=>$inserted,
								'consultant_name'=>$registration_name,
								'consultant_country_id'=>'99',
								'consultant_state_id'=>decode_data($registration_state),
								'consultant_city_id'=>decode_data($registration_city),
								'consultant_pincode'=>$registration_pincode,
								'consultant_address'=>$registration_address,
								'consultant_course_intersted'=>decode_data($register_course),
								'consultant_phone'=>$registration_phone_no,
								'consultant_email'=>$registration_email,
								'consultant_contact_person_phone'=>$registration_contact_person_phone_no,
								'consultant_contact_person'=>$registration_contact_person_name,
								'created_by'=>$inserted
							);

							$added=$this->um->add_user_consultant_data($datato_insert);

							if($added){

								$curl = curl_init();

			                    curl_setopt_array($curl, array(
			                      CURLOPT_URL => "https://api.msg91.com/api/v5/otp?authkey=197850AFrGnNLUa5a816402&template_id=5f741be17b17cc67a74ff47c&mobile=$registration_phone_no&invisible=1&otp=$otp",
			                      CURLOPT_RETURNTRANSFER => true,
			                      CURLOPT_ENCODING => "",
			                      CURLOPT_MAXREDIRS => 10,
			                      CURLOPT_TIMEOUT => 30,
			                      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			                      CURLOPT_CUSTOMREQUEST => "GET",
			                      CURLOPT_SSL_VERIFYHOST => 0,
			                      CURLOPT_SSL_VERIFYPEER => 0,
			                      CURLOPT_HTTPHEADER => array(
			                        "content-type: application/json"
			                      ),
			                    ));
			                    
			                    $response = curl_exec($curl);
			                    $err = curl_error($curl);
			                    
			                    curl_close($curl);
								$return['success']='You have registered successfully.An verification mail & OTP sent to your mail address and phone no.';

								// $return['phno']=
							}else{
								$return['error']='Registration failed for this moment.Please try again later.';
							}	

						}else{
							$return['error']='Registration failed for this moment.Please try again later.';
						}
					}else{
						$return['error']='Email/Phone No. is already taken.';
					}	

				}else{
					$return['error']='Email/Phone No. is already taken.';
				}
			}

			header('Content-Type: application/json');

			echo json_encode($return);

		}else{
			redirect(base_url());
		}
	}
}