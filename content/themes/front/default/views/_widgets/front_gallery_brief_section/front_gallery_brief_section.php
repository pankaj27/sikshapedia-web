<?php

if(!empty($gallery_data)){
    ?>
    <div class="card imageCard mb-4">
      <div class="card-header bg-white">
        <h5 class="m-0 color2"> GALLERY IMAGES</h5>
      </div>
      <div class="card-body">
        <div class="row form-row">
          <?php
          
            foreach ($gallery_data as $k => $v) {
              ?>
              <div class="col-6 col-sm-4 col-md-3 mb-2">
                <a href="<?php echo $v['storage_file'];?>" data-fancybox="events" class="imgBox h-150"><img class="img-thumbnail" src="<?php echo $v['storage_file'];?>" loading="lazy"  draggable="false" style="height:150px !important;" title="<?php echo $v['storage_file_caption'];?>" alt="<?php echo $v['storage_file_alt'];?>"></a>
              </div>
              <?php
            }
          
          ?>
        </div>
      </div>
    </div>
    <?php

}

?>