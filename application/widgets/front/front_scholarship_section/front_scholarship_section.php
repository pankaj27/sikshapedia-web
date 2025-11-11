<?php


/**
 * 
 */
class Front_scholarship_section extends Widget
{
    function run($visible = FALSE,$ids=null){
        $this->front_theme='default';
        $this->get_type(2);

       $scholarship_info_data=array();


        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $system_name=$this->data['system_title_name'];

        $country_data=$this->com->get_country(array('country_id'=>$country_id));

        $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        //print_obj($_college_data);die;


        if(!empty($_college_data)){
            $college_data=array(
                'college_name'=>strtoupper($_college_data->college_name)
            );

            $scholarship_detail_data=$this->nm->get_scholarship_data(array('scholarship_type'=>'college','scholarship_type_id'=>$college_id),FALSE);

            $scholarship_info_data=$this->im->_get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id,'info_type_2'=>'scholarship_info'));

            $scholarship_intro_data=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_2'=>'general_info','info_value_type'=>'2','info_type_id'=>$college_id));

            $college_sfaqs=$this->sm->get_system_users_faqs_data(array('faq_data_id'=>$college_id,'faq_data_id_type'=>'2','faq_type'=>'3'),FALSE);

            if(!empty($college_sfaqs)){
                foreach ($college_sfaqs as $key => $value) {
                    $college_scholarship_faqs[$value->faq_question]=htmlspecialchars_decode($value->faq_ans);
                                        
                }
            }else{
                $college_scholarship_faqs=array();
            }

            //print_obj($scholarship_info_data);die;

            if(!empty($scholarship_info_data)){
                $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$scholarship_info_data[0]->info_creator_id));

                $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$scholarship_info_data[0]->info_creator_id),NULL,FALSE);

                if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
                  $curator_image=$user_image->media_disk_path_relative;
                }else{
                  $curator_image=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
                }


                $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';
            }
        }

       $data['info_curator_data']=array(
            'info_curator'=>$info_curator,
            'info_curator_image'=>$curator_image,
            'info_updated'=>(isDateValid($scholarship_info_data[0]->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($scholarship_info_data[0]->info_updated_at)):''
        ); 

        $data['scholarship_data']=$scholarship_detail_data;
        $data['scholarship_info_data']=$scholarship_info_data;
        $data['scholarship_intro_data']=(!empty($scholarship_intro_data))?$scholarship_intro_data->info_value_scholarship_intro:'';
        // $data['college_data']=$college_data;

        $data['scholarship_faqs']=$college_scholarship_faqs;

        //print_obj($data['scholarship_info_data']);die;

        if ($visible) $this->render('front_scholarship_section',$data);
    }
}