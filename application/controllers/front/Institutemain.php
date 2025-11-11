<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Institutemain extends BaseFrontController
{
    public function indexPublicPages(){

        $current_url=current_url();

       // echo $current_url;

        $get_slug_data=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_value'=>$current_url));


      // print_obj($get_slug_data);die;


        // $arr=['front_info_section','front_course_fees_section','front_course_fees_course_section','front_course_fees_brief_with_ads_section','front_placement_section','front_placement_details_section','front_facilities_section','front_news_brief_section','front_google_maps_section','front_wayto_rating_section','front_nearby_colleges_universities_section','front_college_comment_section'];

        // $arr=['front_info_section','front_course_fees_section','front_course_fees_brief_with_ads_section','front_placement_section','front_facilities_section','front_news_brief_section','front_gallery_brief_section','front_google_maps_section','front_wayto_rating_section','front_college_comment_section','front_nearby_colleges_universities_section'];


        //$arr=['front_hostel_section','front_wayto_rating_section','front_college_comment_section','front_nearby_colleges_universities_section'];

        //$arr=['front_exam_cutoff_section'];

        //$arr=['front_faculties_section','front_wayto_rating_section','front_google_ads_section','front_similar_colleges_universities_section','front_google_ads_section','front_nearby_colleges_universities_section','front_google_ads_section'];

        //$arr=['front_gallery_section'];

        //$arr=['front_course_fees_section','front_course_fees_brief_with_ads_section','front_wayto_rating_section','front_college_comment_section','front_nearby_colleges_universities_section','front_google_ads_section','front_similar_colleges_universities_section','front_google_ads_section'];

       // $arr=['front_news_section','front_wayto_rating_section','front_google_ads_section','front_similar_colleges_universities_section','front_google_ads_section','front_nearby_colleges_universities_section','front_google_ads_section'];

        //$arr=['front_admission_section','front_wayto_rating_section','front_college_comment_section','front_google_ads_section','front_similar_colleges_universities_section','front_google_ads_section','front_nearby_colleges_universities_section','front_google_ads_section'];

       // $arr=['front_placement_section','front_wayto_rating_section','front_google_ads_section','front_similar_colleges_universities_section','front_google_ads_section','front_nearby_colleges_universities_section','front_google_ads_section'];

        //$arr=['front_scholarship_section'];

        //echo serialize($arr);die;

        if(!empty($get_slug_data)){
            $college_id=$get_slug_data->url_type_id;
            $college_country_id=$get_slug_data->url_country;
            $college_state_id=$get_slug_data->url_state;
            $college_city_id=$get_slug_data->url_city;


            $menu_data=$this->sm->get_menues(array('menu_link_type'=>'10','menu_link'=>$college_id,'menu_link'=>$current_url));

            $widget=$menu_data->menu_main_widget;

            $college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

            //print_obj($college_data);die;

            $college_type=$this->im->get_institute_types(array('inst_type'=>$college_data->college_type));

            $country_data=$this->com->get_country(array('country_id'=>$college_data->college_country_id));
            $city_data=$this->com->get_city(array('city_id'=>$college_data->college_city_id));
            $state_data=$this->com->get_state(array('state_id'=>$college_data->college_state_id));

            $uni_slug=$this->sm->get_slug(array('slug_type'=>'7','slug_type_id'=>$college_data->college_user_id));
            $state_slug=$this->sm->get_slug(array('slug_type'=>'1','slug_type_id'=>$state_data->state_id));
            $city_slug=$this->sm->get_slug(array('slug_type'=>'2','slug_type_id'=>$city_data->city_id));


            $user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_logo'),NULL,FALSE);

            //$user_logo=$this->sm->get_user_file(array('user_file_type_id'=>$college_data->colege_user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

            //print_obj($user_logo);die;

            if(!empty($user_logo) && !empty($user_logo->media_disk_path_relative)){
                $user_logo=$user_logo->media_disk_path_relative;
                $user_logo_name=$user_logo->media_org_name;
            }else{
                $user_logo=DIR_CDN.'data/app/app_data/w2a.png?tr=h-50,w-50,c-force';
                $user_logo_name='';
            }


            $user_banner=$this->sm->get_user_file(array('user_file_type_id'=>$college_id,'user_storage_type'=>'user_banner'));

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


            $info=$this->im->get_inst_info_data(array('info_type'=>'2','info_type_id'=>$college_id));

            if(!empty($info)){
                $college_info=array(
                    'content_value'=>$info->info_value,
                    'content_curator'=>$this->data['system_name_title'],
                    'content_updated_on'=>date('F dS,Y',strtotime($info->info_updated_at))
                );
            }else{
                $college_info=array();
            }

            

            $_inner_menu=$this->sm->get_menues(array('menu_is_active'=>'1','menu_is_inner'=>'1','menu_link_type'=>'10','menu_link_id'=>$college_id),FALSE,'menu_serial','ASC');

            //print_obj($_inner_menu);die;

            $url_breadcrumb=array();

            if(!empty($_inner_menu)){
                $i=0;
                foreach ($_inner_menu as $k => $v) {

                    $slug_data=$this->sm->get_slug_urls(array('url_value'=>$v->menu_link));

                    $url_meta_title=(!empty($slug_data))?$slug_data->url_meta_title:'';
                    $url_meta_heading=(!empty($slug_data))?$slug_data->url_meta_heading:'';
                    $url_meta_key_words=(!empty($slug_data))?$slug_data->url_meta_key_words:'';
                    $url_meta_desc=(!empty($slug_data))?$slug_data->url_meta_key_words:'';
                    $url_page_heading=(!empty($slug_data))?$slug_data->url_page_heading:'';
                    $url_og_title=(!empty($slug_data))?$slug_data->url_og_title:'';
                    $url_og_desc=(!empty($slug_data))?$slug_data->url_og_desc:'';
                    $url_breadcrumb[$v->menu_id]=(!empty($slug_data))?$slug_data->url_breadcrumb:'';

                    // $breadcumb='';

                    // print_obj($url_breadcrumb);die;

                    // if(!empty($url_breadcrumb)){
                    //     $z=1;
                    //     $count=count($url_breadcrumb);
                    //     foreach ($url_breadcrumb as $key => $value) {
                    //         $active=($z!=$count)?'active':'';
                    //         $breadcumb[]='<li class="breadcrumb-item"><a href="'.$value.'">'.$key.'</a></li>';
                    //         $z++;
                    //     }
                    // }

                    $inner_menu[]=array(
                        'menu_id'=>$v->menu_id,
                        'menu_name'=>$v->menu_name,
                        'menu_link'=>$v->menu_link,
                        'menu_alias'=>$v->menu_slug,
                        'menu_default_active'=>$default_active,
                        'menu_active'=>($i==0)?'active':'',
                        'menu_title'=>$url_meta_title.' - waytoadmission.com',
                        'menu_page_heading'=>$url_page_heading,
                        'menu_meta_key_words'=>$url_meta_key_words,
                        'menu_meta_desc'=>$url_meta_desc,                        
                        'meta_og_title'=>$url_og_title,
                        'meta_og_desc'=>$url_og_desc,
                        'menu_widgets'=>encode_data($v->menu_main_widget)
                    );

                    $i++;
                    
                }
            }else{
                $inner_menu=array();
            }


            //print_obj($inner_menu);die;


            $college_address=$college_data->college_address.','.strtoupper($city_data->city_name).','.strtoupper($state_data->state_name).','.strtoupper($country_data->country_name).','.$college_data->college_zipcode;

            $breadcumb=array();

            if(!empty($get_slug_data->url_breadcrumb)){
                $breadcumb=json_decode($get_slug_data->url_breadcrumb);
            }

            $page_title=$get_slug_data->url_page_heading;

            $college_name_formatted=$get_slug_data->url_page_heading;


            $this->data['college_data']=array(
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
                'college_address'=>$college_address,
                'college_zipcode'=>$college_data->college_zipcode,
                'college_web_address'=>$college_data->college_web_address,
                'college_google_map'=>'https://www.google.com/maps/embed/v1/place?key=AIzaSyCZm1_Yt_mBz93LOSnI640QAn6eeP891MU&q='.$college_address,
                'college_logo'=>$user_logo,
                'college_banner'=>$user_banner,
                'college_estd'=>$college_data->college_estd_year,
                'college_type'=>strtoupper($college_type->inst_type_name),
                'college_university'=>(isset($college_university))?$college_university->university_name.','.strtoupper($college_university->city_name):'',
                'college_breadcrumb'=>$breadcumb,
                'college_inner_menues'=>$inner_menu,
                'college_inner_menues_breadcrumb'=>$url_breadcrumb,
                'college_page_top_ads'=>$top_ads_data,
                'college_claim_url'=>$college_data->access_url.'/clientclaim',
                'college_country_phone_code'=>$country_data->country_phone_code,
                'institute_type'=>encode_data(7),
                'inst_web_page'=>$inst_web_page,
                'apply_disabled'=>$apply_disabled,
                'show_apply'=>$show_apply_button,
                'college_info'=>$college_info,
                'college_page_widget'=>encode_data($widget)
            );

            //print_obj($this->data['college_data']);die;

            $view_page='webpage/colleges/vw_college_web_page';

            $this->theme->title($page_title)->add_partial('partial_application_thanks_modal')->load($view_page, $this->data);
        }
    }


    public function onLoadWidgets(){
        if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

            $country_id=post_data('country');
            $college_id=post_data('inst');
            $widget=post_data('widget');
            //$menu=post_data('menu');

            $country_id=decode_data($country_id);
            $college_id=decode_data($college_id);
            $_widget=decode_data($widget);

            //print_obj($_widget);


            //echo $country_id;

            //echo $country_id;die;

            $widget=unserialize($_widget);

            //print_obj($widget);die;


            $this->data['widgets']=$widget;
            $this->data['country_id']=$country_id;
            $this->data['college_id']=$college_id;

            $return['html']=$this->theme->view('_pages/webpage/colleges/vw_college_widgets',$this->data,true);

     
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($return);

        }else{
            return redirect(base_url());
        }
    }
}