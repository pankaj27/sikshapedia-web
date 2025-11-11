<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_faculties_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	// if($visible=='1'){
     //    	$visible=TRUE;
     //    }

    	// $segment_1=$this->uri->segment(1,0); //country
     //    $segment_2=$this->uri->segment(2,0); //college,university url
     //    $segment_3=$this->uri->segment(3,0); //inner menues

        //echo $segment_2;die;

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $course_fees_data=array();
        $college_data=array();
        $course_stream_details=array();
        $faculties_intro=array();

    	$country_data=$this->com->get_country(array('country_id'=>$country_id));

    	if(!empty($country_data)){
    		$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

			if(!empty($_college_data)){
				$college_user_data=$this->um->get_user_data(array('user_id'=>$_college_data->college_user_id),null,'4');

				$faculties_intro=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_2'=>'general_info','info_value_type'=>'2','info_type_id'=>$college_id));

				$college_data=array(
					'college_name'=>strtoupper($_college_data->college_name)
				);

				$param['faculty_type_id']=$college_id;
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


        $data['faculties_data']=$_faculties;
        $data['faculties_intro']=(!empty($faculties_intro))?$faculties_intro->info_value_faculty_intro:'';

        if ($visible) $this->render('front_faculties_section',$data);
	}
}