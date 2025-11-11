<?php 


if(!empty($college_hostel_data)){

	?>
	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> HOSTEL FOR:MEN  </a> </h5>
	      </div>
	    </div>
	    <div class="updateDate">FEES - <span class="text-success"><?php echo $college_hostel_data['men_hostel_fees'];?></span></div>
	  </div>

	  <div class="card-body">
	  	<?php echo $college_hostel_data['men_hostel_note'];?>
	  </div>

	</div>


	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <!-- <a href="#" class="mr-3 "><img class="img-circle" src="assets/img/avatar.jpg" width="60" alt=""></a> -->
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> HOSTEL FOR:WOMEN  </a> </h5>
	      </div>
	    </div>
	   	<div class="updateDate">FEES - <span class="text-success"><?php echo $college_hostel_data['women_hostel_fees'];?></span></div>
	  </div>
	  <div class="card-body">
	  	<?php echo $college_hostel_data['women_hostel_note'];?>
	  </div>

	</div>
	<?php
}






	;?>

	