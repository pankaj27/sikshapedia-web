<?php


/**
 * 
 */
class Front_course_fees_course_section extends Widget
{

	function run($visible = FALSE,$college_id,$course_id=0){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_4=$this->uri->segment(4,0);//course


    	$slug_data=$this->sm->get_slug(array('slug_value'=>$segment_4));

    	//print_obj($slug_data);die;

    	$_course_data=$this->im->_get_user_course_data(array('user_id'=>$college_id,'course_id'=>$slug_data->slug_type_id,'user_type'=>'4'),TRUE);

    	//print_obj($_course_data);die;



    	$cost_group=$this->im->get_user_courses_cost_group(array('user_id'=>$college_id,'user_course_id'=>$slug_data->slug_type_id),'user_course_cost_category');

    	if(!empty($cost_group)){
    		foreach ($cost_group as $key => $value) {


    			if($value->user_course_cost_type==1 && $value->user_course_cost_breakup_type==1){
    				$fees_data=$this->im->get_course_fees_data(array('user_id'=>$college_id,'user_course_cost_category'=>$value->user_course_cost_category,'user_course_id'=>$slug_data->slug_type_id),FALSE);

    				$total=0;



    				foreach ($fees_data as $k => $v) {
    					$total+=$v->user_course_tution_fee_total+$v->user_course_admisssion_fee_sem_1+$v->user_course_reg_fee_sem_1+$v->user_course_exam_fee_sem_1+$v->user_course_other_fee_sem_1;

    					$year_total=$v->user_course_tution_fee_total+$v->user_course_admisssion_fee_sem_1+$v->user_course_reg_fee_sem_1+$v->user_course_exam_fee_sem_1+$v->user_course_other_fee_sem_1;

    					$firstyear_total[]=$v->user_course_tution_fee_total+$v->user_course_admisssion_fee_sem_1+$v->user_course_reg_fee_sem_1+$v->user_course_exam_fee_sem_1+$v->user_course_other_fee_sem_1;

    					$_fees_data[$value->user_course_cost_category][]=array(
    						'fees_year'=>$v->user_course_year,
    						'fees_value'=>number_format($v->user_course_tution_fee_total),
    						'fees_tution_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_1),
    						'fees_tution_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_2),
    						'fees_admission_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_admisssion_fee_sem_1),
    						'fees_admission_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_admisssion_fee_sem_2),
    						'fees_registration_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_reg_fee_sem_1),
    						'fees_registration_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_reg_fee_sem_2),
    						'fees_exam_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_exam_fee_sem_1),
    						'fees_exam_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_exam_fee_sem_2),
    						'fees_other_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_other_fee_sem_1),
    						'fees_other_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_other_fee_sem_2),
    						'fees_tution_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_2),
    						'fees_value_formatted'=>($year_total>100000)?number_to_currency($year_total):number_format($year_total)
    					);
    				}

    				$_total=($total>100000)?number_to_currency($total):number_format($total);

    				//$total_1st_year_wise=$fees_data[0]->user_course_tution_fee_total+$fees_data[0]->user_course_admisssion_fee_sem_1+$fees_data[0]->user_course_reg_fee_sem_1+$fees_data[0]->user_course_exam_fee_sem_1+$fees_data[0]->user_course_other_fee_sem_1;

    				$total_1st_year_wise=$firstyear_total[0];


    				$first_year_fees=($total_1st_year_wise>100000)?number_to_currency($total_1st_year_wise):number_format($total_1st_year_wise);


    				$total_cost[$value->user_course_cost_category]=$_total;

    			}else if($value->user_course_cost_type==2 && $value->user_course_cost_breakup_type==1){
    				$fees_data=$this->im->get_course_fees_data(array('user_id'=>$college_id,'user_course_cost_category'=>$value->user_course_cost_category,'user_course_id'=>$slug_data->slug_type_id),FALSE);

    				$total=0;

    				foreach ($fees_data as $k => $v){
    					$total_year_wise=$v->user_course_tution_fee_sem_1+$v->user_course_tution_fee_sem_2+$v->user_course_admisssion_fee_sem_1+$v->user_course_admisssion_fee_sem_2+$v->user_course_reg_fee_sem_1+$v->user_course_reg_fee_sem_2+$v->user_course_exam_fee_sem_1+$v->user_course_exam_fee_sem_2+$v->user_course_other_fee_sem_1+$v->user_course_other_fee_sem_2;
    					$total+=$v->user_course_total_fee;

    					if($v->user_course_admisssion_fee_sem_1>0 || $v->user_course_admisssion_fee_sem_2>0){
    						$admission_fee_available[]='yes';
    					}else{
    						$admission_fee_available[]='no';
    					}

    					if($v->user_course_reg_fee_sem_1>0 || $v->user_course_reg_fee_sem_2>0){
    						$reg_fee_available[]='yes';
    					}else{
    						$reg_fee_available[]='no';
    					}


    					if($v->user_course_exam_fee_sem_1>0 || $v->user_course_exam_fee_sem_2>0){
    						$exam_fee_available[]='yes';
    					}else{
    						$exam_fee_available[]='no';
    					}

    					if($v->user_course_other_fee_sem_1>0 || $v->user_course_other_fee_sem_2>0){
    						$other_fee_available[]='yes';
    					}else{
    						$other_fee_available[]='no';
    					}

    					$firstyear_total[]=$v->user_course_tution_fee_sem_1+$v->user_course_tution_fee_sem_2+$v->user_course_admisssion_fee_sem_1+$v->user_course_admisssion_fee_sem_2+$v->user_course_reg_fee_sem_1+$v->user_course_reg_fee_sem_2+$v->user_course_exam_fee_sem_1+$v->user_course_exam_fee_sem_2+$v->user_course_other_fee_sem_1+$v->user_course_other_fee_sem_2;


    					$_fees_data[$value->user_course_cost_category][]=array(
    						'fees_year'=>$v->user_course_year,    						
    						'fees_tution_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_1),
    						'fees_tution_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_2),
    						'fees_admission_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_admisssion_fee_sem_1),
    						'fees_admission_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_admisssion_fee_sem_2),
    						'fees_registration_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_reg_fee_sem_1),
    						'fees_registration_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_reg_fee_sem_2),
    						'fees_exam_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_exam_fee_sem_1),
    						'fees_exam_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_exam_fee_sem_2),
    						'fees_other_sem_1['.$v->user_course_year.']'=>number_format($v->user_course_other_fee_sem_1),
    						'fees_other_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_other_fee_sem_2),
    						'fees_tution_sem_2['.$v->user_course_year.']'=>number_format($v->user_course_tution_fee_sem_2),
    						'fees_tution_sem_total['.$v->user_course_year.']'=>($total_year_wise>100000)?number_to_currency($total_year_wise):number_format($total_year_wise)
    					);
    				}

    				

    				//$total_1st_year_wise=$fees_data[0]->user_course_tution_fee_sem_1+$fees_data[0]->user_course_tution_fee_sem_2+$fees_data[0]->user_course_admisssion_fee_sem_1+$fees_data[0]->user_course_admisssion_fee_sem_2+$fees_data[0]->user_course_reg_fee_sem_1+$fees_data[0]->user_course_reg_fee_sem_2+$fees_data[0]->user_course_exam_fee_sem_1+$fees_data[0]->user_course_exam_fee_sem_2+$fees_data[0]->user_course_other_fee_sem_1+$fees_data[0]->user_course_other_fee_sem_2;

    				$total_1st_year_wise=$firstyear_total[0];

    				$first_year_fees=($total_1st_year_wise>1000000)?number_to_currency($total_1st_year_wise):number_format($total_1st_year_wise);

    				$_total=($total>100000)?number_to_currency($total):number_format($total);

    				$total_cost[$value->user_course_cost_category]=$_total;
    			}
    			else{
    				$_fees_data=array();
    				$first_year_fees=0;
    				$total_cost=0;
    				$admission_fee_available='no';
    				$reg_fee_available='no';
    				$exam_fee_available='no';
    				$other_fee_available='no';
    			}

    			// $cost_data['admission_fee_available']=$admission_fee_available;
    			// $cost_data['reg_fee_available']=$reg_fee_available;
    			// $cost_data['exam_fee_available']=$exam_fee_available;
    			// $cost_data['other_fee_available']=$other_fee_available;

    			$cost_data['fees_data']=$_fees_data;
    			$cost_data['total_fees_data']=$total_cost;
    		}
    	}

    	$user_courses_exams=$this->strm->get_user_courses_exam(array('user_id'=>$college_id,'course_id'=>$_course_data->course_id,'user_type'=>'4'),FALSE,'exam_id','ASC',NULL,'exam_name',FALSE);


    	//print_obj($user_courses_exams);die;

		if(!empty($user_courses_exams)){
			foreach ($user_courses_exams as $key => $value) {
				$exam=$this->strm->get_exam(array('exam_status'=>'1','exam_id'=>$value->exam_id),TRUE);

				//if(!empty($exams)){
					$exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_type_id'=>$value->exam_id));
					$_exams[]=array(
						'exam_id'=>encode_data($value->exam_id),
						'exam_name'=>$exam->exam_full_name,
						'exam_short_name'=>$exam->exam_short_name.' '.date(Y),
						'exam_slug'=>base_url('exams/'.$exam_slug->slug_value)
					);
				//}
			}
		}else{
			$_exams=array();
		}


    	$course_data=array(
			'course_full_name'=>strtoupper($_course_data->course_name),
			'course_short_name'=>strtoupper($_course_data->course_short_name),
			'course_type'=>strtoupper($_course_data->user_course_type),
			'course_pass_type'=>strtoupper($_course_data->user_course_pass_type),
			'course_placement'=>strtoupper($_course_data->user_course_placement_type),
			'course_duration'=>($_course_data->user_course_dur>1)?$_course_data->user_course_duration_year.' YEARS':$_course_data->user_course_duration_year.' YEAR',
			'course_duration_type'=>strtoupper($_course_data->user_course_duration_type),
			'course_eligibility_desc'=>$_course_data->user_course_eligibility_broad,
			'course_cost_first_year'=>$first_year_fees,
			'course_cost_total'=>'',
			'course_eligibility'=>'',
			'copurse_streams'=>'',
			'course_total_sems'=>'',
			'cost_group'=>$cost_group,
			'course_details_costs'=>$cost_data,
			'exams_accepted'=>$_exams,
			'admission_data'=>null
		);

		//print_obj($course_data);die;


    	$data['course_data']=$course_data;
    	//$data['college_data']=$_college_data;



      if ($visible) $this->render('front_course_fees_course_section',$data);

   }


