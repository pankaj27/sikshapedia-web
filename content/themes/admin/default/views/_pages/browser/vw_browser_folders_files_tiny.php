<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<?php
if(!empty($system_files)){
	foreach ($system_files as $key => $value) {
		?>
		<div class="col-md-4">
			<figure>
				<img class="img-fluid lightboxed" data-file_id="<?php echo $value['file_id'];?>" data-img="<?php echo $value['file_relative_path'];?>" rel="group1" src="<?php echo $value['file_relative_path'];?>" data-link="<?php echo $value['file_relative_path'];?>"  data-caption="<?php echo $value['file_name'];?>" alt="<?php echo $value['file_name'];?>">
			</figure>
		</div>
		<?php
	}
}



?>