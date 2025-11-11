<?php defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * This class is here to demonstrate the use of 
 * Events library with Theme library.
 */
class Theme_class
{
    
    public function __construct()
    {
        /**
         * With this event registered, theme can independently enqueue
         * all needed StyleSheets without adding them in controllers.
         */
        Events::register('enqueue_styles', array($this, 'styles'));

        /**
         * With this event registered, theme can independently enqueue
         * all needed JS files without adding them in controllers.
         */
        Events::register('enqueue_scripts', array($this, 'scripts'));

        /**
         * With this event registered, theme can independently enqueue
         * all needed meta tags without adding them in controllers.
         */
        Events::register('enqueue_metadata', array($this, 'metadata'));

        // Manipulating <html> class.
        Events::register('html_class', array($this, 'html_class'));

        // Manipulating <body> class.
        Events::register('body_class', array($this, 'body_class'));

        Events::register('active_class', array($this, 'active_class'));
    }

    public function styles(){
        $style_arr=array();

        if(is_controller('Colleges') && is_method(array('index','indexPublicPages'))){
          array_push($style_arr,'assets/plagins/fancybox/jquery.fancybox.min');
        }

        if(is_controller('Blog') && (is_method('index') || is_method('indexBlogdetails'))){
            array_push($style_arr,'assets/plagins/magnific/magnific-popup','assets/wblog/style');
        }

        if(session_userdata('user_id')){
            if(is_controller('User')){
                array_push($style_arr,get_common_url('assets/plugins/datatables.net-bs4/sdataTables.bootstrap4'),get_common_url('assets/plugins/summernote/dist/summernote-bs4'));
            }

            if(is_controller('User') && (is_method('index') || is_method('indexEdit'))){
                array_push($style_arr,'assets/plagins/bootstrap-datepicker/bootstrap-datepicker.min');
            }
        }

        if(session_userdata('user_id')){
            if(is_controller('Universities')){
                array_push($style_arr,get_common_url('assets/plugins/summernote/dist/summernote-bs4.min'));
            }
        }


        add_style($style_arr);
    }

    public function scripts(){
        $script_arr=array(
            'assets/plagins/bootstrap/js/bootstrap.bundle.min',         
            'assets/plagins/mCustomScrollbar/jquery.mCustomScrollbar.min',
            'assets/js/jquery.readall.min',
            'assets/plagins/select2/js/select2.full.min',
            'assets/plagins/slick/slick.min', 
            'assets/js/jquery.nicescroll.min',
            'assets/plagins/jquery.fixie',
            'assets/js/menu',
            get_common_url('assets/js/jquery.validate.min'),
            get_common_url('assets/js/additional-methods.min'),
            'assets/js/script',         
            'assets/js/form-data-json.min',
            'assets/js/cryptojs-aes.min',
            'assets/js/cryptojs-aes-format',
            get_common_url('assets/plugins/sweetalert2/sweetalert2.all.min'),
            get_common_url('assets/plugins/chosen/chosen.jquery.min'),            
        );

        if (!is_controller(array('Colleges','Reviews'))){ 
            array_push($script_arr,'assets/plagins/swiper/swiper-bundle.min');
        }

        if(is_controller('Colleges') && is_method('indexPublicPages')){
            array_push($script_arr,'assets/plagins/fancybox/jquery.fancybox.min');
        }
        
        

        // if (is_controller('Universities')){
        //  array_push($script_arr,'assets/js/filters');
        // }


        if(!session_userdata('user_id')){
            array_push($script_arr,'assets/js/accounts');

            if(is_controller('User') && is_method('indexCollegeRegisterPage')){
                array_push($script_arr,'assets/js/account_college');
            }
        }
        
        //if(is_controller('OnlineAdmission') && is_method('index')){
        //  array_push($script_arr,'assets/js/accounts');
        //}
        
        

        if(session_userdata('user_id')){
            
            array_push($script_arr,'assets/js/common');
            if(is_controller('User') && (is_method('index') || is_method('indexEdit'))){
                array_push($script_arr,'assets/plagins/bootstrap-datepicker/bootstrap-datepicker.min');
            }
            if(is_controller('User')){
                array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),get_common_url('assets/plugins/summernote/dist/summernote-bs4.min'),'assets/js/account_edit');
            }
        }

        if(session_userdata('user_id')){
            if(is_controller('Universities')){

                // if(is_method('indexAccountScholarshipsSettings')){
                //  array_push($script_arr,get_common_url('assets/plugins/summernote/dist/summernote-bs4.min'));
                // }

                if(!is_method('indexAccountGallerySettingsAdd')){
                    array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),get_common_url('assets/plugins/summernote/dist/summernote-bs4.min'),'assets/js/account_university');
                }else if(is_method('indexAccountGallerySettingsAdd')){
                    array_push($script_arr,get_common_url('assets/plugins/datatables.net/jquery.dataTables'),get_common_url('assets/plugins/datatables.net-bs4/dataTables.bootstrap4'),'assets/js/account_gallery');
                }               
            }
        }

        //if(session_userdata('user_id')){
            if(is_controller('Reviews')){
                array_push($script_arr,'assets/js/review');
            }
        //}
        
        // if(is_controller('Blog')){
            
        //     array_push($script_arr,'assets/js/blogslick','assets/blog/js/slick.min','assets/blog/js/stellarnav.min','assets/js/blogmain','blogs');
        // }





        // if(is_controller('Blog')){
        //     array_push($script_arr,'https://www.jqueryscript.net/demo/jQuery-Plugin-For-Intelligent-Sticky-Sidebars/theia-sticky-sidebar.js','blogs');   
        // }

        

        if(is_controller('Universities') && is_method('index')){
            array_push($script_arr,'assets/js/search_data');
        }

        if(is_controller('Colleges') && is_method('index')){
            array_push($script_arr,'assets/js/search_data');
        }

        if(is_controller('Universities') && is_method('indexPublicPages')){
            array_push($script_arr,'assets/js/public_profile');
        }

        if(!is_controller('User') && !is_method('indexEdit')){
            array_push($script_arr, 'assets/js/search.min', 'assets/js/gsrch');
        }
        
        
        
        
        

        //print_obj($script_arr);die;

        //echo implode('\t', $script_arr);

        add_script($script_arr);
    }

    public function body_class($class)
    {
        if (is_controller('User') && is_method('index'))
        {

            return 'withBannerHeader';
        }
        else
        {
            return '';
        }
    }

    public function active_class($class)
    {
        if (is_controller('User'))
        {
            if(is_method('index') || is_method('indexAccountInfoSettings') || is_method('indexAccountCoursesFeesSettings')){

                return 'selected';
            }else{
                return '';
            }           
        }else{
            return '';
        }

        return $class;
    }
}

// Always instantiate the class so trigger get registered.
$theme_class = new Theme_class;