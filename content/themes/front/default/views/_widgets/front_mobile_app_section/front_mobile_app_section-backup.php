<section class="commonSec appSec">
    <div class="wrapper">
       <div class="row">
         <div class="col-lg-6 offset-lg-3">
           <div class="row">
             <div class="col-md-7">
               <h2>NOW</h2>
               <h3>WE’RE ON MOBILE TOO</h3>
               <p><i class="fas fa-bolt text-warning"></i> 10X FASTER EXPERIENCE</p>
               <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Mobile no" >
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button">Get Link</button>
                </div>
              </div>
              <div class="">

                <?php
                if(!empty($system_play_store_logo)){
                  ?>
                    <a href="<?php echo base_url();?>"><img src="<?php echo $system_play_store_logo;?>" width="110" class="mr-2" alt="waytoadmission playstore app"></a><a href="<?php echo base_url();?>"> <img src="<?php echo $system_apple_store_logo;?>" alt="waytoadmission apple store app" width="110" class="mr-2"></a>
                  <?php
                }

                ?>

                
              </div>
             </div>
             <div class="col-md-5">
                <img src="<?php echo $system_mobile_app_image;?>" alt="Sikshapedia mobile app ads" class="appImg img-fluid">
             </div>
           </div>
         </div>
       </div>
    </div>
  </section>