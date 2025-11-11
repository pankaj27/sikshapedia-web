<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($colleges)){
  ?>
  <div class="card infoCard mb-4">
    <div class="card-header bg-white">
      <h5 class="m-0 color2 text-uppercase"><?php echo $stream_data->stream_name;?> COLLEGES</h5>
    </div>
    <div class="card-body">
      <div class="form-row">
        <?php
        foreach ($colleges as $key => $value) {
          ?>
          <div class="col-md-3">
              
              
               <div class="proBox">
                  <div class="imgBox">
                    <a href="<?php echo $value['access_url'];?>"> <img class="" src="<?php echo $value['college_banner'];?>" alt="<?php echo $value['college_name'];?>"></a>
        
                    <?php
                    if($value['is_featured']=='1'){
                      ?>
                      <div class="pro-label pro-featured">
                        <span class="pro-label-bg">Featured <span class="pro-arrow"></span></span>
                      </div> 
                      <?php
                    }
                    ?>
                    
                    <!--  <div class="pro-label pro-status">
                      <span class="pro-label-bg"><span class="pro-arrow"></span> On Offer </span>
                    </div> -->
                    <!-- <div class="proReview">
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
                        <a href="javascript:;" class="property-favorite btn_shortlist" data-inst="<?php echo $value['college_id'];?>" data-inst_type="<?php echo $value['college_type'];?>" data-toggle="tooltip" title="Add to Favorite"><i class="far fa-heart"></i></a>
                        <a class="compare-property" href="javascript:;" data-toggle="tooltip" title="Rating"><i class="far fa-star"></i></a>
                      </div>
                      <a class="pro-link" href="#"></a>
                    </div> -->
                  </div>
                  <div class="proBoxBody">
                    <div class="proInfo">
                      <div class="infoImg"><a href="<?php echo $value['access_url'];?>"><div class="card__image loading"></div><img data-src="<?php echo $value['college_logo'];?>" alt="<?php echo $value['college_name'];?>" class="lazy" style="display:none;"><noscript><img src="<?php echo $value['college_logo'];?>" alt="<?php echo $value['college_name'];?>" class="lazy" style="display:none;"></noscript></a></div>
                      <p class="infoTitle"><a href="<?php echo $value['access_url'];?>"><?php echo $value['college_name'];?></a></p>
                      <p class="infoLocation"><i class="fas fa-map-marker-alt"></i> <?php echo $value['college_city'];?>, <?php echo $value['college_state'];?></p>
                    </div>

                     <!-- <div class="p-3">
                      <h4 class="pro-title"><a href="#" > MBA/PGDM10 </a>  <span class="badge badge-warning">10</span></h4>
                      <div class="pro-price">TOTAL FEES  <span> ₹23.15 L </span> </div>
                      <div class="viewlink"><a href="#"> <i class="fas fa-long-arrow-alt-right"></i> <span> VIEW ALL COURSES & FEES </span></a> </div>
                    </div> -->
                    
                    <div class="btnGroup">

                      <a href="javascript:void(0);" class="apply" data-cname="<?php echo $value['college_name'];?>,<?php echo $value['college_city'];?>" data-inst="<?php echo $value['college_id'];?>" data-inst_type="<?php echo $value['college_type'];?>" data-clogo="<?php echo $value['college_logo'];?>" data-cphcode="<?php echo $value['college_country_phone_code'];?>" data-cou="<?php echo $value['college_country_id'];?>"><i class="far fa-file-alt"></i> Apply Now</a>

                      <a href="<?php echo $value['access_url'];?>" class="download"><i class="fas fa-eyes"></i> Explore</a>
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

<style type="text/css">
  .text-uppercase {
        text-transform: uppercase;
    }
</style>