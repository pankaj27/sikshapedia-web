<section class="commonSec  collegeExmSec bg-white studyAbroadSection">
    <div class="wrapper">
      <div class="section-title">
        <h2>STUDY ABROAD</h2>
        <p>Interested in studying abroad? Choose a country:</p>
      </div>
      <div class="swiper-container itemsSlider" id="collegeExmSlider">
        <div class="swiper-wrapper">
            <?php

              foreach ($top_countries as $key => $value) {
              ?>
              <div class="swiper-slide">
                  <div class="col-md-3 col-sm-6">
                      <div class="serviceBox">
                          <div class="service-icon" style="background-image:url(<?php echo $value['country_flag'];?>);background-size:cover;background-position:center;background-repeat:no-repeat;">
                          </div>
                          <h3 class="title" style="font-size: 1.0rem;width:110px;"><?php echo $value['country_name'];?></h3>
                      </div>
                  </div>
              </div>
              <?php
            }
          ?>        
        </div>
      </div>

    </div>
  </section>


<style type="text/css">
  #collegeExmSlider .swiper-slide h6{
    color:#ed6643;
  }
  
</style>