<?php
	
if(!empty($course_details_data)){
	?>
	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="<?php echo base_url();?>" class="mr-3 " target="_blank">
	      	<img class="img-circle" src="<?php echo $user_image;?>" width="50" height="50" alt="Waytoadmissions">
	      </a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark"><a href="#"> <?php echo $uploaded_by;?> </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate">Updated On - <?php echo $data_updated_on;?></div>
	  </div>
	  <div class="card-body">
	  	<?php
	  	$i=0;
	  	$f=0;
	  	foreach ($course_details_data as $key => $value) {

	  		if($value->course_data_type=='image'){
	  			?>
	  			<div class="row">
	  				<div class="col-lg-12" style="text-align:center;">
			  			<img src="<?php echo $value->course_data_value;?>" alt="<?php echo $slug_data->url_page_heading;?>">
			  		</div>
		  		</div>
	  			<?php
	  		}else if($value->course_data_type=='faqs'){
	  		?>
	  		<div id="accordionExample<?php echo $f;?>" class="accordion">
				<div class="card br-0">
					<a href="#" data-toggle="collapse" data-target="#collapse<?php echo $f;?>" aria-expanded="true" aria-controls="collapse<?php echo $f;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong><?php echo $value->course_data_heading;?></strong></a>
					<div id="collapse<?php echo $f;?>" data-parent="#accordionExample<?php echo $f;?>" class="collapse show">
						<div class="card-body">
							<p class="font-weight-light m-0"><strong></strong></p><p><?php echo $value->course_data_value;?></p>
						</div>
					</div>
				</div>
			</div>
	  		<?php
	  		$f++;
	  		}
	  		else{
	  			if($i==4){
	  				?>
	  				<div class="adBlock">
					    <div id="bodyslot_5" class="bodyslot bodyslot-dynamic clearfix" style="padding: 9px!important;margin-top: -11px!important;background: #f5f8f905!important;">
					      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9545373166119354"
					          crossorigin="anonymous"></script>
					      <!-- wayto_hz_1_ads -->
					      <ins class="adsbygoogle"
					          style="display:inline-block;width:728px;height:90px"
					          data-ad-client="ca-pub-9545373166119354"
					          data-ad-slot="7117741101" style="clear: both; display: flex;justify-content: center;margin-left:50px;margin-right:50px;"></ins>
					      <script>
					          (adsbygoogle = window.adsbygoogle || []).push({});
					      </script>
					    </div>
					</div>
	  				<?php
	  			}else{
					echo $value->course_data_value;
	  			}
	  			
	  		}

	  		$i++;
			
		}
	  	?>
	  </div>
	</div>
	<style>
		.card-header h5 {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        margin-bottom: 2px;
    }
	</style>
	<?php		
}
?>	