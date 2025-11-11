<?php

if(!empty($college_data)){
  ?>
  <div class="card mb-4">
    <div class="card-header bg-white">
      <h5 class="m-0">COLLEGES ACCEPT THE EXAM</h5>
    </div>
    <ul class="list-group list-group-flush">
      <?php
      foreach ($college_data as $key => $value) {
        ?>
        <li class="list-group-item">
          <a href="<?php echo $value['college_url'];?>" class="media"><img src="<?php echo $value['college_logo'];?>" width="40" class="mr-2" alt="<?php echo $value['college_name'];?>"> 
            <div class="media-body">
              <h6 class="mb-0 color2"><?php echo $value['college_formatted_name'];?></h6>
              <small><?php echo $value['college_state'];?>,<?php echo $value['college_city'];?></small> 
            </div>
          </a>
        </li>
        <?php
      }
      ?>
    </ul>
  </div>
  <?php  
}
?>