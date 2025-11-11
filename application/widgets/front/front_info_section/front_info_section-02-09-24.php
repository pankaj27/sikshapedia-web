<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_info_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

        CI()->load->model(array('institution_model'=>'im','stream_model'=>'strm','user_model'=>'um'));

    	
     	  //print_obj($ids);die;

        $infos_data=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];
        $college_info_type=$ids['college_info_type'];

        $system_name=$this->data['system_name'];

        $_college_data=CI()->im->___get_college_profile_data('college_name,college_user_id,college_university_id,college_affiliation_type,college_estd_year,college_web_address,inst_type_name',array('college_user_id'=>$college_id));

        $college_university=CI()->im->__get_college_profile_data('college_name',array('college_user_id'=>$_college_data->college_university_id));

        $college_highlights_heading=ucwords(strtolower($_college_data->college_name)).' Highlights';
        $college_facilities_heading=ucwords(strtolower($_college_data->college_name)).' Facilities';

        if(!empty($_college_data->college_affiliation_type)){
            $caffiliations=CI()->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$_college_data->college_affiliation_type);

            $college_affiliations=$caffiliations->concated_value;
        }else{
            $college_affiliations='';
        }

        $facilities='';

        $popular_courses=CI()->im->_get_group_concat_user_course_data(array('is_popular'=>'1','user_id'=>$_college_data->college_user_id));

        $user_courses_exams=CI()->strm->get_user_courses_exam(array('user_id'=>$_college_data->college_user_id,'user_type'=>$college_info_type),FALSE);

        if($_college_data->college_web_address!=NULL){
            $college_highlights=array(                
              'Established'=>$_college_data->college_estd_year,
              'Type'=>ucwords($_college_data->inst_type_name),
              'Approved by'=>$college_affiliations,
              'Affiliated to'=>$college_university->college_name,
              'Popular Courses'=>$popular_courses->concated_value,
              'Facilities Available'=>$facilities,
              'Entrance Examinations'=>(!empty($user_courses_exams))?'Yes':'No',
              'Official Website'=>$_college_data->college_web_address
            );
        }else{
          $college_highlights=array(                
            'Established'=>$_college_data->college_estd_year,
            'Type'=>ucwords($_college_data->inst_type_name),
            'Approved by'=>$college_affiliations,
            'Affiliated to'=>$college_university->college_name,
            'Popular Courses'=>$popular_courses->concated_value,
            'Facilities Available'=>$facilities,
            'Entrance Examinations'=>(!empty($user_courses_exams))?'Yes':'No',
          );
        }

       

    		$info=CI()->im->get_inst_info_data(array('info_type_id'=>$college_id,'info_type_2'=>'general_info','info_type'=>'2','info_value_type'=>'2'));


    		//print_obj($info);die;

    		$uploaded_by=CI()->um->_get_internal_user(array('user_id'=>$info->info_creator_id));

        $user_image=CI()->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$info->info_creator_id),NULL,FALSE);

        if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
          $curator_image=$user_image->media_disk_path_relative;
        }else{
          $curator_image=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
        }


        $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';

        $college_faqs=CI()->sm->get_system_users_faqs_data(array('faq_data_id'=>$college_id,'faq_data_id_type'=>'2','faq_type'=>'1'),FALSE);

        if(!empty($college_faqs)){
          foreach ($college_faqs as $key => $value) {
            $faqs[$value->faq_question]=html_entity_decode ($value->faq_ans);
          }
        }else{
          $faqs=array();
        }

        $college_ranking_data=CI()->im->_get_inst_ranking_data(array('ranking_inst_type'=>'college','ranking_inst_id'=>$college_id));

        $param=array(
              'order'=>array('user_course_id' => 'ASC'),
              'user_type'=>'4',
              'user_id'=>$_college_data->college_user_id
            );

        $_course_fees_data = CI()->im->_get_users_courses(null,$param,FALSE,FALSE);

        

        if(!empty($_course_fees_data)){
          foreach ($_course_fees_data as $key => $value) {
            $user_course_streams=CI()->strm->get_group_concat_user_course_stream_data('stream_name',array('user_id'=>$college_id,'course_id'=>$value->user_course_id),FALSE);
            $_user_course_data[]=array(
              'course_full_name'=>strtoupper($value->course_name),
              'course_short_name'=>strtoupper($value->course_short_name),
              'course_specialization'=>$user_course_streams->concated_value ,
              'course_duration'=>$value->user_course_duration_year,
              'course_eligibility'=>$value->user_course_eligibility,
              'course_eligibility_desc'=>$value->user_course_eligibility_broad,
            );
          }
        }else{
          $_user_course_data=array();
        }

    		$infos_data=array(
          'info_college'=>$_college_data,
    			'info_curator'=>$info_curator,
    			'info_curator_image'=>$curator_image,
    			'info_updated'=>(isDateValid($info->info_updated_at))?'Updated on - '.date('F dS, Y',strtotime($info->info_updated_at)):'',
          'info_college_highlights_heading'=>$college_highlights_heading,
          'info_college_highlights'=>$college_highlights,
          'info_college_intro'=>$info->info_value,
          'info_college_course_intro'=>$info->info_value_course_intro,
          'info_college_course_brief'=>$_user_course_data,
          'info_college_ranking_intro'=>$info->info_value_ranking_intro,
          'intro_college_ranking_data'=>null,//$college_ranking_data,
          'info_college_about'=>$info->info_value_about,
          'intro_college_faqs'=>$faqs
    		);    

        $data['college_intro_data']=$infos_data;

         //print_obj($data);

        if ($visible) $this->render('front_info_section',$data);
	}
}