<?php


/**
 * 
 */
class Front_student_fvourite_collehges_section extends Widget
{
	
	function run($visible = FALSE,$user_id=0,$chunk=FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $_fav_colleges=array();

        $fav_colleges=$this->im->get_favourite_institutions(array('favi_user_id'=>$user_id),FALSE);

        

        if(!empty($fav_colleges)){
            foreach ($fav_colleges as $key => $value) {
                if($value->favi_inst_type=='college'){
                    $college_data=$this->im->___get_college_profile_data('college_user_id,college_name,college_short_name,access_url,city_name,state_name',array('college_user_id'=>$value->favi_inst_id));                    

                    $_college_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->favi_inst_id,'user_storage_type'=>'user_logo','user_file_type'=>'4'));
                    if(!empty($_college_logo) && !empty($_college_logo->media_disk_path_relative)){
                        $college_logo=$_college_logo->media_disk_path_relative;
                        $college_logo_name=$_college_logo->media_org_name;
                    }else{
                        $college_logo=base_url().'uploads/app/default/no.jpg';
                        $college_logo_name='';
                    } 

                    $_fav_colleges[]=array(
                        'college_name'=>$college_data->college_name,
                        'college_short_name'=>$college_data->college_short_name,
                        'college_name_formatted'=>($college_data->college_short_name!=null)?$college_data->college_name.' - ['.$college_data->college_short_name.']':$college_data->college_name,
                        'college_image'=>$college_logo,
                        'college_city'=>$college_data->city_name.','.$college_data->state_name,
                        'college_url'=>$college_data->access_url,
                        'fav_date'=>date('j M, Y',strtotime($value->created_at))
                    );

                    if($chunk==TRUE){
                        $_fav_colleges=array_chunk($_fav_colleges,2);
                    }
                }                
            }
        }

        

        $data['chunk']=$chunk;

        //echo $chunk;die;

        $data['userdata']=$this->data['userdata'];

        $data['fav_colleges']=$_fav_colleges;

        if ($visible) $this->render('front_student_fvourite_collehges_section',$data);

    }

}