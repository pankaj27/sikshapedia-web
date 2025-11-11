<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_exam_list_details_section extends Widget
{
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

  //   	$segment_1=$this->uri->segment(1,0);//country
		// $segment_2=$this->uri->segment(2,0);//static segment "exams"
		// $segment_3=$this->uri->segment(3,0);//exam stream name
		// $segment_4=$this->uri->segment(4,0);//exam stream name


		$segment_1=$this->uri->segment(1,0);//static segment "exams"
		$segment_2=$this->uri->segment(2,0);//exam stream name
		//$segment_4=$this->uri->segment(4,0);//exam stream name

		$_exams=array();


		if((is_string($segment_1) && $segment_1=='exams')){
			//$country_data=$this->com->get_country(array('country_iso_code_2'=>strtoupper($segment_1)));
			//if(!empty($country_data)){
				if(is_string($segment_2) && $segment_2!='0'){
					$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_value'=>$segment_2));	
					if(!empty($stream_slug)){
						$slug_type_id=$stream_slug->slug_type_id;
						$stream_data=$this->strm->get_stream(array('stream_id'=>$slug_type_id));

						$param['country']=$country_data->country_id;
						$param['stream_ids']=$stream_data->stream_id;
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

									$exams_application_dates=array(
										'start_date'=>strtoupper(date('d M y',strtotime($exam_year_data->exam_application_start_date))),
										'end_date'=>strtoupper(date('d M y',strtotime($exam_year_data->exam_application_end_date))),
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

									$exams_result_dates=array(
										'start_date'=>$start_date,
										'end_date'=>$end_date,
										'exam_formatted_date'=>$exam_formatted_date,
										'dates_active'=>'1'
									);
								}else{
									$exams_result_dates=array();
								}

								$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

				    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
				                    $exam_logo=$_exam_logo->media_disk_path_relative;
				                }else{
				                    $exam_logo=base_url().'uploads/app/default/no.jpg';
				                }

				                // $exam_link=base_url('exams/'.$segment_2.'/'.strtolower($value->exam_short_name));


				                $exam_link=base_url('exams/'.strtolower($value->exam_short_name));

				                $menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$value->exam_id,'menu_show_in_exam_list'=>'1'),FALSE);

				                if(!empty($menues)){
									foreach ($menues as $k => $v) {
										$_menues[$value->exam_id][]=array(
											'menu_id'=>$v->menu_id,
											'menu_name'=>$v->menu_name,
											'menu_link'=>$exam_link.'/'.$v->menu_slug
										);
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
					}
				}
			//}
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