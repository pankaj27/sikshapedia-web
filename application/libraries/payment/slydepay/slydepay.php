<?php
defined('BASEPATH') OR exit('No direct script access allowed');



class Slydepay{


	public $params=array();


	public function confirm_payment(){

	}

	protected function generate_paytoken(){

		if(!empty($this->params) && is_array($this->params)){

			$amount=$this->params['item_amount'];
			$orderCode= $this->params['item_order_code']; 
			$itemCode=$this->params['item_code'];
			$itemName=$this->params['item_name'];
			$unitPrice=$this->params['item_unit_price'];
			$quantity=$this->params['item_quantity'];
			$subTotal=$this->params['item_sub_total'];

			$p='{
				"emailOrMobileNumber":"fatherlaz@gmail.com",
				"merchantKey":"1583684374556",
				"amount":"'.$amount.'",
				"orderCode":"'.$orderCode.'",
				"orderItems":[
					{
						"itemCode":"'.$itemCode.'",
						"itemName":"'.$itemName.'",
						"unitPrice":'.$unitPrice.',
						"quantity":'.$quantity.',
						"subTotal":'.$subTotal.'
					}
				]
			}';

			$post_data=array(
				'url'=>'https://app.slydepay.com.gh/api/merchant/invoice/create',
				'data'=>$p,
				'headers'=>array(
				   "cache-control: no-cache",
				   "content-type: application/json",
				)
			);

			$response=curl_post($post_data,FALSE);

			if(isset($response['success'])){
				$j=json_decode($response['success']);
			 	if($j->success==true){
			 		$return['pay_token']='https://app.slydepay.com/invoicing/slydepay/'.$j->result->payToken;
			 	}else{
			 		$return['pay_token']='';
			 	}
			}else{
			 	$return['error']=$response['errors'];
			}

		}else{
			$return['error']='Function parameters not given';
		}

		return json_encode($return);
	}

}