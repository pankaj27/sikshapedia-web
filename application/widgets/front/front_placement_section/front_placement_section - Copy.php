<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_placement_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
		$segment_2=$this->uri->segment(2,0); //college,university url

		$college_placements=array();
		$placement_intro=array();

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

			if(!empty($country_data)){
				$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

				if(!empty($slug_found)){
					$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;

					if($slug_type=='6'){ //university

					}else if($slug_type=='7'){ //college
						$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));		
						$placement_intro=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$slug_type_id));

						if(!empty($placement_intro)){
							$placement_intro_value=$placement_intro->info_value_placement_intro;
						}else{
							$placement_intro_value='';
						}	

						if(!empty($college_data)){
							if(!empty($college_data->college_frequent_visited_companies)){
								$param['companies']=$college_data->college_frequent_visited_companies;
			                    $cplacementcompanies=$this->im->_get_placement_companies($param,'placement_company_id','ASC');
			                    foreach ($cplacementcompanies as $k => $v) {
			                    	$company_image=$this->sm->get_user_file(array('user_storage_type'=>'company_logo','user_file_type_id'=>$v->placement_company_id));

			                    	if(!empty($company_image) && !empty($company_image->media_disk_path_relative)){
					                    $_company_image=$company_image->media_disk_path_relative;
					                }else{
					                    $_company_image=base_url().'uploads/app/default/no.jpg';
					                }
			                        $college_placements[]=array(
			                            'company_name'=>$v->placement_company_name,
			                            'company_image'=>$_company_image
			                        );
			                    }
							}else{
								$college_placements=array();
							}
		                }else{
		                	$placement_intro_value='';
		                    $college_placements=array();
		                }
					}
				}
			}
		}

		$data['college_placement_intro']=$placement_intro_value;
    	$data['college_placements']=$college_placements;

    	//print_obj($data);

    	if ($visible) $this->render('front_placement_section',$data);
	}
}