<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec overlayBnr">
  <img src="<?php echo $college_data['college_banner'];?>" class="headerBnrImg" alt="<?php echo $college_data['college_formatted_name'];?>" draggable="false">
  <div class="wrapper">
    <div class="headerBnrPanel">
      <div class="bnrThumbBox">
        <div class="bnrThumb shadow bg-white"><img src="<?php echo $college_data['college_logo'];?>" alt="<?php echo $college_data['college_formatted_name'];?>"title="<?php echo $college_data['college_formatted_name'];?>"  loading="lazy" draggable="false"></div>
        <div class="bnrThumbCon pt-2">
          <nav aria-label="breadcrumb" class="bnrThumbCon_breadcrumb_section">
            <ol class="breadcrumb p-0 bg-none mb-1">
              <?php
              foreach ($college_data['college_breadcrumb'] as $key => $value) {
                ?>
                <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                  <?php
                  if(!empty($value)){
                    ?>
                    <a href="<?php echo $value;?>"><strong><?php echo $key;?></strong></a>
                    <?php
                  }else{
                    echo $key;
                  }
                  ?>
                </li>
                <?php
              }
              ?>
            </ol>
          </nav>
          <h1 class="m-0 bnrTitle text-truncate text-uppercase w-75 font-weight-bolder"><?php echo $college_data['college_formatted_name'];?></h1>
          <div class="m-0  d-lg-flex  justify-content-between tagLists w-75">
            <div class="text-white text-capitalize font-weight-semi text-md text-truncate tags">
              <span class="mobile_span_address"><i class="fas fa-map-marker-alt"></i><span class="mobile_span_c_name" style="margin-left:5px;"><?php echo $college_data['college_city'];?>,<?php echo $college_data['college_state'];?></span> </span>

              <?php
              if(!empty($college_data['college_affiliations'])){
                ?>
                <span class="mobile_span"><i class="fas fa-bookmark"> </i> <span style="margin-left:5px;"><?php echo $college_data['college_affiliations'];?></span> </span> 
                <?php
              }

              ?>

              <span class="mobile_span"><i class="fas fa-thumbtack"></i> <span style="margin-left:5px;">ESTD <?php echo $college_data['college_estd'];?></span> </span> 
              <?php

              if(!empty($college_data['college_university'])){
                ?>
                <span class="mobile_span"><i class="fas fa-flag"></i> <span style="margin-left:5px;"><?php echo $college_data['college_university'];?></span></span>
                <?php
              }

              ?>

              
              
              <span class="mobile_span"><i class="fas fa-star"> </i> <?php echo $college_data['college_type'];?> </span> 
              <!-- <span><i class="fas fa-tags"> </i>  10 QUESTIONS </span> 
              <span><i class="fas fa-tags"> </i>  ANSWERED </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> --> 
            </div>
            <!-- <div class="pl-2"><a href="">  MORE </a></div>  -->
          </div>
        </div>

      </div>
      <div class="headerBnrCon d-md-block headerBnrCon_section" style="width:240px;" >
        <!-- <button type="button" class="btn btn-outline-light btnContact font-weight-bolder contact-link" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-clogo="<?php echo $college_data['college_logo'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>" id="">ADMISSION PREDICTOR</button> -->

        <!-- <div class="" style="margin-right:10px;">
          <button type="button" class="btnFavorite btn_shortlist active" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>"></button>
        </div> -->
        <div class="" style="margin-left:40px;">
          <button type="button" class="btn btn-outline-light btnContact font-weight-bolder contact-link" data-cname="<?php echo $college_data['college_name'];?>,<?php echo $college_data['college_city'];?>" data-inst="<?php echo $college_data['college_id'];?>" data-inst_type="<?php echo $college_data['institute_type'];?>" data-clogo="<?php echo $college_data['college_logo'];?>" data-cphcode="<?php echo $college_data['college_country_phone_code'];?>" data-cou="<?php echo $college_data['college_country_id'];?>" id="btn_get_contact_details" style="width:200px;">GET CONTACT DETAILS</button>

        </div>
            
        <div class="ratingBox ">
            <div class="points">0</div>
            <div class="reviewStars">
              <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div>
              <div class="reviewCounts">0 REVIEWS</div>
            </div>
        </div>
  
        
            
        <a href="<?php echo $college_data['college_claim_url'];?>" class="btn btn-outline-light btnContact text-white pl-2" style="width:200px;margin-left:40px;cursor: pointer !important;"> <i class="fas fa-dot-circle text-warning pals" ></i>  Claim This College</a>


      </div>
     
    </div>
  </div>
