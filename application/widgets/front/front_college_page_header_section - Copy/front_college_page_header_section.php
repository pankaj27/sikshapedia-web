<?php


/**
 * 
 */
class Front_college_page_header_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $segment_2=$this->uri->segment(2,0);//college,university url
        $segment_3=$this->uri->segment(3,0);//college,university url

        if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
            $user_id=decode_data(session_userdata('user_id'));
        }else{
            if($segment_2!='0'){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));
                $slug_type=$slug_found->slug_type;
                $user_id=$slug_found->slug_type_id;
            }  
        }

        $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$user_id));
        $college_type=$this->im->get_institute_types(array('inst_type'=>$college_data->college_type));

        $country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
        $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
        $state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

        $uni_slug=$this->sm->get_slug(array('slug_type'=>'7','slug_type_id'=>$college_data->college_user_id));
        $state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));
        $city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));

        if($segment_3!='0'){
            $segment_3_details=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$user_id,'menu_slug'=>$segment_3));

            //print_obj($segment_3_details);die;                        

            if(!empty($segment_3_details->menu_name_alias) || $segment_3_details->menu_name_alias!=NULL){
                $college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name).' - '.strtoupper($segment_3_details->menu_name_alias);
                $breadcumb=array(
                    'HOME'=>base_url(),
                    strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
                    strtoupper($segment_3_details->menu_name)=>''
                );
            }else{
                $college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name);
                $breadcumb=array(
                    'HOME'=>base_url(),
                    strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value,
                    strtoupper($segment_3_details->menu_name)=>''
                );
            }
        }else{
            $breadcumb=array(
                'HOME'=>base_url(),
                strtoupper($city_data->city_name)=>base_url().strtolower($country_data->country_iso_code_2).'/colleges/'.$state_slug->slug_value.'/'.$city_slug->slug_value
            );

            $college_name_formatted=strtoupper($college_data->college_name).','.strtoupper($city_data->city_name);
        }


        
        
        $data['file_cover_image']=$this->sm->get_user_file(array('user_storage_type'=>'user_banner','user_file_type_id'=>$user_id));
        


        $user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

        //$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->colege_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

        //print_obj($user_logo);die;

        if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
            $user_logo=$user_logo->media_disk_path_relative;
            $user_logo_name=$user_logo->media_org_name;
        }else{
            $user_logo=DIR_CDN.'data/app/app_data/no.jpg?tr=h-50,w-50,c-force';
            $user_logo_name='';
        }


        $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$user_id,'user_storage_type'=>'user_banner'));

        if(!empty($user_banner) && !empty($user_banner->media_disk_path_relative)){
            $user_banner=$user_banner->media_disk_path_relative;
            $user_banner_name=$user_banner->media_org_name;
        }else{
            $user_banner=base_url().'uploads/app/default/pageBnr.jpg';
            $user_banner_name='';
        }


        if(!empty($college_data->college_affiliation_type)){
            $caffiliations=$this->im->get_group_concat_affiliation_types('statutory_body_abbr','statutory_body_id',$college_data->college_affiliation_type);

            $college_affiliations=$caffiliations->concated_value;
        }else{
            $college_affiliations='';
        }


        $info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$user_id));

        if(!empty($info)){
            $college_info=array(
                'content_value'=>$info->info_value,
                'content_curator'=>$this->data['system_name_title'],
                'content_updated_on'=>date('F dS,Y',strtotime($info->info_updated_at))
            );
        }else{
            $college_info=array();
        }
  
        $_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>decode_data($user_id)),FALSE,'menu_serial','ASC');

        if(!empty($_inner_menu)){
            if(!empty($_inner_menu)){
                $i=0;
                foreach ($_inner_menu as $k => $v) {

                    if($segment_2!='0' && $v->menu_slug==$segment_2){
                        $active='active';
                        $default_active='';
                        $i++;
                    }else{
                        $active='';
                        $default_active=($segment_2=='0' && $i==0 && $v->menu_slug=='info')?'active':'';
                    }

                    if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
                        $menu_link=base_url().'account/'.$v->menu_slug;
                    }else{
                        $menu_link=$v->menu_link;
                    }
                    
                    $__inner_menu[]=array(
                        'menu_name'=>$v->menu_name,
                        'menu_link'=>$menu_link,
                        'menu_default_active'=>$default_active,
                        'menu_active'=>$active
                    );

                    $_inner_menu_names[]=$v->menu_name;
                    
                }
            }else{
                $__inner_menu=array();
                $_inner_menu_names=array();
            }
        }else{

        }

        $data['college_data']=array(
            'college_id'=>encode_data($college_data->college_id),
            'college_user_id'=>encode_data($college_data->college_user_id),
            'college_name'=>strtoupper($college_data->college_name),
            'college_name_formatted'=>$college_name_formatted,
            'college_affiliations'=>$college_affiliations,
            'college_country'=>strtoupper($country_data->country_name),
            'college_state'=>strtoupper($state_data->state_name),
            'college_country_id'=>encode_data($college_data->college_country_id),
            'college_city_id'=>$city_data->city_id,
            'college_city_state_id'=>$city_data->city_state_id,
            'college_city_country_id'=>$city_data->city_country_id,
            'college_city'=>strtoupper($city_data->city_name),
            'college_logo'=>$user_logo,
            'college_banner'=>$user_banner,
            'college_estd'=>$college_data->college_estd_year,
            'college_type'=>strtoupper($college_type->inst_type_name),
            'college_university'=>$college_university->university_name.','.strtoupper($college_university->city_name),
            'college_breadcrumb'=>$breadcumb,
            'college_inner_menues'=>$inner_menu,
            'college_page_top_ads'=>$top_ads_data,
            'college_claim_url'=>$college_data->access_url.'/clientclaim',
            'college_country_phone_code'=>$country_data->country_phone_code,
            'institute_type'=>encode_data(7),
            'inst_web_page'=>$inst_web_page,
            'apply_disabled'=>$apply_disabled,
            'show_apply'=>$show_apply_button,
            'college_info'=>$college_info
        );


        //print_obj($data['college_data']);die;


        if(session_userdata('isUserLoggedin') && session_userdata('user_id')){

            array_unshift( $__inner_menu,array(
                    'menu_name'=>'Account Settings',
                    'menu_link'=>base_url().'account/settings',
                    'menu_default_active'=>'',
                    'menu_active'=>($segment_2!='0' && $segment_2=='settings')?'active':''
                ),array(
                    'menu_name'=>'Branding',
                    'menu_link'=>base_url().'account/branding',
                    'menu_default_active'=>'',
                    'menu_active'=>($segment_2!='0' && $segment_2=='branding')?'active':''
                ),array(
                    'menu_name'=>'Menues',
                    'menu_link'=>base_url().'account/menues',
                    'menu_default_active'=>'',
                    'menu_active'=>($segment_2!='0' && $segment_2=='menues')?'active':''
                ));
        }


        //print_obj($__inner_menu);die;

       
        $data['inner_meues']=$__inner_menu;
        $data['system_inner_meues']=$system_inner_menu;
        $data['header_data']=$response;

        // print_r($data['header_data']);

        if ($visible) $this->render('front_college_page_header_section',$data);
    }
}