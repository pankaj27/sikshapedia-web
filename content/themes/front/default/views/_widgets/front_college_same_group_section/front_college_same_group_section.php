<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($college_groups)){
	?>
	<div class="card notificationCard mb-4" id="div_colleges_in_group">
	  <!-- <div class="card-header bg-white">
	    <h5 class="m-0">

	    COLLEGES IN THE SAME GROUP

		</h5>
	  </div> -->
	  <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		<h5 class="m-0">COLLEGES IN THE SAME GROUP</h5>
	  </div>
	  <ul class="list-group list-group-flush" id="colleges_in_group">
	  	<?php
	  	foreach ($college_groups as $key => $value) {
	  		?>
	  		<li class="list-group-item">
		      <a href="<?php echo $value['college_url'];?>" class="media">
		        <img src="<?php echo $value['college_logo'];?>" width="40" class="mr-2" alt="<?php echo $value['college_name'];?>" loading="lazy">
		        <div class="media-body">
		          <h6 class="mb-0 color2"><?php echo $value['college_name'];?></h6>
		          <small><?php echo $value['college_city'];?>,<?php echo $value['college_state'];?></small>
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