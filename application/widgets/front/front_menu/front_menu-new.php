<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_menu extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $slug_1=$this->uri->segment(1,0);//country

        $footer_ads_heading=array();
        $footer_ads=array();

        $menues_fields='menu_id,menu_name,menu_column_id,menu_is_top,menu_is_active,menu_parent_id,menu_serial,menu_link_type,menu_link';

    	$top_menues=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'1','menu_is_active'=>'1','menu_parent_id'=>'0'),FALSE,'menu_serial','ASC',FALSE);

        $main_menues=array();
        $featured_colleges_data=array();
        $featured_college_heading='';

    	if(!empty($top_menues)){
    		foreach ($top_menues as $key => $value) {
                $top_menu_id=$value->menu_id;
    			$sub_menues=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'2','menu_is_active'=>'1','menu_parent_id'=>$value->menu_id),FALSE,'menu_serial','ASC'); 

                $sub_menues_data=array();             

    			if(!empty($sub_menues)){
    			   	foreach ($sub_menues as $k => $v) {

                       $sub_menues_data_2=array();                       

                       $menu_columns=$this->sm->get_menue_columns_specific('menu_column_id,menu_column_parent_id,menu_column_status,menu_column_serial,menu_column_has_menu,menu_column_has_image_type,menu_column_status',array('menu_column_parent_id'=>$v->menu_id,'menu_column_status'=>'1'),FALSE,'menu_column_serial','ASC');                       

                        if(!empty($menu_columns)){
                            foreach ($menu_columns as $__k => $__v) {
                                $sub_menues_column_data_2=array();

                                if($__v->menu_column_has_menu=='1'){
                                    $sub_menues_2=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'2','menu_is_active'=>'1','menu_parent_id'=>$__v->menu_column_parent_id,'menu_column_id'=>$__v->menu_column_id),FALSE);

                                    foreach ($sub_menues_2 as $_k => $_v) {

                                        if($_v->menu_link_type=='4'){//Exam Link
                                            $exam_image=$this->sm->__get_user_file('user_file_type_id,user_storage_type,user_storage_type,media_disk_path_relative',array('user_file_type_id'=>$_v->menu_link_id,'user_storage_type'=>'exam_logo'));
                                            if(!empty($exam_image)){
                                                $menu_image=$exam_image->media_disk_path_relative;
                                            }else{
                                                $menu_image='';
                                            }                                            
                                        }else{
                                            $menu_image='';
                                        }

                                        $sub_menues_column_data_2[]=array(
                                            'menu_link_type'=>$_v->menu_link_type,
                                            'menu_name'=>strtoupper($_v->menu_name),
                                            'menu_image'=>$menu_image,
                                            'menu_link'=>$_v->menu_link                           
                                        );
                                    }



                                    if($__v->menu_column_has_menu=='0'){
                                        $column_width='6';
                                    }else if($__v->menu_column_has_menu=='1'){
                                        $column_width=$__v->menu_column_no;
                                    }else if($__v->menu_column_has_menu=='2'){
                                        $column_width='4';
                                    }


                                    $_col_image=$this->sm->__get_user_file('user_file_type_id,user_storage_type,user_storage_type,media_disk_path_relative',array('user_file_type_id'=>$__v->menu_column_name_id,'user_storage_type'=>$__v->menu_column_has_image_type));
                                    if(!empty($_col_image)){
                                        $column_image=$_col_image->media_disk_path_relative;
                                    }else{
                                        $column_image='';
                                    }

                                    $sub_menues_data_2[]=array(
                                        'menu_column'=>strtoupper($__v->menu_column_name),
                                        'menu_column_has_image'=>$__v->menu_column_has_image,
                                        'menu_column_image_position'=>$__v->menu_column_image_position,
                                        'menu_column_image'=>$column_image,
                                        'menu_column_width'=>$column_width,
                                        'menu_column_has_link'=>$__v->menu_column_has_link,
                                        'menu_column_link'=>$__v->menu_column_link,
                                        'menu_column_image_width'=>(!empty($__v->menu_column_image_width))?$__v->menu_column_image_width:'170',
                                        'menu_column_image_height'=>(!empty($__v->menu_column_image_height))?$__v->menu_column_image_height:'81',
                                        'sub_menues'=>$sub_menues_column_data_2                                                                   
                                    );
                                }
                                    
                            }
                        }                       

                       $sub_menues_data[]=array(
                           'menu_name'=>strtoupper($v->menu_name),
                           'sub_menues'=>$sub_menues_data_2
                       );
                    }	
    			}



    			$main_menues['menues'][]=array(
                    'menu_id'=>$value->menu_id,
    				'menu_name'=>strtoupper($value->menu_name),
                    'menu_link_id'=>$value->menu_link_id,
                    'menu_link'=>$value->menu_link,
    				'sub_menues'=>$sub_menues_data                    
    			);               
    		}


            if(!empty($main_menues['menues'])){
                foreach ($main_menues['menues'] as $key => $value) {
                    $_footer_ads_param=array('listing_is_top_menu_id'=>$value['menu_id'],'listing_is_top_menu'=>'1','listing_is_top_menu_type_id'=>$value['menu_link_id'],'listing_status'=>'1','listing_category'=>'CUSTOM_INNER_LINK_ADS');

                    //print_obj($_footer_ads_param);die;

                    $_footer_ads=$this->um->get_listing_package_users($_footer_ads_param,FALSE);

                    //print_obj($_footer_ads);

                    if(!empty($_footer_ads)){
                        $footer_ads_heading[$value['menu_id']]['heading']='FEATURED '.strtoupper($value['menu_name']).' COLLEGES IN '.$country_name;
                        foreach ($_footer_ads as $k => $v){
                            $college_profile_found=$this->im->get_college_profile_data(array('college_user_id'=>$v->listing_user_id));
                            $college_city=$this->com->get_city(array('city_id'=>$college_profile_found->college_city_id));
                            $college_state=$this->com->get_state(array('state_id'=>$college_profile_found->college_state_id));

                            $college_address=ucwords($college_city->city_name).','.ucwords($college_state->state_name);


                            $college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_profile_found->college_user_id,'user_storage_type'=>'user_logo'));

                            if(!empty($college_logo) && !empty($college_logo->media_disk_path_relative)){
                                $college_logo=$college_logo->media_disk_path_relative;
                            }else{
                                $college_logo=base_url().'uploads/app/default/no.jpg';
                            }

                            $footer_ads[$value['menu_id']][]=array(
                                'college_name'=>ucwords($college_profile_found->college_name),
                                'college_address'=>$college_address,
                                'college_logo'=>$college_logo,
                                'college_link'=>$v->listing_link
                            );
                        }
                        
                    }
                }
            }
    	}


    	$data['top_menues']=$main_menues;
        $data['top_menu_footer_ads_heading']=$footer_ads_heading;
        $data['top_menu_footer_ads']=$footer_ads;

        //echo json_encode($data);die;


        if(session_userdata('isUserLoggedin')==TRUE && session_userdata('user_id')){
           $user_id_decoded=decode_data(session_userdata('user_id'));
           $userdata=$this->um->get_user_data(array('user_id'=>$user_id_decoded),null,'0');

           if($userdata->user_phone_no_verified=='1'){
            $data['scholarshiplink']='href="'.base_url().'in/scholarship"';
           }else{
            $data['scholarshiplink']='href="'.base_url().'account/'.encode_data($userdata->user_id).'/'.encode_data('scholarship').'"';
           }

           $data['userdata']=$userdata;
        }else{
          $data['scholarshiplink']='href="#logModal" data-toggle="modal"';
        }

           
        

        if ($visible) $this->render('front_menu',$data);
    }
}