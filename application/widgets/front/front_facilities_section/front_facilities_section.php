<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_facilities_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];
    	$college_type=(isset($ids['college_type']))?$ids['college_type']:'4';
    	$college_info_type=(isset($ids['college_info_type']))?$ids['college_info_type']:'2';

		$colleges_data=array();
		$college_facilities=array();

		$country_data=$this->com->get_country(array('country_id'=>$country_id));

		if(!empty($country_data)){
			$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

			if(!empty($college_data) && !empty($college_data->college_facilities)){
                $cfacilities=$this->sm->get_system_facilities_in('facility_id',$college_data->college_facilities);

                if(!empty($cfacilities)){
					foreach ($cfacilities as $k => $v) {
                        $college_facilities[]=array(
                            'facility_name'=>$v->facility_name,
                            'facility_icon'=>$v->facility_icon,
                            'facility_icon_3'=>$v->facility_icon_3
                        );
                    }
                }           
            }
		}


		//$info=$this->im->get_inst_info_data(array('info_type_id'=>$college_id,'info_type'=>$college_info_type));

		$info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id,'info_value_type'=>'2','info_type_2'=>'general_info'));

		//print_obj($info);die;

		$data['college_facilities_intro']=$info->info_value_facilities_intro;

    	$data['college_facilities']=$college_facilities;

    	if ($visible) $this->render('front_facilities_section',$data);
	}
}