</section>

<?php
if(!empty($college_data['college_inner_menues'])){
    ?>
    <section class="tabSliderSec">
          <div class="swiper-container tabSlider navTabSlider">
            <div class="swiper-wrapper">
              <?php
              foreach ($college_data['college_inner_menues'] as $key => $value) {
               ?>
               <a href="<?php echo $value['menu_link'];?>" class="swiper-slide navLink <?php echo ($value['menu_default_active']!='')?$value['menu_default_active']:$value['menu_active'];?> text-nowrap false nav-item d-inline-block text-capitalize font-weight-bold text-secondary text-base pt-4 pb-3"> <?php echo $value['menu_name'];?> </a>
               <?php
              }
              ?>
            </div>
            <div class="swiper-button-next swiper-button-white"></div>
            <div class="swiper-button-prev swiper-button-white"></div>
          </div>
    </section>
    <?php
}
?>

<section class="pageDetailsSec py-4">
	<div class="wrapper">
		<div class="row">      
			<div class="col-lg-9 mb-4 mb-lg-0">
				<?php

           

		        if(!empty($college_data['college_menu_widgets'])){
		          foreach ($college_data['college_menu_widgets'] as $key => $value) {
                //echo $value;

                if($value=='front_news_brief_section'){
                  ?>
                  <div class="adBlock front_news_brief_section_ads">                 
                    <ins class="adsbygoogle"
                         style="display:block; text-align:center;"
                         data-ad-layout="in-article"
                         data-ad-format="fluid"
                         data-ad-client="ca-pub-9545373166119354"
                         data-ad-slot="7938121262"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                  </div>
                  <?php
                }


		            $this->widget->run($value,TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id'],'college_info_type'=>$college_data['college_user_type']]);
		          }
		        }

         

            if(!empty($college_data['college_url_widgets'])){

              

              foreach ($college_data['college_url_widgets'] as $key => $value) {
                if($value!='front_wayto_rating_section'){
                   $this->widget->run($value,TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id'],'college_info_type'=>$college_data['college_user_type']]);
                }
               
              }
            }
		        ?>
			</div>
     
			<div class="col-lg-3 mb-4 mb-lg-0">
        <div id="non_floatng_apply_section">
          <?php $this->widget->run('front_apply_single_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        </div>
        <?php $this->widget->run('front_college_same_group_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        <?php $this->widget->run('front_top_course_side_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        <?php $this->widget->run('front_exams_side_section',TRUE ,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        <?php $this->widget->run('front_courses_side_section',TRUE , ['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        <?php $this->widget->run('front_gallery_side_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?> 

        <?php $this->widget->run('front_faculties_side_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        <?php $this->widget->run('front_placement_side_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
        
        
        <?php $this->widget->run('front_news_side_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>

        
      </div>

      <div id="floatng_apply_section" class="col-lg-12">
        <?php $this->widget->run('front_apply_single_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id']]);?>
      </div>
		</div>
	</div>
</section>

<?php $this->widget->run('front_subscription_section',TRUE,['country_id'=>$college_data['college_country_id'],'college_id'=>$college_data['college_id'],'college_info_type'=>'1']);?>



<style type="text/css">
  .iconLinkBox .boxIcon svg{
   width:65px !important;
  }

  .boxContent{
    font-size: 13px !important;
  }
</style>


<script type="text/javascript">var wbpage='inst_web_page'; var page='college_page';var _vtype='';</script>

<script type="text/javascript">var _cid='<?php echo $college_data['college_user_id'];?>';var _co='<?php echo $college_data['college_country_id'];?>';var _cot='<?php echo $college_data['college_city_country_id'];?>';var _cotcod='<?php echo $college_data['country_iso_code_4'];?>';var _cit='<?php echo $college_data['college_city_id'];?>';var _st='<?php echo $college_data['college_city_state_id'];?>';var page='';var _c='';var _ct='';var _vtype='COLLEGE';let _vip='<?php echo $this->input->ip_address();?>';var _strm='';;var _cu='';</script>