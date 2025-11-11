<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//require_once APPPATH.'libraries/Cwebp.php';
/**
 * 
 */
class Ads  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	function index(){

		//$this->cwebp->getCommand();die;


		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Ads';

			$this->theme->title($this->data['page_title'])->load('ads/vw_ads', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexAdsAdd($listing_id=null){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Ads';


			if($listing_id!=null){
				$_lid=decode_data($listing_id);

				$_listing_data=array();

				$listing_data=$this->um->get_listing_package_users(array('listing_id'=>$_lid));

				//print_obj($listing_data);die;

				if(!empty($listing_data)){

					$ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$listing_data->listing_user_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$_lid));

					$_listing_data=array(
						'listing_id'=>encode_data($listing_data->listing_id),
						'listing_name'=>$listing_data->listing_name,
						'listing_short_desc'=>$listing_data->listing_short_desc,
						'listing_link'=>$listing_data->listing_link,
						'listing_package_start_date'=>date('d-m-Y',strtotime($listing_data->listing_package_start_date)),
						'listing_package_end_date'=>date('d-m-Y',strtotime($listing_data->listing_package_end_date)),
						'listing_package_value'=>$listing_data->listing_package_value,
						'listing_package_value_paid'=>$listing_data->listing_package_value_paid,
						'listing_countries'=>$listing_data->listing_countries,
						'listing_user_is_external'=>$listing_data->listing_user_is_external,
						'listing_user_type'=>$listing_data->listing_user_type,
						'listing_is_top_menu'=>$listing_data->listing_is_top_menu,
						'listing_category'=>$listing_data->listing_category,
						'listing_category_type'=>$listing_data->listing_category_type,
						'listing_type'=>$listing_data->listing_type,
						'listing_package_type_ids_values'=>$listing_data->listing_package_type_ids_values,
						'listing_page_link'=>$listing_data->listing_page_link,
						'listing_link'=>$listing_data->listing_link,
						'listing_imgae'=>$ads_image->media_disk_path_relative,
						'listing_status'=>$listing_data->listing_status,
						'listing_track'=>$listing_data->listing_track
					);					
				}
			}

			


			$this->data['listing_data']=$_listing_data;

