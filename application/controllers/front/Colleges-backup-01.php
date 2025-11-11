<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Colleges extends BaseFrontController
{

	public function indexCollegesSearchpage(){

		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course or stream
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course or exam or ranking

		$state_id='1';
		$stream_id='40';
		$course_id='344';
		$city_id='6';

		$substream_ids=array();

		$substream=$this->input->get('sub_stream');
		$type_of_college=$this->input->get('ctype');

		//echo $substream;die;

		if(!empty($substream)){
			$substream_ids=char_separated_to_array($substream);
		}


		if(!empty($type_of_college)){
			$college_types=char_separated_to_array($type_of_college);
		}


		//$url_param=encode_data($stream_id);
		//$url_param=encode_data($course_id);
		//$url_param=encode_data($stream_id).'_'.encode_data($course_id);

		// $url_param=encode_data($state_id).'_'.encode_data($stream_id).'_'.encode_data($course_id);

		// $url_param=encode_data($state_id).'_'.encode_data($city_id).'_'.encode_data($stream_id).'_'.encode_data($course_id);

		//echo $url_param;die;

		$not_found=false;
		$not_found_page='webpage/others/vw_notfound';
		$page_title='404 not found';

		$found_page='search/vw_search_colleges_page_new';	

		$current_url= current_url();

		$_inpage_filters=array();
		$_inpage_top_filters=array();
		$_streams=array();
		$filtered_data=array();
		$filter_selected=false;

		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='collegesdemo') && ($segment_2!='0' && $segment_2==='collegesdemo')){

			$country_data=$this->com->__get_country('country_id,country_name,country_iso_code_4',array('country_iso_code_4'=>$segment_1));

			if(!empty($country_data)){

				$current_url_slug=$this->sm->get_slug_urls(array('url_value'=>$current_url));

				//print_obj($current_url_slug);die;

				if(!empty($current_url_slug)){

					$current_in_page_filters=$this->sm->get_slug_filters(array('url_id'=>$current_url_slug->url_id,'url_filter_type'=>'in_page_filter'),FALSE);

					if(!empty($current_in_page_filters)){
						foreach ($current_in_page_filters as $key => $value) {
							if($value->url_filter_type_tag=='stream'){
								$total_data=$this->im->get_total_colleges(array('college_country_id'=>$country_data->country_id),NULL,array('needle'=>$value->url_filter_value,'haystack'=>'system_users_colleges.college_streams_ids'));
							}else if($value->url_filter_type_tag=='course'){
								$total_data=$this->im->get_total_colleges(array('college_country_id'=>$country_data->country_id),NULL,array('needle'=>$value->url_filter_value,'haystack'=>'system_users_colleges.college_course_ids'));
							}


							$_inpage_filters[$value->url_filter_type_tag][]=array(
								'url_filter_type_tag'=>$value->url_filter_type_tag,
								'url_filter_title'=>$value->url_filter_title,
								'url_filter_total_colleges'=>$total_data,
								'url_filter_url'=>$value->url_filter_url								
							);
						}
					}

					$this->data['in_page_filters']=$_inpage_filters;


					$current_in_page_top_filters=$this->sm->get_slug_filters(array('url_id'=>$current_url_slug->url_id,'url_filter_type'=>'in_page_top_filter'),FALSE);


					
					if(!empty($current_in_page_top_filters)){
						foreach ($current_in_page_top_filters as $key => $value) {
							if($value->url_filter_type_tag=='stream'){
								$top_total_data=$this->im->get_total_colleges(array('college_country_id'=>$country_data->country_id),NULL,array('needle'=>$value->url_filter_value,'haystack'=>'system_users_colleges.college_streams_ids'));
							}else if($value->url_filter_type_tag=='course'){
								$top_total_data=$this->im->get_total_colleges(array('college_country_id'=>$country_data->country_id),NULL,array('needle'=>$value->url_filter_value,'haystack'=>'system_users_colleges.college_course_ids'));
							}


							if($current_url_slug->url_search_type=='stream'){
								if($current_url_slug->url_sub_type_id==$value->url_filter_value){
									$filter_selected=true;
								}else{
									$filter_selected=false;
								}
							}else if($current_url_slug->url_search_type=='state'){
								if($current_url_slug->url_sub_type_id==$value->url_filter_value){
									$filter_selected=true;
								}else{
									$filter_selected=false;
								}
							}

							if($value->url_filter_type_tag=='sub_stream'){
								if(in_array($value->url_filter_value,$substream_ids)){
									$filter_selected=true;
								}else{
									$filter_selected=false;
								}
							}


							if($value->url_filter_type_tag=='type_of_college'){
								if(in_array($value->url_filter_value,$college_types)){
									$filter_selected=true;
								}else{
									$filter_selected=false;
								}
							}

							$_inpage_top_filters[$value->url_filter_type_tag][]=array(
								'url_filter_type_tag'=>$value->url_filter_type_tag,
								'url_filter_title'=>$value->url_filter_title,
								'url_filter_value'=>$value->url_filter_value,
								'url_filter_total_colleges'=>$top_total_data,
								'url_filter_url'=>$value->url_filter_url,
								'url_filter_selected'=>$filter_selected
							);
						}
					}


					$page_title=$current_url_slug->url_meta_title;

					$post['length']=90;
					$post['start']=0;


					//State & Stream
					switch ($current_url_slug->url_search_type) {
						case 'state':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'city':
							$param=array('country_id'=>$country_id,'city_id'=>$current_url_slug->url_city,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'state_city':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'city_id'=>$current_url_slug->url_city,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'stream':
							$param=array('country_id'=>$country_id,'streams'=>$current_url_slug->url_stream,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'course':
							$param=array('country_id'=>$country_id,'courses'=>$current_url_slug->url_course,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'stream_course':
							$param=array('country_id'=>$country_id,'streams'=>$current_url_slug->url_stream,'courses'=>$current_url_slug->url_course,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'state_stream':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'streams'=>$current_url_slug->url_stream,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'state_stream_course':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'streams'=>$current_url_slug->url_stream,'courses'=>$current_url_slug->url_course,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'state_city_stream':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'city_id'=>$current_url_slug->url_city,'streams'=>$current_url_slug->url_stream,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'state_city_stream_course':
							$param=array('country_id'=>$country_id,'state_id'=>$current_url_slug->url_state,'city_id'=>$current_url_slug->url_city,'streams'=>$current_url_slug->url_stream,'courses'=>$current_url_slug->url_course,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'city_stream':
							$param=array('country_id'=>$country_id,'city_id'=>$current_url_slug->url_city,'streams'=>$current_url_slug->url_stream,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						case 'city_stream_course':
							$param=array('country_id'=>$country_id,'city_id'=>$current_url_slug->url_city,'streams'=>$current_url_slug->url_stream,'courses'=>$current_url_slug->url_course,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
						
						default:
							$param=array('country_id'=>$country_id,'status'=>'1','show_in_search_grid'=>'1','order_by'=>'college_short_order','order'=>'ASC');
							break;
					}

					$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);


					if(!empty($colleges)){
						foreach ($colleges as $key => $value) {

							$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner','user_file_type'=>'4'));
			    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

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
			                    $cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->college_facilities);

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


	                    	switch ($current_url_slug->url_search_type) {
	                    		case 'stream':	                    		
								case 'state_stream':
								case 'state_city_stream':
								case 'city_stream':
									$college_courses=$this->im->__get_user_course_data('user_id,user_course,user_course_cost_type,user_course_cost_breakup_type,category_name,course_short_name',array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course_stream'=>$current_url_slug->url_stream),FALSE,6);
									break;

								case 'stream_course':
								case 'state_stream_course':
								case 'state_city_stream_course':
								case 'city_stream_course':								
									$college_courses=$this->im->__get_user_course_data('user_course,user_course_cost_type,user_course_cost_breakup_type,category_name,course_short_name',array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$current_url_slug->url_course,'user_course_stream'=>$current_url_slug->url_stream),FALSE,3);
									break;
								case 'course':
									$college_courses=$this->im->__get_user_course_data('user_course,user_course_cost_type,user_course_cost_breakup_type,category_name,course_short_name',array('user_id'=>$value->college_user_id,'user_type'=>'4','user_course'=>$current_url_slug->url_course),FALSE,3);
									break;

								default:
									$college_courses=$this->im->__get_user_course_data('user_id,user_course,user_course_cost_type,user_course_cost_breakup_type,category_name,course_short_name',array('user_id'=>$value->college_user_id,'user_type'=>'4'),FALSE,6);

									//echo 'default';
									break;
							}


			                $firstyear_total=array();

			                if(!empty($college_courses)){
			                    foreach ($college_courses as $k => $v) {

			                    	if($v->user_course_cost_breakup_type=='1'){
                                        $cost_data=$this->im->get_course_fees_data(array('user_course_cost_category'=>'GENERAL','user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));

                                        //print_obj($cost_data);

                                        if(!empty($cost_data)){
                                        	if($v->user_course_cost_type=='1'){
												if($cost_data->user_course_total_fee>0){
	                                                $cost_total=$cost_data->user_course_total_fee;
	                                            }else{
	                                                $cost_data->user_course_tution_fee_total+$cost_data->user_course_admisssion_fee_total+$cost_data->user_course_reg_fee_total+$cost_data->user_course_exam_fee_total+$cost_data->user_course_other_fee_total;

	                                                $total_cost=number_format($cost_total,2);
	                                            }
                                        	}else if($v->user_course_cost_type=='2'){
                                        		$cost_total=$cost_data->user_course_tution_fee_sem_1+$cost_data->user_course_admisssion_fee_sem_1+$cost_data->user_course_exam_fee_sem_1+$cost_data->user_course_other_fee_sem_1;
                                        	}

                                        	$total_cost=number_format($cost_total,2);
	                                            

                                        }else{
                                            $total_cost='0';
                                        }

                                        //$_course_cost=$total_cost;
                                        

                                        if($total_cost>0){
                                            if($college_user_data->currency_symbol_left!=''){
                                                $course_cost=$college_user_data->currency_symbol_left.$total_cost;
                                            }else if($college_user_data->currency_symbol_left==''){
                                                $course_cost='₹'.$total_cost;
                                            }
                                            else if($college_user_data->currency_symbol_right!=''){
                                                $course_cost=$total_cost.$college_user_data->currency_symbol_right;
                                            }else if($college_user_data->currency_symbol_right==''){
                                                $course_cost=$total_cost.'₹';
                                            }

                                            $_course_cost=$course_cost;
                                            $course_cost_for='(1st Year Fees)';
                                        }else{
                                            $_course_cost='--';
                                            $course_cost_for='';
                                        }                                       
                                    }else if($v->user_course_cost_breakup_type=='2'){

                                        $cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$value->college_user_id,'user_course_cost_category'=>'GENERAL','user_course_id'=>$v->user_course));


                                        if(!empty($cost_data)){
                                            if(isset($cost_data[0]->user_course_tution_fee_total) && isset($cost_data[0]->user_course_admisssion_fee_total) && isset($cost_data[0]->user_course_reg_fee_total) && isset($cost_data[0]->user_course_exam_fee_total) && isset($cost_data[0]->user_course_other_fee_total)){

                                                $cost_total=$cost_data[0]->user_course_tution_fee_total+$cost_data[0]->user_course_admisssion_fee_total+$cost_data[0]->user_course_reg_fee_total+$cost_data[0]->user_course_exam_fee_total+$cost_data[0]->user_course_other_fee_total;

                                                $total_cost=number_format($cost_total,2);//number_to_currency($cost_data[0]->total_cost);

                                            }else{
                                                $total_cost=number_format($cost_data[0]->total_cost,2);
                                            }

                                        }else{
                                            $total_cost=0;
                                        }
                                                                              

                                        if($total_cost>0){
                                            if($college_user_data->currency_symbol_left!=''){
                                                $course_cost=$college_user_data->currency_symbol_left.$total_cost;
                                            }else if($college_user_data->currency_symbol_left==''){
                                                $course_cost='₹'.$total_cost;
                                            }
                                            else if($college_user_data->currency_symbol_right!=''){
                                                $course_cost=$total_cost.$college_user_data->currency_symbol_right;
                                            }else if($college_user_data->currency_symbol_right==''){
                                                $course_cost=$total_cost.'₹';
                                            }

                                            $_course_cost=$course_cost;
                                            $course_for='(Total Fees)';
                                        }else{
                                            $_course_cost='--';
                                            $course_cost_for='';
                                        }                                   
                                    }else{
                                        $cost_data=$this->im->get_course_fees_data(array('user_course_cost_category'=>'GENERAL','user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));
                                        
                                        if(!empty($cost_data)){                                            

                                            $cost_total=$cost_data->user_course_other_fee_total+$cost_data->user_course_total_fee;

                                            $total_cost=sprintf('%0.2f',$cost_total);

                                            if($cost_data->user_course_total_fee>0){
                                            
                                                if($college_user_data->currency_symbol_left!=''){
                                                    $course_cost=$college_user_data->currency_symbol_left.$total_cost;
                                                }else if($college_user_data->currency_symbol_left==''){
                                                    $course_cost='₹'.$total_cost;
                                                }
                                                else if($college_user_data->currency_symbol_right!=''){
                                                    $course_cost=$total_cost.$college_user_data->currency_symbol_right;
                                                }else if($college_user_data->currency_symbol_right==''){
                                                    $course_cost=$total_cost.'₹';
                                                }

                                                $_course_cost=$course_cost;
                                                $course_cost_for='(1st Year Fees)';
                                            }else if($cost_data->user_course_total_fee==0){
                                                $cost_total=$cost_data->user_course_other_fee_total+$cost_data->user_course_total_fee;

                                                $total_cost=number_format($cost_total);

                                                if($college_user_data->currency_symbol_left!=''){
                                                    $course_cost=$college_user_data->currency_symbol_left.$total_cost;
                                                }else if($college_user_data->currency_symbol_left==''){
                                                    $course_cost='₹'.$total_cost;
                                                }
                                                else if($college_user_data->currency_symbol_right!=''){
                                                    $course_cost=$total_cost.$college_user_data->currency_symbol_right;
                                                }else if($college_user_data->currency_symbol_right==''){
                                                    $course_cost=$total_cost.'₹';
                                                }

                                                $_course_cost=$course_cost;
                                                $course_cost_for='(1st Year Fees)';
                                            }
                                        }else{
                                            $_course_cost='--';
                                            $course_cost_for='';
                                        } 
                                    }

			                        $_course_cost_data[$value->college_user_id][]=array(
			                        	'course_cost_type'=>$v->user_course_cost_type,
			                        	'course_cost_breakup_type'=>$v->user_course_cost_breakup_type,
			                            'cost_value'=>$_course_cost,
			                            'course_name'=>(!empty($course_cost_for))?$v->course_short_name.' - '.$course_cost_for:$v->course_short_name
			                        );
			                    }
			                }else{
			                    $_course_cost_data=array();
			                }

			               //print_obj($_course_cost_data);die;


			               //die;

			                //print_obj($_course_cost_data);die;

			                $current_year=date('Y');

			                $college_ranks=$this->im->_get_inst_ranking_data(array('ranking_inst_id'=>$value->college_user_id,'ranking_inst_type'=>'college'),FALSE);

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

			                $exams_accepted=$this->strm->get_user_courses_exam(array('user_type'=>'4','user_id'=>$value->college_user_id),FALSE,'exam_id','ASC','3','exam_id,exam_name');

			                if(!empty($exams_accepted)){
			                	foreach ($exams_accepted as $k => $v) {
			                		$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$v->exam_id));
			                		$_exams_accepted[$value->college_user_id][]=array(
			                			'exam_id'=>$v->exam_id,
			                			'exam_name'=>$v->exam_name,
			                			'exam_link'=>(!empty($exam_slug))?base_url('exams/'.$exam_slug->slug_value):'javascript::void(0);'
			                		);
			                	}
			                }else{
			                	$_exams_accepted=array();
			                }

			                $total_gallery_img=$this->sm->get_total_user_files(array('user_file_type_id'=>$value->college_user_id,'user_file_type'=>'4'));

			                $college_inner_menues=$this->sm->__get_inner_menues('UPPER(menu_name) as menu_name,UPPER(menu_name_alias) as menu_name_alias,menu_link',array('menu_link_id'=>$value->college_user_id,'menu_is_active'=>'1'),FALSE);

			                //$_ccdata[$value->college_user_id][]=$_course_cost_data;

		                	$filtered_data[]=array(
			                    'college_id'=>encode_data($value->college_id),
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
			                    'college_major_stream_rating'=>'',
			                    'college_available_tabs'=>$college_inner_menues,
			                    'college_rating'=>'0',
			                    'is_featured'=>$is_featured,
			                    'access_url'=>$value->access_url,
			                    'college_country_phone_code'=>$country_data->country_phone_code,
			                    'college_facilities'=>(!empty($value->college_facilities))?$college_facilities[$value->college_user_id]:null,
			                    'college_courses'=>$college_courses,
			                    'college_courses_cost'=>(!empty($college_courses))?$_course_cost_data[$value->college_user_id]:'',
			                    'college_ranks'=>(!empty($college_ranks))?$_ranking_data[$value->college_user_id]:null,
			                    'college_exams_accepted'=>(!empty($exams_accepted))?$_exams_accepted[$value->college_user_id]:'',
			                    'college_total_gallery_img'=>$total_gallery_img,
			                    'institute_type'=>encode_data(7)
			    			);
						}
					}

					$filtered_chunk=array_chunk($filtered_data,6);

					//die;

					//print_obj($_ccdata);die;
					$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$current_url),FALSE);

					//print_obj($structure_data);die;

					$this->data['page_structure_data']=$structure_data;

					$this->data['inpage_top_filters']=$_inpage_top_filters;					
					$this->data['page_heading']=$current_url_slug->url_page_heading;
					$this->data['page_bredcrumb']=(!empty($this->data['slug_data']))?json_decode($this->data['slug_data']->url_breadcrumb,TRUE):'';
					$this->data['filtered_data']=$filtered_chunk;
					$this->data['data_start']=$start;
					$this->data['substream_ids']=$substream_ids;
				}
					

			}else{
				$not_found=true;
			}

		}else{
			$not_found=true;
		}

		if($not_found===false){
			$this->theme->title($page_title)->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($found_page, $this->data);
		}else if($not_found===true){
			$this->theme->title($page_title)->load($not_found_page, $this->data);
		}

		

		//$this->output->cache(120);
	}


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
		$city_id='';
		$course_id='';
		$stream_id='';
		$exam_id='';
		$rank_id='';
		$ctype_id='';
		$appr_id='';
		$aff_id='';
		$c_cate_id='';
		$agn_id='';

		//print_obj($segment_3);

		$current_url= current_url();




		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='colleges')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){
				if(is_string($segment_2) && $segment_2=='colleges'){

					$current_url_slug=$this->sm->__get_slug_urls('url_id,url_value',array('url_value'=>$current_url));

					if(!empty($current_url_slug)){
						if($segment_3!='0'){
							
							$segment_3_slug=$this->sm->get_slug(array('slug_value'=>$segment_3));

							//print_obj($segment_3_slug);die;

							$segment_3_slug_type=$segment_3_slug->slug_type;

							//echo $segment_3_slug->slug_type_id;die;

							if($segment_3_slug_type=='1'){
								$state_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='2'){
								$city_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='3'){
								$stream_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='5'){
								$course_id=encode_data($segment_3_slug->slug_type_id);
							}else if($segment_3_slug_type=='10'){
								$exam_id=encode_data($segment_3_slug->slug_type_id);
							}
						}

						//echo $state_id;die;


						if($segment_4!='0'){
							$segment_4_slug=$this->sm->get_slug(array('slug_value'=>$segment_4));

							$segment_4_slug_type=$segment_4_slug->slug_type;

							if($segment_4_slug_type=='2'){
								$city_id=encode_data($segment_4_slug->slug_type_id);
							}else if($segment_4_slug_type=='3'){
								$stream_id=encode_data($segment_4_slug->slug_type_id);
							}else if($segment_4_slug_type=='5'){
								$course_id=encode_data($segment_4_slug->slug_type_id);
							}
						}

						if($segment_5!='0'){
							$segment_5_slug=$this->sm->get_slug(array('slug_value'=>$segment_5));

							$segment_5_slug_type=$segment_5_slug->slug_type;

							if($segment_5_slug_type=='3'){
								$stream_id=encode_data($segment_5_slug->slug_type_id);
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
						$this->data['state_id']=$state_id;
						$this->data['city_id']=$city_id;
						$this->data['stream_id']=$stream_id;
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


						$view_page='search/vw_search_colleges_page';
					}else{
						$this->data['page_title']='404 not found';
						$view_page='webpage/others/vw_notfound';
					}

						

					$this->theme->title($this->data['page_title'])->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($view_page, $this->data);
				}else{
					redirect(base_url('in/colleges'));
				}
			}else{
				redirect(base_url('in/colleges'));
			}
				
		}else{
			redirect(base_url('in/colleges'));
		}
	}


	public function index_old_2(){
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course

		$top_cities=array();
		$first_middle_ads_data=array();
		$second_middle_ads_data=array();
		$third_middle_ads_data=array();

		$state_id='';
		$city_id='';
		$stream_id='';
		$course_id='';

		$post['order']='DESC';

		// echo $segment_3;die;

		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='colleges')){
			if(is_string($segment_2) && $segment_2=='colleges'){
				$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
				if(!empty($country_data)){

					if($segment_3!='0'){
						$segment_3_slug=$this->sm->get_slug(array('slug_value'=>$segment_3));

						//print_obj($segment_3_slug);die;

						if(!empty($segment_3_slug)){

							$segment_3_slug_type=$segment_3_slug->slug_type;
							$segment_3_slug_type_id=$segment_3_slug->slug_type_id;

							if($segment_3_slug_type=='1'){//state

								$state_data=$this->com->get_state(array('state_id'=>$segment_3_slug_type_id));

								// $state_id=encode_data($state_data->state_id);

								$state_id=$state_data->state_id;

								//echo $state_id;

								$_top_cities=$this->com->get_city(array('city_state_id'=>$state_id,'city_country_id'=>$country_data->country_id,'city_is_top'=>'1'),FALSE,'city_serial','ASC');							

								// $param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'status'=>'1','is_verified'=>'1');

								$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'status'=>'1');


								if($segment_4!='0'){
									$segment_4_slug=$this->sm->get_slug(array('slug_value'=>$segment_4));

									if(!empty($segment_4_slug)){
										$segment_4_slug_type=$segment_4_slug->slug_type;
										$segment_4_slug_type_id=$segment_4_slug->slug_type_id;

										if($segment_4_slug_type=='2'){//city

											$city_data=$this->com->get_city(array('city_id'=>$segment_4_slug_type_id));

											$city_id=encode_data($city_data->city_id);									

											$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'city_id'=>$segment_4_slug_type_id,'status'=>'1','is_verified'=>'1');


											if($segment_5!='0'){
												$segment_5_slug=$this->sm->get_slug(array('slug_value'=>$segment_5));

												$segment_5_slug_type=$segment_5_slug->slug_type;
												$segment_5_slug_type_id=$segment_5_slug->slug_type_id;

												if($segment_5_slug_type=='5'){//course
													// $param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'city_id'=>$segment_4_slug_type_id,'courses'=>$segment_5_slug_type_id,'status'=>'1','is_verified'=>'1');
													$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'city_id'=>$segment_4_slug_type_id,'courses'=>$segment_5_slug_type_id,'status'=>'1');
													$course_data=$this->strm->get_course(array('course_id'=>$segment_5_slug_type_id));
													$course_id=encode_data($course_data->course_id);
													$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.$course_data->course_short_name.' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
													$breadcumb=array(
														'Home'=>base_url(),
														ucwords($course_data->course_short_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_5,
														ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_5,
														ucwords($city_data->city_name).' Colleges'=>''
													);

													
												}else if($segment_5_slug_type=='3'){//stream

													$stream_data=$this->strm->get_stream(array('stream_id'=>$segment_5_slug_type_id));

													$stream_id=encode_data($stream_data->stream_id);

													if($segment_6!='0'){
														$segment_6_slug=$this->sm->get_slug(array('slug_value'=>$segment_6));
														$segment_6_slug_type=$segment_6_slug->slug_type;
														$segment_6_slug_type_id=$segment_6_slug->slug_type_id;

														if($segment_6_slug_type=='5'){//course
															// $param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'city_id'=>$segment_4_slug_type_id,'courses'=>$segment_6_slug_type_id,'status'=>'1','is_verified'=>'1');
															$param=array('country_id'=>$country_data->country_id,'state_id'=>$state_id,'city_id'=>$segment_4_slug_type_id,'courses'=>$segment_6_slug_type_id,'status'=>'1');
															$course_data=$this->strm->get_course(array('course_id'=>$segment_6_slug_type_id));
															$course_id=encode_data($course_data->course_id);
															$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.$course_data->course_short_name.' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
															$breadcumb=array(
																'Home'=>base_url(),
																ucwords($course_data->course_short_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_6,
																ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_5,
																ucwords($stream_data->stream_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_5.'/'.$segment_6,
																ucwords($city_data->city_name).' Colleges'=>''
															);

															if(!empty($_top_cities)){
																foreach ($_top_cities as $key => $value) {
																	$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
																	$selected=($city_slug->slug_value==$segment_4)?'btn btn-primary':'btn btn-outline-primary';
																	$top_cities[]=array(
																		'city_name'=>$value->city_name,
																		'total_colleges'=>$total_colleges,
																		'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($segment_3_slug->slug_value).'/'.$city_slug->slug_value.'/'.$segment_5.'/'.$segment_6,
																		'selected'=>$selected
																	);
																}
															}
														}else{

														}

															
													}else{

														if(!empty($_top_cities)){
															foreach ($_top_cities as $key => $value) {
																$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
																$selected=($city_slug->slug_value==$segment_4)?'btn btn-primary':'btn btn-outline-primary';
																$top_cities[]=array(
																	'city_name'=>$value->city_name,
																	'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($segment_3_slug->slug_value).'/'.$city_slug->slug_value.'/'.$segment_5,
																	'selected'=>$selected
																);
															}
														}
														// $param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'city_id'=>$segment_4_slug_type_id,'streams'=>$segment_5_slug_type_id,'status'=>'1','is_verified'=>'1');

														$param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'city_id'=>$segment_4_slug_type_id,'streams'=>$segment_5_slug_type_id,'status'=>'1');
														
														$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
														$breadcumb=array(
															'Home'=>base_url(),
															ucwords($stream_data->stream_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_5,
															ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_5,														
															ucwords($stream_data->stream_name).' Colleges'=>''
														);


													}
													
												}
											}else{

												if(!empty($_top_cities)){
													foreach ($_top_cities as $key => $value) {
														$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
														$selected=($city_slug->slug_value==$segment_4)?'btn btn-primary':'btn btn-outline-primary';
														$top_cities[]=array(
															'city_name'=>$value->city_name,
															'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($segment_3_slug->slug_value).'/'.$city_slug->slug_value,
															'selected'=>$selected
														);
													}
												}
												$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.$course_data->course_short_name.' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
												$breadcumb=array(
													'Home'=>base_url(),
													ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3,
													ucwords($city_data->city_name).' Colleges'=>''
												);
											}

											
										}else if($segment_4_slug_type=='5'){//course
											// $param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'courses'=>$segment_4_slug_type_id,'status'=>'1','is_verified'=>'1');
											$param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'courses'=>$segment_4_slug_type_id,'status'=>'1');
											$course_data=$this->strm->get_course(array('course_id'=>$segment_4_slug_type_id));
											$course_id=encode_data($course_data->course_id);
											$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.ucwords($course_data->course_short_name).' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
											$breadcumb=array(
												'Home'=>base_url(),
												ucwords($course_data->course_short_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_4,
												ucwords($state_data->state_name).' Colleges'=>''
											);
										}else if($segment_4_slug_type=='3'){//Stream
											$stream_data=$this->strm->get_stream(array('stream_id'=>$segment_4_slug_type_id));
											$stream_id=encode_data($stream_data->stream_id);
											if($segment_5!='0'){
												$segment_5_slug=$this->sm->get_slug(array('slug_value'=>$segment_5));

												$segment_5_slug_type=$segment_5_slug->slug_type;
												$segment_5_slug_type_id=$segment_5_slug->slug_type_id;

												if($segment_5_slug_type=='5'){//course
													// $param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'streams'=>$segment_4_slug_type_id,'courses'=>$segment_5_slug_type_id,'status'=>'1','is_verified'=>'1');
													$param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'streams'=>$segment_4_slug_type_id,'courses'=>$segment_5_slug_type_id,'status'=>'1');
													$course_data=$this->strm->get_course(array('course_id'=>$segment_5_slug_type_id));
													$course_id=encode_data($course_data->course_id);
													$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.$course_data->course_short_name.' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
													$breadcumb=array(
														'Home'=>base_url(),
														ucwords($course_data->course_short_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_5,
														ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_5,
														ucwords($stream_data->stream_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3.'/'.$segment_4,
														ucwords($course_data->course_short_name).' Colleges'=>''
													);
												}
											}else{
												if(!empty($_top_cities)){
													foreach ($_top_cities as $key => $value) {
														$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
														$selected='btn btn-outline-primary';
														$top_cities[]=array(
															'city_name'=>$value->city_name,
															'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($segment_3_slug->slug_value).'/'.$city_slug->slug_value.'/'.$segment_4,
															'selected'=>$selected
														);
													}
												}
												$param=array('country_id'=>$country_data->country_id,'state_id'=>$segment_3_slug_type_id,'streams'=>$segment_4_slug_type_id,'status'=>'1','is_verified'=>'1');
												$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
												$breadcumb=array(
													'Home'=>base_url(),
													ucwords($state_data->state_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$segment_3,
													ucwords($stream_data->stream_name).' Colleges'=>''
												);
											}
										}
									}
								}else{
									if(!empty($_top_cities)){
										foreach ($_top_cities as $key => $value) {
											$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
											$selected='btn btn-outline-primary';
											$top_cities[]=array(
												'city_name'=>$value->city_name,
												'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($segment_3_slug->slug_value).'/'.$city_slug->slug_value,
												'selected'=>$selected
											);
										}
									}
									$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF COLLEGES IN '.strtoupper($state_data->state_name).' BASED ON '.date('Y').' RANKING';
									$breadcumb=array(
										'Home'=>base_url(),
										ucwords($state_data->state_name).' Colleges'=>''
									);
								}
							}else if($segment_3_slug_type=='5'){//course
								//$param=array('country_id'=>$country_data->country_id,'courses'=>$segment_3_slug_type_id,'status'=>'1','is_verified'=>'1');
								$param=array('country_id'=>$country_data->country_id,'courses'=>$segment_3_slug_type_id,'status'=>'1');
								$course_data=$this->strm->get_course(array('course_id'=>$segment_3_slug_type_id));
								$course_id=encode_data($course_data->course_id);
								$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.$course_data->course_short_name.' COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON '.date('Y').' RANKING';
								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($course_data->course_short_name).' Colleges'=>''
								);
							}else if($segment_3_slug_type=='3'){//Stream
								$_top_cities=$this->com->get_city(array('city_country_id'=>$country_data->country_id,'city_is_top'=>'1'),FALSE,'city_serial','ASC');
								if(!empty($_top_cities)){
									foreach ($_top_cities as $key => $value) {
										$city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$value->city_id));
										$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->city_state_id));
										$selected='btn btn-outline-primary';
										$top_cities[]=array(
											'city_name'=>$value->city_name,
											'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value.'/'.strtolower($segment_3_slug->slug_value),
											'selected'=>$selected
										);
									}
								}
								// $param=array('country_id'=>$country_data->country_id,'streams'=>$segment_3_slug_type_id,'status'=>'1','is_verified'=>'1');
								$param=array('country_id'=>$country_data->country_id,'streams'=>$segment_3_slug_type_id,'status'=>'1');
								$stream_data=$this->strm->get_stream(array('stream_id'=>$segment_3_slug_type_id));
								$stream_id=encode_data($stream_data->stream_id);
								$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP '.strtoupper($stream_data->stream_name).' COLLEGES IN '.strtoupper($country_data->country_name).' BASED ON 2021 RANKING';
								$breadcumb=array(
									'Home'=>base_url(),
									ucwords($stream_data->stream_name).' Colleges'=>''
								);
							}
						}else{
							$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
							$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name);
							$breadcumb=array(
								'Home'=>base_url(),
								ucwords($country_data->country_name).' Colleges'=>''
							);
						}
					}else{

						$_top_states=$this->com->get_states(array('state_country_id'=>$country_data->country_id,'is_top'=>'1'),'state_serial','ASC');

						if(!empty($_top_states)){
							foreach ($_top_states as $key => $value) {
								$state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$value->state_id));
								$selected='btn btn-outline-primary';
								$total_colleges=$this->im->get_total_colleges(array('college_state_id'=>$value->state_id,'college_country_id'=>$country_data->country_id));
								$top_states[]=array(
									'state_name'=>$value->state_name,
									'total_colleges'=>$total_colleges,
									'access_url'=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.strtolower($state_slug->slug_value),
									'selected'=>$selected
								);
							}
						}

						$param=array('country_id'=>$country_data->country_id,'status'=>'1','is_verified'=>'1');
						$page_inner_title=($this->data['page_heading']!=null)?$this->data['page_heading']:'LIST OF TOP COLLEGES IN '.strtoupper($country_data->country_name);
						$breadcumb=array(
							'Home'=>base_url(),
							ucwords($country_data->country_name).' Colleges'=>''
						);
					}

					

					$this->data['page_inner_title']=$page_inner_title;
					$this->data['breadcumb']=$breadcumb;

					$post=array('length'=>'16','start'=>'0');



					$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

					//$colleges=$this->im->__get_filtered_colleges($param,FALSE,FALSE);

					//print_obj($colleges);die;

					if(!empty($colleges)){
			    		foreach ($colleges as $key => $value) {
			    			$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner','user_file_type'=>'4'));
			    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));
	


			    			$currency=$this->com->get_currency(array('currency_id'=>$value->college_currency_id));

			    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
			                    $college_logo=$_college_logo->media_disk_path_relative;
			                    $college_logo_name=$_college_logo->media_org_name;
			                }else{
			                    $college_logo=base_url().'uploads/app/default/no.jpg';
			                    $college_logo_name='';
			                }

			                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
			                    $college_banner=$_college_banner->media_disk_path_relative;
			                    $college_banner_name=$_college_banner->media_org_name;
			                }else{
			                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
			                    $college_banner_name='';
			                }



			                $is_featured=$value->college_is_featured;

			                if(!empty($value->college_facilities)){
			                    $cfacilities=$this->sm->get_system_facilities_in('facility_id',$value->college_facilities);

			                    foreach ($cfacilities as $k => $v) {
			                        $college_facilities[]=array(
			                            'facility_name'=>$v->facility_name,
			                            'facility_icon'=>$v->facility_icon
			                        );
			                    }
			                }else{
			                    $college_facilities=array();
			                }

			                if(!empty($value->college_affiliation_type)){
			                    $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$value->college_affiliation_type);

			                    $college_affiliations=$caffiliations->concated_value;
			                }else{
			                    $college_affiliations='';
			                }


			                $college_courses=$this->im->get_user_course_data(array('is_visible_in_grid_list'=>'1','user_id'=>$value->college_user_id),FALSE);

			                

			                if(!empty($college_courses)){
			                    foreach ($college_courses as $k => $v) {
			                        $course=$this->strm->get_course(array('course_id'=>$v->user_course));
			                        $cost=$this->im->get_course_fees_data(array('user_id'=>$value->college_user_id,'user_course_id'=>$v->user_course,'user_course_year'=>'1'));

			                        $_course_cost=($currency->currency_symbol_left!='')?$currency->currency_symbol_left.number_format($cost->user_course_total_fee):number_format($cost->user_course_total_fee).$currency->currency_symbol_right;

			                        $_course_cost_data[]=array(
			                            'cost_value'=>$_course_cost,
			                            'course_name'=>$course->course_short_name.' - 1ST YEAR FEES'
			                        );
			                    }
			                }else{
			                    $_course_cost_data=array();
			                }

			               // print_obj($_course_cost_data);

			                //die;

			    			// $college_data[]=array(
			    			// 	'college_id'=>encode_data($value->college_id),
			    			// 	'college_name'=>$value->college_name,
			    			// 	'college_city'=>$value->city_name,
			    			// 	'college_state'=>$value->state_name,
			    			// 	'college_country_id'=>encode_data($value->college_country_id),
			    			// 	'college_country'=>$value->country_name,
			    			// 	'college_logo'=>$college_logo,
			    			// 	'college_banner'=>$college_banner,
			    			// 	'is_featured'=>$is_featured,
			    			// 	'access_url'=>$value->access_url,
			    			// 	'college_country_phone_code'=>$country_data->country_phone_code,
			    			// 	'institute_type'=>encode_data(7),
			    			// );

			    			$college_data[]=array(
			                    'college_id'=>encode_data($value->college_id),
			    				'college_name'=>$value->college_name,
			    				'college_city'=>$value->city_name,
			    				'college_state'=>$value->state_name,
			    				'college_country_id'=>encode_data($value->college_country_id),
			    				'college_country'=>$value->country_name,
			                    'college_total_course_amount'=>number_to_currency($total_cost),
			                    'college_total_course_amount_with_currency'=>$course_cost,
			    				'college_logo'=>$college_logo,
			    				'college_banner'=>$college_banner,
			                    'college_intro_video'=>$college_intro_video,
			                    'college_affiliations'=>$college_affiliations,
			                    'is_featured'=>$is_featured,
			                    'access_url'=>$value->access_url,
			                    'college_country_phone_code'=>$country_data->country_phone_code,
			                    'college_facilities'=>$college_facilities,
			                    'college_courses_cost'=>$_course_cost_data,
			                    'college_course_fees_link'=>$value->access_url.'/courses-fees',
			                    'college_reviews_link'=>$value->access_url.'/reviews',
                    			'college_admissions_link'=>$value->access_url.'/admission-'.date('Y'),
			                    'college_ranks'=>array(),
			                    'institute_type'=>encode_data(7)
			    			);
			    		}
			    	}else{
			    		$college_data=array();
			    	}

			    	//die;

			    	$current_date=date('Y-m-d');


			    	if(!empty($state_id)){
			    		$first_middle_ads_param=array('country'=>$country_data->country_id,'state'=>$state_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_1_MIDDLE');
			    	}else{
			    		$first_middle_ads_param=array('country'=>$country_data->country_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_1_MIDDLE');
			    	}
			    	

			    	$_1st_middle_ads_data=$this->um->get_listing_package_user($first_middle_ads_param,'RAND()','ASC',FALSE);

			    	if(!empty($_1st_middle_ads_data)){

			    		$_ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$_1st_middle_ads_data->listing_user_id,'user_storage_type'=>'ads_image','user_file_type'=>'5'));

		    			if(!empty($_ads_image) && !empty($_ads_image->media_disk_path_relative)){
		                    $ads_image=$_ads_image->media_disk_path_relative;
		                }else{
		                    $ads_image=base_url().'uploads/app/default/no.jpg';
		                }

	    				$first_middle_ads_data[]=array(
	    					'ads_link'=>$_1st_middle_ads_data->listing_link,
	    					'ads_image'=>$ads_image
	    				);    				
			    	}

			    	if(!empty($state_id)){
			    		$second_middle_ads_param=array('country'=>$country_data->country_id,'state'=>$state_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_2_MIDDLE');
			    	}else{
			    		$second_middle_ads_param=array('country'=>$country_data->country_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_2_MIDDLE');
			    	}
			    	

			    	$_2nd_middle_ads_data=$this->um->get_listing_package_user($second_middle_ads_param,'RAND()','ASC',FALSE);

			    	if(!empty($_2nd_middle_ads_data)){

			    		$_2nd_ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$_2nd_middle_ads_data->listing_user_id,'user_storage_type'=>'ads_image','user_file_type'=>'5'));

		    			if(!empty($_2nd_ads_image) && !empty($_2nd_ads_image->media_disk_path_relative)){
		                    $second_ads_image=$_2nd_ads_image->media_disk_path_relative;
		                }else{
		                    $second_ads_image=base_url().'uploads/app/default/no.jpg';
		                }

	    				$second_middle_ads_data[]=array(
	    					'ads_link'=>$_2nd_middle_ads_data->listing_link,
	    					'ads_image'=>$second_ads_image
	    				);  				
			    	}


			    	if(!empty($state_id)){
			    		$third_middle_ads_param=array('country'=>$country_data->country_id,'state'=>$state_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_3_MIDDLE');
			    	}else{
			    		$third_middle_ads_param=array('country'=>$country_data->country_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_3_MIDDLE');
			    	}
			    	
			    	

			    	$_3rd_middle_ads_data=$this->um->get_listing_package_user($third_middle_ads_param,'RAND()','ASC',FALSE);

			    	//if(!empty($_3rd_middle_ads_data)){

			    		$_3rd_ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$_3rd_middle_ads_data->listing_user_id,'user_storage_type'=>'ads_image','user_file_type'=>'5'));

		    			if(!empty($_3rd_ads_image) && !empty($_3rd_ads_image->media_disk_path_relative)){
		                    $third_ads_image=$_3rd_ads_image->media_disk_path_relative;
		                }else{
		                    $third_ads_image=base_url().'uploads/app/default/no.jpg';
		                }

	    				// $third_middle_ads_data[]=array(
	    				// 	'ads_link'=>$_3rd_middle_ads_data->listing_link,
	    				// 	'ads_image'=>$third_ads_image
	    				// );

	    				$third_middle_ads_data[]=array(
	    					'ads_link'=>'<div class="adBlock" id="custom_g_code">
                        <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;    background: #f5f8f905!important;">
                            <ins class="adsbygoogle"
                             style="display:inline-block;width:728px;height:90px"
                             data-ad-client="ca-pub-9545373166119354"
                             data-ad-slot="7117741101"></ins>
                              <script>
                               (adsbygoogle = window.adsbygoogle || []).push({});
                          </script>
                        </div>
                    </div>',
	    					'ads_image'=>$third_ads_image
	    				);  				
			    	//}

			    	if(!empty($college_data)){
			    		$_college_data=array_chunk($college_data, 3);

			    		if(!empty($first_middle_ads_data)){
			    			array_splice( $_college_data, 1, 0, $first_middle_ads_data );
			    		}
			    		
			    		if(!empty($second_middle_ads_data)){
			    			array_splice( $_college_data, 4, 0, $second_middle_ads_data );
			    		}

			    		if(!empty($third_middle_ads_data)){
			    			array_splice( $_college_data, 5, 0, $third_middle_ads_data );
			    		}		    		
			    	}

			    	if(!empty($state_id)){
						$top_ads_param=array('country'=>$country_data->country_id,'state'=>$state_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_TOP');
			    	}else{
			    		$top_ads_param=array('country'=>$country_data->country_id,'start_date'=>$current_date,'end_date'=>$current_date,'package_position'=>'COLLEGE_SEARCH_PAGE_AT_TOP');
			    	}

			    	

			    	$_top_ads_data=$this->um->get_listing_package_user($top_ads_param,'RAND()','ASC',FALSE);

			    	if(!empty($_top_ads_data)){

			    		$_top_ads_image=$this->sm->get_user_file(array('user_file_type_id'=>$_top_ads_data->listing_user_id,'user_storage_type'=>'ads_image','user_file_type'=>'5'));

		    			if(!empty($_top_ads_image) && !empty($_top_ads_image->media_disk_path_relative)){
		                    $top_ads_image=$_top_ads_image->media_disk_path_relative;
		                }else{
		                    $top_ads_image=base_url().'uploads/app/default/no.jpg';
		                }

	    				$top_ads_data=array(
	    					'ads_link'=>$_top_ads_data->listing_link,
	    					'ads_image'=>$top_ads_image
	    				);  				
			    	}

			    	//print_obj($_college_data);die;

			    	//$page_title='Find Top MBA Colleges & Universities in India| Rank, Courses, Admission';

			    	$page_title=$this->data['page_title'];

			    	$this->data['searched_colleges']=$_college_data;
			    	$this->data['top_ads_data']=$top_ads_data;
					$this->data['country_id']=encode_data($country_data->country_id);
					$this->data['state_id']=encode_data($state_id);
					$this->data['city_id']=$city_id;
					$this->data['stream_id']=$stream_id;
					$this->data['course_id']=$course_id;

					$this->data['country_name']=strtoupper($country_data->country_name);
					$this->data['top_cities']=$top_cities;
					$this->data['top_states']=$top_states;
					$this->data['page_title']=$this->data['page_title'];//$page_title;

					

					$view_page='search/vw_search_colleges_page';

					$this->theme->title($page_title)->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($view_page, $this->data);		

				}else{
					redirect(base_url());
				}
			}else{
				redirect(base_url().'in/colleges');
			}
		}else{
			redirect(base_url().'in/colleges');
		}

					
	}

	public function index_new(){
		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//static segment "colleges"
		$segment_3=$this->uri->segment(3,0);//state or course or stream
		$segment_4=$this->uri->segment(4,0);//city or course
		$segment_5=$this->uri->segment(5,0);//stream or course
		$segment_6=$this->uri->segment(6,0);//course

		if(is_string($segment_1) && ($segment_1!='0' && $segment_1!='colleges')){
			if(is_string($segment_2) && $segment_2=='colleges'){
				$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
				if(!empty($country_data)){
					$page_title=$this->data['page_title'];
					$view_page='search/vw_search_colleges_page';

					$this->theme->title($page_title)->add_partial('partial_apply_modal',$this->data)->load($view_page, $this->data);
				}else{
					redirect(base_url().'in/colleges');
				}
			}else{
				redirect(base_url().'in/colleges');
			}
		}else{
			redirect(base_url().'in/colleges');
		}
	}


	//College Public Page

	public function indexPublicPages(){
		
		$current_url=decode_data($this->data['current_url']);

		$structure_data=array();
		$menu_main_widget=array();
		$inner_meues=array();
		$inner_menu_data=array();

		$slug_value=$this->uri->segment(3,0);
		$slug_value4=$this->uri->segment(4,0);

		if($slug_value4!='0'){
			$url_slug4=$this->sm->get_slug(array('slug_value'=>$slug_value4));

			if(!empty($url_slug4)){
				$slug_type=$url_slug4->slug_type;
			}
		}

		//print_obj($url_slug4);die;

		//$url_slug=$this->sm->get_slug(array('slug_value'=>$slug_value,'slug_type'=>'6'));

		//$url_data=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_type_id'=>$url_slug->slug_type_id));

		$url_data=$this->sm->get_slug_urls(array('url_value'=>$current_url));

		//print_obj($url_data);exit;

		if(!empty($url_data)){

			$college_data=$this->im->__get_college_profile_data('college_user_id,college_estd_year,college_affiliation_type,college_type,college_utype,college_university_id,colllege_logo_alt_text,colllege_banner_alt_text',array('college_user_id'=>$url_data->url_type_id));

			// print_obj($college_data);exit;

			if(!empty($college_data)){
				$menu_link_type='10';//($college_data->college_utype==4)?'10':'101';

				//echo $menu_link_type;

				$_inner_meues=$this->sm->get_menues_specific('menu_id,menu_name,menu_main_widget,menu_link,menu_is_active',array('menu_link_type'=>$menu_link_type,'menu_link_id'=>$college_data->college_user_id,'menu_is_active'=>'1'),FALSE,'menu_serial','ASC');

				//print_obj($_inner_meues);die;

				$inner_menu_data=$this->sm->get_menues_specific('menu_id,menu_name,menu_link,menu_main_widget,menu_is_active',array('menu_id'=>$url_data->url_sub_type_id,'menu_link_type'=>$menu_link_type,'menu_link_id'=>$college_data->college_user_id),TRUE,'menu_serial','ASC');

				//print_obj($inner_menu_data);die;

				

				//print_obj($college_data);die;

				$college_type=$this->im->get_institute_types_specific('UPPER(inst_type_name) as inst_type_name',array('inst_type'=>$college_data->college_type));

				if($college_data->college_university_id!=null && $college_data->college_university_id!=0){
		        	$college_university=$this->im->__get_college_profile_data('UPPER(college_name) as college_university_name',array('college_user_id'=>$college_data->college_university_id));
		        }

				$city_data=$this->com->get_city_specific('UPPER(city_name) as city_name',array('city_id'=>$url_data->url_city));
				$state_data=$this->com->get_state_specific('UPPER(state_name) as state_name',array('state_id'=>$url_data->url_state));

				//print_obj($state_data);die;

				$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$url_data->url_type_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

		        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
		            $college_logo=$user_logo->media_disk_path_relative;
		            $user_logo_name=$user_logo->media_org_name;
		        }else{
		            $college_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
		            $user_logo_name='';
		        }


		        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$url_data->url_type_id,'user_storage_type'=>'user_banner'));

		        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
		            $college_banner=$user_banner->media_disk_path_relative;
		            $user_banner_name=$user_banner->media_org_name;
		        }else{
		            $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		            $user_banner_name='';
		        }


				if(!empty($inner_menu_data)){
					if(!empty($inner_menu_data->menu_main_widget)){
						$menu_main_widget=unserialize($inner_menu_data->menu_main_widget);
					}else{
						$menu_main_widget='';
					}
					

					$structure_data=$this->sm->get_slug_struct_data(array('slug_url'=>$url_data->url_value),FALSE);
				}

				if(!empty($url_data->url_widgets)){
					$url_widgets=unserialize($url_data->url_widgets);
				}else{
					$url_widgets='';
				}
				

				$page_title=$url_data->url_meta_title;

				if(!empty($_inner_meues)){
					foreach ($_inner_meues as $key => $value) {
						$inner_meues[]=array(
							'menu_name'=>strtoupper($value->menu_name),
							'menu_link'=>$value->menu_link,
							'menu_default_active'=>'',
							'menu_active'=>($value->menu_id==$inner_menu_data->menu_id)?'active':''
						);
					}
				}

				if(!empty($college_data->college_affiliation_type)){
	                $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$college_data->college_affiliation_type);

	                $college_affiliations=$caffiliations->concated_value;
	            }else{
	                $college_affiliations='';
	            }



	            //$v=array('front_admission_section');

	            
	            //echo serialize($v);die;

	            //echo $college_data->college_type;die;

	            $total_reviews=$this->sm->get_total_review_status_data(array('review_approved'=>'approved','review_inst_id'=>$college_data->college_user_id));

	            $total_average_ratings=$this->sm->get_total_average_rating($college_data->college_user_id);

	            if($total_reviews>0 && $total_average_ratings->total_average_rating!=''){
	            	$college_total_avg_rating=$total_average_ratings->total_average_rating;
	            }else{
	            	$college_total_avg_rating='0';
	            }

	            $review_link=base_url('reviews/write/'.encode_data($college_data->college_user_id).'_'.encode_data($college_data->college_utype));

	            //($college_data->college_type==7)?'2':'1'

				$data=array(
					'college_id'=>$url_data->url_type_id,
					'college_user_id'=>encode_data($college_data->college_user_id),
					'college_user_type'=>$college_data->college_utype,
					'college_country_id'=>$url_data->url_country,
					'college_breadcrumb'=>json_decode($url_data->url_breadcrumb),
					'college_formatted_name'=>$url_data->url_page_heading,
					'college_inner_menues'=>$inner_meues,
					'college_logo'=>$college_logo,
					'college_logo_alt_name'=>$college_data->colllege_logo_alt_text,
					'colllege_banner_alt_text'=>(!empty($college_data->colllege_banner_alt_text))?$college_data->colllege_banner_alt_text:$url_data->url_page_heading,
					'college_banner'=>$college_banner,
					'college_city'=>$city_data->city_name,
					'college_state'=>$state_data->state_name,
					'college_estd'=>$college_data->college_estd_year,
					'college_university'=>(isset($college_university))?$college_university->college_university_name:'',
					'college_type'=>$college_type->inst_type_name,
					'college_affiliations'=>$college_affiliations,
					'college_claim_url'=>$college_data->access_url.'/clientclaim?p='.encode_data($college_data->college_user_id),
					'college_review_url'=>$review_link,
					'college_total_review'=>$total_reviews,
					'college_total_avg_rating'=>$college_total_avg_rating,
					'college_menu_widgets'=>$menu_main_widget,
					'college_url_widgets'=>$url_widgets
				);

				//print_obj($data);

				// $a=array(
				//    'front_info_section',
		        //    'front_course_fees_section',
		        //    'front_course_fees_brief_with_ads_section',
		        //    'front_facilities_section',
		        //    'front_gallery_brief_section',
		        //    'front_placement_details_section',
		        //    'front_news_brief_section',
		        //    'front_google_maps_section',
		        //    'front_wayto_rating_section',
		        //    'front_college_comment_section',
		        //    'front_nearby_colleges_universities_section'
				// );

				// echo serialize($a);die;

				// Set a cookie named "username" with the value "john_doe" that expires in one hour
				set_cookie("review_link", $review_link, time() + 3600, $college_data->access_url.'/', '.sikshapedia.com', true, true);

				session_set_userdata(array("review_link"=>$review_link));

				$this->data['page_structure_data']=$structure_data;

				$this->data['college_data']=$data;

				/*
				if($college_data->college_utype=='4'){
					$view_page='webpage/colleges/vw_college_web_page_new2';
				}else if($college_data->college_utype=='3'){
					$view_page='webpage/universities/vw_university_web_page';
				}

				*/

				$view_page='webpage/colleges/vw_college_web_page_new2';
				
			}else{
				$this->data['page_heading']='404';
				$this->data['page_heading_title']='Page not found';
				$page_title='Page not found';	
				$view_page='webpage/others/vw_notfound';	
			}
		}else{
			//redirect(base_url());

			$this->data['page_heading']='404';
			$this->data['page_heading_title']='Page not found';
			$page_title='Page not found';	
			$view_page='webpage/others/vw_notfound';	
		}

		$this->theme->title($page_title)->add_partial('partial_apply_modal',$this->data)->add_partial('partial_application_thanks_modal',$this->data)->load($view_page, $this->data);
	}

	//College Public Page



	//Search Collegs
	public function onSearchColleges(){
		//if($this->input->server('REQUEST_METHOD')=='GET'){

			// $_country=post_data('_country');
			// $search_streams=post_data('search_streams');
			// $search_course=post_data('search_course');
			// $search_cities=post_data('search_cities');

			// $search_states=post_data('search_states');

			// $search_type=post_data('_search_type');

			$_country=$this->input->get('_country');
			// $search_streams=$this->input->get('search_streams');
			$search_course=$this->input->get('search_course');
			$search_cities=$this->input->get('search_cities');

			$search_states=$this->input->get('search_states');

			$_college_type=$this->input->get('search_college_type');

			$college_type=decode_data($_college_type);

			if(!empty($_courses) && $_courses!='undefined'){
				$courses=decode_data($_courses);
			}else{
				$courses='';
			}

			$_affiliations=$this->input->get('affiliations');

			if(!empty($_affiliations) && $_affiliations!='undefined'){
				$affiliations=decode_data($_affiliations);
			}else{
				$affiliations='';
			}

			$_approval_types=$this->input->get('search_approval');

			if(!empty($_approval_types) && $_approval_types!='undefined'){
				$approval_types=decode_data($_approval_types);
			}else{
				$approval_types='';
			}

			$_agencies=$this->input->get('search_agencies');

			if(!empty($_agencies) && $_agencies!='undefined'){
				$agencies=decode_data($_agencies);
			}else{
				$agencies='';
			}

			//print_obj($_country);

			//echo $search_cities;
			$courses= '';
			$streams= '';
			$states=decode_data($search_states);
			$cities=decode_data($search_cities);
			$university_data=array();

			$country_id=decode_data($_country);



			//echo $cities;die;

			// if(!empty($search_streams)){
			// 	$_streams=char_separated_to_array($search_streams);
			// 	foreach ($_streams as $key => $value) {
			// 		$_str[]=decode_data($value);
			// 	}

			// 	$streams= char_separated($_str);
			// }


			// if(!empty($search_course)){
			// 	$_courses=char_separated_to_array($search_course);
			// 	foreach ($_courses as $key => $value) {
			// 		$_cstr[]=decode_data($value);
			// 	}

			// 	$courses= char_separated($_cstr);
			// }

			// if(!empty($search_states)){
			// 	$_states=char_separated_to_array($search_states);
			// 	foreach ($_states as $key => $value) {
			// 		$_sstr[]=decode_data($value);
			// 	}

			// 	$states= char_separated($_sstr);
			// }

			// if(!empty($search_cities)){
			// 	$_cities=char_separated_to_array($search_cities);
			// 	foreach ($_cities as $key => $value) {
			// 		$_cistr[]=decode_data($value);
			// 	}

			// 	$cities= char_separated($_cistr);
			// }

			$post=array('length'=>'8','start'=>'0');
			//if($search_type=='7'){
				// if(!empty($states) && empty($cities)){//state,city,course,stream
				// 	$param=array('country_id'=>$country_id,'state_id'=>$states,'is_top'=>'1','status'=>'1','is_verified'=>'1');

				// 	//$where_in['params']=array(array('param'=>'college_state_id','param_val'=>$states));
				// }else if(empty($states) && !empty($cities)){//state,city,course,stream
				// 	$param=array('country_id'=>$country_id,'city_id'=>$cities,'is_top'=>'1','status'=>'1','is_verified'=>'1');

				// 	//$where_in['params']=array(array('param'=>'college_state_id','param_val'=>$states));			
				// }else if(!empty($states) && !empty($cities)){//state,city,course,stream
				// 	$param=array('country_id'=>$country_id,'state_id'=>$states,'city_id'=>$cities,'is_top'=>'1','status'=>'1','is_verified'=>'1');

				// 	//$where_in['params']=array(array('param'=>'college_state_id','param_val'=>$states));			
				// }

				// if(isset($states) && !empty($states)){
				// 	$param=array('country_id'=>$country_id,'state_id'=>$states,'status'=>'1','is_verified'=>'1');
				// }

				// if(isset($cities) && !empty($cities)){
				// 	$param=array('country_id'=>$country_id,'city_id'=>$cities,'status'=>'1','is_verified'=>'1');
				// }

				//if(isset($college_type) && !empty($college_type)){
					$param=array('country_id'=>$country_id,'state_id'=>$states,'city_id'=>$cities,'college_type'=>$college_type,'college_university_id'=>$affiliations,'college_approval_type'=>$approval_types,'college_agency'=>$agencies,'courses'=>$courses,'status'=>'1','is_verified'=>'1');
				//}

				//print_obj($param);


				$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

				//$colleges=$this->im->get_college_filter_data($post,$param,FALSE,FALSE);

				//$college=$this->im->get__colleges($states);

				//print_obj($colleges);die;

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {

						$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
		    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
		                    $college_logo=$_college_logo->media_disk_path_relative;
		                }else{
		                    $college_logo=base_url().'uploads/app/default/no.jpg';
		                }

		                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
		                    $college_banner=$_college_banner->media_disk_path_relative;
		                }else{
		                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                }


						$is_featured=$value->college_is_featured;



		    			$filtered_data[]=array(
		    				'college_id'=>encode_data($value->college_id),
		    				'college_name'=>$value->college_name,
		    				'college_city'=>$value->city_name,
		    				'college_state'=>$value->state_name,
		    				'college_country_id'=>encode_data($value->college_country_id),
		    				'college_country'=>$value->country_name,
		    				'college_logo'=>$college_logo,
		    				'college_banner'=>$college_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url,
		    				'college_country_phone_code'=>$country_data->country_phone_code,
		    				'institute_type'=>encode_data(7),
		    			);
					}
				}

				//print_obj($filtered_data);die;

				$this->data['filtered_data']=$filtered_data;

				$return['html']=$this->theme->view('_pages/search/vw_filter_result_dyna',$this->data,true);
			//}


				

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);

		// }else{
		// 	redirect(base_url());
		// }
	}


	public function onSearchColleges_new(){
		//if($this->input->server('REQUEST_METHOD')=='GET'){

			$_country=$this->input->get('_country');
			// $search_streams=$this->input->get('search_streams');
			$search_course=$this->input->get('search_course');
			$search_cities=$this->input->get('search_cities');

			$search_states=$this->input->get('search_states');

			$_college_type=$this->input->get('search_college_type');

			$college_type=decode_data($_college_type);

			if(!empty($_courses)){
				$courses=decode_data($_courses);
			}else{
				$courses='';
			}

			$_affiliations=$this->input->get('affiliations');

			if(!empty($_affiliations)){
				$affiliations=decode_data($_affiliations);
			}else{
				$affiliations='';
			}

			$_approval_types=$this->input->get('search_approval');

			if(!empty($_approval_types)){
				$approval_types=decode_data($_approval_types);
			}else{
				$approval_types='';
			}

			$_agencies=$this->input->get('search_agencies');

			if(!empty($_agencies)){
				$agencies=decode_data($_agencies);
			}else{
				$agencies='';
			}

			//print_obj($_country);

			//echo $search_cities;
			$courses= '';
			$streams= '';
			$states=decode_data($search_states);
			$cities=decode_data($search_cities);
			$university_data=array();

			$country_id=decode_data($_country);

			$post=array('length'=>'8','start'=>'0');

			$param=array('country_id'=>$country_id,'state_id'=>$states,'city_id'=>$cities,'college_type'=>$college_type,'college_university_id'=>$affiliations,'college_approval_type'=>$approval_types,'college_agency'=>$agencies,'courses'=>$courses,'status'=>'1','is_verified'=>'1');



				$colleges=$this->im->get_colleges($post,$param,null,FALSE,FALSE,FALSE,FALSE);

				//print_obj($colleges);die;

				if(!empty($colleges)){
					foreach ($colleges as $key => $value) {

						$_college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));
		    			$_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

		    			if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
		                    $college_logo=$_college_logo->media_disk_path_relative;
		                }else{
		                    $college_logo=base_url().'uploads/app/default/no.jpg';
		                }

		                if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
		                    $college_banner=$_college_banner->media_disk_path_relative;
		                }else{
		                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
		                }


						$is_featured=$value->college_is_featured;



		    			$filtered_data[]=array(
		    				'college_id'=>encode_data($value->college_id),
		    				'college_name'=>$value->college_name,
		    				'college_city'=>$value->city_name,
		    				'college_state'=>$value->state_name,
		    				'college_country_id'=>encode_data($value->college_country_id),
		    				'college_country'=>$value->country_name,
		    				'college_logo'=>$college_logo,
		    				'college_banner'=>$college_banner,
		    				'is_featured'=>$is_featured,
		    				'access_url'=>$value->access_url,
		    				'college_country_phone_code'=>$country_data->country_phone_code,
		    				'institute_type'=>encode_data(7),
		    			);
					}
				}

				//print_obj($filtered_data);die;

				$this->data['filtered_data']=$filtered_data;

				$return['html']=$this->theme->view('_pages/search/vw_filter_result_dyna',$this->data,true);
			//}


				

			header('Content-Type: application/json; charset=utf-8');

			echo json_encode($return);

		// }else{
		// 	redirect(base_url());
		// }
	}

	//Search Collegs
	

	//Hostels
	public function indexAccountHostelSettings(){
		if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){

			$user_id=decode_data(session_userdata('user_id'));

			$this->data['men_hostel_data']=$this->im->get_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'1'));

			$this->data['men_hostel_notes_data']=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'1','hostel_data_type_id'=>$user_id));

			$this->data['women_hostel_data']=$this->im->get_hostels_data(array('hostel_data_type_id'=>$user_id,'hostel_rooms_type'=>'2'));

			$this->data['women_hostel_notes_data']=$this->im->get_hostels_notes_data(array('hostel_data_type'=>'1','hostel_type'=>'2','hostel_data_type_id'=>$user_id));


			$this->theme->title($this->data['page_title'])->add_partial('partial_account_header',$this->data)->load('account/college/vw_account_college_hostel_settings', $this->data);
		}else{
			redirect(base_url());
		}
	}
	//Hostels


	//Clientclaim
	public function indexClientClaim(){
		$param=$this->input->get('p');

		if(!empty($param)){

			$college_user_id=decode_data($param);

			//$_college_data=$this->im->get_college_data(array('college_user_id'=>$college_user_id));

			$_college_data=$this->im->__get_college_profile_data('college_user_id,college_country_id,college_name,college_estd_year,college_affiliation_type,college_type,college_utype,college_university_id,colllege_logo_alt_text,colllege_banner_alt_text',array('college_user_id'=>$college_user_id));

			//print_obj($_college_data);die;

			$designations=$this->im->get_designations(array('designation_status'=>'1'),false);

			foreach ($designations as $key => $value) {
				$_designations[]=array(
					'designation_id'=>encode_data($value->designation_id),
					'designation_name'=>$value->designation_name
				);
			}

			$this->data['college_data']=array(
				'college__user_id'=>encode_data($_college_data->college_user_id),
				'college_country_id'=>encode_data($_college_data->college_country_id),
				'college_type'=>($_college_data->college_utype=='4')?encode_data(7):encode_data(6)
			);

			//print_obj($this->data['college_data']);die;

			$page_title='Claim '.ucwords($_college_data->college_name);

			$this->data['designations']=$_designations;
	    	$view_page='webpage/colleges/vw_college_web_claim_page';

	    	$this->theme->title($page_title)->add_partial('partial_application_thanks_modal')->load($view_page, $this->data);
		}else{
			redirect(base_url());
		}

			
	}
}