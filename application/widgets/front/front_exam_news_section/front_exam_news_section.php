<?php


/**
 * 
 */
class Front_exam_news_section extends Widget
{

    function run($visible = FALSE,$exam_id=0) {
        $this->front_theme='default';
        $this->get_type(2);


        $segment_1=$this->uri->segment(1,0);    //Static Exam url
        $segment_2=$this->uri->segment(2,0);   //Stream
        $segment_3=$this->uri->segment(3,0);  //Exam Name

        $exam_data=array();

        $exams_data=$this->strm->_get_exam(array('exam_id'=>$exam_id));

        if(!empty($exams_data)){
            $news_type_data=$this->nm->_get_news_type(array('news_types_id'=>$exam_id,'news_types'=>'3'),FALSE);

            if(!empty($news_type_data)){
                foreach ($news_type_data as $key => $value) {

                    $news_slug=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$exam_id,'url_type'=>'news_article','url_type_id'=>$value->news_types_news_id));

                    //$news_banner_image=$this->sm->get_file(array('storage_id'=>$value->));
                    $news_data[]=array(
                        'news_short_title'=>$value->news_short_title,
                        'news_title'=>$value->news_title,
                        'news_image'=>($value->news_image_banner_url!=NULL)?$value->news_image_banner_url:'https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg',
                        'news_published'=>date('F d,Y',strtotime($value->created_at)),
                        'news_link'=>$news_slug->url_value
                    );
                }
            }
        }


        // if(is_string($segment_1) && $segment_1=='exams'){
        //     if(is_string($segment_2) && $segment_2!='0'){
        //         $stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_value'=>$segment_2));
        //         if(!empty($stream_slug)){
        //             if(is_string($segment_3) && $segment_3!='0'){
        //                 $exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_value'=>$segment_3));

        //                 //print_obj($exam_slug);die;
        //                 $slug_type_id=$exam_slug->slug_type_id;

        //                 $exams_data=$this->strm->_get_exam(array('exam_id'=>$slug_type_id));

        //                 if(!empty($exams_data)){
        //                     $news_type_data=$this->nm->_get_news_type(array('news_types_id'=>$slug_type_id,'news_types'=>'3'),FALSE);

        //                     if(!empty($news_type_data)){
        //                         foreach ($news_type_data as $key => $value) {

        //                             $news_slug=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$slug_type_id,'url_type'=>'news_article','url_type_id'=>$value->news_types_news_id));

        //                             //$news_banner_image=$this->sm->get_file(array('storage_id'=>$value->));
        //                             $news_data[]=array(
        //                                 'news_short_title'=>$value->news_short_title,
        //                                 'news_title'=>$value->news_title,
        //                                 'news_image'=>($value->news_image_banner_url!=NULL)?$value->news_image_banner_url:'https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg',
        //                                 'news_published'=>date('F d,Y',strtotime($value->created_at)),
        //                                 'news_link'=>$news_slug->url_value
        //                             );
        //                         }
        //                     }
        //                 }
        //             }                            
        //         }
        //     }
        // }


        $data['segment_1']=$segment_1;
        $data['segment_2']=$segment_2;
        $data['segment_3']=$segment_3;
        $data['exam_data']=$exams_data;
        $data['news_data']=$news_data;

        //print_obj($data);die;


        $data['exam_news']='';
        if ($visible) $this->render('front_exam_news_section',$data);
    }



	
	function run_old($visible = FALSE) {
		$this->front_theme='default';
    	$this->get_type(2);


        $segment_1=$this->uri->segment(1,0);    //Country
        $segment_2=$this->uri->segment(2,0);   //Static Exam url
        $segment_3=$this->uri->segment(3,0);  //Stream
        $segment_4=$this->uri->segment(4,0); //Exam Name

        $exam_data=array();


        if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2=='exams')){
            $country_data=$this->com->get_country(array('country_iso_code_2'=>strtoupper($segment_1)));
            if(!empty($country_data)){
                if(is_string($segment_3) && $segment_3!='0'){
                    $stream_slug=$this->sm->get_slug(array('slug_type'=>'3','slug_value'=>$segment_3));
                    if(!empty($stream_slug)){
                        if(is_string($segment_4) && $segment_4!='0'){
                            $exam_slug=$this->sm->get_slug(array('slug_type'=>'10','slug_value'=>$segment_4));

                            //print_obj($exam_slug);die;
                            $slug_type_id=$exam_slug->slug_type_id;

                            $exams_data=$this->strm->_get_exam(array('exam_id'=>$slug_type_id));

                            if(!empty($exams_data)){
                                $news_type_data=$this->nm->_get_news_type(array('news_types_id'=>$slug_type_id,'news_types'=>'3'),FALSE);

                                if(!empty($news_type_data)){
                                    foreach ($news_type_data as $key => $value) {

                                        $news_slug=$this->sm->get_slug_urls(array('url_sub_type'=>'exam_news_url','url_sub_type_id'=>$slug_type_id,'url_type'=>'news_article','url_type_id'=>$value->news_types_news_id));

                                        //$news_banner_image=$this->sm->get_file(array('storage_id'=>$value->));
                                        $news_data[]=array(
                                            'news_short_title'=>$value->news_short_title,
                                            'news_title'=>$value->news_title,
                                            'news_image'=>($value->news_image_banner_url!=NULL)?$value->news_image_banner_url:'https://static.waytoadmissions.com/data/app/app_data/pageBnr.jpg',
                                            'news_published'=>date('F d,Y',strtotime($value->created_at)),
                                            'news_link'=>$news_slug->url_value
                                        );
                                    }
                                }
                            }
                        }                            
                    }
                }
            }
        }


        $data['segment_1']=$segment_1;
        $data['segment_2']=$segment_2;
        $data['segment_3']=$segment_3;
        $data['segment_4']=$segment_4;
        $data['exam_data']=$exams_data;
        $data['news_data']=$news_data;

        //print_obj($data);die;


    	$data['exam_news']='';
        if ($visible) $this->render('front_exam_news_section',$data);
    }
}