	function run1($visible = FALSE,$college_id){
		$this->front_theme='default';
    	$this->get_type(2);

    	$segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //inner menues
        $segment_4=$this->uri->segment(4,0);//course
        $segment_5=$this->uri->segment(5,0);//stream

        
        $course_data=array();
        $college_data=array();
        $course_stream_details=array();
        $course_streams=array();
        $total_sems=0;


        if(!empty($college_id)){
        	$_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        	//print_obj($_college_data);die;

        	if(!empty($_college_data)){
        		$college_data=array(
					'college_name'=>strtoupper($_college_data->college_name)
				);

        		$slug4_found=$this->sm->get_slug(array('slug_value'=>$segment_4));

        		//print_obj($slug4_found);die;

					$slug4_type=$slug4_found->slug_type;
					$slug4_type_id=$slug4_found->slug_type_id;
					$slug4_value=$slug4_found->slug_value;
        		if($segment_5!='0'){
					$slug5_found=$this->sm->get_slug(array('slug_value'=>$segment_5));

					$slug5_type=$slug5_found->slug_type;
					$slug5_type_id=$slug5_found->slug_type_id;
					$slug5_value=$slug5_found->slug_value;

					$course_stream_details=array('hi');

					$data['course_stream_details']=$course_stream_details;
					
				}


				$_course_data = $this->im->get_user_course(array('user_type'=>'4','user_id'=>$college_id,'user_course'=>$slug4_type_id),FALSE);
        	

				if(!empty($_course_data)){

					$first_year_cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$slug_type_id,'user_course_id'=>$_course_data->user_course_id,'user_course_year'=>'1'),FALSE);

					$total_cost_data=$this->im->get_user_course_grand_total(array('user_id'=>$slug_type_id,'user_course_id'=>$_course_data->user_course_id),FALSE);

					$first_year_total_cost=number_format($first_year_cost_data[0]->total_cost, 2,'.', ',');
					$total_cost=number_to_currency($total_cost_data[0]->total_cost);

					$first_year_course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$first_year_total_cost:$first_year_total_cost.$college_user_data->currency_symbol_right;
					$course_cost=($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$total_cost:$total_cost.$college_user_data->currency_symbol_right;


					$course_cost_detailed=$this->im->get_course_fees_data(array('user_id'=>$slug_type_id,'user_course_id'=>$_course_data->user_course_id),FALSE);

					if(!empty($course_cost_detailed)){
						$i=1;
						$total_sems=count($course_cost_detailed)*2;
						foreach ($course_cost_detailed as $key => $value) {
							$detialed_cost[]=array(
								'years'=>'YEAR '.$i,
								'sem_1'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_1:$value->user_course_tution_fee_sem_1.$college_user_data->currency_symbol_left,
								'sem_2'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_2:$value->user_course_tution_fee_sem_2.$college_user_data->currency_symbol_left,
								'sem_3'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_3:$value->user_course_tution_fee_sem_3.$college_user_data->currency_symbol_left,
								'sem_4'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_4:$value->user_course_tution_fee_sem_4.$college_user_data->currency_symbol_left,
								'sem_5'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_5:$value->user_course_tution_fee_sem_5.$college_user_data->currency_symbol_left,
								'sem_6'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_6:$value->user_course_tution_fee_sem_6.$college_user_data->currency_symbol_left,
								'sem_7'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_7:$value->user_course_tution_fee_sem_7.$college_user_data->currency_symbol_left,
								'sem_8'=>($college_user_data->currency_symbol_left!='')?$college_user_data->currency_symbol_left.$value->user_course_tution_fee_sem_8:$value->user_course_tution_fee_sem_8.$college_user_data->currency_symbol_left,																				
							);

							$i++;
						}
					}


					$_course_streams=$this->strm->get_user_course_stream(array('user_id'=>$slug_type_id,'course_id'=>$_course_data->user_course_id),FALSE,'user_course_stream_id','ASC');

					if(!empty($_course_streams)){
						foreach ($_course_streams as $key => $value) {
							$stream_slug=$this->sm->get_slug(array('slug_type'=>'4','slug_type_id'=>$value->stream_id));
							$course_streams[]=array(
								'stream_name'=>$value->stream_name,
								'stream_link'=>base_url().strtolower($country_data->country_iso_code_2).'/'.$slug_value.'/course-fees/'.$slug4_value.'/'.$stream_slug->slug_value
							);
						}
					}



					$course_data=array(
						'course_full_name'=>strtoupper($_course_data->course_name),
						'course_short_name'=>strtoupper($_course_data->course_short_name),
						'course_type'=>strtoupper($_course_data->user_course_type),
						'course_pass_type'=>strtoupper($_course_data->user_course_pass_type),
						'course_placement'=>strtoupper($_course_data->user_course_placement_type),
						'course_duration'=>$_course_data->user_course_duration_year.' YEARS',
						'course_duration_type'=>strtoupper($_course_data->user_course_duration_type),
						'course_fees_1st_tear'=>$first_year_course_cost,
						'course_cost_total'=>$course_cost,
						'course_eligibility'=>'',
						'copurse_streams'=>$course_streams,
						'course_total_sems'=>$total_sems,
						'course_details_costs'=>$detialed_cost
					);


					//print_obj($course_data);die;

				}

			}

        }
       


    	$data['course_data']=$course_data;
    	$data['college_data']=$_college_data;

    	//print_obj($data);die;

        if ($visible) $this->render('front_course_fees_course_section',$data);
	}
}