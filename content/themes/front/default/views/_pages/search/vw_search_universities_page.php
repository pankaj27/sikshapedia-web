<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="bradcumSec bg-white py-2">
  <div class="wrapper">
    <div class="row">
      <div class="col-md-12 ">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-white m-0 pl-0">
            <?php
            if(!empty($breadcumb)){
              foreach ($breadcumb as $key => $value) {
                ?>
                <li class="breadcrumb-item <?php echo ($value=='')?'active':'';?>" <?php echo ($value=='')?'aria-current="page"':'';?>>
                  <?php echo ($value!='')?'<a href="'.$value.'">'.$key.'</a>':$key;?>
                  </li>
                <?php
              }
            }
            ?>
            </ol>
        </nav>
      </div>
      <div class="col-md-12 mb-2">
          <h4 class="m-0 text-center text-md-left"><?php echo $page_inner_title;?></h4>
      </div>    
    </div>

    <?php
    if(!empty($top_ads_data)){
      ?>
        <div class="adBlock ">
         <div class="bodyslot bodyslot-dynamic clearfix"><div class="ads_body_banner_container clearfix" wfd-id="7974"><a href="<?php echo $top_ads_data['ads_link'];?>" target="_blank" rel="nofollow"><img src="<?php echo $top_ads_data['ads_image'];?>"></a></div>
         </div>
        </div>
      <?php
    }
    ?>    
  </div>
</section>

