<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($top_colleges) || !empty($top_universities)){
  ?>
  <section class="commonSec topCollegesSec ">
     <div class="wrapper">
      <div class="section-title">
        <h2>TOP UNIVERSITIES & COLLEGES</h2>
        <!-- <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem.</p> -->
      </div>
      <div class="row">

        <?php
        foreach ($top_universities as $key => $value) {
          ?>
          <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="proBox">
              <div class="imgBox">
                <img class="" src="<?php echo $value['university_banner'];?>" alt="">
                <?php
                if($value['is_featured']=='1'){
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
                <div class="proInfo">
                  <img src="<?php echo $value['university_logo'];?>">
                  <p><a href="<?php echo $value['access_url'];?>"><?php echo $value['university_name'];?></a></p>
                  <i><?php echo $value['university_city'];?>, <?php echo $value['university_state'];?></i>
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
                <h4 class="pro-title"><a href="#" > MBA/PGDM10 </a>  <span class="badge badge-warning">10</span></h4>
                <div class="pro-price">TOTAL FEES  <span> <?php echo $value['university_total_course_amount'];?> </span> </div>
                <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
              </div>
            </div>
          </div>
          <?php
        }
        ?>


        <?php
        foreach ($top_colleges as $key => $value) {
          ?>
          <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="proBox">
              <div class="imgBox">
                <img class="" src="<?php echo $value['college_banner'];?>" alt="">
                <?php
                if($value['is_featured']=='1'){
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
                <div class="proInfo">
                  <img src="<?php echo $value['college_logo'];?>">
                  <p><a href="<?php echo $value['access_url'];?>"><?php echo $value['college_name'];?></a></p>
                  <i><?php echo $value['college_city'];?>, <?php echo $value['college_state'];?></i>
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
                <h4 class="pro-title"><a href="#" > MBA/PGDM10 </a>  <span class="badge badge-warning">10</span></h4>
                <div class="pro-price">TOTAL FEES  <span> <?php echo $value['college_total_course_amount'];?> </span> </div>
                <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
              </div>
            </div>
          </div>
          <?php
        }
        ?>


      </div>

      <div class="text-center"><a href="" class="btn-temp ">Explore All</a></div>
     </div>
  </section>
  <?php
}
?>