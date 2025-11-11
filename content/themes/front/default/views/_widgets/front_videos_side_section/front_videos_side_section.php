<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($video_data)){
	?>
	<div class="card notificationCard mb-4">
	    <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Videos</h5>
		</div>
	    <div class="card-body">

	    	<div class="row">
		    	<?php
	        	foreach ($video_data as $key => $value) {
	        		?>
	        		<div class="px-2 lightbox-image col-6 mb-2">
	                    <div class="pointer">
	                        <div class="embed-responsive embed-responsive-16by9">
							  <iframe width="400" height="400" src="<?php echo $value['storage_file'];?>" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
	                    </div>
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



