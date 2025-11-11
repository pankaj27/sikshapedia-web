<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($top_universities)){
  ?>
  <section class="commonSec topCollegesSec ">
     <div class="wrapper">
      <div class="section-title">
        <h2>TOP UNIVERSITIES</h2>
        <!-- <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem.</p> -->
      </div>
      <div class="row">
        <?php
        foreach ($top_universities as $key => $value) {
          ?>
          <div class="col-md-6 col-lg-4 col-xl-3">
              <div class="proBox">
                      <div class="imgBox">
                        <a href="#"> <img class="" src="<?php echo $value['university_banner'];?>" alt=""></a>

                       <div class="pro-label pro-featured">
                          <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
                        </div>
                         <div class="pro-label pro-status">
                          <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
                        </div>
                        <div class="proReview">
                          <i class="far fa-envelope"></i> <b>20</b> 
                        </div>
                        <div class="proRating">
                          <small class="d-block">RATING</small>
                          <i class="fas fa-star-half-alt"></i> <b>6.7/10</b> 
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
                            <a href="javascript:;" class="property-favorite" data-toggle="tooltip" title="Add to Favorite"><i class="far fa-heart"></i></a>
                            <a class="compare-property" href="javascript:;" data-toggle="tooltip" title="Rating"><i class="far fa-star"></i></a>
                          </div>
                          <a class="pro-link" href="#"></a>
                        </div>
                      </div>
                      <div class="proBoxBody">
                        <div class="proInfo">
                          <div class="infoImg"><a href="#"><img src="<?php echo $value['university_logo'];?>"></a></div>
                          <p class="infoTitle"><a href="<?php echo $value['access_url'];?>"><?php echo $value['university_name'];?></a>></p>
                          <p class="infoLocation"><i class="fas fa-map-marker-alt"></i> <?php echo $value['university_city'];?>, <?php echo $value['university_state'];?></p>
                        </div>
                        

                        <div class="infoItems">
                          <a href="" class="infoItem">
                            <h4> ₹ 27,770</h4>
                            <p>BE/B.TECH - FIRST YEAR FEES</p>
                          </a>
                          <a href="" class="infoItem">
                            <h4>TS EAMCE... </h4>
                            <p>Exam Accepted</p>
                          </a>
                          <a href="" class="infoItem">
                            <h4>  8.3 / 10 </h4>
                            <p>Based on 56 User reviews</p>
                          </a>
                        </div>
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
                        <div class="linkItems">
                          <a href="">ADMISSION 2021 </a>
                          <a href="">REVIEWS</a>
                          <a href="">COURSES & FEES</a>
                        </div>
                        <div class="btnGroup">
                          <a href="#" class="apply"><i class="far fa-file-alt"></i> Apply Now</a>
                          <a href="#" class="download"><i class="fas fa-download"></i> Brochure</a>
                        </div>
                      </div>
                  </div>
                  
          </div>
          <?php
        }
        ?>
      </div>
     </div>
  </section>
  <?php
}
?>