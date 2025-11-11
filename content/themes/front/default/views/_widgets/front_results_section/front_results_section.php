<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($college_results_data)){
	?>
	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="#" class="mr-3 "><img class="img-circle" src="<?php echo $college_curator_image;?>" width="60" alt="<?php echo $college_info_curator;?>"></a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#" class="text-dark"> By <?php echo $college_info_curator;?>  </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate color2"><?php echo $college_info_updated;?></div>
	  </div>
	  <div class="card-body">
	  	<?php
	  	foreach ($college_results_data as $key => $value) {
	  		echo $value->info_value;
	  	}
	  	?>

	  	<?php
		  if(!empty($college_results_faqs)){
		    ?>
		    <div id="accordionExample1" class="accordion">
		      <?php
		      $i=0;
		      foreach ($college_results_faqs as $key => $value) {
		        ?>
		        <div class="card br-0">
		          <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $i;?>" aria-expanded="true" aria-controls="collapse<?php echo $i;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong>Ques. </strong><?php echo $value->faq_question;?></a>
		          <div id="collapse<?php echo $i;?>" data-parent="#accordionExample1" class="collapse <?php echo ($i==0)?'show':'';?>">
		            <div class="card-body">
		              <p class="font-weight-light m-0"><strong>Ans. </strong><?php echo $value->faq_ans;?></p>
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

