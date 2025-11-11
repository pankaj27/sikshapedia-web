<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec overlayBnr">
  <img src="<?php echo $college_data['college_banner'];?>" class="headerBnrImg" alt="">
  <div class="wrapper">
    <div class="headerBnrPanel">
      <div class="bnrThumbBox">
        <div class="bnrThumb shadow bg-white"><img src="<?php echo $college_data['college_logo'];?>" alt="<?php echo $college_data['college_name'];?>"></div>
        <div class="bnrThumbCon pt-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-0 bg-none mb-1">
              <?php
              foreach ($college_data['college_breadcrumb'] as $key => $value) {
                ?>
                <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                  <?php
                  if(!empty($value)){
                    ?>
                    <a href="<?php echo $value;?>"><?php echo $key;?></a>
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
          <h5 class="m-0 bnrTitle text-truncate text-uppercase w-75 font-weight-bolder"><?php echo $college_data['college_name_formatted'];?></h5>
          <div class="m-0  d-lg-flex  justify-content-between tagLists w-75">
            <div class="text-truncate tags">
              <span><i class="fas fa-map-marker-alt"></i> <?php echo $college_data['college_city'];?>,<?php echo $college_data['college_state'];?> </span>

              <?php
              if(!empty($college_data['college_affiliations'])){
                ?>
                <span><i class="fas fa-bookmark"> </i> <?php echo $college_data['college_affiliations'];?> </span> 
                <?php
              }

              ?>

              <span><i class="fas fa-thumbtack"></i> ESTD <?php echo $college_data['college_estd'];?> </span> 
              <?php

              if(!empty($college_data['college_university'])){
                ?>
                <span><i class="fas fa-flag"></i> <?php echo $college_data['college_university'];?></span>
                <?php
              }

              ?>

              
              
              <!-- <span><i class="fas fa-star"> </i> </span>  -->
              <!-- <span><i class="fas fa-tags"> </i>  10 QUESTIONS </span> 
              <span><i class="fas fa-tags"> </i>  ANSWERED </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
              <span><i class="fas fa-tags"> </i>  RANKED 2 </span> --> 
            </div>
            <!-- <div class="pl-2"><a href="">  MORE </a></div> --> 
          </div>
        </div>

      </div>
      <div class="headerBnrCon d-md-block" style="width:240px;">
       
       

        

      </div>
     
    </div>
  </div>
</section>


<section class="tabSliderSec">
  <div class="swiper-container tabSlider navTabSlider">
    <div class="swiper-wrapper">
      <?php
     
      if(!empty($inner_meues)){
        foreach ($inner_meues as $key => $value) {
         ?>
         <a href="<?php echo $value['menu_link'];?>" class="swiper-slide navLink <?php echo ($value['menu_default_active']!='')?$value['menu_default_active']:$value['menu_active'];?>"> <?php echo $value['menu_name'];?> </a>
         <?php
        }
      }
      ?>
    </div>
    <div class="swiper-button-next swiper-button-white"></div>
    <div class="swiper-button-prev swiper-button-white"></div>
  </div>
</section>