<?php


/**
 * 
 */
class Front_broucher_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	if($visible=='1'){
        	$visible=TRUE;
        }

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url

        $broucher_files=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0')){
        	$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

        	if(!empty($country_data)){
        		$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

        		if(!empty($slug_found)){
        			$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;
					$slug_value=$slug_found->slug_value;

					if($slug_type=='6'){//University

					}else if($slug_type=='7'){//College
						$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

						if(!empty($_college_data)){

							$broucher_data=$this->sm->get_broucher_data(array('broucher_data_type'=>'college','broucher_data_type_id'=>$slug_type_id),FALSE);

							//print_obj($broucher_data);die;

							if(!empty($broucher_data)){
								foreach ($broucher_data as $key => $value) {
									$files=$this->sm->get_user_files(array('user_file_type_id'=>$slug_type_id,'user_file_type'=>'6','user_storage_type'=>'user_broucher','user_storage_type_2'=>$value->broucher_type_id));

									foreach ($files as $k => $v) {
										$_files[$value->broucher_type_name][]=array(
											'file_id'=>$v->storage_id,
											'file_path'=>$v->media_disk_path_relative
										);
									}

									$broucher_files[]=array(
										'broucher_year'=>$value->broucher_data_year,
										'broucher_type'=>$value->broucher_type_name,
										'broucher_files'=>$_files[$value->broucher_type_name]
									);
								}
							}

							//print_obj($broucher_files);die;
						}
					}
        		}
        	}
        }

        $data['brouchers']=$broucher_files;


    	if ($visible) $this->render('front_broucher_section',$data);
    }
}