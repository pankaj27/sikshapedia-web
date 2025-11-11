<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php

if(!empty($cutoff_intro)){
  ?>
  <div class="card infoCard mb-4">
    <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
      <div class="media">
      <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
      <div class="media-body">
        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> Cutoff  </a> </h5>
        
      </div>
    </div>
    <div class="updateDate color2"></div>
    </div>
    <div class="card-body">
      <?php
      foreach ($cutoff_intro as $key => $value) {
        if($value->info_value_type=='image'){
          ?>
          <div class="text-center">
            <img src="<?php echo $value->info_value;?>" alt="<?php echo $value->info_value_about;?>" title="<?php echo $value->info_value_about;?>" draggable="false" loading="lazy" class="img-fluid mx-auto d-block">
          </div>
          <?php
        }else if($value->info_value_type=='general'){
          echo $value->info_value;
        }
        
      }

      ?>
    </div>
  </div>
  <?php
}