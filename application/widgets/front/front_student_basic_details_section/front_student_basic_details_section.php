<?php


/**
 * 
 */
class Front_student_basic_details_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $user_id=decode_data(session_userdata('user_id'));

        $userdata=$this->data['userdata'];

        //print_obj($userdata);die;

        $countries=$this->com->get_country(array('country_status'=>'1'),FALSE,'country_serial','ASC');

        if(!empty($countries)){
            foreach ($countries as $key => $value) {
                $selected=(isset($userdata) && !empty($userdata) && ($userdata->user_country==$value->country_id))?'selected':'';
                $_countries[]=array(
                    'country_id'=>encode_data($value->country_id),
                    'country_name'=>$value->country_name,
                    'selected'=>$selected
                );
            }
        }else{
            $_countries=array();
        }

        if(!empty($college_data)){
            $_states=$this->com->get_states(array('state_country_id'=>$userdata->user_country),'state_serial','ASC');
        }else{
            $_states=$this->com->get_states(array('state_country_id'=>'99'),'state_serial','ASC');
        }

        if(!empty($_states)){
            foreach ($_states as $key => $value) {
                $states[]=array(
                    'state_id'=>encode_data($value->state_id),
                    'state_name'=>$value->state_name,
                    'selected'=>(isset($userdata) && !empty($userdata) && ($value->state_id==$userdata->user_state))?'selected':''
                );
            }
        }else{
            $states=array();
        }


        $_cities=$this->com->get_city(array('city_country_id'=>$userdata->user_country,'city_state_id'=>$userdata->user_state),FALSE);

        //print_obj($_cities);die;

        if(!empty($_cities)){
            foreach ($_cities as $key => $value) {
                $cities[]=array(
                    'city_id'=>encode_data($value->city_id),
                    'city_name'=>$value->city_name,
                    'selected'=>(isset($userdata) && !empty($userdata) && ($value->city_id==$userdata->user_city))?'selected':''
                );
            }
        }else{
            $cities=array();
        }


        $_districts=$this->com->get_district(array('district_country_id'=>$userdata->user_country,'district_state_id'=>$userdata->user_state),FALSE);

        if(!empty($_districts)){
            foreach ($_districts as $key => $value) {
                $districts[]=array(
                    'district_id'=>encode_data($value->district_id),
                    'district_name'=>$value->district_name,
                    'selected'=>(isset($userdata) && !empty($userdata) && ($value->district_id==$userdata->user_district))?'selected':''
                );
            }
        }else{
            $districts=array();
        }

        $data['countries']=$_countries;
        $data['states']=$states;
        $data['cities']=$cities;
        $data['districts']=$districts;

        $data['userdata']=$userdata;

        if ($visible) $this->render('front_student_basic_details_section',$data);
    }
}