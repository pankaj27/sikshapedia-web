<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($colleges)){
  ?>
  <div class="card infoCard mb-4">
    <div class="card-header bg-white">
      <h5 class="m-0 color2">NEARBY COLLEGES</h5>
    </div>
    <div class="card-body">
      <div class="form-row">
        <?php
        foreach ($colleges as $key => $value) {
          ?>
          <div class="col-md-4">
              
              
               <div class="proBox">
                  <div class="imgBox">
                    <a href="<?php echo $value['access_url'];?>"> <img class="" src="<?php echo $value['college_banner'];?>" alt="<?php echo $value['college_name'];?>"></a>
                    <?php
                    if($v['college_total_gallery_img']>0){
                      ?>
                      <div class="proReview">
                        <i class="far fa-image"></i> <b><a href="<?php echo $v['college_gallery_link'];?>"><span style="color:#ffffff;"> <?php echo $v['college_total_gallery_img'];?></span></a></b> 
                      </div>
                      <?php
                    }
                    
                    if($v['college_total_avg_rating']>0){
                      ?>
                      <div class="proRating">
                        <small class="d-block">REVIEW</small>
                        <i class="fas fa-star-half-alt"></i> <b><?php echo $v['college_total_avg_rating'];?>/10</b> 
                      </div>
                      <?php
                    }

                    ?>
                   
                  </div>
                  <div class="proBoxBody">
                    <div class="proInfo">
                      <div class="infoImg"><a href="<?php echo $value['access_url'];?>"><img src="<?php echo $value['college_logo'];?>" alt="<?php echo $value['college_name'];?>"></a></div>
                      <p class="infoTitle"><a href="<?php echo $value['access_url'];?>"><?php echo $value['college_name'];?></a></p>
                      <p class="infoLocation"><i class="fas fa-map-marker-alt"></i> <?php echo $value['college_city'];?>, <?php echo $value['college_state'];?></p>
                    </div>

                    
                    <div class="btnGroup">
                      <a href="javascript:void(0);" class="apply" data-cname="<?php echo $value['college_name'];?>,<?php echo $value['college_city'];?>" data-inst="<?php echo $value['college_id'];?>" data-inst_type="<?php echo $value['college_type'];?>" data-clogo="<?php echo $value['college_logo'];?>" data-cphcode="<?php echo $value['college_country_phone_code'];?>" data-cou="<?php echo $value['college_country_id'];?>"><i class="far fa-file-alt"></i> Apply Now</a>

                      <a href="<?php echo $value['access_url'];?>" class="download" target="_blank"><i class="fas fa-eyes"></i> Explore</a>
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