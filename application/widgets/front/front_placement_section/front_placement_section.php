<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_placement_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];

  		// $segment_1=$this->uri->segment(1,0); //country
		// $segment_2=$this->uri->segment(2,0); //college,university url

		$college_placements=array();
		$placement_intro=array();


		$country_data=$this->com->get_country(array('country_id'=>$country_id));

		if(!empty($country_data)){
			$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));		
			$placement_infos=$this->im->__get_inst_info_data(array('info_type'=>'2','info_type_2'=>'placement_info','info_type_id'=>$college_id),null,'info_id','ASC',FALSE);

			$placement_intro=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_2'=>'general_info','info_value_type'=>'2','info_type_id'=>$college_id));

			//print_obj($placement_intro);die;

			if(!empty($placement_intro)){
				$placement_intro_value=(!empty($placement_intro->info_value_placement_intro))?$placement_intro->info_value_placement_intro:'';
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

		if(!empty($college_data)){
			$college_placement_data=$this->im->get_placement_data(array('placement_type_id'=>$college_id,'placement_type'=>'COLLEGE','placement_screen_type'=>'with_students_count'),FALSE);

			if(!empty($college_placement_data)){
				foreach ($college_placement_data as $key => $value) {
					$company_data=$this->im->get_company_data(array('placement_company_id'=>$value->placement_company));

					$company_image=$this->sm->get_user_file(array('user_storage_type'=>'company_logo','user_file_type_id'=>$value->placement_company));

					if(!empty($company_image) && !empty($company_image->media_disk_path_relative)){
	                    $_company_image=$company_image->media_disk_path_relative;
	                }else{
	                    $_company_image=base_url().'uploads/app/default/no.jpg';
	                }

					$place_ment_data[]=array(
						'company_name'=>$company_data->placement_company_name,
						'company_image'=>$_company_image,
						'plaement_year'=>$value->placement_year,
						'placement_students'=>$value->placement_students_no
					);
				}
			}
		}else{
			$place_ment_data=array();
		}

			
		
		$data['college_data']=$college_data;
		$data['college_placement_intro']=$placement_intro_value;
		$data['college_placement_infos']=$placement_infos;
    	$data['college_placements']=$college_placements;
    	$data['college_placement_data']=$place_ment_data;

    	//print_obj($data);

    	if ($visible) $this->render('front_placement_section',$data);
	}
}