<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_faculties_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	if($visible=='1'){
        	$visible=TRUE;
        }

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //inner menues

        //echo $segment_2;die;

        $course_fees_data=array();
        $college_data=array();
        $course_stream_details=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') || (is_string($segment_3) && $segment_3!='0' && $segment_3=='faculties')){
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
							$college_user_data=$this->um->get_user_data(array('user_id'=>$_college_data->college_user_id),null,'4');

							$college_data=array(
								'college_name'=>strtoupper($_college_data->college_name)
							);

							$param['faculty_type_id']=$slug_type_id;
							$param['faculty_type']='2';

							$college_faculties=$this->im->_get_faculties(NULL,$param);

							//print_obj($college_faculties);die;

							if(!empty($college_faculties)){
								foreach ($college_faculties as $key => $value) {

									if($value->faculty_qualifications!=''){
										$qualifications=$this->im->get_group_concat_qualifications_data('qualification_name','qualification_id',$value->faculty_qualifications,FALSE);
									}else{
										$qualifications='';
									}
									

									$_faculties[]=array(
										'faculty_name'=>$value->faculty_name,
										'faculty_email'=>$value->faculty_email,
										'facullty_contact_no'=>$value->facullty_contact_no,
										'faculty_academic_exp'=>($value->faculty_academic_exp!=null)?$value->faculty_academic_exp:null,
										'faculty_qualifications'=>$qualifications->concated_value,
										'faculty_designation'=>$value->designation_name,
										'faculty_departments'=>$value->department_name,
										'faculty_designation_departments'=>($value->department_name!='')?($value->designation_name.','.$value->department_name):$value->designation_name,
										'faculty_experience'=>$value->faculty_academic_exp
									);
								}

								
							}
						}
					}
        		}
        	}
        }

        $data['faculties_data']=$_faculties;

        if ($visible) $this->render('front_faculties_section',$data);
	}
}