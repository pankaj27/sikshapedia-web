<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Comments extends BaseAdminController
{

   function __construct()
    {
        parent::__construct();
    }

    function index(){
        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Comments';

            $this->theme->title($this->data['page_title'])->load('others/vw_comments', $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }

    public function onSearchComments(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){
                $param['column_order'] = array(
                    null,
                    'comment_value',
                    'college_name',
                    'user_fullname'
                );

                $param['comment_type']='college';

                $param['column_search'] = array('user_fullname','comment_value','college_name');
                $param['order'] = array('comment_id' => 'DESC');
                $posts=$this->input->post();

                $list = $this->sm->__get_comments($posts,$param,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $comment){
                    $no++;

                    $row = array();

                    $row[]  =   $no;
                    $row[]  =   $comment->comment_value;
                    $row[]  =   $comment->college_name;
                    $row[]  =   $comment->user_fullname;
                    $row[]  =   date('d-m-Y',strtotime($comment->created_at));

                    if($comment->comment_status=='pending'){
                        $approval_status='<span class="badge badge-sm badge-warning">Pending</span>';
                    }else if($comment->comment_status=='approved'){
                        $approval_status='<span class="badge badge-sm badge-success">Approved</span>';
                    }else if($comment->comment_status=='rejected'){
                        $approval_status='<span class="badge badge-sm badge-danger">Rejected</span>';
                    }

                    $row[]  =   $approval_status;

                    $row[]  =   '<button type="button" class="btn btn-xs btn-secondary">Update</button>';


                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->__get_comments($posts,$param,TRUE),
                    "recordsFiltered" => $this->sm->__get_comments($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }






}