<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

	



<?php
if(!empty($gallery_data)){
	?>
	<div class="card notificationCard mb-4"><!-- 
	    <div class="card-header bg-white">
	        <h5 class="m-0">Photos</h5>
	    </div> -->
	    <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Photos</h5>
		</div>
	    <div class="card-body">

	    	<div class="row">
		    	<?php
	        	foreach ($gallery_data as $key => $value) {
	        		?>
	        		<div class="px-2 lightbox-image col-6 mb-2">
	                    <div class="pointer">
	                        <img src="<?php echo $value['storage_file'];?>"  title="<?php echo $value['storage_file_caption'];?>" alt="<?php echo $value['storage_file_alt'];?>" height="100px" class="img lazyloaded" style="object-fit: contain;width: 100%;" draggable="false"/>
	                    </div>
	                </div>
	        		<?php
	        	}
	        	?>
        	</div>
	    	
	    </div>
	    <div class="card-header bg-white text-center">
	        <a href="<?php echo $gallery_link;?>">VIEW MORE</a>
	    </div>
	</div>
	<?php
}

?>



