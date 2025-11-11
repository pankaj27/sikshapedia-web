<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class Notfound  extends BaseAdminController
{
	public function __construct() {
        parent::__construct();
    }

    public function index(){
		$this->data['page_heading']='404';
		$this->data['page_heading_title']='Page not found';
		$this->data['page_title']='Page not found';	
		$this->theme->title($this->data['page_title'])->load('notfound/vw_notfound', $this->data);		
	}
}