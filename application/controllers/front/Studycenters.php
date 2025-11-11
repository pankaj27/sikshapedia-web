<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Studycenters extends BaseFrontController
{
    public function index(){
        $segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course or stream
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course or exam or ranking

		$c_type=$this->input->get('ctype');
		$appr=$this->input->get('appr');

		$aff=$this->input->get('aff');

		$c_cate=$this->input->get('c_cate');

		$agn=$this->input->get('agn');

		$state_id='';
		$_state_id='';
		$city_id='';
		$_city_id='';
		$course_id='';
		$stream_id='';
		$exam_id='';
		$rank_id='';
		$ctype_id='';
		$appr_id='';
		$aff_id='';
		$c_cate_id='';
		$agn_id='';

		//rint_obj($segment_3);die;

		$current_url= current_url();

		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='study-center')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){
				if(is_string($segment_2) && $segment_2=='study-center'){

					$current_url_slug=$this->sm->__get_slug_urls('url_id,url_value',array('url_value'=>$current_url));

					if(!empty($current_url_slug)){
						if($segment_3!='0'){
							
							$segment_3_slug=$this->sm->get_slug(array('slug_value'=>$segment_3));

							//print_obj($segment_3_slug);die;

							$segment_3_slug_type=$segment_3_slug->slug_type;

							//echo $segment_3_slug->slug_type_id;die;

							if($segment_3_slug_type=='1'){
								$state_id=encode_data($segment_3_slug->slug_type_id);
								$_state_id=$segment_3_slug->slug_type_id;
							}else if($segment_3_slug_type=='2'){
								$city_id=encode_data($segment_3_slug->slug_type_id);
								$_city_id=$segment_3_slug->slug_type_id;
							}else if($segment_3_slug_type=='3'){
								$stream_id=encode_data($segment_3_slug->slug_type_id);
								$_stream_id=$segment_3_slug->slug_type_id;
							}else if($segment_3_slug_type=='5'){
								$course_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='10'){
								$exam_id=encode_data($segment_3_slug->slug_type_id);
							}
						}

						//echo $segment_4;die;


						if($segment_4!='0'){
							$segment_4_slug=$this->sm->get_slug(array('slug_value'=>$segment_4));

							$segment_4_slug_type=$segment_4_slug->slug_type;

							//print_obj($segment_4_slug_type);die;

							if($segment_4_slug_type=='2'){
								$city_id=encode_data($segment_4_slug->slug_type_id);
								$_city_id=$segment_4_slug->slug_type_id;
							}else if($segment_4_slug_type=='3'){
								$stream_id=encode_data($segment_4_slug->slug_type_id);
								$_stream_id=$segment_4_slug->slug_type_id;
							}else if($segment_4_slug_type=='5'){
								$course_id=encode_data($segment_4_slug->slug_type_id);
							}
						}

						if($segment_5!='0'){
							$segment_5_slug=$this->sm->get_slug(array('slug_value'=>$segment_5));

							$segment_5_slug_type=$segment_5_slug->slug_type;

							if($segment_5_slug_type=='3'){
								$stream_id=encode_data($segment_5_slug->slug_type_id);
								$_stream_id=$segment_5_slug->slug_type_id;
							}else if($segment_5_slug_type=='5'){
								$course_id=encode_data($segment_5_slug->slug_type_id);
							}else if($segment_5_slug_type=='10'){
								$exam_id=encode_data($segment_5_slug->slug_type_id);
							}
						}

						if($segment_6!='0'){
							$segment_6_slug=$this->sm->get_slug(array('slug_value'=>$segment_6));

							$segment_6_slug_type=$segment_6_slug->slug_type;

							if($segment_6_slug_type=='5'){
								$course_id=encode_data($segment_6_slug->slug_type_id);
							}else if($segment_6_slug_type=='10'){
								$exam_id=encode_data($segment_6_slug->slug_type_id);
							}
						}


						if($c_type!=''){
							$institute_types=$this->im->get_institute_types(array('inst_data_type'=>'4','inst_type_name_slug'=>$c_type));
							$ctype_id=encode_data($institute_types->inst_type);
						}


						if($appr!=''){
							$appr_data=$this->im->get_approval_type(array('approval_type_name_slug'=>$appr));
							$appr_id=encode_data($appr_data->approval_type_id);
						}

						if($aff!=''){
							$aff_data=$this->im->get_affiliation_types(array('statutory_body_status'=>'1','statutory_body_country_id'=>$country_data->country_id,'statutory_body_abbr_slug'=>$aff),TRUE);
							$aff_id=encode_data($aff_data->statutory_body_id);
						}


						if($c_cate!=''){
							$c_cate_data=$this->im->get_institute_categories(array('inst_category_name_slug'=>$c_cate));
							$c_cate_id=encode_data($c_cate_data->inst_category_id);
						}


						if($agn!=''){
							$agn_data=$this->im->get_agency(array('agency_name_slug'=>$agn));
							$agn_id=encode_data($agn_data->agency_id);
						}




						$this->data['country_id']=encode_data($country_data->country_id);
						$this->data['_base_url']=base_url($country_data->country_iso_code_2.'/study-center/');
						$this->data['_country_id']=$country_data->country_id;
						$this->data['state_id']=$state_id;
						$this->data['_state_id']=$_state_id;
						$this->data['city_id']=$city_id;
						$this->data['_city_id']=$_city_id;
						$this->data['stream_id']=$stream_id;
						$this->data['_stream_id']=$_stream_id;
						$this->data['course_id']=$course_id;
						$this->data['exam_id']=$exam_id;

						$this->data['rank_id']='';

						$this->data['ctype_id']=$ctype_id;
						$this->data['appr_id']=$appr_id;

						$this->data['aff_id']=$aff_id;

						$this->data['c_cate_id']=$c_cate_id;

						$this->data['agn_id']=$agn_id;

						$cfacilities=$this->sm->get_system_facilities(array('facility_status'=>'1'),FALSE);

	                    foreach ($cfacilities as $k => $v) {
	                        $college_facilities[]=array(
	                            'facility_icon_3'=>base_url('public/data/app/app_data/icon/withoutbackground/'.$v->facility_icon_3)
	                        );
	                    }

	                  

	                    $this->data['facilities']=$college_facilities;

						//this->data['page_title']=(!empty($this->data['slug_data']))?$this->data['slug_data']->url_page_heading:'';
						$this->data['page_inner_title']=(!empty($this->data['slug_data']))?$this->data['slug_data']->url_page_heading:'';
						$this->data['breadcumb']=(!empty($this->data['slug_data']))?json_decode($this->data['slug_data']->url_breadcrumb,TRUE):'';

						//print_obj($this->data);die;

						$this->data['page_id']=$current_url_slug->url_id;

						$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

						//print_obj($structure_data);die;

						$this->data['page_structure_data']=$structure_data;

						$ads_param['start_date']=date('Y-m-d');
						$ads_param['start_date']=$current_url_slug->url_value;

						$this->data['ads_data']='';

                        $this->data['utype']='6';


						$view_page='search/vw_search_study_center_page';
					}else{
						$this->data['page_title']='404 not found';
						$view_page='webpage/others/vw_notfound';
					}

						

					$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($view_page, $this->data);
				}else{
					redirect(base_url('in/study-center'));
				}
			}else{
				redirect(base_url('in/study-center'));
			}
				
		}else{
			redirect(base_url('in/study-center'));
		}
    }
}