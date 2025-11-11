<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Coupon extends BaseAdminController
{
    function __construct()
    {
        parent::__construct();
    }

    function index(){

        //$this->cwebp->getCommand();die;


        if(session_userdata('isAdminLoggedin')){

            $this->data['page_title']='Coupons';

            $this->theme->title($this->data['page_title'])->load('coupons/vw_coupons', $this->data);
        }else{
            redirect($this->data['admin_base_url']);
        }
    }


    public function onSearchCoupons(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $param['column_order'] = array(
                    'coupon_id'                    
                );

                $param['column_search'] = array('coupon_store ');
                $param['order'] = array('coupon_id' => 'ASC');
                $posts=$this->input->post();

                

                $list = $this->coup->_get_coupons($posts,$param,FALSE,FALSE);

                //print_obj($list);die;

                $data = array();
                $no = isset($posts['start'])?$posts['start']:0;

                $action='';

                foreach ($list as $listing){
                    $no++;

                    $row = array();

                    if($listing->coupon_status=='active'){
                        $status='<span class="btn btn-sm btn-success">Active</span>';
                    }else{
                        $status='<span class="btn btn-sm btn-success">Deactive</span>';
                    }

                    $action='<div class="btn-group btn-group-xs">
                    <a href="'.$this->data['admin_base_url'].'coupons/add/'.encode_data($listing->coupon_id).'" class="btn btn-sm btn-primary">View</a>
                    <button type="button" class="btn btn-sm btn-dark btn_del_ads" data-aid="'.encode_data($listing->coupon_id).'">Delete</button>
                    </div>';
                    $row[]  =   $listing->coupon_id;

                    if($listing->coupon_image!=''){
                        $row[]  =   '<img src="'.$listing->coupon_image.'" width="100%" height="auto" style="border-radius:0;">';
                    }else{
                        $row[]  =   $listing->coupon_store;
                    }

                    $row[]  =   $listing->coupon_offer_text;
                    $row[]  =   $listing->coupon_store;
                    $row[]  =   $listing->coupon_code;
                    
                    $row[]  =   date('d-m-Y',strtotime($listing->coupon_start_date)).' to '.date('d-m-Y',strtotime($listing->coupon_end_date));
                   // $row[]  =   $action;                        

                    $data[] = $row;

                }

                $output = array(
                    "draw" => isset($posts['draw'])?$posts['draw']:'',
                    "recordsTotal" => $this->coup->_get_coupons($posts,$param,TRUE),
                    "recordsFiltered" => $this->coup->_get_coupons($posts,$param,TRUE),
                    "data" => $data,
                );

                //print_obj($output);die;
                
                echo json_encode($output);

            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }



    public function onImportCoupons(){
        if(session_userdata('isAdminLoggedin')==TRUE && session_userdata('admin_id')){
            if($this->input->is_ajax_request() && $this->input->server('REQUEST_METHOD')=='POST'){

                $user_id=session_userdata('admin_id');

                $API_KEY = '97f3ecf9282d01579bf22adcc3ef1e86';

                $param['url']='http://feed.linkmydeals.com/getOffers/?API_KEY='.$API_KEY.'&format=json';

                $json=curl_get($param);

                if(!empty($json)){
                    $j=json_decode($json['response']);

                    if($j->result=='1' && !empty($j->offers)){

                        $current_time_stamp=strtotime(date('Y-m-d H:i:s'));

                        foreach ($j->offers as $key => $value) {

                            // if($value->category_array!=null){
                            //     foreach ($value->category_array as $k => $v) {
                            //         $cat_found=$this->coup->get_coupon_categories_data(array('category_name'=>$k));
                            //         if(empty($cat_found)){
                            //             $parent_id=$this->coup->store_coupon_categories_data(array('parent_id'=>'0','category_name'=>$k));

                            //             if(!empty($v)){
                            //                 foreach ($v as $_k => $_v) {
                            //                     $sub_cat_found=$this->coup->get_coupon_categories_data(array('category_name'=>$_v));
                            //                     if(empty($sub_cat_found)){
                            //                          $this->coup->store_coupon_categories_data(array('parent_id'=>$parent_id,'category_name'=>$_v));   
                            //                     }
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }

                            if($value->image_url!=''){
                                $image_url=$value->image_url;
                            }else{
                                $image_url='https://static.waytoadmissions.com/data/coupons/'.$value->store.'.webp';
                            }

                            $data_to_store[]=array(
                                'coupon_custom_id'=>$value->lmd_id,
                                'coupon_service_provider'=>'linkmydeals.com',
                                'coupon_store'=>$value->store,
                                'coupon_merchant_url'=>$value->url,
                                'coupon_offer_text'=>$value->offer_text,
                                'coupon_offer_value'=>$value->offer_value,
                                'coupon_title'=>$value->title,
                                'coupon_description'=>$value->description,
                                'coupon_code'=>$value->code,
                                'coupon_terms'=>$value->terms_and_conditions,
                                'coupon_categories'=>$value->categories,
                                'coupon_featured'=>$value->featured,
                                'coupon_smartlink'=>$value->smartLink,
                                'coupon_image'=>$image_url,
                                'coupon_type'=>$value->type,
                                'coupon_offer'=>$value->offer,
                                'coupon_status'=>$value->status,
                                'coupon_start_date'=>$value->start_date,
                                'coupon_end_date'=>$value->end_date,
                                'coupon_is_inner'=>'no',
                                'coupon_created_by'=>$user_id,
                                'coupon_timestamp'=>$current_time_stamp
                            );
                        }

                        $added=$this->coup->store_coupons_data($data_to_store,TRUE);

                        if($added){
                            $this->coup->store_coupons_synced_data(array('synced_provider'=>'linkmydeals.com','synced_last_time'=>$current_time_stamp));

                            $return['success']='Data imported';
                        }else{
                            $return['error']='data not imported';
                        }
                    }else{
                        $return['error']='Data not found';
                    }                    
                    
                }else{
                    $return['error']='No data returned';
                }


                header('Content-Type: application/json; charset=utf-8');

                echo json_encode($return);


            }else{
                redirect($this->data['admin_base_url']);
            }
        }else{
            redirect($this->data['admin_base_url']);
        }
    }





    public function index0(){
        if(session_userdata('isAdminLoggedin')){

            $user_id=decode_data(session_userdata('admin_id'));
               $param['url']='http://feed.linkmydeals.com/getOffers/?API_KEY=97f3ecf9282d01579bf22adcc3ef1e86&format=json';

               $json=curl_get($param);

               print_obj($json);die;

                $j=json_decode($json['response']);

                print_obj($j);die;

                if(!empty($j)){

                    foreach ($j as $key => $value) {

                        if(!empty($value->category_array)){
                            //$categories=char_separated_to_array($value->categories);

                            // foreach ($categories as $k => $v) {
                            //     // code...
                            // }

                            print_obj($value->category_array);



                        }                        


                        // $data_to_store[]=array(
                        //     'coupon_custom_id'=>$value->lmd_id,
                        //     'coupon_store'=>$value->store,
                        //     'coupon_merchant_url'=>$value->url,
                        //     'coupon_offer_text'=>$value->offer_text,
                        //     'coupon_offer_value'=>$value->offer_value,
                        //     'coupon_title'=>$value->title,
                        //     'coupon_description'=>$value->description,
                        //     'coupon_code'=>$value->code,
                        //     'coupon_terms'=>$value->terms_and_conditions,
                        //     'coupon_featured'=>$value->featured,
                        //     'coupon_smartlink'=>$value->smartLink,
                        //     'coupon_image'=>$value->image_url,
                        //     'coupon_type'=>$value->type,
                        //     'coupon_offer'=>$value->offer,
                        //     'coupon_status'=>$value->status,
                        //     'coupon_start_date'=>$value->start_date,
                        //     'coupon_end_date'=>$value->end_date,
                        //     'coupon_created_by'=>$user_id
                        // );
                    }

                    //$this->coup->store_coupons_data($data_to_store);

                }

               // print_obj($j);die;
        }else{
            redirect($this->data['admin_base_url']);
        }
            
    }


    public function index2(){

        // ========== CONFIG ==========
        $API_KEY = '97f3ecf9282d01579bf22adcc3ef1e86'; // Enter your API Key or use API Key from Demo account for testing/development
        $incremental = true;
        $last_extract_datetime = ''; // Ideally leave this blank. Populate only if you want to override last extract time stored in the system
        $format = 'json';
        $off_record= false; // If set to true, system will not update your last extract time. This is useful for debugging pupose. Please note, this will still count in your API Usage limit

        // ========== CALL API ==========
        $last_extract = (empty($last_extract_datetime) ? '' : strtotime($last_extract_datetime) );

        $feed = file_get_contents('http://feed.linkmydeals.com/getOffers/?API_KEY='.$API_KEY.'&incremental='.$incremental.'&last_extract='.$last_extract.'&format='.$format.'&off_record='.$off_record);

        // ========== PROCESS JSON RESPONSE ==========
        $response = json_decode($feed,true);
        $offers = $response['offers'];

        print_obj($offers);

        foreach($offers as $offer) {
            
            if($offer['status'] == 'new') {
                
                // Write Code here to insert the offer in your database
                
            } elseif($offer['status'] == 'updated') {
                
                // Write Code here to update all fields in the offer
                
            } elseif($offer['status'] == 'suspended') {
                
                // Write Code here to delete the offer in your database
                
            }
            
        }

    }
}