<?php
	if(!empty($fav_colleges)){
		if($chunk==TRUE){
			foreach ($fav_colleges as $key => $value) {
				?>
				<div class="row" style="margin-bottom: 10px;">
				<?php
				foreach ($value as $k => $v) {
					?>
					<div class="col-sm-6 col-md-6 col-lg-6 mt-2">
				        <a href="<?php echo $v['college_url'];?>" class="card featureReviewCard">
				          <div class="card-body d-flex align-items-center">
				            <div class="cardIcon" style="margin-top:-10px;"><div class="ico bg-blue-gradient"><img src="<?php echo $v['college_image'];?>" width="80px" height="80px"></div></div>
				            <div class="cardContent" style="padding-left:20px;">
				              <span>  <?php echo $v['college_name_formatted'];?>  </span><br>
				              <span> <?php echo $v['college_city'];?> </span>
				              <span> , <?php echo $v['fav_date'];?> </span>
				            </div>
				          </div>
				        </a>
				    </div>
					<?php
				}
				?>
				</div>
				<?php
			}
		}else{
			?>
			<div class="row" style="margin-bottom: 10px;">
			<?php
			foreach ($fav_colleges as $key => $v) {
				?>
				<div class="col-sm-6 col-md-6 col-lg-6 mt-2">
			        <a href="<?php echo $v['college_url'];?>" class="card featureReviewCard">
			          <div class="card-body d-flex align-items-center">
			            <div class="cardIcon"><div class="ico bg-blue-gradient"><img src="<?php echo $v['college_image'];?>" width="80px" height="80px"></div></div>
			            <div class="cardContent">
			              <span>  <?php echo $v['college_name_formatted'];?>  </span><br>
			              <span> <?php echo $v['college_city'];?> </span>
			              <span> , <?php echo $v['fav_date'];?> </span>
			            </div>
			          </div>
			        </a>
			    </div>
				<?php
			}
			?>
			</div>
			<?php
		}
		
	}else{
        ?>
        <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">No Favourite Colleges</h4>
            <p>You have not added any favourite colleges yet.</p>
        </div>
        <?php
    }
?>