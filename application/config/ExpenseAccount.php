<?php
defined('BASEPATH') OR exit('No direct script access allowed');


/**
 * 
 */
class ExpenseAccount extends BaseAdminController
{
    protected $inst_id='';
    protected $inst_parent_id='';
    protected $inst_code='';
    protected $inst_type='';
    protected $user_role='';
    protected $ctm_access='';
    protected $ams_access='';

    function __construct()
    {
        parent::__construct();

        $institute_data=check_institute($this->data['userdata']);

        $this->inst_id=$institute_data['institute_id'];
        $this->inst_parent_id=$institute_data['inst_parent_id'];
        $this->inst_code=$institute_data['inst_code'];
        $this->inst_type=$institute_data['inst_type'];
        $this->user_type=$institute_data['user_type'];
        $this->user_role=$institute_data['user_role'];

        $this->ams_access=$institute_data['ams_access'];

        $this->data['module_name']='Accounts Management';

        $this->load->model('vendor_model','vm');

        $this->load->model(array('ctm/vendor_model'=>'ctvm','ctm/payment_model'=>'ctpm','vendor_model'=>'vm'));
    }


    public function index(){

        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Accounts';

            if($this->ams_access=='yes'){
                $view='exm/vw_exms_accounts';
            }else{
                $view='exm/vw_exms_permission_denied';
            }

            $this->theme->title($this->data['page_title'])->load($view, $this->data);

        }else{

            redirect($this->data['base_url']);
        }
    }


    public function indexCategory(){

        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Accounts Category';
            if($this->ams_access=='yes'){
                $ams_chart_of_accounts_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','view');
                $this->data['ams_chart_of_accounts_add_access']= check_access_control($this->data['userdata'],'ams_chart_of_accounts','add');
                $this->data['ams_chart_of_accounts_edit_access']= check_access_control($this->data['userdata'],'ams_chart_of_accounts','edit');

                if($this->ams_access=='yes' && $ams_chart_of_accounts_access=='yes'){

                    $account_types=$this->vm->get_accounts_category_types(null,FALSE);
                    $this->data['account_types']=$account_types;
                    $view='exm/vw_exms_accounts_category';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }
            }else{
                $view='exm/vw_exms_permission_denied';
            }            

            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function indexBankBalance(){

        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Bank Balance';
            $ams_bank_accounts_access= check_access_control($this->data['userdata'],'ams_bank_accounts','view');
            $ams_bank_accounts_add_access= check_access_control($this->data['userdata'],'ams_bank_accounts','add');
            $ams_bank_accounts_edit_access= check_access_control($this->data['userdata'],'ams_bank_accounts','edit');

            if($this->ams_access=='yes'){
                if($ams_bank_accounts_access=='yes'){
                    $this->data['fiscal_year']=fiscalyear(2000);

                    $this->data['banks']=$this->sm->get_banks(array('bank_inst_id'=>$this->inst_id,'bank_inst_type'=>$this->inst_type),FALSE);
                    $view='exm/vw_exms_bank_balance';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }
            }else{
                $view='exm/vw_exms_permission_denied';
            }

            $this->theme->title($this->data['page_title'])->load($view, $this->data);


        }else{

            redirect($this->data['base_url']);
        }
    }


    public function indexCashBalance(){

        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Cash Balance';
            $ams_cash_accounts_add_access= check_access_control($this->data['userdata'],'ams_cash_accounts','view');
            $this->data['ams_cash_accounts_add_balance_access']= check_access_control($this->data['userdata'],'ams_cash_accounts','add_balance');

            if($this->ams_access=='yes'){

                if($ams_cash_accounts_add_access=='yes'){

                    $view='exm/vw_exms_cash_balance';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }

                $this->data['fiscal_year']=fiscalyear(2000);
            }else{
                $view='exm/vw_exms_permission_denied';
            }

            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    } 


    public function onLoadAccountsCategoryForm(){

        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

                /*$category_id = post_data('category_id');
                $category_data = $this->ctvm->get_accounts_category_data(array('category_id' => $category_id));

                if (!empty($category_data)) {
                    $this->data['category_data'] = $category_data;
                }

                $this->data['category_id'] = $category_id;*/

                $account_types=$this->vm->get_accounts_category_types(null,FALSE);
                $this->data['account_types']=$account_types;

                $return['html'] = $this->theme->view('_pages/exm/vw_exms_accounts_category_data_dyna', $this->data, true);

                json_headers($return);
            } else {
                redirect($this->data['base_url']);
            }
        } else {
            redirect($this->data['base_url']);
        }
    }


    public function onAddEditAccountsCategory()
    {
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {
                try {
                    if ($this->ams_access == 'yes') {
                        // Load form validation library
                        $this->load->library('form_validation');

                        // Set validation rules
                        $this->form_validation->set_rules('category_name', 'Category Name', 'required|trim|max_length[255]');
                        $this->form_validation->set_rules('category_description', 'Category Description', 'trim|max_length[500]');
                        $this->form_validation->set_rules('category_status', 'Category Status', 'required|in_list[active,inactive]');
                        $this->form_validation->set_rules('category_type', 'Category Type', 'required'); // Replace `type1` and `type2` with actual types
                        $this->form_validation->set_rules('_category_id', 'Category ID', 'trim');

                        if ($this->form_validation->run() == FALSE) {
                            // Validation failed
                            $return['error'] = validation_errors();
                        }else{
                            
                            // Retrieve POST data
                            $_category_id = post_data('_category_id');
                            $category_name = post_data('category_name');
                            $category_description = post_data('category_description');
                            $category_status = post_data('category_status');
                            $category_type = post_data('category_type');
                            $category_code=post_data('category_code');
                            $category_description=post_data('category_description');
                            $user_id = $this->data['userdata']->user_id;

                            $category_type_data=$this->vm->get_accounts_category_types(array('type_id'=>$category_type));

                            // Prepare category data
                            $_category_data = [
                                'category_inst_id' => $this->inst_id,
                                'category_inst_type' => $this->inst_type,
                                'category_name' => $category_name,
                                'category_code' => $category_code,
                                'category_description' => $category_description,
                                'category_type' => $category_type_data->type_group,
                                'category_type_id'=>$category_type,
                                'is_editable'=>'yes',
                                'category_status'=> $category_status,
                            ];

                            if (!empty($_category_id)) {
                                $ams_chart_of_accounts_edit_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','edit');
                                
                                if($ams_chart_of_accounts_edit_access=='yes'){
                                    // Update existing category
                                    $category_id = decode_data($_category_id);
                                    $get_vendor_category_data = $this->ctvm->get_accounts_category_data(['category_id' => $category_id]);

                                    if (!empty($get_vendor_category_data)) {
                                        $_category_data['category_updated_by'] = $user_id;
                                        $_category_data['category_updated_at'] = date('Y-m-d');

                                        $updated = $this->ctvm->update_accounts_category_data($_category_data, ['category_id' => $category_id]);

                                        if ($updated) {
                                            $return['success'] = 'Category has been updated.';
                                        } else {
                                            $return['error'] = 'Category not updated.';
                                        }
                                    } else {
                                        $return['error'] = 'Category not found to update.';
                                    }
                                }else{                                    
                                    $return['error'] = 'You do not have permission to edit this category.';
                                }                                
                            } else {
                                $ams_chart_of_accounts_add_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','add');
                                if($ams_chart_of_accounts_add_access=='yes'){
                                    // Add new category
                                    $get_vendor_category_data = $this->ctvm->get_accounts_category_data([
                                        'category_inst_id' => $this->inst_id,
                                        'category_inst_type' => $this->inst_type,
                                        'category_name' => $category_name
                                    ]);

                                    if (empty($get_vendor_category_data)) {
                                        $_category_data['category_created_by'] = $user_id;

                                        $added = $this->ctvm->store_accounts_category_data($_category_data);

                                        if ($added) {
                                            $return['success'] = 'Category added successfully.';
                                        } else {
                                            $return['error'] = 'Category not added.';
                                        }
                                    } else {
                                        $return['error'] = 'Category already exists in the system.';
                                    }
                                }else{                                    
                                    $return['error'] = 'You do not have the required permission to add new category.';
                                }
                                
                            }
                        }                        
                    } else {
                        $return['error'] = 'You do not have the required permission.';
                    }
                } catch (Exception $e) {
                    // Handle exception
                    $return['error'] = 'An unexpected error occurred: ' . $e->getMessage();
                }

                // Send JSON response
                json_headers($return);
            } else {
                redirect($this->data['base_url']);
            }
        } else {
            redirect($this->data['base_url']);
        }
    }


    public function onDeleteAccountsCategory(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $category_id=post_data('category_id');

                if(!empty($category_id)){
                    if($this->ams_access=='yes'){

                        $ams_chart_of_accounts_delete_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','delete');

                        if($ams_chart_of_accounts_delete_access=='yes'){
                            $category_id=decode_data($category_id);

                            $category_data=$this->ctvm->get_accounts_category_data(array('category_id'=>$category_id));
        
                            if(!empty($category_data)){

                                $get_category_payment_data=$this->fm->get_payment_details(array('details_accounting_type_id'=>$category_id,'details_inst_id'=>$this->inst_id));

                                if(empty($get_category_payment_data)){
                                    $deleted=$this->ctvm->delete_accounts_category_data(array('category_id'=>$category_id));

                                    if($deleted){
                                        $return['success']='Category deleted successfully';
                                    }else{
                                        $return['error']='Category not deleted';
                                    }
                                }else{
                                    $return['error']='You don\'t have the persmission to delete this category.';
                                }
                                
                            }else{
                                $return['error']='No data found to remove.';
                            }
                        }else{
                            $return['error']='You don\'t have the persmission to delete this category.';
                        }

                        
                    }else{
                        $return['error']='You don\'t have the persmission';
                    }
                }else{
                    $return['error']='Data manipulation not permitted';
                }

                json_headers($return);
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchAccountsCategory(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $ams_chart_of_accounts_edit_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','edit');
                $ams_chart_of_accounts_delete_access= check_access_control($this->data['userdata'],'ams_chart_of_accounts','delete');

                $param['column_order'] = array(
                    null,
                    'category_name'
                );

                $param['category_inst_id']=$this->inst_id;
                $param['category_inst_type']=$this->inst_type;

                $param['column_search'] = array('category_name');
                $param['order'] = array('category_id' => 'ASC');
                $posts=$this->input->post();

                $list = $this->ctvm->_get_accounts_category_data($posts,$param,FALSE,FALSE);

                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $cat){
                    $no++;

                    $row = array();
                    
                    $category_type_data=$this->vm->get_accounts_category_types(array('type_id'=>$cat->category_type_id));

                    $row[]  =   $no;
                    $row[]  =   $cat->category_code;
                    $row[]  =   $cat->category_name;
                    $row[]  =   strtoupper($category_type_data->type_name);
                    $row[]  =   strtoupper($cat->category_type);

                    if($cat->category_status=='active'){
                        $status='<span class="badge badge-success">Active</span>';
                    }else if($cat->category_status=='inactive'){
                        $status='<span class="badge badge-danger">Inactive</span>';
                    }

                    $row[]  =   $status;

                    $action='<div class="btn-group" role="group" aria-label="Basic example">';
                    if($cat->is_editable=='yes'){
                        
                        if($ams_chart_of_accounts_edit_access=='yes'){
                            $action.='<button type="button" class="btn btn-xs btn-dark btn_edit_account_category" data-category_id="'.encode_data($cat->category_id).'" data-category_name="'.$cat->category_name.'" data-category_description="'.$cat->category_description.'" data-category_status="'.$cat->category_status.'"><i class="fa fa-edit"></i></button>';
                        }

                        if($ams_chart_of_accounts_delete_access=='yes'){
                            $action.='<button class="btn btn-xs btn-danger btn_delete_account_category" data-category_id="'.encode_data($cat->category_id).'"><i class="fa fa-trash"></i></button>';
                        }

                        if($ams_chart_of_accounts_edit_access=='no' && $ams_chart_of_accounts_delete_access=='no'){
                            $action.='<span class="badge badge-dark">Not permitted</span>';
                        }  
                    }

                    $action.='</div>';

                    $row[]  =  $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->ctvm->_get_accounts_category_data($posts,$param,TRUE),
                    "recordsFiltered" => $this->ctvm->_get_accounts_category_data($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    //Cash Balance
    public function onAddEditCashBalance(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $cash_id=decode_data(post_data('_bank'));

                $balance_amount=post_data('cash_opening_balance');

                $creator_id=$this->data['userdata']->user_id;

                $get_balance_data=$this->sm->get_cash_balance(array('balance_inst_id'=>$this->inst_id,'balance_status'=>'active'));

                if(!empty($get_balance_data)){
                    if($get_balance_data->balance_adjusted_amount>0){
                        $new_balance=$get_balance_data->balance_opening_amount+$balance_amount;
                    }else{
                        $new_balance=$balance_amount;
                    }
                    
                    $balance_adjusted_amount=$balance_amount;
                }else{
                    $new_balance=$balance_amount;
                    $balance_adjusted_amount=0;
                }

                $data_to_insert=array(
                    'balance_inst_id'=>$this->inst_id,
                    'balance_inst_type'=>$this->inst_type,
                    'balance_opening_amount'=>$new_balance,
                    'balance_adjusted_amount'=>$balance_adjusted_amount,
                    'balance_status'=>'active',
                    'balance_is_credit_debit'=>'credit',
                    'balance_created_at'=>date('Y-m-d H:i:s'),
                    'balance_created_by'=>$creator_id
                );

                if(!empty($get_balance_data)){
                    if($get_balance_data->balance_adjusted_amount>0){
                        $balance_id=$this->sm->store_cash_balance_data($data_to_insert);
                    }else{
                        $balance_id=$get_balance_data->balance_id;
                        if($get_balance_data->balance_adjusted_amount>0){
                            $this->sm->update_cash_balance_data(array('balance_status'=>'inactive','balance_updated_at'=>date('Y-m-d H:i:s'),'balance_updated_by'=>$creator_id),array('balance_id'=>$balance_id));
                        }else{
                            $this->sm->update_cash_balance_data(array('balance_opening_amount'=>$new_balance,'balance_updated_at'=>date('Y-m-d H:i:s'),'balance_updated_by'=>$creator_id),array('balance_id'=>$balance_id));
                        }                            
                    }                        
                }else if(empty($get_balance_data)){
                    $balance_id=$this->sm->store_cash_balance_data($data_to_insert);
                }

                if($balance_id){
                    $return['success']='Balance added successfully';
                }else{
                    $return['error']='Balance not added.';
                }

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onDeleteBalance(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                if($this->ctms_access=='yes'){

                    $balance_id=post_data('balance_id');
                    $user_id=$this->data['userdata']->user_id;

                    if(!empty($balance_id)){

                        $balance_id=decode_data($balance_id);

                        $deleted=$this->ctpm->delete_cash_balance_data(array('balance_id'=>$balance_id));

                        if($deleted){
                            $return['success']='Data deleted successfully.';
                        }else{
                            $return['error']='Data not deleted.';
                        }

                    }else{
                        $return['error']='Data not found in the system.';
                    }

                }else{
                    $return['error']='You don\'t have the permission';
                }

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchCashBalanceList(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $institute_data=check_institute($this->data['userdata']);
                $inst_id=$institute_data['institute_id'];

                $param['inst_id']=$inst_id;
                $param['column_order'] = array(
                    null,
                    'balance_financial_year'
                );

                $param['column_search'] = array('balance_financial_year');
                $param['order'] = array('balance_id' => 'DESC');
                $posts=$this->input->post();

                $list = $this->sm->_get_cash_balance($posts,$param,FALSE,FALSE);                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $bank){
                    $no++;

                    $row = array();

                    $row[]  =   $no;
                    // $row[]  =   $bank->balance_financial_year;
                    $row[]  =   number_format($bank->balance_opening_amount,2);
                    $row[]  =   number_format($bank->balance_adjusted_amount,2);                    
                    $row[]  =   date('d-m-Y',strtotime($bank->balance_created_at));

                    if(in_array($bank->balance_is_credit_debit, array('credit','transfer_credit'))){
                        $row[]  =   '<span class="badge badge-success">Credit</span>';
                    }else if(in_array($bank->balance_is_credit_debit, array('debit','transfer_debit'))){
                        $row[]  =   '<span class="badge badge-danger">Debit</span>';
                    }

                    if($bank->balance_status=='active'){
                        $row[]  =   '<span class="badge badge-success">Active</span>';
                    }else{
                        $row[]  =   '<span class="badge badge-dark">inactive</span>';
                    }

                    // if($bank->balance_status=='active'){
                    //     $action='<button class="btn btn-xs btn-dark btn_edit_cash_balance"  data-balance_id="'.encode_data($bank->balance_id).'" data-balance_value="'.$bank->balance_opening_amount.'" data-fiscal_year="'.$bank->balance_financial_year.'"><i class="fa fa-edit"></i></button>
                    // <button class="btn btn-xs btn-danger btn_delete_cash_balance" data-balance_id="'.encode_data($bank->balance_id).'"><i class="fa fa-trash"></i></button>';
                    // }else{
                    //     $action='';
                    // }

                    //$action='';

                    //$row[]  =   $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->sm->_get_cash_balance($posts,$param,TRUE),
                    "recordsFiltered" => $this->sm->_get_cash_balance($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    //Bank Balance
    public function onAddEditBankBalance(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $bank_id=post_data('bank_id');
                $balance_amount=post_data('bank_opening_balance');
                $financial_year=post_data('bank_balance_fiscal_year');
                //$add_to_prev_balance=post_data('');

                $creator_id=$this->data['userdata']->user_id;

                $get_balance_data=$this->ctpm->get_bank_balance(array('balance_inst_id'=>$this->inst_id,'balance_financial_year'=>$financial_year,'balance_bank_id'=>$bank_id,'balance_status'=>'active'));

                $this->ctpm->update_bank_balance_data(array('balance_bank_id'=>$bank_id,'balance_status'=>'inactive','balance_updated_at'=>date('Y-m-d H:i:s'),'balance_updated_by'=>$creator_id),array('balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_bank_id'=>$bank_id));

                $data_to_insert=array(
                    'balance_bank_id'=>$bank_id,
                    'balance_inst_id'=>$this->inst_id,                    
                    'balance_inst_type'=>$this->inst_type,
                    'balance_opening_amount'=>$balance_amount,
                    'balance_financial_year'=>$financial_year,
                    'balance_status'=>'active',
                    'balance_created_at'=>date('Y-m-d H:i:s'),
                    'balance_created_by'=>$creator_id
                );

                $balance_id=$this->ctpm->store_bank_balance_data($data_to_insert);

                if($balance_id){

                    $return['success']='Balance added successfully';
                }else{
                    $return['error']='Balance not added.';
                }

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchBankBalanceList(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $institute_data=check_institute($this->data['userdata']);
                $inst_id=$institute_data['institute_id'];

                $param['inst_id']=$inst_id;
                $param['column_order'] = array(
                    null,
                    'balance_financial_year'
                );

                $param['column_search'] = array('balance_financial_year','bank_name','bank_account_no');
                $param['order'] = array('bank_id' => 'DESC');
                $posts=$this->input->post();


                $param['inst_id']=$this->inst_id;
                $param['inst_type']=$this->inst_type;

                $list = $this->ctpm->_get_bank_balance($posts,$param,FALSE,FALSE);                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $bank){
                    $no++;

                    $row = array();

                    $row[]  =   $no;
                    $row[]  =   $bank->balance_financial_year;
                    $row[]  =   $bank->bank_name.'<br>A/C No:'.$bank->bank_account_no;
                    $row[]  =   number_format($bank->balance_opening_amount,2);
                    $row[]  =   number_format($bank->balance_adjusted_amount,2);                    
                    $row[]  =   date('d-m-Y',strtotime($bank->balance_created_at));

                    if($bank->balance_status=='active'){
                        $action='<button class="btn btn-xs btn-dark btn_edit_bank_balance" data-bank_id="'.$bank->balance_bank_id.'" data-balance_value="'.$bank->balance_opening_amount.'" data-fiscal_year="'.$bank->balance_financial_year.'"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-xs btn-danger btn_delete_bank_balance" data-balance_id="'.encode_data($bank->balance_id).'"><i class="fa fa-trash"></i></button>';
                    }else{
                        $action='';
                    }

                    $row[]  =   $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->ctpm->_get_bank_balance($posts,$param,TRUE),
                    "recordsFiltered" => $this->ctpm->_get_bank_balance($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }



    //Vendor Payment
    

    public function onGenerateVendorBill(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                if($this->ctms_access=='yes'){
                    $user_id=$this->data['userdata']->user_id;
                    $user_type=$this->data['userdata']->user_type;

                    $vendor_id=post_data('ctm_bill_vendor_id');
                    $vendor_type=post_data('ctm_bill_vendor_type');

                    $item_category=post_data('ctm_bill_account_category');

                    $ctm_purchase_date=post_data('ctm_purchase_date');

                    $ctm_bill=$this->input->post('ctm_bill');

                    $ctm_invoice_no=ge_rand_code('CAINV',3,TRUE);

                    $bill_data=array();

                    $total_amount=0;

                    if(!empty($ctm_bill)){
                        foreach ($ctm_bill as $key => $value) {
                            $bill_item=$value['item'];
                            $bill_item_qty=$value['qty'];
                            $bill_item_amount=$value['amount'];

                            if(!empty($bill_item) && !empty($bill_item_qty) && !empty($bill_item_amount)){

                                $total_amount=$total_amount+$bill_item_amount;

                                $bill_data[]=array(
                                    'order_inst_id'=>$this->inst_id,
                                    'order_inst_type'=>$this->inst_type,
                                    'order_vendor_id'=>$vendor_id,
                                    'order_qty'=>$bill_item_qty,
                                    'order_item_description'=>$bill_item,
                                    'order_payment_amount'=>$bill_item_amount,
                                    'order_invoice_code'=>$ctm_invoice_no
                                );
                            }
                        }


                        if(!empty($bill_data)){
                            if(!empty($total_amount) && is_numeric($total_amount)){

                                $payment_data=array(                                
                                    'ctm_inst_id'=>$this->inst_id,
                                    'ctm_inst_parent_id'=>$this->inst_parent_id,
                                    'ctm_inst_type'=>$this->inst_type,
                                    'ctm_vendor_id'=>$vendor_id,
                                    'ctm_vendor_category_id'=>$vendor_type,
                                    'ctm_account_category_id'=>$item_category,
                                    'ctm_invoice_no'=>$ctm_invoice_no,
                                    'ctm_purchase_date'=>date('Y-m-d',strtotime($ctm_purchase_date)),
                                    'ctm_payment_amount'=>$total_amount,
                                    'ctm_pay_mode'=>'n/a',                               
                                    'ctm_payment_paid'=>'no',
                                    'created_by'=>$user_id,
                                    'created_by_type'=>$user_type
                                );

                                $payment_id=$this->ctpm->store_payment_data($payment_data);

                                if($payment_id){

                                    $order_inserted=$this->ctpm->store_order_data($bill_data,TRUE);

                                    if($order_inserted){

                                        if(isset($_FILES['ctm_vendor_submitted_bill']) && $_FILES['ctm_vendor_submitted_bill']['name']!=''){

                                            if($this->inst_type=='institute'){
                                                $storage_dir='institutes/'.$this->inst_code.'/vendors/'.date('Y');
                                            }else if($this->inst_type=='institute_branch'){
                                                $storage_dir='institutes/'.$this->inst_code.'/vendors/'.date('Y');
                                            }

                                            $vendor_bill_file=array(
                                                'file_size'=>'5',
                                                'file_name'=>'ctm_vendor_submitted_bill',
                                                'file_types'=>'png,jpg,jpeg',
                                                'file_type_of'=>'vendor',
                                                'file_storage_type'=>'vendor_bill',
                                                'file_storage_dir'=>$storage_dir,
                                                'file_storage_type_id'=>$payment_id,
                                                'file_parent_id'=>$this->inst_parent_id,
                                                'file_compress'=>false,
                                                'file_operation_type'=>'new',
                                                'file_uploaded_by'=>$user_id
                                            );
            
                                            $this->onUploadFiles($vendor_bill_file);
                                        }

                                        $this->ctpm->update_order_data(array('order_payment_id'=>$payment_id),array('order_invoice_code'=>$ctm_invoice_no));

                                        $return['success']='Invoice generated.';
                                        
                                    }else{
                                        $return['error']='Data not saved.Try after sometime.';
                                    }
                                }else{
                                    $return['error']='Data not saved.Try after sometime.';
                                }

                            }else{
                                $return['error']='Data error occurred.';
                            }
                        }else{
                            $return['error']='No data found to process';
                        }                       
                    }else{
                        $return['error']='No data found to process';
                    }
                }else{
                    $return['error']='You don\'t have the permission';
                }   

                json_headers($return); 

            }else{
                 redirect($this->data['base_url']);
            }
        }else{
             redirect($this->data['base_url']);
        }
    }


    public function onLoadInvoiceData(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                if($this->ctms_access=='yes'){
                    $payment_id=post_data('payment_id');

                    if(!empty($payment_id)){
                        $payment_id=decode_data($payment_id);

                        $this->data['bank_data']=$this->sm->get_banks(array('bank_inst_id'=>$this->inst_id,'bank_inst_type'=>$this->inst_type,'bank_status'=>'active'),FALSE);

                        $this->data['payment_data']=$this->ctpm->get_payment_data(array('ctm_payment_id'=>$payment_id));

                        $order_data=$this->ctpm->get_order_data(array('order_payment_id'=>$payment_id),FALSE);

                        $this->data['order_data']=$order_data;

                        $return['html']=$this->theme->view('_pages/exm/vw_exms_vendor_bills_invoice',$this->data,true);

                    }else{
                        $return['error']='No data found';
                    }

                    
                }else{
                    $return['error']='You don\'t have the permission';
                }

                json_headers($return);    

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onLoadCanteenBalances(){
       if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $payment_mode=post_data('pay_mode');
                $bank_id=post_data('bank_id');

                if($payment_mode=='cash'){
                    $cash_balance=$this->ctpm->get_cash_balance(array('balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));

                    if(!empty($cash_balance)){
                        $return['balance']=($cash_balance->balance_adjusted_amount>0)?number_format($cash_balance->balance_adjusted_amount):number_format($cash_balance->balance_opening_amount);
                    }else{
                        $return['balance']='none';
                    }
                    
                }else if($payment_mode=='cheque'){
                    $bank_balance_data=$this->ctpm->get_bank_balance(array('balance_bank_id'=>$bank_id,'balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));

                    if(!empty($bank_balance_data)){
                        $return['balance']=($bank_balance_data->balance_adjusted_amount>0)?number_format($bank_balance_data->balance_adjusted_amount):number_format($bank_balance_data->balance_opening_amount);
                    }else{
                        $return['balance']='none';
                    }
                }

                
                json_headers($return);                

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onPayVendorPayment(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $user_id=$this->data['userdata']->user_id;
                $user_type=$this->data['userdata']->user_type;

                $payment_id=post_data('payment_id');
                $pay_mode=post_data('ctm_pay_mode');
                $cheque_no=post_data('ctm_pay_cheque_no');
                $cheque_bank=post_data('ctm_cheque_bank');

                $balance=0;

                if(!empty($payment_id)){
                    $payment_id=decode_data($payment_id);

                    if($pay_mode=='cheque' && empty($cheque_no)){

                        $return['error']='Please provide cheque no';

                    }else if($pay_mode=='cheque' && $cheque_bank==0){

                        $return['error']='Please provide Bank details';

                    }
                    else{
                        $payment_data=$this->ctpm->get_payment_data(array('ctm_payment_id'=>$payment_id));

                        $details_msg=ucwords($pay_mode).' paid';


                        if($pay_mode=='cash'){
                            $in_hand_balance_details=$this->ctpm->get_cash_balance(array('balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));

                            $balance=($in_hand_balance_details->balance_adjusted_amount>0)?$in_hand_balance_details->balance_adjusted_amount:$in_hand_balance_details->balance_opening_amount;

                            $account_balance=($in_hand_balance_details->balance_adjusted_amount>0)?($in_hand_balance_details->balance_adjusted_amount-$payment_data->ctm_payment_amount):($in_hand_balance_details->balance_opening_amount-$payment_data->ctm_payment_amount);
                        }

                        if($balance>$payment_data->ctm_payment_amount){
                            if(!empty($payment_data)){
                                $payment_details=array(
                                    'details_type'=>'canteen_payment',
                                    'details_payment_type'=>'canteen_vendor_fees',
                                    'details_type_text'=>'Canteen vendor payment for invoice no '.$payment_data->ctm_invoice_no,
                                    'details_payment_id'=>$payment_id,
                                    'details_type_id'=>$payment_data->ctm_vendor_id,
                                    'details_inst_id'=>$this->inst_id,
                                    'details_parent_inst_id'=>$this->inst_parent_id,
                                    'details_txn_id'=>'TXN'.$payment_id.date('Ymd'),
                                    'details_cheque_no'=>$cheque_no,
                                    'details_pay_id'=>null,
                                    'details_pay_order_id'=>null,
                                    'details_order_id'=>$payment_data->ctm_invoice_no.'_canteen_vendor',
                                    'details_order_code'=>$payment_data->ctm_invoice_no,
                                    'details_amount'=>$payment_data->ctm_payment_amount,
                                    'details_pay_currency'=>'INR',
                                    'details_accounting_type'=>'expenditure',
                                    'details_status'=>'success',
                                    'details_gateway_status'=>'',
                                    'details_msg'=>'',
                                    'details_created_by_type'=>$user_type,
                                    'details_created_by'=>$user_id,
                                    'details_created_at'=>date('Y-m-d'),
                                    'details_gateway_created_at'=>date('Y-m-d')
                                );


                                $payment_data_inserted=$this->fm->store_payment_details($payment_details);

                                if($payment_data_inserted){                                

                                    if($pay_mode=='cash'){
                                        $this->ctpm->update_payment_data(array('ctm_payment_paid'=>'yes','ctm_pay_mode'=>$pay_mode),array('ctm_payment_id'=>$payment_id));
                                        $this->ctpm->update_cash_balance_data(array('balance_adjusted_amount'=>$account_balance),array('balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));
                                    }else if($pay_mode=='cheque'){
                                        $this->ctpm->update_payment_data(array('ctm_payment_paid'=>'cheque_to_clear','ctm_pay_mode'=>$pay_mode,'ctm_payment_bank'=>$cheque_bank,'ctm_payment_checq_no'=>$cheque_no),array('ctm_payment_id'=>$payment_id));
                                    }

                                    $return['success']='Payment successfull';
                                }else{
                                    $return['error']='Payment error';
                                }

                            }else{
                                $return['error']='Payment data not available.';
                            }
                        }else{
                            $return['error']='Insufficient cash to disburse.Canteen Cash balance needs to be updated.';
                        }

                            
                    }
                }else{
                    $return['error']='Payment data not found in the system';
                }
                    
                json_headers($return);           

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onMarkPayment(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $payment_id=post_data('payment_id');

                $user_id=$this->data['userdata']->user_id;

                $user_type=$this->data['userdata']->user_type;
                ;
                if(!empty($payment_id)){
                    $payment_id=decode_data($payment_id);
                    $payment_data=$this->ctpm->get_payment_data(array('ctm_payment_id'=>$payment_id));

                    if(!empty($payment_data)){

                        $updated=$this->ctpm->update_payment_data(array('ctm_payment_paid'=>'yes','updated_at'=>date('Y-m-d'),'updated_by_type'=>$this->data['userdata']->user_type,'updated_by'=>$user_id),array('ctm_payment_id'=>$payment_id));

                        if($updated){

                            $bank_balance_data=$this->ctpm->get_bank_balance(array('balance_bank_id'=>$payment_data->ctm_payment_bank,'balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));

                            if(!empty($bank_balance_data)){
                                if($bank_balance_data->balance_opening_amount>0){
                                    $balance_value=$bank_balance_data->balance_opening_amount-$payment_data->ctm_payment_amount;
                                }else if($bank_balance_data->balance_adjusted_amount>0){
                                    $balance_value=$bank_balance_data->balance_adjusted_amount-$payment_data->ctm_payment_amount;
                                }

                                $this->ctpm->update_bank_balance_data(array('balance_adjusted_amount'=>$balance_value,'balance_updated_by'=>$user_id,'balance_updated_at'=>date('Y-m-d')),array('balance_bank_id'=>$payment_data->ctm_payment_bank,'balance_inst_id'=>$this->inst_id,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));
                            }


                            $return['success']='Payment data updated';
                        }else{
                            $return['error']='Data not updated';
                        }


                    }else{
                        $return['error']='Payment data not found';
                    }


                }else{
                    $return['error']='Payment data not found';
                }

                json_headers($return);


            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    /***INCOME & Expense Accounts***/
    public function indexIncomeAccounts(){
        if(session_userdata('isAdminLoggedin')){
            $this->data['page_title']='Incomes';

            if($this->ams_access=='yes'){
                $ams_income_access= check_access_control($this->data['userdata'],'ams_income','view');
                $ams_income_add_access= check_access_control($this->data['userdata'],'ams_income','add');
                $ams_income_edit_access= check_access_control($this->data['userdata'],'ams_income','edit');

                $this->data['ams_income_add_access']=$ams_income_add_access;
                $this->data['ams_income_edit_access']=$ams_income_edit_access;

                if($ams_income_access=='yes'){
                    $cash_balance=$this->sm->get_cash_balance(array('balance_status'=>'active'));           

                    $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                    if(!empty($_bank_accounts)){
                        foreach ($_bank_accounts as $key => $value) {
                            $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                            if(!empty($bank_balance)){
                                $bank_accounts[]=array(
                                    'bank_id'=>$value->bank_id,
                                    'bank_name'=>$value->bank_name,
                                    'bank_account_no'=>$value->bank_account_no
                                );
                            }
                        }
                    }

                    $this->data['bank_accounts'] = $bank_accounts;
                    $this->data['cash_balance']=$cash_balance;
                    
                    $this->data['account_heads'] = $this->ctvm->get_accounts_category_data(array('is_editable'=>'yes','category_type'=>'income'),FALSE);
                    $view='exm/vw_exms_accounts_income';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }
            }else{
                $view='exm/vw_exms_permission_denied';
            }
            
            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    }

    public function indexExpenseAccounts(){
        if(session_userdata('isAdminLoggedin')){
            $this->data['page_title']='Expense';

            if($this->ams_access=='yes'){
                $bank_accounts=[];
                $ams_expense_access= check_access_control($this->data['userdata'],'ams_expense','view');
                $ams_expense_add_access= check_access_control($this->data['userdata'],'ams_expense','add');
                $ams_expense_edit_access= check_access_control($this->data['userdata'],'ams_expense','edit');

                $this->data['ams_expense_add_access']=$ams_expense_add_access;
                $this->data['ams_expense_edit_access']=$ams_expense_edit_access;

                if($ams_expense_access=='yes'){
                    $cash_balance=$this->sm->get_cash_balance(array('balance_status'=>'active'));           

                    $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                    if(!empty($_bank_accounts)){
                        foreach ($_bank_accounts as $key => $value) {
                            $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                            if(!empty($bank_balance)){
                                $bank_accounts[]=array(
                                    'bank_id'=>$value->bank_id,
                                    'bank_name'=>$value->bank_name,
                                    'bank_account_no'=>$value->bank_account_no
                                );
                            }
                        }
                    }

                    $this->data['bank_accounts'] = $bank_accounts;
                    $this->data['cash_balance']=$cash_balance;
                    $this->data['account_heads'] = $this->ctvm->get_accounts_category_data(array('is_editable'=>'yes','category_type'=>'expense'),FALSE);
                    $view='exm/vw_exms_accounts_expense';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }
            }else{
                $view='exm/vw_exms_permission_denied';
            }
            
            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function indexTransferAccounts(){
        if(session_userdata('isAdminLoggedin')){
            $this->data['page_title']='Fund Transfer';
            $this->data['module_name']='Accounts Fund Transfer Management';

            if($this->ams_access=='yes'){
                $bank_accounts=[];
                $ams_fund_transfer_view_access= check_access_control($this->data['userdata'],'ams_fund_transfer','view');
                $ams_fund_transfer_add_access= check_access_control($this->data['userdata'],'ams_fund_transfer','add');
                $ams_expense_edit_access= check_access_control($this->data['userdata'],'ams_fund_transfer','edit');

                $this->data['ams_fund_transfer_add_access']=$ams_fund_transfer_add_access;
                $this->data['ams_expense_edit_access']=$ams_expense_edit_access;

                if($ams_fund_transfer_view_access=='yes'){
                    $cash_balance=$this->sm->get_cash_balance(array('balance_status'=>'active'));           

                    $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                    if(!empty($_bank_accounts)){
                        foreach ($_bank_accounts as $key => $value) {
                            $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                            if(!empty($bank_balance)){
                                $bank_accounts[]=array(
                                    'bank_id'=>$value->bank_id,
                                    'bank_name'=>$value->bank_name,
                                    'bank_account_no'=>$value->bank_account_no
                                );
                            }
                        }
                    }

                    $this->data['bank_accounts'] = $bank_accounts;
                    $this->data['cash_balance']=$cash_balance;
                    $this->data['account_heads'] = $this->ctvm->get_accounts_category_data(array('is_editable'=>'yes','category_type'=>'expense'),FALSE);
                    $view='exm/vw_exms_accounts_transfer';
                }else{
                    $view='exm/vw_exms_permission_denied';
                }
            }else{
                $view='exm/vw_exms_permission_denied';
            }
            
            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    }



    public function onSearchIncomeList(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $institute_data=check_institute($this->data['userdata']);
                $inst_id=$institute_data['institute_id'];

                $param['column_order'] = array(
                    null,
                    'details_amount',
                    'details_discount_amount'
                );

                $param['column_search'] = array('details_accounting_type');
                $param['order'] = array('details_id' => 'DESC');
                $posts=$this->input->post();
                $ams_expense_delete_access= check_access_control($this->data['userdata'],'ams_expense','delete');
                $ams_expense_edit_access= check_access_control($this->data['userdata'],'ams_expense','edit');


                $param['inst_id']=$inst_id;

                $param['accounting_type']=$posts['accounting_type'];

                if(isset($posts['data_of_session']) && $posts['data_of_session']>0){
                    $param['session_id']=$posts['data_of_session'];
                }

                if(isset($posts['data_of_course']) && $posts['data_of_course']>0){
                    $param['course_id']=$posts['data_of_course'];
                }


                if(isset($posts['data_of_student']) && $posts['data_of_student']>0){
                    $param['student_id']=$posts['data_of_student'];
                }


                if(isset($posts['data_of_start_date']) && !empty($posts['data_of_start_date'])){
                    $param['start_date']=date('Y-m-d',strtotime($posts['data_of_start_date']));
                }

                if(isset($posts['data_of_end_date']) && !empty($posts['data_of_end_date'])){
                    $param['end_date']=date('Y-m-d',strtotime($posts['data_of_end_date']));
                }


                $list = $this->fm->__get_payments_details($posts,$param,FALSE,FALSE,FALSE);

                //print_obj($list);die;
                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                $current_date=date('Y-m-d');
                $current_month=date('m');
                $current_year=date('Y');

                $_total_income_in_current_date=$this->fm->__get_fees_details_total(array('details_inst_id'=>$inst_id,'details_accounting_type'=>'income','DATE(details_created_at)'=>$current_date),'details_amount');

                $_total_income_in_current_month=$this->fm->__get_fees_details_total(array('details_inst_id'=>$inst_id,'details_accounting_type'=>'income','MONTH(details_created_at)'=>$current_month,'YEAR(details_created_at)'=>$current_year),'details_amount');

                $_total_income_in_current_year=$this->fm->__get_fees_details_total(array('details_inst_id'=>$inst_id,'details_accounting_type'=>'income','YEAR(details_created_at)'=>$current_year),'details_amount');

                $total_income='0';
                $total_income_in_current_date=(!empty($_total_income_in_current_date) && $_total_income_in_current_date[0]->total)?$_total_income_in_current_date[0]->total:'0';
                $total_income_in_current_month=(!empty($_total_income_in_current_month) && $_total_income_in_current_month[0]->total)?$_total_income_in_current_month[0]->total:'0';
                $total_income_in_current_year=(!empty($_total_income_in_current_year) && $_total_income_in_current_year[0]->total)?$_total_income_in_current_year[0]->total:'0';

                foreach ($list as $fees){
                    $no++;

                    $row = array();

                    $agent_payment=$this->fm->get_payment_details(array('details_order_code'=>$fees->details_order_code,'details_type'=>'agent_payment'));

                    if(!empty($agent_payment)){
                        $agent_paid_out=$agent_payment->details_amount;
                    }else{
                        $agent_paid_out='0';
                    }

                    $_total_income=$fees->details_amount-($fees->details_discount_amount+$agent_paid_out);


                    $course_data=$this->sessm->get_session_course(array('session_inst_id'=>$inst_id,'session_course_id'=>$fees->details_course_id,'session_id'=>$fees->details_sess_id));

                    if(!empty($fees->stu_mid_name)){
                        $student_name=$fees->stu_first_name.' '.$fees->stu_mid_name.' '.$fees->stu_last_name;
                    }else{
                        $student_name=$fees->stu_first_name.' '.$fees->stu_last_name;
                    }

                    $details_payment_type='<span class="badge badge-xs badge-success">'.strtoupper(str_replace("_", " ", $fees->details_payment_type)).'</span>';

                    if($fees->details_type=='new_admission'){
                        $admission_data=$this->adm->get_admission_data(array('admission_id'=>$fees->details_type_id));
                        $admission_code='Admission Code:'.$admission_data->admission_code;                        
                    }else if($fees->details_type=='seat_booking'){
                        $seatbooking_data=$this->adm->get_seat_booking_data(array('booking_id'=>$fees->details_type_id));
                        $admission_code='Booking Code:'.$seatbooking_data->booking_code;
                    }

                    $student_name.='<br>Code:'.$fees->stu_user_code.'<br>Course:'.$fees->course_code.'<br>Session:'.$fees->session_start_year.'-'.$fees->session_end_year.'<br>'.$admission_code;

                    $created_date=date('d-m-Y',strtotime($fees->details_created_at));

                    $row[]  =   $no;
                    
                    if($fees->details_vendor_id!=0){
                        $row[]  =   'A/C Head:'.$fees->category_name.'<br>'.$fees->details_type_text.'<br>Vendor:'.$fees->vendor_name;
                    }else{
                        $row[]  =   'A/C Head:'.$fees->category_name.'<br>'.$fees->details_type_text;
                    }

                    if($fees->details_payment_platform!='old_payment_before_software'){
                        $details_payment_platform=strtoupper($fees->details_payment_platform);
                    }else{
                        $details_payment_platform='OLD PAYMENT';
                    }
                    
                    $row[]  =   $details_payment_platform;
                    $row[]  =   $created_date;
                    $row[]  =   $fees->details_amount;

                    if($fees->details_type=='other'){
                        $action='<div class="btn-group" role="group" aria-label="Basic example">';
                        if($ams_expense_edit_access=='yes'){
                            $action.='<button type="button" class="btn btn-xs btn-dark btn_edit_payment" data-payment_id="'.encode_data($fees->details_id).'" data-name="'.$fees->details_type_text.'" data-amount="'.$fees->details_amount.'" data-created_at="'.$created_date.'" data-payment_method="'.$fees->details_payment_platform.'" data-description="'.$fees->details_payment_note.'" data-ac_head="'.$fees->details_accounting_type_id.'"><i class="fa fa-edit"></i></button>';
                        }

                        if($ams_expense_delete_access=='yes'){
                            $action.='<button type="button" class="btn btn-xs btn-danger btn_del_accounts" data-payment_id="'.encode_data($fees->details_id).'" data-account_type="'.$posts['accounting_type'].'"><i class="fa fa-trash"></i></button>';
                        }

                        if($ams_expense_edit_access=='no' && $ams_expense_delete_access=='no'){
                            $action.='<span class="badge badge-dark">Not permitted</span>';
                        }
                                    
                                    
                        $action.='</div>';
                    }else{
                        $action='';
                    }

                    $row[]  = $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->__get_payments_details($posts,$param,FALSE,TRUE),
                    "recordsFiltered" => $this->fm->__get_payments_details($posts,$param,FALSE,TRUE),
                    "data" => $data,
                    "total_income"=>$total_income,
                    "total_income_in_current_date"=>$total_income_in_current_date,
                    "total_income_in_current_month"=>$total_income_in_current_month,
                    "total_income_in_current_year"=>$total_income_in_current_year
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    /**Add Income data*/
    public function onAddIncomesExpense() {
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {
    
                // Load the form validation library
                $this->load->library('form_validation');
    
                // Set validation rules
                $this->form_validation->set_rules('account_income_name', 'Income Name', 'required|regex_match[/^[a-zA-Z0-9\s,.-]+$/]', [
                    'required' => 'The Income Name field is required.',
                    'regex_match' => 'The Income Name field can only contain letters, numbers, spaces, commas, hyphens, and dots.'
                ]);
                $this->form_validation->set_rules('account_head', 'Account Head', 'required|greater_than[0]', [
                    'required' => 'The Account Head field is required.',
                    'greater_than' => 'The Account Head field must be greater than zero.'
                ]);
                $this->form_validation->set_rules('account_amount', 'Account Amount', 'required|greater_than[0]', [
                    'required' => 'The Account Amount field is required.',
                    'greater_than' => 'The Account Amount must be greater than zero and a valid number.'
                ]);
               
                $this->form_validation->set_rules('account_transact_date', 'Transaction Date', 'required', [
                    'required' => 'The Transaction Date field is required.'
                ]);
                $this->form_validation->set_rules('account_transact_desc', 'Transaction Description', 'regex_match[/^[a-zA-Z0-9\s,.:-]*$/]', [
                    'regex_match' => 'The Transaction Description field can only contain letters, numbers, spaces, commas, hyphens, and dots.'
                ]);
    
                // Run validation
                if ($this->form_validation->run() == FALSE) {
                    // Validation failed, send validation errors as response
                    $return['errors'] = $this->form_validation->error_array();
                } else {
                    // If validation passes, process the data
                    $emp_id = decode_data(session_userdata('admin_id'));
                    $payment_id = $this->input->post('payment_id');
                    $vendor_id=post_data('account_vendor_id');
                    $account_income_name = post_data('account_income_name');
                    $account_head = post_data('account_head');
                    $account_amount = post_data('account_amount');
                    $account_payment_method = post_data('account_payment_method');
                    $account_transact_date = post_data('account_transact_date');
                    $account_transact_desc = post_data('account_transact_desc');
                    $account_cheque_no = post_data('account_cheque_no');
                    $accounting_type=post_data('accounting_type');
                    $account_credit_debit=post_data('account_credit_debit');
    
                    if (!empty($payment_id)) {
                        $payment_id = decode_data($payment_id);
                    } else {
                        $payment_id = 0;
                    }
    
                    $inst_parent_id = $this->inst_parent_id;
                    $inst_id = $this->inst_id;
                    $inst_type = $this->inst_type;
                    $user_type= $this->user_type;

                    if($accounting_type=='expenditure'){
                        if($user_type=='employee'){
                            $user_data=$this->um->get_user(array('user_id'=>$emp_id),$user_type);
                            $expense_limit=$user_data->emp_expense_limit;
                        }else{
                            $expense_limit=null;
                        }

                        if($expense_limit==null){
                            $can_do_expense=true;
                        }else if($expense_limit!=null && $account_amount<=$expense_limit){
                            $can_do_expense=true;
                        }else if($expense_limit!=null && $account_amount>$expense_limit){
                            $can_do_expense=false;
                        }else if($expense_limit==0){
                            $can_do_expense=false;
                        }
                    } else{
                        $can_do_expense=true;
                    }                   

                    if($can_do_expense==true){                        
                        $data_to_add = compact('inst_parent_id', 'account_income_name', 'account_transact_date', 'emp_id', 'inst_id', 'vendor_id', 'account_payment_method', 'account_transact_desc', 'account_amount', 'account_head', 'inst_type', 'account_cheque_no','accounting_type','account_credit_debit');
        
                        $details_id = store_accounts_details($data_to_add, $payment_id);

                        if($details_id!=0){
                            if ($payment_id == 0) {
                                $return['success'] = ($accounting_type=='income')?'Accounts Income has been added successfully':'Accounts Expense has been added successfully';
                            } else {
                                $return['success'] = ($accounting_type=='income')?'Accounts Income has been updated successfully':'Accounts Expense has been updated successfully';
                            }
                        }else{
                            $return['error'] = 'Expense can not be added as there is no cash or bank balance available in the system.';
                        } 
                    }else if($can_do_expense==false){
                        $return['error']='You can not add this expense as it exceeds the limit of your account Rs.'.number_format($expense_limit,2);
                    }   
                      
                }
    
                json_headers($return);
                session_write_close();
            } else {
                redirect($this->data['base_url']);
            }
        } else {
            redirect($this->data['base_url']);
        }
    }

    public function onLoadExpenseData(){
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

                $payment_id=post_data('payment_id');
                $expense_data=array();

                if(!empty($payment_id)){
                    $payment_id=decode_data($payment_id);

                    $expense_data=$this->fm->get_payment_details(array('details_id'=>$payment_id));                    
                }

                $this->data['expense_data']=$expense_data;

                $cash_balance=$this->sm->get_cash_balance(array('balance_status'=>'active'));           

                $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                if(!empty($_bank_accounts)){
                    foreach ($_bank_accounts as $key => $value) {
                        $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                        if(!empty($bank_balance)){
                            $bank_accounts[]=array(
                                'bank_id'=>$value->bank_id,
                                'bank_name'=>$value->bank_name,
                                'bank_account_no'=>$value->bank_account_no
                            );
                        }
                    }
                }

                $vendors=$this->vm->get_vendor_data(array('vendor_inst_id'=>$this->inst_id,'vendor_inst_type'=>$this->inst_type),FALSE);

                if(!empty($vendors)){
                    foreach ($vendors as $key => $value) {
                        $_vendors[]=array(
                            'vendor_id'=>$value->vendor_id,
                            'vendor_name'=>$value->vendor_name,
                            'selected'=>(!empty($vendor_id) && ($value->vendor_id==$vendor_id)?'selected':'')
                        );
                    }
                }

                $this->data['bank_accounts'] = $bank_accounts;
                $this->data['cash_balance']=$cash_balance;
                $this->data['vendors']=$_vendors;
                $this->data['account_heads'] = $this->ctvm->get_accounts_category_data(array('is_editable'=>'yes','category_type'=>'expense'),FALSE);

                $return['html']=$this->theme->view('_pages/exm/vw_exms_expense_data_dyna',$this->data,true);

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    public function onLoadIncomeData(){
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

                $payment_id=post_data('payment_id');
                $expense_data=array();

                if(!empty($payment_id)){
                    $payment_id=decode_data($payment_id);

                    $expense_data=$this->fm->get_payment_details(array('details_id'=>$payment_id));                    
                }

                $this->data['expense_data']=$expense_data;

                $cash_balance=$this->sm->get_cash_balance(array('balance_status'=>'active'));           

                $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                if(!empty($_bank_accounts)){
                    foreach ($_bank_accounts as $key => $value) {
                        $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                        if(!empty($bank_balance)){
                            $bank_accounts[]=array(
                                'bank_id'=>$value->bank_id,
                                'bank_name'=>$value->bank_name,
                                'bank_account_no'=>$value->bank_account_no
                            );
                        }
                    }
                }

                $vendors=$this->vm->get_vendor_data(array('vendor_inst_id'=>$this->inst_id,'vendor_inst_type'=>$this->inst_type),FALSE);

                if(!empty($vendors)){
                    foreach ($vendors as $key => $value) {
                        $_vendors[]=array(
                            'vendor_id'=>$value->vendor_id,
                            'vendor_name'=>$value->vendor_name,
                            'selected'=>(!empty($vendor_id) && ($value->vendor_id==$vendor_id)?'selected':'')
                        );
                    }
                }

                $this->data['bank_accounts'] = $bank_accounts;
                $this->data['cash_balance']=$cash_balance;
                $this->data['vendors']=$_vendors;
                $this->data['account_heads'] = $this->ctvm->get_accounts_category_data(array('is_editable'=>'yes','category_type'=>'income'),FALSE);

                $return['html']=$this->theme->view('_pages/exm/vw_exms_income_data_dyna',$this->data,true);

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    public function onDeleteIncomeExpense(){
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

                $payment_id=post_data('payment_id');

                if(!empty($payment_id)){
                    $payment_id=decode_data($payment_id);

                    $deleted=$this->fm->delete_payment_details(array('details_id'=>$payment_id));

                    if($deleted){
                        $return['success']='Data deleted successfully.';
                    }else{
                        $return['error']='Data not deleted.';
                    }

                }else{
                    $return['error']='Data not found in the system.';
                }

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    /***Fund Transfer***/
    public function onAddFundTransferForm(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $ams_fund_transfer_add_access= check_access_control($this->data['userdata'],'ams_fund_transfer','add');

                if($ams_fund_transfer_add_access=='yes'){
                    $this->load->library('form_validation');
                    $same_bank=false;
                    $cash_to_cash=false;

                    $this->form_validation->set_rules('account_transfer_amount', 'Transfer Amount', 'required|numeric|greater_than[0]');
                    // $this->form_validation->set_rules('transfer_from', 'Transfer From', 'required|alpha_numeric_spaces');
                    // $this->form_validation->set_rules('transfer_to', 'Transfer To', 'required|alpha_numeric_spaces');
                    $this->form_validation->set_rules('account_transfer_purpose', 'Transfer Purpose', 'required|alpha_numeric_spaces');
        
                    if ($this->form_validation->run() == FALSE) {
                        $return['error'] = validation_errors();
                    }else{

                        //$transfer_id=post_data('transfer_id');
                        $transfer_amount=post_data('account_transfer_amount');
                        $toAccount=post_data('toAccount');
                        $fromAccount=post_data('fromAccount');
                        $transfer_purpose=post_data('account_transfer_purpose');
                        $account_from_bank=post_data('account_from_bank');
                        $account_to_bank=post_data('account_to_bank');

                        $creator_id=$this->data['userdata']->user_id;

                        if($toAccount=='to_bank'){
                            $to_bank_name=$account_to_bank;
                        }else{
                            $to_bank_name=0;
                        }

                        if($fromAccount=='from_bank'){
                            $from_bank_name=$account_from_bank;
                            $get_balance_data=$this->sm->get_bank_balance(array('balance_inst_id'=>$this->inst_id,'balance_bank_id'=>$account_from_bank,'balance_inst_type'=>$this->inst_type,'balance_status'=>'active'));
                        }else{
                            $from_bank_name=0;
                            $get_balance_data=$this->sm->get_cash_balance(array('balance_inst_id'=>$this->inst_id,'balance_status'=>'active'));
                        }

                        if($toAccount=='to_bank' && $fromAccount=='from_bank'){
                            if($account_to_bank==$account_from_bank){
                                $same_bank=true;
                            }
                        }else if($toAccount=='to_cash' && $fromAccount=='from_cash'){
                            $cash_to_cash=true;
                        }

                        if($same_bank==true){
                            $return['error']='From and To bank cannot be same';
                        }else if($cash_to_cash==true){
                            $return['error']='Cash to Cash transaction can not be done';
                        }else{
                            if($transfer_amount<=$get_balance_data->balance_opening_amount){
                                $get_transfer_data=$this->fm->get_fund_transfer(array('transfer_id'=>$transfer_id));

                                $transfer_data=array(
                                    'intitute_id'=>$this->inst_id,
                                    'intitute_parent_id'=>$this->inst_parent_id,
                                    'amount'=>$transfer_amount,
                                    'purpose'=>$transfer_purpose,
                                    'from_payment_method'=>$fromAccount,
                                    'to_payment_method'=>$toAccount,
                                    'from_bank_name'=>$from_bank_name,                        
                                    'to_bank_name'=>$to_bank_name,
                                    'status'=>($this->user_role=='1')?'approved':'pending',
                                    'created_by'=>$creator_id,
                                    'created_by_type'=>$this->data['userdata']->user_type,
                                    'transfer_date'=>date('Y-m-d'),
                                    'created_at'=>date('Y-m-d H:i:s')                      
                                );

                                if(!empty($get_transfer_data)){                    

                                    $updated=$this->fm->update_fund_transfer($transfer_data,array('transfer_id'=>$transfer_id));

                                    if($updated){
                                        $return['success']='Transfer has been updated.';
                                    }else{
                                        $return['error']='Transfer not updated.';
                                    }
                                }else{
                                    $transfer_id=$this->fm->store_fund_transfer($transfer_data);

                                    if($transfer_id && $this->user_role=='1'){
                                        if($fromAccount=='from_bank' && $toAccount=='to_bank'){
                                            store_bank_balance_data($to_bank_name,$this->inst_id,$creator_id,$transfer_amount,$transfer_id,'transfer_credit');
                                            store_bank_balance_data($from_bank_name,$this->inst_id,$creator_id,$transfer_amount,$transfer_id,'transfer_debit');
                                        }else if($fromAccount=='from_bank' && $toAccount=='to_cash'){
                                            store_cash_balance_data($this->inst_id,$this->inst_type,$creator_id,$transfer_amount,$transfer_id,'transfer_credit');
                                            store_bank_balance_data($from_bank_name,$this->inst_id,$creator_id,$transfer_amount,$transfer_id,'transfer_debit');
                                        }else if($fromAccount=='from_cash' && $toAccount=='to_bank'){
                                            store_bank_balance_data($to_bank_name,$this->inst_id,$creator_id,$transfer_amount,$transfer_id,'transfer_credit');
                                            store_cash_balance_data($this->inst_id,$this->inst_type,$creator_id,$transfer_amount,$transfer_id,'transfer_debit');
                                        }
                                    }

                                    $return['success']='Transfer has been added.';
                                }
                            }else{
                                $return['error']='Insufficient funds to transfer.';
                            } 
                        }   
                    }
                }else{
                    $return['error']='You are not authorized to transfer funds.';
                }             

                json_headers($return);
                    
            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onDeleteFundTransfer(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $ams_fund_transfer_delete_access= check_access_control($this->data['userdata'],'ams_fund_transfer','delete');

                if($ams_fund_transfer_delete_access=='yes'){
                    $transfer_id=post_data('transfer_id');

                    if(!empty($transfer_id)){
                        $transfer_id=decode_data($transfer_id);

                        $deleted=$this->fm->delete_fund_transfer(array('transfer_id'=>$transfer_id));

                        if($deleted){
                            $return['success']='Transfer has been deleted.';
                        }else{
                            $return['error']='Transfer not deleted.';
                        }

                    }else{
                        $return['error']='Data not found in the system.';
                    }
                }else{
                    $return['error']='You are not authorized to delete this transfer.';
                }

                

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }

    public function onLoadTransferData(){
        if (session_userdata('isAdminLoggedin') == TRUE && session_userdata('admin_id')) {
            if ($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD') == 'POST') {

                $transfer_id=post_data('transfer_id');
                $expense_data=array();

                if(!empty($transfer_id)){
                    $transfer_id=decode_data($transfer_id);

                    $transfer_data=$this->fm->get_payment_details(array('transfer_id'=>$transfer_id));                    
                }

                $this->data['transfer_data']=$transfer_data;

                $_bank_accounts = $this->sm->get_banks(array('bank_status' => 'active'),FALSE);

                if(!empty($_bank_accounts)){
                    foreach ($_bank_accounts as $key => $value) {
                        $bank_balance=$this->sm->get_bank_balance(array('balance_bank_id'=>$value->bank_id,'balance_status'=>'active'));
                        if(!empty($bank_balance)){
                            $bank_accounts[]=array(
                                'bank_id'=>$value->bank_id,
                                'bank_name'=>$value->bank_name,
                                'bank_account_no'=>$value->bank_account_no
                            );
                        }
                    }
                }

                $this->data['bank_accounts'] = $bank_accounts;

                $return['html']=$this->theme->view('_pages/exm/vw_exms_accounts_transfer_data_dyna',$this->data,true);

                json_headers($return);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onSearchFundTransferList(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $ams_fund_transfer_edit_access= check_access_control($this->data['userdata'],'ams_fund_transfer','edit');
                $ams_fund_transfer_delete_access= check_access_control($this->data['userdata'],'ams_fund_transfer','delete');

                $param['intitute_id']=$this->inst_id;
                $param['column_order'] = array(
                    null,
                    'purpose'
                );

                $param['column_search'] = array('purpose');
                $param['order'] = array('transfer_id' => 'DESC');
                $posts=$this->input->post();

                $list = $this->fm->_get_fund_transfer($posts,$param,FALSE,FALSE);                
                
                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $fundt){
                    $no++;

                    $row = array();

                    if($fundt->from_payment_method=='from_bank'){
                        $from_payment_method='BANK';                        
                    }else if($fundt->from_payment_method=='from_cash'){
                        $from_payment_method='CASH';
                    }

                    if($fundt->to_payment_method=='to_bank'){
                        $to_payment_method='BANK';
                    }else if($fundt->to_payment_method=='to_cash'){
                        $to_payment_method='CASH';
                    }

                    if($fundt->status=='approved'){
                        $status='<span class="badge badge-sm badge-success">APPROVED</span>';
                    }else if($fundt->status=='not_approved'){
                        $status='<span class="badge badge-sm badge-danger">NOT APPROVED</span>';
                    }else if($fundt->status=='pending'){
                        $status='<span class="badge badge-sm badge-warning">PENDING</span>';
                    }

                    $action='<div class="btn-group" role="group" aria-label="Basic example">';

                    if($ams_fund_transfer_edit_access=='yes' && $fundt->status!=='approved'){
                        $action.='<button type="button" class="btn btn-xs btn-dark btn_transfer_edit" data-transfer_id="'.encode_data($fundt->transfer_id).'" data-purpose="'.$fundt->purpose.'" data-amount="'.$fundt->amount.'" data-from_payment_method="'.$fundt->from_payment_method.'" data-to_payment_method="'.$fundt->to_payment_method.'" data-status="'.$fundt->status.'"><i class="fa fa-edit"></i></button>';
                    }

                    if($ams_fund_transfer_delete_access=='yes' && $fundt->status!=='approved'){
                        $action.='<button type="button" class="btn btn-xs btn-danger btn_transfer_del" data-transfer_id="'.encode_data($fundt->transfer_id).'" data-purpose="'.$fundt->purpose.'" data-amount="'.$fundt->amount.'" data-from_payment_method="'.$fundt->from_payment_method.'" data-to_payment_method="'.$fundt->to_payment_method.'" data-status="'.$fundt->status.'"><i class="fa fa-trash"></i></button>';
                    }

                    if($ams_fund_transfer_edit_access=='no' && $ams_fund_transfer_delete_access=='no' && $fundt->status!=='approved'){
                        $action.='<span class="badge badge-dark">OERATION NOT PERMITTED</span>';
                    }else{
                        $action.='<span class="badge badge-dark">OERATION NOT REQUIRED</span>';
                    }

                    $action.='</div>';

                    $row[]  =   $fundt->purpose;
                    $row[]  =   number_format($fundt->amount,2);
                    $row[]  =   $status;
                    $row[]  =   $from_payment_method;
                    $row[]  =   $to_payment_method;
                    $row[]  =   $action;

                    $data[] = $row; 
                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->fm->_get_fund_transfer($posts,$param,TRUE),
                    "recordsFiltered" => $this->fm->_get_fund_transfer($posts,$param,TRUE),
                    "data" => $data,
                );
                
                echo json_encode($output);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }


    //Balance Sheet
    public function indexBalanceSheet(){
        if(session_userdata('isAdminLoggedin')){
            $this->data['page_title']='Balance Sheet';
            $this->data['module_name']='Accounts Balance Sheet';

            if($this->ams_access=='yes'){
                $this->data['fiscal_year']=fiscalyear(2000);

                $this->data['accounts']='';

                $income_p_type=$this->vm->get_accounts_category_types(array('type_group'=>'income'),FALSE);

                //print_obj($income_p_type);

                if(!empty($income_p_type)){
                    foreach ($income_p_type as $key => $value) {
                        $income_types=$this->vm->get_accounts_category_data(array('category_type_id'=>$value->type_id),FALSE);

                        foreach ($income_types as $k => $v) {
                            $_incomes[$value->type_id][]=array(
                                'category_name'=>$v->category_name,
                                'category_id'=>$v->category_id,
                                'category_amount_value'=>''
                            );
                        }

                        $incomes[$value->type_name]=$_incomes[$value->type_id];
                    }                
                }
                
                //Expense

                $this->data['incomes']=$incomes;

                $view='exm/vw_exms_accounts_balance_sheet';
            }else{
                $view='exm/vw_exms_permission_denied';
            }

            $this->theme->title($this->data['page_title'])->load($view, $this->data);
        }else{
            redirect($this->data['base_url']);
        }
    }


    public function onLoadBalanceSheet(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $start_date=post_data('start_date');
                $end_date=post_data('end_date');
                $incomes=array();

                if(empty($start_date) && empty($end_date)){
                    $start_date=date('Y').'-01-01';
                    $end_date=date('Y').'-12-31';
                }

                //Asset
                $assets_type=$this->vm->get_accounts_category_types(array('type_group'=>'assets'),FALSE);

                if(!empty($assets_type)){
                    foreach ($assets_type as $key => $value) {
                        $assets[]=array(
                            'category_name'=>$value->type_name,
                            'category_id'=>$value->type_id,
                            'category_type'=>$value->type_group,
                            'category_amount'=>$this->vm->get_accounts_category_amount(array('category_id'=>$value->type_id,'category_type'=>$value->type_group,'start_date'=>$start_date,'end_date'=>$end_date))
                        );
                    }                
                }

                //Liabilities


                //Income

                $income_p_type=$this->vm->get_accounts_category_types(array('type_group'=>'income'),FALSE);

                if(!empty($income_p_type)){
                    foreach ($income_p_type as $key => $value) {
                        $income_types=$this->vm->get_accounts_category_data(array('category_type_id'=>$value->type_id),FALSE);

                        foreach ($income_types as $k => $v) {
                            $incomes[$value->type_name][]=array(
                                'category_name'=>$v->category_name,
                                'category_id'=>$v->category_id,
                                'category_amount_value'=>''
                            );
                        }
                    }                
                }


                //Expense

                $this->data['incomes']=$incomes;
                $return['html']=$this->theme->view('_pages/exm/vw_exms_accounts_balance_sheet_dyna',$this->data,true);

            }else{
                redirect($this->data['base_url']);
            }
        }else{
            redirect($this->data['base_url']);
        }
    }
}