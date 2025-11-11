<?php


/**
 * 
 */
class Front_nearby_colleges_side_section extends Widget
{

	function run($visible = FALSE,$ids=null){
		$this->front_theme='default';
    	$this->get_type(2);

    	$country_id=$ids['country_id'];
    	$city_id=$ids['city_id'];
    	$state_id=$ids['state_id'];
    	$college_id=$ids['college_id'];




        if($country_id!=null && $state_id!=null && $city_id!=null){

            $param=array('country_id'=>$country_id,'state_id'=>$state_id,'city_id'=>$city_id,'not_college_id'=>$college_id);
            $param['order']=array('college_id'=>'ASC');
            $post['length']=25;
            $post['start']=0;

            $colleges=$this->im->_get_colleges($post,$param);

            //print_obj($colleges);die;

            $college_data=array();


            if(!empty($colleges)){
                foreach ($colleges as $key => $value) {
                    $_college_banner=$this->strg->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_banner'));

                    $_college_logo=$this->strg->get_user_file(array('user_file_type_id'=>$value->college_user_id,'user_storage_type'=>'user_logo'));

                    if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                        $college_logo=$_college_logo->media_disk_path_relative;
                        $college_logo_name=$_college_logo->media_org_name;
                    }else{
                        $college_logo=SITE_ASSETS_URL.'data/app/app_data/no.jpg';
                        $college_logo_name='';
                    }

                   


                    if(!empty($_college_banner) && !empty($_college_banner->media_disk_path_relative)){
                        $college_banner=$_college_banner->media_disk_path_relative;
                        $college_banner_name=$_college_banner->media_org_name;
                    }else{
                        $college_banner=SITE_ASSETS_URL.'data/app/app_data/pageBnr.jpg';
                        $college_banner_name='';
                    }

                    $is_featured='2';

                    $college_data[]=array(
                        'college_name'=>ucwords(strtolower($value->college_name)),
                        'college_city'=>ucwords(strtolower($value->city_name)),
                        'college_state'=>ucwords(strtolower($value->state_name)),
                        'college_country'=>ucwords(strtolower($value->country_name)),
                        'college_logo'=>$college_logo,
                        'college_banner'=>$college_banner,
                        'is_featured'=>$is_featured,
                        'access_url'=>$value->access_url
                    );
                }
            }

        }

    	$data['college_data']=$college_data;

    


      	if ($visible) $this->render('front_nearby_colleges_side_section',$data);
    }
}