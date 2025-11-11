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

    	// $segment_1=$this->uri->segment(1,0); //country
     //    $segment_2=$this->uri->segment(2,0); //college,university url
     //    $segment_3=$this->uri->segment(3,0); //inner menues
     //    $segment_4=$this->uri->segment(4,0);//city

     //    //echo $visible;die;

     //    if($visible=='1'){
     //    	$visible=TRUE;
     //    }

      $course_fees_data=array();
      $college_data=array();
      $course_stream_details=array();

    	$country_data=$this->com->get_country(array('country_id'=>$country_id));

    	if(!empty($country_data)){

    		$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

			if(!empty($_college_data)){
				$college_user_data=$this->um->get_user_data(array('user_id'=>$_college_data->college_user_id),null,'4');

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

				if(!empty($_course_fees_data)){
					foreach ($_course_fees_data as $key => $value) {

						$user_courses_exams=$this->strm->get_user_courses_exam(array('user_id'=>$college_id,'user_course_pk_id'=>$value->user_course_id,'user_type'=>'4'),FALSE);

						//$cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$college_id,'user_course_id'=>$value->user_course_id,'user_course_year'=>'1'),FALSE);


						//$total_cost=number_format($cost_data[0]->total_cost, 2,'.', ',');

						//$course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$total_cost:$total_cost.$college_user_data->currency_symbol_right;

						if($value->user_course_cost_breakup_type=='1'){
							$cost_data=$this->im->get_course_fees_data(array('user_course_cost_category'=>'GENERAL','user_id'=>$college_id,'user_course_id'=>$value->user_course,'user_course_year'=>'1'));

							//print_obj($cost_data);

							if(!empty($cost_data)){

								if($cost_data->user_course_total_fee>0){
									$total_cost=number_to_currency($cost_data->user_course_total_fee);
								}else{
									$cost_total=$cost_data->user_course_tution_fee_total+$cost_data->user_course_admisssion_fee_total+$cost_data->user_course_reg_fee_total+$cost_data->user_course_exam_fee_total+$cost_data->user_course_other_fee_total;

									//echo $cost_total;

									$total_cost=number_to_currency($cost_total);//number_to_currency($cost_data->user_course_total_fee);
								}
								
							}else{
								$total_cost=0;
							}

								


							//print_obj($total_cost);die;

							// if($cost_data->user_course_total_fee>0){
							// 	if($college_user_data->currency_symbol_left!=''){
							// 		$course_cost=$college_user_data->currency_symbol_left.$total_cost;
							// 	}else{
							// 		$course_cost=$total_cost.$college_user_data->currency_symbol_right;
							// 	}

							// 	$_course_cost=$course_cost.' (1st Year Fees)';
							// }else{
							// 	$_course_cost=' Not Specified';
							// }

							if($total_cost>0){
								if($college_user_data->currency_symbol_left!=''){
									$course_cost=$college_user_data->currency_symbol_left.$total_cost;
								}else{
									$course_cost=$total_cost.$college_user_data->currency_symbol_right;
								}

								$_course_cost=$course_cost.' (1st Year Fees)';
							}else{
								$_course_cost=' Not Specified';
							}

							// print_obj($_course_cost);die;
							

								
						}else if($value->user_course_cost_breakup_type=='2'){

							$cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$college_id,'user_course_cost_category'=>'GENERAL','user_course_id'=>$value->user_course));

							//print_obj($cost_data);


							if(!empty($cost_data)){
								if(isset($cost_data[0]->user_course_tution_fee_total) && isset($cost_data[0]->user_course_admisssion_fee_total) && isset($cost_data[0]->user_course_reg_fee_total) && isset($cost_data[0]->user_course_exam_fee_total) && isset($cost_data[0]->user_course_other_fee_total)){
									$cost_total=$cost_data[0]->user_course_tution_fee_total+$cost_data[0]->user_course_admisssion_fee_total+$cost_data[0]->user_course_reg_fee_total+$cost_data[0]->user_course_exam_fee_total+$cost_data[0]->user_course_other_fee_total;

									$total_cost=number_to_currency($cost_total);//number_to_currency($cost_data[0]->total_cost);
								}else{
									$total_cost=number_to_currency($cost_data[0]->total_cost);
								}
								
							}else{
								$total_cost=0;
							}

																	

							// if($cost_data[0]->total_cost>0){
							// 	if($college_user_data->currency_symbol_left!=''){
							// 		$course_cost=$college_user_data->currency_symbol_left.$total_cost;
							// 	}else{
							// 		$course_cost=$total_cost.$college_user_data->currency_symbol_right;
							// 	}

							// 	$_course_cost=$course_cost.' (Total Fees)';
							// }else{
							// 	$_course_cost=' Not Specified';
							// }

							if($total_cost>0){
								if($college_user_data->currency_symbol_left!=''){
									$course_cost=$college_user_data->currency_symbol_left.$total_cost;
								}else{
									$course_cost=$total_cost.$college_user_data->currency_symbol_right;
								}

								$_course_cost=$course_cost.' (Total Fees)';
							}else{
								//$_course_cost=' Not Specified';

								if($college_user_data->currency_symbol_left!=''){
									$course_cost=$college_user_data->currency_symbol_left.$total_cost;
								}else{
									$course_cost=$total_cost.$college_user_data->currency_symbol_right;
								}
							}									
							
						}else{
							$cost_data=$this->im->get_course_fees_data(array('user_course_cost_category'=>'GENERAL','user_id'=>$college_id,'user_course_id'=>$value->user_course,'user_course_year'=>'1'));

							//print_obj($cost_data);die;

							if(!empty($cost_data)){
								$cost_total=$cost_data->user_course_other_fee_total+$cost_data->user_course_total_fee;

								$total_cost=number_to_currency($cost_total);//number_to_currency($cost_data->user_course_total_fee);
							}else{
								$total_cost=0;
							}

								
							

							// if($cost_data->user_course_total_fee>0){
							// 	if($college_user_data->currency_symbol_left!=''){
							// 		$course_cost=$college_user_data->currency_symbol_left.$total_cost;
							// 	}else{
							// 		$course_cost=$total_cost.$college_user_data->currency_symbol_right;
							// 	}

							// 	$_course_cost=$course_cost.' (1st Year Fees)';
							// }else{
							// 	$_course_cost=' Not Specified';
							// }

							if($total_cost>0){
								if($college_user_data->currency_symbol_left!=''){
									$course_cost=$college_user_data->currency_symbol_left.$total_cost;
								}else{
									$course_cost=$total_cost.$college_user_data->currency_symbol_right;
								}

								$_course_cost=$course_cost.' (1st Year Fees)';
							}else{
								$_course_cost=' Not Specified';
							}
						}



						if($value->course_is_lateral=='1'){
							$course_short_name=strtoupper($value->course_short_name).'{Lateral}';
						}else{
							$course_short_name=strtoupper($value->course_short_name);
						}


						$course_fees_data[]=array(
							'course_full_name'=>strtoupper($value->course_name),
							'course_short_name'=>$course_short_name,
							'course_type'=>strtoupper($value->user_course_type),
							'course_pass_type'=>strtoupper($value->user_course_pass_type),
							'course_placement'=>strtoupper($value->user_course_placement_type),
							'course_duration'=>$value->user_course_duration_year,
							'course_duration_type'=>strtoupper($value->user_course_duration_type),
							'course_fees_1st_year'=>$_course_cost,
							'course_eligibility'=>$value->user_course_eligibility,
							'course_exams'=>'',
							'course_link'=>base_url().strtolower($country_data->country_iso_code_2).'/'.$slug_value.'/course-fees/'.url_slug(strtolower($value->course_name))
						);
					}

					//print_obj($course_fees_data);die;

					//die;
				}
			}		        		
    	}
      

    	$data['course_fees_data']=$course_fees_data;
    	$data['college_data']=$college_data;

        if ($visible) $this->render('front_course_fees_section',$data);
	}
}