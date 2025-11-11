<?php


/**
 * 
 */
class Front_meta_preload_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $param['column_order'] = array(
            null,
            'banner_main_title'
        );

        $param['banner_status']='active';
        $param['column_search'] = array('banner_main_title');
        $param['order'] = array('banner_serial' => 'ASC');
        $posts=null;


        $banners = $this->sm->_get_banner_files($posts,$param,FALSE,FALSE);

    	if(!empty($banners)){
    		foreach ($banners as $key => $value) {

                $banner_title=$value->banner_main_title;
                $banner_sub_title=$value->banner_sub_title;
                $access_url=$value->banner_link ;

    			$_banners[]=array(
    				'banner_image'=>$value->media_disk_path_relative,
    				'banner_title'=>ucwords($banner_title),
                    'banner_sub_title'=>ucwords($banner_sub_title),
                    'access_url'=>$access_url
    			);
    		}
    	}else{
    		$_banners=array();
    	}


    	$this->data['banners']=$_banners;


        if ($visible) $this->render('front_meta_preload_section',$this->data);
    }
}