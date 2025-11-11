<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php
if(!empty($similar_colleges)){
  ?>
  <div class="card infoCard mb-4">
      <div class="card-header bg-white">
        <h5 class="m-0 color2">SIMILAR COLLEGES</h5>
      </div>
      <div class="card-body">
        <div class="form-row">
          <?php
          foreach ($similar_colleges as $key => $value) {
            ?>
            <div class="col-md-4">
              <div class="proBox">
                  <div class="imgBox">  
                    <img class="" src="<?php echo $value['college_banner'];?>" alt="<?php echo $value['college_name'];?>">
                    <div class="pro-label pro-featured">
                      <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
                    </div>
                    <div class="pro-label pro-status">
                      <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
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
                      <img src="<?php echo $value['college_name'];?>" alt="<?php echo $value['college_name'];?>">
                      <p><?php echo $value['college_name'];?></p>
                      <i><?php echo $value['college_city'];?>, <?php echo $value['college_state'];?></i>
                    </div>
                    <div class="p-3">
                      <h4 class="pro-title"><a href="#" > MBA/PGDM10 </a>  <span class="badge badge-warning">10</span></h4>
                      <div class="pro-price">TOTAL FEES  <span> ₹23.15 L </span> </div>
                      <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
                    </div>
                  </div>
              </div>
            </div>
            <?php
          }
          ?>
        </div>
      </div>
  </div>
  <?php
}
?>
<!-- 
<div class="card infoCard mb-4">
  <div class="card-header bg-white">
    <h5 class="m-0 color2">SIMILAR COLLEGES</h5>
  </div>
  <div class="card-body">
    <div class="form-row">



      <div class="col-md-4">
        <div class="proBox">
            <div class="imgBox">
              <img class="" src="assets/img/college1.jpg" alt="">
              <div class="pro-label pro-featured">
                <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
              </div>
              <div class="pro-label pro-status">
                <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
              </div>
              <div class="proInfo">
                <img src="assets/img/c-l-1.jpg">
                <p>Indian Institute of Management</p>
                <i>Bangalore, Karnataka</i>
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
              <div class="pro-price">TOTAL FEES  <span> ₹23.15 L </span> </div>
              <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
            </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="proBox">
            <div class="imgBox">
              <img class="" src="assets/img/college1.jpg" alt="">
              <div class="pro-label pro-featured">
                <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
              </div>
              <div class="pro-label pro-status">
                <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
              </div>
              <div class="proInfo">
                <img src="assets/img/c-l-1.jpg">
                <p>Indian Institute of Management</p>
                <i>Bangalore, Karnataka</i>
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
              <div class="pro-price">TOTAL FEES  <span> ₹23.15 L </span> </div>
              <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
            </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="proBox">
            <div class="imgBox">
              <img class="" src="assets/img/college1.jpg" alt="">
              <div class="pro-label pro-featured">
                <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
              </div>
              <div class="pro-label pro-status">
                <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
              </div>
              <div class="proInfo">
                <img src="assets/img/c-l-1.jpg">
                <p>Indian Institute of Management</p>
                <i>Bangalore, Karnataka</i>
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
              <div class="pro-price">TOTAL FEES  <span> ₹23.15 L </span> </div>
              <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</div> -->