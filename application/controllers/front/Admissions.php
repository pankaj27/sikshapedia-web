<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class Admissions extends BaseFrontController
{
    public function index(){

      $segment_1=$this->uri->segment(1,0);


      if($segment_1=='admission'){


        $this->theme->title($this->data['page_title'])->load('webpage/others/vw_admissions', $this->data);

      }else{
        redirect(base_url());
      }        
    }
}