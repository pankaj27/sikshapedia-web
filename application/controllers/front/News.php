<?php defined('BASEPATH') OR exit('No direct script access allowed');



/**
 * 
 */
class News extends BaseFrontController
{
	public function indexold(){

		$segment_1=$this->uri->segment(1,0);//country
		$segment_2=$this->uri->segment(2,0);//news


		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_1) && $segment_1!='news')){
			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));
			if(!empty($country_data)){
				$segment_2_slug=$this->sm->get_slug(array('slug_value'=>$segment_2));
				if(!empty($segment_2_slug) && $segment_2_slug->slug_value='news'){
					$page_title=$this->data['page_title'];


					$breadcumb=array(
						'HOME'=>base_url(),
						'Latest News'=>''
					);

					$this->data['news_page']=array(
						'news_page_heading'=>$this->data['page_title'],
						'news_breadcumb'=>$breadcumb
					);

					$_exam_news=array();

					$exam_news=$this->nm->__get_news(array('news_type'=>'3','is_published'=>'1'));

					if(!empty($exam_news)){
						foreach ($exam_news as $key => $value) {
							$news_slug=$this->sm->get_slug_urls(array('url_type'=>'news_article','url_type_id'=>$value->news_id));
							$_exam_news[]=array(
								'exam_news_short_title'=>$value->news_title,
								'exam_news_image'=>$value->news_image_banner_url,
								'exam_news_published_day'=>date('d',strtotime($value->created_at)),
								'exam_news_published_month'=>date('M,Y',strtotime($value->created_at)),
								'exam_news_desc'=>$value->news_title,
								'exam_news_link'=>(!empty($news_slug))?$news_slug->url_value:base_url()
							);
						}
					}

					$_college_news=array();

					$college_news=$this->nm->__get_news(array('system_news_type_data.news_types'=>'1','system_news.is_published'=>'1'),TRUE);



					if(!empty($college_news)){
						foreach ($college_news as $key => $value) {
							$news_slug=$this->sm->get_slug_urls(array('url_type'=>'news_article','url_type_id'=>$value->news_id));
							$_college_news[]=array(
								'college_news_short_title'=>$value->news_title,
								'college_news_image'=>$value->news_image_banner_url,
								'college_news_published_day'=>date('d',strtotime($value->created_at)),
								'college_news_published_month'=>date('M,Y',strtotime($value->created_at)),
								'college_news_desc'=>$value->news_title,
								'college_news_link'=>(!empty($news_slug))?$news_slug->url_value:base_url()
							);
						}
					}

					//print_obj($_college_news);die;

					$this->data['exam_news']=$_exam_news;
					$this->data['college_news']=$_college_news;

					$view_page='webpage/others/vw_news';

				}else{
					$page_title='404 Not Found';
					$view_page='notfound/vw_notfound';
				}
			}else{
				$page_title='404 Not Found';
				$view_page='notfound/vw_notfound';
			}
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	
	}

	public function index(){

		$segment_1=$this->uri->segment(1,0);//news


		if((is_string($segment_1) && $segment_1=='news')){
			$segment_1_slug=$this->sm->get_slug(array('slug_value'=>$segment_1));
				if(!empty($segment_1_slug) && $segment_1_slug->slug_value='news'){
					$page_title=$this->data['page_title'];


					$breadcumb=array(
						'HOME'=>base_url(),
						'Latest News'=>''
					);

					$this->data['news_page']=array(
						'news_page_heading'=>$this->data['page_title'],
						'news_breadcumb'=>$breadcumb
					);

					$_exam_news=array();

					$exam_news=$this->nm->__get_news(array('news_type'=>'3','is_published'=>'1'));

					if(!empty($exam_news)){
						foreach ($exam_news as $key => $value) {
							$news_slug=$this->sm->get_slug_urls(array('url_type'=>'news_article','url_type_id'=>$value->news_id));
							$_exam_news[]=array(
								'exam_news_short_title'=>$value->news_title,
								'exam_news_image'=>$value->news_image_banner_url,
								'exam_news_published_day'=>date('d',strtotime($value->created_at)),
								'exam_news_published_month'=>date('M,Y',strtotime($value->created_at)),
								'exam_news_desc'=>$value->news_title,
								'exam_news_link'=>(!empty($news_slug))?$news_slug->url_value:base_url()
							);
						}
					}

					$_college_news=array();

					$college_news=$this->nm->__get_news(array('system_news_type_data.news_types'=>'1','system_news.is_published'=>'1'),TRUE);



					if(!empty($college_news)){
						foreach ($college_news as $key => $value) {
							$news_slug=$this->sm->get_slug_urls(array('url_type'=>'news_article','url_type_id'=>$value->news_id));
							$_college_news[]=array(
								'college_news_short_title'=>$value->news_title,
								'college_news_image'=>$value->news_image_banner_url,
								'college_news_published_day'=>date('d',strtotime($value->created_at)),
								'college_news_published_month'=>date('M,Y',strtotime($value->created_at)),
								'college_news_desc'=>$value->news_title,
								'college_news_link'=>(!empty($news_slug))?$news_slug->url_value:base_url()
							);
						}
					}

					//print_obj($_college_news);die;

					$this->data['exam_news']=$_exam_news;
					$this->data['college_news']=$_college_news;

					$view_page='webpage/others/vw_news';

				}else{
					$page_title='404 Not Found';
					$view_page='notfound/vw_notfound';
				}
		}else{
			$page_title='404 Not Found';
			$view_page='notfound/vw_notfound';
		}

		$this->theme->title($this->data['page_title'])->load($view_page, $this->data);	
	}


	public function indexNewsPage(){
		$segment_1=$this->uri->segment(1,0); //news
		$segment_2=$this->uri->segment(2,0); //news

		if((is_string($segment_1) && $segment_1==='news')){

			$news_slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2,'slug_type'=>'11'));

			if(!empty($news_slug_found)){

				//print_obj($news_slug_found);die;

				$news_id=$news_slug_found->slug_type_id;

				$this->data['news_id']=$news_id;

				$this->theme->title($this->data['page_title'])->load('webpage/others/vw_news_details', $this->data);

			}else{
				redirect(base_url());
			}

		}else{
			redirect(base_url());
		}
	}


	public function indexNewsPageOld(){
		$segment_1=$this->uri->segment(1,0); //country
		$segment_2=$this->uri->segment(2,0); //college,university url
		$segment_3=$this->uri->segment(3,0); //news
		$segment_4=$this->uri->segment(4,0); //news

		//echo decode_data($this->data['current_url']);


		// echo $segment_1.'<br>'.$segment_2.'<br>'.$segment_3.'<br>'.$segment_4.'<br>'.$segment_5;

		//print_obj($this->data['slug_data']);die;

		if((is_string($segment_1) && $segment_1!='0') && (is_string($segment_2) && $segment_2!='0') && (is_string($segment_3) && $segment_3=='news') && (is_string($segment_4) && $segment_4!='0')){

			$country_data=$this->com->get_country(array('country_iso_code_2'=>$segment_1));

			print_obj($country_data);die;

			if(!empty($country_data)){
				$slug_found=$this->sm->get_slug(array('slug_value'=>$segment_2));//College slug

				if(!empty($slug_found)){

					$slug_type=$slug_found->slug_type;
					$slug_type_id=$slug_found->slug_type_id;


					if($slug_type=='6'){ //university
					}else if($slug_type=='7'){ //college

						$news_slug_found=$this->sm->get_slug(array('slug_value'=>$segment_4,'slug_type'=>'11'));//College slug

						//print_obj($news_slug_found);die;

						if(!empty($slug_found)){
							$college_data=$this->im->get_college_profile_data(array('college_user_id'=>$slug_type_id));

							$_news_data=$this->nm->get_news(array('news_id'=>$news_slug_found->slug_type_id));

							if(!empty($_news_data)){
								$news_details=$this->nm->get_news_data(array('news_id'=>$news_slug_found->slug_type_id),FALSE);

								
							}else{

							}

							$this->data['news_details_data']=array(
								'news_data'=>$_news_data,
								'news_details'=>$news_details
							);

							$this->theme->title($this->data['page_title'])->load('webpage/others/vw_news_details', $this->data);	
						}else{
							redirect(base_url());
						}	
					}

				}else{
					redirect(base_url());
				}
			}else{
				redirect(base_url());
			}
		}else{
			redirect(base_url());
		}
	}
}