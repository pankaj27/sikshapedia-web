<?php defined('BASEPATH') OR exit('No direct script access allowed');


class Filter extends CI_Controller{


    public function onGetSearchedData()
	{
        $json_data=$this->input->post('data_json');

        if(!empty($json_data)){
        	$decoded=json_decode($json_data);

        	
        	if($decoded!='' || $decoded!=NULL){
        		$searched_data='';
        		$data_str 	= 	clean_json_data($decoded->searched_param);
        		$limit 		= 	'20';
        		$offset 	= 	clean_json_data($decoded->offset);


        		if(strlen($data_str)>=3){
        			$data_searched=$this->sm->_get_system_search_data($data_str,'NATURAL LANGUAGE',$limit,$offset,'search_data_id','ASC',FALSE);



        			$searched_data='';

        			if(!empty($data_searched)){
        				foreach ($data_searched as $key => $value) {
							if($value->search_data_type=='COLLEGE_NAME'){
								$search_data_type='College';
								$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$value->search_data_type_id));
								$searched_access_url=$college_data->access_url;
							}else if($value->search_data_type=='UNIVERSITY_NAME'){
								$search_data_type='University';
								$searched_access_url='';
							}else if($value->search_data_type=='EXAM_NAME'){
								$search_data_type='Exam';
								$searched_access_url='';
							}

							$_searched_data_logo=$this->sm->get_user_file(array('user_file_type_id'=>$value->search_data_type_id,'user_storage_type'=>'user_logo'));

							if(!empty($_searched_data_logo) && !empty($_searched_data_logo->media_disk_path_relative)){
			                    $searched_data_logo=$_searched_data_logo->media_disk_path_relative.'?tr=h-50,w-50,c-force';
			                }else{
			                    $searched_data_logo=base_url().'uploads/app/default/w2a.png?tr=h-50,w-50,c-force';
			                }


			                $slug='';

							$_searched_data[]=array(
								'searched_data_id'=>$value->search_data_id,
								'serach_data_name'=>strtoupper($value->search_data_name),
								'search_data_type'=>$search_data_type,
								'searched_data_logo'=>$searched_data_logo,
								'searched_access_url'=>$searched_access_url
							);
						}

						//print_obj($_searched_data);die;

						$searched_data=$_searched_data;
        			}
        		}

        		$return['success']='1';
        		$return['searched_data']=$searched_data;
        	}else{
				$return['success']='0';
				$return['error']='JSON data error';
			}
        }else{
			$return['success']='0';
			$return['error']='JSON data is empty';
		}


		header('Content-Type: application/json');
	    echo json_encode($return);
	} 


}