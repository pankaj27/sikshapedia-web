<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php

if(!empty($top_ranked_colleges)){
  ?>
  <section class="featyredSec">
    <div class="swiper-container tabSlider" id="featyredSlider">
      <div class="swiper-wrapper">
        <?php
        foreach ($top_ranked_colleges as $key => $value) {
         ?>
          <div class="swiper-slide">
            <a href="<?php echo $value['access_url'];?>" class="featyredBox">
              <div class="infoImg" id="home_infoImg">
                  <div class="home_infoImg_left">
                    <img class="lazy" src="<?php echo $value['college_logo'];?>" alt="<?php echo $value['college_alt_text'];?>" loading="lazy" width="50px" height="50px">
                  </div>
                  <div class="home_infoImg_right">
                    <h5><?php echo $value['college_name'];?></h5>
                    <p><small><?php echo $value['college_city'];?>,<?php echo $value['college_state'];?>,<?php echo $value['college_country'];?></small></p>
                    <p>Top ranked college - <span>Explore</span></p>
                  </div>
                </div>
              
            </a>
          </div>
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

<style type="text/css">#home_infoImg {display: flex;align-items: center;}#home_infoImg img {margin-right: 10px;border-radius: 20%;}#home_infoImg div.home_infoImg_right{width:80% !important;}#featyredSlider div.swiper-slide{border-right: 1px solid #00000033 !important;}</style>