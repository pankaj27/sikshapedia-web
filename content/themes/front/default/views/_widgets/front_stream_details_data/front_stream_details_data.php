<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
	
if(!empty($stream_details_data)){
	?>
	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="#" class="mr-3 "><img class="img-circle" src="<?php echo $curator_image;?>" width="60" alt="<?php echo $creator_image_name;?>" draggable="false"></a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#"> <?php echo $uploaded_by;?> </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <?php
	    if(!empty($updated_on)){
	    	?>
	    	<div class="updateDate color2">Updated On - <?php echo $updated_on;?></div>
	    	<?php
	    }
	    ?>	    
	  </div>
	  <div class="card-body">
	  	<?php
	  	foreach ($stream_details_data as $key => $value) {

	  		if($value->stream_data_type=='image'){
	  			?>
	  			<div class="row">
	  				<div class="col-lg-12">
	  					<img data-src="<?php echo $value->stream_content;?>" class="lazy img-thumbnail" alt="" style="text-align:center;">
	  				</div>
	  			</div>
	  			<?php
	  		}else{
	  			echo $value->stream_content;
	  		}			
		}
	  	?>
	  </div>
	</div>
	<?php		
}

if(!empty($stream_faq_details)){
	?>
		<h5 class="mt-0 text-dark"> <?php echo $faq_heading;?>  </h5>
    <div id="accordionExample1" class="accordion">
      <?php
      $i=0;
      foreach ($stream_faq_details as $key => $value) {
        ?>
        <div class="card br-0">
          <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong>Ques. </strong><?php echo $value->stream_data_faq_ques;?></a>
          <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
            <div class="card-body">
              <p class="font-weight-light m-0"><strong>Ans. </strong><?php echo $value->stream_data_faq_ans;?></p>
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