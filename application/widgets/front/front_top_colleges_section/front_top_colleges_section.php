<?php


/**
 * 
 */
class Front_top_colleges_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        CI()->load->model(array('settings_model'=>'sm','stream_model'=>'strm','institution_model'=>'im','country_model'=>'com'));

        $total_cost=0;
        $course_cost=0;
        $college_intro_video='';
        $data_count=0;
       
        $default_country_id='99';//(!empty($this->data['default_country_id']))?$this->data['default_country_id']:'99';
        $default_country_iso=$this->data['default_country_iso'];
        $default_currency_symbol_right=$this->data['default_currency_symbol_right'];
        $default_currency_symbol_left=$this->data['default_currency_symbol_left'];

    
        $country_data=CI()->com->get_country(array('country_status'=>'1','country_id'=>$default_country_id));

        //print_obj($country_data);die;


        // $post=array('length'=>'6','start'=>'0');

        //$param['order'] = array('college_is_top_short_order' => 'ASC');

        $param=array('college_status'=>'1','college_is_top'=>'1','college_is_top_visible_home'=>'1');

        $top_colleges=CI()->im->___get__colleges($param,'college_is_top_short_order','ASC');

        //print_obj($top_colleges);die;


        if(!empty($top_colleges)){
            foreach ($top_colleges as $key => $value) {

                $total_reviews=$this->sm->get_total_review_status_data(array('review_approved'=>'approved','review_inst_id'=>$value->college_user_id));

                $total_average_ratings=$this->sm->get_total_average_rating($value->college_user_id);

                if($total_reviews>0 && $total_average_ratings->total_average_rating!=''){
                    $college_total_avg_rating=$total_average_ratings->total_average_rating;
                }else{
                    $college_total_avg_rating='0';
                }

                $_college_banner=CI()->sm->___get_user_file('user_file_type_id,user_storage_type,media_disk_path_relative,media_disk_path',array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
                $_college_logo=CI()->sm->___get_user_file('user_file_type_id,user_storage_type,media_disk_path_relative,media_disk_path',array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));

                if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative) && file_exists($_college_logo->media_disk_path)){
                    $college_logo=$_college_logo->media_disk_path_relative;
                }else{
                    $college_logo=base_url().'uploads/app/default/no.jpeg';
                }

                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative) && file_exists($_college_banner->media_disk_path)){
                    $college_banner=$_college_banner->media_disk_path_relative;
                }else{
                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
                }


                $is_featured=$value->college_is_featured;


                $college_inner_meues='';

                //$cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->college_facilities,TRUE);

                if(!empty($value->college_facilities)){
                    $cfacilities=CI()->sm->get_system_facilities_in('facility_id',$value->college_facilities);

                    foreach ($cfacilities as $k => $v) {
                        $college_facilities[$value->college_user_id][]=array(
                            'facility_name'=>$v->facility_name,
                            'facility_icon_2'=>$v->facility_icon_2,
                            'facility_icon_3'=>base_url('public/data/app/app_data/icon/withoutbackground/'.$v->facility_icon_3)
                        );
                    }
                }else{
                    $cfacilities='';
                    $college_facilities=array();
                }

                if(!empty($value->college_affiliation_type)){
                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$value->college_affiliation_type);

                    $college_affiliations=$caffiliations->concated_value;
                }else{
                    $college_affiliations='';
                }

                //$college_affiliations=$value->college_affiliation_type;


                // if(isset($stream_id) && isset($course_id)){
                //     $college_courses=CI()->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id,'user_course_stream'=>$stream_id),FALSE,3);
                // }else if(!isset($stream_id) && isset($course_id)){
                //     $college_courses=CI()->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),FALSE,3);
                // }else if(isset($stream_id) && !isset($course_id)){
                //     $college_courses=CI()->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,6,FALSE);
                // }else{
                //     $college_courses=CI()->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),FALSE,6);
                // }


                if(isset($stream_id) && isset($course_id)){
                    if(!empty($stream_id) && !empty($course_id)){
                        $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),$stream_id,FALSE,3);
                        //echo '1';
                    }else if(!empty($stream_id) && empty($course_id)){
                        $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),$stream_id,FALSE,6);
                        //echo '2';
                    }else if(empty($stream_id) && !empty($course_id)){
                        $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),null,FALSE,6);
                        //echo '3';
                    }else{
                        $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),null,FALSE,6);
                        //echo '4';
                    }

                }else if(isset($stream_id) && !isset($course_id)){
                    $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),$stream_id,FALSE,6);
                    //echo '5';
                }else if(!isset($stream_id) && isset($course_id)){
                    $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$course_id),null,FALSE,6);
                    //echo '6';
                }else{
                    $college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4'),null,FALSE,6);
                    //echo '7';
                }

                //$college_courses=$this->im->_get_user_course_data(array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$stream_id),FALSE,3);

                //echo $value->college_user_id;

                //print_obj($college_courses);die;


                //print_obj($college_courses);die;


                $firstyear_total=array();

                if(!empty($college_courses)){
                    foreach ($college_courses as $k => $v) {

                        $course=$this->strm->get_course(array('course_id'=>$v->user_course));

                        //echo 'user_course_cost_type:'.$v->user_course_cost_type;'<br>';
                        //echo 'user_course_cost_breakup_type:'.$v->user_course_cost_breakup_type;

                        if($v->user_course_cost_type==1 && $v->user_course_cost_breakup_type==1){

                            if($v->user_course_cost_category!=null){
                                $fees_data=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_cost_category'=>$v->category_name,'user_course_year'=>'1'));

                                //echo $value->college_user_id;

                                //print_obj($fees_data);

                                $total=0;

                                // foreach ($fees_data as $k => $fv) {

                                //  $firstyear_total[]=$fv->user_course_tution_fee_total+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fv->user_course_exam_fee_sem_1+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_total;
                                // }

                                $firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;

                                //print_obj($firstyear_total);


                                $_total=number_format($firstyear_total);


                                $_course_cost='₹ '.$_total;//($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

                                $fees_duration_text='FIRST YEAR FEES';
                            }else{
                                $_fees_data=array();
                                $first_year_fees=0;
                                $total=0;
                                $_course_cost=0;
                                $reg_fee_available='no';
                                $exam_fee_available='no';
                                $fees_duration_text='';
                            }

                                

                        }else if($v->user_course_cost_type==2 && $v->user_course_cost_breakup_type==1){
                            $fees_data=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_cost_category'=>$v->category_name,'user_course_id'=>$v->user_course),FALSE);

                            //print_obj($fees_data);

                            $total=0;

                            $firstyear_total=[];

                            if(!empty($fees_data)){
                                foreach ($fees_data as $k => $fv){
                                    $firstyear_total[]=$fv->user_course_tution_fee_sem_1+$fv->user_course_tution_fee_sem_2+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_admisssion_fee_sem_2+$fv->user_course_reg_fee_sem_1+$fv->user_course_reg_fee_sem_2+$fv->user_course_exam_fee_sem_1+$fv->user_course_exam_fee_sem_2+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_sem_2;

                                }
                            }else{
                                $firstyear_total=array();
                            }
                                

                            $total_1st_year_wise=(!empty($firstyear_total))?$firstyear_total[0]:'0';

                            $_total=number_format($total_1st_year_wise);

                            $_course_cost='₹ '.$_total;//($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

                            $fees_duration_text='FIRST YEAR FEES';
                            

                        }else if($v->user_course_cost_type==1 && $v->user_course_cost_breakup_type==2){
                            $fees_data=$this->im->get_user_course_grand_total(array('user_id'=>$value->college_user_id,'user_course_cost_category'=>$v->category_name,'user_course_id'=>$v->user_course));

                            //print_obj($fees_data);


                            $total=$fees_data[0]->total_cost;

                            $_total=number_format($total,2);

                            $firstyear_total=$_total;

                            $_course_cost='₹ '.$_total;//($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.$_total:$_total.$country_data->currency_symbol_right;

                            $fees_duration_text='TOTAL FEES';
                        }else{
                            $_fees_data=array();
                            $first_year_fees=0;
                            $total=0;
                            $_course_cost=0;
                            $reg_fee_available='no';
                            $exam_fee_available='no';
                            $fees_duration_text='';
                        }                           
                        
                        // $course=$this->strm->get_course(array('course_id'=>$v->user_course));
                        // $cost=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));

                        // $_course_cost=($country_data->currency_symbol_left!='')?$country_data->currency_symbol_left.' '.number_format($cost->user_course_total_fee):number_format($cost->user_course_total_fee).$country_data->currency_symbol_right;

                        // $fees_duration_text='FIRST YEAR FEES';

                        if(!empty($course->course_short_name)){
                            $course_formatted_name=(!empty($fees_duration_text))?$course->course_short_name.' - '.$fees_duration_text:$course->course_short_name;
                        }else{
                            $course_formatted_name=(!empty($fees_duration_text))?$course->course_name.' - '.$fees_duration_text:$course->course_name;
                        }

                        $_course_cost_data[$value->college_user_id][]=array(
                            'cost_value'=>($firstyear_total>0)?$_course_cost:'',
                            'course_name'=>$course_formatted_name
                        );
                    }
                }else{
                    $_course_cost_data=array();
                }

               //print_obj($_course_cost_data);die;


               //die;

                //print_obj($_course_cost_data);die;

                $current_year=date('Y');

                $college_ranks=CI()->im->_get_inst_ranking_data(array('ranking_inst_id'=>$value->college_user_id,'ranking_inst_type'=>'college'),FALSE);

                if(!empty($college_ranks)){
                    foreach ($college_ranks as $k => $v) {
                        $_ranking_data[$value->college_user_id][]=array(
                            'rank_body'=>$v->rank_body,
                            'rank_value'=>$v->rank_value,
                            'ranking_value'=>$v->ranking_value,
                            'rank_year'=>$v->ranking_year
                        );
                    }
                }else{
                    $_ranking_data=array();
                }

                $exams_accepted=CI()->strm->get_user_courses_exam(array('user_type'=>'4','user_id'=>$value->college_user_id),FALSE,'exam_id','ASC','3','exam_id,exam_name');

                if(!empty($exams_accepted)){
                    foreach ($exams_accepted as $k => $v) {
                        $exam_slug=CI()->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$v->exam_id));
                        $_exams_accepted[$value->college_user_id][]=array(
                            'exam_id'=>$v->exam_id,
                            'exam_name'=>$v->exam_name,
                            'exam_link'=>(!empty($exam_slug))?base_url('exams/'.$exam_slug->slug_value):'javascript::void(0);'
                        );
                    }
                }else{
                    $_exams_accepted=array();
                }

                $total_gallery_img=CI()->sm->get_total_user_files(array('user_file_type_id'=>$value->college_user_id,'user_file_type'=>'4'));

                $menu_link_type=($value->college_utype=='4')?'10':'101';

                $college_info_menu=CI()->sm->get_menues(array('menu_type'=>'1','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
                $college_courses_menu=CI()->sm->get_menues(array('menu_type'=>'2','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
                $college_gallery_menu=CI()->sm->get_menues(array('menu_type'=>'7','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));
                $college_admission_menu=CI()->sm->get_menues(array('menu_type'=>'3','menu_link_type'=>$menu_link_type,'menu_link_id'=>$value->college_user_id));

                //if(!empty($_course_cost_data) && isset($_course_cost_data[$value->college_user_id]) && !empty($_course_cost_data[$value->college_user_id])){
                    $college_data[]=array(
                        'college_id'=>encode_data($value->college_user_id),
                        'college_name'=>strtoupper(strtolower($value->college_name)),
                        'college_city'=>$value->city_name,
                        'college_state'=>$value->state_name,
                        'college_country_id'=>encode_data($value->college_country_id),
                        'college_country'=>$value->country_name,
                        'college_total_course_amount'=>number_to_currency($total_cost),
                        'college_total_course_amount_with_currency'=>$course_cost,
                        'college_logo'=>$college_logo,
                        'college_banner'=>$college_banner,
                        'college_intro_video'=>$college_intro_video,
                        'college_inner_menues'=>$college_inner_meues,
                        'college_affiliations'=>$college_affiliations,
                        'is_featured'=>$is_featured,
                        'college_has_verified_badge'=>($value->college_has_verified_badge!=null)?$college_has_verified_badge:'no',
                        'access_url'=>$value->access_url,
                        'college_country_phone_code'=>$country_data->country_phone_code,
                        'college_facilities'=>(!empty($value->college_facilities))?$college_facilities[$value->college_user_id]:null,
                        'college_courses'=>$college_courses,
                        'college_courses_cost'=>(!empty($college_courses))?$_course_cost_data[$value->college_user_id]:'N/A',
                        'college_course_fees_link'=>(!empty($college_courses_menu))?$college_courses_menu->menu_link:'',
                        'college_reviews_link'=>$value->access_url.'/review',
                        'college_admissions_link'=>(!empty($college_admission_menu))?$college_admission_menu->menu_link:'',
                        'college_gallery_link'=>(!empty($college_gallery_menu))?$college_gallery_menu->menu_link:'',
                        'college_ranks'=>(!empty($college_ranks))?$_ranking_data[$value->college_user_id]:null,
                        'college_total_review'=>$total_reviews,
                        'college_total_avg_rating'=>$college_total_avg_rating,
                        'college_exams_accepted'=>(!empty($exams_accepted))?$_exams_accepted[$value->college_user_id]:'',
                        'college_total_gallery_img'=>$total_gallery_img,
                        'institute_type'=>encode_data(7)
                    );
               // }

                    

            }

            //die;
        }

        //print_obj($college_data);die;


        $data=array(
            'view_type'=>'home_view',
            'top_colleges'=>$college_data,
            'explore_all_access_url'=>base_url($default_country_iso.'/colleges'),
            'data_count'=>$data_count
        );


        //print_obj($data);die;


        if ($visible) $this->render('front_top_colleges_section',$data);
    }
}