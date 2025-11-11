

<?php

if(!empty($streams)){
  ?>
  <section class="commonSec bg-white quickLookSec">
    <div class="wrapper">
      <div class="section-title">
        <h2>Quick look to courses</h2>
        <p>Waytoadmissions.com is an extensive search engine for the students, parents,and education industry players who are seeking information</p>
      </div>

      <div class="swiper-container tabSlider" id="quickLookThumb">
        <div class="swiper-wrapper">

          <?php
          foreach ($streams as $key => $value) {
            ?>
            <div class="swiper-slide">
              <div class="quickLooBox"> <h6> <?php echo $value['stream_name'];?></h6> </div>
            </div>
            <?php
          }
          ?>
        </div>
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>

      <div class="quickLookContent px-0 px-lg-4 mt-4">
        <div class="swiper-container" id="quickLookGal">
          <div class="swiper-wrapper">

            <?php
           
            foreach ($streams as $key => $value){
              if(!empty($value['stream_courses'])){
                ?>
                <div class="swiper-slide">
                  <div class="card">
                    <div class="card-header">
                      <ul class="nav nav-tabs card-header-tabs">
                        <?php
                        $i=0;
                        foreach ($value['stream_courses'] as $k => $v) {
                          ?>
                          <li class="nav-item">
                            <a class="nav-link <?php echo ($i==0)?'active':'';?>" data-toggle="tab" href="#quickLookTab1_<?php echo $i;?>" > <?php echo $v['course_short_name'];?></a>
                          </li>
                          <?php
                          $i++;
                        }
                        ?>
                      </ul>
                    </div>
          
                    <div class="card-body">
                      <div class="tab-content">
                        <?php
                        $j=0;
                        foreach ($value['stream_courses'] as $k => $v){
                          ?>
                          <div class="tab-pane fade <?php echo ($j==0)?'show active':'';?>" id="quickLookTab1_<?php echo $j;?>" >
                            <?php
                            if(!empty($v['child_courses'])){
                              ?>
                              <h5>BY COURSES</h5>
                              <div class="btnGroup">
                                <?php
                                foreach ($v['child_courses'] as $_k => $_v) {
                                  ?>
                                  <a href="#" class="btn btn-outline-primary"><?php echo $_v['course_name'];?></a>
                                  <?php
                                }
                                ?>
                              </div>
                              <?php
                            }

                            ?>
                              
                          </div>
                          <?php
                          $j++;
                        }
                        ?>
                      </div>
                    </div>
                  </div>
                </div>
                <?php
              }
              ?>
                
              <?php
              $i++;
            }

            ?>

            

          </div>
        </div>
     </div>

    </div>
  </section>
  <?php
}

?>