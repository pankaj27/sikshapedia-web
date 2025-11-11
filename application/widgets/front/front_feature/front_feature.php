<?php


/**
 * 
 */
class Front_feature extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $segment_1=$this->uri->segment(1,0); //country

        if(is_string($segment_1) && $segment_1!='0'){
            $country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
            $country_id=$country_data->country_id;
        }else{
            $country_id=$this->data['default_country_data']->country_id;
        }

        //,'is_verified_by_admin'=>'1'

        $param['college_status']='1';
        $param['college_is_top_ranked']='1';
        $param['country_id']=$country_id;

       // print_obj($param);die;
        $post['length']='10';

    	$top_ranked_colleges=CI()->im->_get_colleges($post,$param);

        //print_obj($top_ranked_colleges);die;

        $colleges=array();

        if(!empty($top_ranked_colleges)){
            foreach ($top_ranked_colleges as $key => $value) {
                $_college_logo=CI()->sm->___get_user_file('user_file_type_id,user_storage_type,media_disk_path_relative,media_disk_path',array('user_file_type_id'=>$value->user_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));

                if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative) && file_exists($_college_logo->media_disk_path)){
                    $college_logo=$_college_logo->media_disk_path_relative;
                }else{
                    // if($value->college_logo!=''){
                    //     $college_logo=$value->college_logo;
                    // }else{
                    //    $college_logo=base_url().'uploads/app/default/no.jpeg'; 
                    // }

                    if($value->college_user_id==='234'){
                        $college_logo='https://www.sikshapedia.com/public/data/colleges/dr-b-c-roy-college-of-pharmacy-and-allied-health-sciences-durgapur-west-bengal/d8OHpIe5qQ.webp'; 
                    }else if($value->college_user_id==='10470'){
                        $college_logo='https://www.sikshapedia.com/public/data/colleges/sister-nivedita-university-kolkata-west-bengal/nFWSmToZ38.webp'; 
                    }else if($value->college_user_id==='230'){
                        $college_logo='https://www.sikshapedia.com/public/data/colleges/mallabhum-institute-of-technology-bishnupur-west-bengal/mallabhum-institute-of-technology-bishnupur-west-bengal-logo.webp';
                    }
                    else{
                       $college_logo=base_url().'uploads/app/default/no.jpeg';  
                    }

                    
                    
                }
                $colleges[]=array(
                    'college_name'=>$value->college_name,
                    'college_city'=>$value->city_name,
                    'college_state'=>$value->state_name,
                    'college_country'=>$value->country_name,
                    'college_logo'=>$college_logo,
                    'college_alt_text'=>$value->college_name,
                    'access_url'=>$value->access_url
                );
            }
        }


    	$data['top_ranked_colleges']=$colleges;
        if ($visible) $this->render('front_feature',$data);
    }
}