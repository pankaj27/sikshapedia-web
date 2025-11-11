<?php


/**
 * 
 */
class Front_coupons_list_section extends Widget
{
    function run($visible = FALSE,$length=90,$start=0){
        $this->front_theme='default';
        $this->get_type(2);

        $_coupons=array();

        $current_date=date('Y-m-d');

        $param['column_order'] = array(
            'coupon_id'                    
        );

        $param['column_search'] = array('coupon_store ');
        $param['order'] = array('coupon_id' => 'ASC');
        $post['length']=$length;
        $post['start']=$start;

        $coupons=$this->coup->_get_coupons($post,$param);

        if(!empty($coupons)){
            foreach ($coupons as $key => $value) {

                $datetime1 = date_create($current_date);
                $datetime2 = date_create($value->coupon_end_date);
                $interval = date_diff($datetime1,$datetime2);
                $interval= $interval->format('%h')." hrs. ".$interval->format('%i')." mins.";

                $coupon_or_deal=($value->coupon_code!=null)?'Coupon':'Deal';

                if(session_userdata('isUserLoggedin') && session_userdata('user_id')){
                    $coupon_button_link='<a href="'.$value->coupon_smartlink.'" target="_blank" class="getBtn">Get the '.$coupon_or_deal.' now</a>';
                }else{
                    // $coupon_button_link='<button type="button" data-toggle="modal" data-target="#registercdmModal" class="getBtn">Signup to Get the '.$coupon_or_deal.' now</button>';

                    $coupon_button_link='<a href="'.base_url('signup/student').'" class="getBtn">Get the '.$coupon_or_deal.' now</a>';
                }

                $_coupons[]=array(
                    'coupon_title'=>$value->coupon_title,
                    'coupon_offer_text'=>$value->coupon_offer_text,
                    'coupon_description'=>$value->coupon_description,
                    'coupon_code'=>$value->coupon_code,
                    'coupon_featured'=>$value->coupon_featured,
                    'coupon_offer'=>$value->coupon_offer,
                    'coupon_offer_value'=>$value->coupon_offer_value,
                    'coupon_offer'=>($value->coupon_offer=='Price-Off')?$value->coupon_offer_value.' off':$value->coupon_offer_value.' off',
                    'coupon_start_date'=>date('F,d,Y',strtotime($value->coupon_start_date)),
                    'coupon_end_date'=>date('F,d,Y',strtotime($value->coupon_end_date)),
                    'coupon_interval'=>$interval,
                    'coupon_image'=>(!empty($value->coupon_image))?$value->coupon_image:base_url().'uploads/app/default/no.jpg',
                    'coupon_is_inner'=>$value->coupon_is_inner,
                    'is_coupon_or_deals'=>($value->coupon_code!=null)?'Coupon':'Delas',
                    'coupon_button_link'=>$coupon_button_link
                );
            }

            //print_obj($_coupons);die;
        }

        $data['coupons']=$_coupons;



        if ($visible) $this->render('front_coupons_list_section',$data);

    }

}