<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


<?php
if(!empty($folder_data)){
	?>
	<ul class="jFiler-item-list">
	<?php
		foreach ($folder_data as $key => $value) {
			?>
			<li class="jFiler-item">
        <div class="jFiler-item-container">
          <div class="jFiler-item-thumb">
            <div class="jFiler-item-status"></div>

            <div class="jFiler-item-thumb-image">
              <?php
              if($value['media_mime']=='video/mp4'){

              }else{
                ?>
                <img src="<?php echo $value['media_disk_path_relative'];?>" draggable="false">
                <?php
              }
              ?>
              
            </div>
          </div>
          <div class="jFiler-item-assets jFiler-row">
            <ul class="list-inline pull-left">
              <li>
                <div class="jFiler-item-others text-success" style=""><i class="icon-jfi-check-circle"></i> <?php echo $value['media_org_name'];?></div>
              </li>
            </ul>
            <ul class="list-inline pull-right">
              <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
            </ul>
          </div>
        </div>
      </li>
			<?php
		}
	?>
	</ul>
	<?php
}
?>