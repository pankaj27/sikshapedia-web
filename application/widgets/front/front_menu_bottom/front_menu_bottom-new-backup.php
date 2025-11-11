<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_menu_bottom extends Widget
{
	function run($visible = FALSE){
		$this->front_theme='default';
    	$this->get_type(2);


    	$menues_fields='menu_id,menu_name,menu_link,menu_is_top,menu_is_footer,menu_is_active,menu_parent_id,menu_serial';

    	$menues=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'2','menu_is_footer'=>'1','menu_is_active'=>'1','menu_parent_id'=>'0'),FALSE,'menu_serial','ASC',FALSE);

    	$main_menues=array();

    	if(!empty($menues)){
    		foreach ($menues as $key => $value){

    			$sub_menues=$this->sm->get_menues_specific($menues_fields,array('menu_is_top'=>'2','menu_is_active'=>'1','menu_is_footer'=>'1','menu_parent_id'=>$value->menu_id),FALSE,'menu_serial','ASC',FALSE);

    			$sub_menues_data=array();

    			if(!empty($sub_menues)){
    				foreach ($sub_menues as $k => $v){
    					$sub_menues_data[]=array(
    						'menu_name'=>strtoupper($v->menu_name),
                            'menu_link'=>$v->menu_link 
    					);
    				}
    			}

    			$main_menues[]=array(
    				'menu_name'=>strtoupper($value->menu_name),
    				'sub_menues'=>$sub_menues_data
    			);
    		}
    	}

    	//print_obj($main_menues);die;

    	$data['menues']=$main_menues;

    	if ($visible) $this->render('front_menu_bottom',$data);
	}
}