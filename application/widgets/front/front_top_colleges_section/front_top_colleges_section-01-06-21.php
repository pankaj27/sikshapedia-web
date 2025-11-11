<?php


/**
 * 
 */
class Front_top_colleges_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$param=array('college_status'=>'1','college_is_top'=>'1','college_is_top_visible_home'=>'1','is_verified_by_admin'=>'1');

    	$top_colleges=$this->im->_get_colleges(null,$param);

    	if(!empty($top_colleges)){
    		foreach ($top_colleges as $key => $value) {
                $college_user_data=$this->um->get_user_data(array('user_id'=>$value->user_id),NULL,$value->user_role);                
    			$college_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
    			$college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));
                $currency=$this->com->get_currency(array('currency_id'=>$college_user_data->user_currency));

                $total_cost=$this->im->get_user_course_grand_total(array('user_id'=>$value->user_id),FALSE)[0]->total_cost;

                $course_cost=($currency->currency_symbol_left!='')?$currency->currency_symbol_left.number_to_currency($total_cost):number_to_currency($total_cost).$currency->currency_symbol_right;


                if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
                    $college_logo=$college_logo->media_disk_path_relative;
                    $college_logo_name=$college_logo->media_org_name;
                }else{
                    $college_logo=base_url().'uploads/app/default/no.jpg';
                    $college_logo_name='';
                }


                if(!empty($college_banner) && !empty($college_banner->media_disk_path_relative)){
                    $college_banner=$college_banner->media_disk_path_relative;
                    $college_banner_name=$college_banner->media_org_name;
                }else{
                    $college_banner=base_url().'uploads/app/default/pageBnr.jpg';
                    $college_banner_name='';
                }

                $is_featured='2';

    			$college_data[]=array(
    				'college_name'=>$value->college_name,
    				'college_city'=>$value->city_name,
    				'college_state'=>$value->state_name,
    				'college_country'=>$value->country_name,
                    'college_total_course_amount'=>number_to_currency($total_cost),
                    'college_total_course_amount_with_currency'=>$course_cost,
    				'college_logo'=>$college_logo,
    				'college_banner'=>$college_banner,
                    'is_featured'=>$is_featured,
                    'access_url'=>$value->access_url
    			);
    		}
    	}else{
    		$college_data=array();
    	}

        //die;


    	$data['top_colleges']=$college_data;


        $uparam=array('university_status'=>'1','university_is_top'=>'1','university_is_top_visible_home'=>'1','is_verified_by_admin'=>'1');

        $top_universities=$this->im->_get_universities(null,$uparam);

        //print_obj($top_universities);die;

        //die;
  
        if(!empty($top_universities)){
            foreach ($top_universities as $key => $value) {
                $university_user_data=$this->um->get_user_data(array('user_id'=>$value->user_id),NULL,$value->user_role);
                $university_banner=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_banner'));
                $university_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo'));
                $currency=$this->com->get_currency(array('currency_id'=>$university_user_data->user_currency));

                $_total_cost=$this->im->get_user_course_grand_total(array('user_id'=>$value->user_id),FALSE)[0]->total_cost;

                $total_cost=(!empty($_total_cost))?$_total_cost:'0.00';

                $course_cost=($currency->currency_symbol_left!='')?$currency->currency_symbol_left.$total_cost:$total_cost.$currency->currency_symbol_right;

                //print_obj($type_data);

                if(!empty($university_logo) && !empty($university_logo->media_disk_path_relative)){
                    $user_logo=$university_logo->media_disk_path_relative;
                    $user_logo_name=$university_logo->media_org_name;
                }else{
                    $user_logo=base_url().'uploads/app/default/no.jpg';
                    $user_logo_name='';
                }


                if(!empty($university_banner) && !empty($university_banner->media_disk_path_relative)){
                    $user_banner=$university_banner->media_disk_path_relative;
                    $user_banner_name=$university_banner->media_org_name;
                }else{
                    $user_banner=base_url().'uploads/app/default/pageBnr.jpg';
                    $user_banner_name='';
                }

                $is_featured='2';

                $university_data[]=array(
                    'university_name'=>$value->university_name,
                    'university_city'=>$value->city_name,
                    'university_state'=>$value->state_name,
                    'university_country'=>$value->country_name,
                    'university_total_course_amount'=>$total_cost,
                    'university_total_course_amount_with_currency'=>$course_cost,
                    'university_logo'=>$user_logo,
                    'university_banner'=>$user_banner,
                    'is_featured'=>$is_featured,
                    'access_url'=>$value->access_url
                );
            }
        }else{
            $university_data=array();
        }

        //print_obj($university_data);die;

        $data['top_universities']=$university_data;



        if ($visible) $this->render('front_top_colleges_section',$data);
    }
}