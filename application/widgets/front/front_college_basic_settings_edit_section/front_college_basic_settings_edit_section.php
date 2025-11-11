<?php


/**
 * 
 */
class Front_college_basic_settings_edit_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

       // echo $user_id;

        $college_data=$this->um->get_college_profile_data(array('college_user_id'=>$user_id));

        // print_obj($college_data);die;

        $countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

        if(!empty($countries)){
            foreach ($countries as $key => $value) {
                $selected=(isset($college_data) && !empty($college_data) && ($college_data->college_country_id==$value->country_id))?'selected':'';
                $_countries[]=array(
                    'country_id'=>encode_data($value->country_id),
                    'country_name'=>$value->country_name,
                    'selected'=>$selected
                );
            }
        }else{
            $_countries=array();
        }

        if(!empty($college_data) && ($college_data->college_country_id!=null || $college_data->college_country_id!=0)){

            
            $_states=$this->com->get_states(array('state_country_id'=>$college_data->college_country_id),'state_serial','ASC');
        }else{
            $_states=$this->com->get_states(array('state_country_id'=>'99'),'state_serial','ASC');
        }

        //print_obj($_states);die;


        if(!empty($_states)){
            foreach ($_states as $key => $value) {
                $states[]=array(
                    'state_id'=>encode_data($value->state_id),
                    'state_name'=>$value->state_name,
                    'selected'=>(isset($college_data) && !empty($college_data) && ($value->state_id==$college_data->college_state_id))?'selected':''
                );
            }
        }else{
            $states=array();
        }


        $_cities=$this->com->get_city(array('city_country_id'=>$college_data->college_country_id,'city_state_id'=>$college_data->college_state_id),FALSE);

        //print_obj($_cities);die;

        if(!empty($_cities)){
            foreach ($_cities as $key => $value) {
                $cities[]=array(
                    'city_id'=>encode_data($value->city_id),
                    'city_name'=>$value->city_name,
                    'selected'=>(isset($college_data) && !empty($college_data) && ($value->city_id==$college_data->college_city_id))?'selected':''
                );
            }
        }else{
            $cities=array();
        }


        $_districts=$this->com->get_district(array('district_country_id'=>$college_data->college_country_id,'district_state_id'=>$college_data->college_state_id),FALSE);

        if(!empty($_districts)){
            foreach ($_districts as $key => $value) {
                $districts[]=array(
                    'district_id'=>encode_data($value->district_id),
                    'district_name'=>$value->district_name,
                    'selected'=>(isset($college_data) && !empty($college_data) && ($value->district_id==$college_data->college_district_id))?'selected':''
                );
            }
        }else{
            $districts=array();
        }


        $affiliation_types=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$college_data->college_country_id),FALSE);

        //print_obj($affiliation_types);die;

        $college_affiliations=($college_data->college_affiliation_type!=null || !empty($college_data->college_affiliation_type))?char_separated_to_array($college_data->college_affiliation_type):array();
        if(!empty($affiliation_types)){
            foreach ($affiliation_types as $key => $value) {
                $selected=(!empty($college_affiliations) && in_array($value->statutory_body_id, $college_affiliations))?'checked':'';
                $_affiliation_types[]=array(
                    'statutory_body_id'=>encode_data($value->statutory_body_id),
                    'statutory_body_abbr'=>$value->statutory_body_abbr,
                    'statutory_body_name'=>$value->statutory_body_name,
                    'selected'=>$selected
                );
            }
        }else{
            $_affiliation_types=array();
        }


        $college_grades=$this->im->get_grade_types(array('grade_status'=>'1'),FALSE);

        if(!empty($college_grades)){            
            if(isset($college_data)){
                $grades=($college_data->college_grade_ids!=null || !empty($college_data->college_grade_ids))?char_separated_to_array($college_data->college_grade_ids):array();
                foreach ($college_grades as $key => $value) {
                    $selected=(!empty($college_grades) && in_array($value->grade_id, $grades))?'checked':'';
                   
                    $grade_types[]=array(
                        'grade_id'=>encode_data($value->grade_id),
                        'grade_name'=>$value->grade_name,
                        'selected'=>$selected
                    );
                }
            }else{
                foreach ($college_grades as $key => $value) {
                    $grade_types[]=array(
                        'grade_id'=>encode_data($value->grade_id),
                        'grade_name'=>$value->grade_name,
                        'selected'=>''
                    );
                }
            }
                
        }else{
            $grade_types=array();
        }

        $institue_types=$this->im->get_institute_types(array('inst_data_type'=>'4'),FALSE);

        if(!empty($institue_types)){
            foreach ($institue_types as $key => $value) {                   
                $selected=(isset($college_data) && !empty($college_data) && ($college_data->college_type==$value->inst_type))?'selected':'';
                $_institue_types[]=array(
                    'inst_type'=>encode_data($value->inst_type),
                    'inst_type_name'=>$value->inst_type_name,
                    'selected'=>$selected
                );
            }
        }else{
            $_institue_types=array();
        }


        $institue_facilities=$this->sm->get_system_facilities(array('facility_status'=>'1'),FALSE);

        if(!empty($institue_facilities)){
            foreach ($institue_facilities as $key => $value) {
                if(isset($college_data) && !empty($college_data) && $college_data->college_facilities!=null){
                    $college_facilities=char_separated_to_array($college_data->college_facilities);
                    if(in_array($value->facility_id, $college_facilities)){
                        $selected='checked';
                    }else{
                        $selected='';
                    }
                }else{
                    $selected='';
                }
                
                $_institue_facilities[]=array(
                    'facility_id'=>encode_data($value->facility_id),
                    'facility_name'=>$value->facility_name,
                    'facility_icon'=>$value->facility_icon,
                    'selected'=>$selected
                );
            }
        }else{
            $_institue_facilities=array();
        }

        // if(!empty($college_data)){
        //     $universities=$this->im->get_university_profile_data(array('university_country_id'=>$college_data->college_country_id,'university_state_id'=>$college_data->college_state_id),FALSE);
        // }else{
        //     $universities=$this->im->get_university_profile_data(array('university_country_id'=>'99'),FALSE);
        // }
        

        $universities=$this->im->get_university_profile_data(array('university_country_id'=>$college_data->college_country_id,'university_state_id'=>$college_data->college_state_id),FALSE);

        //print_obj($universities);die;

        if(!empty($universities)){
            foreach ($universities as $key => $value) {
                $selected=(isset($college_data) && !empty($college_data) && ($college_data->college_university_id==$value->university_user_id))?'selected':'';
                $_universities[]=array(
                    'university_id'=>encode_data($value->university_user_id),
                    'university_name'=>$value->university_name,
                    'selected'=>$selected
                );
            }
        }else{
            $_universities=array();
        }

        $data['infos']=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$user_id));

        $data['userdata']=$this->data['userdata'];  //$this->um->get_user(array('user_id'=>$user_id));
        $data['college_profile_data']=$college_data;

        $data['countries']=$_countries;
        $data['states']=$states;
        $data['cities']=$cities;
        $data['districts']=$districts;

        $data['grade_types']=$grade_types;
        $data['institue_types']=$_institue_types;
        $data['affiliations']=$_affiliation_types;
        $data['facilities']=$_institue_facilities;

        $data['universities']=$_universities;

        //print_obj($data['affiliations']);die;

       
        if ($visible) $this->render('front_college_basic_settings_edit_section',$data);
    }
}