<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="commonSec">
      <div class="wrapper">
        <div class="section-title">
          <h2>Explore by Category</h2>
          <p>BROWSE 100+ ENTRANCE EXAMS</p>
        </div>
        <div class="row">
            <?php
            if(!empty($streams)){
              foreach ($streams as $key => $value) {
                ?>
                <div class="col-sm-6 col-lg-6">
                  <div class="card shadow examCard mb-3">
                    <a href="<?php echo $value['stream_access_url'];?>" class="card-header d-flex align-items-center">
                      <div class="icon mr-3"><?php echo $value['stream_icon'];?></div>
                      <h5 class="m-0"><?php echo $value['stream_name'];?></h5>
                    </a>
                    <div class="card-body">
                    <?php

                    //print_obhj($value['stream_exams']);die;
                    if(!empty($value['stream_exams'])){
                    	foreach ($value['stream_exams'] as $k => $v) {
                    		?>
                    		<p class="mb-2"><a href="<?php echo $v->url_value;?>" target="_blank"><b><?php echo $v->exam_short_name;?></b> - <?php echo $v->exam_full_name;?> </a></p>
                    		<?php
                    	}
                    }
                    ?>
                      <!-- <p class="color2 mt-2">126 more exams</p> -->
                    </div>
                    <div class="card-footer d-flex justify-content-between ">
                      <!-- <a href="#" class="btn btn-sm btn-primary ">BE/B.Tech [100]</a>
                      <a href="#" class="btn btn-sm btn-primary ">ME/M.Tech [54]</a> -->
                    </div>
                  </div>
                </div>
                <?php
              }
            }
          ?>               
        </div>
      </div>
    </section>