			$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>encode_data($value->stream_id),
						'stream_name'=>$value->stream_name
					);
				}
			}

			$this->data['ads_streams']=$_streams;


			$this->data['ads_categories']=$this->sm->get_listing_packages_category(array('package_category_status'=>'1'),FALSE);

			$ads_positions=$this->sm->get_listing_package_types(array('package_type_status'=>'1'),FALSE);

			if(!empty($ads_positions)){
				foreach ($ads_positions as $key => $value) {
					$_ads_positions[]=array(
						'pacakge_type_id'=>$value->package_type_id,
						'package_name'=>$value->package_type_name
					);
				}
			}else{
				$_ads_positions=array();
			}

			$this->data['ads_positions']=$_ads_positions;

			$countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

			if(!empty($countries)){
				foreach ($countries as $key => $value) {
					$selected=(isset($college_data) && !empty($ads_data) && ($ads_data->user_country==$value->country_id))?'selected':'';
					$_coun[]=array(
						'country_id'=>encode_data($value->country_id),
						'country_name'=>$value->country_name,
						'selected'=>$selected
					);
				}

				// $_countries=array_chunk($_coun, 4);
				$_countries=$_coun;
			}else{
				$_countries=array();
			}

			$this->data['ads_countries']=$_countries;

			// $param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no');
			// $param['order'] = array('college_id' => 'DESC');
			// //$posts['length']='50';

			// $college_list = $this->im->_get_colleges(null,$param,FALSE,FALSE);

			// if(!empty($college_list)){
			// 	foreach ($college_list as $key => $value) {
			// 		$colleges[]=array(
			// 			'college_id'=>encode_data($value->user_id),
			// 			'college_name'=>ucwords($value->college_name)
			// 		);
			// 	}
			// }else{
			// 	$colleges=array();
			// }

			// $this->data['ads_colleges']=$colleges;


			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'ads'));


			$this->data['listing_top_menues']=$this->sm->get_menues(array('menu_is_top'=>'1'),FALSE,'menu_serial','ASC');

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_tiny_file_browser_1')->add_partial('partial_tiny_file_browser_2')->add_partial('partial_tiny_file_browser_3')->load('ads/vw_ads_add', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	//Free  Image Ads
	function indexAdsFreeImageAdd($listing_id=null){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Ads';


			if($listing_id!=null){
				$_lid=decode_data($listing_id);

				$_listing_data=array();

				$listing_data=$this->um->get_listing_package_users(array('listing_id'=>$_lid));

				//print_obj($listing_data);die;

				if(!empty($listing_data)){

					//$ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$listing_data->listing_user_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$_lid));

					$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$_lid,'user_storage_type_3'=>'desktop'));

					$ads_image=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

					$user_mobile_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$_lid,'user_storage_type_3'=>'mobile'));

					$ads_mobile_image=$this->sm->get_file(array('storage_id'=>$user_mobile_file->user_file_storage_id));

					if(!empty($ads_image->media_disk_path_relative) && file_exists($ads_image->media_disk_path)){
						$ads_desktop_image=$ads_image->media_disk_path_relative;
					}else{
						$ads_desktop_image=base_url('public/data/app/app_data/no_image_ads.png');
					}

					if(!empty($ads_mobile_image->media_disk_path_relative) && file_exists($ads_mobile_image->media_disk_path)){
						$ads_mobile_image=$ads_mobile_image->media_disk_path_relative;
					}else{
						$ads_mobile_image=base_url('public/data/app/app_data/no_image_ads.png');
					}

					$_listing_data=array(
						'listing_id'=>encode_data($listing_data->listing_id),
						'listing_name'=>$listing_data->listing_name,
						'listing_short_desc'=>$listing_data->listing_short_desc,
						'listing_link'=>$listing_data->listing_link,
						'listing_page_link'=>$listing_data->listing_page_link,
						'listing_package_start_date'=>($listing_data->listing_package_start_date!=null)?date('d-m-Y',strtotime($listing_data->listing_package_start_date)):'',
						'listing_package_end_date'=>($listing_data->listing_package_end_date!=null)?date('d-m-Y',strtotime($listing_data->listing_package_end_date)):'',
						'listing_package_value'=>$listing_data->listing_package_value,
						'listing_package_value_paid'=>$listing_data->listing_package_value_paid,
						'listing_countries'=>$listing_data->listing_countries,
						'listing_imgae'=>$ads_desktop_image,
						'listing_mobile_imgae'=>$ads_mobile_image,
						'listing_type'=>$listing_data->listing_type,
						'listing_track'=>$listing_data->listing_track,
						'listing_status'=>$listing_data->listing_status
					);					
				}
			}


			$this->data['listing_data']=$_listing_data;

			$streams=$this->strm->get_stream(array('stream_status'=>'1'),FALSE,'stream_serial','ASC');

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$_streams[]=array(
						'stream_id'=>encode_data($value->stream_id),
						'stream_name'=>$value->stream_name
					);
				}
			}

			$this->data['ads_streams']=$_streams;


			$this->data['ads_categories']=$this->sm->get_listing_packages_category(array('package_category_status'=>'1'),FALSE);

			$ads_positions=$this->sm->get_listing_package_types(array('package_type_status'=>'1'),FALSE);

			if(!empty($ads_positions)){
				foreach ($ads_positions as $key => $value) {
					$_ads_positions[]=array(
						'pacakge_type_id'=>$value->package_type_id,
						'package_name'=>$value->package_type_name
					);
				}
			}else{
				$_ads_positions=array();
			}

			$this->data['ads_positions']=$_ads_positions;

			$countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

			if(!empty($countries)){
				foreach ($countries as $key => $value) {
					$selected=(isset($college_data) && !empty($ads_data) && ($ads_data->user_country==$value->country_id))?'selected':'';
					$_coun[]=array(
						'country_id'=>encode_data($value->country_id),
						'country_name'=>$value->country_name,
						'selected'=>$selected
					);
				}

				// $_countries=array_chunk($_coun, 4);
				$_countries=$_coun;
			}else{
				$_countries=array();
			}

			$this->data['ads_countries']=$_countries;

			// $param['column_search'] = array('college_name','college_email','college_phone_no','college_govt_reg_code','college_estd_year','country_name','state_name','city_name','college_alter_phone_no');
			// $param['order'] = array('college_id' => 'DESC');
			// //$posts['length']='50';

			// $college_list = $this->im->_get_colleges(null,$param,FALSE,FALSE);

			// if(!empty($college_list)){
			// 	foreach ($college_list as $key => $value) {
			// 		$colleges[]=array(
			// 			'college_id'=>encode_data($value->user_id),
			// 			'college_name'=>ucwords($value->college_name)
			// 		);
			// 	}
			// }else{
			// 	$colleges=array();
			// }

			// $this->data['ads_colleges']=$colleges;

			$get_listing_pacakge_type=$this->um->get_listing_pacakge_type(array('package_type_status'=>'1'),FALSE);

			$_get_listing_pacakge_type=array();

			if(!empty($get_listing_pacakge_type)){
				foreach ($get_listing_pacakge_type as $key => $value) {
					$_get_listing_pacakge_type[]=array(
						'package_type_id'=>$value->package_type_id,
						'package_type_name'=>$value->package_type_name,
						'package_type_status'=>$value->package_type_status,
						'selected'=>(!empty($listing_data) && ($listing_data->listing_package_type_id==$value->package_type_id))?'selected':''
					);
				}
			}

			$this->data['_get_listing_pacakge_type']=$_get_listing_pacakge_type;


			$this->data['parent_folder_data']=$this->sm->get_file(array('storage_type'=>'1','media_org_name'=>'ads'));


			$this->data['listing_top_menues']=$this->sm->get_menues(array('menu_is_top'=>'1'),FALSE,'menu_serial','ASC');

			$this->theme->title($this->data['page_title'])->add_partial('partial_tiny_file_browser')->add_partial('partial_tiny_file_browser_1')->add_partial('partial_tiny_file_browser_2')->add_partial('partial_tiny_file_browser_3')->load('ads/vw_ads_add_free_image_pacakges', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexAdsGroupAdd($listing_id=null){
		if(session_userdata('isAdminLoggedin')){
			$this->data['page_title']='Ads';

			$this->theme->title($this->data['page_title'])->load('ads/vw_adsgroups_add', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexAdsPackages(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Ads';

			$this->theme->title($this->data['page_title'])->load('ads/vw_ads_pacakges', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function indexAdsFree(){
		if(session_userdata('isAdminLoggedin')){

			$segment=$this->uri->segment(3);

			//echo $segment;die;

			if($segment=='freeimage'){
				$this->data['page_title']='Free Image Ads';
				$view='ads/vw_ads_free_image_pacakges';
			}else if($segment=='freeinnerlinks'){
				$this->data['page_title']='Free Inner Links Ads';
				$view='ads/vw_ads_free_inner_link_pacakges';
			}

			$this->theme->title($this->data['page_title'])->load($view, $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexAdsPreminum(){
		if(session_userdata('isAdminLoggedin')){

			$segment=$this->uri->segment(3);

			//echo $segment;die;

			if($segment=='premiumhtml'){
				$this->data['page_title']='Premium HTML Ads';
				$view='ads/vw_ads_premium_html_pacakges';
			}else if($segment=='freeinnerlinks'){
				$this->data['page_title']='Premium Inner Links Ads';
				$view='ads/vw_ads_premium_inner_link_pacakges';
			}

			$this->theme->title($this->data['page_title'])->load($view, $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function indexAdsPreminumAddEdit(){
		if(session_userdata('isAdminLoggedin')){

			$seg_3=$this->uri->segment(3);
			$seg_4=$this->uri->segment(4);

			//echo $segment;die;

			if($seg_3=='premiumhtml' && $seg_4=='add'){
				$this->data['page_title']='Premium HTML Ads';
				$view='ads/vw_ads_premium_html_addedit_pacakges';
			}else if($seg_3=='freeinnerlinks' && $seg_3=='add'){
				$this->data['page_title']='Premium Inner Links Ads';
				$view='ads/vw_ads_premium_inner_link_addedit_pacakges';
			}

			$this->theme->title($this->data['page_title'])->load($view, $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddAds_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$listing_code=generate_string(20);
				$user_id=decode_data(session_userdata('admin_id'));
				$api_end_point=$this->data['system_general_settings']->system_api_end_point;

				$_ads_id=post_data('_ads');
				$ads_id=decode_data($_ads_id);

				$ads_published=post_data('ads_published');
				$ads_visibility=post_data('ads_visibility');

				$ads_height_width=post_data('ads_height_width');

				$ads_package_category_type=post_data('ads_package_category_type');

				$ads_package_category=post_data('ads_package_category');
				$ads_package_type=post_data('ads_package_type');
				$ads_package_client_type=post_data('ads_package_client_type');
				$ads_package_client=post_data('ads_package_client');

				$ads_package_client_country=post_data('ads_package_client_country');
				$ads_package_client_states=post_data('ads_package_client_states');
				$ads_package_client_cities=post_data('ads_package_client_cities');

				$ads_embed_code_generate=post_data('ads_embed_code_generate');

				$exp=char_separated_to_array($ads_package_category_type,'x');

				$ads_width=$exp[0];
				$ads_height=$exp[1];

				$country=decode_data($ads_package_client_country);
				$state=decode_data($ads_package_client_states);
				$citty=decode_data($ads_package_client_cities);


				

				

				$ads_package_type_data=$this->sm->get_listing_package_types(array('package_type_id'=>$ads_package_type));

				if($ads_package_category=='1'){
					$ads_cost='0';
				}else{
					$ads_cost=post_data('ads_cost');
				}

				
				$ads_paid=post_data('ads_paid');

				$ads_country=post_data('ads_country');
				$country_id=decode_data($ads_country);

				$ads_state=$this->input->post('ads_state');

				if(!empty($ads_state)){
					foreach ($ads_state as $key => $value) {
						$_ads_state[]=decode_data($value);
					}

					$_ads_states=char_separated($_ads_state);
				}else{
					$_ads_states=NULL;
				}


				if(in_array($ads_package_client_type, array(1,2))){
					$listing_user_type='2';
				}else{
					$listing_user_type='1';
				}

				$ads_start_date=post_data('ads_start_date');
				$ads_end_date=post_data('ads_end_date');


				if($ads_package_client_type=='1'){
					$client_id=decode_data($ads_package_client);
					$college_profile_found=$this->im->get_college_profile_data(array(
						'college_user_id'=>$client_id
					));
					$listing_user_is_external='2';
				}else if($ads_package_client_type=='2'){
					$ads_college_name=post_data('ads_college_name');
					$ads_college_email=post_data('ads_college_email');
					$ads_college_phone=post_data('ads_college_phone');
					$ads_college_contact_person_name=post_data('ads_college_contact_person_name');
					$ads_college_contact_person_email=post_data('ads_college_contact_person_email');

					$college_profile_found=$this->im->get_college_profile_data(array(
						'college_country_id'=>$country,
						'college_name'=>$college_name,
						'college_state_id'=>$state,
						'college_city_id'=>$city
					));

					if(empty($college_profile_found)){
						$data_toadd=array(
							'college_country_id'=>$country,
							'college_name'=>$college_name,
							'college_state_id'=>$state,
							'college_city_id'=>$city,
							'college_currency_id'=>'4',
							'college_data_to_updated'=>'2',
							'is_verified_by_admin'=>'2',
							'college_email'=>$ads_college_email,
							'college_phone_no'=>$ads_college_phone
						);

						$user_profile_pk_id=$this->im->$this->im->add_college_data($data_toadd);

						if($user_profile_pk_id>0){
							$password	=	password_hash('Password@123', PASSWORD_BCRYPT, array('cost'=>12));
							$user_name=$ads_college_email;    
      						$user_name = substr($user_name, 0, strpos($user_name, "@"));

      						$user_name=strtoupper($user_name).'_'.generate_string(8);

							$college_user_data=array(
								'user_role'=>'4',
								'user_profile_pk_id'=>$user_profile_pk_id,
								'user_name'=>$user_name,
								'user_password'=>$password,
								'user_password_visible'=>encode_data('Password@123'),
								'user_blocked'=>'2',
								'user_email_verified'=>'1',
								'created_by'=>$this->data['userdata']->user_id,
								'created_by_type'=>$this->data['userdata']->user_role,
								'user_currency'=>'4'
							);

							$user_pk_id=$this->um->add_user_data($college_user_data,FALSE,FALSE);

							if($user_pk_id>0){
								$this->im->update_college_data(array('college_user_id'=>$user_pk_id),array('college_id'=>$user_profile_pk_id));

								$client_id=$user_pk_id;
							}else{
								$client_id='0';
							}
						}
					}else{
						$client_id=$college_profile_found->college_user_id;
					}


					$listing_user_is_external='2';
				}else if($ads_package_client_type=='5'){
					$listing_user_is_external='1';
					$ads_ext_user_name=post_data('ads_college_name');
					$ads_ext_user_email=post_data('ads_college_email');
					$ads_ext_user_phone=post_data('ads_college_phone');
					$ads_ext_user_contact_person_name=post_data('ads_college_contact_person_name');
					$ads_ext_user_contact_person_email=post_data('ads_college_contact_person_email');
					$ads_ext_user_contact_person_phone=post_data('ads_college_contact_person_phone');
					$ads_ext_user_type=post_data('ads_ext_user_type');

					$ext_user=$this->um->get_external_user(array('ext_user_email'=>$ads_ext_user_email));

					$ext_data_to_add=array(
						'ext_user_full_name'=>$ads_ext_user_name,
						'ext_user_email'=>$ads_ext_user_email,
						'ext_user_phone'=>$ads_ext_user_phone,
						'ext_user_contact_name'=>$ads_ext_user_contact_person_name,
						'ext_user_contact_email'=>$ads_ext_user_contact_person_email,
						'ext_user_contact_phone'=>$ads_ext_user_contact_person_phone,
						'ext_user_created_by'=>$user_id,
						'ext_user_type'=>$ads_ext_user_type
					);
					
					if(empty($ext_user)){
						if($ext_user->ext_user_phone == $ads_ext_user_phone){
							$client_id=$ext_user->ext_user_id;
						}else{
							$client_id=$this->um->add_external_user_data($ext_data_to_add);
						}						
					}else{
						$client_id=$ext_user->ext_user_id;
					}
				}else if($ads_package_client_type=='5'){
					$client_id='0';
				}

				if($ads_package_type_data->package_type_code=='TOP_MENU_FOOTER_MENU_WISE'){
					$ads_name=$college_profile_found->college_name;
					$ads_menu_type=post_data('ads_menu_type');
					$ads_external_link=$college_profile_found->access_url;
				}else{
					$ads_name=post_data('ads_name');
					$ads_external_link=post_data('ads_external_link');
				}

				if($ads_embed_code_generate=='1'){
					$listing_embed_code='<iframe title="'.$ads_name.'" width="'.$ads_width.'" height="'.$ads_height.'" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="'.$api_end_point.'/show_campaign/'.$listing_code.'" style="border: 0px; vertical-align: bottom;"></iframe>';
				}else{
					$listing_embed_code=NULL;
				}

				//listing_link

				//echo $client_id;die;

				$start_date=date('Y-m-d',strtotime($ads_start_date));
				$end_date=date('Y-m-d',strtotime($ads_end_date));

				$country_data=$this->com->get_country(array('country_id'=>$country_id));

				


				if(!in_array($ads_package_type_data->package_type_code, array('TOP_MENU_WISE'))){				
					$get_ads_data=$this->um->get_listing_package_users(array('listing_user_id'=>$client_id,'listing_countries'=>$country_id,'listing_user_package_id'=>$ads_package_category,'listing_package_type_id'=>$ads_package_type,'DATE(listing_package_start_date)>='=>$start_date,'DATE(listing_package_end_date)<='=>$end_date),TRUE,FALSE);
				}else{

				}

				if(empty($get_ads_data)){
					if(!isset($ads_menu_type)){
						$ads_data=array(
							'listing_code'=>$listing_code,
							'listing_name'=>$ads_name,
							'listing_user_id'=>($client_id!=null)?$client_id:'0',
							'listing_user_type'=>$listing_user_type,
							'listing_countries'=>$country_id,
							'listing_states'=>$_ads_states,
							'listing_user_package_id'=>$ads_package_category,
							'listing_package_type_id'=>$ads_package_type,
							'listing_package_start_date'=>$start_date,
							'listing_package_end_date'=>$end_date,
							'listing_package_value'=>$ads_cost,
							'listing_package_currency'=>'INR',
							'listing_package_value_paid'=>$ads_paid,
							'listing_link'=>$ads_external_link,
							'listing_type'=>$ads_visibility,
							'listing_width'=>$ads_width,
							'listing_height'=>$ads_height,
							'listing_user_is_external'=>($listing_user_is_external!=null)?$listing_user_is_external:'2',
							'listing_embed_code'=>$listing_embed_code
						);
					}else if(isset($ads_menu_type)){
						$get_menue_type=$this->sm->get_menues(array('menu_is_top'=>'1','menu_link_id'=>$ads_menu_type));

						if($get_menue_type->menu_link_type=='1'){
							$top_menu_type='course';
						}else if($get_menue_type->menu_link_type=='2'){
							$top_menu_type='stream';
						}else if($get_menue_type->menu_link_type=='3'){
							$top_menu_type='other';
						}


						$ads_data=array(
							'listing_code'=>$listing_code,
							'listing_name'=>$ads_name,
							'listing_user_id'=>($client_id!=null)?$client_id:'0',
							'listing_user_type'=>$listing_user_type,
							'listing_countries'=>$country_id,
							'listing_states'=>$_ads_states,
							'listing_user_package_id'=>$ads_package_category,
							'listing_package_type_id'=>$ads_package_type,
							'listing_is_top_menu_id'=>$ads_menu_type,
							'listing_is_top_menu'=>'1',
							'listing_is_top_menu_type'=>$top_menu_type,
							'listing_is_top_menu_type_id'=>'1',
							'listing_package_start_date'=>$start_date,
							'listing_package_end_date'=>$end_date,
							'listing_package_value'=>$ads_cost,
							'listing_package_currency'=>'INR',
							'listing_package_value_paid'=>$ads_paid,
							'listing_link'=>$ads_external_link,
							'listing_type'=>$ads_visibility,
							'listing_width'=>$ads_width,
							'listing_height'=>$ads_height,
							'listing_user_is_external'=>($listing_user_is_external!=null)?$listing_user_is_external:'2',
							'listing_embed_code'=>$listing_embed_code
						);
					}
						

					//print_obj($ads_data);die;

					$inserted=$this->um->store_listing_package_users($ads_data);

					//print_obj($inserted);die;

					if($inserted){

						if(!isset($ads_menu_type)){
							if(isset($_FILES['ads_image']) && $_FILES['ads_image']['name']!=''){

								$ads_image_data=array(
									'file_size'=>'1',
									'file_name'=>'ads_image',
									'file_types'=>'png,jpg,jpeg',
									'file_child_folder'=>'ads',
									'file_compress'=>FALSE,
									'file_uploaded_by'=>$this->data['userdata']->user_id
								);

								$file_id=$this->onUploadFiles($ads_image_data);

								//echo $file_id;die;

								if(!empty($file_id) && $file_id>0){

									if($client_id!=null){
										$this->sm->delete_user_file(array('user_file_type_id'=>$client_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
									}else{
										$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
									}

																

						            $user_ads_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>($client_id!=null)?$client_id:'0',
						            	'user_file_type'=>'5',
						            	'user_storage_type'=>'ads_image',
						            	'user_storage_type_2'=>$inserted
						            );

						            $this->sm->store_user_file($user_ads_storage_data);
						        } 
							}
						}
							

						$return['success']='Ads added successfully';
					}else{
						$return['error']='Ads not added into the system';
					}
				}else{
					$return['error']=$ads_package_type_data->packafge_type_name.' can not be added for the given date slots';
				}
					
				
				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddAds_old_2(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$listing_code=generate_string(20);
				$user_id=decode_data(session_userdata('admin_id'));
				$api_end_point=$this->data['system_general_settings']->system_api_end_point;

				$_ads_id=post_data('_ads');
				$ads_id=decode_data($_ads_id);

				$ads_published=post_data('ads_published');
				$ads_visibility=post_data('ads_visibility');
				$ads_height_width=post_data('ads_height_width');
				$ads_package_category_type=post_data('ads_package_category_type');
				$ads_package_category=post_data('ads_package_category');
				$ads_package_type=post_data('ads_package_type');
				$ads_embed_code_generate=post_data('ads_embed_code_generate');

				$exp=char_separated_to_array($ads_height_width,'x');

				//print_obj($exp);die;
				$ads_width=$exp[0];
				$ads_height=$exp[1];

				//echo $ads_height;die;

				//print_obj($_POST);die;


				if(in_array($ads_package_category_type, array('GOOGLE_ADSENSE','AMAZON_ADS'))){
					$ads_cost='0';
					$ads_paid='0';
					$country_id=NULL;
					$_ads_states=NULL;
					$client_id=NULL;
					$start_date=NULL;
					$end_date=NULL;
					$ads_external_link=NULL;
					$ads_visibility=NULL;
					$ads_custom_code=post_data('ads_custom_codes');

					echo $ads_custom_code;die;

					$listing_embed_code='<div class="adBlock"><div class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px !important;margin-top: -11px!important;background: #f5f8f905!important;">'.$ads_custom_code.'</div></div>';

				}else if(in_array($ads_package_category_type, array('CUSTOM_IMG_ADS','CUSTOM_HTML_ADS'))){
					$ads_package_client_type=post_data('ads_package_client_type');
					$ads_package_client=post_data('ads_package_client');
					$ads_package_client_country=post_data('ads_package_client_country');
					$ads_package_client_states=post_data('ads_package_client_states');
					$ads_package_client_cities=post_data('ads_package_client_cities');

					$country=decode_data($ads_package_client_country);
					$state=decode_data($ads_package_client_states);
					$citty=decode_data($ads_package_client_cities);

					if($ads_package_category=='1'){
						$ads_cost='0';
					}else{
						$ads_cost=post_data('ads_cost');
					}

					$ads_paid=post_data('ads_paid');

					$ads_country=post_data('ads_country');
					$country_id=decode_data($ads_country);

					$ads_state=$this->input->post('ads_state');

					if(!empty($ads_state)){
						foreach ($ads_state as $key => $value) {
							$_ads_state[]=decode_data($value);
						}

						$_ads_states=char_separated($_ads_state);
					}else{
						$_ads_states=NULL;
					}

					if($ads_package_client_type=='1'){
						$client_id=decode_data($ads_package_client);
						$college_profile_found=$this->im->get_college_profile_data(array(
							'college_user_id'=>$client_id
						));
						$listing_user_is_external='2';
					}else if($ads_package_client_type=='2'){
						$ads_college_name=post_data('ads_college_name');
						$ads_college_email=post_data('ads_college_email');
						$ads_college_phone=post_data('ads_college_phone');
						$ads_college_contact_person_name=post_data('ads_college_contact_person_name');
						$ads_college_contact_person_email=post_data('ads_college_contact_person_email');

						$college_profile_found=$this->im->get_college_profile_data(array(
							'college_country_id'=>$country,
							'college_name'=>$college_name,
							'college_state_id'=>$state,
							'college_city_id'=>$city
						));

						if(empty($college_profile_found)){
							$data_toadd=array(
								'college_country_id'=>$country,
								'college_name'=>$college_name,
								'college_state_id'=>$state,
								'college_city_id'=>$city,
								'college_currency_id'=>'4',
								'college_data_to_updated'=>'2',
								'is_verified_by_admin'=>'2',
								'college_email'=>$ads_college_email,
								'college_phone_no'=>$ads_college_phone
							);

							$user_profile_pk_id=$this->im->$this->im->add_college_data($data_toadd);

							if($user_profile_pk_id>0){
								$password	=	password_hash('Password@123', PASSWORD_BCRYPT, array('cost'=>12));
								$user_name=$ads_college_email;    
	      						$user_name = substr($user_name, 0, strpos($user_name, "@"));

	      						$user_name=strtoupper($user_name).'_'.generate_string(8);

								$college_user_data=array(
									'user_role'=>'4',
									'user_profile_pk_id'=>$user_profile_pk_id,
									'user_name'=>$user_name,
									'user_password'=>$password,
									'user_password_visible'=>encode_data('Password@123'),
									'user_blocked'=>'2',
									'user_email_verified'=>'1',
									'created_by'=>$this->data['userdata']->user_id,
									'created_by_type'=>$this->data['userdata']->user_role,
									'user_currency'=>'4'
								);

								$user_pk_id=$this->um->add_user_data($college_user_data,FALSE,FALSE);

								if($user_pk_id>0){
									$this->im->update_college_data(array('college_user_id'=>$user_pk_id),array('college_id'=>$user_profile_pk_id));

									$client_id=$user_pk_id;
								}else{
									$client_id='0';
								}
							}
						}else{
							$client_id=$college_profile_found->college_user_id;
						}


						$listing_user_is_external='2';
					}else if($ads_package_client_type=='5'){
						$listing_user_is_external='1';
						$ads_ext_user_name=post_data('ads_college_name');
						$ads_ext_user_email=post_data('ads_college_email');
						$ads_ext_user_phone=post_data('ads_college_phone');
						$ads_ext_user_contact_person_name=post_data('ads_college_contact_person_name');
						$ads_ext_user_contact_person_email=post_data('ads_college_contact_person_email');
						$ads_ext_user_contact_person_phone=post_data('ads_college_contact_person_phone');
						$ads_ext_user_type=post_data('ads_ext_user_type');

						$ext_user=$this->um->get_external_user(array('ext_user_email'=>$ads_ext_user_email));

						$ext_data_to_add=array(
							'ext_user_full_name'=>$ads_ext_user_name,
							'ext_user_email'=>$ads_ext_user_email,
							'ext_user_phone'=>$ads_ext_user_phone,
							'ext_user_contact_name'=>$ads_ext_user_contact_person_name,
							'ext_user_contact_email'=>$ads_ext_user_contact_person_email,
							'ext_user_contact_phone'=>$ads_ext_user_contact_person_phone,
							'ext_user_created_by'=>$user_id,
							'ext_user_type'=>$ads_ext_user_type
						);
						
						if(empty($ext_user)){
							if($ext_user->ext_user_phone == $ads_ext_user_phone){
								$client_id=$ext_user->ext_user_id;
							}else{
								$client_id=$this->um->add_external_user_data($ext_data_to_add);
							}						
						}else{
							$client_id=$ext_user->ext_user_id;
						}
					}else if($ads_package_client_type=='5'){
						$client_id='0';
					}


					if($ads_package_type_data->package_type_code=='TOP_MENU_FOOTER_MENU_WISE'){
						$ads_name=$college_profile_found->college_name;
						$ads_menu_type=post_data('ads_menu_type');
						$ads_external_link=$college_profile_found->access_url;
					}else{
						$ads_name=post_data('ads_name');
						$ads_external_link=post_data('ads_external_link');
					}

					if($ads_embed_code_generate=='1'){
						$listing_embed_code='<iframe title="'.$ads_name.'" width="'.$ads_width.'" height="'.$ads_height.'" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="'.$api_end_point.'/show_campaign/'.$listing_code.'" style="border: 0px; vertical-align: bottom;"></iframe>';
					}else{
						$listing_embed_code=NULL;
					}

					$start_date=date('Y-m-d',strtotime($ads_start_date));
					$end_date=date('Y-m-d',strtotime($ads_end_date));
					$country_data=$this->com->get_country(array('country_id'=>$country_id));

					if(!in_array($ads_package_type_data->package_type_code, array('TOP_MENU_WISE'))){				
						$get_ads_data=$this->um->get_listing_package_users(array('listing_user_id'=>$client_id,'listing_countries'=>$country_id,'listing_user_package_id'=>$ads_package_category,'listing_package_type_id'=>$ads_package_type,'DATE(listing_package_start_date)>='=>$start_date,'DATE(listing_package_end_date)<='=>$end_date),TRUE,FALSE);
					}else{

					}

				}else if(in_array($ads_package_category_type, array('CUSTOM_INNER_LINK_ADS'))){
					$ads_package_client_type=post_data('ads_package_client_type');
					$ads_package_client=post_data('ads_package_client');
					$ads_package_client_country=post_data('ads_package_client_country');
					$ads_package_client_states=post_data('ads_package_client_states');
					$ads_package_client_cities=post_data('ads_package_client_cities');

					$country=decode_data($ads_package_client_country);
					$state=decode_data($ads_package_client_states);
					$citty=decode_data($ads_package_client_cities);

					if($ads_package_category=='1'){
						$ads_cost='0';
					}else{
						$ads_cost=post_data('ads_cost');
					}

					$ads_paid=post_data('ads_paid');

					$ads_country=post_data('ads_country');
					$country_id=decode_data($ads_country);

					$client_id=decode_data($ads_package_client);
					$college_profile_found=$this->im->get_college_profile_data(array('college_user_id'=>$client_id));
					$listing_user_is_external='2';
					$listing_user_type='2';
					$ads_menu_type=post_data('ads_menu_type');

					$ads_name=$college_profile_found->college_name;

					$slug_data=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_type_id'=>$client_id));

					$ads_external_link=(!empty($slug_data))?$slug_data->url_value:'';
					$ads_height='0';
					$ads_width='0';
				}


				//echo $ads_custom_code;die;


				if(!isset($ads_menu_type)){
					$ads_data=array(
						'listing_code'=>$listing_code,
						'listing_category'=>$ads_package_category_type,
						'listing_name'=>$ads_name,
						'listing_user_id'=>($client_id!=null)?$client_id:'0',
						'listing_user_type'=>$listing_user_type,
						'listing_countries'=>$country_id,
						'listing_states'=>$_ads_states,
						'listing_user_package_id'=>$ads_package_category,
						'listing_package_type_id'=>$ads_package_type,
						'listing_package_start_date'=>$start_date,
						'listing_package_end_date'=>$end_date,
						'listing_package_value'=>$ads_cost,
						'listing_package_currency'=>'INR',
						'listing_package_value_paid'=>$ads_paid,
						'listing_link'=>$ads_external_link,
						'listing_type'=>$ads_package_category,
						'listing_width'=>$ads_width,
						'listing_height'=>$ads_height,
						'listing_user_is_external'=>($listing_user_is_external!=null)?$listing_user_is_external:'2',
						'listing_embed_code'=>'',
						'listing_is_top_menu'=>'1',
						'listing_is_top_menu_id'=>$ads_menu_type,
						'listing_is_top_menu_type_id'=>'1',
						'listing_status'=>$ads_published
					);
				}else if(isset($ads_menu_type)){
					$get_menue_type=$this->sm->get_menues(array('menu_is_top'=>'1','menu_link_id'=>$ads_menu_type));

					if($get_menue_type->menu_link_type=='1'){
						$top_menu_type='course';
					}else if($get_menue_type->menu_link_type=='2'){
						$top_menu_type='stream';
					}else if($get_menue_type->menu_link_type=='3'){
						$top_menu_type='other';
					}


					$ads_data=array(
						'listing_code'=>$listing_code,
						'listing_category'=>$ads_package_category_type,
						'listing_name'=>$ads_name,
						'listing_user_id'=>($client_id!=null)?$client_id:'0',
						'listing_user_type'=>$listing_user_type,
						'listing_countries'=>$country_id,
						'listing_states'=>$_ads_states,
						'listing_user_package_id'=>$ads_package_category,
						'listing_package_type_id'=>$ads_package_type,
						'listing_is_top_menu_id'=>$ads_menu_type,
						'listing_is_top_menu'=>'1',
						'listing_is_top_menu_type'=>$top_menu_type,
						'listing_is_top_menu_type_id'=>$ads_menu_type,
						'listing_package_start_date'=>$start_date,
						'listing_package_end_date'=>$end_date,
						'listing_package_value'=>$ads_cost,
						'listing_package_currency'=>'INR',
						'listing_package_value_paid'=>$ads_paid,
						'listing_link'=>$ads_external_link,
						'listing_type'=>$ads_package_category,
						'listing_width'=>$ads_width,
						'listing_height'=>$ads_height,
						'listing_user_is_external'=>($listing_user_is_external!=null)?$listing_user_is_external:'2',
						'listing_embed_code'=>$listing_embed_code,
						'listing_status'=>$ads_published
					);
				}
					

				//print_obj($ads_data);die;

				$inserted=$this->um->store_listing_package_users($ads_data);

				//print_obj($inserted);die;

				if($inserted){

					if(!isset($ads_menu_type)){

						if(in_array($ads_package_category_type, array('CUSTOM_IMG_ADS','CUSTOM_HTML_ADS'))){
							if(isset($_FILES['ads_image']) && $_FILES['ads_image']['name']!=''){

								$ads_image_data=array(
									'file_size'=>'1',
									'file_name'=>'ads_image',
									'file_types'=>'png,jpg,jpeg',
									'file_child_folder'=>'ads',
									'file_compress'=>FALSE,
									'file_uploaded_by'=>$this->data['userdata']->user_id
								);

								$file_id=$this->onUploadFiles($ads_image_data);

								//echo $file_id;die;

								if(!empty($file_id) && $file_id>0){

									if($client_id!=null){
										$this->sm->delete_user_file(array('user_file_type_id'=>$client_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
									}else{
										$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
									}

																

						            $user_ads_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>($client_id!=null)?$client_id:'0',
						            	'user_file_type'=>'5',
						            	'user_storage_type'=>'ads_image',
						            	'user_storage_type_2'=>$inserted
						            );

						            $this->sm->store_user_file($user_ads_storage_data);
						        } 
							}
						}
							
					}
						

					$return['success']='Ads added successfully';
				}else{
					$return['error']='Ads not added into the system';
				}


				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);
					
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$listing_code=generate_string(20);
				$user_id=decode_data(session_userdata('admin_id'));

				$a_p_c=post_data('ads_package_category');

				$a_cat=post_data('ads_category');
				$a_cat_t=post_data('ads_category_type');

				$a_n=post_data('ads_name');
				$a_s_n=post_data('ads_short_name');
				$a_s_d=post_data('ads_short_desc');
				$a_c=post_data('ads_cost');
				$a_p_c_t=post_data('ads_package_client_type');
				$a_e_l=post_data('ads_external_link');
				$a_p=post_data('ads_published');

				$a_l_grp=post_data('ads_listing_grouped');

				$a_embd_code=$this->input->post('ads_embed_code');

				$ads_data=array(
					'listing_code'=>$listing_code,
					'listing_name'=>$a_n,
					'listing_user_id'=>'0',
					'listing_is_grouped'=>$a_l_grp,
					'listing_user_type'=>'4',
					'listing_countries'=>'99',
					'listing_category'=>$a_cat,
					'listing_category_type'=>$a_cat_t,
					'listing_package_value'=>$a_c,
					'listing_package_currency'=>'INR',
					'listing_package_value_paid'=>$a_c,
					'listing_link'=>$a_e_l,
					'listing_type'=>$a_p_c,
					'listing_embed_code'=>$a_embd_code,
					'listing_status'=>$a_p
				);

				$inserted=$this->um->store_listing_package_users($ads_data);

				if($inserted){
					$return['success']='Ads added successfully';
				}else{
					$return['error']='There was an error occurred';
				}


				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}

	}

	public function onAddImageAds_v1(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$listing_code=generate_string(20);
				$user_id=decode_data(session_userdata('admin_id'));

				$ads_id=post_data('ads_id');

				$ads_name=post_data('ads_name');
				$ads_short_desc=post_data('ads_short_desc');
				$ads_type=post_data('ads_type');
				$a_p_l=post_data('ads_page_link');
				$a_c_l=post_data('ads_custom_link');
				$a_p_c=post_data('ads_package_category');
				$a_c_t=post_data('ads_category_type');
				$a_p=post_data('ads_published');
				$a_l_grp=post_data('ads_listing_grouped');

				$a_s_d=post_data('ads_start_date');

				$a_e_d=post_data('ads_end_date');

				$a_t_s=post_data('ads_track_status');

				$a_d_y=post_data('ads_page_type');

				$a_embd_code='<iframe title="'.$ads_name.'" width="1230" height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="'.base_url('show_campaign/'.$listing_code).'" style="border: 0px; vertical-align: bottom;"></iframe>';

				$get_listing_pacakge_type=$this->um->get_listing_pacakge_type(array('package_type_id'=>$a_d_y));

				if($a_d_y=='COLLEGE_PAGE_AT_TOP'){
					$ads_page_links=$this->input->post('ads_page_links');

					print_obj($ads_page_links);die;
					if(!empty($ads_page_links)){

						foreach ($ads_page_links as $key => $value) {
							$ads_data=array(
								'listing_name'=>$ads_name,
								'listing_short_desc'=>$ads_short_desc,
								'listing_code'=>$listing_code,
								'listing_name'=>$ads_name,
								'listing_user_id'=>'0',
								'listing_package_type_id'=>$a_d_y,
								'listing_is_grouped'=>$a_l_grp,
								'listing_user_type'=>'4',
								'listing_is_top_menu'=>'2',
								'listing_width'=>'1230',
								'listing_height'=>'90',
								'listing_countries'=>'99',
								'listing_package_type_ids_values'=>$get_listing_pacakge_type->package_type_code,
								'listing_category'=>'CUSTOM_IMG_ADS',
								'listing_category_type'=>$a_c_t,
								'listing_package_value'=>$a_c,
								'listing_package_currency'=>'INR',
								'listing_package_value_paid'=>'3',
								'listing_link'=>$a_c_l,
								'listing_page_link'=>$value,
								'listing_type'=>$a_p_c,
								'listing_embed_code'=>$a_embd_code,
								'listing_track'=>$a_t_s,
								'listing_package_start_date'=>($a_s_d!=null)?date('Y-m-d',strtotime($a_s_d)):null,
								'listing_package_end_date'=>($a_e_d!=null)?date('Y-m-d',strtotime($a_e_d)):null,
								'listing_status'=>$a_p
							);
						}

					}else{
						$return['error']='Select colleges';
					}
				}else{
					
					echo 'hi';die;
					$ads_data=array(
						'listing_name'=>$ads_name,
						'listing_short_desc'=>$ads_short_desc,
						'listing_code'=>$listing_code,
						'listing_name'=>$ads_name,
						'listing_user_id'=>'0',
						'listing_package_type_id'=>$a_d_y,
						'listing_is_grouped'=>$a_l_grp,
						'listing_user_type'=>'4',
						'listing_is_top_menu'=>'2',
						'listing_width'=>'1230',
						'listing_height'=>'90',
						'listing_countries'=>'99',
						'listing_package_type_ids_values'=>$get_listing_pacakge_type->package_type_code,
						'listing_category'=>'CUSTOM_IMG_ADS',
						'listing_category_type'=>$a_c_t,
						'listing_package_value'=>$a_c,
						'listing_package_currency'=>'INR',
						'listing_package_value_paid'=>'3',
						'listing_link'=>$a_c_l,
						'listing_page_link'=>$a_p_l,
						'listing_type'=>$a_p_c,
						'listing_embed_code'=>$a_embd_code,
						'listing_track'=>$a_t_s,
						'listing_package_start_date'=>($a_s_d!=null)?date('Y-m-d',strtotime($a_s_d)):null,
						'listing_package_end_date'=>($a_e_d!=null)?date('Y-m-d',strtotime($a_e_d)):null,
						'listing_status'=>$a_p
					);

					if(!empty($ads_id)){
						$ad_id=decode_data($ads_id);
						$inserted=$ad_id;
						$this->um->update_listing_package_users($ads_data,array('listing_id'=>$ad_id));
					}else{
						$inserted=$this->um->store_listing_package_users($ads_data);
					}
					

					if($inserted){
						if(isset($_FILES['ads_image']) && $_FILES['ads_image']['name']!=''){

							$log_file_custom_logo_title=url_slug($ads_name);
							$ext = pathinfo($_FILES['ads_image']['name'][0], PATHINFO_EXTENSION);

							$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));


		            		$img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

		            		if(!empty($user_file)){
		            			@unlink($img->media_disk_path);
		            			$this->sm->delete_file(array('storage_id'=>$img->storage_id));
		            		}

							$ads_image_data=array(
								'file_size'=>'2',
								'file_name'=>'ads_image',
								'file_types'=>'png,jpg,jpeg,webp',
								'file_child_folder'=>'ads',
								'file_custom_title'=>$log_file_custom_logo_title,
								'file_compress'=>($ext==='webp')?false:true,
								'file_compress_protocol'=>'webp',
								'file_uploaded_by'=>$this->data['userdata']->user_id
							);

							$file_id=$this->onUploadFiles($ads_image_data);

							//echo $file_id;die;

							if(!empty($file_id) && $file_id>0){

								// if($client_id!=null){
								// 	$this->sm->delete_user_file(array('user_file_type_id'=>$client_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
								// }else{
								// 	$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
								// }	

								$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));												

					            $user_ads_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>'0',
					            	'user_file_type'=>'17',
					            	'user_storage_type'=>'ads_image',
					            	'user_storage_type_2'=>$inserted,
					            	'user_storage_type_3'=>'desktop'
					            );

					            $this->sm->store_user_file($user_ads_storage_data);
					        } 
						}

						if(isset($_FILES['ads_mobile_image']) && $_FILES['ads_mobile_image']['name']!=''){

							$log_file_custom_logo_title=url_slug($ads_name).'-mobile';
							$ext = pathinfo($_FILES['ads_mobile_image']['name'][0], PATHINFO_EXTENSION);

							$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'mobile'));


		            		$img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

		            		if(!empty($user_file)){
		            			@unlink($img->media_disk_path);
		            			$this->sm->delete_file(array('storage_id'=>$img->storage_id));
		            		}

							$ads_image_data=array(
								'file_size'=>'2',
								'file_name'=>'ads_mobile_image',
								'file_types'=>'png,jpg,jpeg,webp',
								'file_child_folder'=>'ads',
								'file_custom_title'=>$log_file_custom_logo_title,
								'file_compress'=>($ext==='webp')?false:true,
								'file_compress_protocol'=>'webp',
								'file_uploaded_by'=>$this->data['userdata']->user_id
							);

							$file_id=$this->onUploadFiles($ads_image_data);

							//echo $file_id;die;

							if(!empty($file_id) && $file_id>0){

								// if($client_id!=null){
								// 	$this->sm->delete_user_file(array('user_file_type_id'=>$client_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
								// }else{
								// 	$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted));
								// }	

								$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'mobile'));												

					            $user_ads_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>'0',
					            	'user_file_type'=>'17',
					            	'user_storage_type'=>'ads_image',
					            	'user_storage_type_2'=>$inserted,
					            	'user_storage_type_3'=>'mobile'
					            );

					            $this->sm->store_user_file($user_ads_storage_data);
					        } 
						}

						$return['success']=(!empty($ads_id))?'Ads updated successfully':'Ads added successfully';
					}else{
						$return['error']='There was an error occurred';
					}
				}

					

				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onAddImageAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$listing_code=generate_string(20);
				$user_id=decode_data(session_userdata('admin_id'));

				$ads_id=post_data('ads_id');

				$ads_name=post_data('ads_name');
				$ads_short_desc=post_data('ads_short_desc');
				$ads_type=post_data('ads_type');
				$a_p_l=post_data('ads_page_link');
				$a_c_l=post_data('ads_custom_link');
				$a_p_c=post_data('ads_package_category');
				$a_c_t=post_data('ads_category_type');
				$a_p=post_data('ads_published');
				$a_l_grp=post_data('ads_listing_grouped');

				$a_s_d=post_data('ads_start_date');

				$a_e_d=post_data('ads_end_date');

				$a_t_s=post_data('ads_track_status');

				$a_d_y=post_data('ads_page_type');

				$listing_data=[];

				if($a_d_y=='COLLEGE_PAGE_AT_TOP'){
					$ads_page_links=$this->input->post('ads_page_links');
					$listing_page_link='';

					//print_obj($ads_page_links);die;
					if(!empty($ads_page_links)){

						//print_obj($ads_page_links);

						$a_embd_code='<iframe title="'.$ads_name.'" width="1230" height="90" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" src="'.base_url('show_campaign/'.$listing_code).'" style="border: 0px; vertical-align: bottom;"></iframe>';

						foreach ($ads_page_links as $key => $value) {
							$values[]=$value;														
						}

						$listing_page_link=char_separated($values);

						$ads_data=array(
							'listing_name'=>$ads_name,
							'listing_short_desc'=>$ads_short_desc,
							'listing_code'=>$listing_code,
							'listing_name'=>$ads_name,
							'listing_user_id'=>'0',
							'listing_package_type_id'=>$a_d_y,
							'listing_is_grouped'=>$a_l_grp,
							'listing_user_type'=>'4',
							'listing_is_top_menu'=>'2',
							'listing_width'=>'1230',
							'listing_height'=>'90',
							'listing_countries'=>'99',
							'listing_package_type_ids_values'=>$a_d_y,
							'listing_category'=>'CUSTOM_IMG_ADS',
							'listing_category_type'=>$a_c_t,
							'listing_package_value'=>$a_c,
							'listing_package_currency'=>'INR',
							'listing_package_value_paid'=>'3',
							'listing_link'=>$a_c_l,
							'listing_page_link'=>$listing_page_link,
							'listing_type'=>$a_p_c,
							'listing_embed_code'=>$a_embd_code,
							'listing_track'=>$a_t_s,
							'listing_package_start_date'=>($a_s_d!=null)?date('Y-m-d',strtotime($a_s_d)):null,
							'listing_package_end_date'=>($a_e_d!=null)?date('Y-m-d',strtotime($a_e_d)):null,
							'listing_status'=>$a_p
						);

						if(!empty($ads_id)){
							$ad_id=decode_data($ads_id);
							$inserted=$ad_id;
							$listing_data=$this->um->get_listing_package_users(array('listing_id'=>$ad_id));
							$this->um->update_listing_package_users($ads_data,array('listing_id'=>$ad_id));
						}else{
							$inserted=$this->um->store_listing_package_users($ads_data);
						}

						if($inserted){
						
							if(isset($_FILES['ads_image']) && $_FILES['ads_image']['name']!=''){

								$log_file_custom_logo_title=url_slug($ads_name);
								$ext = pathinfo($_FILES['ads_image']['name'][0], PATHINFO_EXTENSION);

								$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));


			            		$img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

			            		if(!empty($user_file)){
			            			@unlink($img->media_disk_path);
			            			$this->sm->delete_file(array('storage_id'=>$img->storage_id));
			            		}

								$ads_image_data=array(
									'file_size'=>'2',
									'file_name'=>'ads_image',
									'file_types'=>'png,jpg,jpeg,webp',
									'file_child_folder'=>'ads',
									'file_custom_title'=>$log_file_custom_logo_title,
									'file_compress'=>($ext==='webp')?false:true,
									'file_compress_protocol'=>'webp',
									'file_uploaded_by'=>$this->data['userdata']->user_id
								);

								$file_id=$this->onUploadFiles($ads_image_data);

								//echo $file_id;die;

								if(!empty($file_id) && $file_id>0){

									$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));												

						            $user_ads_storage_data=array(
						            	'user_file_storage_id'=>$file_id,
						            	'user_file_type_id'=>'0',
						            	'user_file_type'=>'17',
						            	'user_storage_type'=>'ads_image',
						            	'user_storage_type_2'=>$inserted,
						            	'user_storage_type_3'=>'desktop'
						            );

						            $this->sm->store_user_file($user_ads_storage_data);
						        }
							}

							$return['success']=(!empty($ads_id))?'Ads updated successfully':'Ads added successfully';
						}else{
							$return['error']=(!empty($ads_id))?'Ads not updated':'Ads not added';
						}

					}else{
						$return['error']='Select colleges';
					}
				}else{
					//$get_listing_pacakge_type=$this->um->get_listing_pacakge_type(array('package_type_id'=>$a_d_y));

					$current_url_slug=$this->sm->__get_slug_urls('url_id,url_value',array('url_id'=>$a_p_l));

					$ads_data=array(
						'listing_name'=>$ads_name,
						'listing_short_desc'=>$ads_short_desc,
						'listing_code'=>$listing_code,
						'listing_name'=>$ads_name,
						'listing_user_id'=>'0',
						'listing_package_type_id'=>$a_d_y,
						'listing_is_grouped'=>$a_l_grp,
						'listing_user_type'=>'4',
						'listing_is_top_menu'=>'2',
						'listing_width'=>'1230',
						'listing_height'=>'90',
						'listing_countries'=>'99',
						'listing_package_type_ids_values'=>$a_d_y,
						'listing_category'=>'CUSTOM_IMG_ADS',
						'listing_category_type'=>$a_c_t,
						'listing_package_value'=>$a_c,
						'listing_package_currency'=>'INR',
						'listing_package_value_paid'=>'3',
						'listing_link'=>$a_c_l,
						'listing_page_link'=>$current_url_slug->url_value,
						'listing_type'=>$a_p_c,
						'listing_embed_code'=>$a_embd_code,
						'listing_track'=>$a_t_s,
						'listing_package_start_date'=>($a_s_d!=null)?date('Y-m-d',strtotime($a_s_d)):null,
						'listing_package_end_date'=>($a_e_d!=null)?date('Y-m-d',strtotime($a_e_d)):null,
						'listing_status'=>$a_p
					);

					if(!empty($ads_id)){
						$ad_id=decode_data($ads_id);
						$inserted=$ad_id;
						$listing_data=$this->um->get_listing_package_users(array('listing_id'=>$ad_id));
						$this->um->update_listing_package_users($ads_data,array('listing_id'=>$ad_id));
					}else{
						$inserted=$this->um->store_listing_package_users($ads_data);
					}

					if($inserted){
						
						if(isset($_FILES['ads_image']) && $_FILES['ads_image']['name']!=''){

							$log_file_custom_logo_title=url_slug($ads_name);
							$ext = pathinfo($_FILES['ads_image']['name'][0], PATHINFO_EXTENSION);

							$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));


		            		$img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));

		            		if(!empty($user_file)){
		            			@unlink($img->media_disk_path);
		            			$this->sm->delete_file(array('storage_id'=>$img->storage_id));
		            		}

							$ads_image_data=array(
								'file_size'=>'2',
								'file_name'=>'ads_image',
								'file_types'=>'png,jpg,jpeg,webp',
								'file_child_folder'=>'ads',
								'file_custom_title'=>$log_file_custom_logo_title,
								'file_compress'=>($ext==='webp')?false:true,
								'file_compress_protocol'=>'webp',
								'file_uploaded_by'=>$this->data['userdata']->user_id
							);

							$file_id=$this->onUploadFiles($ads_image_data);

							//echo $file_id;die;

							if(!empty($file_id) && $file_id>0){

								$this->sm->delete_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$inserted,'user_storage_type_3'=>'desktop'));												

					            $user_ads_storage_data=array(
					            	'user_file_storage_id'=>$file_id,
					            	'user_file_type_id'=>'0',
					            	'user_file_type'=>'17',
					            	'user_storage_type'=>'ads_image',
					            	'user_storage_type_2'=>$inserted,
					            	'user_storage_type_3'=>'desktop'
					            );

					            $this->sm->store_user_file($user_ads_storage_data);
					        }
						}

						$return['success']=(!empty($ads_id))?'Ads updated successfully':'Ads added successfully';
					}else{
						$return['error']=(!empty($ads_id))?'Ads not updated':'Ads not added';
					}
				}

					

				json_headers($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onDeleteAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_ads=post_data('_ads');			

				$ads_id=decode_data($_ads);

				$ads_id=decode_data($_ads);

				$get_ads_data=$this->um->get_listing_package_users(array('listing_id'=>$ads_id),TRUE,FALSE);

				if(!empty($get_ads_data)){

					$deleted=$this->um->delete_listing_package_users(array('listing_id'=>$ads_id));

					if($deleted){
						$ads_file=$this->sm->get_user_file(array('user_file_type_id'=>$get_ads_data->listing_user_id,'user_storage_type_2'=>$ads_id,'user_storage_type'=>'ads_image'));
						if(!empty($ads_file)){
							if(is_file($ads_file->media_disk_path)){
								@unlink($ads_file->media_disk_path);
							}

							$this->sm->delete_user_file(array('user_file_type_id'=>$get_ads_data->listing_user_id,'user_storage_type_2'=>$ads_id,'user_storage_type'=>'ads_image'));

							$this->sm->delete_file(array('storage_id'=>$get_ads_data->user_file_storage_id));
						}

						$return['success']='Listing data deleted successfully';
					}else{
						$return['error']='Listing data not deleted';
					}

				}else{
					$return['error']='Listing data not found';
				}


				header('Content-Type: application/json; charset=utf-8');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchAdsPackeages(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name','listing_code');
				$param['order'] = array('listing_id' => 'DESC');
				$posts=$this->input->post();

				if(isset($posts['listing_category_type']) && $posts['listing_category_type']=='TYPE_2'){
					$param['listing_category_type']=$posts['listing_category_type'];
				}

				$list = $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',FALSE,FALSE);

				//print_obj($list);die;

				$action='';

				foreach ($list as $listing){
					$no++;

					$row = array();

					if(isset($posts['listing_category_type']) && $posts['listing_category_type']=='TYPE_2'){
						$row[]	=	$listing->listing_embed_code;
					}else{
						if($listing->listing_status=='1'){
							$status='<span class="btn btn-sm btn-success">Active</span>';
						}else{
							$status='<span class="btn btn-sm btn-success">Deactive</span>';
						}

						$action='<div class="btn-group btn-group-xs">
						<a href="'.$this->data['admin_base_url'].'ads/add/'.encode_data($listing->listing_id).'" class="btn btn-sm btn-primary">View</a>
						<button type="button" class="btn btn-sm btn-dark btn_del_ads" data-aid="'.encode_data($listing->listing_id).'">Delete</button>
						</div>';
						$row[]	=	$no;
						$row[]	=	$listing->listing_code;
						$row[]	=	$listing->listing_category;
						$row[]	=	$listing->listing_category_type;
						$row[]	=	$status;
						$row[]	=	$action;
					}

						

					$data[] = $row;

				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"recordsFiltered" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"data" => $data,
				);

				//print_obj($output);die;
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchMetaGroupAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name','listing_code');
				$param['order'] = array('listing_id' => 'DESC');
				$posts=$this->input->post();

				if(isset($posts['listing_category_type']) && $posts['listing_category_type']=='TYPE_2'){
					$param['listing_category_type']=$posts['listing_category_type'];
				}

				$list = $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',FALSE,FALSE);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchAds_old(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name');
				$param['order'] = array('listing_id' => 'DESC');
				$posts=$this->input->post();

				$list = $this->um->_get_listing_ads_package_users($posts,$param,FALSE,FALSE);


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $listing){
					$no++;

					$row = array();

					$country_data=$this->com->get_country(array('country_id'=>$listing->listing_countries));
					$currency_data=$this->com->get_currency(array('currency_code'=>$listing->listing_package_currency));

					if($listing->listing_user_type=='1'){
						$client_type='University';
					}else if($listing->listing_user_type=='2'){
						$client_type='College';
						$client_data=$this->im->get_college_profile_data(array('college_user_id'=>$listing->listing_user_id));
						$client_name=$client_data->college_name;
					}


					if($listing->listing_is_top_menu=='1'){

						$ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$listing->listing_user_id,'user_storage_type'=>'user_logo'));
						$ads_image_data='<a href="'.$listing->listing_link.'" target="_balnk"><img src="'.$ads_image->media_disk_path_relative.'"><a>';

					}else{
						$ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$listing->listing_user_id,'user_storage_type'=>'ads_image','user_storage_type_2'=>$listing->listing_id));
						$ads_image_data='<a href="'.$listing->listing_link.'" target="_balnk"><img src="'.$ads_image->media_disk_path_relative.'" style="width:400px;height:50px;border-radius:0;"><a>';
					}

					

					$start_date=date('d-m-Y',strtotime($listing->listing_package_start_date));
					$end_date=date('d-m-Y',strtotime($listing->listing_package_end_date));

					if($listing->listing_states!=null){
						$state_data=$this->com->get_group_concat_country_states('state_name','state_id',$listing->listing_states);
						$data_to_display='<br><strong>Country Visibility:</strong>'.$country_data->country_name.'<br><strong>States Visibility:</strong>'.$state_data->concated_value;
					}else{
						if($listing->listing_countries!=NULL){
							$data_to_display='<br><strong>Country Visibility:</strong>'.$country_data->country_name;
						}else{
							$data_to_display='<br><strong>Country Visibility:</strong>Global';
						}
						
					}

					$Client_data	=	'<br><strong>'.$client_type.':</strong>'.$client_name.$data_to_display.'<br><strong>Start Date:</strong>'.$start_date.'<br><strong>End Date:</strong>'.$end_date;

					$payment_data='<br><strong>Listing Value Type:</strong>'.$listing->package_category_name.'<br><strong>Listing Value:</strong>'.$currency_data->currency_symbol_left.$listing->listing_package_value;

					
					$row[]	=	$no;
					//$row[]	=	'<strong>Ads Category:</strong>'.$listing->package_type_name.'<br><strong>Ads Name:</strong>'.$listing->listing_name.$Client_data.$payment_data;
					$row[]	=	$ads_image_data;

					
					
					// $row[]	=	'<strong>'.$client_type.':</strong>'.$client_name.$data_to_display.'<br><strong>Start Date:</strong>'.$start_date.'<br><strong>End Date:</strong>'.$end_date;

					// $row[]	=	date('d-m-Y',strtotime($listing->listing_package_start_date));
					// $row[]	=	date('d-m-Y',strtotime($listing->listing_package_end_date));
	
					// $action='<div class="btn-group btn-group-sm">
					// 	<a href="'.$this->data['admin_base_url'].'/ads/add/'.encode_data($listing->listing_id).'" class="btn btn-xs btn-primary"><i class="fa fa-pen fa-xs"></i></a>
					// 	<button class="btn btn-xs btn-dark btn_del_ads" data-aid="'.encode_data($listing->listing_id).'"><i class="fa fa-trash fa-xs"></i></button>
					// 	</div>';

					$action='<div class="btn-group btn-group-xs">
						<a href="'.$this->data['admin_base_url'].'ads/add/'.encode_data($listing->listing_id).'" class="btn btn-xs btn-primary"><i class="fa fa-pen fa-xs" ></i></a>
						<button type="button" class="btn btn-sm btn-dark btn_del_ads" data-aid="'.encode_data($listing->listing_id).'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';

					$row[]	=	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_listing_ads_package_users($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_listing_ads_package_users($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchAdsToImport(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name');
				//$param['listing_category']='CUSTOM_HTML_ADS';
				$param['listing_status']='1';
				$param['order'] = array('listing_id' => 'DESC');
				$posts=$this->input->post();			

				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				$list = $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',FALSE,FALSE);

				//print_obj($list);die;

				foreach ($list as $listing){
					$no++;

					$row = array();

					$style="";

					$row[]	=	$no;
					$row[]	=	'<b>Code:'.$listing->listing_code.'</b><br><div class="col-md-12 alert alert-primary div_block" data-aid="'.encode_data($listing->listing_id).'">'.$listing->listing_embed_code.'</div>';

					//$row[]	=	$action;	

					$data[] = $row;
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"recordsFiltered" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);
			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchAdsToInsert(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name');
				$param['listing_category']='CUSTOM_HTML_ADS';
				$param['order'] = array('listing_id' => 'DESC');
				//$posts=$this->input->post();			

				//$data = array();
				//$no = isset($posts['start'])?$posts['start']:0;

				$ads=array();

				$list = $this->um->_get_listing_ads_package_users(null,$param,'LEFT',FALSE,FALSE);

				if(!empty($list)){
					foreach ($list as $key => $value) {
						$ads[]=array('listing_id'=>$value->listing_id,'listing_name'=>$value->listing_name);
					}
				}

				//print_obj($ads);die;

				echo json_encode($ads);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchInnerLinksAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name');
				$param['order'] = array('listing_id' => 'DESC');
				$param['listing_category']='CUSTOM_INNER_LINK_ADS';
				$posts=$this->input->post();
				$param['listing_type']=$posts['listing_type'];
				//$param['listing_user_type']=$posts['listing_user_type'];

				$list = $this->um->_get_listing_ads_package_users($posts,$param,FALSE,FALSE);

				//print_obj($list);die;


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $listing){
					$no++;

					$row = array();
					
					$row[]	=	$no;
					$college_profile_found=$this->im->get_college_profile_data(array('college_user_id'=>$listing->listing_user_id));
                    $college_city=$this->com->get_city(array('city_id'=>$college_profile_found->college_city_id));
                    $college_state=$this->com->get_state(array('state_id'=>$college_profile_found->college_state_id));
					$college_address=ucwords($college_city->city_name).','.ucwords($college_state->state_name);

					$college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$listing->listing_user_id,'user_storage_type'=>'user_logo'));

                    if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
                        $college_logo=$college_logo->media_disk_path_relative;
                    }else{
                        $college_logo=base_url().'uploads/app/default/no.jpg';
                    }

                    if($listing->package_type_code=='TOP_MENU_FOOTER_MENU_WISE'){
                    	$ads_data='<div class="navFooter">
	                  <div class="row form-row">
	                        <div class="col-sm-4">
	                          <div class="media navMedia">
	                            <img src="'.$college_logo.'" class="mr-3" loading="lazy" alt="'.$listing->listing_name.'">
	                            <div class="media-body">
	                              <h5><a href="'.$college_profile_found->access_url.'">'.$listing->listing_name.'</a></h5>
	                              <p style="font-size: 12px;margin: 0;color: #4d586c;">'.$college_address.'</p>
	                            </div>
	                          </div>
	                        </div>
	                  </div>
	                </div>';
                    }

						


					$row[] 	=	$ads_data;

					$action='<div class="btn-group btn-group-xs">
						<a href="'.$this->data['admin_base_url'].'ads/add/'.encode_data($listing->listing_id).'" class="btn btn-xs btn-primary"><i class="fa fa-pen fa-xs" ></i></a>
						<button type="button" class="btn btn-xs btn-dark btn_del_ads" data-aid="'.encode_data($listing->listing_id).'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';

					if($listing->listing_status=='1'){
						$status='<span class="btn btn-xs btn-success">Active</span>';
					}else{
						$status='<span class="btn btn-xs btn-dark">Inactive</span>';
					}

					$row[]	=	$listing->package_type_name;

					$row[]	=	$status;

					$row[]	=	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_listing_ads_package_users($posts,$param,TRUE),
					"recordsFiltered" => $this->um->_get_listing_ads_package_users($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchFreeImageAds(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$param['column_order'] = array(
					null,
					'listing_name'
				);

				$param['column_search'] = array('listing_name');
				$param['order'] = array('listing_id' => 'DESC');
				$param['listing_category']='CUSTOM_IMG_ADS';
				$posts=$this->input->post();
				$param['listing_type']='1';
				//$param['listing_user_type']=$posts['listing_user_type'];

				$list = $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',FALSE,FALSE);

				//print_obj($list);die;


				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $listing){
					$no++;

					$row = array();
					
					$row[]	=	$no;

					$user_file=$this->sm->_get_user_file(array('user_storage_type'=>'ads_image','user_storage_type_2'=>$listing->listing_id));

					if($user_file->user_storage_type_3=='desktop'){
						$desktop_version='Available';
					}else{
						$desktop_version='No Available';
					}

					if($user_file->user_storage_type_3=='mobile'){
						$mobile_version='Available';
					}else{
						$mobile_version='No Available';
					}

					$img=$this->sm->get_file(array('storage_id'=>$user_file->user_file_storage_id));


                    $ads_data='<img src="'.$img->media_disk_path_relative.'" class="mr-3" loading="lazy" alt="'.$listing->listing_name.'" style="width:90%;height:auto;border-radius:0px !important;"><br><label class="control-label">'.$listing->listing_name.'</label><br><a href="'.$listing->listing_page_link.'" target="_blank">View Ads</a><br>Desktop Version:'.$desktop_version.'<br>Mobile Version:'.$mobile_version;					


					$row[] 	=	$ads_data;

					$action='<div class="btn-group btn-group-xs">
						<a href="'.$this->data['admin_base_url'].'/ads/add/'.encode_data($listing->listing_id).'" class="btn btn-xs btn-primary"><i class="fa fa-pen fa-xs" ></i></a>
						<button type="button" class="btn btn-xs btn-dark btn_del_free_image_ads" data-aid="'.encode_data($listing->listing_id).'"><i class="fa fa-trash fa-xs"></i></button>
						</div>';

					if($listing->listing_status=='1'){
						$status='<span class="btn btn-xs btn-success">Active</span>';
					}else{
						$status='<span class="btn btn-xs btn-dark">Inactive</span>';
					}

					$row[]	=	$listing->package_type_name;

					$row[]	=	$status;

					$row[]	=	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"recordsFiltered" => $this->um->_get_listing_ads_package_users($posts,$param,'LEFT',TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}



	//Search Pages
	public function onGetSearchPages(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ads_page_type=post_data('ads_page_type');
				$pages=[];

				if(in_array($ads_page_type,['COLLEGE_SEARCH_PAGE_AT_TOP','COLLEGE_SEARCH_PAGE_IN_BETWEEN_RESULTS'])){

					$pages=$this->sm->__get_slug_urls('url_id,url_type,url_glob_type,url_value,url_meta_heading',array('url_type'=>'college_static_url','url_glob_type'=>'colleges_search'),FALSE);
				}

				$return['pages']=$pages;

				json_headers($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onGetCollgesPages(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$search_term=post_data('search_term');
				$pages=[];

				$pages=$this->im->get_college_pages_by_search($search_term);

				$return['pages']=$pages;

				json_headers($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

}