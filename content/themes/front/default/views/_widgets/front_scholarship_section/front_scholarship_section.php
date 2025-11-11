<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php

if(!empty($scholarship_intro_data)){
  ?>
  <div class="card infoCard mb-4">
		<div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="#" class="mr-3 "><img class="img-circle" src="<?php echo $info_curator_data['info_curator_image'];?>" width="60" alt="<?php echo $info_curator_data['info_curator'];?>" loading="lazy" draggable="false"></a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $info_curator_data['info_curator'];?>  </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate color2"><?php echo $info_curator_data['info_updated'];?></div>
		</div>
		
    <div class="card-body readall">
      <?php echo $scholarship_intro_data;?>
    </div>
  </div>
  <?php
}

?>

<?php
if(!empty($scholarship_info_data)){
?>
<div class="card infoCard mb-4">
	<?php

	if(empty($scholarship_intro_data)){
		?>
		<div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="#" class="mr-3 "><img class="img-circle" src="<?php echo $info_curator_data['info_curator_image'];?>" width="60" alt="<?php echo $info_curator_data['info_curator'];?>" loading="lazy" draggable="false"></a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $info_curator_data['info_curator'];?>  </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate color2"><?php echo $info_curator_data['info_updated'];?></div>
		</div>
		<?php
	}

	?>
	
	<div class="card-body">
		<?php
			
				foreach ($scholarship_info_data as $key => $value) {

					if($value->info_value_type=='general'){
						echo $value->info_value;
					}else if($value->info_value_type=='image'){
						?>
						<div class="text-center">
	  						<img src="<?php echo $value->info_value;?>" alt="<?php echo $value->info_value_about;?>" title="<?php echo $value->info_value_about;?>" draggable="false" loading="lazy" class="img-fluid mx-auto d-block">
	  					</div>
						<?php
					}
					
				}

		  if(!empty($scholarship_faqs)){
		    ?>
		    <div id="accordionExample1" class="accordion">
		      <?php
		      $i=0;
		      foreach ($scholarship_faqs as $key => $value) {
		        ?>
		        <div class="card br-0">
		          <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong></strong><?php echo $key;?></a>
		          <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
		            <div class="card-body">
		              <p class="font-weight-light m-0"><strong></strong><?php echo $value;?></p>
		            </div>
		          </div>
		        </div>
		        <?php
		        $i++;
		      }

		      ?>
		    </div>
		    <?php
		  }
			
		?>
	</div>
</div>
<?php
}
?>


