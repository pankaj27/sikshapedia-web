<?php


/**
 * 
 */
class Front_study_abroad_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);
    	$param=array('country_status'=>'1','is_top'=>'1');

    	$top_countries=$this->com->get_country($param,FALSE);

        if(!empty($top_countries)){
            foreach ($top_countries as $key => $value) {
                $_top_countries[]=array(
                    'country_code'=>strtolower($value->country_iso_code_2),
                    'country_name'=>strtoupper($value->country_name),
                    'country_flag'=>DIR_CDN.'data/app/app_data/flags/4x3/'.strtolower($value->country_iso_code_2).'.svg',
                    'access_url'=>base_url(strtolower($value->country_iso_code_2))
                );
            }
        }


    	$data['top_countries']=$_top_countries;
        if ($visible) $this->render('front_study_abroad_section',$data);
    }
}