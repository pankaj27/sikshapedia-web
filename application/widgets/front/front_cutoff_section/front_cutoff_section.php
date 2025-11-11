<?php


/**
 * 
 */
class Front_cutoff_section extends Widget
{

    function run($visible = FALSE,$ids=null) {

        $this->front_theme='default';
        $this->get_type(2);

        $data=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];


        $system_name=$this->data['system_title_name'];

        $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        if(!empty($_college_data)){
            if(isset($college_id)){
                $info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id));
                $college_cutoff_info=$info->info_value_cutoff_intro;
            }else{
                $college_cutoff_info='';
            }

            $data['cutoff_intro']=$this->im->_get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id,'info_type_2'=>'cutoff_info'));
        }


        if ($visible) $this->render('front_cutoff_section',$data);

    }
    

}