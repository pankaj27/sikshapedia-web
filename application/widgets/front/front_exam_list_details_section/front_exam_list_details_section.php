<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_exam_list_details_section extends Widget
{
	function run($visible = FALSE,$country_id=0,$stream_id=0,$states=null,$app_mode=null,$exam_mode=null,$length=10,$start=0) {
		$this->front_theme='default';
    	$this->get_type(2);

 		$stream_data=$this->strm->get_stream(array('stream_id'=>$stream_id));

		$param['country']=$country_id;
		$param['stream_ids']=$stream_id;

		if(!empty($states)){
			$param['exam_states']=$states;
		}

		if(!empty($app_mode)){
			$param['exam_application_mode']=$app_mode;
		}

		if(!empty($exam_mode)){
			$param['exam_mode']=$exam_mode;
		}

		$post['length']=$length;
		$post['start']=$start;
		$exams=$this->strm->_get_exams(null,$param,FALSE,FALSE);

		//print_obj($exams);die;

		if(!empty($exams)){
			$current_year=date('Y');
			$current_date=date('Y-m-d');
			foreach ($exams as $key => $value) {

				$exam_year_data=$this->strm->get_exam_detailed_data(array('exam_year'=>$current_year,'exam_pk_id'=>$value->exam_id));

				//print_obj($exam_year_data);die;

				if($exam_year_data->exam_application_start_date!=null){

					if(($current_date<$exam_year_data->exam_application_start_date)){
						$dates_active='1';
					}else{
						$dates_active='2';
					}

					$start_date=strtoupper(date('d M y',strtotime($exam_year_data->exam_application_start_date)));
					$end_date=(!empty($exam_year_data->exam_application_end_date))?strtoupper(date('d M y',strtotime($exam_year_data->exam_application_end_date))):null;

					$formatted_date=($end_date!=null)?$start_date.'-'.$end_date:$start_date;

					$exams_application_dates=array(
						'start_date'=>$start_date,
						'end_date'=>$end_date,
						'formatted_date'=>$formatted_date,
						'dates_active'=>$dates_active
					);
				}else{
					$exams_application_dates=array();
				}


				if($exam_year_data->exam_start_date!=null){

					if($exam_year_data->exam_end_date!=null){
						if($exam_year_data->exam_start_date>=$current_date){
							$dates_active='1';
						}else{
							$dates_active='2';
						}
					}else{
						if($exam_year_data->exam_start_date>=$current_date){
							$dates_active='1';
						}else{
							$dates_active='2';
						}
					}

					$start_date=strtoupper(date('d M y',strtotime($exam_year_data->exam_start_date)));
					$end_date=($exam_year_data->exam_end_date!=null)?strtoupper(date('d M y',strtotime($exam_year_data->exam_end_date))):null;

					if($end_date!=null){
						$exam_formatted_date=$start_date.'-'.$end_date;
					}else{
						$exam_formatted_date=$start_date;
					}
						

					$exams_dates=array(
						'start_date'=>strtoupper(date('d M y',strtotime($exam_year_data->exam_start_date))),
						'end_date'=>($exam_year_data->exam_end_date!=null)?strtoupper(date('d M y',strtotime($exam_year_data->exam_end_date))):null,
						'exam_formatted_date'=>$exam_formatted_date,
						'dates_active'=>$dates_active
					);
				}else{
					$exams_dates=array();
				}

				if($exam_year_data->exam_result_start_date!=null){


					$start_date=($exam_year_data->exam_result_start_date!=null)?strtoupper(date('d M y',strtotime($exam_year_data->exam_result_start_date))):null;

					$end_date=($exam_year_data->exam_result_end_date!=null)?strtoupper(date('d M y',strtotime($exam_year_data->exam_result_end_date))):null;


					if($end_date!=null){
						$exam_formatted_date=$start_date.'-'.$end_date;
					}else{
						$exam_formatted_date=$start_date;
					}

					if($exam_year_data->exam_end_date!=null){
						if($exam_year_data->exam_result_start_date>=$current_date){
							$rdates_active='1';
						}else{
							$rdates_active='2';
						}
					}else{
						if($exam_year_data->exam_result_start_date>=$current_date){
							$rdates_active='1';
						}else{
							$rdates_active='2';
						}
					}

					$exams_result_dates=array(
						'start_date'=>$start_date,
						'end_date'=>$end_date,
						'exam_formatted_date'=>$exam_formatted_date,
						'dates_active'=>$rdates_active
					);
				}else{
					$exams_result_dates=array();
				}

				$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
                    $exam_logo=$_exam_logo->media_disk_path_relative;
                }else{
                    $exam_logo=base_url('public/data/users/2022/pVFvqPQhkM.webp');
                }

                // $exam_link=base_url('exams/'.$segment_2.'/'.strtolower($value->exam_short_name));

                //$slug_url=$this->sm->get_slug_urls(array('url_type'=>'exam','url_type_id'=>$value->exam_id));

                $slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));

                $exam_link=(!empty($slug))?base_url('exams/'.$slug->slug_value):base_url('exams');//$slug_url->url_value;

                // $menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$value->exam_id,'menu_show_in_exam_list'=>'1'),FALSE);

                $menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$value->exam_id),FALSE);

                if(!empty($menues)){
					foreach ($menues as $k => $v) {

						$param=array('exam_id'=>$value->exam_id,'exam_menu_id'=>$v->menu_id,'exam_data_type!='=>'faq');
				        $exam_details_data=$this->strm->get_exam_details_data($param,FALSE,'exam_serial','ASC');

				        if(!empty($exam_details_data)){

				        	if(in_array($v->menu_slug,array('pattern-and-syllabus','overview','syllabus'))){
				        		if($v->menu_name=='Overview'){
					        		$menu_link=$exam_link;
					        	}else{
					        		$menu_link=$exam_link.'/'.$v->menu_slug;
					        	}

					        	$_menues[$value->exam_id][]=array(
									'menu_id'=>$v->menu_id,
									'menu_name'=>$v->menu_name,
									'menu_link'=>$menu_link
								);
				        	}

					        	
				        }
							
					}
				}



				$_exams[]=array(
					'exam_short_name'=>$value->exam_short_name,
					'exam_full_name'=>$value->exam_full_name,
					'exam_desc'=>$value->exam_description,
					'exam_mode'=>char_separated_to_array($value->exam_mode),
					'exam_year_short_name'=>$exam_year_data->exam_year_short_name,
					'exam_year_desc'=>$exam_year_data->exam_year_description,
					'exam_application_form_dates'=>$exams_application_dates,
					'exam_dates'=>$exams_dates,
					'exam_result_dates'=>$exams_result_dates,
					'exam_logo'=>$exam_logo,
					'exam_link'=>$exam_link,
					'exam_menues'=>$_menues[$value->exam_id]
				);
			}
		}

		//print_obj($_exams);die;

		$data['exams_list']=array_chunk($_exams,4);

		// foreach ($data['exams_list'] as $key => $value) {
		// 	//print_obj($value);

		// 	foreach ($value as $k => $v) {
		// 		print_obj($v);
		// 	}
		// }

		// die;

		// print_obj($data);die;


        if ($visible) $this->render('front_exam_list_details_section',$data);
    }
}