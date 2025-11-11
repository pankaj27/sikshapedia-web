<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Country  extends BaseAdminController
{

	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Countries';

			$this->theme->title($this->data['page_title'])->load('settings/vw_countries', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	function indexStates(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='States';

			$_country=$this->uri->segment(5);
			$country_id=decode_data($_country);

			$this->data['country_data']=$this->com->get_country(array('country_id'=>$country_id));

			$this->theme->title($this->data['page_title'])->load('settings/vw_country_states', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexCities(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Cities';

			$_country=$this->uri->segment(5);
			$country_id=decode_data($_country);

			$_state=$this->uri->segment(6);
			$state_id=decode_data($_state);

			// $states=$this->com->get_states(array('state_country_id'=>$country_id));

			// if(!empty($states)){
			// 	foreach ($states as $key => $value) {
			// 		$_states[]=array(
			// 			'state_id'=>encode_data($value->state_id),
			// 			'state_name'=>$value->state_name,
			// 			'selected'=>($state_id==$value->state_id)?'selected':''
			// 		);
			// 	}
			// }


			$state=$this->com->get_state(array('state_country_id'=>$country_id,'state_id'=>$state_id));

			if(!empty($state)){				
				$_states=array(
					'state_id'=>encode_data($state->state_id),
					'state_name'=>$state->state_name,
					'selected'=>($state_id==$state->state_id)?'selected':''
				);				
			}

			$this->data['country_data']=$this->com->get_country(array('country_id'=>$country_id));
			$this->data['country_states']=$_states;
			$this->data['state_id']=$_state;
			$this->data['country_id']=$_country;

			$this->theme->title($this->data['page_title'])->load('settings/vw_country_cities', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	function indexDistricts(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Districts';

			$_country=$this->uri->segment(5,0);
			$country_id=decode_data($_country);

			// $_state=$this->uri->segment(6,0);

			if($_state!='0'){
				$state_id=decode_data($_state);
			}else{

			} 

			$states=$this->com->get_states(array('state_country_id'=>$country_id));

			if(!empty($states)){
				foreach ($states as $key => $value) {
					$_states[]=array(
						'state_id'=>encode_data($value->state_id),
						'state_name'=>$value->state_name,
						'selected'=>(isset($state_id) && ($state_id==$value->state_id))?'selected':''
					);
				}
			}

			$this->data['country_data']=$this->com->get_country(array('country_id'=>$country_id));
			$this->data['country_states']=$_states;
			$this->data['state_id']=$_state;
			$this->data['country_id']=$_country;

			$this->theme->title($this->data['page_title'])->load('settings/vw_country_districts', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onSearchCountriesList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'country_name',
					'country_iso_code_2',
					'country_iso_code_3'
				);

				$param['column_search'] = array('country_iso_code_2','country_iso_code_3','country_name');
				$param['order'] = array('country_serial' => 'DESC');
				$posts=$this->input->post();


				if($this->data['userdata']->user_role==3){
					$param['created_by']=session_userdata('admin_id');
				}


				$list = $this->com->_get_countries($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $country){
					$no++;

					$row = array();

					$total_states=$this->com->get_total_states(array('state_country_id'=>$country->country_id));
					$total_districts=$this->com->get_total_districts(array('district_country_id'=>$country->country_id));
					$total_cities=$this->com->get_total_cities(array('city_country_id'=>$country->country_id));
					
					$row[]	=	$no;
					$row[]	=	'<i class="flag-icon flag-icon-'.strtolower($country->country_iso_code_2).'" title="'.strtolower($country->country_iso_code_2).'" id="'.strtolower($country->country_iso_code_2).'"></i> <span>'.$country->country_name.'</span>';
					$row[]	=	$country->country_iso_code_2;
					//$row[]	=	$country->country_iso_code_3;
					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/settings/countries/states/'.encode_data($country->country_id).'" class="btn btn-xs btn-warning">'.$total_states.'</a>';

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/settings/countries/districts/'.encode_data($country->country_id).'" class="btn btn-xs btn-warning">'.$total_districts.'</a>';

					//$row[]	=	'<a href="'.$this->data['admin_base_url'].'/settings/countries/cities/'.encode_data($country->country_id).'" class="btn btn-xs btn-warning">'.$total_cities.'</a>';

					$row[]	=	'<button type="button" class="btn btn-xs btn-warning">'.$total_cities.'</button>';
	
					if($country->country_status=='1'){
						$row[]  =	'<button type="button" class="btn btn-xs btn-success">Active</button>';
					}else if($country->country_status=='2'){
						$row[]  =	'<button type="button" class="btn btn-xs btn-secondary">Deactive</button>';
					}	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->com->_get_countries($posts,$param,TRUE),
					"recordsFiltered" => $this->com->_get_countries($posts,$param,TRUE),
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

	public function onSearchCountyStatesList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'state_name'
				);

				$param['column_search'] = array('state_name');
				$param['order'] = array('state_serial' => 'ASC');
				$posts=$this->input->post();

				$country_id=decode_data($posts['country']);

				$param['country']=$country_id;

				$list = $this->com->_get_states($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $state){
					$no++;

					$row = array();

					$total_cities=$this->com->get_total_cities(array('city_state_id'=>$state->state_id));

					$slug=$this->sm->get_slug(array('slug_type_id'=>$state->state_id,'slug_type'=>'1'));
					
					$row[]	=	$no;
					$row[]	=	$state->state_name;

					$row[]	=	'<a href="'.$this->data['admin_base_url'].'/settings/countries/cities/'.encode_data($country_id).'/'.encode_data($state->state_id).'" class="btn btn-warning">'.$total_cities.'</a>';

					if(!empty($slug)){
						$row[]  =	'<button type="button" class="btn btn-success btn_create_slug" data-type="state_slug" data-value_id="'.encode_data($state->state_id).'">'.$slug->slug_value.'</button>';
					}else{
						$row[]  =	'<button type="button" class="btn btn-success btn_create_slug" data-type="state_slug" data-value_id="'.encode_data($state->state_id).'">Create</button>';
					}

					

	
					if($state->state_status=='1'){
						$row[]  =	'<button type="button" class="btn btn-success">Active</button>';
					}else if($state->state_status=='2'){
						$row[]  =	'<button type="button" class="btn btn-secondary">Deactive</button>';
					}	

					$data[] = $row;
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->com->_get_states($posts,$param,TRUE),
					"recordsFiltered" => $this->com->_get_states($posts,$param,TRUE),
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


	public function onSearchCountyCitiesList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'city_name',
					'state_name'
				);

				$param['column_search'] = array('city_name','state_name');
				$param['order'] = array('city_serial' => 'ASC');

				$posts=$this->input->post();

				$param['state']=decode_data($posts['state']);
				$param['country']=decode_data($posts['country']);

				//echo $param['state'];die;

				$list = $this->com->_get_cities($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $city){
					$no++;

					$row = array();

					$slug=$this->sm->get_slug(array('slug_type_id'=>$city->city_id,'slug_type'=>'2'));

					$action='<div class="btn-group btn-group-sm">
					<button type="button" data-aid="'.encode_data($city->city_id).'" data-city="'.$city->city_name.'" data-status="'.$city->city_status.'" class="btn btn-xs btn-primary btn_edit_city">Edit</button>
					<button class="btn btn-xs btn-dark btn_del_city" data-aid="'.encode_data($city->city_id).'">Delete</button>
					</div>';
					
					$row[]	=	$no;
					$row[]	=	$city->city_name;
					$row[]	=	$city->state_name;

					if(!empty($slug)){
						$row[]  =	'<button type="button" class="btn btn-success btn_create_slug" data-type="city_slug" data-value_id="'.encode_data($city->city_id).'">'.$slug->slug_value.'</button>';
					}else{
						$row[]  =	'<button type="button" class="btn btn-success btn_create_slug" data-type="city_slug" data-value_id="'.encode_data($city->city_id).'">Create</button>';
					}
	
					if($city->city_status=='1'){
						$row[]  =	'<button type="button" class="btn btn-success">Active</button>';
					}else if($city->city_status=='2'){
						$row[]  =	'<button type="button" class="btn btn-secondary">Deactive</button>';
					}

					$row[]  =	$action;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->com->_get_cities($posts,$param,TRUE),
					"recordsFiltered" => $this->com->_get_cities($posts,$param,TRUE),
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

	public function onSearchCountyDistrictsList(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'district_name',
					'state_name'
				);

				$param['column_search'] = array('district_name','state_name');
				$param['order'] = array('district_serial' => 'ASC');

				$posts=$this->input->post();

				//$param['state']=decode_data($posts['state']);
				$param['country']=decode_data($posts['country']);

				//echo $param['state'];die;

				$list = $this->com->_get_districts($posts,$param,FALSE,FALSE);
				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $district){
					$no++;

					$row = array();

					$action='<div class="btn-group btn-group-sm">
					<a href="'.$this->data['admin_base_url'].'/institutions/colleges/add/'.encode_data($district->district_id).'" class="btn btn-xs btn-primary">Edit</a>
					<button class="btn btn-xs btn-dark btn_del_district" data-aid="'.encode_data($district->district_id).'">Delete</button>
					</div>';
					
					$row[]	=	$no;
					$row[]	=	$district->state_name;
					$row[]	=	$district->district_name;
	
					if($district->district_status=='1'){
						$row[]  =	'<button type="button" class="btn btn-success">Active</button>';
					}else if($district->city_status=='2'){
						$row[]  =	'<button type="button" class="btn btn-secondary">Deactive</button>';
					}

					$row[]  =	$action;	

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->com->_get_districts($posts,$param,TRUE),
					"recordsFiltered" => $this->com->_get_districts($posts,$param,TRUE),
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


	public function onAddCountryStates(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$state_country 		=   post_data('state_country');

				$state_name 		= 	clean_data($decrypted['state_name']);
				$state_serial 		= 	clean_data($decrypted['state_serial']);
				$state_status 		= 	clean_data($decrypted['state_status']);

				$state_found=$this->com->get_state(array('state_name'=>$state_name));

				if(empty($state_found)){
					$data_to_store=array(
						'state_country_id'=>decode_data($state_country),
						'state_name'=>$state_name,
						'state_serial'=>$state_serial,
						'state_status'=>$state_status,
						'created_by'=>decode_data(session_userdata('admin_id'))
					);

					$inserted=$this->com->add_state_data($data_to_store);
					if($inserted){
						$return['success']='State added in the system';
					}else{
						$return['error']='Data not added in the system.';
					}
				}else{
					$return['error']='State already found in the system.';
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


	public function onAddCountryCities(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$_city 				=	clean_data($decrypted['_city']);


				$city_country 		=   post_data('city_country');
				$city_state 		=   clean_data($decrypted['city_state']);

				$city_name 			= 	clean_data($decrypted['city_name']);
				//$city_serial 		= 	clean_data($decrypted['city_serial']);
				$city_status 		= 	clean_data($decrypted['city_status']);

				if(empty($_city)){
					$city_found=$this->com->get_city(array(
						'city_state_id'=>decode_data($city_state),
						'city_country_id'=>decode_data($city_country),
						'city_name'=>$city_name
					));

					if(empty($city_found)){
						$data_to_store=array(
							'city_state_id'=>decode_data($city_state),
							'city_country_id'=>decode_data($city_country),
							'city_name'=>$city_name,
							'city_serial'=>'1',
							'city_status'=>$city_status,
							'created_by'=>decode_data(session_userdata('admin_id'))
						);

						$inserted=$this->com->add_city_data($data_to_store);
						if($inserted){
							$return['success']='City added in the system';
						}else{
							$return['error']='City not added in the system.';
						}
					}else{
						$return['error']='City already found in the system.';
					}
				}else{
					$city_id=decode_data($_city);
					$city_found=$this->com->get_city(array('city_id!='=>$city_id,'city_state_id'=>decode_data($city_state),
							'city_country_id'=>decode_data($city_country),'city_name'=>$city_name));

					if(empty($city_found)){
						$data_to_store=array(
							'city_state_id'=>decode_data($city_state),
							'city_country_id'=>decode_data($city_country),
							'city_name'=>$city_name,
							'city_serial'=>'1',
							'city_status'=>$city_status,
							'updated_by'=>decode_data(session_userdata('admin_id')),
							'updated_at'=>date('Y-m-d H:i:s')
						);

						$inserted=$this->com->update_city_data($data_to_store,array('city_id'=>$city_id));
						if($inserted){
							$return['success']='City updated in the system';
						}else{
							$return['error']='City not updated in the system.';
						}
					}else{
						$return['error']='City already found in the system';
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


	public function onDeleteCountryCities(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_city=post_data('_city');
				$city_id=decode_data($_city);

				$city_found=$this->com->get_city(array('city_id'=>$city_id));

				if(!empty($city_found)){

					$deleted=$this->com->delete_city_data(array('city_id'=>$city_id));
					if($deleted){
						$return['success']='City deleted from the system';
					}else{
						$return['error']='City not found in the system';
					}

				}else{
					$return['error']='City not found in the system';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onAddCountryDistricts(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$ctext=post_data('ctext');

				$security_token = $this->data['security_token'];

				$decrypted = CryptoJsAes::decrypt($ctext, $security_token);

				$district_country 		=   post_data('district_country');
				$district_state 		=   clean_data($decrypted['district_state']);

				$district_name 			= 	clean_data($decrypted['district_name']);
				$district_status 		= 	clean_data($decrypted['district_status']);

				$district_found=$this->com->get_district(array(
					'district_state_id'=>decode_data($district_state),
					'district_country_id'=>decode_data($district_country),
					'district_name'=>$district_name,
				));

				if(empty($district_found)){
					$data_to_store=array(
						'district_state_id'=>decode_data($district_state),
						'district_country_id'=>decode_data($district_country),
						'district_name'=>$district_name,
						'district_status'=>$district_status,
						'created_by'=>decode_data(session_userdata('admin_id'))
					);

					$inserted=$this->com->add_district_data($data_to_store);
					if($inserted){
						$return['success']='District added in the system';
					}else{
						$return['error']='Data not added in the system.';
					}
				}else{
					$return['error']='Data already found in the system.';
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

	public function onDeleteCountryDistricts(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$_district=post_data('_district');
				$district_id=decode_data($_district);

				$district_found=$this->com->get_district(array('district_id'=>$district_id));

				if(!empty($district_found)){

					$deleted=$this->com->delete_district_data(array('district_id'=>$district_id));
					if($deleted){
						$return['success']='District deleted from the system';
					}else{
						$return['error']='District not found in the system';
					}

				}else{
					$return['error']='District not found in the system';
				}

				header('Content-Type: application/json');

				echo json_encode($return);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onUpdateSingleCountryStateData(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$data_type=post_data('data_type');
				$data_value_id=post_data('data_value_id');

				if( in_array($data_type, array('state_slug','city_slug'))){
					$data_id=decode_data($data_value_id);

					if($data_type=='state_slug'){
						$slug_found=$this->sm->get_slug(array('slug_type_id'=>$data_id,'slug_type'=>'1'));
						$slug_data=$this->com->get_state(array('state_id'=>$data_id));
						$slug_value=url_slug($slug_data->state_name);
						$slug_type='1';
					}else if($data_type=='city_slug'){
						$slug_found=$this->sm->get_slug(array('slug_type_id'=>$data_id,'slug_type'=>'2'));
						$slug_data=$this->com->get_city(array('city_id'=>$data_id));
						$slug_value=url_slug($slug_data->city_name);
						$slug_type='2';
						$this->com->update_city_data(array('city_name_slug'=>$slug_value),array('city_id'=>$data_id));
					}
					

					if(!empty($slug_found)){
						$inserted=$this->sm->update_slug(array('slug_value'=>$slug_value),array('slug_type_id'=>$data_id,'slug_type'=>$slug_type));
					}else{
						$inserted=$this->sm->store_slug(array('slug_value'=>$slug_value,'slug_type_id'=>$data_id,'slug_type'=>$slug_type));
					}

					if($inserted){
						$return['success']='Slug created';
					}else{
						$return['error']='Slug not created';
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

}