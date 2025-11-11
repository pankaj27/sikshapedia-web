<?php

class Widget extends CI_Controller
{
	/**
	 * Instance of CI object
	 * @var 	object
	 */
	protected $CI;
    public $admin_theme='';
    public $front_theme='';
    public $type='';
    protected $_table      = 'system_themes';
    protected $primary_key = 'theme_id';
    public $csrf='';
    



    function __construct() {
    	// Prepare instance of CI object
		$this->CI =& get_instance();
        $this->_assign_libraries($this->CI);
    }
    
    function run($name) {        
        $args = func_get_args();
        

        $widget_folder=($this->type==1)?APPPATH.'widgets/admin/'.$name:APPPATH.'widgets/front/'.$name;
        
        if(is_dir($widget_folder)){
            require_once $widget_folder.'/'.$name.EXT;
            //$name = ucfirst($name);
            //ob_start();
            $widget =new $name();
            return call_user_func_array(array(&$widget, 'run'), array_slice($args, 1));  
        }else{
            log_message('error','Widget folder '.$name .' not found');
        }           
    }
    
    function render($name, $data = array(),$cache_lifetime=0) {

        if(!empty($data) && is_array($data)){
            extract($data);
        }

        

        $cache_path=FCPATH.'public/data/cache/'.$name.EXT;
        
       // $widget_folder=($this->type==1)?APPPATH.'widgets/admin/'.$view.'/views':APPPATH.'widgets/front/'.$view.'/views';
        $widget_folder=($this->type==1)?FCPATH.'content/themes/admin/'.$this->admin_theme.'/views/_widgets/'.$name:FCPATH.'content/themes/front/'.$this->front_theme.'/views/_widgets/'.$name;
        if(is_dir($widget_folder)){
            //$widget_f=$this->CI->th->getWidget($name);
            //if($widget_f && $widget_f[0]->widgets_active==1){
                include $widget_folder.'/'.$name.EXT;
            //}


                // if($cache_lifetime>0){
                //     cached_results(file_get_contents($widget_folder.'/'.$name.EXT),$cache_path,$cache_lifetime);
                //     include $cache_path;
                // }else{
                //     include $widget_folder.'/'.$name.EXT;
                // }

                


            // Let CI do the caching instead of the browser
            //$this->CI->output->cache($cache_lifetime);                    
                
        }else{
            log_message('error','Widget view folder '.$name .' not found');
        }    
    }
    

    function load($object) {
        $this->$object =& load_class(ucfirst($object));
    }

    function register($widget_type,$name,$activated=0){
        $this->CI->db->insert('system_widgets',['widget_type'=>$widget_type,'widget_name'=>$name,'widget_activated'=>$activated]);
    }

    function include_csrf(){

        return '<input type="hidden" name="'.$this->CI->security->get_csrf_token_name().'" value="'.$this->CI->security->get_csrf_hash().'">';
    }

    function get_type($t){
        $this->type=$t;
    }

    public function getDefautltTheme($theme_type){
        return $this->CI->db->get_where($this->_table,['theme_type'=>$theme_type,'theme_status'=>1])->first_row();
    }

    public function getWidget($name){
        return $this->CI->db->get_where('system_widgets',['widget_name'=>$name])->first_row();
    }

    function _assign_libraries($ci) {
        foreach (get_object_vars($ci) as $key => $object) {
            $this->$key =& $ci->$key;  
        }
    }
}
