<?php


/**
 * 
 */
class Front_admission_section extends Widget
{
	
	function run($visible = FALSE,$college_id=0) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //college,university url

        //print_obj($segment_2);

        $infos_data=array();

        $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
        $settings_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

        //print_obj($system_general_settings);

        $system_name=($settings_value!='')?$settings_value->system_name:'Waytoadmissions';


        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') && (is_string($segment_3) && $segment_3=='admission')){
        	$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
        	//print_obj($country_data);die;

        	if(!empty($country_data)){
        		$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));
        		if(!empty($slug_found)){
        			$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;
					$slug_value=$slug_found->slug_value;
					if($slug_type=='6'){//University
					}else if($slug_type=='7'){//College

						$infos_data=$this->im->_get_inst_info_data(array('info_type'=>'2','info_type_2'=>'admission_info','info_type_id'=>$college_id),'info_serial','ASC',FALSE);

						//print_obj($infos_data);die;

						$admission_faqs=$this->sm->get_system_users_faqs_data(array('faq_data_id_type'=>'2','faq_type'=>'4','faq_data_id'=>$college_id),FALSE);
					}
				}
        	}
        }


        $data['college_admission_data']=$infos_data;

        $data['college_admission_faqs']=$admission_faqs;

       //print_obj($data);

        if ($visible) $this->render('front_admission_section',$data);
    }
}