<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Front_news_details_section extends Widget
{
	function run($visible = FALSE,$ids=null){
        $this->front_theme='default';
        $this->get_type(2);

        $url_id=$ids['url_id'];

        $news_details_data=array();
        $news_details=array();

        //'news_data'=>$_news_data,

        $news=$this->nm->get_news(array('news_id'=>$url_id));

        $news_details=$this->nm->get_news_data(array('news_id'=>$url_id),FALSE);

        if(!empty($news_details)){
            $uploaded_by=$this->um->_get_internal_user(array('user_id'=>$news->created_by));

            $user_image=$this->sm->get_user_file(array('user_storage_type'=>'user_image','user_file_type_id'=>$news->created_by),NULL,FALSE);

            if(!empty($user_image) && $user_image->media_disk_path_relative!=''){
              $curator_image=$user_image->media_disk_path_relative;
            }else{
              $curator_image=base_url('public/data/app/app_data/waytoadmissions_logo.png');         
            }

            $info_curator=(!empty($uploaded_by) && $uploaded_by->user_role!='1')?$uploaded_by->user_fullname:$system_name.' Team';

            $news_details_data=array(                    
                'news_details'=>$news_details,
                'news_curator_image'=>$curator_image,
                'news_curator'=>$info_curator,
                'news_updated_at'=>(!empty($news->updated_at))?date('M d,Y',strtotime($news->created_at)):date('M d,Y',strtotime($news->updated_at))
            );
        }

                        

        $data['news_details_data']=$news_details_data;

        if ($visible) $this->render('front_news_details_section',$data);
    }
}