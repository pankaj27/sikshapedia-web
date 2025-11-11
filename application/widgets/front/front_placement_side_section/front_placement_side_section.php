<?php


/**
 * 
 */
class Front_placement_side_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
     	$college_id=$ids['college_id'];

		$college_placements=array();
		$placement_intro=array();

		$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

		if(!empty($college_data)){
			$menu_link_type=($_college_data->college_utype==4)?'10':'101';
			
			if(!empty($college_data->college_frequent_visited_companies)){
				$param['companies']=$college_data->college_frequent_visited_companies;
                $cplacementcompanies=$this->im->_get_placement_companies($param,'placement_company_id','ASC',6);
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
            $college_placements=array();
        }

	
    	$data['college_placements']=$college_placements;

    	if ($visible) $this->render('front_placement_side_section',$data);
    }
}