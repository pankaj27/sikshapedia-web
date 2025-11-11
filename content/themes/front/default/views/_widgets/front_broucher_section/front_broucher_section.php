<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>

<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
<?php

if(!empty($brouchers)){
	?>
	<div class="card infoCard mb-4">
	   <div class="card-header bg-white">
	      <h5 class="m-0 color2">BROUCHERS</h5>
	   </div>
	   <div class="card-body">
	      <div class="row">
	      	<div class="col-md-12 wrapper">

	      		

		    	<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
				  <div class="carousel-inner">
				  	<?php
				  	$i=0;
				  	foreach ($brouchers as $key => $value){
				  		?>
				  		<div class="carousel-item <?php echo ($i==0)?'active':'';?>">
					    	<div class="row form-row">
					    		<?php
					    		foreach ($value['broucher_files'] as $k => $v){
					    			?>
					    			<div class="col-6 col-sm-4 col-md-3 mb-2  p-2">
								      	<div class="card" style="width: 18rem;">
										  <a href="<?php echo $v['file_path'];?>" data-fancybox="events" class="imgBox h-150"><img src="<?php echo $v['file_path'];?>" class="card-img-top" alt="<?php echo $value['broucher_type'];?>" loading="lazy"></a>
										  <div class="card-body">
										    <h5 class="card-title"><?php echo $value['broucher_type'];?></h5>
										    <p class="card-text"><?php echo $value['broucher_year'];?></p>
										  </div>
										</div>
									</div>
					    			<?php
					    		}
					    		?>
							</div>
					    </div>
				  		<?php
				  		$i++;
				  	}
				  	?>
				  	
				  </div>
				  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
				    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
				    <span class="sr-only">Previous</span>
				  </a>
				  <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
				    <span class="carousel-control-next-icon" aria-hidden="true"></span>
				    <span class="sr-only">Next</span>
				  </a>
				</div>

		    </div>
		  </div>
	   </div>
	</div>
	<?php
}
?>




<script type="text/javascript">
	$(document).ready(function(){
		$('.carousel'). carousel({ interval: false}); 
		$('#slic-slider').slick();
	});
</script>