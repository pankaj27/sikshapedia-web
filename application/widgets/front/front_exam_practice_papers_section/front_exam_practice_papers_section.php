<?php


/**
 * 
 */
class Front_exam_practice_papers_section extends Widget
{
    function run($visible = FALSE,$exam_id=0) {
        $this->front_theme='default';
        $this->get_type(2);

        //echo $exam_id;die;

        $data=array();

        $_practice_papers=array();

        $exam_data=$this->strm->get_exam(array('exam_id'=>$exam_id));

        $pparam['column_search'] = array('user_storage_type_2');
        $pparam['order'] = array('user_storage_id' => 'ASC');
        $pparam['user_file_type_id']=$exam_id;

        $pparam['_user_storage_type']='practice_paper';

        $practice_papers = $this->sm->_get_guser_files(null,$pparam,FALSE,FALSE);

        if(!empty($practice_papers)){
            foreach ($practice_papers as $key => $value) {
                $answer_papers=$this->sm->___get_user_file('system_storage.media_disk_path_relative,system_users_storage.user_storage_type_2,system_users_storage.user_storage_type_3',array('system_users_storage.user_storage_type'=>'answer_paper','system_users_storage.user_file_type_linked'=>$value->storage_id));

                $_practice_papers[]=array(
                    'practice_paper_exam'=>$exam_data->exam_short_name,
                    'practice_paper'=>$value->media_disk_path_relative,
                    'practice_paper_year'=>$value->user_storage_type_3,
                    'practice_paper_name'=>$value->user_storage_type_2,
                    'paper_answer_paper'=>array(
                        'answer_paper'=>$answer_papers->media_disk_path_relative,
                        'answer_paper_year'=>$answer_papers->user_storage_type_3,
                        'answer_paper_name'=>$answer_papers->user_storage_type_2
                    )
                );
            }
        }

        //print_obj($_practice_papers);die;

        $data['practice_papers']=$_practice_papers;

        if ($visible) $this->render('front_exam_practice_papers_section',$data);
    }
}