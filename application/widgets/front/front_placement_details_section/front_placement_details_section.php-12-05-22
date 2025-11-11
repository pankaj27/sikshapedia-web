<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_placement_details_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
		$segment_2=$this->uri->segment(2,0); //college,university url

		$college_placements=array();
		$placement_intro=array();
		$placement_highest_package_data=array();
		$placement_average_package_data=array();

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

			if(!empty($country_data)){
				$currency_data=$this->com->get_currency(array('currency_id'=>$country_data->country_currency));
				$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

				//print_obj($currency_data);die;

				if(!empty($slug_found)){
					$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;

					if($slug_type=='6'){ //university

					}else if($slug_type=='7'){ //college
						$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));		
						$placement_intro=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$slug_type_id));

						$param['placement_type_id']=$slug_type_id;
						$_data=$this->im->_get_placement_data($param,FALSE);

						$placement_package_data=array();

						//print_obj($_data);die;

						$highest_package=$this->im->get_placement_pacakge_data(array('pacakge_inst_id'=>$slug_type_id,'pacakge_type'=>'highest'),FALSE);

						$average_package=$this->im->get_placement_pacakge_data(array('pacakge_inst_id'=>$slug_type_id,'pacakge_type'=>'avaerage'),FALSE);

						if(!empty($highest_package)){
							foreach ($highest_package as $key => $value) {
								if($currency_data->currency_symbol_left!=''){
									$_hp=$currency_data->currency_symbol_left.number_to_currency($value->pacakge_value);
								}else{
									$_hp=number_to_currency($value->pacakge_value).$currency_data->currency_symbol_right;
								}

								$placement_highest_package_data[]=$_hp;
							}
						}


						if(!empty($average_package)){
							foreach ($average_package as $key => $value) {
								if($currency_data->currency_symbol_left!=''){
									$_hp=$currency_data->currency_symbol_left.number_to_currency($value->pacakge_value);
								}else{
									$_hp=number_to_currency($value->pacakge_value).$currency_data->currency_symbol_right;
								}
								
								$placement_average_package_data[]=$_hp;
							}
						}

						$data['college_heading']=$college_data->college_name.'- Placement '.date('Y');


						if(!empty($_data)){
							foreach ($_data as $key => $value) {

								//print_obj($value->placement_id);

								$company_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->placement_company,'user_file_type'=>'8','user_storage_type'=>'company_logo'),NULL,FALSE);

								if($currency_data->currency_symbol_left!=''){
									$hp=$currency_data->currency_symbol_left.number_to_currency($value->placement_highest_package);
								}else{
									$hp=number_to_currency($value->placement_highest_package).$currency_data->currency_symbol_right;
								}

								//$hp=number_to_currency($value->placement_highest_package);


								$placement_package_data[]=array(
									'placement_id' => $vlaue->placement_id,
						            'placement_type' => $value->placement_type,
						            'placement_type_id' => $value->placement_type_id,
						            'placement_year' => $value->placement_year,
						            'placement_highest_package' => $hp,
						            'placement_company_name' => $value->placement_company_name,
						            'placement_company_logo'=>$company_logo->media_disk_path_relative
								);
							}
						}

						//die;

						$data['placement_package_data']=$placement_package_data;
						$data['placement_highest_package_data']=$placement_highest_package_data;
						$data['placement_average_package_data']=$placement_average_package_data;

						//print_obj($data['placement_package_data']);die;


					}
				}
			}
		}


		if ($visible) $this->render('front_placement_details_section',$data);
    }
}