<main class="isa-main-content">
    <div class="isa-tab-filter-wrapper">
        <div class="row no-gutters">
          <div class="col-md-8">
            <div class="filterBlock d-none d-md-flex flex-wrap align-items-center">                
              <?php
              if(!empty($top_states)){
                ?>
                <span class="blockTitle">SELECT STATE </span>
                <?php
                foreach ($top_states as $key => $value) {
                  ?>
                  <a href="<?php echo $value['access_url'];?>" class="<?php echo $value['selected'];?>"><?php echo $value['state_name'];?> <span>(<?php echo $value['total_colleges'];?>)</span></a>
                  <?php
                }
              }

              if(!empty($top_cities)){
                ?>
                <span class="blockTitle">SELECT CITY </span>
                <?php
                foreach ($top_cities as $key => $value) {
                  ?>
                  <a href="<?php echo $value['access_url'];?>" class="<?php echo $value['selected'];?>"><?php echo $value['city_name'];?></a>
                  <?php
                }
              }
              ?>
            </div>

          </div>
          <div class="col-md-4">
            <div class="isa-tab-filter">
              <ul class="">
                  <li class="placeholder"> <a href="#0">Sort By</a></li> 
                  <li class="filter"><a class="selected" data-type="popularity" href="#0" >Popularity</a></li>
                  <li class="filter"><a href="#0" data-type="reviews_rating">Reviews Rating </a></li>
                  <li class="filter"><a href="#0"data-type="fees">Fees</a></li>
              </ul>
          </div>
          </div>
        </div>
        
       <!--  <div class="border-top py-2">
            <div class="filterBlock d-flex flex-wrap align-items-center">
              <span class="blockTitle">SELECT COLLEGE CATEGORY </span>  
              <a href="#" class="btn btn-outline-primary"> IIT (23) </a> 
              <a href="#" class="btn btn-outline-primary">  NIT (31)</a>
              <a href="#" class="btn btn-outline-primary"> IIM (20) </a> 
              <a href="#" class="btn btn-outline-primary"> AIIMS (12) </a> 
              <a href="#" class="btn btn-outline-primary"> IIIT (28) </a> 
            </div>
        </div>
        <div class="border-top py-2">
            <div class="filterBlock d-flex flex-wrap align-items-center">
              <span class="blockTitle">SELECT COLLEGE CATEGORY </span>  
              <a href="#" class="btn btn-outline-primary"> IIT (23) </a> 
              <a href="#" class="btn btn-outline-primary">  NIT (31)</a>
              <a href="#" class="btn btn-outline-primary"> IIM (20) </a> 
              <a href="#" class="btn btn-outline-primary"> AIIMS (12) </a> 
              <a href="#" class="btn btn-outline-primary"> IIIT (28) </a> 
            </div>
        </div> -->
        
    </div> 
    

    

  <div id="filter_list">
    <?php $this->widget->run('front_search_colleges_filter',TRUE);?>
  </div>

    <section class="isa-filter-result">
        <div class="form-row" id="udata_lists">
          <?php
          if(!empty($searched_universities)){

            foreach ($searched_universities as $key => $value) {
              if(isset($value['ads_link'])){
                ?>
                <div class="col-md-12 adBlock">
                   <div class="bodyslot bodyslot-dynamic clearfix">
                    <div class="ads_body_banner_container clearfix">
                      <a href="<?php echo $value['ads_link'];?>" target="_blank" rel="nofollow">
                        <img src="<?php echo $value['ads_image'];?>">
                      </a>
                    </div>
                   </div>
                </div>
                <?php
              }else{
                foreach ($value as $k => $v) {
                  ?>
                  <div class="col-sm-6 col-md-4 col-lg-4">
                    <div class="proBox">
                        <div class="imgBox">
                          <a href="#"> <img src="<?php echo $v['college_banner'];?>" alt="<?php echo $v['college_name'];?>"></a>

                          <?php
                          if($v['is_featured']=='1'){
                            ?>
                            <div class="pro-label pro-featured">
                              <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
                            </div>
                            <?php
                          }
                          ?>
                          
                          <!-- <div class="pro-label pro-status">
                            <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
                          </div> -->
                          <div class="proReview">
                            <i class="far fa-envelope"></i> <!-- <b>20</b> --> 
                          </div>
                          <div class="proRating">
                            <small class="d-block">RATING</small>
                            <i class="fas fa-star-half-alt"></i> <!-- <b>6.7/10</b> --> 
                          </div>
                          <div class="pro-action">
                            <div class="pro-action-inner">
                              <div class="social-share" data-toggle="tooltip" title="Share">
                                <div class="social-share-hover">
                                  <i class="fa fa-share-alt"></i>
                                  <div class="social-share-list">
                                    <div class="list-social-icon clearfix">
                                      <a href="javascript:;"><i class="fab fa-facebook"></i></a>
                                      <a href="javascript:;"><i class="fab fa-twitter"></i></a>
                                      <a href="javascript:;"><i class="fab fa-google-plus"></i></a>
                                      <a href="javascript:;"><i class="fab fa-linkedin"></i></a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <?php
                              if(!empty($v['college_intro_video'])){
                              ?>
                                <a href="<?php echo $v['college_intro_video'];?>" data-fancybox class="property-video" data-toggle="tooltip" title="Show Video"><i class="fab fa-youtube"></i></a>
                              <?php
                              }
                              ?>
                              <a href="javascript:;" class="property-favorite" data-toggle="tooltip" title="Add to Favorite"><i class="far fa-heart"></i></a>
                              <a class="compare-property" href="javascript:;" data-toggle="tooltip" title="Rating"><i class="far fa-star"></i></a>
                            </div>
                            <a class="pro-link" href="#"></a>
                          </div>
                        </div>
                        <div class="proBoxBody">
                          <div class="proInfo">
                            <div class="infoImg"><a href="<?php echo $v['access_url'];?>"><img src="<?php echo $v['college_logo'];?>"></a></div>
                            <p class="infoTitle"><a href="<?php echo $v['access_url'];?>"><?php echo $v['college_name'];?></a></p>
                            <p class="infoLocation"><i class="fas fa-map-marker-alt"></i> <?php echo $v['college_city'];?>, <?php echo $v['college_state'];?>
                            <?php
                              if(!empty($v['college_affiliations'])){
                                ?>
                                  <i class="fas fa-bookmark"></i> <?php echo $v['college_affiliations'];?>
                                <?php
                              }
                              ?>
                            </p>
                          </div>

                          <?php
                          if(!empty($v['college_courses_cost'])){
                            ?>
                            <div class="infoItems">
                              <?php
                              foreach ($v['college_courses_cost'] as $_k => $_v) {
                               ?>
                                <a href="" class="infoItem">
                                  <h4> <?php echo $_v['cost_value'];?></h4>
                                  <p><?php echo $_v['course_name'];?></p>
                                </a>
                               <?php
                              }
                              ?>
                            </div>
                            <?php
                          }else{
                          ?>
                            <div class="infoItems">
                              <?php
                              for($i=1;$i<=3;$i++) {
                               ?>
                                <a href="" class="infoItem">
                                  <h4> N/A</h4>
                                  <p>-</p>
                                </a>
                               <?php
                              }
                              ?>
                            </div>
                            <?php
                          }
                          ?>

                          <?php
                          if(!empty($v['college_ranks'])){
                            ?>
                            <div class="swiper-container tabSlider navTabSlider">
                              <div class="swiper-wrapper">
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                              </div>
                              <div class="swiper-button-next swiper-button-white"></div>
                              <div class="swiper-button-prev swiper-button-white"></div>
                            </div>
                            <?php
                          }
                          ?>

                          <?php
                          if(!empty($v['college_facilities'])){
                          ?>

                          <div class="swiper-container tabSlider navTabSlider">
                            <div class="swiper-wrapper">
                              <?php
                               foreach ($v['college_facilities'] as $_k => $_v) {
                              ?>

                              <a href="#" class="swiper-slide navLink"> 
                                  <div class="navIco"><?php echo $_v['facility_icon'];?></div> 
                              </a>

                              <?php
                              }
                              ?>
                            </div>
                            <div class="swiper-button-next swiper-button-white"></div>
                            <div class="swiper-button-prev swiper-button-white"></div>
                          </div>
                          <?php
                          }else{
                            ?>
                            <div class="swiper-container tabSlider navTabSlider">
                              <div class="swiper-wrapper">
                                
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                                <a href="#" class="swiper-slide navLink"> 
                                  <div class="rankPanel">
                                    <div class="rankSpan">Ranked 43 out of 300   </div>
                                    <div class="rankName"> NIRF </div>
                                  </div>
                                </a>
                              </div>
                              <div class="swiper-button-next swiper-button-white"></div>
                              <div class="swiper-button-prev swiper-button-white"></div>
                            </div>
                            <?php
                          }

                          ?>
                          
                          <div class="linkItems">
                            <a href="<?php echo $v['college_admissions_link'];?>" target="_blank">ADMISSION 2021 </a>
                            <a href="<?php echo $v['college_reviews_link'];?>" target="_blank">REVIEWS</a>
                            <a href="<?php echo $v['college_course_fees_link'];?>" target="_blank">COURSES & FEES</a>
                          </div>
                          <div class="btnGroup">
                            <a href="javascript:void(0);" class="apply" data-cname="<?php echo $v['college_name'];?>,<?php echo $v['college_city'];?>" data-inst="<?php echo $v['college_id'];?>" data-inst_type="<?php echo $v['institute_type'];?>" data-clogo="<?php echo $v['college_logo'];?>" data-cphcode="<?php echo $v['college_country_phone_code'];?>" data-cou="<?php echo $v['college_country_id'];?>"><i class="far fa-file-alt"></i> Apply Now</a>
                            <a href="javascript::void(0);" class="download"><i class="fas fa-download"></i> Brochure</a>
                          </div>
                        </div>
                    </div>
                  </div>
                  <?php
                }
              }                
            } 
          }
          ?>

        
        <!-- <div class="text-center"><a href="" class="btn-temp ">Explore All</a></div> -->

      </div>
    </section>
</main>



<script type="text/javascript">
  let curl='<?php echo current_url();?>';
  let country='<?php echo $country_id;?>';
  let _c='<?php echo $country_id;?>';
  let _st='<?php echo $state_id;?>';
  let _ct='<?php echo $city_id;?>';
  let _strm='<?php echo $stream_id;?>';
  let _cu='<?php echo $course_id;?>';
  let _search_type='7';
</script>