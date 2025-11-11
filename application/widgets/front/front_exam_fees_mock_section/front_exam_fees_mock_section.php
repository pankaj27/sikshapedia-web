<?php


/**
 * 
 */
class Front_exam_fees_mock_section extends Widget
{
	
	function run($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);

        $segment_1=$this->uri->segment(1,0);    //Country
        $segment_2=$this->uri->segment(2,0);   //Static Exam url
        $segment_3=$this->uri->segment(3,0);  //Stream
        $segment_4=$this->uri->segment(4,0); //Exam Name

        $fees_data=array();
        $mock_papers=array();

        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='exams')){
            $country_data=$this->com->get_country(array('country_iso_code_2'=>strtoupper($segment_1)));
            if(!empty($country_data)){

                $currency=$this->com->get_currency(array('currency_id'=>$country_data->country_currency));
                if(is_string($segment_3) && $segment_3!='0'){
                    $stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_value'=>$segment_3));
                    if(!empty($stream_slug)){
                        if(is_string($segment_4) && $segment_4!='0'){
                            $exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_value'=>$segment_4));
                            //print_obj($exam_slug);die;
                            $slug_type_id=$exam_slug->slug_type_id;

                            $exam_fees_mock_data=$this->strm->get_exam_fees_structre(array('fees_exam_id'=>$slug_type_id),FALSE);

                            if(!empty($exam_fees_mock_data)){
                                foreach ($exam_fees_mock_data as $key => $value) {

                                    $news_slug=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$slug_type_id,'url_type'=>'news_article','url_type_id'=>$value->news_types_news_id));

                                    //$news_banner_image=$this->sm->get_file(array('storage_id'=>$value->));

                                    $fees_data[]=array(
                                        'fees_currency'=>(!empty($currency) && !is_null($currency->currency_symbol_left))?$currency->currency_symbol_left:$currency->currency_symbol_right,
                                        'fees_currency_format'=>(!empty($currency) && !is_null($currency->currency_symbol_left))?'left':'right',
                                        'fees_value'=>$value->fees_structure_value,
                                        'fees_category'=>$value->quota_name
                                    );
                                }
                            }


                            $sample_mocke_papers=$this->sm->get_user_file(array('user_storage_type'=>'sample_mockt_test_paper','user_file_type'=>'10','user_file_type_id'=>$slug_type_id));

                            if(!empty($sample_mocke_papers)){
                                foreach ($sample_mocke_papers as $key => $value) {
                                    $mock_papers[]=array(
                                        'mock_file'=>$value->media_disk_path_relative,
                                        'mock_file_name'=>'',
                                        'mock_file_date'=>date('Y',strtotime($value->created_at))
                                    );
                                }
                            }
                        }                            
                    }
                }
            }
        }

        $data['fees_data']=$fees_data;
        $data['mock_file_data']=$mock_papers;

        //print_obj($data);die;

    	//$data['exam_news']='';
        if ($visible) $this->render('front_exam_fees_mock_section',$data);
    }
}