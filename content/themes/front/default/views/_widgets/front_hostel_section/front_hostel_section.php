<?php

// print_obj($college_hostel_data); 


if(!empty($college_hostel_data)){

	if($college_hostel_data['men_hostel_detail_type']!='' || $college_hostel_data['men_hostel_detail_type']!=null || !empty($college_hostel_data['men_hostel_detail_type'])){
		if($college_hostel_data['men_hostel_fees']!='0'){
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

			  <?php
			  if($college_hostel_data['men_hostel_note']!=''){
			  	?>
				<div class="card-body">
			  		<?php echo $college_hostel_data['men_hostel_note'];?>
			  	</div>
			  	<?php
			  }
			  ?>
			</div>

			<?php
		}
			
	}

	if($college_hostel_data['women_hostel_detail_type']!=null || $college_hostel_data['women_hostel_detail_type']!=null || !empty($college_hostel_data['women_hostel_detail_type'])){
		if($college_hostel_data['women_hostel_fees']!='0'){
			?>
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

			  <?php
			  if($college_hostel_data['women_hostel_note']!=''){
			  	?>
			  	<div class="card-body">
				  	<?php echo $college_hostel_data['women_hostel_note'];?>
				</div>
			  	<?php
			  }
			  ?>		  

			</div>
			<?php
		}
		?>
		
		<?php
	}
}
	