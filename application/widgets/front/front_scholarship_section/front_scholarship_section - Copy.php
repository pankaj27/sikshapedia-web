<?php


/**
 * 
 */
class Front_scholarship_section extends Widget
{
    function run($visible = FALSE){
        $this->front_theme='default';
        $this->get_type(2);

        $segment_1=$this->uri->segment(1,0); //country
        $segment_2=$this->uri->segment(2,0); //college,university url
        $segment_3=$this->uri->segment(3,0); //inner menues

        //echo $visible;die;

        if($visible=='1'){
            $visible=TRUE;
        }

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') || (is_string($segment_3) && $segment_3!='0' && $segment_3=='scholarships')){
            $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

            if(!empty($country_data)){
                $slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));

                if(!empty($slug_found)){
                    $slug_type=$slug_found->slug_type;
                    $slug_type_id=$slug_found->slug_type_id;
                    $slug_value=$slug_found->slug_value;

                    if($slug_type=='6'){//University

                    }else if($slug_type=='7'){//College
                        $_college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

                        if(!empty($_college_data)){
                            $college_data=array(
                                'college_name'=>strtoupper($_college_data->college_name)
                            );

                            $scholarship_detail_data=$this->nm->get_scholarship_data(array('scholarship_type'=>'college','scholarship_type_id'=>$slug_type_id),FALSE);

                            if(!empty($scholarship_detail_data)){
                                
                            }
                        }
                    }
                }
            }
        }

        $data['scholarship_data']=$scholarship_detail_data;
        // $data['college_data']=$college_data;

        if ($visible) $this->render('front_scholarship_section',$data);
    }
}