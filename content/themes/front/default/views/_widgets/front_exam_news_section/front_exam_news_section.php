<?php defined('BASEPATH') OR exit('No direct script access allowed');

if(!empty($news_data)){
  ?>
  <section class="commonSec topCollegesSec">
    <div class="wrapper">
      <div class="section-title">
        <h2><?php echo $exam_data->exam_short_name;?> NEWS</h2>
      </div>
      <div class="row">
        <?php
        foreach ($news_data as $key => $value) {
          ?>
          <div class="col-md-6 col-lg-4 col-xl-3" style="display: table-cell;">
            <div class="courdeBox">
                <a href="<?php echo $value['news_link'];?>" class="imgBox">
                  <img src="<?php echo $value['news_image'];?>" alt="<?php echo $value['news_title'];?>">
                    <<!-- span class="infoIcon"><span><i class="fas fa-info"></i></span></span> -->
                    <span class="tag primary"><?php echo $value['news_short_title'];?></span>
                    <span class="favorite active"></span>
                </a>
                <div class="boxBody" style="height:88px;">
                  <div class="update"><span><i class="fas fa-clock"></i>Last updated: <?php echo $value['news_published'];?></span></div>
                  <h4 class="title"><?php echo $value['news_title'];?></h4>
                    <!-- <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> <small><b>3.0</b> (6520)</small></div> -->
                    
                </div>
                <!-- <div class="boxFooter">
                  <span class="rate">₹5999<small> PA</small> </span> <del> ₹7999</del> <b class="off"> 30% Off</b> <span class="offer">OFFER</span>
                  <a href="#" class="getBtn">Get it now</a>
                </div> -->
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