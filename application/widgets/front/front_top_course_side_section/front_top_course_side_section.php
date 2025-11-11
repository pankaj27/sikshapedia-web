<?php


/**
 * 
 */
class Front_top_course_side_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);


        $country_id=$ids['country_id'];
        $college_id=$ids['college_id'];

        $courses_data=array();


        $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$college_id));

        if(!empty($_college_data)){
            $menu_link_type=($_college_data->college_utype==4)?'10':'101';
            $_inner_meues=$this->sm->get_menues_specific('menu_id,menu_name,menu_main_widget,menu_link,menu_is_active',array('menu_link_type'=>$menu_link_type,'menu_link_id'=>$college_id,'menu_type'=>'2','menu_is_active'=>'1'));
            $get_user_courses=$this->im->_get_user_course_data(array('is_popular'=>'1','user_id'=>$college_id),FALSE);

            //print_obj($get_user_courses);die;

            if(!empty($get_user_courses)){
                foreach ($get_user_courses as $key => $value) {
                    $course_slug=$this->sm->get_slug(array('slug_type'=>'5','slug_type_id'=>$value->user_course));

                    $slug_data_found=$this->sm->get_slug_urls(array('url_type'=>'college_static_url','url_glob_type'=>'college_inner_menu','url_sub_type'=>'college_inner_menu_course_fees_details_url','url_type_id'=>$college_id,'url_sub_type_id'=>$value->user_course,'url_course'=>$value->user_course));

                    $courses_data[]=array(
                        'course_name'=>$value->course_name,
                        'duration'=>$value->user_course_duration_year.' YEARS',
                        'avg_fees'=>'',
                        'access_link'=>(!empty($slug_data_found))?$slug_data_found->url_value:null
                    );
                }
            }
        }

        $data['all_access_link']=$_inner_meues->menu_link;

        $data['courses_data']=$courses_data;

        if ($visible) $this->render('front_top_course_side_section',$data);
    }
}