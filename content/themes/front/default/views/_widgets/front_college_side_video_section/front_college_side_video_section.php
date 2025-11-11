<?php defined('BASEPATH') OR exit('No direct script access allowed');?>



<?php
if(!empty($college_intro_vide)){
	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Videos</h5>
		</div>
		<div class="card-body">
			<div class="embed-responsive embed-responsive-16by9">
		    	<iframe height="135" width="100%" src="<?php echo $college_intro_vide;?>" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen="" class="jsx-3359498828"></iframe>
		  	</div>
		</div>
	</div>
	<?php
}
?>