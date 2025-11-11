<?php


/**
 * 
 */
class Front_college_ranking_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


    	$country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $ranking_agency_data=array();

        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        if(!empty($college_data->college_ranking_ids)){
			$ranking_agencies=$this->im->_get_ranking_types('rank_id',$college_data->college_ranking_ids);

			//print_obj($ranking_agencies);

			$college_state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$college_data->college_state_id));
			$college_city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$college_data->college_city_id));

			foreach ($ranking_agencies as $key => $value) {
				$ranking_bodies_image=$this->sm->get_user_file(array('user_storage_type'=>'ranking_agency_logo','user_file_type_id'=>$value->rank_id));

				$_ranking_data=$this->im->_get_inst_ranking_data(array('ranking_inst_id'=>$college_id,'ranking_inst_type'=>'college','ranking_body_id'=>$value->rank_id));

				if(!empty($_ranking_data)){
					foreach ($_ranking_data as $k => $v) {
						$ranking_data[$value->rank_id][]=array(
							'ranking_category'=>$v->rank_category,
							'rank_value'=>$v->ranking_value,
							'rank_out_of_value'=>(!empty($v->ranking_value_outof))?$v->ranking_value_outof:$value->rank_value,
							'rank_year'=>$v->ranking_year,
							'rank_search_page'=>base_url('in/colleges/'.$college_state_slug->slug_value.'/'.$college_city_slug->slug_value.'/'.$v->rank_category_alias_2.'/'.$v->rank_category_alias.'?agn='.$value->rank_body_alias)
						);
					}
				}

				$ranking_agency_data[]=array(
					'agency_name'=>$value->rank_body,
					'agency_logo'=>$ranking_bodies_image->media_disk_path_relative,
					'ranking_data'=>$ranking_data[$value->rank_id]
				);
			}
        }

        //print_obj($ranking_agency_data);die;

        

        $data['college_data']=$college_data;
        $data['college_ranking_data']=$ranking_agency_data;


        if ($visible) $this->render('front_college_ranking_section',$data);
    }
}