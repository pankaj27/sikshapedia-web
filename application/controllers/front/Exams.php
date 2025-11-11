<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Exams extends BaseFrontController
{
	function __construct()
	{

		parent::__construct();

	    $this->load->model(array('settings_model'=>'sm','stream_model'=>'strm','country_model'=>'com'));

	}

	public function index(){
		$segment_1=$this->uri->segment(1,0);//static segment "exams"
		//$segment_2=$this->uri->segment(2,0);//static segment "exams"

		

		$_streams=array();

		if(is_string($segment_1) && $segment_1=='exams'){
				
			$menu_data=$this->sm->get_menues(array('menu_link'=>$this->current_url));

			

			//print_obj($menu_data);die;

			//$this->data['page_title']=$menu_data->menu_meta_title;


			//$this->data['country_data']=$country;

			$view_page='webpage/exams/vw_exams';
			$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
		}else{
			redirect(base_url());
		}
	}

	public function indexStreamAndExamDetails(){
		$segment_1=$this->uri->segment(1,0);//static segment "exams"
		$segment_2=$this->uri->segment(2,0);//exam stream name
		//$segment_3=$this->uri->segment(3,0);//exam name

		//echo $segment_2;die;


		$breadcumb=array();


		if((is_string($segment_1) && $segment_1=='exams')){

			//$country_data=$this->com->get_country(array('country_iso_code_2'=>strtoupper($segment_1)));

			//if(!empty($country_data)){
				if(is_string($segment_2) && $segment_2!='0'){
					$states=$this->com->get_states(array('state_country_id'=>99),'state_id','ASC');

					if(!empty($states)){
						foreach ($states as $key => $value) {
							$_states[]=array(
								'state_id'=>$value->state_id,
								'state_name'=>$value->state_name
							);
						}
					}
					$this->data['states']=$_states;
					$this->data['country_id']=99;


					$slug_data=$this->sm->get_slug(array('slug_value'=>$segment_2));

					//print_obj($slug_data);die;				

					if(!empty($slug_data)){
						$slug_type=$slug_data->slug_type;
						$slug_type_id=$slug_data->slug_type_id;

						if($slug_type=='3'){
							$stream_data=$this->strm->get_stream(array('stream_id'=>$slug_type_id));

							//print_obj($stream_data);die;

							$breadcumb=array(
								'Home'=>base_url(),
								'Exams'=>base_url().'exams',
								ucwords($stream_data->stream_name)=>''
							);

							$this->data['total_exams']=$this->strm->_get_total_exams(array('exam_status'=>'1'),'exam_stream_id',$stream_data->stream_id,TRUE);

							//echo $this->data['total_exams'];die;

							$this->data['stream_id']=encode_data($stream_data->stream_id);

							$this->data['exams_data']=array('breadcumb'=>$breadcumb,'exam_heading'=>$this->data['page_heading']);

							$view_page='webpage/exams/vw_exams_list';

							$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
						}else{

							redirect(base_url('exams'));		
						}
						
					}else{
						redirect(base_url('exams'));
					}
				}else{
					redirect(base_url('exams'));
				}
			// }else{
			// 	redirect(base_url());
			// }	
		}else{
			redirect(base_url('exams'));
		}
	}


	public function indexExamDetails(){
		$segment_1=$this->uri->segment(1,0);//static segment "exams"
		$segment_2=$this->uri->segment(2,0);//stream name
		$segment_3=$this->uri->segment(3,0);//exam name
		$segment_4=$this->uri->segment(4,0);//exam sub name

		$_states=array();

		//echo $segment_1.'<br>'.$segment_2.'<br>'.$segment_3.'<br>'.$segment_4;die;

		if(is_string($segment_1) && $segment_1=='exams'){

			if(is_string($segment_2) && $segment_2!='0'){

				//echo $segment_2;
				//echo $segment_3;die;

				$stream_slug_data=$this->sm->get_slug(array('slug_value'=>$segment_2));

				//print_obj($stream_slug_data);die;

				if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='3'){
					$slug_type=$stream_slug_data->slug_type;
					$slug_type_id=$stream_slug_data->slug_type_id;

					//$stream_data=$this->strm->__get_stream('stream_id,stream_name',array('stream_id'=>$slug_type_id));

					$stream_data=$this->strm->get_streams_with_exam_url(array('stream_id'=>$slug_type_id),TRUE);

					//print_obj($stream_data);die;
					
					// $breadcumb=array(
					// 	'Home'=>base_url(),
					// 	'Exams'=>base_url().'exams',
					// 	ucwords($stream_data->stream_name)=>''
					// );

					$breadcumb=(!empty($stream_data))?json_decode($stream_data->url_breadcrumb):null;

					$page_heading=(!empty($stream_data))?$stream_data->url_page_heading:$this->data['page_heading'];

					$exam_page_description=(!empty($stream_data))?$stream_data->url_page_description:null;

					$countries=$this->strm->get_exam_countries(array('exam_type'=>'2'));

					if(!empty($countries)){
						foreach ($countries as $key => $value) {
							$_countries[]=array(
								'country_id'=>encode_data($value->exam_country),
								'country_name'=>$value->country_name
							);
						}
					}

					$states=$this->strm->get_exam_states(array('exam_type'=>'2'));

					if(!empty($states)){
						foreach ($states as $key => $value) {
							$_states[]=array(
								'state_id'=>encode_data($value->exam_state),
								'state_name'=>$value->state_name
							);
						}
					}

					$this->data['states']=$_states;

					$this->data['countries']=$_countries;

					$this->data['total_exams']=$this->strm->_get_total_exams(array('exam_status'=>'1'),'exam_stream_id',$stream_data->stream_id);

					$this->data['stream_id']=encode_data($stream_data->stream_id);

					$this->data['country_id']=encode_data($this->data['default_country_id']);

					$this->data['_stream_id']=$stream_data->stream_id;

					$this->data['_country_id']=$this->data['default_country_id'];

					$this->data['exams_data']=array('breadcumb'=>$breadcumb,'exam_heading'=>$page_heading,'exam_page_description'=>$exam_page_description);

					//print_obj($this->data['exams_data']);die;

					$view_page='webpage/exams/vw_exams_list';

					$this->theme->title($this->data['page_title'])->load($view_page, $this->data);

				}else if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='10'){

					$slug_type=$stream_slug_data->slug_type;
					$slug_type_id=$stream_slug_data->slug_type_id;
					$_exam_slug_data=$this->data['slug_data'];

					if(!empty($_exam_slug_data)){

						$exam_data=$this->strm->get_exam_specific('exam_id,exam_full_name',array('exam_id'=>$slug_type_id));

						if($segment_3!='0'){
							$menu_data=$this->sm->get_menues_specific('menu_id,menu_parent_id,menu_slug',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_data->exam_id,'menu_slug'=>$segment_3,'menu_is_active'=>'1'),TRUE,'menu_serial','ASC',FALSE);
						}else{
							$menu_data=$this->sm->get_menues_specific('menu_id,menu_parent_id,menu_slug',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_data->exam_id,'menu_slug'=>'overview','menu_is_active'=>'1'),TRUE,'menu_serial','ASC',FALSE);
						}

			
						if($segment_3=='news'){
							$show_bottom_ads=FALSE;
						}else{
							$show_bottom_ads=TRUE;
						}

						$_exam_logo=$this->sm->__get_user_file('media_disk_path_relative,user_file_type_id,user_storage_type,user_file_type',array('user_file_type_id'=>$exam_data->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

		    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
		                    $exam_logo=$_exam_logo->media_disk_path_relative;
		                }else{
		                    $exam_logo=base_url().'uploads/app/default/no.jpg';
		                }

		                $this->data['menu_widget_data']=$this->sm->get_menu_widget_data(array('widget_menu_id'=>$menu_data->menu_id));


		                //print_obj($this->data['menu_widget_data']);die;

						$breadcumb=json_decode($_exam_slug_data->url_breadcrumb);

						$_menues=array();
						$_cmenues=array();
						$menues=$this->sm->get_menues_specific('menu_id,menu_name,menu_link,menu_link_type,menu_is_inner,menu_link_id,menu_parent_id',array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$_exam_slug_data->url_type_id,'menu_parent_id'=>'0'),FALSE,'menu_serial','ASC');

						if(!empty($menues)){
							$i=0;
							foreach ($menues as $key => $value) {								

								if(($value->menu_id==$menu_data->menu_parent_id) || ($value->menu_id==$menu_data->menu_id)){
									$menu_active='yes';
								}else{
									if($i==0){
										if($segment_3!='0'){
											$menu_active='no';
										}else{
											$menu_active='yes';
										}
										
									}else{
										$menu_active='no';
									}									
								}

								$_menues[]=array(
									'menu_id'=>$value->menu_id,
									'menu_name'=>$value->menu_name,
									'menu_link'=>$value->menu_link,
									'menu_active'=>$menu_active									
								);

								$i++;
							}
						}

						//print_obj($_menues);die;

						$this->data['exam_menu']=$_menues;
						$this->data['menu_data_id']=(!empty($menu_data))?$menu_data->menu_id:0;
						$this->data['menu_slug']=(!empty($menu_data))?$menu_data->menu_slug:'';
						$this->data['show_bottom_ads']=$show_bottom_ads;

						$this->data['exams_data']=array('breadcumb'=>$breadcumb,'exam_id'=>$exam_data->exam_id,'exam_name'=>$exam_data->exam_full_name,'exam_heading'=>$this->data['page_heading'],'exam_logo'=>$exam_logo);

						//print_obj($this->data['exams_data']);die;

						$view_page='webpage/exams/vw_exams_details';
						$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
					}else{
						//echo 'hi';
						redirect(base_url('exams'));
					}
				}else{
					//echo 'hi4';
					redirect(base_url('exams'));
				}					
			}else{
				//echo 'hi5';
				redirect(base_url('exams'));
			}	
		}else{
			//echo 'hi6';
			redirect(base_url('exams'));
		}
	}

	public function indexExamDetailsData(){
		$segment_1=$this->uri->segment(1,0);//static segment "exams"
		$segment_2=$this->uri->segment(2,0);//stream name
		$segment_3=$this->uri->segment(3,0);//exam name
		$segment_4=$this->uri->segment(4,0);//exam sub name

		if(is_string($segment_1) && $segment_1=='exams'){
			if(is_string($segment_2) && $segment_2!='0'){
				$stream_slug_data=$this->sm->get_slug(array('slug_value'=>$segment_2));

				if(!empty($stream_slug_data) && $stream_slug_data->slug_type=='10'){

					$slug_type=$stream_slug_data->slug_type;
					$slug_type_id=$stream_slug_data->slug_type_id;
					$_exam_slug_data=$this->data['slug_data'];

					if(!empty($_exam_slug_data)){

						$exam_data=$this->strm->get_exam(array('exam_id'=>$slug_type_id));

						if($segment_3!='0'){
							$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_data->exam_id,'menu_slug'=>$segment_3),TRUE,'menu_serial','ASC',FALSE);
						}else{
							$menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$exam_data->exam_id,'menu_slug'=>'overview'),TRUE,'menu_serial','ASC',FALSE);
						}

			
						if($segment_3=='news'){
							$show_bottom_ads=FALSE;
						}else{
							$show_bottom_ads=TRUE;
						}

						$_exam_logo=$this->sm->get_user_file(array('user_file_type_id'=>$exam_data->exam_id,'user_storage_type'=>'exam_logo','user_file_type'=>'6'));

		    			if(!empty($_exam_logo) && !empty($_exam_logo->media_disk_path_relative)){
		                    $exam_logo=$_exam_logo->media_disk_path_relative;
		                }else{
		                    $exam_logo=base_url().'uploads/app/default/no.jpg';
		                }

		                $this->data['menu_widget_data']=$this->sm->get_menu_widget_data(array('widget_menu_id'=>$menu_data->menu_id));


		                //print_obj($this->data['menu_widget_data']);die;

						$breadcumb=json_decode($_exam_slug_data->url_breadcrumb);

						$_menues=array();
						$_cmenues=array();
						$menues=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_link_id'=>$_exam_slug_data->url_type_id,'menu_parent_id'=>'0'),FALSE,'menu_serial','ASC');

						if(!empty($menues)){
							$i=0;
							foreach ($menues as $key => $value) {
								

								if(($value->menu_id==$menu_data->menu_parent_id) || ($value->menu_id==$menu_data->menu_id)){
									$menu_active='yes';
								}else{
									if($i==0){
										if($segment_3!='0'){
											$menu_active='no';
										}else{
											$menu_active='yes';
										}
										
									}else{
										$menu_active='no';
									}									
								}

								$_menues[]=array(
									'menu_id'=>$value->menu_id,
									'menu_name'=>$value->menu_name,
									'menu_link'=>$value->menu_link,
									'menu_active'=>$menu_active									
								);

								$i++;
							}
						}

						//print_obj($_menues);die;

						$this->data['exam_menu']=$_menues;
						$this->data['menu_data_id']=(!empty($menu_data))?$menu_data->menu_id:0;
						$this->data['menu_slug']=(!empty($menu_data))?$menu_data->menu_slug:'';
						$this->data['show_bottom_ads']=$show_bottom_ads;

						$this->data['exams_data']=array('breadcumb'=>$breadcumb,'exam_id'=>$exam_data->exam_id,'exam_name'=>$exam_data->exam_full_name,'exam_heading'=>$this->data['page_heading'],'exam_logo'=>$exam_logo);

						//print_obj($this->data['exams_data']);die;

						$view_page='webpage/exams/vw_exams_details';
						$this->theme->title($this->data['page_title'])->load($view_page, $this->data);
					}else{
						//echo 'hi';
						redirect(base_url('exams'));
					}
				}else{
					redirect(base_url('exams'));
				}
			}else{
				redirect(base_url('exams'));
			}
		}else{
			redirect(base_url('exams'));
		}
	}

	public function onSearchExamsList(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){


			$exam_stream=post_data('_filter_stream');
			$data_filter_type=post_data('data_filter_type');
			$data_filter_val=post_data('data_filter_val');

			$data_length=post_data('data_length');
			$data_start=post_data('data_start');

			$exm_mode=null;
			$app_mode=null;
			$__states=null;
			$country_id=null;



			// $state_filter=post_data('states');
			// $application_mode=post_data('application_mode');
			// $exam_mode=post_data('exam_mode');

			$stream_id=decode_data($exam_stream);


			//if(!empty($data_filter_type) && $data_filter_type=='country_filter'){
				$country_id=$this->input->post('country_filter');//decode_data($data_filter_val);
				$_country_id=(!empty($country_id))?decode_data($country_id):'';
				$param['country']=$_country_id;
			//}

			//if(!empty($data_filter_type) && $data_filter_type=='states_filter'){

				$states=$this->input->post('states_filter');

				if(!empty($states)){
					foreach ($states as $key => $value) {
						$_states[]=decode_data($value);
					}

					$__states=char_separated($_states);
				}

				//print_obj($__states);die;

				$param['exam_states']=$__states;
			//}

			//if(!empty($data_filter_type) && $data_filter_type=='application_mode'){
				$app_mode=$this->input->post('exam_application_mode');
				$param['exam_application_mode']=$app_mode;
			//}

			//if(!empty($data_filter_type) && $data_filter_type=='exam_mode'){
				$exm_mode=$this->input->post('exam_mode');
				$param['exam_mode']=$exm_mode;
			//}


			//if(!empty($data_filter_type) && $data_filter_type=='examination_others'){
				$practice_paper=$this->input->post('exam_practice_paper');
				$param['exam_practice_paper_available']=$practice_paper;
			//}

			$param['stream_ids']=$stream_id;

			//print_obj($param);die;

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


			$this->data['exams_list']=(!empty($_exams))?array_chunk($_exams,4):null;

			$return['total_exams']=(!empty($_exams))?count($_exams):'0';

			//$this->widget->run('front_exam_list_details_section',true,$country_id,$stream_id,$__states,$app_mode,$exm_mode,$data_length,$data_start);

			$return['html']=$this->theme->view('_pages/search/vw_search_exam_list_details_page',$this->data,true);

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);
			//print_obj($_exams);

		}else{
			redirect(base_url());
		}
	}



	public function onLoadExamsList(){
		if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='GET'){
			$searched_data=[];
			$search_text=$this->input->get('search_txt');
			$exam_link='';
			
			if(!empty($search_text)){
				$exams_list=$this->strm->__get_exam_specific('exam_full_name,exam_short_name,system_slugs_urls.url_value',['exam_full_name'=>$search_text],['exam_short_name'=>$search_text]);

				if(!empty($exams_list)){

					foreach ($exams_list as $key => $value) {
						if($value->exam_short_name!=''){
							$formatted_name=$value->exam_full_name.' - [ '.$value->exam_short_name.' ]';
						}else{
							$formatted_name=$value->exam_full_name;
						}	
						
						if($value->url_value!=''){
							$exam_link=$value->url_value;
						}

						$searched_data[]=array(
							'exam_name'=>strtoupper($formatted_name),
							'exam_link'=>$exam_link
						);
					}
					
				}
			}

			$this->data['searched_data']=$searched_data;
			echo json_encode($this->data['searched_data']);
		}
	}


}