<?php

if(!empty($upcomming_exams)){
  ?>
  <div class="upcommingExams  py-5">
    <h4 class="text-center text-white mb-4">Upcoming Exams</h4> 
    <div class="swiper-container itemsSlider upcommingExamsSlider" id="upcommingExamsSlider">
        <div class="swiper-wrapper">
          <?php
          foreach ($upcomming_exams as $key => $value) {
            ?>
              <div class="swiper-slide">
                <a href="<?php echo $value['exam_url'];?>" class="examMedia">
                    <div class="exmDate bg-orange-gradient ">
                        <h3 class="mb-0"><?php echo $value['exam_date'];?></h3>
                        <!-- <span> MAY</span> -->
                    </div>
                    <div class="exmBbody">
                      <h5 class="mt-0 text-white no-decoration"><?php echo $value['exam_formatted_name'];?></h5>
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
  </div>
<?php
}

?>