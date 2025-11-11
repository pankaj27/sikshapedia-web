<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Front_course_choose_by_interest_section extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);

    	$slug_1=$this->uri->segment(1,0);
		$slug_2=$this->uri->segment(2,0);

		$categories=array();
		$streams=array();
		$_degrees=array();

		// if((is_string($slug_1) && $slug_1!='0') && (is_string($slug_2) && $slug_2=='courses')){

		if((is_string($slug_1) && $slug_1=='courses')){

			//$country=$this->com->get_country(array('country_iso_code_2'=>strtoupper($slug_1)));

			$streams=$this->strm->get_stream(array('stream_status'=>'1','stream_show_in_widget'=>'1'),FALSE,'stream_serial','ASC');

			if(!empty($streams)){
				foreach ($streams as $key => $value) {
					$stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_type_id'=>$value->stream_id));
					$icon=$this->strm->get_system_icon(array('icon_id'=>$value->stream_icon_id));

					if(!empty($stream_slug)){
						$stream_slug=base_url('courses/'.$stream_slug->slug_value);

						$stream_slug_url_found=$this->sm->get_slug_urls(array('url_value'=>$stream_slug));

						if(!empty($stream_slug_url_found)){
							$streams_data[]=array(
								'stream_id'=>$value->stream_id,
		            			'stream_name'=>$value->stream_name,
		            			'stream_icon'=>$icon->icon_value,
		            			'stream_access_url'=>$stream_slug			
		            		);
						}
					}	
				}

				//print_obj($streams_data);die;


				if(!empty($streams_data)){
					foreach ($streams_data as $key => $value) {
						$stream_top_degrees=$this->strm->get_degree(array('degree_stream_id'=>$value['stream_id'],'degree_is_top'=>'1'),FALSE);						

						if(!empty($stream_top_degrees)){
							foreach ($stream_top_degrees as $k => $v) {
								$degree_slug=$this->sm->get_slug(array('slug_type_id'=>$v->degree_id,'slug_type'=>'9'));

								if(!empty($degree_slug)){
									$slug_url=base_url('courses/'.$degree_slug->slug_value);

									$slug_url_found=$this->sm->get_slug_urls(array('url_value'=>$slug_url_found));

									if(!empty($slug_url_found)){
										$_degrees[$value['stream_id']][]=array(
											'degree_name'=>$v->degree_name,
											'degree_access_url'=>$slug_url
										);
									}
								}										
							}						
						}
					}
				}			
			}
	
		}

		$data['streams']=$streams_data;
		$data['stream_degrees']=$_degrees;

		if ($visible) $this->render('front_course_choose_by_interest_section',$data);
	}
}