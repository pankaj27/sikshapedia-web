<?php


/**
 * 
 */
class Front_banner extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        //$this->output->cache(60);

        $fields='banner_main_title,banner_sub_title,banner_alt_title,banner_title,banner_link,media_disk_path_relative,banner_status';


        $banners=$this->sm->__get_banner_files($fields,array('banner_status'=>'active'),FALSE);

    	if(!empty($banners)){
    		foreach ($banners as $key => $value) {

                $banner_main_title=$value->banner_main_title;
                $banner_sub_title=$value->banner_sub_title;
                $banner_title=$value->banner_title;
                $banner_alt_title=$value->banner_alt_title;
                $access_url=$value->banner_link ;

    			$_banners[]=array(
    				'banner_image'=>$value->media_disk_path_relative,
    				'banner_main_title'=>ucwords($banner_main_title),
                    'banner_sub_title'=>ucwords($banner_sub_title),
                    'banner_title'=>ucwords($banner_title),
                    'banner_alt_title'=>ucwords($banner_alt_title),
                    'access_url'=>$access_url
    			);
    		}
    	}else{
    		$_banners=array();
    	}



    	$data['banners']=$_banners;

        if ($visible) $this->render('front_banner',$data);
    }
}