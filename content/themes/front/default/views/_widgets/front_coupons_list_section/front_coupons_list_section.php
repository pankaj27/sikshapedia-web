<?php
if(!empty($coupons)){
	$i=1;
	foreach ($coupons as $key => $value) {
		if(in_array($i, array(8,14,24,44))){
			?>
			<div class="col-sm-6 col-md-4 col-lg-3">
				<div class="courdeBox">
				<?php $this->widget->run('front_google_ads_section',TRUE,'square');?>		
				</div>
			</div>
			<?php
			;
		}else{
			?>
		<div class="col-sm-6 col-md-4 col-lg-3">
            <div class="courdeBox">
                <a href="#" class="imgBox">
                    <img src="<?php echo $value['coupon_image'];?>" alt="<?php echo $value['coupon_title'];?>" style="max-width:100%;object-fit: scale-down;display: block;width:100%;">
                    <span class="infoIcon"><span><i class="fas fa-info"></i></span></span>
                    <?php
                    if($value['coupon_featured']=='Yes'){
                    	?>
                    	<span class="tag primary">Featured</span>
                    	<?php
                    }
                    ?>
                    
					<!--<span class="favorite active"></span> -->
              	</a>               
              	<div class="boxBody">
                	<h4 class="title"><?php echo $value['coupon_offer_text'];?></h4>
                 	<!--  <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> <small><b>3.0</b> (6520)</small></div> -->
                  	<div class="quick"><span><i class="fas fa-tag"></i> <?php echo $value['coupon_title'];?> </span> <span><i class="fa fa-clock-o"></i> </span> </div>
                  	<div class="update"><span><i class="fas fa-clock"></i>Grab it within: <?php echo $value['coupon_start_date'];?> - <?php echo $value['coupon_end_date'];?></span></div>
              	</div>
              	<div class="boxFooter">
                	<span class="rate"> <b class="off"> <?php echo $value['coupon_offer'];?></b> <span class="offer">OFFER</span>
					<?php echo $value['coupon_button_link'];?>
              	</div>
            </div>        
        </div>
		<?php
		}
		

		

		$i++;
	}
}

?>