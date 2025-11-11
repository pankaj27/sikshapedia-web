<?php


/**
 * 
 */
class Front_exams_list_section extends Widget
{
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //exams
        //$segment_2=$this->uri->segment(2,0); //college,university url


        $_streams=array();

		if(is_string($segment_1) && $segment_1=='exams'){
			
			$streams=$this->strm->get_streams_with_exam_url(array('stream_status'=>'1','url_type'=>'exam_stream'));

			//print_obj($streams);die;

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));
					//$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
					$exams=$this->strm->get_indset_exam('exam_stream_id',$value->stream_id,false,array('url_type'=>'exam'),7,'exam_id','ASC',FALSE);

					$total_exam_count=$this->strm->get_inset_exam_count('exam_stream_id',$value->stream_id);

					$exempted_count=($total_exam_count-7);

					//print_obj($exams[$value->stream_id]);

					if(!empty($exams) && count($exams)>=7){

						$_exam=array();


						foreach ($exams as $k => $v) {

							$slug=$this->sm->get_slug(array('slug_type'=>10,'slug_type_id'=>$v->exam_id));
							$_exams[$value->stream_id][]=array(
								'exam_id'=>$v->exam_id,
								'exam_short_name'=>$v->exam_short_name,
								'exam_full_name'=>$v->exam_full_name,
								'exam_url'=>base_url('/exams/'.$slug->slug_value)
							);
						}


						$_streams[]=array(
							'stream_id'=>$value->stream_id,
							'stream_crypted_id'=>encode_data($value->stream_id),
							'stream_name'=>strtoupper($value->stream_name),
							'stream_url'=>base_url('/exams/'.url_slug($value->stream_name)),
							'stream_exams'=>$_exams[$value->stream_id],
							'stream_icon'=>$icon->icon_value,
							'stream_access_url'=>$value->url_value,
							'stream_total_more_exams'=>$exempted_count					
						);
					}	
				}

				
			}

			

			//print_obj($_streams);die;

			$this->data['streams']=$_streams;
				
		}

    	$data['streams']=$_streams;
        if ($visible) $this->render('front_exams_list_section',$data);
    }
	
	function run_old($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url


        $_streams=array();

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='exams')){

			$country=$this->com->get_country(array('country_iso_code_2'=>strtoupper($segment_1)));

			if(!empty($country)){
				$streams=$this->strm->get_streams_with_exam_url(array('stream_status'=>'1','url_type'=>'exam_stream'));

				//print_obj($streams);die;

				if(!empty($streams)){
					foreach ($streams as $key => $value) {
						$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));
						//$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
						$exams=$this->strm->get_indset_exam('exam_stream_id',$value->stream_id,TRUE,array('url_type'=>'exam','exam_country'=>$country->country_id),5,'exam_id','ASC');

						$_streams[]=array(
							'stream_id'=>encode_data($value->stream_id),
							'stream_name'=>strtoupper($value->stream_name),
							'stream_icon'=>$icon->icon_value,
							'stream_access_url'=>$value->url_value,
							'stream_exams'=>$exams
						);
					}

					
				}

				//print_obj($_streams);die;

				$this->data['streams']=$_streams;
			}	
		}

    	$data['streams']=$_streams;
        if ($visible) $this->render('front_exams_list_section',$data);
    }
}