<?php
if(!empty($top_cities)){
?>
<section class="commonSec collegeExmSec bg-white" style="border-top:1px solid #dee2e6;">
    <div class="wrapper">
      <div class="section-title">
        <h2>Best Places to Study in <?php echo $default_country_data->country_name;?></h2>
      </div>
      <div class="swiper-container itemsSlider" id="collegeExmSlider">
        <div class="swiper-wrapper">
        	<?php

        	foreach ($top_cities as $key => $value) {
        		?>
        		<div class="swiper-slide">
		            <div class="card shadow-sm">
		              <a href="<?php echo $value['city_slug_url'];?>"> <img src="<?php echo $value['city_icon_img'];?>" style="height: 120px;width:120px;display: block;margin-left: auto;margin-right: auto;" class="card-img-top text-center" alt="<?php echo $value['city_img_alt_text'];?>" title="<?php echo $value['city_img_title'];?>" loading="lazy">
  		              <div class="card-body text-center p-2">
  		                <h6 class="card-title mb-2"><?php echo $value['city_name'];?></h6>
  		                <!-- <p class="card-text m-0"><small> quick example text</small></p> -->
  		              </div>
                  </a>
		            </div>
		        </div>
        		<?php
        	}
        	?>
        </div>
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
    </div>
</section>
<?php
}
?>


<style type="text/css">
  #collegeExmSlider .swiper-slide h6{
    color:#ed6643;
  }
  
</style>