<?php


/**
 * 
 */
class Front_student_applied_colleges_section extends Widget
{
    function run($visible = FALSE,$user_id=0,$chunk=FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $_applied_colleges=array();

        $applied_colleges=$this->um->_get_applicant(array('applicant_id'=>$user_id),FALSE);

        if(!empty($applied_colleges)){
            foreach ($applied_colleges as $key => $value) {
                $state=$this->com->get_state_specific('state_id,state_name',array('state_id'=>$value->college_state_id));
                $city=$this->com->__get_city('city_id,city_name',array('city_id'=>$value->college_city_id));

                $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->application_inst_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));
                if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                    $college_logo=$_college_logo->media_disk_path_relative;
                    $college_logo_name=$_college_logo->media_org_name;
                }else{
                    $college_logo=base_url().'uploads/app/default/no.jpg';
                    $college_logo_name='';
                } 

                $_applied_colleges[]=array(
                    'college_name'=>$value->college_name,
                    'college_short_name'=>$value->college_short_name,
                    'college_name_formatted'=>($value->college_short_name!=null)?$value->college_name.' - ['.$value->college_short_name.']':$value->college_name,
                    'college_image'=>$college_logo,
                    'college_city'=>$city->city_name.','.$state->state_name,
                    'college_url'=>$value->access_url,
                    'application_date'=>date('j M, Y',strtotime($value->application_date))
                );
            }


            if($chunk==TRUE){
                $_applied_colleges=array_chunk($_applied_colleges,2);
            }
        }

        // /print_obj($_applied_colleges);die;

        $data['chunk']=$chunk;

        //echo $chunk;die;

        $data['userdata']=$this->data['userdata'];

        $data['applied_colleges']=$_applied_colleges;

        if ($visible) $this->render('front_student_applied_colleges_section',$data);
    }
}