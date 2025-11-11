<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_similar_colleges_universities_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
		$segment_2=$this->uri->segment(2,0); //college,university url

		$colleges_data=array();


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
						$college_id=$college_data->college_id;
						$college_state=$college_data->college_state_id;
						$college_university=$college_data->college_university_id;


						$param=array('college_id'=>$college_id,'country_id'=>$country_data->country_id,'college_state'=>$college_state,'college_university_id'=>$college_university,'status'=>'1','is_verified'=>'1');

						//print_obj($param);die;
						$post=array('length'=>'6','start'=>'0');

						$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

						//print_obj($colleges);die;

						if(!empty($colleges)){
							foreach ($colleges as $key => $value) {
								$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
				    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

				    			if(!empty($value->college_affiliation_type)){
				                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$value->college_affiliation_type);

				                    $college_affiliations=$caffiliations->concated_value;
				                }else{
				                    $college_affiliations='';
				                }

				    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
				                    $college_logo=$_college_logo->media_disk_path_relative;
				                    $college_logo_name=$_college_logo->media_org_name;
				                }else{
				                    $college_logo=base_url().'uploads/app/default/no.jpg';
				                    $college_logo_name='';
				                }

				                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
				                    $college_banner=$_college_banner->media_disk_path_relative;
				                    $college_banner_name=$_college_banner->media_org_name;
				                }else{
				                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
				                    $college_banner_name='';
				                }


								$colleges_data[]=array(
									'college_id'=>encode_data($value->college_id),
				    				'college_name'=>$value->college_name,
				    				'college_city'=>$value->city_name,
				    				'college_state'=>$value->state_name,
				    				'college_country_id'=>encode_data($value->college_country_id),
				    				'college_country'=>$value->country_name,
				    				'college_logo'=>$college_logo,
				    				'college_banner'=>$college_banner,
				    				'college_affiliations'=>$college_affiliations,
				    				'is_featured'=>$is_featured,
				    				'access_url'=>$value->access_url,
				    				'college_country_phone_code'=>$country_data->country_phone_code
								);
							}
						}
					}
				}
			}
		}

    	$data['similar_colleges']=$colleges_data;

    	if ($visible) $this->render('front_similar_colleges_universities_section',$data);
	}
}