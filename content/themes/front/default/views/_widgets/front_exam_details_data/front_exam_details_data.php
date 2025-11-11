<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
	if(!empty($cmenues)){
		?>
		<section class="commonSec" style="padding-top: 0px;padding-bottom: 0px;">
		    <div class="wrapper">		      
		      <div class="btnGroup text-left">
					<?php
					$menu_count=count($cmenues);
					$i=1;
					foreach ($cmenues as $key => $value) {
						if($i<6){
							?>
							<a href="<?php echo $value['menu_link'];?>" class="btn btn-xs btn-outline-orange btn-round mb-1" <?php echo $value['menu_selected'];?>><?php echo $value['menu_name'];?></a>
							<?php
						}else{
							?>
							<span class="read-more-content hide">
								<a href="<?php echo $value['menu_link'];?>" class="btn btn-xs btn-outline-orange btn-round mb-1" <?php echo $value['menu_selected'];?>><?php echo $value['menu_name'];?></a>
								<?php
								if($key===array_key_last($cmenues)){
									?>
									<a href="javascript::void(0);" class="read-more-hide hide">Show Less</a>
									<?php
								}
								?>								
							</span>
							<?php
						}

						$i++;
					}

					if($menu_count>6){
						?>
						<a href="javascript:void(0);" class="read-more-show">Show More</a>
						<?php
					}
					?>
			    </div>			    	
		    </div>
		</section> 
		<?php
	}
?>


<?php
	
if(!empty($exam_details_data)){
	?>
	<div class="card infoCard mb-4">
	  <div class="card-header bg-white d-sm-flex justify-content-between align-items-center">
	    <div class="media">
	      <a href="<?php echo base_url();?>" class="mr-3 " target="_blank">
	      	<img class="img-circle exam_uploaded_by_img" src="<?php echo $user_image;?>" width="50" height="50" alt="<?php echo $uploaded_by_alt;?>">
	      </a>
	      <div class="media-body">
	        <h5 class="mt-0 text-dark exam_uploaded_by"><a href="<?php echo base_url();?>" target="_blank"> <?php echo $uploaded_by;?> </a> </h5>
	        <p class="m-0">Content Curator 
	          <a href="#" class="text-info"><i class="fab fa-facebook"></i></a>
	          <a href="#"  class="text-info"><i class="fab fa-twitter"></i></a>
	          <a href="#" class="text-info"><i class="fab fa-linkedin-in"></i></a>
	        </p>
	      </div>
	    </div>
	    <div class="updateDate color2 exam_updateDate">Updated On - <?php echo $data_updated_on;?></div>
	  </div>
	  <div class="card-body">
	  	<?php
	  	$i=0;
	  	foreach ($exam_details_data as $key => $value) {

	  		if($value->exam_data_type=='image'){
	  			?>
	  			<div class="row">
	  				<div class="col-lg-12"  style="text-align:center;display: block;">
			  			<img src="<?php echo $value->exam_content;?>" alt="<?php echo $slug_data->url_page_heading;?>" class="img-thumbnail" style="border:none;">
			  		</div>
		  		</div>
	  			<?php
	  		}else if($value->exam_data_type=='youtube_video'){
	  			if(!empty($value->exam_content)){
	  				?>
		  			<div class="row">
		  				<div class="col-lg-12" style="text-align:center;display: block;">
		  					<iframe class="embed-responsive-item" width="640" height="360" title="" src="<?php echo $value->exam_content;?>" allowfullscreen></iframe>
				  		</div>
			  		</div>
		  			<?php
	  			}		  			
	  		}
	  		else{
	  			echo $value->exam_content;
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
	  				if($i==6){
	  					$this->widget->run('front_wayto_rating_section',FALSE);
	  				}
					
	  			}
	  			
	  		}

	  		$i++;
			
		}
	  	?>
	  </div>
	</div>
	<?php
			
}

$this->widget->run('front_google_ads_section',TRUE);

if(!empty($exam_faq_menu_details)){
	?>
	<h2><?php echo $exam_menu_faq_heading;?></h2>
	<div id="accordionExample1" class="accordion">
	<?php
	foreach ($exam_faq_menu_details as $key => $value) {
		if(!empty($value->exam_content) && !empty($key)){
			?>		
        <div class="card br-0">
          <a href="#" data-toggle="collapse" data-target="#collapse<?php echo $key;?>" aria-expanded="true" aria-controls="collapse<?php echo $key;?>" class="card-header d-block position-relative text-dark text-uppercase collapsible-link "><strong>Ques. <?php echo $value->exam_content_faq;?></strong></a>
          <div id="collapse<?php echo $key;?>" data-parent="#accordionExample1" class="collapse show">
            <div class="card-body">
              <p class="font-weight-light m-0"><?php echo $value->exam_content;?></p>
            </div>
          </div>
        </div>        
		<?php
		}
		
	}
	?>
	</div>
	<?php
}


?>

<style type="text/css">
	.card-body p, table{
		font-size: 1.2rem !important;
	}
	.media{
		margin-bottom: 0 !important;
	}
	.file-man-box {
	    padding: 20px;
	    border: 1px solid #e3eaef;
	    border-radius: 5px;
	    position: relative;
	    margin-bottom: 20px
	}

	.file-man-box .file-close {
	    color: #f1556c;
	    position: absolute;
	    line-height: 24px;
	    font-size: 24px;
	    right: 10px;
	    top: 10px;
	    visibility: hidden
	}

	.file-man-box .file-img-box {
	    line-height: 120px;
	    text-align: center
	}

	.file-man-box .file-img-box img {
	    height: 64px
	}

	.file-man-box .file-download {
	    font-size: 32px;
	    color: #98a6ad;
	    position: absolute;
	    right: 10px
	}

	.file-man-box .file-download:hover {
	    color: #313a46
	}

	.file-man-box .file-man-title {
	    padding-right: 25px
	}

	.file-man-box:hover {
	    -webkit-box-shadow: 0 0 24px 0 rgba(0, 0, 0, .06), 0 1px 0 0 rgba(0, 0, 0, .02);
	    box-shadow: 0 0 24px 0 rgba(0, 0, 0, .06), 0 1px 0 0 rgba(0, 0, 0, .02)
	}

	.file-man-box:hover .file-close {
	    visibility: visible
	}
	.text-overflow {
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
	    width: 100%;
	    overflow: hidden;
	}

	.hide {
	  display: none;
	}

	.btn-outline-orange{
		color: #f57b32;
    background-color: transparent;
    border-color: #f57b32;
	}

	.btn-outline-orange:hover{
		color: #fff;
    background-color: #f57b32;
    border-color: #f57b32;
    transition: 0.7s;
	}

	.btn-outline-orange:active{
		color: #fff;
    background-color: #f57b32;
    border-color: #f57b32;
	}

	.btn-outline-black{
		color: #3b3b3b;
    background-color: transparent;
    border-color: #3b3b3b;
	}

	.btn-outline-black:hover{
		color: #fff;
    background-color: #3b3b3b;
    border-color: #3b3b3b;
    transition: 0.7s;
	}

	.btn-outline-black:active{
		color: #fff;
    background-color: #3b3b3b;
    border-color: #3b3b3b;
	}
</style>