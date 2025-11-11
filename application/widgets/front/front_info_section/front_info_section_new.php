<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_info_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	// $segment_1=$this->uri->segment(1,0); //country
     	// $segment_2=$this->uri->segment(2,0); //college,university url

        $infos_data=array();

        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $system_general_settings=$this->sm->get_settings(array('settings_key'=>'config_system_general_settings'));
        $settings_value=(!empty($system_general_settings->settings_value))?json_decode($system_general_settings->settings_value):'';

        $system_name=($settings_value!='')?$settings_value->system_name:'Waytoadmissions';


       
        	$country_data=$this->com->get_country(array('country_id'=>$country_id));

        	if(!empty($country_data)){
        		$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

				if(!empty($_college_data)){
					$info=$this->im->get_inst_info_data(array('info_type_id'=>$college_id));

					// print_obj($info);die;

					$college_university=$this->im->get_university_profile_data(array('university_user_id'=>$_college_data->college_university_id));

					$college_type=$this->im->get_institute_types(array('inst_type'=>$_college_data->college_type));

					if(!empty($_college_data->college_facilities)){
	                    $f=$this->sm->get_group_concat_system_facilities('facility_name','facility_id',$_college_data->college_facilities);
	                    $facilities=$f->concated_value;
	                }else{
	                    $facilities='';
	                }

	                $_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id),FALSE,'menu_serial','ASC');

			        if(!empty($_inner_menu)){
			        	$i=0;
			        	foreach ($_inner_menu as $k => $v) {					        		
			        		$inner_menu[$v->menu_type_alias_name][]=array(
			        			'menu_name'=>ucwords($_college_data->college_name).' '.$v->menu_name,
			        			'menu_link'=>$v->menu_link,
			        		);
			        	}
			        }else{
			        	$inner_menu=array();
			        }

	                $college_highlights_heading=ucwords(strtolower($_college_data->college_name)).' Highlights';
	                $college_facilities_heading=ucwords(strtolower($_college_data->college_name)).' Facilities';

	                if(!empty($_college_data->college_affiliation_type)){
	                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$_college_data->college_affiliation_type);

	                    $college_affiliations=$caffiliations->concated_value;
	                }else{
	                    $college_affiliations='';
	                }

	                $popular_courses=$this->im->_get_group_concat_user_course_data(array('is_popular'=>'1','user_id'=>$_college_data->college_user_id));

	                $user_courses_exams=$this->strm->get_user_courses_exam(array('user_id'=>$_college_data->college_user_id,'user_type'=>'4'),FALSE);

	                if($_college_data->college_web_address!=NULL){
	                	$college_highlights=array(								
							'Established'=>$_college_data->college_estd_year,
							'Type'=>ucwords($college_type->inst_type_name),
							'Approved by'=>$college_affiliations,
							'Affiliated to'=>$college_university->university_name,
							'Popular Courses'=>$popular_courses->concated_value,
							'Facilities Available'=>$facilities,
							'Entrance Examinations'=>(!empty($user_courses_exams))?'Yes':'No',
							'Official Website'=>$_college_data->college_web_address
						);
	                }else{
	                	$college_highlights=array(								
							'Established'=>$_college_data->college_estd_year,
							'Type'=>ucwords($college_type->inst_type_name),
							'Approved by'=>$college_affiliations,
							'Affiliated to'=>$college_university->university_name,
							'Popular Courses'=>$popular_courses->concated_value,
							'Facilities Available'=>$facilities,
							'Entrance Examinations'=>(!empty($user_courses_exams))?'Yes':'No',
						);
	                }

					

					$courses_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'course_fees'));
					$placement_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'placement'));
					$cutoff_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'cutoff'));


					$admission_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'admission'));

					$scholarship_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'scholarships'));

					$hostel_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'hostel'));


					$faculty_inner_menu=$this->sm->get_menu_types_with_menu(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$_college_data->college_user_id,'menu_type_alias_name'=>'faculty'));


					$college_faqs=$this->sm->get_system_users_faqs_data(array('faq_data_id'=>$_college_data->college_user_id,'faq_data_id_type'=>'2'),FALSE);

					if(!empty($college_faqs)){
						foreach ($college_faqs as $key => $value) {
							$faqs[$value->faq_question]=$value->faq_ans;
						}
					}else{
						$faqs=array();
					}


					//print_obj($faqs);die;

					$param=array(
	        			'order'=>array('user_course_id' => 'ASC'),
	        			'user_type'=>'4',
	        			'user_id'=>$_college_data->college_user_id
        			);

					$_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);

					

					if(!empty($_course_fees_data)){
						foreach ($_course_fees_data as $key => $value) {
							$user_course_streams=$this->strm->get_group_concat_user_course_stream_data('stream_name',array('user_id'=>$_college_data->college_user_id,'course_id'=>$value->user_course_id),FALSE);
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


					$user_courses_exams=$this->strm->_get_user_courses_exam_by_group(array('user_id'=>$_college_data->college_user_id,'user_type'=>'4'));

					if(!empty($user_courses_exams)){
						$uexams=$this->strm->get_user_courses_exam(array('user_id'=>$_college_data->college_user_id,'user_type'=>'4'),FALSE);

						foreach ($uexams as $k => $v) {
							$_uexams[]=array(
								'exam_name'=>$v->exam_name,
								'exam_link'=>''
							);
						}
						foreach ($user_courses_exams as $key => $value) {									

							$_user_courses_exams[]=array(
								'course'=>$value->course_short_name,
								'course_exams'=>$_uexams
							);
						}
					}else{
						$_user_courses_exams=array();
					}

					//print_obj($_college_data);

					$user_data_created_by=$this->um->_get_internal_user(array('user_id'=>$_college_data->created_by));
					$user_data_updated_by=$this->um->_get_internal_user(array('user_id'=>$_college_data->updated_by));

					

					//print_obj($internal_user_data);die;

					if(!empty($user_data_created_by)){

						if($user_data_updated_by!=''){
							$info_curator=($user_data_created_by->user_fullname!='')?ucwords($user_data_created_by->user_fullname).' & '.ucwords($user_data_updated_by->user_fullname).' - '.$system_name:$system_name;
						}else{
							$info_curator=($internal_user_data->user_fullname!='')?ucwords($internal_user_data->user_fullname).' - '.$system_name:$system_name;
						}
						
					}else{
						$info_curator=($user_data_updated_by->user_fullname!='')?ucwords($user_data_updated_by->user_fullname).' - '.$system_name:$system_name;
					}

					$college_ranking_data=$this->im->_get_inst_ranking_data(array('ranking_inst_type'=>'college','ranking_inst_id'=>$_college_data->college_user_id));

					//print_obj($college_ranking_data);die;

					$infos_data=array(
						'info_curator'=>$info_curator,
						'info_updated'=>(isDateValid($_college_data->updated_at))?'Updated on - '.date('F dS, Y',strtotime($_college_data->updated_at)):'',
						'info_college_highlights_heading'=>$college_highlights_heading,
						'info_college_highlights'=>$college_highlights,
						'info_college_intro'=>$info->info_value,
						'info_college_ranking_intro'=>$info->info_value_ranking_intro,
						'intro_college_ranking_data'=>$college_ranking_data,
						'info_college_about'=>$info->info_value_about,
						'info_college_course_intro'=>$info->info_value_course_intro,
						'info_college_course_brief'=>$_user_course_data,
						'intro_college_course_knowmore_url_text'=>ucwords($_college_data->college_name).' '.$courses_inner_menu->menu_name,
						'intro_college_course_knowmore_url'=>$courses_inner_menu->menu_link,								
						'info_college_admission_intro'=>$info->info_value_admission_intro,
						'intro_college_admission_url_text'=>ucwords($_college_data->college_name).' '.$admission_inner_menu->menu_name,
						'intro_college_admission_url'=>$admission_inner_menu->menu_link,
						'info_college_cutoff_intro'=>$info->info_value_cutoff_intro,
						'intro_college_cutoff_knowmore_url_text'=>ucwords($_college_data->college_name).' '.$cutoff_inner_menu->menu_name,
						'intro_college_cutoff_knowmore_url'=>$cutoff_inner_menu->menu_link,
						'info_college_placement_intro'=>$info->info_value_placement_intro,
						'intro_college_placement_knowmore_url_text'=>ucwords($_college_data->college_name).' '.$placement_inner_menu->menu_name,
						'intro_college_placement_knowmore_url'=>$placement_inner_menu->menu_link,
						'info_college_scholarship_intro'=>$info->info_value_scholarship_intro,
						'intro_college_scholarship_url_text'=>ucwords($_college_data->college_name).' '.$scholarship_inner_menu->menu_name,
						'intro_college_scholarship_url'=>$scholarship_inner_menu->menu_link,
						'info_college_facilities_heading'=>$college_facilities_heading,
						'info_college_facilities_intro'=>$info->info_value_facilities_intro,
						'intro_college_hostel_url_text'=>ucwords($_college_data->college_name).' '.$hostel_inner_menu->menu_name,
						'intro_college_hostel_url'=>$hostel_inner_menu->menu_link,
						'intro_college_faculty_intro'=>$info->info_value_faculty_intro,
						'intro_college_faculty_url_text'=>ucwords($_college_data->college_name).' '.$faculty_inner_menu->menu_name,
						'intro_college_faculty_url'=>$faculty_inner_menu->menu_link,
						'intro_college_faqs'=>$faqs,
						'intro_exam_data'=>$_user_courses_exams
					);

					//print_obj($infos_data);die;
				}
        	}
        

        $data['college_intro_data']=$infos_data;

       //print_obj($data);

        if ($visible) $this->render('front_info_section',$data);
	}
}