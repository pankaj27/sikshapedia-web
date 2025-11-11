<?php


/**
 * 
 */
class Front_college_comment_section extends Widget
{
	
	function run($visible = FALSE,$ids=null) {
		$this->front_theme='default';
    	$this->get_type(2);

    	$college_id=$ids['college_id'];

    	$data=array();

		$data['college_id']=encode_data($college_id);

		if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
    		$account_verification_popup='no';
    	}else{
    		$account_verification_popup='yes';
    		$session_data=array(
				'custom_redirect'=>$this->current_url
			);

			session_set_userdata($session_data);
    	}

    	$data['account_verification_popup']=$account_verification_popup;


    	$comments=$this->sm->_get_comments(array('comment_status'=>'approved','comment_data_status'=>'active'),'comment_id');

    	$data['total_comments']=count($comments);

    	$_reply_comments=array();

    	if(!empty($comments)){
    		foreach ($comments as $key => $value) {
    			$reply_comments=$this->sm->_get_comments(array('comment_status'=>'approved','comment_data_status'=>'active','comment_p_id'=>$value->comment_id),'comment_id');

    			if(!empty($reply_comments)){

    				foreach ($reply_comments as $k => $v) {
    					$user_image=$this->sm->get_user_file(array('user_file_type_id'=>$v->comment_user_id,'user_storage_type'=>'user_image'));

		    			if(!empty($user_image) && !empty($user_image->media_disk_path_relative)){
		                    $_user_image=$user_image->media_disk_path_relative;
		                }else{
		                    $_user_image=base_url().'uploads/app/default/no.jpg';
		                }

	    				$_reply_comments[]=array(
		    				'comment_id'=>encode_data($value->comment_id),
		    				'comment_user'=>$value->user_fullname,
		    				'comment_user_image'=>$_user_image,
		    				'comment_date'=>date('M d,Y',strtotime($value->created_at)),
		    				'comment_value'=>$value->comment_value
		    			);
    				}			    				
    			}

    			$userimage=$this->sm->get_user_file(array('user_file_type_id'=>$value->comment_user_id,'user_storage_type'=>'user_image'));

    			if(!empty($userimage) && !empty($userimage->media_disk_path_relative)){
                    $__user_image=$userimage->media_disk_path_relative;
                }else{
                    $__user_image=base_url().'uploads/app/default/no.jpg';
                }

    			$_comments[]=array(
    				'comment_id'=>encode_data($value->comment_id),
    				'comment_user'=>$value->user_fullname,
    				'comment_user_image'=>$__user_image,
    				'comment_date'=>date('M d,Y',strtotime($value->created_at)),
    				'comment_value'=>$value->comment_value,
    				'reply_comments'=>$_reply_comments
    			);
    		}

    		$data['comments']=$_comments;
    	}
    		
    	

    	

    	if ($visible) $this->render('front_college_comment_section',$data);
    }
}