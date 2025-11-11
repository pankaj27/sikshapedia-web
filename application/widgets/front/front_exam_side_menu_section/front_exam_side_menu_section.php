<?php


/**
 * 
 */
class Front_exam_side_menu_section extends Widget
{

    function run($visible = FALSE,$exam_id=0) {
        $this->front_theme='default';
        $this->get_type(2);


        $segment_1=$this->uri->segment(1,0);    //Static Exam url
        $segment_2=$this->uri->segment(2,0);   //exam name
        $segment_3=$this->uri->segment(3,0);  //Exam inner menue Name

        $menu_data=array();

        $exam_data=array();

        $exams_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

        //print_obj($exams_data);die;

        if(!empty($exams_data)){
            $menu_data=$this->sm->get_menues(array('menu_link_type'=>'12','menu_is_inner'=>'1','menu_parent_id'=>'0','menu_link_id'=>$exam_id),FALSE);

            if(!empty($menu_data)){
                foreach ($menu_data as $key => $value) {

                    if(strpos(trim($value->menu_name), trim($exams_data->exam_short_name)) !== false){
                        $menu_name=$value->menu_name;
                    } else{
                        $menu_name=$exams_data->exam_short_name.' '.$value->menu_name;
                    }

                    //$menu_name=$exams_data->exam_short_name.' '.$value->menu_name;

                    $_menu_data[]=array(
                        'menu_name'=>$menu_name,
                        'menu_link'=>$value->menu_link
                    );
                }                
            }
        }


        $data['menu_data']=$_menu_data;
        if ($visible) $this->render('front_exam_side_menu_section',$data);
    }
}