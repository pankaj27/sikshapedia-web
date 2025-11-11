<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Menues  extends BaseAdminController
{
	function __construct()
	{
		parent::__construct();
	}

	function index(){
		if(session_userdata('isAdminLoggedin')){

			$this->data['page_title']='Menues';


			$this->data=array(
				'menu_types'=>array(
					''=>'Top header Menu',	
				)
			);


			$top_menues=$this->sm->get_menues(array('menu_is_upper_top'=>'1'),FALSE,'menu_serial','ASC');

			if(!empty($top_menues)){
				foreach ($top_menues as $key => $value) {
					$slug_data=$this->sm->get_slug_urls(array('url_type'=>'static_url','url_type_id'=>$value->menu_id));
					$_top_menues[]=array(
						'menu_id'=>$value->menu_id,
						'menu_name'=>$value->menu_name,
						'menu_link'=>$value->menu_link,
						'menu_status'=>$value->menu_is_active,
						'menu_meta_heading'=>$slug_data->url->url_meta_heading,
						'menu_meta_title'=>$slug_data->url->meta_title,
						'menu_mete_desc'=>$slug_data->url->url_meta_desc,
						'menu_meta_keywords'=>$slug_data->url->url_meta_key_words,
						'menu_meta_og_title'=>$slug_data->url->url_og_title,
						'menu_meta_og_desc'=>$slug_data->url->url_og_desc
					);
				}
			}else{
				$_top_menues=array();
			}

			print_obj($_top_menues);die;


			$this->data['top_menues']=$_top_menues;
			
			$this->theme->title($this->data['page_title'])->load('settings/vw_menues', $this->data);
		}else{
			redirect($this->data['admin_base_url']);
		}
	}

	public function onLoadMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

				$menu_type=post_data('menu_type');

				$menues=$this->sm->get_menues(array(''));

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}


	public function onSearchMenues(){
		if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
			if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
				$param['column_order'] = array(
					null,
					'menu_country',
					'menu_country_code',
					'menu_name'
				);

				$param['column_search'] = array('menu_country','menu_country_code','menu_name');
				$param['order'] = array('menu_link_type' => 'ASC');
				$posts=$this->input->post();

				if(isset($posts['menu_category_id'])){
					$param['menu_category_id']=$posts['menu_category_id'];
				}

				if(isset($posts['menu_link_id'])){
					$param['menu_link_id']=$posts['menu_link_id'];
				}

				$list = $this->sm->_get_menues($posts,$param,FALSE,FALSE);

				//print_obj($list);die;				
				
				$data = array();
				$no = isset($posts['start'])?$posts['start']:0;

				$action='';

				foreach ($list as $menu){
					$no++;

					$row = array();

					$parent_menu=$this->sm->get_menues(array('menu_id'=>$menu->menu_parent_id));
					
					$row[]	=	$no;

					$row[]	=	$menu->menu_name;
					$row[]	=	$parent_menu->menu_name;
					$row[]	=	$menu->menu_link;

					$data[] = $row;	
				}

				$output = array(
					"draw" => isset($posts['draw'])?$posts['draw']:'',
					"recordsTotal" => $this->sm->_get_menues($posts,$param,TRUE),
					"recordsFiltered" => $this->sm->_get_menues($posts,$param,TRUE),
					"data" => $data,
				);
				
				echo json_encode($output);

			}else{
				redirect($this->data['admin_base_url']);
			}
		}else{
			redirect($this->data['admin_base_url']);
		}
	}
}