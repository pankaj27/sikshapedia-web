<?php


/**
 * 
 */
class Front_course_fees_section extends Widget
{
	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$college_id=$ids['college_id'];

    	//echo $college_id;die;

      	$course_fees_data=array();
      	$college_data=array();
      	$course_stream_details=array();

    	$country_data=$this->com->__get_country('country_id,country_iso_code_4,country_name',array('country_id'=>$country_id));


    	if(!empty($country_data)){

    		$_college_data=$this->im->__get_college_profile_data('college_name,access_url',array('college_user_id'=>$college_id));

    		//print_obj($_college_data);die;

			if(!empty($_college_data)){
				$college_user_data=$this->um->get_user_data(array('user_id'=>$college_id),null,'4');

				//print_obj($college_user_data);die;

				$college_data=array(
					'college_name'=>strtoupper($_college_data->college_name)
				);

				$param=array(
	    			'order'=>array('user_course_id' => 'ASC'),
	    			'user_type'=>'4',
	    			'user_id'=>$college_id
				);

				$_course_fees_data = $this->im->_get_users_courses(null,$param,FALSE,FALSE);

				//print_obj($_course_fees_data);die;

				$_course_cost='--';

				if(!empty($_course_fees_data)){

					//print_obj($_course_fees_data);die;

					foreach ($_course_fees_data as $key => $value) {

						$user_courses_exams=$this->strm->get_user_courses_exam(array('user_id'=>$college_id,'user_course_pk_id'=>$value->user_course_id,'user_type'=>'4'),FALSE);

						if($value->user_course_cost_type==1 && $value->user_course_cost_breakup_type==1){
                    		$fees_data=$this->im->get_course_fees_data(array('user_id'=>$college_id,'user_course_id'=>$value->user_course,'user_course_cost_category'=>'GENERAL','user_course_year'=>'1'));

                    		//echo $value->college_user_id;

                    		//print_obj($fees_data);

		    				$total=0;

		    				// foreach ($fees_data as $k => $fv) {

		    				// 	$firstyear_total[]=$fv->user_course_tution_fee_total+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fv->user_course_exam_fee_sem_1+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_total;
		    				// }


		    				if($fees_data->user_course_admisssion_fee_total!=NULL || $fees_data->user_course_admisssion_fee_total>0){
	    						if($fees_data->user_course_reg_fee_total>0){
	    							$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_total+$fees_data->user_course_reg_fee_total+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;
	    						}else{
	    							$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_total+$fees_data->user_course_reg_fee_sem_1+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;
	    						}    						
	    					}else{
	    						if($fees_data->user_course_reg_fee_total>0){
	    							$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_sem_1+$fees_data->user_course_reg_fee_total+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;
	    						}else{
	    							$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_sem_1+$fees_data->user_course_reg_fee_sem_1+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;
	    						}	    						
	    					}

		    				//$firstyear_total=$fees_data->user_course_tution_fee_total+$fees_data->user_course_admisssion_fee_sem_1+$fv->user_course_reg_fee_sem_1+$fees_data->user_course_exam_fee_sem_1+$fees_data->user_course_other_fee_sem_1+$fees_data->user_course_other_fee_total;

		    				//print_obj($firstyear_total);

		    				if($firstyear_total>0){

			    				$_total=number_to_currency($firstyear_total);

			    				$_course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.' '.$_total:$_total.$college_user_data->currency_symbol_right;

			    				$fees_duration_text=' ( 1st Year Fees )';
		    				}else{
		    					$_course_cost='--';
		    					$fees_duration_text='';
		    				}


                    	}else if($value->user_course_cost_type==2 && $value->user_course_cost_breakup_type==1){
                    		$fees_data=$this->im->get_course_fees_data(array('user_id'=>$college_id,'user_course_cost_category'=>'GENERAL','user_course_id'=>$value->user_course),FALSE);

                    		//print_obj($fees_data);die;

                    		$total=0;
                    		$firstyear_total=0;

                    		if(!empty($fees_data)){
                    			$firstyear_total=$fees_data[0]->user_course_tution_fee_sem_1+$fees_data[0]->user_course_tution_fee_sem_2+$fees_data[0]->user_course_admisssion_fee_sem_1+$fees_data[0]->user_course_admisssion_fee_sem_2+$fees_data[0]->user_course_reg_fee_sem_1+$fees_data[0]->user_course_reg_fee_sem_2+$fees_data[0]->user_course_exam_fee_sem_1+$fees_data[0]->user_course_exam_fee_sem_2+$fees_data[0]->user_course_other_fee_sem_1+$fees_data[0]->user_course_other_fee_sem_2;
                    		}

		    		
                    		// foreach ($fees_data as $k => $fv){
                      //       	$firstyear_total[]=$fv->user_course_tution_fee_sem_1+$fv->user_course_tution_fee_sem_2+$fv->user_course_admisssion_fee_sem_1+$fv->user_course_admisssion_fee_sem_2+$fv->user_course_reg_fee_sem_1+$fv->user_course_reg_fee_sem_2+$fv->user_course_exam_fee_sem_1+$fv->user_course_exam_fee_sem_2+$fv->user_course_other_fee_sem_1+$fv->user_course_other_fee_sem_2;
                      //       }

		    				// $total_1st_year_wise=(!empty($firstyear_total))?$firstyear_total[0]:0;

		    				$total_1st_year_wise=(!empty($firstyear_total))?$firstyear_total:0;

		    				if($total_1st_year_wise>0){
		    					$_total=number_to_currency($total_1st_year_wise);

			    				$_course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.' '.$_total:$_total.$college_user_data->currency_symbol_right;

			    				$fees_duration_text=' ( 1st Year Fees )';
		    				}else{
		    					$_course_cost='--';
		    					$fees_duration_text='';
		    				}
			    				

                    	}else if($value->user_course_cost_type==1 && $value->user_course_cost_breakup_type==2){

                    		$fees_data=$this->im->get_user_course_grand_total(array('user_id'=>$college_id,'user_course_cost_category'=>'GENERAL','user_course_id'=>$value->user_course));

                    		//print_obj($fees_data);die;


		    				$total=$fees_data[0]->total_cost;

		    				if($total>0){
								$_total=number_to_currency($total,2);

			    				$firstyear_total=$_total;

			    				$_course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.' '.$_total:$_total.$college_user_data->currency_symbol_right;

			    				$fees_duration_text=' ( Total Fees )';
		    				}else{
		    					$_course_cost='--';
		    					$fees_duration_text='';
		    				}
			    				
                    	}else{
		    				$_fees_data=array();
		    				$first_year_fees=0;
		    				$total=0;
		    				$_course_cost='--';
		    				$reg_fee_available='no';
		    				$exam_fee_available='no';
		    				$fees_duration_text='';
		    			}

		    	
						if($value->course_is_lateral=='1'){
							$course_short_name=strtoupper($value->course_short_name).'{Lateral}';
						}else{
							$course_short_name=strtoupper($value->course_short_name);
						}

						//$course_slug=url_slug(strtolower($value->course_name));

						$course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->user_course));


						$college_course_url=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_type_id'=>$college_id,'url_sub_type'=>'college_inner_menu_course_fees_details_url','url_sub_type_id'=>$value->user_course));
						$course_formatted_name=(!empty($course_short_name))?strtoupper($value->course_name).' ['.$course_short_name.']':strtoupper($value->course_name);

						$course_fees_data[]=array(
							'course_full_name'=>strtoupper($value->course_name),
							'course_short_name'=>$course_short_name,
							'course_formatted_name'=>$course_formatted_name,
							'course_type'=>strtoupper($value->user_course_type),
							'course_pass_type'=>strtoupper($value->user_course_pass_type),
							'course_placement'=>strtoupper($value->user_course_placement_type),
							'course_duration'=>$value->user_course_duration_year,
							'course_duration_type'=>strtoupper($value->user_course_duration_type),
							'course_fees_1st_year'=>$_course_cost.$fees_duration_text,
							'course_eligibility'=>$value->user_course_eligibility,
							'course_exams'=>'',
							'course_link'=>$college_course_url->url_value
						);

						
					}

					//print_obj($course_fees_data);

					//die;
				}
			}		        		
    	}
      

    	$data['course_fees_data']=$course_fees_data;
    	$data['college_data']=$college_data;

        if ($visible) $this->render('front_course_fees_section',$data);
	}
}